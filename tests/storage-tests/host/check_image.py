from PIL import Image
import struct
from pathlib import Path
root=Path('.test-build/images')
def sample(x,y,c,levels):
 if x==0:return 0
 if x==1:return levels-1
 if x==2:return min(256,levels-1)
 return (x*701+y*211+c*113)%levels
for fmt in range(4):
 for levels in [2,3,16,256,257,1024,65536]:
  if fmt<2 and levels>256:continue
  for coord in range(2):
   ext='bmp' if fmt<2 else 'pgm' if fmt==2 else 'ppm'
   p=root/f'image_{fmt}_{levels}_{coord}.{ext}';raw=p.read_bytes();im=Image.open(p);im.load();assert im.size==(13,7)
   channels=1 if fmt in [0,2] else 3
   if fmt<2:
    offset=struct.unpack_from('<I',raw,10)[0];bpp=struct.unpack_from('<H',raw,28)[0];stride=((13*bpp+31)//32)*4
    assert struct.unpack_from('<i',raw,22)[0]==-7;assert len(raw)==offset+stride*7
    view=im.convert('L' if fmt==0 else 'RGB')
    for y in range(7):
     for x in range(13):
      expected=tuple(sample(x,y,c,levels)*255//(levels-1) for c in range(channels))
      assert view.getpixel((x,y))==(expected[0] if channels==1 else expected),(p,x,y,view.getpixel((x,y)),expected)
     used=(13*bpp+7)//8;row=raw[offset+y*stride:offset+(y+1)*stride];assert all(v==0 for v in row[used:])
   else:
    magic,dimensions,maxval,payload=raw.split(b'\n',3);assert magic== (b'P5' if fmt==2 else b'P6');assert dimensions==b'13 7';assert int(maxval)==levels-1
    size=1 if levels<=256 else 2
    assert len(payload)==13*7*channels*size
    values=list(payload) if size==1 else list(struct.unpack('>'+str(13*7*channels)+'H',payload))
    expected=[sample(x,y,c,levels) for y in range(7) for x in range(13) for c in range(channels)]
    assert values==expected,(p,'exact samples')
   print('PASS',p.name,'full pixels/samples')
raw=(root/'rgb_over.ppm').read_bytes().split(b'\n',3)[3];assert raw==b'\xff\xff\x01\x00\x00\x01'
for filename in ['rgb_invalid.ppm','gray_invalid.pgm','wrong_type.ppm','image_guard.pgm']:
 assert not any((root/filename).read_bytes().split(b'\n',3)[3])
im=Image.open(root/'rgb_short.bmp');im.load();assert im.getpixel((0,0))==(255,0,0)
for y in range(3):
 for x in range(5):
  if (x,y)!=(0,0):assert im.getpixel((x,y))==(0,0,0)
assert (root/'image_sentinel.bin').read_bytes()==b'KEEP'
print('PASS underfill/overflow, bounds before mutation, exact16-bitBE order, strict format guards')
