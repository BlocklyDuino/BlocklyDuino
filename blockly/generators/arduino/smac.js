goog.provide('Blockly.Arduino.smac');

goog.require('Blockly.Arduino');


Blockly.Arduino.run_bot = function() {
	Blockly.Arduino.setups_['setup_trigger'] = 'pinMode(7, INPUT);';
	var argument0 = Blockly.Arduino.statementToCode(this, 'RUN');
	return 'boolean check = digitalRead(7);\nif(check == HIGH) {\n' + argument0 + '}';
};

Blockly.Arduino.turn_left = function() {
	Blockly.Arduino.setups_['setup_output_13'] = 'pinMode(13, OUTPUT);';
	var code = 'digitalWrite(13, HIGH);\ndelay(500);\ndigitalWrite(13, LOW);\ndelay(500);\ndigitalWrite(13, HIGH);\ndelay(500);\ndigitalWrite(13, LOW);\ndelay(500);\ndigitalWrite(13, HIGH);\ndelay(500);\ndigitalWrite(13, LOW);\ndelay(500);\n'
	return code;
};

Blockly.Arduino.turn_right = function() {
	Blockly.Arduino.setups_['setup_output_13'] = 'pinMode(13, OUTPUT);';
	var code = 'digitalWrite(13, HIGH);\ndelay(1000);\ndigitalWrite(13, LOW);\ndelay(1000);\ndigitalWrite(13, HIGH);\ndelay(1000);\ndigitalWrite(13, LOW);\ndelay(1000);\ndigitalWrite(13, HIGH);\ndelay(1000);\ndigitalWrite(13, LOW);\ndelay(1000);\n'
	return code;
};