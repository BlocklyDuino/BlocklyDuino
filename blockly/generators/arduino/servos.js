/**
 * @author Jesús Lens Costa
 */

'use strict';

goog.provide('Blockly.Arduino.servos');

goog.require('Blockly.Arduino');

// Servo rotacion Continua
Blockly.Arduino.servo_continua = function() {
	  var pin = this.getTitleValue('PIN');
	  var sentido = this.getTitleValue('SENTIDO');
	  var value_degree = '0';
	  if(sentido == "Horario"){
		  value_degree = '0';
	  }
	  else if(sentido == "AntiHorario"){
		  value_degree = '180';  
	  }
	  else{
		  value_degree = '90';
	  }
	  var delay_time = '30';
	  
	  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
	  Blockly.Arduino.definitions_['var_servo'+pin] = 'Servo servo_'+pin+';\n';
	  Blockly.Arduino.setups_['setup_servo_'+pin] = 'servo_'+pin+'.attach('+pin+');\n';	  
	  
	  var code = 'servo_'+pin+'.write('+value_degree+');\n'+'delay(' + delay_time + ');\n';
	  return code;
};


// Servo mover x grados
Blockly.Arduino.servo_move = function() {
	  var pin = this.getTitleValue('PIN');
	  var grados = this.getTitleValue('GRADOS');
	  var delay_time = '100';
	  
	  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
	  Blockly.Arduino.definitions_['var_servo'+pin] = 'Servo servo_'+pin+';\n';
	  Blockly.Arduino.setups_['setup_servo_'+pin] = 'servo_'+pin+'.attach('+pin+');\n';
	  
	  var code = 'servo_'+pin+'.write('+grados+');\n'+'delay(' + delay_time + ');\n';
	  return code;
};



// Servo Up
Blockly.Arduino.servo_up = function() {
	  var dropdown_pin = this.getTitleValue('PIN1');
	  var dropdown_pin2 = this.getTitleValue('PIN2');
	  var value_degree = '0';
	  var value_degree2 = '180';
	  var delay_time = '30';
	  
	  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
	  Blockly.Arduino.definitions_['var_servo'+dropdown_pin] = 'Servo servo_'+dropdown_pin+';\n';
	  Blockly.Arduino.definitions_['var_servo'+dropdown_pin2] = 'Servo servo_'+dropdown_pin2+';\n';
	  Blockly.Arduino.setups_['setup_servo_'+dropdown_pin] = 'servo_'+dropdown_pin+'.attach('+dropdown_pin+');\n';	  
	  Blockly.Arduino.setups_['setup_servo_'+dropdown_pin2] = 'servo_'+dropdown_pin2+'.attach('+dropdown_pin2+');\n';
	  
	  var code = 'servo_'+dropdown_pin+'.write('+value_degree+');\n'+'delay(' + delay_time + ');\n'+'servo_'+dropdown_pin2+'.write('+value_degree2+');\n'+'delay(' + delay_time + ');\n';
	  return code;
};


// Servo Down
Blockly.Arduino.servo_down = function() {
	  var dropdown_pin = this.getTitleValue('PIN1');
	  var dropdown_pin2 = this.getTitleValue('PIN2');
	  var value_degree = '180';
	  var value_degree2 = '0';
	  var delay_time = '30';
	  
	  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
	  Blockly.Arduino.definitions_['var_servo'+dropdown_pin] = 'Servo servo_'+dropdown_pin+';\n';
	  Blockly.Arduino.definitions_['var_servo'+dropdown_pin2] = 'Servo servo_'+dropdown_pin2+';\n';
	  Blockly.Arduino.setups_['setup_servo_'+dropdown_pin] = 'servo_'+dropdown_pin+'.attach('+dropdown_pin+');\n';	  
	  Blockly.Arduino.setups_['setup_servo_'+dropdown_pin2] = 'servo_'+dropdown_pin2+'.attach('+dropdown_pin2+');\n';
	  
	  var code = 'servo_'+dropdown_pin+'.write('+value_degree+');\n'+'delay(' + delay_time + ');\n'+'servo_'+dropdown_pin2+'.write('+value_degree2+');\n'+'delay(' + delay_time + ');\n';
	  return code;
};	


// Servo Left
Blockly.Arduino.servo_left = function() {
	var dropdown_pin = this.getTitleValue('PIN');
	var value_degree = '0';
	var delay_time = '30';
	
	Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
	Blockly.Arduino.definitions_['var_servo'+dropdown_pin] = 'Servo servo_'+dropdown_pin+';\n';
	Blockly.Arduino.setups_['setup_servo_'+dropdown_pin] = 'servo_'+dropdown_pin+'.attach('+dropdown_pin+');\n';	  
	
	var code = 'servo_'+dropdown_pin+'.write('+value_degree+');\n'+'delay(' + delay_time + ');\n';
	return code;
};


// Servo Right
Blockly.Arduino.servo_right = function() {
	  var dropdown_pin = this.getTitleValue('PIN');
	  var value_degree = '0';
	  var delay_time = '30';
	  
	  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
	  Blockly.Arduino.definitions_['var_servo'+dropdown_pin] = 'Servo servo_'+dropdown_pin+';\n';
	  Blockly.Arduino.setups_['setup_servo_'+dropdown_pin] = 'servo_'+dropdown_pin+'.attach('+dropdown_pin+');\n';	  
	  
	  var code = 'servo_'+dropdown_pin+'.write('+value_degree+');\n'+'delay(' + delay_time + ');\n';
	  return code;
};	


// Levantar brazos
Blockly.Arduino.levantar_brazos = function() {
	  var pin = this.getTitleValue('PIN');
	  var pin2 = this.getTitleValue('PIN2');
	  var sentido = this.getTitleValue('BRAZO');
	  var delay_time = '30';
	  
	  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
	  Blockly.Arduino.definitions_['var_servo'+pin] = 'Servo servo_'+pin+';\n';
	  Blockly.Arduino.setups_['setup_servo_'+pin] = 'servo_'+pin+'.attach('+pin+');\n';
	  Blockly.Arduino.definitions_['var_servo'+pin2] = 'Servo servo_'+pin2+';\n';
	  Blockly.Arduino.setups_['setup_servo_'+pin2] = 'servo_'+pin2+'.attach('+pin2+');\n';
	  
	  var code = '';
	  if(sentido == 'DERECHO'){
		  code = 'servo_'+pin+'.write(180);\n'+'delay(' + delay_time + ');\n';
	  }
	  else if(sentido == 'IZQUIERDO'){
		  code = 'servo_'+pin2+'.write(0);\n'+'delay(' + delay_time + ');\n';
	  }
	  else{
		  code = 'servo_'+pin+'.write(180);\n'+'delay(' + delay_time + ');\n'
		  	+'servo_'+pin2+'.write(0);\n'+'delay(' + delay_time + ');\n';
	  }

	  return code;
};


// Bajar brazos
Blockly.Arduino.bajar_brazos = function() {
	  var pin = this.getTitleValue('PIN');
	  var pin2 = this.getTitleValue('PIN2');
	  var sentido = this.getTitleValue('BRAZO');
	  var delay_time = '30';
	  
	  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
	  Blockly.Arduino.definitions_['var_servo'+pin] = 'Servo servo_'+pin+';\n';
	  Blockly.Arduino.setups_['setup_servo_'+pin] = 'servo_'+pin+'.attach('+pin+');\n';
	  Blockly.Arduino.definitions_['var_servo'+pin2] = 'Servo servo_'+pin2+';\n';
	  Blockly.Arduino.setups_['setup_servo_'+pin2] = 'servo_'+pin2+'.attach('+pin2+');\n';
	  
	  var code = '';
	  if(sentido == 'DERECHO'){
		  code = 'servo_'+pin+'.write(0);\n'+'delay(' + delay_time + ');\n';
	  }
	  else if(sentido == 'IZQUIERDO'){
		  code = 'servo_'+pin2+'.write(180);\n'+'delay(' + delay_time + ');\n';
	  }
	  else{
		  code = 'servo_'+pin+'.write(0);\n'+'delay(' + delay_time + ');\n'
		  	+'servo_'+pin2+'.write(180);\n'+'delay(' + delay_time + ');\n';
	  }

	  return code;
};


