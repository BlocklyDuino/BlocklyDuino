const h=require('../project-device-tests/harness'),{assert,win,B,fs,out}=h;
win.Blockly=B;
win.eval(fs.readFileSync(out+'/workspace_regions.js','utf8'));
const api=win.BlocklyWorkspaceRegions;let checks=0;
function ok(value,message){assert(value,message);checks++;}
function rejects(fn,message){assert.throws(fn);checks++;}
function eq(a,b,message){assert.deepStrictEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)),message);checks++;}
const blockXml='<xml><block type="base_delay" id="a" x="20" y="40"><value name="DELAY_TIME"><block type="math_number"><field name="NUM">25</field></block></value></block></xml>';
const w=h.load(blockXml),code=h.generate(w);
const region={id:'area_test',x:-25,y:20,width:300,height:170,color:'#3185b5',title:'Pins <3 & "names"',description:'<script>bad()</script>\nWatch <pin> & ISR.'};
api.add(w,region);
ok(h.generate(w)===code,'Area never changes Arduino output');
const saved=h.save(w);
ok(saved.includes('<workspace-regions version="1">'),'Serializer adds versioned project metadata');
ok(saved.includes('&lt;script&gt;bad()&lt;/script&gt;'),'Annotations are escaped as XML text');
ok(!saved.includes('<script>'),'Untrusted title/description cannot create tags');
const restored=h.load(saved);eq(api.get(restored),[region],'Coordinates, title, description and color survive startup load before install');
ok(restored.getAllBlocks().length===2,'Annotated XML restores ordinary blocks');
ok(h.generate(restored)===code,'Annotation roundtrip preserves generated code');
const only=api.bounds(restored);eq(only,{x:-25,y:20,width:300,height:170},'World bounds include area');
B.Xml.domToWorkspace(restored,B.Xml.textToDom('<xml><block type="math_number"/></xml>'));
ok(api.get(restored).length===1,'Adding a device/block XML without metadata preserves regions');
B.Xml.domToWorkspace(restored,B.Xml.textToDom(saved));
ok(api.get(restored).length===2,'Import merges areas');
ok(api.get(restored)[0].id!==api.get(restored)[1].id,'Import remaps colliding area IDs');
restored.clear();ok(api.get(restored).length===0,'Workspace clear erases areas');
ok(!h.save(restored).includes('workspace-regions'),'Empty project writes no obsolete metadata');
B.Xml.domToWorkspace(restored,B.Xml.textToDom(blockXml));ok(api.get(restored).length===0,'Older XML without metadata loads normally');
api.add(restored,region);api.update(restored,region.id,{x:99,title:'Changed'});ok(api.get(restored)[0].x===99,'Edit updates area');
api.undo(restored);eq(api.get(restored),[region],'Area undo restores previous dimensions and text');
api.remove(restored,region.id);ok(api.get(restored).length===0,'Delete area');api.undo(restored);eq(api.get(restored),[region],'Undo restores deleted area');
const second={...region,id:'area_two',x:350,y:-10,width:100,height:60};api.add(restored,second);eq(api.bounds(restored),{x:-25,y:-10,width:475,height:200},'Bounds combine separated areas');
for(const patch of [{x:Infinity},{x:NaN},{x:null},{y:''},{x:1000001},{width:59},{height:39},{height:100001},{title:'x'.repeat(121)},{description:'x'.repeat(2001)},{color:'red'},{id:'<img>'}])rejects(()=>api.validate({...region,...patch}),'Invalid metadata rejected');
rejects(()=>api.validateAll([region,region]),'Duplicate IDs rejected');
rejects(()=>api.validateAll(Array.from({length:101},(_,i)=>({...region,id:'r'+i}))),'Region count capped');
const before=h.save(restored),count=restored.getAllBlocks().length;
for(const invalid of [saved.replace('width="300"','width="NaN"'),saved.replace('version="1"','version="9"'),saved.replace('x="-25"',''),saved.replace('<region ','<unknown ').replace('</region>','</unknown>')]){
 rejects(()=>B.Xml.domToWorkspace(restored,B.Xml.textToDom(invalid)),'Malformed region XML rejected before block load');
 ok(restored.getAllBlocks().length===count,'Invalid metadata does not partially insert blocks');
 ok(h.save(restored)===before,'Invalid metadata leaves project unchanged');
}
eq(api.rectangle({x:100,y:150},{x:20,y:30}),{x:20,y:30,width:80,height:120},'Drawing supports any drag direction');
// The app startup restores autosave before installing toolbar UI.
win.eval(fs.readFileSync(out+'/ux_blocks.js','utf8'));
win.eval(fs.readFileSync(out+'/blockly_helper.js','utf8'));
win.eval(fs.readFileSync(out+'/editor_actions.js','utf8'));
win.workspaceReady=true;win.currentExample='examples/area-test.xml';win.selected='blocks';win.manualCode=false;
win.editorStatus=function(){};win.tabClick=function(name){win.selected=name;};win.renderContent=function(){};win.showCompileUsage=function(){};
B.mainWorkspace=restored;win.backup_blocks();const snapshot=win.BlocklyEditorActions.snapshot('Area test');
ok(snapshot.xml.includes('workspace-regions'),'Recovery snapshots include regions');
ok(win.BlocklyEditorActions.newProject(),'New project succeeds');ok(api.get(restored).length===0,'New project clears regions');
ok(!win.localStorage.getItem('arduino').includes('workspace-regions'),'New project autosave is empty');
ok(win.BlocklyEditorActions.restoreSnapshot(snapshot),'Recovery restores annotated project');ok(api.get(restored).length===2,'Recovery restores both areas');
const startup=new B.Workspace();B.mainWorkspace=startup;ok(win.restore_blocks(),'Startup restores autosave');eq(api.get(startup),api.get(restored),'Startup metadata survives before region UI installed');
console.log('PASS',checks,'region validation, persistence, autosave, recovery and code-generation checks.');
