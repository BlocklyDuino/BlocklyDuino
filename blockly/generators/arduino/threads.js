/**
* @author Jesús Lens Costa
*/

'use strict';

goog.provide('Blockly.Arduino.threads');

goog.require('Blockly.Arduino');


var names = [];
var cantidad = 0;

//Controlador Threads
Blockly.Arduino.thread_Controller = function() {
	  var count = this.getTitleValue('TEXT');
	  var branch = Blockly.Arduino.statementToCode(this, 'DO');
	 	 	  
	  Blockly.Arduino.definitions_['define_thread'] = '#include <Thread.h>';
	  Blockly.Arduino.definitions_['define_threadController'] = '#include <ThreadController.h>';
	  Blockly.Arduino.definitions_['var_controller'+count] = 'ThreadController '+count+' = ThreadController();\n';	  
	  
	  var index;
	  for(index = 0; index < names.length; index++) {
		  var text = names[index];
		  Blockly.Arduino.setups_['addT'+count+text] = count+'.add(&'+text+');\n';
	  }	
	  cantidad=0;
	  names = [];
	  
	  var code = count+'.run();\n';
	  return code;
};


//Thread
Blockly.Arduino.thread = function() {	  
	  var count = this.getTitleValue('TEXT');
	  var branch = Blockly.Arduino.statementToCode(this, 'BLOQ');
	  var interval = Blockly.Arduino.valueToCode(this, 'STAT', Blockly.Arduino.ORDER_ATOMIC) || '0';
	 	 
	  names[cantidad] = count;
	  cantidad++;
	  
	  Blockly.Arduino.definitions_['define_thread'] = '#include <Thread.h>';	  
	  Blockly.Arduino.definitions_['var_thread'+count] = 'Thread '+count+' = Thread();\n';
	  Blockly.Arduino.definitions_['void_'+count] = 'void bloque_'+count+'(){\n'+branch+'};\n';
	  Blockly.Arduino.setups_['thread1'+count] = count+'.setInterval('+interval+');';
	  Blockly.Arduino.setups_['thread2'+count] = count+'.onRun(bloque_'+count+');\n';	  
	  	
	  return '';
};


//Thread shouldRun
Blockly.Arduino.shouldRun = function() {
	  
	  var count = this.getTitleValue('TEXT');	 	  
	  
	  var code = count+'.shouldRun()';	
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


//Thread Run
Blockly.Arduino.thread_run = function() {
	  
	  var count = this.getTitleValue('TEXT');	 	  
	  
	  var code = count+'.run();';	
	  return code;
};


//Thread setInterval
Blockly.Arduino.setInterval = function() {
	  
	  var count = this.getTitleValue('TEXT');	 	  	  
	  var interval = Blockly.Arduino.valueToCode(this, 'STAT', Blockly.Arduino.ORDER_ATOMIC) || '0';
	  
	  return count+'.setInterval('+interval+');\n';
};




//Controller add thread
Blockly.Arduino.controller_addT = function() {
	  var countT = this.getTitleValue('NUMT');
	  var countC = this.getTitleValue('NUMC');
	  
	  Blockly.Arduino.setups_['addT'+countT] = countC+'.add(&'+countT+');\n';	
	  
	  return '';
};


//Controller add controller
Blockly.Arduino.controller_addC = function() {
	  var ccountT = this.getTitleValue('NUMT');
	  var ccountC = this.getTitleValue('NUMC');
	  
	  Blockly.Arduino.setups_['addC'+ccountT] = 'controller_'+ccountC+'.add(&controller_'+ccountT+');\n';	
	  
	  return '';
};


//Controller clear
Blockly.Arduino.controller_clear = function() {
	  var count = this.getTitleValue('NUMT');
	  
	  var code = count+'.clear();\n';	
	  
	  return code;
};


//Controller remove thread
Blockly.Arduino.controller_remove = function() {
	  var countT = this.getTitleValue('NUMT');
	  var countC = this.getTitleValue('NUMC');
	  
	  var code = countC+'.remove(&'+countT+');\n';	
	  
	  return code;
};


//Thread Size
Blockly.Arduino.thread_size = function() {
	  
	  var count = this.getTitleValue('TEXT');	 	  
	  
	  var code = count+'.size()';	
	  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


//Inicio Programa
Blockly.Arduino.inicio = function() {	  

	  var branch = Blockly.Arduino.statementToCode(this, 'BLOQ');
	 	 
	  Blockly.Arduino.TH = true;
	  
	  var contador = Blockly.Arduino.CONTADOR;
	  
	  Blockly.Arduino.definitions_['define_thread'] = '#include <Thread.h>';
	  Blockly.Arduino.definitions_['define_threadController'] = '#include <ThreadController.h>';
	  Blockly.Arduino.definitions_['var_controller'] = 'ThreadController controlador = ThreadController();\n';	  
	  Blockly.Arduino.definitions_['var_thread'+contador] = 'Thread programa'+contador+' = Thread();\n';
	  Blockly.Arduino.definitions_['void_'+contador] = 'void bloque_'+contador+'(){\n'+branch+'}\n';
	//  Blockly.Arduino.setups_['thread1'+count] = count+'.setInterval('+interval+');';
	  Blockly.Arduino.setups_['thread'+contador] = 'programa'+contador+'.onRun(bloque_'+contador+');\n';	  
	  
	  Blockly.Arduino.setups_['addPrograma'+contador] = 'controlador.add(&programa'+contador+');\n';
	  
	  Blockly.Arduino.CONTADOR++;
	  	
	  return '';
};
