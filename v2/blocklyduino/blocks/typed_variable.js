/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Typed variable blocks for Blockly.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

'use strict';

goog.provide('Blockly.Constants.VariablesTyped');

Blockly.Blocks['vars_set_int'] = {
    init: function () {
        this.appendValueInput("VALUE")
                .appendField("🔢 set")
                .appendField(new Blockly.FieldVariable("", null, ['int'], 'int'), "VAR_SET_INT")
                .appendField("to")
                .setCheck(intCompatibility);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setStyle('variable_blocks');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['vars_get_int'] = {
    init: function () {
        this.appendDummyInput()
                .appendField(new Blockly.FieldVariable("", null, ['int'], 'int'), "VAR_GET_INT");
        this.setOutput(true, "int");
        this.setStyle('variable_blocks');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['vars_set_float'] = {
    init: function () {
        this.appendValueInput("VALUE")
                .appendField("❟ set")
                .appendField(new Blockly.FieldVariable("", null, ['float'], 'float'), "VAR_SET_FLOAT")
                .appendField("to")
                .setCheck(floatCompatibility);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setStyle('variable_blocks');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['vars_get_float'] = {
    init: function () {
        this.appendDummyInput()
                .appendField(new Blockly.FieldVariable("", null, ['float'], 'float'), "VAR_GET_FLOAT");
        this.setOutput(true, "float");
        this.setStyle('variable_blocks');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['vars_set_string'] = {
    init: function () {
        this.appendValueInput("VALUE")
                .appendField("set")
                .appendField(new Blockly.FieldVariable("", null, ['String'], 'String'), "VAR_SET_STRING")
                .appendField("to")
                .setCheck(stringCompatibility);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setStyle('variable_blocks');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['vars_get_string'] = {
    init: function () {
        this.appendDummyInput()
                .appendField(new Blockly.FieldVariable("", null, ['String'], 'String'), "VAR_GET_STRING");
        this.setOutput(true, "String");
        this.setStyle('variable_blocks');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['vars_set_boolean'] = {
    init: function () {
        this.appendValueInput("VALUE")
                .appendField("set")
                .appendField(new Blockly.FieldVariable("", null, ['bool'], 'bool'), "VAR_SET_BOOLEAN")
                .appendField("to")
                .setCheck(booleanCompatibility);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setStyle('variable_blocks');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['vars_get_boolean'] = {
    init: function () {
        this.appendDummyInput()
                .appendField(new Blockly.FieldVariable("", null, ['bool'], 'bool'), "VAR_GET_BOOLEAN");
        this.setOutput(true, "Boolean");
        this.setStyle('variable_blocks');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};