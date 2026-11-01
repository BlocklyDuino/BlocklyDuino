/* SPDX-License-Identifier: Apache-2.0 */
(function(){'use strict';
 var R=BoardResources,p=null,pending=null,installed=false;
 function records(ws){var blocks=(ws||Blockly.mainWorkspace).getAllBlocks();return blocks.map(function(b){var f={};b.inputList.forEach(function(i){i.fieldRow.forEach(function(v){if(v.name)f[v.name]=b.getFieldValue(v.name);});});if(/^lcd_user_/.test(b.type)){var init=blocks.find(function(c){return c.type==='lcd_user_init'&&!c.disabled;});f.ADDR=init?init.getFieldValue('ADDR'):'0x27';}var mask=b.getInputTargetBlock&&b.getInputTargetBlock('MASK');if(mask&&mask.type==='math_number')f._MASK=Number(mask.getFieldValue('NUM'));return{id:b.id,type:b.type,name:f.NAME||b.type,fields:f,disabled:b.disabled||(b.getInheritedDisabled&&b.getInheritedDisabled())};});}
 function analysis(ws){return R.analyze(records(ws),p||R.profile(''));}
 function options(b,key){if(!p)return null;var rs=records(b.workspace.isFlyout?Blockly.mainWorkspace:b.workspace);if(!rs.some(function(r){return r.id===b.id;}))rs=rs.concat(records(b.workspace).filter(function(r){return r.id===b.id;}));return R.choices(rs,b.id,key,p).map(function(v){return[R.label(p,v),v];});}
 function engineOptions(b){return p&&R.engines(records(b.workspace.isFlyout?Blockly.mainWorkspace:b.workspace),b.id,p);}
 function changeEngine(b,value){var opts=engineOptions(b),plan=opts&&opts.find(function(e){return e.value===value&&e.available;});if(!plan)return null;
  var changed=[];Object.keys(R.spec({type:b.type,fields:plan.fields}).pins||{}).forEach(function(k){if(b.getFieldValue(k)!==plan.fields[k])changed.push(k+' → '+R.label(p,plan.fields[k]));});
  b.setFieldValue(value,'ENGINE');if(b.type==='device_stepper_driver'&&value==='TIMER'&&b.getFieldValue('DRIVE_MODE')==='CONTINUOUS'){b.setFieldValue('RAMPED','DRIVE_MODE');changed.push('motion → continuous with acceleration');}Object.keys(R.spec({type:b.type,fields:plan.fields}).pins||{}).forEach(function(k){b.setFieldValue(plan.fields[k],k);});
  if(window.editorStatus)editorStatus(changed.length?'Engine changed. Wiring changed: '+changed.join(', ')+'. Check Connections before connecting hardware.':'Engine changed. Wiring is unchanged.',false);setTimeout(update,0);return value;
 }
 function wire(b){var s=R.specs[b.type];if(!s)return;
  var engine=b.getField('ENGINE');if(engine&&!engine.resourceWired_){engine.resourceWired_=true;var originalEngine=engine.menuGenerator_;engine.menuGenerator_=function(){var opts=engineOptions(b);if(!opts)return typeof originalEngine==='function'?originalEngine.call(this):originalEngine;var available=opts.filter(function(e){return e.available;}).map(function(e){return[e.label,e.value];});return available.length?available:[['No compatible engine — see Connections','']];};engine.changeHandler_=function(value){var opts=engineOptions(b);return opts?changeEngine(b,value):value;};}
  Object.keys(s.pins||{}).forEach(function(key){var field=b.getField(key);if(!field&&s.fixed&&s.fixed[key]){field=new Blockly.FieldDropdown([[R.label(p||R.profile('arduino:avr:uno'),s.fixed[key]),s.fixed[key]]]);b.appendDummyInput().appendField(key).appendField(field,key);}if(!field||field.resourceWired_)return;field.resourceWired_=true;if(s.fixed&&s.fixed[key]){field.EDITABLE=false;if(field.updateEditable)field.updateEditable();return;}var original=field.menuGenerator_;
   field.menuGenerator_=function(){var list=options(b,key);if(list===null)return typeof original==='function'?original.call(this):original;return list.length?list:[['No compatible free pin','']];};
   field.changeHandler_=function(value){var list=options(b,key);return !list||list.some(function(x){return x[1]===value;})?value:null;};
  });
  if(s.bus&&!b.getInput('BOARD_BUS')){var input=b.appendDummyInput('BOARD_BUS'),field=new Blockly.FieldDropdown([[s.bus,s.bus]]);input.appendField(field,'BOARD_BUS');field.EDITABLE=false;if(field.updateEditable)field.updateEditable();}
 }
 function update(){if(!p||!Blockly.mainWorkspace)return;var ws=Blockly.mainWorkspace,a=analysis(ws);
  ws.getAllBlocks().forEach(function(b){var s=R.specs[b.type];if(!s)return;wire(b);
   Object.keys(s.pins||{}).forEach(function(key){var field=b.getField(key),opts=options(b,key);if(!field||!opts)return;var editable=!(s.fixed&&s.fixed[key])&&(opts.length>1||(opts.length===1&&opts[0][1]!==field.getValue()));if(field.EDITABLE!==editable){field.EDITABLE=editable;if(field.updateEditable)field.updateEditable();}});
   if(s.bus){var bus=p.buses[s.bus],f=b.getField('BOARD_BUS');if(f)f.setText(bus?s.bus+' · '+Object.keys(bus).map(function(k){return k+' '+R.label(p,bus[k]);}).join(' · '):'No compatible '+s.bus+' bus');}
   var errs=a.errors.filter(function(e){return e.id===b.id;});b.setWarningText(errs.length?errs.map(function(e){return e.message;}).join('\n'):null);
  });
  var badge=document.getElementById('resource-status');if(badge){badge.textContent=a.errors.length?a.errors[0].message:(!p.known?'Pin validation unavailable for this board.':(a.notes.length?'Pins checked · '+a.notes.length+' timing / resource note(s) in Connections':'Pins and peripherals: no conflicts'));badge.title=a.notes.join('\n');badge.className=a.errors.length||!p.known?'error':'';}
  if(window.selected==='connections'&&window.renderConnections)renderConnections();
 }
 function setTarget(fqbn){p=R.profile(fqbn);update();}
 function allocate(b){if(!p||!p.known)throw Error('Select a board with a verified pin profile before adding hardware.');
  var engines=engineOptions(b);if(engines){var engine=engines.find(function(e){return e.available;});if(!engine)throw Error(engines.map(function(e){return e.label+': '+e.reason;}).join('\n'));b.setFieldValue(engine.value,'ENGINE');Object.keys(R.spec({type:b.type,fields:engine.fields}).pins||{}).forEach(function(k){b.setFieldValue(engine.fields[k],k);});b.allocationNote_=engine.description;}
  var s=R.spec({type:b.type,fields:records(b.workspace).find(function(r){return r.id===b.id;}).fields});if(!s)return;
  var fields=Object.keys(s.pins||{}),defaults={};fields.forEach(function(k){defaults[k]=b.getFieldValue(k);b.setFieldValue('',k);});
  // Reserve bus lines before assigning CS/DC/RESET or general-purpose pins.
  fields.forEach(function(k){var opts=R.choices(records(b.workspace),b.id,k,p);if(!opts.length)throw Error('No free '+s.pins[k]+' pin for '+k+'. Required pins are occupied.');var preferred=opts.filter(function(v){return !p.serial.includes(v);});var available=preferred.length?preferred:opts;b.setFieldValue(available.indexOf(defaults[k])>=0?defaults[k]:available[0],k);});
  if(s.bus==='I2C'&&b.getField('ADDR')){var f=b.getField('ADDR'),used=records(b.workspace).filter(function(r){return r.id!==b.id&&!r.disabled&&R.specs[r.type]&&R.specs[r.type].bus==='I2C';}).map(function(r){return Number(r.fields.ADDR);});var opts=f.getOptions_?f.getOptions_():null;if(!opts){opts=[];for(var address=8;address<0x78;address++)opts.push(['0x'+address.toString(16),'0x'+address.toString(16)]);}var free=opts.filter(function(x){return used.indexOf(Number(x[1]))<0;});if(!free.length)throw Error('All supported I2C addresses for this module are occupied.');if(used.indexOf(Number(f.getValue()))>=0)f.setValue(free[0][1]);}
  var a=analysis(b.workspace);var error=a.errors.find(function(e){return e.id===b.id||e.id==='limits'||e.id==='timers';});if(error)throw Error(error.message);
 }
 // Legacy Grove generators use an adjacent signal; honour the actual board map.
 var oldNext=window._get_next_pin;window._get_next_pin=function(raw){if(!p||!p.known)return oldNext(raw);var n=R.nextPin(R.pin(p,raw));if(p.digital.concat(p.analog).indexOf(n)<0)throw Error('No compatible adjacent pin after '+raw);return n;};
 function install(){if(installed)return;installed=true;Blockly.mainWorkspace.addChangeListener(function(){clearTimeout(pending);pending=setTimeout(update,180);});update();}
 // Hook definitions before XML import so the pin selectors are dynamic from birth.
 Object.keys(R.specs).forEach(function(type){var d=Blockly.Blocks[type];if(!d)return;var init=d.init;d.init=function(){init.call(this);wire(this);};});
 // Reading an interrupt input must preserve the handler's INPUT / INPUT_PULLUP setup.
 var read=Blockly.Arduino.inout_digital_read;
 Blockly.Arduino.inout_digital_read=function(){var me=this,pin=this.getFieldValue('PIN');if(p&&records(this.workspace).some(function(r){return !r.disabled&&R.specs[r.type]&&R.specs[r.type].irq&&R.pin(p,r.fields.PIN)===R.pin(p,pin);})){return ['digitalRead('+pin+')',Blockly.Arduino.ORDER_ATOMIC];}return read.call(this);};
 Blockly.Arduino.inout_buildin_led=function(){var pin=p&&p.known?p.led:'LED_BUILTIN';Blockly.Arduino.setups_['setup_output_'+pin]='pinMode('+pin+', OUTPUT);';return 'digitalWrite('+pin+', '+this.getFieldValue('STAT')+');\n';};
 var generate=Blockly.Arduino.workspaceToCode;
 Blockly.Arduino.workspaceToCode=function(ws){if(p){var a=analysis(ws||Blockly.mainWorkspace);if(a.errors.length){var e=Error(a.errors.map(function(x){return x.message;}).join('\n'));e.blockId=a.errors[0].id;throw e;}}return generate.apply(this,arguments);};
 window.BlocklyResources={records:records,analysis:analysis,profile:function(){return p;},setTarget:setTarget,allocate:allocate,engineOptions:engineOptions,changeEngine:changeEngine,install:install,update:update};
})();
