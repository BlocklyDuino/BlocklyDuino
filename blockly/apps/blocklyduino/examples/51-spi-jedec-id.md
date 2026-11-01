# SPI JEDEC ID, one command at a time

Configure the generic SPI device once, then send 0x9F and read three bytes inside its transaction. A W25Q32 typically replies EF 40 16. Serial is 9600 baud; output is hexadecimal. There are no flash erase or write commands.

Signals on Pro Mini: D11 MOSI, D12 MISO, D13 SCK, D10 CS. A bare W25Q32 is a 3.3 V device: use a module with suitable power/level translation for this 5 V Pro Mini. CS stays low across all four transferred bytes; Serial output follows after CS is released.

The same blocks can implement a different chip's commands from its datasheet. Change the device configuration and opcode as appropriate. Hardware operation remains untested here.
