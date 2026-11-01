/* SPDX-License-Identifier: Apache-2.0
 * Fit every instrument into the remaining viewport; no serial side effects.
 */
(function(root,factory){var api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.PlotterLayout=api;api.install();}})(typeof window==='object'?window:this,function(){'use strict';
 function chooseGrid(count,width,height){
  count=Math.max(1,Math.min(16,count||1));width=Math.max(1,width||1);height=Math.max(1,height||1);var best={columns:1,rows:count},score=Infinity;
  for(var cols=1;cols<=Math.min(count,6);cols++){
   var rows=Math.ceil(count/cols),w=Math.max(1,(width-(cols-1)*8)/cols),h=Math.max(1,(height-(rows-1)*8)/rows);
   var candidate=Math.abs(Math.log((w/h)/1.55))+(cols*rows-count)/count*1.5+Math.max(0,180-w)/90+Math.max(0,95-h)/95;
   if(candidate<score){score=candidate;best={columns:cols,rows:rows};}
  }return best;
 }
 function install(){
  var body=document.body,grid=document.getElementById('dashboard'),choice=document.getElementById('layout-mode');if(!grid||!choice)return;
  var key='blocklyduino.plotter.layout.v1',queued=false,last='',observer;
  try{choice.value=localStorage.getItem(key)==='scroll'?'scroll':'fit';}catch(e){choice.value='fit';}
  // Put secondary controls/instructions in a bounded region. Long text or many
  // inputs may scroll inside it; the instruments themselves remain in view.
  var context=document.createElement('div');context.id='plotter-context';
  var settings=document.querySelector('details.saved-settings');body.insertBefore(context,settings||document.querySelector('.summary'));
  [settings,document.querySelector('.summary'),document.getElementById('dashboard-description'),document.getElementById('board-message'),document.getElementById('board-controls'),document.getElementById('notice')].forEach(function(el){if(el)context.appendChild(el);});
  var diagnostics=document.querySelector('details[data-panel-key="plotter.diagnostics"]');if(diagnostics){diagnostics.id='plotter-diagnostics';}
  function refresh(){
   queued=false;body.dataset.plotterLayout=choice.value;var count=grid.querySelectorAll(':scope > .widget').length,box=grid.getBoundingClientRect(),plan=chooseGrid(count,box.width,box.height),signature=[choice.value,count,plan.columns,plan.rows,Math.round(box.width),Math.round(box.height)].join('|');
   if(choice.value==='fit'){grid.style.gridTemplateColumns='repeat('+plan.columns+', minmax(0, 1fr))';grid.style.gridTemplateRows='repeat('+plan.rows+', minmax(0, 1fr))';}
   else{grid.style.gridTemplateColumns='';grid.style.gridTemplateRows='';}
   grid.dataset.instrumentCount=count;
   var scan=document.getElementById('scan-panel');
   body.dataset.contextOnly=count===0&&grid.children.length===0&&(!scan||scan.hidden)?'true':'false';
   if(signature!==last){last=signature;window.dispatchEvent(new Event('plotter-layout'));window.dispatchEvent(new Event('resize'));}
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(refresh);}}
  choice.addEventListener('change',function(){try{localStorage.setItem(key,choice.value);}catch(e){}schedule();});
  window.addEventListener('resize',schedule);document.addEventListener('toggle',schedule,true);
  if(typeof ResizeObserver==='function'){observer=new ResizeObserver(schedule);observer.observe(body);observer.observe(context);observer.observe(grid);}
  new MutationObserver(schedule).observe(grid,{childList:true});
  new MutationObserver(schedule).observe(document.getElementById('scan-panel'),{attributes:true,attributeFilter:['hidden']});
  schedule();api.refresh=schedule;
 }
 var api={chooseGrid:chooseGrid,install:install};return api;
});
