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
  helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
	      .appendField("DigitalWrite PIN#")
	      .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
      	.appendField("Stat")
      	.appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Write digital value to a specific Port');
  }
};

Blockly.Blocks['inout_digital_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalRead',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
	      .appendField("DigitalRead PIN#")
	      .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
  }
};

Blockly.Blocks['inout_analog_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogWrite',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("AnalogWrite PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.appendValueInput("NUM", 'Number')
        .appendField("value")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Write analog value between 0 and 255 to a specific Port');
  }
};

Blockly.Blocks['inout_analog_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogRead',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("AnalogRead PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.setOutput(true, 'Number');
    this.setTooltip('Return value between 0 and 1024');
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

//Setup a Stepper Motor
Blockly.Blocks['stepper_setup'] = {
  init:function(){
    this.setColour (257);
    this.appendDummyInput("")
    .appendField("Set up a Stepper Motor")
    .appendField("PIN# 1")
    .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN1")
    .appendField("PIN# 2")
    .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN2")
    .appendField("PIN# 3")
    .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN3")
    .appendField("PIN# 4")
    .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN4");
    this.appendValueInput("stepNum", Number)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("# of Steps: ");
  this.setPreviousStatement(true,null);
  this.setNextStatement(true,null);
  this.setTooltip('Setup the Stepper Motor');
  }
};

//Sets the speed of a stepper motor
Blockly.Blocks['stepper_set_speed'] = {
  init:function(){
    this.setColour (257);
    this.appendDummyInput("")
    .appendField("Set Stepper Speed")
    this.appendValueInput("SPEED", Number)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Speed:");
    this.setPreviousStatement(true,null);
    this.setNextStatement(true,null);
    this.setTooltip('Sets the speed of the Stepper');
  }
};

//Moves the stepper motor a specific number of steps
Blockly.Blocks['stepper_step'] = {
  init:function(){
    this.setColour (257);
    this.appendDummyInput("")
    .appendField("Stepper Step")
    this.appendValueInput("STEP", Number)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("# of Steps:");
    this.setPreviousStatement(true,null);
    this.setNextStatement(true,null);
    this.setTooltip('Moves the Stepper');
  }
};

Blockly.Blocks['serial_print'] = {
  helpUrl: 'http://www.arduino.cc/en/Serial/Print',
  init: function() {
    this.setColour(230);
    this.appendValueInput("CONTENT", 'String')
        .appendField("Serial Print");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Prints data to the console/serial port as human-readable ASCII text.');
  }
};
