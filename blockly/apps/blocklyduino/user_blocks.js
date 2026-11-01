/* Optional extension template. Add block types to the list to show them in Extensions. */
(function () {
  'use strict';
  window.blocklyduinoUserBlockTypes = [];

  Blockly.Blocks.user_pulse_led = {init: function () {
    this.setColour(65);
    this.appendDummyInput().appendField('pulse LED D13');
    this.appendValueInput('MS').setCheck('Number').appendField('duration ms');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Extension template: turn D13 on, wait, then turn it off.');
  }};
  Blockly.Arduino.user_pulse_led = function () {
    var ms = Blockly.Arduino.valueToCode(this, 'MS', Blockly.Arduino.ORDER_NONE) || '200';
    Blockly.Arduino.setups_['user_pulse_led_pin'] = 'pinMode(13, OUTPUT);';
    return 'digitalWrite(13, HIGH);\n' +
           'delay(' + ms + ');\n' +
           'digitalWrite(13, LOW);\n';
  };
}());
