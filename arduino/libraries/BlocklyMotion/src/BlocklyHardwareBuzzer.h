// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <BlocklyMusicTypes.h>
#include <BlocklyMidi.h>
#if defined(__AVR__)
#include <util/atomic.h>
#elif defined(ARDUINO_ARCH_STM32)
#include <analog.h>
#endif

// Autonomous waveform edges. AVR: OC1A D9 or OC2A D11; STM32: PWM channel;
// Pico: core tone uses PIO. update() handles durations/scores without audio ISR.
class BxHardwareBuzzer {
  uint8_t pin_;
  uint16_t hz_=440,count_=0,index_=0;
  uint32_t started_=0,duration_=0;
  const BlocklyMusicNote *score_=nullptr;
  bool playing_=false,repeat_=false,ready_=false,waveOn_=false;
  void silence(){
    if(!ready_)return;
    waveOn_=false;
#if defined(__AVR__)
    ATOMIC_BLOCK(ATOMIC_RESTORESTATE){if(pin_==9)TCCR1A&=uint8_t(~_BV(COM1A0));else if(pin_==11)TCCR2A&=uint8_t(~_BV(COM2A0));}
    digitalWrite(pin_,LOW);
#elif defined(ARDUINO_ARCH_RP2040)
    noTone(pin_);
#elif defined(ARDUINO_ARCH_STM32)
    pwm_start(digitalPinToPinName(pin_),hz_,0,PERCENT_COMPARE_FORMAT);
#endif
  }
  bool wave(uint16_t hz,uint32_t duration){
    (void)duration;
#if !defined(ARDUINO_ARCH_RP2040)
    if(waveOn_&&hz==hz_)return true;
#endif
#if defined(__AVR__)
    static const uint16_t prescale1[]={1,8,64,256,1024},prescale2[]={1,8,32,64,128,256,1024};
    const uint16_t *prescale=pin_==9?prescale1:prescale2;
    uint8_t size=pin_==9?5:7;uint32_t top=0;uint8_t clock=0;
    for(uint8_t i=0;i<size;i++){uint32_t divisor=uint32_t(hz)*prescale[i]*2;uint32_t ticks=(F_CPU+divisor/2)/divisor;if(ticks>=1&&ticks<=(pin_==9?65536UL:256UL)){top=ticks-1;clock=i+1;break;}}
    if(!clock)return false;
    ATOMIC_BLOCK(ATOMIC_RESTORESTATE){
      if(pin_==9){TCCR1B=0;TCCR1A=_BV(COM1A0);TIMSK1=0;TCNT1=0;OCR1A=top;TCCR1B=_BV(WGM12)|clock;}
      else {TCCR2B=0;TCCR2A=_BV(COM2A0)|_BV(WGM21);TIMSK2=0;TCNT2=0;OCR2A=top;TCCR2B=clock;}
    }
#elif defined(ARDUINO_ARCH_RP2040)
    tone(pin_,hz,duration);
#elif defined(ARDUINO_ARCH_STM32)
    pwm_start(digitalPinToPinName(pin_),hz,50,PERCENT_COMPARE_FORMAT);
#else
    return false;
#endif
    hz_=hz;waveOn_=true;return true;
  }
  bool startNote(uint16_t hz,uint32_t duration){
    if(!ready_&&!begin())return false;
    if(!duration){playing_=false;silence();return ok=true;}
    if(hz&&!wave(hz,duration)){playing_=false;score_=nullptr;silence();return ok=false;}
    if(!hz)silence();
    started_=millis();duration_=duration;playing_=true;return ok=true;
  }
 public:
  bool ok=true;
  explicit BxHardwareBuzzer(uint8_t pin):pin_(pin){}
  bool begin(){
    if(ready_)return true;
#if defined(__AVR__)
    if(pin_!=9&&pin_!=11)return ok=false;
#elif defined(ARDUINO_ARCH_STM32)
    if(pinmap_peripheral(digitalPinToPinName(pin_),PinMap_TIM)==NP)return ok=false;
#endif
    pinMode(pin_,OUTPUT);digitalWrite(pin_,LOW);ready_=true;return ok=true;
  }
  bool note(uint16_t hz,uint32_t duration){score_=nullptr;return startNote(hz,duration);}
  bool noteRecord(const char *text){uint16_t hz,ms;if(!BlocklyNote::record(text,hz,ms,midiFrequency))return false;return note(hz,ms);}
  bool noteRecord(const String &text){return noteRecord(text.c_str());}
  void rest(uint32_t ms){note(0,ms);}
  void stop(){score_=nullptr;playing_=false;silence();}
  void play(const BlocklyMusicNote *score,uint16_t count,bool repeat=false){stop();if(!score||!count)return;score_=score;count_=count;index_=0;repeat_=repeat;update();}
  void update(){
    if(playing_){if(uint32_t(millis()-started_)<duration_)return;playing_=false;silence();}
    if(!score_)return;
    if(index_>=count_){if(!repeat_){score_=nullptr;return;}index_=0;}
    uint16_t hz=pgm_read_word(&score_[index_].frequency),ms=pgm_read_word(&score_[index_].duration);++index_;startNote(hz,ms);
  }
  bool busy(){update();return playing_||score_;}
  static uint16_t midiFrequency(uint8_t n){return BlocklyNote::midiFrequency(n);}
};

// Optional adapter only for an SD score mixing hardware and software voices.
// Homogeneous scores keep their original, smaller concrete output type.
class BxBuzzerRef {
  void *object;
  void (*playFn)(void*,uint16_t,uint32_t);
  bool (*busyFn)(void*);
  void (*stopFn)(void*);
 public:
  template<class T> explicit BxBuzzerRef(T &b):object(&b),
    playFn([](void *p,uint16_t hz,uint32_t ms){static_cast<T*>(p)->note(hz,ms);}),
    busyFn([](void *p){return static_cast<T*>(p)->busy();}),
    stopFn([](void *p){static_cast<T*>(p)->stop();}){}
  void note(uint16_t hz,uint32_t ms){playFn(object,hz,ms);}
  bool busy(){return busyFn(object);}
  void stop(){stopFn(object);}
  static uint16_t midiFrequency(uint8_t n){return BlocklyNote::midiFrequency(n);}
};
