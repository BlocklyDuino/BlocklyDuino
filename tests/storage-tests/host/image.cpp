#include "BlocklyImage.h"
#include <cassert>
#include <cstdio>
#include <cstring>
#include <limits>
uint16_t sample(unsigned x,unsigned y,unsigned channel,uint32_t levels){if(x==0)return 0;if(x==1)return levels-1;if(x==2)return levels>256?256:levels-1;return (x*701UL+y*211UL+channel*113UL)%levels;}
int main(){
 uint32_t counts[]={2,3,16,256,257,1024,65536};
 for(uint8_t format=0;format<4;++format)for(unsigned k=0;k<sizeof(counts)/sizeof(counts[0]);++k){
  uint32_t levels=counts[k];if(format<2&&levels>256)continue;
  for(uint8_t coord=0;coord<2;++coord){
   BxImageSD card(10);assert(card.begin());char path[120];sprintf(path,".test-build/images/image_%u_%lu_%u.%s",format,(unsigned long)levels,coord,format<2?"bmp":(format==2?"pgm":"ppm"));
   mockSeeks=mockReads=0;assert(card.imageCreate(path,13,7,format,levels,true,coord));
   for(unsigned y=0;y<7;++y)for(unsigned x=0;x<13;++x){
    if(format==0||format==2){int32_t s=sample(x,y,0,levels);assert(coord?card.grayPixel(x,y,s):card.appendGray(s));}
    else{int32_t r=sample(x,y,0,levels),g=sample(x,y,1,levels),b=sample(x,y,2,levels);assert(coord?card.rgbPixel(x,y,r,g,b):card.appendRGB(r,g,b));}
   }
   assert(card.imageFinish());if(!coord)assert(!mockSeeks&&!mockReads);
  }
 }
 BxImageSD card(10);assert(card.begin());
 assert(card.imageCreate(".test-build/images/rgb_short.bmp",5,3,BxImageSD::BMP_RGB,256));assert(card.appendRGB(255,0,0));assert(!card.imageFinish());
 assert(card.imageCreate(".test-build/images/rgb_over.ppm",1,1,BxImageSD::PPM_RGB,65536));assert(card.appendRGB(65535,256,1));assert(!card.appendRGB(0,0,0));assert(!card.imageFinish());
 assert(card.imageCreate(".test-build/images/rgb_invalid.ppm",1,1,BxImageSD::PPM_RGB,65536));assert(!card.appendRGB(65536,0,0));assert(!card.imageFinish());
 assert(card.imageCreate(".test-build/images/gray_invalid.pgm",1,1,BxImageSD::PGM_GRAY,1024));assert(!card.appendGray(-1));assert(!card.imageFinish());
 assert(card.imageCreate(".test-build/images/wrong_type.ppm",1,1,BxImageSD::PPM_RGB,1024));assert(!card.appendGray(1));assert(!card.imageFinish());
 assert(card.imageCreate(".test-build/images/image_guard.pgm",1,1,BxImageSD::PGM_GRAY,1024));assert(!card.open(".test-build/images/must_not_open.bin",true));assert(!card.imageFinish());
 const char* sentinel=".test-build/images/image_sentinel.bin";FILE* f=fopen(sentinel,"wb");fputs("KEEP",f);fclose(f);
 assert(!card.imageCreate(sentinel,-1024,1,BxImageSD::PGM_GRAY,256));
 assert(!card.imageCreate(sentinel,1.5,1,BxImageSD::PGM_GRAY,256));
 assert(!card.imageCreate(sentinel,1,1,BxImageSD::BMP_RGB,1024));
 assert(!card.imageCreate(sentinel,1,1,BxImageSD::PGM_GRAY,65537));
 assert(!card.imageCreate(sentinel,0xffffffffUL,1,BxImageSD::PGM_GRAY,256));
 assert(!card.imageCreate(sentinel,0x80000000UL,1,BxImageSD::BMP_GRAY,2));
 assert(!card.imageCreate(sentinel,0x60000000UL,1,BxImageSD::BMP_RGB,256));
 assert(!card.imageCreate(sentinel,65536UL,65536UL,BxImageSD::PGM_GRAY,256));
 char kept[5]={};f=fopen(sentinel,"rb");assert(fread(kept,1,4,f)==4);fclose(f);assert(!strcmp(kept,"KEEP"));
 assert(!card.imageCreate(sentinel,2,1,BxImageSD::PGM_GRAY,1024.5));
 assert(!card.imageCreate(sentinel,std::numeric_limits<float>::quiet_NaN(),1,BxImageSD::PGM_GRAY,1024));
 assert(card.imageCreate(".test-build/images/fraction_sample.pgm",1,1,BxImageSD::PGM_GRAY,1024));assert(!card.appendGray(1.5));assert(!card.imageFinish());
 assert(card.imageCreate(".test-build/images/fraction_rgb.ppm",1,1,BxImageSD::PPM_RGB,1024));assert(!card.appendRGB(1,2.25,3));assert(!card.imageFinish());
 assert(card.imageCreate(".test-build/images/fraction_coord.pgm",2,1,BxImageSD::PGM_GRAY,1024,false,true));assert(!card.grayPixel(0.5,0,2));assert(!card.imageFinish());
 assert(card.imageCreate(".test-build/images/nan_sample.pgm",1,1,BxImageSD::PGM_GRAY,1024));assert(!card.appendGray(std::numeric_limits<float>::quiet_NaN()));assert(!card.imageFinish());
 // Old APIs on the new class still work.
 assert(card.bmpStreamCreate(".test-build/images/image_legacy.bmp",5,1,false,16));assert(card.bmpAppendPacked(0xaf,2));assert(card.bmpAppendBits(0xa0,3));assert(card.bmpStreamFinish());
}
