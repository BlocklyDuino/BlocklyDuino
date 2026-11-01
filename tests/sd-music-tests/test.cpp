#include <cassert>
#include <iostream>
#include <string>
#include <vector>
#include <utility>
#include "BlocklySDMusic.h"
using Note=std::pair<uint16_t,uint16_t>;
struct Rig {
  BxSD sd;BlocklyBuzzer buzzer;BxSDMelody<BxSD> player;
  Rig():player(sd,buzzer){}
  void start(const std::string &text){sd.files["TUNE.TXT"]=text;assert(player.start("TUNE.TXT"));}
  void tick(){size_t before=sd.file.reads;player.update();assert(sd.file.reads-before<=32);}
  void drain(){for(int i=0;i<1000&&player.active();++i){tick();buzzer.finish();}assert(!player.active());}
};
void valid(){
 Rig r;r.start("# score header\r\nC4 250\nD#4,500 #sharp\nDb4 100\nb3\t75\nr 60\nA4 60000");r.drain();
 assert(r.player.ok);assert((r.buzzer.notes==std::vector<Note>{{262,250},{311,500},{277,100},{247,75},{0,60},{440,60000}}));assert(r.sd.closes==1);
}
void boundaries(){
 for(auto text:{"E0 1","B7 1","R 1","c#4 12","Cb4 12","B#3 12"}){Rig r;r.start(text);r.drain();assert(r.player.ok);assert(r.buzzer.notes.size()==1);}
 for(auto text:{"C0 100","D#0 100","C8 100","B8 100"}){Rig r;r.start(text);r.drain();assert(!r.player.ok);assert(r.buzzer.notes.empty());}
}
void malformed(){
 for(auto text:{"C4 0","C4 0\n","R 00000","R 0\t","C4 60001","C4 65535","C4 999999","C4 000001","C4 -10","C4 1.2","C4 1x","C4","C4 ","H4 100","C##4 100","C12345 100","C4x 100","#comment\nC4 #missing duration","1234567890123456789012345678901234567890"}){
  Rig r;r.start(text);r.drain();assert(!r.player.ok);assert(r.buzzer.notes.empty());assert(r.sd.closes==1);
 }
}
void emptyAndComments(){
 for(auto text:{"","\r\n \t,","#only comment","#comment\n#second\n"}){Rig r;r.start(text);r.drain();assert(r.player.ok);assert(r.buzzer.notes.empty());assert(r.sd.closes==1);}
 Rig r;r.start("C4 1#tail without newline");r.drain();assert(r.player.ok);assert(r.buzzer.notes.size()==1);
}
void budgetAndDelay(){
 Rig r;r.start(std::string(100,' ') + "C4 10 D4 20");r.tick();assert(r.sd.file.reads==32);r.tick();assert(r.sd.file.reads==64);r.tick();assert(r.sd.file.reads==96);r.tick();assert(r.buzzer.notes.size()==1);
 size_t position=r.sd.file.pos,reads=r.sd.file.reads;for(int i=0;i<10;++i)r.tick();assert(r.sd.file.pos==position&&r.sd.file.reads==reads);assert(r.player.active());
 r.buzzer.finish();r.tick();assert(r.buzzer.notes.size()==2);assert(r.player.active());assert(r.sd.closes==0);r.tick();assert(r.sd.closes==0);r.buzzer.finish();r.tick();assert(!r.player.active()&&r.player.ok&&r.sd.closes==1);
 Rig c;c.start("#"+std::string(100,'x')+"\nR 1");c.drain();assert(c.player.ok);assert(c.buzzer.notes.size()==1);
}
void ownership(){
 Rig r;r.player.stop();assert(r.sd.closes==0);r.start("A4 10 B4 20");r.tick();assert(r.buzzer.sounding);r.player.stop();assert(!r.player.active()&&!r.buzzer.sounding&&r.sd.closes==1);r.player.stop();assert(r.sd.closes==1);
 r.start("C4 10");int closes=r.sd.closes;r.sd.files["OTHER.TXT"]="D4 2";assert(r.player.start(String("OTHER.TXT")));assert(r.sd.closes==closes+1);r.drain();assert(r.player.ok);
 assert(!r.player.start("MISSING.TXT"));assert(!r.player.active()&&!r.player.ok);closes=r.sd.closes;r.player.stop();assert(r.sd.closes==closes);
 r.start("A4 5");r.sd.file.errorAt=2;r.tick();assert(!r.player.ok&&!r.player.active()&&!r.buzzer.sounding);assert(r.sd.closes==closes+1);
}
struct GuardedSD : BxSD {
 bool streamActive=false;
 bool open(const char *path,bool append){return streamActive?false:BxSD::open(path,append);}
};
void preservesCardGuards(){
 GuardedSD card;BlocklyBuzzer buzzer;BxSDMelody<GuardedSD> player(card,buzzer);
 card.files["TUNE.TXT"]="A4 10";card.streamActive=true;
 assert(!player.start("TUNE.TXT"));assert(!player.active()&&!player.ok);assert(card.opens==0&&card.closes==0);assert(card.streamActive);
 card.streamActive=false;assert(player.start("TUNE.TXT"));assert(card.opens==1);player.update();assert(buzzer.notes.size()==1);player.stop();assert(card.closes==1);
}
int main(){valid();boundaries();malformed();emptyAndComments();budgetAndDelay();ownership();preservesCardGuards();std::cout<<"PASS: notes, sharps/flats, rests, comments, EOF, malformed tokens, duration limits, frequency limits, delayed sequencing, 32-read budget, file ownership/error cleanup\n";}
