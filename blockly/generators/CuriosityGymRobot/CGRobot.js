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


Blockly.Blocks['motorA'] = {
  init: function() {
	this.appendValueInput('Direction')
	 .setCheck('Number')
	 .appendField('Turn Motor A in Direction ');
	this.appendValueInput('Speed')
        .setCheck('Number')
        .appendField('at Speed ');  
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.motorA = function() { return "abc"}


Blockly.Blocks['motorB'] = {
  init: function() {
	this.appendValueInput('Direction')
	 .setCheck('Number')
	 .appendField('Turn Motor B in Direction ');
	this.appendValueInput('Speed')
        .setCheck('Number')
        .appendField('at Speed ');  
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.motorB = function() { return "abc"}

Blockly.Blocks['motorA_Speed'] = {
  init: function() {
	
	 
	this.appendValueInput('Speed')
        .setCheck('Number')
        .appendField('Set Motor A Speed to ');  
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.motorA_Speed = function() { return "abc"}

Blockly.Blocks['motorB_Speed'] = {
  init: function() {
	
	 
	this.appendValueInput('Speed')
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
	this.appendValueInput('Direction')
        .setCheck('Number')
        .appendField('Set Motor B Direction to ');  
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.motorB_Direction = function() { return "abc"}


Blockly.Blocks['motorA_Direction'] = {
  init: function() { 
	this.appendValueInput('Direction')
        .setCheck('Number')
        .appendField('Set Motor A Direction to ');  
    this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip('Returns number of letters in the provided text.');
    this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
  }
};

Blockly.Arduino.motorA_Direction = function() { return "abc"}










