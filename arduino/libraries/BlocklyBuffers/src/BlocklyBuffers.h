// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <Arduino.h>
// Rows first by default, or xFirst for [column][row]. No whole-buffer copy.
template<class D, class T, size_t N, size_t M>
void bxLcdBuffer(D &d, const T (&b)[N][M], bool xFirst, uint16_t columns, uint16_t rows, bool zeroIsSpace=true) {
  const size_t width=xFirst?N:M, height=xFirst?M:N;
  for(size_t y=0;y<height && y<rows;++y){d.setCursor(0,y);
    for(size_t x=0;x<width && x<columns;++x){uint8_t c=xFirst?b[x][y]:b[y][x];d.write(zeroIsSpace&&!c?uint8_t(' '):c);}}
}
// HD44780 CGRAM: eight 5x8 glyphs; bit 4 is the leftmost dot in each row.
// Copy just eight bytes, since common LCD libraries require a mutable array.
template<class D, class T, size_t N>
bool bxLcdCreateGlyph(D &d, long slot, const T (&rows)[N]) {
  static_assert(N==8,"LCD glyph needs exactly eight rows");
  if(slot<0 || slot>7)return false;
  uint8_t glyph[8];for(uint8_t i=0;i<8;++i)glyph[i]=uint8_t(rows[i])&31;
  d.createChar(uint8_t(slot),glyph);return true;
}
template<class D>
bool bxLcdShowGlyph(D &d,long slot,long column,long row,uint16_t columns,uint16_t rows) {
  if(slot<0 || slot>7 || column<0 || row<0 || column>=columns || row>=rows)return false;
  d.setCursor(uint8_t(column),uint8_t(row));d.write(uint8_t(slot));return true;
}
// Packed format: each byte is a vertical column of eight pixels, bit 0 at top.
// Only one 8-byte tile is temporary; U8x8 sends it directly to display RAM.
template<class D, class T, size_t N, size_t M>
void bxOledBuffer(D &d, const T (&b)[N][M], bool xFirst, bool packed) {
  const size_t width=xFirst?N:M, units=xFirst?M:N;
  const size_t height=packed?units*8:units;
  for(size_t page=0;page<(height+7)/8 && page<d.getRows();++page)
    for(size_t tileX=0;tileX<(width+7)/8 && tileX<d.getCols();++tileX){
      uint8_t tile[8]={0};
      for(uint8_t dx=0;dx<8;++dx){size_t x=tileX*8+dx;if(x>=width)break;
        if(packed)tile[dx]=uint8_t(xFirst?b[x][page]:b[page][x]);
        else for(uint8_t bit=0;bit<8;++bit){size_t y=page*8+bit;if(y<height && (xFirst?b[x][y]:b[y][x]))tile[dx]|=uint8_t(1<<bit);}
      }
      d.drawTile(tileX,page,1,tile);
    }
}
template<class D, class T, size_t N, size_t M>
void bxTftBuffer(D &d, const T (&b)[N][M], bool xFirst) {
  const size_t width=xFirst?N:M,height=xFirst?M:N;
  d.startWrite();
  for(size_t y=0;y<height && y<size_t(d.height());++y)
    for(size_t x=0;x<width && x<size_t(d.width());++x)d.writePixel(x,y,uint16_t(xFirst?b[x][y]:b[y][x]));
  d.endWrite();
}
template<class D,class T,size_t N> void bxPixelsBuffer(D &d,const T (&b)[N]) {
  for(size_t i=0;i<N && i<d.numPixels();++i)d.setPixelColor(i,uint32_t(b[i]));d.show();
}
template<class D,class T,size_t N> void bxPixelsBuffer(D &d,const T (&b)[N][3]) {
  for(size_t i=0;i<N && i<d.numPixels();++i)d.setPixelColor(i,uint8_t(b[i][0]),uint8_t(b[i][1]),uint8_t(b[i][2]));d.show();
}
