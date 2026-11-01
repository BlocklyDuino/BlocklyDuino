/* SPDX-License-Identifier: Apache-2.0 */
#ifndef BLOCKLY_SERIAL_H
#define BLOCKLY_SERIAL_H
#include <Arduino.h>
#include <limits.h>
#include <float.h>
#include <math.h>
#include <stdlib.h>

// Sign/magnitude keeps the entire signed/unsigned 32-bit range exact even on
// AVR, where double is only a 32-bit float. No 64-bit division is needed.
struct BxSerialInteger {
  uint32_t magnitude;
  bool negative, valid;
  BxSerialInteger(uint32_t m = 0, bool n = false, bool v = true)
      : magnitude(m), negative(n && m != 0), valid(v) {}
};
inline BxSerialInteger bxSerialSigned(long n) {
  return n < 0 ? BxSerialInteger(uint32_t(-(n + 1)) + 1, true)
               : BxSerialInteger(uint32_t(n));
}
inline BxSerialInteger bxSerialFloating(double n) {
  if (!isfinite(n) || n != floor(n) || fabs(n) >= 4294967296.0)
    return BxSerialInteger(0, false, false);
  return BxSerialInteger(uint32_t(fabs(n)), n < 0);
}
inline int8_t bxSerialCompare(BxSerialInteger a, BxSerialInteger b) {
  if (a.negative != b.negative) return a.negative ? -1 : 1;
  if (a.magnitude == b.magnitude) return 0;
  return (a.magnitude < b.magnitude) != a.negative ? -1 : 1;
}
template<typename T> struct BxSerialType;
#define BX_SERIAL_SIGNED(TYPE, MINIMUM, MAXIMUM) \
template<> struct BxSerialType<TYPE> { \
  enum { floating = false, signedInteger = true }; \
  static BxSerialInteger integer(TYPE n) { return bxSerialSigned(n); } \
  static bool fits(BxSerialInteger n) { return bxSerialCompare(n, bxSerialSigned(MINIMUM)) >= 0 && bxSerialCompare(n, bxSerialSigned(MAXIMUM)) <= 0; } \
  static TYPE value(BxSerialInteger n) { return n.negative ? static_cast<TYPE>(-long(n.magnitude - 1) - 1) : static_cast<TYPE>(n.magnitude); } \
};
#define BX_SERIAL_UNSIGNED(TYPE, MAXIMUM) \
template<> struct BxSerialType<TYPE> { \
  enum { floating = false, signedInteger = false }; \
  static BxSerialInteger integer(TYPE n) { return BxSerialInteger(uint32_t(n)); } \
  static bool fits(BxSerialInteger n) { return !n.negative && n.magnitude <= uint32_t(MAXIMUM); } \
  static TYPE value(BxSerialInteger n) { return static_cast<TYPE>(n.magnitude); } \
};
BX_SERIAL_SIGNED(signed char, SCHAR_MIN, SCHAR_MAX)
BX_SERIAL_UNSIGNED(unsigned char, UCHAR_MAX)
BX_SERIAL_SIGNED(short, SHRT_MIN, SHRT_MAX)
BX_SERIAL_UNSIGNED(unsigned short, USHRT_MAX)
BX_SERIAL_SIGNED(int, INT_MIN, INT_MAX)
BX_SERIAL_UNSIGNED(unsigned int, UINT_MAX)
BX_SERIAL_SIGNED(long, (-2147483647L - 1), 2147483647L)
BX_SERIAL_UNSIGNED(unsigned long, 4294967295UL)
#if CHAR_MIN < 0
BX_SERIAL_SIGNED(char, CHAR_MIN, CHAR_MAX)
#else
BX_SERIAL_UNSIGNED(char, CHAR_MAX)
#endif
#undef BX_SERIAL_SIGNED
#undef BX_SERIAL_UNSIGNED
// Unsuffixed Blockly numeric literals such as 4294967295 have type long long
// on AVR. Normalize those bounds without making the parser use 64-bit maths.
template<> struct BxSerialType<long long> {
  enum { floating = false, signedInteger = true };
  static BxSerialInteger integer(long long n) {
    if (n < -4294967295LL || n > 4294967295LL) return BxSerialInteger(0, false, false);
    return BxSerialInteger(uint32_t(n < 0 ? -n : n), n < 0);
  }
  static bool fits(BxSerialInteger) { return true; }
  static long long value(BxSerialInteger n) { return n.negative ? -static_cast<long long>(n.magnitude) : n.magnitude; }
};
template<> struct BxSerialType<unsigned long long> {
  enum { floating = false, signedInteger = false };
  static BxSerialInteger integer(unsigned long long n) { return BxSerialInteger(uint32_t(n), false, n <= 4294967295ULL); }
  static bool fits(BxSerialInteger n) { return !n.negative; }
  static unsigned long long value(BxSerialInteger n) { return n.magnitude; }
};
template<> struct BxSerialType<float> {
  enum { floating = true, signedInteger = false };
  static BxSerialInteger integer(float n) { return bxSerialFloating(n); }
  static bool fits(BxSerialInteger) { return false; }
  static float value(BxSerialInteger n) { return n.negative ? -float(n.magnitude) : float(n.magnitude); }
};
template<> struct BxSerialType<double> {
  enum { floating = true, signedInteger = false };
  static BxSerialInteger integer(double n) { return bxSerialFloating(n); }
  static bool fits(BxSerialInteger) { return false; }
  static double value(BxSerialInteger n) { return n.negative ? -double(n.magnitude) : double(n.magnitude); }
};

template<uint8_t Capacity = 48> class BxSerialLine {
  static_assert(Capacity >= 8 && Capacity <= 192, "Serial line capacity must be 8..192 bytes");
  char line_[Capacity];
  uint8_t used_;
  bool discard_, cr_, ready_;
  static char flash(const __FlashStringHelper *s, uint8_t i) {
#if defined(ARDUINO_ARCH_AVR) || defined(__AVR__)
    return char(pgm_read_byte(reinterpret_cast<const char *>(s) + i));
#else
    return reinterpret_cast<const char *>(s)[i];
#endif
  }
  __attribute__((noinline)) const char *argument(const __FlashStringHelper *key) const {
    if (!ready_) return 0;
    uint8_t i = 0;
    while (flash(key, i)) {
      if (i >= Capacity - 1 || line_[i] != flash(key, i)) return 0;
      ++i;
    }
    if (line_[i] == 0) return line_ + i; // matching command, missing number
    return line_[i] == ' ' ? line_ + i + 1 : 0;
  }
  static BxSerialInteger whole(const char *s) {
    bool negative = *s == '-';
    if (*s == '-' || *s == '+') ++s;
    if (!*s) return BxSerialInteger(0, false, false);
    uint32_t n = 0;
    while (*s) {
      uint8_t digit = uint8_t(*s++) - '0';
      if (digit > 9 || n > 429496729UL || (n == 429496729UL && digit > 5))
        return BxSerialInteger(0, false, false);
      n = n * 10 + digit;
    }
    return BxSerialInteger(n, negative);
  }
  static bool decimal(const char *s, double &number) {
    const char *start = s;
    if (*s == '-' || *s == '+') ++s;
    bool digit = false, nonzero = false;
    while (*s >= '0' && *s <= '9') { digit = true; nonzero |= *s != '0'; ++s; }
    if (*s == '.') { ++s; while (*s >= '0' && *s <= '9') { digit = true; nonzero |= *s != '0'; ++s; } }
    if (!digit) return false;
    if (*s == 'e' || *s == 'E') {
      ++s; if (*s == '-' || *s == '+') ++s;
      if (*s < '0' || *s > '9') return false;
      while (*s >= '0' && *s <= '9') ++s;
    }
    if (*s) return false;
    char *end;
    number = strtod(start, &end);
    return !*end && isfinite(number) && (number != 0 || !nonzero);
  }
  // Shared cores intentionally remain outside the T/L/H/S wrapper's inlining:
  // a dashboard can bind many differently typed parameters without copying
  // the complete parser and validation into every handler on a small AVR.
  static __attribute__((noinline)) bool integerNumber(const char *text,
      BxSerialInteger lo, BxSerialInteger hi, BxSerialInteger increment, BxSerialInteger &n) {
    n = whole(text);
    if (!n.valid || !lo.valid || !hi.valid || !increment.valid || increment.negative || !increment.magnitude ||
        bxSerialCompare(lo, hi) > 0 || bxSerialCompare(n, lo) < 0 || bxSerialCompare(n, hi) > 0)
      return false;
    uint32_t distance = lo.negative ? (n.negative ? lo.magnitude - n.magnitude : lo.magnitude + n.magnitude)
                                   : n.magnitude - lo.magnitude;
    return distance % increment.magnitude == 0;
  }
  static __attribute__((noinline)) bool floatingNumber(const char *text, double lo,
      double hi, double increment, double epsilon, double &n) {
    if (!isfinite(lo) || !isfinite(hi) || !isfinite(increment) || lo > hi || increment <= 0 ||
        lo + increment == lo || hi - increment == hi || !decimal(text, n) || n < lo || n > hi)
      return false;
    double ticks = (n - lo) / increment;
    double tolerance = 8 * epsilon * fmax(fabs(ticks), fabs(lo / increment));
    if (tolerance > 0.01) tolerance = 0.01;
    return isfinite(ticks) && fabs(ticks - floor(ticks + 0.5)) <= tolerance;
  }
 public:
  BxSerialLine() : used_(0), discard_(false), cr_(false), ready_(false) { line_[0] = 0; }
  // Read at most budget bytes, stop at one valid completed line, never wait.
  // LF and CRLF are accepted. A misplaced CR, control byte or overlong line
  // discards the whole command through LF rather than executing its suffix.
  bool poll(Stream &stream, uint8_t budget = 32) {
    ready_ = false;
    while (budget-- && stream.available()) {
      int incoming = stream.read();
      if (incoming < 0) break;
      char c = char(incoming);
      if (c == '\n') {
        bool valid = !discard_;
        line_[used_] = 0; used_ = 0; discard_ = false; cr_ = false;
        if (valid) { ready_ = true; return true; }
      } else if (c == '\r') { if (cr_) discard_ = true; cr_ = true; }
      else if (cr_ || uint8_t(c) < 32 || uint8_t(c) == 127) discard_ = true;
      else if (!discard_) {
        if (used_ < Capacity - 1) line_[used_++] = c;
        else discard_ = true;
      }
    }
    return false;
  }
  bool matches(const __FlashStringHelper *command) const {
    if (!ready_) return false;
    uint8_t i = 0;
    do {
      char c = flash(command, i);
      if (i >= Capacity || line_[i] != c) return false;
      if (!c) return true;
      ++i;
    } while (i < Capacity);
    return false;
  }
  template<typename T>
  __attribute__((noinline)) int8_t numberFloating(const __FlashStringHelper *key,
      T &target, double lo, double hi, double increment) const {
    const char *text = argument(key);
    if (!text) return 0;
    double n, epsilon = sizeof(T) <= sizeof(float) ? FLT_EPSILON : DBL_EPSILON;
    if (T(lo + increment) == T(lo) || T(hi - increment) == T(hi) ||
        !floatingNumber(text, lo, hi, increment, epsilon, n)) return -1;
    T candidate = T(n);
    if (!isfinite(candidate) || (candidate == 0 && n != 0)) return -1;
    target = candidate;
    return 1;
  }
  template<typename T>
  __attribute__((noinline)) int8_t numberInteger(const __FlashStringHelper *key,
      T &target, BxSerialInteger lo, BxSerialInteger hi, BxSerialInteger increment) const {
    const char *text = argument(key);
    if (!text) return 0;
    BxSerialInteger n;
    if (!BxSerialType<T>::fits(lo) || !BxSerialType<T>::fits(hi) ||
        !integerNumber(text, lo, hi, increment, n)) return -1;
    target = BxSerialType<T>::value(n);
    return 1;
  }
  // The common small-board case needs no sign/magnitude argument objects.
  // These exact signed 32-bit bounds keep every call site compact; the general
  // path below still handles unsigned targets and computed floating bounds.
  template<typename T>
  __attribute__((noinline)) int8_t numberSigned(const __FlashStringHelper *key,
      T &target, int32_t lo, int32_t hi, int32_t increment) const {
    const char *text = argument(key);
    if (!text) return 0;
    BxSerialInteger parsed = whole(text);
    if (!parsed.valid || lo > hi || increment <= 0 ||
        parsed.magnitude > (parsed.negative ? 2147483648UL : 2147483647UL)) return -1;
    int32_t n = parsed.negative ? -int32_t(parsed.magnitude - 1) - 1 : int32_t(parsed.magnitude);
    if (n < lo || n > hi || (uint32_t(n) - uint32_t(lo)) % uint32_t(increment)) return -1;
    target = static_cast<T>(n);
    return 1;
  }
  // 0: another command; 1: assigned; -1: matching command rejected unchanged.
  template<typename T, typename L, typename H, typename S>
  int8_t number(const __FlashStringHelper *key, T &target, L minimum, H maximum, S step) const {
    if (BxSerialType<T>::floating) return numberFloating(key, target, minimum, maximum, step);
    if (BxSerialType<T>::signedInteger && sizeof(T) == 4 &&
        BxSerialType<L>::signedInteger && sizeof(L) <= 4 &&
        BxSerialType<H>::signedInteger && sizeof(H) <= 4 &&
        BxSerialType<S>::signedInteger && sizeof(S) <= 4)
      return numberSigned(key, target, minimum, maximum, step);
    return numberInteger(key, target, BxSerialType<L>::integer(minimum),
      BxSerialType<H>::integer(maximum), BxSerialType<S>::integer(step));
  }
  template<typename T, typename L, typename H, typename S>
  int8_t number(const __FlashStringHelper *key, volatile T &target, L lo, H hi, S step) const {
    T candidate = target;
    int8_t result = number(key, candidate, lo, hi, step);
    if (result == 1) target = candidate;
    return result;
  }
};
#endif
