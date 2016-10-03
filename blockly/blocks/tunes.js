'use strict';

goog.provide('Blockly.Blocks.tunes');
goog.require('Blockly.Blocks');

Blockly.Blocks.tunes.HUE = 230;

Blockly.Blocks['tunes_play_tune'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.TUNES_HELPURL);
    this.setColour(Blockly.Blocks.tunes.HUE);
    this.appendValueInput("TUNE")
        .appendField(Blockly.Msg.TUNES_PLAY);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

['mario', 'felix', 'heman', 'kirby', 'morning', 'pony', 'simpsons', 'smurfs', 'reindeer', 'ducktales'].forEach(function(tune, index) {
  Blockly.Blocks['tunes_' + tune] = {
    init: function() {
      this.setHelpUrl(Blockly.Msg.TUNES_HELPURL);
      this.setColour(Blockly.Blocks.tunes.HUE);
      this.appendDummyInput()
          .appendField(tune);
      this.setOutput(true);
      this.setTooltip('');
    }
  };
});