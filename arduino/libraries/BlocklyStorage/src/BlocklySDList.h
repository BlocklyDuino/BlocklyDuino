#pragma once
#include <BlocklySD.h>
// Reuse the card's file object; stream short names, without nested directory objects.
template<class Card> bool bxListRoot(Card &card,Print &out){
  if(card.file)return card.ok=false; // Finish/close the current file first.
  FatFile root;
  if(!root.openRoot(&card.sd))return card.ok=false;
  while(card.file.openNext(&root,O_RDONLY)){
    bool good=card.file.printSFN(&out)>0;
    if(card.file.isDir())good=out.write('/')==1&&good;
    good=out.write('\n')==1&&good;
    bool closed=card.file.close();
    if(!good||!closed)return card.ok=false;
  }
  return card.ok=!root.getError();
}
