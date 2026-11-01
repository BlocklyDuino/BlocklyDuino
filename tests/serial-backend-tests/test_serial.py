import importlib.util
import json
import os
from pathlib import Path
import pty
import select
import sys
import tempfile
import threading
import time
import unittest
import urllib.request
import urllib.error
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'server'))
from blocklyduino_serial import SerialHub, SerialError
spec=importlib.util.spec_from_file_location('server', str(Path(__file__).resolve().parents[2] / 'server/blocklyduino-server.py'))
server=importlib.util.module_from_spec(spec); spec.loader.exec_module(server)


def until(fn, timeout=2):
    end=time.monotonic()+timeout
    while time.monotonic()<end:
        result=fn()
        if result: return result
        time.sleep(.01)
    raise AssertionError('Timed out waiting for PTY evidence')


class BackendTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.master,self.slave=pty.openpty()
        self.port=os.ttyname(self.slave)
        self.config=Path(self.temp.name)/'serial.json'
        self.hub=SerialHub(self.config, '', allowed_test_ports=[self.port])
    def tearDown(self):
        self.hub.disconnect(); os.close(self.master); os.close(self.slave);self.temp.cleanup()
    def rx(self):
        return ''.join(e['text'] for e in self.hub.poll()['events'] if e['direction']=='rx')
    def test_passive_status_and_persistence(self):
        self.assertFalse(self.hub.status()['connected'])
        self.assertFalse(self.hub.poll()['connected'])
        self.hub.connect(self.port, 19200)
        self.assertEqual(json.loads(self.config.read_text()), {'port':self.port,'baud':19200})
        second=SerialHub(self.config, '', allowed_test_ports=[self.port])
        self.assertFalse(second.status()['connected']);self.assertEqual(second.status()['baud'],19200)
    def test_dual_readers_and_utf8_fragmentation(self):
        self.hub.connect(self.port,115200); start=self.hub.status()['seq']
        encoded='temp:23.5\tlabel:ąžuolas\r\n'.encode()
        for byte in encoded:os.write(self.master,bytes([byte]));time.sleep(.002)
        until(lambda:self.rx().endswith('\n'))
        first=self.hub.poll(start);second=self.hub.poll(start)
        self.assertEqual(first['events'],second['events']);self.assertEqual(self.rx(),encoded.decode())
        self.assertEqual(self.hub.poll(first['seq'])['events'],[])
    def test_write_endings_and_validation(self):
        self.hub.connect(self.port,9600)
        for ending,suffix in [('none',''),('lf','\n'),('cr','\r'),('crlf','\r\n')]:
            result=self.hub.write('ž',ending)
            self.assertTrue(select.select([self.master],[],[],1)[0])
            self.assertEqual(os.read(self.master,100),('ž'+suffix).encode())
            self.assertEqual(result['written'],len(('ž'+suffix).encode()))
        for text,ending in [(None,'none'),('x',[]),('x','invalid'),('','none'),('x'*16385,'none')]:
            with self.assertRaises(SerialError):self.hub.write(text,ending)
    def test_port_and_baud_validation(self):
        for port,baud in [('/etc/passwd',9600),(self.port,False),(self.port,0),(self.port,4_000_001),(self.port,9600.5)]:
            with self.assertRaises(SerialError):self.hub.connect(port,baud)
        arbitrary=Path(self.temp.name)/'file';arbitrary.write_text('unchanged')
        self.hub.allowed_test_ports.add(str(arbitrary))
        with self.assertRaises(SerialError):self.hub.connect(str(arbitrary),9600)
        self.assertEqual(arbitrary.read_text(),'unchanged')
    def test_upload_lease_release_restore_cancel(self):
        self.hub.connect(self.port,38400)
        with self.hub.upload_lease():
            self.assertFalse(self.hub.status()['connected']);self.assertTrue(self.hub.status()['uploading'])
            with self.assertRaises(SerialError):self.hub.write('no')
            with self.assertRaises(SerialError):self.hub.connect(self.port,9600)
            # The serial fd really is released, not only hidden in status.
            import serial
            other=serial.Serial(self.port,9600,exclusive=True);other.close()
        self.assertTrue(self.hub.status()['connected']);self.assertEqual(self.hub.status()['baud'],38400)
        try:
            with self.hub.upload_lease(): raise RuntimeError('upload failed')
        except RuntimeError:pass
        self.assertTrue(self.hub.status()['connected'])
        with self.hub.upload_lease():self.hub.disconnect()
        self.assertFalse(self.hub.status()['connected'])
    def test_disconnect_and_unplug_no_retry(self):
        self.hub.connect(self.port,9600)
        os.close(self.master);self.master=os.open('/dev/null',os.O_RDONLY)
        until(lambda:not self.hub.status()['connected'])
        self.assertTrue(self.hub.status()['error'])
        before=self.hub.status()['seq'];time.sleep(.15)
        self.assertEqual(self.hub.status()['seq'],before)
    def test_ring_bounds_cursors_and_reset(self):
        self.hub.max_events=3
        with self.hub.lock:
            for i in range(10):self.hub._event('rx',str(i))
        one=self.hub.poll(1);self.assertEqual(one['dropped'],6);self.assertEqual(one['oldest_seq'],8)
        self.hub.MAX_RESPONSE_EVENTS=1
        batch=self.hub.poll(7);self.assertEqual(batch['seq'],8);self.assertTrue(batch['has_more'])
        self.assertEqual(self.hub.poll(8)['seq'],9)
        self.assertTrue(self.hub.poll(1000)['reset'])
        self.hub.max_bytes=110
        with self.hub.lock:self.hub._event('rx','x'*20)
        self.assertLessEqual(self.hub.event_bytes,110)
    def test_two_pollers_during_stream(self):
        self.hub.connect(self.port,115200);cursor=self.hub.status()['seq'];outputs=[[],[]]
        def read(index):
            after=cursor
            end=time.monotonic()+3
            while time.monotonic()<end:
                result=self.hub.poll(after);after=result['seq']
                outputs[index].extend(e['text'] for e in result['events'] if e['direction']=='rx')
                if ''.join(outputs[index]).endswith('END\n'):return
                time.sleep(.004)
        threads=[threading.Thread(target=read,args=(i,)) for i in range(2)]
        for thread in threads:thread.start()
        expected=''.join(f'{i},{i*2}\n' for i in range(500))+'END\n'
        os.write(self.master,expected.encode())
        for thread in threads:thread.join(4)
        self.assertEqual(''.join(outputs[0]),expected);self.assertEqual(outputs[0],outputs[1])


class HTTPTests(BackendTests):
    def setUp(self):
        super().setUp()
        server.SERIAL=self.hub
        server.configuration=lambda:{'port':self.port,'fqbn':'arduino:avr:pro:cpu=16MHzatmega168'}
        class QuietHandler(server.Handler):
            def log_message(self,*args):pass
        self.http=server.http.server.ThreadingHTTPServer(('127.0.0.1',0),QuietHandler)
        self.http_thread=threading.Thread(target=self.http.serve_forever,daemon=True);self.http_thread.start()
    def tearDown(self):
        self.http.shutdown();self.http.server_close();super().tearDown()
    def request(self,path,body=None,origin='http://127.0.0.1:8080',mime='application/json'):
        headers={'Host':'127.0.0.1:8080'}
        if origin:headers['Origin']=origin
        if body is not None:
            headers['Content-Type']=mime
            if not isinstance(body,bytes):body=json.dumps(body).encode()
        req=urllib.request.Request(f'http://127.0.0.1:{self.http.server_port}'+path,data=body,headers=headers)
        try:
            with urllib.request.urlopen(req,timeout=3) as response:return response.status,response.read()
        except urllib.error.HTTPError as exc:return exc.code,exc.read()
    def test_http_contract_and_origin(self):
        code,body=self.request('/serial/status');self.assertEqual(code,200);self.assertFalse(json.loads(body)['connected'])
        for endpoint in ['/serial/status','/serial/ports','/serial/events']:
            self.assertEqual(self.request(endpoint,origin='https://blocklyduino.github.io')[0],403)
        self.assertEqual(self.request('/serial/connect',{'port':self.port,'baud':9600},origin=None)[0],403)
        self.assertEqual(self.request('/serial/connect',{'port':self.port,'baud':9600})[0],200)
        self.assertEqual(self.request('/serial/write',{'text':'ok','ending':'lf'})[0],200)
        self.assertEqual(os.read(self.master,100),b'ok\n')
        os.write(self.master,b'12,34\n');until(lambda:self.rx().endswith('\n'))
        result=json.loads(self.request('/serial/events?after=0')[1]);self.assertTrue(result['connected'])
        self.assertEqual(''.join(e['text'] for e in result['events'] if e['direction']=='rx'),'12,34\n')
        self.assertEqual(self.request('/serial/disconnect',{})[0],200)
    def test_http_bad_requests(self):
        for path in ['/serial/events?after=-1','/serial/events?after=x','/serial/events?after=1&after=2','/serial/events?after='+'9'*5000]:
            self.assertEqual(self.request(path)[0],400)
        for payload in [[],{'text':'x','ending':[]},{'text':'x','ending':{}}, {'text':None}]:
            self.assertEqual(self.request('/serial/write',payload)[0],400)
        self.assertEqual(self.request('/serial/write',b'{')[0],400)
        self.assertEqual(self.request('/serial/write',b'x',mime='text/plain')[0],415)
        self.assertEqual(self.request('/serial/nope')[0],404)
    def test_http_compile_upload_arbitration(self):
        self.hub.connect(self.port,57600)
        seen=[]
        def command(args,**kwargs):
            kind=args[1];seen.append((kind,self.hub.status()['connected'],self.hub.status()['uploading']))
            return mock.Mock(returncode=0,stdout='OK',stderr='')
        with mock.patch.object(server.subprocess,'run',side_effect=command):
            self.assertEqual(self.request('/compile',b'void setup(){} void loop(){}',mime='text/plain')[0],200)
            until(lambda:not server.LOCK.locked())
            self.assertEqual(self.request('/',b'void setup(){} void loop(){}',mime='text/plain')[0],200)
        self.assertEqual(seen,[('compile',True,False),('compile',True,False),('upload',False,True)])
        self.assertTrue(self.hub.status()['connected'])

if __name__=='__main__':unittest.main(verbosity=2)
