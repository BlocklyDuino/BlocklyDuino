/* Portable unsigned bit operations. Integer inputs; no register access or state. */
(function(){
'use strict';
var A=Blockly.Arduino,HUE=210,WIDTHS=[['8 bit','8'],['16 bit','16'],['32 bit','32']];
function width(b){return Number(b.getFieldValue('WIDTH')||32);}
function type(w){return 'uint'+w+'_t';}
function mask(w){return w===32?4294967295:Math.pow(2,w)-1;}
function unsigned(v,w){return ((v>>>0)&mask(w))>>>0;}
function literal(text){
 text=String(text).replace(/^\s+|\s+$/g,'');var value;
 if(/^0x[0-9a-f]{1,8}$/i.test(text))value=parseInt(text.slice(2),16);
 else if(/^0b[01]{1,32}$/i.test(text))value=parseInt(text.slice(2),2);
 else if(/^\d{1,10}$/.test(text))value=Number(text);
 else throw Error('Bit literal: use 0xA5, 0b10100101 or a whole number from 0 to 4294967295.');
 if(value>4294967295)throw Error('Bit literal must fit in 32 unsigned bits (0 to 4294967295).');
 return value;
}
function hex(n){return '0x'+(n>>>0).toString(16).toUpperCase()+'UL';}
function value(b,key,fallback){return A.valueToCode(b,key,A.ORDER_NONE)||String(fallback===undefined?0:fallback);}
function cppCalls(code){return code.replace(/\b(bxBitsMask|bxBitsShift|bxBitsRotate|bxBitsUpdate|bxBitsByte|bxBitsInsert|bxBitsExtract)\(/g,'$1::run(');}
function expr(code){return [cppCalls(code),A.ORDER_ATOMIC];}
function folded(b,result){
 if(result===null)return null;
 if(b.type==='ll_bits_test')return expr(result?'true':'false');
 var w=b.type==='ll_bits_byte'?8:b.type==='ll_bits_literal'?32:width(b);
 return expr(type(w)+'('+hex(result)+')');
}
function integerConstant(b){
 if(!b)return null;
 if(b.type==='ll_bits_literal')return literal(b.getFieldValue('VALUE'));
 if(b.type==='logic_boolean')return b.getFieldValue('BOOL')==='TRUE'?1:0;
 if(b.type==='math_number'){
  var n=Number(b.getFieldValue('NUM'));
  return isFinite(n)&&Math.floor(n)===n&&Math.abs(n)<=9007199254740991?n:null;
 }
 if(b.type.indexOf('ll_bits_')!==0)return null;
 return evaluate(b);
}
function evaluate(b){
 var w=width(b),op=b.getFieldValue('OP'),a,c,index,count,x;
 function get(key,otherwise){var child=b.getInputTargetBlock(key);return child?integerConstant(child):(otherwise===undefined?0:otherwise);}
 if(b.type==='ll_bits_literal')return literal(b.getFieldValue('VALUE'));
 if(b.type==='ll_bits_integer_math'){
  a=get('A');c=get('B');if(a===null||c===null)return null;a=unsigned(a,w);c=unsigned(c,w);
  return unsigned(op==='ADD'?a+c:op==='SUB'?a-c:op==='MUL'?Math.imul(a,c):op==='DIV'?(c?Math.floor(a/c):0):(c?a%c:0),w);
 }
 if(b.type==='ll_bits_logic'){
  a=get('A');c=get('B');if(a===null||c===null)return null;
  x=op==='AND'||op==='NAND'?(a&c):op==='OR'||op==='NOR'?(a|c):(a^c);
  if(op==='NAND'||op==='NOR'||op==='XNOR')x=~x;return unsigned(x,w);
 }
 if(b.type==='ll_bits_not'){a=get('VALUE');return a===null?null:unsigned(~a,w);}
 if(b.type==='ll_bits_shift'){
  a=get('VALUE');count=get('COUNT');if(a===null||count===null)return null;a=unsigned(a,w);
  if(op==='SHL'||op==='SHR')return count<0||count>=w?0:unsigned(op==='SHL'?a<<count:a>>>count,w);
  count=((count%w)+w)%w;if(!count)return a;
  return unsigned(op==='ROL'?(a<<count)|(a>>>(w-count)):(a>>>count)|(a<<(w-count)),w);
 }
 if(b.type==='ll_bits_mask'){index=get('INDEX');return index===null?null:index<0||index>=w?0:unsigned(Math.pow(2,index),w);}
 if(b.type==='ll_bits_test'||b.type==='ll_bits_update'||b.type==='ll_bits_replace'){
  a=get('VALUE');index=get('INDEX');c=b.type==='ll_bits_replace'?get('BIT'):0;
  if(a===null||index===null||c===null)return null;a=unsigned(a,w);
  var m=index<0||index>=w?0:Math.pow(2,index);
  if(b.type==='ll_bits_test')return (a&m)!==0;
  if(b.type==='ll_bits_replace')return unsigned(c?a|m:a&~m,w);
  return unsigned(op==='SET'?a|m:op==='CLEAR'?a&~m:a^m,w);
 }
 if(b.type==='ll_bits_byte'){
  a=get('VALUE');index=get('INDEX');return a===null||index===null?null:index<0||index>=4?0:(a>>>(index*8))&255;
 }
 if(b.type==='ll_bits_join'){
  a=get('HIGH');c=get('LOW');return a===null||c===null?null:unsigned((unsigned(a,w/2)<<(w/2))|unsigned(c,w/2),w);
 }
 if(b.type==='ll_bits_extract'||b.type==='ll_bits_insert'){
  a=get('VALUE');index=get('START');count=get('COUNT',1);c=b.type==='ll_bits_insert'?get('FIELD'):0;
  if(a===null||index===null||count===null||c===null)return null;a=unsigned(a,w);
  if(index<0||index>=w||count<=0)return b.type==='ll_bits_extract'?0:a;
  count=Math.min(count,w-index);var fm=mask(count);
  return b.type==='ll_bits_extract'?((a>>>index)&fm)>>>0:unsigned((a&~(fm<<index))|((c&fm)<<index),w);
 }
 return null;
}
function block(name,label,inputs,tip,options,boolean){
 Blockly.Blocks[name]={init:function(){
  this.setColour(HUE);var head=this.appendDummyInput('HEAD').appendField(label);
  if(options!==false)head.appendField(new Blockly.FieldDropdown(options||WIDTHS),'WIDTH');
  for(var i=0;i<inputs.length;i++)this.appendValueInput(inputs[i][0]).setCheck(inputs[i][2]||'Number').appendField(inputs[i][1]);
  this.setInputsInline(true);this.setOutput(true,boolean?'Boolean':'Number');this.setTooltip(tip);this.setHelpUrl('examples/low-level-guide.html');
 }};
}
function addOp(name,choices){var init=Blockly.Blocks[name].init;Blockly.Blocks[name].init=function(){init.call(this);this.getInput('HEAD').appendField(new Blockly.FieldDropdown(choices),'OP');};}
Blockly.Blocks.ll_bits_literal={init:function(){
 this.setColour(HUE);this.appendDummyInput().appendField(new Blockly.FieldTextInput('0xA5',function(text){try{literal(text);return text.replace(/^\s+|\s+$/g,'');}catch(e){return null;}}),'VALUE');
 this.setOutput(true,'Number');this.setHelpUrl('examples/low-level-guide.html');this.setTooltip('Unsigned 32-bit constant. Type hexadecimal 0xA5, binary 0b10100101 or decimal 165. Range 0..4294967295. No code is evaluated.');
}};
var integerTip=' Values are integers truncated to the selected unsigned width; negative integer values wrap modulo 2^width.';
block('ll_bits_integer_math','integer',[['A',''],['B','with']],'Unsigned integer arithmetic with no floating point. Operands and result are truncated to the selected width; addition, subtraction and multiplication wrap. Division truncates the quotient. Division or remainder by zero returns zero.');
addOp('ll_bits_integer_math',[['+','ADD'],['−','SUB'],['×','MUL'],['÷','DIV'],['remainder','MOD']]);
block('ll_bits_logic','bits',[['A',''],['B','with']],'Bitwise AND, OR or XOR, with optional inversion (NAND, NOR, XNOR). This combines every bit independently; use Logic for Boolean conditions.'+integerTip);
addOp('ll_bits_logic',[['AND','AND'],['OR','OR'],['XOR','XOR'],['NAND','NAND'],['NOR','NOR'],['XNOR','XNOR']]);
block('ll_bits_not','NOT',[['VALUE','']],'Invert all bits within the selected width. For 8 bits, NOT 0 is 255.'+integerTip);
block('ll_bits_shift','bits',[['VALUE',''],['COUNT','by']],'Shift or rotate an integer. Logical shifts fill with zero; a negative count or count >= width returns zero. Rotations wrap the integer count modulo width; negative counts rotate in the opposite direction.'+integerTip);
addOp('ll_bits_shift',[['<<','SHL'],['>>','SHR'],['rotate left','ROL'],['rotate right','ROR']]);
block('ll_bits_mask','mask',[['INDEX','bit']],'Create a mask with one bit set. Bit 0 is the least significant bit. An integer index outside 0..width-1 gives zero. Variables and calculations fit this socket.');
block('ll_bits_test','test',[['VALUE',''],['INDEX','bit']],'True when the selected bit is 1. Bit 0 is least significant. An integer index outside 0..width-1 gives false. This Boolean result fits an if condition or digital output.',null,true);
block('ll_bits_update','bits',[['VALUE',''],['INDEX','bit']],'Return a value with one bit set, cleared or toggled. Assign the result to a variable to keep the change. Invalid integer indices leave the width-truncated value unchanged.'+integerTip);
addOp('ll_bits_update',[['set','SET'],['clear','CLEAR'],['toggle','TOGGLE']]);
block('ll_bits_replace','replace',[['VALUE',''],['INDEX','bit'],['BIT','with',['Boolean','Number']]],'Replace one bit with a Boolean or number: zero clears it, nonzero sets it. Invalid integer indices leave the width-truncated value unchanged. Assign the result to store it.');
block('ll_bits_byte','byte',[['VALUE','of'],['INDEX','index']],'Extract one byte from a 32-bit integer. Index 0 is the least significant byte; 3 is the highest. Other integer indices give zero. Output is uint8_t.',false);
block('ll_bits_join','join',[['HIGH','high'],['LOW','low']],'For a 16-bit result, join two 8-bit bytes. For a 32-bit result, join two 16-bit words. Each part is truncated to its half-width. High goes to the most significant half.',[['16 bit','16'],['32 bit','32']]);
block('ll_bits_extract','field',[['VALUE','of'],['START','from bit'],['COUNT','count']],'Extract a contiguous bit field, shifted down to bit 0. Integer start/count may be variables. Invalid start or count <= 0 gives zero; a count beyond the top is clipped to the remaining width.'+integerTip);
block('ll_bits_insert','insert',[['VALUE','into'],['FIELD','field'],['START','from bit'],['COUNT','count']],'Replace a contiguous bit field while preserving other bits. Only the low count bits of field are inserted. Invalid start or count <= 0 leaves the width-truncated value unchanged; count clips at the top. Assign the result to store it.'+integerTip);
function support(key,code){
 // Arduino's .ino preprocessor mis-prototypes free function templates. Keep
 // each zero-state helper template inside a struct; the compiler inlines it.
 var m=code.match(/^template<([^>]+)> static inline (\w+) (\w+)\(/);
 if(m)code='struct '+m[3]+' {\n  '+code.replace(m[0],'template<'+m[1]+'> static inline '+m[2]+' run(')+'\n};';
 A.definitions_['ll_bits_'+key]=cppCalls(code);
}
function widthMask(){support('width_mask','static inline uint32_t bxBitsWidthMask(uint8_t width) { return uint32_t(0xFFFFFFFFUL) >> (32 - width); }');}
function maskHelper(){support('mask','template<class Index> static inline uint32_t bxBitsMask(Index index, uint8_t width) {\n  return index >= 0 && index < width ? uint32_t(1) << uint8_t(index) : uint32_t(0);\n}');}
function shiftHelper(){widthMask();support('shift','template<class Count> static inline uint32_t bxBitsShift(uint32_t value, Count count, uint8_t width, bool left) {\n  value &= bxBitsWidthMask(width);\n  if (!(count >= 0 && count < width)) return 0;\n  uint8_t n = uint8_t(count);\n  return (left ? value << n : value >> n) & bxBitsWidthMask(width);\n}');}
function rotateHelper(){widthMask();support('rotate','template<class Count> static inline uint32_t bxBitsRotate(uint32_t value, Count count, uint8_t width, bool left) {\n  value &= bxBitsWidthMask(width);\n  uint8_t n = uint32_t(count) & (width - 1);\n  if (!n) return value;\n  return (left ? (value << n) | (value >> (width - n)) : (value >> n) | (value << (width - n))) & bxBitsWidthMask(width);\n}');}
function updateHelper(){widthMask();maskHelper();support('update','template<class Index> static inline uint32_t bxBitsUpdate(uint32_t value, Index index, uint8_t width, uint8_t operation, bool bit) {\n  uint32_t mask = bxBitsMask(index, width);\n  if (operation == 0) value |= mask;\n  else if (operation == 1) value &= ~mask;\n  else if (operation == 2) value ^= mask;\n  else value = bit ? value | mask : value & ~mask;\n  return value & bxBitsWidthMask(width);\n}');}
function fieldHelper(insert){widthMask();support(insert?'insert':'extract',insert?
 'template<class Start, class Count> static inline uint32_t bxBitsInsert(uint32_t value, uint32_t field, Start start, Count count, uint8_t width) {\n  value &= bxBitsWidthMask(width);\n  if (!(start >= 0 && start < width && count > 0)) return value;\n  uint8_t s = uint8_t(start), n = count > width - s ? width - s : uint8_t(count);\n  if (!n) return value;\n  uint32_t bits = bxBitsWidthMask(n), mask = bits << s;\n  return ((value & ~mask) | ((field & bits) << s)) & bxBitsWidthMask(width);\n}':
 'template<class Start, class Count> static inline uint32_t bxBitsExtract(uint32_t value, Start start, Count count, uint8_t width) {\n  value &= bxBitsWidthMask(width);\n  if (!(start >= 0 && start < width && count > 0)) return 0;\n  uint8_t s = uint8_t(start), n = count > width - s ? width - s : uint8_t(count);\n  return n ? (value >> s) & bxBitsWidthMask(n) : uint32_t(0);\n}');}
function generate(b){
 var constant=folded(b,evaluate(b));if(constant)return constant;
 var w=width(b),t=type(w),op=b.getFieldValue('OP'),code;
 function v(key,fallback){return value(b,key,fallback);}
 if(b.type==='ll_bits_integer_math'){
  if(op==='DIV'||op==='MOD'){
   widthMask();support('divide','static inline uint32_t bxBitsDivide(uint32_t a, uint32_t b, uint8_t width, bool remainder) {\n  uint32_t mask = bxBitsWidthMask(width); a &= mask; b &= mask;\n  return b ? (remainder ? a % b : a / b) : uint32_t(0);\n}');
   return expr(t+'(bxBitsDivide(uint32_t('+v('A')+'), uint32_t('+v('B')+'), '+w+', '+(op==='MOD'?'true':'false')+'))');
  }
  return expr(t+'(uint32_t('+t+'('+v('A')+')) '+(op==='ADD'?'+':op==='SUB'?'-':'*')+' uint32_t('+t+'('+v('B')+')))');
 }
 if(b.type==='ll_bits_logic'){
  var sign=op==='AND'||op==='NAND'?'&':op==='OR'||op==='NOR'?'|':'^';
  code='uint32_t('+v('A')+') '+sign+' uint32_t('+v('B')+')';
  if(op==='NAND'||op==='NOR'||op==='XNOR')code='~('+code+')';return expr(t+'('+code+')');
 }
 if(b.type==='ll_bits_not')return expr(t+'(~uint32_t('+v('VALUE')+'))');
 if(b.type==='ll_bits_shift'){
  var rotate=op==='ROL'||op==='ROR';if(rotate)rotateHelper();else shiftHelper();
  return expr(t+'('+(rotate?'bxBitsRotate':'bxBitsShift')+'(uint32_t('+v('VALUE')+'), '+v('COUNT')+', '+w+', '+(op==='SHL'||op==='ROL'?'true':'false')+'))');
 }
 if(b.type==='ll_bits_mask'){maskHelper();return expr(t+'(bxBitsMask('+v('INDEX')+', '+w+'))');}
 if(b.type==='ll_bits_test'){maskHelper();return expr('((uint32_t('+v('VALUE')+') & bxBitsMask('+v('INDEX')+', '+w+')) != 0)');}
 if(b.type==='ll_bits_update'||b.type==='ll_bits_replace'){
  updateHelper();var operation=b.type==='ll_bits_replace'?3:op==='SET'?0:op==='CLEAR'?1:2;
  return expr(t+'(bxBitsUpdate(uint32_t('+v('VALUE')+'), '+v('INDEX')+', '+w+', '+operation+', '+(operation===3?'bool('+v('BIT')+')':'false')+'))');
 }
 if(b.type==='ll_bits_byte'){
  support('byte','template<class Index> static inline uint8_t bxBitsByte(uint32_t value, Index index) {\n  return index >= 0 && index < 4 ? uint8_t(value >> (uint8_t(index) * 8)) : uint8_t(0);\n}');
  return expr('bxBitsByte(uint32_t('+v('VALUE')+'), '+v('INDEX')+')');
 }
 if(b.type==='ll_bits_join'){var half=type(w/2);return expr(t+'((uint32_t('+half+'('+v('HIGH')+')) << '+(w/2)+') | '+half+'('+v('LOW')+'))');}
 if(b.type==='ll_bits_extract'||b.type==='ll_bits_insert'){
  var insert=b.type==='ll_bits_insert';fieldHelper(insert);
  return expr(t+'('+(insert?'bxBitsInsert':'bxBitsExtract')+'(uint32_t('+v('VALUE')+'), '+(insert?'uint32_t('+v('FIELD')+'), ':'')+v('START')+', '+v('COUNT',1)+', '+w+'))');
 }
 throw Error('Unknown bit operation.');
}
['literal','integer_math','logic','not','shift','mask','test','update','replace','byte','join','extract','insert'].forEach(function(name){A['ll_bits_'+name]=function(){return generate(this);};});
}());
