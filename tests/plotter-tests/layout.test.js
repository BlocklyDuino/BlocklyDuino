const assert=require('node:assert/strict'),L=require('../../blockly/apps/blocklyduino/plotter_layout');
for(const [w,h] of [[1260,480],[1260,300],[1920,800],[640,400],[375,300],[240,120]])for(let count=1;count<=16;count++){
 const p=L.chooseGrid(count,w,h);assert(p.columns>=1&&p.columns<=count&&p.columns<=6);assert.equal(p.rows,Math.ceil(count/p.columns));assert(p.columns*p.rows>=count);
 const tileW=(w-(p.columns-1)*8)/p.columns,tileH=(h-(p.rows-1)*8)/p.rows;assert(tileW>0&&tileH>0);assert(tileW*p.columns+(p.columns-1)*8<=w+.00001);assert(tileH*p.rows+(p.rows-1)*8<=h+.00001);
}
assert.equal(L.chooseGrid(1,1260,450).columns,1);assert.equal(L.chooseGrid(6,1260,480).columns,3);assert.equal(L.chooseGrid(6,1260,379).columns,3);
console.log('PASS fit layout: 1–16 instruments across six viewport shapes');
