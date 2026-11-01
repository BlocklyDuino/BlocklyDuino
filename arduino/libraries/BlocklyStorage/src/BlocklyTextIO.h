// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <Arduino.h>
// Read one LF/CRLF-delimited record from the current file. Bounded allocation;
// no whole-file buffer. An overlong record is rejected, never played truncated.
template<class Card> String bxReadLine(Card &card, long limit) {
  String line;
  if(limit<1||limit>65534||!card.file){card.ok=false;return line;}
  if(!line.reserve((unsigned int)limit)){card.ok=false;return line;}
  for(long i=0;i<=limit+1;++i){int c=card.readByte();
    if(c<0){card.ok=!card.file.getError()&&line.length()>0;return line;}
    if(c=='\n'){card.ok=true;return line;}
    if(c=='\r')continue;
    if(line.length()>=(unsigned long)limit||!line.concat((char)c)){card.ok=false;return String();}
  }
  card.ok=false;return String();
}
