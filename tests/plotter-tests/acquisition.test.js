/* No USB access: the serial client, clock, canvases and downloads are mocked. */
const fs=require('fs'),assert=require('assert/strict'),{JSDOM}=require('jsdom');
const dir='blockly/apps/blocklyduino/';
async function main(){
 const dom=new JSDOM(fs.readFileSync(dir+'serial_plotter.html','utf8'),{url:'http://localhost:8081/',runScripts:'outside-only'});
 const w=dom.window,d=w.document,$=id=>d.getElementById(id);let client,rafs=[],nextTimer=0,timers=new Map(),downloads=[],time=0,painted=[],lastBlob;
 w.requestAnimationFrame=fn=>(rafs.push(fn),rafs.length);
 w.setTimeout=(fn,ms)=>(timers.set(++nextTimer,{fn,ms}),nextTimer);w.clearTimeout=id=>timers.delete(id);
 w.setInterval=()=>1;w.clearInterval=()=>{};w.confirm=()=>true;w.Blob=Blob;
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 w.URL.createObjectURL=blob=>(lastBlob=blob,'blob:mock');w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){downloads.push({name:this.download,blob:lastBlob});};
 w.HTMLCanvasElement.prototype.toBlob=function(fn){fn(new Blob(['png']));};
 w.HTMLCanvasElement.prototype.getContext=function(){let canvas=this;return new Proxy({createImageData:(x,y)=>({data:new Uint8ClampedArray(x*y*4)}),putImageData:image=>painted.push({canvas,data:image.data.slice()}),arc:(...args)=>assert(args.every(Number.isFinite),'Canvas arc received a non-finite coordinate'),lineTo:(...args)=>assert(args.every(Number.isFinite),'Canvas line received a non-finite coordinate')},{get:(o,k)=>o[k]||(()=>{}),set:()=>true});};
 w.SerialClient=function(options){client=this;this.options=options;this.state={connected:false,baud:19200};this.writes=[];this.start=()=>{};this.stop=()=>{};this.write=async(text,ending)=>{this.writes.push({text,ending});};};w.SerialClient.mountControls=()=>{};
 for(const name of ['serial_protocol.js','serial_image.js','serial_image_ui.js','serial_plotter.js'])w.eval(fs.readFileSync(dir+name,'utf8'));
 function draw(){let jobs=rafs.splice(0);time+=200;jobs.forEach(fn=>fn(time));}
 function rx(text){client.options.onEvents([{direction:'rx',text,ts:time}]);draw();}
 function connect(value){client.state.connected=value;client.options.onStatus(client.state);}
 async function retry(){const timer=[...timers].find(([,v])=>v.ms===1800);assert(timer,'A START retry must be scheduled');timers.delete(timer[0]);timer[1].fn();await Promise.resolve();await Promise.resolve();}
 const image={version:1,id:'scan',width:4,height:2,mode:'gray',max:1023};
 const header={version:1,id:'dashboard-a',history:100,fields:[{id:'x'},{id:'light'},{id:'other'},{id:'twice',derive:{op:'formula',expr:'light * 2'}},{id:'rate',derive:{op:'derivative',source:'light',time:'device'}}],widgets:[{type:'line',fields:['light','twice']},{type:'gauge',fields:['light','other'],min:0,max:1023},{type:'bar',fields:['light','other']},{type:'xy',series:[{x:'x',y:'light',label:'Light'},{x:'x',y:'other',label:'Other'}]},{type:'raw',fields:['light','twice','rate']},{type:'image',image}]};
 assert($('stream-start').disabled);connect(true);assert(!client.writes.length,'Connecting must not start hardware automatically');
 client.state.seq=10;
 $('mode').value='manual';$('mode').dispatchEvent(new w.Event('change'));
 await $('stream-start').onclick();assert.deepEqual(client.writes,[{text:'START',ending:'lf'}]);assert.equal($('mode').value,'auto');assert($('stream-status').textContent.includes('Waiting'));
 await retry();assert.equal(client.writes.length,2,'Retry covers the AVR reset/bootloader delay');
 client.options.onEvents([{direction:'rx',seq:6,text:'@plot '+JSON.stringify(header)+'\n',ts:time}]);assert($('stream-status').textContent.includes('Waiting'),'Replayed old headers cannot acknowledge a new START');
 rx('@plot '+JSON.stringify(header)+'\n');assert($('stream-status').textContent.includes('Receiving'));assert(![...timers.values()].some(t=>t.ms===1800),'A valid header cancels retries');
 rx('@data {"id":"dashboard-a","t":0,"values":[0,512,128]}\n@pixel scan 0,0,1023\n');
 assert.equal(d.querySelectorAll('.widget').length,6);assert.equal(d.querySelectorAll('.widget-gauge .instrument-reading').length,2);assert.equal(d.querySelectorAll('.widget-bar .bar-fill').length,2);assert(d.querySelector('.widget-xy canvas').getAttribute('aria-label').includes('2 traces'));assert.equal(d.querySelector('.widget-image canvas').width,4);assert.equal($('dashboard').hidden,false);assert.equal($('scan-panel').hidden,true);
 const scan=d.querySelector('.widget-image canvas');assert(painted.some(p=>p.canvas===scan&&p.data[0]===255));
 $('show-header').click();const code=$('arduino-code').value;assert(code.includes('strcmp(command, "START")'));assert(code.includes('strcmp(command, "STOP")'));assert(code.includes('Serial.begin(19200)'));assert(code.includes('millis() - lastSample'));assert(!code.includes('delay('));assert(code.includes('\\"values\\":[0,0,0]'),'Derived fields must not be included in MCU payload');$('header-close').click();
 fs.mkdirSync('.test-build/plotter-helper',{recursive:true});fs.writeFileSync('.test-build/plotter-helper/plotter-helper.ino',code);
 // Capture keeps revisions and raw/computed values even while paused and after a new header.
 $('capture-limit').value=10;$('capture-start').click();$('pause').click();
 rx('@data {"id":"dashboard-a","t":1000,"values":[1,100,200]}\n@pixel scan 1,0,512\n');
 const next={version:1,id:'dashboard-b',history:100,fields:[{id:'volts',scale:0.01,unit:'V'}],widgets:[{type:'bar',fields:['volts']},{type:'image',image}]};
 rx('@plot '+JSON.stringify(next)+'\n@data [123]\n@pixel scan 2,0,256\n');
 assert.equal($('capture-stop').disabled,false,'A header change must not stop capture');assert.equal(d.querySelector('.widget-image canvas'),scan,'Unchanged image dimensions/config retain earlier pixels');assert($('capture-count').textContent.startsWith('4 / 10'));
 $('save-jsonl').click();let records=(await downloads.at(-1).blob.text()).trim().split('\n').map(JSON.parse);
 assert.deepEqual(records.map(r=>r.kind),['configuration','sample','pixel','configuration','sample','pixel']);
 assert(records[0].revision!==records[3].revision);assert.equal(records[1].revision,records[0].revision);assert.equal(records[4].revision,records[3].revision);assert.equal(records[1].values.twice,200);assert.equal(records[1].raw.light,100);assert.equal(records[1].raw.twice,null);assert.equal(records[4].values.volts,1.23);
 $('save-csv').click();let csv=await downloads.at(-1).blob.text();assert(csv.startsWith('kind,config_revision,'));assert(csv.includes('configuration,'));assert(csv.includes('twice,200,,'));assert(csv.includes('pixel,'));assert(csv.includes('dashboard-b'));
 $('pause').click();draw();assert(painted.some(p=>p.canvas===scan&&p.data[0]===255&&p.data[4]===128&&p.data[8]===64),'Existing pixels survive a hot configuration change');
 await $('stream-stop').onclick();assert.deepEqual(client.writes.at(-1),{text:'STOP',ending:'lf'});assert(client.state.connected,'Stop must not disconnect Monitor');
 // Invalid JSON leaves the current dashboard and capture alive.
 $('configure-json').click();assert($('config-json').value.includes('\n  "version"'));$('config-json').value='{"version":1}';$('json-apply').click();assert($('json-error').textContent);assert.equal($('dashboard-title').textContent,'dashboard-b');$('json-close').click();
 rx('@plot {bad json}\n@data [200]\n');assert.equal($('dashboard-title').textContent,'dashboard-b');assert($('sample-stats').textContent.startsWith('2 samples'));
 // Legacy image headers remain useful after a mixed dashboard, and are capturable too.
 rx('@image {"version":1,"id":"legacy","width":2,"height":1,"max":255}\n@pixel 0,0,99\n');
 assert.equal($('scan-panel').hidden,false);assert.equal(w.PlotterImage.model.pixels[0],99,'Legacy pixels must not get routed into an old dashboard image');
 $('save-jsonl').click();records=(await downloads.at(-1).blob.text()).trim().split('\n').map(JSON.parse);assert(records.some(r=>r.kind==='image-configuration'&&r.image.id==='legacy'));assert.equal(records.at(-1).id,'legacy');
 $('capture-stop').click();$('capture-limit').value=1;$('capture-start').click();rx('@pixel 1,0,200\n');assert($('capture-stop').disabled);$('save-jsonl').click();records=(await downloads.at(-1).blob.text()).trim().split('\n').map(JSON.parse);assert.deepEqual(records.map(r=>r.kind),['image-configuration','pixel']);
 // A chosen manual profile stays chosen; its first sample acknowledges Start.
 $('mode').value='manual';$('mode').dispatchEvent(new w.Event('change'));await $('stream-start').onclick();
 assert.equal($('mode').value,'manual');rx('@plot '+JSON.stringify(header)+'\n@data [50]\n');
 assert.equal($('dashboard-title').textContent,'dashboard-b');assert($('stream-status').textContent.includes('Receiving'));
 assert(![...timers.values()].some(t=>t.ms===1800));await $('stream-stop').onclick();
 await $('stream-start').onclick();rx('@pixel scan 3,0,300\n');
 assert($('stream-status').textContent.includes('Receiving'),'A manual image can acknowledge Start with pixels alone');
 assert(![...timers.values()].some(t=>t.ms===1800));await $('stream-stop').onclick();
 // Explicit Manual Reset keeps the schema but starts a genuinely empty image.
 const previousImage=d.querySelector('.widget-image canvas');$('reset-view').click();draw();const resetImage=d.querySelector('.widget-image canvas');
 assert.notEqual(resetImage,previousImage,'Explicit Reset must not reuse the populated inline image');
 assert(painted.some(p=>p.canvas===resetImage&&p.data.every(value=>value===0)),'Manual Reset clears all retained pixel values');
 assert(d.querySelector('.image-status').textContent.includes('0 pixel updates'));rx('@pixel scan 0,0,1023\n');assert(painted.some(p=>p.canvas===resetImage&&p.data[0]===255),'The preserved Manual schema accepts fresh pixels after Reset');
 // Fresh Auto view waits for a header, even when numeric data arrives.
 $('mode').value='auto';$('mode').dispatchEvent(new w.Event('change'));await $('stream-start').onclick();rx('100,200\n');
 assert($('stream-status').textContent.includes('Waiting'));assert.equal(d.querySelectorAll('.widget').length,0);
 rx('@plot '+JSON.stringify({version:1,id:'new',fields:[{id:'a'},{id:'b'}]})+'\n100,200\n');
 assert($('dashboard-meta').textContent.includes('2 fields'));assert($('stream-status').textContent.includes('Receiving'));
 assert(![...timers.values()].some(t=>t.ms===1800));await $('stream-stop').onclick();
 // No header: exactly three START writes, then an actionable status without disconnecting.
 const before=client.writes.length;await $('stream-start').onclick();await retry();await retry();await retry();assert.equal(client.writes.length-before,3);assert($('notice').textContent.includes('No dashboard header'));assert.equal($('stream-start').disabled,false);
 // Retry cancellation when disconnected or stopped prevents stale commands.
 await $('stream-start').onclick();connect(false);assert(![...timers.values()].some(t=>t.ms===1800));assert($('stream-start').disabled);
 dom.window.close();console.log('PASS acquisition UI: mocked START/STOP and retries; six mixed instruments; calculated gaps; image retention; capture revision/CSV/JSONL; atomic invalid headers; formatted JSON editor');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
