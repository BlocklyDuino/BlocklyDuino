#pragma once
#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>

class Bx24LC256 {
  uint8_t address;
 public:
  bool ok;
  Bx24LC256(uint8_t a):address(a),ok(false){}
  bool begin(){Wire.begin();Wire.beginTransmission(address);return ok=(Wire.endTransmission()==0);}
  uint8_t readByte(uint32_t at){
    if(at>=32768UL){ok=false;return 0;}
    Wire.beginTransmission(address);Wire.write(uint8_t(at>>8));Wire.write(uint8_t(at));
    if(Wire.endTransmission()!=0){ok=false;return 0;}
    if(Wire.requestFrom(address,uint8_t(1))!=1){ok=false;return 0;}
    ok=true;return Wire.read();
  }
  bool writeByte(uint32_t at,uint8_t value){
    if(at>=32768UL)return ok=false;
    uint8_t old=readByte(at);if(!ok)return false;if(old==value)return true;
    Wire.beginTransmission(address);Wire.write(uint8_t(at>>8));Wire.write(uint8_t(at));Wire.write(value);
    if(Wire.endTransmission()!=0)return ok=false;
    unsigned long start=millis();
    do{Wire.beginTransmission(address);if(Wire.endTransmission()==0){uint8_t check=readByte(at);return ok=(ok&&check==value);}delay(1);}while(millis()-start<20);
    return ok=false;
  }
};

template<bool Flash> class BxSpiMemory {
  uint8_t cs;
  void select(){SPI.beginTransaction(SPISettings(1000000,MSBFIRST,SPI_MODE0));digitalWrite(cs,LOW);}
  void release(){digitalWrite(cs,HIGH);SPI.endTransaction();}
  void address(uint32_t at){if(Flash)SPI.transfer(uint8_t(at>>16));SPI.transfer(uint8_t(at>>8));SPI.transfer(uint8_t(at));}
  void enableWrite(){select();SPI.transfer(6);release();}
  bool ready(uint16_t timeout){unsigned long t=millis();do{select();SPI.transfer(5);uint8_t s=SPI.transfer(0xff);release();if(!(s&1))return true;}while(millis()-t<timeout);return false;}
 public:
  bool ok;
  BxSpiMemory(uint8_t pin):cs(pin),ok(false){}
  bool begin(){pinMode(cs,OUTPUT);digitalWrite(cs,HIGH);SPI.begin();
    if(!ready(2000))return ok=false;
    if(Flash){select();SPI.transfer(0x9f);uint8_t vendor=SPI.transfer(0xff);SPI.transfer(0xff);uint8_t capacity=SPI.transfer(0xff);release();return ok=(vendor==0xef&&capacity==0x16);}
    return ok=true;
  }
  uint8_t readByte(uint32_t at){if(at>=(Flash?4194304UL:32768UL)||!ready(2000)){ok=false;return 0;}select();SPI.transfer(3);address(at);uint8_t value=SPI.transfer(0xff);release();ok=true;return value;}
  bool writeByte(uint32_t at,uint8_t value){
    uint8_t old=readByte(at);if(!ok)return false;if(old==value)return true;
    if(Flash&&((old&value)!=value))return ok=false;
    enableWrite();select();SPI.transfer(2);address(at);SPI.transfer(value);release();
    if(!ready(2000))return ok=false;
    uint8_t check=readByte(at);return ok=(ok&&check==value);
  }
  bool eraseSector(uint32_t at){
    if(!Flash||at>=4194304UL||!ready(2000))return ok=false;
    enableWrite();select();SPI.transfer(0x20);address(at&~4095UL);release();return ok=ready(3000);
  }
};
typedef BxSpiMemory<false> Bx25LC256;
typedef BxSpiMemory<true> BxW25Q32;

template<class T,class D> T bxRead(D &device,uint32_t at){T value={};uint8_t* p=(uint8_t*)&value;for(uint8_t i=0;i<sizeof(T);++i){p[i]=device.readByte(at+i);if(!device.ok)return T();}return value;}
template<class T,class D> bool bxWrite(D &device,uint32_t at,T value){const uint8_t* p=(const uint8_t*)&value;for(uint8_t i=0;i<sizeof(T);++i)if(!device.writeByte(at+i,p[i]))return false;return true;}
template<class D> bool bxWriteText(D &device,uint32_t at,const char* text){while(*text){if(!device.writeByte(at++,uint8_t(*text++)))return false;}return device.writeByte(at,0);}
template<class D> bool bxWriteText(D &device,uint32_t at,const String &text){return bxWriteText(device,at,text.c_str());}
template<class D> void bxStreamText(D &device,uint32_t at,uint16_t limit,Print &out){while(limit--){uint8_t c=device.readByte(at++);if(!device.ok||!c)return;out.write(c);}}
template<class D> String bxReadText(D &device,uint32_t at,uint16_t limit){String text;while(limit--){uint8_t c=device.readByte(at++);if(!device.ok||!c)break;if(!text.concat(char(c))){device.ok=false;break;}}return text;}
