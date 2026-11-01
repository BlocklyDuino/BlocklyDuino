// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <Arduino.h>
#include <math.h>

// A velocity ramp around the existing polled pulse engine, not a timer driver.
// Call run() continuously. Change the target less often (e.g. every 20 ms).
// At most one pulse per call; no wait for movement or missed-step catch-up loop.
template<class Motor> class BxStepperVelocity {
  Motor &motor;
  float target, current, maximum, acceleration;
  uint32_t last;
 public:
  explicit BxStepperVelocity(Motor &m):motor(m),target(0),current(0),maximum(1),acceleration(1),last(0){}
  void begin(float maxSpeed, float accel) {
    target=current=0;
    setMaxSpeed(maxSpeed);
    setAcceleration(accel);
    motor.setSpeed(0);
    last=micros();
  }
  bool setTarget(float speed) {
    if(!isfinite(speed)) return false;
    target=speed;
    return true;
  }
  bool setMaxSpeed(float speed) {
    if(!isfinite(speed)||speed<=0) return false;
    maximum=speed;
    motor.setMaxSpeed(speed);
    // A changed maximum is a hard cap; ordinary target changes are ramped.
    if(current>maximum) current=maximum;
    if(current<-maximum) current=-maximum;
    motor.setSpeed(current);
    return true;
  }
  bool setAcceleration(float accel) {
    if(!isfinite(accel)||accel<=0) return false;
    acceleration=accel;
    return true;
  }
  void stop() { target=0; }
  void run() {
    const uint32_t now=micros(),elapsed=now-last;
    if(elapsed>=1000) {
      last=now;
      float aim=target;
      if(aim>maximum) aim=maximum;
      if(aim<-maximum) aim=-maximum;
      // Brake through zero before emitting pulses in the opposite direction.
      if((current>0&&aim<0)||(current<0&&aim>0)) aim=0;
      if(current!=aim) {
        // A stalled loop must not cause an instant jump to full velocity.
        const float change=acceleration*(elapsed>20000?20000:elapsed)*0.000001f;
        if(current<aim) { current+=change; if(current>aim) current=aim; }
        else { current-=change; if(current<aim) current=aim; }
        motor.setSpeed(current);
      }
    }
    motor.runSpeed();
  }
};
