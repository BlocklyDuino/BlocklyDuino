/**
 * @license
 * Copyright 2020 Sébastien Canet
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview DS18B20 sensor temperature blocks for Blockly.
 * @author scanet@libreduc.cc (Sébastien Canet)
 */
 
'use strict';

goog.provide('Blockly.Constants.ds18b20');

goog.require('Blockly.Blocks');
goog.require('Blockly');

var ds18b20MediaFolder = "./blocklyduino/blocks/ds18b20/";

Blockly.Blocks['ds18b20_search'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField(Blockly.Msg.DS18B20_TEXT1)
			.appendField(new Blockly.FieldImage(ds18b20MediaFolder + 'ds18b20.svg', 64, 64))
			.appendField(Blockly.Msg.DS18B20_INPUT1)
			.appendField(new Blockly.FieldTextInput('11'), 'ds18b20_pin')
			.appendField(Blockly.Msg.DS18B20_INPUT2)
			.appendField(new Blockly.FieldTextInput('1'), 'ds18b20_address');
		this.setOutput(true, 'Boolean');
		this.setStyle('ds18b20_blocks');
		this.setTooltip(Blockly.Msg.DS18B20_TOOLTIP1);
		this.setHelpUrl(Blockly.Msg.DS18B20_HELPURL);
	}
};

Blockly.Blocks['ds18b20_temp'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField(Blockly.Msg.DS18B20_TEXT2)
			.appendField(new Blockly.FieldImage(ds18b20MediaFolder + 'ds18b20.svg', 64, 64))
			.appendField(Blockly.Msg.DS18B20_INPUT2)
			.appendField(new Blockly.FieldTextInput('1'), 'ds18b20_address');
		this.setOutput(true, 'float');
		this.setTooltip(Blockly.Msg.DS18B20_TOOLTIP2);
		this.setStyle('ds18b20_blocks');
		this.setHelpUrl(Blockly.Msg.DS18B20_HELPURL);
	}
};





