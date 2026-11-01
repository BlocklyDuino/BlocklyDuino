/* Streaming image files on a named SD card. Pixel buffers are not allocated. */
(function(){
  'use strict';
  var A=Blockly.Arduino;
  var formats=[['BMP grayscale (up to 8-bit)','BMP_GRAY'],['BMP RGB (8-bit/channel)','BMP_RGB'],['PGM grayscale (up to 16-bit)','PGM_GRAY'],['PPM RGB (up to 16-bit/channel)','PPM_RGB']];
  function value(b,k,f){return A.valueToCode(b,k,A.ORDER_NONE)||f;}
  function card(b){return Blockly.StorageRegistry.resolve(b,'sd');}
  function refresh(){
    if(!this.workspace||this.workspace.isFlyout||this.isInFlyout)return;
    var f=this.getField('DEVICE'),id=f.getValue();
    var cards=this.workspace.getAllBlocks().filter(function(b){return b.type==='st_sd'&&!b.disabled;});
    if((!id||id==='__missing__')&&cards.length===1)id=String(cards[0].storageUid||cards[0].id);
    var selected=cards.filter(function(b){return String(b.storageUid||b.id)===id||b.getFieldValue('NAME')===id;})[0];
    if(selected){if(f.getValue()!==id||f.getText()!==selected.getFieldValue('NAME'))f.setValue(id);this.setWarningText(null);}
    else this.setWarningText('Add an SD card definition with Add device, then select it here.');
  }
  function block(type,label,builder,tip,output){
    Blockly.Blocks[type]={init:function(){
      this.setColour(25);
      this.appendDummyInput().appendField(Blockly.StorageRegistry.field('sd'),'DEVICE').appendField(label);
      if(builder)builder.call(this);
      if(output)this.setOutput(true,output);else{this.setPreviousStatement(true);this.setNextStatement(true);}
      this.setTooltip(tip);this.setHelpUrl('examples/image-guide.html');
    },onchange:refresh};
  }
  function xy(){this.appendValueInput('X').setCheck('Number').appendField('x');this.appendValueInput('Y').setCheck('Number').appendField('y');}
  function rgb(){this.appendValueInput('R').setCheck('Number').appendField('red');this.appendValueInput('G').setCheck('Number').appendField('green');this.appendValueInput('B').setCheck('Number').appendField('blue');}
  block('st_image_begin','new image',function(){
    this.appendDummyInput().appendField(new Blockly.FieldDropdown(formats),'FORMAT').appendField(new Blockly.FieldDropdown([['sequential pixels','STREAM'],['coordinate edits','COORDINATES']]),'MODE');
    this.setFieldValue('BMP_RGB','FORMAT');
    this.appendValueInput('PATH').appendField('replace file');
    this.appendValueInput('WIDTH').setCheck('Number').appendField('width');
    this.appendValueInput('HEIGHT').setCheck('Number').appendField('height');
    this.appendValueInput('LEVELS').setCheck('Number').appendField('levels per channel');
    this.appendValueInput('RESERVE').setCheck('Boolean').appendField('reserve space?');
  },'Create/replace an image on SD. Dimensions and levels accept whole numbers or integer variables. BMP: 2–256 levels per channel; PGM/PPM: 2–65536. Pixel values are 0..levels−1. Sequential mode writes pixels left-to-right, top-to-bottom; coordinate mode first fills the image black. Fractional and out-of-range values are rejected, not truncated. Use .BMP/.PGM/.PPM filenames and check image OK.');
  A.st_image_begin=function(){var f=this.getFieldValue('FORMAT');if(!formats.some(function(x){return x[1]===f;}))throw Error('Choose a supported image format.');return card(this)+'.imageCreate('+value(this,'PATH','"IMAGE.BMP"')+', '+value(this,'WIDTH','32')+', '+value(this,'HEIGHT','32')+', BxImageSD::'+f+', '+value(this,'LEVELS','256')+', '+value(this,'RESERVE','false')+', '+(this.getFieldValue('MODE')==='COORDINATES'?'true':'false')+');\n';};
  block('st_image_append_gray','append gray pixel',function(){this.appendValueInput('SHADE').setCheck('Number').appendField('shade');},'Append one grayscale sample at the next sequential position. Shade accepts a variable or calculation in 0..levels−1. No framebuffer or image-sized array. Rows advance automatically. Use a grayscale format.');
  A.st_image_append_gray=function(){return card(this)+'.appendGray('+value(this,'SHADE','0')+');\n';};
  block('st_image_append_rgb','append RGB pixel',rgb,'Append one RGB pixel at the next sequential position. Each channel accepts a variable or calculation in 0..levels−1. Use BMP RGB or PPM RGB. File byte order is handled automatically.');
  A.st_image_append_rgb=function(){return card(this)+'.appendRGB('+value(this,'R','0')+', '+value(this,'G','0')+', '+value(this,'B','0')+');\n';};
  block('st_image_gray_pixel','gray pixel at',function(){xy.call(this);this.appendValueInput('SHADE').setCheck('Number').appendField('shade');},'Write one grayscale pixel by coordinates in an image created for coordinate edits. x/y start at top-left, zero. Shade is 0..levels−1. Writes go directly to SD; no image is stored in RAM.');
  A.st_image_gray_pixel=function(){return card(this)+'.grayPixel('+value(this,'X','0')+', '+value(this,'Y','0')+', '+value(this,'SHADE','0')+');\n';};
  block('st_image_rgb_pixel','RGB pixel at',function(){xy.call(this);rgb.call(this);},'Write one RGB pixel by coordinates in an image created for coordinate edits. x/y start at zero. Red, green and blue each accept variables in 0..levels−1. Use an RGB format; out-of-range values are rejected.');
  A.st_image_rgb_pixel=function(){return card(this)+'.rgbPixel('+value(this,'X','0')+', '+value(this,'Y','0')+', '+value(this,'R','0')+', '+value(this,'G','0')+', '+value(this,'B','0')+');\n';};
  block('st_image_finish','finish image',null,'Finish the image, flush pending bytes and close the file. For sequential mode provide exactly width × height pixels. Missing pixels are padded black, but image OK remains false for an incomplete scan. An SD write failure can still leave an incomplete file.');
  A.st_image_finish=function(){return card(this)+'.imageFinish();\n';};
  block('st_image_ok','image OK',null,'Status of the latest card/image operation. Check immediately after creating an image, writing pixels or finishing. False indicates unsupported range, wrong format/mode, coordinates outside the image, incomplete data or SD failure.','Boolean');
  A.st_image_ok=function(){return [card(this)+'.ok',A.ORDER_ATOMIC];};
}());
