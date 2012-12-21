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
 * @fileoverview Generating Arduino for list blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

Blockly.Arduino = Blockly.Generator.get('Arduino');

Blockly.Arduino.lists_create_empty = function() {
  // Create an empty list.
  return ['[]', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.lists_create_with = function() {
  // Create a list with any number of elements of any type.
  var code = new Array(this.itemCount_);
  for (var n = 0; n < this.itemCount_; n++) {
    code[n] = Blockly.Arduino.valueToCode(this, 'ADD' + n,
        Blockly.Arduino.ORDER_NONE) || 'null';
  }
  var code = '[' + code.join(', ') + ']';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.lists_repeat = function() {
  // Create a list with one element repeated.
  if (!Blockly.Arduino.definitions_['lists_repeat']) {
    // Function adapted from Closure's goog.array.repeat.
    var functionName = Blockly.Arduino.variableDB_.getDistinctName('lists_repeat',
        Blockly.Generator.NAME_TYPE);
    Blockly.Arduino.lists_repeat.repeat = functionName;
    var func = [];
    func.push('List ' + functionName + '(value, n) {');
    func.push('  var array = new List(n);');
    func.push('  for (int i = 0; i < n; i++) {');
    func.push('    array[i] = value;');
    func.push('  }');
    func.push('  return array;');
    func.push('}');
    Blockly.Arduino.definitions_['lists_repeat'] = func.join('\n');
  }
  var argument0 = Blockly.Arduino.valueToCode(this, 'ITEM', true) || 'null';
  var argument1 = Blockly.Arduino.valueToCode(this, 'NUM') || '0';
  var code = Blockly.Arduino.lists_repeat.repeat +
      '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.lists_length = function() {
  // Testing the length of a list is the same as for a string.
  return Blockly.Arduino.text_length.call(this);
};

Blockly.Arduino.lists_isEmpty = function() {
  // Testing a list for being empty is the same as for a string.
  return Blockly.Arduino.text_isEmpty.call(this);
};

Blockly.Arduino.lists_indexOf = function() {
  // Searching a list for a value is the same as search for a substring.
  return Blockly.Arduino.text_indexOf.call(this);
};

Blockly.Arduino.lists_getIndex = function() {
  // Indexing into a list is the same as indexing into a string.
  return Blockly.Arduino.text_charAt.call(this);
};

Blockly.Arduino.lists_setIndex = function() {
  // Set element at index.
  var argument0 = Blockly.Arduino.valueToCode(this, 'AT',
      Blockly.Arduino.ORDER_ADDITIVE) || '1';
  var argument1 = Blockly.Arduino.valueToCode(this, 'LIST',
      Blockly.Arduino.ORDER_UNARY_POSTFIX) || '[]';
  var argument2 = Blockly.Arduino.valueToCode(this, 'TO',
      Blockly.Arduino.ORDER_ASSIGNMENT) || 'null';
  // Blockly uses one-based indicies.
  if (argument0.match(/^\d+$/)) {
    // If the index is a naked number, decrement it right now.
    argument0 = parseInt(argument0, 10) - 1;
  } else {
    // If the index is dynamic, decrement it in code.
    argument0 += ' - 1';
  }
  return argument1 + '[' + argument0 + '] = ' + argument2 + ';\n';
};
