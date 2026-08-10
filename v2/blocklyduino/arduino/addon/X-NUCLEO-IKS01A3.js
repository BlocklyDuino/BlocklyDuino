/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview X-NUCLEO-IKS01A3 blocks for Blockly.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

'use strict';

goog.provide('Blockly.Arduino.X-NUCLEO-IKS01A3');

goog.require('Blockly.Arduino');

Blockly.Arduino['X_NUCLEO_IKS01A3_Temp_Read'] = function (block) {
    Blockly.Arduino.includes_['includes_IKS01A3'] = '#include <HTS221Sensor.h>';
    Blockly.Arduino.definitions_['definitions_IKS01A3'] = '#define DEV_I2C Wire\n'
        + 'HTS221Sensor *HumTemp;\n';
    Blockly.Arduino.setups_['setup_IKS01A3'] = 'DEV_I2C.begin();\n'
        + '  HumTemp = new HTS221Sensor(&DEV_I2C);\n'
        + '  HumTemp->Enable();';
    Blockly.Arduino.codeFunctions_['function_IKS01A3_temperature'] = 'float tempFromBoard() {\n'
        + '  float temperature = 0;\n'
        + '  HumTemp->GetTemperature(&temperature);\n'
        + '  return temperature;\n'
        +'}'
    var code = 'tempFromBoard()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['X_NUCLEO_IKS01A3_Humidity_Read'] = function (block) {
    Blockly.Arduino.includes_['includes_IKS01A3'] = '#include <HTS221Sensor.h>';
    Blockly.Arduino.definitions_['definitions_IKS01A3'] = '#define DEV_I2C Wire\n'
        + 'HTS221Sensor *HumTemp;\n';
    Blockly.Arduino.setups_['setup_IKS01A3'] = 'DEV_I2C.begin();\n'
        + '  HumTemp = new HTS221Sensor(&DEV_I2C);\n'
        + '  HumTemp->Enable();';
    Blockly.Arduino.codeFunctions_['function_IKS01A3_humidity'] = 'float humFromBoard() {\n'
        + '  float humidity = 0;\n'
        + '  HumTemp->GetHumidity(&humidity);\n'
        + '  return humidity;\n'
        +'}'
    var code = 'humFromBoard()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};
