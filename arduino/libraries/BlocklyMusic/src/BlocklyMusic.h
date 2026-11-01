#ifndef BLOCKLY_MUSIC_H
#define BLOCKLY_MUSIC_H
#include <BlocklyMusicTypes.h>

class BlocklyBuzzer {
public:
  explicit BlocklyBuzzer(uint8_t pin);
  bool begin();
  // Replace the current note/sequence. 0 Hz is silence; 0 ms stops immediately.
  // Range: 20..4000 Hz, duration up to65535 ms; values are clamped.
  void note(uint16_t frequencyHz, uint32_t durationMs);
  bool noteRecord(const char *text) { uint16_t hz,ms;if(!BlocklyNote::record(text,hz,ms,midiFrequency))return false;note(hz,ms);return true; }
  bool noteRecord(const String &text) { return noteRecord(text.c_str()); }
  void rest(uint32_t durationMs) { note(0, durationMs); }
  void stop();
  bool busy();
  void update();
  // The score must be a PROGMEM array. Duration is in milliseconds.
  void play(const BlocklyMusicNote *score, uint16_t count, bool repeat=false);
  static void updateAll();
  static uint16_t midiFrequency(uint8_t midi);
private:
  uint8_t pin_, channel_;
  const BlocklyMusicNote *score_;
  uint16_t count_, index_;
  bool repeat_;
  void startNote(uint16_t hz, uint32_t durationMs);
  bool sounding() const;
};
#endif
