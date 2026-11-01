const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const {JSDOM}=require('jsdom');
const source=fs.readFileSync('blockly/apps/blocklyduino/serial_client.js','utf8');
function harness(responses){
  const timers=[],requests=[];
  const context={console,Number,Error,JSON,Array,setTimeout:(fn,delay)=>{timers.push({fn,delay});return timers.length;},clearTimeout:()=>{},fetch:async(path,opts)=>{requests.push({path,opts});let response=responses.shift();if(!response)throw Error('Unexpected request '+path);return {ok:true,status:200,json:async()=>response};}};
  context.window=context;vm.createContext(context);vm.runInContext(source,context);
  return {context,timers,requests,Client:context.SerialClient};
}
async function tick(){await new Promise(r=>setImmediate(r));}
(async()=>{
  const h=harness([{seq:50,session_id:'old',connected:true},{seq:3,latest_seq:3,reset:true,session_id:'new',events:[]},{seq:1,latest_seq:3,session_id:'new',events:[{seq:1,direction:'rx',text:'first\n'}],has_more:true},{seq:3,latest_seq:3,session_id:'new',events:[{seq:2,direction:'rx',text:'second\n'},{seq:3,direction:'rx',text:'third\n'}],has_more:false}]);
  const received=[];let resets=0;
  const client=new h.Client({onEvents:es=>received.push(...es),onReset:()=>resets++});
  await client.start();await tick();assert.equal(client.cursor,0);assert.equal(resets,1);assert.equal(h.timers.shift().delay,0);
  await client.poll(client.generation);assert.equal(client.cursor,1);assert.equal(h.timers.shift().delay,0);
  await client.poll(client.generation);assert.equal(client.cursor,3);assert.deepEqual(received.map(e=>e.seq),[1,2,3]);assert.equal(h.timers.shift().delay,200);
  assert.equal(h.requests[2].path,'/serial/events?after=0');client.stop();
  // Session ID changes must trigger a replay even if the new server has exceeded the old cursor.
  const h2=harness([{seq:2,session_id:'A'},{seq:10,latest_seq:10,session_id:'B',events:[{seq:3,text:'skip'}]}]);
  let count=0;const c2=new h2.Client({onEvents:()=>count++});await c2.start();await tick();assert.equal(c2.cursor,0);assert.equal(count,0);c2.stop();
  // Cursor zero is a valid new value, not a fallback to the previous cursor.
  const h3=harness([{seq:4,session_id:'A'},{seq:0,session_id:'A',events:[]}]);const c3=new h3.Client();await c3.start();await tick();assert.equal(c3.cursor,0);c3.stop();
  // A delayed request from a stopped generation cannot add data.
  const h4=harness([{seq:0}]);const c4=new h4.Client({onEvents:()=>{throw Error('stopped delivery');}});c4.running=true;c4.generation=1;let resolve;
  h4.context.fetch=()=>new Promise(r=>resolve=r);const pending=c4.poll(1);c4.stop();resolve({ok:true,json:async()=>({seq:1,events:[{text:'x'}]})});await pending;assert.equal(c4.cursor,0);
  // Controls retain edits on repeated status polling and accept the new shared settings after connection changes.
  const dom=new JSDOM('<div id="connection"></div>',{url:'http://127.0.0.1:8080',runScripts:'outside-only'});
  const w=dom.window;w.fetch=async()=>({ok:true,json:async()=>({ports:[{path:'/dev/a',label:'USB'},{path:'/dev/b',label:'USB'}],default_port:'/dev/a',baud:9600})});w.eval(source);
  const mountClient=new w.SerialClient();mountClient.state={port:'/dev/a',baud:9600,connected:false};const controls=w.SerialClient.mountControls(w.document.getElementById('connection'),mountClient);await tick();
  const select=w.document.querySelector('select'),baud=w.document.querySelector('input');select.value='/dev/b';baud.value='57600';controls.status({port:'/dev/a',baud:9600,connected:false});assert.equal(select.value,'/dev/b');assert.equal(baud.value,'57600');controls.status({port:'/dev/b',baud:115200,connected:true});assert.equal(baud.value,'115200');dom.window.close();
  // Monitor line joining, interleaved directions, retention, and persisted command history.
  const html=fs.readFileSync('blockly/apps/blocklyduino/serial_monitor.html','utf8');const mon=new JSDOM(html,{url:'http://127.0.0.1:8080',runScripts:'outside-only'});const m=mon.window;let options,render,sends=[];
  m.localStorage.setItem('blocklyduino.serial.commands',JSON.stringify(['old','latest']));
  m.SerialClient=function(o){options=o;this.start=()=>{};this.stop=()=>{};this.write=async(text,ending)=>sends.push({text,ending});};m.SerialClient.mountControls=()=>{};m.setInterval=fn=>{render=fn;};m.eval(fs.readFileSync('blockly/apps/blocklyduino/serial_monitor.js','utf8'));
  const input=m.document.getElementById('send-text');input.dispatchEvent(new m.KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true}));assert.equal(input.value,'latest');
  m.document.getElementById('timestamps').checked=false;
  options.onEvents([{direction:'rx',text:'te'},{direction:'rx',text:'mp:2'},{direction:'tx',text:'command\n'},{direction:'rx',text:'3\n'}]);render();assert.equal(m.document.getElementById('serial-log').textContent,'RX temp:2\nTX command\nRX 3\n');
  options.onReset({});render();assert(m.document.getElementById('serial-log').textContent.includes('Serial service restarted'));
  input.value='fresh';await m.document.getElementById('send-form').onsubmit({preventDefault(){}});assert.equal(sends[0].text,'fresh');input.dispatchEvent(new m.KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true}));assert.equal(input.value,'fresh');
  options.onEvents([{direction:'rx',text:'x'.repeat(210000)+'\n'}]);render();assert(m.document.getElementById('log-stats').textContent.includes('discarded'));assert(m.document.getElementById('serial-log').textContent.length<210000);
  options.onEvents([{direction:'rx',text:'kept\n'}]);render();assert(m.document.getElementById('serial-log').textContent.includes('kept'));mon.window.close();
  console.log('Frontend tests passed: restart replay, cursor zero, bounded catch-up, generation cancellation, editable controls, line assembly, retention, command history.');
})().catch(e=>{console.error(e);process.exitCode=1;});
