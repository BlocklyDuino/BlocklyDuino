"""First-run and relocatable HTTP-origin regression checks (no device access)."""
import json
from pathlib import Path
import socket
import subprocess
import sys
import tempfile
import time
import unittest
import urllib.request
import urllib.error


class StartupTests(unittest.TestCase):
    def test_clean_configuration_custom_port_and_private_paths(self):
        root = Path(__file__).resolve().parents[2]
        with socket.socket() as sock:
            sock.bind(('127.0.0.1', 0))
            port = sock.getsockname()[1]
        with tempfile.TemporaryDirectory() as tmp:
            config = Path(tmp) / 'new/settings.json'
            process = subprocess.Popen([sys.executable, str(root/'server/blocklyduino-server.py'),
                '--config', str(config), '--port', str(port), '--root', str(root)],
                cwd=tmp, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            origin = f'http://127.0.0.1:{port}'
            try:
                for attempt in range(40):
                    if process.poll() is not None:
                        self.fail('Server exited during clean startup')
                    try:
                        with urllib.request.urlopen(origin+'/health', timeout=1) as r:
                            health=json.load(r)
                        break
                    except (OSError, urllib.error.URLError):
                        time.sleep(.05)
                else:
                    self.fail('Server did not start')
                self.assertEqual(json.loads(config.read_text()), {'fqbn':'arduino:avr:uno','port':''})
                self.assertFalse(health['port_present'])
                with urllib.request.urlopen(origin+'/') as r:
                    self.assertIn(b'<title>BlocklyDuino</title>',r.read())
                for path in ('/.git/config','/%2egit/config','/.runtime/private.json'):
                    with self.assertRaises(urllib.error.HTTPError) as error:
                        urllib.request.urlopen(origin+path)
                    self.assertEqual(error.exception.code,404)
                request=urllib.request.Request(origin+'/serial/disconnect',data=b'{}',headers={
                    'Origin':origin,'Content-Type':'application/json'})
                with urllib.request.urlopen(request) as r:
                    self.assertEqual(r.status,200)
                request=urllib.request.Request(origin+'/serial/disconnect',data=b'{}',headers={
                    'Origin':'https://example.org','Content-Type':'application/json'})
                with self.assertRaises(urllib.error.HTTPError) as error:
                    urllib.request.urlopen(request)
                self.assertEqual(error.exception.code,403)
            finally:
                process.terminate()
                process.wait(timeout=5)


if __name__ == '__main__':
    unittest.main()
