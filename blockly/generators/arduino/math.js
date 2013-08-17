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
 * @fileoverview Generating Arduino for math blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

Blockly.Arduino = Blockly.Generator.get('Arduino');


Blockly.Arduino.math_number = function() {
  // Numeric value.
  var code = window.parseFloat(this.getTitleValue('NUM'));
  // -4.abs() returns -4 in Dart due to strange order of operation choices.
  // -4 is actually an operator and a number.  Reflect this in the order.
  var order = code < 0 ?
      Blockly.Arduino.ORDER_UNARY_PREFIX : Blockly.Arduino.ORDER_ATOMIC;
  return [code, order];
};

Blockly.Arduino.math_arithmetic = function() {
  // Basic arithmetic operators, and power.
  var mode = this.getTitleValue('OP');
  var tuple = Blockly.Arduino.math_arithmetic.OPERATORS[mode];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Arduino.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'B', order) || '0';
  var code;
  if (!operator) {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Arduino.math_arithmetic.OPERATORS = {
  ADD: [' + ', Blockly.Arduino.ORDER_ADDITIVE],
  MINUS: [' - ', Blockly.Arduino.ORDER_ADDITIVE],
  MULTIPLY: [' * ', Blockly.Arduino.ORDER_MULTIPLICATIVE],
  DIVIDE: [' / ', Blockly.Arduino.ORDER_MULTIPLICATIVE],
  POWER: [null, Blockly.Arduino.ORDER_NONE]  // Handle power separately.
};

Blockly.Arduino.math_change = function() {
  // Add to a variable in place.
  var argument0 = Blockly.Arduino.valueToCode(this, 'DELTA',
      Blockly.Arduino.ORDER_ADDITIVE) || '0';
  var varName = Blockly.Arduino.variableDB_.getName(this.getTitleValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + ' = (' + varName + ' is num ? ' + varName + ' : 0) + ' +
      argument0 + ';\n';
};

Blockly.Arduino.math_single = function() {
  // Math operators with single operand.
  var operator = this.getTitleValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedents.
    arg = Blockly.Arduino.valueToCode(this, 'NUM',
        Blockly.Arduino.ORDER_UNARY_PREFIX) || '0';
    if (arg[0] == '-') {
      // --3 is not legal in Dart.
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Blockly.Arduino.ORDER_UNARY_PREFIX];
  }
  if (operator == 'ABS' || operator.substring(0, 5) == 'ROUND') {
    arg = Blockly.Arduino.valueToCode(this, 'NUM',
        Blockly.Arduino.ORDER_UNARY_POSTFIX) || '0';
  } else if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = Blockly.Arduino.valueToCode(this, 'NUM',
        Blockly.Arduino.ORDER_MULTIPLICATIVE) || '0';
  } else {
    arg = Blockly.Arduino.valueToCode(this, 'NUM',
        Blockly.Arduino.ORDER_NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses.
  switch (operator) {
    case 'ABS':
      code = arg + '.abs()';
      break;
    case 'ROOT':
      code = 'Math.sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'Math.log(' + arg + ')';
      break;
    case 'EXP':
      code = 'Math.exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'Math.pow(10,' + arg + ')';
      break;
    case 'ROUND':
      code = arg + '.round()';
      break;
    case 'ROUNDUP':
      code = arg + '.ceil()';
      break;
    case 'ROUNDDOWN':
      code = arg + '.floor()';
      break;
    case 'SIN':
      code = 'Math.sin(' + arg + ' / 180 * Math.PI)';
      break;
    case 'COS':
      code = 'Math.cos(' + arg + ' / 180 * Math.PI)';
      break;
    case 'TAN':
      code = 'Math.tan(' + arg + ' / 180 * Math.PI)';
      break;
  }
  if (code) {
    return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
  }
  // Second, handle cases which generate values that may need parentheses.
  switch (operator) {
    case 'LOG10':
      code = 'Math.log(' + arg + ') / Math.log(10)';
      break;
    case 'ASIN':
      code = 'Math.asin(' + arg + ') / Math.PI * 180';
      break;
    case 'ACOS':
      code = 'Math.acos(' + arg + ') / Math.PI * 180';
      break;
    case 'ATAN':
      code = 'Math.atan(' + arg + ') / Math.PI * 180';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.Arduino.ORDER_MULTIPLICATIVE];
};

// Rounding functions have a single operand.
Blockly.Arduino.math_round = Blockly.Arduino.math_single;
// Trigonometry functions have a single operand.
Blockly.Arduino.math_trig = Blockly.Arduino.math_single;

Blockly.Arduino.math_on_list = function() {
  // Math functions for lists.
  var func = this.getTitleValue('OP');
  var list = Blockly.Arduino.valueToCode(this, 'LIST',
      Blockly.Arduino.ORDER_NONE) || '[]';
  var code;
  switch (func) {
    case 'SUM':
      if (!Blockly.Arduino.definitions_['math_sum']) {
        var functionName = Blockly.Arduino.variableDB_.getDistinctName(
            'math_sum', Blockly.Generator.NAME_TYPE);
        Blockly.Arduino.math_on_list.math_sum = functionName;
        var func = [];
        func.push('num ' + functionName + '(List myList) {');
        func.push('  num sumVal = 0;');
        func.push('  myList.forEach((num entry) {sumVal += entry;});');
        func.push('  return sumVal;');
        func.push('}');
        Blockly.Arduino.definitions_['math_sum'] = func.join('\n');
      }
      code = Blockly.Arduino.math_on_list.math_sum + '(' + list + ')';
      break;
    case 'MIN':
      if (!Blockly.Arduino.definitions_['math_min']) {
        var functionName = Blockly.Arduino.variableDB_.getDistinctName(
            'math_min', Blockly.Generator.NAME_TYPE);
        Blockly.Arduino.math_on_list.math_min = functionName;
        var func = [];
        func.push('num ' + functionName + '(List myList) {');
        func.push('  if (myList.isEmpty()) return null;');
        func.push('  num minVal = myList[0];');
        func.push('  myList.forEach((num entry) ' +
                  '{minVal = Math.min(minVal, entry);});');
        func.push('  return minVal;');
        func.push('}');
        Blockly.Arduino.definitions_['math_min'] = func.join('\n');
      }
      code = Blockly.Arduino.math_on_list.math_min + '(' + list + ')';
      break;
    case 'MAX':
      if (!Blockly.Arduino.definitions_['math_max']) {
        var functionName = Blockly.Arduino.variableDB_.getDistinctName(
            'math_max', Blockly.Generator.NAME_TYPE);
        Blockly.Arduino.math_on_list.math_max = functionName;
        var func = [];
        func.push('num ' + functionName + '(List myList) {');
        func.push('  if (myList.isEmpty()) return null;');
        func.push('  num maxVal = myList[0];');
        func.push('  myList.forEach((num entry) ' +
                  '{maxVal = Math.max(maxVal, entry);});');
        func.push('  return maxVal;');
        func.push('}');
        Blockly.Arduino.definitions_['math_max'] = func.join('\n');
      }
      code = Blockly.Arduino.math_on_list.math_max + '(' + list + ')';
      break;
    case 'AVERAGE':
      // This operation exclude null and values that are not int or float:
      //   math_mean([null,null,"aString",1,9]) == 5.0.
      if (!Blockly.Arduino.definitions_['math_average']) {
        var functionName = Blockly.Arduino.variableDB_.getDistinctName(
            'math_average', Blockly.Generator.NAME_TYPE);
        Blockly.Arduino.math_on_list.math_average = functionName;
        var func = [];
        func.push('num ' + functionName + '(List myList) {');
        func.push('  // First filter list for numbers only.');
        func.push('  List localList = myList.filter((a) => a is num);');
        func.push('  if (localList.isEmpty()) return null;');
        func.push('  num sumVal = 0;');
        func.push('  localList.forEach((num entry) {sumVal += entry;});');
        func.push('  return sumVal / localList.length;');
        func.push('}');
        Blockly.Arduino.definitions_['math_average'] = func.join('\n');
      }
      code = Blockly.Arduino.math_on_list.math_average + '(' + list + ')';
      break;
    case 'MEDIAN':
      if (!Blockly.Arduino.definitions_['math_median']) {
        var functionName = Blockly.Arduino.variableDB_.getDistinctName(
            'math_median', Blockly.Generator.NAME_TYPE);
        Blockly.Arduino.math_on_list.math_median = functionName;
        var func = [];
        func.push('num ' + functionName + '(List myList) {');
        func.push('  // First filter list for numbers only, then sort, ' +
                  'then return middle value');
        func.push('  // or the average of two middle values if list has an ' +
                  'even number of elements.');
        func.push('  List localList = myList.filter((a) => a is num);');
        func.push('  if (localList.isEmpty()) return null;');
        func.push('  localList.sort((a, b) => (a - b));');
        func.push('  int index = (localList.length / 2).toInt();');
        func.push('  if (localList.length % 2 == 1) {');
        func.push('    return localList[index];');
        func.push('  } else {');
        func.push('    return (localList[index - 1] + localList[index]) / 2;');
        func.push('  }');
        func.push('}');
        Blockly.Arduino.definitions_['math_median'] = func.join('\n');
      }
      code = Blockly.Arduino.math_on_list.math_median + '(' + list + ')';
      break;
    case 'MODE':
      if (!Blockly.Arduino.definitions_['math_modes']) {
        var functionName = Blockly.Arduino.variableDB_.getDistinctName(
            'math_modes', Blockly.Generator.NAME_TYPE);
        Blockly.Arduino.math_on_list.math_modes = functionName;
        // As a list of numbers can contain more than one mode,
        // the returned result is provided as an array.
        // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
        var func = [];
        func.push('List ' + functionName + '(values) {');
        func.push('  List modes = [];');
        func.push('  List counts = [];');
        func.push('  int maxCount = 0;');
        func.push('  for (int i = 0; i < values.length; i++) {');
        func.push('    var value = values[i];');
        func.push('    bool found = false;');
        func.push('    int thisCount;');
        func.push('    for (int j = 0; j < counts.length; j++) {');
        func.push('      if (counts[j][0] === value) {');
        func.push('        thisCount = ++counts[j][1];');
        func.push('        found = true;');
        func.push('        break;');
        func.push('      }');
        func.push('    }');
        func.push('    if (!found) {');
        func.push('      counts.add([value, 1]);');
        func.push('      thisCount = 1;');
        func.push('    }');
        func.push('    maxCount = Math.max(thisCount, maxCount);');
        func.push('  }');
        func.push('  for (int j = 0; j < counts.length; j++) {');
        func.push('    if (counts[j][1] == maxCount) {');
        func.push('        modes.add(counts[j][0]);');
        func.push('    }');
        func.push('  }');
        func.push('  return modes;');
        func.push('}');
        Blockly.Arduino.definitions_['math_modes'] = func.join('\n');
      }
      code = Blockly.Arduino.math_on_list.math_modes + '(' + list + ')';
      break;
    case 'STD_DEV':
      if (!Blockly.Arduino.definitions_['math_standard_deviation']) {
        var functionName = Blockly.Arduino.variableDB_.getDistinctName(
            'math_standard_deviation', Blockly.Generator.NAME_TYPE);
        Blockly.Arduino.math_on_list.math_standard_deviation = functionName;
        var func = [];
        func.push('num ' + functionName + '(myList) {');
        func.push('  // First filter list for numbers only.');
        func.push('  List numbers = myList.filter((a) => a is num);');
        func.push('  if (numbers.isEmpty()) return null;');
        func.push('  num n = numbers.length;');
        func.push('  num sum = 0;');
        func.push('  numbers.forEach((x) => sum += x);');
        func.push('  num mean = sum / n;');
        func.push('  num sumSquare = 0;');
        func.push('  numbers.forEach((x) => sumSquare += ' +
                  'Math.pow(x - mean, 2));');
        func.push('  return Math.sqrt(sumSquare / n);');
        func.push('}');
        Blockly.Arduino.definitions_['math_standard_deviation'] = func.join('\n');
      }
      code = Blockly.Arduino.math_on_list.math_standard_deviation +
          '(' + list + ')';
      break;
    case 'RANDOM':
      if (!Blockly.Arduino.definitions_['math_random_item']) {
        var functionName = Blockly.Arduino.variableDB_.getDistinctName(
            'math_random_item', Blockly.Generator.NAME_TYPE);
        Blockly.Arduino.math_on_list.math_random_item = functionName;
        var func = [];
        func.push('Dynamic ' + functionName + '(List myList) {');
        func.push('  int x = (Math.random() * myList.length).floor().toInt();');
        func.push('  return myList[x];');
        func.push('}');
        Blockly.Arduino.definitions_['math_random_item'] = func.join('\n');
      }
      code = Blockly.Arduino.math_on_list.math_random_item + '(' + list + ')';
      break;
    default:
      throw 'Unknown operator: ' + func;
  }
  return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.math_constrain = function() {
  // Constrain a number between two limits.
  var argument0 = Blockly.Arduino.valueToCode(this, 'VALUE',
      Blockly.Arduino.ORDER_NONE) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'LOW',
      Blockly.Arduino.ORDER_NONE) || '0';
  var argument2 = Blockly.Arduino.valueToCode(this, 'HIGH',
      Blockly.Arduino.ORDER_NONE) || '0';
  var code = 'Math.min(Math.max(' + argument0 + ', ' + argument1 + '), ' +
	    argument2 + ')';
  return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.math_modulo = function() {
  // Remainder computation.
  var argument0 = Blockly.Arduino.valueToCode(this, 'DIVIDEND',
      Blockly.Arduino.ORDER_MULTIPLICATIVE) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'DIVISOR',
      Blockly.Arduino.ORDER_MULTIPLICATIVE) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.Arduino.ORDER_MULTIPLICATIVE];
};

Blockly.Arduino.math_random_int = function() {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.Arduino.valueToCode(this, 'FROM',
      Blockly.Arduino.ORDER_NONE) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'TO',
      Blockly.Arduino.ORDER_NONE) || '0';
  if (!Blockly.Arduino.definitions_['math_random_int']) {
    var functionName = Blockly.Arduino.variableDB_.getDistinctName(
        'math_random_int', Blockly.Generator.NAME_TYPE);
    Blockly.Arduino.math_random_int.random_function = functionName;
    var func = [];
    func.push('int ' + functionName + '(num a, num b) {');
    func.push('  if (a > b) {');
    func.push('    // Swap a and b to ensure a is smaller.');
    func.push('    num c = a;');
    func.push('    a = b;');
    func.push('    b = c;');
    func.push('  }');
    func.push('  return (Math.random() * (b - a + 1) + a).toInt();');
    func.push('}');
    Blockly.Arduino.definitions_['math_random_int'] = func.join('\n');
  }
  var code = Blockly.Arduino.math_random_int.random_function +
      '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.math_random_float = function() {
  // Random fraction between 0 and 1.
  return ['Math.random()', Blockly.Arduino.ORDER_UNARY_POSTFIX];
};
