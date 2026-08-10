/**
 * @license
 * Copyright 2020 Sébastien Canet
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview DS18B20 sensor temperature blocks for Blockly.
 * @author scanet@libreduc.cc (Sébastien Canet)
 */
 
'use strict';

goog.provide('Blockly.Arduino.ds18b20');

goog.require('Blockly.Arduino');

Blockly.Arduino['ds18b20_search'] = function() {
  var ds18b20_pin = this.getFieldValue('ds18b20_pin');
  var ds18b20_addr = this.getFieldValue('ds18b20_address');
  Blockly.Arduino.includes_['ds18b20_include'] = '#include <OneWire.h>';
  Blockly.Arduino.definitions_['ds18b20_def_' + ds18b20_pin] = 'OneWire ds18b20(' + ds18b20_pin + '); // connected on pin' + ds18b20_pin + ' (a 4.7k resistor needed)'
  Blockly.Arduino.definitions_['ds18b20_def_' + ds18b20_addr] = 'byte addr_ds18b20_' + ds18b20_addr + '[' + ds18b20_addr + '];';
  var code = 'ds18b20.search(addr_ds18b20_' + ds18b20_addr + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['ds18b20_temp'] = function() {
  var ds18b20_addr = this.getFieldValue('ds18b20_address');
  Blockly.Arduino.userFunctions_['ds18b20_temp'] =
	'float dstemp(byte addr[]) {\n'
	+ '   byte data[12],i;\n'
	+ '   ds18b20.reset();\n'
    + '   ds18b20.select(addr);\n'
    + '   ds18b20.write(0x44,0);//start conversion\n'
    + '   delay(1000);     // maybe 750ms is enough, maybe not  \n'
    + '   ds18b20.reset();\n'
    + '   ds18b20.select(addr);    \n'
    + '   ds18b20.write(0xBE);         // Read Scratchpad\n'
    + '   for ( i = 0; i < 9; i++) {           // we need 9 bytes\n'
    + '     data[i] = ds18b20.read();\n'
    + '   }\n'
    + '   int16_t raw = (data[1] << 8) | data[0];\n'
    + '   byte cfg = (data[4] & 0x60);\n'
    + '   if (cfg == 0x00) raw = raw & ~7;  // 9 bit resolution, 93.75 ms\n'
    + '     else if (cfg == 0x20) raw = raw & ~3; // 10 bit res, 187.5 ms\n'
    + '       else if (cfg == 0x40) raw = raw & ~1; // 11 bit res, 375 ms\n'
    + '   return (float)raw / 16.0;\n'
	+ '}';
  var code = 'dstemp(' + ds18b20_addr + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
