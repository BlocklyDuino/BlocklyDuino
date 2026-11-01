#!/usr/bin/env python3
"""Inventory every bundled XML lesson and attach the latest explicit AVR168 audit."""
from pathlib import Path
import hashlib,json,re,xml.etree.ElementTree as E
ROOT=Path(__file__).resolve().parents[1]; APP=ROOT/'blockly/apps/blocklyduino'; OUT=APP/'examples'
TARGET='arduino:avr:pro:cpu=16MHzatmega168'
devices={
'device_servo':'Servo', 'device_stepper_driver':'STEP/DIR driver', 'device_stepper_coils':'28BYJ-48 + ULN2003',
'device_lcd':'HD44780 I2C LCD', 'device_oled':'SSD1306 I2C OLED', 'device_oled_spi':'SSD1306 SPI OLED', 'device_tft':'ST7735 SPI TFT',
'device_ultrasonic':'HC-SR04','device_ds18b20':'DS18B20', 'device_dht':'DHT11/22', 'device_neopixel':'WS2812 RGB LEDs', 'device_ir_nec':'NEC IR receiver', 'device_shift595':'74HC595','music_buzzer':'Passive buzzer',
'st_i2c_eeprom':'24LC256 EEPROM', 'st_spi_eeprom':'25LC256 EEPROM', 'st_spi_flash':'W25Q32 Flash', 'st_sd':'SPI SD card', 'll_spi_device':'Custom SPI device', 'll_i2c_device':'Custom I2C device'}
legacy={
'ds18b20_temperature':'device_ds18b20','lcd_i2c_print':'device_lcd','lcd1602_i2c_print':'device_lcd','lcd20x4_init':'device_lcd','lcd20x4_print':'device_lcd','lcd20x4_show':'device_lcd','oled091_print':'device_oled','oled_ssd1306_091_i2c_print':'device_oled','ssd1306_spi_print':'device_oled_spi','oled_ssd1306_spi_print':'device_oled_spi','st7735_print':'device_tft','tft_st7735_spi_print':'device_tft','servo_move':'device_servo','stepper_28byj_init':'device_stepper_coils','stepper_28byj_move':'device_stepper_coils','accel_4wire_init':'device_stepper_coils','accel_driver_init':'device_stepper_driver','a4988_move':'device_stepper_driver','a4988_init':'device_stepper_driver','stepper_step_dir':'device_stepper_driver','dht_temperature':'device_dht','dht_humidity':'device_dht','ultrasonic_distance':'device_ultrasonic','ultrasonic_cm':'device_ultrasonic','neopixel_init':'device_neopixel','ir_nec_read':'device_ir_nec','shift595_write':'device_shift595','inout_tone':'music_buzzer','inout_notone':'music_buzzer'}

# Libraries are determined by the generated sketch, never by the device family:
# a Servo may use Servo.h or hardware PWM, and a passive buzzer may use core tone,
# the IRQ mixer, or hardware sound. The shared music-format header belongs to
# BlocklyMotion; it does not imply that the BlocklyMusic IRQ engine is linked.
INCLUDE_RE=re.compile(r'^\s*#\s*include\s*[<"]([^>"\n]+)',re.M)
HEADER_LIBRARY={
 'Servo.h':'Servo','Stepper.h':'Stepper','AccelStepper.h':'AccelStepper',
 'FastAccelStepper.h':'FastAccelStepper','Adafruit_NeoPixel.h':'Adafruit NeoPixel',
 'Adafruit_ST7735.h':'Adafruit ST7735 and ST7789 Library',
 'Adafruit_GFX.h':'Adafruit GFX Library','Adafruit_I2CDevice.h':'Adafruit BusIO',
 'Adafruit_SPIDevice.h':'Adafruit BusIO','Adafruit_Sensor.h':'Adafruit Unified Sensor',
 'DHT.h':'DHT sensor library','DallasTemperature.h':'DallasTemperature',
 'OneWire.h':'OneWire','LiquidCrystal_I2C.h':'LiquidCrystal_I2C',
 'U8x8lib.h':'U8g2','IRremote.hpp':'IRremote','rgb_lcd.h':'Grove - LCD RGB Backlight',
 'SdFat.h':'SdFat','Wire.h':'Wire','SPI.h':'SPI'}
# Reviewed transitive includes for this AVR target, including companion .cpp
# files compiled by Arduino. These are build dependencies, not pin ownership.
# Do not use a library.properties depends list: it can include optional example
# dependencies unrelated to the selected header/engine.
TRANSITIVE_HEADERS={
 'Adafruit_ST7735.h':['Adafruit_GFX.h'], # ST77xx -> Adafruit_SPITFT/GFX
 'Adafruit_GFX.h':['Adafruit_I2CDevice.h','Adafruit_SPIDevice.h'],
 'Adafruit_I2CDevice.h':['Wire.h'],'Adafruit_SPIDevice.h':['SPI.h'],
 'DHT.h':['Adafruit_Sensor.h'], # companion DHT_U.cpp is compiled too
 'DallasTemperature.h':['OneWire.h'],'LiquidCrystal_I2C.h':['Wire.h'],
 'U8x8lib.h':['SPI.h','Wire.h'], # U8x8lib.cpp AVR hardware-bus backends
 'rgb_lcd.h':['Wire.h'],'SdFat.h':['SPI.h']}
# The three original, unaudited imports have no generated sketch in the audit.
# These include sets were checked against the existing core/grove generators.
LEGACY_HEADERS={'blink.xml':[], 'click_color.xml':[], 'servo_potentio.xml':['Servo.h']}

def header_index():
    """Read bundled header ownership/dependencies from repository source."""
    owners=dict(HEADER_LIBRARY);deps={k:list(v) for k,v in TRANSITIVE_HEADERS.items()}
    for properties in sorted((ROOT/'arduino/libraries').glob('*/library.properties')):
        name=next(line[5:] for line in properties.read_text().splitlines() if line.startswith('name='))
        for header in sorted((properties.parent/'src').glob('*.h')):
            owners[header.name]=name
            # Ignore standard/toolchain and other-architecture headers below;
            # their names have no entry in the library-ownership map.
            deps[header.name]=INCLUDE_RE.findall(header.read_text())
    return owners,deps

def sketch_libraries(file,row,owners,deps):
    name=re.sub('[^A-Za-z0-9_]','_',file.name)
    sketch=ROOT/'.test-build/sketches'/name/(name+'.ino')
    if file.name in LEGACY_HEADERS:
        headers=LEGACY_HEADERS[file.name];source='reviewed-legacy-generators (not compiled)'
    else:
        code=sketch.read_bytes()
        if row and row.get('sketchSha256') and hashlib.sha256(code).hexdigest()!=row['sketchSha256']:
            raise ValueError('Generated sketch differs from the compile audit: '+file.name)
        headers=sorted(set(INCLUDE_RE.findall(code.decode())));source='audited-generated-sketch-includes'
    for header in headers:
        if header not in owners and not header.startswith(('avr/','util/')) and header not in {'Arduino.h','math.h','stdint.h','stdlib.h','string.h','inttypes.h','Print.h'}:
            raise ValueError('Add a library mapping for generated header '+header+' in '+file.name)
    seen=set();libraries=set();via={}
    def visit(header,parent=None):
        if header in seen:return
        seen.add(header)
        if header in owners:
            libraries.add(owners[header])
            if parent and owners.get(parent)!=owners[header]:via.setdefault(owners[header],set()).add(parent)
        for child in deps.get(header,[]):visit(child,header)
    for header in headers:visit(header)
    return sorted(libraries) or ['Arduino AVR core (no extra library)'],{
        'source':source,'headers':headers,
        'transitive':[{ 'library':key,'viaHeaders':sorted(value)} for key,value in sorted(via.items())]
    }
names={
'01':'Blink the built-in LED','02':'Serial hello','03':'Potentiometer values in Monitor','04':'Potentiometer dims a PWM LED','05':'Button controls an LED','06':'Traffic lights','07':'DS18B20 thermometer + Plotter','08':'16×2 I2C LCD hello','09':'16×2 LCD potentiometer','10':'SPI OLED uptime counter','11':'ST7735 colour TFT text','12':'Find I2C device addresses','13':'0.91-inch I2C OLED text','14':'Grove RGB LCD','15':'Single piezo beep','16':'Simple piezo melody','17':'DS18B20 temperature on LCD','18':'20×4 LCD animation (legacy helper)','19':'20×4 LCD potentiometer','20':'Servo sweep (core timer library)','21':'28BYJ stepper (blocking legacy lesson)','22':'DHT22 climate + Plotter','23':'HC-SR04 distance gauge','24':'NeoPixel colour cycle','25':'Read NEC remote buttons','26':'74HC595 chasing LED','27':'STEP/DIR stepping (legacy helper)','28':'20×4 animation made from blocks','29':'STEP/DIR acceleration (legacy helper)','30':'Named 28BYJ: accelerated back and forth','31':'Setup, loop, function and variable','32':'Math operations','33':'Array animation with millis timing','34':'Local variables and 2D arrays','35a':'Named stepper: position targets','35b':'Named 20×4 I2C LCD','35c':'Servo and distance sensor sweep','36a':'I2C EEPROM: values and text','36b':'SPI EEPROM: values and text','36c':'SPI Flash: erase, write, read','36d':'SD text file','36e':'SD BMP: coordinate pixels','36f':'Radar measurements → BMP','37':'Stream monochrome BMP to SD','38a':'Buzzer: nonblocking beep','38b':'Three independent melody voices','38c':'Melody with rests','39':'SD text-note melody','40':'Polar scan → streamed BMP','41':'Multidimensional arrays and variable indices','42':'BMP grayscale levels','43':'RGB BMP gradient','44':'1024-shade grayscale PGM','45':'High-depth RGB PPM','46':'Typed function arguments and results','47':'Pack flags and bit fields','48':'AVR direct-port blink','49':'AVR input and pull-up','50':'Direct-port byte driver','51':'Read SPI Flash JEDEC ID','52':'I2C register read','53':'Interrupt counter with atomic snapshot','54':'Send text and receive the board’s reply','55':'Interactive LED lab: your first controls','56':'Plotter: potentiometer dashboard','57':'External interrupt edge counter','58':'Pin-change counters','59':'Timer1 periodic interrupt','60':'Attach and detach interrupts','61':'Continuous photocell scan: image + controls','62':'Continuous stepper: potentiometer ramp','63':'Servo pulse width in microseconds','64':'LCD character buffer','65':'OLED packed pixel tile','66':'NeoPixel RGB buffer','67':'TFT RGB565 tile','68':'A note read from a variable','69':'Polyphonic SD score','70':'Timer1 stepper: fine speed commands','71':'Hardware Servo + hardware sound','72':'LCD custom faces from a buffer','73':'Plotter: multiple instruments together','74':'Plotter: PC math and live configuration','75':'Plotter: RGB painting, no extra hardware'}
recommended={'01','03','04','05','07','10','12','22','25','26','30','31','35b','36a','36b','36c','36d','37','38b','41','47','51','52','54','55','56','57','60','61','62','64','65','66','67','68','69','70','71','72','73','74','75'}
advanced={'34','36c','36e','36f','37','38b','39','40','42','43','44','45','46','47','48','49','50','51','52','53','58','59','60','61','65','67','69','70','71','73','74'}
groups=[('Start here',{'01','02','03','04','05','06','12','31','32','33','34','41','46'}),('Sensors and input',{'07','17','22','23','25'}),('Displays and LED outputs',{'08','09','10','11','13','14','18','19','24','26','28','35b','64','65','66','67','72'}),('Motors and motion',{'20','21','27','29','30','35a','35c','62','63','70','71'}),('Sound and music',{'15','16','38a','38b','38c','39','68','69'}),('Memory, files and images',{'36a','36b','36c','36d','36e','36f','37','40','42','43','44','45'}),('Ports, bits and interrupts',{'47','48','49','50','51','52','53','57','58','59','60'}),('Serial Monitor and Plotter',{'54','55','56','61','73','74','75'})]
plotter={'12':['messages'],'23':['gauge','line'],'25':['raw'],'31':['line','raw'],'32':['messages'],'33':['messages'],'34':['messages'],'35c':['xy','gauge'],'36a':['messages'],'36b':['messages'],'36c':['messages'],'41':['messages'],'46':['messages'],'47':['messages'],'51':['messages'],'52':['messages'],'53':['line','raw'],'54':['messages','controls'],'57':['line','raw'],'58':['line-multiple','raw'],'59':['line','controls'],'60':['line','controls'],'70':['line','controls'],'07':['line','gauge'],'22':['line','gauge','raw'],'55':['line','controls','messages'],'56':['line','gauge','bar','raw'],'61':['image-gray','line','controls'],'73':['line-multiple','gauge-multiple','bar-multiple','xy-multiple','raw'],'74':['line-multiple','gauge-multiple','raw','math','live-header'],'75':['image-rgb','line-multiple','bar-multiple']}
purposes={
'01':'Turn the built-in D13 LED on and off. Learn the order of statements and milliseconds.',
'02':'Print a short greeting repeatedly in Serial Monitor. Match the sketch and Monitor baud rates.',
'03':'Read a potentiometer on A0 and print its 0–1023 ADC value. Turn the knob to see the number change.',
'04':'Map an A0 potentiometer reading to PWM brightness for an LED. A PWM output is required for analogWrite.',
'05':'Read a button and change an LED. The input needs the pull-up or wiring described in the blocks.',
'06':'Run a simple red/amber/green traffic-light sequence. Each wait makes the next visible phase last longer.',
'07':'Request a DS18B20 conversion without waiting, read it after 800 ms, and show a thermometer dashboard after Plotter Start.',
'08':'Show a greeting on a 16×2 HD44780 LCD with PCF8574 I2C backpack. Check address and contrast first.',
'09':'Read a potentiometer and print the value on a 16×2 I2C LCD. Learn how repeated prints update a text display.',
'10':'Count seconds on an SSD1306 SPI OLED using a named device and no framebuffer. Update with millis timing.',
'11':'Print text and an analog reading on an ST7735 colour TFT over hardware SPI. Match the panel type and wiring.',
'12':'Scan the I2C bus and print responding addresses in Monitor. Use it to discover the address of an attached module.',
'13':'Print text on a 128×32 SSD1306 I2C OLED. U8x8 sends character tiles without a full pixel framebuffer.',
'14':'Use the text and RGB backlight of a Grove JHD1313 LCD. This module uses a different library from PCF8574 backpacks.',
'15':'Make a passive piezo beep using the Arduino core tone function. This AVR engine uses Timer2 interrupts.',
'16':'Play a short tune with the basic core tone blocks. Compare this blocking lesson with the nonblocking named music examples.',
'17':'Read a DS18B20 temperature and show it on an I2C character LCD. Check the sensor pull-up and LCD address.',
'18':'Play a preset 20×4 LCD animation with an older helper. Example 28 exposes the animation as individual blocks.',
'19':'Show a potentiometer reading on a 20×4 LCD. Use the named LCD and buffer examples for reusable display logic.',
'20':'Move a hobby servo between three angles with the core Servo library. Pulse edges are timer interrupt driven; the waits pause the main loop.',
'21':'Move a 28BYJ-48 through a ULN2003 using a blocking legacy helper. Example 30 provides named, accelerated, nonblocking control.',
'22':'Read DHT22 temperature and humidity every 2.1 seconds. Plotter Start opens separate temperature and humidity views; invalid readings are reported as text.',
'23':'Measure HC-SR04 echo duration and print distance. Sensor reads can block while waiting for an echo; leave at least 60 ms between readings.',
'24':'Change WS2812 RGB LED colours. The strip library keeps a small colour buffer and sends it on show.',
'25':'Read each NEC remote command once and print only valid frames. Poll promptly while IRremote uses Timer2 for reception.',
'26':'Send a shifting one-bit pattern to a 74HC595 so one LED chases across eight outputs. Wiring is declared once.',
'27':'Generate a simple STEP/DIR movement with a legacy helper. Use example 70 for fast hardware-timed continuous motion.',
'28':'Build a 20×4 moving-text animation from editable blocks rather than a preset animation helper.',
'29':'Request STEP/DIR positions and repeatedly call AccelStepper run to accelerate and decelerate. Older helper format retained for comparison.',
'30':'Use one named 28BYJ-48 motor to travel between two positions with acceleration. Call run continuously; no delay interrupts the coil sequence.',
'31':'Separate one-time setup from repeated loop work, create a variable, and call a reusable function.',
'32':'Try arithmetic, ranges and mathematical operations. Observe how connected value blocks form expressions.',
'33':'Update array data on a millis schedule so loop can continue between animation steps.',
'34':'Compare global and local declarations and address a two-dimensional array with zero-based indices.',
'35a':'Declare a STEP/DIR device once, request target positions and keep servicing the loop engine until each target is reached.',
'35b':'Declare a 20×4 I2C LCD once and print through its named actions without repeating address or dimensions.',
'35c':'Sweep a servo and take HC-SR04 distance readings. Allow settling time and remember that an echo read briefly blocks.',
'36a':'Write and read typed values and text in a 24LC256 I2C EEPROM. Addresses are byte offsets, separate from its I2C bus address.',
'36b':'Write and read typed values and text in a 25LC256 SPI EEPROM using one named chip-select configuration.',
'36c':'Erase a W25Q32 Flash sector, write a value/text, then read it back. Flash cannot overwrite programmed bits without erase.',
'36d':'Create or append a text file on an SPI SD card, then flush and close it. A FAT filesystem remains readable on a computer.',
'36e':'Create a small BMP file on SD and write pixels by coordinates. File storage replaces a full image array in RAM.',
'36f':'Sweep a servo, measure distance, and draw results into an SD BMP. This combined sketch has little memory margin on ATmega168.',
'37':'Write a monochrome BMP in raster order, one pixel at a time, then finish the file. No full image buffer is allocated.',
'38a':'Start a nonblocking note on a named passive buzzer while the main loop remains available for other tasks.',
'38b':'Play three independent melody voices on three passive buzzers. The optional IRQ mixer shares one Timer2 and consumes periodic CPU time.',
'38c':'Define a reusable flash melody with rests and play it through a named buzzer.',
'39':'Read text notes from a known SD file and pass each note record to the buzzer. The line parser avoids loading the whole tune.',
'40':'Convert a polar servo/distance scan into row-ordered BMP output on SD. Advanced example with tight AVR memory margins.',
'41':'Use variables for every index of a multidimensional array. Fixed dimensions reserve RAM; indices choose an element at runtime.',
'42':'Create a grayscale BMP with selected palette levels and append calculated shades. Values must fit the chosen output range.',
'43':'Stream an RGB gradient into a BMP file without keeping the picture in AVR RAM.',
'44':'Write a 1024-level grayscale PGM, preserving more than 8 bits per sample. Use a computer image viewer that supports PGM.',
'45':'Write a high-depth RGB PPM with selected per-channel range. This format preserves precision beyond an 8-bit BMP channel.',
'46':'Define a function with typed float and uint32_t arguments and an explicit result type.',
'47':'Pack several flags and small fields into integers with masks, shifts and extraction blocks.',
'48':'Blink D13 through AVR port registers. Compare the generated code and Flash use with ordinary digitalWrite.',
'49':'Configure an AVR port input and pull-up with masks, then read its bit without changing neighbouring pins.',
'50':'Drive a byte pattern through direct port operations. This advanced lesson exposes register ownership and bit masks.',
'51':'Send the JEDEC-ID command to an SPI Flash chip and read its identification bytes using generic SPI blocks.',
'52':'Write a register pointer and read data from an I2C device using generic transactions. Match the address/register to the attached chip.',
'53':'Increment a volatile counter in an interrupt and copy it atomically before using it in loop.',
'54':'Type a short message in Plotter. The board receives the text and sends it back to the visible message box.',
'55':'The built-in LED blinks immediately after upload. Plotter creates controls for interval, on-time, enable, pattern and a text reply from the board.',
'56':'After Plotter Start, send one A0 value. A Flash-resident header asks the PC to calculate voltage and show lines, a gauge, a bar and raw values.',
'57':'Count edges on external interrupt D2. A physical button may bounce and create several electrical edges per press.',
'58':'Use pin-change interrupts on D4 and D5 to keep separate counters, then copy the values safely in loop.',
'59':'The counter rises ten times per second. Plotter shows it five times per second; Running pauses/resumes Timer1, Clear resets the count, and Restart begins a fresh timer period.',
'60':'Starts detached. Check Attached, then press the D2 button. Detach pauses counting while preserving the count; Clear resets it.',
'61':'Choose one-way or bidirectional photocell sweeps with two hardware servos; adjust delayed sampling to align rows. The computer builds the image while the board averages scheduled ADC readings without a framebuffer.',
'62':'Use a potentiometer to set signed continuous stepper speed with acceleration. The software loop engine must still be serviced every pass.',
'63':'Map a potentiometer to servo pulse microseconds for finer command increments than whole degree values.',
'64':'Prepare an 80-byte LCD character grid in RAM, then send the finished 20×4 frame once. Legacy text mode treats zero as a space.',
'65':'Build a 128-byte packed OLED tile: each byte stores eight vertical pixels. Send the tile without allocating a full-screen buffer.',
'66':'Prepare RGB values in an array, copy them to the NeoPixel library buffer and call show once for the finished frame.',
'67':'Prepare a small RGB565 colour tile and send it to an ST7735 TFT in one SPI transaction.',
'68':'Pass a note record through a variable to the music parser. The same format can come from EEPROM, Serial or an SD line.',
'69':'Play a timed, polyphonic score from SD without loading it all into RAM. Three IRQ voices and the SD cache leave a small stack margin.',
'70':'Starts stationary. Enter a signed target pulse rate in Plotter; Timer1 ramps toward it with acceleration 5000 steps/s². The chart shows the requested rate, not measured motor speed.',
'71':'Use a potentiometer to control hardware Servo pulses on D9 while a hardware buzzer on D11 plays a melody. Timer1 and Timer2 have separate owners.',
'72':'Define a 5×8 face in LCD glyph slot 0, then animate two faces through an 80-byte raw-code buffer. Eight slots and variable indices are supported.',
'73':'Compare A0 with a generated triangle in overlaid lines, a multi-needle gauge, grouped bars, two XY traces and a raw table. Start/Stop controls one shared stream.',
'74':'Send one voltage plus device time and let the PC calculate mean, RMS, limits, sum, derivative and integral. After five seconds, a live header changes the averaging window.',
'75':'Paint an RGB gradient one pixel at a time while charts and bars show the colours. No external hardware or AVR image buffer is needed.',
'blink.xml':'Original BlocklyDuino blink workspace retained for importing older projects.',
'click_color.xml':'Original BlocklyDuino demonstration workspace retained as a legacy import, outside the current AVR168 compile audit.',
'servo_potentio.xml':'Original potentiometer-to-servo workspace retained as a legacy import. Prefer the named servo lessons for new work.'}

# Small, practical lesson notes are shown before opening the blocks and in the
# editor. Wiring is generated from the same XML pin selections where possible.
changes={
'01':'Change both wait values from 1000 to 200 ms and compare the blink rate.',
'04':'Change the map output maximum from 255 to 80 to limit LED brightness.',
'05':'Swap the HIGH/LOW actions to make the LED light when the button is released.',
'06':'Change the red, amber and green wait times separately.',
'07':'Warm the sensor with your fingers. Change the graph gauge bounds, keeping the 800 ms sensor interval.',
'08':'Edit the two text values. Row 0 is the first line; row 1 is the second.',
'09':'Turn the potentiometer. Edit the label and move its output column.',
'10':'Edit the heading or move the counter to another text row.',
'11':'Change the foreground colour, text row or the potentiometer label.',
'12':'Disconnect one I2C module and scan again; its address disappears.',
'13':'Edit the heading. Keep text rows within the 128×32 display height.',
'14':'Change red, green and blue backlight values and edit the greeting.',
'15':'Change the frequency from 440 Hz to 880 Hz; compare one octave.',
'16':'Change the note frequencies and note durations independently.',
'17':'Warm the DS18B20, then change the temperature label or LCD row.',
'19':'Turn A0 and change which LCD row shows the ADC reading.',
'20':'Change the three angle targets, keeping them within your servo mechanism’s clear travel.',
'22':'Breathe gently near the sensor and watch humidity. Change gauge bounds without making sampling faster than 2.1 s.',
'23':'Move a flat object toward the sensor. Change the gauge maximum from 200 to 50 cm.',
'24':'Change the RGB values or the LED count to match your strip.',
'25':'Press different remote buttons and note their command values.',
'26':'Reverse the shift direction or increase the 150 ms interval.',
'28':'Edit the message and the update interval to change its movement.',
'30':'Change target 512 to 256 half-steps or reduce maximum speed and acceleration.',
'31':'Edit the blink function once; every function call uses the new timing.',
'32':'Change one input and compare the labelled mathematical results.',
'33':'Change an array element and the update interval; compare the sequence printed below.',
'34':'Change one 2D array index and compare the selected element; local variables exist only inside their function.',
'35a':'Change the two position targets or the acceleration; call run on every loop pass.',
'35b':'Change the message or the LCD columns/rows once in the device definition.',
'35c':'Move an object into the sweep and narrow the servo angle range.',
'36a':'Change the stored number/text, using separate byte addresses for each record.',
'36b':'Change the stored number/text without changing the SPI bus pins.',
'36c':'Change the test value inside the erased sector; Flash must be erased before bits can return to 1.',
'36d':'Change the filename and text, upload, then inspect the file on a computer.',
'36e':'Change the coordinates and pixel values, then open the resulting BMP on a computer.',
'36f':'Move an object in the scan arc. Inspect the completed BMP; keep this small-memory combined project advanced.',
'37':'Change the pixel formula to make stripes or a checkerboard; finish the image before reading it on the computer.',
'38a':'Change the beep duration while the LED continues its separate task.',
'38b':'Change one voice’s notes while the other two voices keep their own melodies.',
'38c':'Edit one note or rest in the melody definition; play it again.',
'39':'Edit the note file on the SD card, using the note syntax from the SD music guide.',
'40':'Change the pixel/intensity mapping after understanding the polar-to-raster conversion.',
'41':'Change row and column variables to select another cell; keep indices inside the declared shape.',
'42':'Change the number of palette shades and the pixel formula together.',
'43':'Change the red, green or blue formula to produce another colour gradient.',
'44':'Change a 0–1023 pixel value and open the PGM in a viewer that supports that precision.',
'45':'Change one colour-channel formula while keeping values within the configured range.',
'46':'Change the arguments to the function and compare its returned value.',
'47':'Change one bit index or packed field, then compare the printed number.',
'48':'Change the wait times; PB5 is the built-in D13 LED.',
'49':'Press and release the D2 button and watch D13 follow the port input.',
'50':'Change the byte pattern sent to the 74HC595 and watch Q0–Q7.',
'51':'Read the three JEDEC bytes and compare with the Flash chip’s datasheet.',
'52':'Set the actual I2C address and register for your chip before interpreting its bytes.',
'53':'Pulse D2 and watch the counter. Keep Serial output outside the interrupt handler.',
'54':'Type a short message in Plotter and send it; the board returns the same characters.',
'55':'Try a slower interval, a different on-time, Steady light, and a text message. Each control changes the running board.',
'56':'Turn A0. Edit the header’s voltage formula only if your measured ADC reference differs from 5 V.',
'57':'Press the D2 button; electrical contact bounce may count several edges per press.',
'58':'Press each button independently and compare its own counter trace.',
'59':'Pause/resume the timer with its checkbox and clear the counter with the button.',
'60':'Attach the interrupt, press the button, detach it, then compare the counter.',
'61':'Use the Parameters area or live controls: resolution, row time, averaging, gain/offset, black/white signal, brightness levels and servo pulse endpoints. Gain 100% = 1x. Accepted changes restart a clean image; Stop holds. Use Areas → Parameters to focus the editable settings.',
'62':'Turn A0 slowly through the centre to stop and reverse. Narrow the speed range for finer ADC control.',
'63':'Turn A0 and adjust the minimum/maximum pulse widths to your servo’s usable travel.',
'64':'Change characters in the frame array, then send the complete frame.',
'65':'Change bits in the 128-byte tile; each byte represents eight vertical pixels.',
'66':'Change one RGB triplet in the array, then call show once for the finished frame.',
'67':'Change RGB565 tile values or its target position without allocating a full-screen buffer.',
'68':'Replace the note text with another note or a rest, using the same parser.',
'69':'Edit one voice’s events in the SD score. This example has little free RAM; keep the buffer sizes unchanged.',
'70':'Enter -30000..30000 steps/s; Stop ramps to zero. Change acceleration in the device block. Adjacent high-speed requests can map to the same timer period. This sketch has almost no spare Flash.',
'71':'Turn A0 and edit the melody. Servo and sound use separate hardware timers.',
'72':'Edit the eight faceRows values (0–31), or define a second face in slot 1.',
'73':'Turn A0 and compare the same value in lines, gauge, bars and XY plots.',
'74':'Keep A0 steady, then turn it. After five seconds the header changes the averaging window while streaming.',
'75':'Change the RGB formulas or image dimensions, upload, and watch the computer build the new picture.'}
wire_overrides={
'01':'Only the Pro Mini and USB–Serial adapter; use the built-in L / D13 LED.',
'05':'Button between D2 and GND; internal pull-up is enabled. The output is the built-in D13 LED.',
'06':'Red LED D2, amber D3, green D4; each LED needs its own series resistor to GND.',
'11':'ST7735 TFT: MOSI D11, SCK D13, CS D10, DC D9, RESET D8; MISO is unused. Potentiometer wiper A0, outer legs VCC/GND. Match the display’s supply and logic levels.',
'12':'I2C module SDA→A4 and SCL→A5, with matching supply and common GND. Several modules can share the bus.',
'14':'Grove JHD1313 RGB LCD: SDA→A4, SCL→A5, supply and GND.',
'31':'Only the Pro Mini and USB–Serial adapter; observe the built-in D13 LED.',
'48':'Only the Pro Mini; PB5 is the built-in L / D13 LED.',
'49':'Button between D2 and GND; observe the built-in D13 LED.',
'50':'74HC595 SER→D8, SRCLK→D9, RCLK→D10, OE→GND, MR→VCC. Add a resistor to each output LED.',
'53':'Pulse input or button D2→GND with the configured pull-up. D13 gives a visible indication.',
'70':'TB6600 STEP signal D9, DIR D4 and common signal GND. Follow the module’s input-voltage wiring; power the motor through the driver.',
'54':'Only the Pro Mini and USB–Serial adapter.',
'55':'Only the Pro Mini and USB–Serial adapter; L / D13 is built in.',
'57':'Button between D2 and GND; internal pull-up is enabled.',
'58':'Two buttons: D4→GND and D5→GND; both inputs use internal pull-ups.',
'59':'Only the Pro Mini and USB–Serial adapter. Timer1 supplies periodic interrupts.',
'60':'Button between D2 and GND; internal pull-up is enabled.',
'61':'Light-sensor/resistor divider midpoint A0; pan servo D9, tilt D10. Suitable servo supply with common GND. Both signals use Timer1 hardware PWM at 50 Hz.',
'75':'Only the Pro Mini and USB–Serial adapter; the image is generated mathematically.'}

def lesson_notes(root,prefix,hardware,desc,types):
    parts=[]
    for b in root.iter('block'):
        if b.get('type') in {'inout_digital_read','inout_digital_write','inout_analog_write','inout_analog_read'} or b.get('type') in devices or b.get('type') in legacy or b.get('type') in {'lcd_user_init','irq_external','irq_pin_change'}:
            pins=[]
            for f in b.findall('field'):
                k=f.get('name');v=f.text or ''
                if k in {'PIN','STEP','DIR','TRIG','ECHO','CS','DC','RESET','IN1','IN2','IN3','IN4','DATA','CLOCK','LATCH'}:
                    if v.isdigit():v='D'+v
                    pins.append(k+' '+v)
                elif k=='ADDR':pins.append('address '+v)
            if pins:
                label=devices.get(b.get('type'),devices.get(legacy.get(b.get('type')),b.get('type').replace('inout_','').replace('_',' ')))
                part=label+': '+', '.join(pins)
                if part not in parts:parts.append(part)
    if types&{'device_lcd','device_oled','st_i2c_eeprom','ll_i2c_device','lcd_user_init','lcd1602_i2c_print','oled_ssd1306_091_i2c_print','grove_rgb_lcd_print'}:parts.append('I2C SDA A4, SCL A5')
    if types&{'st_spi_eeprom','st_spi_flash','st_sd','ll_spi_device'}:parts.append('SPI MOSI D11, MISO D12, SCK D13; CS as listed')
    elif types&{'device_oled_spi','device_tft','tft_st7735_spi_print','oled_ssd1306_spi_print'}:parts.append('SPI MOSI D11, SCK D13; MISO is unused; CS/DC/RESET as listed')
    if any(t=='inout_analog_read' for t in types):parts.append('Potentiometer outer legs VCC/GND; wiper on the listed analog input')
    if 'device_ds18b20' in types or 'ds18b20_temperature' in types:parts.append('Powered DS18B20: data needs a 4.7 kΩ pull-up to VCC')
    if 'device_dht' in types:parts.append('Bare DHT sensor data needs a pull-up; select its exact model')
    wiring=wire_overrides.get(prefix,'; '.join(parts)+'. Common GND; use each module’s required supply.' if parts else 'Only the Pro Mini and USB–Serial adapter.')
    baud=next((int(f.text) for b in root.iter('block') if b.get('type')=='serial_config' for f in b.findall('field') if f.get('name')=='BAUD'),None)
    return {'wiring':wiring,'observe':desc,'change':changes[prefix],'serial':'plotter' if baud else 'none','baud':baud}

def build():
    owners,deps=header_index()
    audit_path=ROOT/'.test-build/compile-audit-atmega168.json'
    audit=json.loads(audit_path.read_text()) if audit_path.exists() else {}
    rows=audit.get('results',audit.get('examples',[]))
    if isinstance(rows,dict):rows=[dict(value,example=key) for key,value in rows.items()]
    byfile={}
    for row in rows:
        file=row.get('file',row.get('example',''))
        byfile[file]=row;byfile[re.sub('[^A-Za-z0-9_]','_',file)]=row
    result=[]
    for file in sorted(OUT.glob('*.xml')):
        root=E.parse(file).getroot()
        # Original imports use an XHTML namespace; it must not hide their blocks.
        for node in root.iter():node.tag=node.tag.rsplit('}',1)[-1]
        types={b.get('type') for b in root.iter('block')};prefix=file.name.split('-')[0]
        hw={x for x in types if x in devices}|{legacy[x] for x in types if x in legacy}
        if any(t.startswith(('lcd20x4_','lcd_user_')) for t in types):hw.add('device_lcd')
        hardware=[{'id':x,'label':devices[x]} for x in sorted(hw)]
        if types&{'inout_analog_read','grove_rotary_angle'}:hardware.append({'id':'analog-input','label':'Light-sensor voltage divider' if prefix=='61' else 'Analog source / potentiometer'})
        if any(t.startswith('grove_rgb_lcd_') for t in types):hardware.append({'id':'grove-rgb-lcd','label':'Grove JHD1313 RGB LCD'})
        if 'grove_rgb_led' in types:hardware.append({'id':'grove-chainable-rgb','label':'Grove chainable RGB LED (clock + data)'})
        if 'i2c_scan_serial' in types:hardware.append({'id':'i2c-bus','label':'I2C device to scan (optional)'})
        if types&{'inout_buildin_led','inout_digital_read','inout_digital_write','inout_analog_write','grove_button'} or prefix in {'48','49','50','57','58'}:hardware.append({'id':'basic-gpio','label':'LEDs / button / GPIO'})
        if any('serial' in x for x in types):hardware.append({'id':'serial','label':'USB–Serial adapter'})
        if not hardware:hardware=[{'id':'board','label':'Pro Mini only'}]
        desc=purposes[prefix]
        group=next((label for label,ids in groups if prefix in ids),'Legacy imports')
        row=byfile.get(file.name,byfile.get(re.sub('[^A-Za-z0-9_]','_',file.name)))
        libraries,library_evidence=sketch_libraries(file,row,owners,deps)
        verification={'target':TARGET,'status':'not-compiled','physical':'not-tested-in-this-audit'}
        if row:
            verification.update({k:v for k,v in row.items() if k not in {'example','file','name'}})
            if 'status' not in row:verification['status']='compiled' if row.get('ok') else 'failed'
        notes=[]
        if row and row.get('classification')=='tight':notes.append('Small remaining memory margin: '+str(row.get('flashRemaining'))+' bytes Flash and '+str(row.get('ramRemaining'))+' bytes SRAM before stack/heap. Keep this advanced; compile success does not measure stack or dynamic allocation.')
        if prefix in {'36f','40'}:notes.append('Combined SD, sensing and motion: advanced, little stack/heap headroom on ATmega168. Compile size is not a runtime stack test.')
        if prefix in {'36a','36b'}:notes.append('Writes a small EEPROM test area. Use a chip with no data you need to retain.')
        if prefix=='36c':notes.append('Erases a whole 4 KB Flash sector before writing. Use a chip with no data you need to retain.')
        if prefix=='70':notes.append('Very tight Flash budget on ATmega168. Compile after any edit; a larger header or extra library may not fit.')
        if prefix=='65':notes.append('Uses a 128-byte tile. Do not allocate a 1024-byte OLED framebuffer on a board with 1024 bytes total SRAM.')
        if prefix in {'38b','69'}:notes.append('Three-voice IRQ music shares Timer2. Each passive buzzer uses a separate output; Timer2 is unavailable for another independent engine.')
        if prefix=='61':notes.append('Coordinates follow commanded motion, not measured servo position. Mechanical lag and sensor response limit useful speed. The native ADC is 10-bit; 2–65536 output levels rescale its readings. Live bounds follow UART/ADC time and the PC image limit.')
        if prefix=='75':notes.append('All pixels are held on the computer. The Arduino sends one pixel and chart sample at a time.')
        result.append({'id':prefix,'file':file.name,'title':names.get(prefix,file.stem.replace('_',' ').replace('-',' ')),'group':group,'level':'advanced' if prefix in advanced or row and row.get('classification')=='tight' else 'beginner','recommended':prefix in recommended,'hardware':hardware,'libraries':libraries,'libraryEvidence':library_evidence,'description':desc,'lesson':lesson_notes(root,prefix,hardware,desc,types),'notes':notes,'plotterModes':plotter.get(prefix,[]),'startCommand':'START\n' if prefix in plotter else None,'stopCommand':'STOP\n' if prefix in plotter else None,'verification':verification})
    payload={'version':1,'auditedAt':audit.get('auditedAt'),'target':{'fqbn':TARGET,'label':'Pro Mini ATmega168 · 16 MHz','flashLimit':14336,'ramLimit':1024},'groups':[x[0] for x in groups],'examples':result}
    (OUT/'catalog.json').write_text(json.dumps(payload,indent=2,ensure_ascii=False)+'\n')
    print('Catalog:',len(result),'XML files;',len({d['id'] for x in result for d in x['hardware']} & set(devices)),'of',len(devices),'named device types represented')
if __name__=='__main__':build()
