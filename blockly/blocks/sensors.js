Blockly.Blocks['temp_TMP36'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
              .appendField("Temperature read PIN#")
              .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN")
        .appendField("Unit")
        .appendField(new Blockly.FieldDropdown([["Celcius", "Celcius"], ["Farenheit", "Farenheit"]]), "Unit");
    this.setOutput(true, 'Number');
    this.setTooltip('Read temperature value from sensor TMP36');
  }
};
