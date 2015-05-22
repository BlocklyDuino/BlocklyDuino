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
 * @fileoverview Generating Arduino for control blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 * @author2 Jes�s Lens Costa
 */
'use strict';

goog.provide('Blockly.Arduino.loops');

goog.require('Blockly.Arduino');

// Esperar
Blockly.Arduino.delay = function() {
	  var delay_time = Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000'
	  
	  var code = 'delay(' + delay_time + ');\n';
	  return code;
};


// Iniciar Programa Si Condicion
Blockly.Arduino.iniciar_Programa_Si = function() {
	 
	  var argument0 = Blockly.Arduino.valueToCode(this, 'BOOL',
	      Blockly.Arduino.ORDER_NONE) || 'false';
	  var branch = Blockly.Arduino.statementToCode(this, 'DO');
	  
	  return 'if (' + argument0 + ') {\n' + branch + '}\n';
};


// Repetir siempre
Blockly.Arduino.repetir_Siempre = function() {
	 
	  var branch = Blockly.Arduino.statementToCode(this, 'DO');
	  
	  return 'while (true) {\n' + branch + '}\n';
};

Blockly.Arduino.whileUntil = function() {
	  // Do while/until loop.
	  var argument0 = Blockly.Arduino.valueToCode(this, 'BOOL',
	      Blockly.Arduino.ORDER_NONE) || 'false';
	  var branch = Blockly.Arduino.statementToCode(this, 'DO');
	  if (Blockly.Arduino.INFINITE_LOOP_TRAP) {
	    branch = Blockly.Arduino.INFINITE_LOOP_TRAP.replace(/%1/g,
	        '\'' + this.id + '\'') + branch;
	  }
	  if (this.getTitleValue('MODE') == 'UNTIL') {
	    if (!argument0.match(/^\w+$/)) {
	      argument0 = '(' + argument0 + ')';
	    }
	    argument0 = '!' + argument0;
	  }
	  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.Arduino.controls_forMe = function() {
	  // For loop.
	  var variable0 = Blockly.Arduino.variableDB_.getName(
	      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
	  var argument0 = Blockly.Arduino.valueToCode(this, 'FROM',
	      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
	  var argument1 = this.getTitleValue('TO') || '0';
	  var branch = Blockly.Arduino.statementToCode(this, 'DO');
	  if (Blockly.Arduino.INFINITE_LOOP_TRAP) {
	    branch = Blockly.Arduino.INFINITE_LOOP_TRAP.replace(/%1/g,
	        '\'' + this.id + '\'') + branch;
	  }
	  var code;
	  if (argument0.match(/^-?\d+(\.\d+)?$/) &&
	      argument1.match(/^-?\d+(\.\d+)?$/)) {
	    // Both arguments are simple numbers.
	    var up = parseFloat(argument0) <= parseFloat(argument1);
	    code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
	        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
	        variable0 + (up ? '++' : '--') + ') {\n' +
	        branch + '}\n';
	  } else {
	    code = '';
	    // Cache non-trivial values to variables to prevent repeated look-ups.
	    var startVar = argument0;
	    if (!argument0.match(/^\w+$/) && !argument0.match(/^-?\d+(\.\d+)?$/)) {
	      var startVar = Blockly.Arduino.variableDB_.getDistinctName(
	          variable0 + '_start', Blockly.Variables.NAME_TYPE);
	      code += 'int ' + startVar + ' = ' + argument0 + ';\n';
	    }
	    var endVar = argument1;
	    if (!argument1.match(/^\w+$/) && !argument1.match(/^-?\d+(\.\d+)?$/)) {
	      var endVar = Blockly.Arduino.variableDB_.getDistinctName(
	          variable0 + '_end', Blockly.Variables.NAME_TYPE);
	      code += 'int ' + endVar + ' = ' + argument1 + ';\n';
	    }
	    code += 'for (' + variable0 + ' = ' + startVar + ';\n' +
	        '    (' + startVar + ' <= ' + endVar + ') ? ' +
	        variable0 + ' <= ' + endVar + ' : ' +
	        variable0 + ' >= ' + endVar + ';\n' +
	        '    ' + variable0 + ' += (' + startVar + ' <= ' + endVar +
	            ') ? 1 : -1) {\n' +
	        branch0 + '}\n';
	  }
	  return code;
};


Blockly.Arduino.controls_for = function() {
  // For loop.
  var variable0 = Blockly.Arduino.variableDB_.getName(
      this.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Arduino.valueToCode(this, 'FROM',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'TO',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var branch = Blockly.Arduino.statementToCode(this, 'DO');
  if (Blockly.Arduino.INFINITE_LOOP_TRAP) {
    branch = Blockly.Arduino.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var code;
  if (argument0.match(/^-?\d+(\.\d+)?$/) &&
      argument1.match(/^-?\d+(\.\d+)?$/)) {
    // Both arguments are simple numbers.
    var up = parseFloat(argument0) <= parseFloat(argument1);
    code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0 + (up ? '++' : '--') + ') {\n' +
        branch + '}\n';
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = argument0;
    if (!argument0.match(/^\w+$/) && !argument0.match(/^-?\d+(\.\d+)?$/)) {
      var startVar = Blockly.Arduino.variableDB_.getDistinctName(
          variable0 + '_start', Blockly.Variables.NAME_TYPE);
      code += 'int ' + startVar + ' = ' + argument0 + ';\n';
    }
    var endVar = argument1;
    if (!argument1.match(/^\w+$/) && !argument1.match(/^-?\d+(\.\d+)?$/)) {
      var endVar = Blockly.Arduino.variableDB_.getDistinctName(
          variable0 + '_end', Blockly.Variables.NAME_TYPE);
      code += 'int ' + endVar + ' = ' + argument1 + ';\n';
    }
    code += 'for (' + variable0 + ' = ' + startVar + ';\n' +
        '    (' + startVar + ' <= ' + endVar + ') ? ' +
        variable0 + ' <= ' + endVar + ' : ' +
        variable0 + ' >= ' + endVar + ';\n' +
        '    ' + variable0 + ' += (' + startVar + ' <= ' + endVar +
            ') ? 1 : -1) {\n' +
        branch0 + '}\n';
  }
  return code;
};


//Repetir n veces
Blockly.Arduino.controls_repeat = function() {
	  // Repeat n times.
	  var repeats = Number(this.getTitleValue('TIMES'));
	  var branch = Blockly.Arduino.statementToCode(this, 'DO');
	  if (Blockly.Arduino.INFINITE_LOOP_TRAP) {
	    branch = Blockly.Arduino.INFINITE_LOOP_TRAP.replace(/%1/g,
	        '\'' + this.id + '\'') + branch;
	  }
	  var loopVar = Blockly.Arduino.variableDB_.getDistinctName(
	      'count', Blockly.Variables.NAME_TYPE);
	  var code = 'for (' + loopVar + ' = 0; ' +
	      loopVar + ' < ' + repeats + '; ' +
	      loopVar + '++) {\n' +
	      branch + '}\n';
	  return code;
};
