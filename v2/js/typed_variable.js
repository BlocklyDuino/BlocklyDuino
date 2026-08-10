/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Utility functions for handling typed variables.
 * Freely adapted from https://github.com/google/blockly/commit/4e2f8e6e02b0473a86330eb7414794e6bfea430e
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

var intCompatibility = ['int', 'Number'];
var floatCompatibility = ['int', 'float', 'Number'];
var stringCompatibility = ['String'];
var booleanCompatibility = ['Boolean'];

var createVarBtnIntCallBack = function (button) {
    Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), null, 'int');
};
var createVarBtnFloatCallBack = function (button) {
    Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), null, 'float');
};
var createVarBtnStringCallBack = function (button) {
    Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), null, 'String');
};
var createVarBtnBooleanCallBack = function (button) {
    Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), null, 'bool');
};

var numVariablesCallBack = function (currWorkspace) {
    var allIntVars = currWorkspace.getVariablesOfType('int');
    var xmlList = [];
    var createintBtnXml = Blockly.Xml.textToDom('<xml><button text="' + Blockly.Msg.VAR_CREATE_INT + '" callbackKey="createVarBtnInt">' +
            '</button></xml>').firstChild;
    xmlList.push(createintBtnXml);
    if (allIntVars.length > 0) {
        if (Blockly.Blocks['vars_set_int']) {
            var firstVariable = allIntVars[allIntVars.length - 1];
            var gap = 24;
            var blockText =
                    '<xml>' +
                    '<block type="vars_set_int" gap="' + gap + '">' +
                    '<field name="VAR_SET_INT" variabletype="int">' + firstVariable.name + '</field>' +
                    '</block>' +
                    '</xml>';
            var block = Blockly.Xml.textToDom(blockText).firstChild;
            xmlList.push(block);
        }
        if (Blockly.Blocks['vars_get_int']) {
            allIntVars.sort(Blockly.VariableModel.compareByType);
            for (var i = 0, variable; variable = allIntVars[i]; i++) {
                var blockText =
                        '<xml>' +
                        '<block type="vars_get_int" gap="8">' +
                        '<field name="VAR_GET_INT" variabletype="int">' + variable.name + '</field>' +
                        '</block>' +
                        '</xml>';
                var block = Blockly.Xml.textToDom(blockText).firstChild;
                xmlList.push(block);
            }
        }
    }
    var allFloatVars = currWorkspace.getVariablesOfType('float');
    var createfloatBtnXml = Blockly.Xml.textToDom('<xml><button text="' + Blockly.Msg.VAR_CREATE_FLOAT + '" callbackKey="createVarBtnFloat">' +
            '</button></xml>').firstChild;
    xmlList.push(createfloatBtnXml);
    if (allFloatVars.length > 0) {
        if (Blockly.Blocks['vars_set_float']) {
            var firstVariable = allFloatVars[allFloatVars.length - 1];
            var gap = 24;
            var blockText =
                    '<xml>' +
                    '<block type="vars_set_float" gap="' + gap + '">' +
                    '<field name="VAR_SET_FLOAT" variabletype="float">' + firstVariable.name + '</field>' +
                    '</block>' +
                    '</xml>';
            var block = Blockly.Xml.textToDom(blockText).firstChild;
            xmlList.push(block);
        }
        if (Blockly.Blocks['vars_get_float']) {
            allFloatVars.sort(Blockly.VariableModel.compareByType);
            for (var i = 0, variable; variable = allFloatVars[i]; i++) {
                var blockText =
                        '<xml>' +
                        '<block type="vars_get_float" gap="8">' +
                        '<field name="VAR_GET_FLOAT" variabletype="float">' + variable.name + '</field>' +
                        '</block>' +
                        '</xml>';
                var block = Blockly.Xml.textToDom(blockText).firstChild;
                xmlList.push(block);
            }
        }
    }
    return xmlList;
};

var textVariablesCallBack = function (currWorkspace) {
    var allStringVars = currWorkspace.getVariablesOfType('String');
    var xmlList = [];
    var createStringBtnXml = Blockly.Xml.textToDom('<xml><button text="' + Blockly.Msg.VAR_CREATE_STRING + '" callbackKey="createVarBtnString">' +
            '</button></xml>').firstChild;
    xmlList.push(createStringBtnXml);
    if (allStringVars.length > 0) {
        if (Blockly.Blocks['vars_set_string']) {
            var firstVariable = allStringVars[allStringVars.length - 1];
            var gap = 24;
            var blockText =
                    '<xml>' +
                    '<block type="vars_set_string" gap="' + gap + '">' +
                    '<field name="VAR_SET_STRING" variabletype="String">' + firstVariable.name + '</field>' +
                    '</block>' +
                    '</xml>';
            var block = Blockly.Xml.textToDom(blockText).firstChild;
            xmlList.push(block);
        }
        if (Blockly.Blocks['vars_get_string']) {
            allStringVars.sort(Blockly.VariableModel.compareByType);
            for (var i = 0, variable; variable = allStringVars[i]; i++) {
                var blockText =
                        '<xml>' +
                        '<block type="vars_get_string" gap="8">' +
                        '<field name="VAR_GET_STRING" variabletype="String">' + variable.name + '</field>' +
                        '</block>' +
                        '</xml>';
                var block = Blockly.Xml.textToDom(blockText).firstChild;
                xmlList.push(block);
            }
        }
    }
    return xmlList;
};

var booleanVariablesCallBack = function (currWorkspace) {
    var allStringVars = currWorkspace.getVariablesOfType('bool');
    var xmlList = [];
    var createboolBtnXml = Blockly.Xml.textToDom('<xml><button text="' + Blockly.Msg.VAR_CREATE_BOOLEAN + '" callbackKey="createVarBtnBoolean">' +
            '</button></xml>').firstChild;
    xmlList.push(createboolBtnXml);
    if (allStringVars.length > 0) {
        if (Blockly.Blocks['vars_set_boolean']) {
            var firstVariable = allStringVars[allStringVars.length - 1];
            var gap = 24;
            var blockText =
                    '<xml>' +
                    '<block type="vars_set_boolean" gap="' + gap + '">' +
                    '<field name="VAR_SET_BOOLEAN" variabletype="bool">' + firstVariable.name + '</field>' +
                    '</block>' +
                    '</xml>';
            var block = Blockly.Xml.textToDom(blockText).firstChild;
            xmlList.push(block);
        }
        if (Blockly.Blocks['vars_get_boolean']) {
            allStringVars.sort(Blockly.VariableModel.compareByType);
            for (var i = 0, variable; variable = allStringVars[i]; i++) {
                var blockText =
                        '<xml>' +
                        '<block type="vars_get_boolean" gap="8">' +
                        '<field name="VAR_GET_BOOLEAN" variabletype="bool">' + variable.name + '</field>' +
                        '</block>' +
                        '</xml>';
                var block = Blockly.Xml.textToDom(blockText).firstChild;
                xmlList.push(block);
            }
        }
    }
    return xmlList;
};