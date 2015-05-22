/**
 * @author Jesús Lens Costa
 */
 

goog.provide('Blockly.Blocks.sensores');

goog.require('Blockly.Blocks');

// Boton
Blockly.Blocks['button'] = {
		helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Button',
		init: function() {
		    this.setColour(70);
		    this.appendDummyInput("")
		        .appendTitle("Pulsar Boton")
		        .appendTitle(new Blockly.FieldImage("../../media/push.png", 94, 84))
		        .appendTitle("PIN#")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN");
		    this.setOutput(true, 'Boolean');
		    this.setTooltip('Entrada digital basica');
		}					  
};


// Sensor Ultrasonidos 
Blockly.Blocks['ultrasonic_ranger'] = {
    helpUrl: '',
    init: function() {
      this.setColour(70);
      this.appendDummyInput("")
  	    .appendTitle("Distancia por Ultrasonidos    ")
  	    .appendTitle("ECHO PIN#")
        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "ECHO")
      this.appendDummyInput("")   
      	.appendTitle(new Blockly.FieldImage("../../media/sonic.jpg", 94, 94))
      	.setAlign(Blockly.ALIGN_RIGHT)
	    .appendTitle("       TRIGGER PIN#")
        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "TRIGGER");      
      this.setOutput(true, 'Number');
      this.setTooltip('Mide la distanca hasta un obstaculo en centimetros');
    }
};


// Sensor de movimiento
Blockly.Blocks['sensor_movimiento'] = {
		helpUrl: 'http://www.seeedstudio.com/wiki/Grove_-_PIR_Motion_Sensor',
		init: function() {
		    this.setColour(70);
		    this.appendDummyInput("")
		        .appendTitle("Detecta Movimiento")
		        .appendTitle(new Blockly.FieldImage("../../media/PIR.png", 94, 94))
		        .appendTitle("PIN#")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")
		    this.setOutput(true, 'Boolean');
		    this.setTooltip('Cuando alguien se mueve en el angulo que esta detectando, la salida del sensor esta en ALTA.');
		}				  
};


// Sigue lineas - infrarojo
Blockly.Blocks['sigue_lineas'] = {
		  helpUrl: 'http://www.seeedstudio.com/wiki/Grove_-_Line_Finder',
		  init: function() {
		    this.setColour(70);
		    this.appendDummyInput("")
		        .appendTitle("Sigue Lineas")
		        .appendTitle(new Blockly.FieldImage("../../media/siguelineas.png", 134, 94))
			    .appendTitle("PIN#")
			    .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN");
		    this.setOutput(true, 'Boolean');
		    this.setTooltip('Devolvera 1 cuando se detecta linea blanca, y 0 cuando se detecta linea negra');
		  }
};


// Sensor de luz
Blockly.Blocks['sensor_luz'] = {
		  helpUrl: 'http://www.seeedstudio.com/wiki/Project_Seven_-_Temperature',
		  init: function() {
		    this.setColour(340);
		    this.appendDummyInput("")
		        .appendTitle("Sensor de Luz")
		        .appendTitle(new Blockly.FieldImage("../../media/fotorresistencia.png", 94, 74))
		        .appendTitle("PIN#")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.analog), "PIN")
		    this.setOutput(true, 'Number');
		    this.setTooltip('Indica la intensidad de luz');
		  }
};


// Sensor Temperatura
Blockly.Blocks['sensor_temperatura'] = {
		  helpUrl: 'http://www.seeedstudio.com/wiki/Project_Seven_-_Temperature',
		  init: function() {
		    this.setColour(340);
		    this.appendDummyInput("")
		        .appendTitle("Temperatura")
		        .appendTitle(new Blockly.FieldImage("../../media/temperatura.png", 94, 84))
		        .appendTitle("PIN#")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.analog), "PIN")
		    this.setOutput(true, 'Number');
		    this.setTooltip('Indica la temperatura en â„ƒ');
		  }
};


// Potenciometro
Blockly.Blocks['potenciometro'] = {
		  helpUrl: '',
		  init: function() {
		    this.setColour(340);
		    this.appendDummyInput("")
		        .appendTitle("Potenciometro")
		        .appendTitle(new Blockly.FieldImage("../../media/potenciometro.png", 94, 74))
		        .appendTitle("PIN#")
		        .appendTitle(new Blockly.FieldDropdown(profile.default.analog), "PIN")
		    this.setOutput(true, 'Number');
		    this.setTooltip('Cambia la intensidad de la corriente');
		  }
};


// Leer pin digital
Blockly.Blocks['digital_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalRead',
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
	      .appendField("Leer pin digital PIN#")
	      .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN");
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
  }
};


// Leer pin analogico
Blockly.Blocks['analog_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogRead',
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .appendField("Leer pin analogico PIN#")
        .appendField(new Blockly.FieldDropdown(profile.default.analog), "PIN");
    this.setOutput(true, 'Number');
    this.setTooltip('Devuelve un valor entre 0 y 1024');
  }
};