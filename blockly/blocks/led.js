'use strict';

goog.provide('Blockly.Blocks.rgbled');

goog.require('Blockly.Blocks');

Blockly.Blocks.rgbled.HUE = 215;

Blockly.Blocks.rgbled.image = filepath.media + '/rgb_5050_led.png';

Blockly.Blocks['rgbled_setpixelcolor'] = {
    init: function () {
        var ledList = [ [Blockly.Msg.RGBLED_SIDES_LEFT,"left"], [Blockly.Msg.RGBLED_SIDES_RIGHT,"right"] ];
        this.setHelpUrl(Blockly.Msg.RGBLED_SETPIXELCOLOR_HELPURL);
        this.setColour(Blockly.Blocks.rgbled.HUE);
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(Blockly.Blocks.rgbled.image, 64, 64))
            .appendField(Blockly.Msg.RGBLED_SETPIXELCOLOR_TARGET)
            .appendField(new Blockly.FieldDropdown(ledList), "PIN");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(Blockly.Msg.COLOR)
            .appendField(new Blockly.FieldColour("#00ff00"), "RGB");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.RGBLED_SETPIXELCOLOR_TOOLTIP);
    },
  onchange: function() {
    if (!this.workspace) {
      // Block has en deleted.
      return;
    }
  }
}