#include <Arduino.h>
#include "CyberLane-RGB.h"

void rgb_set_color(uint8_t redPin, uint8_t greenPin, uint8_t bluePin, uint8_t red, uint8_t green, uint8_t blue)
{
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}