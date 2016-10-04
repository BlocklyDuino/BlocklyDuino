'use strict';

goog.provide('Blockly.Arduino.tunes');

goog.require('Blockly.Arduino');

['mario', 'felix', 'heman', 'kirby', 'morning', 'pony', 'simpsons', 'smurfs', 'reindeer', 'ducktales'].forEach(function(tune, index) {
  Blockly.Arduino['tunes_' + tune] = function () {
    Blockly.Arduino.definitions_['tunes_play'] = '#include <CyberLane-Audio.h>';
    Blockly.Arduino.definitions_['tune_' + tune] = '#include "tune_' + tune + '.h"';
    return [index + 1, Blockly.Arduino.ORDER_ATOMIC];
  };
});

Blockly.Arduino.tunes_play_tune = function () {
  var argument = Blockly.Arduino.valueToCode(this, 'TUNE', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  Blockly.Arduino.definitions_['tunes_play'] = '#include <CyberLane-Audio.h>';
  var code = 'play_tune(' + argument + ');';
  return code + '\n';
};