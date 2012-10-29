//http://www.seeedstudio.com/wiki/GROVE_System
//http://www.seeedstudio.com/depot/index.php?main_page=advanced_search_result&search_in_description=1&keyword=grovefamily
//support starter bundle example http://www.seeedstudio.com/wiki/GROVE_-_Starter_Kit_V1.1b

/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
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
 * @fileoverview Helper functions for generating seeeduino grove blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */

// define blocks
if (!Blockly.Language) Blockly.Language = {};

Blockly.Language.grove_led = {
  category: 'Grove',
  helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#LED',
  init: function() {
    this.setColour(190);
    this.appendDummyInput("")
	    .appendTitle("LED")
        .appendTitle(new Blockly.FieldImage("http://www.seeedstudio.com/wiki/images/thumb/e/e0/LED1.jpg/400px-LED1.jpg", 64, 64))
	    .appendTitle("PIN#")
	    .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")
		.appendTitle("stat")
	    .appendTitle(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT"); 
	this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('green LED');
  }
};

Blockly.Language.grove_button = {
  category: 'Grove',
  helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Button',
  init: function() {
    this.setColour(190);
    this.appendDummyInput("")
	    .appendTitle("Button")
        .appendTitle(new Blockly.FieldImage("http://www.seeedstudio.com/wiki/images/thumb/9/93/Button1.jpg/400px-Button1.jpg", 64, 64))
		.appendTitle("PIN#")
	    .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setOutput(true, Boolean);
    this.setTooltip('Basic digital input');
  }
};

Blockly.Language.grove_rotary_angle = {
  category: 'Grove',
  helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Potentiometer',
  init: function() {
    this.setColour(10);
    this.appendDummyInput("")
	    .appendTitle("Rotary Angle")
        .appendTitle(new Blockly.FieldImage("http://www.seeedstudio.com/wiki/images/thumb/5/59/Potentiometer1.jpg/400px-Potentiometer1.jpg", 64, 64))
		.appendTitle("PIN#")
	    .appendTitle(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.setOutput(true, Number);
    this.setTooltip('Analog output between 0 and Vcc');
  }
};

Blockly.Language.grove_tilt_switch = {
  category: 'Grove',
  helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Tilt_switch',
  init: function() {
    this.setColour(190);
    this.appendDummyInput("")
	    .appendTitle("Tilt Switch")
	    .appendTitle(new Blockly.FieldImage("http://www.seeedstudio.com/wiki/images/thumb/9/95/Tilt1.jpg/400px-Tilt1.jpg", 64, 64))
		.appendTitle("PIN#")
	    .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN");
	this.setOutput(true, Boolean);
    this.setTooltip('When the switch is level it is open, and when tilted, the switch closes.');
  }
};

Blockly.Language.grove_piezo_buzzer = {
  category: 'Grove',
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(190);
    this.appendDummyInput("")
	    .appendTitle("Piezo Buzzer")
	    .appendTitle(new Blockly.FieldImage("http://www.seeedstudio.com/wiki/images/thumb/e/ed/Buzzer1.jpg/400px-Buzzer1.jpg", 64, 64))
		.appendTitle("PIN#")
	    .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")
	    .appendTitle("stat")
	    .appendTitle(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");    
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
  }
};

Blockly.Language.grove_relay = {
  category: 'Grove',
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(190);
    this.appendDummyInput("")
	    .appendTitle("Relay")
	    .appendTitle(new Blockly.FieldImage("http://www.seeedstudio.com/wiki/images/thumb/0/04/Twig-Relay1.jpg/400px-Twig-Relay1.jpg", 64, 64))
		.appendTitle("PIN#")
	    .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")
	    .appendTitle("stat")
	    .appendTitle(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");    
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('capable of switching a much higher voltages and currents. The maximum voltage and current that can be controlled by this module upto 250V at 10 amps.');
  }
};

Blockly.Language.grove_temporature_sensor = {
  category: 'Grove',
  helpUrl: 'http://www.seeedstudio.com/wiki/Project_Seven_-_Temperature',
  init: function() {
    this.setColour(10);
    this.appendDummyInput("")
	    .appendTitle("Temporature Sensor")
	    .appendTitle(new Blockly.FieldImage("http://www.seeedstudio.com/wiki/images/thumb/b/b0/Temperature1.jpg/400px-Temperature1.jpg", 64, 64))
		.appendTitle("PIN#")
	    .appendTitle(new Blockly.FieldDropdown(profile.default.analog), "PIN")
    this.setOutput(true, Number);
    this.setTooltip('return number of ambient temperature in ℃');
  }
};

Blockly.Language.grove_serial_lcd_print = {
  category: 'Grove_LCD',
  helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Serial_LCD',
  init: function() {
    this.setColour(190);
    this.appendDummyInput("")
      .appendTitle("Serial LCD")
      .appendTitle(new Blockly.FieldImage("http://www.seeedstudio.com/wiki/images/thumb/6/6a/LCD1.jpg/400px-LCD1.jpg", 64, 64))
      .appendTitle("PIN#")
      .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendDummyInput("")
      .appendTitle("print line1")
      .setAlign(Blockly.ALIGN_RIGHT)
      //.appendTitle(new Blockly.FieldDropdown([["1", "1"], ["2", "2"]]), "LINE")
      .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote0.png', 12, 12))
      .appendTitle(new Blockly.FieldTextInput(''), 'TEXT')
      .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote1.png', 12, 12));
    this.appendDummyInput("")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendTitle("print line2")
      .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote0.png', 12, 12))
      .appendTitle(new Blockly.FieldTextInput(''), 'TEXT2')
      .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote1.png', 12, 12));
    this.appendValueInput("DELAY_TIME", Number)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendTitle("Delay");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('print text on an 16 character by 2 line LCD.');
  }
};

//grove lcd power on/off
Blockly.Language.grove_serial_lcd_power = {
  category: 'Grove_LCD',
  helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#LED',
  init: function() {
    this.setColour(190);
    this.appendDummyInput("")
      .appendTitle("Serial LCD")
      .appendTitle(new Blockly.FieldImage("http://www.seeedstudio.com/wiki/images/thumb/6/6a/LCD1.jpg/400px-LCD1.jpg", 64, 64))
      .appendTitle("PIN#")
      .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.appendDummyInput("")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendTitle("Power")
      .appendTitle(new Blockly.FieldDropdown([["ON", "ON"], ["OFF", "OFF"]]), "STAT"); 
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Turn LCD power on/off');
  }
};

//scroll left/right/no scroll/blink/noblink
/*Blockly.Language.grove_serial_lcd_effect = {

};*/

//http://www.seeedstudio.com/wiki/File:Twig-Temp%26Humi.jpg
//http://www.seeedstudio.com/wiki/Grove-_Temperature_and_Humidity_Sensor

//http://www.seeedstudio.com/wiki/images/thumb/f/fd/Twig-PIR_Motion_Sensor.jpg/200px-Twig-PIR_Motion_Sensor.jpg
//http://www.seeedstudio.com/wiki/Grove_-_PIR_Motion_Sensor

//http://www.seeedstudio.com/wiki/images/thumb/e/e0/Twig_-_Thumb_Joystick_v0.9b.jpg/200px-Twig_-_Thumb_Joystick_v0.9b.jpg
//http://www.seeedstudio.com/wiki/Grove_-_Thumb_Joystick

//http://www.seeedstudio.com/wiki/images/thumb/b/b0/Twig_-_Ultrasonic_Ranger2.jpg/200px-Twig_-_Ultrasonic_Ranger2.jpg
//http://www.seeedstudio.com/wiki/Grove_-_Ultrasonic_Ranger

//http://www.seeedstudio.com/wiki/File:Grove_-_125KHz_RFID_Reader.jpg
//http://www.seeedstudio.com/wiki/Grove_-_125KHz_RFID_Reader

/*
void setup()
{
	pinMode( 3 , OUTPUT);
	pinMode( 1 , INPUT);
}

void loop()
{
	if (digitalRead( 1))
	{
		digitalWrite( 3 , HIGH);
	}
	else
	{
		digitalWrite( 1 , LOW);
	}
}
*/
// define generators
Blockly.Arduino = Blockly.Generator.get('Arduino');

Blockly.Arduino.grove_led = function() {
  var dropdown_pin = this.getTitleValue('PIN');
  var dropdown_stat = this.getTitleValue('STAT');
  Blockly.Arduino.setups_['setup_green_led_'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
  var code = 'digitalWrite('+dropdown_pin+','+dropdown_stat+');\n'
  return code;
};

Blockly.Arduino.grove_button = function() {
  //var value_pin = Blockly.Arduino.valueToCode(this, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
  //value_pin = value_pin.replace('(','').replace(')','');
  var dropdown_pin = this.getTitleValue('PIN');
  // TODO: Assemble Dart into code variable.
  //Blockly.Arduino.setups_['setup_button'] = 'pinMode( '+value_pin+' , INPUT);';
  Blockly.Arduino.setups_['setup_button_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  //var code = 'digitalRead('+value_pin+')'
  var code = 'digitalRead('+dropdown_pin+')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.grove_rotary_angle = function() {
  var dropdown_pin = this.getTitleValue('PIN');
  //Blockly.Arduino.setups_['setup_potentiometer_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'analogRead('+dropdown_pin+')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.grove_tilt_switch = function() {
  var dropdown_pin = this.getTitleValue('PIN');
  Blockly.Arduino.setups_['setup_tilt_switch_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'digitalRead('+dropdown_pin+')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/*
int buttonPin = 1; 
int buzzerPin = 2; 

char notes[] = "cdefgabC "; // a space represents a rest 
const int length = sizeof(notes); // the number of notes
int beats[length] = { 1,1,1,1,1,1,1,1,1}; 

int tempo = 300; 

void playTone(int tone, int duration) { 
  for (long i = 0; i < duration * 1000L; i += tone * 2) { 
    digitalWrite(buzzerPin, HIGH); 
    delayMicroseconds(tone); 
    digitalWrite(buzzerPin, LOW); 
    delayMicroseconds(tone); 
  }
} 

void playNote(char note, int duration) { 
  char names[] = { 'c', 'd', 'e', 'f', 'g', 'a', 'b', 'C'}; 
  int tones[] = { 1915, 1700, 1519, 1432, 1275, 1136, 1014, 956 }; 

  // play the tone corresponding to the note name 
  for (int i = 0; i < length; i++) {
    if (names[i] == note) { 
      playTone(tones[i], duration); 
    }
  }
}

void setup() { 
  pinMode(buzzerPin, OUTPUT); 
  pinMode(buttonPin,INPUT); 
} 

void loop() { 
  if(digitalRead(buttonPin)) 
  { 
  for (int i = 0; i < length; i++) { 
    if (notes[i] == ' ') { 
      delay(beats[i] * tempo); // rest 
    } else { 
      playNote(notes[i], beats[i] * tempo); 
    } 

    // pause between notes 
    delay(tempo / 20);  
  } 
  } 
}  
*/
Blockly.Arduino.grove_piezo_buzzer = function() {
  var dropdown_pin = this.getTitleValue('PIN');
  var dropdown_stat = this.getTitleValue('STAT');
  Blockly.Arduino.setups_['setup_piezo_buzzer_'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
  var code = 'digitalWrite('+dropdown_pin+','+dropdown_stat+');\n'
  return code;
};

Blockly.Arduino.grove_relay = function() {
  var dropdown_pin = this.getTitleValue('PIN');
  var dropdown_stat = this.getTitleValue('STAT');
  Blockly.Arduino.setups_['setup_relay_'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
  var code = 'digitalWrite('+dropdown_pin+','+dropdown_stat+');\n'
  return code;
};

Blockly.Arduino.grove_temporature_sensor = function() {
	var dropdown_pin = this.getTitleValue('PIN');
	/*
	a=analogRead(0);
	  resistance=(float)(1023-a)*10000/a; 
	  temperature=1/(log(resistance/10000)/B+1/298.15)-273.15;
	*/
  //Blockly.Arduino.definitions_['define_'+dropdown_pin] = 'int a;\n';
  var code = 'round('+'(1/(log((float)(1023-analogRead('+dropdown_pin+'))*10000/analogRead('+dropdown_pin+'))/10000)/3975+1/298.15)-273.15'+')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/*
#include <SerialLCD.h> 
#include <SoftwareSerial.h> //this is a must 
SerialLCD slcd(11,12);//this is a must, assign soft serial pins 

void setup() 
{
  slcd.begin();// set up : 
} 

void loop() 
{ 
  slcd.backlight();// Turn on the backlight: //noBacklight
  slcd.setCursor(0,0); // set the cursor to (0,0): 
  slcd.print("  Seeed Studio"); // Print a message to the LCD. 
  slcd.setCursor(0,1); //line 2
  slcd.print("   Starter kit   ");  
  delay(5000);
  //slcd.scrollDisplayLeft();//scrollDisplayRight/autoscroll/
  //slcd.clear(); 
  //Power/noPower
} 
*/

var _get_next_pin = function(dropdown_pin) {
  var NextPIN = dropdown_pin;
  if(parseInt(NextPIN)){
    NextPIN = parseInt(dropdown_pin)+1;
  } else {
    NextPIN = 'A'+(parseInt(NextPIN.slice(1,NextPIN.length))+1);
  }
  //check if NextPIN in bound
  var pinlen = profile.default.digital.length;
  var notExist=true;
  for(var i=0;i<pinlen;i++){
    if(profile.default.digital[i][1] == NextPIN){
      notExist=false;
    } 
  }
  if(notExist){
    alert("Serial LCD needs PIN#+1 port, current setting is out of bound.");
    return null;
  } else {
    return NextPIN;
  }
}

Blockly.Arduino.grove_serial_lcd_print = function() {
  var dropdown_pin = this.getTitleValue('PIN');
  var text = Blockly.Arduino.quote_(this.getTitleValue('TEXT'));
  var text2 = Blockly.Arduino.quote_(this.getTitleValue('TEXT2'));
  var delay_time = Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000'

  /*if(text.length>16||text2.length>16){
      alert("string is too long");
  }*/
  Blockly.Arduino.definitions_['define_lcd'] = '#include <SerialLCD.h>\n#include <SoftwareSerial.h>\n';
  //generate PIN#+1 port
  var NextPIN = _get_next_pin(dropdown_pin);

  Blockly.Arduino.definitions_['var_lcd'+dropdown_pin] = 'SerialLCD slcd_'+dropdown_pin+'('+dropdown_pin+','+NextPIN+');\n';
  
  Blockly.Arduino.setups_['setup_lcd_'+dropdown_pin] = 'slcd_'+dropdown_pin+'.begin();\n';
  var code = 'slcd_'+dropdown_pin+'.backlight();\n';
  code    += 'slcd_'+dropdown_pin+'.setCursor(0,0);\n';
  code    += 'slcd_'+dropdown_pin+'.print(\"'+text.replace(new RegExp('\'',"gm"),'')+'\");\n';
  code    += 'slcd_'+dropdown_pin+'.setCursor(0,1);\n';
  code    += 'slcd_'+dropdown_pin+'.print(\"'+text2.replace(new RegExp('\'',"gm"),'')+'\");\n';
  code    += 'delay('+delay_time+');\n';
  return code;
};

Blockly.Arduino.grove_serial_lcd_power = function() {
  var dropdown_pin = this.getTitleValue('PIN');
  var dropdown_stat = this.getTitleValue('STAT');

  Blockly.Arduino.definitions_['define_lcd'] = '#include <SerialLCD.h>\n#include <SoftwareSerial.h>\n';
  //generate PIN#+1 port
  var NextPIN = _get_next_pin(dropdown_pin);

  Blockly.Arduino.definitions_['var_lcd'+dropdown_pin] = 'SerialLCD slcd_'+dropdown_pin+'('+dropdown_pin+','+NextPIN+');\n';
  var code = 'slcd_'+dropdown_pin;
  if(dropdown_stat==="ON"){
    code += '.Power();\n';
  } else {
    code += '.noPower();\n';
  }
  return code;
};
