# Typed function arguments

Open a function's gear menu. Each argument has a type dropdown beside its name. Choose `float` for fractions, `uint32_t` for large positive counters, `String` for text, or another scalar type. The function header shows the selected types. Arguments are local copies; assigning to an argument does not change the caller's variable.

Example 46 prints two results at 9600 baud:

- `doubleValue(0.5)` receives a `float` and returns `1.00`.
- `nextCounter(65536)` receives a `uint32_t` and returns `65537`.

The return type is selected separately on a function with a result. Use matching argument and return types to retain the range and precision you need. Old block files without argument types keep their original `int` arguments. Arrays and pointers are not function argument options in this editor.
