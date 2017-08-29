
var sensorCount = [['ColorSensor0', '0'], ['ColorSensor1', '1']];
Blockly.Blocks.getGreenComponent={
	init:function()
	{
		this.appendDummyInput()
			.appendField("Green Value from")	
			.appendField(new Blockly.FieldDropdown(sensorCount), 'sensorNumber');			
		this.setOutput(true);
		this.setColour(120);
		
	}
};

Blockly.Blocks.getRedComponent={
	init:function()
	{
		
		this.appendDummyInput()
			.appendField("Red Value from")
			.appendField(new Blockly.FieldDropdown(sensorCount), 'sensorNumber');			
		this.setOutput(true);
		this.setColour(330);
		
	}
};

Blockly.Blocks.getBlueComponent={
	init:function()
	{
		this.appendDummyInput()
			.appendField("Blue Value from")
			.appendField(new Blockly.FieldDropdown(sensorCount), 'sensorNumber');		
		this.setOutput(true);
		this.setColour(230);
		
	}
};

Blockly.Blocks.Measure={
	init:function()
	{
		this.appendDummyInput()
			.appendField("Measure Color from ");
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_RIGHT)
			.appendField("SCL:")
			.appendField(new Blockly.FieldDropdown(profile["default"].digital),"SCL");
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_RIGHT)
			.appendField("SDA:")
			.appendField(new Blockly.FieldDropdown(profile["default"].digital),"SDA");
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_RIGHT)
			.appendField("Sensor Number:")
			.appendField(new Blockly.FieldDropdown(sensorCount),"sensorNumber");
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setColour(65);
		this.setTooltip("Start a Conversion on the Color Sensor");		
		
	}
};