const fs=require('fs'),path=require('path'),assert=require('assert'),{JSDOM}=require('jsdom');
const sourceRoot='blockly';
const out=path.resolve('blockly/apps/blocklyduino');
const app=path.join(sourceRoot,'apps/blocklyduino/index.html');
const win=new JSDOM(fs.readFileSync(app,'utf8'),{url:'http://127.0.0.1:8080/blockly/apps/blocklyduino/index.html',runScripts:'outside-only'}).window;
const files=['blockly_compressed.js','blocks_compressed.js','arduino_compressed.js','msg/js/en.js'].map(f=>fs.readFileSync(path.join(sourceRoot,f),'utf8'));
for(const f of ['board_capabilities.js','extra_blocks.js','lcd20x4_blocks.js','popular_blocks.js','program_blocks.js','math_blocks.js','user_blocks.js','device_blocks.js','storage_blocks.js','image_blocks.js','music_blocks.js','sd_music_blocks.js','logic_blocks.js','bit_blocks.js','avr_blocks.js','bus_blocks.js','ux_blocks.js','device_catalog.js','buffer_blocks.js','project_devices.js','motion_math.js','field_message.js','serial_blocks.js','serial_message_blocks.js','serial_image_blocks.js'])files.push(fs.readFileSync(path.join(out,f),'utf8'));
win.eval(files.join('\n')+'\nwindow.TestBlockly=Blockly;');const B=win.TestBlockly;
function load(xml){const ws=new B.Workspace();B.mainWorkspace=ws;B.Xml.domToWorkspace(ws,B.Xml.textToDom(xml));return ws;}
function save(ws){return B.Xml.domToText(B.Xml.workspaceToDom(ws));}
function generate(ws){B.mainWorkspace=ws;return B.Arduino.workspaceToCode(ws);}
function newBlock(ws,type,fields){B.mainWorkspace=ws;const b=B.Block.obtain(ws,type);for(const k in fields)b.setFieldValue(String(fields[k]),k);return b;}
function outer(node){return new win.XMLSerializer().serializeToString(node);}
function categories(xml){return Array.from(xml.children).filter(el=>el.tagName.toLowerCase()==='category');}
function blockTypes(xml){return Array.from(xml.querySelectorAll('block')).map(x=>x.getAttribute('type'));}
function directBlocks(xml){return Array.from(xml.children).filter(el=>el.tagName.toLowerCase()==='block');}
function fields(block){const result={};for(const c of block.children)if(c.tagName.toLowerCase()==='field')result[c.getAttribute('name')]=c.textContent;return result;}
function base(){const b=win.document.getElementById('toolbox');assert(b,'Real app toolbox exists');return b.cloneNode(true);}
function evaluateNew(){win.Blockly=win.TestBlockly;return win.BlocklyProjectDevices;}
module.exports={fs,path,assert,win,B,out,load,save,generate,newBlock,outer,categories,blockTypes,directBlocks,fields,base,evaluateNew};
