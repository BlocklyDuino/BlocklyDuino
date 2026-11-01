const fs=require('fs'),path=require('path'),{JSDOM}=require('jsdom');
const root='blockly',app=root+'/apps/blocklyduino';
const w=new JSDOM('<html><body></body></html>',{runScripts:'outside-only'}).window;
const files=['blockly_compressed.js','blocks_compressed.js','arduino_compressed.js','msg/js/en.js'].map(x=>root+'/'+x).concat(['board_capabilities.js','extra_blocks.js','lcd20x4_blocks.js','popular_blocks.js','program_blocks.js','math_blocks.js','user_blocks.js','device_blocks.js','storage_blocks.js','music_blocks.js','sd_music_blocks.js','image_blocks.js','bit_blocks.js','logic_blocks.js','avr_blocks.js','bus_blocks.js','workspace_inspector.js','ux_blocks.js','field_message.js','serial_blocks.js','serial_message_blocks.js','interrupt_blocks.js','timer_interrupt_blocks.js','device_catalog.js','buffer_blocks.js','project_devices.js','motion_math.js','serial_image_blocks.js'].map(x=>app+'/'+x));
w.eval(files.map(x=>fs.readFileSync(x,'utf8')).join('\n')+'\nwindow.B=Blockly;');const B=w.B;
const html=new JSDOM(fs.readFileSync(app+'/index.html','utf8')).window.document;
const types=[...new Set(Array.from(html.querySelectorAll('#toolbox block')).map(x=>x.getAttribute('type')))];
for(const type of types){if(!B.Blocks[type]||!B.Arduino[type])throw Error('Missing block/generator '+type); const ws=new B.Workspace();const b=B.Block.obtain(ws,type);ws.dispose();}
let count=0;for(const f of fs.readdirSync(app+'/examples').filter(x=>/^\d.*\.xml$/.test(x))){const ws=new B.Workspace();B.Xml.domToWorkspace(ws,B.Xml.textToDom(fs.readFileSync(app+'/examples/'+f,'utf8')));const code=B.Arduino.workspaceToCode(ws);if(!code.includes('void setup()')||!code.includes('void loop()'))throw Error('Incomplete sketch '+f);
if(process.env.GENERATE_SKETCHES){const name=f.replace(/[^a-zA-Z0-9_]/g,'_'),dir=path.join('.test-build/sketches',name);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,name+'.ino'),code);}
ws.dispose();count++;}
console.log('PASS: '+types.length+' toolbox block types and '+count+' installed XML examples.');
