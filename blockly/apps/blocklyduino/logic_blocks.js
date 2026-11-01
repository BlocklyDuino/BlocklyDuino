/* Keep Boolean gates in the existing Logic block rather than duplicate categories. */
(function(){
 var original=Blockly.Blocks.logic_operation.init;
 Blockly.Blocks.logic_operation.init=function(){original.call(this);this.getField('OP').menuGenerator_=[['and','AND'],['or','OR'],['xor','XOR'],['nand','NAND'],['nor','NOR'],['xnor','XNOR']];this.setTooltip('Boolean gates on true/false values. XOR means exactly one input is true; XNOR means both are equal. AND/OR/NAND/NOR short-circuit. For each bit of a byte or word, use Low-level → Bits and bytes.');};
 Blockly.Arduino.logic_operation=function(){var A=Blockly.Arduino,a=A.valueToCode(this,'A',A.ORDER_NONE)||'false',b=A.valueToCode(this,'B',A.ORDER_NONE)||'false',op=this.getFieldValue('OP'),code;
 if(op==='XOR'||op==='XNOR')code='((bool)('+a+') '+(op==='XOR'?'!=':'==')+' (bool)('+b+'))';
 else{code='(('+a+') '+(op==='AND'||op==='NAND'?'&&':'||')+' ('+b+'))';if(op==='NAND'||op==='NOR')code='(!'+code+')';}
 return [code,A.ORDER_ATOMIC];};
}());
