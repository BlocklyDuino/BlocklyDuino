/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Set of function for keybaord navigation
 * forked from https://github.com/google/blockly/commit/5a92aff63e93dce884bbe2e715ba832244628501
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

var timeout;

/**
 * Turn on/off accessibility mode depending on the state.
 * @param {boolean} state True to turn on accessibility mode, false otherwise.
 * @package
 */
function toggleAccessibilityMode(state) {
    if (state) {
        Blockly.navigation.enableKeyboardAccessibility();
    } else {
        Blockly.navigation.disableKeyboardAccessibility();
    }
}

/**
 * Change the type of the cursor and set to the location of the old cursor.
 * Changing the cursor changes how a user navigates the blocks on the workspace.
 * @param {string} cursorType The type of the cursor.
 * @package
 */
function changeCursor(cursorType) {
    Blockly.navigation.enableKeyboardAccessibility();
    document.getElementById('accessibilityModeCheck').checked = true;
    document.getElementById('cursorChanger').value = cursorType;
    var markerManager = Blockly.getMainWorkspace().getMarkerManager();
    var oldCurNode = markerManager.getCursor().getCurNode();
    if (cursorType === "basic") {
        Blockly.ASTNode.NAVIGATE_ALL_FIELDS = false;
        markerManager.setCursor(new Blockly.BasicCursor());
    } else if (cursorType === "line") {
        Blockly.ASTNode.NAVIGATE_ALL_FIELDS = true;
        markerManager.setCursor(new Blockly.LineCursor());
    } else {
        Blockly.ASTNode.NAVIGATE_ALL_FIELDS = false;
        markerManager.setCursor(new Blockly.Cursor());
    }
    if (oldCurNode) {
        markerManager.getCursor().setCurNode(oldCurNode);
    }
    document.activeElement.blur();
}

/**
 * Save the current key map in session storage.
 * @package
 */
function saveKeyMap() {
    var currentMap = Blockly.user.keyMap.getKeyMap();
    if (sessionStorage) {
        sessionStorage.setItem('keyMap', JSON.stringify(currentMap));
    }
}

/**
 * Set the key map to the map from session storage.
 * @package
 */
function restoreKeyMap() {
    var defaultMap = Blockly.user.keyMap.getKeyMap();
    var stringifiedMap = sessionStorage.getItem('keyMap');
    var restoredMap = {};
    if (sessionStorage && stringifiedMap) {
        var keyMap = JSON.parse(stringifiedMap);
        var keys = Object.keys(keyMap);
        for (var i = 0, key; key = keys[i]; i++) {
            restoredMap[key] = Object.assign(new Blockly.Action, keyMap[key]);
        }
        Blockly.user.keyMap.setKeyMap(restoredMap);
    }
}

/**
 * Given the three dropdowns create the serialized key that will be stored
 * in the key map.
 * @param {Array.<Element>} selectDivs The three dropdown divs that display
 *     the key combination.
 * @package
 */
function serializeKey(selectDivs) {
    var modifiers = Blockly.utils.object.values(Blockly.user.keyMap.modifierKeys);
    var newModifiers = [];
    var newKeyCode = '';
    var keyValue = selectDivs[2].value;

    // Get the new modifiers from the first two dropdowns.
    for (var i = 0; i < 2; i++) {
        var selectDiv = selectDivs[i];
        var key = selectDiv.value;
        if (key !== 'None') {
            newModifiers.push(key);
        }
    }
    // Get the key code from the last dropdown.
    if (keyValue !== 'None') {
        if (keyValue === 'Escape') {
            newKeyCode = Blockly.utils.KeyCodes.ESC;
        } else if (keyValue === 'Enter') {
            newKeyCode = Blockly.utils.KeyCodes.ENTER;
        } else {
            newKeyCode = keyValue.toUpperCase().charCodeAt(0);
        }
    }
    return Blockly.user.keyMap.createSerializedKey(newKeyCode, newModifiers);
}

/**
 * Set all dropdowns for that action to none.
 * We clear dropdowns when a user chooses the same key combination for a
 * second action.
 * @param {Blockly.Action} action The action that we want to clear the
 *     dropdowns for.
 * @package
 */
function clearDropdown(action) {
    var actionDiv = document.querySelectorAll('[data-actionname=' + action.name + ']')[0];
    var selectDivs = actionDiv.getElementsByTagName('select');
    for (var i = 0, selectDiv; selectDiv = selectDivs[i]; i++) {
        selectDiv.value = 'None';
    }
}

/**
 * Given the three dropdowns create a human readable string so the screen reader
 * can read it out.
 * @param {Array.<Element>} selectDivs The three dropdown divs that display
 *     the key combination.
 * @package
 */
function getReadableKey(selectDivs) {
    var readableKey = '';

    for (var i = 0, selectDiv; selectDiv = selectDivs[i]; i++) {
        if (selectDiv.value !== 'None') {
            readableKey += selectDiv.value + ' ';
        }
    }
    return readableKey;
}

/**
 * Update the key in the key map when the user selects a new value in one of the
 * dropdowns.
 * @param {Event} e The event dispatched from changing a dropdown.
 * @package
 */
function updateKey(e) {
    var keyboardAnnouncerText = '';
    var actionDiv = e.srcElement.parentElement;
    var action = actionDiv.action;
    var selectDivs = actionDiv.getElementsByTagName('select');
    var key = serializeKey(selectDivs);
    var oldAction = Blockly.user.keyMap.getActionByKeyCode(key);

    if (oldAction) {
        keyboardAnnouncerText += oldAction.name + ' action key was overwritten. \n';
        clearDropdown(oldAction);
    }
    keyboardAnnouncerText += action.name + ' key was set to ' + getReadableKey(selectDivs);
    document.getElementById('keyboard_announce').innerText = keyboardAnnouncerText;
    Blockly.user.keyMap.setActionForKey(key, action);
    saveKeyMap();
    document.activeElement.blur();
}

/**
 * Set the key to be the correct value from the key map.
 * @param {string} actionKey The serialized key for a given action.
 * @param {Element} keyDropdown The dropdown that displays the primary key.
 * @package
 */
function setKeyDropdown(actionKey, keyDropdown) {
    // Strip off any modifier to just get the key code.
    var keyCode = actionKey.match(/\d+/)[0];
    var keyValue = String.fromCharCode(keyCode);
    if (parseInt(keyCode) === Blockly.utils.KeyCodes.ESC) {
        keyValue = 'Escape';
    } else if (parseInt(keyCode) === Blockly.utils.KeyCodes.ENTER) {
        keyValue = 'Enter';
    }
    keyDropdown.value = keyValue;
}

/**
 * Set the modifiers to be the correct value from the key map.
 * @param {string} actionKey The key code holding the modifiers and key.
 * @param {Array.<Element>} modifierDropdowns A list of dropdowns for
 *     the modifier values.
 * @package
 */
function setModifiers(actionKey, modifierDropdowns) {
    var modifiers = Blockly.utils.object.values(Blockly.user.keyMap.modifierKeys);
    for (var i = 0; i < 2; i++) {
        var modifierDropdown = modifierDropdowns[i];
        for (var j = 0, modifier; modifier = modifiers[j]; j++) {
            if (actionKey.indexOf(modifier) > -1) {
                modifierDropdown.value = modifier;
                actionKey = actionKey.replace(modifier, '');
                break;
            }
        }
    }
}

/**
 * Set the dropdowns to display the correct combination of modifiers and
 * keys for the action key.
 * @param {Blockly.Action} action The Blockly action.
 * @param {Element} actionDiv The div holding the dropdowns and label for the
 *     given action.
 * @param {string} actionKey The key corresponding to the given action.
 * @package
 */
function setDropdowns(action, actionDiv, actionKey) {
    var selectDivs = actionDiv.getElementsByTagName('select');
    if (actionKey) {
        setModifiers(actionKey, selectDivs);
        setKeyDropdown(actionKey, selectDivs[selectDivs.length - 1]);
    } else {
        clearDropdown(action);
    }
}

/**
 * Create a dropdown with the given list of possible keys.
 * @param {Blockly.Action} action The Blockly action.
 * @param {Element} actionDiv The div holding the dropdowns and labels for
 *     a given action.
 * @param {Array.<string>} keys The list of keys to add to the dropdown.
 * @package
 */
function createDropdown(action, actionDiv, keys) {
    var select = document.createElement('select');
    select.addEventListener('change', updateKey);
    select.setAttribute('aria-labelledby', action.name + '_label');
    for (var i = 0, key; key = keys[i]; i++) {
        select.options.add(new Option(key, key));
    }
    actionDiv.appendChild(select);
}

/**
 * Create two dropdowns that display possible modifiers and a single dropdown
 * displaying a list of keys.
 * @param {Blockly.Action} action The Blockly action.
 * @param {string} actionKey The key corresponding to the given action.
 * @param {Element} actionDiv The div holding the dropdowns and label for the
 *     given action.
 * @package
 */
function createDropdowns(action, actionKey, actionDiv) {
    var modifiers = ['None'].concat(Blockly.utils.object.values(Blockly.user.keyMap.modifierKeys));
    var keys = ['None', 'Enter', 'Escape'].concat("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(''));
    createDropdown(action, actionDiv, modifiers);
    createDropdown(action, actionDiv, modifiers);
    createDropdown(action, actionDiv, keys);
    setDropdowns(action, actionDiv, actionKey);
}

/**
 * For each action create a row of 3 dropdowns and an action label. Update
 * the dropdowns to reflect the value in the key map.
 * @param {Array.<Blockly.Action>} actions List of blockly actions.
 * @package
 */
function createKeyMappingList(actions) {
    // Update the key map to reflect the key map saved in session storage.
    restoreKeyMap();
    var keyMapDiv = document.getElementById('keyboard_mappings');
    for (var i = 0, action; action = actions[i]; i++) {
        var actionDiv = document.createElement('div');
        actionDiv.setAttribute('data-actionname', action.name);
        actionDiv.action = action;

        var labelDiv = document.createElement('labelDiv');
        labelDiv.innerText = action.name;
        labelDiv.setAttribute('id', action.name + '_label');

        actionDiv.appendChild(labelDiv);
        keyMapDiv.appendChild(actionDiv);

        var actionKey = Blockly.user.keyMap.getKeyByAction(action);
        createDropdowns(action, actionKey, actionDiv);
    }
}

/**
 * Hide/show the key map panel.
 * @param {boolean} state The state of the checkbox. True if checked, false
 *     otherwise.
 * @package
 */
function toggleDisplayKeyMappings(state) {
    if (state) {
        document.getElementById('keyboard_nav').style.display = 'block';
        document.getElementById('keyboard_nav').style.left = (top.innerWidth - document.getElementById('keyboard_nav').offsetWidth) / 2 + "px";
        document.getElementById('keyboard_nav').style.top = (top.innerHeight - document.getElementById('keyboard_nav').offsetHeight) / 2 + "px";
    } else {
        document.getElementById('keyboard_nav').style.display = 'none';
    }
}