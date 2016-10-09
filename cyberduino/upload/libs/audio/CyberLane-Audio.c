#include "avr/eeprom.h"
#include <util/delay.h>
#include "CyberLane-Audio.h"

#define vel 10000l;

void play_tune(uint8_t *currentTune)
{
	for(uint8_t data = eeprom_read_byte(currentTune++); data != END_MARKER; data = eeprom_read_byte(currentTune++))
	{
		play_byte(data);
	}
}

void play_byte(uint8_t pByte)
{
	int tone = 0;
	int duration = 0;
	switch (GET_TONE(pByte)) {
		case T_C:
		tone = 1911;
		break;
		case T_CS:
		tone = 1804;
		break;
		case T_D:
		tone = 1703;
		break;
		case T_EB:
		tone = 1607;
		break;
		case T_E:
		tone = 1517;
		break;
		case T_F:
		tone = 1432;
		break;
		case T_FS:
		tone = 1352;
		break;
		case T_G:
		tone = 1276;
		break;
		case T_AB:
		tone = 1204;
		break;
		case T_A:
		tone = 1136;
		break;
		case T_BB:
		tone = 1073;
		break;
		case T_B:
		tone = 1012;
		break;
		case T_CX:
		tone = 955;
		break;
		case T_CSX:
		tone = 902;
		break;
		case T_DX:
		tone = 851;
		break;
		case T_EBX:
		tone = 803;
		break;
		case T_EX:
		tone = 758;
		break;
		case T_FX:
		tone = 716;
		break;
		case T_FSX:
		tone = 676;
		break;
		case T_GX:
		tone = 638;
		break;
		case T_ABX:
		tone = 602;
		break;
		case T_AX:
		tone = 568;
		break;
		case T_BBX:
		tone = 536;
		break;
		case T_BX:
		tone = 506;
		break;
		case T_REST:
		tone = 0;
		break;
	}
	switch (GET_DURATION(pByte)) {
		case 0:
		duration = 2;
		break;
		case 1:
		duration = 4;
		break;
		case 2:
		duration = 6;
		break;
		case 3:
		duration = 8;
		break;
		case 4:
		duration = 12;
		break;
		case 5:
		duration = 16;
		break;
		case 6:
		duration = 18;
		break;
		case 7:
		duration = 24;
		break;
	}
	long tvalue = duration * vel;
	if (tone == 0)
	{
		_delay_us(tvalue);
	}
	else
	{
		play_tone(tone, tvalue);
	}
}

void play_tone(int tone, long tempo_value)
{
	long tempo_position = 0;
	while (tempo_position < tempo_value && tempo_value < 640000) // enters an infinite loop when tempo_value is a big value
	{
		SPEAKER_ON();
		_delay_us(tone / 2);
		
		SPEAKER_OFF();
		_delay_us(tone / 2);
		
		tempo_position += tone;
	}
}