// Adapter behavior only. Actual pulse timing belongs to upstream FastAccelStepper.
#include <cassert>
#include <cmath>
#include <iostream>
#include <BlocklyMotion.h>
#include <BlocklyFastStepper.h>
uint32_t testMicros=0;
struct Motor {float rate=0,max=0;int runs=0;void setSpeed(float s){rate=s;}void setMaxSpeed(float s){max=s;}void runSpeed(){++runs;}};
int main(){
 Motor m;BxStepperVelocity<Motor> ramp(m);ramp.begin(100,1000);ramp.setTarget(50);
 for(int i=0;i<50;i++){testMicros+=1000;ramp.run();}assert(std::abs(m.rate-50)<.001&&m.runs==50);
 ramp.setTarget(-50);for(int i=0;i<50;i++){testMicros+=1000;ramp.run();}assert(m.rate==0);
 testMicros+=1000;ramp.run();assert(m.rate<0);assert(!ramp.setTarget(NAN));assert(!ramp.setAcceleration(0));
 ramp.stop();testMicros+=1000;ramp.run();assert(m.rate==0);
 // A long loop stall cannot jump straight to the target; time rollover is safe.
 testMicros=0xfffffff0; ramp.begin(100,1000);ramp.setTarget(100);testMicros+=1000;ramp.run();assert(std::abs(m.rate-1)<.001);
 testMicros+=2000000;ramp.run();assert(std::abs(m.rate-21)<.001);
 FastAccelStepperEngine engine;BxFastStepper f;assert(f.begin(engine,9,4,30000,5000,40));auto &hw=engine.motor;
 assert(f.setTarget(1234.125f));assert(hw.rate==1234125&&hw.direction==1);int count=hw.updates;
 assert(f.setTarget(1234.125f)&&hw.updates==count); // unchanged target cannot restart a ramp
 assert(f.setTarget(-2500)&&hw.direction==-1);assert(f.setTarget(90000)&&hw.rate==30000000);
 assert(f.setMaxSpeed(40000)&&hw.rate==40000000);hw.limit=37000;assert(f.setTarget(50000)&&hw.rate==37000000);
 assert(f.setAcceleration(2000)&&hw.accel==2000&&hw.applies>0);
 f.stop();int stopped=hw.stops;assert(f.setTarget(0)&&hw.stops==stopped);assert(f.setTarget(100)&&hw.direction==1);
 hw.pos=100;hw.destination=500;assert(f.move(20)&&hw.destination==120);assert(f.currentPosition()==100&&f.distanceToGo()==20);
 assert(!f.setTarget(NAN)&&hw.stops>stopped);assert(!f.setMaxSpeed(-1));assert(!f.setAcceleration(0));
 BxFastStepper invalid;assert(!invalid.begin(engine,3,4,30000,5000,40));assert(!invalid.setTarget(100));invalid.stop();assert(invalid.currentPosition()==0);
 std::cout<<"PASS motion adapters: smooth ramps, reversal, rollover, bounded stall recovery, fine requests, unchanged targets, limits, relative position and invalid commands\n";
}
