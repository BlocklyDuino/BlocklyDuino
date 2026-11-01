# Pack flags and values into one byte

Open `47-bit-packing.xml`. No external hardware is needed. Open Serial Monitor at **9600 baud** after upload. Reset the board to run setup again.

Three `uint8_t` variables use one byte each. `packet` stores both a flag and a small number: bit 5 is the flag; bits 1–3 store `gain` (0–7). The example sets the flag, inserts gain 6, then reads both back.

Expected lines: **44, 6, 1, 88, 4**. The first result is `0x2C` / `0b00101100`; the second extracts gain, the third tests the flag, the fourth rotates the packed byte left by one bit, and the last is integer division 44 ÷ 10.

`bitIndex` is a variable in the bit socket: replace it with another variable or an integer calculation. The blocks produce values; connect a result to a variable setter to keep it. Bit 0 is the least significant bit. Integer arithmetic wraps to the chosen 8/16/32-bit width; division and remainder by zero return zero. These are unsigned operations, independent of the board's native `int` size.

Use **Bits & bytes** for masks, AND/OR/XOR, shifts, rotations, bit tests, bit fields, byte extraction and joining. Use **Logic** for true/false conditions. All blocks link to `low-level-guide.html` through Help.
