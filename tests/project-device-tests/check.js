const h=require('./harness'),{assert,B,win,fs,path,out}=h;
const api=h.evaluateNew(),catalog=win.BlocklyDeviceCatalog;assert.equal(catalog.length,20);
let checks=0;function ok(test,message){assert(test,message);checks++;}
const base=h.base(),baseText=h.outer(base);
// Include the low-level subtree normally inserted by the app's startup script.
const low=win.document.createElement('category');low.setAttribute('name','Low-level');
for(const [name,type] of [['Bits & bytes','ll_bits_mask'],['AVR registers','avr_port_read'],['SPI commands','ll_spi_transfer'],['I2C commands','ll_i2c_request']]){const c=win.document.createElement('category');c.setAttribute('name',name);const b=win.document.createElement('block');b.setAttribute('type',type);c.appendChild(b);low.appendChild(c);}base.appendChild(low);
const immutable=h.outer(base),ws=h.load('<xml/>');
function tree(){B.mainWorkspace=ws;return api.buildToolbox(ws,base);}
function named(root){return root.querySelector('[data-project-devices="true"]');}
function refs(root,type,key='DEVICE'){return Array.from(root.querySelectorAll('block[type="'+type+'"]')).map(b=>h.fields(b)[key]);}
function catById(root,id){return root.querySelector('category[data-device-id="'+id+'"]');}
let t=tree();ok(h.outer(base)===immutable,'Base XML is untouched');ok(named(t)&&named(t).children.length===0,'No configured devices yields no device actions');
const banned=['Devices','Motion','Displays','Sensors','LEDs and outputs','Storage','Images'];for(const n of banned)ok(!h.categories(t).some(c=>c.getAttribute('name')===n),'Remove generic '+n);
ok(!!t.querySelector('category[name="Program"]'),'Program retained');ok(!!t.querySelector('category[custom="VARIABLE"]'),'Variables retained');ok(!!t.querySelector('category[custom="PROCEDURE"]'),'Functions retained');
ok(!!t.querySelector('block[type="ll_bits_mask"]'),'Bits retained');ok(!!t.querySelector('block[type="avr_port_read"]'),'AVR registers retained');ok(!t.querySelector('block[type="ll_spi_transfer"]'),'Raw SPI actions hidden without named device');ok(!t.querySelector('block[type="ll_i2c_request"]'),'Raw I2C actions hidden without named device');
const a=h.newBlock(ws,'device_servo',{NAME:'pan',PIN:9}),b=h.newBlock(ws,'device_servo',{NAME:'tilt',PIN:10});ok(a.deviceUid!==b.deviceUid,'Identical device models have different UIDs');
t=tree();ok(named(t).children.length===2,'Two named device categories');ok(refs(t,'device_servo_write').includes(a.deviceUid)&&refs(t,'device_servo_write').includes(b.deviceUid),'Actions bind each UID independently');
for(const x of t.querySelectorAll('block[type="device_servo_write"]')){ok(x.querySelector('value[name="ANGLE"] block[type="math_number"] field[name="NUM"]').textContent==='90','Servo angle default is preserved');}
const action=h.newBlock(ws,'device_servo_write',{DEVICE:a.deviceUid});const angle=h.newBlock(ws,'math_number',{NUM:123});action.getInput('ANGLE').connection.connect(angle.outputConnection);
a.setFieldValue('yaw','NAME');t=tree();ok(catById(t,a.deviceUid).getAttribute('name').indexOf('yaw')===0,'Rename updates category');ok(action.getFieldValue('DEVICE')===a.deviceUid,'Rename preserves existing action UID');ok(h.generate(ws).includes('bddev_yaw.write(constrain((long)(123), 0, 180))'),'Existing action generates renamed device');ok(action.getInputTargetBlock('ANGLE')===angle,'Rebuild preserves existing action input');
b.setDisabled(true);t=tree();ok(named(t).children.length===1&&!refs(t,'device_servo_write').includes(b.deviceUid),'Disabled device excluded');b.setDisabled(false);ok(named(tree()).children.length===2,'Reenabled device restored');
const uid=b.deviceUid;b.dispose();t=tree();ok(!refs(t,'device_servo_write').includes(uid),'Deleted device removed');
const saved=h.save(ws),opened=h.load(saved);const restored=opened.getAllBlocks().find(x=>x.type==='device_servo');ok(restored.deviceUid===a.deviceUid,'XML roundtrip keeps UID');const restoredAction=opened.getAllBlocks().find(x=>x.type==='device_servo_write');ok(restoredAction.getFieldValue('DEVICE')===a.deviceUid,'XML roundtrip keeps action link');ok(h.generate(opened)===h.generate(ws),'Device/action XML roundtrip keeps generated code');
ok(h.outer(base)===immutable,'Repeated builds never mutate original toolbox');
// Every catalog entry maps to valid actual block definitions and binds only real reference fields.
let entries=0,defaults=0;for(const meta of catalog){const w=h.load('<xml/>'),d=h.newBlock(w,meta.type,{NAME:'testDevice'});if(meta.type==='st_sd')h.newBlock(w,'music_buzzer',{NAME:'testBuzzer'});const list=api.deviceList(w),current=list.find(x=>x.block===d);ok(!!current,'Catalog device recognized: '+meta.type);const built=api.buildToolbox(w,base),cat=catById(built,current.id);ok(!!cat,'Category generated: '+meta.type);
 for(const type of meta.actions){ok(!!B.Blocks[type],'Action exists: '+type);const nodes=Array.from(cat.querySelectorAll('block[type="'+type+'"]')).filter(x=>x.parentNode.tagName.toLowerCase()==='category');ok(nodes.length===1,'One action per configured device: '+type);const sample=h.newBlock(w,type,{}),ref=meta.type==='music_buzzer'&&sample.getField('BUZZER')?'BUZZER':sample.getField('DEVICE')?'DEVICE':null;if(ref)ok(h.fields(nodes[0])[ref]===current.id,'Bound correct UID: '+type);
 const template=base.querySelector('block[type="'+type+'"]');if(template)for(const value of Array.from(template.children).filter(x=>x.tagName.toLowerCase()==='value')){const found=Array.from(nodes[0].children).find(x=>x.tagName.toLowerCase()==='value'&&x.getAttribute('name')===value.getAttribute('name'));ok(found&&h.outer(found)===h.outer(value),'Nested default retained: '+type+'.'+value.getAttribute('name'));defaults++;}
 entries++;sample.dispose();}
}
// SD music requires both card and buzzer and fills both references when unambiguous.
const sw=h.load('<xml/>'),card=h.newBlock(sw,'st_sd',{NAME:'card'});ok(!api.buildToolbox(sw,base).querySelector('block[type="sd_music_start"]'),'No score action without buzzer');const buzzer=h.newBlock(sw,'music_buzzer',{NAME:'speaker'});const st=api.buildToolbox(sw,base).querySelector('block[type="sd_music_start"]');ok(h.fields(st).DEVICE===card.storageUid&&h.fields(st).BUZZER===buzzer.musicUid,'SD score fills both unambiguous references');
// Collect expected general melody tools separately to report actionable omissions together.
const musicMissing=['music_melody','music_note_item','music_pitch','music_update'].filter(type=>!tree().querySelector('block[type="'+type+'"]'));
console.log('PASS:',checks,'assertions;',entries,'catalog actions;',defaults,'nested defaults;','nested defaults checked.');
console.log('Music tools intentionally hidden until a buzzer is configured:',musicMissing);console.log('Existing block colour type:',typeof a.getColour(),a.getColour());
