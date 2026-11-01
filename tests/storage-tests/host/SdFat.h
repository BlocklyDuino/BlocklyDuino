#pragma once
#include <cstdio>
#include <cstdint>
#include <unistd.h>
#define O_RDWR 1
#define O_CREAT 2
#define O_AT_END 4
#define O_RDONLY 8
#define SD_SCK_MHZ(x) (x)
static int mockSeeks=0,mockReads=0;
static long mockWritten=0;
static uint32_t mockPreallocated=0;
static bool mockReserveFail=false;
class File32 {
FILE* f=nullptr;
public:
~File32(){close();}
bool close(){bool ok=!f||fclose(f)==0;f=nullptr;return ok;}
bool open(const char* p,int flags){close();f=fopen(p,(flags&O_RDONLY)?"rb":"r+b");if(!f&&(flags&O_CREAT))f=fopen(p,"w+b");if(f&&(flags&O_AT_END))fseek(f,0,SEEK_END);return f;}
bool preAllocate(uint32_t length){if(mockReserveFail)return false;mockPreallocated=length;return f&&ftruncate(fileno(f),length)==0;}
explicit operator bool()const{return f;}
bool seekSet(uint32_t pos){++mockSeeks;return f&&fseek(f,pos,SEEK_SET)==0;}
size_t write(uint8_t b){return write(&b,1);}
size_t write(const uint8_t* b,size_t n){if(!f)return 0;size_t result=fwrite(b,1,n,f);mockWritten+=result;return result;}
int read(){++mockReads;return f?fgetc(f):-1;}
int read(uint8_t* b,size_t n){++mockReads;return f?fread(b,1,n,f):0;}
bool sync(){return f&&fflush(f)==0;}
size_t print(const std::string& s){return write((const uint8_t*)s.c_str(),s.size());}
size_t println(const std::string& s){return print(s)+write('\n');}
};
class SdFat32 {
public:
bool begin(uint8_t,int){return true;}
bool exists(const char* p){return access(p,F_OK)==0;}
bool remove(const char* p){return std::remove(p)==0;}
};
