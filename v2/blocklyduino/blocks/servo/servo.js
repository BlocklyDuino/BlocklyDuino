/**
 * @license
 * Copyright 2012 Fred Lin
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Servomotor blocks for Blockly.
 * @author gasolin@gmail.com (Fred Lin)
 * @author scanet@libreduc.cc (Sébastien Canet)
 */
 
'use strict';

goog.provide('Blockly.Constants.servo');

goog.require('Blockly.Blocks');
goog.require('Blockly');

var servoMediaFolder = "./blocklyduino/blocks/servo/";

Blockly.Blocks['servo_move'] = {
    init: function () {
        this.appendDummyInput()
                .appendField(Blockly.Msg.SERVO_MOVE_INPUT)
                .appendField(new Blockly.FieldImage(servoMediaFolder + "servo.jpg", 64, 64))
                .appendField(Blockly.Msg.SERVO_PIN)
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
        this.appendValueInput("DEGREE")
                .setCheck(intCompatibility)
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(Blockly.Msg.SERVO_MOVE_DEGREE);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.SERVO_MOVE_TOOLTIP);
        this.setHelpUrl(Blockly.Msg.SERVO_MOVE_HELPURL);
        this.setStyle('servo_blocks');
    }
};

Blockly.Blocks['servo_read_degrees'] = {
    init: function () {
        this.appendDummyInput()
                .appendField(Blockly.Msg.SERVO_READ_DEGREES_INPUT)
                .appendField(new Blockly.FieldImage(servoMediaFolder + "servo.jpg", 64, 64))
                .appendField(Blockly.Msg.SERVO_PIN)
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
        this.setOutput(true, "int");
        this.setTooltip(Blockly.Msg.SERVO_READ_DEGREES_TOOLTIP);
        this.setHelpUrl(Blockly.Msg.SERVO_READ_DEGREES_HELPURL);
        this.setStyle('servo_blocks');
    }
};