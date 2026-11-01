/* No hardware access. Protocol-driven controls, messages and startup are exercised with a mocked serial transport. */
const fs=require('fs'),assert=require('assert/strict'),{JSDOM}=require('jsdom');
const dir='blockly/apps/blocklyduino/';
async function main(){
 const dom=new JSDOM(fs.readFileSync(dir+'serial_plotter.html','utf8'),{url:'http://localhost:8081/',runScripts:'outside-only'}),w=dom.window,d=w.document,$=id=>d.getElementById(id);let client,raf,clock=0,timer=0,timers=new Map();
 w.requestAnimationFrame=fn=>raf=fn;w.setTimeout=(fn,ms)=>(timers.set(++timer,{fn,ms}),timer);w.clearTimeout=id=>timers.delete(id);w.setInterval=()=>1;w.clearInterval=()=>{};w.confirm=()=>true;
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{},set:()=>true});
 w.SerialClient=function(options){client=this;this.options=options;this.state={connected:false,baud:115200};this.writes=[];this.start=()=>{};this.stop=()=>{};this.write=async(text,ending)=>this.writes.push({text,ending});};w.SerialClient.mountControls=()=>{};
 for(const name of ['serial_protocol.js','serial_plotter.js'])w.eval(fs.readFileSync(dir+name,'utf8'));
 function rx(text){client.options.onEvents([{direction:'rx',text,ts:clock}]);raf(clock+=200);}
 function connect(value){client.state.connected=value;client.options.onStatus(client.state);}
 const header={version:1,id:'interactive',title:'Try these controls',description:'Built-in D13 LED. Change the interval or type a message.',fields:[{id:'value',min:0,max:1023}],widgets:[{type:'line',fields:['value']}],controls:[
  {id:'interval',type:'slider',label:'Interval',unit:'ms',min:50,max:1000,step:50,value:500},
  {id:'gain',type:'number',label:'Gain',min:.5,max:4,step:.5,value:1},
  {id:'enabled',type:'checkbox',label:'Enabled',value:true},
  {id:'label',type:'text',label:'Text',maxLength:24,value:'Hello'},
  {id:'pattern',type:'select',label:'Pattern',options:[{value:'blink',label:'Blink'},{value:'steady',label:'Steady'}],value:'blink'},
  {id:'reset',type:'button',label:'Restart'}
 ]};
 assert(!d.querySelector('#serial-connection').closest('details'),'Connection must be visible outside collapsed settings');
 rx('12,42\n@pixel 0,0,99\n');assert.equal(d.querySelectorAll('.widget').length,0);assert($('notice').textContent.includes('header'));assert(!$('notice').classList.contains('error'));
 rx('@msg Connect the LED. <b>This is text</b>\n');assert.equal($('board-message-text').textContent,'Connect the LED. <b>This is text</b>');assert.equal($('board-message-text').children.length,0);
 rx('@plot '+JSON.stringify(header)+'\n@msg Ready. Press Start.\n');assert.equal(d.querySelectorAll('.program-control').length,6);assert.equal(client.writes.length,0);assert($('board-controls').hidden===false);assert.equal($('dashboard-description').textContent,header.description);assert($('program-control-interval').disabled);
 connect(true);assert(!$('program-control-interval').disabled);rx('@data [123]\n');assert($('stream-status').textContent.includes('Receiving'),'Programs may stream immediately after their header without a Start click');assert.equal(client.writes.length,0);
 $('program-control-interval').value='600';$('program-control-interval').dispatchEvent(new w.Event('input'));assert.equal(client.writes.length,0,'Slider preview never floods serial');await $('program-control-interval').onchange();assert.deepEqual(client.writes.at(-1),{text:'@set interval 600',ending:'lf'});
 rx('@state {"interval":600}\n');assert.equal($('program-control-interval').parentNode.parentNode.querySelector('.control-feedback').textContent,'Confirmed by board');
 $('program-control-enabled').checked=false;await $('program-control-enabled').onchange();assert.equal(client.writes.at(-1).text,'@set enabled 0');
 const gain=$('program-control-gain'),gainSend=gain.parentNode.querySelector('button');gain.value='3.7';let count=client.writes.length;await gainSend.onclick();assert.equal(client.writes.length,count);assert(gain.parentNode.parentNode.querySelector('.control-feedback').classList.contains('error'));gain.value='2.5';await gainSend.onclick();assert.equal(client.writes.at(-1).text,'@set gain 2.5');
 const label=$('program-control-label');label.value='a b "c"';await label.parentNode.querySelector('button').onclick();assert.equal(client.writes.at(-1).text,'@set label a b "c"');
 $('program-control-pattern').value='steady';await $('program-control-pattern').onchange();assert.equal(client.writes.at(-1).text,'@set pattern steady');await $('program-control-reset').onclick();assert.equal(client.writes.at(-1).text,'@do reset');
 count=client.writes.length;rx('@state {"label":"<input>","enabled":false,"pattern":"steady","gain":2.5}\n');assert.equal(client.writes.length,count,'State acknowledgements never send commands');assert.equal(label.value,'a b "c"','Unrelated old board state cannot replace a pending text send');rx('@state '+JSON.stringify({label:'a b "c"'})+'\n');rx('@state {"label":"<input>"}\n');assert.equal(label.value,'<input>');
 await $('stream-start').onclick();assert.equal(d.querySelectorAll('.program-control').length,6,'Start keeps the announced dashboard');rx('@data [500]\n');assert($('stream-status').textContent.includes('Receiving'));assert.equal(d.querySelectorAll('.widget').length,1);
 $('show-header').click();const code=$('arduino-code').value;assert(code.includes('strncmp(command, "@set interval "'));assert(code.includes('strcmp(command, "@do reset")'));assert(code.includes('void sendState()'));assert(code.includes('void onControl'));assert(code.includes('announce();'));assert($('protocol-preview').textContent.includes('@set interval 500'));assert($('protocol-preview').textContent.includes('@do reset'));$('header-close').click();
 fs.mkdirSync('.test-build/interactive-plotter-helper',{recursive:true});fs.writeFileSync('.test-build/interactive-plotter-helper/interactive-plotter-helper.ino',code);
 // Execute the generated helper, not a second implementation of its parser.
 const {spawnSync}=require('node:child_process');
 const stub=String.raw`#include <string>
#include <sstream>
#include <iomanip>
#include <iostream>
#include <cassert>
#define F(x) x
unsigned long fakeMillis=0;
unsigned long millis(){return fakeMillis;}
struct FakeSerial {
 std::string incoming,output;
 void begin(long){}
 int available(){return incoming.size();}
 char read(){char c=incoming[0];incoming.erase(0,1);return c;}
 void write(char c){output+=c;}
 void print(const char *text){output+=text;}
 void print(double n,int precision){std::ostringstream s;s<<std::fixed<<std::setprecision(precision)<<n;output+=s.str();}
 void println(const char *text){output+=text;output+='\n';}
 void println(char c){output+=c;output+='\n';}
} Serial;
`;
 const checks=String.raw`
void send(const std::string &value){Serial.incoming+=value;loop();}
int main(){
 setup();assert(Serial.output.find("@plot ")!=std::string::npos);assert(!streaming);
 send("STA");assert(!streaming);send("RT\r\n");assert(streaming);
 send("@set interval 600\n");assert(parameter0==600);
 send("@set interval 625\n");assert(parameter0==600);
 send("@set interval nan\n");assert(parameter0==600);
 send("@set gain 2.5\n");assert(parameter1==2.5);
 send("@set enabled 0\n");assert(!parameter2);
 send("@set enabled true\n");assert(!parameter2);
 send("@set pattern steady\n");assert(strcmp(parameter4,"steady")==0);
 send("@set pattern unknown\n");assert(strcmp(parameter4,"steady")==0);
 send("@set label a b \"c\" \\ d\n");assert(strcmp(parameter3,"a b \"c\" \\ d")==0);
 send("@set label "+std::string(25,'x')+"\n");assert(strcmp(parameter3,"a b \"c\" \\ d")==0);
 send(std::string(150,'x')+"START\n");assert(streaming);
 send("STOP\n");assert(!streaming);
 send("@do reset\n");assert(Serial.output.find("Action received: reset")!=std::string::npos);
 send("START\n");assert(streaming);fakeMillis=200;loop();
 assert(Serial.output.find("@data ")!=std::string::npos);
 std::cout<<Serial.output;
}
`;
 const host='.test-build/interactive-plotter-helper/host.cpp',binary='.test-build/interactive-plotter-helper/host';fs.writeFileSync(host,stub+code+checks);
 let built=spawnSync('g++',['-std=c++11',host,'-o',binary],{encoding:'utf8'});assert.equal(built.status,0,built.stdout+built.stderr);let ran=spawnSync(binary,[],{encoding:'utf8'});assert.equal(ran.status,0,ran.stdout+ran.stderr);
 const acknowledgements=ran.stdout.split('\n').filter(s=>s.startsWith('@state ')).map(s=>JSON.parse(s.slice(7)));assert(acknowledgements.length>=5);assert.equal(acknowledgements.at(-1).label,'a b "c" \\ d');assert.equal(acknowledgements.at(-1).interval,600);assert.equal(acknowledgements.at(-1).gain,2.5);
 // Full state confirmations must not erase a different unsent draft.
 label.value='My unfinished message';label.dispatchEvent(new w.Event('input'));rx('@state {"interval":600,"label":"old board text","enabled":false}\n');assert.equal(label.value,'My unfinished message');assert(label.parentNode.parentNode.querySelector('.control-feedback').textContent.includes('edit not sent'));
 await label.parentNode.querySelector('button').onclick();label.value='An even newer draft';label.dispatchEvent(new w.Event('input'));rx('@state {"label":"My unfinished message"}\n');assert.equal(label.value,'An even newer draft','Acknowledgement of an older send preserves the newer draft');
 await label.parentNode.querySelector('button').onclick();rx('@state {"label":"My unfinished message"}\n');assert.equal(label.value,'An even newer draft');assert(label.parentNode.parentNode.querySelector('.control-feedback').textContent.includes('waiting for confirmation'));rx('@state {"label":"An even newer draft"}\n');assert(label.parentNode.parentNode.querySelector('.control-feedback').textContent.includes('Confirmed'));
 // Visual editing retains existing descriptions, controls and advanced calculations.
 const advanced=JSON.parse(JSON.stringify(header));advanced.fields.push({id:'double',derive:{op:'formula',expr:'value * 2'}});advanced.widgets[0].fields.push('double');rx('@plot '+JSON.stringify(advanced)+'\n');$('configure').click();assert.equal($('config-controls').children.length,6);$('configuration-form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal($('configuration').open,false);assert.equal($('mode').value,'manual');$('show-header').click();let saved=JSON.parse($('header-text').value.slice(6));assert.equal(saved.fields[1].derive.expr,'value * 2');assert.equal(saved.controls.length,6);assert.equal(saved.description,header.description);$('header-close').click();
 $('reset-view').click();assert.equal(d.querySelectorAll('.program-control').length,6,'Reset keeps an explicit manual dashboard');assert($('board-message').hidden);rx('@plot '+JSON.stringify({version:1,id:'other',fields:[{id:'wrong'}]})+'\n500\n');assert.equal($('dashboard-title').textContent,header.title);
 // Returning to board mode resets stale manual schema and waits for a new header.
 $('mode').value='auto';$('mode').dispatchEvent(new w.Event('change'));assert.equal(d.querySelectorAll('.widget').length,0);assert($('board-controls').hidden);rx('500\n');assert.equal(d.querySelectorAll('.widget').length,0);
 rx('@plot '+JSON.stringify({version:1,id:'control-only',description:'Press the button.',fields:[],widgets:[],controls:[{id:'restart_sequence',type:'button',label:'Go'}]})+'\n');assert.equal(d.querySelectorAll('.program-control').length,1);assert.equal(d.querySelectorAll('.widget').length,0);await $('stream-start').onclick();rx('@msg Button panel ready.\n');assert($('stream-status').textContent.includes('Receiving'));assert(![...timers.values()].some(t=>t.ms===1800),'A configured message-only dashboard can acknowledge Start with its message');$('show-header').click();const buttonCode=$('arduino-code').value;assert(buttonCode.includes('char command[21]'),'Button-only helper must fit its entire action command');assert(!$('protocol-preview').textContent.includes('@state'),'Button-only preview must not instruct empty state acknowledgements');$('header-close').click();
 const buttonHost='.test-build/interactive-plotter-helper/button-host.cpp',buttonBinary='.test-build/interactive-plotter-helper/button-host';
 fs.writeFileSync(buttonHost,stub+buttonCode+String.raw`
int main(){setup();Serial.incoming="START\n@do restart_sequence\nSTOP\n";loop();assert(Serial.output.find("@state ")==std::string::npos);assert(Serial.output.find("Action received: restart_sequence")!=std::string::npos);assert(!streaming);}
`);
 built=spawnSync('g++',['-std=c++11',buttonHost,'-o',buttonBinary],{encoding:'utf8'});assert.equal(built.status,0,built.stdout+built.stderr);ran=spawnSync(buttonBinary,[],{encoding:'utf8'});assert.equal(ran.status,0,ran.stdout+ran.stderr);

 rx('@plot '+JSON.stringify({version:1,id:'messages',description:'Watch the calculation.',fields:[],widgets:[]})+'\n');for(let i=0;i<12;i++)rx('@msg Calculation '+i+'\n');assert.equal($('board-message-text').textContent.split('\n').length,8);assert($('board-message-text').textContent.startsWith('Calculation 4'));$('clear').click();assert($('board-message').hidden);
 // Templates are practical starting points and apply through the same validator.
 $('configure').click();d.querySelector('[data-template="controls"]').click();assert.equal($('config-controls').children.length,5);$('configuration-form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal($('configuration').open,false);assert.equal(d.querySelectorAll('.program-control').length,5);
 connect(false);assert([...d.querySelectorAll('#control-list input,#control-list select,#control-list button')].every(el=>el.disabled));
 dom.window.close();console.log('PASS interaction UI: visible connection; header-only startup; messages; six inputs; safe sends/confirmations; preserved Start; reset/manual; visual templates; executable MCU helper');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
