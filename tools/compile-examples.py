#!/usr/bin/env python3
"""Compile generated numbered examples; never connects to or uploads a board."""
import argparse, hashlib, json, os, re, subprocess
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--cli',default='arduino-cli')
p.add_argument('--fqbn',default='arduino:avr:pro:cpu=16MHzatmega328')
p.add_argument('--examples',nargs='*',help='Optional example filename prefixes')
a=p.parse_args(); root=Path(__file__).resolve().parents[1]; os.chdir(root)
subprocess.run(['node','tests/variables-validation/integration.js'],check=True,env={**os.environ,'GENERATE_SKETCHES':'1'})
results=[]
bundled=[arg for folder in sorted((root/'arduino/libraries').iterdir()) if (folder/'library.properties').is_file() for arg in ('--library',str(folder))]
active={re.sub(r'[^a-zA-Z0-9_]', '_', p.name) for p in (root/'blockly/apps/blocklyduino/examples').glob('[0-9]*.xml')}
for sketch in sorted((root/'.test-build/sketches').iterdir()):
 if sketch.name not in active: continue
 if a.examples and not any(sketch.name.startswith(x) for x in a.examples): continue
 cmd=[a.cli,'compile','--fqbn',a.fqbn,*bundled,str(sketch)]
 r=subprocess.run(cmd,capture_output=True,text=True,timeout=180)
 (sketch/'build.log').write_text(r.stdout+r.stderr)
 result={'example':sketch.name,'ok':r.returncode==0,
         'sketchSha256':hashlib.sha256((sketch/(sketch.name+'.ino')).read_bytes()).hexdigest()}
 for pattern,used,limit in [(r'Sketch uses (\d+) bytes[^\n]*Maximum is (\d+) bytes','flash','flashLimit'),
                            (r'Global variables use (\d+) bytes[^\n]*Maximum is (\d+) bytes','staticRam','staticRamLimit')]:
  match=re.search(pattern,r.stdout+r.stderr)
  if match:result[used],result[limit]=map(int,match.groups())
 if 'flash' in result and 'staticRam' in result:
  result['flashRemaining']=result['flashLimit']-result['flash'];result['ramRemaining']=result['staticRamLimit']-result['staticRam']
  result['classification']='failed' if not result['ok'] else 'tight' if result['flashRemaining']<1024 or result['ramRemaining']<256 else 'fits'
 results.append(result); print(('PASS ' if result['ok'] else 'FAIL ')+sketch.name,flush=True)
 if not result['ok']: print((r.stdout+r.stderr)[-3000:])
(root/'.test-build/compile-results.json').write_text(json.dumps({'fqbn':a.fqbn,'results':results},indent=2))
if a.fqbn=='arduino:avr:pro:cpu=16MHzatmega168':
 audit=root/'.test-build/compile-audit-atmega168.json';previous={}
 if a.examples and audit.exists():
  for row in json.loads(audit.read_text()).get('results',[]):
   source=root/'.test-build/sketches'/row['example']/(row['example']+'.ino')
   if row['example'] in active and source.exists() and hashlib.sha256(source.read_bytes()).hexdigest()==row.get('sketchSha256'):previous[row['example']]=row
 previous.update({row['example']:row for row in results})
 audit.write_text(json.dumps({'fqbn':a.fqbn,'results':sorted(previous.values(),key=lambda row:row['example'])},indent=2))
if not results: raise SystemExit('No matching examples')
raise SystemExit(0 if all(x['ok'] for x in results) else 1)
