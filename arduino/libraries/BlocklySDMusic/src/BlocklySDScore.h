// Backward-compatible default AVR output; custom engines use BlocklySDScoreCore.h.
#pragma once
#include <BlocklyMusic.h>
#include <BlocklySDScoreCore.h>
template<class Card, class Output=BlocklyBuzzer> using BxSDScore = BxSDScoreT<Card, Output>;
