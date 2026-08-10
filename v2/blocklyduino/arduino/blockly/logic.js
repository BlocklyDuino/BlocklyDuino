/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Generating Arduino code for logic blocks.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */
 
'use strict';

goog.provide('Blockly.Arduino.logic');

goog.require('Blockly.Arduino');

Blockly.Arduino['controls_if'] = function (block) {
    // If/elseif/else condition.
    var n = 0;
    var code = '',
            branchCode,
            conditionCode;
    do {
        conditionCode = Blockly.Arduino.valueToCode(block, 'IF' + n,
                Blockly.Arduino.ORDER_NONE) || 'false';
        branchCode = Blockly.Arduino.statementToCode(block, 'DO' + n);
        code += (n > 0 ? ' else ' : '') +
                'if (' + conditionCode + ') {\n' + branchCode + '}';

        ++n;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE')) {
        branchCode = Blockly.Arduino.statementToCode(block, 'ELSE');
        code += ' else {\n' + branchCode + '}';
    }
    return code + '\n';
};

Blockly.Arduino['logic_compare'] = function (block) {
    // Comparison operator.
    var OPERATORS = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
    };
    var operator = OPERATORS[block.getFieldValue('OP')];
    var order = (operator == '==' || operator == '!=') ?
            Blockly.Arduino.ORDER_EQUALITY : Blockly.Arduino.ORDER_RELATIONAL;
    var argument0 = Blockly.Arduino.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.Arduino.valueToCode(block, 'B', order) || '0';
    var code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
};

Blockly.Arduino['logic_operation'] = function (block) {
    // Operations 'and', 'or'.
    var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
    var order = (operator == '&&') ? Blockly.Arduino.ORDER_LOGICAL_AND :
            Blockly.Arduino.ORDER_LOGICAL_OR;
    var argument0 = Blockly.Arduino.valueToCode(block, 'A', order);
    var argument1 = Blockly.Arduino.valueToCode(block, 'B', order);
    if (!argument0 && !argument1) {
        // If there are no arguments, then the return value is false.
        argument0 = 'false';
        argument1 = 'false';
    } else {
        // Single missing arguments have no effect on the return value.
        var defaultArgument = (operator == '&&') ? 'true' : 'false';
        if (!argument0) {
            argument0 = defaultArgument;
        }
        if (!argument1) {
            argument1 = defaultArgument;
        }
    }
    var code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
};

Blockly.Arduino['logic_negate'] = function (block) {
    // Negation.
    var order = Blockly.Arduino.ORDER_UNARY_PREFIX;
    var argument0 = Blockly.Arduino.valueToCode(block, 'BOOL', order) || 'false';
    var code = '!' + argument0;
    return [code, order];
};

Blockly.Arduino['logic_boolean'] = function (block) {
    // Boolean values true and false.
    var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['logic_null'] = function (block) {
    // Null data type.
    return ['null', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['logic_ternary'] = function (block) {
    // Ternary operator.
    var value_if = Blockly.Arduino.valueToCode(block, 'IF',
            Blockly.Arduino.ORDER_CONDITIONAL) || 'false';
    var value_then = Blockly.Arduino.valueToCode(block, 'THEN',
            Blockly.Arduino.ORDER_CONDITIONAL) || 'null';
    var value_else = Blockly.Arduino.valueToCode(block, 'ELSE',
            Blockly.Arduino.ORDER_CONDITIONAL) || 'null';
    var code = value_if + ' ? ' + value_then + ' : ' + value_else;
    return [code, Blockly.Arduino.ORDER_CONDITIONAL];
};

Blockly.Arduino['controls_switch'] = function (block) {
    // switch/var/case/do/default function
    var n = 0;
    var switchvar = Blockly.Arduino.variableDB_.getName(this.getFieldValue('SWVAR'), Blockly.Variables.NAME_TYPE);
    var argument = Blockly.Arduino.valueToCode(this, 'CASE' + n, Blockly.Arduino.ORDER_NONE) || 'false';
    var branch = Blockly.Arduino.statementToCode(this, 'DO' + n);
    var code = 'switch (int ' + switchvar + ') {\n' + 'case ' + argument + ': \n' + branch + '  break;\n';
    for (n = 1; n <= this.casebreakCount_; n++) {
        argument = Blockly.Arduino.valueToCode(this, 'CASE' + n, Blockly.Arduino.ORDER_NONE) || 'false';
        branch = Blockly.Arduino.statementToCode(this, 'DO' + n);
        code += ' case ' + argument + ': \n' + branch + '  break;\n';
    }
    if (this.defaultCount_) {
        branch = Blockly.Arduino.statementToCode(this, 'DEFAULT');
        code += ' default :\n' + branch + ' ';
    }
    code += '}'
    return code + '\n';
};
