/* SPDX-License-Identifier: Apache-2.0 */
(function(){'use strict';var B=Blockly,A=B.Arduino,D=B.DeviceRegistry;
 function value(b,k,f){return A.valueToCode(b,k,A.ORDER_NONE)||f;}
 var steppedTypes=['device_stepper_driver','device_stepper_coils'];
 function mode(b){return b.getFieldValue('DRIVE_MODE')||'POSITION';}
 function fast(b){return b.type==='device_stepper_driver'&&b.getFieldValue('ENGINE')==='TIMER';}
 function velocity(b){return fast(b)?D.name(b):D.name(b)+'_velocity';}
 var performance='AccelStepper polls from loop: about 4000 steps/s on 16 MHz AVR under favourable conditions, often less with other work. FastAccelStepper uses Timer1 compare outputs D9/D10 and interrupts, without run in loop. Its AVR author rates 50000 steps/s for one motor, 37000 each for two at 16 MHz; these are library figures, not a measured guarantee for your motor/driver.';
 function integer(v){var n=Number(v);return isFinite(n)&&n===Math.floor(n)&&n>=1&&n<=1000?String(n):null;}
 steppedTypes.forEach(function(type){
  var init=B.Blocks[type].init;
  B.Blocks[type].init=function(){
   init.call(this);var owner=this;
   if(type==='device_stepper_driver'){
    this.appendDummyInput().appendField('engine').appendField(new B.FieldDropdown(function(){var p=window.BlocklyResources&&BlocklyResources.profile();return !p||p.id==='avr328'?[['AccelStepper · loop','LOOP'],['FastAccelStepper · Timer1','TIMER']]:[['AccelStepper · loop','LOOP']];}),'ENGINE');
    this.appendDummyInput('STEP_PULSE').appendField('STEP pulse µs').appendField(new B.FieldTextInput('1',integer),'PULSE_US');
    this.appendDummyInput('DIR_DELAY').appendField('DIR delay µs').appendField(new B.FieldTextInput('40',function(v){return integer(v)&&Number(v)>=40?String(Number(v)):null;}),'DIR_DELAY_US');
   }
   this.appendDummyInput().appendField('motion').appendField(new B.FieldDropdown(function(){var b=owner,m=[['position with acceleration','POSITION'],['continuous with acceleration','RAMPED']];if(!b||!fast(b))m.push(['continuous, instant speed','CONTINUOUS']);return m;}),'DRIVE_MODE');
   this.setHelpUrl('examples/motion-guide.html');
   this.setTooltip(performance+' Maximum speed is a ceiling, not a motion command. Steps mean driver pulses, including microsteps. Timer1 cannot also serve Servo, Timer1 interrupts or PWM on D9/D10. Timer STEP high time is a few µs and is not configurable by this library; check the driver module. Loop engine pulse width is configurable.');
  };
  var previous=B.Blocks[type].onchange;
  B.Blocks[type].onchange=function(){
   if(previous)previous.apply(this,arguments);
   var b=this;[['ACCEL_SETTING',mode(b)!=='CONTINUOUS'],['STEP_PULSE',!fast(b)],['DIR_DELAY',fast(b)]].forEach(function(x){var input=b.getInput(x[0]);if(input&&input.isVisible()!==x[1]){input.setVisible(x[1]);if(b.rendered)b.render();}});
  };
 });
 function configure(b){
  var key='bd_device_'+b.id,n=D.name(b),m=mode(b),s=b.getFieldValue('SPEED'),a=b.getFieldValue('ACCEL');
  if(fast(b)){
   if(m==='CONTINUOUS')throw Error('FastAccelStepper uses acceleration. Choose continuous with acceleration, or the loop engine for instant speed.');
   A.definitions_.bd_fast_guard='#if !defined(__AVR_ATmega168__) && !defined(__AVR_ATmega168P__) && !defined(__AVR_ATmega328__) && !defined(__AVR_ATmega328P__)\n#error "This Blockly timer stepper profile requires ATmega168/328"\n#endif';
   A.definitions_.bd_include_fast_motion='#include <BlocklyFastStepper.h>';
   A.definitions_.bd_fast_engine='FastAccelStepperEngine bxStepEngine;';
   A.setups_.bd_fast_engine='bxStepEngine.init();';
   A.definitions_[key]='BxFastStepper '+n+';';
   A.setups_[key]=n+'.begin(bxStepEngine, '+b.getFieldValue('STEP')+', '+b.getFieldValue('DIR')+', '+s+', '+a+', '+b.getFieldValue('DIR_DELAY_US')+');';
  }else{
   A.setups_[key]=n+'.setMaxSpeed('+s+');\n'+n+(m==='CONTINUOUS'?'.setSpeed(0);':'.setAcceleration('+a+');');
   if(m==='RAMPED'){
    A.definitions_.bd_include_motion='#include <BlocklyMotion.h>';
    A.definitions_['bd_velocity_'+b.id]='BxStepperVelocity<AccelStepper> '+velocity(b)+'('+n+');';
    A.setups_[key]=velocity(b)+'.begin('+s+', '+a+');';
   }
   if(b.type==='device_stepper_driver')A.setups_[key]+='\n'+n+'.setMinPulseWidth('+b.getFieldValue('PULSE_US')+');';
  }
 }
 A.configureTimerStepper=function(b){if(!fast(b))return false;configure(b);return true;};
 steppedTypes.forEach(function(type){var g=A[type];A[type]=function(){var s=g.call(this);configure(this);return s;};});
 function motor(b){var c=D.resolve(b,'stepper');configure(c);return c;}
 A.device_stepper_move=function(){var c=motor(this);if(mode(c)!=='POSITION')throw Error('Use signed speed for a continuous motor, or choose position mode in its definition.');return D.name(c)+'.'+(this.getFieldValue('MODE')==='BY'?'move':'moveTo')+'('+value(this,'VALUE','0')+');\n';};
 A.device_stepper_run=function(){var c=motor(this),m=mode(c);return fast(c)?'// '+D.name(c)+': Timer1 services motion in the background.\n':m==='RAMPED'?velocity(c)+'.run();\n':D.name(c)+(m==='CONTINUOUS'?'.runSpeed();\n':'.run();\n');};
 A.device_stepper_stop=function(){var c=motor(this),m=mode(c);return fast(c)||m==='RAMPED'?velocity(c)+'.stop();\n':D.name(c)+(m==='CONTINUOUS'?'.setSpeed(0);\n':'.stop();\n');};
 B.Blocks.device_stepper_speed={init:function(){this.setColour(30);this.appendDummyInput().appendField(D.field('stepper'),'DEVICE').appendField('signed speed');this.appendValueInput('SPEED').setCheck('Number').appendField('steps/s');this.setInputsInline(true);this.setPreviousStatement(true);this.setNextStatement(true);this.setHelpUrl('examples/motion-guide.html');this.setTooltip('Continuous modes: positive/negative selects direction; zero stops. Acceleration mode ramps and brakes before reversing. Timer engine runs in the background; loop engine needs run every pass. Integer or fractional values work, but timing resolution and driver/load determine the actual rate. '+performance);}};
 A.device_stepper_speed=function(){var c=motor(this);if(mode(c)==='POSITION')throw Error('Select a continuous speed mode in the stepper definition.');return (fast(c)||mode(c)==='RAMPED'?velocity(c)+'.setTarget(':D.name(c)+'.setSpeed(')+value(this,'SPEED','0')+');\n';};
 function tooltip(type,text){var old=B.Blocks[type].init;B.Blocks[type].init=function(){old.call(this);this.setHelpUrl('examples/motion-guide.html');this.setTooltip(text);};}
 tooltip('device_stepper_run','Loop engine: call every loop pass; at most one due step, plus a short pulse-width wait. Timer engine: no run block is needed; pulses and ramps run in the background. '+performance);
 tooltip('device_stepper_stop','Position and ramped continuous modes decelerate. Keep calling run for the loop engine. Instant continuous mode immediately requests zero speed. Does not disable the external driver.');
 tooltip('device_stepper_move','Set a target without waiting for movement. Relative movement is measured from the current position with either engine. Loop engine needs run every pass; Timer1 engine does not.');
 A.device_stepper_setting=function(){var c=motor(this),m=mode(c),setting=this.getFieldValue('SETTING');if(m==='CONTINUOUS'&&setting==='ACCEL')throw Error('Instant continuous mode has no acceleration. Choose continuous with acceleration or position mode.');return (fast(c)||m==='RAMPED'?velocity(c):D.name(c))+'.'+(setting==='SPEED'?'setMaxSpeed':'setAcceleration')+'('+value(this,'VALUE','200')+');\n';};
 A.device_stepper_position=function(){var c=motor(this),distance=this.getFieldValue('READ')==='DISTANCE';if(distance&&mode(c)!=='POSITION')throw Error('Continuous motion has no target position. Read position instead of steps remaining.');return [D.name(c)+'.'+(distance?'distanceToGo':'currentPosition')+'()',A.ORDER_ATOMIC];};
 tooltip('device_servo','Hobby Servo library: background pulses on an ordinary digital GPIO, not analogWrite PWM. AVR: up to 12 signals from Timer1; PWM D9/D10, Timer1 steppers and Timer1 interrupts cannot share it. Blue Pill: TIM2. Pico: one PIO state machine per servo. Long interrupt-disabled transfers can distort AVR pulses. Use a suitable supply with common ground.');

 var servoInit=B.Blocks.device_servo.init;
 B.Blocks.device_servo.init=function(){servoInit.call(this);
  this.appendDummyInput().appendField('engine').appendField(new B.FieldDropdown([['Servo library · IRQ / PIO','CORE'],['hardware PWM','HARDWARE']]),'ENGINE');
  this.appendDummyInput().appendField('pulse µs').appendField(new B.FieldTextInput('544'),'MIN_US').appendField('…').appendField(new B.FieldTextInput('2400'),'MAX_US');
  this.appendDummyInput('SERVO_RATE').appendField('refresh Hz').appendField(new B.FieldTextInput('50'),'FRAME_HZ');
  this.setTooltip('Servo library: AVR Timer1 interrupts on ordinary GPIO, Blue Pill TIM2, Pico PIO. Hardware PWM: only compatible timer outputs, autonomous edges with no per-edge ISR. Set calibrated pulse endpoints; verify the servo accepts the refresh rate. Shared PWM timer channels must use the same frequency. Older projects retain the Servo library.');
 };
 B.Blocks.device_servo.onchange=function(){var i=this.getInput('SERVO_RATE'),visible=this.getFieldValue('ENGINE')==='HARDWARE';if(i&&i.isVisible()!==visible){i.setVisible(visible);if(this.rendered)this.render();}};
 function servoRange(c){var lo=Number(c.getFieldValue('MIN_US')),hi=Number(c.getFieldValue('MAX_US')),hz=Number(c.getFieldValue('FRAME_HZ'));if(!Number.isInteger(lo)||!Number.isInteger(hi)||lo<1||hi>10000||lo>=hi)throw Error('Servo pulse endpoints must be whole microseconds: 1 <= minimum < maximum <= 10000.');if(c.getFieldValue('ENGINE')==='HARDWARE'&&(!Number.isInteger(hz)||hz<40||hz>400||hi*hz>=1000000))throw Error('Servo refresh must be 40–400 Hz, with maximum pulse shorter than its period.');if(c.getFieldValue('ENGINE')!=='HARDWARE'){var p=window.BlocklyResources&&BlocklyResources.profile();if(!p||p.id==='avr328'){if(!window.BoardCapabilities)throw Error('Load board_capabilities.js before the motion generators.');var cal=BoardCapabilities.servoCalibration(lo,hi);if(!cal.valid)throw Error(cal.message);lo=cal.min;hi=cal.max;}else if(lo<544||hi>2400)throw Error('The portable Servo library profile supports calibrated endpoints within 544–2400 µs. Select hardware PWM for a wider range.');}return[lo,hi,hz];}
 A.configureHardwareServo=function(c){if(c.getFieldValue('ENGINE')!=='HARDWARE')return false;var r=servoRange(c),key='bd_device_'+c.id;A.definitions_.bd_hardware_servo='#include <BlocklyHardwareServo.h>';A.definitions_[key]='BxHardwareServo '+D.name(c)+';';A.setups_[key]=D.name(c)+'.attach('+c.getFieldValue('PIN')+', '+r.join(', ')+');';return true;};
 var servoDefinition=A.device_servo;
 A.device_servo=function(){var r=servoRange(this),result=servoDefinition.call(this);if(this.getFieldValue('ENGINE')!=='HARDWARE')A.setups_['bd_device_'+this.id]=D.name(this)+'.attach('+this.getFieldValue('PIN')+', '+r[0]+', '+r[1]+');';return result;};
 var si=B.Blocks.device_servo_write.init;B.Blocks.device_servo_write.init=function(){si.call(this);this.appendDummyInput().appendField(new B.FieldDropdown([['angle 0–180°','DEGREES'],['pulse µs','MICROSECONDS']]),'UNIT');this.setTooltip('Degrees maps 0–180 to the calibrated pulse endpoints in the device definition. Microseconds controls the pulse directly within those endpoints. Actual mechanical range/precision depends on the servo.');};
 A.device_servo_write=function(){var c=D.resolve(this,'servo'),r=servoRange(c),us=this.getFieldValue('UNIT')==='MICROSECONDS';if(c.getFieldValue('ENGINE')!=='HARDWARE')A.setups_['bd_device_'+c.id]=D.name(c)+'.attach('+c.getFieldValue('PIN')+', '+r[0]+', '+r[1]+');';return D.name(c)+'.'+(us?'writeMicroseconds':'write')+'(constrain((long)('+value(this,'ANGLE',us?'1500':'90')+'), '+(us?r[0]+', '+r[1]:'0, 180')+'));\n';};
 B.Blocks.base_map={init:function(){this.setColour(230);[['NUM','map'],['FROM_LOW','from'],['FROM_HIGH','…'],['TO_LOW','to'],['DMAX','…']].forEach(function(x){this.appendValueInput(x[0]).setCheck('Number').appendField(x[1]);},this);this.setInputsInline(true);this.setOutput(true,'Number');this.setTooltip('Integer linear mapping. All five sockets accept numbers or expressions. Input range must not be zero; a zero-width range returns the output minimum. Values are not clamped.');}};
 A.base_map=function(){A.definitions_.bx_map='long bxMap(long x, long a, long b, long c, long d) { return a == b ? c : (long)(((double)x-a)*((double)d-c)/((double)b-a)+c); }';return ['bxMap('+[['NUM','0'],['FROM_LOW','0'],['FROM_HIGH','1023'],['TO_LOW','0'],['DMAX','255']].map(function(x){return value(this,x[0],x[1]);},this).join(', ')+')',A.ORDER_ATOMIC];};
 (window.BlocklyDeviceCatalog||[]).forEach(function(c){if(c.type==='music_buzzer'){c.actions.push('music_output_ok');if(c.groups)c.groups[0].actions.push('music_output_ok');}if(c.kind==='stepper'){c.actions.push('device_stepper_speed');if(c.groups)c.groups[0].actions.push('device_stepper_speed');}});
})();
