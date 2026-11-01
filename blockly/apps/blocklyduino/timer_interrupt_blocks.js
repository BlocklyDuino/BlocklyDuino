/* Periodic Timer1 interrupts for classic Pro Mini / Uno AVR boards. */
(function(){
 'use strict';
 var A=Blockly.Arduino,oldInit=A.init,oldFinish=A.finish;
 function enabled(b){return !b.disabled&&!(b.getInheritedDisabled&&b.getInheritedDisabled());}
 function sources(ws){return ws.getAllBlocks().filter(function(b){return enabled(b)&&b.type==='irq_timer1';});}
 function requireSource(b){var all=sources(b.workspace);if(all.length!==1)throw Error('Add exactly one Timer1 interrupt handler before using Timer1 controls.');return all[0];}
 function value(b){return A.valueToCode(b,'PERIOD_US',A.ORDER_NONE)||'100000';}
 function inspect(ws){
  var timers=sources(ws);if(!timers.length)return;
  if(timers.length>1)throw Error('Timer1 can have only one periodic interrupt handler.');
  ws.getAllBlocks().filter(enabled).forEach(function(b){
   if(b.type==='device_servo'||b.type==='servo_move'||b.type==='servo_read_degrees')throw Error('Timer1 interrupt conflicts with Servo: both use Timer1 on ATmega168/328P.');
   if(b.type==='avr_isr'&&/^TIMER1_/.test(b.getFieldValue('VECTOR')))throw Error('Timer1 is already owned by the periodic interrupt. Remove the other Timer1 ISR.');
   if(b.type==='inout_analog_write'&&/^(9|10|D9|D10)$/.test(b.getFieldValue('PIN')))throw Error('Timer1 interrupt disables PWM on D9/D10. Choose another PWM pin or remove the Timer1 interrupt.');
  });
 }
 A.init=function(ws){oldInit.call(this,ws);A.irqTimerSetup_=null;inspect(ws);};
 A.finish=function(code){
  // The program generator puts user_setup_* last. Insert this entry after all
  // blocks have generated so peripherals and user initialization finish first.
  if(A.irqTimerSetup_!==null)A.setups_.user_setup_zz_irq_timer1='BxTimer1::configure('+A.irqTimerSetup_+');';
  return oldFinish.call(this,code);
 };
 var runtime=`#if !defined(__AVR_ATmega168__) && !defined(__AVR_ATmega168A__) && !defined(__AVR_ATmega168P__) && !defined(__AVR_ATmega168PA__) && !defined(__AVR_ATmega328__) && !defined(__AVR_ATmega328P__)
#error "Timer1 interrupt blocks require ATmega168/328P."
#endif
struct BxTimer1 {
  static volatile uint8_t clockBits;
  static void pause() {
    ATOMIC_BLOCK(ATOMIC_RESTORESTATE) {
      TIMSK1 = 0;
      TCCR1B = _BV(WGM12);
      TIFR1 = _BV(OCF1A) | _BV(OCF1B) | _BV(TOV1) | _BV(ICF1);
    }
  }
  static bool restart() {
    bool started = false;
    ATOMIC_BLOCK(ATOMIC_RESTORESTATE) {
      TIMSK1 = 0;
      TCCR1B = _BV(WGM12);
      TCNT1 = 0;
      TIFR1 = _BV(OCF1A) | _BV(OCF1B) | _BV(TOV1) | _BV(ICF1);
      if (clockBits) {
        TIMSK1 = _BV(OCIE1A);
        TCCR1B = _BV(WGM12) | clockBits;
        started = true;
      }
    }
    return started;
  }
  static bool running() {
    bool result;
    ATOMIC_BLOCK(ATOMIC_RESTORESTATE) {
      result = (TIMSK1 & _BV(OCIE1A)) && (TCCR1B & 7);
    }
    return result;
  }
  static bool invalid() {
    ATOMIC_BLOCK(ATOMIC_RESTORESTATE) {
      TIMSK1 = 0;
      TCCR1B = _BV(WGM12);
      clockBits = 0;
      TIFR1 = _BV(OCF1A) | _BV(OCF1B) | _BV(TOV1) | _BV(ICF1);
    }
    return false;
  }
  template<typename T> static bool configure(T requestedUs) {
    const uint32_t maxUs = (65536ULL * 1024ULL * 1000000ULL) / F_CPU;
    // Comparison comes before conversion: reject negatives, NaN, infinity,
    // fractions and values above the timer's range without undefined casts.
    if (!(requestedUs >= 1) || !(requestedUs <= maxUs)) return invalid();
    const uint32_t us = (uint32_t)requestedUs;
    if ((T)us != requestedUs) return invalid();
    const uint64_t numerator = (uint64_t)us * F_CPU;
    uint32_t denominator = 1000000UL;
    uint8_t bits = 1;
    uint64_t ticks = (numerator + denominator - 1) / denominator;
    if (ticks > 65536) { denominator = 8000000UL; bits = 2; ticks = (numerator + denominator - 1) / denominator; }
    if (ticks > 65536) { denominator = 64000000UL; bits = 3; ticks = (numerator + denominator - 1) / denominator; }
    if (ticks > 65536) { denominator = 256000000UL; bits = 4; ticks = (numerator + denominator - 1) / denominator; }
    if (ticks > 65536) { denominator = 1024000000UL; bits = 5; ticks = (numerator + denominator - 1) / denominator; }
    if (!ticks || ticks > 65536) return invalid();
    ATOMIC_BLOCK(ATOMIC_RESTORESTATE) {
      TIMSK1 = 0;
      TCCR1A = 0;
      TCCR1B = _BV(WGM12);
      TCCR1C = 0;
      TCNT1 = 0;
      OCR1A = (uint16_t)(ticks - 1);
      TIFR1 = _BV(OCF1A) | _BV(OCF1B) | _BV(TOV1) | _BV(ICF1);
      clockBits = bits;
      TIMSK1 = _BV(OCIE1A);
      TCCR1B = _BV(WGM12) | bits;
    }
    return true;
  }
};
volatile uint8_t BxTimer1::clockBits = 0;
`;
 function include(){A.definitions_.irq_timer1_includes='#if defined(__AVR__)\n#include <avr/interrupt.h>\n#include <util/atomic.h>\n#else\n#error "Timer1 interrupt blocks require an AVR ATmega168/328P board."\n#endif';A.definitions_.irq_timer1_runtime=runtime;}
 function style(b,tip){b.setColour(25);b.setTooltip(tip);b.setHelpUrl('examples/interrupt-guide.html');}
 Blockly.Blocks.irq_timer1={init:function(){
  this.appendValueInput('PERIOD_US').setCheck('Number').appendField('Timer1 interrupt every').appendField('µs');this.appendStatementInput('DO');
  style(this,'Run this short body on every Timer1 compare event. Starts after setup finishes. Period accepts a variable or integer expression: 1–4194304 µs at 16 MHz. Rounded up to a timer tick. Very short periods can outrun the handler. Timer1 replaces Servo and PWM D9/D10; Timer0 millis/delay remain available outside the ISR. Shared data needs volatile and atomic access.');
 }};
 A.irq_timer1=function(){
  requireSource(this);if(this.getParent())throw Error('Timer1 interrupt handler belongs outside setup, loop and functions.');include();
  A.irqTimerSetup_=value(this);
  A.definitions_.irq_timer1_handler='ISR(TIMER1_COMPA_vect) {\n'+A.statementToCode(this,'DO')+'}\n';return '';
 };
 Blockly.Blocks.irq_timer1_set_period={init:function(){this.appendValueInput('PERIOD_US').setCheck('Number').appendField('Timer1 set period µs → ok');this.setOutput(true,'Boolean');style(this,'Set a new integer period and start a full new Timer1 period. Returns true if valid; invalid input stops Timer1 and returns false. At 16 MHz: 1–4194304 µs. The argument is evaluated once. Changing a running timer resets its phase.');}};
 A.irq_timer1_set_period=function(){requireSource(this);include();return ['BxTimer1::configure('+value(this)+')',A.ORDER_ATOMIC];};
 Blockly.Blocks.irq_timer1_control={init:function(){this.appendDummyInput().appendField('Timer1').appendField(new Blockly.FieldDropdown([['pause','PAUSE'],['restart period','RESTART']]),'ACTION');this.setPreviousStatement(true);this.setNextStatement(true);style(this,'Pause stops Timer1 clock and its interrupt but remembers its configured period. Restart begins a full new period. Neither operation changes the global interrupt-enable state or resets the shared Timer0 prescaler. After invalid configuration, set a valid period before restart.');}};
 A.irq_timer1_control=function(){requireSource(this);include();return this.getFieldValue('ACTION')==='PAUSE'?'BxTimer1::pause();\n':'BxTimer1::restart();\n';};
 Blockly.Blocks.irq_timer1_running={init:function(){this.appendDummyInput().appendField('Timer1 running?');this.setOutput(true,'Boolean');style(this,'True when Timer1 has a clock source and its compare interrupt is enabled. This does not mean global interrupts are enabled; an enclosing atomic block still delays handlers.');}};
 A.irq_timer1_running=function(){requireSource(this);include();return ['BxTimer1::running()',A.ORDER_ATOMIC];};
 window.BlocklyTimerInterrupts={runtime:runtime,inspect:inspect};
})();
