'use strict';

goog.provide('Blockly.Arduino.rgbled');

goog.require('Blockly.Arduino');

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

Blockly.Arduino.rgbled_setpixelcolor = function () {
  Blockly.Arduino.definitions_['define_include_cyberlane_rgb'] = '#include <CyberLane-RGB.h>';
  var target = this.getFieldValue('PIN');
  var colour_rgb = this.getFieldValue('RGB');
  var code = 'rgb_set_color('
  if (target === 'left') {
    code += '9,1,10';
  } else {
    code += '14,16,13';
  }
  code += ',' +hexToR(colour_rgb)+','+hexToG(colour_rgb)+',' + hexToB(colour_rgb)+');';
  return code;
};