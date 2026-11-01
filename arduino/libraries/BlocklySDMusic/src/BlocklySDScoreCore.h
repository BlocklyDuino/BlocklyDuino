// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <BlocklySD.h>
#include <BlocklyNoteParser.h>
#include <string.h>
#ifdef __AVR__
#include <avr/pgmspace.h>
#define BX_SCORE_EQ(a,b) (!strcmp_P(a,PSTR(b)))
#else
#define BX_SCORE_EQ(a,b) (!strcmp(a,b))
#endif

// Legacy C4 250 records and timed polyphonic CSV/TSV records share note syntax.
// @score 1 absolute (default) or @score 1 delta
// time_ms,voice_1_to_3,note_or_Hz,duration_ms
// At most 32 bytes read per update, one queued event, no whole-score buffer.
template<class Card, class Output> class BxSDScoreT {
  Card &card;
  Output *voices[3];
  char line[40];
  uint8_t length,voice;
  uint16_t frequency,duration;
  uint32_t started,timeline,due;
  bool running,eof,pending,relative,legacy,inComment,hadEvent;
  static bool number(const char *s,uint32_t &out){
    if(!s||!*s)return false;uint32_t n=0;
    while(*s){if(*s<'0'||*s>'9')return false;uint8_t d=*s++-'0';if(n>214748364UL||(n==214748364UL&&d>7))return false;n=n*10+d;}out=n;return true;
  }
  bool busy(){for(uint8_t i=0;i<3;++i)if(voices[i]&&voices[i]->busy())return true;return false;}
  void fail(){stop();ok=false;}
  bool parse(){
    line[length]=0;length=0;char *comment=strchr(line,'#');
    // # is a sharp inside C#4; a comment starts at a token boundary.
    while(comment && comment!=line && !BlocklyNote::space(comment[-1]))comment=strchr(comment+1,'#');
    if(comment)*comment=0;
    char *tokens[5];uint8_t count=0;char *s=line;
    while(*s){while(BlocklyNote::space(*s))++s;if(!*s)break;if(count==5)return false;tokens[count++]=s;while(*s&&!BlocklyNote::space(*s))++s;if(*s)*s++=0;}
    if(!count)return true;
    if(BX_SCORE_EQ(tokens[0],"@score")){
      if(count!=3||!BX_SCORE_EQ(tokens[1],"1")||hadEvent)return false;
      if(BX_SCORE_EQ(tokens[2],"absolute"))relative=false;else if(BX_SCORE_EQ(tokens[2],"delta"))relative=true;else return false;
      return true;
    }
    uint32_t when=0,channel=1,ms=0;uint8_t pitchAt;
    if(count==2){legacy=true;pitchAt=0;when=timeline;}
    else if(count==4){legacy=false;pitchAt=2;if(!number(tokens[0],when)||!number(tokens[1],channel)||channel<1||channel>3||!voices[channel-1])return false;
      if(relative){if(when>2147483647UL-timeline)return false;when+=timeline;}else if(when<timeline)return false;
    }else return false;
    if(!BlocklyNote::pitch(tokens[pitchAt],frequency,Output::midiFrequency)||!number(tokens[pitchAt+1],ms)||!ms||ms>60000)return false;
    hadEvent=true;duration=uint16_t(ms);voice=uint8_t(channel-1);due=when;pending=true;
    if(legacy){if(ms>2147483647UL-timeline)return false;timeline+=ms;}else timeline=when;
    return true;
  }
 public:
  bool ok;
  BxSDScoreT(Card &storage,Output &one,Output *two=nullptr,Output *three=nullptr):card(storage),voices{&one,two,three},length(0),voice(0),frequency(0),duration(0),started(0),timeline(0),due(0),running(false),eof(false),pending(false),relative(false),legacy(false),inComment(false),hadEvent(false),ok(true){}
  bool start(const char *path){stop();length=0;timeline=0;pending=eof=relative=legacy=inComment=hadEvent=false;ok=card.open(path,false);running=ok;started=millis();return ok;}
  bool start(const String &path){return start(path.c_str());}
  void stop(){if(running)card.close();running=false;pending=false;for(uint8_t i=0;i<3;++i)if(voices[i])voices[i]->stop();}
  bool active()const{return running;}
  void update(){
    if(!running)return;
    for(uint8_t budget=0;budget<32;){
      if(pending){if(uint32_t(millis()-started)<due)return;voices[voice]->note(frequency,duration);pending=false;}
      if(eof){if(!busy()){card.close();running=false;}return;}
      int c=card.file.read();++budget;
      if(c<0){if(card.file.getError()){fail();return;}eof=true;if(length&&!parse()){fail();return;}continue;}
      if(inComment&&c!='\n')continue;
      if(c=='#'&&(!length||!((line[length-1]>='A'&&line[length-1]<='G')||(line[length-1]>='a'&&line[length-1]<='g')))){inComment=true;continue;}
      if(c=='\n'){inComment=false;if(!parse()){fail();return;}}
      else if(c!='\r'){if(length>=sizeof(line)-1){fail();return;}line[length++]=char(c);}
    }
  }
};

#undef BX_SCORE_EQ
