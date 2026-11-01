#include <cassert>
#include <cstdio>
#include "Arduino.h"
volatile uint8_t TCCR2A=0,TCCR2B=0,TCNT2=0,OCR2A=0,TIFR2=0,TIMSK2=0,testPorts[4]={0};
#include "BlocklyMusic.cpp"
static bool high(uint8_t p){return testPorts[digitalPinToPort(p)]&digitalPinToBitMask(p);}
static void ticks(unsigned n){for(unsigned i=0;i<n;i++)if(TIMSK2&_BV(OCIE2A))TIMER2_COMPA_vect();}
int main(){
 BlocklyBuzzer a(4),b(5),c(6),d(7),duplicate(4);
 assert(a.begin());assert(b.begin());assert(!duplicate.begin());assert(c.begin());assert(!d.begin());assert(OCR2A==127);
 a.note(440,1000);b.note(660,1000);c.note(880,1000);
 unsigned edges[3]={0,0,0};bool levels[3]={0,0,0};
 for(unsigned i=0;i<15625;i++){TIMER2_COMPA_vect();for(unsigned j=0;j<3;j++){bool now=high(4+j);if(now!=levels[j])++edges[j];levels[j]=now;}}
 assert(!a.busy()&&!b.busy()&&!c.busy());assert(!(TIMSK2&_BV(OCIE2A)));assert(!high(4)&&!high(5)&&!high(6));
 assert(edges[0]>=878&&edges[0]<=882);assert(edges[1]>=1318&&edges[1]<=1322);assert(edges[2]>=1758&&edges[2]<=1762);
 a.rest(100);assert(a.busy());ticks(1500);assert(a.busy()&&!high(4));ticks(63);assert(!a.busy());
 const BlocklyMusicNote tune[] PROGMEM={{440,10},{660,20}};
 a.play(tune,2,false);assert(a.busy());ticks(200);assert(!high(4)); // first note expired without update
 assert(a.busy());ticks(400);assert(!a.busy());
 a.note(1000,500);ticks(30);a.stop();assert(!a.busy()&&!high(4));
 a.note(0,0);assert(!a.busy());assert(BlocklyBuzzer::midiFrequency(69)==440);
 assert(a.noteRecord(String("F#5 250")));assert(a.busy());assert(!a.noteRecord("C4 0"));assert(a.busy());a.stop();
 printf("PASS: three independent edge counts=%u,%u,%u; ISR expiry, rests, delayed sequence update, stop, slot limits\n",edges[0],edges[1],edges[2]);
}
