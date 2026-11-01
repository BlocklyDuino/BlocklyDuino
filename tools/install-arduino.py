#!/usr/bin/env python3
"""Install versioned core/library dependencies. Does not upload to hardware."""
import argparse, json, subprocess
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--cli', default='arduino-cli')
p.add_argument('--cores', nargs='+', choices=['avr','rp2040','stm32'], default=['avr'])
a=p.parse_args()
data=json.loads((Path(__file__).resolve().parents[1]/'arduino/dependencies.json').read_text())
urls=','.join(data['indexes'][c] for c in a.cores if c in data['indexes'])
extra=['--additional-urls',urls] if urls else []
def run(*args): subprocess.run([a.cli,*args],check=True)
run('core','update-index',*extra)
for core in a.cores: run('core','install',data['cores'][core],*extra)
run('lib','update-index')
for name,version in data['libraries'].items(): run('lib','install',name+'@'+version,'--no-deps')
from arduino_compat import apply
apply(a.cli)
print('Dependencies installed. Bundled Blockly libraries are supplied by the local server.')
