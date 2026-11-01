#include <cassert>
#include <cstdio>
#include <Arduino.h>
volatile uint8_t TCCR1A=0,TCCR1B=0,TIMSK1=0,TCCR2A=0,TCCR2B=0,TCNT2=0,OCR2A=0,TIFR2=0,TIMSK2=0,testPorts[4]={0};
volatile uint16_t TCNT1=0,ICR1=0,OCR1A=0,OCR1B=0;
uint32_t testMillis=0;
#include <BlocklyHardwareServo.h>
#include <BlocklyHardwareBuzzer.h>
int main(){
 BxHardwareServo a,b,invalid;
 assert(!invalid.attach(3));assert(a.attach(9,1000,2000,50));assert(b.attach(10,1000,2000,50));
 assert(ICR1==F_CPU/(8*50)-1&&TIMSK1==0);assert((TCCR1A&(_BV(COM1A1)|_BV(COM1B1)))==(_BV(COM1A1)|_BV(COM1B1)));
 a.write(90);assert(OCR1A==1500*(F_CPU/1000000)/8);b.writeMicroseconds(3000);assert(OCR1B==2000*(F_CPU/1000000)/8);a.writeMicroseconds(0);assert(OCR1A==1000*(F_CPU/1000000)/8);
 BxHardwareBuzzer bell(11),bad(4);assert(bell.begin());assert(!bad.begin());assert(!bad.note(440,200));
 assert(bell.note(440,250));assert(TIMSK2==0&&TCCR2A==(_BV(COM2A0)|_BV(WGM21)));assert(bell.busy());
 uint16_t divisors[]={0,1,8,32,64,128,256,1024};double frequency=double(F_CPU)/(2.0*divisors[TCCR2B]*(OCR2A+1));assert(frequency>435&&frequency<445);
 // Repeating an unchanged target must not reset the timer phase.
 TCNT2=17;assert(bell.note(440,250));assert(TCNT2==17);
 testMillis=249;bell.update();assert(bell.busy());testMillis=250;bell.update();assert(!bell.busy()&&!(TCCR2A&_BV(COM2A0)));
 testMillis=0xfffffff0;assert(bell.noteRecord("C4 100"));testMillis+=100;bell.update();assert(!bell.busy());
 assert(!bell.note(1,100)&&!bell.ok&&!bell.busy());assert(bell.note(0,100)&&bell.ok&&bell.busy());bell.stop();assert(!bell.busy());
 const BlocklyMusicNote melody[]={{440,10},{660,20}};bell.play(melody,2);testMillis+=10;bell.update();assert(bell.busy());testMillis+=20;bell.update();assert(!bell.busy());
 BxHardwareBuzzer bass(9);assert(bass.begin()&&bass.note(20,200));assert(TIMSK1==0&&TCCR1A==_BV(COM1A0)&&TCCR1B& _BV(WGM12));
 BxBuzzerRef ref(bass);ref.note(440,30);assert(ref.busy());testMillis+=30;assert(!ref.busy());ref.stop();
 printf("PASS %lu Hz hardware pulse registers: servo PWM periods/endpoints, independent compare channels, timer tone quantization, zero waveform IRQs, expiry, rollover and shared note syntax\n",F_CPU);
}
