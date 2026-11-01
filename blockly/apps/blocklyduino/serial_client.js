/* One server-owned serial connection; each view has its own event cursor. */
(function(root){
 'use strict';
 function request(path,body){return fetch('/serial/'+path,{method:body===undefined?'GET':'POST',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'}).then(async function(r){var data;try{data=await r.json();}catch(e){throw Error('Serial service returned '+r.status);}if(!r.ok)throw Error(data.error||data.message||('Serial request failed: '+r.status));return data;});}
 function Client(options){this.options=options||{};this.listeners=[];this.cursor=0;this.running=false;this.timer=null;this.state={connected:false};this.generation=0;this.sessionId=null;}
 Client.prototype.notify=function(state){this.state=state;if(this.options.onStatus)this.options.onStatus(state);this.listeners.forEach(function(f){f(state);});};
 Client.prototype.error=function(e){if(this.options.onError)this.options.onError(e.message||String(e));};
 Client.prototype.start=async function(options){if(this.running)return;this.running=true;var generation=++this.generation;try{var state=await request('status');if(!this.running||this.generation!==generation)return;this.notify(state);this.sessionId=state.session_id||null;this.cursor=options&&options.replay?0:state.seq||0;}catch(e){this.error(e);}if(this.running&&this.generation===generation)this.poll(generation);};
 Client.prototype.poll=async function(generation){
  if(!this.running||this.generation!==generation)return;
  var delay=200;
  try{
   var state=await request('events?after='+this.cursor);
   if(!this.running||this.generation!==generation)return;
   var changed=!!(this.sessionId&&state.session_id&&state.session_id!==this.sessionId);
   if(state.session_id)this.sessionId=state.session_id;
   if(changed||state.reset){
    this.cursor=0;
    if(this.options.onReset)this.options.onReset(state);
    this.notify(state);
    delay=0; // Replay the new session from its start, not the previous server's cursor.
   }else{
    var events=state.events||[];
    if(state.dropped&&this.options.onGap)this.options.onGap(state.dropped);
    if(events.length&&this.options.onEvents)this.options.onEvents(events,state);
    if(Number.isSafeInteger(state.seq)&&state.seq>=0)this.cursor=state.seq;
    this.notify(state);
    if(state.has_more)delay=0;
   }
  }catch(e){if(this.generation===generation)this.error(e);delay=1500;}
  if(this.running&&this.generation===generation){var self=this;this.timer=setTimeout(function(){self.poll(generation);},delay);}
 };
 Client.prototype.stop=function(){this.running=false;this.generation++;clearTimeout(this.timer);};
 Client.prototype.ports=function(){return request('ports');};
 Client.prototype.connect=async function(port,baud){var state=await request('connect',{port:port,baud:Number(baud)});this.notify(state);return state;};
 Client.prototype.disconnect=async function(){var state=await request('disconnect',{});this.notify(state);return state;};
 Client.prototype.write=function(text,ending){return request('write',{text:text,ending:ending||'none'});};
 Client.mountControls=function(container,client){
  container.className+=' serial-connection';
  container.innerHTML='<label>Port <select aria-label="Serial port"></select></label><button type="button" title="Refresh detected ports">Refresh</button><label>Baud <input aria-label="Baud rate" type="number" min="50" max="4000000" step="1" list="serial-baud-rates" value="9600"></label><datalist id="serial-baud-rates"><option>1200</option><option>2400</option><option>4800</option><option>9600</option><option>19200</option><option>38400</option><option>57600</option><option>115200</option><option>230400</option><option>460800</option><option>921600</option><option>1000000</option><option>2000000</option></datalist><button type="button">Connect / apply</button><button type="button">Disconnect</button><span role="status" class="connection-status">Checking connection…</span>';
  var port=container.querySelector('select'),baud=container.querySelector('input'),buttons=container.querySelectorAll('button'),badge=container.querySelector('[role=status]');
  function option(path,label){if(!Array.from(port.options).some(function(x){return x.value===path;})){var o=document.createElement('option');o.value=path;o.textContent=label||path;port.appendChild(o);}}
  var previousConnection='';
  function status(s){var key=[s.port,s.baud,s.connected].join('|');if(key!==previousConnection){previousConnection=key;if(s.port){option(s.port);port.value=s.port;}if(s.baud)baud.value=s.baud;}badge.textContent=s.uploading?'Paused for upload':s.connected?'Connected · '+s.baud+' baud':s.error?'Disconnected · '+s.error:'Disconnected';badge.className='connection-status '+(s.connected?'online':'');var summary=document.getElementById('serial-summary');if(summary){summary.textContent=badge.textContent+(s.port?' · '+s.port.split('/').pop():'');summary.className=s.connected?'connected':'disconnected';}buttons[2].disabled=!(s.connected||s.uploading);}
  async function refresh(){try{var d=await client.ports(),selected=port.value;port.textContent='';(d.ports||[]).forEach(function(p){option(p.path,p.label&&p.label!==p.path?p.label+' · '+p.path:p.path);});if(d.default_port)option(d.default_port,d.default_port+' (configured)');if(selected)option(selected);port.value=selected||client.state.port||d.default_port||port.value;if(d.baud&&!client.state.baud)baud.value=d.baud;}catch(e){client.error(e);}}
  async function action(fn){buttons[1].disabled=true;try{await fn();if(client.options.onError)client.options.onError('');}catch(e){client.error(e);}finally{buttons[1].disabled=false;}}
  buttons[0].onclick=refresh;buttons[1].onclick=function(){var b=Number(baud.value);if(!port.value||!Number.isInteger(b)||b<50||b>4000000){client.error(Error('Choose a port and a whole baud rate from 50 to 4000000.'));return;}action(function(){return client.connect(port.value,b);});};buttons[2].onclick=function(){action(function(){return client.disconnect();});};client.listeners.push(status);refresh();status(client.state);return {refresh:refresh,status:status};
 };
 root.SerialClient=Client;
})(window);
