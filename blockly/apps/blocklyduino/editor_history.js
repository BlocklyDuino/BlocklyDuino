/* SPDX-License-Identifier: Apache-2.0
 * Snapshot history for legacy Blockly (which predates the Events undo API).
 * XML includes device identities, mutations, comments, positions and areas.
 */
(function(){'use strict';var ws,states=[],at=-1,timer,restoring=false,undoButton,redoButton,limit=60,bytes=12*1024*1024;
 function capture(){return{xml:Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(ws)),source:window.currentExample||''};}
 function buttons(){if(undoButton)undoButton.disabled=at<1;if(redoButton)redoButton.disabled=at>=states.length-1;}
 function remember(){if(!ws||restoring||window.workspaceReady===false)return;clearTimeout(timer);if(Blockly.dragMode_){schedule();return;}var s=capture();if(at>=0&&s.xml===states[at].xml)return;
  states=states.slice(0,at+1);states.push(s);at=states.length-1;
  var size=states.reduce(function(n,x){return n+x.xml.length*2;},0);while(states.length>1&&(states.length>limit||size>bytes)){size-=states.shift().xml.length*2;at--;}
  buttons();
 }
 function schedule(){if(restoring)return;clearTimeout(timer);timer=setTimeout(remember,220);}
 function restore(index){if(index<0||index>=states.length)return false;var state=states[index],old=capture();restoring=true;clearTimeout(timer);
  try{if(window.BlocklyEditorActions)BlocklyEditorActions.setMode(false);Blockly.hideChaff();ws.clear();Blockly.Xml.domToWorkspace(ws,Blockly.Xml.textToDom(state.xml));at=index;
   if(typeof setWorkspaceSource==='function')setWorkspaceSource(state.source);if(window.BlocklyProjectDevices)BlocklyProjectDevices.refresh(true);if(window.BlocklyResources)BlocklyResources.update();if(typeof backup_blocks==='function')backup_blocks();
   // Restoring reconstructs legacy block IDs. Use the resulting equivalent XML
   // as the baseline rather than treating that reconstruction as an edit.
   states[at]=capture();buttons();return true;
  }catch(e){ws.clear();Blockly.Xml.domToWorkspace(ws,Blockly.Xml.textToDom(old.xml));if(typeof editorStatus==='function')editorStatus('Could not restore edit: '+e.message,true);return false;}
  finally{restoring=false;}
 }
 function undo(){remember();return restore(at-1);}function redo(){remember();return restore(at+1);}
 function install(){if(ws)return;ws=Blockly.mainWorkspace;states=[capture()];at=0;
  var bar=document.getElementById('editor_actions');function button(id,label,fn){var b=document.createElement('button');b.id=id;b.textContent=label;b.onclick=fn;bar.insertBefore(b,bar.children[1]||null);return b;}
  if(bar){redoButton=button('redo_edit','Redo',redo);undoButton=button('undo_edit','Undo',undo);undoButton.title='Undo (Ctrl+Z)';redoButton.title='Redo (Ctrl+Shift+Z / Ctrl+Y)';}
  ws.addChangeListener(schedule);
  // Capture the previous completed edit before another pointer/keyboard action,
  // while coalescing one drag or typing session into one history entry.
  document.addEventListener('pointerdown',function(e){if(!document.querySelector('dialog[open]')&&!/^(INPUT|TEXTAREA)$/.test(e.target.tagName))remember();},true);
  document.addEventListener('keydown',function(e){if(window.selected!=='blocks'||e.target.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)||document.querySelector('dialog[open]'))return;
   var k=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&(k==='z'||k==='y')){e.preventDefault();e.stopImmediatePropagation();if(k==='y'||e.shiftKey)redo();else undo();}
  },true);buttons();
 }
 window.BlocklyHistory={install:install,remember:remember,undo:undo,redo:redo,size:function(){return{length:states.length,index:at};}};
})();
