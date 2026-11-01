#!/usr/bin/env python3
"""Local BlocklyDuino upload adapter for the installed Arduino CLI."""
import functools
import http.server
import json
import os
import argparse
import shutil
from pathlib import Path
import subprocess
import tempfile
import threading
from urllib.parse import urlsplit, parse_qs, unquote
from blocklyduino_serial import SerialHub, SerialError
from blocklyduino_target import Targets, TargetError

ROOT = Path(__file__).resolve().parents[1]
CONFIG = Path(os.environ.get('XDG_CONFIG_HOME', Path.home() / '.config')) / 'blocklyduino/config.json'
CLI = shutil.which('arduino-cli') or 'arduino-cli'
ORIGINS = {'http://127.0.0.1:8080', 'http://localhost:8080'}
HOSTS = {'127.0.0.1:8080', 'localhost:8080'}
LOCK = threading.Lock()


def configuration():
    if not CONFIG.exists():
        return {'fqbn': 'arduino:avr:uno', 'port': ''}
    return json.loads(CONFIG.read_text())


SERIAL = SerialHub(CONFIG.with_name("serial.json"), lambda: configuration()["port"])
TARGETS = Targets(CLI, CONFIG)
LOCAL_ORIGINS = {"http://127.0.0.1:8080", "http://localhost:8080"}


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        origin = self.headers.get('Origin')
        if origin in ORIGINS:
            self.send_header('Access-Control-Allow-Origin', origin)
            self.send_header('Vary', 'Origin')
            self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.send_header('Access-Control-Allow-Private-Network', 'true')
        if urlsplit(self.path).path.startswith(('/serial/', '/target')):
            self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def allowed(self, mutation=False):
        if any(part.startswith('.') and part not in ('.', '..') for part in unquote(urlsplit(self.path).path).split('/')):
            self.send_error(404)
            return False
        origin = self.headers.get('Origin')
        if self.headers.get('Host') not in HOSTS or (origin and origin not in ORIGINS):
            self.send_error(403, 'Untrusted browser origin or hostname')
            return False
        if mutation and origin not in ORIGINS:
            self.send_error(403, 'An approved browser origin is required')
            return False
        return True

    def reply(self, status, text, mime='text/plain; charset=utf-8'):
        body = text.encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serial_allowed(self, mutation=False):
        origin = self.headers.get('Origin')
        if (origin and origin not in LOCAL_ORIGINS) or self.headers.get('Sec-Fetch-Site') == 'cross-site' or (mutation and origin not in LOCAL_ORIGINS):
            self.reply(403, json.dumps({'error': 'Serial access is limited to the local BlocklyDuino UI'}), 'application/json')
            return False
        return True

    def serial_get(self, path):
        if not self.serial_allowed():
            return
        try:
            if path == '/serial/status':
                result = SERIAL.status()
            elif path == '/serial/ports':
                result = SERIAL.ports()
            elif path == '/serial/events':
                args = parse_qs(urlsplit(self.path).query, keep_blank_values=True)
                values = args.get('after', ['0'])
                if len(values) != 1 or len(values[0]) > 20 or not values[0].isascii() or not values[0].isdigit():
                    raise SerialError('after must be a non-negative whole-number cursor')
                result = SERIAL.poll(int(values[0]))
            else:
                raise SerialError('Unknown serial endpoint', 404)
            self.reply(200, json.dumps(result), 'application/json')
        except SerialError as exc:
            self.reply(exc.status, json.dumps({'error': str(exc)}), 'application/json')

    def serial_post(self, path):
        if not self.serial_allowed(mutation=True):
            return
        try:
            if self.headers.get_content_type() != 'application/json':
                raise SerialError('Serial requests must use application/json', 415)
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 100000:
                raise SerialError('Serial JSON body must contain 1 to 100000 bytes')
            data = json.loads(self.rfile.read(size).decode('utf-8'))
            if not isinstance(data, dict):
                raise SerialError('Serial request must be a JSON object')
            if path == '/serial/connect':
                result = SERIAL.connect(data.get('port'), data.get('baud'))
            elif path == '/serial/disconnect':
                result = SERIAL.disconnect()
            elif path == '/serial/write':
                result = SERIAL.write(data.get('text'), data.get('ending', 'none'))
            else:
                raise SerialError('Unknown serial endpoint', 404)
            self.reply(200, json.dumps(result), 'application/json')
        except SerialError as exc:
            self.reply(exc.status, json.dumps({'error': str(exc)}), 'application/json')
        except (ValueError, UnicodeDecodeError) as exc:
            self.reply(400, json.dumps({'error': 'Invalid serial JSON request: ' + str(exc)}), 'application/json')

    def target_get(self, path):
        if not self.serial_allowed():
            return
        try:
            if path == '/target':
                result = TARGETS.current()
            elif path == '/target/boards':
                result = {'boards': TARGETS.boards()}
            elif path == '/target/details':
                args = parse_qs(urlsplit(self.path).query)
                result = TARGETS.details(args.get('fqbn', [''])[0])
            else:
                raise TargetError('Unknown target endpoint', 404)
            self.reply(200, json.dumps(result), 'application/json')
        except TargetError as e:
            self.reply(e.status, json.dumps({'error': str(e)}), 'application/json')

    def target_post(self):
        if not self.serial_allowed(mutation=True):
            return
        if not LOCK.acquire(blocking=False):
            self.reply(409, json.dumps({'error':'A build or upload is running. Try again when it finishes.'}), 'application/json')
            return
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if self.headers.get_content_type() != 'application/json' or not 0 < size <= 8192:
                raise TargetError('Expected a small JSON target configuration.')
            result = TARGETS.save(json.loads(self.rfile.read(size).decode('utf-8')))
            self.reply(200, json.dumps(result), 'application/json')
        except TargetError as e:
            self.reply(e.status, json.dumps({'error': str(e)}), 'application/json')
        except (ValueError, OSError) as e:
            self.reply(400, json.dumps({'error': str(e)}), 'application/json')
        finally:
            LOCK.release()

    def do_OPTIONS(self):
        if self.allowed(mutation=True) and (not urlsplit(self.path).path.startswith('/serial/') or self.serial_allowed(mutation=True)):
            self.send_response(204)
            self.end_headers()

    def do_HEAD(self):
        if self.allowed():
            super().do_HEAD()

    def do_GET(self):
        if not self.allowed():
            return
        path = urlsplit(self.path).path
        if path.startswith('/target'):
            self.target_get(path)
        elif path.startswith('/serial/'):
            self.serial_get(path)
        elif path == '/':
            self.send_response(302)
            self.send_header('Location', '/blockly/apps/blocklyduino/index.html')
            self.end_headers()
        elif path == '/health':
            config = configuration()
            port = config['port']
            self.reply(200, json.dumps({'service': 'BlocklyDuino',
                'board': config['fqbn'], 'port': port,
                'port_present': bool(port) and Path(port).exists(),
                'port_read_write': bool(port) and os.access(port, os.R_OK | os.W_OK)}), 'application/json')
        else:
            super().do_GET()

    def do_POST(self):
        if not self.allowed(mutation=True):
            return
        path = urlsplit(self.path).path
        if path.startswith('/serial/'):
            self.serial_post(path)
            return
        if path == '/target':
            self.target_post()
            return
        if path not in ('/', '/compile'):
            self.send_error(404)
            return
        try:
            size = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            self.send_error(400, 'Invalid content length')
            return
        if not 0 < size <= 1024 * 1024:
            self.send_error(400, 'Sketch must contain 1 to 1048576 bytes')
            return
        try:
            code = self.rfile.read(size).decode('utf-8')
        except UnicodeDecodeError:
            self.send_error(400, 'Sketch must be UTF-8')
            return
        if not LOCK.acquire(blocking=False):
            self.reply(409, 'A compile or upload is already running')
            return
        try:
            config = configuration()
            if path == '/' and config.get('port') and config['port'].startswith('/dev/') and not os.access(config['port'], os.R_OK | os.W_OK):
                self.reply(500, 'Arduino port is disconnected or inaccessible')
                return
            with tempfile.TemporaryDirectory(prefix='blocklyduino-') as tmp:
                sketch = Path(tmp) / 'sketch'
                sketch.mkdir()
                (sketch / 'sketch.ino').write_text(code + '\n')
                build = Path(tmp) / 'build'
                # Explicit libraries outrank older sketchbook copies, including
                # an old architecture-specific copy of a portable bundled library.
                bundled = [arg for folder in sorted((ROOT / 'arduino/libraries').iterdir())
                           if (folder / 'library.properties').is_file()
                           for arg in ('--library', str(folder))]
                result = subprocess.run([str(CLI), 'compile', '--fqbn', config['fqbn'],
                    *bundled,
                    '--build-path', str(build), str(sketch)],
                    capture_output=True, text=True, timeout=120)
                if result.returncode:
                    self.reply(400, (result.stdout + result.stderr)[-24000:])
                    return
                if path == '/compile':
                    self.reply(200, 'COMPILE_OK; target=' + config['fqbn'] + '\n' + result.stdout)
                    return
                with SERIAL.upload_lease():
                    result = subprocess.run([str(CLI), 'upload', '--fqbn', config['fqbn'],
                        *(['--port', config['port']] if config.get('port') else []), '--input-dir', str(build), '--verify'],
                        capture_output=True, text=True, timeout=45)
                self.reply(200 if result.returncode == 0 else 500,
                    (result.stdout + result.stderr)[-24000:] or 'Program uploaded OK')
        except SerialError as error:
            self.reply(error.status, str(error))
        except subprocess.TimeoutExpired:
            self.reply(500, 'Timed out; close other serial monitors and check the board/processor selection')
        except (OSError, KeyError, ValueError) as error:
            self.reply(500, 'Local Arduino configuration error: ' + str(error))
        finally:
            LOCK.release()


def main():
    global ROOT, CONFIG, CLI, ORIGINS, LOCAL_ORIGINS, HOSTS, SERIAL, TARGETS
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8080, help='HTTP port (default: 8080)')
    parser.add_argument('--root', type=Path, default=ROOT, help='Repository root')
    parser.add_argument('--config', type=Path, default=CONFIG, help='Private target settings file')
    parser.add_argument('--cli', default=CLI, help='Arduino CLI executable')
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('port must be between 1 and 65535')
    ROOT, CONFIG, CLI = args.root.resolve(), args.config.expanduser().resolve(), args.cli
    if not (ROOT / 'blockly/apps/blocklyduino/index.html').is_file():
        parser.error('--root must contain blockly/apps/blocklyduino/index.html')
    CONFIG.parent.mkdir(parents=True, exist_ok=True)
    if not CONFIG.exists():
        with CONFIG.open('x') as handle:
            json.dump({'fqbn': 'arduino:avr:uno', 'port': ''}, handle)
    HOSTS = {f'127.0.0.1:{args.port}', f'localhost:{args.port}'}
    ORIGINS = LOCAL_ORIGINS = {'http://' + host for host in HOSTS}
    SERIAL = SerialHub(CONFIG.with_name('serial.json'), lambda: configuration()['port'])
    TARGETS = Targets(CLI, CONFIG)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', args.port),
        functools.partial(Handler, directory=str(ROOT)))
    print(f'BlocklyDuino: http://127.0.0.1:{args.port}/blockly/apps/blocklyduino/', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        SERIAL.disconnect()
        server.server_close()


if __name__ == '__main__':
    main()
