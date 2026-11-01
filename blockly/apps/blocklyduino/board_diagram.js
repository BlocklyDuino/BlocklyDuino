/* SPDX-License-Identifier: Apache-2.0
 * Board-specific logical header maps; clones can move auxiliary pads.
 */
(function(){'use strict';
 function layout(p){
  if(p.capabilities&&p.capabilities.layout)return p.capabilities.layout;
  if(p.id==='pico')return{name:'Raspberry Pi Pico · USB at top',left:['0','1','GND','2','3','4','5','GND','6','7','8','9','GND','10','11','12','13','GND','14','15'],right:['VBUS','VSYS','GND','3V3_EN','3V3','ADC_VREF','28','AGND','27','26','RUN','22','GND','21','20','19','18','GND','17','16'],extra:['25'],physical:true};
  if(p.id==='bluepill')return{name:'Blue Pill F103 · USB at top',left:['VBAT','PC13','PC14','PC15','PA0','PA1','PA2','PA3','PA4','PA5','PA6','PA7','PB0','PB1','PB10','PB11','RESET','3V3','GND','GND'],right:['PB12','PB13','PB14','PB15','PA8','PA9','PA10','PA11','PA12','PA15','PB3','PB4','PB5','PB6','PB7','PB8','PB9','5V','GND','3V3'],extra:['PA13','PA14'],physical:false};
  if(p.id==='avr328'){
   if(/:pro(:|$)/.test(p.fqbn))return{name:'Pro Mini · serial header at top',left:['1','0','RESET','GND','2','3','4','5','6','7','8','9'],right:['RAW','GND','RESET','VCC','A3','A2','A1','A0','13','12','11','10'],extra:['A4','A5','A6','A7'],physical:false};
   if(/:nano(:|$)/.test(p.fqbn))return{name:'Nano · USB at top',left:['1','0','RESET','GND','2','3','4','5','6','7','8','9','10','11','12'],right:['VIN','GND','RESET','5V','A7','A6','A5','A4','A3','A2','A1','A0','AREF','3V3','13'],extra:[],physical:false};
   return{name:/:diecimila/.test(p.fqbn)?'Duemilanove / Diecimila':'Uno',left:['AREF','GND','13','12','11','10','9','8','7','6','5','4','3','2','1','0'],right:['RESET','3V3','5V','GND','GND','VIN','A0','A1','A2','A3','A4','A5'],extra:[],physical:false,groups:true};
  }return null;
 }
 function capabilities(p,v){var list=[];[['digital','GPIO'],['analog','ADC'],['pwm','PWM'],['faststep','STEP Timer1'],['irq','INT'],['pcint','PCINT']].forEach(function(x){if((p[x[0]]||[]).indexOf(v)>=0)list.push(x[1]);});Object.keys(p.buses).forEach(function(bus){Object.keys(p.buses[bus]).forEach(function(role){if(p.buses[bus][role]===v)list.push(role);});});if(p.serial.indexOf(v)>=0)list.push('Serial');if(p.reserved.indexOf(v)>=0)list.push('reserved');if(v===p.led)list.push('LED');return list;}
 function render(p,a){var section=document.createElement('section');section.className='board-diagram';var model=layout(p);if(!model){section.textContent='Choose a supported board to see its pin map.';return section;}
  var ns='http://www.w3.org/2000/svg',height=145+Math.max(model.left.length,model.right.length)*36+(model.extra.length?75:0),svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1000 '+height);svg.setAttribute('role','img');svg.setAttribute('aria-label',model.name+' pin capabilities and project connections');
  function el(name,attrs,text,parent){var n=document.createElementNS(ns,name);Object.keys(attrs||{}).forEach(function(k){n.setAttribute(k,attrs[k]);});if(text!==undefined)n.textContent=text;(parent||svg).appendChild(n);return n;}
  el('title',{},model.name+' — occupied pins are coloured by device.');el('rect',{x:400,y:45,width:200,height:height-75,rx:18,fill:'#285a55'});el('rect',{x:457,y:32,width:86,height:38,rx:5,fill:'#c8d2d8'});el('rect',{x:453,y:height/2-38,width:94,height:76,rx:3,fill:'#192b33'});el('text',{x:500,y:100,'text-anchor':'middle',fill:'white','font-size':14},model.name.split(' · ')[0]);
  function pin(v,index,side,aux){var x=side==='left'?400:600,y=aux?height-52:135+index*36,anchor=side==='left'?'end':'start',tx=side==='left'?378:622,cs=a.claims[v]||[],cap=capabilities(p,v),bad=a.errors.some(function(e){return cs.some(function(c){return c.id===e.id;});}),colour='#a8babf';
   if(cs.length){colour='#528fa7';var b=Blockly.mainWorkspace.getBlockById(cs[0].id);if(b&&b.getField('DEVICE_HUE'))colour=Blockly.makeColour(Number(b.getFieldValue('DEVICE_HUE')));}
   if(bad)colour='#c43e43';var group=el('g',{'class':'board-pin','data-pin':v,tabindex:0});
   var owners=Array.from(new Set(cs.map(function(c){return c.name+' · '+c.role;}))).join(', '),label=/^(?:GND|AGND|VBAT|VBUS|VSYS|VCC|VIN|5V|3V3|RAW|RESET|RUN|AREF|ADC_VREF|3V3_EN)$/.test(v)?v:BoardResources.label(p,v);
   el('circle',{cx:x,cy:y,r:6,fill:colour,stroke:'#fff','stroke-width':2},undefined,group);
   el('text',{x:tx,y:y-2,'text-anchor':anchor,'font-size':14,fill:'#233b46','font-weight':600},(model.physical?(side==='left'?index+1:40-index)+' · ':'')+label+'  '+cap.join(' · '),group);
   el('text',{x:tx,y:y+13,'text-anchor':anchor,'font-size':12,fill:cs.length?colour:'#596d75'},owners.length>52?owners.slice(0,49)+'…':owners|| (cap.indexOf('reserved')>=0?'USB / debug / oscillator':cap.length?'available':'power / control'),group);
   el('title',{},label+'\n'+cap.join(', ')+(p.pwmTimer&&p.pwmTimer[v]?' · '+p.pwmTimer[v]:'')+'\n'+(owners||'No project claim'),group);
  }
  model.left.forEach(function(v,i){pin(v,i,'left');});model.right.forEach(function(v,i){pin(v,i,'right');});
  section.appendChild(svg);if(model.extra.length){var aux=document.createElement('p');aux.className='board-aux';aux.appendChild(document.createTextNode('Auxiliary pads / on-board: '));model.extra.forEach(function(v){var tag=document.createElement('span'),cs=a.claims[v]||[];tag.className='board-aux-pin';tag.textContent=BoardResources.label(p,v)+' · '+capabilities(p,v).join(' · ')+(cs.length?' — '+cs.map(function(c){return c.name+' '+c.role;}).join(', '):' · available');if(cs.length){var b=Blockly.mainWorkspace.getBlockById(cs[0].id);tag.style.borderColor=b&&b.getField('DEVICE_HUE')?Blockly.makeColour(Number(b.getFieldValue('DEVICE_HUE'))):'#528fa7';tag.style.backgroundColor='#e6eef2';}aux.appendChild(tag);});section.appendChild(aux);}
  var note=document.createElement('p');note.className='board-map-note';note.textContent=(model.groups?'Header groups shown as a logical map. ':'Component side; match the printed pin labels. ')+ 'Auxiliary pad positions can vary between clones. PWM labels describe hardware PWM. Servo/music pins depend on the selected engine; Timer1 stepping requires D9/D10. Hover or focus a pin for its owners and timer.';section.appendChild(note);return section;
 }
 window.BoardDiagram={render:render,layout:layout,capabilities:capabilities};
})();
