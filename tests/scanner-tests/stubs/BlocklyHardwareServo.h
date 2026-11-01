#pragma once
#include <Arduino.h>
struct ServoEvent { uint64_t time; int pin, pulse; };
extern std::vector<ServoEvent> servoEvents;
class BxHardwareServo {
  int pin_ = 0, min_ = 544, max_ = 2400;
 public:
  int pulse = 1500;
  bool attach(int pin, int lo, int hi, int hz) {
    pin_ = pin; min_ = lo; max_ = hi; pulse = 1500;
    return (pin == 9 || pin == 10) && hz == 50;
  }
  void writeMicroseconds(int value) {
    pulse = constrain(value, min_, max_);
    servoEvents.push_back({fakeTime, pin_, pulse});
  }
};
