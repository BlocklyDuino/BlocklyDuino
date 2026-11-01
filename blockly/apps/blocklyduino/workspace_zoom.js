/* Cursor-anchored workspace zoom for the bundled pre-zoom Blockly.
 * Workspace geometry stays in logical units. Scrolling/scrollbars stay in SVG
 * pixels. Only the block and bubble canvases are scaled, never the toolbox.
 */
(function () {
  'use strict';
  var api = {}, ws, label, installed = false, MIN = 0.01, MAX = 3;
  function clamp(value) { return Math.max(MIN, Math.min(MAX, value)); }
  function scale() { return ws && ws.scale || 1; }
  function notify() {
    if (label) label.textContent = Math.round(scale() * 100) + '%';
    window.dispatchEvent(new CustomEvent('blockly-workspace-view', {detail: api.view()}));
  }
  function merged(a, b) {
    if (!a) return b; if (!b) return a;
    var x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    return {x:x, y:y, width:Math.max(a.x+a.width,b.x+b.width)-x, height:Math.max(a.y+a.height,b.y+b.height)-y};
  }
  function bounds() {
    var result = null;
    if (ws.getTopBlocks(false).length) result = ws.getCanvas().getBBox();
    if (window.BlocklyWorkspaceRegions) result = merged(result, BlocklyWorkspaceRegions.bounds(ws));
    return result;
  }
  function metrics() {
    var size = Blockly.svgSize(this.options.svg), thickness = Blockly.Scrollbar.scrollbarThickness;
    if (this.toolbox_) size.width -= this.toolbox_.width;
    var width = Math.max(1, size.width), height = Math.max(1, size.height);
    var box; try { box = bounds() || {x:0,y:0,width:0,height:0}; } catch (e) { return null; }
    var s = scale(), x = box.x*s, y = box.y*s, w = box.width*s, h = box.height*s;
    var vw = width-thickness, vh = height-thickness;
    var left = Math.min(x-vw/2, x+w-vw-(this.RTL?thickness:0)+5);
    var right = Math.max(x+w+vw/2, x+vw+(this.RTL?0:thickness)-5);
    var top = Math.min(y-vh/2, y+h-vh+5), bottom = Math.max(y+h+vh/2, y+vh+thickness-5);
    // Resizing scrollbars must never clamp away the point just anchored by zoom.
    left = Math.min(left,-this.scrollX); right = Math.max(right,-this.scrollX+width);
    top = Math.min(top,-this.scrollY); bottom = Math.max(bottom,-this.scrollY+height);
    return {viewHeight:height,viewWidth:width,contentHeight:bottom-top,contentWidth:right-left,
      viewTop:-this.scrollY,viewLeft:-this.scrollX,contentTop:top,contentLeft:left,
      absoluteTop:0,absoluteLeft:!this.RTL&&this.toolbox_?this.toolbox_.width:0};
  }
  function pointIn(element, clientX, clientY) {
    var svg = ws.options.svg, p = svg.createSVGPoint(); p.x=clientX; p.y=clientY;
    return p.matrixTransform(element.getScreenCTM().inverse());
  }
  function anchor(oldScale, newScale, oldX, oldY, x, y) {
    return {x:x-(x-oldX)*newScale/oldScale,y:y-(y-oldY)*newScale/oldScale};
  }
  function center() {
    var m = ws.getMetrics(), svg = ws.options.svg, p = svg.createSVGPoint();
    p.x=m.absoluteLeft+m.viewWidth/2; p.y=m.absoluteTop+m.viewHeight/2;
    return p.matrixTransform(svg.getScreenCTM());
  }
  function refresh() {
    var m = ws.getMetrics(); if (!m) return;
    ws.translate(ws.scrollX+m.absoluteLeft,ws.scrollY+m.absoluteTop);
    if (ws.scrollbar) ws.scrollbar.resize();
  }
  function setScale(value, clientX, clientY) {
    value=Number(value); if (!ws || !isFinite(value) || value<=0) return scale();
    var next=clamp(value), m=ws.getMetrics(); if(!m) return scale();
    if(typeof clientX!=='number'||typeof clientY!=='number'){var c=center();clientX=c.x;clientY=c.y;}
    var p=pointIn(ws.options.svg,clientX,clientY);
    var t=anchor(scale(),next,ws.scrollX+m.absoluteLeft,ws.scrollY+m.absoluteTop,p.x,p.y);
    Blockly.hideChaff(); ws.scale=next;
    ws.scrollX=t.x-m.absoluteLeft; ws.scrollY=t.y-m.absoluteTop;
    refresh(); return next;
  }
  function focusBounds(box, fit) {
    if(!ws||!box)return;
    var m=ws.getMetrics(); if(!m)return;
    if(fit)ws.scale=clamp(Math.min((m.viewWidth-70)/Math.max(1,box.width),(m.viewHeight-70)/Math.max(1,box.height)));
    ws.scrollX=m.viewWidth/2-(box.x+box.width/2)*scale();
    ws.scrollY=m.viewHeight/2-(box.y+box.height/2)*scale();
    Blockly.hideChaff();refresh();
  }
  function fit() { var b=bounds(); if(b)focusBounds(b,true);else { ws.scale=1;ws.scrollX=25;ws.scrollY=25;refresh(); } }
  function eventAt(e,x,y) {
    var result={};
    ['type','target','currentTarget','button','buttons','which','keyCode','ctrlKey','altKey','metaKey','shiftKey','pageX','pageY','screenX','screenY','relatedTarget'].forEach(function(k){result[k]=e[k];});
    result.clientX=x; result.clientY=y;
    ['preventDefault','stopPropagation','stopImmediatePropagation'].forEach(function(k){result[k]=function(){if(e[k])e[k]();};});
    return result;
  }
  function patchLegacyCoordinates() {
    var move=Blockly.BlockSvg.prototype.onMouseMove_;
    Blockly.BlockSvg.prototype.onMouseMove_=function(e){
      if(this.workspace!==ws||scale()===1)return move.call(this,e);
      var s=scale(), oldDrag=Blockly.DRAG_RADIUS, oldSnap=Blockly.SNAP_RADIUS, oldPointer=ws.zoomPointerEvent_;
      var fixed=eventAt(e,this.startDragMouseX+(e.clientX-this.startDragMouseX)/s,this.startDragMouseY+(e.clientY-this.startDragMouseY)/s);
      Blockly.DRAG_RADIUS=oldDrag/s;Blockly.SNAP_RADIUS=oldSnap/s;ws.zoomPointerEvent_=e;
      try{return move.call(this,fixed);}finally{Blockly.DRAG_RADIUS=oldDrag;Blockly.SNAP_RADIUS=oldSnap;ws.zoomPointerEvent_=oldPointer;}
    };
    var deleteArea=ws.isDeleteArea;
    ws.isDeleteArea=function(e){return deleteArea.call(this,this.zoomPointerEvent_||e);};
    var create=Blockly.Flyout.prototype.createBlockFunc_;
    Blockly.Flyout.prototype.createBlockFunc_=function(origin){
      var flyout=this, original=create.call(this,origin);
      return function(e){
        if(flyout.targetWorkspace_!==ws||scale()===1)return original(e);
        if(Blockly.isRightButton(e)||origin.disabled)return;
        var root=origin.getSvgRoot(), matrix=root.getScreenCTM(), old=pointIn(ws.getCanvas(),matrix.e,matrix.f);
        var block=Blockly.Xml.domToBlock(ws,Blockly.Xml.blockToDom_(origin)), current=block.getRelativeToSurfaceXY();
        block.moveBy(old.x-current.x,old.y-current.y);
        if(flyout.autoClose)flyout.hide();else flyout.filterForCapacity_();
        block.onMouseDown_(e);
      };
    };
    // Bubble move/resize records both endpoints in logical units.
    ['bubbleMouseDown_','bubbleMouseMove_','resizeMouseDown_','resizeMouseMove_'].forEach(function(name){
      var fn=Blockly.Bubble.prototype[name];Blockly.Bubble.prototype[name]=function(e){
        return fn.call(this,this.workspace_===ws?eventAt(e,e.clientX/scale(),e.clientY/scale()):e);
      };
    });
    var layout=Blockly.Bubble.prototype.layoutBubble_;
    Blockly.Bubble.prototype.layoutBubble_=function(){
      if(this.workspace_!==ws||scale()===1)return layout.call(this);
      var original=ws.getMetrics;
      ws.getMetrics=function(){var m=original.call(ws),copy={};Object.keys(m).forEach(function(k){copy[k]=m[k]/scale();});return copy;};
      try{return layout.call(this);}finally{ws.getMetrics=original;}
    };
    // Legacy coordinate summation only understood translation. Use the SVG matrix
    // for effects originating inside the scaled main canvas; other surfaces retain it.
    var svgXY=Blockly.getSvgXY_;
    Blockly.getSvgXY_=function(element){
      if(element&&((ws.getCanvas().contains(element))||(ws.getBubbleCanvas().contains(element)))){
        var m=element.getScreenCTM();if(m)return pointIn(ws.options.svg,m.e,m.f);
      }
      return svgXY(element);
    };
    var resizeInput=Blockly.FieldTextInput.prototype.resizeEditor_;
    Blockly.FieldTextInput.prototype.resizeEditor_=function(){
      resizeInput.call(this);
      if(!this.sourceBlock_||this.sourceBlock_.workspace!==ws||scale()===1)return;
      var rect=this.borderRect_.getBoundingClientRect(), div=Blockly.WidgetDiv.DIV;
      // The text editor remains comfortably readable even at 1% workspace zoom.
      var width=Math.max(35,this.fieldGroup_.getBBox().width,rect.width);
      div.style.width=width+'px';div.style.left=(this.sourceBlock_.RTL?rect.right-width:rect.left)+window.pageXOffset+'px';
      div.style.top=rect.top+window.pageYOffset+'px';
    };
    var dropdown=Blockly.FieldDropdown.prototype.showEditor_;
    Blockly.FieldDropdown.prototype.showEditor_=function(){
      dropdown.apply(this,arguments);
      if(!this.sourceBlock_||this.sourceBlock_.workspace!==ws||scale()===1)return;
      var rect=this.borderRect_.getBoundingClientRect(), div=Blockly.WidgetDiv.DIV, menu=div.getBoundingClientRect();
      var y=rect.bottom+menu.height>window.innerHeight?rect.top-menu.height:rect.bottom;
      div.style.top=Math.max(0,y)+window.pageYOffset+'px';
      if(this.sourceBlock_.RTL)div.style.left=Math.max(0,Math.min(window.innerWidth-menu.width,rect.right-menu.width)) +window.pageXOffset+'px';
    };
  }
  function wheel(e) {
    if(typeof selected!=='undefined'&&selected!=='blocks')return;
    for(var el=e.target;el&&el!==ws.options.svg;el=el.parentNode){
      var cls=el.getAttribute&&el.getAttribute('class')||'';
      if(/blocklyFlyout|blocklyScrollbar|blocklyTrash|blocklyToolbox|blocklyWidget|blocklyMutator/.test(cls))return;
      if(el.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))return;
    }
    if(!e.deltaY)return;
    e.preventDefault();e.stopPropagation();
    if(Blockly.dragMode_||ws.isScrolling)return;
    var delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?ws.getMetrics().viewHeight:1);
    setScale(scale()*Math.exp(-Math.max(-350,Math.min(350,delta))*0.002),e.clientX,e.clientY);
  }
  function toolbar() {
    var host=document.getElementById('editor_actions');if(!host)return;
    var group=document.createElement('span');group.id='workspace_zoom';group.className='workspace-zoom';group.setAttribute('aria-label','Workspace zoom');
    function button(id,text,title,fn){var b=document.createElement('button');b.id=id;b.textContent=text;b.title=title;b.setAttribute('aria-label',title);b.onclick=fn;group.appendChild(b);return b;}
    button('zoom_out','−','Zoom out around the workspace centre',function(){setScale(scale()/1.2);});
    label=button('zoom_reset','100%','Reset to 100%. Wheel zoom: 1–300%, centred on the pointer.',function(){setScale(1);});
    button('zoom_in','+','Zoom in around the workspace centre',function(){setScale(scale()*1.2);});
    button('zoom_fit','Fit','Fit all blocks and labelled areas in the workspace',fit);
    host.appendChild(group);
  }
  function install(workspace) {
    if(installed)return api;ws=workspace||Blockly.mainWorkspace;if(!ws||!ws.getCanvas)return api;
    installed=true;ws.scale=1;ws.getMetrics=metrics;
    ws.translate=function(x,y){
      var transform='translate('+x+','+y+') scale('+scale()+')';
      this.getCanvas().setAttribute('transform',transform);this.getBubbleCanvas().setAttribute('transform',transform);
      if(this.options.gridPattern){this.options.gridPattern.setAttribute('x',x);this.options.gridPattern.setAttribute('y',y);}
      notify();
    };
    patchLegacyCoordinates();toolbar();
    ws.options.svg.addEventListener('wheel',wheel,{passive:false});refresh();
    return api;
  }
  api.install=install;api.setScale=setScale;api.getScale=scale;api.fit=fit;api.focusBounds=focusBounds;
  api.screenToWorkspace=function(x,y){return pointIn(ws.getCanvas(),x,y);};
  api.view=function(){return {workspace:ws,scale:scale(),scrollX:ws?ws.scrollX:0,scrollY:ws?ws.scrollY:0};};
  api.anchor=anchor;
  window.BlocklyWorkspaceZoom=api;
}());
