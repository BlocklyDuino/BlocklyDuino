/* Whole-stack selection and recoverable project actions for the bundled Blockly. */
(function () {
  'use strict';
  var api = {}, ws, bar, layer, mode = false, chosen = [], gesture = null, moveUndo = null;
  var selectedLabel, selectButton, deleteButton, allButton, undoButton, redrawPending = false;
  function status(text, error) { if (typeof editorStatus === 'function') editorStatus(text, !!error); }
  function normalize(blocks) {
    var seen = Object.create(null), result = [];
    blocks.forEach(function (b) {
      if (!b || !b.workspace || b.isInFlyout) return;
      b = b.getRootBlock();
      if (!seen[b.id]) { seen[b.id] = true; result.push(b); }
    });
    return result;
  }
  function intersects(a, b) { return a.left <= b.right && a.right >= b.left && a.top <= b.bottom && a.bottom >= b.top; }
  function rect(a, b) { return {left: Math.min(a.x,b.x), top: Math.min(a.y,b.y), right: Math.max(a.x,b.x), bottom: Math.max(a.y,b.y)}; }
  function count(blocks) { return blocks.reduce(function (n,b) { return n + b.getDescendants().length; }, 0); }
  function editable(target) { return !!(target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))); }
  function box(block) { return block.getSvgRoot().getBoundingClientRect(); }
  function addBox(bounds, className) {
    var d=document.createElement('div');d.className=className;
    d.style.left=bounds.left+'px';d.style.top=bounds.top+'px';d.style.width=Math.max(1,bounds.right-bounds.left)+'px';d.style.height=Math.max(1,bounds.bottom-bounds.top)+'px';layer.appendChild(d);
  }
  function redraw() {
    redrawPending=false;if(!layer)return;layer.textContent='';chosen=normalize(chosen).filter(function(b){return b.workspace===ws;});
    var visible=typeof selected==='undefined'||selected==='blocks';
    if(visible)chosen.forEach(function(b){addBox(box(b),'ea-selected-outline');});
    if(visible&&gesture&&gesture.kind==='marquee')addBox(rect(gesture.start,gesture.current),'ea-marquee');
    if(selectedLabel)selectedLabel.textContent=chosen.length ? chosen.length+' stacks · '+count(chosen)+' blocks selected' : mode?'Drag a rectangle; Shift-click adds/removes. Connected blocks move as one stack.':'Select stacks to move several groups together.';
    if(selectButton){selectButton.setAttribute('aria-pressed',String(mode));selectButton.textContent=mode?'Done selecting':'Select stacks';}
    if(allButton)allButton.hidden=!mode;if(deleteButton){deleteButton.hidden=!mode;deleteButton.disabled=!chosen.length;}
    if(undoButton){undoButton.hidden=!mode;undoButton.disabled=!moveUndo;}
    if(bar)bar.classList.toggle('ea-selecting',mode);
  }
  function scheduleRedraw(){if(!redrawPending){redrawPending=true;requestAnimationFrame(redraw);}}
  function setSelection(blocks){chosen=normalize(blocks);redraw();return chosen.slice();}
  function setMode(value){if(value&&window.BlocklyWorkspaceRegions&&BlocklyWorkspaceRegions.isEditing())BlocklyWorkspaceRegions.setMode(false);mode=!!value;if(!mode){chosen=[];gesture=null;}if(Blockly.selected)Blockly.selected.unselect();redraw();}
  function svgPoint(x,y){var canvas=ws.getCanvas(),svg=canvas.ownerSVGElement,p=svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(canvas.getScreenCTM().inverse());}
  function rootAt(target){return ws.getTopBlocks(false).filter(function(b){return b.getSvgRoot().contains(target);})[0]||null;}
  function stop(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
  function inWorkArea(target){var host=document.getElementById('content_blocks');if(!host||!host.contains(target))return false;
    for(var el=target;el&&el!==host;el=el.parentNode){var cls=el.getAttribute&&el.getAttribute('class')||'';if(/blocklyFlyout|blocklyScrollbar|blocklyTrash|blocklyToolbox|blocklyZoom/.test(cls))return false;}return true;}
  function mouseDown(e){
    if(e.button!==0||editable(e.target)||!inWorkArea(e.target)||(typeof selected!=='undefined'&&selected!=='blocks'))return;
    if(!mode&&!e.shiftKey)return;
    stop(e);if(!mode)setMode(true);
    if(Blockly.hideChaff)Blockly.hideChaff();if(Blockly.selected)Blockly.selected.unselect();
    var root=rootAt(e.target),point={x:e.clientX,y:e.clientY};
    if(root){
      if(e.shiftKey){var i=chosen.indexOf(root);if(i>=0)chosen.splice(i,1);else chosen.push(root);redraw();return;}
      if(chosen.indexOf(root)<0)chosen=[root];
      var start=svgPoint(e.clientX,e.clientY);
      gesture={kind:'move',start:point,last:start,before:chosen.map(function(b){var p=b.getRelativeToSurfaceXY();return {block:b,x:p.x,y:p.y};}),moved:false};
    }else{gesture={kind:'marquee',start:point,current:point,base:e.shiftKey?chosen.slice():[]};if(!e.shiftKey)chosen=[];}
    redraw();
  }
  function mouseMove(e){if(!gesture)return;stop(e);
    if(gesture.kind==='marquee'){gesture.current={x:e.clientX,y:e.clientY};var r=rect(gesture.start,gesture.current);chosen=normalize(gesture.base.concat(ws.getTopBlocks(false).filter(function(b){return intersects(r,box(b));})));}
    else{var next=svgPoint(e.clientX,e.clientY),dx=next.x-gesture.last.x,dy=next.y-gesture.last.y;chosen.forEach(function(b){if(b.workspace===ws)b.moveBy(dx,dy);});gesture.last=next;if(dx||dy)gesture.moved=true;}
    redraw();
  }
  function mouseUp(e){if(!gesture)return;stop(e);if(gesture.kind==='move'&&gesture.moved){moveUndo=gesture.before;ws.fireChangeEvent();if(typeof backup_blocks==='function')backup_blocks();}gesture=null;redraw();}
  function undoMove(){if(!moveUndo)return;moveUndo.forEach(function(item){if(item.block.workspace!==ws)return;var p=item.block.getRelativeToSurfaceXY();item.block.moveBy(item.x-p.x,item.y-p.y);});moveUndo=null;ws.fireChangeEvent();if(typeof backup_blocks==='function')backup_blocks();redraw();}
  function snapshot(reason){
    var workspace=ws||Blockly.mainWorkspace,code=document.getElementById('content_arduino'),xml=document.getElementById('content_xml');
    return {xml:Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace)),source:typeof currentExample==='string'?currentExample:'',reason:reason||'Saved project',manualCode:window.manualCode&&code?code.value:null,rawXml:typeof selected!=='undefined'&&selected==='xml'&&xml?xml.value:null};
  }
  function preserve(reason){
    var value=snapshot(reason),stamp=Date.now(),key='arduino_recovery_'+stamp;
    while(localStorage.getItem(key)){stamp++;key='arduino_recovery_'+stamp;}
    localStorage.setItem(key,JSON.stringify(value));
    var recover=document.getElementById('recover_blocks');if(recover)recover.hidden=false;return key;
  }
  function resetEditor(){
    window.manualCode=false;window.manualCodeOriginal=null;
    var code=document.getElementById('content_arduino');if(code)code.readOnly=true;
    var edit=document.getElementById('edit_code');if(edit)edit.textContent='Edit C++';
    // Leave XML without trying to apply possibly unfinished XML edits. They are in recovery.
    var xmlTab=document.getElementById('tab_xml');if(xmlTab)xmlTab.className='taboff';
    if(typeof tabClick==='function')tabClick('blocks');
  }
  function newProject(keepRecovery){
    try{if(keepRecovery!==false)preserve('Before New project');}catch(error){status('Could not save a recovery copy. Export the project before starting again: '+error,true);return false;}
    setMode(false);moveUndo=null;resetEditor();(ws||Blockly.mainWorkspace).clear();
    if(typeof setWorkspaceSource==='function')setWorkspaceSource('');
    if(typeof renderContent==='function')renderContent();if(typeof showCompileUsage==='function')showCompileUsage('');
    var build=document.getElementById('build_output');if(build)build.textContent='';
    if(keepRecovery===false){localStorage.removeItem('arduino');localStorage.removeItem('arduino_source');}
    status(keepRecovery===false?'Project discarded. No recovery copy created.':'New empty project. Previous work is under Project → Recover blocks.');return true;
  }
  function dialog(title,message,actionLabel,action){
    var old=document.getElementById('ea-confirm');if(old)old.remove();
    var d=document.createElement('dialog');d.id='ea-confirm';d.className='ea-dialog';
    var h=document.createElement('h2');h.textContent=title;d.appendChild(h);
    var p=document.createElement('p');p.textContent=message;d.appendChild(p);
    var controls=document.createElement('div');controls.className='ea-dialog-buttons';
    var cancel=document.createElement('button');cancel.textContent='Cancel';cancel.onclick=function(){d.close();};controls.appendChild(cancel);
    var go=document.createElement('button');go.textContent=actionLabel;go.className='primary';go.onclick=function(){if(action()!==false)d.close();};controls.appendChild(go);d.appendChild(controls);document.body.appendChild(d);d.showModal();cancel.focus();
  }
  function askNew(){dialog('Close current project?','Start an empty project. Keep a local recovery copy, or discard this experiment without saving it.','Keep recovery & close',newProject);var d=document.getElementById('ea-confirm'),b=document.createElement('button');b.textContent='Discard without saving';b.onclick=function(){if(newProject(false)!==false)d.close();};d.querySelector('.ea-dialog-buttons').insertBefore(b,d.querySelector('.primary'));}
  function deleteSelected(){
    if(!chosen.length)return;
    dialog('Delete selected stacks?','Remove '+chosen.length+' complete stacks ('+count(chosen)+' blocks)? A copy of the whole project will be kept under Project → Recover blocks.','Delete selected',function(){
      try{preserve('Before deleting selected stacks');}catch(e){status('Could not save recovery copy: '+e,true);return false;}
      var remove=chosen.slice();chosen=[];moveUndo=null;remove.forEach(function(b){if(b.workspace===ws)b.dispose(false,false);});ws.fireChangeEvent();if(typeof backup_blocks==='function')backup_blocks();redraw();status('Selected stacks deleted. Recovery copy kept.');
    });
  }
  function restore(value){
    var xml;try{xml=Blockly.Xml.textToDom(value.xml);preserve('Before restoring a recovery copy');}catch(e){status('Cannot restore this copy: '+e,true);return false;}
    resetEditor();if(!replaceProjectXml(xml))return false;setWorkspaceSource(value.source||'');
    if(value.manualCode!==null&&value.manualCode!==undefined){tabClick('arduino');window.manualCode=true;window.manualCodeOriginal=null;var editor=document.getElementById('content_arduino');editor.value=value.manualCode;editor.readOnly=false;document.getElementById('edit_code').textContent='Back to blocks';}
    else if(value.rawXml!==null&&value.rawXml!==undefined){tabClick('xml');document.getElementById('content_xml').value=value.rawXml;}
    setMode(false);moveUndo=null;status('Recovery copy restored.');return true;
  }
  function recover(){
    var old=document.getElementById('recovery_dialog');if(old)old.remove();var d=document.createElement('dialog');d.id='recovery_dialog';d.className='ea-dialog';
    var h=document.createElement('h2');h.textContent='Recover projects';d.appendChild(h);
    var intro=document.createElement('p');intro.textContent='Copies kept before New project, selected-stack deletion, restoration, or a loading error. Restore keeps another copy of the current workspace first.';d.appendChild(intro);
    Object.keys(localStorage).filter(function(k){return k.indexOf('arduino_recovery_')===0;}).sort().reverse().forEach(function(key){
      var saved;try{saved=JSON.parse(localStorage.getItem(key));if(!saved.xml)return;}catch(e){return;}
      var row=document.createElement('section'),label=document.createElement('p');label.textContent=new Date(Number(key.slice(17))).toLocaleString()+' — '+(saved.reason||'Saved copy');row.appendChild(label);
      function button(text,click){var b=document.createElement('button');b.textContent=text;b.onclick=click;row.appendChild(b);}
      button('Restore',function(){if(restore(saved))d.close();});
      button('Download blocks',function(){saveAs(new Blob([saved.xml],{type:'text/xml'}),'recovered-'+key.slice(17)+'.xml');});
      if(saved.manualCode!==null&&saved.manualCode!==undefined)button('Download C++ edits',function(){saveAs(new Blob([saved.manualCode],{type:'text/plain'}),'recovered-'+key.slice(17)+'.ino');});
      if(saved.rawXml!==null&&saved.rawXml!==undefined)button('Download XML edits',function(){saveAs(new Blob([saved.rawXml],{type:'text/xml'}),'recovered-text-'+key.slice(17)+'.xml');});
      d.appendChild(row);
    });
    var close=document.createElement('button');close.textContent='Close';close.onclick=function(){d.close();};d.appendChild(close);document.body.appendChild(d);d.showModal();
  }
  function keyDown(e){
    if(!mode||(typeof selected!=='undefined'&&selected!=='blocks')||editable(e.target)||document.querySelector('dialog[open]'))return;
    if(e.key==='Escape'){stop(e);if(gesture&&gesture.kind==='move'){gesture.before.forEach(function(v){if(v.block.workspace!==ws)return;var p=v.block.getRelativeToSurfaceXY();v.block.moveBy(v.x-p.x,v.y-p.y);});}setMode(false);return;}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a'){stop(e);setSelection(ws.getTopBlocks(false));return;}
    if(e.key==='Delete'||e.key==='Backspace'){stop(e);deleteSelected();return;}
    var shifts={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]},shift=shifts[e.key];
    if(shift&&chosen.length){stop(e);moveUndo=chosen.map(function(b){var p=b.getRelativeToSurfaceXY();return {block:b,x:p.x,y:p.y};});var amount=e.shiftKey?10:1;chosen.forEach(function(b){b.moveBy(shift[0]*amount,shift[1]*amount);});ws.fireChangeEvent();if(typeof backup_blocks==='function')backup_blocks();redraw();}
  }
  function install(){
    if(document.getElementById('editor_actions'))return;ws=Blockly.mainWorkspace;
    bar=document.createElement('div');bar.id='editor_actions';bar.className='editor-actions';
    function button(id,text,click){var b=document.createElement('button');b.id=id;b.textContent=text;b.onclick=click;bar.appendChild(b);return b;}
    var newButton=button('new_project','New project',askNew);newButton.title='Start empty; choose recovery copy or discard without saving';
    selectButton=button('select_stacks','Select stacks',function(){if(!ensureBlocksMode())return;setMode(!mode);});selectButton.title='Select mode: drag a rectangle, Shift-click to add/remove; drag any selected stack to move the group. Arrow keys: 1 unit; Shift+arrows: 10; Escape: finish';
    allButton=button('select_all_stacks','Select all',function(){setSelection(ws.getTopBlocks(false));});
    undoButton=button('undo_group_move','Undo move',undoMove);deleteButton=button('delete_selected_stacks','Delete selected',deleteSelected);
    selectedLabel=document.createElement('span');selectedLabel.id='selection_status';selectedLabel.setAttribute('aria-live','polite');bar.appendChild(selectedLabel);
    var anchor=document.getElementById('examples-panel')||document.querySelector('.examplebar')||document.querySelector('.toolbar');anchor.parentNode.insertBefore(bar,anchor.nextSibling);
    layer=document.createElement('div');layer.className='ea-overlay';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
    document.addEventListener('mousedown',mouseDown,true);document.addEventListener('mousemove',mouseMove,true);document.addEventListener('mouseup',mouseUp,true);document.addEventListener('keydown',keyDown,true);
    window.addEventListener('blockly-workspace-view',scheduleRedraw);window.addEventListener('resize',scheduleRedraw);window.addEventListener('scroll',scheduleRedraw,true);ws.addChangeListener(scheduleRedraw);
    // Reuse existing menu entries, including keyboard-triggered activation.
    window.discard=askNew;window.recoverBlocks=recover;
    document.querySelectorAll('.menu button').forEach(function(b){if(b.getAttribute('onclick')==='discard()')b.textContent='New project…';});
    redraw();Blockly.fireUiEvent(window,'resize');
  }
  api.install=install;api.setMode=setMode;api.isSelecting=function(){return mode;};api.normalizeRoots=normalize;api.intersects=intersects;api.rectangle=rect;api.setSelection=setSelection;api.newProject=newProject;api.snapshot=snapshot;api.restoreSnapshot=restore;api.getSelection=function(){return chosen.slice();};
  window.BlocklyEditorActions=api;
}());
