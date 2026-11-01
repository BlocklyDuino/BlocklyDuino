# Array indices are ordinary values

Choose an array on its read or write block. The declaration supplies the number of brackets automatically. Drag variable blocks, numbers or expressions into the brackets; an empty bracket uses zero. Fractional results are converted to an integer by truncating toward zero: `5 / 2` selects index 2. Keep each resulting index at least zero and below that dimension's size.

In example 41, `visits` has shape `3,4`. The variables `i` and `j` move through its rows and columns. `visit(row, column)` increments one cell, and the loop prints that cell at 9600 baud. The example uses array size blocks to wrap each index. No extra hardware is needed.

To change an array to four dimensions, enter a shape such as `2,3,4,5`; read and write blocks then show four index sockets. Changing the shape keeps the existing index inputs that still fit. Extra inputs removed when shrinking become loose blocks so their contents are not deleted. Array sizes are compile-time constants and the entire array must fit the board's RAM.

Array names are chosen from declarations. A local declaration shadows a global declaration with the same name. Names declared only in another function cannot be accessed here; the editor reports this before compiling.
