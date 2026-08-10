/**
 * @license
 * Copyright 2012 Fred Lin
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Servomotor blocks for Blockly.
 * @author gasolin@gmail.com (Fred Lin)
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

'use strict';

goog.provide('Blockly.Arduino.servo');

goog.require('Blockly.Arduino');

Blockly.Arduino['servo_move'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var value_degree = Blockly.Arduino.valueToCode(block, 'DEGREE', Blockly.Arduino.ORDER_ATOMIC);

    Blockly.Arduino.includes_['includes_servo'] = '#include <Servo.h>';
    Blockly.Arduino.definitions_['var_servo' + dropdown_pin] = 'Servo servo_' + dropdown_pin + ';';
    Blockly.Arduino.setups_['setup_servo_' + dropdown_pin] = 'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');';

    var code = 'servo_' + dropdown_pin + '.write(' + value_degree + ');\n';
    return code;
};

Blockly.Arduino['servo_read_degrees'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');

    Blockly.Arduino.includes_['includes_servo'] = '#include <Servo.h>';
    Blockly.Arduino.definitions_['var_servo' + dropdown_pin] = 'Servo servo_' + dropdown_pin + ';';
    Blockly.Arduino.setups_['setup_servo_' + dropdown_pin] = 'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');';

    var code = 'servo_' + dropdown_pin + '.read()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};
