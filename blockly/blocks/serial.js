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

//To support syntax defined in http://arduino.cc/en/Reference/HomePage

goog.provide('Blockly.Blocks.serial');

goog.require('Blockly.Blocks');

Blockly.Blocks.serial.HUE = 200;

Blockly.Blocks['serial_print'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.SERIAL_PRINT_HELPURL);
    this.setColour(Blockly.Blocks.serial.HUE);
    this.appendValueInput("CONTENT")
      .setCheck(["Number", "String"])
      .appendField(Blockly.Msg.SERIAL_PRINT_APPENDTEXT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.SERIAL_PRINT_TOOLTIP);
  }
};

Blockly.Blocks['serial_read'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.SERIAL_READ_HELPURL);
    this.setColour(Blockly.Blocks.serial.HUE);
    this.appendDummyInput()
    .appendField(Blockly.Msg.SERIAL_READ_APPENDTEXT);
    this.setOutput(true,["Number","String"]);
    this.setTooltip(Blockly.Msg.SERIAL_READ_TOOLTIP);
  }
};

Blockly.Blocks['serial_byte_number'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.SERIAL_READ_HELPURL);
    this.setColour(Blockly.Blocks.serial.HUE);
    this.appendDummyInput()
      .appendField(Blockly.Msg.SERIAL_BYTE_NUMBER_TEXT1)
      .appendField(new Blockly.FieldDropdown([["0","48"],["1", "49"], ["2", "50"], ["3", "51"], ["4", "52"], ["5", "53"], ["6", "54"], ["7", "55"], ["8", "56"], ["9", "57"]]), "NUM")
      .appendField(Blockly.Msg.SERIAL_BYTE_NUMBER_TEXT2);
    this.setOutput(true,"NUMBER");
    this.setTooltip(Blockly.Msg.SERIAL_READ_TOOLTIP);
  }
};


Blockly.Blocks['serial_available'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.SERIAL_AVAILABLE_HELPURL);
    this.setColour(Blockly.Blocks.serial.HUE);
    this.appendDummyInput()
    .appendField(Blockly.Msg.SERIAL_AVAILABLE_APPENDTEXT);
    this.setOutput(true, "Number");
    this.setTooltip(Blockly.Msg.SERIAL_AVAILABLE_TOOLTIP);
  }
};

Blockly.Blocks['serial_println'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.SERIAL_PRINTLN_HELPURL);
    this.setColour(Blockly.Blocks.serial.HUE);
    this.appendValueInput("CONTENT")
      .setCheck(["Number", "String"])
    . appendField(Blockly.Msg.SERIAL_PRINTLN_APPENDTEXT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.SERIAL_PRINTLN_TOOLTIP);
  }
};
