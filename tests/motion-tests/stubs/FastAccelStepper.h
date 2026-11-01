#pragma once
#include <stdint.h>
enum class MoveResultCode:int8_t {OK=0};
class FastAccelStepper {
 public:
  uint32_t rate=0,limit=50000;int32_t accel=0,pos=0,destination=0;int updates=0,stops=0,direction=0,applies=0;
  void setDirectionPin(uint8_t,bool,uint16_t){}
  uint32_t getMaxSpeedInHz(){return limit;}
  int8_t setSpeedInMilliHz(uint32_t r){if(r<4||r>limit*1000)return -1;rate=r;++updates;return 0;}
  int8_t setAcceleration(int32_t a){if(a<=0)return -1;accel=a;return 0;}
  void stopMove(){++stops;}
  MoveResultCode runForward(){direction=1;return MoveResultCode::OK;}
  MoveResultCode runBackward(){direction=-1;return MoveResultCode::OK;}
  void applySpeedAcceleration(){++applies;}
  MoveResultCode moveTo(int32_t p){destination=p;return MoveResultCode::OK;}
  int32_t getCurrentPosition()const{return pos;}
  int32_t targetPos()const{return destination;}
  int32_t getCurrentSpeedInMilliHz()const{return direction*(int32_t)rate;}
};
class FastAccelStepperEngine {public:FastAccelStepper motor; FastAccelStepper*stepperConnectToPin(uint8_t pin){return pin==9||pin==10?&motor:nullptr;}};
