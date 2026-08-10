/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Intercept data to modify toolbox for user
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

/**
 * @fileoverview Toolbox modification, override css style
 * @source https://blocklycodelabs.dev/codelabs/custom-toolbox
 */
class TweakCategories extends Blockly.ToolboxCategory {
    /**
     * Constructor for a custom category.
     */
    constructor(categoryDef, toolbox, opt_parent) {
        super(categoryDef, toolbox, opt_parent);
    }
    addColourBorder_(colour) {
        this.rowDiv_.style.backgroundColor = colour;
    }
    setSelected(isSelected) {
        // We do not store the label span on the category, so use getElementsByClassName.
        var labelDom = this.rowDiv_.getElementsByClassName('blocklyTreeLabel')[0];
        if (isSelected) {
            // Change the background color of the div to white.
            this.rowDiv_.style.backgroundColor = 'white';
            // Set the colour of the text to the colour of the category.
            labelDom.style.color = this.colour_;
            this.iconDom_.style.color = this.colour_;
        } else {
            this.rowDiv_.style.backgroundColor = this.colour_;
            labelDom.style.color = 'white';
            this.iconDom_.style.color = 'white';
        }
        // This is used for accessibility purposes.
        Blockly.utils.aria.setState(/** @type {!Element} */(this.htmlDiv_), Blockly.utils.aria.State.SELECTED, isSelected);
    }
    // createIconDom_() {
      // const img = document.createElement('img');
      // img.src = this.toolboxItemDef_['imageName'];
      // img.alt = 'Lamp';
      // img.width='30';
      // img.height='30';
      // var divIconImg = document.createElement("div");
      // divIconImg.appendChild(document.createTextNode("css-icon='customIcon fab fa-whmcs'"));
      // return divIconImg;
    // }
}

Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    TweakCategories, true);

// class TweakOpenIcon extends Blockly.blocklyTreeIcon {
    // constructor(categoryDef, toolbox, opt_parent) {
        // super(categoryDef, toolbox, opt_parent);
    // }
// }

// Blockly.registry.register(
    // Blockly.registry.Type.TOOLBOX_ITEM,
    // Blockly.ToolboxCategory.registrationName,
    // TweakOpenIcon, true);

// class TweakCloseIcon extends Blockly.blocklyTreeIcon {
    // constructor(categoryDef, toolbox, opt_parent) {
        // super(categoryDef, toolbox, opt_parent);
    // }
// }

// Blockly.registry.register(
    // Blockly.registry.Type.TOOLBOX_ITEM,
    // Blockly.ToolboxCategory.registrationName,
    // TweakCloseIcon, true);
    
function classMixin(target, src) {
  for (var key of Object.getOwnPropertyNames(src.prototype)) {
    target.prototype[key] = src.prototype[key];
  }
}
classMixin(Blockly.CollapsibleToolboxCategory, TweakCategories);