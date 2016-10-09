'use strict';

goog.provide('Blockly.Arduino.oled');

goog.require('Blockly.Arduino');

function oledInit(params) {
  Blockly.Arduino.definitions_['oled_i2c'] = '#include <OLED_I2C.h>';
  Blockly.Arduino.definitions_['oled_init'] = 'OLED myOLED(SDA, SCL, 8);'
  Blockly.Arduino.setups_['oled_begin'] = 'myOLED.begin();';
  if (typeof(params) === 'undefined') {
    return;
  }

  if (params.indexOf('smallFont') !== -1) {
    Blockly.Arduino.definitions_['oled_small_font'] = 'extern uint8_t SmallFont[];'
    Blockly.Arduino.setups_['oled_set_font'] = 'myOLED.setFont(SmallFont);';
  }
}

Blockly.Arduino['oled_clear'] = function () {
  oledInit();
  return 'myOLED.clrScr();';
};

Blockly.Arduino['oled_update'] = function () {
  oledInit();
  return 'myOLED.update();';
};

Blockly.Arduino['oled_invert'] = function () {
  oledInit();
  var checkbox_stat = this.getFieldValue('invert').toLowerCase();
  return 'myOLED.invert(' + checkbox_stat + ');';
};

Blockly.Arduino['oled_print'] = function () {
  oledInit(['smallFont']);
  var text_stat = this.getFieldValue('text');
  var x_stat = this.getFieldValue('x');
  var y_stat = this.getFieldValue('y');
  return 'myOLED.print("' + text_stat + '", ' + x_stat + ', ' + y_stat + ');';
};

Blockly.Arduino['oled_draw_bitmap'] = function () {
  oledInit();
  var image_stat = Blockly.Arduino.valueToCode(this, 'image', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var x_stat = this.getFieldValue('x');
  var y_stat = this.getFieldValue('y');
  var w_stat = this.getFieldValue('w');
  var h_stat = this.getFieldValue('h');
  Blockly.Arduino.definitions_['oled_image_' + image_stat] = 'extern uint8_t ' + image_stat + '[];';
  return 'myOLED.drawBitmap(' + x_stat + ', ' + y_stat + ', ' + image_stat + ', ' + w_stat + ', ' + h_stat + ');';
};

['kidspeak', 'tretton37'].forEach(function (img, index) {
  var id = 'oled_image_' + img;
  Blockly.Arduino[id] = function () {
    return [img, Blockly.Arduino.ORDER_ATOMIC];
  };
});