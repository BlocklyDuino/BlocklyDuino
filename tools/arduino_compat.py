"""Narrow, repeatable fixes for the dependency versions in the manifest."""
from pathlib import Path
import json
import subprocess


def patch_st77xx(library):
    """ST77xx 1.12.0 imports an unused header absent from STM32duino 3.x."""
    library = Path(library)
    source = library / 'Adafruit_ST77xx.cpp'
    properties = library / 'library.properties'
    if not source.exists() or not properties.exists():
        raise RuntimeError('Installed Adafruit ST7735 library was not found')
    if 'version=1.12.0' not in properties.read_text().splitlines():
        raise RuntimeError('Review ST77xx compatibility for this library version')
    before = '#if !defined(ARDUINO_UNOR4_MINIMA)\n#include "pins_arduino.h"\n#include "wiring_private.h"'
    after = '#if !defined(ARDUINO_UNOR4_MINIMA) && !defined(ARDUINO_ARCH_STM32)\n#include "pins_arduino.h"\n#include "wiring_private.h"'
    text = source.read_text()
    if after in text:
        return False
    if text.count(before) != 1:
        raise RuntimeError('ST77xx source differs; compatibility patch was not applied')
    backup = source.with_suffix('.cpp.blocklyduino-original')
    if not backup.exists():
        backup.write_bytes(source.read_bytes())
    source.write_text(text.replace(before, after))
    return True


def apply(cli):
    installed = json.loads(subprocess.check_output([cli, 'lib', 'list', '--format', 'json'], text=True))
    candidates = [Path(item['library']['install_dir']) for item in installed['installed_libraries']
                  if item['library']['name'] == 'Adafruit ST7735 and ST7789 Library']
    if len(candidates) != 1:
        raise RuntimeError('Expected one installed Adafruit ST7735 library')
    changed = patch_st77xx(candidates[0])
    print('ST7735 compatibility: ' + ('applied' if changed else 'already applied'))


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cli', default='arduino-cli')
    apply(parser.parse_args().cli)
