/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Servomotor blocks for Blockly.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

/*
 * Make the DIV element draggable
 */
dragElement(document.getElementById("keyboard_nav"));
dragElement(document.getElementById("helpModal"));

function dragElement(elmnt) {
    var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
    if (document.getElementById(elmnt.id + "_header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "_header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
};

// Simulate jQuery selector « $ »
// return a matrix if an element has right class
if (!document.getElementsByClassName ) {
  document.getElementsByClassName = function(cl, tag) {
    var els, matches = [],
      i = 0, len,
      regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
      els = document.getElementsByTagName(tag || "*");
      if ( !els[0] ) return false;
      for ( len = els.length; i < len; i++ ) {
        if ( els[i].className.match(regex) ) {
          matches.push( els[i]);
        }
      }      
      return matches;
  };
}
 
// Validate id, class, or tag.
var $ = function(el, tag) {
  var firstChar = el.charAt(0);
  if ( document.querySelectorAll ) return document.querySelectorAll(el);
  switch ( firstChar ) {
    case "#": return document.getElementById(el.slice(1) );
    case ".": return document.getElementsByClassName(el.slice(1), tag );
    default : return document.getElementsByTagName(el);
  }
};

// Usage
// $('#conteneur');
// Retourne un élément de classe « maClasse »
// $('.maClasse');
// Retourne un élément DIV de classe « maClasse »
// $('.maClasse', 'div');
// Retourne tous les éléments P
// $('p');

/*
 * Javascript function for collapsible content in modal
 */
function collapsibleContentInit() {
    var coll = document.getElementsByClassName("collapsibleButton");
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                document.getElementById("board_mini_picture_div").style.transform = "scale(1)";
                document.getElementById("board_mini_picture_div").style.top = "";
                document.getElementById("collapsibleContent").style.visibility = "hidden";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                document.getElementById("board_mini_picture_div").style.transform = "scale(1.7)";
                document.getElementById("board_mini_picture_div").style.top = "150px";
                document.getElementById("collapsibleContent").style.visibility = "visible";
            }
        });
    }
}

function toggleEditorReadOnly(item) {
    if (item.checked) {
        editor.setOptions({
            readOnly: false
        })
    } else {
        editor.setOptions({
            readOnly: true
        })
    }
}

/*
 * Accordion effect in lateral panel
 * https://www.w3schools.com/howto/howto_js_accordion.asp
 */
var acc = document.getElementsByClassName("accordion");
// var i;

for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + 15 + "px";
        }
    });
}
/*
 * Icons button mouser over
 */
document.getElementById('fullScreenButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['fullScreenButton_span'];
};
document.getElementById('fullScreenButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('undoButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['undoButton_span'];
};
document.getElementById('undoButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('redoButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['redoButton_span'];
};
document.getElementById('redoButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('verifyButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['verifyButton_span'];
};
document.getElementById('verifyButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('serialButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['serialButtonSpan'];
};
document.getElementById('serialButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('uploadButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['uploadButton_span'];
};
document.getElementById('uploadButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('serialConnectButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['serialConnectButton_span'];
};
document.getElementById('serialConnectButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('saveCodeButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['saveCodeButton_span'];
};
document.getElementById('saveCodeButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('newButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['newButton_span'];
};
document.getElementById('newButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('saveXMLButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['saveXMLButton_span'];
};
document.getElementById('saveXMLButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('loadXMLfakeButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['loadXMLfakeButton_span'];
};
document.getElementById('loadXMLfakeButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('resetButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['resetButton_span'];
};
document.getElementById('resetButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('parametersButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['setup_sideButton_span'];
};
document.getElementById('parametersButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('helpButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['helpButton_span'];
};
document.getElementById('helpButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('toolsButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['toolsButton_span'];
};
document.getElementById('toolsButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('wiringButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['wiringButton_span'];
};
document.getElementById('wiringButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('factoryButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['factoryButton_span'];
};
document.getElementById('factoryButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('htmlButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['htmlButton_span'];
};
document.getElementById('htmlButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('colorConversionButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['colorConversionButton_span'];
};
document.getElementById('colorConversionButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('dataConversionButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['dataConversionButton_span'];
};
document.getElementById('dataConversionButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('iotConnectButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['iotConnectButton_span'];
};
document.getElementById('iotConnectButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('launchWebServer').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['launchWebServer_span'];
};
document.getElementById('launchWebServer').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('papyrusConnect').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['papyrusConnect_span'];
};
document.getElementById('papyrusConnect').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('registerToOrchestrator').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['registerToOrchestrator_span'];
};
document.getElementById('registerToOrchestrator').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('blynkConnect').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['blynkConnect_span'];
};
document.getElementById('blynkConnect').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('lateral-panel-setup-label').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['setup_sideButton_span'];
};
document.getElementById('lateral-panel-setup-label').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('copyCodeButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['copyCodeButton_span'];
};
document.getElementById('copyCodeButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('coreUpdateButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['coreUpdateButton_span'];
};
document.getElementById('coreUpdateButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('cleanCLIcacheButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['cleanCLIcacheButton_span'];
};
document.getElementById('cleanCLIcacheButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('listBoardsButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['listBoardsButton_span'];
};
document.getElementById('listBoardsButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('installBoardsInput').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['installBoardsInput_span'];
};
document.getElementById('installBoardsInput').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('installBoardsButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['installBoardsButton_span'];
};
document.getElementById('installBoardsButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('searchlLibInput').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['searchlLibInput_span'];
};
document.getElementById('searchlLibInput').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('searchlLibButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['searchlLibButton_span'];
};
document.getElementById('searchlLibButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('installLibInput').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['installLibInput_span'];
};
document.getElementById('installLibInput').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('installLibButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['installLibButton_span'];
};
document.getElementById('installLibButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('CLI_githubLinkButton').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['CLI_githubLinkButton_span'];
};
document.getElementById('CLI_githubLinkButton').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};
document.getElementById('editorReadOnlyToggle').onmouseover = function () {
    document.getElementById("content_hoverButton").textContent = MSG['editorReadOnlyToggle_span'];
};
document.getElementById('editorReadOnlyToggle').onmouseout = function () {
    document.getElementById("content_hoverButton").textContent = "";
};