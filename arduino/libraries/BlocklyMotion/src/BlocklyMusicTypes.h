// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <Arduino.h>
#if defined(ARDUINO_ARCH_STM32)
#include <api/deprecated-avr-comp/avr/pgmspace.h>
#else
#include <avr/pgmspace.h>
#endif
#include <BlocklyNoteParser.h>
struct BlocklyMusicNote { uint16_t frequency; uint16_t duration; };
