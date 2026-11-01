const h=require('../project-device-tests/harness'),{assert,win,B,fs,out}=h;
win.Blockly=B;
win.eval(fs.readFileSync(out+'/ux_blocks.js','utf8'));
win.eval(fs.readFileSync(out+'/blockly_helper.js','utf8'));
win.eval(fs.readFileSync(out+'/editor_actions.js','utf8'));
const api=win.BlocklyEditorActions;let checks=0;
function ok(value,message){assert(value,message);checks++;}
const w=h.load('<xml><block type="base_delay" id="a" x="20" y="40"><value name="DELAY_TIME"><block type="math_number" id="n"><field name="NUM">25</field></block></value><next><block type="base_delay" id="b"><value name="DELAY_TIME"><block type="math_number" id="m"><field name="NUM">50</field></block></value></block></next></block><block type="base_delay" id="c" x="200" y="40"/></xml>');
const roots=w.getTopBlocks(false),all=w.getAllBlocks();
ok(roots.length===2,'Actual Blockly has two stacks');
ok(api.normalizeRoots(all).length===2,'Nested value and statement blocks normalize to two roots');
ok(api.normalizeRoots([all[0],all[0]]).length===1,'Duplicate roots removed');
const a=roots[0],child=a.getChildren()[0];ok(api.normalizeRoots([child])[0]===a,'Selecting a child selects its whole connected stack');
const flyout=h.newBlock(w,'math_number',{});flyout.isInFlyout=true;ok(api.normalizeRoots([flyout]).length===0,'Flyout blocks excluded');flyout.dispose();
const disposed=h.newBlock(w,'math_number',{});disposed.dispose();ok(api.normalizeRoots([disposed]).length===0,'Disposed blocks excluded');
let r=api.rectangle({x:100,y:150},{x:20,y:30});ok(r.left===20&&r.right===100&&r.top===30&&r.bottom===150,'Marquee works in all drag directions');
ok(api.intersects(r,{left:90,top:140,right:120,bottom:170}),'Marquee includes partially crossed stack');ok(!api.intersects(r,{left:101,top:30,right:130,bottom:90}),'Marquee excludes separated stack');
// Use real bundled Blockly serialization and persistence with the live page's form fields.
win.workspaceReady=true;win.currentExample='examples/test.xml';win.selected='arduino';win.manualCode=true;win.manualCodeOriginal='old generated';
win.document.getElementById('content_arduino').value='// manual unsaved\nvoid setup() {}\nvoid loop() {}';
let lastStatus='';win.editorStatus=function(m){lastStatus=m;};win.tabClick=function(name){win.selected=name;};win.renderContent=function(){};win.showCompileUsage=function(){};
const savedBefore=h.save(w),snap=api.snapshot('test');ok(snap.xml===savedBefore,'Snapshot saves actual blocks');ok(snap.manualCode.includes('// manual unsaved'),'Snapshot saves manual C++');ok(snap.source==='examples/test.xml','Snapshot saves source');
const xmlEdit='<xml>unfinished';win.selected='xml';win.manualCode=false;win.document.getElementById('content_xml').value=xmlEdit;ok(api.snapshot('xml').rawXml===xmlEdit,'Unapplied/invalid XML edits are retained verbatim');
win.manualCode=true;win.selected='arduino';win.history.replaceState(null,'','?url=examples%2Ftest.xml');
ok(api.newProject()===true,'New project completed');ok(w.getAllBlocks().length===0,'Workspace cleared');ok(win.location.search==='','Old example URL removed');ok(win.currentExample==='','Old source cleared');ok(win.localStorage.getItem('arduino').indexOf('<block')<0,'Empty workspace persisted immediately');ok(win.localStorage.getItem('arduino_source')==='','Autosave source reset');ok(!win.manualCode,'Manual edit mode reset');
const keys=Object.keys(win.localStorage).filter(k=>k.startsWith('arduino_recovery_'));ok(keys.length===1,'Recovery copy retained');const stored=JSON.parse(win.localStorage.getItem(keys[0]));ok(stored.xml===savedBefore,'Recovery contains original project');ok(stored.manualCode===snap.manualCode,'Recovery contains C++ edits');
ok(api.restoreSnapshot(stored),'Recovery can be restored');ok(w.getAllBlocks().length===5,'Restore recreates all blocks');ok(win.manualCode&&win.document.getElementById('content_arduino').value===snap.manualCode,'Restore returns C++ edit content');ok(win.localStorage.getItem('arduino_source')==='examples/test.xml','Restore returns source');
// Clear then restore from ordinary startup persistence: blank must stay blank.
api.newProject();const fresh=new B.Workspace();B.mainWorkspace=fresh;win.manualCode=false;win.selected='blocks';ok(win.restore_blocks(),'Startup accepts saved empty project');ok(fresh.getAllBlocks().length===0,'Reload does not resurrect the discarded example');
// A quota/storage failure must not destroy the workspace.
const live=h.load(savedBefore),native=win.localStorage;Object.defineProperty(win,'localStorage',{value:{getItem(){return null;},setItem(){throw Error('quota full');}},configurable:true});ok(api.newProject()===false,'Storage failure cancels destructive operation');ok(live.getAllBlocks().length===5,'All blocks survive failed recovery save');Object.defineProperty(win,'localStorage',{value:native,configurable:true});
const countBefore=Object.keys(native).filter(k=>k.startsWith('arduino_recovery_')).length;assert(api.newProject(false));assert.equal(live.getAllBlocks().length,0);assert.equal(Object.keys(native).filter(k=>k.startsWith('arduino_recovery_')).length,countBefore);assert.equal(native.getItem('arduino'),null);
console.log('PASS',checks,'editor selection / new-project assertions against actual bundled Blockly.');
