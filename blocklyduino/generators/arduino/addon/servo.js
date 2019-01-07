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

goog.provide('Blockly.Arduino.servo');

goog.require('Blockly.Arduino');

/*
//servo
#include <Servo.h>

Servo servo_11;

void setup() {
  servo_11.attach(11);
}

void loop() {
servo_11.write(0);

servo_11.write(150); //0~180
}
*/
Blockly.Arduino['servo_move'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var value_degree = Blockly.Arduino.valueToCode(block, 'DEGREE', Blockly.Arduino.ORDER_ATOMIC);

  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
  Blockly.Arduino.definitions_['var_servo' + dropdown_pin] = 'Servo servo_' + dropdown_pin + ';\n';
  Blockly.Arduino.setups_['setup_servo_' + dropdown_pin] = 'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');\n';

  var code = 'servo_' + dropdown_pin + '.write(' + value_degree + ');\n';
  return code;
};

Blockly.Arduino['servo_read_degrees'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');

  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
  Blockly.Arduino.definitions_['var_servo' + dropdown_pin] = 'Servo servo_'+dropdown_pin+';\n';
  Blockly.Arduino.setups_['setup_servo_' + dropdown_pin] = 'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');\n';

  var code = 'servo_' + dropdown_pin + '.read()';
  return code;
};