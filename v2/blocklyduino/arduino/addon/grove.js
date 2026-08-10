/**
 * @license
 * Copyright 2012 Fred Lin
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * @fileoverview seeeduino grove blocks for Blockly.
 * @author gasolin@gmail.com (Fred Lin)
 * @author scanet@libreduc.cc (Sébastien CANET)
 */
 
'use strict';

goog.provide('Blockly.Arduino.grove');

goog.require('Blockly.Arduino');

//automatic next pin attribution, due to Grove connection

var _get_next_pin = function (dropdown_pin) {
    var pos = -1;
    //check if NextPIN in bound
    if (isNaN(parseInt(dropdown_pin))) {
        var NextPIN = 'A' + (parseInt(dropdown_pin.slice(1, dropdown_pin.length)) + 1);
        pos = profile.default.analog.indexOf(String(NextPIN));
    } else {
        var NextPIN = parseInt(dropdown_pin) + 1;
        pos = profile.default.digital.indexOf(String(NextPIN));
    }
    if (pos < 0) {
        alert("Grove Sensor needs PIN#+1 port, current setting is out of bound.");
        return null;
    } else {
        return NextPIN;
    }
};
Blockly.Arduino['grove_led'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_stat = block.getFieldValue('STAT');
    Blockly.Arduino.setups_['setup_green_led_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'digitalWrite(' + dropdown_pin + ',' + dropdown_stat + ');\n'
    return code;
};

Blockly.Arduino['grove_button'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_button_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
    var code = 'digitalRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['grove_rotary_angle'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var code = 'analogRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['grove_tilt_switch'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_tilt_switch_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
    var code = 'digitalRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['grove_piezo_buzzer'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_stat = block.getFieldValue('STAT');
    Blockly.Arduino.setups_['setup_piezo_buzzer_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'digitalWrite(' + dropdown_pin + ',' + dropdown_stat + ');\n'
    return code;
};

Blockly.Arduino['grove_relay'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_stat = block.getFieldValue('STAT');
    Blockly.Arduino.setups_['setup_relay_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'digitalWrite(' + dropdown_pin + ',' + dropdown_stat + ');\n'
    return code;
};

Blockly.Arduino['grove_temperature_sensor'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    /*
     a=analogRead(0);
     resistance=(float)(1023-a)*10000/a;
     temperature=1/(log(resistance/10000)/B+1/298.15)-273.15;
     */
    var code = 'round(' + '(1/(log((float)(1023-analogRead(' + dropdown_pin + '))*10000/analogRead(' + dropdown_pin + '))/10000)/3975+1/298.15)-273.15' + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['grove_serial_lcd_print'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var text = Blockly.Arduino.valueToCode(block, 'TEXT1',
            Blockly.Arduino.ORDER_UNARY_POSTFIX) || '\'\'';
    var text2 = Blockly.Arduino.valueToCode(block, 'TEXT2',
            Blockly.Arduino.ORDER_UNARY_POSTFIX) || '\'\'';
    var delay_time = Blockly.Arduino.valueToCode(block, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
    /*if(text.length>16||text2.length>16){
     alert("string is too long");
     }*/
    Blockly.Arduino.definitions_['define_seriallcd'] = '#include <SerialLCD.h>\n';
    Blockly.Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n';
    //generate PIN#+1 port
    var NextPIN = _get_next_pin(dropdown_pin);

    Blockly.Arduino.definitions_['var_lcd_' + dropdown_pin] = 'SerialLCD slcd_' + dropdown_pin + '(' + dropdown_pin + ',' + NextPIN + ');\n';

    Blockly.Arduino.setups_['setup_lcd_' + dropdown_pin] = 'slcd_' + dropdown_pin + '.begin();\n';
    var code = 'slcd_' + dropdown_pin + '.backlight();\n';
    code += 'slcd_' + dropdown_pin + '.setCursor(0,0);\n';
    code += 'slcd_' + dropdown_pin + '.print(' + text + ');\n'; //text.replace(new RegExp('\'',"gm"),'')
    code += 'slcd_' + dropdown_pin + '.setCursor(0,1);\n';
    code += 'slcd_' + dropdown_pin + '.print(' + text2 + ');\n';
    code += 'delay(' + delay_time + ');\n';
    return code;
};

Blockly.Arduino['grove_serial_lcd_power'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_stat = block.getFieldValue('STAT');

    Blockly.Arduino.definitions_['define_seriallcd'] = '#include <SerialLCD.h>\n';
    Blockly.Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n';
    //generate PIN#+1 port
    var NextPIN = _get_next_pin(dropdown_pin);

    Blockly.Arduino.definitions_['var_lcd' + dropdown_pin] = 'SerialLCD slcd_' + dropdown_pin + '(' + dropdown_pin + ',' + NextPIN + ');\n';
    var code = 'slcd_' + dropdown_pin;
    if (dropdown_stat === "ON") {
        code += '.Power();\n';
    } else {
        code += '.noPower();\n';
    }
    return code;
};

Blockly.Arduino['grove_serial_lcd_effect'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_stat = block.getFieldValue('STAT');

    Blockly.Arduino.definitions_['define_seriallcd'] = '#include <SerialLCD.h>\n';
    Blockly.Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n';
    //generate PIN#+1 port
    var NextPIN = _get_next_pin(dropdown_pin);

    Blockly.Arduino.definitions_['var_lcd' + dropdown_pin] = 'SerialLCD slcd_' + dropdown_pin + '(' + dropdown_pin + ',' + NextPIN + ');\n';
    var code = 'slcd_' + dropdown_pin;
    if (dropdown_stat === "LEFT") {
        code += '.scrollDisplayLeft();\n';
    } else if (dropdown_stat === "RIGHT") {
        code += '.scrollDisplayRight();\n';
    } else {
        code += '.autoscroll();\n';
    }
    return code;
};

Blockly.Arduino['grove_sound_sensor'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var code = 'analogRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['grove_pir_motion_sensor'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
    var code = 'digitalRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['grove_line_finder'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
    var code = 'digitalRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['grove_ultrasonic_ranger'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_unit = block.getFieldValue('UNIT');
    Blockly.Arduino.definitions_['define_ultrasonic'] = '#include <Ultrasonic.h>\n';
    Blockly.Arduino.definitions_['var_ultrasonic' + dropdown_pin] = 'Ultrasonic ultrasonic_' + dropdown_pin + '(' + dropdown_pin + ');';
    var code;
    if (dropdown_unit === "cm") {
        code = 'ultrasonic_' + dropdown_pin + '.MeasureInCentimeters()';
    } else {
        code = 'ultrasonic_' + dropdown_pin + '.MeasureInInches()';
    }
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['grove_motor_shield'] = function (block) {
    var dropdown_direction = block.getFieldValue('DIRECTION');
    var speed = 127; //Blockly.Arduino.valueToCode(block, 'SPEED', Blockly.Arduino.ORDER_ATOMIC) || '127';
    Blockly.Arduino.setups_["setup_motor"] = "pinMode(8,OUTPUT);//I1\n" +
            "  pinMode(11,OUTPUT);//I2\n" +
            "  pinMode(9,OUTPUT);//speedPinA\n" +
            "  pinMode(12,OUTPUT);//I3\n" +
            "  pinMode(13,OUTPUT);//i4\n" +
            "  pinMode(10,OUTPUT);//speedPinB\n";
    var code = "";
    if (dropdown_direction === "forward") {
        Blockly.Arduino.definitions_['define_forward'] = "void forward()\n" +
                "{\n" +
                "  analogWrite(9," + speed + ");//input a simulation value to set the speed\n" +
                "  analogWrite(10," + speed + ");\n" +
                "  digitalWrite(13,HIGH);//turn DC Motor B move clockwise\n" +
                "  digitalWrite(12,LOW);\n" +
                "  digitalWrite(11,LOW);//turn DC Motor A move anticlockwise\n" +
                "  digitalWrite(8,HIGH);\n" +
                "}\n";
        code = "forward();\n";
    } else if (dropdown_direction === "right") {
        Blockly.Arduino.definitions_['define_right'] = "void right()\n" +
                "{\n" +
                "  analogWrite(9," + speed + ");//input a simulation value to set the speed\n" +
                "  analogWrite(10," + speed + ");\n" +
                "  digitalWrite(13,LOW);//turn DC Motor B move anticlockwise\n" +
                "  digitalWrite(12,HIGH);\n" +
                "  digitalWrite(11,LOW);//turn DC Motor A move anticlockwise\n" +
                "  digitalWrite(8,HIGH);\n" +
                "}\n\n";
        code = "right();\n";
    } else if (dropdown_direction === "left") {
        Blockly.Arduino.definitions_['define_left'] = "void left()\n" +
                "{\n" +
                "  analogWrite(9," + speed + ");//input a simulation value to set the speed\n" +
                "  analogWrite(10," + speed + ");\n" +
                "  digitalWrite(13,HIGH);//turn DC Motor B move clockwise\n" +
                "  digitalWrite(12,LOW);\n" +
                "  digitalWrite(11,HIGH);//turn DC Motor A move clockwise\n" +
                "  digitalWrite(8,LOW);\n" +
                "}\n\n";
        code = "left();\n";
    } else if (dropdown_direction === "backward") {
        Blockly.Arduino.definitions_['define_backward'] = "void backward()\n" +
                "{\n" +
                "  analogWrite(9," + speed + ");//input a simulation value to set the speed\n" +
                "  analogWrite(10," + speed + ");\n" +
                "  digitalWrite(13,LOW);//turn DC Motor B move anticlockwise\n" +
                "  digitalWrite(12,HIGH);\n" +
                "  digitalWrite(11,HIGH);//turn DC Motor A move clockwise\n" +
                "  digitalWrite(8,LOW);\n" +
                "}\n\n";
        code = "backward();\n";
    } else if (dropdown_direction === "stop") {
        Blockly.Arduino.definitions_['define_stop'] = "void stop()\n" +
                "{\n" +
                "digitalWrite(9,LOW);// Unenble the pin, to stop the motor. block should be done to avid damaging the motor.\n" +
                "digitalWrite(10,LOW);\n" +
                "delay(1000);\n" +
                "}\n\n"
        code = "stop();\n";
    }
    return code;
};

Blockly.Arduino['grove_thumb_joystick'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_axis = block.getFieldValue('AXIS');
    var stickPIN = "0"
    if (dropdown_axis === "y") {
        stickPIN = _get_next_pin(dropdown_pin);
    } else {
        stickPIN = dropdown_pin
    }
    var code = 'analogRead(' + stickPIN + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

function hexToR(h) {
    return parseInt((cutHex(h)).substring(0, 2), 16)
}
function hexToG(h) {
    return parseInt((cutHex(h)).substring(2, 4), 16)
}
function hexToB(h) {
    return parseInt((cutHex(h)).substring(4, 6), 16)
}
function cutHex(h) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

Blockly.Arduino['grove_rgb_led'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var NextPIN = _get_next_pin(dropdown_pin);

    Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    Blockly.Arduino.setups_['setup_input_' + NextPIN] = 'pinMode(' + NextPIN + ', OUTPUT);';
    Blockly.Arduino.definitions_['define_uint8'] = "#define uint8 unsigned char";
    Blockly.Arduino.definitions_['define_uint16'] = "#define uint16 unsigned int";
    Blockly.Arduino.definitions_['define_uint32'] = "#define uint32 unsigned long int";
    Blockly.Arduino.definitions_['define_clkproduce_' + dropdown_pin] = "void ClkProduce_" + dropdown_pin + "(void)\n" +
            "{\n" +
            "  digitalWrite(" + dropdown_pin + ", LOW);\n" +
            "  delayMicroseconds(20);\n" +
            "  digitalWrite(" + dropdown_pin + ", HIGH);\n" +
            "  delayMicroseconds(20);\n" +
            "}\n";
    Blockly.Arduino.definitions_['define_send32zero_' + dropdown_pin] = "void Send32Zero_" + dropdown_pin + "(void)\n" +
            "{\n" +
            "  uint8 i;\n" +
            "  for (i=0; i<32; i++)\n" +
            "  {\n" +
            "    digitalWrite(" + NextPIN + ", LOW);\n" +
            "    ClkProduce_" + dropdown_pin + "();\n" +
            "  }\n" +
            "}\n";
    Blockly.Arduino.definitions_['define_taskanticode'] = "uint8 TakeAntiCode(uint8 dat)\n" +
            "{\n" +
            "  uint8 tmp = 0;\n" +
            "  if ((dat & 0x80) == 0)\n" +
            "  {\n" +
            "    tmp |= 0x02;\n" +
            "  }\n" +
            "  \n" +
            "  if ((dat & 0x40) == 0)\n" +
            "  {\n" +
            "    tmp |= 0x01;\n" +
            "  }\n" +
            "  return tmp;\n" +
            "}\n";
    Blockly.Arduino.definitions_['define_datasend_' + dropdown_pin] = "// gray data\n" +
            "void DatSend_" + dropdown_pin + "(uint32 dx)\n" +
            "{\n" +
            "  uint8 i;\n" +
            "  for (i=0; i<32; i++)\n" +
            "  {\n" +
            "    if ((dx & 0x80000000) != 0)\n" +
            "    {\n" +
            "      digitalWrite(" + NextPIN + ", HIGH);\n" +
            "    }\n" +
            "    else\n" +
            "    {\n" +
            "      digitalWrite(" + NextPIN + ", LOW);\n" +
            "    }\n" +
            "  dx <<= 1;\n" +
            "  ClkProduce_" + dropdown_pin + "();\n" +
            "  }\n" +
            "}\n";
    Blockly.Arduino.definitions_['define_datadealwithsend_' + dropdown_pin] = "// data processing\n" +
            "void DataDealWithAndSend_" + dropdown_pin + "(uint8 r, uint8 g, uint8 b)\n" +
            "{\n" +
            "  uint32 dx = 0;\n" +
            "  dx |= (uint32)0x03 << 30;             // highest two bits 1，flag bits\n" +
            "  dx |= (uint32)TakeAntiCode(b) << 28;\n" +
            "  dx |= (uint32)TakeAntiCode(g) << 26;\n" +
            "  dx |= (uint32)TakeAntiCode(r) << 24;\n" +
            "\n" +
            "  dx |= (uint32)b << 16;\n" +
            "  dx |= (uint32)g << 8;\n" +
            "  dx |= r;\n" +
            "\n" +
            "  DatSend_" + dropdown_pin + "(dx);\n" +
            "}\n";
    var code = "Send32Zero_" + dropdown_pin + "(); // begin\n";
    //console.log(block.itemCount_);
    if (block.itemCount_ == 0) {
        return '';
    } else {
        for (var n = 0; n < block.itemCount_; n++) {
            var colour_rgb = block.getFieldValue('RGB' + n);
            //console.log(colour_rgb);
            code += "DataDealWithAndSend_" + dropdown_pin + "(" + hexToR(colour_rgb) + ", " + hexToG(colour_rgb) + ", " + hexToB(colour_rgb) + "); // first node data\n";
        }
    }
    code += "Send32Zero_" + dropdown_pin + "();  // send to update data\n";
    return code;
};

Blockly.Arduino['grove_bluetooth_slave'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var NextPIN = _get_next_pin(dropdown_pin);
    var name = block.getFieldValue('NAME')
    var pincode = block.getFieldValue('PINCODE');
    var statement_receive = Blockly.Arduino.statementToCode(block, "RCV")
    var statement_send = Blockly.Arduino.statementToCode(block, "SNT")
    /* if(pincode.length != 4){
     alert("pincode length should be 4");
     } */
    Blockly.Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n';
    Blockly.Arduino.definitions_['var_bluetooth_' + dropdown_pin] = 'SoftwareSerial blueToothSerial_' + dropdown_pin + '(' + dropdown_pin + ',' + NextPIN + ');\n';

    Blockly.Arduino.setups_['setup_bluetooth_' + dropdown_pin] = 'Serial.begin(9600);\n';
    Blockly.Arduino.setups_['setup_bluetooth_' + dropdown_pin] += '  pinMode(' + dropdown_pin + ', INPUT);\n';
    Blockly.Arduino.setups_['setup_bluetooth_' + dropdown_pin] += '  pinMode(' + NextPIN + ', OUTPUT);\n';
    Blockly.Arduino.setups_['setup_bluetooth_' + dropdown_pin] += '  setupBlueToothConnection_' + dropdown_pin + '();\n';

    Blockly.Arduino.definitions_['define_setupBlueToothConnection_' + dropdown_pin] = 'void setupBlueToothConnection_' + dropdown_pin + '()\n' +
            '{\n' +
            '  blueToothSerial_' + dropdown_pin + '.begin(38400); //Set BluetoothBee BaudRate to default baud rate 38400\n' +
            '  blueToothSerial_' + dropdown_pin + '.print("\\r\\n+STWMOD=0\\r\\n"); //set the bluetooth work in slave mode\n' +
            '  blueToothSerial_' + dropdown_pin + '.print("\\r\\n+STNA=' + name + '\\r\\n"); //set the bluetooth name as "' + name + '"\n' +
            '  blueToothSerial_' + dropdown_pin + '.print("\\r\\n+STPIN=0000\\r\\n");//Set SLAVE pincode"0000"\n' +
            '  blueToothSerial_' + dropdown_pin + '.print("\\r\\n+STOAUT=1\\r\\n"); // Permit Paired device to connect me\n' +
            '  blueToothSerial_' + dropdown_pin + '.print("\\r\\n+STAUTO=0\\r\\n"); // Auto-connection should be forbidden here\n' +
            '  delay(2000); // This delay is required.\n' +
            '  blueToothSerial_' + dropdown_pin + '.print("\\r\\n+INQ=1\\r\\n"); //make the slave bluetooth inquirable \n' +
            '  Serial.println("The slave bluetooth is inquirable!");\n' +
            '  delay(2000); // This delay is required.\n' +
            '  blueToothSerial_' + dropdown_pin + '.flush();\n' +
            '}\n';
    var code = 'char recvChar_' + dropdown_pin + ';\n' +
            'while(1) {\n' +
            '  if(blueToothSerial_' + dropdown_pin + '.available()) {//check if there is any data sent from the remote bluetooth shield\n' +
            '    recvChar_' + dropdown_pin + ' = blueToothSerial_' + dropdown_pin + '.read();\n' +
            '    Serial.print(recvChar_' + dropdown_pin + ');\n' +
            statement_receive +
            '  }\n' +
            '  if(Serial.available()){//check if there is any data sent from the local serial terminal, you can add the other applications here\n' +
            '    recvChar_' + dropdown_pin + ' = Serial.read();\n' +
            '    blueToothSerial_' + dropdown_pin + '.print(recvChar_' + dropdown_pin + ');\n' +
            statement_send +
            '  }\n' +
            '}\n';
    return code;
};
