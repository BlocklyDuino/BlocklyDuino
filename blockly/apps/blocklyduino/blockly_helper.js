// Modified 2026: classic workbench extensions; see NOTICE and docs/CLASSIC-EXTENSIONS.md.
function workspaceContentCount(){var ws=Blockly.mainWorkspace;return ws.getAllBlocks().length+(window.BlocklyWorkspaceRegions?BlocklyWorkspaceRegions.get(ws).length:0);}
/**
 * Execute the user's code.
 * Just a quick and dirty eval.  No checks for infinite loops, etc.
 */
function runJS() {
  var code = Blockly.Generator.workspaceToCode('JavaScript');
  try {
    eval(code);
  } catch (e) {
    alert('Program error:\n' + e);
  }
}

/**
 * Backup code blocks to localStorage.
 */
var restoredWorkspace = false;
var workspaceReady = false;
var currentExample = '';
function preserveSavedBlocks(reason) {
 var raw=window.localStorage.getItem('arduino');if(!raw)return;
 var key='arduino_recovery_'+Date.now();
 window.localStorage.setItem(key,JSON.stringify({xml:raw,source:window.localStorage.getItem('arduino_source')||'',reason:reason}));
 var button=document.getElementById('recover_blocks');if(button)button.hidden=false;
}
function recoverBlocks() {
 var old=document.getElementById('recovery_dialog');if(old)old.remove();
 var dialog=document.createElement('dialog');dialog.id='recovery_dialog';
 var title=document.createElement('h2');title.textContent='Recovered block copies';dialog.appendChild(title);
 var note=document.createElement('p');note.textContent='These original XML copies were kept when loading failed. Download a copy before changing or restoring it.';dialog.appendChild(note);
 Object.keys(window.localStorage).filter(function(k){return k.indexOf('arduino_recovery_')===0;}).sort().reverse().forEach(function(key){
  var saved=JSON.parse(window.localStorage.getItem(key)),row=document.createElement('p'),button=document.createElement('button');
  button.textContent='Download '+new Date(Number(key.slice(17))).toLocaleString();button.onclick=function(){saveAs(new Blob([saved.xml],{type:'text/xml'}),'recovered-'+key.slice(17)+'.xml');};
  row.appendChild(button);row.appendChild(document.createTextNode(' '+saved.reason+(saved.source?' — '+saved.source:'')));dialog.appendChild(row);
 });
 var close=document.createElement('button');close.textContent='Close';close.onclick=function(){dialog.close();};dialog.appendChild(close);document.body.appendChild(dialog);dialog.showModal();
}
function initialLoadFailed(message) {
 try{preserveSavedBlocks('Example did not load');setWorkspaceSource('');}
 catch(error){workspaceReady=true;currentExample='';}
 editorStatus(message+' New blocks can still be saved. Previous blocks are under Project → Recover blocks.',true);
}
function backup_blocks() {
  if (!workspaceReady || !('localStorage' in window) || !Blockly.mainWorkspace) return;
  try {
    if (window.localStorage.arduino && window.localStorage.getItem('arduino_source') === null && !window.localStorage.arduino_legacy_backup)
      window.localStorage.arduino_legacy_backup = window.localStorage.arduino;
    var xml=Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    window.localStorage.setItem('arduino',Blockly.Xml.domToText(xml));
    window.localStorage.setItem('arduino_source',currentExample || '');
  } catch(error) { editorStatus('Could not save locally. Use Project → Save blocks. '+error,false); }
}
function setWorkspaceSource(source) {
  workspaceReady=true;
  currentExample=source || '';
  if(window.BlocklyExamples)BlocklyExamples.showLesson(currentExample);
  history.replaceState(null,'',location.pathname+(currentExample?'?url='+encodeURIComponent(currentExample):''));
  backup_blocks();
}
function restore_blocks() {
  if (!('localStorage' in window) || !window.localStorage.arduino) return false;
  var requested=new URLSearchParams(location.search).get('url') || '';
  var stored=window.localStorage.getItem('arduino_source') || '';
  if(requested && requested!==stored)return false;
  try {
    var xml=Blockly.Xml.textToDom(window.localStorage.arduino);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace,xml);
  } catch(error) {
    preserveSavedBlocks('Saved blocks could not be restored');
    Blockly.mainWorkspace.clear();currentExample='';
    editorStatus('Saved blocks could not be restored. Project → Recover blocks downloads the original XML.',true);
    return false;
  }
  currentExample=stored;
  if(window.BlocklyExamples)BlocklyExamples.showLesson(currentExample);
  editorStatus('Restored saved blocks. Choose an example to load its original version.',false);
  return true;
}

/**
* Save Arduino generated code to local file.
*/
function saveCode() {
  var fileName = window.prompt('What would you like to name your file?', 'BlocklyDuino')
  //doesn't save if the user quits the save prompt
  if(fileName){
    var code = window.manualCode ? document.getElementById('content_arduino').value : generateSketch();
    if (code === null) return;
    var blob = new Blob([code], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, fileName + '.ino');
  }
}

/**
 * Save blocks to local file.
 * better include Blob and FileSaver for browser compatibility
 */
function save() {
  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  var data = Blockly.Xml.domToText(xml);
  var fileName = window.prompt('What would you like to name your file?', 'BlocklyDuino');
  // Store data in blob.
  // var builder = new BlobBuilder();
  // builder.append(data);
  // saveAs(builder.getBlob('text/plain;charset=utf-8'), 'blockduino.xml');
  if(fileName){
    var blob = new Blob([data], {type: 'text/xml'});
    saveAs(blob, fileName + ".xml");
  } 
}

/**
 * Load blocks from local file.
 */
function load(event) {
  if(!ensureBlocksMode()) return;
  var files = event.target.files;
  // Only allow uploading one file.
  if (files.length != 1) {
    return;
  }

  // FileReader
  var reader = new FileReader();
  reader.onloadend = function(event) {
    var target = event.target;
    // 2 == FileReader.DONE
    if (target.readyState == 2) {
      try {
        var xml = Blockly.Xml.textToDom(target.result);
      } catch (e) {
        alert('Error parsing XML:\n' + e);
        return;
      }
      var count = workspaceContentCount();
      if (count && !confirm('Replace current project, including areas? Save blocks first to keep your changes.')) return;
      if(replaceProjectXml(xml))setWorkspaceSource('');
    }
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('load').value = '';
  };
  reader.readAsText(files[0]);
}

/**
 * Discard all blocks from the workspace.
 */
function discard() {
  if(!ensureBlocksMode()) return;
  var count = workspaceContentCount();
  if (count < 2 || window.confirm('Delete all ' + count + ' blocks?')) {
    Blockly.mainWorkspace.clear();
    setWorkspaceSource('');
    renderContent();
  }
}

/*
 * auto save and restore blocks
 */
function auto_save_and_restore_blocks() {
  // Restore synchronously after Blockly inject; report invalid stored XML.
  try { restoredWorkspace=restore_blocks(); } catch (error) { editorStatus('Could not restore saved blocks: ' + error, true); }
  // Hook a save function onto unload.
  bindEvent(window, 'unload', backup_blocks);
  bindEvent(window,'beforeunload',function(event){if(window.manualCode&&document.getElementById('content_arduino').value!==window.manualCodeOriginal){event.preventDefault();event.returnValue='';}});
  var recovery=document.getElementById('recover_blocks');if(recovery)recovery.hidden=!Object.keys(window.localStorage).some(function(k){return k.indexOf('arduino_recovery_')===0;});
  var saveTimer;Blockly.mainWorkspace.addChangeListener(function(){clearTimeout(saveTimer);saveTimer=setTimeout(backup_blocks,350);});
  tabClick(selected);

  // Init load event.
  var loadInput = document.getElementById('load');
  loadInput.addEventListener('change', load, false);
  document.getElementById('fakeload').onclick = function() {
    loadInput.click();
  };
}

/**
 * Bind an event to a function call.
 * @param {!Element} element Element upon which to listen.
 * @param {string} name Event name to listen to (e.g. 'mousedown').
 * @param {!Function} func Function to call when event is triggered.
 *     W3 browsers will call the function with the event object as a parameter,
 *     MSIE will not.
 */
function bindEvent(element, name, func) {
  if (element.addEventListener) {  // W3C
    element.addEventListener(name, func, false);
  } else if (element.attachEvent) {  // IE
    element.attachEvent('on' + name, func);
  }
}

//loading examples via ajax
var ajax;
function createAJAX() {
  if (window.ActiveXObject) { //IE
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e2) {
        return null;
      }
    }
  } else if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else {
    return null;
  }
}

function onSuccess() {
  if (ajax.readyState == 4) {
    if (ajax.status == 200) {
      try {
      var xml = Blockly.Xml.textToDom(ajax.responseText);
      } catch (e) {
        initialLoadFailed('Could not parse the requested example: '+e);
        return;
      }
      var count = workspaceContentCount();
      if (count && !confirm('Replace current project, including areas? Save blocks first to keep your changes.')) return;
      if(replaceProjectXml(xml))setWorkspaceSource(ajax.blocklySource || '');else initialLoadFailed('Could not open the requested example.');
    } else {
      initialLoadFailed('Could not load the requested example (HTTP '+ajax.status+').');
    }
  }
}

function load_by_url(uri) {
  ajax = createAJAX();
  if(ajax)ajax.blocklySource=uri;
  if (!ajax) {
　　   initialLoadFailed('This browser cannot load the requested example.');
　　   return 0;
　  }
  if (ajax.overrideMimeType) {
    ajax.overrideMimeType('text/xml');
  }

　　ajax.onreadystatechange = onSuccess;
　　ajax.open ("GET", uri, true);
　　ajax.send ("");
}

function uploadCode(code, callback, compileOnly) {
  var request = new XMLHttpRequest();
  document.querySelectorAll('.build-action').forEach(function(b){b.disabled=true;});
  editorStatus(compileOnly ? 'Compiling…' : 'Building and uploading…', false);
  request.open('POST', compileOnly ? '/compile' : '/', true);
  request.setRequestHeader('Content-Type','text/plain;charset=UTF-8');
  request.onload=function(){
    document.querySelectorAll('.build-action').forEach(function(b){b.disabled=false;});
    callback(request.status, request.status===200 ? null : request.responseText, request.responseText);
  };
  request.onerror=function(){
    document.querySelectorAll('.build-action').forEach(function(b){b.disabled=false;});
    callback(0, 'Cannot reach the local Arduino build service.', 'Connection failed.');
  };
  request.send(code);
}
function compileClick() {
  if(window.BlocklyTarget&&!BlocklyTarget.ready())return;
  var code=window.manualCode ? document.getElementById('content_arduino').value : generateSketch();
  if(code===null)return;
  uploadCode(code,function(status,error,detail){editorStatus(status===200?'Compiled successfully for the saved target.':'Build failed. Open Build output for details.',status!==200,detail||error);},true);
}
function uploadClick() {
  if(window.BlocklyTarget&&!BlocklyTarget.ready())return;
  var code=window.manualCode ? document.getElementById('content_arduino').value : generateSketch();
  if(code===null)return;
  uploadCode(code,function(status,error,detail){editorStatus(status===200?'Uploaded successfully to the saved target.':'Upload failed. Open Build output for details.',status!==200,detail||error);},false);
}
