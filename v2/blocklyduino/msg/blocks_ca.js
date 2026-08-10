/**
 * @license
 * Copyright 2020 Carles Ferrando Garcia (ferrando_cariga@gva.es)
 * SPDX-License-Identifier: BSD-3-Clause
 */

'use strict';

goog.provide('Blockly.Msg.blocks_ca');

goog.require('Blockly.Msg');

//text in blocks
Blockly.Msg.FIELDDROPDOWN = [["1 (activat)", "HIGH"], ["0 (desactivat)", "LOW"]];
Blockly.Msg.FIELDDROPDOWN_ONOFF = [["turn on", "ON"], ["turn off", "OFF"]];
Blockly.Msg.FIELDDROPDOWN_ONOFF2 = [["switch on", "HIGH"], ["switch off", "LOW"]];
Blockly.Msg.FIELDDROPDOWN_ONOFF3 = [["close", "HIGH"], ["open", "LOW"]];

//blockly logic
Blockly.Msg.CONTROLS_SWITCH_CASEBREAK_TOOLTIP = "Afegeix una condició al bloc de «casos».";
Blockly.Msg.CONTROLS_SWITCH_DEFAULT_TOOLTIP = "Afegeix una condició final per defecte.";
Blockly.Msg.CONTROLS_SWITCH_HELPURL = "https://en.wikipedia.org/wiki/Switch_statement";
Blockly.Msg.CONTROLS_SWITCH_SWITCH_TOOLTIP = "Afegeix, retira, o classifica les seccions d'aquest bloc.";
Blockly.Msg.CONTROLS_SWITCH_VAR_TITLE = "selecciona ( ";
Blockly.Msg.CONTROLS_SWITCH_VAR_TAIL = ")";
Blockly.Msg.CONTROLS_SWITCH_MSG_DEFAULT = "per defecte";
Blockly.Msg.CONTROLS_SWITCH_MSG_CASEBREAK = "cas";
Blockly.Msg.CONTROLS_SWITCH_MSG_SWITCHVAR = "Selecciona (var)";
Blockly.Msg.CONTROLS_SWITCH_MSG_DO = "fes";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_1 = "Si el valor és cert llavors executa les ordres següents.";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_2 = "Si el valor és cert executa el primer bloc d'ordres. En cas contrari executa el bloc següent d'ordres.";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_3 = "Si el valor és cert executa el primer bloc d'ordres. En cas contrari executa el bloc següent d'ordres si la condició és certa.";
Blockly.Msg.CONTROLS_SWITCH_TOOLTIP_4 = "Si el valor és cert executa el primer bloc d'ordres. En cas contrari executa el bloc següent d'ordres si la condició és certa. Si ninguna condició és verifica, llavors executa el darrer bloc d'ordres per defecte.";
Blockly.Msg.CONTROLS_SWITCH_VAR_TOOLTIP = "Desplaça el bloc des de l'esquerra per afegir-lo.";
Blockly.Msg.CONTROLS_SWITCH_CASEBREAK_TOOLTIP = "Afegeix un bloc d'ordres cas trenca";
Blockly.Msg.CONTROLS_SWITCH_DEFAULT_TOOLTIP = "Afegeix un bloc d'accions per defecte";
//Arduino base cateory blocks
Blockly.Msg.VAR_CREATE_INT = "integer";
Blockly.Msg.VAR_CREATE_FLOAT = "float";
Blockly.Msg.VAR_CREATE_STRING = "string";
Blockly.Msg.VAR_CREATE_BOOLEAN = "boolean";
Blockly.Msg.ARDUINO_INOUT_BUILDIN_LED_HELPURL = "http://arduino.cc/en/Reference/DigitalWrite";
Blockly.Msg.ARDUINO_INOUT_BUILDIN_LED_INPUT = "posa el LED a l'estat lògic";
Blockly.Msg.ARDUINO_INOUT_BUILDIN_LED_TOOLTIP = "atura o engega el LED a la placa Arduino";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 = "posa el pin digital";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT2 = "a l'estat lògic";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_TOOLTIP = "escriu un valor (0 ou 1) al pin triat a la sortida";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_HELPURL = "http://arduino.cc/en/Reference/DigitalWrite";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_INPUT = "l'estat lògic del pin nº";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_TOOLTIP = "llegeix el valor (0 o 1) al pin triat a l'entrada";
Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_HELPURL = "http://arduino.cc/en/Reference/DigitalRead";
Blockly.Msg.ARDUINO_INOUT_ONOFF_HELPURL = "http://arduino.cc/en/Reference/Constants";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_INPUT1 = "write about Analog pin";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_INPUT2 = "value";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_TOOLTIP = "escriu un valor (comprés entre 0 i 255) al pin analògic.\nATENCIÓ: Verifiqueu que el pin sigui PWM~ !";
Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_HELPURL = "http://arduino.cc/en/Reference/AnalogWrite";
Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_INPUT = "el valor llegit al pin d'entrada analògica";
Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_TOOLTIP = "llegeix el valor (comprés entre 0 i 1023) al pin analògics.\nATENCIÓ: Verifiqueu que el pin sigui A# (exemple : A0,A1,...)";
Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_HELPURL = "http://arduino.cc/en/Reference/AnalogRead";
Blockly.Msg.ARDUINO_BASE_DELAY_DELAY_TIME = "fes una temporització (en ms) de";
Blockly.Msg.ARDUINO_BASE_DELAY_TOOLTIP = "especifica el temps d'espera, atura l'execució del programa el temps indicat";
Blockly.Msg.ARDUINO_BASE_DELAY_HELPURL = "http://arduino.cc/en/Reference/delay";
Blockly.Msg.ARDUINO_BASE_ANGLE = "angle de: ";
Blockly.Msg.ARDUINO_BASE_ANGLE_TOOLTIP = "angle té un valor entre 0~180°";
Blockly.Msg.ARDUINO_BASE_ANGLE_HELPURL = "";
Blockly.Msg.ARDUINO_BASE_MAP1 = "map";
Blockly.Msg.ARDUINO_BASE_MAP2 = "value to [0-";
Blockly.Msg.ARDUINO_BASE_MAP_TOOLTIP = "Re-maps a number from [0-1024] to another."
Blockly.Msg.ARDUINO_BASE_MAP_HELPURL = "https://www.arduino.cc/reference/en/language/functions/math/map/";
Blockly.Msg.ARDUINO_TONE_INPUT1 = "emet un só al pin";
Blockly.Msg.ARDUINO_TONE_INPUT2 = "d'una freqüència (Hz)";
Blockly.Msg.ARDUINO_TONE_TOOLTIP = "emet un só al pin seleccionat";
Blockly.Msg.ARDUINO_TONE_HELPURL = "http://arduino.cc/en/Reference/AnalogWrite";
Blockly.Msg.ARDUINO_NOTONE_INPUT = "atura el só al pin";
Blockly.Msg.ARDUINO_NOTONE_TOOLTIP = "atura el só al pin seleccionat";
Blockly.Msg.ARDUINO_NOTONE_HELPURL = "http://arduino.cc/en/Reference/AnalogWrite";

//SERIAL
Blockly.Msg.SERIAL_INIT = "fixa la velocitat del sèrie (en bauds) a";
Blockly.Msg.SERIAL_PRINT_FORMAT = "imprimeix en format";
Blockly.Msg.SERIAL_PRINT_FORDECIMAL = "decimal";
Blockly.Msg.SERIAL_PRINT_FORHEXA = "hexadecimal";
Blockly.Msg.SERIAL_PRINT_FORBIN = "binari";
Blockly.Msg.SERIAL_PRINT_FOROCT = "byte";
Blockly.Msg.SERIAL_READ = "llegeix el sèrie";
Blockly.Msg.SERIAL_AVAILABLE = "està disponible una dada al sèrie ?";
Blockly.Msg.SERIAL_FLUSH = "espera fi de transmisió al sèrie";
Blockly.Msg.SERIAL_READSTRINGUNTIL_HELPURL = "https://www.arduino.cc/en/Serial/ReadStringUntil";
Blockly.Msg.SERIAL_READSTRINGUNTIL_CONTENT = "cadena llegida fins al caràcter";
Blockly.Msg.SERIAL_READSTRINGUNTIL_TOOLTIP = "llegeix els caràcters un per un al cercat, i retorna tota la cadena de caràcters";
Blockly.Msg.SERIAL_PRINT_CONTENT = "envia el text al port sèrie:";
Blockly.Msg.SERIAL_PRINT_TOOLTIP = "envia dades al port sèrie per a vigilancia amb el monitor ASCII";
Blockly.Msg.SERIAL_PRINT_HELPURL = "http://www.arduino.cc/en/Serial/Print";

//Arduino base servo category blocks
Blockly.Msg.SERVO_MOVE_TOOLTIP = "rotació posible entre 0~180 graus";
Blockly.Msg.SERVO_MOVE_HELPURL = "http://www.arduino.cc/playground/ComponentLib/servo";
Blockly.Msg.SERVO_PIN = "PIN#";
Blockly.Msg.SERVO_MOVE_INPUT = "rota el servomotor";
Blockly.Msg.SERVO_MOVE_DEGREE = "d'un angle (0~180°)";
Blockly.Msg.SERVO_READ_DEGREES_INPUT = "l'angle del servomotor";
Blockly.Msg.SERVO_READ_DEGREES_TOOLTIP = "retorna el nombre de graus de la darrera rotació";
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