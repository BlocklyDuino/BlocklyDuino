/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Dart for colour blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

Blockly.Dart = Blockly.Generator.get('Dart');

Blockly.Dart.addReservedWords('Math');

Blockly.Dart.colour_picker = function() {
  // Colour picker.
  var code = '\'' + this.getTitleValue('COLOUR') + '\'';
  return [code, Blockly.Dart.ORDER_ATOMIC];
};

Blockly.Dart.colour_rgb = function() {
  // Compose a colour from RGB components.
  var red = Blockly.Dart.valueToCode(this, 'RED',
      Blockly.Dart.ORDER_NONE) || 0;
  var green = Blockly.Dart.valueToCode(this, 'GREEN',
      Blockly.Dart.ORDER_NONE) || 0;
  var blue = Blockly.Dart.valueToCode(this, 'BLUE',
      Blockly.Dart.ORDER_NONE) || 0;

  if (!Blockly.Dart.definitions_['colour_rgb']) {
    Blockly.Dart.definitions_['import_dart_math'] =
        'import \'dart:math\' as Math;';
    var functionName = Blockly.Dart.variableDB_.getDistinctName(
        'colour_rgb', Blockly.Generator.NAME_TYPE);
    Blockly.Dart.colour_rgb.functionName = functionName;
    var func = [];
    func.push('String ' + functionName + '(r, g, b) {');
    func.push('  String rs = (Math.max(Math.min(r, 1), 0) * 255).round()' +
              '.toRadixString(16);');
    func.push('  String gs = (Math.max(Math.min(g, 1), 0) * 255).round()' +
              '.toRadixString(16);');
    func.push('  String bs = (Math.max(Math.min(b, 1), 0) * 255).round()' +
              '.toRadixString(16);');
    func.push('  rs = \'0$rs\';');
    func.push('  rs = rs.substring(rs.length - 2);');
    func.push('  gs = \'0$gs\';');
    func.push('  gs = gs.substring(gs.length - 2);');
    func.push('  bs = \'0$bs\';');
    func.push('  bs = bs.substring(bs.length - 2);');
    func.push('  return \'#$rs$gs$bs\';');
    func.push('}');
    Blockly.Dart.definitions_['colour_rgb'] = func.join('\n');
  }
  var code = Blockly.Dart.colour_rgb.functionName +
      '(' + red + ', ' + green + ', ' + blue + ')';
  return [code, Blockly.Dart.ORDER_UNARY_POSTFIX];
};

Blockly.Dart.colour_blend = function() {
  // Blend two colours together.
  var c1 = Blockly.Dart.valueToCode(this, 'COLOUR1',
      Blockly.Dart.ORDER_NONE) || '\'#000000\'';
  var c2 = Blockly.Dart.valueToCode(this, 'COLOUR2',
      Blockly.Dart.ORDER_NONE) || '\'#000000\'';
  var ratio = Blockly.Dart.valueToCode(this, 'RATIO',
      Blockly.Dart.ORDER_NONE) || 0.5;

  if (!Blockly.Dart.definitions_['colour_blend']) {
    Blockly.Dart.definitions_['import_dart_math'] =
        'import \'dart:math\' as Math;';
    var functionName = Blockly.Dart.variableDB_.getDistinctName(
        'colour_blend', Blockly.Generator.NAME_TYPE);
    Blockly.Dart.colour_blend.functionName = functionName;
    var func = [];
    func.push('String ' + functionName + '(c1, c2, ratio) {');
    func.push('  ratio = Math.max(Math.min(ratio, 1), 0);');
    func.push('  int r1 = int.parse(\'0x${c1.substring(1, 3)}\');');
    func.push('  int g1 = int.parse(\'0x${c1.substring(3, 5)}\');');
    func.push('  int b1 = int.parse(\'0x${c1.substring(5, 7)}\');');
    func.push('  int r2 = int.parse(\'0x${c2.substring(1, 3)}\');');
    func.push('  int g2 = int.parse(\'0x${c2.substring(3, 5)}\');');
    func.push('  int b2 = int.parse(\'0x${c2.substring(5, 7)}\');');
    func.push('  String rs = (r1 * (1 - ratio) + r2 * ratio).round()' +
              '.toRadixString(16);');
    func.push('  String gs = (g1 * (1 - ratio) + g2 * ratio).round()' +
              '.toRadixString(16);');
    func.push('  String bs = (b1 * (1 - ratio) + b2 * ratio).round()' +
              '.toRadixString(16);');
    func.push('  rs = \'0$rs\';');
    func.push('  rs = rs.substring(rs.length - 2);');
    func.push('  gs = \'0$gs\';');
    func.push('  gs = gs.substring(gs.length - 2);');
    func.push('  bs = \'0$bs\';');
    func.push('  bs = bs.substring(bs.length - 2);');
    func.push('  return \'#$rs$gs$bs\';');
    func.push('}');
    Blockly.Dart.definitions_['colour_blend'] = func.join('\n');
  }
  var code = Blockly.Dart.colour_blend.functionName +
      '(' + c1 + ', ' + c2 + ', ' + ratio + ')';
  return [code, Blockly.Dart.ORDER_UNARY_POSTFIX];
};
