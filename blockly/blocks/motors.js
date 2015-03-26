/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview Helper functions for generating motor blocks - sumo robots
 * Written to facilitate programming of sumo and mini-sumo robots
 * Thanks to Fred Lin for building BlockyDuino!
 * @author erickennedy@outlook.com  Eric Kennedy
 */

goog.provide('Blockly.Blocks.motors');

goog.require('Blockly.Blocks');




Blockly.Blocks['zumo_motors_FN'] = {
  helpUrl: 'https://www.pololu.com/docs/0J57/5',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Zumo -No flip")
        .appendField(new Blockly.FieldImage("https://a.pololu-files.com/picture/0J4110.250.jpg", 64, 64))
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
    /*this.appendValueInput("SPEED", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Speed");*/
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Drive Pololu Zumo (wired correctly)');
  }
};

Blockly.Blocks['zumo_motors_FNs'] = {
  helpUrl: 'https://www.pololu.com/docs/0J57/5',
  init: function() {
    this.setColour(190);
	this.setInputsInline(false) ; 
    this.appendDummyInput()
        .appendField("Zumo -No flip & Speed")
        .appendField(new Blockly.FieldImage("https://a.pololu-files.com/picture/0J4110.250.jpg", 64, 64))
	this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
   this.setInputsInline(true) ;
   this.appendValueInput("SPEEDA", 'Number')
       .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedL")
	this.appendValueInput("SPEEDB", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Drive Pololu Zumo/DRV8835 (wired correctly) & Speed');
  }
};

Blockly.Blocks['zumo_motors_FR'] = {
  helpUrl: 'https://www.pololu.com/docs/0J57/5',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Zumo -Flip Right")
        .appendField(new Blockly.FieldImage("https://a.pololu-files.com/picture/0J4110.250.jpg", 64, 64))
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
    /*this.appendValueInput("SPEED", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Speed");*/
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Drive Pololu Zumo (flipped right motor)');
  }
};

Blockly.Blocks['zumo_motors_FRs'] = {
  helpUrl: 'https://www.pololu.com/docs/0J57/5',
  init: function() {
    this.setColour(190);
	this.setInputsInline(false) ; 
    this.appendDummyInput()
        .appendField("Zumo -Flip R & Speed")
        .appendField(new Blockly.FieldImage("https://a.pololu-files.com/picture/0J4110.250.jpg", 64, 64))
    this.appendDummyInput()    
		.appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
	this.setInputsInline(true) ;   
  this.appendValueInput("SPEEDA", 'Number')
       .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedL")
	this.appendValueInput("SPEEDB", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Drive Pololu Zumo (flipped right motor) & Speed');
  }
};

Blockly.Blocks['zumo_motors_FL'] = {
  helpUrl: 'https://www.pololu.com/docs/0J57/5',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Zumo -Flip Left")
        .appendField(new Blockly.FieldImage("https://a.pololu-files.com/picture/0J4110.250.jpg", 64, 64))
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
    /*this.appendValueInput("SPEED", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Speed");*/
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Drive Pololu Zumo (flipped left motor)');
  }
};

Blockly.Blocks['zumo_motors_FLs'] = {
  helpUrl: 'https://www.pololu.com/docs/0J57/5',
  init: function() {
    this.setColour(190);
	this.setInputsInline(false) ; 
    this.appendDummyInput()
        .appendField("Zumo -Flip L & Speed")
        .appendField(new Blockly.FieldImage("https://a.pololu-files.com/picture/0J4110.250.jpg", 64, 64))
     this.appendDummyInput()    
		.appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
   this.setInputsInline(true) ; 
   this.appendValueInput("SPEEDA", 'Number')
       .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedL")
	this.appendValueInput("SPEEDB", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Drive Pololu Zumo (flipped left motor) & Speed');
  }
};

Blockly.Blocks['zumo_motors_FBs'] = {
  helpUrl: 'https://www.pololu.com/docs/0J57/5',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Zumo -Both Flipped & Speed")
        .appendField(new Blockly.FieldImage("https://a.pololu-files.com/picture/0J4110.250.jpg", 64, 64))
     this.appendDummyInput()    
		.appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
   this.setInputsInline(true) ; 
   this.appendValueInput("SPEEDA", 'Number')
       .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedL")
	this.appendValueInput("SPEEDB", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Drive Pololu Zumo (flipped both motors)');
  }
};

Blockly.Blocks['zumo_motors_FB'] = {
  helpUrl: 'https://www.pololu.com/docs/0J57/5',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Zumo -Both Flipped")
        .appendField(new Blockly.FieldImage("https://a.pololu-files.com/picture/0J4110.250.jpg", 64, 64))
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
    /*this.appendValueInput("SPEED", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Speed");*/
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Drive Pololu Zumo (flipped both motors)');
  }
};

Blockly.Blocks['ardu_motor'] = {
  helpUrl: 'https://www.sparkfun.com/datasheets/DevTools/Arduino/Ardumoto_v13.pdf',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("ArduMotor")
        .appendField(new Blockly.FieldImage("https://cdn.sparkfun.com//assets/parts/3/8/4/9/09815-01.jpg", 64, 64))
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
    /*this.appendValueInput("SPEED", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Speed");*/
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('ArduMotor Sparkfun Shield A=left B=right');
  }
};

Blockly.Blocks['ardu_motor_s'] = {
  helpUrl: 'https://www.sparkfun.com/datasheets/DevTools/Arduino/Ardumoto_v13.pdf',
  init: function() {
    this.setColour(190);
	this.setInputsInline(false) ; 
	this.appendDummyInput()
		.appendField("ArduMotor_Speed")
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION")
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("https://cdn.sparkfun.com//assets/parts/3/8/4/9/09815-01.jpg", 40,40));
   this.setInputsInline(true) ; 
   this.appendValueInput("SPEEDA", 'Number')
       .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedA")
	this.appendValueInput("SPEEDB", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedB")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('ArduMotor Sparkfun Shield A=left B=right');
  }
};

Blockly.Blocks['arduino_s'] = {
  helpUrl: 'http://arduino.cc/en/Main/ArduinoMotorShieldR3',
  init: function() {
    this.setColour(190);
	this.setInputsInline(false) ; 
	this.appendDummyInput()
		.appendField("Arduino_Speed")
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION")
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("http://arduino.cc/en/uploads/Main/MotorShield_R3_Front.jpg.jpg", 40,40));
   this.setInputsInline(true) ; 
   this.appendValueInput("SPEEDA", 'Number')
       .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedA")
	this.appendValueInput("SPEEDB", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedB")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Arduino Motor Shield A=left B=right (no brake/current)');
  }
};

Blockly.Blocks['pololu_drv8835_s'] = {
  helpUrl: 'https://www.pololu.com/product/2511/resources',
  init: function() {
    this.setColour(190);
	this.setInputsInline(false) ; 
    this.appendDummyInput()
        .appendField("Pololu Drv8835 Shield w Speed")
        .appendField(new Blockly.FieldImage("https://a.pololu-files.com/picture/0J5705.1200.jpg", 64, 64))
	this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
   this.setInputsInline(true) ;
   this.appendValueInput("SPEEDA", 'Number')
       .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedL")
	this.appendValueInput("SPEEDB", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Pololu DRV8835 Shield & Speed');
  }
};


Blockly.Blocks['radio_shack_s'] = {
  helpUrl: 'http://demandware.edgesuite.net/aasr_prd/on/demandware.static/Sites-radioshack-Site/Sites-radioshack-Library/default/v1427306427938/Support/ProductManuals/2770168_PM_EN.pdf',
  init: function() {
    this.setColour(190);
	this.setInputsInline(false) ; 
    this.appendDummyInput()
        .appendField("Radio Shack Make: Shield w Speed")
        .appendField(new Blockly.FieldImage("http://demandware.edgesuite.net/sits_pod26/dw/image/v2/AASR_PRD/on/demandware.static/Sites-radioshack-Site/Sites-master-catalog/default/v1427306427938/images/02770168_00.jpg", 64, 64))
	this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
   this.setInputsInline(true) ;
   this.appendValueInput("SPEEDA", 'Number')
       .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedL")
	this.appendValueInput("SPEEDB", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Radio Shack Make: A&B Motors & Speed');
  }
};

Blockly.Blocks['dfrobot_s'] = {
  helpUrl: 'http://www.dfrobot.com/wiki/index.php?title=Arduino_Motor_Shield_(L298N)_(SKU:DRI0009)',
  init: function() {
    this.setColour(190);
	this.setInputsInline(false) ; 
    this.appendDummyInput()
        .appendField("DFRobot Shield w Speed")
        .appendField(new Blockly.FieldImage("http://image.dfrobot.com/image/cache/data/DRI0009/53AU4096-900x600.jpg", 64, 64))
	this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["Stop", "stop"], ["Forward", "forward"], ["Right", "right"], ["Left", "left"], ["Backward", "backward"]]), "DIRECTION");
   this.setInputsInline(true) ;
   this.appendValueInput("SPEEDA", 'Number')
       .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedL")
	this.appendValueInput("SPEEDB", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SpeedR")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('DFRobot A&B Motors PWM Mode & Speed');
  }
};