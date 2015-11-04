'use strick';

goog.provide('Blockly.Blocks.myblock');

goog.require('Blockly.Blocks');

Blockly.Blocks['my_base_delay_example'] = {
	helpUrl: 'http://arduino.cc/en/Reference/delay',
	init: function() {
		this.setColour(120);
		this.appendValueInput("DELAY_TIME", 'Number')
		.appendField("Delay whee")
		.setCheck('Number');
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('Delay specific time');
	}
};

