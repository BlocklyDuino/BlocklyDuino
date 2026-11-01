#include <cassert>
#include <iostream>
#include <fstream>
#include <sstream>
#include <BlocklySDMusic.h>
struct Rig {
 BxSD sd;BlocklyBuzzer a,b,c;BxSDScore<BxSD> player;
 Rig():player(sd,a,&b,&c){}
 void start(const char* text){sd.files["POLY.TXT"]=text;assert(player.start("POLY.TXT"));}
 void tick(){auto count=sd.file.reads;player.update();assert(sd.file.reads-count<=32);}
 void at(uint32_t when){fakeMillis=when;for(int i=0;i<8;++i)tick();}
 void finish(){a.finish();b.finish();c.finish();tick();}
};
int main(){
 fakeMillis=0;Rig r;r.start("@score 1 absolute\n0,1,C4,250\n0,2,E4,500\n0,3,G4,500\n250,1,F#5,300\n500,2,R,100\n500,3,440,100");r.at(0);
 assert(r.a.notes.size()==1&&r.b.notes.size()==1&&r.c.notes.size()==1);assert(r.a.notes[0].first==262&&r.b.notes[0].first==330&&r.c.notes[0].first==392);
 r.at(249);assert(r.a.notes.size()==1);r.at(250);assert(r.a.notes.size()==2&&r.a.notes[1].first==740);assert(r.b.notes.size()==1);
 r.at(500);assert(r.b.notes.size()==2&&r.b.notes[1].first==0&&r.c.notes[1].first==440);assert(r.player.active());r.finish();assert(!r.player.active()&&r.player.ok&&r.sd.closes==1);
 fakeMillis=100;Rig delta;delta.start("# space, tab and comma separators\n@score 1 delta\n0 1 A4 10\n0\t2\tBb6\t20\n10,3,R,5\n");delta.at(100);assert(delta.a.notes.size()==1&&delta.b.notes.size()==1&&delta.c.notes.empty());delta.at(109);assert(delta.c.notes.empty());delta.at(110);assert(delta.c.notes.size()==1);delta.finish();assert(delta.player.ok);
 fakeMillis=0xfffffff0;Rig wrap;wrap.start("@score 1 absolute\n32,1,C5,10\n");wrap.at(15);assert(wrap.a.notes.empty());wrap.at(16);assert(wrap.a.notes.size()==1);wrap.finish();assert(wrap.player.ok);
 for(const char *bad:{"@score 2 absolute\n","@score 1 other\n","0,0,C4,100\n","0,4,C4,100\n","0,1,H4,100\n","0,1,C8,100\n","0,1,C4,0\n","0,1,C4,60001\n","2147483648,1,C4,1\n","0,1,C4\n","9999999999999999999999999999999999999999999999999999999999999999999999\n"}){
  fakeMillis=0;Rig badRig;badRig.start(bad);for(int i=0;i<8&&badRig.player.active();++i)badRig.tick();assert(!badRig.player.ok&&!badRig.player.active());assert(badRig.a.notes.empty());
 }
 fakeMillis=0;Rig order;order.start("10,1,C4,1\n9,2,E4,1\n");order.at(10);assert(!order.player.ok);
 fakeMillis=0;Rig duplicate;duplicate.start("@score 1 delta\n2147483647,1,C4,1\n1,2,D4,1\n");duplicate.at(2147483647UL);assert(!duplicate.player.ok);
 BxSD sd;BlocklyBuzzer one;BxSDScore<BxSD> solo(sd,one);sd.files["S.TXT"]="0,2,C4,1\n";assert(solo.start("S.TXT"));solo.update();assert(!solo.ok&&!solo.active());
 fakeMillis=0;Rig fixture;std::ifstream input("blockly/apps/blocklyduino/examples/POLY.TXT");assert(input);std::ostringstream song;song<<input.rdbuf();fixture.start(song.str().c_str());fixture.at(5000);fixture.finish();assert(fixture.player.ok);assert(fixture.a.notes.size()==6&&fixture.b.notes.size()==3&&fixture.c.notes.size()==3);
 uint16_t hz=0,ms=0;assert(BlocklyNote::record("Bb6,250 # end",hz,ms,BlocklyBuzzer::midiFrequency)&&hz==1865&&ms==250);
 assert(BlocklyNote::record("4000 60000",hz,ms,BlocklyBuzzer::midiFrequency)&&hz==4000);assert(!BlocklyNote::record("C4 250 junk",hz,ms,BlocklyBuzzer::midiFrequency));
 std::cout<<"PASS polyphonic overlap, absolute/delta timing, 32-byte budgets, rollover, note syntax, EOF and malformed records\n";
}
