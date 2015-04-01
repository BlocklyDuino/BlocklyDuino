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
 * @fileoverview Helper functions for generating sensor blocks - sumo robots
 * Written to facilitate programming of sumo and mini-sumo robots
 * Thanks to Fred Lin for building BlockyDuino!
 * @author erickennedy@outlook.com  Eric Kennedy
 */

goog.provide('Blockly.Arduino.sensors');

goog.require('Blockly.Arduino');


Blockly.Arduino.setup_button_wait_il = function() {
  var wait_pin = this.getFieldValue("PIN");
   Blockly.Arduino.definitions_["define_button_wait"] = ""+
   "   const int buttonPin = "+wait_pin+";\n"+
   "   int buttonState = 0;\n"+
	"   void WaitForButton (){\n"+
	"   buttonState = digitalRead(buttonPin);\n"+
	"   while(buttonState == LOW) {buttonState = digitalRead(buttonPin);}}\n";
 Blockly.Arduino.setups_['setup_button_wait'] = " pinMode(buttonPin, INPUT);\n"+
 '   WaitForButton();\n';
  var code = '';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.setup_button_wait_iph = function() {
  var wait_pin = this.getFieldValue("PIN");
   Blockly.Arduino.definitions_["define_button_wait"] = ""+
   "   const int buttonPin = "+wait_pin+";\n"+
   "   int buttonState = 0;\n"+
	"   void WaitForButton (){\n"+
	"   buttonState = digitalRead(buttonPin);\n"+
	"   while(buttonState == HIGH) {buttonState = digitalRead(buttonPin);}}\n";
 Blockly.Arduino.setups_['setup_button_wait'] = " pinMode(buttonPin, INPUT_PULLUP);\n"+
 '   WaitForButton();\n';
  var code = '';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.fourpin_ranger = function() {
   var dropdown_tpin = this.getFieldValue('PIN');
   var dropdown_epin = this.getFieldValue('PIN2');
  Blockly.Arduino.definitions_["define_fourpin_"+dropdown_tpin] = "  const int pingPin"+dropdown_tpin+" = "+dropdown_tpin+";\n"+
  "  const int sensorPin"+dropdown_epin+" = "+dropdown_epin+";\n";
      Blockly.Arduino.definitions_['define_ping'] = "long Ping"+dropdown_tpin+"()\n"+
"{\n"+
      "// The PING))) is triggered by a HIGH pulse of 2 or more microseconds.\n"+
      "// Give a short LOW pulse beforehand to ensure a clean HIGH pulse:\n"+
      "digitalWrite(pingPin"+dropdown_tpin+", LOW);\n"+
      "delayMicroseconds(2);\n"+
      "digitalWrite(pingPin"+dropdown_tpin+", HIGH);\n"+
      "delayMicroseconds(2);\n"+
      "digitalWrite(pingPin"+dropdown_tpin+", LOW);\n"+
      "// A different pin is used to read the signal from the PING))): a HIGH\n"+
      "long microseconds = pulseIn(sensorPin"+dropdown_epin+", HIGH);\n"+
      "return microseconds / 74 / 2;\n"+
"}\n";
 Blockly.Arduino.setups_["setup_fourpin_"+dropdown_tpin] = "pinMode(pingPin"+dropdown_tpin+", OUTPUT);\n"+
 "  pinMode(sensorPin"+dropdown_epin+", INPUT);\n";
//  code = "analogRead("+dropdown_tpin+")"";
  var code = "";
  var code = "Ping"+dropdown_tpin+"()";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
