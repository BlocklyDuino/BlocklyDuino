/**
 * @author Jesús Lens Costa
 */

goog.provide('Blockly.Arduino.sensores');

goog.require('Blockly.Arduino');

// Boton
Blockly.Arduino.button = function() {
	  var pin = this.getTitleValue('PIN');
	 
	  Blockly.Arduino.setups_['setup_button_'+pin] = 'pinMode('+ pin +', INPUT);';
	  
	  var code = 'digitalRead('+ pin +')';
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


// Sensor Ultrasonidos
Blockly.Arduino.ultrasonic_ranger = function() {
	  var echo = this.getTitleValue('ECHO');
	  var trigger = this.getTitleValue('TRIGGER');

	  Blockly.Arduino.definitions_['TP_init'] = 'long Medir(int trigger, int echo){\n'+
	  	'   digitalWrite(trigger, LOW);\n   delayMicroseconds(2);\n   digitalWrite(trigger, HIGH);\n'+
	  	'   delayMicroseconds(10);\n   digitalWrite(trigger, LOW);\n   long microsegundos = pulseIn(echo ,HIGH);\n'+
	  	'   return microsegundos;\n}\n';

	  Blockly.Arduino.definitions_['Distancia'] = 'long Distancia(int trigger, int echo){\n'+
	  	'   long microseconds = Medir(trigger, echo);\n   long distance;\n   distance = microseconds/29/2;\n'+
	  	'   if (distance == 0){\n      distance = 999;\n   }\n   return distance;\n}\n';	  
	  
	  Blockly.Arduino.setups_['setup_input_'+echo] = 'pinMode('+echo+', INPUT);';
	  Blockly.Arduino.setups_['setup_input_'+trigger] = 'pinMode('+trigger+', OUTPUT);';
	  
	  var code = 'Distancia('+trigger+', '+echo+')';

	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


// Sensor de movimiento
Blockly.Arduino.sensor_movimiento = function() {
	  var pin = this.getTitleValue('PIN');
	 
	  Blockly.Arduino.setups_['setup_input_'+pin] = 'pinMode('+ pin +', INPUT);';
	  
	  var code = 'digitalRead('+ pin +')';
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


// Sigue lineas - infrarojo
Blockly.Arduino.sigue_lineas = function() {
	  var pin = this.getTitleValue('PIN');
	 
	  Blockly.Arduino.setups_['setup_input_'+pin] = 'pinMode('+ pin +', INPUT);';
	 
	  var code = 'digitalRead('+ pin +')';
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


// Sensor de luz
Blockly.Arduino.sensor_luz = function() {
	  var pin = this.getTitleValue('PIN');

	  var code = 'analogRead('+ pin +')';
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


// Sensor Temperatura
Blockly.Arduino.sensor_temperatura = function() {
	  var pin = this.getFieldValue('PIN');
	  /*
	  a=analogRead(0);
	  resistance=(float)(1023-a)*10000/a;
	  temperature=1/(log(resistance/10000)/B+1/298.15)-273.15;
	  */
	  var code = 'round('+'(1/(log((float)(1023-analogRead('+ pin +'))*10000/analogRead('+ pin +'))/10000)/3975+1/298.15)-273.15'+')';
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
	

// Potenciometro
Blockly.Arduino.potenciometro = function() {
	  var pin = this.getTitleValue('PIN');

	  var code = 'analogRead('+ pin +')';
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


// Leer pin digital
Blockly.Arduino.digital_read = function() {
	  var pin = this.getFieldValue('PIN');
	  
	  Blockly.Arduino.setups_['setup_input_' + pin] = 'pinMode(' + pin + ', INPUT);';
	  
	  var code = 'digitalRead(' + pin + ')';
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


// Leer pin analogico
Blockly.Arduino.analog_read = function() {
	  var pin = this.getFieldValue('PIN');
	  //Blockly.Arduino.setups_['setup_input_'+pin] = 'pinMode('+pin+', INPUT);';
	  var code = 'analogRead(' + pin + ')';
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};