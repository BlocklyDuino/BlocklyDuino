// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <Arduino.h>
#include <math.h>
#include <FastAccelStepper.h>

// Keep the block API independent of the pulse engine. FastAccelStepper owns
// the queue, ramp planner and timer ISR; this adapter never emits STEP pulses.
class BxFastStepper {
  FastAccelStepper *motor = nullptr;
  float maximum = 1, target = 0;
  bool continuous = false;
  bool applyTarget() {
    if (!motor) return false;
    if (target == 0) { motor->stopMove(); return true; }
    if (!setRate(fabsf(target))) return false;
    return (target > 0 ? motor->runForward() : motor->runBackward()) == MoveResultCode::OK;
  }
  bool setRate(float speed) {
    if (!motor || !isfinite(speed) || speed <= 0) return false;
    if (speed > maximum) speed = maximum;
    const float limit = motor->getMaxSpeedInHz();
    if (speed > limit) speed = limit;
    // Preserve sub-Hz requests without changing the public steps/s unit.
    // The library rounds the resulting period to timer ticks.
    if (motor->setSpeedInMilliHz((uint32_t)(speed * 1000.0f + 0.5f))) {
      motor->stopMove();
      return false;
    }
    return true;
  }
 public:
  bool begin(FastAccelStepperEngine &engine, uint8_t step, uint8_t dir,
             float maxSpeed, int32_t accel, uint16_t dirDelayUs) {
    motor = engine.stepperConnectToPin(step);
    if (!motor) return false;
    motor->setDirectionPin(dir, true, dirDelayUs);
    maximum = maxSpeed;
    return motor->setAcceleration(accel) == 0 && setRate(maxSpeed);
  }
  bool setTarget(float speed) {
    if (!isfinite(speed)) { stop(); return false; }
    if (continuous && target == speed) return true;
    continuous = true;
    target = speed;
    return applyTarget();
  }
  bool setMaxSpeed(float speed) {
    if (!isfinite(speed) || speed <= 0) { stop(); return false; }
    maximum = speed;
    if (continuous) return applyTarget();
    bool ok = setRate(maximum);
    if (ok) motor->applySpeedAcceleration();
    return ok;
  }
  bool setAcceleration(int32_t accel) {
    if (!motor || motor->setAcceleration(accel)) { stop(); return false; }
    motor->applySpeedAcceleration();
    return true;
  }
  bool moveTo(int32_t position) {
    continuous = false;
    return setRate(maximum) && motor->moveTo(position) == MoveResultCode::OK;
  }
  bool move(int32_t offset) {
    // Match AccelStepper: offset from current position, not the queued target.
    return motor && moveTo((int32_t)((uint32_t)motor->getCurrentPosition() + (uint32_t)offset));
  }
  void stop() { target = 0; if (motor) motor->stopMove(); }
  int32_t currentPosition() const { return motor ? motor->getCurrentPosition() : 0; }
  int32_t distanceToGo() const {
    return motor ? (int32_t)((uint32_t)motor->targetPos() - (uint32_t)motor->getCurrentPosition()) : 0;
  }
  float speed() const { return motor ? motor->getCurrentSpeedInMilliHz() / 1000.0f : 0; }
};
