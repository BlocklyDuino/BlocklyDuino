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




/*Blockly.Arduino.motor4_Speed = function() { return "abc"}
Blockly.Arduino.motor1_Speed = function() { return "abc"}
Blockly.Arduino.motor4_Direction = function() { 

Blockly.Arduino.setups_['setup_output_2'] = 'pinMode(D4, OUTPUT);';
var value_num = Blockly.Arduino.valueToCode(this, 'motorBDirection', Blockly.Arduino.ORDER_ATOMIC);

	if(value_num==0)
	{
		var code = 'digitalWrite(D4,LOW);\n'
	}

	if(value_num==1)
	{
		var code = 'digitalWrite(D4,HIGH);\n'
	}

	return code;
}

Blockly.Arduino.motor1_Direction = function() { 

Blockly.Arduino.setups_['setup_output_0'] = 'pinMode(D3, OUTPUT);';
var value_num = Blockly.Arduino.valueToCode(this, 'motorADirection', Blockly.Arduino.ORDER_ATOMIC);

if(value_num==0)
{
	var code = 'digitalWrite(D3,LOW);\n'
}

if(value_num==1)
{
	var code = 'digitalWrite(D3,HIGH);\n'
}

return code;
}*/

Blockly.Arduino.setMotor = function()
{
	Blockly.Arduino.definitions_['include_motor_driver'] = '#include <MotorDriver.h>';
	Blockly.Arduino.definitions_['motor_driver_object'] = 'MotorDriver m;';
	var inputSpeed= Blockly.Arduino.valueToCode(this, 'motorSpeed', Blockly.Arduino.ORDER_ATOMIC)||255;
	var chosenMotor= this.getFieldValue('motorChoice')
	var chosenDirection= this.getFieldValue('direction')
	var code="m.motor("+chosenMotor+","+chosenDirection+","+ inputSpeed+");\n"
	return code;
}


Blockly.Arduino.MoveForward = function() { 
	Blockly.Arduino.definitions_['include_motor_driver'] = '#include <MotorDriver.h>';
	Blockly.Arduino.definitions_['motor_driver_object'] = 'MotorDriver m;';
	var inputSpeed= Blockly.Arduino.valueToCode(this, 'forwardSpeed', Blockly.Arduino.ORDER_ATOMIC);
	var code="m.motor(1,FORWARD,"+ inputSpeed+");\n"
	code=code+"m.motor(4,FORWARD,"+ inputSpeed+");\n"

	return code;
}

Blockly.Arduino.MoveBACKWARD = function() { 
	Blockly.Arduino.definitions_['include_motor_driver'] = '#include <MotorDriver.h>';
	Blockly.Arduino.definitions_['motor_driver_object'] = 'MotorDriver m;';
	var inputSpeed= Blockly.Arduino.valueToCode(this, 'BACKWARDSpeed', Blockly.Arduino.ORDER_ATOMIC);
	var code="m.motor(1,BACKWARD,"+ inputSpeed+");\n"
	code=code+"m.motor(4,BACKWARD,"+ inputSpeed+");\n"

	return code;


}

Blockly.Arduino.TurnLeft = function() { 

	Blockly.Arduino.definitions_['include_motor_driver'] = '#include <MotorDriver.h>';
	Blockly.Arduino.definitions_['motor_driver_object'] = 'MotorDriver m;';
	var inputSpeed= Blockly.Arduino.valueToCode(this, 'leftSpeed', Blockly.Arduino.ORDER_ATOMIC);
	var code="m.motor(1,FORWARD,"+ inputSpeed+");\n"
	code=code+"m.motor(4,BACKWARD,"+ inputSpeed+");\n"

	return code;



}

Blockly.Arduino.TurnRight = function() { 

	Blockly.Arduino.definitions_['include_motor_driver'] = '#include <MotorDriver.h>';
	Blockly.Arduino.definitions_['motor_driver_object'] = 'MotorDriver m;';
	var inputSpeed= Blockly.Arduino.valueToCode(this, 'rightSpeed', Blockly.Arduino.ORDER_ATOMIC)||0;
	var code="m.motor(1,BACKWARD,"+ inputSpeed+");\n"
	code=code+"m.motor(4,FORWARD,"+ inputSpeed+");\n"

	return code;

}

Blockly.Arduino.Stop = function() { 


	Blockly.Arduino.definitions_['include_motor_driver'] = '#include <MotorDriver.h>';
	Blockly.Arduino.definitions_['motor_driver_object'] = 'MotorDriver m;';
	var inputSpeed= 0;
	var code="m.motor(1,BRAKE,"+ inputSpeed+");\n"
	code=code+"m.motor(4,BRAKE,"+ inputSpeed+");\n"
	return code;


}

Blockly.Arduino.Direction=function()
{
	var chosenDirection= this.getFieldValue('direction');	
	return[chosenDirection,Blockly.Arduino.ORDER_ATOMIC]
};



