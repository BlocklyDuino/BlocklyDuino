/**
 * @license
 * Copyright 2020 Carles Ferrando Garcia (ferrando_cariga@gva.es)
 * SPDX-License-Identifier: BSD-3-Clause
 */

'use strict';

goog.provide('Blockly.Msg.blocks_es');

goog.require('Blockly.Msg');

//text in blocks
Blockly.Msg.FIELDDROPDOWN = [["1 (activado)", "HIGH"], ["0 (desactivado)", "LOW"]];
Blockly.Msg.FIELDDROPDOWN_ONOFF = [["turn on", "ON"], ["turn off", "OFF"]];
Blockly.Msg.FIELDDROPDOWN_ONOFF2 = [["switch on", "HIGH"], ["switch off", "LOW"]];
Blockly.Msg.FIELDDROPDOWN_ONOFF3 = [["close", "HIGH"], ["open", "LOW"]];

//blockly logic
Blockly.Msg.CONTROLS_SWITCH_CASEBREAK_TOOLTIP = "Add a condition to the case block.";
Blockly.Msg.CONTROLS_SWITCH_DEFAULT_TOOLTIP = "Add a final, catch-all condition to the if block.";
Blockly.Msg.CONTROLS_SWITCH_HELPURL = "https://en.wikipedia.org/wiki/Switch_statement";
Blockly.Msg.CONTROLS_SWITCH_SWITCH_TOOLTIP = "Add, remove, or reorder sections to reconfigure this if block.";
Blockly.Msg.CONTROLS_SWITCH_VAR_TITLE = "Cambiar (";
Blockly.Msg.CONTROLS_SWITCH_VAR_TAIL = ")";
Blockly.Msg.CONTROLS_SWITCH_MSG_DEFAULT = "estándar";
Blockly.Msg.CONTROLS_SWITCH_MSG_CASEBREAK = "caso";
Blockly.Msg.CONTROLS_SWITCH_MSG_SWITCHVAR = "Cambiar (var)";
Blockly.Msg.CONTROLS_SWITCH_MSG_DO = "hacer";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_1 = "If a value is true, then do some statements.";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_2 = "If a value is true, then do the first block of statements. Otherwise, do the second block of statements.";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_3 = "If the first value is true, then do the first block of statements. Otherwise, if the second value is true, do the second block of statements.";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_4 = "If the first value is true, then do the first block of statements. Otherwise, if the second value is true, do the second block of statements. If none of the values are true, do the last block of statements.";
Blockly.Msg.CONTROLS_SWITCH_VAR_TOOLTIP = "Drag from the left into here to add";
Blockly.Msg.CONTROLS_SWITCH_CASEBREAK_TOOLTIP = "Add additional case break do";
Blockly.Msg.CONTROLS_SWITCH_DEFAULT_TOOLTIP = "Add optional default action";
//Arduino base cateory blocks
Blockly.Msg.VAR_CREATE_INT = "integer";
Blockly.Msg.VAR_CREATE_FLOAT = "float";
Blockly.Msg.VAR_CREATE_STRING = "string";
Blockly.Msg.VAR_CREATE_BOOLEAN = "boolean";
Blockly.Msg.ARDUINO_INOUT_BUILDIN_LED_HELPURL = "http://arduino.cc/en/Reference/DigitalWrite";
Blockly.Msg.ARDUINO_INOUT_BUILDIN_LED_INPUT = "pon el LED en el estado lógico";
Blockly.Msg.ARDUINO_INOUT_BUILDIN_LED_TOOLTIP = "para o enciende el LED en la placa Arduino";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 = "pon el pin digital";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT2 = "en el estado lógico";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_TOOLTIP = "escribe un valor (0 o 1) en el pin escogido en la salida";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_HELPURL = "http://arduino.cc/en/Reference/DigitalWrite";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_INPUT = "el estado lógico del pin nº";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_TOOLTIP = "lee el valor (0 o 1) en el pin escogido en la entrada";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_HELPURL = "http://arduino.cc/en/Reference/DigitalRead";
Blockly.Msg.ARDUINO_INOUT_ONOFF_HELPURL = "http://arduino.cc/en/Reference/Constants";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_INPUT1 = "escribe en el pin analógico ";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_INPUT2 = "el valor";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_TOOLTIP = "escribe un valor (comprendido entre 0 y 255) en el pin analógico.\nATENCIÓN: Verifica que el pin sea PWM~ !";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_HELPURL = "http://arduino.cc/en/Reference/AnalogWrite";
Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_INPUT = "el valor leído en el pin de entrada analógica";
Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_TOOLTIP = "lee el valor (comprendido entre 0 y 1023) en los pines analógicos.\nATENCIÓN: Verifica que el pin sea A# (ejemplo : A0,A1,...) ";
Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_HELPURL = "http://arduino.cc/en/Reference/AnalogRead";
Blockly.Msg.ARDUINO_BASE_DELAY_DELAY_TIME = "haz una temporización (en ms) de";
Blockly.Msg.ARDUINO_BASE_DELAY_TOOLTIP = "especifica el tiempo de espera, para la ejecución del programa el tiempo indicado";
Blockly.Msg.ARDUINO_BASE_DELAY_HELPURL = "http://arduino.cc/en/Reference/delay";
Blockly.Msg.ARDUINO_BASE_ANGLE = "ángulo de ";
Blockly.Msg.ARDUINO_BASE_ANGLE_TOOLTIP = "envía un valor entre 0~180°";
Blockly.Msg.ARDUINO_BASE_ANGLE_HELPURL = "";
Blockly.Msg.ARDUINO_BASE_MAP1 = "map";
Blockly.Msg.ARDUINO_BASE_MAP2 = "value to [0-";
Blockly.Msg.ARDUINO_BASE_MAP_TOOLTIP = "Re-maps a number from [0-1024] to another."
Blockly.Msg.ARDUINO_BASE_MAP_HELPURL = "https://www.arduino.cc/reference/en/language/functions/math/map/";
Blockly.Msg.ARDUINO_TONE_INPUT1 = "emite un sonido en el pin";
Blockly.Msg.ARDUINO_TONE_INPUT2 = "de una frecuencia (Hz)";
Blockly.Msg.ARDUINO_TONE_TOOLTIP = "emite un sonido en el pin seleccionado";
Blockly.Msg.ARDUINO_TONE_HELPURL = "http://arduino.cc/en/Reference/AnalogWrite";
Blockly.Msg.ARDUINO_NOTONE_INPUT = "para el sonido en el pin";
Blockly.Msg.ARDUINO_NOTONE_TOOLTIP = "para el sonido en el pin seleccionado";
Blockly.Msg.ARDUINO_NOTONE_HELPURL = "http://arduino.cc/en/Reference/AnalogWrite";

//SERIAL
Blockly.Msg.SERIAL_INIT = "Serial communication init speed";
Blockly.Msg.SERIAL_PRINT_FORMAT = "Print  Format";
Blockly.Msg.SERIAL_PRINT_FORDECIMAL = "decimal";
Blockly.Msg.SERIAL_PRINT_FORHEXA = "hexadecimal";
Blockly.Msg.SERIAL_PRINT_FORBIN = "binary";
Blockly.Msg.SERIAL_PRINT_FOROCT = "octal";
Blockly.Msg.SERIAL_READ = "Serial Read";
Blockly.Msg.SERIAL_AVAILABLE = "Serial Available?";
Blockly.Msg.SERIAL_FLUSH = "Serial flush";
Blockly.Msg.SERIAL_READSTRINGUNTIL_HELPURL = "https://www.arduino.cc/en/Serial/ReadStringUntil";
Blockly.Msg.SERIAL_READSTRINGUNTIL_CONTENT = "String read until";
Blockly.Msg.SERIAL_READSTRINGUNTIL_TOOLTIP = "reads characters from the serial buffer into a string";
Blockly.Msg.SERIAL_PRINT_CONTENT = "envía el texto al puerto serie:";
Blockly.Msg.SERIAL_PRINT_TOOLTIP = "envía datos al puerto serie para vigilancia con el monitor ASCII";
Blockly.Msg.SERIAL_PRINT_HELPURL = "http://www.arduino.cc/en/Serial/Print";

//Arduino base servo category blocks
Blockly.Msg.SERVO_MOVE_TOOLTIP = "rotation possible between 0 ~ 180 degrees";
Blockly.Msg.SERVO_MOVE_HELPURL = "http://www.arduino.cc/playground/ComponentLib/servo";
Blockly.Msg.SERVO_PIN = "PIN#";
Blockly.Msg.SERVO_MOVE_INPUT = "Girar el servomotor";
Blockly.Msg.SERVO_MOVE_DEGREE = "en ángulo (0 ~ 180 °) de";
Blockly.Msg.SERVO_READ_DEGREES_INPUT = "the angle of the servo motor";
Blockly.Msg.SERVO_READ_DEGREES_TOOLTIP = "returns the number of degrees the last rotation";
Blockly.Msg.SERVO_READ_DEGREES_HELPURL = "http://www.arduino.cc/playground/ComponentLib/servo";

//X-NUCLEO-IKS01A3 shield blocks: the X-NUCLEO-IKS01A3 is a motion MEMS and environmental sensor evaluation board system, for ST Nucleo boards.
Blockly.Msg.X_NUCLEO_IKS01A3_Temp_Read_INPUT = "onboard temperature sensor value";
Blockly.Msg.X_NUCLEO_IKS01A3_Temp_Read_TOOLTIP = "HTS221: capacitive digital temperature in °Celsius";
Blockly.Msg.X_NUCLEO_IKS01A3_Temp_Read_HELPURL = "onboard temperature sensor value";
Blockly.Msg.X_NUCLEO_IKS01A3_Humidity_Read_INPUT = "onboard humidity sensor value";
Blockly.Msg.X_NUCLEO_IKS01A3_Humidity_Read_TOOLTIP = "HTS221: capacitive digital relative humidity in percent";
Blockly.Msg.X_NUCLEO_IKS01A3_Humidity_Read_HELPURL = "https://www.st.com/en/ecosystems/x-nucleo-iks01a3.html";

//DS18B20 sensors
Blockly.Msg.DS18B20_TEXT1 = "a DS18B20 sensor";
Blockly.Msg.DS18B20_INPUT1 = "is connected on pin#";
Blockly.Msg.DS18B20_INPUT2 = "address #";
Blockly.Msg.DS18B20_TOOLTIP1 = "test if a DS18B20 temperature sensor is present, returns 'true' if present";
Blockly.Msg.DS18B20_HELPURL = "https://www.carnetdumaker.net/articles/mesurer-une-temperature-avec-un-capteur-1-wire-ds18b20-et-une-carte-arduino-genuino/";
Blockly.Msg.DS18B20_TEXT2 = "sensor DS18B20 value";
Blockly.Msg.DS18B20_TOOLTIP2 = "returns the value of the temperature sensor, as a floating number";

//Relays actuators
Blockly.Msg.RELAY_LOGICAL_TEXT = "relay";
Blockly.Msg.RELAY_LOGICAL_INPUT = "on pin#";
Blockly.Msg.RELAY_LOGICAL_TOOLTIP = "the relay is a remote switch, it is a switch placed in a power circuit which is switched by a digital signal";
Blockly.Msg.RELAY_LOGICAL_HELPURL = "https://arduinogetstarted.com/tutorials/arduino-relay";
Blockly.Msg.RELAY_MOSFET_TEXT = "MOSFET transistor";
Blockly.Msg.RELAY_MOSFET_INPUT = "on pin#";
Blockly.Msg.RELAY_MOSFET_TOOLTIP = "the MOSFET transistor is a remote switch, a switch in a power circuit that is switched by a digital signal";
Blockly.Msg.RELAY_MOSFET_HELPURL = "http://sin.lyceeleyguescouffignal.fr/irf520-mosfet-driver-module";