'use strict';

goog.provide('Blockly.Blocks.tunes');
goog.require('Blockly.Blocks');

Blockly.Blocks.tunes.HUE = 230;

Blockly.Blocks['tunes_play_tune'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockly.Blocks.tunes.HUE);
    this.appendValueInput("TUNE")
        .appendField("play tune");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};

['mario', 'felix', 'heman', 'kirby', 'morning', 'pony', 'simpsons', 'smurfs', 'reindeer', 'ducktales'].forEach(function(tune, index) {
  Blockly.Blocks['tunes_' + tune] = {
    init: function() {
      this.setHelpUrl('http://www.example.com/');
      this.setColour(Blockly.Blocks.tunes.HUE);
      this.appendDummyInput()
          .appendField(tune);
      this.setOutput(true);
      this.setTooltip('');
    }
  };
});