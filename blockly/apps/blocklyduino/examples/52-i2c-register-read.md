# I2C register read with a repeated START

This is an MPU6050 WHO_AM_I template: address 0x68 (AD0 low), register 0x75, expected ID 0x68. It does not target the existing LCD at 0x27. A4 is SDA; A5 is SCL. Use module-compatible supply and pull-up voltage. Serial is 9600 baud.

Begin write, queue the register number, end with STOP=false, check status 0, request one byte with STOP=true, then read only if one byte arrived. The timeout is 25 ms. An absent device prints a nonzero status rather than a made-up ID. Change address/register/count according to your chip's datasheet; not every I2C chip uses a register-number protocol.

All Wire endpoints share its transmit/receive buffers. Do not interleave transactions or put Wire transfers inside an atomic section/ISR. If queueing more than 32 bytes, end status is 1 and the first 32 bytes may already have been transmitted. Hardware operation remains untested here.
