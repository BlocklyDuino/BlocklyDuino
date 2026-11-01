/* SPDX-License-Identifier: Apache-2.0
 * Pin and peripheral contracts for the supported board/core combinations.
 * Pure model: no DOM, serial access or guesses about unlisted boards.
 */
(function(root,factory){var api=factory(typeof module==='object'?require('./board_capabilities.js'):root.BoardCapabilities);if(typeof module==='object')module.exports=api;else root.BoardResources=api;})(this,function(C){
 'use strict';
 function range(a,b,prefix){var r=[];for(var i=a;i<=b;i++)r.push((prefix||'')+i);return r;}
 function profile(fqbn){
  var described=C&&C.profile(fqbn);if(described)return described;
  var p={fqbn:fqbn||'',known:true,aliases:{},pwm:[],irq:[],pcint:[],servo:12,buzzer:0,buses:{},serial:[],reserved:[]};
  if(/^arduino:avr:(uno|nano|pro|diecimila)(:|$)/.test(fqbn)){
   p.led='13';p.id='avr328';p.name='ATmega168/328';p.digital=range(0,13).concat(range(0,5,'A'));p.analog=range(0,/:(pro|nano)(:|$)/.test(fqbn)?7:5,'A');
   range(14,21).forEach(function(n){p.aliases[n]='A'+(Number(n)-14);});
   p.faststep=['9','10'];p.servopwm=['9','10'];p.buzzpwm=['9','11'];p.pwmChannel={'3':'B','11':'A','9':'A','10':'B','5':'B','6':'A'};p.fastStepper=2;p.clockMHz=/cpu=8MHz/.test(fqbn)?8:16;p.pwm=['3','5','6','9','10','11'];p.irq=['2','3'];p.pcint=p.digital.slice();p.buzzer=3;p.servoTimer='Timer1';
   p.pwmTimer={'3':'Timer2','11':'Timer2','9':'Timer1','10':'Timer1','5':'Timer0','6':'Timer0'};
   p.buses={I2C:{SDA:'A4',SCL:'A5'},SPI:{MOSI:'11',MISO:'12',SCK:'13'}};p.serial=['0','1'];p.spiSS='10';p.avrpin=range(0,5,'B').concat(range(0,5,'C'),range(0,7,'D'));range(0,5).forEach(function(n){p.aliases['B'+n]=String(8+Number(n));p.aliases['C'+n]='A'+n;});
  }else if(/^rp2040:rp2040:rpipico(:|$)/.test(fqbn)){
   p.led='25';p.id='pico';p.name='Raspberry Pi Pico';p.digital=range(0,22).concat(['26','27','28']);p.analog=['26','27','28'];p.aliases={A0:'26',A1:'27',A2:'28'};
   p.pwm=p.digital.slice();p.servopwm=p.pwm.slice();p.buzzpwm=p.digital.slice();p.irq=p.digital.slice();p.servo=8;p.servoTimer='PIO Servo';p.pwmTimer={};p.pwmChannel={};p.digital.forEach(function(n){p.pwmTimer[n]='PWM slice '+(Math.floor(+n/2)%8);p.pwmChannel[n]=String(+n%2);});
   p.buses={I2C:{SDA:'4',SCL:'5'},SPI:{MOSI:'19',MISO:'16',SCK:'18'}};
  }else if(/^STMicroelectronics:stm32:GenF1:/.test(fqbn)&&/pnum=BLUEPILL_F103C[8B]/.test(fqbn)){
   p.led='PC13';p.id='bluepill';p.name='Blue Pill F103';p.digital=range(0,15,'PA').concat(range(0,15,'PB'),['PC13','PC14','PC15']);p.reserved=['PA11','PA12','PA13','PA14','PA15','PB3','PB4','PC14','PC15'];
   p.digital=p.digital.filter(function(n){return p.reserved.indexOf(n)<0;});p.analog=range(0,7,'PA').concat(['PB0','PB1']);p.analog.forEach(function(n,i){p.aliases['A'+i]=n;});p.pwm=['PA0','PA1','PA2','PA3','PA6','PA7','PA8','PA9','PA10','PB0','PB1','PB5','PB6','PB7','PB8','PB9','PB10','PB11'];p.servopwm=p.pwm.filter(function(v){return ['PA7','PB0','PB1'].indexOf(v)<0;});p.buzzpwm=p.pwm.slice();p.irq=p.digital.slice();p.servoTimer='TIM2';
   p.pwmTimer={PA0:'TIM2',PA1:'TIM2',PA2:'TIM2',PA3:'TIM2',PA6:'TIM3',PA7:'TIM1',PB0:'TIM1',PB1:'TIM1',PA8:'TIM1',PA9:'TIM1',PA10:'TIM1',PB6:'TIM4',PB7:'TIM4',PB8:'TIM4',PB9:'TIM4',PB5:'TIM3',PB10:'TIM2',PB11:'TIM2'};
   p.pwmChannel={PA0:'1',PA1:'2',PA2:'3',PA3:'4',PA6:'1',PA7:'1',PA8:'1',PA9:'2',PA10:'3',PB0:'2',PB1:'3',PB5:'2',PB6:'1',PB7:'2',PB8:'3',PB9:'4',PB10:'3',PB11:'4'};
   p.pwmRemap={PA7:'partial',PB0:'partial',PB1:'partial',PB5:'partial',PB10:'partial2',PB11:'partial2'};
   p.buses={I2C:{SDA:'PB7',SCL:'PB6'},SPI:{MOSI:'PA7',MISO:'PA6',SCK:'PA5'}};
   if(!/usb=CDC/.test(fqbn))p.serial=['PA10','PA9'];
  }else{p.known=false;p.id='unknown';p.name='No verified pin profile';p.digital=[];p.analog=[];p.servo=0;}
  return p;
 }
 var specs={
  device_stepper_driver:{pins:{STEP:'digital',DIR:'digital'}},device_stepper_coils:{pins:{IN1:'digital',IN2:'digital',IN3:'digital',IN4:'digital'}},
  device_servo:{pins:{PIN:'digital'},resource:'servo'},device_lcd:{bus:'I2C'},device_oled:{bus:'I2C'},st_i2c_eeprom:{bus:'I2C'},ll_i2c_device:{bus:'I2C'},
  device_oled_spi:{bus:'SPI',pins:{CS:'digital',DC:'digital',RESET:'digital'}},device_tft:{bus:'SPI',pins:{CS:'digital',DC:'digital',RESET:'digital'}},
  st_spi_eeprom:{bus:'SPI',pins:{CS:'digital'}},st_spi_flash:{bus:'SPI',pins:{CS:'digital'}},st_sd:{bus:'SPI',pins:{CS:'digital'},resource:'sd'},ll_spi_device:{bus:'SPI',pins:{CS:'digital'}},
  device_ultrasonic:{pins:{TRIG:'digital',ECHO:'digital'}},device_ds18b20:{pins:{PIN:'digital'}},device_dht:{pins:{PIN:'digital'}},device_neopixel:{pins:{PIN:'digital'}},device_ir_nec:{pins:{PIN:'digital'},resource:'ir'},
  device_shift595:{pins:{DATA:'digital',CLOCK:'digital',LATCH:'digital'}},music_buzzer:{pins:{PIN:'digital'},resource:'buzzer',avr:true},
  irq_external:{pins:{PIN:'irq'},irq:true,resource:'external',avr:true},irq_pin_change:{pins:{PIN:'pcint'},irq:true,avr:true},irq_timer1:{resource:'timer1',avr:true},
  inout_buildin_led:{fixedLED:true},
  inout_analog_read:{pins:{PIN:'analog'},gpio:true},inout_analog_write:{pins:{PIN:'pwm'},gpio:true,resource:'pwm'},inout_digital_read:{pins:{PIN:'digital'},gpio:true,read:true},inout_digital_write:{pins:{PIN:'digital'},gpio:true},
  servo_move:{pins:{PIN:'digital'},resource:'servo',legacyServo:true},servo_read_degrees:{pins:{PIN:'digital'},resource:'servo',legacyServo:true},
  inout_tone:{pins:{PIN:'digital'},resource:'tone',gpio:true},inout_notone:{pins:{PIN:'digital'},resource:'tone',gpio:true},
  avr_pin_read:{pins:{PIN:'avrpin'},gpio:true,read:true,avr:true},avr_pin_write:{pins:{PIN:'avrpin'},gpio:true,avr:true},
  avr_port_read:{rawPort:true,avr:true},avr_port_bits:{rawPort:true,avr:true},avr_port_replace:{rawPort:true,avr:true},avr_port_write:{rawPort:true,avr:true},avr_port_direction:{rawPort:true,avr:true},
  avr_isr:{rawRegister:true,avr:true},avr_register_read:{rawRegister:true,avr:true},avr_register_write:{rawRegister:true,avr:true},avr_register_bits:{rawRegister:true,avr:true},avr_register_flags:{rawRegister:true,avr:true}
 };
 // Legacy examples retain their original blocks, but use the same pin contracts.
 Object.assign(specs,{
  button_pullup_pressed:{pins:{PIN:'digital'},gpio:true,read:true},
  ds18b20_temperature:{pins:{PIN:'digital'},legacy:'ds18b20'},
  dht_temperature:{pins:{PIN:'digital'},legacy:'dht'},dht_humidity:{pins:{PIN:'digital'},legacy:'dht'},
  ultrasonic_cm:{pins:{TRIG:'digital',ECHO:'digital'},legacy:'ultrasonic'},
  stepper_28byj_init:{pins:{IN1:'digital',IN2:'digital',IN3:'digital',IN4:'digital'},legacy:'28byj'},
  stepper_step_dir:{pins:{STEP:'digital',DIR:'digital'},legacy:'stepdir'},
  accel_driver_init:{pins:{STEP:'digital',DIR:'digital'},legacy:'accel'},
  accel_4wire_init:{pins:{IN1:'digital',IN2:'digital',IN3:'digital',IN4:'digital'},legacy:'accel'},
  neopixel_init:{pins:{PIN:'digital'},legacy:'pixels'},ir_nec_read:{pins:{PIN:'digital'},legacy:'ir',resource:'ir'},
  shift595_write:{pins:{DATA:'digital',CLK:'digital',LATCH:'digital'},legacy:'595'},
  lcd1602_i2c_print:{bus:'I2C',legacy:'lcd1602'},lcd_user_init:{bus:'I2C',legacy:'lcdUser'},
  i2c_scan_serial:{bus:'I2C'},oled_ssd1306_091_i2c_print:{bus:'I2C',legacy:'oled091',fixed:{ADDR:'0x3C'}},
  grove_rgb_lcd_print:{bus:'I2C',legacy:'groveLcd',fixed:{ADDR:'0x3E'},extraAddresses:['0x62']},
  grove_rgb_lcd_color:{bus:'I2C',legacy:'groveLcd',fixed:{ADDR:'0x3E'},extraAddresses:['0x62']},
  oled_ssd1306_spi_print:{bus:'SPI',legacy:'oledSpi',fixed:{CS:'10',DC:'9',RESET:'8'},pins:{CS:'digital',DC:'digital',RESET:'digital'}},
  tft_st7735_spi_print:{bus:'SPI',legacy:'tftSpi',fixed:{CS:'10',DC:'9',RESET:'8'},pins:{CS:'digital',DC:'digital',RESET:'digital'}}
 });
 ['grove_led','grove_piezo_buzzer','grove_relay'].forEach(function(t){specs[t]={pins:{PIN:'digital'},gpio:true};});
 ['grove_button','grove_tilt_switch','grove_pir_motion_sensor','grove_line_finder'].forEach(function(t){specs[t]={pins:{PIN:'digital'},gpio:true,read:true};});
 ['grove_rotary_angle','grove_temporature_sensor','grove_sound_sensor'].forEach(function(t){specs[t]={pins:{PIN:'analog'},gpio:true,read:true};});
 specs.grove_ultrasonic_ranger={pins:{PIN:'digital'},legacy:'groveRange'};
 ['grove_serial_lcd_print','grove_serial_lcd_power','grove_serial_lcd_effect'].forEach(function(t){specs[t]={pins:{PIN:'pcint'},pair:'digital',legacy:'groveSerialLCD',avr:true};});
 specs.grove_rgb_led={pins:{PIN:'digital'},pair:'digital',legacy:'groveRGB'};
 specs.grove_bluetooth_slave={pins:{PIN:'pcint'},pair:'digital',legacy:'groveBluetooth',avr:true};
 specs.grove_thumb_joystick={pins:{PIN:'analog'},pair:'analog',gpio:true,read:true};
 specs.grove_motor_shield={legacy:'groveMotor',fixed:{IN1:'8',IN2:'11',IN3:'12',IN4:'13',PWMA:'9',PWMB:'10'},pins:{IN1:'digital',IN2:'digital',IN3:'digital',IN4:'digital',PWMA:'pwm',PWMB:'pwm'}};
 ['lcd20x4_title','lcd20x4_bounce','lcd20x4_counter','lcd20x4_heart','lcd20x4_ticker'].forEach(function(t){specs[t]={bus:'I2C',legacy:'lcd20',fixed:{ADDR:'0x27'}};});
 ['lcd_user_print','lcd_user_print_at','lcd_user_clear_row','lcd_user_heart_at','lcd_user_clear','lcd_user_backlight'].forEach(function(t){specs[t]={bus:'I2C',legacy:'lcdUser'};});
 ['stepper_28byj_move'].forEach(function(t){specs[t]={requires:['stepper_28byj_init'],fallback:{IN1:'8',IN2:'9',IN3:'10',IN4:'11'}};});
 ['neopixel_set','neopixel_show','neopixel_clear'].forEach(function(t){specs[t]={requires:['neopixel_init'],fallback:{PIN:'6'}};});
 ['accel_move_to','accel_move_relative','accel_run','accel_set_max_speed','accel_set_acceleration','accel_distance_to_go','accel_current_position'].forEach(function(t){specs[t]={requires:['accel_driver_init','accel_4wire_init'],fallback:{STEP:'3',DIR:'4'},motor:true};});
 function spec(r){if(r.type==='device_stepper_driver'&&r.fields.ENGINE==='TIMER')return{pins:{STEP:'faststep',DIR:'digital'},resource:'fastStepper',avr:true};if(r.type==='device_servo'&&r.fields.ENGINE==='HARDWARE')return{pins:{PIN:'servopwm'},resource:'hardwareServo'};if(r.type==='music_buzzer'&&r.fields.ENGINE==='HARDWARE')return{pins:{PIN:'buzzpwm'},resource:'hardwareBuzzer'};return specs[r.type];}
 function normalized(records){return records.filter(active).map(function(r){var s=spec(r);if(s&&s.requires&&!records.some(function(c){return active(c)&&s.requires.indexOf(c.type)>=0&&(!s.motor||c.fields.MOTOR===r.fields.MOTOR);})){r=Object.assign({},r,{type:s.requires[0],fields:Object.assign({},s.fallback,r.fields)});s=spec(r);}var fields=Object.assign({},r.fields,s&&s.fixed);if(!s)return r;return Object.assign({},r,{fields:fields,owner:s.legacy?'legacy:'+s.legacy+':'+Object.keys(s.pins||{}).concat(['ADDR','KIND','MOTOR']).map(function(k){return fields[k]||'';}).join(':'):r.id});});}
 function nextPin(v){var m=String(v).match(/^(.*?)([0-9]+)$/);return m?m[1]+(Number(m[2])+1):'';}
 function pin(p,v){v=String(v==null?'':v).replace(/^D(?=\d)/,'');return p.aliases[v]||v;}
 function label(p,v){v=pin(p,v);return p.id==='pico'?'GP'+v:/^\d+$/.test(v)?'D'+v:v;}
 function active(r){return !r.disabled;}
 function analyze(records,p){
  var claims={},errors=[],counts={},timers={},addresses={},rows=[],servoPins={},notes=[],counted={},pwmClaims={},waveClaims={};
  function error(r,msg){errors.push({id:r.id,message:(r.name||r.type)+': '+msg});}
  function claim(r,v,role,share){v=pin(p,v);if(!v)return;var c={id:r.id,name:r.name||r.type,role:role,share:share||'',pin:v,observer:!!(specs[r.type]&&specs[r.type].read),irq:!!(specs[r.type]&&specs[r.type].irq)};(claims[v]||(claims[v]=[])).push(c);return c;}
  var live=normalized(records);
  live.forEach(function(r){var s=spec(r);if(!s){if(/^(lcd|grove_|oled_|dht_|ds18b20_|neopixel_|stepper_|accel_|ultrasonic_|ir_nec_)/.test(r.type))notes.push('Legacy hardware blocks do not declare reusable devices. Replace them with Add device definitions for complete pin tracking.');if(/^(user_|arduino_raw)/.test(r.type))notes.push('Custom C++ may use resources beyond these declarations.');return;}
   if(!p.known){error(r,'choose a board with a verified pin profile.');return;}
   if(s.avr&&p.id!=='avr328')error(r,'this block requires ATmega168/328.');
   var engineDefs=p.capabilities&&p.capabilities.engines[r.type],engine=engineDefs&&engineDefs.find(function(e){return e.value===(r.fields.ENGINE||(r.type==='device_servo'?'CORE':r.type==='music_buzzer'?'IRQ':'LOOP'));});
   if(engineDefs&&!engine)error(r,'unknown pulse engine. Select a supported engine.');
   if(engine&&r.type==='device_servo'){
    var lo=Number(r.fields.MIN_US||544),hi=Number(r.fields.MAX_US||2400),hz=Number(r.fields.FRAME_HZ||50),range=engine.pulseUs;
    if(!Number.isInteger(lo)||!Number.isInteger(hi)||lo<range.min||hi>range.max||lo>=hi)error(r,'pulse endpoints must be whole microseconds within '+range.min+'–'+range.max+', minimum < maximum.');
    if(engine.calibration){var cal=C.servoCalibration(lo,hi);if(!cal.valid)error(r,cal.message);else if(cal.min!==lo||cal.max!==hi)notes.push(r.name+': AVR Servo calibration is '+cal.min+'–'+cal.max+' µs after 4 µs endpoint quantization.');}
    if(engine.refreshHz&&(!Number.isInteger(hz)||hz<engine.refreshHz.min||hz>engine.refreshHz.max||hi*hz>=1000000))error(r,'refresh must be '+engine.refreshHz.min+'–'+engine.refreshHz.max+' Hz with the maximum pulse shorter than the period.');
   }
   if(s.resource&&!counted[r.owner]){counted[r.owner]=true;if(!s.legacyServo||!servoPins[pin(p,r.fields.PIN)])counts[s.resource]=(counts[s.resource]||0)+1;if(s.legacyServo)servoPins[pin(p,r.fields.PIN)]=true;}
   var row={id:r.id,name:r.name||r.type,type:r.type,fields:r.fields,wires:[]};rows.push(row);
   if(s.fixedLED){claim(r,p.led,'LED','gpio:'+p.led);row.wires.push('LED → '+label(p,p.led));}
   Object.keys(s.pins||{}).forEach(function(f){var v=pin(p,r.fields[f]),kind=s.pins[f],valid=p[kind]||[];
    if(valid.map(function(x){return pin(p,x);}).indexOf(v)<0)error(r,f+' needs a compatible '+kind+' pin; '+label(p,v)+' is unavailable.');
    var shared=s.gpio?'gpio:'+v:s.legacyServo?'servo:'+v:s.legacy?r.owner+':'+f:'';
    row.wires.push(f+' → '+label(p,v));claim(r,v,f,shared);
    if((kind==='pwm'||kind==='servopwm'||kind==='buzzpwm'&&p.id!=='pico')&&p.pwmTimer){var t=p.pwmTimer[v];timers[t]=timers[t]||[];(pwmClaims[t]||(pwmClaims[t]=[])).push({record:r,pin:v,channel:(p.pwmChannel||{})[v],remap:(p.pwmRemap||{})[v]||'none'});}
   });
   if(s.resource==='hardwareServo'||s.resource==='hardwareBuzzer'&&p.id!=='pico'){var wt=(p.pwmTimer||{})[pin(p,r.fields.PIN)];if(wt)(waveClaims[wt]||(waveClaims[wt]=[])).push(r);}
   if(s.pair){var paired=nextPin(pin(p,r.fields.PIN));if((p[s.pair]||[]).indexOf(paired)<0)error(r,'PIN needs a compatible adjacent '+s.pair+' pin.');else {claim(r,paired,'paired pin',s.gpio?'gpio:'+paired:r.owner+':pair');row.wires.push('paired pin → '+label(p,paired));}}
   if(s.rawPort||s.rawRegister){
    var reg=String(r.fields.REGISTER||r.fields.VECTOR||''),port=s.rawPort?r.fields.PORT:(/^(PORT|DDR|PIN)[BCD]$/.test(reg)?reg.slice(-1):null);
    if(port){var mask=Number.isInteger(r.fields._MASK)?r.fields._MASK:255;var list=p.avrpin||[];list.filter(function(v){return v[0]===port&&(mask&(1<<Number(v[1])));}).forEach(function(v){var physical=pin(p,v);claim(r,physical,'PORT'+port,'gpio:'+physical);row.wires.push(v+' → '+label(p,physical));});}
    else if(s.rawRegister&&!/_read$/.test(r.type)){var timer=/^(?:TCCR|TIMSK|TIFR|TCNT|OCR|ICR|TIMER)([012])/.exec(reg);if(timer){var key='rawTimer'+timer[1];counts[key]=(counts[key]||0)+1;}else notes.push('Raw register '+reg+' requires a datasheet check; pin ownership cannot cover every register side effect.');}
   }
   if(s.bus){var bus=p.buses[s.bus];if(!bus){error(r,'no compatible '+s.bus+' bus.');return;}
    Object.keys(bus).forEach(function(role){row.wires.push(role+' → '+label(p,bus[role]));claim(r,bus[role],role,s.bus+':'+role);});
    // AVR SPI must keep hardware SS configured as output, even with another CS.
    if(s.bus==='SPI'&&p.spiSS&&!live.some(function(d){return specs[d.type]&&specs[d.type].bus==='SPI'&&pin(p,d.fields.CS)===p.spiSS;}))claim(r,p.spiSS,'hardware SS','SPI:SS');
    if(s.bus==='I2C'&&r.fields.ADDR)[r.fields.ADDR].concat(s.extraAddresses||[]).forEach(function(value){var a=Number(value);if(addresses[a]&&addresses[a].owner!==r.owner)error(r,'I2C address '+value+' is already used by '+addresses[a].name+'.');else addresses[a]={owner:r.owner,name:row.name};});
   }
  });
  if(live.some(function(r){return /^serial_|^text_print$|^ll_serial_number$|^i2c_scan_serial$|^grove_bluetooth_slave$|^st_sd_list$|^st_memory_text_stream$|^st_file_stream$/.test(r.type);}))p.serial.forEach(function(v){claim({id:'serial',name:'Hardware Serial'},v,'UART','UART');});
  Object.keys(claims).forEach(function(v){var cs=claims[v];for(var i=0;i<cs.length;i++)for(var j=0;j<i;j++){
   if(cs[i].share&&cs[i].share===cs[j].share)continue;
   if((cs[i].observer&&cs[j].irq)||(cs[j].observer&&cs[i].irq))continue;
   if(cs[i].id===cs[j].id&&cs[i].role===cs[j].role)continue;
   error({id:cs[i].id,name:cs[i].name},label(p,v)+' is occupied by '+cs[j].name+' ('+cs[j].role+').');
  }});
  var limits=p.limits||{hardwareServo:p.id==='avr328'?2:(p.servopwm||[]).length,hardwareBuzzer:p.id==='avr328'?2:p.id==='bluepill'?4:8,fastStepper:p.fastStepper||0,sd:1,servo:p.servo,buzzer:p.buzzer,ir:1,timer1:p.id==='avr328'?1:0};
  Object.keys(limits).forEach(function(k){if((counts[k]||0)>limits[k])error({id:'limits',name:p.name},'maximum '+limits[k]+' '+k+' device(s).');});
  if(counts.servo&&p.id!=='pico')timers[p.servoTimer]=['Servo'];
  if(p.id==='pico'){var tones=new Set(live.filter(function(r){return r.type==='inout_tone'||r.type==='music_buzzer'&&r.fields.ENGINE==='HARDWARE';}).map(function(r){return pin(p,r.fields.PIN);})),pixels=new Set(live.filter(function(r){return r.type==='device_neopixel'||r.type==='neopixel_init';}).map(function(r){return r.owner;})),pio=(counts.servo||0)+pixels.size+tones.size;if(pio>8)error({id:'limits',name:'PIO'},'Servo, NeoPixel and tone together need '+pio+' state machines; Pico has 8.');if(tones.size)notes.push('Pico tone reserves one PIO state machine per used pin; noTone releases it. Static validation assumes these outputs can overlap.');}
  function timerUse(timer,what){if(timers[timer]&&timers[timer].length)error({id:'timers',name:what},timer+' is already used by '+timers[timer].join(', ')+'.');else timers[timer]=[what];}
  if(counts.fastStepper)timerUse('Timer1','FastAccelStepper');
  if(counts.timer1)timerUse('Timer1','Timer1 interrupt');
  if(counts.buzzer)timerUse('Timer2','Music');
  if(counts.ir&&p.id==='avr328')timerUse('Timer2','IRremote');
  if(counts.ir&&p.id==='bluepill')timerUse('TIM4','IRremote');
  if(counts.tone&&p.id==='avr328')timerUse('Timer2','tone');
  if(counts.tone&&p.id==='bluepill')timerUse('TIM3','tone');
  ['0','1','2'].forEach(function(n){if(counts['rawTimer'+n])timerUse('Timer'+n,'Direct timer registers / ISR');});
  Object.keys(waveClaims).forEach(function(t){var rs=waveClaims[t];timerUse(t,'Hardware waveform');var frequencies=new Set(rs.filter(function(r){return r.type==='device_servo';}).map(function(r){return Number(r.fields.FRAME_HZ||50);}));if(frequencies.size>1)error({id:'timers',name:'Hardware Servo'},t+' channels must use the same refresh Hz.');if(rs.length>1&&rs.some(function(r){return r.type==='music_buzzer';}))error({id:'timers',name:'Hardware buzzer'},t+' supplies one independent note frequency; other waveform devices cannot share it.');});
  live.forEach(function(r){var s=spec(r);if(s)Object.keys(s.pins||{}).forEach(function(k){if(s.pins[k]!=='pwm')return;var t=(p.pwmTimer||{})[pin(p,r.fields[k])];if(timers[t]&&timers[t].length)error(r,'PWM timer '+t+' is used by '+timers[t].join(', ')+'.');});});
  Object.keys(pwmClaims).forEach(function(t){var xs=pwmClaims[t];xs.forEach(function(x,i){xs.slice(0,i).forEach(function(y){if(x.pin===y.pin)return;var msg='';if(x.channel&&x.channel===y.channel)msg='PWM channel '+t+'/'+x.channel+' is shared by '+label(p,x.pin)+' and '+label(p,y.pin)+'; independent duties are unavailable.';else if(p.id==='bluepill'&&x.remap!==y.remap)msg='PWM remap on '+t+' conflicts between '+label(p,x.pin)+' and '+label(p,y.pin)+'. Use pins with a compatible timer mapping.';if(msg){error(x.record,msg);error(y.record,msg);}});});});
  if(counts.fastStepper){notes.push('FastAccelStepper: STEP D9/D10, Timer1; library rating at 16 MHz: 50000 steps/s for one motor, 37000 each for two. Other interrupts and the driver can lower this.');if(p.clockMHz===8)notes.push('8 MHz timer stepping is compile-checked only; the 16 MHz speed rating does not apply.');}
  if(live.some(function(r){return /^(device_stepper_|accel_|stepper_)/.test(r.type)&&!(r.type==='device_stepper_driver'&&r.fields.ENGINE==='TIMER')&&spec(r)&&spec(r).pins;}))notes.push('Loop stepper engines need frequent service: AccelStepper is about 4000 steps/s on 16 MHz AVR under favourable conditions. Delay, ADC, Serial and displays reduce throughput.');
  if(counts.hardwareServo)notes.push('Hardware Servo: autonomous PWM edges; shared timer channels must use one refresh rate. Calibrate pulse endpoints for the actual servo.');
  if(counts.hardwareBuzzer)notes.push('Hardware buzzer: autonomous waveform, no audio-rate ISR. AVR/STM32 note expiry is serviced in loop; long blocking code prolongs notes. AVR D11 minimum is about 31 Hz at 16 MHz; waveform OK reports unrepresentable frequencies.');
  if(counts.tone&&p.id!=='pico')notes.push('tone supports one active output at a time; stop it with noTone before playing another pin.');
  if(p.id==='avr328'&&(counts.fastStepper||counts.servo||counts.buzzer||counts.tone)&&live.some(function(r){return /^(device_neopixel|neopixel_|device_dht|dht_|grove_serial_lcd_|grove_bluetooth_slave|avr_atomic)/.test(r.type);}))notes.push('NeoPixel, DHT, SoftwareSerial and long atomic sections can delay timer interrupts. Schedule those transfers while motion/audio timing can tolerate interruptions.');
  if(counts.rawTimer0)notes.push('Changing Timer0 can change millis, micros, delay and polled stepper timing.');
  return {errors:errors,claims:claims,counts:counts,timers:timers,rows:rows,notes:Array.from(new Set(notes))};
 }
 function choices(records,id,field,p){records=records.map(function(r){return r.id===id?Object.assign({},r,{disabled:false}):r;});var r=records.filter(function(r){return r.id===id;})[0];if(!r||!specs[r.type])return [];var s=spec(r),kind=(s.pins||{})[field];if(!kind)return [];
  return (p[kind]||[]).filter(function(v){var copy=records.map(function(x){if(x.id!==id)return x;var f=Object.assign({},x.fields);f[field]=v;return Object.assign({},x,{fields:f});});
   var a=analyze(copy,p),physical=pin(p,v),own=normalized(copy).filter(function(x){return x.id===id;})[0];
   if(s.avr&&p.id!=='avr328')return false;
   var timer=s.resource==='hardwareServo'||s.resource==='hardwareBuzzer'&&p.id!=='pico'?(p.pwmTimer||{})[pin(p,own.fields.PIN)]:s.resource==='servo'?p.servoTimer:s.resource==='fastStepper'||s.resource==='timer1'?'Timer1':s.resource==='buzzer'||s.resource==='tone'?(p.id==='avr328'?'Timer2':p.id==='bluepill'?'TIM3':''):s.resource==='ir'?(p.id==='avr328'?'Timer2':p.id==='bluepill'?'TIM4':''):'';
   if(timer&&a.errors.some(function(e){return e.id==='timers'&&e.message.indexOf(timer)>=0;}))return false;
   if(p.id==='pico'&&a.errors.some(function(e){return e.id==='limits'&&e.message.indexOf('PIO:')===0;}))return false;
   var candidates=[physical];if(s.pair)candidates.push(nextPin(physical));
   return !a.errors.some(function(e){return e.id===id&&(e.message.indexOf(field+' needs')>=0||e.message.indexOf('PWM timer')>=0||e.message.indexOf('PWM channel')>=0||e.message.indexOf('PWM remap')>=0||candidates.some(function(c){return e.message.indexOf(label(p,c)+' is occupied')>=0;}));})&&!candidates.some(function(c){return (a.claims[c]||[]).some(function(cl){return cl.id!==id&&!(s.read&&cl.irq)&&!(s.irq&&cl.observer)&&!(s.gpio&&cl.share==='gpio:'+c)&&!(s.legacyServo&&cl.share==='servo:'+c)&&!(s.legacy&&cl.share.indexOf(own.owner+':')===0);});});
  });
 }
 // Plan a new device or an explicit engine change without mutating the project.
 // Existing invalid XML stays visible; only newly introduced conflicts reject a plan.
 function assignment(records,record,p,engine){
  var other=records.filter(function(r){return r.id!==record.id;}),copy=Object.assign({},record,{disabled:false,fields:Object.assign({},record.fields)});if(engine!==undefined)copy.fields.ENGINE=engine;
  var s=spec(copy),keys=Object.keys(s&&s.pins||{}),defaults=Object.assign({},copy.fields),baseline=analyze(other,p).errors.map(function(e){return e.id+':'+e.message;}),reason='No compatible free pins for this engine.';
  keys.forEach(function(k){copy.fields[k]='';});
  function visit(index){
   if(index===keys.length){var a=analyze(other.concat([copy]),p),err=a.errors.find(function(e){return e.id===copy.id||baseline.indexOf(e.id+':'+e.message)<0;});if(err){reason=err.message;return null;}return Object.assign({},copy.fields);}
   var k=keys[index],opts=choices(other.concat([copy]),copy.id,k,p);opts.sort(function(a,b){return Number(b===defaults[k])-Number(a===defaults[k])||Number(p.serial.indexOf(a)>=0)-Number(p.serial.indexOf(b)>=0);});
   for(var i=0;i<opts.length;i++){copy.fields[k]=opts[i];var found=visit(index+1);if(found)return found;}
   copy.fields[k]='';if(!opts.length){var probe=Object.assign({},copy,{fields:Object.assign({},copy.fields)});probe.fields[k]=(p[s.pins[k]]||[])[0]||'';var conflict=analyze(other.concat([probe]),p).errors.sort(function(a,b){return Number(b.id==='timers'||b.id==='limits')-Number(a.id==='timers'||a.id==='limits');}).find(function(e){return baseline.indexOf(e.id+':'+e.message)<0&&(e.id==='limits'||e.id==='timers'||e.id===copy.id&&/occupied|pulse endpoints|refresh/.test(e.message));});reason=conflict?conflict.message:'No free '+s.pins[k]+' pin for '+k+'. Check occupied pins and timer owners in Connections.';}return null;
  }
  var fields=visit(0);return {available:!!fields,fields:fields,reason:fields?'':reason};
 }
 function engines(records,id,p){var record=records.find(function(r){return r.id===id;}),defs=record&&p.capabilities&&p.capabilities.engines[record.type];return defs?defs.map(function(d){var candidate=Object.assign({},record,{fields:Object.assign({},record.fields)});Object.keys(d.defaults||{}).forEach(function(k){if((p[d.pins[k]]||[]).indexOf(pin(p,candidate.fields[k]))<0)candidate.fields[k]=d.defaults[k];});return Object.assign({},d,assignment(records,candidate,p,d.value));}):null;}
 return {profile:profile,specs:specs,spec:spec,pin:pin,label:label,analyze:analyze,choices:choices,nextPin:nextPin,assignment:assignment,engines:engines};
});
