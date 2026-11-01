/* Arduino generators for Blockly math blocks that the old BlocklyDuino lacks. */
(function () {
  'use strict';
  var A = Blockly.Arduino;
  function val(block, name, fallback) {
    return A.valueToCode(block, name, A.ORDER_NONE) || fallback;
  }
  function expr(code) { return [code, A.ORDER_ATOMIC]; }

  // The bundled generator incorrectly emitted JavaScript Math.pow for POWER.
  A.math_arithmetic = function () {
    var left = val(this, 'A', '0'), right = val(this, 'B', '0');
    switch (this.getFieldValue('OP')) {
      case 'POWER': return expr('pow(' + left + ', ' + right + ')');
      case 'DIVIDE': return expr('((float)(' + left + ') / (float)(' + right + '))');
      case 'MULTIPLY': return expr('((' + left + ') * (' + right + '))');
      case 'MINUS': return expr('((' + left + ') - (' + right + '))');
      default: return expr('((' + left + ') + (' + right + '))');
    }
  };

  A.math_single = function () {
    var n = val(this, 'NUM', '0');
    var op = this.getFieldValue('OP');
    var names = {ROOT:'sqrt', ABS:'fabs', LN:'log', LOG10:'log10', EXP:'exp'};
    if (op === 'NEG') return expr('(-(' + n + '))');
    if (op === 'POW10') return expr('pow(10.0f, ' + n + ')');
    return expr((names[op] || 'sqrt') + '(' + n + ')');
  };

  // Standard Blockly trigonometry blocks use degrees; Arduino math uses radians.
  A.math_trig = function () {
    var n = val(this, 'NUM', '0');
    var op = this.getFieldValue('OP');
    var direct = {SIN:'sin', COS:'cos', TAN:'tan'};
    var inverse = {ASIN:'asin', ACOS:'acos', ATAN:'atan'};
    if (direct[op]) return expr(direct[op] + '((' + n + ') * DEG_TO_RAD)');
    return expr('(' + (inverse[op] || 'atan') + '(' + n + ') * RAD_TO_DEG)');
  };

  A.math_constant = function () {
    var constants = {
      PI:'PI', E:'2.718281828f', GOLDEN_RATIO:'1.618033989f',
      SQRT2:'1.414213562f', SQRT1_2:'0.707106781f', INFINITY:'INFINITY'
    };
    return expr(constants[this.getFieldValue('CONSTANT')] || 'PI');
  };

  A.math_round = function () {
    var n = val(this, 'NUM', '0');
    var ops = {ROUND:'round', ROUNDUP:'ceil', ROUNDDOWN:'floor'};
    return expr((ops[this.getFieldValue('OP')] || 'round') + '(' + n + ')');
  };

  A.math_modulo = function () {
    return expr('((long)(' + val(this, 'DIVIDEND', '0') + ') % (long)(' +
        val(this, 'DIVISOR', '1') + '))');
  };
  A.math_constrain = function () {
    return expr('constrain(' + val(this, 'VALUE', '0') + ', ' +
        val(this, 'LOW', '0') + ', ' + val(this, 'HIGH', '100') + ')');
  };
  A.math_random_int = function () {
    return expr('random((long)(' + val(this, 'FROM', '0') + '), (long)(' +
        val(this, 'TO', '10') + ') + 1L)');
  };
  A.math_random_float = function () {
    return expr('((float)random(0L, 1000000L) / 1000000.0f)');
  };
  A.math_change = function () {
    var name = A.variableDB_.getName(this.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return name + ' += ' + val(this, 'DELTA', '1') + ';\n';
  };

  Blockly.Blocks['arduino_math_minmax'] = {init: function () {
    this.setColour(230);
    this.appendValueInput('A').setCheck('Number').appendField(
        new Blockly.FieldDropdown([['min', 'min'], ['max', 'max']]), 'OP');
    this.appendValueInput('B').setCheck('Number').appendField('and');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setTooltip('Minimum or maximum of two values.');
  }};
  A.arduino_math_minmax = function () {
    return expr(this.getFieldValue('OP') + '(' + val(this, 'A', '0') + ', ' +
        val(this, 'B', '0') + ')');
  };

  Blockly.Blocks['arduino_random_seed'] = {init: function () {
    this.setColour(230);
    this.appendValueInput('SEED').setCheck('Number').appendField('randomSeed');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Set the pseudorandom sequence seed, usually once in setup().');
  }};
  A.arduino_random_seed = function () {
    return 'randomSeed(' + val(this, 'SEED', '0') + ');\n';
  };
}());
