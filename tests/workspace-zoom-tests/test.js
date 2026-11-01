const fs=require('fs'),assert=require('assert'),{JSDOM}=require('jsdom');
const root='blockly';
const w=new JSDOM('<!doctype html><body><div id="editor_actions"></div><div id="content_blocks"></div></body>',{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost'}).window;
w.eval(fs.readFileSync(root+'/blockly_compressed.js','utf8')+'\nwindow.B=Blockly;');
const B=w.B;w.Blockly=B;w.eval(fs.readFileSync('blockly/apps/blocklyduino/workspace_zoom.js','utf8'));
function matrix(s=1,x=0,y=0){return {a:s,b:0,c:0,d:s,e:x,f:y,inverse(){return matrix(1/s,-x/s,-y/s);}};}
function point(){return {x:0,y:0,matrixTransform(m){return {x:m.a*this.x+m.c*this.y+m.e,y:m.b*this.x+m.d*this.y+m.f};}};}
const svg=w.document.createElementNS('http://www.w3.org/2000/svg','svg');w.document.getElementById('content_blocks').appendChild(svg);svg.createSVGPoint=point;svg.cachedWidth_=1050;svg.cachedHeight_=730;
Object.defineProperty(w.SVGElement.prototype,'getScreenCTM',{value:function(){
  if(this===svg)return matrix(1,23,111);
  const p=this.parentNode&&this.parentNode.getScreenCTM?this.parentNode.getScreenCTM():matrix();
  const t=(this.getAttribute('transform')||'').match(/translate\(([-.\de]+)[, ]+([-.\de]+)\)/),s=(this.getAttribute('transform')||'').match(/scale\(([-.\de]+)\)/);
  return matrix(p.a*(s?+s[1]:1),p.e+p.a*(t?+t[1]:0),p.f+p.d*(t?+t[2]:0));
}});
const ws=new B.WorkspaceSvg({svg,getMetrics:B.getMainWorkspaceMetrics_,setMetrics:B.setMainWorkspaceMetrics_});B.mainWorkspace=ws;svg.appendChild(ws.createDom());ws.toolbox_={width:180,clearSelection(){}};
let box={x:30,y:60,width:1250,height:1600};ws.getCanvas().getBBox=()=>box;ws.getTopBlocks=()=>[{}];ws.scrollbar=new B.ScrollbarPair(ws);
// hideChaff requires a full editor; it is unrelated to the coordinate contract.
B.hideChaff=()=>{};
let deletedAt;ws.isDeleteArea=function(e){deletedAt={x:e.clientX,y:e.clientY};};
let viewEvents=0;w.addEventListener('blockly-workspace-view',()=>viewEvents++);
const Z=w.BlocklyWorkspaceZoom;Z.install(ws);
function close(a,b,description){assert(Math.abs(a-b)<1e-7,description+': '+a+' vs '+b);}
let maxError=0;
for(let i=0;i<250;i++){
  const x=210+(i*47)%760,y=125+(i*67)%680;
  const before=Z.screenToWorkspace(x,y),s=[.01,.02,.1,.25,.5,.9,1.2,2,3,1][i%10];
  Z.setScale(s,x,y);const after=Z.screenToWorkspace(x,y);
  const error=Math.hypot((before.x-after.x)*s,(before.y-after.y)*s);maxError=Math.max(maxError,error);assert(error<1e-7,'Mouse anchor drift '+error);
  assert(ws.getCanvas().getAttribute('transform').endsWith('scale('+s+')'));
  const m=ws.getMetrics();assert(m.contentLeft<=m.viewLeft+1e-7);assert(m.contentTop<=m.viewTop+1e-7);
  // Use the actual legacy scrollbar implementation, including ratio conversions.
  if(i%10===0)ws.scrollbar.set(37,59);
}
// A normal SVG resize must retain the same workspace origin and zoom.
const previous={x:ws.scrollX,y:ws.scrollY,s:ws.scale};svg.cachedWidth_=900;svg.cachedHeight_=520;ws.scrollbar.resize();
close(ws.scrollX,previous.x,'Resize X');close(ws.scrollY,previous.y,'Resize Y');close(ws.scale,previous.s,'Resize scale');
// Annotation-only project: fit includes areas, and scrollbar content reaches them.
ws.getTopBlocks=()=>[];w.BlocklyWorkspaceRegions={bounds:()=>({x:2400,y:3300,width:700,height:350})};Z.fit();
let m=ws.getMetrics(),p=point();p.x=2750;p.y=3475;const screen=p.matrixTransform(ws.getCanvas().getScreenCTM());
close(screen.x,23+m.absoluteLeft+m.viewWidth/2,'Fit area X');close(screen.y,111+m.viewHeight/2,'Fit area Y');assert(m.contentLeft+m.contentWidth>=3100*ws.scale);
// Wheel handler zooms workspace but does not touch flyout/toolbox surfaces.
const flyout=w.document.createElementNS(svg.namespaceURI,'g');flyout.setAttribute('class','blocklyFlyout');svg.appendChild(flyout);
let old=ws.scale;flyout.dispatchEvent(new w.WheelEvent('wheel',{deltaY:-100,bubbles:true,cancelable:true,clientX:300,clientY:250}));assert.strictEqual(ws.scale,old);
const ev=new w.WheelEvent('wheel',{deltaY:100,bubbles:true,cancelable:true,clientX:400,clientY:400});ws.getCanvas().dispatchEvent(ev);assert(ev.defaultPrevented);assert(ws.scale<old);
// The actual old block onMouseMove_ receives world deltas and pixel delete coords.
Z.setScale(2,400,400);let snap;
// Reinstalling is a no-op; test the original installed wrapper through captured callback.
const rootNode=w.document.createElementNS(svg.namespaceURI,'g');ws.getCanvas().appendChild(rootNode);
const block={workspace:ws,startDragMouseX:300,startDragMouseY:260,startDragX:40,startDragY:50,draggedBubbles_:[],getSvgRoot:()=>rootNode,getConnections_:()=>[{closest(radius,dx,dy){snap={radius,dx,dy};return {};}}],isDeletable:()=>true};
B.dragMode_=2;let stop=false;B.BlockSvg.prototype.onMouseMove_.call(block,{type:'mousemove',clientX:420,clientY:340,button:0,stopPropagation(){stop=true;}});
assert.strictEqual(rootNode.getAttribute('transform'),'translate(100, 90)');close(snap.dx,60,'Block world delta');close(snap.dy,40,'Block world delta');close(snap.radius,B.SNAP_RADIUS/2,'Screen snap radius');assert(stop);assert.deepStrictEqual(deletedAt,{x:420,y:340});B.dragMode_=0;
// Bubbles preserve logical drag/resize geometry at high and low zoom.
const bubble={workspace_:ws,relativeLeft_:10,relativeTop_:20,dragDeltaX:0,dragDeltaY:0,positionBubble_(){},renderArrow_(){},autoLayout_:true};
bubble.dragDeltaX=10-300/2;bubble.dragDeltaY=20-200/2;
B.Bubble.prototype.bubbleMouseMove_.call(bubble,{clientX:420,clientY:280});close(bubble.relativeLeft_,70,'Bubble X');close(bubble.relativeTop_,60,'Bubble Y');
// At 1%, dragging a block still follows the pointer, with world deltas / 0.01.
Z.setScale(.01,400,400);B.dragMode_=2;
B.BlockSvg.prototype.onMouseMove_.call(block,{type:'mousemove',clientX:420,clientY:340,button:0,stopPropagation(){}});
assert.strictEqual(rootNode.getAttribute('transform'),'translate(12040, 8050)');close(snap.dx,12000,'1% block world X delta');close(snap.dy,8000,'1% block world Y delta');close(snap.radius,B.SNAP_RADIUS/.01,'1% screen snap radius');B.dragMode_=0;
// Fit can now show a much larger world region; limit stays 1% rather than 25%.
w.BlocklyWorkspaceRegions.bounds=()=>({x:-10000,y:-20000,width:70000,height:40000});Z.fit();
assert.strictEqual(Z.getScale(),.01);m=ws.getMetrics();
p=point();p.x=25000;p.y=0;const largeScreen=p.matrixTransform(ws.getCanvas().getScreenCTM());
close(largeScreen.x,23+m.absoluteLeft+m.viewWidth/2,'Large region Fit X');close(largeScreen.y,111+m.viewHeight/2,'Large region Fit Y');
Z.setScale(.001,400,400);assert.strictEqual(Z.getScale(),.01);Z.setScale(100,400,400);assert.strictEqual(Z.getScale(),3);
// Text editor uses real screen bounds at 200% and 1% without shrinking its text.
Z.setScale(2,400,400);
B.WidgetDiv.createDom();
const fieldRect=w.document.createElementNS(svg.namespaceURI,'rect');ws.getCanvas().appendChild(fieldRect);
let fieldBounds={left:330,top:280,right:510,bottom:320,width:180,height:40};
fieldRect.getBoundingClientRect=()=>fieldBounds;fieldRect.getBBox=()=>({x:0,y:0,width:90,height:20});
const field={sourceBlock_:{workspace:ws,RTL:false},borderRect_:fieldRect,fieldGroup_:{getBBox:()=>({width:90})},getAbsoluteXY_:()=>({x:fieldBounds.left,y:fieldBounds.top})};
B.FieldTextInput.prototype.resizeEditor_.call(field);
assert.strictEqual(B.WidgetDiv.DIV.style.width,'180px');assert.strictEqual(B.WidgetDiv.DIV.style.left,'330px');assert.strictEqual(B.WidgetDiv.DIV.style.top,'280px');
Z.setScale(.01,400,400);fieldBounds={left:300,top:160,right:300.9,bottom:160.2,width:.9,height:.2};B.FieldTextInput.prototype.resizeEditor_.call(field);assert.strictEqual(B.WidgetDiv.DIV.style.width,'90px');assert.strictEqual(B.WidgetDiv.DIV.style.top,'160px');
// Actual old Closure dropdown popup aligns below the *scaled* field, not its unscaled height.
B.WidgetDiv.DIV.getBoundingClientRect=()=>({width:120,height:100,left:0,top:0,right:120,bottom:100});
const dropdown=new B.FieldDropdown([['One','1'],['Two','2']]);dropdown.sourceBlock_={workspace:ws,RTL:false};dropdown.borderRect_=fieldRect;dropdown.getAbsoluteXY_=field.getAbsoluteXY_;
B.FieldDropdown.prototype.showEditor_.call(dropdown);assert.strictEqual(B.WidgetDiv.DIV.style.top,'160.2px');
B.WidgetDiv.hide();
assert(viewEvents>250);assert(w.document.getElementById('zoom_fit'));assert(!svg.getAttribute('transform'));
console.log(JSON.stringify({status:'PASS',anchorSamples:250,maxAnchorErrorPixels:maxError,checks:['real legacy scrollbar ratios','resize preserves origin','annotation-only fit and scroll bounds','flyout wheel excluded','block world drag and physical snap radius','bubble world drag','1% block drag and large-region Fit','actual FieldTextInput and dropdown positions at 1%','real delete-area pointer','toolbar and view events']}));
w.close();
