/* Local workspace wiring and compiler resource feedback. No hardware probing. */
function parseCompileUsage(text){
 var flash=/Sketch uses ([\d,]+) bytes[\s\S]*?Maximum is ([\d,]+) bytes/i.exec(text);
 var ram=/Global variables use ([\d,]+) bytes[\s\S]*?Maximum is ([\d,]+) bytes/i.exec(text);
 function size(m){if(!m)return null;var used=Number(m[1].replace(/,/g,'')),total=Number(m[2].replace(/,/g,''));return{used:used,total:total,percent:Math.round(100*used/total)};}
 return{flash:size(flash),ram:size(ram)};
}
function showCompileUsage(detail){
 var el=document.getElementById('build_usage');if(!el)return;
 var u=parseCompileUsage(detail||''),parts=[];
 if(u.flash)parts.push('Flash '+u.flash.used+' / '+u.flash.total+' B ('+u.flash.percent+'%)');
 if(u.ram)parts.push('Static RAM '+u.ram.used+' / '+u.ram.total+' B ('+u.ram.percent+'%)');
 el.textContent=parts.length?'Last build: '+parts.join(' · '):'';el.title='Compiler estimate for this build. Static RAM excludes stack and runtime allocations.';
}
function workspaceConnections(blocks){
 var defs={irq_external:['PIN'],irq_pin_change:['PIN'],irq_timer1:[],ll_spi_device:['CS'],ll_i2c_device:[],device_stepper_driver:['STEP','DIR'],device_stepper_coils:['IN1','IN2','IN3','IN4'],device_servo:['PIN'],device_lcd:[],device_ultrasonic:['TRIG','ECHO'],device_ds18b20:['PIN'],device_dht:['PIN'],device_neopixel:['PIN'],device_oled:[],device_oled_spi:['CS','DC','RESET'],device_tft:['CS','DC','RESET'],device_shift595:['DATA','CLOCK','LATCH'],device_ir_nec:['PIN'],music_buzzer:['PIN'],st_i2c_eeprom:[],st_spi_eeprom:['CS'],st_spi_flash:['CS'],st_sd:['CS']};
 var rows=[],pins={},warnings=[];
 function pinId(raw){return /^A\d+$/.test(raw)?String(14+Number(raw.slice(1))):String(raw).replace(/^D/,'');}
 function pinText(id){return Number(id)>=14&&Number(id)<=19?'A'+(Number(id)-14):'D'+id;}
 function use(row,raw,role,shared){if(raw===null||raw==='')return;var id=pinId(raw);row.wires.push(role+' '+pinText(id));(pins[id]||(pins[id]=[])).push({name:row.name,role:role,shared:shared||''});}
 blocks.forEach(function(b){if(b.disabled||!Object.prototype.hasOwnProperty.call(defs,b.type))return;
  var row={name:b.getFieldValue('NAME')||(b.type==='irq_timer1'?'Timer1 interrupt':b.type),type:b.type,wires:[],id:b.id};
  defs[b.type].forEach(function(f){use(row,b.getFieldValue(f),f,'');});
  if(['device_lcd','device_oled','st_i2c_eeprom','ll_i2c_device'].indexOf(b.type)>=0){use(row,'A4','SDA','I2C');use(row,'A5','SCL','I2C');row.address=b.getFieldValue('ADDR');}
  if(['device_oled_spi','device_tft','st_spi_eeprom','st_spi_flash','st_sd','ll_spi_device'].indexOf(b.type)>=0){use(row,'11','MOSI','SPI');use(row,'13','SCK','SPI');if(/^st_/.test(b.type)||b.type==='ll_spi_device')use(row,'12','MISO','SPI');}
  if(b.type==='irq_timer1')row.wires.push('Timer1 · PWM D9/D10 unavailable');
  if(/^irq_(external|pin_change)$/.test(b.type)){row.wires.push(b.getFieldValue('EDGE')+' · '+b.getFieldValue('INPUT'));if(Number(b.getFieldValue('PIN'))<2)warnings.push(row.name+' uses UART RX/TX pins; hardware Serial traffic will also trigger this input.');}
  rows.push(row);
 });
 Object.keys(pins).forEach(function(pin){var uses=pins[pin];if(uses.length<2)return;
  if(uses.every(function(u){return u.shared&&u.shared===uses[0].shared&&u.role===uses[0].role;}))return;
  warnings.push(pinText(pin)+' is used by '+uses.map(function(u){return u.name+' ('+u.role+')';}).join(', ')+'. Check whether this sharing is intentional.');
 });
 var addresses={};rows.filter(function(r){return r.address;}).forEach(function(r){var k=String(parseInt(r.address,0));(addresses[k]||(addresses[k]=[])).push(r.name);});
 Object.keys(addresses).forEach(function(k){if(addresses[k].length>1)warnings.push('I2C address 0x'+Number(k).toString(16)+': '+addresses[k].join(', ')+'. Check for an address conflict.');});
 if(rows.some(function(r){return r.type==='irq_timer1';}))warnings.push('Timer1 is owned by the periodic interrupt. Servo and analogWrite PWM on D9/D10 cannot share Timer1.');
 return{rows:rows,warnings:warnings};
}
function openConnections(){
 var old=document.getElementById('connections_dialog');if(old)old.remove();
 var dialog=document.createElement('dialog');dialog.id='connections_dialog';
 var heading=document.createElement('h2');heading.textContent='Connections';dialog.appendChild(heading);
 var note=document.createElement('p');note.textContent='Declared wiring for this Pro Mini. Shared SPI and I2C bus lines are expected. Direct register operations and arbitrary code are not inferred here. This view does not test the hardware.';dialog.appendChild(note);
 var data=workspaceConnections(Blockly.mainWorkspace.getAllBlocks());
 if(!data.rows.length){var empty=document.createElement('p');empty.textContent='No declared devices or pin interrupts yet. Use Add device or the Interrupts category.';dialog.appendChild(empty);}
 var table=document.createElement('table'),header=document.createElement('tr');['Device / interrupt','Connections'].forEach(function(t){var th=document.createElement('th');th.textContent=t;header.appendChild(th);});table.appendChild(header);
 data.rows.forEach(function(row){var tr=document.createElement('tr'),name=document.createElement('td'),wires=document.createElement('td'),link=document.createElement('button');link.type='button';link.textContent=row.name;link.onclick=function(){dialog.close();var b=Blockly.mainWorkspace.getBlockById(row.id);if(b)b.select();};name.appendChild(link);wires.textContent=row.wires.join(' · ')+(row.address?' · address '+row.address:'');tr.appendChild(name);tr.appendChild(wires);table.appendChild(tr);});dialog.appendChild(table);
 data.warnings.forEach(function(w){var p=document.createElement('p');p.className='connection-warning';p.textContent=w;dialog.appendChild(p);});
 var sound=data.rows.some(function(r){return r.type==='music_buzzer';});if(sound){var timer=document.createElement('p');timer.textContent='Music uses Timer2. Timer0 timekeeping and Timer1 remain available; core tone, IRremote and PWM on D3/D11 conflict.';dialog.appendChild(timer);}
 var close=document.createElement('button');close.type='button';close.textContent='Close';close.onclick=function(){dialog.close();};dialog.appendChild(close);document.body.appendChild(dialog);dialog.showModal();
}
