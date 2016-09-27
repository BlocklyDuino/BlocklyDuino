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
 * @fileoverview Utility functions for handling variables.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Variables');

// TODO(scr): Fix circular dependencies
// goog.require('Blockly.Block');
goog.require('Blockly.Workspace');
goog.require('goog.string');

Blockly.Variables.TYPE_ANY = '';
Blockly.Variables.TYPE_NUMBER = 'Number'; //int
Blockly.Variables.TYPE_FLOAT = 'Float';
Blockly.Variables.TYPE_BOOLEAN = 'Boolean';
Blockly.Variables.TYPE_STRING = 'String';
Blockly.Variables.TYPE_ARRAY = 'Array';
Blockly.Variables.TYPE_VOLATILE_INT = 'Volatile_Int';
Blockly.Variables.TYPE_CHAR = 'Char';
Blockly.Variables.TYPE_BYTE = 'Byte';
Blockly.Variables.TYPE_WORD = 'Word';
Blockly.Variables.TYPE_LONG = 'Long';
Blockly.Variables.TYPE_UNSIGNED_INT = 'Unsigned_Int';
Blockly.Variables.TYPE_UNSIGNED_LONG = 'Unsigned_Long';
Blockly.Variables.TYPE_DOUBLE = 'Double';
Blockly.Variables.TYPE_COLOUR = 'Colour';
Blockly.Variables.NAME_TYPE = 'VARIABLE';

/**
 * A Complete list of all variables types available.
 * Contains a tuple of both the variables display name and
 * it's definition name.
 * @return {Array}
 */
Blockly.Variables.allTypes = function(){
  return [
//    [Blockly.Msg.VARIABLES_TYPE_ANY,
//     Blockly.Variables.TYPE_ANY],
    [Blockly.Msg.VARIABLES_TYPE_NUMBER,
     Blockly.Variables.TYPE_NUMBER],
    [Blockly.Msg.VARIABLES_TYPE_BOOLEAN,
     Blockly.Variables.TYPE_BOOLEAN],
    [Blockly.Msg.VARIABLES_TYPE_CHAR,
    Blockly.Variables.TYPE_CHAR],
    [Blockly.Msg.VARIABLES_TYPE_BYTE,
     Blockly.Variables.TYPE_BYTE],
    [Blockly.Msg.VARIABLES_TYPE_UNSIGNED_INT,
     Blockly.Variables.TYPE_UNSIGNED_INT],
    [Blockly.Msg.VARIABLES_TYPE_WORD,
     Blockly.Variables.TYPE_WORD],
    [Blockly.Msg.VARIABLES_TYPE_LONG,
     Blockly.Variables.TYPE_LONG],
    [Blockly.Msg.VARIABLES_TYPE_UNSIGNED_LONG,
     Blockly.Variables.TYPE_UNSIGNED_LONG],
    [Blockly.Msg.VARIABLES_TYPE_FLOAT,
     Blockly.Variables.TYPE_FLOAT],
    [Blockly.Msg.VARIABLES_TYPE_DOUBLE,
     Blockly.Variables.TYPE_DOUBLE],
    [Blockly.Msg.VARIABLES_TYPE_STRING,
     Blockly.Variables.TYPE_STRING],
//    [Blockly.Msg.VARIABLES_TYPE_COLOUR,
//     Blockly.Variables.TYPE_COLOUR],
    [Blockly.Msg.VARIABLES_TYPE_ARRAY,
     Blockly.Variables.TYPE_ARRAY],
    [Blockly.Msg.VARIABLES_TYPE_VOLATILE_INT,
     Blockly.Variables.TYPE_VOLATILE_INT]
  ];
};

/**
 * Find all user-created variables.
 * @param {!Blockly.Block|!Blockly.Workspace} root Root block or workspace.
 * @return {!Array.<string>} Array of variable names.
 */
Blockly.Variables.allVariables = function(root) {
  var blocks;
  if (root.getDescendants) {
    // Root is Block.
    blocks = root.getDescendants();
  } else if (root.getAllBlocks) {
    // Root is Workspace.
    blocks = root.getAllBlocks();
  } else {
    throw 'Not Block or Workspace: ' + root;
  }
  var variableHash = Object.create(null);
  // Iterate through every block and add each variable to the hash.
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].getVars;
    if (func) {
      var blockVariables = func.call(blocks[x]);
      for (var y = 0; y < blockVariables.length; y++) {
        var varName = blockVariables[y];
        // Variable name may be null if the block is only half-built.
        if (varName) {
          variableHash[varName.toLowerCase()] = varName;
        }
      }
    }
  }
  // Flatten the hash into a list.
  var variableList = [];
  for (var name in variableHash) {
    variableList.push(variableHash[name]);
  }
  return variableList;
};

/**
 * Finds all user-created variables and their types.
 * @param {!Blockly.Block|!Blockly.Workspace} root Root block or workspace.
 * @return {!Array<!Array<string>>}
 */
Blockly.Variables.allVariablesAndTypes = function(root){
  var blocks, workspace;
  if (root.getDescendants) {
    // Root is Block.
    blocks = root.getDescendants();
    workspace = root.workspace;
  } else if (root.getAllBlocks) {
    // Root is Workspace.
    blocks = root.getAllBlocks();
    workspace = root;
  } else {
    throw 'Not Block or Workspace: ' + root;
  }
  var variableHash = Object.create(null);
  // Iterate through every block and add each variable to the hash.
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].getVars;
    if (func) {
      var blockVariables = func.call(blocks[x]);
      for (var y = 0; y < blockVariables.length; y++) {
        var varName = blockVariables[y];
        // Variable name may be null if the block is only half-built.
        if (varName) {
          variableHash[varName.toLowerCase()] = varName;
        }
      }
    }
  }
  // Flatten the hash into a list.
  var variableList = [];
  for (var name in variableHash) {
    var type = Blockly.Variables.typeOf(name,workspace)
      || Blockly.Variables.TYPE_ANY;
    variableList.push([variableHash[name], type]);
  }
  return variableList;
};

/**
 * Sets the type of a variable with the given name
 * @param {string} name The variable name
 * @param {string} type The type to change to
 * @param {!Blockly.Workspace} workspace Workspace edit variables in.
 */
Blockly.Variables.changeType = function(name, type, workspace){
  var blocks = workspace.getAllBlocks();
  // Iterate through every block.
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].changeType;
    if (func) {
      func.call(blocks[x], name, type);
    }
  }
};

/**
 * Gets the type of a variable with the given name
 * @param {string} name The name of the variable to test
 * @param {!Blockly.Workspace} workspace Workspace query variables in.
 */
Blockly.Variables.typeOf = function(name, workspace){
  var blocks = workspace.getAllBlocks();
  // Iterate through every block.
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].typeOf;
    if (func) {
      var type =  func.call(blocks[x], name);
      if (type) return type;
    }
  }
};

/**
 * Find all instances of the specified variable and rename them.
 * @param {string} oldName Variable to rename.
 * @param {string} newName New variable name.
 * @param {!Blockly.Workspace} workspace Workspace rename variables in.
 */
Blockly.Variables.renameVariable = function(oldName, newName, workspace) {
  var blocks = workspace.getAllBlocks();
  // Iterate through every block.
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].renameVar;
    if (func) {
      func.call(blocks[x], oldName, newName);
    }
  }
};

/**
 * Construct the blocks required by the flyout for the variable category.
 * @param {!Array.<!Blockly.Block>} blocks List of blocks to show.
 * @param {!Array.<number>} gaps List of widths between blocks.
 * @param {number} margin Standard margin width for calculating gaps.
 * @param {!Blockly.Workspace} workspace The flyout's workspace.
 */
Blockly.Variables.flyoutCategory = function(blocks, gaps, margin, workspace) {
  var variableList = Blockly.Variables.allVariables(workspace.targetWorkspace);
  variableList.sort(goog.string.caseInsensitiveCompare);
  // In addition to the user's variables, we also want to display the default
  // variable name at the top.  We also don't want this duplicated if the
  // user has created a variable of the same name.
  variableList.unshift(null);
  var defaultVariable = undefined;
  for (var i = 0; i < variableList.length; i++) {
    if (variableList[i] === defaultVariable) {
      continue;
    }
    var getBlock = Blockly.Blocks['variables_get'] ?
        Blockly.Block.obtain(workspace, 'variables_get') : null;
    getBlock && getBlock.initSvg();
    var setBlock = Blockly.Blocks['variables_set'] ?
        Blockly.Block.obtain(workspace, 'variables_set') : null;
    setBlock && setBlock.initSvg();
    if (variableList[i] === null) {
      defaultVariable = (getBlock || setBlock).getVars()[0];
    } else {
      getBlock && getBlock.setFieldValue(variableList[i], 'VAR');
      setBlock && setBlock.setFieldValue(variableList[i], 'VAR');
    }
    setBlock && blocks.push(setBlock);
    getBlock && blocks.push(getBlock);
    if (getBlock && setBlock) {
      gaps.push(margin, margin * 3);
    } else {
      gaps.push(margin * 2);
    }
    getBlock && typeof getBlock.postInit === 'function'
      && getBlock.postInit.call(getBlock);
    setBlock && typeof setBlock.postInit === 'function'
      && setBlock.postInit.call(setBlock);
  }
};

/**
* Return a new variable name that is not yet being used. This will try to
* generate single letter variable names in the range 'i' to 'z' to start with.
* If no unique name is located it will try 'i' to 'z', 'a' to 'h',
* then 'i2' to 'z2' etc.  Skip 'l'.
 * @param {!Blockly.Workspace} workspace The workspace to be unique in.
* @return {string} New variable name.
*/
Blockly.Variables.generateUniqueName = function(workspace) {
  var variableList = Blockly.Variables.allVariables(workspace);
  var newName = '';
  if (variableList.length) {
    var nameSuffix = 1;
    var letters = 'ijkmnopqrstuvwxyzabcdefgh';  // No 'l'.
    var letterIndex = 0;
    var potName = letters.charAt(letterIndex);
    while (!newName) {
      var inUse = false;
      for (var i = 0; i < variableList.length; i++) {
        if (variableList[i].toLowerCase() == potName) {
          // This potential name is already used.
          inUse = true;
          break;
        }
      }
      if (inUse) {
        // Try the next potential name.
        letterIndex++;
        if (letterIndex == letters.length) {
          // Reached the end of the character sequence so back to 'i'.
          // a new suffix.
          letterIndex = 0;
          nameSuffix++;
        }
        potName = letters.charAt(letterIndex);
        if (nameSuffix > 1) {
          potName += nameSuffix;
        }
      } else {
        // We can use the current potential name.
        newName = potName;
      }
    }
  } else {
    newName = 'i';
  }
  return newName;
};
