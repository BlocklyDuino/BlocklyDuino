/**
 * List of tab names.
 * @private
 */

'use strict';

var TABS_ = ['blocks', 'arduino'];

var selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
function tabClick(clickedName) {
  // Deselect all tabs and hide all panes.
  for (var i = 0; i < TABS_.length; i++) {
    var name = TABS_[i];
    document.getElementById('tab_' + name).className = 'taboff';
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  selected = clickedName;
  document.getElementById('tab_' + clickedName).className = 'tabon';
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility = 'visible';
  renderContent();
  Blockly.fireUiEvent(window, 'resize');
}

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
function renderContent() {
  var content = document.getElementById('content_' + selected);
  // Initialize the pane.
  if (content.id == 'content_blocks') {
    // If the workspace was changed by the XML tab, Firefox will have performed
    // an incomplete rendering due to Blockly being invisible.  Rerender.
    Blockly.mainWorkspace.render();
  } else if (content.id == 'content_arduino') {
    //content.innerHTML = Blockly.Arduino.workspaceToCode();
    var arduinoTextarea = document.getElementById('content_arduino');

    var output = Blockly.Arduino.workspaceToCode()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    arduinoTextarea.innerHTML = output;
    hljs.highlightBlock(arduinoTextarea);

    //IEでフォーカスさせると、navバーが消えるため
    var ua = window.navigator.userAgent;
    var isIE = false;
    if (ua.match(/MSIE/) || ua.match(/Trident/)) {
      isIE = true;
    }
    if (!isIE) {
      arduinoTextarea.focus();
    }
  }
}

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
function getBBox_(element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
}

/**
 * Initialize Blockly.  Called on page load.
 */
function init() {
  //window.onbeforeunload = function() {
  //  return 'Leaving this page will result in the loss of your work.';
  //};
  var container = document.getElementById('content_area');
  var onresize = function (e) {
    var bBox = getBBox_(container);
    for (var i = 0; i < TABS_.length; i++) {
      var el = document.getElementById('content_' + TABS_[i]);
      el.style.top = bBox.y + 'px';
      el.style.left = bBox.x + 'px';
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = bBox.height + 'px';
      el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
      el.style.width = bBox.width + 'px';
      el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
    }
    // Make the 'Blocks' tab line up with the toolbox.
    if (Blockly.mainWorkspace.toolbox_.width) {
      document.getElementById('tab_blocks').style.minWidth =
        (Blockly.mainWorkspace.toolbox_.width - 38) + 'px';
      // Account for the 19 pixel margin and on each side.
    }
  };
  window.addEventListener('resize', onresize, false);

  var toolbox = document.getElementById('toolbox');
  //var toolbox = buildtoolBox();
  Blockly.inject(document.getElementById('content_blocks'), {
    grid: {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    //media: 'media/',
    media: filepath.media,
    toolbox: toolbox
  });

  auto_save_and_restore_blocks();
  setCheckbox();

  //load from url parameter (single param)
  //http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
  var dest = unescape(location.search.replace(/^.*\=/, '')).replace(/\+/g, " ");
  if (dest) {
    //load_by_url(dest);
  }
}

function buildtoolBox() {
  var loadIds;
  var base = "category_logic,category_loops,category_array,category_math,category_text,category_variables,category_functions,category_sep,category_initializes,category_inout,category_time,category_serial,category_interrupts,category_sep";

  var option = window.localStorage.toolboxids;

  // set the default toolbox if none
  if (option === undefined || option === "") {
    loadIds = base;
  } else {
    loadIds = base + ',' + option;
  }

  //window.localStorage.toolboxids = loadIds;

  var xmlValue = '<xml id="toolbox">';
  var xmlids = loadIds.split(",");
  for (var i = 0; i < xmlids.length; i++) {
    if ($('#' + xmlids[i]).length) {
      xmlValue += $('#' + xmlids[i])[0].outerHTML;
    }
  }
  xmlValue += '</xml>';

  return xmlValue;
};

function setCheckbox() {
  var option = window.localStorage.toolboxids;
  if (option) {
    var options = option.split(',');
    for (var i = 0; i < options.length; i++) {
      $('#chbox_' + options[i]).prop('checked', true);
    }
  }
}

function loadxml() {
  var url = getParam()["url"];
  if (typeof url === "undefined") {
    var id = getParam()["id"];
    if (typeof id === "undefined") return;
    id = id.replace("#", "");
    url = 'https://raw.githubusercontent.com/makewitharduino/ArduinoSample/master/' + id + '/' + id + '.xml';
    if (!sendChrome(url)) {
      setXmlContent(url);
    }
  }
  setXmlContent(url);
}

function setXmlContent(url) {
  $.ajax({
    url: url,
    type: "GET",
    dataType: 'text',
    success: function (res) {
      var xml = res.responseText;
      if (xml.length > 0) {
        Blockly.mainWorkspace.clear();
        xml = xml.replace("<html><head/><body><xml>", '');
        xml = xml.replace("</body></html>", '');
        xml = '<xml xmlns="http://www.w3.org/1999/xhtml">' + xml;
        var xmlDoc = Blockly.Xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xmlDoc);
      }
    }
  });
}

function sendChrome(url) {
  var userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('chrome') != -1) {
    // 確認ボタン付きのダイアログボックスを表示する
    var result = confirm("Send XML for ChromeApp.");
    if (result) {
      var extId = "ohncgafccgdbigbbikgkfbkiebahihmb";
      chrome.runtime.sendMessage(extId, {url: url});
      return true;
    }
  }
  return false;
}

function getParam() {
  var url = location.href;
  var parameters = url.split('?');
  var paramsArray = [];
  if (parameters.length > 1) {
    var params = parameters[1].split('&');
    var paramsArray = [];
    for (var i = 0; i < params.length; i++) {
      var neet = params[i].split('=');
      paramsArray.push(neet[0]);
      paramsArray[neet[0]] = neet[1];
    }
  }
  return paramsArray;
}

function setScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'msg';
  var c = $.cookie("lang");

  var param;
  if (c) {
    param = c;
  } else {
    param = $('#languageSelect').val();
  }
  script.src = filepath["msg_" + param];

  var firstScript = document.getElementsByTagName('head')[0].appendChild(script);
  firstScript.parentNode.insertBefore(script, firstScript);
  script.onload = function (e) {
    setCharacter();
    init();
    loadxml();
  };
}

function getFiles() {
  // return {"sketch.ino": Blockly.Generator.workspaceToCode('Arduino') }
  //$('textarea#textarea_arduino').val() //&lt; et &lt;
  var code = $('textarea#textarea_arduino').val();

  code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  //code=code.replace(">","&gt;");
  //code = "<![CDATA[" + code + "]]>";
  //document.write (code);
  return {
    "sketch.ino": code
  };
}

function set_variable() {
  var input = document.getElementById('dialog_var_name');
  var newVar = input.value;
  if (newVar) {
    newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
    if (newVar == Blockly.Msg.RENAME_VARIABLE ||
      newVar == Blockly.Msg.NEW_VARIABLE) {
      // Ok, not ALL names are legal...
    }
    else {
      Blockly.Variables.renameVariable(Blockly.Msg.Valiable_text, newVar, Blockly.FieldVariable_workspace);
    }
  }
}

function upload() {
  var arduinoTextarea = document.getElementById('textarea_arduino');
  arduinoTextarea.value = Blockly.Generator.workspaceToCode('Arduino');
}

function export_xml() {
  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  var data = Blockly.Xml.domToText(xml);
  data = data.replace(/\r?\n/g, '');
  $('#textarea_export').val(data);
  $('#textarea_export').trigger('autoresize');
  $('#modal_export').openModal();
}

function import_xml() {
  var xml = $('#textarea_import').val();
  $('#textarea_import').val("");
  var xmlDoc = Blockly.Xml.textToDom(xml);
  // Blockly.mainWorkspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xmlDoc);
}

function bind() {
  $('#textarea_export').focus(function () {
    $(this).select();
  });
  $('#textarea_import').val("");

  var currentLang = getStringParamFromUrl('lang', 'en');
  console.log(currentLang);
  $('#languageSelect')
    .val(currentLang)
    .on('change', function () {
      var lang = $(this).val();
      console.log('change language to', lang);
      translation.changeLanguage(lang);
    })
    .msDropdown();
}

$(document).ready(function () {
  bind();
});

window.onload = function () {
  translation.init(function () {
    init();
    loadxml();
  });
};