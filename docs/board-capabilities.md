# Reference board model and next development steps

This iteration verifies **Arduino Pro Mini, ATmega168 / 168P, 16 MHz**. The
Arduino AVR core target is `arduino:avr:pro:cpu=16MHzatmega168` (14,336 sketch
bytes and 1,024 SRAM bytes). The 8 MHz profile keeps the same physical pin map;
16 MHz throughput figures must not be applied to it. Existing other-board
profiles remain available, but this iteration does not expand their support.

## One description, several consumers

`blockly/apps/blocklyduino/board_capabilities.js` contains version 1 of the
reference board description. It separates physical facts from library contracts:

| Section | Purpose |
| --- | --- |
| `pins` | Logical pin, AVR port/bit, ADC capability, timer and channel |
| `buses`, `serial`, `spiSS` | Default signal routing and shared-bus ownership |
| `timers` | Counter width and system timebase ownership |
| `memory` | Physical Flash, bootloader-adjusted sketch budget, SRAM and EEPROM |
| `layout` | Connections header map and auxiliary pads |
| `engines` | Supported library backend, allowed pin roles, limits and explanations |
| `limits` | Library instance limits, distinct from physical pin count |

`BoardResources.profile()` adapts this description to the existing validator.
The same profile feeds pin dropdowns, allocation, conflict checking, engine
choices and the Connections diagram. No pin numbering is duplicated in an
individual new device block. The existing family id stays compatible with old
projects. The registry returns independent copies to prevent accidental mutation.

New devices prefer the compatible hardware engine when it has free resources.
A new hardware buzzer prefers D11/Timer2, preserving Timer1 for motion or servos.
If only the interrupt/loop engine is available, it is selected and its cost is
explained in Connections. This is not a claim that a hardware engine is always
better: two autonomous Servo outputs and twelve interrupt-driven Servo outputs
are different useful trade-offs.

Explicit engine changes affect only that device. The planner chooses compatible
free pins and reports any changed wiring. Other devices are never moved. XML
imports and board changes keep existing wiring visible and report conflicts;
they must not silently reconnect a physical project. Every dropdown is filtered
against the current project, including timers and shared SPI/I2C resources.
Unsupported selections from edited/imported XML fail code generation.

Pulse calibration limits are checked before generation. The AVR core Servo engine
stores two signed 8-bit endpoint offsets, in 4 µs units; each endpoint is checked
separately to prevent wraparound. Connections reports quantized effective values.
Disabled devices keep their saved state; choice planning evaluates a temporary
active copy without claiming pins in the actual program. Speed is requested in
STEP pulses/s; a library throughput rating is not a guaranteed motor speed.
Timer0's standard PWM channels can coexist with Arduino timekeeping. Arbitrary
register writes are advanced operations: their complete side effects cannot be
inferred from static blocks and remain documented as such.

## Verification and boundaries

`tests/usability-tests/capabilities.js` exercises the description, planner,
engine menus, resource exhaustion, calibration, explicit engine changes and
legacy XML preservation. Other resource suites cover shared addresses, chip
selects, interrupt inputs, UART, timer collisions and pin aliases. Examples are
compiled for the target and audited separately; static SRAM use cannot prove
runtime stack/heap safety or that an attached module is wired correctly.

The board description records default core routing. A disabled bus selector
means that the selected library uses that fixed instance, not that the chip
cannot support other routing. Resource validation cannot inspect arbitrary C++.

## Ordered follow-up plan

1. **Schema and adapter:** formalize JSON Schema validation for version 1,
   reject duplicate physical aliases/channels, and version future migrations.
   Preserve the reference profile and current XML fixtures as compatibility tests.
2. **Next board, one at a time:** describe its core variant's real pins, buses,
   timers, reserved debug/USB functions, memory and physical header layout. Link
   each exceptional mapping to the installed core or vendor documentation.
3. **Engine contracts:** implement a backend only when its timing, timer sharing,
   interrupt/CPU cost, library limits and valid frequency/pulse ranges are known.
   Compile probes and test conflict combinations before exposing it in menus.
4. **Portable examples:** add named roles (light ADC, servo signal, STEP, DIR)
   to example metadata, resolve them through the same planner, and preview wiring
   changes before loading an example for a different board. Do not rewrite an
   already-saved project from guessed pin numbers.
5. **Memory budgeting:** account for library dynamic buffers, frame sizes,
   serial queues and stack margin. Mark target suitability from measured builds,
   then verify representative examples on physical hardware.
6. **Hardware verification:** measure pulse frequency, width, acceleration and
   jitter with combined loads; run LCD glyphs, SD playback and Plotter examples
   on the reference board. Record measured results separately from compile tests.

The current implementation completes the Pro Mini reference path; the steps
above are concrete follow-up work, not claims of support already implemented.
