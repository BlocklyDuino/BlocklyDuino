goog.provide('Blockly.Arduino.myblock');

goog.require('Blockly.Arduino');


Blockly.Arduino.my_base_delay_example = function() {
	var delay_time = Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000'
	var code = 'delay(' + delay_time + ');\n';
	return code;
};
