/*
*Blockly generator code for SMAC robot control
*STORM Lab, VUSE
*/

goog.provide('Blockly.Arduino.smac');

goog.require('Blockly.Arduino');

//run_bot provides the structure within which the robot commands are stacked.
//It requires external input to start the command sequence. This is currently handled by
//pulsing pin PIN on the arduino board to HIGH (>3 V) by means of a wire.
//When the command sequence is started by the input, the commands ordered in the RUN stacked
//are passed to list and then returned as arduino code.
Blockly.Arduino.run_bot = function() {
	var bank = this.getFieldValue('BANK');
	var pin = this.getFieldValue('PIN');
	Blockly.Arduino.setups_['setup_trigger'] = 'pinMode(' + bank + pin + ', INPUT);';	//Setup pin PIN for input to monitor its voltage for the trigger
	var list = Blockly.Arduino.statementToCode(this, 'RUN');		//Pass command stack in RUN into variable list
	return 'boolean check = digitalRead(' + bank + pin + ');\nif(check == HIGH) {\n' + list + '}';	//Check pin7's voltage and if HIGH, generate arduino command code
};

//turn_left provides the JSON strings to the robot motors.
//Currently this is only a blinking sequence sent to the LED at pin13.
//If the arduino is instructed to turn the robot left, LED blinks 3 times, 0.5 s each.
Blockly.Arduino.turn_left = function() {
	Blockly.Arduino.setups_['setup_output_13'] = 'pinMode(13, OUTPUT);';	//Setup LED for output
	//Turn on then off LED for 0.5 s, repeat 3 times
	var code = 'digitalWrite(13, HIGH);\ndelay(500);\ndigitalWrite(13, LOW);\ndelay(500);\ndigitalWrite(13, HIGH);\ndelay(500);\ndigitalWrite(13, LOW);\ndelay(500);\ndigitalWrite(13, HIGH);\ndelay(500);\ndigitalWrite(13, LOW);\ndelay(500);\n'
	return code;
};

//turn_right provides the JSON strings to the robot motors.
//Currently this is only a blinking sequence sent to the LED at pin13.
//If the arduino is instructed to turn the robot right, LED blinks 3 times, 1.0 s each.
Blockly.Arduino.turn_right = function() {
	Blockly.Arduino.setups_['setup_output_13'] = 'pinMode(13, OUTPUT);';	//Setup LED for output
	//Turn on then off LED for 1.0 s, repeat 3 times
	var code = 'digitalWrite(13, HIGH);\ndelay(1000);\ndigitalWrite(13, LOW);\ndelay(1000);\ndigitalWrite(13, HIGH);\ndelay(1000);\ndigitalWrite(13, LOW);\ndelay(1000);\ndigitalWrite(13, HIGH);\ndelay(1000);\ndigitalWrite(13, LOW);\ndelay(1000);\n'
	return code;
};

//tone provides the note selection to the robot based on concatenated strings from block inputs
Blockly.Arduino.bot_tone = function() {
	Blockly.Arduino.setups_['volume'] = 'toneVolume(2048);';
	Blockly.Arduino.setups_['resolution'] = 'analogWriteResolution(12);';
	var note = this.getFieldValue('NOTE');
	var acc	= this.getFieldValue('ACCIDENTAL');
	var oct = this.getFieldValue('OCTAVE');
	var dur = this.getFieldValue('DURATION');
	var code = 'tone(PA4,NOTE_' + note + acc + oct + ',' + dur + ');\n'
	return code;	
};