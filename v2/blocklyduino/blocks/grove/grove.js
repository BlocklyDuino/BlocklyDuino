/**
* @license
* Copyright 2012 Fred Lin
* SPDX-License-Identifier: GPL-3.0-or-later
*/

/**
 * @fileoverview Helper functions for generating seeeduino grove blocks.
 * @author gasolin@gmail.com (Fred Lin)
 * @author scanet@libreduc.cc (Sébastien CANET)
 */
 
'use strict';

goog.provide('Blockly.Constants.grove');

goog.require('Blockly.Blocks');
goog.require('Blockly');

var groveMediaFolder = "./blocklyduino/blocks/grove/";

Blockly.Blocks['grove_led'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("LED")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Red_LED_s.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN")
                .appendField("stat")
                .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('green LED');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Red_LED/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_button'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Button")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Button.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
        this.setOutput(true, 'Boolean');
        this.setTooltip('Basic digital input');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Button/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_rotary_angle'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Rotary Angle")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Grove-Rotary_Angle_Sensor-P-.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownAnalog), "PIN");
        this.setOutput(true, 'int');
        this.setTooltip('Analog output between 0 and Vcc');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Rotary_Angle_Sensor/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_tilt_switch'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Tilt Switch")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Tilt1.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
        this.setOutput(true, 'Boolean');
        this.setTooltip('When the switch is level it is open, and when tilted, the switch closes.');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Tilt_Switch/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_piezo_buzzer'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Piezo Buzzer")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Grove_Buzzer.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN")
                .appendField("stat")
                .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Emit a tone when the output is high');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Buzzer/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_relay'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Relay")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Twig-Relay.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN")
                .appendField("stat")
                .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('capable of switching a much higher voltages and currents. The maximum voltage and current that can be controlled by this module upto 250V at 10 amps.');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Relay/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_temperature_sensor'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Temperature Sensor")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Temperature1.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownAnalog), "PIN")
        this.setOutput(true, 'int');
        this.setTooltip('return number of ambient temperature in ℃');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Temperature_Sensor/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_serial_lcd_print'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Serial LCD")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Lcdnew1.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
        this.appendValueInput("TEXT1")
                .setCheck(stringCompatibility)
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("print line1");
        this.appendValueInput("TEXT2")
                .setCheck(stringCompatibility)
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("print line2")
        this.appendValueInput("DELAY_TIME")
                .setCheck(intCompatibility)
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Delay");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('print text on an 16 character by 2 line LCD.');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Serial_LCD_V1.0/');
        this.setStyle('grove_blocks');
    }
};

//grove lcd power on/off
Blockly.Blocks['grove_serial_lcd_power'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Serial LCD")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Lcdnew1.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
        this.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Power")
                .appendField(new Blockly.FieldDropdown([["ON", "ON"], ["OFF", "OFF"]]), "STAT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Turn LCD power on/off');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Serial_LCD_V1.0/');
        this.setStyle('grove_blocks');
    }
};

//scroll left/right/no scroll/blink/noblink
Blockly.Blocks['grove_serial_lcd_effect'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Serial LCD")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Lcdnew1.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
        this.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Effect")
                .appendField(new Blockly.FieldDropdown([["Scroll Left", "LEFT"], ["Scroll Right", "RIGHT"], ["Scroll Auto", "AUTO"]]), "STAT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Turn LCD power on/off');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Serial_LCD_V1.0/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_sound_sensor'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Sound Sensor")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "sound_sensor.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownAnalog), "PIN")
        this.setOutput(true, 'int');
        this.setTooltip('Detect the sound strength of the environment');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Sound_Sensor/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_pir_motion_sensor'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("PIR Motion Sensor")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Grove_-_PIR_Motion_Sensor.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN")
        this.setOutput(true, 'int');
        this.setTooltip('When anyone moves in it\'s detecting range, the sensor outputs HIGH.');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-PIR_Motion_Sensor/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_line_finder'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Line Finder")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Grovelinefinder1.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN");
        this.setOutput(true, 'Boolean');
        this.setTooltip('Output digital signal so the robot can reliably follow a black line on a white background');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Line_Finder/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_ultrasonic_ranger'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Ultrasonic Ranger")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Ultrasonic.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN")
                .appendField("unit")
                .appendField(new Blockly.FieldDropdown([["cm", "cm"], ["inch", "inch"]]), "UNIT");
        this.setOutput(true, 'float');
        this.setTooltip('Non-contact distance measurement module');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Ultrasonic_Ranger/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_motor_shield'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Motor")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Smotoshield2.jpg", 64, 64))
                .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
        /*this.appendValueInput("SPEED", 'Number')
         .setCheck('Number')
         .setAlign(Blockly.ALIGN_RIGHT)
         .appendField("Speed");*/
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Drive two brushed DC motors');
        this.setHelpUrl('http://wiki.seeedstudio.com/Motor_Shield/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_thumb_joystick'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Thumb Joystick")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Bgjoy1.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownAnalog), "PIN")
                .appendField("axis")
                .appendField(new Blockly.FieldDropdown([["x", "x"], ["y", "y"]]), "AXIS");
        this.setOutput(true, 'int');
        this.setTooltip('output two analog values(200~800) representing two directions');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Thumb_Joystick/');
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_rgb_led'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Chainable RGB LED")
                .appendField(new Blockly.FieldImage(groveMediaFolder + "Chanbalelednb1.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN")
        this.appendDummyInput("COLOR0")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Color 1")
                .appendField(new Blockly.FieldColour("#00ff00"), "RGB0");
        this.setMutator(new Blockly.Mutator(['grove_rgb_led_item']));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('256 color LED, currently Chainable feature is not support');
        this.itemCount_ = 1;
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Chainable_RGB_LED/');
        this.setStyle('grove_blocks');
    },
    mutationToDom: function () {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        for (var x = 0; x < this.itemCount_; x++) {
            var colour_rgb = this.getFieldValue('RGB0');
            //alert(colour_rgb);
            container.setAttribute('RGB' + x, colour_rgb);
        }
        return container;
    },
    domToMutation: function (xmlElement) {
        for (var x = 0; x < this.itemCount_; x++) {
            this.removeInput('COLOR' + x);
        }
        this.itemCount_ = window.parseInt(xmlElement.getAttribute('items'), 10);
        for (var x = 0; x < this.itemCount_; x++) {
            var color = window.parseInt(xmlElement.getAttribute('RGB' + x), "#00ff00");
            var input = this.appendDummyInput('COLOR' + x);
            //if (x == 0) {
            input.setAlign(Blockly.ALIGN_RIGHT)
                    .appendField("Color " + (x + 1))
                    .appendField(new Blockly.FieldColour(color), "RGB" + x);
            //}
        }
        if (this.itemCount_ == 0) {
            this.appendDummyInput('COLOR0')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField("Color 1")
                    .appendField(new Blockly.FieldColour("#00ff00"), "RGB0");
        }
    },
    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('grove_rgb_led_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 0; x < this.itemCount_; x++) {
            var itemBlock = workspace.newBlock('grove_rgb_led_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    compose: function (containerBlock) {
        // Disconnect all input blocks and remove all inputs.
        if (this.itemCount_ == 0) {
            this.removeInput('COLOR0');
        } else {
            for (var x = this.itemCount_ - 1; x >= 0; x--) {
                //console.log("cnt:"+x);
                this.removeInput('COLOR' + x);
            }
        }
        /*var top;
         if(this.itemCount_ > 0){
         top = this.itemCount_-1;
         } else {
         top = 0;
         }
         console.log("top:"+top);*/
        this.itemCount_ = 0;
        // Rebuild the block's inputs.
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        while (itemBlock) {
            var colour_rgb = this.getFieldValue('RGB' + this.itemCount_);
            if (colour_rgb == null) {
                colour_rgb = "00ff00";
            }
            //console.log("blk:"+this.itemCount_);
            /*if(top>this.itemCount_){
             this.removeInput('COLOR' + this.itemCount_);
             }*/
            var input = this.appendDummyInput('COLOR' + this.itemCount_);
            //if (this.itemCount_ == 0) {
            input.setAlign(Blockly.ALIGN_RIGHT)
                    .appendField("Color " + (this.itemCount_ + 1))
                    .appendField(new Blockly.FieldColour(colour_rgb), "RGB" + this.itemCount_);
            //}
            // Reconnect any child blocks.
            if (itemBlock.valueConnection_) {
                input.connection.connect(itemBlock.valueConnection_);
            }
            this.itemCount_++;
            itemBlock = itemBlock.nextConnection &&
                    itemBlock.nextConnection.targetBlock();
        }
        if (this.itemCount_ == 0) {
            this.appendDummyInput('COLOR0')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField("Color 1")
                    .appendField(new Blockly.FieldColour("#00ff00"), "RGB0");
        }
    }
    /*saveConnections: function(containerBlock) {
     // Store a pointer to any connected child blocks.
     var itemBlock = containerBlock.getInputTargetBlock('STACK');
     var x = 0;
     while (itemBlock) {
     var input = this.getInput('COLOR' + x);
     itemBlock.valueConnection_ = input && input.connection.targetConnection;
     x++;
     itemBlock = itemBlock.nextConnection &&
     itemBlock.nextConnection.targetBlock();
     }
     }*/
};

Blockly.Blocks['grove_rgb_led_container'] = {
    // Container.
    init: function () {
        this.appendDummyInput()
                .appendField("Container");
        this.appendStatementInput('STACK');
        this.setTooltip("Add, remove items to reconfigure this chain");
        this.contextMenu = false;
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_rgb_led_item'] = {
    // Add items.
    init: function () {
        this.appendDummyInput()
                .appendField("Item");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("Add an item to the chain");
        this.contextMenu = false;
        this.setStyle('grove_blocks');
    }
};

Blockly.Blocks['grove_bluetooth_slave'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Bluetooth Slave")
                .appendField(new Blockly.FieldImage("http://www.seeedstudio.com/wiki/File:Twigbt00.jpg", 64, 64))
                .appendField("PIN#")
                .appendField(new Blockly.FieldDropdown(profile.default.dropdownDigital), "PIN")
        this.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Name")
                .appendField(new Blockly.FieldTextInput('blocklyduino'), 'NAME');
        this.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Pincode")
                .appendField(new Blockly.FieldTextInput('0000'), 'PINCODE');
        this.appendStatementInput("RCV")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Receive");
        this.appendStatementInput("SNT")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Send");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Bluetooth V2.0+EDR slave. Support single slave per board');
        this.setHelpUrl('http://wiki.seeedstudio.com/Grove-Serial_Bluetooth/');
        this.setStyle('grove_blocks');
    }
};