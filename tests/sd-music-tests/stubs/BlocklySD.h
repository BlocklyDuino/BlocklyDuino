#pragma once
#include <cstdint>
#include <string>
#include <map>
#include <limits>
using String=std::string;
inline uint32_t fakeMillis=0;
inline uint32_t millis(){return fakeMillis;}
struct FakeFile {
  std::string bytes;
  size_t pos=0, reads=0, errorAt=std::numeric_limits<size_t>::max();
  bool error=false, opened=false;
  int read(){++reads;if(!opened||pos==errorAt){error=true;return -1;}return pos<bytes.size()?static_cast<unsigned char>(bytes[pos++]):-1;}
  bool getError()const{return error;}
};
struct BxSD {
  FakeFile file;
  std::map<std::string,std::string> files;
  int opens=0,closes=0;
  bool open(const char *path,bool append){++opens;file=FakeFile();auto found=files.find(path);if(append||found==files.end())return false;file.bytes=found->second;file.opened=true;return true;}
  void close(){++closes;file.opened=false;}
};
