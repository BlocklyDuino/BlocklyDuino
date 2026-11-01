/* Local beginner blocks for the installed BlocklyDuino editor. */
(function () {
  'use strict';

  var sensorPins = [['D2', '2'], ['D3', '3'], ['D4', '4'], ['D5', '5'],
                    ['D6', '6'], ['D7', '7'], ['D8', '8']];

  Blockly.Blocks['ds18b20_temperature'] = {
    init: function () {
      this.setColour(110);
      this.appendDummyInput()
          .appendField('DS18B20 °C on')
          .appendField(new Blockly.FieldDropdown(sensorPins), 'PIN');
      this.setOutput(true, 'Number');
      this.setTooltip('Read the first DS18B20 on this pin. Use a 4.7 kΩ pull-up to VCC.');
    }
  };

  Blockly.Arduino.ds18b20_temperature = function () {
    var pin = this.getFieldValue('PIN');
    Blockly.Arduino.definitions_['ds18b20_include_onewire'] = '#include <OneWire.h>';
    Blockly.Arduino.definitions_['ds18b20_include_dallas'] = '#include <DallasTemperature.h>';
    Blockly.Arduino.definitions_['ds18b20_' + pin] =
        'OneWire oneWire_' + pin + '(' + pin + ');\n' +
        'DallasTemperature ds18b20_' + pin + '(&oneWire_' + pin + ');\n' +
        'float readDS18B20_' + pin + '() {\n' +
        '  ds18b20_' + pin + '.requestTemperatures();\n' +
        '  return ds18b20_' + pin + '.getTempCByIndex(0);\n' +
        '}';
    Blockly.Arduino.setups_['ds18b20_' + pin] = 'ds18b20_' + pin + '.begin();';
    return ['readDS18B20_' + pin + '()', Blockly.Arduino.ORDER_ATOMIC];
  };

  Blockly.Blocks['lcd1602_i2c_print'] = {
    init: function () {
      var addresses = [];
      for (var n = 0x20; n <= 0x27; n++) {
        var hex = '0x' + n.toString(16).toUpperCase();
        addresses.push([hex, hex]);
      }
      for (var m = 0x38; m <= 0x3F; m++) {
        var hexA = '0x' + m.toString(16).toUpperCase();
        addresses.push([hexA, hexA]);
      }
      // The common unmodified backpack address is first.
      addresses.unshift(addresses.splice(7, 1)[0]);
      this.setColour(270);
      this.appendDummyInput()
          .appendField('LCD 16x2 I2C')
          .appendField(new Blockly.FieldDropdown(addresses), 'ADDR')
          .appendField('row')
          .appendField(new Blockly.FieldDropdown([['0', '0'], ['1', '1']]), 'ROW');
      this.appendValueInput('CONTENT').appendField('print');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('Print at the start of a 16x2 I2C LCD row. A4=SDA, A5=SCL on Pro Mini.');
    }
  };

  Blockly.Arduino.lcd1602_i2c_print = function () {
    var address = this.getFieldValue('ADDR');
    var suffix = address.substring(2);
    var row = this.getFieldValue('ROW');
    var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_NONE) || '""';
    var lcd = 'lcd_' + suffix;
    Blockly.Arduino.definitions_['lcd_include_wire'] = '#include <Wire.h>';
    Blockly.Arduino.definitions_['lcd_include_lcd'] = '#include <LiquidCrystal_I2C.h>';
    Blockly.Arduino.definitions_['lcd_object_' + suffix] =
        'LiquidCrystal_I2C ' + lcd + '(' + address + ', 16, 2);';
    Blockly.Arduino.setups_['lcd_start_' + suffix] = lcd + '.init();\n  ' + lcd + '.backlight();';
    return lcd + '.setCursor(0, ' + row + ');\n' + lcd + '.print(' + content + ');\n';
  };

  Blockly.Blocks['i2c_scan_serial'] = {
    init: function () {
      this.setColour(110);
      this.appendDummyInput().appendField('I2C scan → Serial 9600');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('Show responding I2C addresses in Serial Monitor every 2 seconds.');
    }
  };

  Blockly.Arduino.i2c_scan_serial = function () {
    Blockly.Arduino.definitions_['i2c_scan_wire'] = '#include <Wire.h>';
    Blockly.Arduino.setups_['i2c_scan_start'] = 'Wire.begin();\n  Serial.begin(9600);';
    return 'Serial.println("I2C scan:");\n' +
           'for (uint8_t address = 1; address < 127; ++address) {\n' +
           '  Wire.beginTransmission(address);\n' +
           '  if (Wire.endTransmission() == 0) {\n' +
           '    Serial.print("0x");\n' +
           '    if (address < 16) Serial.print("0");\n' +
           '    Serial.println(address, HEX);\n' +
           '  }\n' +
           '}\n' +
           'delay(2000);\n';
  };

  Blockly.Blocks['oled_ssd1306_091_i2c_print'] = {
    init: function () {
      this.setColour(290);
      this.appendDummyInput()
          .appendField('0.91" SSD1306 I2C OLED')
          .appendField(new Blockly.FieldDropdown([['0x3C', '0x3C'], ['0x3D', '0x3D']]), 'ADDR')
          .appendField('row')
          .appendField(new Blockly.FieldDropdown([
            ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3']]), 'ROW');
      this.appendValueInput('CONTENT').appendField('print');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('For a 128x32 4-pin I2C OLED: SDA A4, SCL A5 on Pro Mini.');
    }
  };

  Blockly.Arduino.oled_ssd1306_091_i2c_print = function () {
    var address = this.getFieldValue('ADDR');
    var row = this.getFieldValue('ROW');
    var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_NONE) || '""';
    Blockly.Arduino.definitions_['oled091_include'] = '#include <U8x8lib.h>';
    Blockly.Arduino.definitions_['oled091_object'] =
        'U8X8_SSD1306_128X32_UNIVISION_HW_I2C oled091(U8X8_PIN_NONE);';
    Blockly.Arduino.setups_['oled091_start'] =
        'oled091.setI2CAddress(' + address + ' * 2);\n  oled091.begin();\n  ' +
        'oled091.setFont(u8x8_font_chroma48medium8_r);';
    return 'oled091.clearLine(' + row + ');\n' +
           'oled091.setCursor(0, ' + row + ');\n' +
           'oled091.print(' + content + ');\n';
  };

  function ensureGroveRgbLcd() {
    Blockly.Arduino.definitions_['grove_rgb_wire'] = '#include <Wire.h>';
    Blockly.Arduino.definitions_['grove_rgb_include'] = '#include <rgb_lcd.h>';
    Blockly.Arduino.definitions_['grove_rgb_object'] = 'rgb_lcd groveRgbLcd;';
    Blockly.Arduino.setups_['grove_rgb_start'] = 'groveRgbLcd.begin(16, 2);';
  }

  Blockly.Blocks['grove_rgb_lcd_color'] = {
    init: function () {
      this.setColour(270);
      this.appendDummyInput()
          .appendField('Grove RGB LCD color')
          .appendField(new Blockly.FieldDropdown([
            ['blue', '0, 0, 255'], ['red', '255, 0, 0'],
            ['green', '0, 255, 0'], ['white', '255, 255, 255']]), 'RGB');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('For Grove RGB LCD, not a PCF8574 backpack LCD.');
    }
  };

  Blockly.Arduino.grove_rgb_lcd_color = function () {
    ensureGroveRgbLcd();
    return 'groveRgbLcd.setRGB(' + this.getFieldValue('RGB') + ');\n';
  };

  Blockly.Blocks['grove_rgb_lcd_print'] = {
    init: function () {
      this.setColour(270);
      this.appendDummyInput()
          .appendField('Grove RGB LCD row')
          .appendField(new Blockly.FieldDropdown([['0', '0'], ['1', '1']]), 'ROW');
      this.appendValueInput('CONTENT').appendField('print');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('JHD1313/Grove RGB LCD with I2C addresses 0x3E and 0x62.');
    }
  };

  Blockly.Arduino.grove_rgb_lcd_print = function () {
    ensureGroveRgbLcd();
    var row = this.getFieldValue('ROW');
    var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_NONE) || '""';
    return 'groveRgbLcd.setCursor(0, ' + row + ');\n' +
           'groveRgbLcd.print(' + content + ');\n';
  };

  Blockly.Blocks['oled_ssd1306_spi_print'] = {
    init: function () {
      this.setColour(290);
      this.appendDummyInput()
          .appendField('SSD1306 SPI OLED row')
          .appendField(new Blockly.FieldDropdown([
            ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'],
            ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7']]), 'ROW');
      this.appendValueInput('CONTENT').appendField('print');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('SSD1306 128x64 4-wire SPI: MOSI D11, SCK D13, CS D10, DC D9, RST D8.');
    }
  };

  Blockly.Arduino.oled_ssd1306_spi_print = function () {
    var row = this.getFieldValue('ROW');
    var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_NONE) || '""';
    Blockly.Arduino.definitions_['u8x8_include'] = '#include <U8x8lib.h>';
    Blockly.Arduino.definitions_['u8x8_object'] =
        'U8X8_SSD1306_128X64_NONAME_4W_HW_SPI oled(10, 9, 8);';
    Blockly.Arduino.setups_['u8x8_start'] =
        'oled.begin();\n  oled.setFont(u8x8_font_chroma48medium8_r);';
    return 'oled.clearLine(' + row + ');\n' +
           'oled.setCursor(0, ' + row + ');\n' +
           'oled.print(' + content + ');\n';
  };

  Blockly.Blocks['tft_st7735_spi_print'] = {
    init: function () {
      this.setColour(310);
      this.appendDummyInput()
          .appendField('ST7735 SPI TFT row')
          .appendField(new Blockly.FieldDropdown([
            ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'],
            ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7']]), 'ROW');
      this.appendValueInput('CONTENT').appendField('print');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('ST7735 128x160 4-wire SPI: MOSI D11, SCK D13, CS D10, DC D9, RST D8.');
    }
  };

  Blockly.Arduino.tft_st7735_spi_print = function () {
    var row = this.getFieldValue('ROW');
    var y = Number(row) * 16;
    var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_NONE) || '""';
    Blockly.Arduino.definitions_['tft_include'] = '#include <Adafruit_ST7735.h>';
    Blockly.Arduino.definitions_['tft_object'] = 'Adafruit_ST7735 tft(10, 9, 8);';
    Blockly.Arduino.setups_['tft_start'] =
        'tft.initR(INITR_BLACKTAB);\n  tft.setRotation(1);\n  ' +
        'tft.fillScreen(ST77XX_BLACK);\n  tft.setTextColor(ST77XX_WHITE);\n  ' +
        'tft.setTextSize(1);';
    return 'tft.fillRect(0, ' + y + ', 160, 12, ST77XX_BLACK);\n' +
           'tft.setCursor(0, ' + y + ');\n' +
           'tft.print(' + content + ');\n';
  };
}());
