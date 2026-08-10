/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Generating Arduino code for loop blocks.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */
 
'use strict';

goog.provide('Blockly.Arduino.loops');

goog.require('Blockly.Arduino');


Blockly.Arduino['controls_repeat_ext'] = function (block) {
    // Repeat n times.
    if (block.getField('TIMES')) {
        // Internal number.
        var repeats = String(Number(block.getFieldValue('TIMES')));
    } else {
        // External number.
        var repeats = Blockly.Arduino.valueToCode(block, 'TIMES',
                Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
    }
    var branch = Blockly.Arduino.statementToCode(block, 'DO');
    branch = Blockly.Arduino.addLoopTrap(branch, block.id);
    var code = '';
    var loopVar = Blockly.Arduino.variableDB_.getDistinctName(
            'count', Blockly.Variables.NAME_TYPE);
    var endVar = repeats;
    if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
        var endVar = Blockly.Arduino.variableDB_.getDistinctName(
                'repeat_end', Blockly.Variables.NAME_TYPE);
        code += 'int ' + endVar + ' = ' + repeats + ';\n';
    }
    code += 'for (int ' + loopVar + ' = 0; ' +
            loopVar + ' < ' + endVar + '; ' +
            loopVar + '++) {\n' +
            branch + '}\n';
    return code;
};

Blockly.Arduino['controls_repeat'] =
        Blockly.Arduino['controls_repeat_ext'];

Blockly.Arduino['controls_whileUntil'] = function (block) {
    // Do while/until loop.
    var argument0 = Blockly.Arduino.valueToCode(this, 'BOOL', Blockly.Arduino.ORDER_NONE) || 'false';
    var branch = Blockly.Arduino.statementToCode(this, 'DO');
    if (Blockly.Arduino.INFINITE_LOOP_TRAP) {
        branch = Blockly.Arduino.INFINITE_LOOP_TRAP.replace(/%1/g,
                '\'' + this.id + '\'') + branch;
    }
    if (this.getFieldValue('MODE') == 'UNTIL') {
        if (!argument0.match(/^\w+$/)) {
            argument0 = '(' + argument0 + ')';
        }
        argument0 = '!' + argument0;
    }
    return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.Arduino['controls_for'] = function (block) {
    // For loop.
    var variable0 = Blockly.Arduino.variableDB_.getName(
            block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var argument0 = Blockly.Arduino.valueToCode(block, 'FROM',
            Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
    var argument1 = Blockly.Arduino.valueToCode(block, 'TO',
            Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
    var increment = Blockly.Arduino.valueToCode(block, 'BY',
            Blockly.Arduino.ORDER_ASSIGNMENT) || '1';
    var branch = Blockly.Arduino.statementToCode(block, 'DO');
    branch = Blockly.Arduino.addLoopTrap(branch, block.id);
    var code;
    if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
            Blockly.isNumber(increment)) {
        // All arguments are simple numbers.
        var up = parseFloat(argument0) <= parseFloat(argument1);
        code = 'for (int ' + variable0 + ' = ' + argument0 + '; ' +
                variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
                variable0;
        var step = Math.abs(parseFloat(increment));
        if (step == 1) {
            code += up ? '++' : '--';
        } else {
            code += (up ? ' += ' : ' -= ') + step;
        }
        code += ') {\n' + branch + '}\n';
    } else {
        code = '';
        // Cache non-trivial values to variables to prevent repeated look-ups.
        var startVar = argument0;
        if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
            startVar = Blockly.Arduino.variableDB_.getDistinctName(
                    variable0 + '_start', Blockly.Variables.NAME_TYPE);
            code += 'var ' + startVar + ' = ' + argument0 + ';\n';
        }
        var endVar = argument1;
        if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
            var endVar = Blockly.Arduino.variableDB_.getDistinctName(
                    variable0 + '_end', Blockly.Variables.NAME_TYPE);
            code += 'var ' + endVar + ' = ' + argument1 + ';\n';
        }
        // Determine loop direction at start, in case one of the bounds
        // changes during loop execution.
        var incVar = Blockly.Arduino.variableDB_.getDistinctName(
                variable0 + '_inc', Blockly.Variables.NAME_TYPE);
        code += 'var ' + incVar + ' = ';
        if (Blockly.isNumber(increment)) {
            code += Math.abs(increment) + ';\n';
        } else {
            code += 'Math.abs(' + increment + ');\n';
        }
        code += 'if (' + startVar + ' > ' + endVar + ') {\n';
        code += Blockly.Arduino.INDENT + incVar + ' = -' + incVar + ';\n';
        code += '}\n';
        code += 'for (' + variable0 + ' = ' + startVar + '; ' +
                incVar + ' >= 0 ? ' +
                variable0 + ' <= ' + endVar + ' : ' +
                variable0 + ' >= ' + endVar + '; ' +
                variable0 + ' += ' + incVar + ') {\n' +
                branch + '}\n';
    }
    return code;
};

Blockly.Arduino['controls_forEach'] = function (block) {
    // For each loop.
    var variable0 = Blockly.Arduino.variableDB_.getName(
            block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var argument0 = Blockly.Arduino.valueToCode(block, 'LIST',
            Blockly.Arduino.ORDER_ASSIGNMENT) || '[]';
    var branch = Blockly.Arduino.statementToCode(block, 'DO');
    branch = Blockly.Arduino.addLoopTrap(branch, block.id);
    var code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var listVar = argument0;
    if (!argument0.match(/^\w+$/)) {
        listVar = Blockly.Arduino.variableDB_.getDistinctName(
                variable0 + '_list', Blockly.Variables.NAME_TYPE);
        code += 'var ' + listVar + ' = ' + argument0 + ';\n';
    }
    var indexVar = Blockly.Arduino.variableDB_.getDistinctName(
            variable0 + '_index', Blockly.Variables.NAME_TYPE);
    branch = Blockly.Arduino.INDENT + variable0 + ' = ' +
            listVar + '[' + indexVar + '];\n' + branch;
    code += 'for (var ' + indexVar + ' in ' + listVar + ') {\n' + branch + '}\n';
    return code;
};

Blockly.Arduino['controls_flow_statements'] = function (block) {
    // Flow statements: continue, break.
    switch (block.getFieldValue('FLOW')) {
        case 'BREAK':
            return 'break;\n';
        case 'CONTINUE':
            return 'continue;\n';
    }
    throw 'Unknown flow statement.';
};
