// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <stdint.h>
// Shared parser for one text record, EEPROM text and streamed SD scores.
// Output arguments change only after the whole value has been validated.
namespace BlocklyNote {
inline bool space(char c){return c==' '||c=='\t'||c=='\r'||c=='\n'||c==',';}
inline bool pitch(const char *text,uint16_t &out,uint16_t (*midiFrequency)(uint8_t)) {
  if(!text||!*text)return false;const char *s=text;while(space(*s))++s;
  uint16_t hz=0;
  if(*s>='0'&&*s<='9'){while(*s>='0'&&*s<='9'){if(hz>400)return false;hz=uint16_t(hz*10+(*s++-'0'));}}
  else if(*s=='R'||*s=='r'){++s;if(*s=='e'&&s[1]=='s'&&s[2]=='t')s+=3;}
  else{char c=*s++;if(c>='a'&&c<='g')c-=32;int semi;
    switch(c){case 'C':semi=0;break;case 'D':semi=2;break;case 'E':semi=4;break;case 'F':semi=5;break;case 'G':semi=7;break;case 'A':semi=9;break;case 'B':semi=11;break;default:return false;}
    if(*s=='#'){++semi;++s;}else if(*s=='b'){--semi;++s;}
    if(*s<'0'||*s>'9')return false;int midi=(*s++-'0'+1)*12+semi;if(midi<0||midi>127)return false;hz=midiFrequency(uint8_t(midi));
  }
  while(space(*s))++s;if(*s||(hz!=0&&(hz<20||hz>4000)))return false;out=hz;return true;
}
inline bool record(const char *s,uint16_t &hz,uint16_t &ms,uint16_t (*midiFrequency)(uint8_t)) {
  if(!s)return false;while(space(*s))++s;char token[6];uint8_t count=0;
  while(*s&&!space(*s)){if(count>=5)return false;token[count++]=*s++;}token[count]=0;
  uint16_t frequency;if(!pitch(token,frequency,midiFrequency))return false;
  while(space(*s))++s;uint32_t duration=0;uint8_t digits=0;
  while(*s>='0'&&*s<='9'){if(++digits>5)return false;duration=duration*10+(*s++-'0');}
  if(!digits||duration==0||duration>60000)return false;while(space(*s))++s;
  if(*s&&*s!='#')return false;hz=frequency;ms=uint16_t(duration);return true;
}
}
