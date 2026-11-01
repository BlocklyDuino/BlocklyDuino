// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <Arduino.h>
#if defined(__AVR_ATmega168__) || defined(__AVR_ATmega168P__) || defined(__AVR_ATmega328__) || defined(__AVR_ATmega328P__)
#include <util/atomic.h>
#elif defined(ARDUINO_ARCH_STM32)
#include <analog.h>
#elif defined(ARDUINO_ARCH_RP2040)
#include <hardware/pwm.h>
#include <hardware/clocks.h>
#else
#error "No verified hardware Servo backend for this MCU"
#endif

// Autonomous PWM edges. Shared-timer frequency/channel ownership is validated
// by Blockly; these low-level methods do not discover arbitrary user C++ users.
class BxHardwareServo {
  uint8_t pin_=255;
  uint16_t min_=544,max_=2400,hz_=50;
  int16_t lastUs_=-1;
#if defined(ARDUINO_ARCH_STM32)
  HardwareTimer *timer_=nullptr;
  uint32_t channel_=0;
#endif
#if defined(ARDUINO_ARCH_RP2040)
  uint16_t div16_=16;
#endif
 public:
  bool attach(uint8_t pin,uint16_t low=544,uint16_t high=2400,uint16_t hz=50){
    if(low>=high||hz<40||hz>400||uint32_t(high)*hz>=1000000UL)return false;
#if defined(__AVR__)
    if(pin!=9&&pin!=10)return false;
#endif
    pin_=pin;lastUs_=-1;min_=low;max_=high;hz_=hz;pinMode(pin_,OUTPUT);
#if defined(__AVR__)
    static bool initialized=false;
    if(!initialized){ATOMIC_BLOCK(ATOMIC_RESTORESTATE){TCCR1A=0;TCCR1B=0;TIMSK1=0;TCNT1=0;ICR1=F_CPU/(8UL*hz_)-1;TCCR1A=_BV(WGM11);TCCR1B=_BV(WGM13)|_BV(WGM12)|_BV(CS11);}initialized=true;}
    writeMicroseconds(1500);
    ATOMIC_BLOCK(ATOMIC_RESTORESTATE){TCCR1A|=pin_==9?_BV(COM1A1):_BV(COM1B1);}
#elif defined(ARDUINO_ARCH_RP2040)
    uint64_t clock16=uint64_t(clock_get_hz(clk_sys))*16;
    div16_=(clock16+uint64_t(hz_)*65536-1)/(uint64_t(hz_)*65536);
    if(div16_<16)div16_=16;
    if(div16_>4095)return false;
    uint16_t top=(clock16+uint64_t(div16_)*hz_/2)/(uint64_t(div16_)*hz_)-1;
    uint8_t slice=pwm_gpio_to_slice_num(pin_);gpio_set_function(pin_,GPIO_FUNC_PWM);
    pwm_set_clkdiv_int_frac(slice,div16_>>4,div16_&15);pwm_set_wrap(slice,top);
    writeMicroseconds(1500);pwm_set_enabled(slice,true);
#else
    writeMicroseconds(1500);
#endif
    return true;
  }
  void write(int angle){if(angle<0)angle=0;if(angle>180)angle=180;writeMicroseconds(min_+(uint32_t(angle)*(max_-min_)+90)/180);}
  void writeMicroseconds(int us){
    if(pin_==255)return;
    if(us<min_)us=min_;
    if(us>max_)us=max_;
    if(us==lastUs_)return;
#if defined(__AVR__)
    uint16_t ticks=(uint32_t(us)*(F_CPU/1000000UL)+4)/8;
    ATOMIC_BLOCK(ATOMIC_RESTORESTATE){if(pin_==9)OCR1A=ticks;else OCR1B=ticks;}
#elif defined(ARDUINO_ARCH_RP2040)
    uint16_t level=(uint64_t(clock_get_hz(clk_sys))*16*us+uint64_t(div16_)*500000)/(uint64_t(div16_)*1000000);
    pwm_set_gpio_level(pin_,level);
#else
    if(!timer_){
      PinName pin=digitalPinToPinName(pin_);
      pwm_start(pin,hz_,us,MICROSEC_COMPARE_FORMAT);
      uint32_t index=get_timer_index((TIM_TypeDef*)pinmap_peripheral(pin,PinMap_TIM));
      timer_=(HardwareTimer*)HardwareTimer_Handle[index]->__this;
      channel_=STM_PIN_CHANNEL(pinmap_function(pin,PinMap_TIM));
    }else timer_->setCaptureCompare(channel_,us,MICROSEC_COMPARE_FORMAT);
#endif
    lastUs_=us;
  }
};
