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
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.variables');

goog.require('Blockly.Blocks');


/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks.variables.HUE = 330;

Blockly.Blocks['variables_get'] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(Blockly.Blocks.variables.HUE);
    this.appendDummyInput()
      .appendField(Blockly.Msg.VARIABLES_GET_TITLE)
      .appendField(new Blockly.FieldDropdown(
      Blockly.Variables.allTypes(),
      this.typeChangedHandler), 'TYPE')
      .appendField(new Blockly.FieldVariable(
      Blockly.Msg.VARIABLES_GET_ITEM), 'VAR')
      .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
  },
  /**
   * Notification that all the properties have been applied
   * and we're ready to go!
   */
  postInit: function() {
    var name = this.getFieldValue('VAR');
    var type = Blockly.Variables.typeOf(name,Blockly.mainWorkspace);
    if (type) this.setType(type);
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is requesting it's type
   * @param {string} name The name of the variable query
   * @return {string} The type of the variable with the given name
   * (or undefined if this block isn't for that variable)
   */
  typeOf: function(name){
    if (Blockly.Names.equals(name, this.getFieldValue('VAR'))) {
      return this.getFieldValue('TYPE');
    }
    else return undefined;
  },
  /**
   * Notification that a variable changed type
   * If the name matches this blocks variable name, rename it.
   * @param {string} name The name of the variable to change type
   * @param {string} type The new type of the variable
   * @this Blockly.Block
   */
  changeType: function(name, type) {
    if (Blockly.Names.equals(name, this.getFieldValue('VAR'))) {
      this.setType(type);
    }
  },
  /**
   * Changes the type of this block
   * @param {string} type The new type for the block
   */
  setType: function(type) {
    var targetConnection = this.outputConnection.targetConnection;
    if (targetConnection && !targetConnection.acceptsType(type)) {
      this.unplug();
    }
    this.setFieldValue(type, 'TYPE');
    this.changeOutput(type);
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getFieldValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  },
  /**
   * The function called when the type dropdown is changed
   * @param {string} type The type that the dropdown changed to
   */
  typeChangedHandler: function(type){
    var self = this.sourceBlock_;
    var name = self.getFieldValue('VAR');
    Blockly.Variables.changeType(name, type, Blockly.mainWorkspace);
  },
  /**
   * The function called when the name dropdown is changed
   * @param {string} text The name that the dropdown changed to
   */
  nameChangedHandler: function(newName){
    var self = this.sourceBlock_;
    var type = Blockly.Variables.typeOf(newName, Blockly.mainWorkspace);
    if (type) self.setType(type);
  }
};

Blockly.Blocks['variables_set'] = {
  /**
   * Block for variable setter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(Blockly.Blocks.variables.HUE);
    this.interpolateMsg(
      // TODO: Combine these messages instead of using concatenation.
      Blockly.Msg.VARIABLES_SET_TITLE + ' %1 %2' +
      Blockly.Msg.VARIABLES_SET_TAIL + ' %3',
      ['TYPE', new Blockly.FieldDropdown(Blockly.Variables.allTypes(),
                                         this.typeChangedHandler)],
      ['VAR', new Blockly.FieldVariable(Blockly.Msg.VARIABLES_SET_ITEM,
                                        this.nameChangedHandler)],
      ['VALUE', null, Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },
  /**
   * Notification that all the properties have been applied
   * and we're ready to go!
   */
  postInit: function(){
    var name = this.getFieldValue('VAR');
    var type = Blockly.Variables.typeOf(name,Blockly.mainWorkspace);
    if (type) this.setType(type);
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Changes the type of this block
   * @param {string} type The new type for the block
   */
  setType: function(type) {
    this.setFieldValue(type, 'TYPE');
    this.getInput('VALUE').setCheck(type);
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  typeOf: Blockly.Blocks['variables_get'].typeOf,
  changeType: Blockly.Blocks['variables_get'].changeType,
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu,
  typeChangedHandler: Blockly.Blocks['variables_get'].typeChangedHandler,
  nameChangedHandler: Blockly.Blocks['variables_get'].nameChangedHandler
};