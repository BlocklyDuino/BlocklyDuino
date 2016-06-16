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

Blockly.Blocks['run_bot'] = {
	helpUrl: 'http://arduino.cc',
	init: function() {
		this.setColour(280);
		this.appendDummyInput()
		    .appendField('Stack Robot Commands');
		this.appendStatementInput('RUN');
		this.setTooltip('Robot instruction stack');
	}
};

Blockly.Blocks['turn_left'] = {
	helpUrl: 'http://arduino.cc',
	init: function() {
		this.setColour(280);
		this.appendDummyInput()
		    .appendField('Turn Left');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('Turn robot left one pulse');
	}
};

Blockly.Blocks['turn_right'] = {
	helpUrl: 'http://arduino.cc',
	init: function() {
		this.setColour(280);
		this.appendDummyInput()
		    .appendField('Turn Right');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setTooltip('Turn robot right one pulse');
	}
};
