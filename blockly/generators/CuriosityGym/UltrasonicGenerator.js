Blockly.Arduino.newping={};
Blockly.Arduino.ping_cm=function()
{
	var a=this.getFieldValue("trig"),b=this.getFieldValue("echo");
	Blockly.Arduino.definitions_.define_sonar="#include <NewPing.h>\n";
	Blockly.Arduino.definitions_["var_sonar"+a]="NewPing sonar_"+a+"("+a+","+b+");\n";
	return["sonar_"+a+".ping_cm()",Blockly.Arduino.ORDER_ATOMIC]
};

