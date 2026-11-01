#pragma once
#include <BlocklySD.h>

// Runtime 2..256 shades. Palette bytes go straight to SD; no palette/frame buffer.
class BxGraySD : public BxSD {
  uint16_t levels,pixelOffset,streamX,streamY;
  uint8_t bpp,packed,streamState;
  bool reject(){if(streamState&1)streamState|=2;return ok=false;}
  uint8_t pixelsPerByte()const{return 8/bpp;}
  uint8_t shadeMask()const{return 0xff>>(8-bpp);}
  bool putByte(uint8_t v){if(file.write(v)==1)return true;if(streamState&1)streamState|=4;return ok=false;}
  bool create(const char* path,uint16_t width,uint16_t height,uint16_t grayLevels,bool reserve,bool prefill){
    if(streamState&1)return reject();
    file.close();bmpWidth=0;
    if(!width||!height||width>32767||height>32767||grayLevels<2||grayLevels>256)return ok=false;
    if(sd.exists(path)&&!sd.remove(path))return ok=false;
    file.open(path,O_RDWR|O_CREAT);if(!file)return ok=false;
    bpp=grayLevels<=2?1:(grayLevels<=16?4:8);levels=grayLevels;pixelOffset=54+4*levels;
    uint32_t stride=((uint32_t(width)*bpp+31)/32)*4,bytes=stride*height;
    if(reserve&&!file.preAllocate(bytes+pixelOffset)){file.close();return ok=false;}
    bool success=put16(0x4d42)&&put32(bytes+pixelOffset)&&put32(0)&&put32(pixelOffset)&&put32(40)&&put32(width)&&put32(uint32_t(-int32_t(height)))&&put16(1)&&put16(bpp)&&put32(0)&&put32(bytes)&&put32(2835)&&put32(2835)&&put32(levels)&&put32(levels);
    for(uint16_t i=0;success&&i<levels;++i){
      uint8_t gray=uint16_t(i*uint16_t(255))/(levels-1);
      success=putByte(gray)&&putByte(gray)&&putByte(gray)&&putByte(0);
    }
    if(prefill)for(uint32_t i=0;success&&i<bytes;++i)success=putByte(0);
    if(!success){file.close();return ok=false;}
    bmpWidth=width;bmpHeight=height;bmpStride=stride;
    streamX=streamY=0;packed=0;streamState=prefill?0:1;
    return ok=prefill?file.sync():true;
  }
  bool pushShade(uint8_t shade){
    uint8_t per=pixelsPerByte();
    packed|=uint8_t(shade<<(8-bpp-(streamX%per)*bpp));
    ++streamX;
    if(!(streamX%per)||streamX==bmpWidth){if(!putByte(packed))return false;packed=0;}
    if(streamX==bmpWidth){
      uint8_t padding=bmpStride-((bmpWidth+per-1)/per);
      while(padding--)if(!putByte(0))return false;
      streamX=0;++streamY;
    }
    return true;
  }
 public:
  BxGraySD(uint8_t pin):BxSD(pin),levels(2),pixelOffset(62),streamX(0),streamY(0),bpp(1),packed(0),streamState(0){}
  bool bmpCreate(const char* path,uint16_t width,uint16_t height,uint16_t grayLevels=2){return create(path,width,height,grayLevels,false,true);}
  bool bmpCreate(const String &path,uint16_t width,uint16_t height,uint16_t grayLevels=2){return bmpCreate(path.c_str(),width,height,grayLevels);}
  bool bmpStreamCreate(const char* path,uint16_t width,uint16_t height,bool reserve=false,uint16_t grayLevels=2){return create(path,width,height,grayLevels,reserve,false);}
  bool bmpStreamCreate(const String &path,uint16_t width,uint16_t height,bool reserve=false,uint16_t grayLevels=2){return bmpStreamCreate(path.c_str(),width,height,reserve,grayLevels);}
  bool bmpShade(uint16_t x,uint16_t y,int16_t shade){
    if(streamState&1)return reject();
    if(!file||!bmpWidth||x>=bmpWidth||y>=bmpHeight||shade<0||uint16_t(shade)>=levels)return ok=false;
    uint8_t per=pixelsPerByte(),shift=8-bpp-(x%per)*bpp,mask=shadeMask()<<shift;
    uint32_t at=pixelOffset+uint32_t(y)*bmpStride+x/per;
    if(!file.seekSet(at))return ok=false;
    uint8_t result=shade;
    if(bpp!=8){int old=file.read();if(old<0||!file.seekSet(at))return ok=false;result=(uint8_t(old)&~mask)|(uint8_t(shade)<<shift);}
    return ok=putByte(result);
  }
  bool bmpPixel(uint16_t x,uint16_t y,bool white){return bmpShade(x,y,white?levels-1:0);}
  bool bmpAppendShade(int16_t shade){
    if(streamState!=1||!file||streamY>=bmpHeight||shade<0||uint16_t(shade)>=levels)return reject();
    return ok=pushShade(shade);
  }
  bool bmpAppendPixel(bool white){return bmpAppendShade(white?levels-1:0);}
  // Highest count packed pixels. 1-bit:1..8, 4-bit:1..2, 8-bit:1 pixel/byte.
  bool bmpAppendPacked(uint8_t value,uint8_t count=1){
    if(streamState!=1||!file||count<1||count>pixelsPerByte()||uint32_t(bmpHeight-streamY)*bmpWidth-streamX<count)return reject();
    for(uint8_t i=0;i<count;++i)if(((value>>(8-bpp-i*bpp))&shadeMask())>=levels)return reject();
    for(uint8_t i=0;i<count;++i)if(!pushShade((value>>(8-bpp-i*bpp))&shadeMask()))return false;
    return ok=true;
  }
  // Legacy bit groups keep their black/white meaning even in a grayscale file.
  bool bmpAppendBits(uint8_t value,uint8_t count=8){
    if(streamState!=1||!file||count<1||count>8||uint32_t(bmpHeight-streamY)*bmpWidth-streamX<count)return reject();
    for(uint8_t i=0;i<count;++i)if(!pushShade(value&(0x80>>i)?levels-1:0))return false;
    return ok=true;
  }
  bool bmpStreamFinish(){
    if(!(streamState&1)||!file)return reject();
    bool complete=streamY==bmpHeight,clean=streamState==1,success=!(streamState&4);
    uint8_t per=pixelsPerByte();uint16_t used=(streamX+per-1)/per;
    if(success&&(streamX%per))success=putByte(packed);
    uint32_t missing=uint32_t(bmpHeight-streamY)*bmpStride-used;
    while(success&&missing--)success=putByte(0);
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
};
