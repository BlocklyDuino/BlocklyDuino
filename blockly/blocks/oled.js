'use strict';

goog.provide('Blockly.Blocks.oled');
goog.require('Blockly.Blocks');

Blockly.Blocks.oled.HUE = 330;

Blockly.Blocks['oled_clear'] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.OLED_HELPURL);
    this.setColour(Blockly.Blocks.oled.HUE);
    this.appendDummyInput()
      .appendField(Blockly.Msg.OLED_CLEAR);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
  }
};

Blockly.Blocks['oled_update'] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.OLED_HELPURL);
    this.setColour(Blockly.Blocks.oled.HUE);
    this.appendDummyInput()
      .appendField(Blockly.Msg.OLED_UPDATE);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
  }
};

Blockly.Blocks['oled_invert'] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.OLED_HELPURL);
    this.setColour(Blockly.Blocks.oled.HUE);
    this.appendDummyInput()
      .appendField(Blockly.Msg.OLED_INVERT)
      .appendField(new Blockly.FieldCheckbox("TRUE"), "invert");;
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
  }
};

Blockly.Blocks['oled_print'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.OLED_HELPURL);
    this.setColour(Blockly.Blocks.oled.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.OLED_PRINT);
    this.appendValueInput("text")
        .setCheck("String")
        .appendField(Blockly.Msg.OLED_PRINT_TEXT);
    this.appendDummyInput()
        .appendField(Blockly.Msg.OLED_PRINT_X)
        .appendField(new Blockly.FieldTextInput("300"),"x");
    this.appendDummyInput()
        .appendField(Blockly.Msg.OLED_PRINT_Y)
        .appendField(new Blockly.FieldTextInput("300"),"y");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
  }
};

Blockly.Blocks['oled_draw_bitmap'] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.OLED_HELPURL);
    this.setColour(Blockly.Blocks.oled.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.OLED_DRAW_IMAGE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.OLED_PRINT_X)
        .appendField(new Blockly.FieldTextInput("300"),"x");
    this.appendDummyInput()
        .appendField(Blockly.Msg.OLED_PRINT_Y)
        .appendField(new Blockly.FieldTextInput("300"),"y");
    this.appendDummyInput()
        .appendField(Blockly.Msg.OLED_PRINT_WIDTH)
        .appendField(new Blockly.FieldTextInput("300"),"w");
    this.appendDummyInput()
        .appendField(Blockly.Msg.OLED_PRINT_HEIGHT)
        .appendField(new Blockly.FieldTextInput("300"),"h");
    this.appendValueInput("image")
      .appendField(Blockly.Msg.OLED_PRINT_IMAGE);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
  }
};

['kidspeak', 'tretton37'].forEach(function (img, index) {
  var id = 'oled_image_' + img;
  Blockly.Blocks[id] = {
    init: function() {
      this.setHelpUrl(Blockly.Msg.OLED_HELPURL);
      this.setColour(Blockly.Blocks.oled.HUE);
      this.appendDummyInput()
          .appendField(Blockly.Msg[id.toUpperCase()]);
      this.setOutput(true);
      this.setTooltip('');
    }
  };
});