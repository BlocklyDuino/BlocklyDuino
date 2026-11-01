/* Editable 20x4 I2C LCD animation blocks for the local BlocklyDuino. */
(function () {
  'use strict';

  function ascii(text, maxLength) {
    return String(text).replace(/[^\x20-\x7e]/g, '?').slice(0, maxLength);
  }

  function ensureLcd() {
    Blockly.Arduino.definitions_['lcd20_wire'] = '#include <Wire.h>';
    Blockly.Arduino.definitions_['lcd20_library'] = '#include <LiquidCrystal_I2C.h>';
    Blockly.Arduino.definitions_['lcd20_object'] =
        'LiquidCrystal_I2C lcd20(0x27, 20, 4);';
    Blockly.Arduino.setups_['lcd20_start'] =
        'lcd20.init();\n  lcd20.backlight();';
  }

  function statementBlock(name, label, fieldName, initialText, hint) {
    Blockly.Blocks[name] = {
      init: function () {
        this.setColour(270);
        var input = this.appendDummyInput().appendField(label);
        if (fieldName) {
          input.appendField(new Blockly.FieldTextInput(initialText), fieldName);
        }
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(hint);
      }
    };
  }

  statementBlock('lcd20x4_title', 'LCD 20x4 0x27 · title row', 'TEXT',
      '+++ ARDUINO SHOW +++', 'LCD SDA=A4, SCL=A5 on Pro Mini. Top row text, up to 20 ASCII characters.');
  Blockly.Arduino.lcd20x4_title = function () {
    ensureLcd();
    var title = JSON.stringify(ascii(this.getFieldValue('TEXT'), 20));
    Blockly.Arduino.setups_['lcd20_title'] =
        'lcd20.setCursor(0, 0);\n  lcd20.print(' + title + ');';
    return '';
  };

  statementBlock('lcd20x4_bounce', 'row 2 · bouncing text', 'TEXT',
      'HELLO, WORLD!', 'Move text back and forth. Up to 20 ASCII characters.');
  Blockly.Arduino.lcd20x4_bounce = function () {
    ensureLcd();
    var greeting = JSON.stringify(ascii(this.getFieldValue('TEXT'), 20));
    Blockly.Arduino.definitions_['lcd20_bounce'] =
        'const char lcdBounceText[] = ' + greeting + ';\n' +
        'uint8_t lcdBounceX = 0;\n' +
        'int8_t lcdBounceDirection = 1;\n' +
        'void lcdBounceStep() {\n' +
        '  char row[21];\n' +
        '  for (uint8_t i = 0; i < 20; ++i) row[i] = \' \';\n' +
        '  row[20] = 0;\n' +
        '  const uint8_t length = sizeof(lcdBounceText) - 1;\n' +
        '  for (uint8_t i = 0; i < length; ++i) row[lcdBounceX + i] = lcdBounceText[i];\n' +
        '  lcd20.setCursor(0, 1);\n' +
        '  lcd20.print(row);\n' +
        '  const uint8_t limit = 20 - length;\n' +
        '  if (limit == 0) return;\n' +
        '  if (lcdBounceX == 0) lcdBounceDirection = 1;\n' +
        '  if (lcdBounceX == limit) lcdBounceDirection = -1;\n' +
        '  lcdBounceX += lcdBounceDirection;\n' +
        '}';
    return 'lcdBounceStep();\n';
  };

  statementBlock('lcd20x4_ticker', 'row 3 · scrolling text', 'TEXT',
      'TEXT MOVES ACROSS THE LCD!', 'Scroll text horizontally. Use ASCII characters.');
  Blockly.Arduino.lcd20x4_ticker = function () {
    ensureLcd();
    var ticker = JSON.stringify('   ' + ascii(this.getFieldValue('TEXT'), 60) + '   ');
    Blockly.Arduino.definitions_['lcd20_ticker'] =
        'const char lcdTickerText[] = ' + ticker + ';\n' +
        'uint8_t lcdTickerOffset = 0;\n' +
        'void lcdTickerStep() {\n' +
        '  char row[21];\n' +
        '  const uint8_t length = sizeof(lcdTickerText) - 1;\n' +
        '  for (uint8_t i = 0; i < 20; ++i)\n' +
        '    row[i] = lcdTickerText[(lcdTickerOffset + i) % length];\n' +
        '  row[20] = 0;\n' +
        '  lcd20.setCursor(0, 2);\n' +
        '  lcd20.print(row);\n' +
        '  lcdTickerOffset = (lcdTickerOffset + 1) % length;\n' +
        '}';
    return 'lcdTickerStep();\n';
  };

  statementBlock('lcd20x4_heart', 'row 4 · moving heart', null, null,
      'Create a heart glyph and move it back and forth.');
  Blockly.Arduino.lcd20x4_heart = function () {
    ensureLcd();
    Blockly.Arduino.definitions_['lcd20_heart'] =
        'byte lcdHeartGlyph[8] = {B00000, B01010, B11111, B11111, B11111, B01110, B00100, B00000};\n' +
        'uint8_t lcdHeartX = 19;\n' +
        'uint8_t lcdPreviousHeartX = 19;\n' +
        'int8_t lcdHeartDirection = -1;\n' +
        'void lcdHeartStep() {\n' +
        '  lcd20.setCursor(lcdPreviousHeartX, 3);\n' +
        '  lcd20.print(\' \');\n' +
        '  lcd20.setCursor(lcdHeartX, 3);\n' +
        '  lcd20.write(byte(0));\n' +
        '  lcdPreviousHeartX = lcdHeartX;\n' +
        '  if (lcdHeartX == 0) lcdHeartDirection = 1;\n' +
        '  if (lcdHeartX == 19) lcdHeartDirection = -1;\n' +
        '  lcdHeartX += lcdHeartDirection;\n' +
        '}';
    Blockly.Arduino.setups_['lcd20_heart_start'] =
        'lcd20.createChar(0, lcdHeartGlyph);\n  lcd20.setCursor(19, 3);\n  lcd20.write(byte(0));';
    return 'lcdHeartStep();\n';
  };

  // General-purpose LCD blocks. These work independently of the animation above.
  var addresses = [];
  for (var a = 0x20; a <= 0x27; ++a) addresses.push(['0x' + a.toString(16).toUpperCase(), '0x' + a.toString(16).toUpperCase()]);
  for (var b = 0x38; b <= 0x3F; ++b) addresses.push(['0x' + b.toString(16).toUpperCase(), '0x' + b.toString(16).toUpperCase()]);
  addresses.unshift(addresses.splice(7, 1)[0]);
  var columns = [];
  for (var c = 0; c < 20; ++c) columns.push([String(c), String(c)]);

  function ensureGeneralLcd() {
    Blockly.Arduino.definitions_['lcd_user_wire'] = '#include <Wire.h>';
    Blockly.Arduino.definitions_['lcd_user_library'] = '#include <LiquidCrystal_I2C.h>';
    if (!Blockly.Arduino.definitions_['lcd_user_object']) {
      Blockly.Arduino.definitions_['lcd_user_object'] = 'LiquidCrystal_I2C lcdUser(0x27, 20, 4);';
    }
    if (!Blockly.Arduino.definitions_['lcd_user_columns']) {
      Blockly.Arduino.definitions_['lcd_user_columns'] = 'const uint8_t lcdUserColumns = 20;';
    }
    if (!Blockly.Arduino.setups_['lcd_user_start']) {
      Blockly.Arduino.setups_['lcd_user_start'] = 'lcdUser.init();\n  lcdUser.backlight();';
    }
  }

  Blockly.Blocks['lcd_user_init'] = {
    init: function () {
      this.setColour(270);
      this.appendDummyInput().appendField('I2C LCD start')
          .appendField(new Blockly.FieldDropdown(addresses), 'ADDR')
          .appendField(new Blockly.FieldDropdown([['20', '20'], ['16', '16']]), 'COLS')
          .appendField('x')
          .appendField(new Blockly.FieldDropdown([['4', '4'], ['2', '2']]), 'ROWS');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('One PCF8574 I2C text LCD. Pro Mini: SDA A4, SCL A5.');
    }
  };
  Blockly.Arduino.lcd_user_init = function () {
    ensureGeneralLcd();
    Blockly.Arduino.definitions_['lcd_user_object'] =
        'LiquidCrystal_I2C lcdUser(' + this.getFieldValue('ADDR') + ', ' +
        this.getFieldValue('COLS') + ', ' + this.getFieldValue('ROWS') + ');';
    Blockly.Arduino.definitions_['lcd_user_columns'] =
        'const uint8_t lcdUserColumns = ' + this.getFieldValue('COLS') + ';';
    return '';
  };

  Blockly.Blocks['lcd_user_print'] = {
    init: function () {
      this.setColour(270);
      this.appendDummyInput().appendField('I2C LCD print')
          .appendField('column').appendField(new Blockly.FieldDropdown(columns), 'COL')
          .appendField('row').appendField(new Blockly.FieldDropdown([
            ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3']]), 'ROW');
      this.appendValueInput('CONTENT').appendField('value');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('Print any text or number at the selected column and row.');
    }
  };
  Blockly.Arduino.lcd_user_print = function () {
    ensureGeneralLcd();
    var value = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_NONE) || '""';
    return 'lcdUser.setCursor(' + this.getFieldValue('COL') + ', ' + this.getFieldValue('ROW') + ');\n' +
           'lcdUser.print(' + value + ');\n';
  };

  Blockly.Blocks['lcd_user_print_at'] = {
    init: function () {
      this.setColour(270);
      this.appendDummyInput().appendField('I2C LCD print at variable position');
      this.appendValueInput('COL').setCheck('Number').appendField('column');
      this.appendValueInput('ROW').setCheck('Number').appendField('row');
      this.appendValueInput('CONTENT').appendField('value');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('Column and row can come from a variable, loop or calculation.');
    }
  };
  Blockly.Arduino.lcd_user_print_at = function () {
    ensureGeneralLcd();
    var col = Blockly.Arduino.valueToCode(this, 'COL', Blockly.Arduino.ORDER_NONE) || '0';
    var row = Blockly.Arduino.valueToCode(this, 'ROW', Blockly.Arduino.ORDER_NONE) || '0';
    var value = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_NONE) || '""';
    return 'lcdUser.setCursor(' + col + ', ' + row + ');\n' +
           'lcdUser.print(' + value + ');\n';
  };

  Blockly.Blocks['lcd_user_clear_row'] = {
    init: function () {
      this.setColour(270);
      this.appendDummyInput().appendField('I2C LCD clear row')
          .appendField(new Blockly.FieldDropdown([
            ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3']]), 'ROW');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('Erase a row using spaces; useful for moving text without clearing the whole screen.');
    }
  };
  Blockly.Arduino.lcd_user_clear_row = function () {
    ensureGeneralLcd();
    return 'lcdUser.setCursor(0, ' + this.getFieldValue('ROW') + ');\n' +
           'for (uint8_t i = 0; i < lcdUserColumns; ++i) lcdUser.print(\' \');\n';
  };

  Blockly.Blocks['lcd_user_heart_at'] = {
    init: function () {
      this.setColour(270);
      this.appendDummyInput().appendField('I2C LCD heart at');
      this.appendValueInput('COL').setCheck('Number').appendField('column');
      this.appendValueInput('ROW').setCheck('Number').appendField('row');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('Draw a custom heart symbol at a variable LCD position.');
    }
  };
  Blockly.Arduino.lcd_user_heart_at = function () {
    ensureGeneralLcd();
    Blockly.Arduino.definitions_['lcd_user_heart'] =
        'byte lcdUserHeart[8] = {B00000, B01010, B11111, B11111, B11111, B01110, B00100, B00000};';
    Blockly.Arduino.setups_['lcd_user_heart_start'] = 'lcdUser.createChar(0, lcdUserHeart);';
    var col = Blockly.Arduino.valueToCode(this, 'COL', Blockly.Arduino.ORDER_NONE) || '0';
    var row = Blockly.Arduino.valueToCode(this, 'ROW', Blockly.Arduino.ORDER_NONE) || '3';
    return 'lcdUser.setCursor(' + col + ', ' + row + ');\n' +
           'lcdUser.write(byte(0));\n';
  };

  Blockly.Blocks['lcd_user_clear'] = {
    init: function () {
      this.setColour(270);
      this.appendDummyInput().appendField('I2C LCD clear');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('Clear the LCD. Doing this on every fast loop can cause flicker.');
    }
  };
  Blockly.Arduino.lcd_user_clear = function () {
    ensureGeneralLcd();
    return 'lcdUser.clear();\n';
  };

  Blockly.Blocks['lcd_user_backlight'] = {
    init: function () {
      this.setColour(270);
      this.appendDummyInput().appendField('I2C LCD backlight')
          .appendField(new Blockly.FieldDropdown([['on', 'on'], ['off', 'off']]), 'STATE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('Turn the LCD backlight on or off.');
    }
  };
  Blockly.Arduino.lcd_user_backlight = function () {
    ensureGeneralLcd();
    return 'lcdUser.' + (this.getFieldValue('STATE') === 'off' ? 'noBacklight' : 'backlight') + '();\n';
  };
}());
