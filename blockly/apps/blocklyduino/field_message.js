/* SPDX-License-Identifier: Apache-2.0
 * Compact serial text field. The saved value and the SVG label are independent.
 */
(function(){'use strict';
 function parts(value){var m=String(value).trim().match(/^(@[^\s]+\s+)?([\[{][\s\S]*)$/);if(!m)return null;return{prefix:m[1]||'',json:m[2]};}
 function formatted(value){var p=parts(value);if(!p)return value;try{return p.prefix+JSON.stringify(JSON.parse(p.json),null,2);}catch(e){return value;}}
 function compact(value,required){var p=parts(value);if(!p){if(required)throw Error('Enter a JSON object or array.');return value;}try{return p.prefix+JSON.stringify(JSON.parse(p.json));}catch(e){if(required||/^@(plot|image)\s/.test(p.prefix))throw e;return value;}}
 Blockly.FieldMessage=function(value,title,jsonOnly){this.payload_='';this.title_=title||'Message';this.jsonOnly_=!!jsonOnly;Blockly.Field.call(this,'');this.setValue(value);};
 Blockly.FieldMessage.prototype=Object.create(Blockly.Field.prototype);Blockly.FieldMessage.prototype.constructor=Blockly.FieldMessage;
 Blockly.FieldMessage.prototype.clone=function(){return new Blockly.FieldMessage(this.payload_,this.title_,this.jsonOnly_);};
 Blockly.FieldMessage.prototype.getValue=function(){return this.payload_;};
 Blockly.FieldMessage.prototype.setValue=function(value){this.payload_=String(value==null?'':value);var summary=this.payload_.replace(/\s+/g,' ');Blockly.Field.prototype.setText.call(this,(summary.length>38?summary.slice(0,35)+'…':summary)||'Edit message…');if(this.sourceBlock_&&this.sourceBlock_.workspace)this.sourceBlock_.workspace.fireChangeEvent();};
 Blockly.FieldMessage.prototype.showEditor_=function(){
  var field=this,old=document.getElementById('message-editor');if(old)old.remove();var d=document.createElement('dialog');d.id='message-editor';d.className='workbench-dialog message-editor';
  var h=document.createElement('h2');h.textContent=field.title_;d.appendChild(h);
  var hint=document.createElement('p');hint.textContent='Edit text freely. JSON is formatted here and sent on one line. The block keeps a short preview.';d.appendChild(hint);
  var area=document.createElement('textarea');area.value=formatted(field.getValue());area.setAttribute('aria-label',field.title_);area.spellcheck=false;d.appendChild(area);
  var error=document.createElement('p');error.className='error';error.setAttribute('role','alert');d.appendChild(error);
  var buttons=document.createElement('div');buttons.className='dialog-actions';
  function button(text,fn){var b=document.createElement('button');b.textContent=text;b.onclick=fn;buttons.appendChild(b);}
  button('Format JSON',function(){try{area.value=formatted(compact(area.value,true));error.textContent='';}catch(e){error.textContent='Invalid JSON: '+e.message;}});
  button('Cancel',function(){d.close();});button('Save',function(){try{field.setValue(compact(area.value,field.jsonOnly_));d.close();}catch(e){error.textContent='Invalid JSON: '+e.message;}});
  d.appendChild(buttons);document.body.appendChild(d);d.showModal();area.focus();
 };
 window.MessageText={format:formatted,compact:compact};
})();
