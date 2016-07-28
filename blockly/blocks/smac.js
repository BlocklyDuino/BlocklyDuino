/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
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
 * @fileoverview Logic blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.smac');

goog.require('Blockly.Blocks');

//Create a block run_bot that receives a stack of ordered commands to direct the robot
Blockly.Blocks['run_bot'] = {
	helpUrl: 'http://arduino.cc',
	init: function() {
		this.setColour(280);
		this.appendDummyInput()
		    .appendField('Stack Robot Commands')  //Create label for block
			.appendField(new Blockly.FieldDropdown([
								['PA','PA'],['PB','PB']
							]), 'BANK')
			.appendField(new Blockly.FieldDropdown([
								['0','0'],['1','1'],['2','2'],['3','3'],
								['4','4'],['5','5'],['6','6'],['7','7'],
								['8','8'],['9','9'],['10','10'],['11','11'],
								['12','12'],['13','13'],['14','14'],['15','15'],
							]), 'PIN');
		this.appendStatementInput('RUN');		   //Create location for block stack input
		this.setTooltip('Robot instruction stack'); //Pop-up description on mouse-over
	}
};

//Create a block turn_left that sends JSON strings to turn wheels such that robot turns left
Blockly.Blocks['turn_left'] = {
	helpUrl: 'http://arduino.cc',
	init: function() {
		this.setColour(280);
		this.appendDummyInput()
		    .appendField('Turn Left');			//Create label for block
		this.setPreviousStatement(true, null);	//Allow block to nest after another block
		this.setNextStatement(true, null);		//Block allows another block to nest after it
		this.setTooltip('Turn robot left one pulse');  //Pop-up description on mouse-over
	}
};

//Create a block turn_right that sends JSON strings to turn wheels such that robot turns right
Blockly.Blocks['turn_right'] = {
	helpUrl: 'http://arduino.cc',
	init: function() {
		this.setColour(280);
		this.appendDummyInput()
		    .appendField('Turn Right');			//Create label for block
		this.setPreviousStatement(true, null);	//Allow block to nest after another block
		this.setNextStatement(true, null);		//Block allows another block to nest after it
		this.setTooltip('Turn robot right one pulse');	//Pop-up descriptionon mouse-over
	}
};

//Create a block that sends a specified tone for a specified duration
Blockly.Blocks['bot_tone'] = {
	helpUrl: 'http://arduino.cc',
	init: function() {
		this.setColour(280);
		this.appendDummyInput()
			.appendField('Tone: Note')
			.appendField(new Blockly.FieldDropdown([
								['A', 'A'],
								['B', 'B'],
								['C', 'C'],
								['D', 'D'],
								['E', 'E'],
								['F', 'F'],
								['G', 'G']
							]), 'NOTE');
		this.appendDummyInput()
			.appendField('Accidental')
			.appendField(new Blockly.FieldDropdown([
								['Natural', ''],
								['Sharp', 'S']
							]), 'ACCIDENTAL');
		this.appendDummyInput()
			.appendField('Octave')
			.appendField(new Blockly.FieldDropdown([
								['0', '0'],
								['1', '1'],
								['2', '2'],
								['3', '3'],
								['4', '4'],
								['5', '5'],
								['6', '6'],
								['7', '7'],
								['8', '8']
							]), 'OCTAVE');
		this.appendDummyInput()
			.appendField('Duration')
			.appendField(new Blockly.FieldTextInput('0'),'DURATION');
		this.appendDummyInput()
			.appendField('Pin')
			.appendField(new Blockly.FieldDropdown([
								['PA','PA'],['PB','PB']
							]), 'BANK')
			.appendField(new Blockly.FieldDropdown([
								['0','0'],['1','1'],['2','2'],['3','3'],
								['4','4'],['5','5'],['6','6'],['7','7'],
								['8','8'],['9','9'],['10','10'],['11','11'],
								['12','12'],['13','13'],['14','14'],['15','15'],
							]), 'PIN');
		this.setInputsInline(true);	
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('Send designated tone to robot');
	}
};