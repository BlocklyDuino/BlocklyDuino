/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Generating Arduino code for typed variable.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

'use strict';

goog.provide('Blockly.Arduino.VariablesTyped');

goog.require('Blockly.Arduino');

Blockly.Arduino['vars_set_int'] = function (block) {
    var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR_SET_INT'), Blockly.Variables.NAME_TYPE);
    return varName + ' = ' + argument0 + ';\n';
};

Blockly.Arduino['vars_get_int'] = function (block) {
    var code = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR_GET_INT'), Blockly.Variables.NAME_TYPE);
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['vars_set_float'] = function (block) {
    var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR_SET_FLOAT'), Blockly.Variables.NAME_TYPE);
    return varName + ' = ' + argument0 + ';\n';
};

Blockly.Arduino['vars_get_float'] = function (block) {
    var code = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR_GET_FLOAT'), Blockly.Variables.NAME_TYPE);
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['vars_set_string'] = function (block) {
    var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR_SET_STRING'), Blockly.Variables.NAME_TYPE);
    return varName + ' = ' + argument0 + ';\n';
};

Blockly.Arduino['vars_get_string'] = function (block) {
    var code = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR_GET_STRING'), Blockly.Variables.NAME_TYPE);
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['vars_set_boolean'] = function (block) {
    var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR_SET_BOOLEAN'), Blockly.Variables.NAME_TYPE);
    return varName + ' = ' + argument0 + ';\n';
};

Blockly.Arduino['vars_get_boolean'] = function (block) {
    var code = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR_GET_BOOLEAN'), Blockly.Variables.NAME_TYPE);
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['variables_set'] = function(block) {
    var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    return varName + ' = ' + argument0 + ';\n';
};

Blockly.Arduino['variables_get'] = function(block) {
    var code = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

