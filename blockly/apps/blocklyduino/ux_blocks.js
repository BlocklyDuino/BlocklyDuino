/* Shared editor language, explanations and build feedback. */
(function () {
  'use strict';
  Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = 'function';
  Blockly.Msg.PROCEDURES_DEFRETURN_TITLE = 'function';
  Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE = 'doWork';
  Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE = 'calculate';
  var labels = {'Build-in LED Stat':'LED D13', 'DigitalWrite PIN#':'digital write', 'DigitalRead PIN#':'digital read', 'AnalogRead PIN#':'analog read', 'AnalogWrite PIN#':'PWM write', 'Stat':'state', 'Delay':'wait ms', 'Serial Print':'serial print', 'Map ':'map 0–1023', 'value to [0-':'to 0–', ']':''};
  var hints = {
    base_delay:'Wait this many milliseconds. Other code stops while waiting; use millis() timing when a stepper must keep running.',
    base_map:'Convert an analog reading from 0–1023 into 0–maximum, using integer arithmetic.',
    inout_buildin_led:'Switch the onboard LED connected to D13. HIGH is on; LOW is off.',
    inout_digital_write:'Write HIGH or LOW to a digital pin. For a named peripheral use its device action blocks.',
    inout_digital_read:'Read a digital input. A switch needs a pull-up or pull-down; floating inputs are unreliable.',
    inout_analog_read:'Read an analog input: 0–1023 on this Pro Mini. A4/A5 are also the I2C bus.',
    inout_analog_write:'Set PWM duty from 0 (off) to 255 (on). This is hardware PWM. Pin choices follow the board and exclude timers used by Servo, music, IR or Timer1 steppers. It changes duty cycle, not STEP pulse frequency.',
    serial_print:'Print a value followed by a new line. Defaults to 9600 baud; a serial baud block overrides it. Monitor and Plotter share the connection and pause automatically for upload.',
    math_modulo:'Integer remainder. The divisor must not be zero. Useful for cycling an array index from 0 to length−1.',
    math_arithmetic:'Add, subtract, multiply, divide or raise to a power. Division returns a fractional value; use an integer variable to truncate it.',
    math_trig:'Trigonometry in degrees: sin/cos/tan take degrees; inverse functions return degrees.',
    math_constrain:'Keep a value between lower and upper limits. Store sensor readings in a variable before using them here.',
    procedures_defnoreturn:'Define a reusable function. Click the gear to add arguments and choose their types; place its call block wherever it should run.',
    procedures_defreturn:'Define a function that returns a value. Choose the return type and connect a result. Click the gear to add typed arguments, such as float, uint32_t or String.',
    controls_for:'Count from start to end, inclusive, using a whole-number step. The loop automatically counts down when start is greater than end.',
    controls_whileUntil:'Repeat while/until a condition is met. A loop that never finishes prevents other work from running.'
  };
  Object.keys(hints).forEach(function(type) {
    var definition=Blockly.Blocks[type]; if(!definition)return;
    var init=definition.init;
    definition.init=function(){
      init.call(this);
      this.inputList.forEach(function(input){input.fieldRow.forEach(function(field){
        if (field.getText && Object.prototype.hasOwnProperty.call(labels,field.getText())) field.setText(labels[field.getText()]);
      });});
      this.setTooltip(hints[type]);
    };
  });
  Blockly.Arduino.base_map=function(){
    var n=Blockly.Arduino.valueToCode(this,'NUM',Blockly.Arduino.ORDER_NONE)||'0';
    var m=Blockly.Arduino.valueToCode(this,'DMAX',Blockly.Arduino.ORDER_NONE)||'255';
    return ['map('+n+', 0, 1023, 0, '+m+')',Blockly.Arduino.ORDER_ATOMIC];
  };
}());
function editorStatus(message,error,detail) {
  var el=document.getElementById('status'); if(el){el.textContent=message;el.className=error?'error':'';}
  if(detail!==undefined){if(typeof showCompileUsage==='function')showCompileUsage(detail);document.getElementById('build_output').textContent=detail; document.getElementById('build_details').open=!!error; Blockly.fireUiEvent(window,'resize');}
}
var lastGenerationFailed=false;
(function(){
 var original=Blockly.Arduino.blockToCode;
 Blockly.Arduino.blockToCode=function(block){
  try{return original.apply(this,arguments);}
  catch(error){if(error && typeof error==='object' && !error.blockId && block)error.blockId=block.id;throw error;}
 };
}());
function generateSketch(){
 try{var code=Blockly.Arduino.workspaceToCode();if(lastGenerationFailed)editorStatus('Code generated. Ready to compile.',false);lastGenerationFailed=false;return code;}
 catch(error){lastGenerationFailed=true;var b=error.blockId&&Blockly.mainWorkspace.getBlockById(error.blockId);if(b&&b.select)b.select();editorStatus(String(error.message||error)+(b?' The related block is selected.':''),true);return null;}
}
function installEditorHelp(){
  if(window.PanelState)PanelState.install();
  if(window.BlocklyResources)BlocklyResources.install();
  if(window.BlocklyTarget)BlocklyTarget.install();
  if(window.BlocklyEditorActions)BlocklyEditorActions.install();
  if(window.BlocklyWorkspaceZoom)BlocklyWorkspaceZoom.install();
  if(window.BlocklyWorkspaceRegions)BlocklyWorkspaceRegions.install();
  if(window.BlocklyProjectDevices)BlocklyProjectDevices.install();
  if(window.BlocklyHistory)BlocklyHistory.install();
  if(window.WorkbenchUI)WorkbenchUI.install();
  function update(){var b=Blockly.selected;if(!b)return;var tip=b.tooltip;if(typeof tip==='function')tip=tip.call(b);var values=b.inputList.some(function(i){return i.type===Blockly.INPUT_VALUE;});document.getElementById('block_help').textContent=(tip||'Use the Guide for examples and wiring details.')+(values?' Value sockets accept variables and calculations; replace the existing number block.':'');Blockly.fireUiEvent(window,'resize');}
  document.addEventListener('mouseup',function(){setTimeout(update,50);});
  document.addEventListener('keyup',update);
  Blockly.mainWorkspace.addChangeListener(update);
  document.getElementById('build_details').addEventListener('toggle',function(){Blockly.fireUiEvent(window,'resize');});
  document.querySelectorAll('.menu button').forEach(function(b){b.addEventListener('click',function(){document.querySelector('.project-menu').open=false;});});
}
function ensureBlocksMode(){
  if(selected !== 'blocks') tabClick('blocks');
  return selected === 'blocks';
}
function replaceProjectXml(xml) {
  var ws=Blockly.mainWorkspace,backup=Blockly.Xml.workspaceToDom(ws);
  try{ws.clear();Blockly.Xml.domToWorkspace(ws,xml);if(typeof showCompileUsage==='function')showCompileUsage('');editorStatus('Blocks opened.',false);return true;}
  catch(error){ws.clear();Blockly.Xml.domToWorkspace(ws,backup);editorStatus('Could not open blocks: '+String(error.message||error),true);return false;}
}

/* Keep image dimensions readable on a laptop-width workspace. */
['st_bmp_create','st_bmp_stream_create'].forEach(function(type){
 var original=Blockly.Blocks[type].init;
 Blockly.Blocks[type].init=function(){original.call(this);this.setInputsInline(false);};
});
