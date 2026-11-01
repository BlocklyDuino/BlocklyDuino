#pragma once
#include <Arduino.h>
#include <SdFat.h>

// FAT16/FAT32 via SdFat; one 512-byte cache and no image framebuffer.
class BxSD {
 protected:
  uint8_t cs;
  uint16_t bmpWidth,bmpHeight,bmpStride;
  bool put16(uint16_t v){return file.write(uint8_t(v))==1&&file.write(uint8_t(v>>8))==1;}
  bool put32(uint32_t v){return put16(uint16_t(v))&&put16(uint16_t(v>>16));}
 public:
  SdFat32 sd;
  File32 file;
  bool ok;
  BxSD(uint8_t pin):cs(pin),bmpWidth(0),bmpHeight(0),bmpStride(0),ok(false){}
  bool begin(){return ok=sd.begin(cs, SD_SCK_MHZ(1));}
  bool open(const char* path,bool append){file.close();bmpWidth=0;file.open(path,append?(O_RDWR|O_CREAT|O_AT_END):O_RDONLY);return ok=bool(file);}
  bool open(const String &path,bool append){return open(path.c_str(),append);}
  void close(){file.close();bmpWidth=0;}
  bool seek(uint32_t at){return ok=file&&file.seekSet(at);}
  template<class T> bool writeValue(T value){return ok=file&&file.write((uint8_t*)&value,sizeof(T))==sizeof(T);}
  template<class T> T readValue(){T value={};ok=file&&file.read((uint8_t*)&value,sizeof(T))==sizeof(T);return value;}
  template<class T> void print(const T &value,bool newline){if(!file){ok=false;return;}ok=(newline?file.println(value):file.print(value))>0;}
  int readByte(){if(!file){ok=false;return -1;}int result=file.read();ok=result>=0;return result;}
  void flush(){ok=file&&file.sync();}
  bool bmpCreate(const char* path,uint16_t width,uint16_t height){
    file.close();bmpWidth=0;
    if(!width||!height||width>32767||height>32767)return ok=false;
    if(sd.exists(path)&&!sd.remove(path))return ok=false;
    file.open(path,O_RDWR|O_CREAT);if(!file)return ok=false;
    uint32_t stride=((uint32_t(width)+31)/32)*4,bytes=stride*height;
    bool success=put16(0x4d42)&&put32(bytes+62)&&put32(0)&&put32(62)&&put32(40)&&put32(width)&&put32(uint32_t(-int32_t(height)))&&put16(1)&&put16(1)&&put32(0)&&put32(bytes)&&put32(2835)&&put32(2835)&&put32(2)&&put32(2)&&put32(0)&&put32(0x00ffffffUL);
    for(uint32_t i=0;success&&i<bytes;++i)success=file.write(uint8_t(0))==1;
    if(!success){file.close();return ok=false;}
    bmpWidth=width;bmpHeight=height;bmpStride=stride;return ok=file.sync();
  }
  bool bmpCreate(const String &path,uint16_t width,uint16_t height){return bmpCreate(path.c_str(),width,height);}
  bool bmpShade(uint16_t x,uint16_t y,int16_t shade){if(shade<0||shade>1)return ok=false;return bmpPixel(x,y,shade!=0);}
  bool bmpPixel(uint16_t x,uint16_t y,bool white){
    if(!file||!bmpWidth||x>=bmpWidth||y>=bmpHeight)return ok=false;
    uint32_t at=62+uint32_t(y)*bmpStride+x/8;
    if(!file.seekSet(at))return ok=false;int old=file.read();if(old<0)return ok=false;
    uint8_t mask=0x80>>(x&7);uint8_t value=white?(old|mask):(old&~mask);
    return ok=file.seekSet(at)&&file.write(value)==1;
  }
};


// Opt-in extension: ordinary BxSD programs do not pay for stream state or code.
// State bits: 1 active, 2 rejected operation/count, 4 write/sync failure.
class BxStreamSD : public BxSD {
  uint16_t streamX,streamY;
  uint8_t packed,streamState;
  bool reject(){if(streamState&1)streamState|=2;return ok=false;}
  bool putStreamByte(uint8_t value){
    if(file.write(value)==1)return true;
    streamState|=4;return ok=false;
  }
  bool pushPixel(bool white){
    if(white)packed|=uint8_t(0x80>>(streamX&7));
    ++streamX;
    if(!(streamX&7)||streamX==bmpWidth){if(!putStreamByte(packed))return false;packed=0;}
    if(streamX==bmpWidth){
      uint8_t padding=bmpStride-((bmpWidth+7)/8);
      while(padding--)if(!putStreamByte(0))return false;
      streamX=0;++streamY;
    }
    return true;
  }
 public:
  BxStreamSD(uint8_t pin):BxSD(pin),streamX(0),streamY(0),packed(0),streamState(0){}
  bool bmpStreamCreate(const char* path,uint16_t width,uint16_t height,bool reserve=false){
    if(streamState&1)return reject();
    file.close();bmpWidth=0;
    if(!width||!height||width>32767||height>32767)return ok=false;
    if(sd.exists(path)&&!sd.remove(path))return ok=false;
    file.open(path,O_RDWR|O_CREAT);if(!file)return ok=false;
    uint32_t stride=((uint32_t(width)+31)/32)*4,bytes=stride*height;
    if(reserve&&!file.preAllocate(bytes+62)){file.close();return ok=false;}
    bool success=put16(0x4d42)&&put32(bytes+62)&&put32(0)&&put32(62)&&put32(40)&&put32(width)&&put32(uint32_t(-int32_t(height)))&&put16(1)&&put16(1)&&put32(0)&&put32(bytes)&&put32(2835)&&put32(2835)&&put32(2)&&put32(2)&&put32(0)&&put32(0x00ffffffUL);
    if(!success){file.close();return ok=false;}
    bmpWidth=width;bmpHeight=height;bmpStride=stride;
    streamX=streamY=0;packed=0;streamState=1;return ok=true;
  }
  bool bmpStreamCreate(const String &path,uint16_t width,uint16_t height,bool reserve=false){return bmpStreamCreate(path.c_str(),width,height,reserve);}
  bool bmpAppendPixel(bool white){
    if(streamState!=1||!file||streamY>=bmpHeight)return reject();
    return ok=pushPixel(white);
  }
  bool bmpAppendShade(int16_t shade){if(shade<0||shade>1)return reject();return bmpAppendPixel(shade!=0);}
  bool bmpAppendPacked(uint8_t bits,uint8_t count=1){return bmpAppendBits(bits,count);}
  // Consume the highest count bits, most significant first. Row crossing is OK.
  bool bmpAppendBits(uint8_t bits,uint8_t count=8){
    if(streamState!=1||!file||count<1||count>8||uint32_t(bmpHeight-streamY)*bmpWidth-streamX<count)return reject();
    for(uint8_t i=0;i<count;++i)if(!pushPixel(bits&(0x80>>i)))return false;
    return ok=true;
  }
  // Early finish pads missing pixels black, but returns false to report underfill.
  bool bmpStreamFinish(){
    if(!(streamState&1)||!file)return reject();
    bool complete=streamY==bmpHeight, clean=streamState==1, success=!(streamState&4);
    uint16_t used=(streamX+7)/8;
    if(success&&(streamX&7))success=putStreamByte(packed);
    uint32_t missing=uint32_t(bmpHeight-streamY)*bmpStride-used;
    while(success&&missing--)success=putStreamByte(0);
    if(success)success=file.sync();
    bool closed=file.close();streamState=0;bmpWidth=0;
    return ok=complete&&clean&&success&&closed;
  }
  bool open(const char* path,bool append){return streamState&1?reject():BxSD::open(path,append);}
  bool open(const String &path,bool append){return open(path.c_str(),append);}
  bool seek(uint32_t at){return streamState&1?reject():BxSD::seek(at);}
  template<class T> bool writeValue(T value){return streamState&1?reject():BxSD::writeValue<T>(value);}
  template<class T> T readValue(){if(streamState&1){reject();return T();}return BxSD::readValue<T>();}
  template<class T> void print(const T &value,bool newline){if(streamState&1){reject();return;}BxSD::print(value,newline);}
  int readByte(){if(streamState&1){reject();return -1;}return BxSD::readByte();}
  void flush(){BxSD::flush();if(!ok&&(streamState&1))streamState|=4;}
  void close(){if(streamState&1)bmpStreamFinish();else BxSD::close();}
  bool bmpCreate(const char* path,uint16_t width,uint16_t height){return streamState&1?reject():BxSD::bmpCreate(path,width,height);}
  bool bmpCreate(const String &path,uint16_t width,uint16_t height){return bmpCreate(path.c_str(),width,height);}
  bool bmpShade(uint16_t x,uint16_t y,int16_t shade){return streamState&1?reject():BxSD::bmpShade(x,y,shade);}
  bool bmpPixel(uint16_t x,uint16_t y,bool white){return streamState&1?reject():BxSD::bmpPixel(x,y,white);}
};
