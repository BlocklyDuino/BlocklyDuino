# Reproduce validation

From the repository root, install the dependencies in GETTING-STARTED.md, then:

```sh
npm ci --ignore-scripts
npm test
.venv/bin/python -m unittest discover -s tests/serial-backend-tests -p 'test_*.py' -v
python3 tools/compile-examples.py --fqbn arduino:avr:pro:cpu=16MHzatmega168
```

The Node suites use the actual bundled Blockly and jsdom. They test all numbered
XML examples and static toolbox types, device identities/actions, stack selection,
new/recovery workflows, area serialization/gestures, cursor-anchored zoom, serial
stream framing and replay, plotter profiles/rendering, and interrupt generation.
SVG geometry is stubbed where jsdom cannot render it; this is not a substitute
for the browser smoke check.

The Python suite uses POSIX pseudo-terminals and HTTP to verify simultaneous
readers, UTF-8 fragments, transmit endings, bounded buffering, invalid inputs,
origin/host checks, upload arbitration and disconnect/reconnect behavior. It
does not require a physical Arduino and does not write firmware.

The compile script generates sketches under ignored `.test-build/`, compiles
each numbered example, and records results/logs there. Default target is Pro Mini
ATmega328P / 16 MHz. Use `--fqbn arduino:avr:pro:cpu=16MHzatmega168` for the smaller
chip and `--examples 38b 43 60` to choose a subset. It never uploads firmware.
Installed external dependencies are pinned in `arduino/dependencies.json`.

Install host test dependencies with `.venv/bin/python -m pip install -r tests/requirements.txt`.
Host C++ tests for image encoding/music and generated timer helpers are run with
`python3 tests/run-host.py`. They simulate peripherals and decode generated files;
they do not claim physical SPI/I2C timing or buzzer/audio quality.

## Browser smoke check

Start the service with a fresh config on an unused port. Confirm the editor loads
without missing assets, add/open a named-device example, view generated C++, and
compile it. Open Monitor and Plotter, run the plotter demo, collapse settings and
reload. Confirm project save/recovery and guides load. Never use real hardware
upload as part of an unattended browser smoke test.

## Evidence scope

See VALIDATION.md for the recorded publication-run results. Only a Pro Mini
ATmega168 and a PCF8574 20x4 LCD were physically exercised during development.
SD, memory ICs, music, motion and alternate-board examples have software/compile
coverage, but are not presented as a complete physically verified hardware matrix.

The usability suites cover board pin/resource contracts, all example declarations, recent target configurations, continuous stepper generation, servo pulse units, map inputs, and streaming image parsing/view/export. Browser checks should additionally exercise pin/unpin, catalogue ordering and a real PNG download.

The refinement suite exercises compact text/JSON editing, hidden legacy colour
fields, sidebar configuration, free-pitch records, whole-array references and
XML snapshot undo/redo (including stable device IDs and labelled areas).
Host simulations also test buffer orientation/clipping, packed OLED bits,
one NeoPixel show, bounded file-line reading, and polyphonic absolute/delta scores
with overlapping voices, rollover and malformed input. The supplied POLY.TXT is
fed through the same parser as an executable fixture.

For a browser smoke check, open examples 61 and 69, inspect Code and Connections,
edit an ordinary serial header and a Project devices colour, then undo/redo.
Check that non-Blocks views have no selection/zoom/example controls. Compilation
alone cannot establish SD latency, physical note synchronisation or spare runtime
stack space on ATmega168.

Pulse-engine tests cover calibrated PWM, shared timer frequencies, channel
aliases/remaps, acceleration/reversal, and generation without a UI workspace.
Run `python3 tools/compile-pulse-probes.py` for the AVR engine combinations;
add `--all-cores` after installing the pinned Pico and STM32 cores to build those
hardware waveforms and SD polyphony too. The AVR builds inspect ELF symbols:
hardware-only programs must retain weak default Timer1/Timer2 vectors, without
linking the software audio ISR. These checks run in CI for AVR. Compiler commands
explicitly select the bundled libraries so an older sketchbook copy cannot
silently override them.

## Pro Mini beginner workflow

CI compiles all numbered examples for ATmega168 / 16 MHz. The grouped catalogue
records measured Flash/static RAM and warns about small stack/heap margins.
`guided-examples-tests` executes the generated START/STOP reader as C++ (including
partial commands, overflow, CRLF and millis wrap), validates every example header
and checks all named-device categories have examples. `capabilities.js` tests the
reference board description and engine-aware selection.

The Plotter advanced suite checks safe host formulas, windowed statistics and
time-based derivatives/integrals; acquisition tests use a mocked shared Serial
client. A PTY browser check sends START and STOP, replaces headers during a capture,
exports CSV/JSONL/PNG, and verifies multiple instruments and preserved pixels.
No physical board is required and no firmware is uploaded.

After a complete ATmega168 build, run `python3 tools/build-example-catalog.py`
to refresh catalogue metadata. The compiler writes
`.test-build/compile-audit-atmega168.json` with Flash/SRAM limits and generated
sketch hashes. A subset build preserves only earlier entries whose generated
source still matches. Catalogue libraries come from the audited sketch includes
and reviewed header dependencies, so hardware waveforms are not mislabeled as
software music. A mismatched sketch requires a new compile before publication.

The interactive workflow suites execute the generated MCU command helper as host
C++, including button-only dashboards and invalid/range/step inputs. UI regressions
cover unsent drafts, state acknowledgements, explicit Reset of image buffers and
header-first acquisition. The layout suite tests 1–16 instruments across six
viewport shapes; browser checks must also verify actual canvas/card bounds at
1280×720 and 960×600, remembered Fit/Scroll choice, and message-only dashboards.
A PTY can connect a host-compiled generated example to the real backend without
opening a physical USB serial port.
