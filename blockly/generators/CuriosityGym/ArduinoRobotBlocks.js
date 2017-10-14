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

Blockly.Blocks['Stop'] = {
  init: function() {
	this.appendDummyInput().appendField("Stop Robot");  	
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};





Blockly.Blocks.Direction={
	init:function()
	{
		
		
		var options = [['Clockwise', '1'], ['AntiClockwise', '0']];
		this.appendDummyInput().appendField(new Blockly.FieldDropdown(options), 'direction');;
		
		this.setOutput(!0,"Number");
		this.setColour(230);
		
	}
};

















