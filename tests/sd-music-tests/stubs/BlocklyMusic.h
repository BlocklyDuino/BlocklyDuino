#pragma once
#include <cstdint>
#include <cmath>
#include <vector>
#include <utility>
struct BlocklyBuzzer {
  bool sounding=false;
  int stops=0;
  std::vector<std::pair<uint16_t,uint16_t>> notes;
  void note(uint16_t hz,uint32_t ms){notes.emplace_back(hz,ms);sounding=ms>0;}
  void stop(){++stops;sounding=false;}
  bool busy(){return sounding;}
  void finish(){sounding=false;}
  static uint16_t midiFrequency(uint8_t midi){return uint16_t(std::lround(440.0*std::pow(2.0,(int(midi)-69)/12.0)));}
};
