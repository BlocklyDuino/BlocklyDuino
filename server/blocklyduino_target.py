"""Installed Arduino board menus and atomically saved build/upload target."""
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import time


class TargetError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


class Targets:
    def __init__(self, cli, config):
        self.cli, self.config = str(cli), Path(config)
        self.cache = {}

    def run(self, args):
        try:
            p = subprocess.run([self.cli] + args + ['--format', 'json'], capture_output=True, text=True, timeout=25)
            if p.returncode:
                raise TargetError((p.stderr or p.stdout)[-2000:], 400)
            return json.loads(p.stdout)
        except subprocess.TimeoutExpired:
            raise TargetError('Arduino CLI did not answer within 25 seconds.', 503)
        except (OSError, ValueError) as e:
            raise TargetError('Cannot read installed Arduino boards: ' + str(e), 503)

    def boards(self):
        key = 'boards'
        old = self.cache.get(key)
        if not old or time.monotonic() - old[0] > 60:
            data = self.run(['board', 'listall'])
            value = sorted([{'fqbn': b['fqbn'], 'name': b['name']} for b in data.get('boards', []) if b.get('fqbn')], key=lambda x: x['name'].lower())
            self.cache[key] = (time.monotonic(), value)
        return self.cache[key][1]

    def details(self, fqbn):
        if not isinstance(fqbn, str) or len(fqbn) > 2048:
            raise TargetError('Choose an installed board.')
        base = ':'.join(fqbn.split(':')[:3])
        if not any(x['fqbn'] == base for x in self.boards()):
            raise TargetError('This board core is not installed.')
        key = 'details:' + base
        old = self.cache.get(key)
        if not old or time.monotonic() - old[0] > 60:
            data = self.run(['board', 'details', '--fqbn', base])
            self.cache[key] = (time.monotonic(), {'fqbn': base, 'name': data['name'], 'options': data.get('config_options', [])})
        return self.cache[key][1]

    def validate(self, fqbn, port):
        d = self.details(fqbn)
        parts = fqbn.split(':')
        if len(parts) not in (3, 4):
            raise TargetError('Invalid board options.')
        values = {}
        valid = {o['option']: {v['value'] for v in o['values']} for o in d['options']}
        if len(parts) == 4 and parts[3]:
            for item in parts[3].split(','):
                k, sep, v = item.partition('=')
                if not sep or k in values or k not in valid or v not in valid[k]:
                    raise TargetError('Invalid or duplicate board option: ' + k)
                values[k] = v
        if not isinstance(port, str) or len(port) > 512 or any(ord(c) < 32 for c in port) or port.startswith('-'):
            raise TargetError('Invalid upload port.')
        # Serial device paths, network addresses and empty auto/USB target only.
        if port and not re.fullmatch(r'[/A-Za-z0-9_.:@+%=-]+', port):
            raise TargetError('Invalid upload port characters.')
        return {'fqbn': d['fqbn'] + (':' + ','.join(k+'='+values[k] for k in sorted(values)) if values else ''), 'port': port}

    def current(self):
        data = json.loads(self.config.read_text())
        d = self.details(data['fqbn'])
        return {'fqbn': data['fqbn'], 'port': data.get('port', ''), 'name': d['name']}

    def save(self, data):
        if not isinstance(data, dict):
            raise TargetError('Expected a JSON object.')
        new = self.validate(data.get('fqbn'), data.get('port', ''))
        old = json.loads(self.config.read_text())
        old.update(new)
        name = None
        try:
            with tempfile.NamedTemporaryFile(mode='w', dir=self.config.parent, prefix='.target-', delete=False) as f:
                name = f.name
                json.dump(old, f, indent=2)
                f.write('\n'); f.flush(); os.fsync(f.fileno())
            os.chmod(name, 0o600)
            os.replace(name, self.config)
        finally:
            if name and os.path.exists(name):
                os.unlink(name)
        return self.current()
