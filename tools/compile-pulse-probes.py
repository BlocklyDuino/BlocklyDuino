#!/usr/bin/env python3
"""Compile pulse-engine combinations and inspect AVR ISR linkage; never upload."""
import argparse
import json
import os
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--cli', default='arduino-cli')
parser.add_argument('--all-cores', action='store_true', help='Also requires pinned Pico and STM32 cores')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
os.chdir(root)
subprocess.run(['node', 'tests/motion-tests/pulse-engines.js'], check=True,
               env={**os.environ, 'GENERATE_SKETCHES': '1'})
bundled = [arg for folder in sorted((root/'arduino/libraries').iterdir())
           if (folder/'library.properties').is_file() for arg in ('--library', str(folder))]
avr = 'arduino:avr:pro:cpu=16MHzatmega168'
cases = [('hardware_avr', avr), ('hardware_avr', 'arduino:avr:pro:cpu=8MHzatmega168'),
         ('hardware_sd', avr), ('hardware_score', avr), ('timer_position', avr),
         ('mixed_polyphonic_sd', 'arduino:avr:pro:cpu=16MHzatmega328')]
if args.all_cores:
    cases += [(name, fqbn) for suffix, fqbn in [
        ('pico', 'rp2040:rp2040:rpipico'),
        ('stm32', 'STMicroelectronics:stm32:GenF1:pnum=BLUEPILL_F103C8,usb=CDCgen')]
        for name in ('hardware_'+suffix, 'hardware_score_'+suffix)]
results = []
for index, (name, fqbn) in enumerate(cases):
    build = root/'.test-build/pulse-builds'/str(index)
    build.mkdir(parents=True, exist_ok=True)
    result = subprocess.run([args.cli, 'compile', '--fqbn', fqbn, *bundled,
                             '--build-path', str(build), str(root/'.test-build/pulse-probes'/name)],
                            capture_output=True, text=True, timeout=240)
    (build/'build.log').write_text(result.stdout+result.stderr)
    if result.returncode:
        raise SystemExit(name+' failed:\n'+(result.stdout+result.stderr)[-5000:])
    if fqbn.startswith('arduino:avr:') and name.startswith('hardware_'):
        commands = json.loads((build/'compile_commands.json').read_text())
        nm = Path(commands[0]['arguments'][0]).with_name('avr-nm')
        symbols = subprocess.check_output([str(nm), str(build/(name+'.ino.elf'))], text=True)
        (build/'symbols.txt').write_text(symbols)
        for vector in ('__vector_7', '__vector_11', '__vector_12', '__vector_13'):
            entry = next(line.split() for line in symbols.splitlines() if line.endswith(' '+vector))
            assert entry[-2] == 'W', (name, vector, entry)
        assert 'BlocklyBuzzer' not in symbols, name
    print('PASS', name, fqbn, flush=True)
    print('\n'.join(result.stdout.splitlines()[:2]), flush=True)
    results.append({'example': name, 'fqbn': fqbn, 'ok': True})
(root/'.test-build/pulse-builds/results.json').write_text(json.dumps(results, indent=2))
