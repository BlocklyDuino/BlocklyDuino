/* SPDX-License-Identifier: Apache-2.0
 * Versioned board facts, separate from library engines and workspace ownership.
 * Pro Mini ATmega168 is the verified reference profile. See docs/board-capabilities.md.
 */
(function(root,factory){var api=factory();if(typeof module==='object')module.exports=api;else root.BoardCapabilities=api;}(this,function(){
 'use strict';
 var pins=[];
 for(var i=0;i<22;i++){
  var id=i<14?String(i):'A'+(i-14),port=i<8?'D':i<14?'B':'C',bit=i<8?i:i<14?i-8:i-14;
  var capabilities=i<20?['digital','pcint']:[];if(i>=14)capabilities.push('analog');if(i===2||i===3)capabilities.push('irq');
  pins.push({id:id,port:i<20?port:null,bit:i<20?bit:null,capabilities:capabilities,analog:i>=14?i-14:null});
 }
 var pwm={'3':['Timer2','B'],'5':['Timer0','B'],'6':['Timer0','A'],'9':['Timer1','A'],'10':['Timer1','B'],'11':['Timer2','A']};
 pins.forEach(function(p){if(pwm[p.id]){p.capabilities.push('pwm');p.timer=pwm[p.id][0];p.channel=pwm[p.id][1];}if(['9','10'].indexOf(p.id)>=0)p.capabilities.push('faststep','servopwm');if(['9','11'].indexOf(p.id)>=0)p.capabilities.push('buzzpwm');});
 var board={schemaVersion:1,id:'pro-mini-atmega168',family:'avr328',name:'Pro Mini · ATmega168 / 168P',
  fqbnPattern:'^arduino:avr:pro:cpu=(8|16)MHzatmega168(?:,|$)',pins:pins,led:'13',
  memory:{flashBytes:16384,applicationBytes:14336,sramBytes:1024,eepromBytes:512},
  timers:{Timer0:{bits:8,system:'millis / micros / delay',allowAnalogWrite:true},Timer1:{bits:16},Timer2:{bits:8}},
  buses:{I2C:{SDA:'A4',SCL:'A5'},SPI:{MOSI:'11',MISO:'12',SCK:'13'}},serial:['0','1'],spiSS:'10',
  limits:{hardwareServo:2,hardwareBuzzer:2,fastStepper:2,sd:1,servo:12,buzzer:3,ir:1,timer1:1},
  layout:{name:'Pro Mini · serial header at top',left:['1','0','RESET','GND','2','3','4','5','6','7','8','9'],right:['RAW','GND','RESET','VCC','A3','A2','A1','A0','13','12','11','10'],extra:['A4','A5','A6','A7'],physical:false},
  engines:{
   device_stepper_driver:[{value:'TIMER',label:'Timer1 · background pulses',pins:{STEP:'faststep',DIR:'digital'},resource:'fastStepper',timer:'Timer1',maxAt16MHz:50000,maxTwoAt16MHz:37000,description:'STEP D9/D10. Hardware rising edges; the library services falling edges and its acceleration queue in interrupts. Continuous acceleration is supported. 16 MHz library rating: 50,000 steps/s for one motor, 37,000 each for two; driver and interrupt load can lower this.'},{value:'LOOP',label:'Loop · flexible pins',pins:{STEP:'digital',DIR:'digital'},description:'Any free digital pins. Call run every loop pass. AccelStepper is rated around 4,000 steps/s on 16 MHz AVR under favourable conditions; blocking work lowers this. Acceleration is available in position and ramped continuous modes.'}],
   device_servo:[{value:'HARDWARE',label:'Hardware PWM · autonomous',pins:{PIN:'servopwm'},resource:'hardwareServo',timer:'Timer1',refreshHz:{min:40,max:400},pulseUs:{min:1,max:10000},description:'D9/D10, Timer1. Pulse edges are generated in hardware. Both channels share the refresh rate; calibrate pulse endpoints for the servo.'},{value:'CORE',label:'Servo library · timer interrupts',pins:{PIN:'digital'},resource:'servo',timer:'Timer1',pulseUs:{min:33,max:2915},calibration:{minimum:[33,1059],maximum:[1889,2915],quantumUs:4},description:'AVR calibration endpoints are quantized to 4 µs; effective minimum 36–1056 and maximum 1892–2912 µs. Up to 12 free digital pins; Timer1 schedules the pulse edges in interrupts. PWM-labelled pins are not required. Timer1 hardware outputs are unavailable to other engines.'}],
   music_buzzer:[{value:'HARDWARE',label:'Hardware waveform · autonomous',pins:{PIN:'buzzpwm'},defaults:{PIN:'11'},resource:'hardwareBuzzer',description:'D9/Timer1 or D11/Timer2. One independent pitch per timer, no audio-rate ISR. D11 minimum is about 31 Hz at 16 MHz. Loop service advances notes; edges remain autonomous.'},{value:'IRQ',label:'Timer2 · three interrupt voices',pins:{PIN:'digital'},resource:'buzzer',timer:'Timer2',description:'Up to three independent voices on free digital pins. Timer2 interrupt mixing costs CPU time, but preserves Timer1 for motion or servos.'}]
  }
 };
 function find(fqbn){return new RegExp(board.fqbnPattern).test(fqbn||'')?JSON.parse(JSON.stringify(board)):null;}
 // AVR Servo stores endpoint offsets in signed bytes, in 4 us units.
 // A simple whole-range check would miss silent int8_t wrap in attach().
 function servoCalibration(lo,hi){
  var a=Math.trunc((544-lo)/4),b=Math.trunc((2400-hi)/4);
  if(!Number.isInteger(lo)||!Number.isInteger(hi)||lo>=hi||a< -128||a>127||b< -128||b>127)return{valid:false,message:'AVR Servo calibration needs minimum 33–1059 µs and maximum 1889–2915 µs. Endpoints use 4 µs steps; hardware PWM supports a wider range.'};
  return{valid:true,min:544-4*a,max:2400-4*b,quantumUs:4};
 }
 function profile(fqbn){var b=find(fqbn);if(!b)return null;var p={fqbn:fqbn,known:true,id:b.family,capabilityId:b.id,schemaVersion:b.schemaVersion,name:b.name,capabilities:b,aliases:{},reserved:[],clockMHz:/cpu=8MHz/.test(fqbn)?8:16,led:b.led,serial:b.serial,buses:b.buses,spiSS:b.spiSS,servo:b.limits.servo,buzzer:b.limits.buzzer,fastStepper:b.limits.fastStepper,servoTimer:'Timer1',limits:b.limits,pwmTimer:{},pwmChannel:{},avrpin:[]};
  ['digital','analog','pwm','irq','pcint','faststep','servopwm','buzzpwm'].forEach(function(k){p[k]=b.pins.filter(function(n){return n.capabilities.indexOf(k)>=0;}).map(function(n){return n.id;});});
  b.pins.forEach(function(n){if(n.timer){p.pwmTimer[n.id]=n.timer;p.pwmChannel[n.id]=n.channel;}if(n.port){var port=n.port+n.bit;p.avrpin.push(port);p.aliases[port]=n.id;}if(n.analog!==null)p.aliases[String(n.analog+14)]=n.id;});return p;
 }
 return {schemaVersion:1,find:find,profile:profile,servoCalibration:servoCalibration};
}));
