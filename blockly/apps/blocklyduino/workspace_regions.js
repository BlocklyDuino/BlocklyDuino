/* Named workspace areas: project XML metadata, never Arduino code. */
(function(){
 'use strict';
 var XML_TAG='workspace-regions',NS='http://www.w3.org/2000/svg',COLORS=['#3185b5','#39866b','#a47535','#9067ac','#b75f59','#647b8b'];
 var api={},ws=null,layer=null,bar=null,mode=false,drawing=false,gesture=null,selectedId=null,observer=null,installed=false,controls={};
 function copy(value){return JSON.parse(JSON.stringify(value));}
 function regions(workspace){return workspace.bxRegions_||(workspace.bxRegions_=[]);}
 function fresh(){return 'area_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);}
 function validate(value){
  if(!value||typeof value!=='object')throw Error('Invalid area metadata.');
  var r={id:String(value.id||fresh()),title:String(value.title||'Area'),description:String(value.description||''),color:String(value.color||COLORS[0])};
  if(!/^[A-Za-z][A-Za-z0-9_-]{0,80}$/.test(r.id))throw Error('Invalid area ID.');
  if(r.title.length>120||r.description.length>2000)throw Error('Area title/description exceeds its limit (120/2000 characters).');
  if(!/^#[0-9a-fA-F]{6}$/.test(r.color))throw Error('Area color must be a six-digit hex color.');
  ['x','y','width','height'].forEach(function(k){var raw=value[k],n=Number(raw);if(raw===null||raw===undefined||String(raw).trim()===''||!Number.isFinite(n))throw Error('Area coordinates must be finite numbers.');r[k]=n;});
  if(Math.abs(r.x)>1000000||Math.abs(r.y)>1000000||r.width<60||r.height<40||r.width>100000||r.height>100000)throw Error('Area dimensions are outside supported bounds.');
  return r;
 }
 function validateAll(list){if(!Array.isArray(list)||list.length>100)throw Error('Use at most 100 named areas.');var ids=Object.create(null);return list.map(function(value){var r=validate(value);if(ids[r.id])throw Error('Duplicate area ID.');ids[r.id]=true;return r;});}
 function bounds(workspace){var list=regions(workspace);if(!list.length)return null;var left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;list.forEach(function(r){left=Math.min(left,r.x);top=Math.min(top,r.y);right=Math.max(right,r.x+r.width);bottom=Math.max(bottom,r.y+r.height);});return{x:left,y:top,width:right-left,height:bottom-top};}
 function status(text,error){if(typeof editorStatus==='function')editorStatus(text,!!error);}
 function notify(workspace){if(workspace.fireChangeEvent)workspace.fireChangeEvent();if(workspace===Blockly.mainWorkspace&&typeof backup_blocks==='function')backup_blocks();if(workspace===ws){render();updateControls();}window.dispatchEvent(new Event('blockly-workspace-areas'));}
 function remember(workspace){var list=workspace.bxRegionsUndo_||(workspace.bxRegionsUndo_=[]);list.push(copy(regions(workspace)));if(list.length>20)list.shift();}
 function set(workspace,list,saveUndo){var next=validateAll(list);if(saveUndo!==false)remember(workspace);workspace.bxRegions_=next;notify(workspace);return copy(next);}
 function add(workspace,value){var list=copy(regions(workspace));list.push(validate(value));set(workspace,list);return list[list.length-1].id;}
 function update(workspace,id,patch){var list=copy(regions(workspace)),index=list.findIndex(function(r){return r.id===id;});if(index<0)throw Error('Area no longer exists.');list[index]=Object.assign({},list[index],patch,{id:id});set(workspace,list);}
 function remove(workspace,id){set(workspace,regions(workspace).filter(function(r){return r.id!==id;}));if(workspace===ws&&selectedId===id)selectedId=null;updateControls();}
 function undo(workspace){var stack=workspace.bxRegionsUndo_||[];if(!stack.length)return false;workspace.bxRegions_=stack.pop();selectedId=null;notify(workspace);return true;}
 // Install persistence immediately: startup may load XML before UI installation.
 var oldToDom=Blockly.Xml.workspaceToDom,oldFromDom=Blockly.Xml.domToWorkspace,oldClear=Blockly.Workspace.prototype.clear;
 Blockly.Xml.workspaceToDom=function(workspace){
  var xml=oldToDom.apply(this,arguments),list=regions(workspace);if(!list.length)return xml;
  var metadata=xml.ownerDocument.createElement(XML_TAG);metadata.setAttribute('version','1');
  list.forEach(function(r){var n=xml.ownerDocument.createElement('region');['id','x','y','width','height','color'].forEach(function(k){n.setAttribute(k,String(r[k]));});['title','description'].forEach(function(k){var t=xml.ownerDocument.createElement(k);t.textContent=r[k];n.appendChild(t);});metadata.appendChild(n);});xml.appendChild(metadata);return xml;
 };
 Blockly.Xml.domToWorkspace=function(workspace,xml){
  var clean=xml.cloneNode(true),incoming=[],hasMetadata=false;
  Array.prototype.slice.call(clean.childNodes).forEach(function(n){if(n.nodeType!==1||n.nodeName.toLowerCase()!==XML_TAG)return;hasMetadata=true;if(n.getAttribute('version')!=='1')throw Error('Unsupported workspace area metadata version.');Array.prototype.forEach.call(n.children,function(child){if(child.nodeName.toLowerCase()!=='region')throw Error('Invalid workspace area entry.');var data={};['id','x','y','width','height','color'].forEach(function(k){data[k]=child.getAttribute(k);});['title','description'].forEach(function(k){var el=child.getElementsByTagName(k)[0];data[k]=el?el.textContent:'';});incoming.push(data);});clean.removeChild(n);});
  incoming=validateAll(incoming);var result=regions(workspace).slice(),ids=Object.create(null);result.forEach(function(r){ids[r.id]=true;});incoming.forEach(function(r){if(ids[r.id])r.id=fresh();ids[r.id]=true;result.push(r);});if(result.length>100)throw Error('Import would exceed 100 named areas.');
  var value=oldFromDom.call(this,workspace,clean);if(hasMetadata)workspace.bxRegions_=result;
  if(workspace===ws){selectedId=null;render();updateControls();}return value;
 };
 Blockly.Workspace.prototype.clear=function(){this.bxRegions_=[];this.bxRegionsUndo_=[];var result=oldClear.apply(this,arguments);if(this===ws){selectedId=null;drawing=false;gesture=null;setMode(false);}return result;};
 function svg(name,attrs,parent,text){var e=document.createElementNS(NS,name);Object.keys(attrs||{}).forEach(function(k){e.setAttribute(k,attrs[k]);});if(text!==undefined)e.textContent=text;if(parent)parent.appendChild(e);return e;}
 function wrap(text,max){var result=[];String(text).split(/\n/).forEach(function(line){while(line.length>max){var end=line.lastIndexOf(' ',max);if(end<max/3)end=max;result.push(line.slice(0,end));line=line.slice(end).trimStart();}result.push(line);});return result;}
 function render(){
  if(!ws||!layer)return;layer.replaceChildren();layer.setAttribute('transform',ws.getCanvas().getAttribute('transform')||'');layer.classList.toggle('wr-editing',mode);
  regions(ws).forEach(function(r){var selected=mode&&selectedId===r.id,g=svg('g',{'data-region-id':r.id,'class':'wr-area'+(selected?' wr-selected':'')},layer);svg('title',{},g,r.title+(r.description?' — '+r.description:''));svg('rect',{x:r.x,y:r.y,width:r.width,height:r.height,rx:7,fill:r.color,'fill-opacity':.065,stroke:r.color,'stroke-width':selected?3:1.5,'vector-effect':'non-scaling-stroke','class':'wr-area-body'},g);
   svg('rect',{x:r.x+1,y:r.y+1,width:r.width-2,height:28,rx:6,fill:r.color,'fill-opacity':.17,'data-region-action':'move','class':'wr-area-titlebar'},g);
   var title=r.title.length>Math.max(8,Math.floor((r.width-24)/8))?r.title.slice(0,Math.max(8,Math.floor((r.width-24)/8))-1)+'…':r.title;
   svg('text',{x:r.x+12,y:r.y+20,fill:r.color,'class':'wr-area-title','pointer-events':'none'},g,title);
   var max=Math.max(8,Math.floor((r.width-24)/7)),lines=wrap(r.description,max).slice(0,Math.max(0,Math.floor((r.height-40)/16)));lines.forEach(function(line,i){svg('text',{x:r.x+12,y:r.y+47+i*16,fill:'#405b6b','class':'wr-area-description','pointer-events':'none'},g,line);});
   if(selected){svg('rect',{x:r.x+r.width-13,y:r.y+r.height-13,width:12,height:12,fill:r.color,stroke:'white','stroke-width':1,'vector-effect':'non-scaling-stroke','data-region-action':'resize','class':'wr-area-handle'},g);}
  });
  if(gesture&&gesture.kind==='draw'){var r=rectangle(gesture.start,gesture.current);svg('rect',{x:r.x,y:r.y,width:r.width,height:r.height,fill:COLORS[0],'fill-opacity':.1,stroke:COLORS[0],'stroke-width':2,'stroke-dasharray':'6 4','vector-effect':'non-scaling-stroke','pointer-events':'none'},layer);}
 }
 function syncTransform(){if(layer&&ws)layer.setAttribute('transform',ws.getCanvas().getAttribute('transform')||'');}
 function rectangle(a,b){return{x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),width:Math.abs(b.x-a.x),height:Math.abs(b.y-a.y)};}
 function point(x,y){var canvas=ws.getCanvas(),p=canvas.ownerSVGElement.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(canvas.getScreenCTM().inverse());}
 function inWorkArea(target){var host=document.getElementById('content_blocks');if(!host||!host.contains(target))return false;for(var e=target;e&&e!==host;e=e.parentNode){var c=e.getAttribute&&e.getAttribute('class')||'';if(/blocklyFlyout|blocklyScrollbar|blocklyTrash|blocklyToolbox|blocklyZoom/.test(c))return false;}return true;}
 function targetInfo(target){var action=null;for(var e=target;e&&e!==layer;e=e.parentNode){if(e.getAttribute){action=action||e.getAttribute('data-region-action');var id=e.getAttribute('data-region-id');if(id)return{id:id,action:action};}}return null;}
 function stop(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
 function selectedRegion(){return ws&&regions(ws).find(function(r){return r.id===selectedId;});}
 function setMode(on){cancelGesture();mode=!!on;if(mode){if(window.BlocklyEditorActions&&BlocklyEditorActions.setMode)BlocklyEditorActions.setMode(false);else{var button=document.getElementById('select_stacks');if(button&&button.getAttribute('aria-pressed')==='true')button.click();}}render();updateControls();if(typeof Blockly.fireUiEvent==='function')Blockly.fireUiEvent(window,'resize');}
 function updateControls(){if(!controls.toggle)return;controls.toggle.textContent=mode?'Done with areas':'Areas';controls.toggle.setAttribute('aria-pressed',String(mode));controls.group.hidden=!mode;var old=selectedId;controls.select.replaceChildren(new Option('Choose an area…',''));if(ws)regions(ws).forEach(function(r){controls.select.add(new Option(r.title,r.id));});controls.select.value=old||'';var exists=!!selectedRegion();controls.edit.disabled=controls.del.disabled=controls.focus.disabled=!exists;controls.undo.disabled=!(ws&&ws.bxRegionsUndo_&&ws.bxRegionsUndo_.length);controls.add.textContent=drawing?'Draw a rectangle…':'+ Add area';controls.hint.textContent=drawing?'Drag a rectangle across the workspace. Escape cancels.':'Drag an area title to move it; drag its bottom-right handle to resize. Blocks stay in place.';}
 function focusArea(fit){var r=selectedRegion();if(!r)return;if(window.BlocklyWorkspaceZoom&&BlocklyWorkspaceZoom.focusBounds)BlocklyWorkspaceZoom.focusBounds(r,fit===true);else if(ws.scrollbar){var m=ws.getMetrics();ws.scrollbar.set(Math.max(0,r.x-m.contentLeft-30),Math.max(0,r.y-m.contentTop-30));}render();}
 function editDialog(value,isNew){
  var old=document.getElementById('workspace_area_dialog');if(old)old.remove();var dialog=document.createElement('dialog');dialog.id='workspace_area_dialog';dialog.className='wr-dialog';
  var form=document.createElement('form'),h=document.createElement('h2');h.textContent=isNew?'Add named area':'Edit area';form.appendChild(h);
  function field(label,id,element){var l=document.createElement('label');l.textContent=label;l.htmlFor=id;element.id=id;l.appendChild(element);form.appendChild(l);return element;}
  var title=field('Name','area_title',document.createElement('input'));title.type='text';title.value=value.title||'';title.maxLength=120;title.required=true;
  var description=field('Description','area_description',document.createElement('textarea'));description.value=value.description||'';description.maxLength=2000;description.rows=4;
  var color=field('Color','area_color',document.createElement('input'));color.type='color';color.value=value.color||COLORS[0];
  var note=document.createElement('p');note.textContent='This area documents a part of your program. Moving or resizing it does not move the blocks or change the generated code.';form.appendChild(note);
  var error=document.createElement('p');error.className='wr-error';error.setAttribute('role','alert');form.appendChild(error);
  var actions=document.createElement('div');actions.className='wr-dialog-actions';var cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancel';cancel.onclick=function(){dialog.close();};var save=document.createElement('button');save.type='submit';save.className='primary';save.textContent=isNew?'Add area':'Save area';actions.append(cancel,save);form.appendChild(actions);
  form.onsubmit=function(e){e.preventDefault();try{var next=Object.assign({},value,{title:title.value.trim()||'Area',description:description.value,color:color.value});if(isNew)selectedId=add(ws,next);else update(ws,value.id,next);render();updateControls();dialog.close();status('Area saved with the project. Use Areas to edit, move or resize it.');}catch(x){error.textContent=x.message;}};dialog.appendChild(form);document.body.appendChild(dialog);dialog.showModal();title.focus();
 }
 function down(e){
  if(!mode||e.button!==0||!inWorkArea(e.target)||(typeof selected!=='undefined'&&selected!=='blocks'))return;
  if(drawing){stop(e);gesture={kind:'draw',start:point(e.clientX,e.clientY),current:point(e.clientX,e.clientY)};return;}
  var info=targetInfo(e.target);if(!info)return;stop(e);var changed=selectedId!==info.id;selectedId=info.id;var r=selectedRegion();if(!r)return;
  if(info.action==='move'||info.action==='resize')gesture={kind:info.action,start:point(e.clientX,e.clientY),before:copy(r),moved:false};if(changed)render();updateControls();
 }
 function move(e){if(!gesture)return;stop(e);var p=point(e.clientX,e.clientY);if(gesture.kind==='draw')gesture.current=p;else{var r=selectedRegion();if(!r)return;var dx=p.x-gesture.start.x,dy=p.y-gesture.start.y;if(gesture.kind==='move'){r.x=Math.max(-1000000,Math.min(1000000,gesture.before.x+dx));r.y=Math.max(-1000000,Math.min(1000000,gesture.before.y+dy));}else{r.width=Math.max(60,Math.min(100000,gesture.before.width+dx));r.height=Math.max(40,Math.min(100000,gesture.before.height+dy));}gesture.moved=!!(dx||dy);}render();}
 function up(e){if(!gesture)return;stop(e);var g=gesture;gesture=null;if(g.kind==='draw'){drawing=false;var r=rectangle(g.start,g.current);render();updateControls();if(r.width<60||r.height<40){status('Draw an area at least 60 × 40 workspace units.',true);return;}r.id=fresh();r.title='';r.description='';r.color=COLORS[regions(ws).length%COLORS.length];editDialog(r,true);}else if(g.moved){var next=copy(selectedRegion());Object.assign(selectedRegion(),g.before);update(ws,g.before.id,next);}}
 function cancelGesture(){if(gesture&&gesture.before){var r=selectedRegion();if(r)Object.assign(r,gesture.before);}gesture=null;drawing=false;render();updateControls();}
 function key(e){if(!mode||document.querySelector('dialog[open]')||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;if(e.key==='Escape'){stop(e);if(gesture||drawing)cancelGesture();else setMode(false);} }
 function install(){
  if(installed)return;ws=Blockly.mainWorkspace;bar=document.getElementById('editor_actions');if(!bar||!ws||!ws.getCanvas)return;installed=true;
  var canvas=ws.getCanvas();layer=svg('g',{'class':'workspace-regions-layer','aria-label':'Named program areas'},null);canvas.parentNode.insertBefore(layer,canvas);observer=new MutationObserver(syncTransform);observer.observe(canvas,{attributes:true,attributeFilter:['transform']});
  controls.toggle=document.createElement('button');controls.toggle.id='workspace_areas';controls.toggle.textContent='Areas';controls.toggle.title='Draw named areas with descriptions. Areas are saved in the project.';controls.toggle.onclick=function(){if(typeof ensureBlocksMode==='function'&&!ensureBlocksMode())return;setMode(!mode);};bar.appendChild(controls.toggle);
  controls.group=document.createElement('span');controls.group.className='wr-controls';bar.appendChild(controls.group);
  function button(id,text,callback){var b=document.createElement('button');b.type='button';b.id=id;b.textContent=text;b.onclick=callback;controls.group.appendChild(b);return b;}
  controls.add=button('add_workspace_area','+ Add area',function(){drawing=!drawing;gesture=null;updateControls();});
  controls.select=document.createElement('select');controls.select.id='workspace_area_select';controls.select.setAttribute('aria-label','Named area');controls.select.onchange=function(){selectedId=this.value||null;render();updateControls();if(selectedId)focusArea();};controls.group.appendChild(controls.select);
  controls.edit=button('edit_workspace_area','Edit',function(){var r=selectedRegion();if(r)editDialog(copy(r),false);});controls.focus=button('focus_workspace_area','Show',function(){focusArea(true);});controls.focus.title='Center and zoom to fit the selected area, including from a distant overview.';
  controls.del=button('delete_workspace_area','Delete area',function(){if(selectedId){remove(ws,selectedId);status('Area deleted. Undo area restores it.');}});controls.undo=button('undo_workspace_area','Undo area',function(){undo(ws);});
  controls.hint=document.createElement('span');controls.hint.className='wr-hint';controls.group.appendChild(controls.hint);
  window.addEventListener('mousedown',down,true);window.addEventListener('mousemove',move,true);window.addEventListener('mouseup',up,true);window.addEventListener('keydown',key,true);window.addEventListener('resize',syncTransform);window.addEventListener('blockly-workspace-view',syncTransform);
  layer.addEventListener('dblclick',function(e){if(!mode)return;var info=targetInfo(e.target);if(!info)return;stop(e);selectedId=info.id;var r=selectedRegion();if(r)editDialog(copy(r),false);});
  var selectionButton=document.getElementById('select_stacks');if(selectionButton)selectionButton.addEventListener('click',function(){if(this.getAttribute('aria-pressed')==='true')setMode(false);});
  ws.addChangeListener(function(){render();updateControls();});render();updateControls();
 }
 api.install=install;api.get=function(workspace){return copy(regions(workspace||Blockly.mainWorkspace));};api.set=set;api.add=add;api.update=update;api.remove=remove;api.undo=undo;api.bounds=bounds;api.validate=validate;api.validateAll=validateAll;api.rectangle=rectangle;api.render=render;api.setMode=setMode;api.isEditing=function(){return mode;};
 window.BlocklyWorkspaceRegions=api;
})();
