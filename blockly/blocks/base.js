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

goog.provide('Blockly.Blocks.base');

goog.require('Blockly.Blocks');


Blockly.Blocks['base_delay'] = {
  helpUrl: 'http://arduino.cc/en/Reference/delay',
  init: function() {
    this.setColour(120);
    this.appendValueInput("DELAY_TIME", 'Number')
        .appendField("Delay")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Delay specific time');
  }
};

Blockly.Blocks['base_map'] = {
  helpUrl: 'http://arduino.cc/en/Reference/map',
  init: function() {
    this.setColour(230);
    this.appendValueInput("NUM", 'Number')
        .appendField("Map ")
        .setCheck('Number');
    this.appendValueInput("DMAX", 'Number')
        .appendField("value to [0-")
        .setCheck('Number');
    this.appendDummyInput()
	      .appendField("]");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Re-maps a number from [0-1024] to another.');
  }
};
/*
Blockly.Blocks['inout_buildin_led'] = {
   helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
   init: function() {
     this.setColour(190);
     this.appendDummyInput()
	       .appendField("Build-in LED Stat")
	       .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");
     this.setPreviousStatement(true, null);
     this.setNextStatement(true, null);
     this.setTooltip('light or off the build-in LED');
   }
};

Blockly.Blocks['inout_digital_write'] = {
  helpful: Blockly.Msg.INOUT_DIGITAL_WRITE_HELPURL,
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
    .appendField(Blockly.Msg.INOUT_DIGITAL_WRITE_APPENDTEXT_PIN)
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    .appendField(Blockly.Msg.INOUT_DIGITAL_WRITE_APPENDTEXT_STAT)
        .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.INOUT_DIGITAL_WRITE_TOOLTIP);
  }
};

Blockly.Blocks['inout_digital_read'] = {
  helpUrl: Blockly.Msg.INOUT_DIGITAL_READ_HELPURL,
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
    .appendField(Blockly.Msg.INOUT_DIGITAL_READ_APPENDTEXT)
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setOutput(true, 'Boolean');
    this.setTooltip(Blockly.Msg.INOUT_DIGITAL_READ_TOOLTIP);
  }
};

Blockly.Blocks['inout_analog_write'] = {
  helpUrl: Blockly.Msg.INOUT_ANALOG_WRITE_HELPURL,
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
      .appendField(Blockly.Msg.INOUT_ANALOG_WRITE_APPENDTEXT_PIN)
      .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.appendValueInput("NUM", 'Number')
      .appendField(Blockly.Msg.INOUT_ANALOG_WRITE_APPENDTEXT_VALUE)
      .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.INOUT_ANALOG_WRITE_TOOLTIP);
  }
};

Blockly.Blocks['inout_analog_read'] = {
  helpUrl: Blockly.Msg.INOUT_ANALOG_READ_HELPURL,
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
      .appendField(Blockly.Msg.INOUT_ANALOG_READ_APPENDTEXT)
      .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.setOutput(true, 'Number');
  this.setTooltip(Blockly.Msg.INOUT_ANALOG_READ_TOOLTIP);
  }
};

Blockly.Blocks['inout_highlow'] = {
  helpUrl: 'http://arduino.cc/en/Reference/Constants',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), 'BOOL')
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
  }
};

Blockly.Blocks['pulsein'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
      .appendField("PulseIn Pin#")
      .appendField(new Blockly.FieldDropdown(profile.default.digital), "pin");
    this.appendDummyInput()
      .appendField("Type")
      .appendField(new Blockly.FieldDropdown([["HIGH", "high"], ["LOW", "low"]]), "type");
    this.appendValueInput("timeout")
      .setCheck("Number")
      .appendField("TimeOut");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip('');
  }
};

Blockly.Blocks['tone'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
      .appendField("Tone Pin#")
      .appendField(new Blockly.FieldDropdown(profile.default.digital), "pin");
    this.appendValueInput("freq")
      .setCheck("Number")
      .appendField("Frequency");
    this.appendValueInput("duration")
      .setCheck("Number")
      .appendField("duration");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

//servo block
//http://www.seeedstudio.com/depot/emax-9g-es08a-high-sensitive-mini-servo-p-760.html?cPath=170_171
Blockly.Blocks['servo_move'] = {
  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Servo")
        .appendField(new Blockly.FieldImage("http://www.seeedstudio.com/depot/images/product/a991.jpg", 64, 64))
        .appendField("PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
    this.appendValueInput("DEGREE", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Degree (0~180)");
    this.appendValueInput("DELAY_TIME", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Delay");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('move between 0~180 degree');
  }
};

Blockly.Blocks['servo_read_degrees'] = {
  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Servo")
        .appendField(new Blockly.FieldImage("http://www.seeedstudio.com/depot/images/product/a991.jpg", 64, 64))
        .appendField("PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Read Degrees")
    this.setOutput(true, 'Number');
    this.setTooltip('return that degree with the last servo move.');
  }
};
*/
