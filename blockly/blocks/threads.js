/**
*@author Jesús Lens Costa
*/

'use strict';


goog.provide('Blockly.Blocks.threads');


goog.require('Blockly.Blocks');


//Controlador Threads
Blockly.Blocks['thread_Controller'] = {
		  helpUrl: '',		  
		  init: function() {
			    this.setColour(110);
			    this.appendDummyInput("")
			        .appendTitle("Thread Controlador ")
			        .appendTitle(new Blockly.FieldTextInput('controller'), 'TEXT')		        
			    this.appendStatementInput('DO')
			        .appendTitle("hilos")		
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Crea un controlador de hilos');
		  }
};


//Thread
Blockly.Blocks['thread'] = {
		  helpUrl: '',		  
		  init: function() {
			    this.setColour(150);
			    this.appendDummyInput("HILO")
			        .appendTitle("Thread  ")   
			        .appendTitle(new Blockly.FieldTextInput('hilo'), 'TEXT');
			    this.appendValueInput('STAT', 'Number')
			    	.setAlign(Blockly.ALIGN_RIGHT)
			    	.appendTitle("Intervalo [ms]")
			    	.setCheck('Number');
			    this.appendStatementInput('BLOQ')
			        .appendTitle("hacer");
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Crea un hilo');
		  }
};


//Thread shouldRun
Blockly.Blocks['shouldRun'] = {
		  helpUrl: '',
		  init: function() {
		    this.setColour(150);
		    this.appendDummyInput("")
		        .appendTitle("Deberia Ejecutarse Thread ")
		        .appendTitle(new Blockly.FieldTextInput('nombre'), 'TEXT')
			    //.appendTitle(new Blockly.FieldTextInput('0', Blockly.Language.math_number.validator), 'NUMT')
		    this.setOutput(true, 'Boolean');
		    this.setTooltip('Indica si el thread deberia ejecutarse');
		  }
};


//Thread Run
Blockly.Blocks['thread_run'] = {
		  helpUrl: '',
		  init: function() {
		    this.setColour(150);
		    this.appendDummyInput("")
		        .appendTitle("Ejecutar Thread")
		        .appendTitle(new Blockly.FieldTextInput('nombre'), 'TEXT')
			this.setPreviousStatement(true);
			this.setNextStatement(true);
		    this.setTooltip('Ejecuta el thread');
		  }
};


//Thread setInterval
Blockly.Blocks['setInterval'] = {
		  helpUrl: '',
		  init: function() {
		    this.setColour(150);
		    this.appendDummyInput("")
		        .appendTitle("Asignar Intervalo Thread")
		        .appendTitle(new Blockly.FieldTextInput('nombre'), 'TEXT')
		    this.appendValueInput('STAT', 'Number')
			    .setAlign(Blockly.ALIGN_RIGHT)
			    .appendTitle("Intervalo [ms]")
			    .setCheck('Number')    
			this.setPreviousStatement(true);
			this.setNextStatement(true);
		    this.setTooltip('Estable el tiempo de espera del thread');
		  }
};



//Controller add thread
Blockly.Blocks['controller_addT'] = {
		  helpUrl: '',		  
		  init: function() {
			    this.setColour(110);
			    this.appendDummyInput("")
			        .appendTitle("A\u00f1adir Thread")			        
			        .appendTitle(new Blockly.FieldTextInput('nombre'), 'NUMT')
		        	.setAlign(Blockly.ALIGN_RIGHT)
		        	.appendTitle(" a Controlador")
		        	.appendTitle(new Blockly.FieldTextInput('nombre'), 'NUMC');
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Asocia el thread o controlador al controlador');
		  }
};


//Controller add controller
Blockly.Blocks['controller_addC'] = {
		  helpUrl: '',		  
		  init: function() {
			    this.setColour(110);
			    this.appendDummyInput("")
			        .appendTitle("add    Controlador")			        
			        .appendTitle(new Blockly.FieldTextInput('name'), 'NUMT')
		        	.setAlign(Blockly.ALIGN_RIGHT)
		        	.appendTitle(" a Controlador")
		        	.appendTitle(new Blockly.FieldTextInput('name'), 'NUMC');
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Asocia el thread al controlador');
		  }
};


//Controller revome
Blockly.Blocks['controller_remove'] = {
		  helpUrl: '',		  
		  init: function() {
			    this.setColour(110);
			    this.appendDummyInput("")
			        .appendTitle("Eliminar Thread")			        
			        .appendTitle(new Blockly.FieldTextInput('nombre'), 'NUMT')
		        	.setAlign(Blockly.ALIGN_RIGHT)
		        	.appendTitle(" del Controlador")
		        	.appendTitle(new Blockly.FieldTextInput('nombre'), 'NUMC');
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Elimina el thread del controlador que lo contiene');
		  }
};


//Controller clear
Blockly.Blocks['controller_clear'] = {
		  helpUrl: '',		  
		  init: function() {
			    this.setColour(110);
			    this.appendDummyInput("")
			        .appendTitle("Limpiar Controlador")			        
			        .appendTitle(new Blockly.FieldTextInput('nombre'), 'NUMT')
			    this.setPreviousStatement(true, null);
			    this.setNextStatement(true, null);
			    this.setTooltip('Borra todos los hilos del controlador');
		  }
};


//Controller size
Blockly.Blocks['thread_size'] = {
		  helpUrl: '',
		  init: function() {
		    this.setColour(110);
		    this.appendDummyInput("")
		        .appendTitle("Numero de Threads del Controlador ")
		        .appendTitle(new Blockly.FieldTextInput('nombre'), 'TEXT')
		    this.setOutput(true, 'Number');
		    this.setTooltip('Devuelve la cantidad de threads del controlador');
		  }
};



//Inicio Programa
Blockly.Blocks['inicio'] = {
		  helpUrl: '',		  
		  init: function() {
			    this.setColour(270);
			    this.appendDummyInput("HILO")
			        .appendField("Inicio  Programa      ") 
			        .appendTitle(new Blockly.FieldImage("../../media/inicio.png", 44, 24))
			        .appendField("      ")
			    this.appendStatementInput('BLOQ');
			    this.setTooltip('Inicio de un programa');
		  }
};
