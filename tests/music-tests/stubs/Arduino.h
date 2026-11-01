#ifndef FAKE_ARDUINO_H
#define FAKE_ARDUINO_H
#include <stdint.h>
#include <string>
using String=std::string;
#define NUM_DIGITAL_PINS 20
#define NOT_A_PIN 0
#define OUTPUT 1
#define LOW 0
#define _BV(x) (1<<(x))
#define WGM21 1
#define CS21 1
#define OCF2A 1
#define OCIE2A 1
extern volatile uint8_t TCCR2A,TCCR2B,TCNT2,OCR2A,TIFR2,TIMSK2;
extern volatile uint8_t testPorts[4];
inline uint8_t digitalPinToPort(uint8_t p){return p<20?p/8+1:0;}
inline uint8_t digitalPinToBitMask(uint8_t p){return 1<<(p%8);}
inline volatile uint8_t*portOutputRegister(uint8_t p){return &testPorts[p];}
inline void pinMode(uint8_t,uint8_t){}
inline void digitalWrite(uint8_t p,uint8_t v){if(v)testPorts[digitalPinToPort(p)]|=digitalPinToBitMask(p);else testPorts[digitalPinToPort(p)]&=~digitalPinToBitMask(p);}
#define COM1A0 6
#define COM1A1 7
#define COM1B1 5
#define WGM11 1
#define WGM12 3
#define WGM13 4
#define CS11 1
#define COM2A0 6
extern volatile uint8_t TCCR1A,TCCR1B,TIMSK1;
extern volatile uint16_t TCNT1,ICR1,OCR1A,OCR1B;
extern uint32_t testMillis;
inline uint32_t millis(){return testMillis;}
#endif
