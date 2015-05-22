/**
 * @author Jesús Lens Costa
 */

'use strict';

goog.provide('Blockly.Arduino.texts');

goog.require('Blockly.Arduino');


Blockly.Arduino.text = function() {

   var code = Blockly.Arduino.quote_(this.getFieldValue('TEXT'));
   return [code, Blockly.Arduino.ORDER_ATOMIC];
};
