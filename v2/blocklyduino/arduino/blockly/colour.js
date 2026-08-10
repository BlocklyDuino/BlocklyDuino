/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Generating Arduino code for colour blocks.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */
 
'use strict';

goog.provide('Blockly.Arduino.colour');

goog.require('Blockly.Arduino');


Blockly.Arduino['colour_picker'] = function (block) {
    // Colour picker.
    var code = '\"' + block.getFieldValue('COLOUR') + '\"';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['colour_random'] = function (block) {
    // Generate a random colour.
    var functionName = Blockly.Arduino.provideFunction_('colourRandom',
            ['function ' + Blockly.Arduino.FUNCTION_NAME_PLACEHOLDER_ + '() {',
                '  String colorRand = "";',
                '  for (int i = 0; i < 6; i++) {',
                '    int randNum = random(0, 16);',
                '    colorRand += String(randNum, HEX);',
                '  }',
                '  return (\'#\' + colorRand);',
                '}']);
    var code = functionName + '()';
    return [code, Blockly.Arduino.ORDER_FUNCTION_CALL];
};

Blockly.Arduino['colour_rgb'] = function (block) {
    // Compose a colour from RGB components expressed as percentages.
    var red = Blockly.Arduino.valueToCode(block, 'RED', Blockly.Arduino.ORDER_COMMA) || 0;
    var green = Blockly.Arduino.valueToCode(block, 'GREEN', Blockly.Arduino.ORDER_COMMA) || 0;
    var blue = Blockly.Arduino.valueToCode(block, 'BLUE', Blockly.Arduino.ORDER_COMMA) || 0;
    var functionName = Blockly.Arduino.provideFunction_(
            'colourRgb',
            ['String ' + Blockly.Arduino.FUNCTION_NAME_PLACEHOLDER_ +
                        '(int r, int g, int b) {',
                '  r = max(min(r * 2.55, 255), 0);',
                '  g = max(min(g * 2.55, 255), 0);',
                '  b = max(min(b * 2.55, 255), 0);',
                '  return (\'#\' + String(r, HEX) + String(g, HEX) + String(b, HEX));',
                '}']);
    var code = functionName + '(' + red + ', ' + green + ', ' + blue + ')';
    return [code, Blockly.Arduino.ORDER_FUNCTION_CALL];
};

Blockly.Arduino['colour_blend'] = function (block) {
    // Blend two colours together.
    var c1 = Blockly.Arduino.valueToCode(block, 'COLOUR1', Blockly.Arduino.ORDER_COMMA) || '\'#000000\'';
    var c2 = Blockly.Arduino.valueToCode(block, 'COLOUR2', Blockly.Arduino.ORDER_COMMA) || '\'#000000\'';
    var ratio = Blockly.Arduino.valueToCode(block, 'RATIO', Blockly.Arduino.ORDER_COMMA) || 0.5;
    var functionName = Blockly.Arduino.provideFunction_(
            'colourBlend',
            ['String ' + Blockly.Arduino.FUNCTION_NAME_PLACEHOLDER_ +
                        '(String c1, String c2, float ratio) {',
                '  ratio = max(min(ratio, 1), 0);',
                '  int r1 = (c1.substring(1, 3)).toInt();',
                '  int g1 = (c1.substring(3, 5)).toInt();',
                '  int b1 = (c1.substring(5, 7)).toInt();',
                '  int r2 = (c2.substring(1, 3)).toInt();',
                '  int g2 = (c2.substring(3, 5)).toInt();',
                '  int b2 = (c2.substring(5, 7)).toInt();',
                '  int r = round(r1 * (1 - ratio) + r2 * ratio);',
                '  int g = round(g1 * (1 - ratio) + g2 * ratio);',
                '  int b = round(b1 * (1 - ratio) + b2 * ratio);',
                '  return (\'#\' + String(r) + String(g) + String(b));',
                '}']);
    var code = functionName + '(' + c1 + ', ' + c2 + ', ' + ratio + ')';
    return [code, Blockly.Arduino.ORDER_FUNCTION_CALL];
};
