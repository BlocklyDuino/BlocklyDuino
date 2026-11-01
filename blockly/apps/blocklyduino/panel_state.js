/* Persistent disclosure state; independent for editor, Monitor and Plotter. */
(function(){'use strict';
 function get(k){try{return localStorage.getItem('blocklyduino.panels.'+k);}catch(e){return null;}}
 function set(k,v){try{localStorage.setItem('blocklyduino.panels.'+k,v);}catch(e){}}
 function resize(){window.dispatchEvent(new Event('resize'));}
 function install(){document.querySelectorAll('details[data-panel-key]').forEach(function(d){if(d.dataset.stateReady)return;d.dataset.stateReady='yes';var k=d.dataset.panelKey,s=get(k);if(s!==null)d.open=s==='open';d.addEventListener('toggle',function(){set(k,d.open?'open':'closed');resize();});});}
 window.PanelState={install:install,get:get,set:set};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
