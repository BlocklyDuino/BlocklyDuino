// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <Arduino.h>
#if defined(ARDUINO_ARCH_STM32)
#include <api/deprecated-avr-comp/avr/pgmspace.h>
#else
#include <avr/pgmspace.h>
#endif
namespace BlocklyNote {
inline uint16_t midiFrequency(uint8_t midi) {
  static const uint16_t table[128] PROGMEM = {
    8,9,9,10,10,11,12,12,13,14,15,15,16,17,18,19,
    21,22,23,24,26,28,29,31,33,35,37,39,41,44,46,49,
    52,55,58,62,65,69,73,78,82,87,92,98,104,110,117,123,
    131,139,147,156,165,175,185,196,208,220,233,247,262,277,294,311,
    330,349,370,392,415,440,466,494,523,554,587,622,659,698,740,784,
    831,880,932,988,1047,1109,1175,1245,1319,1397,1480,1568,1661,1760,1865,1976,
    2093,2217,2349,2489,2637,2794,2960,3136,3322,3520,3729,3951,4186,4435,4699,4978,
    5274,5588,5920,6272,6645,7040,7459,7902,8372,8870,9397,9956,10548,11175,11840,12544
  };
  return midi<128 ? pgm_read_word(&table[midi]) : 0;
}
}
