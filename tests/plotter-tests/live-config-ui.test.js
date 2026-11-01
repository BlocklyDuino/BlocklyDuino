/* Scanner-sized headers and controls through the actual UI/parser, mocked wire only. */
const fs=require('fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root='blockly/apps/blocklyduino/';
async function main(){
 const dom=new JSDOM(fs.readFileSync(root+'serial_plotter.html','utf8'),{url:'http://localhost:8081/',runScripts:'outside-only'}),w=dom.window,d=w.document,$=id=>d.getElementById(id);let client,raf=[],timers=new Map(),timer=0,now=0,seq=0,painted=[],holdWrite=null;
 w.Date.now=()=>now;w.requestAnimationFrame=fn=>(raf.push(fn),raf.length);w.setTimeout=(fn,ms)=>(timers.set(++timer,{fn,ms}),timer);w.clearTimeout=id=>timers.delete(id);w.setInterval=()=>1;w.clearInterval=()=>{};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};w.confirm=()=>true;
 w.HTMLCanvasElement.prototype.getContext=function(){const canvas=this;return new Proxy({createImageData:(width,height)=>({data:new Uint8ClampedArray(width*height*4)}),putImageData:image=>painted.push({canvas,data:image.data.slice()})},{get:(o,k)=>o[k]||(()=>{}),set:()=>true});};
 w.SerialClient=function(options){client=this;this.options=options;this.state={connected:true,baud:9600,seq:0};this.cursor=0;this.writes=[];this.start=()=>{};this.stop=()=>{};this.write=async(text,ending)=>{const tx=++seq;this.state.seq=tx;this.writes.push({text,ending,seq:tx});if(holdWrite)return new Promise(resolve=>{holdWrite.resolve=()=>resolve({seq:tx});});return{seq:tx};};};w.SerialClient.mountControls=()=>{};
 for(const name of ['serial_protocol.js','serial_image.js','serial_image_ui.js','serial_plotter.js'])w.eval(fs.readFileSync(root+name,'utf8'));
 client.options.onStatus(client.state);
 function rx(text,eventSeq=++seq){client.options.onEvents([{direction:'rx',text,seq:eventSeq,ts:now}]);client.cursor=client.state.seq=Math.max(client.state.seq,eventSeq);let jobs=raf.splice(0);now+=100;jobs.forEach(fn=>fn(now));}
 function number(id,value,min,max,step=1){return{id,type:'number',label:id,min,max,step,value,help:'Change this parameter and the board announces its actual configuration. '.repeat(3)};}
 let board={version:1,id:'scanner',title:'Scanner controls',description:'Connect the two servos and A0 sensor. The board reports its current limits. '.repeat(8),fields:[{id:'light',min:0,max:1023}],widgets:[{type:'image',image:{id:'scan',width:32,height:24,mode:'gray',max:1023}},{type:'line',fields:['light']},{type:'gauge',field:'light'}],controls:[number('width',32,1,256),number('height',24,1,256),number('levels',1024,2,65536),number('xmin',20,0,179),number('xmax',160,1,180),number('ymin',30,0,179),number('ymax',150,1,180),number('settle',40,1,1000),number('samples',4,1,32),number('black',0,0,1022),number('white',1023,1,1023),number('gain',1,.5,4,.5),{id:'invert',type:'checkbox',label:'Invert',value:false},{id:'label',type:'text',label:'Name',maxLength:40,value:'Scan'},{id:'mode',type:'select',label:'Mode',options:[{value:'gray',label:'Gray'},{value:'rgb',label:'RGB'}],value:'gray'},{id:'reset',type:'button',label:'Restart'}]};
 function header(){return '@plot '+JSON.stringify(board)+'\n';}
 function setBoard(id,value){board.controls.find(c=>c.id===id).value=value;const img=board.widgets[0].image;img.width=board.controls[0].value;img.height=board.controls[1].value;img.max=board.controls[2].value-1;board.fields[0].max=img.max;}
 function change(id,value){const input=$('program-control-'+id);input.value=String(value);input.dispatchEvent(new w.Event('input'));return input.parentNode.querySelector('button').onclick();}
 function feedback(id){return $('program-control-'+id).closest('.program-control').querySelector('.control-feedback').textContent;}
 async function retry(){const entry=[...timers].find(([,t])=>t.ms<=1800);assert(entry,'Expected retry timer');timers.delete(entry[0]);entry[1].fn();await Promise.resolve();await Promise.resolve();}
 rx(header());assert.equal(d.querySelectorAll('.program-control').length,16);assert.equal(d.querySelector('.widget-image canvas').width,32);
 const draft=$('program-control-label'),originalWidth=$('program-control-width');draft.focus();draft.value='Keep this draft';draft.dispatchEvent(new w.Event('input'));draft.setSelectionRange(4,8);
 await change('width',80);let sent=client.writes.at(-1);assert.equal(sent.text,'@set width 80');rx('@state {"width":32}\n',sent.seq);assert.equal(originalWidth.value,'80');assert(feedback('width').includes('waiting'));
 setBoard('width',80);rx(header());assert.equal($('program-control-width'),originalWidth,'Hot header preserves existing control elements');assert.equal($('program-control-label'),draft);assert.equal(draft.value,'Keep this draft');assert.equal(d.activeElement,draft);assert.equal(draft.selectionStart,4);assert.equal(draft.selectionEnd,8);assert(feedback('width').includes('Confirmed'));assert.equal(d.querySelector('.widget-image canvas').width,80);assert(!originalWidth.disabled);
 // A header may arrive before its HTTP write response. Its confirmation survives.
 holdWrite={};const send=change('width',90);setBoard('width',90);rx(header());assert(feedback('width').includes('Confirmed'));holdWrite.resolve();await send;holdWrite=null;assert(!originalWidth.disabled);assert(feedback('width').includes('Confirmed'));
 // Independent requests can be in flight. One reply must not erase the other.
 await change('height',64);await change('levels',256);setBoard('height',64);rx(header());assert.equal($('program-control-levels').value,'256');assert(feedback('levels').includes('waiting'));setBoard('levels',256);rx(header());const acceptedSeq=seq;assert(feedback('levels').includes('Confirmed'));const image=d.querySelector('.widget-image canvas');assert.equal(image.width,90);assert.equal(image.height,64);
 rx('@state {"height":24,"levels":1024}\n',acceptedSeq-1);assert.equal($('program-control-height').value,'64');assert.equal($('program-control-levels').value,'256');
 rx('@pixel scan 89,63,128\n@data [128]\n');assert(painted.some(p=>p.canvas===image&&p.data[((63*90+89)*4)]===128),'New grayscale maximum is applied immediately');$('show-header').click();let installed=JSON.parse($('header-text').value.slice(6));assert.equal(installed.fields[0].max,255);assert.equal(installed.widgets[0].image.max,255);$('header-close').click();
 // An identical header is still a valid acknowledgement.
 await change('width',90);rx(header());assert(feedback('width').includes('Confirmed'));
 // Rejected values get a targeted reply, while a general unchanged snapshot
 // must not accidentally settle another request still queued at the board.
 await change('width',95);await change('xmin',25);rx(header());rx('@state {"width":90,"xmin":20}\n');assert(feedback('width').includes('waiting'));assert(feedback('xmin').includes('waiting'));
 rx('@state {"width":90}\n');assert.equal(originalWidth.value,'90');assert(feedback('width').includes('Board applied 90'));assert(feedback('width').includes('requested 95'));assert(feedback('xmin').includes('waiting'));assert(!originalWidth.disabled);
 setBoard('xmin',25);rx(header());assert(feedback('xmin').includes('Confirmed'));
 // Missing acknowledgements have a bounded wait and remain an editable draft.
 await change('width',95);rx(header());const beforeInvalid=client.writes.length;await change('width',999);assert.equal(client.writes.length,beforeInvalid,'Invalid edit sends nothing and must not cancel the earlier confirmation deadline');const expiry=[...timers].find(([,t])=>t.ms>=8000);assert(expiry,'A pending control needs a bounded confirmation timer');timers.delete(expiry[0]);now+=expiry[1].ms;expiry[1].fn();assert(feedback('width').includes('No confirmation'));assert(feedback('width').includes('last board value: 90'));assert.equal(originalWidth.value,'999');assert(!originalWidth.disabled);
 await change('width',90);rx(header());assert(feedback('width').includes('Confirmed'));assert(![...timers.values()].some(t=>t.ms>=8000),'Successful replies cancel confirmation timers');
 // A new limit discards an invalid draft explicitly, not a still-valid one.
 board.controls.find(c=>c.id==='label').maxLength=6;rx(header());assert.equal(draft.value,'Scan');assert(feedback('label').includes('Allowed values changed'));
 const valid=header();const broken=JSON.parse(JSON.stringify(board));broken.widgets[0].image.width=0;rx('@plot '+JSON.stringify(broken)+'\n');assert.equal(d.querySelector('.widget-image canvas'),image);assert.equal($('program-control-width').value,'90');
 // A long header takes longer than one retry interval at 9600. Progress defers
 // START without acknowledging before the newline or writing duplicate commands.
 $('reset-view').click();const before=client.writes.length;await $('stream-start').onclick();const long=valid.trimEnd();assert(long.length>2000);let at=0;
 while(at<long.length){rx(long.slice(at,at+500));at+=500;now+=700;if(at<long.length)await retry();assert.equal(client.writes.length,before+1);}
 assert($('stream-status').textContent.includes('Waiting'));rx('\n');assert($('stream-status').textContent.includes('Receiving'));assert.equal(client.writes.length,before+1);assert(![...timers.values()].some(t=>t.ms<=1800));
 // A stalled partial line does not postpone retries forever, and is discarded.
 $('reset-view').click();await $('stream-start').onclick();rx('@plot {"version":');const stalledWrites=client.writes.length;now+=2500;await retry();assert.equal(client.writes.length,stalledWrites+1);rx(valid);assert.equal($('dashboard-title').textContent,'Scanner controls');assert($('stream-status').textContent.includes('Receiving'));
 // Dynamic min==max is an honest fixed control, not a made-up wider range.
 const fixedProfile={version:1,id:'fixed-controls',fields:[],widgets:[],controls:[{id:'columns',type:'number',min:1,max:8,value:4,unit:'px'},{id:'sample',type:'slider',min:0,max:4,value:2}]};
 const fixedHeader=()=>rx('@plot '+JSON.stringify(fixedProfile)+'\n');fixedHeader();
 const columns=$('program-control-columns'),slider=$('program-control-sample'),sendColumns=columns.parentNode.querySelector('button');assert(!columns.disabled);assert(!slider.disabled);
 columns.value='7';columns.dispatchEvent(new w.Event('input'));
 fixedProfile.controls[0].max=1;fixedProfile.controls[0].value=1;fixedProfile.controls[1].min=2;fixedProfile.controls[1].max=2;fixedHeader();
 assert.equal($('program-control-columns'),columns);assert.equal(columns.value,'1');assert.equal(columns.min,'1');assert.equal(columns.max,'1');assert(columns.disabled);assert(sendColumns.disabled);assert(slider.disabled);assert.equal(slider.value,'2');assert(slider.parentNode.querySelector('output').textContent.includes('2'));assert(columns.title.includes('current limits allow only this value'));assert(columns.closest('.program-control').querySelector('.hint').textContent.includes('Fixed at 1 px'));
 const fixedWrites=client.writes.length;await sendColumns.onclick();await slider.onchange();assert.equal(client.writes.length,fixedWrites,'Fixed controls cannot send even through their handler');
 fixedProfile.controls[0].max=8;fixedProfile.controls[1].min=0;fixedProfile.controls[1].max=4;fixedHeader();assert(!columns.disabled);assert(!sendColumns.disabled);assert(!slider.disabled);assert.equal(columns.title,'');assert(!columns.closest('.program-control').classList.contains('fixed-control'));assert.equal(columns.value,'1');await change('columns',3);assert.equal(client.writes.at(-1).text,'@set columns 3');rx('@state {"columns":3}\n');assert(feedback('columns').includes('Confirmed'));
 dom.window.close();console.log('PASS live configuration: 16 controls; @set→header confirmation; ranges/images; fixed/editable limits; focused drafts; stale state; rejected values; confirmation timeout; HTTP race; bounded partial-header retries');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
