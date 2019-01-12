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
 * @fileoverview Helper functions for generating Arduino blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Constants.servo');

goog.require('Blockly.Blocks');
goog.require('Blockly');

//http://www.seeedstudio.com/depot/emax-9g-es08a-high-sensitive-mini-servo-p-760.html?cPath=170_171
Blockly.Blocks['servo_move'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Servo")
        .appendField(new Blockly.FieldImage("./blocks/servo/EMAX_Servo.jpg", 64, 64))
        .appendField("PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
    this.appendValueInput("DEGREE")
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Degree (0~180)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('move between 0~180 degree');
    this.setHelpUrl('http://playground.arduino.cc/ComponentLib/servo');
    this.setColour('%{BKY_SERVO_HUE}');
  }
};

Blockly.Blocks['servo_read_degrees'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Servo")
        .appendField(new Blockly.FieldImage("./blocks/servo/EMAX_Servo.jpg", 64, 64))
        .appendField("PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Read Degrees")
    this.setOutput(true, 'Number');
    this.setTooltip('return that degree with the last servo move.');
    this.setHelpUrl('http://playground.arduino.cc/ComponentLib/servo');
    this.setColour('%{BKY_SERVO_HUE}');
  }
};