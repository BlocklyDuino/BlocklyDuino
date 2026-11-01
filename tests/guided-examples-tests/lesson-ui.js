/* Visible instructions must follow the opened lesson, including async switches. */
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const dom=new JSDOM('<select id="examples"></select><details id="example-lesson" hidden></details><main id="catalog"></main>',{url:'http://localhost/blockly/apps/blocklyduino/index.html',runScripts:'outside-only'});
const w=dom.window,d=w.document;
const sample={file:'55-demo.xml',title:'LED lab',group:'Start here',description:'Watch and change the built-in LED.',recommended:true,level:'beginner',hardware:[{id:'gpio',label:'Built-in LED'}],libraries:[],notes:[],verification:{ok:true,status:'compiled',flash:1000,staticRam:200},plotterModes:['line'],lesson:{wiring:'USB only. D13 LED is already on the board.',observe:'The LED blinks and Plotter reports its state.',change:'Move the interval slider.',serial:'plotter',baud:115200}};
const second={...sample,file:'72-glyph.xml',title:'LCD faces',group:'Displays',description:'Make custom faces.',recommended:false,hardware:[{id:'lcd',label:'LCD'}],plotterModes:[],lesson:{wiring:'SDA A4, SCL A5.',observe:'A face moves.',change:'Edit eight rows.',serial:'none'}};
const catalog={target:{label:'Pro Mini ATmega168'},groups:['Start here','Displays'],examples:[sample,second]};
let resolveFetch;w.fetch=()=>new Promise(resolve=>{resolveFetch=()=>resolve({ok:true,json:async()=>catalog});});
w.eval(fs.readFileSync('blockly/apps/blocklyduino/examples_catalog.js','utf8'));
(async()=>{
 const api=w.BlocklyExamples,panel=d.getElementById('example-lesson');
 const old=api.showLesson('examples/55-demo.xml');await api.showLesson('');resolveFetch();await old;
 assert(panel.hidden,'A late catalogue response must not restore a closed lesson');
 await api.showLesson('examples/55-demo.xml');assert(!panel.hidden);assert(panel.textContent.includes('USB only'));assert(panel.textContent.includes('Move the interval slider'));assert(panel.querySelector('a').href.endsWith('/serial_plotter.html'));assert(panel.textContent.includes('115200'));
 panel.open=false;panel.ontoggle();await api.showLesson('examples/72-glyph.xml');assert.equal(panel.open,false,'Collapse preference is retained');assert(panel.textContent.includes('SDA A4'));assert(!panel.querySelector('a'),'Standalone LCD does not misleadingly ask for Plotter');
 await api.showLesson('');assert(panel.hidden);await api.showLesson('examples/removed.xml');assert(panel.hidden);
 const select=d.getElementById('examples');await api.populate(select);assert.equal(select.options.length,3);
 const root=d.getElementById('catalog');await api.render(root);assert.equal(root.querySelectorAll('.lesson-group').length,2);assert.equal(root.querySelectorAll('.lesson-steps').length,2);assert(root.querySelector('.lesson-group').open);
 const search=root.querySelector('input');search.value='lcd';search.dispatchEvent(new w.Event('input'));assert.equal(root.querySelectorAll('.lesson-group:not([hidden])').length,1);assert(root.querySelector('.lesson-group:not([hidden])').open);assert(root.querySelector('.lesson-group:not([hidden])').textContent.includes('LCD faces'));
 search.value='unfindable';search.dispatchEvent(new w.Event('input'));assert(!root.querySelector('.catalog-empty').hidden);
 sample.lesson.wiring='<img src=x onerror=alert(1)>';await api.showLesson('examples/55-demo.xml');assert(!panel.querySelector('img'),'Lesson prose must be rendered as text');
 dom.window.close();console.log('PASS lesson instructions: source changes, late fetch, collapsed state, device-specific steps, grouped search, safe text');
})().catch(e=>{console.error(e);process.exitCode=1;dom.window.close();});
