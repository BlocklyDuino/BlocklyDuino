/* Named hardware: declare wiring once; actions reference declaration IDs. */
(function () {
  'use strict';
  var A = Blockly.Arduino;
  var configs = {};
  var pins = [];
  for (var i=2;i<=13;i++) pins.push(['D'+i, String(i)]);
  for (var a=0;a<=5;a++) pins.push(['A'+a, 'A'+a]);
  function pin() { return new Blockly.FieldDropdown(pins); }
  function integer(initial, low, high) {
    return new Blockly.FieldTextInput(String(initial), function(v) {
      var n=Number(v); return isFinite(n)&&n===Math.floor(n)&&n>=low&&n<=high ? String(n) : null;
    });
  }
  function identifier(initial) {
    return new Blockly.FieldTextInput(initial, function(v) {
      return /^[A-Za-z][A-Za-z0-9_]*$/.test(v) ? v : null;
    });
  }
  function workspace(block) {
    var w=block&&block.workspace;
    return w&&!w.isFlyout ? w : Blockly.mainWorkspace;
  }
  function all(block) { var w=workspace(block); return w ? w.getAllBlocks() : []; }
  function kind(block) { return configs[block.type]; }
  function uid(block) { return String(block.deviceUid || block.id); }
  function newUid() { return 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,10); }
  function field(deviceKind) {
    return new Blockly.FieldDropdown(function() {
      var source=this.sourceBlock_, blocks=all(source), opts=[];
      for(var i=0;i<blocks.length;i++) if(kind(blocks[i])===deviceKind&&!blocks[i].disabled) {
        opts.push([blocks[i].getFieldValue('NAME'), uid(blocks[i])]);
      }
      if(!opts.length) opts.push(['Add a '+deviceKind+' device first','']);
      var current=this.value_;
      if(current&&!opts.some(function(x){return x[1]===current;})) opts.push(['Missing device',current]);
      return opts;
    });
  }
  function checkConfig(c) {
    if(c.getParent&&c.getParent()) throw Error('Device "'+c.getFieldValue('NAME')+'" must be outside setup, loop and functions.');
    var bs=all(c), name=c.getFieldValue('NAME');
    if(c.type==='device_ir_nec'&&bs.filter(function(b){return b.type==='device_ir_nec'&&!b.disabled;}).length>1)throw Error('IRremote supports one active receiver. Keep a single NEC IR receiver definition.');
    for(var i=0;i<bs.length;i++) if(bs[i]!==c&&kind(bs[i])&&!bs[i].disabled&&bs[i].getFieldValue('NAME')===name) {
      throw Error('Two devices are named "'+name+'". Give each device a unique name.');
    }
  }
  function resolve(block, expected) {
    var id=block.getFieldValue('DEVICE'), bs=all(block);
    for(var i=0;i<bs.length;i++) if(uid(bs[i])===id&&kind(bs[i])===expected&&!bs[i].disabled) {
      checkConfig(bs[i]); ensure(bs[i]); return bs[i];
    }
    throw Error('Select a declared '+expected+' device in the "'+block.type+'" block. Add its device definition with Add device first.');
  }
  function name(c) { return 'bddev_'+c.getFieldValue('NAME'); }
  function refreshReference(expected) {
    return function() {
      if(!this.workspace||this.workspace.isFlyout||this.isInFlyout)return;
      var f=this.getField('DEVICE'), current=this.getFieldValue('DEVICE'), bs=all(this), matches=[];
      for(var i=0;i<bs.length;i++)if(kind(bs[i])===expected&&!bs[i].disabled)matches.push(bs[i]);
      if(!current&&matches.length===1)current=uid(matches[0]);
      var selected=null;
      for(var j=0;j<matches.length;j++)if(uid(matches[j])===current)selected=matches[j];
      if(selected) {
        if(f.getValue()!==current||f.getText()!==selected.getFieldValue('NAME'))f.setValue(current);
        this.setWarningText(null);
      } else this.setWarningText('Add a '+expected+' definition with Add device, then select it here.');
    };
  }
  function val(b,n,fallback) { return A.valueToCode(b,n,A.ORDER_NONE)||fallback; }
  function include(key, text) { A.definitions_['bd_include_'+key]='#include <'+text+'>'; }
  function define(type, deviceKind, title, defaultName, build, tooltip) {
    configs[type]=deviceKind;
    Blockly.Blocks[type]={init:function(){
      this.deviceUid=newUid();
      this.setColour(195);
      this.appendDummyInput().appendField(title).appendField(identifier(defaultName),'NAME');
      build.call(this);
      this.setTooltip(tooltip+' Place outside setup, loop and functions. Wiring is reused by every action selecting this name.');
    },mutationToDom:function(){
      var el=document.createElement('mutation');el.setAttribute('uid',this.deviceUid);return el;
    },domToMutation:function(el){
      var saved=el.getAttribute('uid');
      var self=this, conflict=all(this).some(function(b){return b!==self&&kind(b)&&uid(b)===saved;});
      this.deviceUid=saved&&!conflict?saved:newUid();
    }};
    A[type]=function(){checkConfig(this);ensure(this);return '';};
  }
  function stmt(type, deviceKind, title, build, tooltip) {
    Blockly.Blocks[type]={init:function(){
      this.setColour(195);
      this.appendDummyInput().appendField(field(deviceKind),'DEVICE').appendField(title);
      if(build) build.call(this);
      this.setInputsInline(true);this.setPreviousStatement(true);this.setNextStatement(true);this.setTooltip(tooltip);
    },onchange:refreshReference(deviceKind)};
  }
  function out(type, deviceKind, title, build, tooltip, outputType) {
    Blockly.Blocks[type]={init:function(){
      this.setColour(195);
      this.appendDummyInput().appendField(field(deviceKind),'DEVICE').appendField(title);
      if(build) build.call(this);
      this.setOutput(true,outputType||'Number');this.setTooltip(tooltip);
    },onchange:refreshReference(deviceKind)};
  }
  function pfield(input,label,key,value) { input.appendField(label).appendField(pin(),key); }
  function ensure(c) {
    var n=name(c), f=function(k){return c.getFieldValue(k);}, key='bd_device_'+c.id;
    if(A.definitions_[key])return;
    switch(c.type) {
      case 'device_stepper_driver':
      case 'device_stepper_coils':
        if (A.configureTimerStepper && A.configureTimerStepper(c)) break;
        include('stepper','AccelStepper.h');
        A.definitions_[key]='AccelStepper '+n+'('+(c.type==='device_stepper_driver'
          ?'AccelStepper::DRIVER, '+f('STEP')+', '+f('DIR')
          :'AccelStepper::HALF4WIRE, '+f('IN1')+', '+f('IN3')+', '+f('IN2')+', '+f('IN4'))+');';
        A.setups_[key]=n+'.setMaxSpeed('+f('SPEED')+');\n'+n+'.setAcceleration('+f('ACCEL')+');';break;
      case 'device_servo':
        if (A.configureHardwareServo && A.configureHardwareServo(c)) break;
        include('servo','Servo.h');A.definitions_[key]='Servo '+n+';';A.setups_[key]=n+'.attach('+f('PIN')+');';break;
      case 'device_lcd':
        include('wire','Wire.h');include('lcd','LiquidCrystal_I2C.h');
        A.definitions_[key]='LiquidCrystal_I2C '+n+'('+f('ADDR')+', '+f('COLS')+', '+f('ROWS')+');';
        A.setups_[key]=n+'.init();\n'+n+'.backlight();';break;
      case 'device_ultrasonic':
        A.definitions_[key]='float '+n+'_read() {\n  digitalWrite('+f('TRIG')+', LOW); delayMicroseconds(2);\n  digitalWrite('+f('TRIG')+', HIGH); delayMicroseconds(10); digitalWrite('+f('TRIG')+', LOW);\n  unsigned long us = pulseIn('+f('ECHO')+', HIGH, 30000UL);\n  return us ? us / 58.0f : -1.0f;\n}';
        A.setups_[key]='pinMode('+f('TRIG')+', OUTPUT);\npinMode('+f('ECHO')+', INPUT);';break;
      case 'device_ds18b20':
        include('onewire','OneWire.h');include('ds','DallasTemperature.h');
        A.definitions_[key]='OneWire '+n+'_wire('+f('PIN')+');\nDallasTemperature '+n+'(&'+n+'_wire);';
        A.setups_[key]=n+'.begin();\n'+n+'.setWaitForConversion(false);\n'+n+'.requestTemperatures();';break;
      case 'device_dht':
        include('dht','DHT.h');A.definitions_[key]='DHT '+n+'('+f('PIN')+', '+f('MODEL')+');';A.setups_[key]=n+'.begin();';break;
      case 'device_neopixel':
        include('neopixel','Adafruit_NeoPixel.h');
        A.definitions_[key]='Adafruit_NeoPixel '+n+'('+f('COUNT')+', '+f('PIN')+', NEO_GRB + NEO_KHZ800);';
        A.setups_[key]=n+'.begin();\n'+n+'.clear();\n'+n+'.show();';break;
      case 'device_oled':
        include('u8x8','U8x8lib.h');
        A.definitions_[key]=(f('MODEL')==='32'?'U8X8_SSD1306_128X32_UNIVISION_HW_I2C':'U8X8_SSD1306_128X64_NONAME_HW_I2C')+' '+n+'(U8X8_PIN_NONE);';
        A.setups_[key]=n+'.setI2CAddress('+f('ADDR')+' * 2);\n'+n+'.begin();\n'+n+'.setFont(u8x8_font_chroma48medium8_r);';break;
      case 'device_oled_spi':
        include('u8x8','U8x8lib.h');
        A.definitions_[key]='U8X8_SSD1306_128X64_NONAME_4W_HW_SPI '+n+'('+f('CS')+', '+f('DC')+', '+f('RESET')+');';
        A.setups_[key]=n+'.begin();\n'+n+'.setFont(u8x8_font_chroma48medium8_r);';break;
      case 'device_tft':
        include('tft','Adafruit_ST7735.h');
        A.definitions_[key]='Adafruit_ST7735 '+n+'('+f('CS')+', '+f('DC')+', '+f('RESET')+');';
        A.setups_[key]=n+'.initR('+f('TAB')+');\n'+n+'.setRotation('+f('ROTATION')+');\n'+n+'.fillScreen(ST77XX_BLACK);\n'+n+'.setTextWrap(false);';break;
      case 'device_ir_nec':
        A.definitions_['bd_include_ir']='#define DECODE_NEC\n#include <IRremote.hpp>';
        A.definitions_[key]='int32_t '+n+'_read() {\n  if (!IrReceiver.decode()) return -1;\n  int32_t command = IrReceiver.decodedIRData.command;\n  IrReceiver.resume();\n  return command;\n}';
        A.setups_[key]='IrReceiver.begin('+f('PIN')+', false);';break;
      case 'device_shift595':
        A.definitions_[key]='void '+n+'_write(uint8_t value) { digitalWrite('+f('LATCH')+', LOW); shiftOut('+f('DATA')+', '+f('CLOCK')+', MSBFIRST, value); digitalWrite('+f('LATCH')+', HIGH); }';
        A.setups_[key]='pinMode('+f('DATA')+', OUTPUT);\npinMode('+f('CLOCK')+', OUTPUT);\npinMode('+f('LATCH')+', OUTPUT);';break;
    }
  }
  define('device_stepper_driver','stepper','STEP/DIR stepper','motor',function(){
    var i=this.appendDummyInput();pfield(i,'STEP','STEP');pfield(i,'DIR','DIR');
    this.setFieldValue('3','STEP');this.setFieldValue('4','DIR');
    this.appendDummyInput().appendField('max steps/s').appendField(integer(600,1,100000),'SPEED');this.appendDummyInput('ACCEL_SETTING').appendField('accel steps/s²').appendField(integer(200,1,100000),'ACCEL');
  },'A4988/DRV8825-style STEP/DIR driver. Use its own motor supply and common ground. Call run repeatedly to move.');
  define('device_stepper_coils','stepper','28BYJ-48 stepper','motor',function(){
    var i=this.appendDummyInput();for(var j=1;j<=4;j++){pfield(i,'IN'+j,'IN'+j);this.setFieldValue(String(j+7),'IN'+j);}
    this.appendDummyInput().appendField('max steps/s').appendField(integer(500,1,100000),'SPEED');this.appendDummyInput('ACCEL_SETTING').appendField('accel steps/s²').appendField(integer(100,1,100000),'ACCEL');
  },'28BYJ-48 via ULN2003, half-step mode. Connector order is IN1, IN2, IN3, IN4; the library coil order is handled for you.');
  define('device_servo','servo','Servo','pan',function(){pfield(this.appendDummyInput(),'signal','PIN');this.setFieldValue('9','PIN');},'Standard hobby servo. The servo supply must match its voltage/current requirements; share ground with Arduino.');
  define('device_lcd','LCD','I2C LCD','display',function(){
    this.appendDummyInput().appendField('address').appendField(new Blockly.FieldDropdown([['0x27','0x27'],['0x3F','0x3F'],['0x20','0x20'],['0x21','0x21'],['0x22','0x22'],['0x23','0x23'],['0x24','0x24'],['0x25','0x25'],['0x26','0x26'],['0x38','0x38'],['0x39','0x39'],['0x3A','0x3A'],['0x3B','0x3B'],['0x3C','0x3C'],['0x3D','0x3D'],['0x3E','0x3E']]),'ADDR')
      .appendField('columns').appendField(integer(20,8,40),'COLS').appendField('rows').appendField(integer(4,1,4),'ROWS');
  },'HD44780 text LCD with PCF8574 backpack. On Pro Mini: SDA=A4, SCL=A5. Rows and columns in print blocks start at zero. These dimensions describe the physical display; cursor coordinates and displayed values accept variables.');
  define('device_ultrasonic','range sensor','HC-SR04','range',function(){var i=this.appendDummyInput();pfield(i,'TRIG','TRIG');pfield(i,'ECHO','ECHO');this.setFieldValue('5','TRIG');this.setFieldValue('6','ECHO');},'HC-SR04 distance sensor. A reading can block up to 30 ms; -1 means no echo. Wait at least 60 ms between readings.');
  define('device_ds18b20','temperature bus','DS18B20 bus','temperature',function(){pfield(this.appendDummyInput(),'data','PIN');this.setFieldValue('2','PIN');},'DS18B20 1-Wire bus, 4.7 kΩ pull-up on data. Conversion is asynchronous: request, wait up to 750 ms, then read.');
  define('device_dht','DHT','DHT','climate',function(){var i=this.appendDummyInput();i.appendField(new Blockly.FieldDropdown([['DHT22','DHT22'],['DHT11','DHT11']]),'MODEL');pfield(i,'data','PIN');this.setFieldValue('2','PIN');},'DHT11 or DHT22. Do not read more often than every two seconds. A failed reading returns NaN.');
  define('device_neopixel','pixels','NeoPixel strip','pixels',function(){pfield(this.appendDummyInput(),'data','PIN');this.setFieldValue('6','PIN');this.appendDummyInput().appendField('LEDs').appendField(integer(8,1,255),'COUNT');},'WS2812-compatible RGB strip. The LED count allocates storage once: 3 bytes per LED; ATmega168 has 1024 bytes total. Pixel index, RGB values and brightness accept variables. Changes appear after show.');
  define('device_oled','OLED','SSD1306 I2C OLED','oled',function(){this.appendDummyInput().appendField(new Blockly.FieldDropdown([['128x32','32'],['128x64','64']]),'MODEL').appendField('address').appendField(new Blockly.FieldDropdown([['0x3C','0x3C'],['0x3D','0x3D']]),'ADDR');},'SSD1306 I2C text display using U8x8, without a framebuffer. Pro Mini: SDA=A4, SCL=A5; 16 character columns, 4 or 8 rows.');
  define('device_oled_spi','OLED','SSD1306 SPI OLED','oled',function(){var i=this.appendDummyInput();pfield(i,'CS','CS');pfield(i,'DC','DC');pfield(i,'RESET','RESET');this.setFieldValue('10','CS');this.setFieldValue('9','DC');this.setFieldValue('8','RESET');},'SSD1306 128x64 SPI text display with no framebuffer. Pro Mini MOSI=D11 and SCK=D13. 16 character columns, 8 rows; use OLED print and clear actions.');
  define('device_tft','TFT','ST7735 SPI TFT','tft',function(){var i=this.appendDummyInput();pfield(i,'CS','CS');pfield(i,'DC','DC');pfield(i,'RESET','RESET');this.setFieldValue('10','CS');this.setFieldValue('9','DC');this.setFieldValue('8','RESET');this.appendDummyInput().appendField('panel').appendField(new Blockly.FieldDropdown([['black tab','INITR_BLACKTAB'],['red tab','INITR_REDTAB'],['green tab','INITR_GREENTAB']]),'TAB').appendField('rotation').appendField(new Blockly.FieldDropdown([['0°','0'],['90°','1'],['180°','2'],['270°','3']]),'ROTATION');},'ST7735 128x160 TFT using hardware SPI. Pro Mini MOSI=D11, SCK=D13. Panel tab type changes offsets and colour order; pick the type matching your module. Coordinates are pixels.');
  define('device_ir_nec','IR receiver','NEC IR receiver','remote',function(){pfield(this.appendDummyInput(),'data','PIN');this.setFieldValue('2','PIN');},'NEC protocol IR receiver. One active receiver is supported by IRremote. Read the command frequently; this consumes the next received frame.');
  define('device_shift595','shift register','74HC595','outputs',function(){var i=this.appendDummyInput();pfield(i,'DATA','DATA');pfield(i,'CLOCK','CLOCK');pfield(i,'LATCH','LATCH');this.setFieldValue('8','DATA');this.setFieldValue('9','CLOCK');this.setFieldValue('10','LATCH');},'One 74HC595, MSB first. Connect OE to ground and MR to supply if not controlled separately.');

  stmt('device_stepper_move','stepper','move',function(){this.appendDummyInput().appendField(new Blockly.FieldDropdown([['to position','TO'],['by steps','BY']]),'MODE');this.appendValueInput('VALUE').setCheck('Number');},'Set a target in steps. This does not wait for motion; call run in every loop pass. Relative movement starts from the current position.');
  A.device_stepper_move=function(){var c=resolve(this,'stepper');return name(c)+'.'+(this.getFieldValue('MODE')==='BY'?'move':'moveTo')+'('+val(this,'VALUE','0')+');\n';};
  stmt('device_stepper_run','stepper','run',null,'Call on every loop pass. Emits a step only when due, with acceleration and deceleration. Long delays or slow sensor reads interrupt smooth movement.');
  A.device_stepper_run=function(){return name(resolve(this,'stepper'))+'.run();\n';};
  stmt('device_stepper_setting','stepper','set',function(){this.appendDummyInput().appendField(new Blockly.FieldDropdown([['max speed (steps/s)','SPEED'],['acceleration (steps/s²)','ACCEL']]),'SETTING');this.appendValueInput('VALUE').setCheck('Number');},'Change the maximum speed or acceleration while the program runs. Connect a number, variable or calculation; use a positive value. The definition fields are only the initial settings.');
  A.device_stepper_setting=function(){return name(resolve(this,'stepper'))+'.'+(this.getFieldValue('SETTING')==='SPEED'?'setMaxSpeed':'setAcceleration')+'('+val(this,'VALUE','200')+');\n';};
  out('device_stepper_position','stepper','',function(){this.appendDummyInput().appendField(new Blockly.FieldDropdown([['position','POSITION'],['steps remaining','DISTANCE']]),'READ');},'Current position or signed steps remaining. Zero steps remaining means the target was reached.');
  A.device_stepper_position=function(){return [name(resolve(this,'stepper'))+'.'+(this.getFieldValue('READ')==='DISTANCE'?'distanceToGo':'currentPosition')+'()',A.ORDER_ATOMIC];};
  stmt('device_stepper_stop','stepper','stop',null,'Decelerate to a stop. Keep calling run until motion has stopped.');
  A.device_stepper_stop=function(){return name(resolve(this,'stepper'))+'.stop();\n';};
  stmt('device_servo_write','servo','set',function(){this.appendValueInput('ANGLE').setCheck('Number').appendField('value');},'Set servo angle from 0 to 180 degrees. Allow settling time before taking a range measurement.');
  A.device_servo_write=function(){return name(resolve(this,'servo'))+'.write('+val(this,'ANGLE','90')+');\n';};
  stmt('device_lcd_print','LCD','print',function(){this.appendValueInput('TEXT').appendField('value');this.appendValueInput('COL').setCheck('Number').appendField('column');this.appendValueInput('ROW').setCheck('Number').appendField('row');},'Print text or a number at a zero-based column and row. Printing a shorter value leaves old trailing characters; clear the row or pad with spaces.');
  A.device_lcd_print=function(){var n=name(resolve(this,'LCD'));return n+'.setCursor('+val(this,'COL','0')+', '+val(this,'ROW','0')+');\n'+n+'.print('+val(this,'TEXT','""')+');\n';};
  stmt('device_lcd_clear','LCD','clear',null,'Clear all rows and return the cursor to the top-left. Avoid clearing every fast loop pass to reduce flicker.');
  A.device_lcd_clear=function(){return name(resolve(this,'LCD'))+'.clear();\n';};
  stmt('device_lcd_clear_row','LCD','clear row',function(){this.appendValueInput('ROW').setCheck('Number');},'Overwrite one zero-based LCD row with spaces. The configured display width is reused.');
  A.device_lcd_clear_row=function(){var c=resolve(this,'LCD'),n=name(c);return n+'.setCursor(0, '+val(this,'ROW','0')+');\nfor (uint8_t col = 0; col < '+c.getFieldValue('COLS')+'; ++col) '+n+'.print(\' \');\n';};
  stmt('device_lcd_backlight','LCD','backlight',function(){this.appendValueInput('ENABLED').setCheck('Boolean').appendField('on?');this.appendDummyInput('LEGACY_STATE').appendField(new Blockly.FieldDropdown([['on','ON'],['off','OFF']]),'STATE').setVisible(false);},'Turn the backlight on when the connected Boolean value is true, off when false. Drag in a variable, comparison or true/false block. Older saved projects retain their on/off selection.');
  A.device_lcd_backlight=function(){var n=name(resolve(this,'LCD')),enabled=A.valueToCode(this,'ENABLED',A.ORDER_NONE);return enabled?'if ('+enabled+') { '+n+'.backlight(); } else { '+n+'.noBacklight(); }\n':n+'.'+(this.getFieldValue('STATE')==='ON'?'backlight':'noBacklight')+'();\n';};
  out('device_ultrasonic_read','range sensor','distance cm',null,'Return distance in centimetres, or -1 when no echo arrives within 30 ms. Space measurements by at least 60 ms.');
  A.device_ultrasonic_read=function(){return [name(resolve(this,'range sensor'))+'_read()',A.ORDER_ATOMIC];};
  stmt('device_ds_request','temperature bus','request conversion',null,'Start temperature conversion without waiting. Read the result after up to 750 ms; millis-based timing lets other work continue.');
  A.device_ds_request=function(){return name(resolve(this,'temperature bus'))+'.requestTemperatures();\n';};
  out('device_ds_read','temperature bus','temperature °C',function(){this.appendValueInput('INDEX').setCheck('Number').appendField('sensor #');},'Read the last completed DS18B20 conversion. Sensor index starts at zero; -127 indicates disconnected. Request conversion first and allow up to 750 ms.');
  A.device_ds_read=function(){return [name(resolve(this,'temperature bus'))+'.getTempCByIndex('+val(this,'INDEX','0')+')',A.ORDER_ATOMIC];};
  out('device_dht_read','DHT','',function(){this.appendDummyInput().appendField(new Blockly.FieldDropdown([['temperature °C','TEMP'],['humidity %','HUM']]),'READ');},'Read temperature or humidity from the configured DHT. Read at most every two seconds; NaN indicates a failed reading.');
  A.device_dht_read=function(){return [name(resolve(this,'DHT'))+'.'+(this.getFieldValue('READ')==='HUM'?'readHumidity':'readTemperature')+'()',A.ORDER_ATOMIC];};
  stmt('device_pixels_set','pixels','set pixel',function(){this.appendValueInput('INDEX').setCheck('Number').appendField('#');this.appendValueInput('R').setCheck('Number').appendField('red');this.appendValueInput('G').setCheck('Number').appendField('green');this.appendValueInput('B').setCheck('Number').appendField('blue');},'Set one pixel in RAM. Index starts at zero; RGB components are 0–255. Call show to send changes to the strip.');
  A.device_pixels_set=function(){var n=name(resolve(this,'pixels'));return n+'.setPixelColor('+val(this,'INDEX','0')+', '+val(this,'R','0')+', '+val(this,'G','0')+', '+val(this,'B','0')+');\n';};
  stmt('device_pixels_show','pixels','show',null,'Send the pending pixel colours to the LED strip.');A.device_pixels_show=function(){return name(resolve(this,'pixels'))+'.show();\n';};
  stmt('device_pixels_clear','pixels','clear',null,'Set all stored pixel colours to black. Call show afterwards to update the strip.');A.device_pixels_clear=function(){return name(resolve(this,'pixels'))+'.clear();\n';};
  stmt('device_oled_print','OLED','print',function(){this.appendValueInput('TEXT').appendField('value');this.appendValueInput('COL').setCheck('Number').appendField('column');this.appendValueInput('ROW').setCheck('Number').appendField('row');},'Print text or a number in an 8x8 character cell. Columns start at zero; maximum column is 15. Rows are 0–3 or 0–7.');
  A.device_oled_print=function(){var n=name(resolve(this,'OLED'));return n+'.setCursor('+val(this,'COL','0')+', '+val(this,'ROW','0')+');\n'+n+'.print('+val(this,'TEXT','""')+');\n';};
  stmt('device_oled_clear','OLED','clear',null,'Clear the configured OLED text display.');A.device_oled_clear=function(){return name(resolve(this,'OLED'))+'.clearDisplay();\n';};
  stmt('device_shift595_write','shift register','write byte',function(){this.appendValueInput('VALUE').setCheck('Number');},'Send an 8-bit value (0–255) to the configured 74HC595 outputs.');A.device_shift595_write=function(){return name(resolve(this,'shift register'))+'_write('+val(this,'VALUE','0')+');\n';};
  out('device_tft_colour','TFT','RGB colour',function(){this.appendValueInput('R').setCheck('Number').appendField('red');this.appendValueInput('G').setCheck('Number').appendField('green');this.appendValueInput('B').setCheck('Number').appendField('blue');},'Convert red, green and blue (0–255 each) into the 16-bit colour used by TFT drawing blocks.');
  A.device_tft_colour=function(){return [name(resolve(this,'TFT'))+'.color565('+val(this,'R','255')+', '+val(this,'G','255')+', '+val(this,'B','255')+')',A.ORDER_ATOMIC];};
  stmt('device_tft_fill','TFT','fill screen',function(){this.appendValueInput('COLOUR').setCheck('Number').appendField('colour');},'Fill the whole TFT with a 16-bit colour. Zero is black and 65535 is white.');
  A.device_tft_fill=function(){return name(resolve(this,'TFT'))+'.fillScreen('+val(this,'COLOUR','0')+');\n';};
  stmt('device_tft_print','TFT','print',function(){this.appendValueInput('TEXT').appendField('value');this.appendValueInput('X').setCheck('Number').appendField('x');this.appendValueInput('Y').setCheck('Number').appendField('y');this.appendValueInput('COLOUR').setCheck('Number').appendField('colour');this.appendValueInput('SIZE').setCheck('Number').appendField('size');this.appendDummyInput('LEGACY_SIZE').appendField(integer(1,1,8),'SIZE').setVisible(false);},'Print at pixel coordinates. Size accepts a number, variable or calculation; 1 is 6x8 pixels, 2 is twice as large. Text uses a black background. Clear or pad trailing characters when printing shorter text.');
  A.device_tft_print=function(){var n=name(resolve(this,'TFT'));return n+'.setCursor('+val(this,'X','0')+', '+val(this,'Y','0')+');\n'+n+'.setTextSize('+val(this,'SIZE',this.getFieldValue('SIZE')||'1')+');\n'+n+'.setTextColor('+val(this,'COLOUR','65535')+', ST77XX_BLACK);\n'+n+'.print('+val(this,'TEXT','""')+');\n';};
  stmt('device_tft_pixel','TFT','pixel',function(){this.appendValueInput('X').setCheck('Number').appendField('x');this.appendValueInput('Y').setCheck('Number').appendField('y');this.appendValueInput('COLOUR').setCheck('Number').appendField('colour');},'Draw one pixel. Coordinates outside the screen are clipped.');
  A.device_tft_pixel=function(){return name(resolve(this,'TFT'))+'.drawPixel('+val(this,'X','0')+', '+val(this,'Y','0')+', '+val(this,'COLOUR','65535')+');\n';};
  stmt('device_tft_line','TFT','line',function(){this.appendValueInput('X1').setCheck('Number').appendField('from x');this.appendValueInput('Y1').setCheck('Number').appendField('y');this.appendValueInput('X2').setCheck('Number').appendField('to x');this.appendValueInput('Y2').setCheck('Number').appendField('y');this.appendValueInput('COLOUR').setCheck('Number').appendField('colour');},'Draw a line between two pixel coordinates. Useful for a radar sweep or graph.');
  A.device_tft_line=function(){return name(resolve(this,'TFT'))+'.drawLine('+val(this,'X1','0')+', '+val(this,'Y1','0')+', '+val(this,'X2','100')+', '+val(this,'Y2','100')+', '+val(this,'COLOUR','65535')+');\n';};
  out('device_ir_command','IR receiver','read command',null,'Consume the next NEC frame and return its command (0–65535), or -1 if nothing arrived. Store the result once, then compare the variable with command numbers.');
  A.device_ir_command=function(){return [name(resolve(this,'IR receiver'))+'_read()',A.ORDER_ATOMIC];};
  stmt('device_tft_rotation','TFT','rotation',function(){this.appendValueInput('VALUE').setCheck('Number').appendField('quarter turns');},'Change screen orientation while running: 0, 1, 2 or 3 quarter turns. Connect a number, variable or calculation. Drawing coordinates use the new orientation; existing pixels are not redrawn.');
  A.device_tft_rotation=function(){return name(resolve(this,'TFT'))+'.setRotation('+val(this,'VALUE','0')+');\n';};
  stmt('device_pixels_brightness','pixels','brightness',function(){this.appendValueInput('VALUE').setCheck('Number').appendField('0–255');},'Set strip brightness from a number, variable or calculation: 0 is dark, 255 is full. Set before assigning pixel colours, then show. Repeatedly scaling existing colours loses precision; redraw them for each animation frame.');
  A.device_pixels_brightness=function(){return name(resolve(this,'pixels'))+'.setBrightness('+val(this,'VALUE','64')+');\n';};
  Blockly.DeviceRegistry={field:field,resolve:resolve,ensure:ensure,name:name,configKinds:configs,uid:uid};
}());
