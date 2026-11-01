/* Direct AVR registers. No pinMode/digitalWrite side effects are hidden here. */
(function(){
  'use strict';
  var A=Blockly.Arduino;
  var ports=[['PORTB / D8–D13','B'],['PORTC / A0–A5','C'],['PORTD / D0–D7','D']];
  var pinList=[];
  for(var i=0;i<6;i++)pinList.push(['PB'+i+' / D'+(i+8),'B'+i]);
  for(var i=0;i<6;i++)pinList.push(['PC'+i+' / A'+i,'C'+i]);
  for(var i=0;i<8;i++)pinList.push(['PD'+i+' / D'+i,'D'+i]);
  function value(b,k,f){return A.valueToCode(b,k,A.ORDER_NONE)||f;}
  function identifier(initial){return new Blockly.FieldTextInput(initial,function(s){return /^[A-Za-z_][A-Za-z0-9_]*$/.test(s)?s:null;});}
  function reg(b){var n=b.getFieldValue('REGISTER');if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(n))throw Error('Use one AVR register symbol, such as ADMUX, TCCR1A or TCNT1.');return n;}
  function include(mapped){
    A.definitions_.avr_io='#if !defined(__AVR__)\n#error "AVR register blocks require an AVR board."\n#else\n#include <avr/io.h>\n#endif';
    if(mapped)A.definitions_.avr_port_target='#if !defined(__AVR_ATmega168__) && !defined(__AVR_ATmega168A__) && !defined(__AVR_ATmega168P__) && !defined(__AVR_ATmega168PA__) && !defined(__AVR_ATmega328__) && !defined(__AVR_ATmega328P__)\n#error "Mapped PORTB/C/D blocks require ATmega168/328P (Pro Mini, Nano or Uno)."\n#endif';
  }
  function port(b){include(true);var p=b.getFieldValue('PORT');if(['B','C','D'].indexOf(p)<0)throw Error('Choose PORTB, PORTC or PORTD.');return p;}
  function pin(b){include(true);var p=b.getFieldValue('PIN');if(!/^[BC][0-5]$|^D[0-7]$/.test(p))throw Error('Choose an available ATmega168/328P GPIO pin.');return {port:p.charAt(0),bit:p.charAt(1)};}
  function block(type,label,build,tip,output){Blockly.Blocks[type]={init:function(){this.setColour(5);this.appendDummyInput().appendField(label);if(build)build.call(this);if(output)this.setOutput(true,output);else{this.setPreviousStatement(true);this.setNextStatement(true);}this.setTooltip(tip);this.setHelpUrl('examples/low-level-guide.html');}};}
  function portField(){this.appendDummyInput().appendField(new Blockly.FieldDropdown(ports),'PORT');}
  function mask(){this.appendValueInput('MASK').setCheck('Number').appendField('mask');}
  function regField(initial){this.appendDummyInput().appendField(identifier(initial),'REGISTER');}
  block('avr_port_read','read port',function(){portField.call(this);this.appendDummyInput().appendField(new Blockly.FieldDropdown([['pins PINx','PIN'],['output / pull-up PORTx','PORT'],['direction DDRx','DDR']]),'REGISTER');},'Read the 8-bit physical input register, output/pull-up latch or direction register. PINx reports pin levels; PORTx reports the latch. Reading does not change the port.','Number');
  A.avr_port_read=function(){var p=port(this),r=this.getFieldValue('REGISTER');if(['PIN','PORT','DDR'].indexOf(r)<0)throw Error('Choose PIN, PORT or DDR.');return [r+p,A.ORDER_ATOMIC];};
  block('avr_port_bits','port bits',function(){portField.call(this);this.appendDummyInput().appendField(new Blockly.FieldDropdown([['set','SET'],['clear','CLEAR'],['toggle','TOGGLE']]),'ACTION');mask.call(this);},'Mask selects bits to change in PORTx; other bits stay unchanged. Set/clear with a variable mask are read-modify-write, so use atomic if an ISR changes this port. Toggle writes PINx = mask directly. PWM/peripheral ownership is unchanged.');
  A.avr_port_bits=function(){var p=port(this),m='(uint8_t)('+value(this,'MASK','32')+')',op=this.getFieldValue('ACTION');return op==='TOGGLE'?'PIN'+p+' = '+m+';\n':'PORT'+p+(op==='CLEAR'?' &= (uint8_t)~':' |= ')+m+';\n';};
  block('avr_port_replace','replace masked port bits',function(){portField.call(this);mask.call(this);this.appendValueInput('VALUE').setCheck('Number').appendField('value');},'Replace only selected PORTx bits: (old & ~mask) | (value & mask). Mask and value are each evaluated once. This is a read-modify-write operation; wrap it in atomic if an ISR shares the port.');
  A.avr_port_replace=function(){var p=port(this);return '{\n  const uint8_t avrMask = (uint8_t)('+value(this,'MASK','32')+');\n  const uint8_t avrValue = (uint8_t)('+value(this,'VALUE','0')+');\n  PORT'+p+' = (uint8_t)((PORT'+p+' & (uint8_t)~avrMask) | (avrValue & avrMask));\n}\n';};
  block('avr_port_write','write whole port register',function(){portField.call(this);this.appendDummyInput().appendField(new Blockly.FieldDropdown([['output / pull-up PORTx','PORT'],['direction DDRx','DDR']]),'REGISTER');this.appendValueInput('VALUE').setCheck('Number').appendField('value');},'Replace all eight bits of PORTx or DDRx. This can change unrelated pins, UART, pull-ups or directions. Use masked blocks to preserve other bits. The port register is 8 bits; only the low byte is written.');
  A.avr_port_write=function(){var p=port(this),r=this.getFieldValue('REGISTER');if(['PORT','DDR'].indexOf(r)<0)throw Error('Choose PORT or DDR for whole-port write.');return r+p+' = (uint8_t)('+value(this,'VALUE','0')+');\n';};
  block('avr_port_direction','port direction',function(){portField.call(this);this.appendDummyInput().appendField(new Blockly.FieldDropdown([['output','OUTPUT'],['input','INPUT']]),'DIRECTION');mask.call(this);},'Set selected DDR bits for outputs, or clear them for inputs. Other directions are preserved. For input pull-ups also set the matching PORT bits; clear those bits for a floating input. Variable masks need atomic if an ISR shares DDR.');
  A.avr_port_direction=function(){return 'DDR'+port(this)+(this.getFieldValue('DIRECTION')==='INPUT'?' &= (uint8_t)~':' |= ')+'(uint8_t)('+value(this,'MASK','32')+');\n';};
  block('avr_pin_write','direct pin',function(){this.appendDummyInput().appendField(new Blockly.FieldDropdown(pinList),'PIN');this.setFieldValue('B5','PIN');this.appendValueInput('VALUE').setCheck('Boolean').appendField('high?');},'Set or clear one physical PORT bit. A constant true/false can compile to SBI/CBI. Configure DDR separately. On an input this controls its pull-up. Unlike digitalWrite, this does not disable PWM or peripheral output.');
  A.avr_pin_write=function(){var p=pin(this),v=value(this,'VALUE','true'),r='PORT'+p.port,m='_BV(P'+p.port+p.bit+')';return 'if ('+v+') { '+r+' |= '+m+'; } else { '+r+' &= (uint8_t)~'+m+'; }\n';};
  block('avr_pin_read','direct pin level',function(){this.appendDummyInput().appendField(new Blockly.FieldDropdown(pinList),'PIN');this.setFieldValue('D2','PIN');},'Read one physical PINx bit as true/false. PB0–PB5 map to D8–D13, PC0–PC5 to A0–A5, PD0–PD7 to D0–D7. PD0/PD1 are also UART RX/TX.','Boolean');
  A.avr_pin_read=function(){var p=pin(this);return ['((PIN'+p.port+' & _BV(P'+p.port+p.bit+')) != 0)',A.ORDER_ATOMIC];};
  block('avr_register_read','read register',function(){regField.call(this,'ADMUX');},'Read a symbolic register such as ADMUX or TCNT1. Its avr/io.h definition determines 8- or 16-bit width. A 16-bit access may require atomic protection if an ISR touches the register or a shared timer latch.','Number');
  A.avr_register_read=function(){include(false);return [reg(this),A.ORDER_ATOMIC];};
  block('avr_register_write','write register',function(){regField.call(this,'ADMUX');this.appendValueInput('VALUE').setCheck('Number').appendField('value');},'Assign the whole register. The symbol determines its width; use a value that fits. Hardware-specific bits and peripheral side effects follow the datasheet. Multi-byte access is not made atomic automatically.');
  A.avr_register_write=function(){include(false);return reg(this)+' = ('+value(this,'VALUE','0')+');\n';};
  block('avr_register_bits','register bits',function(){regField.call(this,'TCCR1A');this.appendDummyInput().appendField(new Blockly.FieldDropdown([['set','SET'],['clear','CLEAR']]),'ACTION');mask.call(this);},'Read-modify-write a normal control register. Do not use for write-one-to-clear status bits, PINx toggles or mixed status/control registers without checking the datasheet. Use atomic if an ISR shares this register.');
  A.avr_register_bits=function(){include(false);return reg(this)+(this.getFieldValue('ACTION')==='CLEAR'?' &= ~(':' |= (')+value(this,'MASK','1')+');\n';};
  block('avr_register_flags','clear write-one flags',function(){regField.call(this,'TIFR1');mask.call(this);},'Write the mask directly to a write-one-to-clear flag register, such as TIFR1. Ones clear those flags; zeros leave other flags unchanged. There is no read-modify-write. Use only when the register datasheet specifies this behaviour.');
  A.avr_register_flags=function(){include(false);return reg(this)+' = ('+value(this,'MASK','1')+');\n';};
  block('avr_atomic','atomic',function(){this.appendStatementInput('DO');},'Disable interrupts only inside this short body, then restore their previous state (ATOMIC_RESTORESTATE). Useful for shared multi-byte values or read-modify-write. Keep delays, Serial and long loops outside; peripherals and counters continue running. Break/continue may only target loops inside this block.');
  A.avr_atomic=function(){
    include(false);A.definitions_.avr_atomic_include='#include <util/atomic.h>';
    var body=this.getInputTargetBlock('DO'),nodes=body?body.getDescendants():[];
    for(var i=0;i<nodes.length;i++)if(nodes[i].type==='controls_flow_statements'&&!nodes[i].disabled&&!(nodes[i].getInheritedDisabled&&nodes[i].getInheritedDisabled())){
      var parent=nodes[i].getSurroundParent(),loop=false;
      while(parent&&parent!==this){if(['controls_repeat','controls_repeat_ext','controls_whileUntil','controls_for','controls_forEach'].indexOf(parent.type)>=0){loop=true;break;}parent=parent.getSurroundParent();}
      if(!loop)throw Error('Break/continue inside atomic cannot target a loop outside it. Move the flow control outside atomic, or put the loop inside the atomic block.');
    }
    return 'ATOMIC_BLOCK(ATOMIC_RESTORESTATE) {\n'+A.statementToCode(this,'DO')+'}\n';
  };
  block('avr_delay_us','delay microseconds',function(){this.appendValueInput('US').setCheck('Number');},'Blocking delayMicroseconds for short device pulses. Use 1–16383 microseconds on a 16 MHz Pro Mini. Interrupts remain enabled unless the block is inside atomic; actual timing includes any interrupt delays.');
  A.avr_delay_us=function(){include(false);return 'delayMicroseconds('+value(this,'US','2')+');\n';};
  block('avr_nop','nop: one CPU cycle',null,'Emit one NOP with a compiler memory barrier. At 16 MHz one cycle is 62.5 ns. This does not disable interrupts or guarantee the timing of surrounding instructions.');
  A.avr_nop=function(){include(false);return '__asm__ __volatile__("nop" ::: "memory");\n';};
  // This legacy Blockly bundle has the flow block but no Arduino generator.
  // Keep a later/upstream generator when one is already installed.
  if(!A.controls_flow_statements)A.controls_flow_statements=function(){
    var parent=this.getSurroundParent(),loop=false;
    while(parent){if(['controls_repeat','controls_repeat_ext','controls_whileUntil','controls_for','controls_forEach'].indexOf(parent.type)>=0){loop=true;break;}parent=parent.getSurroundParent();}
    if(!loop)throw Error('Break/continue must be inside a loop.');
    return this.getFieldValue('FLOW')==='CONTINUE'?'continue;\n':'break;\n';
  };
  Blockly.Blocks.avr_isr={init:function(){this.setColour(5);this.appendDummyInput().appendField('interrupt handler').appendField(identifier('PCINT0_vect'),'VECTOR');this.appendStatementInput('DO');this.setTooltip('Define a top-level AVR ISR. Configure its hardware source separately. One handler per vector; Arduino libraries may already own a vector. Keep it short; avoid delay/Serial. Shared variables need volatile, and multi-byte access may need atomic.');this.setHelpUrl('examples/low-level-guide.html');}};
  A.avr_isr=function(){include(false);var vector=this.getFieldValue('VECTOR');if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(vector))throw Error('Enter one AVR interrupt vector identifier, such as PCINT0_vect.');if(this.getParent())throw Error('Interrupt handlers belong at the top level.');var self=this;var duplicates=this.workspace.getAllBlocks().filter(function(b){return b.type==='avr_isr'&&!b.disabled&&b.getFieldValue('VECTOR')===vector;});if(duplicates.length>1)throw Error('Only one interrupt handler can use '+vector+'.');A.definitions_.avr_interrupt_include='#include <avr/interrupt.h>';A.definitions_['avr_isr_'+vector]='#ifndef '+vector+'\n#error "Unknown interrupt vector: '+vector+'"\n#endif\nISR('+vector+') {\n'+A.statementToCode(this,'DO')+'}\n';return '';};
}());
