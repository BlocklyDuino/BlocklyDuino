# Scope and multidimensional arrays

The same `declare` block is used everywhere:

- Outside all bodies: global, shared between setup, loop and functions.
- Inside a body: local. Place it before the first use. A loop local is initialized again each pass.

The same rule applies to `array`. Shape `4,8` means four rows and eight columns; `2,4,8` is a three-dimensional array. Indices start at zero. Select 2D or 3D on the read/write block to reveal the additional indices. `size` reports the length of the selected axis.

Example 34 declares `uint8_t grid[4][8]` globally. `writeSample()` declares local `row` and `column` variables, then writes 42 to `grid[1][2]`. The loop prints that cell once per second. The 32-byte array remains available after the function returns; its local index variables do not.

All declarations, array actions and variable read/write blocks are in **Variables**. Select a name in the block dropdown. Using a local variable from another function is rejected with an explanatory error.
