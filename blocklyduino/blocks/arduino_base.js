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

goog.provide('Blockly.Constants.arduino_base');

goog.require('Blockly.Blocks');
goog.require('Blockly');

Blockly.Blocks['arduino_base_inout_buildin_led'] = {
   init: function() {
    this.appendDummyInput()
	    .appendField("Build-in LED Stat")
	    .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('light or off the build-in LED');
    this.setHelpUrl('https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
   }
};

Blockly.Blocks['arduino_base_inout_digital_write'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("./blocks/digital.jpg", 64, 64))
	    .appendField("DigitalWrite PIN#")
	    .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN")
      	.appendField("Stat")
      	.appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Write digital value to a specific Port');
    this.setHelpUrl('https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};

Blockly.Blocks['arduino_base_inout_digital_read'] = {
  init: function() {
    this.appendDummyInput()
	    .appendField("DigitalRead PIN#")
	    .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
    this.setHelpUrl('https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};

Blockly.Blocks['arduino_base_inout_highlow'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), 'BOOL')
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
    this.setHelpUrl('https://www.arduino.cc/reference/en/language/variables/constants/constants/');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};

Blockly.Blocks['arduino_base_inout_analog_write'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("./blocks/pwm.png", 64, 64))
        .appendField("Pulse Write PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.dropdownPWM), "PIN");
    this.appendValueInput("PWM", 'Number')
        .appendField("Value")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Write analog value between 0 and 255 to a specific Port');
    this.setHelpUrl('https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};

Blockly.Blocks['arduino_base_inout_analog_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("AnalogRead PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.dropdownAnalog), "PIN");
    this.setOutput(true, 'Number');
    this.setTooltip('Return value between 0 and 1024');
    this.setHelpUrl('https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};

Blockly.Blocks['arduino_base_delay'] = {
  init: function() {
    this.appendValueInput("DELAY_TIME", 'Number')
        .appendField("Delay")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Delay specific time');
    this.setHelpUrl('https://www.arduino.cc/reference/en/language/functions/time/delay/');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};

Blockly.Blocks['arduino_base_angle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('angle:')
        .appendField(new Blockly.FieldAngle(90), 'ANGLE');
    this.setOutput(true, 'Number');
    this.setTooltip('Angle degrees number');
    this.setHelpUrl('');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};

// Blockly.Blocks['arduino_base_date'] = {
  // init: function() {
    // this.appendDummyInput()
        // .appendField('date:')
        // .appendField(new Blockly.FieldDate(''), 'DATE');
    // this.setOutput(true, 'Number');
    // this.setTooltip('Date entrie as yyyy-mm-dd');
    // this.setHelpUrl('');
    // this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  // }
// };

Blockly.Blocks['arduino_base_map'] = {
  init: function() {
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
    this.setHelpUrl('https://www.arduino.cc/reference/en/language/functions/math/map/');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};

Blockly.Blocks['arduino_base_inout_tone'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Tone PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
    this.appendValueInput("NUM", "Number")
        .appendField("frequency")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Generate audio tones on a pin");
    this.setHelpUrl('https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};

Blockly.Blocks['arduino_base_inout_notone'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("No tone PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Stop generating a tone on a pin");
    this.setHelpUrl('https://www.arduino.cc/reference/en/language/functions/advanced-io/notone/');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};

Blockly.Blocks['arduino_base_serial_print'] = {
  init: function() {
    this.appendValueInput("CONTENT", 'String')
        .appendField("Serial Print");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Prints data to the console/serial port as human-readable ASCII text.');
    this.setHelpUrl('https://www.arduino.cc/en/Serial/Print');
    this.setColour('%{BKY_ARDUINO_BASE_HUE}');
  }
};