/* SPDX-License-Identifier: Apache-2.0 */
(function(){'use strict';
 var $=function(id){return document.getElementById(id);},model=new SerialImage.Image(),canvas=$('scan-canvas'),pending=false,rendered=-1,demo=null,paused=false,lastResult=null;
 function message(text,error){$('scan-status').textContent=text;$('scan-status').className=error?'error':'';}
 function show(value){document.body.classList.toggle('image-mode',value);$('scan-panel').hidden=!value;$('dashboard').hidden=value;$('view-charts').setAttribute('aria-selected',String(!value));$('view-image').setAttribute('aria-selected',String(value));}
 function paint(target,image){var c=image.config;if(!c)return;if(target.width!==c.width||target.height!==c.height){target.width=c.width;target.height=c.height;}var context=target.getContext('2d'),data=context.createImageData(c.width,c.height);data.data.set(image.pixels);context.putImageData(data,0,0);}
 function describe(image){var c=image.config;return c.id+' · '+c.width+' × '+c.height+' · '+image.updates+' pixel updates · '+c.mode+' 0–'+c.max;}
 function save(target,image,onError){paint(target,image);target.toBlob(function(blob){if(!blob){onError('PNG export failed.');return;}var url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=image.config.id+'.png';a.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);},'image/png');}
 function draw(){pending=false;if(paused||!model.config||rendered===model.revision)return;paint(canvas,model);rendered=model.revision;$('scan-save').disabled=false;message(describe(model));}
 function consume(line){lastResult=null;try{if(!model.consume(line))return false;
  if(line.indexOf('@image ')===0){show(true);lastResult={kind:'image-configuration',id:model.config.id,image:model.config};}
  else lastResult={kind:line==='@image-clear'?'image-clear':'pixel',id:model.config&&model.config.id,values:line.indexOf('@pixel ')===0?line.slice(7).split(',').map(Number):null};
  if(!pending){pending=true;requestAnimationFrame(draw);}return true;
 }catch(e){lastResult={kind:'error',message:e.message};message(e.message,true);show(true);return true;}}
 $('view-image').onclick=function(){show(true);};$('view-charts').onclick=function(){show(false);};
 $('scan-clear').onclick=function(){model.clear();draw();};
 $('scan-save').onclick=function(){save(canvas,model,function(text){message(text,true);});rendered=model.revision;};
 $('scan-demo').onclick=function(){if(demo){clearInterval(demo);demo=null;this.textContent='Try image demo';return;}consume('@image {"version":1,"id":"demo-image","width":160,"height":100,"mode":"gray","max":1023}');var y=0,phase=0;demo=setInterval(function(){for(var x=0;x<160;x++)consume('@pixel '+x+','+y+','+Math.round(511.5*(1+Math.sin(x/14+phase)*Math.cos(y/9))));y=(y+1)%100;if(!y)phase+=.7;},25);this.textContent='Stop image demo';};
 // A dashboard image is another instrument. It never changes the selected view.
 function widget(config){
  var image=new SerialImage.Image();image.configure(config);
  var frame=document.createElement('div'),target=document.createElement('canvas'),tools=document.createElement('div'),exportButton=document.createElement('button'),clearButton=document.createElement('button'),status=document.createElement('p'),revision=-1;
  frame.className='inline-image-frame';frame.appendChild(target);tools.className='image-tools';exportButton.textContent='Save PNG';clearButton.textContent='Clear image';status.className='hint image-status';tools.append(exportButton,clearButton);target.setAttribute('role','img');target.setAttribute('aria-label',config.id+' scan image');
  var ref={model:image,canvas:target,frame:frame,tools:tools,status:status,draw:function(force){if(!force&&(paused||revision===image.revision))return;paint(target,image);revision=image.revision;status.textContent=describe(image);target.setAttribute('aria-label',describe(image));}};
  exportButton.onclick=function(){save(target,image,function(text){status.textContent=text;});revision=image.revision;};
  clearButton.onclick=function(){image.clear();ref.draw(true);};ref.draw();return ref;
 }
 function route(line,widgets){
  if(!widgets.length||!/^@(pixel|image-clear)(?:\s|$)/.test(line))return null;
  try{
   var command=line.match(/^@(pixel|image-clear)(?:\s+(.*))?$/),payload=(command[2]||'').trim(),key=null,values='';
   if(command[1]==='pixel'){var match=payload.match(/^([A-Za-z][A-Za-z0-9_-]{0,47})\s+(.+)$/);if(match){key=match[1];values=match[2];}else values=payload;}
   else key=payload||null;
   if(!key&&widgets.length!==1)throw Error('More than one image: use @pixel image-id x,y,value or @image-clear image-id.');
   var found=key?widgets.find(function(ref){return ref.model.config.id===key;}):widgets[0];
   if(!found)throw Error('Unknown dashboard image: '+key);
   found.model.consume(command[1]==='pixel'?'@pixel '+values:'@image-clear');
   return {kind:command[1]==='pixel'?'pixel':'image-clear',id:found.model.config.id,values:command[1]==='pixel'?values.split(',').map(Number):null};
  }catch(e){return {kind:'error',message:e.message};}
 }
 window.PlotterImage={reset:function(){if(demo){clearInterval(demo);demo=null;$('scan-demo').textContent='Try image demo';}model.config=null;model.pixels=null;model.updates=0;model.revision++;rendered=-1;pending=false;$('scan-save').disabled=true;canvas.width=canvas.height=1;show(false);},pause:function(value){paused=value;if(!paused)draw();},consume:consume,show:show,model:model,result:function(){return lastResult;},draw:draw,widget:widget,route:route,live:function(line){if(demo&&/^@(image|pixel|image-clear)(?:\s|$)/.test(line)){clearInterval(demo);demo=null;$('scan-demo').textContent='Try image demo';}return consume(line);}};
})();
