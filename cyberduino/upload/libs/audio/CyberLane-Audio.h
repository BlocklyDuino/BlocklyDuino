#define SPEAKER PD5
#define SPEAKER_PORT PORTD
#define SPEAKER_DDR DDRD
#define SPEAKER_ON() (SPEAKER_PORT |= (1 << SPEAKER))
#define SPEAKER_OFF() (SPEAKER_PORT &= ~(1 << SPEAKER))

#define NOTE(tone, dur) ((((((uint8_t)(dur)) & 0x07)<<5) | (((uint8_t)(tone)) & 0x1F)))
#define GET_TONE(note) ((note) & 0x1F)
#define GET_DURATION(note) (((note)>>5) & 0x07)
#define END_MARKER 0XFF
#define READ_BIT(byte, bit) ((byte & (1 << bit)) >> bit)

enum {
	T_REST,
	T_C,
	T_CS,
	T_D,
	T_EB,
	T_E,
	T_F,
	T_FS,
	T_G,
	T_AB,
	T_A,
	T_BB,
	T_B,
	T_CX,
	T_CSX,
	T_DX,
	T_EBX,
	T_EX,
	T_FX,
	T_FSX,
	T_GX,
	T_ABX,
	T_AX,
	T_BBX,
	T_BX
};

void play_tune(uint8_t *currentTune);
void play_byte(uint8_t pByte);
void play_tone(int tone, long tempo_value);