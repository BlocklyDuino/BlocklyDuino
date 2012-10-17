/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
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
 * @fileoverview Generating Arduino for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

Blockly.Arduino = Blockly.Generator.get('Arduino');

Blockly.Arduino.procedures_defreturn = function() {
  // Define a procedure with a return value.
  var funcName = Blockly.Arduino.variableDB_.getName(this.getTitleValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.Arduino.statementToCode(this, 'STACK');
  var returnValue = Blockly.Arduino.valueToCode(this, 'RETURN',
      Blockly.Arduino.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var returnType = returnValue ? 'Dynamic' : 'void';
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Arduino.variableDB_.getName(this.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = returnType + ' ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}';
  code = Blockly.Arduino.scrub_(this, code);
  Blockly.Arduino.definitions_[funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Arduino.procedures_defnoreturn = Blockly.Arduino.procedures_defreturn;

Blockly.Arduino.procedures_callreturn = function() {
  // Call a procedure with a return value.
  var funcName = Blockly.Arduino.variableDB_.getName(this.getTitleValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Arduino.valueToCode(this, 'ARG' + x,
        Blockly.Arduino.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.procedures_callnoreturn = function() {
  // Call a procedure with no return value.
  var funcName = Blockly.Arduino.variableDB_.getName(this.getTitleValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Arduino.valueToCode(this, 'ARG' + x,
        Blockly.Arduino.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};
