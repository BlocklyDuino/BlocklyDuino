#pragma once
#include <string>
#include <cstdint>
class String {std::string value;public:bool reserve(unsigned int n){return n<=1024;}bool concat(char c){value+=c;return true;}size_t length()const{return value.size();}const char *c_str()const{return value.c_str();}};
