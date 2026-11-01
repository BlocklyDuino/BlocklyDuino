/* Stream a known SD text score to a named buzzer. Uses one shared SD file/cache. */
(function(){
'use strict';var A=Blockly.Arduino;
function player(b){
 var card=Blockly.StorageRegistry.resolve(b,'sd');
 var buzzer=Blockly.MusicRegistry.name(Blockly.MusicRegistry.resolve(b,'buzzer','BUZZER'));
 var start=b.type==='sd_music_start'?b:b.workspace.getAllBlocks().filter(function(x){return x.type==='sd_music_start'&&!x.disabled;})[0];
 var extra=[];for(var v=2;start&&v<=Number(start.getFieldValue('VOICES')||1);v++)extra.push('&'+Blockly.MusicRegistry.name(Blockly.MusicRegistry.resolve(start,'buzzer','VOICE'+v)));
 var names=[buzzer].concat(extra.map(function(x){return x.slice(1);}));if(new Set(names).size!==names.length)throw Error('Choose a different buzzer for each score voice.');
 var format=start&&start.getFieldValue('VOICES')||'1';

 var configs=names.map(function(n){return b.workspace.getAllBlocks().filter(function(x){return x.type==='music_buzzer'&&Blockly.MusicRegistry.name(x)===n;})[0];});
 var hard=configs.filter(function(c){return c.getFieldValue('ENGINE')==='HARDWARE';}).length,type=hard===0?'':hard===configs.length?', BxHardwareBuzzer':', BxBuzzerRef';
 if(hard&&hard!==configs.length){A.definitions_.sd_output_adapter='#include <BlocklyHardwareBuzzer.h>';names=names.map(function(n){var ref=n+'_score_ref';A.definitions_['sd_ref_'+n]='BxBuzzerRef '+ref+'('+n+');';return ref;});}
 var declaration=(format==='1'?'BxSDMelody':'BxSDScore')+(hard?'T':'')+'<decltype('+card+')'+type+'> bxScore('+card+', '+names[0]+names.slice(1).map(function(n){return ', &'+n;}).join('')+');';
 if(A.definitions_.sd_score_object&&A.definitions_.sd_score_object!==declaration)
   throw Error('Use one SD score player per program. Select the same card and buzzer in all score actions.');
 A.definitions_.sd_score_include=hard?'#include <BlocklySDMusicCore.h>':'#include <BlocklySDMusic.h>';
 A.definitions_.sd_score_object=declaration;return 'bxScore';
}
function def(type,label,output,tip,extra){
 Blockly.Blocks[type]={init:function(){this.setColour(290);
 this.appendDummyInput().appendField(label)
 .appendField(Blockly.StorageRegistry.field('sd'),'DEVICE').appendField('to')
 .appendField(Blockly.MusicRegistry.field('buzzer'),'BUZZER');
 if(extra)extra.call(this);
 if(output)this.setOutput(true,'Boolean');else{this.setPreviousStatement(true);this.setNextStatement(true);}
 this.setTooltip(tip);this.setHelpUrl('examples/sd-music-guide.html');},onchange:Blockly.MusicRegistry.refresh({BUZZER:'buzzer'})};
}
def('sd_music_start','play score',false,'Open a known text file and start streaming notes to the chosen buzzer. Uses the card’s one open file. Call service score on each loop pass.',function(){this.appendValueInput('PATH').appendField('file');});
var oldStart=Blockly.Blocks.sd_music_start.init;
Blockly.Blocks.sd_music_start.init=function(){oldStart.call(this);this.appendDummyInput().appendField('format').appendField(new Blockly.FieldDropdown([['sequence · one voice','1'],['timed · one voice','T1'],['timed · two voices','2'],['timed · three voices','3']]),'VOICES');for(var n=2;n<=3;n++)this.appendDummyInput('VOICE_ROW'+n).appendField('voice '+n).appendField(Blockly.MusicRegistry.field('buzzer'),'VOICE'+n).setVisible(false);this.setTooltip('Play C4 250 records, or timed polyphonic records: time_ms,voice,note,duration_ms. Voices map to these declared buzzers once. Optional header @score 1 absolute or @score 1 delta. Notes can overlap; call service score continuously, without delays.');};
var oldChange=Blockly.Blocks.sd_music_start.onchange;
Blockly.Blocks.sd_music_start.onchange=function(){if(oldChange)oldChange.call(this);for(var n=2;n<=3;n++){var input=this.getInput('VOICE_ROW'+n),visible=n<=Number(this.getFieldValue('VOICES'));if(input.isVisible()!==visible){input.setVisible(visible);if(this.rendered)this.render();}}};
A.sd_music_start=function(){return player(this)+'.start('+ (A.valueToCode(this,'PATH',A.ORDER_NONE)||'"MELODY.TXT"')+');\n';};
def('sd_music_update','service score',false,'Call on every loop pass. Reads at most 32 characters per pass. Timed records can start overlapping notes on three voices; single-note records advance in sequence. SD access can still pause briefly.');
A.sd_music_update=function(){return player(this)+'.update();\n';};
def('sd_music_stop','stop score',false,'Stop sound and close the score file.');
A.sd_music_stop=function(){return player(this)+'.stop();\n';};
def('sd_music_active','score playing',true,'True while the score is being read or its last note/rest is playing. False at completion or error.');
A.sd_music_active=function(){return [player(this)+'.active()',A.ORDER_ATOMIC];};
def('sd_music_ok','score OK',true,'False if the file is missing, a note/duration is invalid, or a read fails. EOF after a complete note is normal.');
A.sd_music_ok=function(){return [player(this)+'.ok',A.ORDER_ATOMIC];};
}());
