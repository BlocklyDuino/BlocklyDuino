/**
 * Visual Blocks Language
 *
 * Copyright 2012 Fred Lin.
 * https://github.com/gasolin/BlocklyDuino
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating Arduino blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Arduino.CGRobot');

goog.require('Blockly.Arduino');




/*---------------------------------------------------------------------------*/


Blockly.Blocks['motorA_Speed'] = {
  init: function() {
	
	 
	this.appendValueInput('motorASpeed')
        .setCheck('Number')
        .appendField('Set Motor A Speed to ');  
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    
  }
};

Blockly.Arduino.motorA_Speed = function() { return "abc"}

Blockly.Blocks['motorB_Speed'] = {
  init: function() {
	
	 
	this.appendValueInput('motorBSpeed')
        .setCheck('Number')
        .appendField('Set Motor B Speed to ');  
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.motorB_Speed = function() { return "abc"}



Blockly.Blocks['motorB_Direction'] = {
  init: function() {	 
	this.appendValueInput('motorBDirection')
        .setCheck('Number')
        .appendField('Set Motor B Direction to ');  
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.motorB_Direction = function() { 

Blockly.Arduino.setups_['setup_output_2'] = 'pinMode(2, OUTPUT);';
var value_num = Blockly.Arduino.valueToCode(this, 'motorBDirection', Blockly.Arduino.ORDER_ATOMIC);

	if(value_num==0)
	{
		var code = 'digitalWrite(2,LOW);\n'
	}

	if(value_num==1)
	{
		var code = 'digitalWrite(2,HIGH);\n'
	}

	return code;
}





Blockly.Blocks['motorA_Direction'] = {
  init: function() { 
	this.appendValueInput('motorADirection')
        .setCheck('Number')
        .appendField('Set Motor A Direction to ');  
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.motorA_Direction = function() { 

Blockly.Arduino.setups_['setup_output_0'] = 'pinMode(0, OUTPUT);';
var value_num = Blockly.Arduino.valueToCode(this, 'motorADirection', Blockly.Arduino.ORDER_ATOMIC);

if(value_num==0)
{
	var code = 'digitalWrite(0,LOW);\n'
}

if(value_num==1)
{
	var code = 'digitalWrite(0,HIGH);\n'
}

return code;
}



Blockly.Blocks['MoveForward'] = {
  init: function() { 
	this.appendValueInput('forwardSpeed')
        .setCheck('Number')
        .appendField('Move Robot Forward with speed');    
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.MoveForward = function() { 

Blockly.Arduino.setups_['setup_output_0'] = 'pinMode(0, OUTPUT);';
Blockly.Arduino.setups_['setup_output_2'] = 'pinMode(2, OUTPUT);';
var inputSpeed= Blockly.Arduino.valueToCode(this, 'forwardSpeed', Blockly.Arduino.ORDER_ATOMIC);
var functionBody= "void moveForward(int lspeed)\n"
functionBody=functionBody + "{\n"
functionBody=functionBody + "\tdigitalWrite(0, HIGH);\n"
functionBody=functionBody + "\tdigitalWrite(2, HIGH);\n"
functionBody=functionBody + "\tanalogWrite(5, lspeed);\n"
functionBody=functionBody + "\tanalogWrite(4, lspeed);\n"

functionBody=functionBody + "}\n"
Blockly.Arduino.definitions_['moveforwardFunction']=functionBody;


var code= "moveForward("+inputSpeed+");\n"	


return code;
}

Blockly.Blocks['MoveReverse'] = {
  init: function() { 
	this.appendValueInput('reverseSpeed')
        .setCheck('Number')
        .appendField('Move Robot Reverse with speed');    
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.MoveReverse = function() { 

Blockly.Arduino.setups_['setup_output_0'] = 'pinMode(0, OUTPUT);';
Blockly.Arduino.setups_['setup_output_2'] = 'pinMode(2, OUTPUT);';
var inputSpeed= Blockly.Arduino.valueToCode(this, 'reverseSpeed', Blockly.Arduino.ORDER_ATOMIC);
var functionBody= "void moveReverse(int lspeed)\n"
functionBody=functionBody + "{\n"
functionBody=functionBody + "\tdigitalWrite(0, LOW);\n"
functionBody=functionBody + "\tdigitalWrite(2, LOW);\n"
functionBody=functionBody + "\tanalogWrite(5, lspeed);\n"
functionBody=functionBody + "\tanalogWrite(4, lspeed);\n"

functionBody=functionBody + "}\n"
Blockly.Arduino.definitions_['moveReverseFunction']=functionBody;


var code= "moveReverse("+inputSpeed+");\n"	


return code;
}


Blockly.Blocks['TurnLeft'] = {
  init: function() { 
	this.appendValueInput('leftSpeed')
        .setCheck('Number')
        .appendField('Turn Robot Left with speed');    
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.TurnLeft = function() { 

Blockly.Arduino.setups_['setup_output_0'] = 'pinMode(0, OUTPUT);';
Blockly.Arduino.setups_['setup_output_2'] = 'pinMode(2, OUTPUT);';
var inputSpeed= Blockly.Arduino.valueToCode(this, 'leftSpeed', Blockly.Arduino.ORDER_ATOMIC);
var functionBody= "void turnLeft(int lspeed)\n"
functionBody=functionBody + "{\n"
functionBody=functionBody + "\tdigitalWrite(0, LOW);\n"
functionBody=functionBody + "\tdigitalWrite(2, HIGH);\n"
functionBody=functionBody + "\tanalogWrite(5, lspeed);\n"
functionBody=functionBody + "\tanalogWrite(4, lspeed);\n"

functionBody=functionBody + "}\n"
Blockly.Arduino.definitions_['moveLeftFunction']=functionBody;


var code= "turnLeft("+inputSpeed+");\n"	


return code;
}

Blockly.Blocks['TurnRight'] = {
  init: function() { 
	this.appendValueInput('rightSpeed')
        .setCheck('Number')
        .appendField('Turn Robot Right with speed');    
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.TurnRight = function() { 

Blockly.Arduino.setups_['setup_output_0'] = 'pinMode(0, OUTPUT);';
Blockly.Arduino.setups_['setup_output_2'] = 'pinMode(2, OUTPUT);';
var inputSpeed= Blockly.Arduino.valueToCode(this, 'rightSpeed', Blockly.Arduino.ORDER_ATOMIC);
var functionBody= "void turnRight(int lspeed)\n"
functionBody=functionBody + "{\n"
functionBody=functionBody + "\tdigitalWrite(0, LOW);\n"
functionBody=functionBody + "\tdigitalWrite(2, HIGH);\n"
functionBody=functionBody + "\tanalogWrite(5, lspeed);\n"
functionBody=functionBody + "\tanalogWrite(4, lspeed);\n"

functionBody=functionBody + "}\n"
Blockly.Arduino.definitions_['moveRightFunction']=functionBody;


var code= "turnRight("+inputSpeed+");\n"	


return code;
}










