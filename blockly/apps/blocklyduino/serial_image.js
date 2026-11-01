/* SPDX-License-Identifier: Apache-2.0
 * Streaming image protocol. Memory belongs to the PC, never the microcontroller.
 */
(function(root,factory){var api=factory();if(typeof module==='object')module.exports=api;else root.SerialImage=api;})(this,function(){
 'use strict';
 function Image(){this.config=null;this.pixels=null;this.updates=0;this.revision=0;}
 function validate(c){if(!c||c.version!==1||typeof c.id!=='string'||!/^\w[\w-]{0,47}$/.test(c.id))throw Error('Image header needs version:1 and a short id.');
  if(!Number.isInteger(c.width)||!Number.isInteger(c.height)||c.width<1||c.height<1||c.width>16384||c.height>16384||c.width*c.height>16777216)throw Error('Image dimensions must be positive, at most 16384 per side and 16 megapixels (64 MiB RGBA).');
  var mode=c.mode||'gray',max=c.max==null?255:c.max;if(!['gray','rgb'].includes(mode)||!Number.isFinite(max)||max<=0)throw Error('Image mode must be gray or rgb, with a finite positive maximum.');
  return {version:1,id:c.id,width:c.width,height:c.height,mode:mode,max:max};
 }
 Image.prototype.configure=function(c){c=validate(c);if(JSON.stringify(c)===JSON.stringify(this.config))return false;
  var pixels=new Uint8ClampedArray(c.width*c.height*4);this.config=c;this.pixels=pixels;this.updates=0;this.revision++;return true;
 };
 Image.prototype.clear=function(){if(this.pixels){this.pixels.fill(0);this.updates=0;this.revision++;}};
 Image.prototype.consume=function(line){if(!/^@(image|pixel|image-clear)(?:\s|$)/.test(line))return false;
  if(line.startsWith('@image ')){this.configure(JSON.parse(line.slice(7)));return true;}
  if(line==='@image-clear'){this.clear();return true;}
  if(!line.startsWith('@pixel '))throw Error('Unknown image command.');
  if(!this.config)throw Error('Send an @image header before pixels.');
  var c=this.config,v=line.slice(7).split(',');if(v.length!==(c.mode==='gray'?3:5)||v.some(function(n){return !n.trim()||!Number.isFinite(Number(n));}))throw Error('Pixel needs x,y,value (gray) or x,y,r,g,b (RGB).');v=v.map(Number);
  if(!Number.isInteger(v[0])||!Number.isInteger(v[1])||v[0]<0||v[1]<0||v[0]>=c.width||v[1]>=c.height)throw Error('Pixel coordinate outside the image.');
  if(v.slice(2).some(function(n){return n<0||n>c.max;}))throw Error('Pixel values must be between 0 and the configured maximum.');
  var at=(v[1]*c.width+v[0])*4,values=c.mode==='gray'?[v[2],v[2],v[2]]:v.slice(2);for(var k=0;k<3;k++)this.pixels[at+k]=Math.round(values[k]/c.max*255);this.pixels[at+3]=255;this.updates++;this.revision++;return true;
 };
 return {Image:Image,validate:validate};
});
