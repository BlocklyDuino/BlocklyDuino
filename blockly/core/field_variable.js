/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Variable input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldVariable');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.Msg');
goog.require('Blockly.Variables');
goog.require('goog.string');

Blockly.FieldVariable_workspace = null;

/**
 * Class for a variable's dropdown field.
 * @param {?string} varname The default name for the variable.  If null,
 *     a unique variable name will be generated.
 * @param {Function} opt_changeHandler A function that is executed when a new
 *     option is selected.  Its sole argument is the new option value.  Its
 *     return value is ignored.
 * @extends {Blockly.FieldDropdown}
 * @constructor
 */
Blockly.FieldVariable = function(varname, opt_changeHandler) {
  var changeHandler;
  if (opt_changeHandler) {
    // Wrap the user's change handler together with the variable rename handler.
    var thisObj = this;
    changeHandler = function(value) {
      var retVal = Blockly.FieldVariable.dropdownChange.call(thisObj, value);
      var newVal;
      if (retVal === undefined) {
        newVal = value;  // Existing variable selected.
      } else if (retVal === null) {
        newVal = thisObj.getValue();  // Abort, no change.
      } else {
        newVal = retVal;  // Variable name entered.
      }
      opt_changeHandler.call(thisObj, newVal);
      return retVal;
    };
  } else {
    changeHandler = Blockly.FieldVariable.dropdownChange;
  }

  Blockly.FieldVariable.superClass_.constructor.call(this,
      Blockly.FieldVariable.dropdownCreate, changeHandler);

  this.setValue(varname || '');
};
goog.inherits(Blockly.FieldVariable, Blockly.FieldDropdown);

/**
 * Install this dropdown on a block.
 * @param {!Blockly.Block} block The block containing this text.
 */
Blockly.FieldVariable.prototype.init = function(block) {
  if (this.sourceBlock_) {
    // Dropdown has already been initialized once.
    return;
  }

  if (!this.getValue()) {
    // Variables without names get uniquely named for this workspace.
    if (block.isInFlyout) {
      var workspace = block.workspace.targetWorkspace;
    } else {
      var workspace = block.workspace;
    }
    this.setValue(Blockly.Variables.generateUniqueName(workspace));
  }
  Blockly.FieldVariable.superClass_.init.call(this, block);
};

/**
 * Clone this FieldVariable.
 * @return {!Blockly.FieldVariable} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
Blockly.FieldVariable.prototype.clone = function() {
  return new Blockly.FieldVariable(this.getValue(), this.changeHandler_);
};

/**
 * Get the variable's name (use a variableDB to convert into a real name).
 * Unline a regular dropdown, variables are literal and have no neutral value.
 * @return {string} Current text.
 */
Blockly.FieldVariable.prototype.getValue = function() {
  return this.getText();
};

/**
 * Set the variable name.
 * @param {string} text New text.
 */
Blockly.FieldVariable.prototype.setValue = function(text) {
  this.value_ = text;
  this.setText(text);
};

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {!Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownCreate = function() {
  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    var variableList =
        Blockly.Variables.allVariables(this.sourceBlock_.workspace);
  } else {
    var variableList = [];
  }
  // Ensure that the currently selected variable is an option.
  var name = this.getText();
  if (name && variableList.indexOf(name) == -1) {
    variableList.push(name);
  }
  variableList.sort(goog.string.caseInsensitiveCompare);
  variableList.push(Blockly.Msg.RENAME_VARIABLE);
  //delete new Variable menu
  //variableList.push(Blockly.Msg.NEW_VARIABLE);

  // Variables are not language-specific, use the name as both the user-facing
  // text and the internal representation.
  var options = [];
  for (var x = 0; x < variableList.length; x++) {
    options[x] = [variableList[x], variableList[x]];
  }
  return options;
};

/**
 * Event handler for a change in variable name.
 * Special case the 'New variable...' and 'Rename variable...' options.
 * In both of these special cases, prompt the user for a new name.
 * @param {string} text The selected dropdown menu option.
 * @return {null|undefined|string} An acceptable new variable name, or null if
 *     change is to be either aborted (cancel button) or has been already
 *     handled (rename), or undefined if an existing variable was chosen.
 * @this {!Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownChange = function(text) {
  function promptName(promptText, defaultText) {
    Blockly.hideChaff();
    //var newVar = window.prompt(promptText, defaultText);
    $("#dialog_var_title").text(promptText);
    $("#dialog_var_name").text(defaultText);
    $('#modal_variable').openModal();
    /*
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    // Beyond this, all names are legal.
    if (newVar) {
      newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
      if (newVar == Blockly.Msg.RENAME_VARIABLE ||
          newVar == Blockly.Msg.NEW_VARIABLE) {
        // Ok, not ALL names are legal...
        newVar = null;
      }
    }
    return newVar;
    */
  }
  var workspace = this.sourceBlock_.workspace;
  Blockly.FieldVariable_workspace = workspace;
  if (text == Blockly.Msg.RENAME_VARIABLE) {
    var oldVar = this.getText();
    Blockly.Msg.Valiable_text = oldVar;
    //text = promptName(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar),oldVar);
    promptName(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar),oldVar);
    /*
    text = Blockly.Msg.Text_Variables;
    if (text) {
      Blockly.Variables.renameVariable(oldVar, text, workspace);
    }
    */
    return null;
  } else if (text == Blockly.Msg.NEW_VARIABLE) {
//    text = promptName(Blockly.Msg.NEW_VARIABLE_TITLE, '');
    promptName(Blockly.Msg.NEW_VARIABLE_TITLE, '');
    // Since variables are case-insensitive, ensure that if the new variable
    // matches with an existing variable, the new case prevails throughout.
    /*
    text = Blockly.Msg.Text_Variables;
    if (text) {
      Blockly.Variables.renameVariable(text, text, workspace);
      return text;
    }
    */
    return null;
  }
  return undefined;
};
