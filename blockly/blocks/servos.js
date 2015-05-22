/**
 * @author Jesús Lens Costa
 */

'use strict';

goog.provide('Blockly.Blocks.servos');

goog.require('Blockly.Blocks');

// Servo rotacion Continua
Blockly.Blocks['servo_continua'] = {
		  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',		  
		  init: function() {
			    this.setColour(230);
			    this.appendDummyInput("")
			        .appendTitle("Servo Rotacion Continua")	
			        .appendTitle(new Blockly.FieldImage("../../media/servocontinua.png", 94, 74))			       
			        .appendTitle("PIN#")
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")	
			    this.appendDummyInput("")  
			    	.setAlign(Blockly.ALIGN_RIGHT)
			    	.appendTitle("Girar en sentido ")	
			        .appendTitle(new Blockly.FieldDropdown([["Horario", "Horario"], ["AntiHorario", "AntiHorario"], ["Detener", "Detener"]]), 'SENTIDO')
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Hace girar el servo');
		  }
};

// Servo mover x grados
Blockly.Blocks['servo_move'] = {
  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
  init: function() {
	    this.setColour(230);
	    this.appendDummyInput("")
	        .appendTitle("Servo")
	        .appendTitle(new Blockly.FieldImage("../../media/servogrados.png", 94, 74))
	        .appendTitle("PIN#")    
	        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")
	    this.appendDummyInput("")  
		    .setAlign(Blockly.ALIGN_RIGHT)
		    .appendTitle("Grados a girar (0-180) ")	
		    .appendField(new Blockly.FieldTextInput('0', Blockly.FieldTextInput.numberValidator), 'GRADOS');   
	    this.setPreviousStatement(true, null);
	    this.setNextStatement(true, null);
	    this.setTooltip('Mueve el servo entre 0 y 180 grados');
	  }
};



// Servo Up
Blockly.Blocks['servo_up'] = {
		  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',		  
		  init: function() {
			    this.setColour(210);
			    this.appendDummyInput("")
			        .appendTitle("Adelante    ")	
			        .appendTitle(new Blockly.FieldImage("../../media/adelante.png", 74, 74))			       
			    this.appendDummyInput("")    
			    	.setAlign(Blockly.ALIGN_RIGHT)
			        .appendTitle("Servo Izquierda  PIN#")
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN1")	
			    this.appendDummyInput("")
			    	.setAlign(Blockly.ALIGN_RIGHT)
			        .appendTitle("Servo Derecha   PIN#")
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN2")
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Mueve los servos hacia adelante');
		}
};


// Servo Down
Blockly.Blocks['servo_down'] = {
		  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',		  
		  init: function() {
			    this.setColour(210);
			    this.appendDummyInput("")
			        .appendTitle("Atras         ")
			        .appendTitle(new Blockly.FieldImage("../../media/atras.png", 74, 74))
			    this.appendDummyInput("")   
			    	.setAlign(Blockly.ALIGN_RIGHT)
			        .appendTitle("Servo Izquierda  PIN#")
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN1")	
			    this.appendDummyInput("") 
			    	.setAlign(Blockly.ALIGN_RIGHT)
			        .appendTitle("Servo Derecha   PIN#")
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN2")		        
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Mueve los servos hacia atras');
		}
};


// Servo Left
Blockly.Blocks['servo_left'] = {
		  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',		  
		  init: function() {
			    this.setColour(210);
			    this.appendDummyInput("")
			        .appendTitle("Izquierda   ")
			        .appendTitle(new Blockly.FieldImage("../../media/izquierda.png", 74, 74))
			    this.appendDummyInput("")   
			    	.setAlign(Blockly.ALIGN_RIGHT)
			        .appendTitle("Servo Izquierda  PIN#")
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN1")    
			    this.appendDummyInput("")
			    	.setAlign(Blockly.ALIGN_RIGHT)
			        .appendTitle("Servo Derecha   PIN#")
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")		    		        			        
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Gira el robot hacia la izquierda');
		}
};


// Servo Right
Blockly.Blocks['servo_right'] = {
		  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',		  
		  init: function() {
			    this.setColour(210);
			    this.appendDummyInput("")
			        .appendTitle("Derecha    ")
			        .appendTitle(new Blockly.FieldImage("../../media/derecha.png", 74, 74))	
			    this.appendDummyInput("") 
			    	.setAlign(Blockly.ALIGN_RIGHT)
			        .appendTitle("Servo Izquierda  PIN#")
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")
			    this.appendDummyInput("")   
			    	.setAlign(Blockly.ALIGN_RIGHT)
			        .appendTitle("Servo Derecha   PIN#")
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN2")			        
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Gira el robot hacia la derecha');
		}
};


// Levantar brazos
Blockly.Blocks['levantar_brazos'] = {
		  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
		  init: function() {
			    this.setColour(190);
			    this.appendDummyInput("")
			        .appendTitle("Levantar Brazos")
			        .appendTitle(new Blockly.FieldImage("../../media/flecha_s.png", 94, 74))
			    this.appendDummyInput("")   
			    	.setAlign(Blockly.ALIGN_RIGHT)    
			        .appendTitle("Brazo Derecho   PIN#")    
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")
			    this.appendDummyInput("")   
			    	.setAlign(Blockly.ALIGN_RIGHT)    
			        .appendTitle("Brazo Izquierdo  PIN#")    
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN2")
			    this.appendDummyInput("")  
			    	.setAlign(Blockly.ALIGN_RIGHT)
			    	.appendTitle("Subir brazo ")	
			        .appendTitle(new Blockly.FieldDropdown([["Derecho", "DERECHO"], ["Izquierdo", "IZQUIERDO"], ["Ambos", "DOS"]]), 'BRAZO')			        
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Levanta los brazos del robot');
			}
};


// Bajar brazos
Blockly.Blocks['bajar_brazos'] = {
		  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
		  init: function() {
			    this.setColour(190);
			    this.appendDummyInput("")
			        .appendTitle("Bajar Brazos     ")
			        .appendTitle(new Blockly.FieldImage("../../media/flecha_b.png", 96, 74))
			    this.appendDummyInput("")   
			    	.setAlign(Blockly.ALIGN_RIGHT)    
			        .appendTitle("Brazo Derecho   PIN#")    
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN")
			    this.appendDummyInput("")   
			    	.setAlign(Blockly.ALIGN_RIGHT)    
			        .appendTitle("Brazo Izquierdo  PIN#")    
			        .appendTitle(new Blockly.FieldDropdown(profile.default.digital), "PIN2")
			    this.appendDummyInput("")  
			    	.setAlign(Blockly.ALIGN_RIGHT)
			    	.appendTitle("Bajar brazo ")	
			        .appendTitle(new Blockly.FieldDropdown([["Derecho", "DERECHO"], ["Izquierdo", "IZQUIERDO"], ["Ambos", "DOS"]]), 'BRAZO')			        
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Baja los brazos del robot');
			}
};


