const h=require('../project-device-tests/harness'),{assert,win,B,fs,out}=h;
win.Blockly=B;win.selected='blocks';win.editorStatus=function(){};
win.eval(fs.readFileSync(out+'/workspace_regions.js','utf8'));
const api=win.BlocklyWorkspaceRegions,w=h.load('<xml/>'),doc=win.document,NS='http://www.w3.org/2000/svg';let checks=0;
function ok(value,message){assert(value,message);checks++;}
function eq(a,b,message){assert.deepStrictEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)),message);checks++;}
const bar=doc.createElement('div');bar.id='editor_actions';doc.body.appendChild(bar);
const selectButton=doc.createElement('button');selectButton.id='select_stacks';selectButton.setAttribute('aria-pressed','false');bar.appendChild(selectButton);
let selecting=true;win.BlocklyEditorActions={setMode(on){selecting=!!on;selectButton.setAttribute('aria-pressed',String(selecting));},isSelecting(){return selecting;}};
const host=doc.getElementById('content_blocks'),svg=doc.createElementNS(NS,'svg'),group=doc.createElementNS(NS,'g'),background=doc.createElementNS(NS,'rect'),canvas=doc.createElementNS(NS,'g');
background.setAttribute('class','blocklyMainBackground');canvas.setAttribute('class','blocklyBlockCanvas');group.append(background,canvas);svg.appendChild(group);host.appendChild(svg);
let scale=2,tx=100,ty=60;
canvas.setAttribute('transform','translate(100,60) scale(2)');
canvas.getScreenCTM=()=>({inverse:()=>({a:1/scale,b:0,c:0,d:1/scale,e:-tx/scale,f:-ty/scale})});
svg.createSVGPoint=()=>({x:0,y:0,matrixTransform(m){return{x:this.x*m.a+this.y*m.c+m.e,y:this.x*m.b+this.y*m.d+m.f};}});
w.getCanvas=()=>canvas;w.addChangeListener=()=>{};
win.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};win.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
function mouse(el,type,x,y){el.dispatchEvent(new win.MouseEvent(type,{bubbles:true,cancelable:true,button:0,clientX:x,clientY:y}));}
function key(name){doc.body.dispatchEvent(new win.KeyboardEvent('keydown',{key:name,bubbles:true,cancelable:true}));}
api.install();api.setMode(true);ok(!selecting,'Entering area editing turns off stack selection');
doc.getElementById('add_workspace_area').click();mouse(background,'mousedown',120,100);mouse(win,'mousemove',620,460);mouse(win,'mouseup',620,460);
const dialog=doc.getElementById('workspace_area_dialog');ok(dialog&&dialog.hasAttribute('open'),'Dragging opens named-area dialog');
doc.getElementById('area_title').value='<img onerror=bad()> Inputs';doc.getElementById('area_description').value='<script>bad()</script>';
dialog.querySelector('form').dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true}));
const id=api.get(w)[0].id;eq({...api.get(w)[0],id:'fixed'},api.validate({id:'fixed',x:10,y:20,width:250,height:180,color:'#3185b5',title:'<img onerror=bad()> Inputs',description:'<script>bad()</script>'}),'Draw converts screen coordinates through transformed canvas');
ok(doc.querySelector('.wr-area-title').textContent.startsWith('<img'),'Title is literal SVG text');ok(!doc.querySelector('.workspace-regions-layer img, .workspace-regions-layer script'),'Text cannot inject markup');
ok(doc.querySelector('.workspace-regions-layer').getAttribute('transform')==='translate(100,60) scale(2)','Area layer matches zoom and scroll transform');
let title=doc.querySelector('.wr-area-titlebar');mouse(title,'mousedown',160,120);mouse(win,'mousemove',200,180);mouse(win,'mouseup',200,180);
eq([api.get(w)[0].x,api.get(w)[0].y],[30,50],'Title drag moves by workspace units at zoom 2');
let handle=doc.querySelector('.wr-area-handle');mouse(handle,'mousedown',650,450);mouse(win,'mousemove',750,510);mouse(win,'mouseup',750,510);
eq([api.get(w)[0].width,api.get(w)[0].height],[300,210],'Resize handle adjusts dimensions at zoom 2');
doc.getElementById('undo_workspace_area').click();eq([api.get(w)[0].width,api.get(w)[0].height],[250,180],'Undo area reverses completed resize');
// Escape restores a move in progress instead of leaving an unpersisted mutation.
const choose=doc.getElementById('workspace_area_select');choose.value=id;choose.dispatchEvent(new win.Event('change'));
let focusCall=null;win.BlocklyWorkspaceZoom={focusBounds(region,fit){focusCall={id:region.id,fit};}};
choose.value=id;choose.dispatchEvent(new win.Event('change'));eq(focusCall,{id,fit:false},'Choosing an area centers it while keeping current zoom');
doc.getElementById('focus_workspace_area').click();eq(focusCall,{id,fit:true},'Show explicitly fits the selected area after overview zoom');
ok(doc.getElementById('focus_workspace_area').title.includes('zoom to fit'),'Show tooltip explains area zoom');
title=doc.querySelector('.wr-area-titlebar');mouse(title,'mousedown',160,120);mouse(win,'mousemove',500,400);key('Escape');eq([api.get(w)[0].x,api.get(w)[0].y],[30,50],'Escape restores original position');ok(api.isEditing(),'First Escape only cancels current gesture');
// Screen-to-world conversion remains correct at zoom-out scales too.
scale=.5;tx=200;ty=100;canvas.setAttribute('transform','translate(200,100) scale(0.5)');
title=doc.querySelector('.wr-area-titlebar');mouse(title,'mousedown',230,130);mouse(win,'mousemove',245,140);mouse(win,'mouseup',245,140);eq([api.get(w)[0].x,api.get(w)[0].y],[60,70],'Title drag uses same world coordinates at zoom 0.5');
api.setMode(false);ok(!doc.querySelector('.workspace-regions-layer').classList.contains('wr-editing'),'Normal mode leaves annotation layer non-interactive');
api.setMode(true);title=doc.querySelector('.wr-area-titlebar');mouse(title,'mousedown',230,130);mouse(win,'mousemove',260,160);api.setMode(false);eq([api.get(w)[0].x,api.get(w)[0].y],[60,70],'Switching editor mode cancels unfinished move');
api.setMode(true);selectButton.setAttribute('aria-pressed','true');selectButton.click();ok(!api.isEditing(),'Stack-selection button exits area mode');
api.setMode(true);w.clear();ok(api.get(w).length===0&&!api.isEditing(),'Clearing workspace clears UI and annotations together');
console.log('PASS',checks,'region drawing, move, resize, escape, text safety and zoom-coordinate gesture checks.');
