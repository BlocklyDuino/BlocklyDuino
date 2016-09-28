/**
 * Visual Blocks Language
 *
 * Copyright 2012 Fred Lin.
 * https://github.com/gasolin/BlocklyDuino
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
 * @fileoverview Helper functions for generating Arduino blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Arduino.inout');

goog.require('Blockly.Arduino');

Blockly.Arduino.inout_buildin_led = function() {
  var dropdown_stat = this.getFieldValue('STAT');
  Blockly.Arduino.setups_['setup_output_13'] = 'pinMode(13, OUTPUT);';
  var code = 'digitalWrite(13, ' + dropdown_stat + ');\n'
  return code;
};

Blockly.Arduino.inout_digital_write = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var dropdown_stat = this.getFieldValue('STAT');
  Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
  var code = 'digitalWrite(' + dropdown_pin + ', ' + dropdown_stat + ');\n'
  return code;
};

Blockly.Arduino.inout_custom_digital_write = function() {
  var pin = Blockly.Arduino.valueToCode(this, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '13'
  var stat = Blockly.Arduino.valueToCode(this, 'STAT', Blockly.Arduino.ORDER_ATOMIC) || 'HIGH'
  if(profile.default.digital.indexOf(pin) > 0){
    Blockly.Arduino.setups_['setup_output_' + pin] = 'pinMode(' + pin + ', OUTPUT);';
  }
  var code = 'digitalWrite(' + pin + ', ' + stat + ');\n'
  return code;
};

Blockly.Arduino.inout_digital_read = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var input_mode = this.getFieldValue('INPUT_MODE');

  Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', ' + input_mode + ');';
  var code = 'digitalRead(' + dropdown_pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.inout_analog_write = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_ATOMIC) || '255'
  var code = 'analogWrite(' + dropdown_pin + ', ' + value_num + ');\n';
  return code;
};

Blockly.Arduino.inout_analog_read = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  //Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'analogRead(' + dropdown_pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.inout_highlow = function() {
  // Boolean values HIGH and LOW.
  var code = (this.getFieldValue('BOOL') == 'HIGH') ? 'HIGH' : 'LOW';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.pulsein = function() {
  var code;
  var value_pin = this.getFieldValue('PIN');
  var value_timeout = this.getFieldValue('TIMEOUT');
  var dropdown_type = (this.getFieldValue('type') == 'HIGH') ? 'HIGH' : 'LOW';
  console.log(value_timeout);
  if(value_timeout > 0){
    code = 'pulseIn(' + value_pin + ',' + dropdown_type +',' + value_timeout + ')';
  }else{
    code = 'pulseIn(' + value_pin + ',' + dropdown_type + ')';
  }
  Blockly.Arduino.setups_['setup_output_'+ value_pin] = 'pinMode('+value_pin+', INPUT);';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.custom_tone = function() {
  var value_pin = this.getFieldValue('PIN');
  var value_freq = Blockly.Arduino.valueToCode(this, 'FREQ', Blockly.Arduino.ORDER_ATOMIC) || '255'
  var value_duration = this.getFieldValue('DURATION');
  var code = 'tone(' + value_pin + ',' + value_freq +',' + value_duration + ');\n';
  return code;
};

Blockly.Arduino.tone = function() {
  var value_pin = this.getFieldValue('PIN');
  var value_freq = this.getFieldValue('FREQ');
  var code = 'tone(' + value_pin + ',' + value_freq +',300);\n';
  return code;
};

Blockly.Arduino.inout_digitalpin = function() {
  var pin = this.getFieldValue('PIN');
  Blockly.Arduino.setups_['setup_output_' + pin] = 'pinMode(' + pin + ', OUTPUT);';
  var code = pin;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.inout_analogpin = function() {
  var code = this.getFieldValue('PIN');
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
