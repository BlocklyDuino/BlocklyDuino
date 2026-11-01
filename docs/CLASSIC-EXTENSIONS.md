## Pro Mini guided workflow update

The Pro Mini ATmega168 reference now has a versioned capability description,
engine-aware allocation and explicit wiring-change notices. Connections explains
hardware versus interrupt/loop engines and their resource limits.

The grouped catalogue contains 78 curated examples covering all 20 named device
types, with target build sizes, beginner comments and wiring/observation/change
instructions. Advanced lessons identify their hardware and memory limits.
LCD users can define eight 5×8 glyphs and display codes 0–7 from a prepared buffer;
legacy zero-as-space buffers keep their previous behavior.

All 31 Serial examples announce their Plotter header and instructions on boot and
on Start. Upload example 55, choose 115200 baud, Connect and Start for a board-only
interactive LED experiment. A fresh or reset automatic Plotter waits for a header;
Manual dashboard remains available for sketches without one. Start/Stop sends
ordinary `START`/`STOP` serial lines.

Controller headers describe multiple charts, overlaid traces, gauge needles,
bars, raw tables and scan images, plus sliders, number/text inputs, checkboxes,
selectors and buttons. `@msg` displays instructions in Board says; `@state`
confirms control values. Ordinary serial commands carry input back to the sketch.
Fit all instruments is the default; a larger scrolling layout is optional in
settings, which remember their collapsed state.
Bounded host formulas/statistics/integration keep the computation off the MCU.
Capture retains configuration revisions and raw/calculated samples across live
header changes. See the in-app Plotter guide for complete wire-format examples.

# Classic editor extension: changes and integration map

This is a contribution proposal for the classic `v1-gh-pages` application,
based on upstream commit `67c85046d39cbde2c59d26c921a29a3b964e8c54`.
It does not replace Blockly's bundled engine or modify the separate v2 application.
The additions are Apache-2.0; original notices and the separate v2 license remain.

## User-visible additions

| Area | Added behavior | Main files under `blockly/apps/blocklyduino` |
| --- | --- | --- |
| Program structure | setup/loop, lexical typed variables, dynamic multidimensional indices, typed functions, math | `program_blocks.js`, `math_blocks.js`, `ux_blocks.js` |
| Devices | declare wiring once, stable device IDs, illustrated picker, device-specific actions and wiring inspector | `device_blocks.js`, `device_catalog.js`, `project_devices.js`, `workspace_inspector.js` |
| Modules | AccelStepper acceleration, servos, LCD/OLED/TFT, common sensors, NeoPixel, IR, shift registers | `extra_blocks.js`, `popular_blocks.js`, `device_blocks.js` |
| Memory | 24LC256, 25LC256, W25Q32; bounded typed/string access; SdFat files and directory listing | `storage_blocks.js`, `arduino/libraries/BlocklyStorage` |
| Images | streamed/coordinate grayscale BMP, RGB BMP, high-precision PGM/PPM | `image_blocks.js`, `BlocklyStorage/src/BlocklyImage.h` |
| Music | nonblocking tones, flash melodies, three Timer2 voices, free note records, timed polyphonic SD scores | `music_blocks.js`, `sd_music_blocks.js`, `BlocklyMusic`, `BlocklySDMusic` |
| Low-level | unsigned bit operations, logic, masked AVR port/register access, custom SPI/I2C transactions | `bit_blocks.js`, `logic_blocks.js`, `avr_blocks.js`, `bus_blocks.js` |
| Interrupts | named external/pin-change handlers, attach/detach, atomic access, configurable Timer1 | `interrupt_blocks.js`, `timer_interrupt_blocks.js` |
| Workspace | undo/redo, stack selection, new/recover project, pointer-anchored 1–300% zoom, labelled areas | `editor_history.js`, `editor_actions.js`, `workspace_zoom.js`, `workspace_regions.js`, `blockly_helper.js` |
| Serial | shared bidirectional connection, header-configured Plotter views and controls, board messages, saved layouts and capture | `serial_client.js`, `serial_monitor.js`, `serial_plotter.js`, `serial_protocol.js` |
| Serial blocks | editable Flash-streamed templates with variable sockets; bounded line reception and validated command-to-variable assignment | `serial_message_blocks.js`, `arduino/libraries/BlocklySerial` |
| Build target | actual installed board menus, port selection, applied target persistence, compact panels | `target_picker.js`, `panel_state.js`, `server/` |

The static toolbox is supplemented by 20 device configurations
and 111 bound action entries. Seventy-eight commented numbered XML examples cover beginner
circuits through interrupt control, music, files and streaming images. English
guides explain wiring, constraints and extension templates. Legacy block types
remain loadable where newer named-device actions replace them in the visible UI.

## Architecture and extension points

New JavaScript files register blocks and Arduino generators against the existing
Blockly API. `index.html` loads them after the bundled generators. Named devices
serialize stable IDs, so renaming a device preserves its action references.
Workspace regions are separate XML metadata and do not change generated C++.
Most implementation lives in separate modules; only the entry page and persistence
helper substantially modify existing classic application files.

`server/blocklyduino-server.py` serves static files, compiles/uploads via Arduino
CLI, and exposes local target and serial endpoints. `blocklyduino_serial.py` owns
one bounded event ring and one serial connection; reads do not consume another
view's data. Upload uses a lease to close/reopen the connection. Port selection,
baud and target settings are stored privately outside the repository. There is
no telemetry or bundled personal configuration.

`user_blocks.js` is a small custom-extension template. The in-app extension guide
explains block shape, inputs, code generation, definitions and setup sections.
The old Blockly API must be respected; modern Blockly snippets need adaptation.

## Compatibility and limits

- AVR registers, pin-change mappings, Timer1 and the three-voice Timer2 engine
  target ATmega168/328(P). Selecting another board cannot translate these blocks.
- Known timer/pin conflicts are diagnosed, but arbitrary manual C++ and hidden
  third-party library resource conflicts cannot be proven safe by the generator.
- ISR handlers must be short. Shared multibyte data needs atomic access; direct
  delay/Serial/Wire calls in generated named handlers are rejected.
- BMP grayscale supports 2–256 levels; RGB24 supports 2–256 per channel. PGM/PPM
  preserve 2–65536 levels with high-byte-first 16-bit samples where required.
  SD images stream through the filesystem cache, not a full RAM framebuffer.
- FAT16/FAT32, one open SD file, short filenames. Coordinate images initialize
  the file first. Sequential scan output is substantially cheaper than random
  writes. The image writer and SD melody player cannot share an active file.
- ATmega168 has very little RAM/Flash. Individual examples fitting does not mean
  arbitrary combinations fit; compile reports static RAM only, not stack/heap.
- 93Cxx Microwire and AT45 devices are not implemented. The generic SPI/I2C blocks
  provide a starting point for additional drivers.
- This is a single-file sketch/block editor. It does not round-trip arbitrary C++
  or provide multi-file project editing. The new backend is verified on Linux.

## Suggested upstream review sequence

The complete runnable branch is offered for evaluation. If smaller changes suit
upstream better, the boundaries above permit separate reviews of workspace UX,
named devices/types, serial/backend, and hardware/storage/music modules. A future
port to v2 requires an explicit migration of the Blockly APIs and XML formats.
Feedback and alternative integration plans are welcome in the pull request.

## Board-aware editing and scanning images

See [board resources and workflow](BOARD-RESOURCES.md) for tabs, the auto-revealing toolbox, searchable board history, catalogue ordering/colours, pin and timer validation, continuous stepper mode, precise servo pulses and the streaming image Plotter.

## Compact editing, buffers and polyphonic scores

Device colours are edited with the gear beside their Project devices entry.
Old XML colour fields remain loadable but are hidden on blocks. Undo/redo keeps
whole-workspace snapshots including device IDs, comments and labelled areas;
keyboard shortcuts leave native text editing alone. Code/XML/Connections hide
block manipulation controls. `board_diagram.js` shows board-specific header maps
and ownership, including reserved buses and auxiliary analog pads.

`field_message.js` provides a compact serial-text field with a multiline editor.
JSON headers are formatted in the dialog and sent as one line. The image-scanner
example uses ordinary Serial statements; old specialized image block definitions
are retained only for XML compatibility, not shown in the palette.

`buffer_blocks.js` and `BlocklyBuffers` pass typed whole-array references to LCD,
OLED, TFT and NeoPixel outputs without a second framebuffer. Examples 64–67 use
small buffers that leave room on ATmega168. Full frames are possible when the
board has sufficient RAM; formats and layouts are documented in buffer-guide.html.

The shared `BlocklyNote` parser accepts named pitches, Hz and rests from text
variables, SD lines or EEPROM strings. Timed SD records add time and voice:
`time_ms,voice,pitch,duration_ms`. Absolute/delta timing, one queued event and
32-character service budgets support overlapping notes without loading a song.
Example 69 and POLY.TXT demonstrate three voices. The engine still targets AVR
Timer2; cooperative SD access can delay event dispatch. Read sd-music-guide.html
for limits and how to keep the main loop responsive.

## Pulse engines and resource audit

The STEP/DIR engine selector keeps legacy AccelStepper projects intact while
adding FastAccelStepper 2.0.1 on ATmega168/328 Timer1 outputs D9/D10. The small
BlocklyMotion adapters unify signed velocity, acceleration, stop and relative
position semantics; they do not implement a second timer pulse engine. Host
tests cover the adapters and real AVR builds compile the upstream library.

Pin menus track the chosen engine, timer ownership, Pico tone PIO consumption,
PWM channel aliases and STM32 default/remapped channels. Timing notes explain
interrupt-disabled peripherals and the difference between a library throughput
rating, timer resolution and actual measured motor performance. Example 70 is
a commented, initially stopped Serial speed-control experiment.

Hardware Servo uses calibrated PWM outputs on AVR, Pico and Blue Pill. Hardware
buzzers use AVR output compare, Pico PIO or STM32 PWM; waveform edges need no
audio-rate interrupt. The AVR three-voice DDS engine remains available where
pin flexibility or voice count matters more than CPU cost. Static allocation
checks shared timer frequencies, channels, remaps and competing peripherals.
Unchanged targets avoid reconfiguring a timer on every loop iteration.

The same note records, flash melodies and timed SD scores drive either sound
engine. A small type-erased adapter is instantiated only for scores that mix
hardware and software outputs. Hardware-only programs do not link the AVR
software audio ISR. Example 71 demonstrates autonomous servo and sound output;
the guide explains which duration/score tasks still need loop service.
