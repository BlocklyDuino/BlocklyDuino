#include <cassert>
#include <vector>
#include <array>
#include <iostream>
#include <BlocklyBuffers.h>
struct LCD {int x=0,y=0,creates=0;char image[4][20]={};uint8_t glyphs[8][8]={};void setCursor(int c,int r){x=c;y=r;}void write(uint8_t c){assert(x<20&&y<4);image[y][x++]=c;}void createChar(uint8_t slot,uint8_t *rows){++creates;for(int i=0;i<8;++i)glyphs[slot][i]=rows[i];}};
struct OLED {uint8_t image[4][128]={};int calls=0;uint8_t getRows(){return 4;}uint8_t getCols(){return 16;}void drawTile(int x,int y,int count,uint8_t *data){assert(count==1&&x<16&&y<4);++calls;for(int i=0;i<8;++i)image[y][x*8+i]=data[i];}};
struct TFT {uint16_t image[10][10]={};int starts=0,ends=0;int height(){return 10;}int width(){return 10;}void startWrite(){++starts;}void endWrite(){++ends;}void writePixel(int x,int y,uint16_t c){assert(x<10&&y<10);image[y][x]=c;}};
struct Pixels {uint32_t values[3]={};int shows=0;uint16_t numPixels(){return 3;}void setPixelColor(int i,uint32_t c){assert(i<3);values[i]=c;}void setPixelColor(int i,uint8_t r,uint8_t g,uint8_t b){setPixelColor(i,(uint32_t(r)<<16)|(uint32_t(g)<<8)|b);}void show(){++shows;}};
int main(){
 LCD lcd;char rows[4][20]={};rows[3][19]='Z';bxLcdBuffer(lcd,rows,false,20,4);assert(lcd.image[3][19]=='Z'&&lcd.image[0][0]==' ');
 char columns[20][4]={};columns[2][1]='Q';bxLcdBuffer(lcd,columns,true,20,4);assert(lcd.image[1][2]=='Q');
 uint8_t glyph[8]={0,4,10,17,31,255,0,0};assert(bxLcdCreateGlyph(lcd,0,glyph));assert(lcd.glyphs[0][3]==17&&lcd.glyphs[0][5]==31&&glyph[5]==255);assert(!bxLcdCreateGlyph(lcd,-1,glyph)&&!bxLcdCreateGlyph(lcd,8,glyph)&&!bxLcdCreateGlyph(lcd,256,glyph)&&lcd.creates==1);
 assert(bxLcdShowGlyph(lcd,0,19,3,20,4)&&lcd.image[3][19]==0);assert(!bxLcdShowGlyph(lcd,0,20,0,20,4)&&!bxLcdShowGlyph(lcd,8,0,0,20,4));
 uint8_t codes[1][8]={0,1,2,3,4,5,6,7};bxLcdBuffer(lcd,codes,false,20,4,false);for(int i=0;i<8;++i)assert(lcd.image[0][i]==i);
 OLED oled;uint8_t bytes[9][10]={};bytes[0][0]=1;bytes[7][1]=255;bytes[8][9]=1;bxOledBuffer(oled,bytes,false,false);assert(oled.calls==4&&oled.image[0][0]==1&&oled.image[0][1]==128&&oled.image[1][9]==1&&oled.image[1][15]==0);
 uint8_t packed[4][128]={};packed[3][127]=165;bxOledBuffer(oled,packed,false,true);assert(oled.image[3][127]==165&&oled.image[0][0]==0);
 uint8_t colPacked[128][4]={};colPacked[126][2]=42;bxOledBuffer(oled,colPacked,true,true);assert(oled.image[2][126]==42);
 uint8_t huge[40][144]={};huge[31][127]=1;bxOledBuffer(oled,huge,false,false);assert(oled.image[3][127]==128); // clips safely
 TFT tft;uint16_t rgb[12][12]={};rgb[4][5]=0xF800;bxTftBuffer(tft,rgb,false);assert(tft.image[4][5]==0xF800&&tft.starts==1&&tft.ends==1);
 Pixels pixels;uint32_t colours[4]={0x123456,0xff0000,0x55,0xFFFFFF};bxPixelsBuffer(pixels,colours);assert(pixels.values[0]==0x123456&&pixels.values[2]==0x55&&pixels.shows==1);
 uint8_t channels[3][3]={{1,2,3},{4,5,6},{7,8,9}};bxPixelsBuffer(pixels,channels);assert(pixels.values[2]==0x070809&&pixels.shows==2);
 std::cout<<"PASS buffers, LCD eight glyph slots/raw codes/legacy zero padding, clipping and one NeoPixel show\n";
}
