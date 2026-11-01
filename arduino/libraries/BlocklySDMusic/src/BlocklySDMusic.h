// Backward-compatible default AVR output; custom engines use BlocklySDMusicCore.h.
#pragma once
#include <BlocklyMusic.h>
#include <BlocklySDMusicCore.h>
#include <BlocklySDScore.h>
template<class Card, class Output=BlocklyBuzzer> using BxSDMelody = BxSDMelodyT<Card, Output>;
