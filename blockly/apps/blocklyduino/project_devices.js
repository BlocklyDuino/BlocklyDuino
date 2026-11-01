/* Project-first hardware toolbox for the bundled legacy Blockly release. */
(function(){
 'use strict';var baseTree=null,lastSignature='',timer=null,installed=false,lastSelected='',fieldCache={};
 function catalog(){return window.BlocklyDeviceCatalog||[];}
 function info(type){return catalog().filter(function(x){return x.type===type;})[0];}
 function id(b){return String(b.deviceUid||b.storageUid||b.musicUid||b.busUid||b.id);}
 function active(b){return !b.disabled&&!(b.getInheritedDisabled&&b.getInheritedDisabled());}
 function deviceList(ws){return ws.getAllBlocks().filter(function(b){return info(b.type)&&active(b);}).map(function(b){return{block:b,id:id(b),name:b.getFieldValue('NAME')||info(b.type).label,meta:info(b.type)};}).sort(function(a,b){return a.name.localeCompare(b.name);});}
 function referenceFields(type){
  if(fieldCache[type])return fieldCache[type];
  var ws=new Blockly.Workspace(),b=Blockly.Block.obtain(ws,type),result={device:!!b.getField('DEVICE'),buzzer:!!b.getField('BUZZER')};ws.dispose();fieldCache[type]=result;return result;
 }
 function actionNode(type,device,templates,devices){
  var n=templates[type]?templates[type].cloneNode(true):document.createElement('block');n.setAttribute('type',type);n.removeAttribute('id');n.removeAttribute('x');n.removeAttribute('y');
  var fields=referenceFields(type),key=device.meta.type==='music_buzzer'&&fields.buzzer?'BUZZER':fields.device?'DEVICE':null;
  function set(k,v){var existing=Array.prototype.filter.call(n.children,function(c){return c.tagName.toLowerCase()==='field'&&c.getAttribute('name')===k;})[0];if(!existing){existing=document.createElement('field');existing.setAttribute('name',k);n.appendChild(existing);}existing.textContent=v;}
  if(key)set(key,device.id);
  if(/^sd_music_/.test(type)){
   var cards=devices.filter(function(d){return d.meta.type==='st_sd';}),buzzers=devices.filter(function(d){return d.meta.type==='music_buzzer';});
   if(cards.length===1)set('DEVICE',cards[0].id);if(buzzers.length===1)set('BUZZER',buzzers[0].id);
  }
  return n;
 }
 function buildToolbox(ws,base){
  var root=base.cloneNode(true),devices=deviceList(ws),templates={};
  Array.prototype.forEach.call(base.querySelectorAll('block'),function(n){var type=n.getAttribute('type');if(!templates[type])templates[type]=n;});
  var hidden=['Devices','Motion','Displays','Sensors','LEDs and outputs','Storage','Images','Music'];
  Array.prototype.slice.call(root.children).forEach(function(c){if(hidden.indexOf(c.getAttribute('name'))>=0)root.removeChild(c);else if(c.getAttribute('name')==='Low-level')Array.prototype.slice.call(c.children).forEach(function(n){if(['SPI commands','I2C commands'].indexOf(n.getAttribute('name'))>=0)c.removeChild(n);});});
  var group=document.createElement('category');group.setAttribute('name','Project devices ('+devices.length+')');group.setAttribute('expanded','true');group.setAttribute('data-project-devices','true');
  devices.forEach(function(d){var cat=document.createElement('category');cat.setAttribute('name',d.name+' · '+d.meta.label);cat.setAttribute('data-device-id',d.id);
   var groups=d.meta.groups||[{label:'',actions:d.meta.actions}];
   groups.forEach(function(g){var target=cat;if(groups.length>1){target=document.createElement('category');target.setAttribute('name',g.label);cat.appendChild(target);}
    (g.actions||[]).forEach(function(type){if(!Blockly.Blocks[type])return;if(/^sd_music_/.test(type)&&!devices.some(function(x){return x.meta.type==='st_sd';}))return;if(/^sd_music_/.test(type)&&!devices.some(function(x){return x.meta.type==='music_buzzer';}))return;target.appendChild(actionNode(type,d,templates,devices));});
    if(target!==cat&&!target.children.length)cat.removeChild(target);
   });group.appendChild(cat);
  });root.insertBefore(group,root.firstChild);return root;
 }
 function focusDevice(d){if(!ensureBlocksMode())return;var ws=Blockly.mainWorkspace;ws.toolbox_.clearSelection();d.block.select();var m=ws.getMetrics(),p=d.block.getRelativeToSurfaceXY();if(ws.scrollbar)ws.scrollbar.set(Math.max(0,p.x*(ws.scale||1)-m.contentLeft-35),Math.max(0,p.y*(ws.scale||1)-m.contentTop-35));editorStatus('Configuration: '+d.name+'. Change its name or wiring here.',false);}
 function deviceSettings(d){
  var old=document.getElementById('device-settings');if(old)old.remove();
  var dialog=document.createElement('dialog');dialog.id='device-settings';dialog.className='workbench-dialog';
  var title=document.createElement('h2');title.textContent=d.name+' · '+d.meta.label;dialog.appendChild(title);
  var label=document.createElement('label');label.textContent='Block colour ';var choice=document.createElement('select');choice.setAttribute('aria-label',d.name+' block colour');
  d.block.getField('DEVICE_HUE').getOptions_().forEach(function(v){choice.add(new Option(v[0],v[1]));});choice.value=d.block.getFieldValue('DEVICE_HUE');label.appendChild(choice);dialog.appendChild(label);
  var sample=document.createElement('span');sample.className='device-colour-sample';sample.textContent='Preview';dialog.appendChild(sample);function preview(){sample.style.backgroundColor=Blockly.makeColour(Number(choice.value));}choice.onchange=preview;preview();
  var actions=document.createElement('div');actions.className='dialog-actions';
  function button(text,fn){var b=document.createElement('button');b.textContent=text;b.onclick=fn;actions.appendChild(b);}
  button('Find definition',function(){dialog.close();focusDevice(d);});button('Cancel',function(){dialog.close();});button('Save',function(){d.block.setFieldValue(choice.value,'DEVICE_HUE');d.block.workspace.fireChangeEvent();refresh(true);dialog.close();});
  dialog.appendChild(actions);document.body.appendChild(dialog);dialog.showModal();choice.focus();
 }
 function treeLabel(node){var el=node.getRowElement&&node.getRowElement();var label=el&&el.querySelector('.blocklyTreeLabel');return label?label.textContent:'';}
 function decorate(devices){
  var ws=Blockly.mainWorkspace,toolbox=ws.toolbox_,tree=toolbox.tree_,rootChildren=tree.getChildren(),project=rootChildren[0],rows=project?project.getChildren():[];
  if(project&&project.getRowElement())project.getRowElement().setAttribute('data-project-heading','true');
  rows.forEach(function(node,i){var d=devices[i],row=node.getRowElement();if(!d||!row)return;row.classList.add('project-device-row');row.style.borderLeftColor=Blockly.makeColour(Number(d.block.getFieldValue('DEVICE_HUE')||d.meta.hue));row.dataset.deviceId=d.id;
   var gear=document.createElement('button');gear.className='device-config-button';gear.textContent='⚙';gear.type='button';gear.title='Edit '+d.name+' configuration';gear.setAttribute('aria-label','Edit '+d.name+' configuration');gear.onmousedown=function(e){e.stopPropagation();};gear.onclick=function(e){e.stopPropagation();deviceSettings(d);};row.appendChild(gear);
  });
  var container=toolbox.HtmlDiv,button=container.querySelector('.sidebar-add-device');
  if(!button){button=document.createElement('button');button.type='button';button.className='sidebar-add-device';button.textContent='+ Add device';button.onclick=openPicker;container.insertBefore(button,container.firstChild);}
  var empty=container.querySelector('.project-device-empty');if(empty)empty.remove();
  if(!devices.length){empty=document.createElement('div');empty.className='project-device-empty';empty.textContent='Add hardware to see its actions here.';button.after(empty);}
 }
 function colorBlocks(ws,devices){
  ws.getAllBlocks().forEach(function(b){var meta=info(b.type),ref=b.getFieldValue('DEVICE')||b.getFieldValue('BUZZER');if(!meta&&ref){var d=devices.filter(function(x){return x.id===ref;})[0];if(d)meta=d.meta;}if(meta){var device=info(b.type)?b:(d&&d.block),hue=Number(device&&device.getFieldValue('DEVICE_HUE')||meta.hue);if(b.getColour&&b.getColour()!==hue)b.setColour(hue);}});
 }
 function refresh(force){
  if(!installed||!Blockly.mainWorkspace)return;var ws=Blockly.mainWorkspace,devices=deviceList(ws),sig=devices.map(function(d){return d.id+':'+d.name+':'+d.meta.type+':'+d.block.getFieldValue('DEVICE_HUE');}).join('|');
  colorBlocks(ws,devices);if(!force&&sig===lastSignature)return;
  var old=ws.toolbox_.tree_.getSelectedItem();lastSelected=old?treeLabel(old):'';
  lastSignature=sig;ws.updateToolbox(buildToolbox(ws,baseTree));decorate(devices);
  function restore(node){if(treeLabel(node)===lastSelected){var parent=node.getParent();while(parent&&parent!==ws.toolbox_.tree_){parent.setExpanded(true);parent=parent.getParent();}ws.toolbox_.tree_.setSelectedItem(node);return true;}var children=node.getChildren();for(var i=0;i<children.length;i++)if(restore(children[i]))return true;return false;}
  if(lastSelected)restore(ws.toolbox_.tree_);Blockly.fireUiEvent(window,'resize');
 }
 function add(type){
  var meta=info(type);if(!meta||!ensureBlocksMode())return false;var ws=Blockly.mainWorkspace,before=ws.getAllBlocks().map(function(b){return b.id;}),m=ws.getMetrics(),xml=document.createElement('xml'),node=document.createElement('block');node.setAttribute('type',type);node.setAttribute('x',String(m.viewLeft/(ws.scale||1)+30));node.setAttribute('y',String(m.viewTop/(ws.scale||1)+30));xml.appendChild(node);Blockly.Xml.domToWorkspace(ws,xml);
  var added=ws.getAllBlocks().filter(function(b){return b.type===type&&before.indexOf(b.id)<0;})[0];if(!added)return false;
  try{if(window.BlocklyResources)BlocklyResources.allocate(added);}catch(e){added.dispose(false,false);editorStatus(e.message,true);var m=document.getElementById('device-picker-error');if(m)m.textContent=e.message;return false;}
  var name=added.getFieldValue('NAME'),existing=ws.getAllBlocks().filter(function(b){return b!==added&&b.getField('NAME');}).map(function(b){return b.getFieldValue('NAME');}),unique=name,n=2;while(existing.indexOf(unique)>=0)unique=name+n++;added.setFieldValue(unique,'NAME');
  var boxes=ws.getTopBlocks(false).filter(function(b){return b!==added;}).map(function(b){var p=b.getRelativeToSurfaceXY(),s=b.getHeightWidth();return{x:p.x,y:p.y,w:s.width,h:s.height};}),s=added.getHeightWidth(),x=m.viewLeft/(ws.scale||1)+30,y=m.viewTop/(ws.scale||1)+30;
  for(var step=0;step<100&&boxes.some(function(b){return x<b.x+b.w+20&&x+s.width+20>b.x&&y<b.y+b.h+20&&y+s.height+20>b.y;});step++)y+=35;
  var p=added.getRelativeToSurfaceXY();added.moveBy(x-p.x,y-p.y);refresh(true);focusDevice({block:added,name:unique});editorStatus('Added '+unique+'. Set its wiring; its actions are under Project devices.',false);return true;
 }
 function openPicker(){
  var old=document.getElementById('device_picker');if(old)old.remove();var dialog=document.createElement('dialog');dialog.id='device_picker';
  var header=document.createElement('div');header.className='device-picker-heading';var heading=document.createElement('h2');heading.textContent='Add device';header.appendChild(heading);var close=document.createElement('button');close.textContent='Close';close.type='button';close.onclick=function(){dialog.close();};var order;try{order=JSON.parse(localStorage.getItem('blocklyduino.deviceOrder')||'[]');if(!Array.isArray(order))order=[];}catch(e){order=[];}var arranging=false,gear=document.createElement('button');gear.className='device-order-gear';gear.textContent='⚙';gear.title='Reorder device catalogue';gear.setAttribute('aria-label','Reorder device catalogue');gear.onclick=function(){arranging=!arranging;gear.setAttribute('aria-pressed',String(arranging));if(!arranging)localStorage.setItem('blocklyduino.deviceOrder',JSON.stringify(order));render();};header.appendChild(gear);header.appendChild(close);dialog.appendChild(header);var error=document.createElement('p');error.id='device-picker-error';error.className='error';error.setAttribute('role','alert');dialog.appendChild(error);
  var help=document.createElement('p');help.textContent='Choose a module, then set its wiring once. Devices already in this project appear first. Drawings identify the module type; check its model and voltage.';dialog.appendChild(help);
  var search=document.createElement('input');search.type='search';search.placeholder='Search devices, models or protocols…';search.setAttribute('aria-label','Search devices');dialog.appendChild(search);var grid=document.createElement('div');grid.className='device-card-grid';dialog.appendChild(grid);
  var ds=deviceList(Blockly.mainWorkspace),counts={};ds.forEach(function(d){counts[d.meta.type]=(counts[d.meta.type]||0)+1;});
  function render(){grid.textContent='';var query=search.value.toLowerCase(),cards=catalog().slice().sort(function(a,b){function rank(t){var n=order.indexOf(t);return n<0?999:n;}return Number(!!counts[b.type])-Number(!!counts[a.type])||rank(a.type)-rank(b.type)||a.label.localeCompare(b.label);}).filter(function(c){return (c.label+' '+c.kind+' '+c.description).toLowerCase().indexOf(query)>=0;});
   cards.forEach(function(c){var card=document.createElement('button');card.type='button';card.className='device-card'+(counts[c.type]?' device-present':'');card.style.borderTopColor=c.color;card.setAttribute('aria-label','Add '+c.label);var pic=document.createElement('div');pic.className='device-picture';pic.innerHTML=c.iconSvg;card.appendChild(pic);var title=document.createElement('strong');title.textContent=c.label;card.appendChild(title);var desc=document.createElement('span');desc.className='device-description';desc.textContent=c.description;card.appendChild(desc);if(counts[c.type]){var badge=document.createElement('span');badge.className='device-present-badge';badge.textContent='In project: '+counts[c.type]+' · Add another';card.appendChild(badge);}card.onclick=function(){if(!arranging&&add(c.type))dialog.close();};if(arranging){var top=document.createElement('span');top.className='device-move-top';top.textContent='⤒';top.title='Move '+c.label+' to top';card.appendChild(top);card.setAttribute('aria-label','Move '+c.label+' to top');card.onclick=function(){order=[c.type].concat(order.filter(function(t){return t!==c.type;}));render();};}grid.appendChild(card);});
   if(!cards.length){var empty=document.createElement('p');empty.textContent='No matching device. Try a model name, SPI or I2C.';grid.appendChild(empty);}
  }
  search.addEventListener('input',render);render();document.body.appendChild(dialog);dialog.showModal();search.focus();
 }
  catalog().forEach(function(meta){[meta.type].concat(meta.actions||[]).forEach(function(type){var def=Blockly.Blocks[type];if(!def||def.projectColorApplied_)return;var original=def.init;def.init=function(){original.call(this);this.setColour(meta.hue);if(type===meta.type){this.appendDummyInput('DEVICE_STYLE').appendField(new Blockly.FieldDropdown([["Default",String(meta.hue)],["Red","0"],["Orange","30"],["Yellow","55"],["Green","110"],["Teal","165"],["Blue","210"],["Indigo","240"],["Purple","280"],["Pink","325"]]),'DEVICE_HUE').setVisible(false);}};def.projectColorApplied_=true;});});
 function install(){
  if(installed)return;installed=true;baseTree=document.getElementById('toolbox').cloneNode(true);

  var flyout=Blockly.mainWorkspace.toolbox_.flyout_,show=flyout.show;flyout.show=function(){var result=show.apply(this,arguments);colorBlocks(this.workspace_,deviceList(Blockly.mainWorkspace));return result;};
  refresh(true);Blockly.mainWorkspace.addChangeListener(function(){clearTimeout(timer);timer=setTimeout(refresh,150);});
 }
 window.BlocklyProjectDevices={buildToolbox:buildToolbox,deviceList:deviceList,refresh:refresh,add:add,openPicker:openPicker,deviceSettings:deviceSettings,install:install};
}());
