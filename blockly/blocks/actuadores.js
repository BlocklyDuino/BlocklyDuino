/**
 * @author Jesús Lens Costa
 */
 

goog.provide('Blockly.Blocks.actuadores');

goog.require('Blockly.Blocks');
 

// LED
Blockly.Blocks['led'] = {
	  helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#LED',
	  init: function() {
		  this.setColour(70);
		  this.appendDummyInput("")
		  	.appendTitle("LED")
	      	.appendTitle(new Blockly.FieldImage("../../media/led.png", 94, 94))
	      	.appendTitle("PIN#")
	      	.appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")
	      this.appendDummyInput("")
	   	  	.setAlign(Blockly.ALIGN_RIGHT)
	   	  	.appendTitle("Accion ")
	   	  	.appendTitle(new Blockly.FieldDropdown([["Encender", "HIGH"], ["Apagar", "LOW"]]), "STAT"); 
		  this.setPreviousStatement(true, null);
		  this.setNextStatement(true, null);
		  this.setTooltip('LED');
	  }
};


// Bocina
Blockly.Blocks['bocina'] = {
		helpUrl: 'http://www.seeedstudio.com/wiki/GROVE_-_Starter_Kit_V1.1b#Grove_.E2.80.93_Buzzer',
		init: function() {
		    this.setColour(70);
		    this.appendDummyInput("")
		        .appendTitle("Bocina")
		        .appendTitle(new Blockly.FieldImage("../../media/horn.png", 94, 74))
		        .appendTitle("PIN#")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")
		    this.appendDummyInput("")    
		        .setAlign(Blockly.ALIGN_RIGHT)
		        .appendTitle("Accion ")
		        .appendTitle(new Blockly.FieldDropdown([["Encender", "HIGH"], ["Apagar", "LOW"]]), "STAT");    
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setTooltip('Emite un tono cuando la salida esta en ALTA');
		}				  
};


//Pantalla LCD
Blockly.Blocks['serial_LCD'] = {
		  helpUrl: 'http://www.arduino.cc/en/Reference/LiquidCrystalConstructor',
		  init: function() {
		    this.setColour(70);
		    this.appendDummyInput("")
		        .appendTitle("Pantalla LCD   ")    
		        .appendTitle("PINES: ")
		        .appendTitle("RS")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "RS")
		        .appendTitle("   Enable")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "Enable")
		    this.appendDummyInput("")  
		    	.appendTitle(new Blockly.FieldImage("../../media/lcd.png", 94, 74))
		        .appendTitle(" D4")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "D4")
		        .appendTitle("D5")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "D5")
		        .appendTitle("D6")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "D6")
		        .appendTitle("D7")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "D7");
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setTooltip('Configura la pantalla.');
		  }
};


//Pantalla imprimir
Blockly.Blocks['serial_lcd_print'] = {
  helpUrl: '',
  init: function() {
    this.setColour(70);
    this.appendDummyInput("")
        .appendTitle("Pantalla LCD: Imprimir ")
        .appendTitle(new Blockly.FieldImage("../../media/lcd.png", 24, 18))
    this.appendValueInput("TEXT", 'String')    
        .appendTitle("Fila")
        .appendTitle(new Blockly.FieldDropdown([["1", "ONE"], ["2", "TWO"]]), "LINE") 
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendTitle("       Texto");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Imprime texto en la pantalla.');
  }
};


//Pantalla Borrar
Blockly.Blocks['serial_lcd_borrar'] = {
		  helpUrl: '',
		  init: function() {
		    this.setColour(70);
		    this.appendDummyInput("")
		        .appendTitle("Pantalla LCD: Borrar ")
		        .appendTitle(new Blockly.FieldImage("../../media/lcd.png", 24, 18));
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setTooltip('Borra el texto de la pantalla.');
		  }
};


//Motor DC
Blockly.Blocks['motor_DC'] = {
		  helpUrl: '',
		  init: function() {
		    this.setColour(220);
		    this.appendDummyInput("")
		        .appendTitle("Motor")
		        .appendTitle(new Blockly.FieldImage("../../media/motor.png", 94, 74))
		        .appendTitle(" ")
		        .appendTitle(new Blockly.FieldDropdown([["Parar", "stop"], ["Adelante", "forward"], ["Atras", "backward"]]), "DIRECTION")
		    this.appendDummyInput("")			    	
		        .appendTitle("PIN1#")
		    	.appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN1") 
		    	.setAlign(Blockly.ALIGN_RIGHT)
		    	.appendTitle("     ")
		    	.appendTitle("PIN2#")
		    	.appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN2"); 
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setTooltip('Motor de corriente continua DC');
		  }
};


//Controlador Motores
Blockly.Blocks['motor_Controller'] = {
		  helpUrl: 'http://robologs.net/2014/11/14/tutorial-de-arduino-controlador-de-motores-dual-h-bridge/',
		  init: function() {
		    this.setColour(220);   
		    this.appendDummyInput("")
		    	.appendTitle("Controlador Motores      ")
		    	.appendTitle(new Blockly.FieldImage("../../media/bridge.png", 94, 74))
		    this.appendDummyInput("")	
		    	.appendTitle("Motor A")
		    	.appendTitle(new Blockly.FieldDropdown([["Si", "SI"], ["No", "NO"]]), "OPTION1")
		    	.appendTitle(" I1")
		    	.appendTitle(new Blockly.FieldDropdown(profile.default.digital), "I1")
		    	.appendTitle("  I2")
		    	.appendTitle(new Blockly.FieldDropdown(profile.default.digital), "I2")
		    	.appendTitle("  EA")	
		    	.appendTitle(new Blockly.FieldDropdown(profile.default.analog), "EA")
		    this.appendDummyInput("")		    	
		    	.appendTitle("Motor B")	    	
		    	.appendTitle(new Blockly.FieldDropdown([["Si", "SI"], ["No", "NO"]]), "OPTION2")
		    	.appendTitle(" I3")
		    	.appendTitle(new Blockly.FieldDropdown(profile.default.digital), "I3")
		    	.appendTitle("  I4")
		    	.appendTitle(new Blockly.FieldDropdown(profile.default.digital), "I4")
		    	.appendTitle("  EB")
		    	.appendTitle(new Blockly.FieldDropdown(profile.default.analog), "EB")		    	
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setTooltip('Controlador de motores de corriente continua');
		  }
};

//Motor Adelante
Blockly.Blocks['motor_adelante'] = {
		  helpUrl: 'http://robologs.net/2014/11/14/tutorial-de-arduino-controlador-de-motores-dual-h-bridge/',
		  init: function() {
		    this.setColour(220);
		    this.appendDummyInput("")
		    	.appendTitle("Adelante   Motor")
		    	.appendTitle(new Blockly.FieldDropdown([["A", "1"], ["B", "2"]]), "MOTOR")
		        .appendTitle("  Velocidad [0-250] ")	
		        .appendField(new Blockly.FieldTextInput('100', Blockly.FieldTextInput.numberValidator), 'VELOCIDAD');		     
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setTooltip('Mueve el motor hacia adelante');
		  }
};

//Motor Atras
Blockly.Blocks['motor_atras'] = {
		  helpUrl: 'http://robologs.net/2014/11/14/tutorial-de-arduino-controlador-de-motores-dual-h-bridge/',
		  init: function() {
		    this.setColour(220);
		    this.appendDummyInput("")
		    	.appendTitle("Atras   Motor")
		    	.appendTitle(new Blockly.FieldDropdown([["A", "1"], ["B", "2"]]), "MOTOR")
		        .appendTitle("  Velocidad [0-250] ")	
		        .appendField(new Blockly.FieldTextInput('100', Blockly.FieldTextInput.numberValidator), 'VELOCIDAD');		     
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setTooltip('Mueve el motor hacia atras');
		  }
};

//Motor Parar
Blockly.Blocks['motor_parar'] = {
		  helpUrl: 'http://robologs.net/2014/11/14/tutorial-de-arduino-controlador-de-motores-dual-h-bridge/',
		  init: function() {
		    this.setColour(220);
		    this.appendDummyInput("")
		    	.appendTitle("Parar   Motor")
		    	.appendTitle(new Blockly.FieldDropdown([["A", "1"], ["B", "2"]]), "MOTOR")
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setTooltip('Detiene el motor');
		  }
};



// Esribir en pin digital
Blockly.Blocks['digital_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
	    .appendField("Poner pin Digital  PIN#")
	    .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
      	.appendField(" Estado")
      	.appendField(new Blockly.FieldDropdown([["ALTO", "HIGH"], ["BAJO", "LOW"]]), "STAT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Coloca el pin indicado en estado ALTO o BAJO');
  }
};


// Escribir en pin analogico
Blockly.Blocks['analog_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogWrite',
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .appendField("Poner pin analogico PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.appendValueInput("NUM", 'Number')
        .appendField(" valor")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Poner en el pin analogico un valor entre 0 y 255');
  }
};


// Imprimir en puerto serie
Blockly.Blocks['serial_print'] = {
  helpUrl: 'http://www.arduino.cc/en/Serial/Print',
  init: function() {
    this.setColour(20);
    this.appendValueInput("CONTENT", 'String')
        .appendField("Imprimir en puerto serie");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Imprimir datos en el puerto serie/consola.');
  }
};


// HIGH-LOW
Blockly.Blocks['highlow'] = {
  helpUrl: 'http://arduino.cc/en/Reference/Constants',
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["ALTO", "HIGH"], ["BAJO", "LOW"]]), 'BOOL')
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
  }
};


// LED de placa
Blockly.Blocks['buildin_led'] = {
   helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
   init: function() {
     this.setColour(20);
     this.appendDummyInput()
	       .appendField("LED de PLACA    Accion")
	       .appendField(new Blockly.FieldDropdown([["Encender", "HIGH"], ["Apagar", "LOW"]]), "STAT");
     this.setPreviousStatement(true, null);
     this.setNextStatement(true, null);
     this.setTooltip('Enciende o apaga el LED de la placa');
   }
};