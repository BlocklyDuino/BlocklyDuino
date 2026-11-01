/* SPDX-License-Identifier: Apache-2.0
 * Catalogue and visible lesson instructions share the same audited metadata.
 * Opening instructions never changes a workspace or sends serial commands.
 */
(function(){'use strict';
 var script=document.currentScript,base=new URL('.',script&&script.src||location.href),pending,lessonGeneration=0;
 window.BlocklyExampleCatalog=[];
 function node(tag,text,cls){var n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;}
 function load(){if(!pending)pending=fetch(new URL('examples/catalog.json',base).href,{cache:'no-cache'}).then(function(r){if(!r.ok)throw Error('Example catalogue could not be loaded.');return r.json();}).then(function(c){window.BlocklyExampleCatalog=c.examples;return c;}).catch(function(e){pending=null;throw e;});return pending;}
 function unavailable(e){var v=e.verification;return v&&(v.ok===false||/^(failed|oversized|does-not-fit|error|over-limit)$/.test(v.status));}
 function size(e){var v=e.verification||{},flash=v.flashBytes!=null?v.flashBytes:v.flash,ram=v.staticRamBytes!=null?v.staticRamBytes:v.staticRam!=null?v.staticRam:v.ram;return (flash!=null?'Flash '+flash+' / 14336 B':'')+(ram!=null?' · static RAM '+ram+' / 1024 B':'');}
 function sorted(c,group){return c.examples.filter(function(e){return e.group===group;}).sort(function(a,b){return Number(b.recommended)-Number(a.recommended)||a.file.localeCompare(b.file);});}
 function populate(select){if(!select)return Promise.resolve();return load().then(function(c){var selected=select.value;select.textContent='';var prompt=node('option','Choose an example…');prompt.value='';select.appendChild(prompt);c.groups.forEach(function(group){var list=sorted(c,group);if(!list.length)return;var optgroup=document.createElement('optgroup');optgroup.label=group;list.forEach(function(e){var opt=node('option',(e.recommended?'★ ':'')+e.title+(e.level==='advanced'?' · advanced':'')+(unavailable(e)?' · exceeds this target':''));opt.value=e.file;opt.title=e.description+' '+size(e)+' '+e.notes.join(' ');opt.disabled=unavailable(e);optgroup.appendChild(opt);});select.appendChild(optgroup);});select.value=selected;return c;}).catch(function(error){select.title=error.message;});}
 function instructions(e){
  var lesson=e.lesson||{},grid=node('dl',null,'lesson-steps');
  [['Connect',lesson.wiring||e.hardware.map(function(x){return x.label;}).join(' · ')],['Watch',lesson.observe||e.description],['Try changing',lesson.change||'Use the named values in the blocks. Compile and upload after editing.']].forEach(function(pair){var cell=node('div');cell.append(node('dt',pair[0]),node('dd',pair[1]));grid.appendChild(cell);});return grid;
 }
 function actions(e){var row=node('div',null,'lesson-actions'),lesson=e.lesson||{};
  if(lesson.serial==='plotter'||e.plotterModes&&e.plotterModes.length){var a=node('a','Open Plotter →');a.href=new URL('serial_plotter.html',base).href;a.target='BlocklyDuinoPlotter';row.appendChild(a);row.appendChild(node('span','After Upload: connect at '+(lesson.baud||115200)+' baud. The program builds its panel; press Start when prompted.'));}
  else if(lesson.serial==='monitor'){var m=node('a','Open Serial Monitor →');m.href=new URL('serial_monitor.html',base).href;m.target='BlocklyDuinoMonitor';row.append(m,node('span','Connect at '+(lesson.baud||115200)+' baud.'));}
  return row;
 }
 function resize(){window.dispatchEvent(new Event('resize'));if(window.Blockly&&Blockly.svgResize&&Blockly.mainWorkspace)Blockly.svgResize(Blockly.mainWorkspace);}
 function showLesson(source){
  var generation=++lessonGeneration,panel=document.getElementById('example-lesson');if(!panel)return Promise.resolve();
  panel.hidden=true;panel.replaceChildren();resize();
  var match=String(source||'').match(/(?:^|\/)examples\/([^/?#]+\.xml)$/);if(!match)return Promise.resolve();
  return load().then(function(c){if(generation!==lessonGeneration)return;var e=c.examples.find(function(x){return x.file===decodeURIComponent(match[1]);});if(!e)return;
   panel.append(node('summary','Lesson · '+e.title));var body=node('div',null,'lesson-body');body.append(instructions(e),actions(e));
   if(e.notes&&e.notes.length)body.appendChild(node('p',e.notes.join(' '),'lesson-note'));
   panel.appendChild(body);panel.hidden=false;try{panel.open=localStorage.getItem('blocklyduino.lesson.collapsed')!=='true';}catch(err){panel.open=true;}
   panel.ontoggle=function(){try{localStorage.setItem('blocklyduino.lesson.collapsed',String(!panel.open));}catch(err){}resize();};resize();
  }).catch(function(){/* A catalogue/network failure must not block the editor. */});
 }
 function render(container){if(!container)return Promise.resolve();return load().then(function(c){
  container.textContent='';container.classList.add('lesson-catalog');var search=node('input');search.type='search';search.placeholder='Find a device, library or activity';search.setAttribute('aria-label','Search examples');container.appendChild(search);
  container.appendChild(node('p','Choose an activity, follow its Connect / Watch / Try instructions, then upload. ★ marks a suggested starting point.','catalog-intro'));
  var sections=[];c.groups.forEach(function(group,index){var entries=sorted(c,group);if(!entries.length)return;var section=node('details',null,'lesson-group');section.open=index===0;section.appendChild(node('summary',group+' · '+entries.length));var list=node('ul');
   entries.forEach(function(e){var item=node('li'),link=node('a',(e.recommended?'★ ':'')+e.title,'lesson-title');link.href=new URL('index.html?url=examples/'+encodeURIComponent(e.file),base).href;item.append(link,node('p',e.description,'lesson-purpose'));
    var details=node('details',null,'lesson-how');details.append(node('summary','Wiring, expected result & things to change'),instructions(e),actions(e));
    var technical=node('p',(e.libraries.length?'Libraries: '+e.libraries.join(', ')+'. ':'')+size(e)+(e.notes.length?' — '+e.notes.join(' '):''),'lesson-technical');details.appendChild(technical);item.appendChild(details);
    item.dataset.search=(e.title+' '+e.description+' '+e.hardware.map(function(x){return x.label;}).join(' ')+' '+e.libraries.join(' ')+' '+Object.values(e.lesson||{}).join(' ')).toLowerCase();list.appendChild(item);
   });section.appendChild(list);container.appendChild(section);sections.push(section);});
  var empty=node('p','No matching activities. Try a device name such as LCD, servo or LED.','catalog-empty');empty.hidden=true;container.appendChild(empty);
  search.addEventListener('input',function(){var term=search.value.trim().toLowerCase(),count=0;sections.forEach(function(section,index){var visible=0;Array.prototype.forEach.call(section.querySelectorAll('li'),function(item){var show=!term||item.dataset.search.indexOf(term)>=0;item.hidden=!show;if(show)visible++;});section.hidden=!visible;section.open=!!term||index===0;count+=visible;});empty.hidden=count>0;});return c;
 });}
 window.BlocklyExamples={load:load,populate:populate,render:render,showLesson:showLesson};
})();
