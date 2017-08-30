
Blockly.Arduino['getGreenComponent']=function()
{
	var colorSensorNumber=this.getFieldValue('sensorNumber')||0;
	//return["200",Blockly.Arduino.ORDER_ATOMIC];
	return["green_"+colorSensorNumber,Blockly.Arduino.ORDER_ATOMIC];
	
};

Blockly.Arduino['getRedComponent']=function()
{
	var colorSensorNumber=this.getFieldValue('sensorNumber')||0;
	//return["200",Blockly.Arduino.ORDER_ATOMIC];
	return["red_"+colorSensorNumber,Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['getBlueComponent']=function()
{
	var colorSensorNumber=this.getFieldValue('sensorNumber')||0;
	//return["200",Blockly.Arduino.ORDER_ATOMIC];
	return["blue_"+colorSensorNumber,Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['Measure']=function()
{
	var behaviourCode="";
	var colorSensorNumber=this.getFieldValue('sensorNumber')|| 0;
	var SCLPin=this.getFieldValue('SCL');
	var SDAPin=this.getFieldValue('SDA');
	Blockly.Arduino.definitions_['colorSensorLibrary']="#include <Wire.h>\n#include \"Adafruit_TCS34725.h\"";
	//Blockly.Arduino.definitions_['wireLibConfig']="Wire.begin("+SDAPin+", "+SCLPin+");";
	Blockly.Arduino.definitions_['colorVariables' + colorSensorNumber]="uint16_t clear_"+colorSensorNumber+", red_"+colorSensorNumber+", green_"+colorSensorNumber+", blue_"+colorSensorNumber+";\n";
	Blockly.Arduino.definitions_['tcs_lib_init' + colorSensorNumber]="Adafruit_TCS34725 tcs_"+colorSensorNumber+" = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);\n";
	
	Blockly.Arduino.setups_['tcs_begin_'+colorSensorNumber]="Wire.begin("+SDAPin+", "+SCLPin+");\n tcs_"+colorSensorNumber+".begin();"
	
	
	behaviourCode=behaviourCode+"tcs_"+colorSensorNumber+".setInterrupt(false);// turn on LED\n"
	behaviourCode=behaviourCode+"delay(60);  // takes 60ms to read \n" ; 
	behaviourCode=behaviourCode+ "tcs_"+colorSensorNumber+".getRawData(";
	behaviourCode=behaviourCode+ "&red_"+colorSensorNumber;
	behaviourCode=behaviourCode+ ", &green_"+colorSensorNumber;
	behaviourCode=behaviourCode+ ", &blue_"+colorSensorNumber;
	behaviourCode=behaviourCode+ ", &clear_"+colorSensorNumber;
	behaviourCode=behaviourCode+ ");\n"
	behaviourCode=behaviourCode+"tcs_"+colorSensorNumber+".setInterrupt(true);  // turn off LED\n"
	
	return behaviourCode;
	
};

