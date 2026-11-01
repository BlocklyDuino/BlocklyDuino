#include <cassert>
#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include <BlocklyTextIO.h>
struct Card {struct File {bool error=false,open=true;operator bool()const{return open;}bool getError(){return error;}}file;std::string data;size_t pos=0,reads=0;bool ok=true;int readByte(){++reads;if(pos==data.size()){ok=false;return -1;}return data[pos++];}};
int main(){Card c;c.data="C4 250\r\nF#5,100\n\nR 50";
 assert(std::string(bxReadLine(c,32).c_str())=="C4 250"&&c.ok);assert(std::string(bxReadLine(c,32).c_str())=="F#5,100"&&c.ok);assert(bxReadLine(c,32).length()==0&&c.ok);assert(std::string(bxReadLine(c,32).c_str())=="R 50"&&c.ok);assert(!bxReadLine(c,32).length()&&!c.ok);
 Card big;big.data=std::string(300,'x');assert(!bxReadLine(big,16).length()&&!big.ok&&big.reads==17);
 Card fault;fault.data="abc";fault.file.error=true;bxReadLine(fault,32);assert(!fault.ok);
 Card noFile;noFile.file.open=false;bxReadLine(noFile,32);assert(!noFile.ok&&noFile.reads==0);
 Card mem;bxReadLine(mem,2048);assert(!mem.ok&&mem.reads==0);bxReadLine(mem,0);assert(!mem.ok);bxReadLine(mem,-1);assert(!mem.ok);
 // Exercise the real beginner fixture with example 39's 32-character limit.
 std::ifstream fixture("blockly/apps/blocklyduino/examples/MELODY.TXT");assert(fixture.good());std::stringstream data;data<<fixture.rdbuf();Card melody;melody.data=data.str();unsigned notes=0;
 while(melody.pos<melody.data.size()){std::string line=bxReadLine(melody,32).c_str();assert(melody.ok);if(!line.empty()&&line[0]!='#')++notes;}assert(notes==9);
 std::cout<<"PASS bounded text records, real MELODY.TXT, CRLF/LF, EOF without newline, overflow, I/O and allocation errors\n";
}
