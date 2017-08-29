

Blockly.Blocks.ping_cm={
	init:function()
	{
		this.appendDummyInput()
			.appendField("Ping Distance (cm)");
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_RIGHT)
			.appendField("Trigger Pin:")
			.appendField(new Blockly.FieldDropdown(profile["default"].digital),"trig");
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_RIGHT)
			.appendField("Echo Pin:")
			.appendField(new Blockly.FieldDropdown(profile["default"].digital),"echo");
		this.setOutput(!0,"Number");
		this.setColour(65);
		this.setTooltip("Send a ping and return the distance in centimeters");
		
		this.setHelpUrl("http://playground.arduino.cc/Code/NewPing")
	}
};