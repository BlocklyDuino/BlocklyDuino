"""One local serial connection with bounded, independently replayable event cursors."""
import codecs
from collections import deque
from contextlib import contextmanager
import json
import os
from pathlib import Path
import stat
import threading
import time
import uuid

import serial
from serial.tools import list_ports


class SerialError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


class SerialHub:
    MAX_WRITE = 16384
    MAX_RESPONSE_BYTES = 262144
    MAX_RESPONSE_EVENTS = 1024

    def __init__(self, config_path, default_port, *, allowed_test_ports=(),
                 max_events=8192, max_bytes=4 * 1024 * 1024):
        self.config_path = Path(config_path)
        self.default_port = default_port
        self.allowed_test_ports = set(allowed_test_ports)
        self.max_events = max_events
        self.max_bytes = max_bytes
        self.lock = threading.RLock()
        self.events = deque()
        self.event_bytes = 0
        self.seq = 0
        self.session_id = uuid.uuid4().hex
        self.connection = None
        self.reader = None
        self.error = None
        self.uploading = False
        self.resume = None
        self.port = self._default_port()
        self.baud = 9600
        try:
            saved = json.loads(self.config_path.read_text())
            if isinstance(saved.get('port'), str):
                self.port = saved['port']
            self.baud = self._baud(saved.get('baud', 9600))
        except (OSError, ValueError, TypeError, SerialError):
            pass

    def _default_port(self):
        try:
            return self.default_port() if callable(self.default_port) else self.default_port
        except (OSError, ValueError, KeyError):
            return ''

    @staticmethod
    def _baud(value):
        if type(value) is not int or not 1 <= value <= 4000000:
            raise SerialError('Baud rate must be a whole number from 1 to 4000000')
        return value

    def ports(self):
        found = {}
        for entry in list_ports.comports(include_links=True):
            found[entry.device] = {'path': entry.device,
                                   'label': entry.description or entry.device}
        for path in (self._default_port(), self.port):
            if path and path not in found:
                found[path] = {'path': path,
                               'label': 'Saved port' + ('' if Path(path).exists() else ' (disconnected)')}
        with self.lock:
            return {'ports': sorted(found.values(), key=lambda item: item['path']),
                    'default_port': self.port or self._default_port(), 'baud': self.baud}

    def _validate_port(self, port):
        if not isinstance(port, str) or not port or len(port) > 1024:
            raise SerialError('Choose an available serial port')
        allowed = {entry.device for entry in list_ports.comports(include_links=True)}
        allowed.update(self.allowed_test_ports)
        configured = self._default_port()
        if configured:
            allowed.add(configured)
        # Saved state is a preference, not authority to open an arbitrary path.
        if port not in allowed:
            raise SerialError('Port is not a discovered serial device or the configured Arduino port')
        try:
            if not stat.S_ISCHR(os.stat(port).st_mode):
                raise SerialError('Serial port must be a character device')
        except OSError as exc:
            raise SerialError('Serial port is disconnected or inaccessible: ' + str(exc), 503)

    def _save(self):
        self.config_path.parent.mkdir(parents=True, exist_ok=True)
        temporary = self.config_path.with_suffix('.tmp')
        with open(temporary, 'w', encoding='utf-8') as stream:
            json.dump({'port': self.port, 'baud': self.baud}, stream)
            stream.write('\n')
        os.chmod(temporary, 0o600)
        temporary.replace(self.config_path)

    def _event(self, direction, text):
        if not text:
            return
        self.seq += 1
        event = {'seq': self.seq, 'ts': int(time.time() * 1000),
                 'direction': direction, 'text': text}
        size = len(text.encode('utf-8')) + 96
        self.events.append((event, size))
        self.event_bytes += size
        while self.events and (len(self.events) > self.max_events or self.event_bytes > self.max_bytes):
            _, removed = self.events.popleft()
            self.event_bytes -= removed

    def _state(self):
        return {'connected': self.connection is not None and self.connection.is_open,
                'port': self.port, 'baud': self.baud, 'error': self.error,
                'seq': self.seq, 'oldest_seq': self.events[0][0]['seq'] if self.events else self.seq + 1,
                'uploading': self.uploading, 'session_id': self.session_id}

    def status(self):
        with self.lock:
            return self._state()

    def poll(self, after=0):
        if type(after) is not int or after < 0:
            raise SerialError('after must be a non-negative whole-number cursor')
        with self.lock:
            result = self._state()
            reset = after > self.seq
            if reset:
                after = 0
            oldest = result['oldest_seq']
            dropped = max(0, oldest - after - 1)
            selected, size = [], 0
            for event, event_size in self.events:
                if event['seq'] <= after:
                    continue
                if selected and (size + event_size > self.MAX_RESPONSE_BYTES or len(selected) >= self.MAX_RESPONSE_EVENTS):
                    break
                selected.append(dict(event))
                size += event_size
            cursor = selected[-1]['seq'] if selected else self.seq
            result.update(events=selected, latest_seq=self.seq, seq=cursor,
                          dropped=dropped, reset=reset, has_more=cursor < self.seq)
            return result

    def _close(self, message=None):
        connection, self.connection = self.connection, None
        if connection is not None:
            try:
                connection.close()
            except (OSError, serial.SerialException):
                pass
        if message:
            self._event('system', message + '\n')

    def _open(self, port, baud, persist=True):
        self._validate_port(port)
        baud = self._baud(baud)
        if self.connection is not None and self.port == port and self.baud == baud:
            return
        self._close()
        try:
            connection = serial.Serial(port=port, baudrate=baud, timeout=0.1,
                                       write_timeout=1, exclusive=True)
        except (serial.SerialException, OSError, ValueError) as exc:
            self.error = str(exc)
            self._event('system', 'Serial connection failed: ' + self.error + '\n')
            raise SerialError(self.error, 503)
        self.connection = connection
        self.port, self.baud, self.error = port, baud, None
        if persist:
            try:
                self._save()
            except OSError as exc:
                self._event('system', 'Connected, but settings could not be saved: ' + str(exc) + '\n')
        self._event('system', 'Connected to ' + port + ' at ' + str(baud) + ' baud (8N1)\n')
        self.reader = threading.Thread(target=self._read, args=(connection,), daemon=True,
                                       name='blocklyduino-serial')
        self.reader.start()

    def connect(self, port, baud):
        with self.lock:
            if self.uploading:
                raise SerialError('An upload is using the port; wait until it finishes', 409)
            self._open(port, baud)
            return self._state()

    def disconnect(self):
        with self.lock:
            self.resume = None
            self._close('Disconnected by a serial viewer')
            self.error = None
            return self._state()

    def _read(self, connection):
        decoder = codecs.getincrementaldecoder('utf-8')(errors='replace')
        try:
            while True:
                with self.lock:
                    if self.connection is not connection:
                        return
                data = connection.read(max(1, min(connection.in_waiting, 4096)))
                if not data:
                    continue
                text = decoder.decode(data)
                if text:
                    with self.lock:
                        if self.connection is not connection:
                            return
                        self._event('rx', text)
        except (serial.SerialException, OSError, TypeError) as exc:
            with self.lock:
                if self.connection is connection:
                    tail = decoder.decode(b'', final=True)
                    if tail:
                        self._event('rx', tail)
                    self.error = str(exc)
                    self._close('Serial disconnected: ' + self.error)

    def write(self, text, ending='none'):
        suffixes = {'none': '', 'lf': '\n', 'cr': '\r', 'crlf': '\r\n'}
        if not isinstance(text, str) or not isinstance(ending, str) or ending not in suffixes:
            raise SerialError('Provide text and an ending: none, lf, cr or crlf')
        try:
            data = (text + suffixes[ending]).encode('utf-8')
        except UnicodeEncodeError:
            raise SerialError('Text contains an invalid Unicode character')
        if not 1 <= len(data) <= self.MAX_WRITE:
            raise SerialError('A send must contain 1 to 16384 UTF-8 bytes')
        with self.lock:
            if self.uploading:
                raise SerialError('Serial is paused while uploading', 409)
            if self.connection is None:
                raise SerialError('Connect to a serial port first', 409)
            try:
                count = self.connection.write(data)
                if count != len(data):
                    raise serial.SerialTimeoutException('Only part of the message was sent')
            except (OSError, serial.SerialException) as exc:
                self.error = str(exc)
                self._close('Serial send failed: ' + self.error)
                raise SerialError(self.error, 503)
            self._event('tx', data.decode('utf-8'))
            result = self._state()
            result['written'] = count
            return result

    @contextmanager
    def upload_lease(self):
        """Release the serial fd for avrdude, then restore the previous connection once."""
        with self.lock:
            if self.uploading:
                raise SerialError('An upload is already running', 409)
            self.uploading = True
            self.resume = (self.port, self.baud) if self.connection is not None else None
            self._close('Serial paused for upload')
        try:
            yield
        finally:
            with self.lock:
                resume, self.resume = self.resume, None
                self.uploading = False
                if resume:
                    try:
                        self._open(*resume, persist=False)
                    except SerialError as exc:
                        self.error = str(exc)
                        self._event('system', 'Upload ended; serial reconnect failed: ' + str(exc) + '\n')
                else:
                    self._event('system', 'Upload ended; serial remains disconnected\n')
