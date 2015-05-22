/**
 * @author Jesús Lens Costa
 */

goog.provide('Blockly.Arduino.actuadores');

goog.require('Blockly.Arduino');

// LED
Blockly.Arduino.led = function() {
	var pin = this.getTitleValue('PIN');
	var stat = this.getTitleValue('STAT') || 'HIGH';

	Blockly.Arduino.setups_['setup_led_' + pin] = 'pinMode(' + pin + ', OUTPUT);';

	var code = 'digitalWrite(' + pin + ',' + stat + ');\n'
	return code;
};

// Bocina
Blockly.Arduino.bocina = function() {
	var pin = this.getTitleValue('PIN');
	var stat = this.getTitleValue('STAT') || 'HIGH';

	Blockly.Arduino.setups_['setup_bocina_' + pin] = 'pinMode(' + pin + ', OUTPUT);';

	var code = 'digitalWrite(' + pin + ',' + stat + ');\n'
	return code;
};

// Pantalla LCD
Blockly.Arduino.serial_LCD = function() {
	var rs = this.getFieldValue('RS');
	var Enable = this.getFieldValue('Enable');
	var D4 = this.getFieldValue('D4');
	var D5 = this.getFieldValue('D5');
	var D6 = this.getFieldValue('D6');
	var D7 = this.getFieldValue('D7');

	Blockly.Arduino.definitions_['define_seriallcd'] = '#include <LiquidCrystal.h>\n';
	Blockly.Arduino.definitions_['var_lcd_' + rs] = 'LiquidCrystal lcd(' + rs
			+ ',' + Enable + ',' + D4 + ',' + D5 + ',' + D6 + ',' + D7 + ');\n';

	Blockly.Arduino.setups_['setup_lcd_' + rs] = 'lcd.begin(16,2);';
	Blockly.Arduino.setups_['setup_lcd_clear'] = 'lcd.clear();\n';

	return '';
};

// Pantalla Imprimir
Blockly.Arduino.serial_lcd_print = function() {
	var linea = this.getFieldValue('LINE');
	var text = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_UNARY_POSTFIX) || '\'\'';
	var code = '';

	if (linea == 'ONE') {
		code = 'lcd.setCursor(0,0);\n';
	} else {
		code = 'lcd.setCursor(0,1);\n';
	}
	code += 'lcd.print(' + text + ');\n';

	return code;
};

// Pantalla Borrar
Blockly.Arduino.serial_lcd_borrar = function() {

	var code = 'lcd.clear();\n';
	return code;
};


// Motor DC
Blockly.Arduino.motor_DC = function() {
	  var dropdown_direction = this.getTitleValue('DIRECTION');
	  var dropdown_pin = this.getTitleValue('PIN1');
	  var dropdown_pin2 = this.getTitleValue('PIN2');
	  
	  Blockly.Arduino.setups_["setup_motor"+dropdown_pin] = 'pinMode('+dropdown_pin+',OUTPUT);\n';
	  Blockly.Arduino.setups_["setup_motor2"+dropdown_pin2] = 'pinMode('+dropdown_pin2+',OUTPUT);\n';
	  var code = "";
	  
	  if(dropdown_direction=="forward"){
		  code="digitalWrite("+dropdown_pin2+",LOW);\n" + "digitalWrite("+dropdown_pin+",HIGH);\n";
	  } else if (dropdown_direction=="backward"){
		  code="digitalWrite("+dropdown_pin+",LOW);\n" + "digitalWrite("+dropdown_pin2+",HIGH);\n";
	  } else if (dropdown_direction=="stop"){
		  code="digitalWrite("+dropdown_pin+",LOW);\n" + "digitalWrite("+dropdown_pin2+",LOW);\n";
	  }
	  return code;
};


// Controlador Motores
Blockly.Arduino.motor_Controller = function() {
	
	var activo1 = this.getTitleValue('OPTION1');
	var activo2 = this.getTitleValue('OPTION2');

	var I1 = this.getTitleValue('I1');
	var I2 = this.getTitleValue('I2');
	var EA = this.getTitleValue('EA');
	
	var I3 = this.getTitleValue('I3');
	var I4 = this.getTitleValue('I4');
	var EB = this.getTitleValue('EB');
	
	if(activo1 == "SI"){
		Blockly.Arduino.definitions_["define_Pins1"] = '#define EA '+EA+'\n#define I1 '+I1+'\n#define I2 '+I2+'\n';
		Blockly.Arduino.setups_["setup_Pins_EA"] = 'pinMode(EA,OUTPUT);';
		Blockly.Arduino.setups_["setup_Pins_I1"] = 'pinMode(I1,OUTPUT);';
		Blockly.Arduino.setups_["setup_Pins_I2"] = 'pinMode(I2,OUTPUT);\n';	
	}
	if(activo2 == "SI"){
		Blockly.Arduino.definitions_["define_Pins2"] = '#define EB '+EB+'\n#define I3 '+I3+'\n#define I4 '+I4+'\n';
		Blockly.Arduino.setups_["setup_Pins_EB"] = 'pinMode(EB,OUTPUT);';
		Blockly.Arduino.setups_["setup_Pins_I3"] = 'pinMode(I3,OUTPUT);';
		Blockly.Arduino.setups_["setup_Pins_I4"] = 'pinMode(I4,OUTPUT);\n';	
	}
	
	Blockly.Arduino.definitions_["define_adelante"] = 'void adelante(int motor, int velocidad){\n'+
		'  if(motor == 1){\n    analogWrite(EA, velocidad);\n    digitalWrite(I2, LOW);\n    digitalWrite(I1, HIGH);\n'+
		'  }\n  else if(motor == 2){\n    analogWrite(EB, velocidad);\n    digitalWrite(I4, LOW);\n    digitalWrite(I3, HIGH);\n  }\n}\n';
	Blockly.Arduino.definitions_["define_atras"] = 'void atras(int motor, int velocidad){\n'+
		'  if(motor == 1){\n    analogWrite(EA, velocidad);\n    digitalWrite(I1, LOW);\n    digitalWrite(I2, HIGH);\n'+
		'  }\n  else if(motor == 2){\n    analogWrite(EB, velocidad);\n    digitalWrite(I3, LOW);\n    digitalWrite(I4, HIGH);\n  }\n}\n';	
	Blockly.Arduino.definitions_["define_parar"] = 'void parar(int motor){\n'+
		'  if(motor == 1){\n    digitalWrite(I1, LOW);\n    digitalWrite(I2, LOW);\n'+
		'  }\n  else if(motor == 2){\n    digitalWrite(I3, LOW);\n    digitalWrite(I4, LOW);\n  }\n}\n';
	
	return '';
};

// Motor Adelante
Blockly.Arduino.motor_adelante = function() {
	var motor = this.getTitleValue('MOTOR');
	var velocidad = this.getTitleValue('VELOCIDAD');	
	
	return 'adelante('+motor+', '+velocidad+');\n';
};

// Motor Atras
Blockly.Arduino.motor_atras = function() {
	var motor = this.getTitleValue('MOTOR');
	var velocidad = this.getTitleValue('VELOCIDAD');	
	
	return 'atras('+motor+', '+velocidad+');\n';
};

// Motor Parar
Blockly.Arduino.motor_parar = function() {
	var motor = this.getTitleValue('MOTOR');	
	
	return 'parar('+motor+');\n';
};


// Esribir en pin digital
Blockly.Arduino.digital_write = function() {
	  var pin = this.getFieldValue('PIN');
	  var stat = this.getFieldValue('STAT');
	  
	  Blockly.Arduino.setups_['setup_output_' + pin] = 'pinMode(' + pin + ', OUTPUT);';
	  
	  var code = 'digitalWrite(' + pin + ', ' + stat + ');\n'
	  return code;
};


// Escribir en pin analogico
Blockly.Arduino.analog_write = function() {
	  var pin = this.getFieldValue('PIN');
	  var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_ATOMIC);
	  
	 // Blockly.Arduino.setups_['setup_output'+pin] = 'pinMode('+pin+', OUTPUT);';	  
	  var code = 'analogWrite(' + pin + ', ' + value_num + ');\n';
	  return code;
};


// Imprimir en puerto serie
Blockly.Arduino.serial_print = function() {
	  var contenido = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0';

	  Blockly.Arduino.setups_['setup_serial_' + profile.default.serial] = 'Serial.begin(' + profile.default.serial + ');\n';

	  var code = 'Serial.print(' + contenido + ');\nSerial.print("\\t");\n';
	  return code;
};
	

// HIGH-LOW
Blockly.Arduino.highlow = function() {

	  var code = (this.getFieldValue('BOOL') == 'HIGH') ? 'HIGH' : 'LOW';
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


// LED de placa
Blockly.Arduino.buildin_led = function() {
	  var stat = this.getFieldValue('STAT');
	 
	  Blockly.Arduino.setups_['setup_output_13'] = 'pinMode(13, OUTPUT);';
	
	  var code = 'digitalWrite(13, ' + stat + ');\n'
	  return code;
};


