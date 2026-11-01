/* Common Arduino hardware building blocks for the local Pro Mini editor. */
(function () {
  'use strict';
  var pins = [];
  for (var n = 2; n <= 13; ++n) pins.push(['D' + n, String(n)]);
  function pinField() {
    return new Blockly.FieldDropdown(pins);
  }
  function statement(type, colour, tooltip, inputBuilder) {
    Blockly.Blocks[type] = {init: function () {
      this.setColour(colour);
      inputBuilder.call(this);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip(tooltip);
    }};
  }
  function output(type, colour, tooltip, inputBuilder, outputType) {
    Blockly.Blocks[type] = {init: function () {
      this.setColour(colour);
      inputBuilder.call(this);
      this.setOutput(true, outputType || 'Number');
      this.setTooltip(tooltip);
    }};
  }
  function numberValue(block, name, fallback) {
    return Blockly.Arduino.valueToCode(block, name, Blockly.Arduino.ORDER_NONE) || fallback;
  }

  // Buttons with the AVR's internal pull-up resistor.
  output('button_pullup_pressed', 190, 'Button between pin and GND; internal pull-up enabled.', function () {
    this.appendDummyInput().appendField('button pressed (pull-up)')
        .appendField(pinField(), 'PIN');
    this.setFieldValue('2', 'PIN');
  }, 'Boolean');
  Blockly.Arduino.button_pullup_pressed = function () {
    var pin = this.getFieldValue('PIN');
    Blockly.Arduino.setups_['button_' + pin] = 'pinMode(' + pin + ', INPUT_PULLUP);';
    return ['(digitalRead(' + pin + ') == LOW)', Blockly.Arduino.ORDER_ATOMIC];
  };

  // HC-SR04 without an extra library; -1 means no echo within 30 ms.
  output('ultrasonic_cm', 110, 'HC-SR04 distance in cm; -1 if no echo.', function () {
    this.appendDummyInput().appendField('HC-SR04 distance cm')
        .appendField('TRIG').appendField(pinField(), 'TRIG')
        .appendField('ECHO').appendField(pinField(), 'ECHO');
    this.setFieldValue('3', 'TRIG');
    this.setFieldValue('4', 'ECHO');
  });
  Blockly.Arduino.ultrasonic_cm = function () {
    var trig = this.getFieldValue('TRIG'), echo = this.getFieldValue('ECHO');
    Blockly.Arduino.setups_['hc_trig_' + trig] = 'pinMode(' + trig + ', OUTPUT);';
    Blockly.Arduino.setups_['hc_echo_' + echo] = 'pinMode(' + echo + ', INPUT);';
    Blockly.Arduino.definitions_['hc_read'] =
        'float readHcSr04Cm(uint8_t trig, uint8_t echo) {\n' +
        '  digitalWrite(trig, LOW); delayMicroseconds(2);\n' +
        '  digitalWrite(trig, HIGH); delayMicroseconds(10);\n' +
        '  digitalWrite(trig, LOW);\n' +
        '  unsigned long us = pulseIn(echo, HIGH, 30000UL);\n' +
        '  return us ? us / 58.0f : -1.0f;\n' +
        '}';
    return ['readHcSr04Cm(' + trig + ', ' + echo + ')', Blockly.Arduino.ORDER_ATOMIC];
  };

  // DHT11/22: reading each sensor no faster than the library permits.
  function dhtSensor(block) {
    var pin = block.getFieldValue('PIN'), kind = block.getFieldValue('KIND');
    var id = pin + '_' + kind;
    Blockly.Arduino.definitions_['dht_include'] = '#include <DHT.h>';
    Blockly.Arduino.definitions_['dht_obj_' + id] =
        'DHT dht_' + id + '(' + pin + ', ' + kind + ');';
    Blockly.Arduino.setups_['dht_begin_' + id] = 'dht_' + id + '.begin();';
    return 'dht_' + id;
  }
  function dhtBlock(type, label, method) {
    output(type, 110, 'DHT11/22: connect VCC, GND and DATA, with a pull-up if the module lacks one.', function () {
      this.appendDummyInput().appendField(label)
          .appendField(new Blockly.FieldDropdown([['DHT22', 'DHT22'], ['DHT11', 'DHT11']]), 'KIND')
          .appendField('pin').appendField(pinField(), 'PIN');
      this.setFieldValue('2', 'PIN');
    });
    Blockly.Arduino[type] = function () {
      return [dhtSensor(this) + '.' + method + '()', Blockly.Arduino.ORDER_ATOMIC];
    };
  }
  dhtBlock('dht_temperature', 'DHT temperature C', 'readTemperature');
  dhtBlock('dht_humidity', 'DHT humidity %', 'readHumidity');

  // 28BYJ-48 with ULN2003; Stepper's pin order is IN1, IN3, IN2, IN4.
  function ensureStepper() {
    Blockly.Arduino.definitions_['stepper_include'] = '#include <Stepper.h>';
    if (!Blockly.Arduino.definitions_['stepper_object']) {
      Blockly.Arduino.definitions_['stepper_object'] = 'Stepper stepperUser(2048, 8, 10, 9, 11);';
    }
  }
  statement('stepper_28byj_init', 175, '28BYJ-48 through ULN2003; external motor supply and common GND.', function () {
    this.appendDummyInput().appendField('28BYJ-48 / ULN2003 pins')
        .appendField('IN1').appendField(pinField(), 'IN1')
        .appendField('IN2').appendField(pinField(), 'IN2')
        .appendField('IN3').appendField(pinField(), 'IN3')
        .appendField('IN4').appendField(pinField(), 'IN4');
    this.setFieldValue('8', 'IN1'); this.setFieldValue('9', 'IN2');
    this.setFieldValue('10', 'IN3'); this.setFieldValue('11', 'IN4');
  });
  Blockly.Arduino.stepper_28byj_init = function () {
    ensureStepper();
    Blockly.Arduino.definitions_['stepper_object'] =
        'Stepper stepperUser(2048, ' + this.getFieldValue('IN1') + ', ' +
        this.getFieldValue('IN3') + ', ' + this.getFieldValue('IN2') + ', ' +
        this.getFieldValue('IN4') + ');';
    return '';
  };
  statement('stepper_28byj_move', 175, 'Move 28BYJ-48 by signed full steps; one revolution is about 2048.', function () {
    this.appendDummyInput().appendField('28BYJ-48 speed RPM')
        .appendField(new Blockly.FieldDropdown([['5', '5'], ['10', '10'], ['15', '15']]), 'RPM');
    this.appendValueInput('STEPS').appendField('steps (+/-)');
  });
  Blockly.Arduino.stepper_28byj_move = function () {
    ensureStepper();
    return 'stepperUser.setSpeed(' + this.getFieldValue('RPM') + ');\n' +
           'stepperUser.step(' + numberValue(this, 'STEPS', '0') + ');\n';
  };

  // STEP/DIR drivers such as A4988 or DRV8825.
  statement('stepper_step_dir', 175, 'A4988/DRV8825 STEP and DIR input; use a separate motor supply.', function () {
    this.appendDummyInput().appendField('STEP/DIR motor')
        .appendField('STEP').appendField(pinField(), 'STEP')
        .appendField('DIR').appendField(pinField(), 'DIR')
        .appendField(new Blockly.FieldDropdown([['forward', 'HIGH'], ['reverse', 'LOW']]), 'DIRECTION')
        .appendField(new Blockly.FieldDropdown([['slow', '2000'], ['medium', '1000'], ['fast', '500']]), 'DELAY');
    this.appendValueInput('STEPS').appendField('steps');
    this.setFieldValue('3', 'STEP'); this.setFieldValue('4', 'DIR');
  });
  Blockly.Arduino.stepper_step_dir = function () {
    var step = this.getFieldValue('STEP'), dir = this.getFieldValue('DIR');
    Blockly.Arduino.setups_['stepdir_' + step] = 'pinMode(' + step + ', OUTPUT);';
    Blockly.Arduino.setups_['stepdir_' + dir] = 'pinMode(' + dir + ', OUTPUT);';
    return 'digitalWrite(' + dir + ', ' + this.getFieldValue('DIRECTION') + ');\n' +
           'for (long i = 0, count = (' + numberValue(this, 'STEPS', '0') + '); i < count; ++i) {\n' +
           '  digitalWrite(' + step + ', HIGH); delayMicroseconds(' + this.getFieldValue('DELAY') + ');\n' +
           '  digitalWrite(' + step + ', LOW); delayMicroseconds(' + this.getFieldValue('DELAY') + ');\n' +
           '}\n';
  };

  // WS2812/NeoPixel: one configured strip and separate set/show operations.
  function ensurePixels() {
    Blockly.Arduino.definitions_['pixel_include'] = '#include <Adafruit_NeoPixel.h>';
    if (!Blockly.Arduino.definitions_['pixel_object']) {
      Blockly.Arduino.definitions_['pixel_object'] =
          'Adafruit_NeoPixel pixels(8, 6, NEO_GRB + NEO_KHZ800);';
    }
    Blockly.Arduino.setups_['pixel_begin'] = 'pixels.begin();\n  pixels.show();';
  }
  statement('neopixel_init', 310, 'WS2812/NeoPixel data pin and LED count. Use suitable external power for a strip.', function () {
    this.appendDummyInput().appendField('NeoPixel start')
        .appendField(new Blockly.FieldDropdown([['1', '1'], ['8', '8'], ['16', '16'], ['30', '30'], ['60', '60']]), 'COUNT')
        .appendField('LEDs, pin').appendField(pinField(), 'PIN');
    this.setFieldValue('6', 'PIN'); this.setFieldValue('8', 'COUNT');
  });
  Blockly.Arduino.neopixel_init = function () {
    ensurePixels();
    Blockly.Arduino.definitions_['pixel_object'] =
        'Adafruit_NeoPixel pixels(' + this.getFieldValue('COUNT') + ', ' +
        this.getFieldValue('PIN') + ', NEO_GRB + NEO_KHZ800);';
    return '';
  };
  statement('neopixel_set', 310, 'Set one LED RGB color; follow with NeoPixel show.', function () {
    this.appendDummyInput().appendField('NeoPixel set RGB');
    this.appendValueInput('INDEX').appendField('LED #');
    this.appendValueInput('RED').appendField('red');
    this.appendValueInput('GREEN').appendField('green');
    this.appendValueInput('BLUE').appendField('blue');
  });
  Blockly.Arduino.neopixel_set = function () {
    ensurePixels();
    return 'pixels.setPixelColor(' + numberValue(this, 'INDEX', '0') + ', pixels.Color(' +
        numberValue(this, 'RED', '0') + ', ' + numberValue(this, 'GREEN', '0') + ', ' +
        numberValue(this, 'BLUE', '0') + '));\n';
  };
  statement('neopixel_show', 310, 'Send the selected colors to the LEDs.', function () {
    this.appendDummyInput().appendField('NeoPixel show');
  });
  Blockly.Arduino.neopixel_show = function () { ensurePixels(); return 'pixels.show();\n'; };
  statement('neopixel_clear', 310, 'Switch all NeoPixels off; follow with show.', function () {
    this.appendDummyInput().appendField('NeoPixel clear');
  });
  Blockly.Arduino.neopixel_clear = function () { ensurePixels(); return 'pixels.clear();\n'; };

  // IR receiver, restricted to NEC decoding to fit ATmega168.
  output('ir_nec_read', 110, 'NEC IR remote raw code; 0 when no new signal.', function () {
    this.appendDummyInput().appendField('IR NEC raw code on')
        .appendField(pinField(), 'PIN');
    this.setFieldValue('2', 'PIN');
  });
  Blockly.Arduino.ir_nec_read = function () {
    var pin = this.getFieldValue('PIN');
    Blockly.Arduino.definitions_['ir_include'] =
        '#define DECODE_NEC\n#include <IRremote.hpp>';
    Blockly.Arduino.definitions_['ir_read'] =
        'uint32_t readIrNecCode() {\n' +
        '  if (!IrReceiver.decode()) return 0;\n' +
        '  uint32_t code = IrReceiver.decodedIRData.decodedRawData;\n' +
        '  IrReceiver.resume();\n' +
        '  return code;\n' +
        '}';
    Blockly.Arduino.setups_['ir_begin'] = 'IrReceiver.begin(' + pin + ', false);';
    return ['readIrNecCode()', Blockly.Arduino.ORDER_ATOMIC];
  };

  // 74HC595 with the core shiftOut function.
  statement('shift595_write', 190, '74HC595: DS=data, SHCP=clock, STCP=latch; 8 output bits.', function () {
    this.appendDummyInput().appendField('74HC595 write')
        .appendField('DATA').appendField(pinField(), 'DATA')
        .appendField('CLK').appendField(pinField(), 'CLK')
        .appendField('LATCH').appendField(pinField(), 'LATCH');
    this.appendValueInput('VALUE').appendField('byte');
    this.setFieldValue('8', 'DATA'); this.setFieldValue('9', 'CLK');
    this.setFieldValue('10', 'LATCH');
  });
  Blockly.Arduino.shift595_write = function () {
    var data = this.getFieldValue('DATA'), clk = this.getFieldValue('CLK'), latch = this.getFieldValue('LATCH');
    Blockly.Arduino.setups_['shift_data_' + data] = 'pinMode(' + data + ', OUTPUT);';
    Blockly.Arduino.setups_['shift_clk_' + clk] = 'pinMode(' + clk + ', OUTPUT);';
    Blockly.Arduino.setups_['shift_latch_' + latch] = 'pinMode(' + latch + ', OUTPUT);';
    return 'digitalWrite(' + latch + ', LOW);\n' +
           'shiftOut(' + data + ', ' + clk + ', MSBFIRST, ' + numberValue(this, 'VALUE', '0') + ');\n' +
           'digitalWrite(' + latch + ', HIGH);\n';
  };

  // Built-in EEPROM for small persistent values.
  output('eeprom_read_byte', 30, 'Read one byte from EEPROM address 0..511 on ATmega168.', function () {
    this.appendValueInput('ADDRESS').appendField('EEPROM read byte at');
  });
  Blockly.Arduino.eeprom_read_byte = function () {
    Blockly.Arduino.definitions_['eeprom_include'] = '#include <EEPROM.h>';
    return ['EEPROM.read(' + numberValue(this, 'ADDRESS', '0') + ')', Blockly.Arduino.ORDER_ATOMIC];
  };
  statement('eeprom_update_byte', 30, 'Update one EEPROM byte only if changed, preserving endurance.', function () {
    this.appendValueInput('ADDRESS').appendField('EEPROM update byte at');
    this.appendValueInput('VALUE').appendField('value 0..255');
  });
  Blockly.Arduino.eeprom_update_byte = function () {
    Blockly.Arduino.definitions_['eeprom_include'] = '#include <EEPROM.h>';
    return 'EEPROM.update(' + numberValue(this, 'ADDRESS', '0') + ', ' +
        numberValue(this, 'VALUE', '0') + ');\n';
  };

  // AccelStepper: nonblocking acceleration, one or two independently configured motors.
  var motors = [['motor 1', '1'], ['motor 2', '2']];
  function ensureAccel(id) {
    Blockly.Arduino.definitions_['accel_include'] = '#include <AccelStepper.h>';
    if (!Blockly.Arduino.definitions_['accel_object_' + id]) {
      Blockly.Arduino.definitions_['accel_object_' + id] =
          'AccelStepper accelMotor' + id + '(AccelStepper::DRIVER, 3, 4);';
    }
    if (!Blockly.Arduino.setups_['accel_config_' + id]) {
      Blockly.Arduino.setups_['accel_config_' + id] =
          'accelMotor' + id + '.setMaxSpeed(400);\n  accelMotor' + id + '.setAcceleration(200);';
    }
    return 'accelMotor' + id;
  }
  statement('accel_driver_init', 175, 'AccelStepper STEP/DIR driver. Maximum speed is steps/s; acceleration is steps/s^2.', function () {
    this.appendDummyInput().appendField('AccelStepper STEP/DIR')
        .appendField(new Blockly.FieldDropdown(motors), 'MOTOR')
        .appendField('STEP').appendField(pinField(), 'STEP')
        .appendField('DIR').appendField(pinField(), 'DIR');
    this.appendValueInput('SPEED').setCheck('Number').appendField('max steps/s');
    this.appendValueInput('ACCEL').setCheck('Number').appendField('steps/s²');
    this.setFieldValue('3', 'STEP'); this.setFieldValue('4', 'DIR');
  });
  Blockly.Arduino.accel_driver_init = function () {
    var id = this.getFieldValue('MOTOR'), motor = ensureAccel(id);
    Blockly.Arduino.definitions_['accel_object_' + id] =
        'AccelStepper ' + motor + '(AccelStepper::DRIVER, ' +
        this.getFieldValue('STEP') + ', ' + this.getFieldValue('DIR') + ');';
    Blockly.Arduino.setups_['accel_config_' + id] =
        motor + '.setMaxSpeed(' + numberValue(this, 'SPEED', '400') + ');\n  ' +
        motor + '.setAcceleration(' + numberValue(this, 'ACCEL', '200') + ');';
    return '';
  };
  statement('accel_4wire_init', 175, 'AccelStepper HALF4WIRE for 28BYJ-48 with ULN2003.', function () {
    this.appendDummyInput().appendField('AccelStepper 28BYJ-48')
        .appendField(new Blockly.FieldDropdown(motors), 'MOTOR')
        .appendField('IN1').appendField(pinField(), 'IN1')
        .appendField('IN2').appendField(pinField(), 'IN2')
        .appendField('IN3').appendField(pinField(), 'IN3')
        .appendField('IN4').appendField(pinField(), 'IN4');
    this.appendValueInput('SPEED').setCheck('Number').appendField('max steps/s');
    this.appendValueInput('ACCEL').setCheck('Number').appendField('steps/s²');
    this.setFieldValue('8', 'IN1'); this.setFieldValue('9', 'IN2');
    this.setFieldValue('10', 'IN3'); this.setFieldValue('11', 'IN4');
  });
  Blockly.Arduino.accel_4wire_init = function () {
    var id = this.getFieldValue('MOTOR'), motor = ensureAccel(id);
    Blockly.Arduino.definitions_['accel_object_' + id] =
        'AccelStepper ' + motor + '(AccelStepper::HALF4WIRE, ' +
        this.getFieldValue('IN1') + ', ' + this.getFieldValue('IN3') + ', ' +
        this.getFieldValue('IN2') + ', ' + this.getFieldValue('IN4') + ');';
    Blockly.Arduino.setups_['accel_config_' + id] =
        motor + '.setMaxSpeed(' + numberValue(this, 'SPEED', '400') + ');\n  ' +
        motor + '.setAcceleration(' + numberValue(this, 'ACCEL', '200') + ');';
    return '';
  };
  statement('accel_move_to', 175, 'Set absolute target position; call run repeatedly in loop.', function () {
    this.appendDummyInput().appendField('AccelStepper move to')
        .appendField(new Blockly.FieldDropdown(motors), 'MOTOR');
    this.appendValueInput('TARGET').setCheck('Number').appendField('step position');
  });
  Blockly.Arduino.accel_move_to = function () {
    var motor = ensureAccel(this.getFieldValue('MOTOR'));
    return motor + '.moveTo(' + numberValue(this, 'TARGET', '0') + ');\n';
  };
  statement('accel_move_relative', 175, 'Set target relative to current motor position; call run repeatedly.', function () {
    this.appendDummyInput().appendField('AccelStepper move relative')
        .appendField(new Blockly.FieldDropdown(motors), 'MOTOR');
    this.appendValueInput('STEPS').setCheck('Number').appendField('steps (+/-)');
  });
  Blockly.Arduino.accel_move_relative = function () {
    var motor = ensureAccel(this.getFieldValue('MOTOR'));
    return motor + '.move(' + numberValue(this, 'STEPS', '0') + ');\n';
  };
  statement('accel_run', 175, 'Call once in every loop pass. Avoid long delay blocks while moving.', function () {
    this.appendDummyInput().appendField('AccelStepper run')
        .appendField(new Blockly.FieldDropdown(motors), 'MOTOR');
  });
  Blockly.Arduino.accel_run = function () {
    return ensureAccel(this.getFieldValue('MOTOR')) + '.run();\n';
  };
  statement('accel_set_max_speed', 175, 'Change maximum speed in steps per second.', function () {
    this.appendDummyInput().appendField('AccelStepper max speed')
        .appendField(new Blockly.FieldDropdown(motors), 'MOTOR');
    this.appendValueInput('SPEED').setCheck('Number').appendField('steps/s');
  });
  Blockly.Arduino.accel_set_max_speed = function () {
    return ensureAccel(this.getFieldValue('MOTOR')) + '.setMaxSpeed(' +
        numberValue(this, 'SPEED', '400') + ');\n';
  };
  statement('accel_set_acceleration', 175, 'Change acceleration in steps per second squared.', function () {
    this.appendDummyInput().appendField('AccelStepper acceleration')
        .appendField(new Blockly.FieldDropdown(motors), 'MOTOR');
    this.appendValueInput('ACCEL').setCheck('Number').appendField('steps/s²');
  });
  Blockly.Arduino.accel_set_acceleration = function () {
    return ensureAccel(this.getFieldValue('MOTOR')) + '.setAcceleration(' +
        numberValue(this, 'ACCEL', '200') + ');\n';
  };
  output('accel_distance_to_go', 175, 'Remaining signed steps to target; zero means at target.', function () {
    this.appendDummyInput().appendField('AccelStepper distance to go')
        .appendField(new Blockly.FieldDropdown(motors), 'MOTOR');
  });
  Blockly.Arduino.accel_distance_to_go = function () {
    return [ensureAccel(this.getFieldValue('MOTOR')) + '.distanceToGo()', Blockly.Arduino.ORDER_ATOMIC];
  };
  output('accel_current_position', 175, 'Current position in motor steps.', function () {
    this.appendDummyInput().appendField('AccelStepper current position')
        .appendField(new Blockly.FieldDropdown(motors), 'MOTOR');
  });
  Blockly.Arduino.accel_current_position = function () {
    return [ensureAccel(this.getFieldValue('MOTOR')) + '.currentPosition()', Blockly.Arduino.ORDER_ATOMIC];
  };
}());
