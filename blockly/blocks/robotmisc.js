/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview Helper functions for generating sensor blocks - sumo robots
 * Written to facilitate programming of sumo and mini-sumo robots
 * Thanks to Fred Lin for building BlockyDuino!
 * @author erickennedy@outlook.com  Eric Kennedy
 */

goog.provide('Blockly.Blocks.sensors');

goog.require('Blockly.Blocks');

Blockly.Blocks['setup_button_wait_il'] = {
  helpUrl: 'http://arduino.cc/en/tutorial/button',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("1 time wait - Gen")
        //.appendField(new Blockly.FieldImage("http://", 64, 64))
        .appendField("PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setTooltip('1 time wait button in setup) - INPUT & wait for HIGH');
 this.setPreviousStatement(false, null);
    this.setNextStatement(true, null);
 }
};

Blockly.Blocks['setup_button_wait_iph'] = {
  helpUrl: 'https://www.pololu.com/docs/0J57/5',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("1 Time wait - Zumo")
        //.appendField(new Blockly.FieldImage("http://", 64, 64))
        .appendField("PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setTooltip('1 time wait button (in setup) - INPUT_PULLUP & wait for LOW)');
 this.setPreviousStatement(false, null);
    this.setNextStatement(true, null);
 }
};

Blockly.Blocks['fourpin_ranger'] = {
  helpUrl: 'http://unknown.com',
  init: function() {
    this.setColour(190);
	this.appendDummyInput()
	    .appendField("Four Pin Ranger")
		.appendField("Trigger_Pin#")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
		this.setInputsInline(false);
	this.appendDummyInput()
		.appendField(new Blockly.FieldImage("../../media/fourpin_range.jpg", 40, 40))
       .appendField("Echo_Pin#")
       .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN2")
	   .setAlign(Blockly.ALIGN_RIGHT)
	this.setOutput(true, 'Number');
    this.setTooltip('4Pin Sonic - Provides distance in inches');
  }
};

Blockly.Blocks['play_notes_z'] = {
  init: function() {
    this.setHelpUrl('https://www.pololu.com/docs/0J18/3');
    this.setColour(210);
	this.appendDummyInput()
	    .appendField("Zumo Buzzer")
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["NOTE_C(3)", "NOTE_C(3)"],["NOTE_D(3)", "NOTE_D(3)"],
		["NOTE_E(3)", "NOTE_E(3)"],["NOTE_F(3)", "NOTE_F(3)"],["NOTE_G(3)", "NOTE_G(3)"],
		["NOTE_A(3)", "NOTE_A(3)"],["NOTE_B(3)", "NOTE_B(3)"],["NOTE_C(2)", "NOTE_C(2)"],
		["NOTE_D(2)", "NOTE_D(2)"],["NOTE_E(2)", "NOTE_E(2)"],["NOTE_F(2)", "NOTE_F(2)"],
		["NOTE_G(2)", "NOTE_G(2)"], ["NOTE_A(2)", "NOTE_A(2)"],["NOTE_B(1)", "NOTE_B(1)"],
		["NOTE_C(1)", "NOTE_C(1)"]]), "NOTE");
	this.setInputsInline(true) ;
    this.appendValueInput("DUR", 'Number')
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Duration")
    this.appendValueInput("VOL", 'Number')
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Volume")
     this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Volume = 1-15 Duration = 100-4000');
  }
};



