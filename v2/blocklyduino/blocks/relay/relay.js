/**
 * @license
 * Copyright 2020 Sébastien Canet
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Relay actuator blocks for Blockly.
 * @author scanet@libreduc.cc (Sébastien Canet)
 */
 
'use strict';

goog.provide('Blockly.Constants.RELAY');

goog.require('Blockly.Blocks');
goog.require('Blockly');

var relayMediaFolder = "./blocklyduino/blocks/relay/";

Blockly.Blocks['RELAY_LOGICAL'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField(new Blockly.FieldDropdown(Blockly.Msg.FIELDDROPDOWN_ONOFF3), "STAT")
			.appendField(Blockly.Msg.RELAY_LOGICAL_TEXT)
			.appendField(new Blockly.FieldImage(relayMediaFolder + 'relay_logic.jpg', 64, 64))
		this.appendDummyInput()
			.appendField(Blockly.Msg.RELAY_LOGICAL_INPUT)
			.appendField(new Blockly.FieldTextInput(''), 'PIN');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setStyle('relay_blocks');
		this.setTooltip(Blockly.Msg.RELAY_LOGICAL_TOOLTIP);
		this.setHelpUrl(Blockly.Msg.RELAY_LOGICAL_HELPURL);
	}
};

Blockly.Blocks['RELAY_MOSFET'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField(new Blockly.FieldDropdown(Blockly.Msg.FIELDDROPDOWN_ONOFF3), "STAT")
			.appendField(Blockly.Msg.RELAY_MOSFET_TEXT)
			.appendField(new Blockly.FieldImage(relayMediaFolder + 'relay_mosfet.jpg',  64, 64))
		this.appendDummyInput()
			.appendField(Blockly.Msg.RELAY_MOSFET_INPUT)
			.appendField(new Blockly.FieldTextInput(''), 'PIN');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setStyle('relay_blocks');
		this.setTooltip(Blockly.Msg.RELAY_MOSFET_TOOLTIP);
		this.setHelpUrl(Blockly.Msg.RELAY_MOSFET_HELPURL);
	}
};