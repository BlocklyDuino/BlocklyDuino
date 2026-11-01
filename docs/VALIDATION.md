# Scanner direction, resolution and delayed capture — 2026-11-01

- Example 61 adds a bidirectional checkbox and Skip line start pixels: all 17
  parameters remain ordinary globals with live controls. One-way scans return
  without sampling; delayed capture retains every column and its original x.
- Width now follows the PC limit (16384 per side / 16 MP total) and maximum row
  duration, rather than the current sweep speed. A larger width automatically
  lengthens the row only when ADC/UART throughput needs it; the returned header
  reports that time. At the default averaging, 1024 columns require 6001 ms.
- The generated sketch uses **14,306 Flash / 413 static SRAM bytes** on
  `arduino:avr:pro:cpu=16MHzatmega168`: **30 Flash / 611 SRAM bytes remain** before
  stack. Compile after editing code or header text. The bootloader is retained.
- Generated-C++ tests cover one/both directions, odd-height frame wrap, delayed
  synthetic-sensor alignment, retained edge columns, zero/max skip, direct high
  resolution, cross-dependent rejection, and a maximum-duration row spanning
  micros rollover. Existing averaging, brightness, command and timing checks pass.
- Necessary shared changes: the Plotter accepts up to 32 controls; Serial template
  output joins a trailing Flash literal and newline in one call, preserving wire
  bytes while saving program space. No board/library support was expanded.
- All 35 JavaScript suites pass. Browser + isolated PTY verified both direction
  choices, skip=2, width=1024 with a returned 6001 ms row, and a complete smaller
  raster. The non-real-time host can overrun the fastest schedule; it then reports
  the timing error as intended. This does not measure physical AVR scan speed.
- Eight installed app files match HTTP responses. The installed compile endpoint
  confirms the same 14306/413-byte result. No hardware upload was performed.

---

# Configurable continuous photocell scanner — 2026-11-01

- Example 61 has 15 editable global parameters and matching live Plotter controls.
  The actual generated sketch uses **14,072 Flash / 413 static SRAM bytes** on
  `arduino:avr:pro:cpu=16MHzatmega168`: **264 Flash / 611 SRAM bytes remain** before
  stack use. This is a tight Flash fit; compile after adding code or longer text.
- Two Timer1 outputs use microsecond Servo commands. A timed serpentine trajectory
  runs independently of ADC averaging. There is no per-pixel stop or framebuffer.
  Accepted settings regenerate the header, clear the image, and restart from the
  held commanded pose. Startup attaches at 1500 microseconds; scanning waits for Start.
- Reusable Serial templates stream fixed text from Flash with expression sockets.
  A bounded receiver handles complete lines and assigns numeric globals only after
  validation. Integer ranges retain full 32-bit precision. Scanner gain uses percent
  (125% = 1.25x), preserving 0.01x increments while avoiding a float command parser.
- All **35 JavaScript suites**, **20 Python backend tests** and existing host C++
  simulations pass. Scanner tests execute the generated C++ with ADC/UART timing,
  validate emitted headers, check all controls, serpentine coordinates, single-pixel
  dimensions, 65,535 samples, 65,536 brightness levels, rejection, restart and rollover.
  The remaining examples are unchanged and retain their matching compile audit;
  CI compiles the full 78-example reference set.
- Browser + PTY runs the exact generated scanner with a synthetic photocell.
  Connect/Start creates its dashboard; changing width, brightness range and gain
  updates the controller variables and returned header. Unsent edits survive another
  setting's acknowledgement. Invalid fractional dimensions are rejected in the UI.
  The image and chart fit the viewport. This is transport/UI/simulation evidence,
  not a physical measurement of servo arrival or sensor accuracy.
- Plotter reconciles changed headers without replacing focused inputs. Keyed state
  replies report rejected/adjusted values, missing confirmations time out, and long
  partial headers defer bounded START retries. A single permitted numeric value is
  shown disabled; expanding its range enables the control again.

This iteration updates scanner 61 and reusable Serial/Plotter support. Other lessons
have not been rewritten to this parameter pattern yet. The next pass should migrate
applicable lessons individually: visible globals, ordinary variable-filled messages,
validated commands and actual-target compilation. No physical board was reflashed.

---

# Interactive lessons and automatic Plotter layout — 2026-11-01

- All **33 JavaScript suites**, **20 Python backend tests** and host C++
  simulations pass. All **78
  retained numbered examples** generate C++, pass declared pin/resource checks,
  and compile for `arduino:avr:pro:cpu=16MHzatmega168`. Catalogue sizes match the
  current generated sketch hashes. Nine superseded XML files were removed.
- All 31 Serial lessons announce a configuration on boot and START. The new
  interactive LED lesson (55) uses 7,686 Flash / 318 static SRAM bytes; the smaller
  text-reply lesson (54) uses 2,614 / 242. Every lesson has practical Connect,
  Watch and Try changing instructions in the editor and grouped catalogue.
- Fresh/reset automatic Plotter views wait for an explicit header. Tests cover
  all six control types, command validation, UTF-8 byte limits, board messages,
  state confirmations, incomplete commands and unsent draft preservation.
  Message-only headers accept ordinary Serial text. Button-only generated helpers
  do not emit empty state packets; explicit Manual Reset clears image pixels.
- Browser + PTY testing ran the actual generated lesson 55 as host C++ with GPIO
  and Serial stubs. Connect and Start produced its dashboard; slider, number,
  checkbox, select, text and button commands reached the sketch, whose state and
  text replies appeared in the UI. This verifies program/transport/UI behavior,
  not physical LED timing or electrical hardware.
- The installed HTTP service also compiles lesson 55 at 7,686 Flash / 318 static
  SRAM bytes; the existing physical serial session and baud were preserved.
- Six concurrent instruments (line, multi-needle gauge, grouped bars, XY, raw
  values and retained image) fit inside 1280×720 and 960×600 browser viewports.
  Both page dimensions stayed within the viewport. Layout tests cover 1–16
  instruments across six window shapes. Fit is the default; an explicitly
  selected Scroll layout persists after reload. Message-only dashboards use the
  available space without an empty graph. Browser checks also created a manual
  dashboard from the One sensor starter and verified headerless data remains
  ignored after Reset.
- Generated Timer1/interrupt lessons 59, 60 and 70 execute bounded START/STOP and
  control-command tests. Function declarations now precede generated user
  functions that call IRQ helpers. Hardware stepper lesson 70 fits at
  **14,312 Flash / 665 static SRAM bytes**, leaving just **24 Flash bytes**;
  it is explicitly marked advanced and very tight.

No physical board was reflashed in this iteration. Compilation and host/browser
tests do not establish worst-case stack space, sensor accuracy or electrical
timing. SD polyphony 69 still leaves only 196 bytes after static SRAM allocation.
Other board families were not expanded. Earlier runs below describe their
then-current behavior and counts, including superseded CSV auto-detection.

---

# Earlier Pro Mini capability, examples and Plotter audit — 2026-11-01

- All 28 JavaScript suites, 20 Python backend tests and host C++ simulations pass.
  All **84 numbered examples** generate C++, pass declared pin/timer validation,
  and compile for `arduino:avr:pro:cpu=16MHzatmega168` with pinned dependencies.
- Reference-board regressions cover disabled imported devices and AVR Servo
  signed-byte calibration offsets, including rejection of wrapping values and
  explicit 4 µs quantization. A generated 501–2501 µs core calibration request
  compiles as the effective 504–2500 µs range (1,410 Flash / 50 static RAM bytes).
- New examples: 72 LCD glyph/buffer (3,736 Flash / 354 static RAM bytes),
  73 mixed Plotter instruments (4,430 / 215), 74 host math/live headers
  (5,756 / 216), 75 RGB painting (2,892 / 203). Scanner 61 now uses hardware
  Servo pulses and an image-plus-chart header (4,438 / 221).
- Software tests execute generated START/STOP parsing, including split commands,
  invalid/overflowing input, CRLF, restart and millis rollover. LCD tests cover
  slot0, eight-row shape validation, row masking and unchanged legacy buffers.
- Protocol tests cover 5,142 additional schema/math cases: bounded windows,
  safe formulas without dynamic evaluation, undefined results, timestamp resets
  and atomic rejection of bad data/headers. Acquisition UI tests verify bounded
  retries, header revisions, multi-series instruments and image preservation.
  Start also preserves Manual profiles, accepts pixels or headerless samples,
  and rediscovers changed CSV column layouts when restarted in Auto mode.
- Browser + PTY: Start sends START, receives a header and renders six concurrent
  instruments; a live header adds a derived trace without erasing image pixels.
  A 200-record capture contains 100 numeric samples + 100 pixels across three
  configuration revisions. Both downloaded CSV and JSONL were parsed and checked.
  PNG export preserves the 32×16 original raster. Stop leaves the connection open.
- Browser editor: grouped catalogue loads 87 XML entries (84 numbered + 3 legacy),
  a new Servo selects compatible hardware PWM with only D9/D10 available, and
  Connections renders shared I2C claims from the same board model. Compile from
  the browser succeeds for LCD glyph 72 plus the added hardware Servo: 4,204 Flash /
  365 static RAM bytes. The installed HTTP service also compiles LCD glyph 72 (3,736 / 354) with the
  updated sketchbook library while retaining its existing serial session.
  No upload or physical motion/audio test was performed.

Memory limits remain real: SD polyphonic example 69 leaves 196 SRAM bytes after
static allocation, before stack and heap; radar 36f leaves 240 sketch bytes. The
catalogue marks tight examples as advanced. Compilation and host simulations do
not prove worst-case runtime memory, electrical wiring or peripheral timing.
Other MCU families were not expanded in this iteration. The concrete extension
plan is in [board-capabilities.md](board-capabilities.md).

Earlier dated runs below describe their then-current versions.

---

# Pulse engines and timing audit — 2026-11-01

- All 24 JavaScript suites and 20 Python backend tests pass. All 80 numbered XML
  examples generate C++, pass declared pin/resource validation, and compile for
  Pro Mini ATmega328P / 16 MHz with explicitly selected bundled libraries.
- Host simulations exercise continuous ramps/reversal, stepper adapter semantics,
  AVR servo/audio registers at 8/16 MHz, shared timer/channel ownership, unchanged
  target phase preservation, note expiry/rollover and mixed-output score dispatch.
  Existing buffer, note/SD, image and exhaustive Timer1 simulations also pass.
- Ten additional pulse-engine combinations compile with pinned AVR, Pico and
  STM32 cores. Hardware-only AVR ELF files retain weak default Timer1/Timer2
  vectors and contain no software `BlocklyBuzzer` implementation. That avoids
  the software mixer's unused ISR and state, rather than merely disabling it.

| Build | Flash | Static RAM |
| --- | ---: | ---: |
| 70 · Timer1 speed commands, ATmega168 / 16 MHz | 13,504 B | 636 B |
| 70 · Timer1 speed commands, ATmega168 / 8 MHz | 13,578 B | 642 B |
| 71 · hardware Servo + sound, ATmega168 / 16 MHz | 3,526 B | 66 B |
| 71 · hardware Servo + sound, ATmega168 / 8 MHz | 3,500 B | 66 B |
| Hardware text-note SD player, ATmega168 | 13,046 B | 755 B |
| Hardware timed SD score, one voice, ATmega168 | 12,896 B | 817 B |
| Mixed hardware + software SD score, ATmega328P | 14,448 B | 889 B |
| Hardware Servo + sound, Pico | 59,364 B | 9,044 B |
| Hardware timed SD score, three voices, Pico | 74,236 B | 12,404 B |
| Hardware Servo + sound, Blue Pill F103C8 | 31,500 B | 4,172 B |
| Hardware timed SD score, three voices, Blue Pill | 36,132 B | 5,628 B |

The mixed SD variant exceeds the standard ATmega168 bootloader's 14,336-byte
application limit. The one-voice hardware SD score leaves 207 bytes of its
1,024-byte SRAM for stack/runtime work. Static RAM counts exclude heap and do
not establish worst-case runtime margin. FastAccelStepper's 16 MHz speed ratings
are upstream library figures, not measurements of the tested hardware; 8 MHz
compile success does not imply the same throughput.

Generation checks include a workspace without `Blockly.mainWorkspace`: hardware
melody service must still appear in loop and must not leak into another project.
Browser checks cover Timer1 STEP choices restricted to D9/D10, acceleration/mode
fields, hardware Servo/buzzer ownership and generated code. No firmware was
uploaded and no pulse rate, motor movement or physical audio was measured.

The installed local HTTP compile endpoint builds examples 70 and 71 for
ATmega168 using normal sketchbook libraries, with the sizes reported above.
Served editor assets, examples and the pulse guide match the tested sources.

Earlier dated runs below describe their then-current versions.

---

# Editing, buffers and polyphonic scores — 2026-11-01

- All 22 JavaScript suites pass. Real bundled Blockly generates 177 static toolbox
  types and all 78 numbered XML examples; the named-device catalog has 111 action
  entries and 107 preserved nested defaults. All 78 examples pass pin/resource
  validation for Pro Mini ATmega168.
- All 78 examples compile for Pro Mini ATmega328P / 16 MHz. Changed/new examples
  also compile for ATmega168 / 16 MHz:

| Example | Flash | Static RAM |
| --- | ---: | ---: |
| 39 · SD line → variable → note record | 13,516 B | 748 B |
| 61 · ordinary Serial image messages | 5,006 B | 236 B |
| 64 · LCD char array | 3,474 B | 342 B |
| 65 · packed OLED tile | 6,382 B | 567 B |
| 66 · NeoPixel RGB array | 2,650 B | 68 B |
| 67 · RGB565 TFT tile | 12,034 B | 556 B |
| 68 · text note variable | 4,692 B | 72 B |
| 69 · three-voice timed SD score | 13,494 B | 828 B |

The 168 has 1,024 bytes RAM: example 69 leaves only 196 bytes for stack/runtime
use. Static reports exclude heap; NeoPixel also allocates its strip buffer.
OLED/TFT examples use small tiles deliberately. This is compile evidence, not a
physical guarantee that every SD card and extra user code fit the runtime margin.

- Examples 61 and 64–67 compile for both Arduino-Pico 6.3.1 and STM32duino 3.0.0
  Blue Pill F103C8, with board-appropriate pins. Blue Pill ST7735 needs the
  reproducible 1.12.0 private-header guard in `tools/arduino_compat.py`; the final
  TFT build uses 29,624 bytes Flash / 1,824 bytes static RAM. The installer applies
  this narrow fix and preserves the original external source.
- All 20 Python serial/backend tests pass. Host tests pass for shared note syntax,
  three concurrent voices, timed absolute/delta SD playback, millis rollover,
  read budgets, malformed/overlong lines and the actual POLY.TXT fixture. Array
  output tests cover layout, clipping, packed bits, RGB565 and one NeoPixel show.
  Bounded text-line tests cover CRLF, final EOF, overflow and allocation/I/O errors.
  Existing 44 image formats/modes and exhaustive 8/16 MHz Timer1 tests pass too.
- The installed HTTP compile endpoint also builds examples 64 and 69 for
  ATmega168 using its normal sketchbook libraries. Adding collapsed explanations
  to practical example operations leaves all 78 programs identical after removing
  comments.
- Browser checks cover sidebar colour editing and undo/redo, compact JSON editing,
  ordinary Serial scanner code, pin exclusions, three-voice mapping, generated
  comments, board diagrams and hidden block controls in other tabs.
- These changes were not uploaded to physical hardware. SD card latency, buzzer
  audio, display transfers and alternate-board wiring remain unverified physically.

Earlier dated runs below describe their then-current versions.

---

# Usability and resource validation — 2026-10-31

- All 21 JavaScript suites pass, including new board-resource, real Blockly integration,
  example-resource, motion/math, image protocol/UI and board-history tests.
- All 72 numbered XML examples pass declared pin/peripheral validation for Pro Mini
  ATmega168. The existing full compile suite passes for ATmega328P; the three SD
  examples changed afterward to move their status LED off SCK were recompiled too.
- New examples compile for ATmega168 / 16 MHz:

| Example | Flash | Static RAM |
| --- | ---: | ---: |
| 61 · two-servo photocell scanner | 4,922 B | 236 B |
| 62 · continuous signed-speed stepper | 5,886 B | 119 B |
| 63 · microsecond servo pulses | 2,962 B | 50 B |

- The scanner also compiles for Arduino-Pico 6.3.1 (58,132 B Flash / 9,048 B static
  RAM) and STM32duino 3.0.0 Blue Pill F103C8 (20,716 B / 1,568 B). The Blue Pill
  smoke build uses PA8/PB0 servo pins instead of the AVR example's numeric pins.
- Browser checks covered tabs, pinned/revealed toolbox, per-device colours,
  catalogue ordering, I2C pin exclusion with shared bus use, discard/reload, and
  image demo/export. A real browser download decoded as a 160 × 100 RGBA PNG,
  independent of the displayed size. Chart and image framing/UI also have automated tests.
- These changes were not uploaded to physical hardware. Stepper movement and
  photocell mechanics remain unverified. See [profile and library limits](BOARD-RESOURCES.md).

---

# Publication validation — 2026-10-29

Validation performed on the sanitized, standalone publication checkout, rather
than on the previously installed application. Linux, Node.js 20.19.2, Python 3.13,
Arduino CLI 1.5.1, Arduino AVR Boards 1.8.8; dependencies in the versioned manifest.

| Check | Result |
| --- | --- |
| Static toolbox and XML generation | 176 block types and all 69 numbered examples pass |
| JavaScript regression suites | All 14 suites pass |
| Named-device palette | 479 assertions; 20 device types, 102 actions, 105 nested defaults |
| Serial parsing/schema/capture | 1,055 assertions plus five-widget UI, replay and retention tests |
| Python serial/HTTP/startup | All 20 tests pass; pseudo-terminals, no physical serial writes |
| Workspace zoom | 250 scale/anchor cases spanning 1–300%, with actual legacy scrollbar logic |
| Areas and selection | XML persistence, movement, sizing, new/recovery and gesture tests pass |
| Pin interrupt generation | 160 assertions and prior-example preservation pass |
| Timer1 host simulation | Every integer period at 8/16 MHz tested: 8,388,608 / 4,194,304 periods |
| Music host simulation | Three independent voices, duration expiry, rests, slot limits pass |
| SD melody parser | Bounded reads, score syntax, errors and file ownership pass |
| Image host simulation | 44 format/level/mode combinations decoded pixel by pixel; bounds and incomplete files checked |
| Arduino compilation | All 69 numbered examples compile for Pro Mini ATmega328P, 16 MHz |
| Fresh browser/service | New config, alternate HTTP port, editor and generated code load without console errors |
| Browser Compile | Example 60: 2,434 bytes Flash, 194 bytes static RAM on Uno |

Examples whose display text was translated were regenerated and recompiled after
that change. CI repeats software tests and all example compiles from a fresh
GitHub runner. Test output, private settings and compiler build directories are
excluded from the repository. These results do not assert physical behavior for
every supported peripheral; see TESTING.md for the hardware coverage boundary.
