#pragma once
#include <BlocklySD.h>

// No framebuffer: packed BMP pixel byte or one PGM/PPM sample, plus SD's cache.
class BxImageSD : public BxSD {
  uint32_t width_,height_,stride_,rowBytes_,maxValue_,x_,y_;
  uint16_t offset_;
  uint8_t format_,bpp_,sampleBytes_,packed_,state_;
  enum { STREAM=1, BAD=2, IO=4, COORD=8 };
  static bool multiply(uint32_t a,uint32_t b,uint32_t &out){if(b&&a>0xffffffffUL/b)return false;out=a*b;return true;}
  static uint8_t digits(uint32_t v){uint8_t n=1;while(v>=10){v/=10;++n;}return n;}
  bool reject(){if(state_&(STREAM|COORD))state_|=BAD;return ok=false;}
  bool put(uint8_t v){if(file.write(v)==1)return true;if(state_&(STREAM|COORD))state_|=IO;return ok=false;}
  bool decimal(uint32_t v){char text[10];uint8_t n=0;do{text[n++]=char('0'+v%10);v/=10;}while(v);while(n)if(!put(text[--n]))return false;return true;}
  bool grayFormat()const{return format_==BMP_GRAY||format_==PGM_GRAY;}
  template<class S> bool sampleValue(S input,uint16_t &out)const{if(!(input>=0&&input<=maxValue_))return false;uint16_t v=uint16_t(input);if(input!=v)return false;out=v;return true;}
  template<class C> bool coordinateValue(C input,uint32_t limit,uint32_t &out)const{if(!(input>=0&&input<limit))return false;uint32_t v=uint32_t(input);if(input!=v)return false;out=v;return true;}
  uint8_t perByte()const{return 8/bpp_;}
  uint8_t mask()const{return 0xff>>(8-bpp_);}
  bool rawSample(uint16_t v){return (sampleBytes_!=2||put(uint8_t(v>>8)))&&put(uint8_t(v));}
  bool rawRGB(uint16_t r,uint16_t g,uint16_t b){
    if(format_==BMP_RGB)return put(uint32_t(b)*255/maxValue_)&&put(uint32_t(g)*255/maxValue_)&&put(uint32_t(r)*255/maxValue_);
    return rawSample(r)&&rawSample(g)&&rawSample(b);
  }
  bool endPixel(){
    if(++x_==width_){
      uint8_t padding=stride_-rowBytes_;while(padding--)if(!put(0))return false;
      x_=0;++y_;
    }
    return true;
  }
  bool pushGray(uint16_t v){
    if(format_==BMP_GRAY){
      uint8_t per=perByte();packed_|=uint8_t(v<<(8-bpp_-(x_%per)*bpp_));
      if((x_+1)%per==0||x_+1==width_){if(!put(packed_))return false;packed_=0;}
    }else if(!rawSample(v))return false;
    return endPixel();
  }
  bool canAppend(){return state_==STREAM&&file&&y_<height_;}
  bool available(uint8_t count)const{
    if(y_>=height_)return false;
    uint32_t left=width_-x_;if(left>=count)return true;
    uint32_t rows=height_-y_-1;
    uint32_t need=uint32_t(count)-left;return rows&&(rows>=need||width_>=need||rows*width_>=need);
  }
  bool create(const char* path,uint32_t width,uint32_t height,uint8_t format,uint32_t levels,bool reserve,bool prefill){
    if(state_&(STREAM|COORD))return reject();
    if(!width||!height||format>PPM_RGB||levels<2||levels>(format<=BMP_RGB?256UL:65536UL))return ok=false;
    if(format<=BMP_RGB&&(width>0x7fffffffUL||height>0x7fffffffUL))return ok=false;
    uint8_t bpp=format==BMP_GRAY?(levels<=2?1:(levels<=16?4:8)):(format==BMP_RGB?24:(levels<=256?8:16));
    uint8_t sampleBytes=levels<=256?1:2;
    uint32_t rowBytes,stride,bytes;
    if(format==BMP_GRAY){uint8_t per=8/bpp;rowBytes=width/per+(width%per!=0);}
    else if(!multiply(width,format==BMP_RGB?3:(format==PPM_RGB?3:1)*sampleBytes,rowBytes))return ok=false;
    if(format<=BMP_RGB){if(rowBytes>0xfffffffcUL)return ok=false;stride=(rowBytes+3)&~3UL;}else stride=rowBytes;
    uint16_t offset=format==BMP_GRAY?54+4*levels:(format==BMP_RGB?54:6+digits(width)+digits(height)+digits(levels-1));
    if(!multiply(stride,height,bytes)||bytes>0xffffffffUL-offset)return ok=false;
    // All range, overflow and format checks precede closing/deleting existing data.
    file.close();bmpWidth=0;
    if(sd.exists(path)&&!sd.remove(path))return ok=false;
    file.open(path,O_RDWR|O_CREAT);if(!file)return ok=false;
    if(reserve&&!file.preAllocate(bytes+offset)){file.close();return ok=false;}
    bool success;
    if(format<=BMP_RGB){
      uint32_t colors=format==BMP_GRAY?levels:0;
      success=put16(0x4d42)&&put32(bytes+offset)&&put32(0)&&put32(offset)&&put32(40)&&put32(width)&&put32(uint32_t(-int32_t(height)))&&put16(1)&&put16(bpp)&&put32(0)&&put32(bytes)&&put32(2835)&&put32(2835)&&put32(colors)&&put32(colors);
      if(format==BMP_GRAY)for(uint16_t i=0;success&&i<levels;++i){uint8_t gray=uint16_t(i*uint16_t(255))/(levels-1);success=put(gray)&&put(gray)&&put(gray)&&put(0);}
    }else success=put('P')&&put(format==PGM_GRAY?'5':'6')&&put('\n')&&decimal(width)&&put(' ')&&decimal(height)&&put('\n')&&decimal(levels-1)&&put('\n');
    if(prefill)for(uint32_t i=0;success&&i<bytes;++i)success=put(0);
    if(!success){file.close();return ok=false;}
    width_=width;height_=height;stride_=stride;rowBytes_=rowBytes;maxValue_=levels-1;offset_=offset;format_=format;bpp_=bpp;sampleBytes_=sampleBytes;
    x_=y_=0;packed_=0;state_=prefill?COORD:STREAM;
    return ok=prefill?file.sync():true;
  }
 public:
  enum Format { BMP_GRAY=0, BMP_RGB=1, PGM_GRAY=2, PPM_RGB=3 };
  BxImageSD(uint8_t pin):BxSD(pin),width_(0),height_(0),stride_(0),rowBytes_(0),maxValue_(1),x_(0),y_(0),offset_(0),format_(BMP_GRAY),bpp_(1),sampleBytes_(1),packed_(0),state_(0){}
  // Preserve signed caller values until validation; no negative-to-unsigned wrap.
  template<class W,class H,class L> bool imageCreate(const char* path,W width,H height,uint8_t format,L levels,bool reserve=false,bool prefill=false){
    if(!(width>0&&height>0)||width>=0xffffffffUL||height>=0xffffffffUL||!(levels>=2&&levels<=(format<=BMP_RGB?256UL:65536UL)))return reject();
    uint32_t w=uint32_t(width),h=uint32_t(height),count=uint32_t(levels);if(width!=w||height!=h||levels!=count)return reject();
    return create(path,w,h,format,count,reserve,prefill);
  }
  template<class W,class H,class L> bool imageCreate(const String &path,W width,H height,uint8_t format,L levels,bool reserve=false,bool prefill=false){return imageCreate(path.c_str(),width,height,format,levels,reserve,prefill);}
  template<class S> bool appendGray(S shade){uint16_t s;if(!canAppend()||!grayFormat()||!sampleValue(shade,s))return reject();return ok=pushGray(s);}
  template<class R,class G,class B> bool appendRGB(R red,G green,B blue){
    uint16_t r,g,b;if(!canAppend()||grayFormat()||!sampleValue(red,r)||!sampleValue(green,g)||!sampleValue(blue,b))return reject();
    return ok=rawRGB(r,g,b)&&endPixel();
  }
  template<class X,class Y,class S> bool grayPixel(X inputX,Y inputY,S shade){
    uint32_t x,y;uint16_t sample;if(state_!=COORD||!file||!grayFormat()||!coordinateValue(inputX,width_,x)||!coordinateValue(inputY,height_,y)||!sampleValue(shade,sample))return reject();
    if(format_==PGM_GRAY){if(!file.seekSet(offset_+y*stride_+x*sampleBytes_))return reject();return ok=rawSample(sample);}
    uint8_t per=perByte(),shift=8-bpp_-(x%per)*bpp_,m=mask()<<shift;
    uint32_t at=offset_+y*stride_+x/per;
    if(!file.seekSet(at))return reject();uint8_t v=sample;
    if(bpp_!=8){int old=file.read();if(old<0||!file.seekSet(at))return reject();v=(uint8_t(old)&~m)|(uint8_t(sample)<<shift);}
    return ok=put(v);
  }
  template<class X,class Y,class R,class G,class B> bool rgbPixel(X inputX,Y inputY,R red,G green,B blue){
    uint32_t x,y;uint16_t r,g,b;if(state_!=COORD||!file||grayFormat()||!coordinateValue(inputX,width_,x)||!coordinateValue(inputY,height_,y)||!sampleValue(red,r)||!sampleValue(green,g)||!sampleValue(blue,b))return reject();
    if(!file.seekSet(offset_+y*stride_+x*(format_==BMP_RGB?3:3*sampleBytes_)))return reject();
    return ok=rawRGB(r,g,b);
  }
  bool imageFinish(){
    if(!(state_&(STREAM|COORD))||!file)return reject();
    bool complete=(state_&COORD)||y_==height_,clean=!(state_&(BAD|IO)),success=!(state_&IO);
    if(state_&STREAM){
      uint32_t used;
      if(format_==BMP_GRAY){uint8_t per=perByte();used=x_/per+(x_%per!=0);if(success&&(x_%per))success=put(packed_);}
      else used=x_*(format_==BMP_RGB?3:(grayFormat()?1:3)*sampleBytes_);
      uint32_t missing=(height_-y_)*stride_-used;
      while(success&&missing--)success=put(0);
    }
    if(success)success=file.sync();bool closed=file.close();state_=0;
    return ok=complete&&clean&&success&&closed;
  }
  bool open(const char* path,bool append){return state_&(STREAM|COORD)?reject():BxSD::open(path,append);}
  bool open(const String &path,bool append){return open(path.c_str(),append);}
  bool seek(uint32_t at){return state_&(STREAM|COORD)?reject():BxSD::seek(at);}
  template<class T> bool writeValue(T value){return state_&(STREAM|COORD)?reject():BxSD::writeValue<T>(value);}
  template<class T> T readValue(){if(state_&(STREAM|COORD)){reject();return T();}return BxSD::readValue<T>();}
  template<class T> void print(const T &value,bool newline){if(state_&(STREAM|COORD)){reject();return;}BxSD::print(value,newline);}
  int readByte(){if(state_&(STREAM|COORD)){reject();return -1;}return BxSD::readByte();}
  void flush(){BxSD::flush();if(!ok&&(state_&(STREAM|COORD)))state_|=IO;}
  void close(){if(state_&(STREAM|COORD))imageFinish();else BxSD::close();}
  // Compatibility for existing BMP blocks when the same card also uses new images.
  bool bmpCreate(const char* p,uint16_t w,uint16_t h,uint16_t levels=2){return imageCreate(p,w,h,BMP_GRAY,levels,false,true);}
  bool bmpCreate(const String &p,uint16_t w,uint16_t h,uint16_t levels=2){return bmpCreate(p.c_str(),w,h,levels);}
  bool bmpStreamCreate(const char* p,uint16_t w,uint16_t h,bool reserve=false,uint16_t levels=2){return imageCreate(p,w,h,BMP_GRAY,levels,reserve,false);}
  bool bmpStreamCreate(const String &p,uint16_t w,uint16_t h,bool reserve=false,uint16_t levels=2){return bmpStreamCreate(p.c_str(),w,h,reserve,levels);}
  bool bmpShade(uint16_t x,uint16_t y,int32_t shade){return grayPixel(x,y,shade);}
  bool bmpPixel(uint16_t x,uint16_t y,bool white){return grayPixel(x,y,white?maxValue_:0);}
  bool bmpAppendShade(int32_t shade){return appendGray(shade);}
  bool bmpAppendPixel(bool white){return appendGray(white?maxValue_:0);}
  bool bmpAppendPacked(uint8_t value,uint8_t count=1){
    if(!canAppend()||format_!=BMP_GRAY||!count||count>perByte()||!available(count))return reject();
    for(uint8_t i=0;i<count;++i)if(((value>>(8-bpp_-i*bpp_))&mask())>maxValue_)return reject();
    for(uint8_t i=0;i<count;++i)if(!pushGray((value>>(8-bpp_-i*bpp_))&mask()))return false;
    return ok=true;
  }
  bool bmpAppendBits(uint8_t value,uint8_t count=8){
    if(!canAppend()||!grayFormat()||!count||count>8||!available(count))return reject();
    for(uint8_t i=0;i<count;++i)if(!pushGray(value&(0x80>>i)?maxValue_:0))return false;
    return ok=true;
  }
  bool bmpStreamFinish(){return imageFinish();}
};
