/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Accessibility functions, forked from https://github.com/google/blockly/commit/21763b7e00fbfe8010595382bf196410cd30844e
 * @author scanet@libreduc.cc (Sébastien CANET)
 */
 
// Custom requires for the playground.
// goog.require('Blockly.WorkspaceCommentSvg');
// goog.require('Blockly.WorkspaceCommentSvg.render');

'use strict';
var Code;


function setRenderDebugOptionCheckboxState(overrideOptions) {
    Code.blockRendering.Debug.config = overrideOptions || {};
    if (!overrideOptions) {
        return;
    }
    var renderDebugOptionsListEl = document.getElementById('renderDebugOptions');
    var renderDebugOptionInputs =
            renderDebugOptionsListEl.getElementsByTagName('input');
    for (var i = 0, optionInput;
            (optionInput = renderDebugOptionInputs[i]); i++) {
        var optionName = optionInput.getAttribute('data-optionName');
        optionInput.checked = !!overrideOptions[optionName];
    }
}

function updateRenderDebugOptions(e) {
    var target = e.target;
    var optionName = target.getAttribute('data-optionName');
    var config = Code.blockRendering.Debug.config;
    config[optionName] = !!target.checked;
    sessionStorage.setItem('blockRenderDebugOptions', JSON.stringify(config));
    Code.workspace.render();
}

function addRenderDebugOptionsCheckboxes() {
    var renderDebugConfig = Code.blockRendering.Debug.config;
    var renderDebugOptionsListEl = document.getElementById('renderDebugOptions');
    var optionNames = Object.keys(renderDebugConfig);
    for (var i = 0, optionName; (optionName = optionNames[i]); i++) {
        var optionCheckId = 'RenderDebug' + optionName + 'Check';
        var optionLabel = document.createElement('label');
        optionLabel.setAttribute('for', optionCheckId);
        optionLabel.textContent = optionName;
        var optionCheck = document.createElement('input');
        optionCheck.setAttribute('type', 'checkbox');
        optionCheck.setAttribute('id', optionCheckId);
        optionCheck.setAttribute('data-optionName', optionName);
        optionCheck.onclick = updateRenderDebugOptions;
        var optionLi = document.createElement('li');
        optionLi.appendChild(optionLabel);
        optionLi.appendChild(optionCheck);
        renderDebugOptionsListEl.appendChild(optionLi);
    }
}

function changeTheme(themeChoice) {
    if (themeChoice === "dark") {
        Blockly.getMainWorkspace().setTheme(Blockly.Themes.Dark);
    } else if (themeChoice === "high_contrast") {
        Blockly.getMainWorkspace().setTheme(Blockly.Themes.HighContrast);
    } else if (themeChoice === "deuteranopia") {
        Blockly.getMainWorkspace().setTheme(Blockly.Themes.Deuteranopia);
    } else if (themeChoice === "tritanopia") {
        Blockly.getMainWorkspace().setTheme(Blockly.Themes.Tritanopia);
    } else if (themeChoice === "modern") {
        Blockly.getMainWorkspace().setTheme(Blockly.Themes.Modern);
    } else if (themeChoice === "blackWhite") {
        Blockly.getMainWorkspace().setTheme(Blockly.Themes.blackWhite);
    } else if (themeChoice === "zelos") {
        Blockly.getMainWorkspace().setTheme(Blockly.Themes.Zelos);
    } else {
        Code.workspace.setTheme(Blockly.Themes.Classic);
    }
}
;

/**
 * Sort and list elements with class 'access' for size change
 */
function getElementsByClass(searchClass, node, tag) {
    var classElements = new Array();
    if (node === null)
        node = document;
    if (tag === null)
        tag = '*';
    var els = node.getElementsByTagName(tag);
    var elsLen = els.length;
    var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
    for (var i = 0, j = 0; i < elsLen; i++) {
        if (pattern.test(els[i].className)) {
            classElements[j] = els[i];
            j++;
        }
    }
    return classElements;
}
/**
 * Modify all element with 'class' at the 'size'
 */

function fontSizePageModify(classToModify, sizeToModify) {
    var target = getElementsByClass(classToModify);
    for (i = 0; i < target.length; i++) {
        target[i].style.fontSize = sizeToModify;
    }
}

/**
 * Modify all element with 'class' at the 'spacing'
 */
function fontSpacingPageModify(classToModify, spacingToModify) {
    var target = getElementsByClass(classToModify);
    for (i = 0; i < target.length; i++) {
        target[i].style.letterSpacing = spacingToModify;
    }
}

function setOnOffLine() {
    // Set different config online vs local copy.
    if (location.protocol === 'file:') {
        document.getElementById('verifyButton').disabled = false;
        document.getElementById('serialButton').disabled = false;
        document.getElementById('uploadButton').disabled = false;
        document.getElementById('serialConnectButton').disabled = false;
        document.getElementById('serialMenu').disabled = false;
        // not same button if in Electron or browser, if local nodejs watches events
        document.getElementById('wiringButton').onclick = "";
        document.getElementById('factoryButton').onclick = "";
        document.getElementById('htmlButton').onclick = "";
        //modifiy icons in menu button to be precise, if it's online or local file
        document.getElementById('newButton_span').innerHTML = '<i class="far fa-file"></i>';
        document.getElementById('loadXMLfakeButton_span').innerHTML = '<i class="far fa-folder-open"></i>';
        document.getElementById('saveXMLButton_span').innerHTML = '<i class="far fa-save"></i>';
        document.getElementById('saveCodeButton_span').innerHTML = '<i class="far fa-file-code"></i>';
    } else {
        document.getElementById('verifyButton').disabled = true;
        document.getElementById('serialButton').disabled = true;
        document.getElementById('uploadButton').disabled = true;
        document.getElementById('serialConnectButton').disabled = true;
        document.getElementById('serialMenu').disabled = true;
        // not same button if in Electron or browser, if web just webpages launched in browser
        document.getElementById('wiringButton').onclick = "parent.open('tools/hackcable/index.html')";
        document.getElementById('factoryButton').onclick = "Code.BlockFactory()')";
        document.getElementById('htmlButton').onclick = "parent.open('tools/html/html_factory.html')";
        //modifiy icons in menu button to be precise, if it's online or local file
        document.getElementById('newButton_span').innerHTML = '<i class="far fa-file"></i>';
        document.getElementById('loadXMLfakeButton_span').innerHTML = '<i class="fas fa-file-upload"></i>';
        document.getElementById('saveXMLButton_span').innerHTML = '<i class="fas fa-file-download"></i>';
        document.getElementById('saveCodeButton_span').innerHTML = '<i class="fas fa-file-export"></i>';
        // hide everything relative to arduino-cli if online
        var elmts = getElementsByClass("CLI", null, null);
        for (var i = 0; i < elmts.length; i++)
            elmts[i].disabled = true;
    }
    document.getElementsByClassName("ace_content").position = "";
}

function getToolboxElement() {
    var match = location.search.match(/toolbox=([^&]+)/);
    // Default to the basic toolbox with categories and untyped variables,
    // but override that if the toolbox type is set in the URL.
    var toolboxSuffix = (match ? match[1] : 'categories');
    // The three possible values are: "simple", "categories",
    // "categories-typed-variables".
    return document.getElementById('toolbox-' + toolboxSuffix);
}
;

function toggleAccessibilityMode(state) {
    if (state) {
        Blockly.navigation.enableKeyboardAccessibility();
    } else {
        Blockly.navigation.disableKeyboardAccessibility();
    }
}
;

function configureContextualMenu(menuOptions, e) {
    var screenshotOption = {
        text: MSG['screenshot'],
        enabled: Code.workspace.getTopBlocks().length,
        callback: function () {
            Blockly.downloadScreenshot(Code.workspace);
        }
    };
    menuOptions.push(screenshotOption);

    // Adds a default-sized workspace comment to the workspace.
    menuOptions.push(Blockly.ContextMenu.workspaceCommentOption(Code.workspace, e));
}
;
