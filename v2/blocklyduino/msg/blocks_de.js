/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

'use strict';

goog.provide('Blockly.Msg.blocks_de');

goog.require('Blockly.Msg');

//text in blocks
Blockly.Msg.FIELDDROPDOWN = [["HIGH", "HIGH"], ["LOW", "LOW"]];
Blockly.Msg.FIELDDROPDOWN_ONOFF = [["turn on", "ON"], ["turn off", "OFF"]];
Blockly.Msg.FIELDDROPDOWN_ONOFF2 = [["switch on", "HIGH"], ["switch off", "LOW"]];
Blockly.Msg.FIELDDROPDOWN_ONOFF3 = [["close", "HIGH"], ["open", "LOW"]];

//blockly logic
Blockly.Msg.CONTROLS_SWITCH_CASEBREAK_TOOLTIP = "Legen Sie eine Entscheidungsbedingung in dem 'case' Block fest.";
Blockly.Msg.CONTROLS_SWITCH_DEFAULT_TOOLTIP = "Ergänzen sie eine Abbruchbedingung in den 'if' Block";
Blockly.Msg.CONTROLS_SWITCH_HELPURL = "https://en.wikipedia.org/wiki/Switch_statement";
Blockly.Msg.CONTROLS_SWITCH_SWITCH_TOOLTIP = "Erweitere, lösche oder ändere diesen 'if' Block";
Blockly.Msg.CONTROLS_SWITCH_VAR_TITLE = "Wechsle zu (";
Blockly.Msg.CONTROLS_SWITCH_VAR_TAIL = ")";
Blockly.Msg.CONTROLS_SWITCH_MSG_DEFAULT = "Standard";
Blockly.Msg.CONTROLS_SWITCH_MSG_CASEBREAK = "wenn folgendes wahr ist (true):";
Blockly.Msg.CONTROLS_SWITCH_MSG_SWITCHVAR = "Wechsle zu (var)";
Blockly.Msg.CONTROLS_SWITCH_MSG_DO = "Dann mache:";
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
Blockly.Msg.ARDUINO_INOUT_BUILDIN_LED_INPUT = "put the LEDs on the card to logic";
Blockly.Msg.ARDUINO_INOUT_BUILDIN_LED_TOOLTIP = "off or turn on the LED on the Arduino board";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 = "put the pin Digital";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT2 = "to logic state";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_TOOLTIP = "write a 0 or 1 state numeric on a specific output";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_HELPURL = "http://arduino.cc/en/Reference/DigitalWrite";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_INPUT = "the logic state of PIN#";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_TOOLTIP = "reading the digital state 0 or 1 of the digital pin";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_HELPURL = "http://arduino.cc/en/Reference/DigitalRead";
Blockly.Msg.ARDUINO_INOUT_ONOFF_HELPURL = "http://arduino.cc/en/Reference/Constants";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_INPUT1 = "write about Analog pin";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_INPUT2 = "value";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_TOOLTIP = "send a value between 0 and 255 on a specific output";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_HELPURL = "http://arduino.cc/en/Reference/AnalogWrite";
Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_INPUT = "read value on the analog input";
Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_TOOLTIP = "returns a value between 0 and 1023";
Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_HELPURL = "http://arduino.cc/en/Reference/AnalogRead";
Blockly.Msg.ARDUINO_BASE_DELAY_DELAY_TIME = "delay (in ms)";
Blockly.Msg.ARDUINO_BASE_DELAY_TOOLTIP = "specify the pause time in milliseconds";
Blockly.Msg.ARDUINO_BASE_DELAY_HELPURL = "http://arduino.cc/en/Reference/delay";
Blockly.Msg.ARDUINO_BASE_ANGLE = "angle: ";
Blockly.Msg.ARDUINO_BASE_ANGLE_TOOLTIP = "angle between 0~180°";
Blockly.Msg.ARDUINO_BASE_ANGLE_HELPURL = "";
Blockly.Msg.ARDUINO_BASE_MAP1 = "map";
Blockly.Msg.ARDUINO_BASE_MAP2 = "value to [0-";
Blockly.Msg.ARDUINO_BASE_MAP_TOOLTIP = "Re-maps a number from [0-1024] to another."
Blockly.Msg.ARDUINO_BASE_MAP_HELPURL = "https://www.arduino.cc/reference/en/language/functions/math/map/";
Blockly.Msg.ARDUINO_TONE_INPUT1 = "emits sound on the pin";
Blockly.Msg.ARDUINO_TONE_INPUT2 = "on frequency (Hz)";
Blockly.Msg.ARDUINO_TONE_TOOLTIP = "emits sound on the selected pin";
Blockly.Msg.ARDUINO_TONE_HELPURL = "http://arduino.cc/en/Reference/AnalogWrite";
Blockly.Msg.ARDUINO_NOTONE_INPUT = "stop sound on the pin";
Blockly.Msg.ARDUINO_NOTONE_TOOLTIP = "mutes the sound on the selected pin";
Blockly.Msg.ARDUINO_NOTONE_HELPURL = "http://arduino.cc/en/Reference/AnalogWrite";

//SERIAL
Blockly.Msg.SERIAL_INIT = "Geschwindigkeit der seriellen Verbindung";
Blockly.Msg.SERIAL_PRINT_FORMAT = "Druckformat";
Blockly.Msg.SERIAL_PRINT_FORDECIMAL = "Dezimal";
Blockly.Msg.SERIAL_PRINT_FORHEXA = "Hexadezimal";
Blockly.Msg.SERIAL_PRINT_FORBIN = "Binär";
Blockly.Msg.SERIAL_PRINT_FOROCT = "Oktal";
Blockly.Msg.SERIAL_READ = "Seriell lesen";
Blockly.Msg.SERIAL_AVAILABLE = "Serielle Daten verfügbar?";
Blockly.Msg.SERIAL_FLUSH = "Entleere Serielle Kommunikationsverbindung";
Blockly.Msg.SERIAL_READSTRINGUNTIL_HELPURL = "https://www.arduino.cc/en/Serial/ReadStringUntil";
Blockly.Msg.SERIAL_READSTRINGUNTIL_CONTENT = "Lese Zeichen bis nichts mehr kommt";
Blockly.Msg.SERIAL_READSTRINGUNTIL_TOOLTIP = "Liest Zeichen von der seriellen Schnittstelle in einen Zwischenpuffer als Zeichenkette";
Blockly.Msg.SERIAL_PRINT_CONTENT = "send the data to the serial port:";
Blockly.Msg.SERIAL_PRINT_TOOLTIP = "sends data over the serial port for sruvaillance by the monitor in ASCII";
Blockly.Msg.SERIAL_PRINT_HELPURL = "http://www.arduino.cc/en/Serial/Print";

//Arduino base servo category blocks
Blockly.Msg.SERVO_MOVE_TOOLTIP = "Rotation im Bereich von 0 - 180 Grad";
Blockly.Msg.SERVO_MOVE_HELPURL = "http://www.arduino.cc/playground/ComponentLib/servo";
Blockly.Msg.SERVO_PIN = "PIN#";
Blockly.Msg.SERVO_MOVE_INPUT = "Drehe den Servo Motor";
Blockly.Msg.SERVO_MOVE_DEGREE = "im Winkel (0~180°) von";
Blockly.Msg.SERVO_READ_DEGREES_INPUT = "Winkel des Servo Motors";
Blockly.Msg.SERVO_READ_DEGREES_TOOLTIP = "Gibt den Winkel der letzten Drehung zurück";
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