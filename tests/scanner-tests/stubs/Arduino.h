#pragma once
#include <cstdint>
#include <cstddef>
#include <string>
#include <deque>
#include <vector>
#include <sstream>
#include <iomanip>
#include <cmath>
#include <algorithm>

using byte = uint8_t;
class __FlashStringHelper;
#define F(s) reinterpret_cast<const __FlashStringHelper *>(s)
#define A0 14
#define min(a,b) ((a)<(b)?(a):(b))
#define max(a,b) ((a)>(b)?(a):(b))
#define constrain(x,a,b) ((x)<(a)?(a):((x)>(b)?(b):(x)))

extern uint64_t fakeTime;
extern int adcValue;
extern int (*adcReader)(uint64_t);
struct AdcEvent { uint64_t time; int pin; };
extern std::vector<AdcEvent> adcEvents;
inline uint32_t micros() { return uint32_t(fakeTime); }
inline uint32_t millis() { return uint32_t(fakeTime / 1000); }
inline int analogRead(int pin) { adcEvents.push_back({fakeTime, pin}); int value=adcReader ? adcReader(fakeTime) : adcValue; fakeTime += 104; return value; }

class Stream {
 public:
  virtual int available() = 0;
  virtual int read() = 0;
};
class SerialMock : public Stream {
 public:
  std::deque<uint8_t> input;
  std::string output, history;
  uint64_t txEnd = 0;
  unsigned long baud = 0;
  void begin(unsigned long speed) { baud = speed; }
  int available() override { return int(input.size()); }
  int read() override { int c = input.front(); input.pop_front(); return c; }
  void push(const std::string &s) { for (uint8_t c : s) input.push_back(c); }
  size_t write(uint8_t c) {
    // Approximate a 64-byte hardware UART TX ring at 115200. Header writes can
    // block; short pixel records should fit without delaying the ADC schedule.
    if (txEnd < fakeTime) txEnd = fakeTime;
    if (txEnd - fakeTime >= 64 * 87) fakeTime = txEnd - 63 * 87;
    txEnd += 87;
    output += char(c); history += char(c); return 1;
  }
  void print(const char *s) { while (*s) write(uint8_t(*s++)); }
  void print(const __FlashStringHelper *s) { print(reinterpret_cast<const char *>(s)); }
  template<class T> void print(T n) { std::ostringstream text; text << n; print(text.str().c_str()); }
  void print(double n, int digits) { std::ostringstream text; text << std::fixed << std::setprecision(digits) << n; print(text.str().c_str()); }
  void println() { write('\n'); }
  template<class T> void println(T n) { print(n); println(); }
};
extern SerialMock Serial;
