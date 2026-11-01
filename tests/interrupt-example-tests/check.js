const h=require('../project-device-tests/harness'),{assert,win,B,fs,path,out}=h;
win.Blockly=B;win.eval(fs.readFileSync(path.join(out,'serial_blocks.js'),'utf8'));
const oldFiles=fs.readdirSync(path.join(out,'examples')).filter(n=>/^\d.*\.xml$/.test(n)&&!/^(57|58|59|60)-/.test(n));const baseline={};for(const name of oldFiles)baseline[name]=h.generate(h.load(fs.readFileSync(path.join(out,'examples',name),'utf8')));
for(const file of ['interrupt_blocks.js','timer_interrupt_blocks.js'])win.eval(fs.readFileSync(path.join(out,file),'utf8'));
let count=0;
for(const name of ['57-external-interrupt','58-pin-change-interrupt','59-timer-interrupt']){
 const ws=h.load(fs.readFileSync(path.join(out,'examples',name+'.xml'),'utf8')),code=h.generate(ws),round=h.generate(h.load(h.save(ws)));assert.equal(round,code,name+' roundtrip');count++;
 assert(code.includes('Serial.begin(115200);'),name+' baud');count++;
 assert(code.includes('ATOMIC_BLOCK(ATOMIC_RESTORESTATE)'),name+' atomic copies');count++;
 assert(code.includes('volatile uint'),name+' volatile counter');count++;
 const dir=path.resolve('.test-build/interrupt-example-tests',name);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,name+'.ino'),code);
}
for(const name of oldFiles){assert.equal(h.generate(h.load(fs.readFileSync(path.join(out,'examples',name),'utf8'))),baseline[name],name+' unchanged');count++;}
console.log('PASS '+count+' checks; three new XML/code roundtrips and '+oldFiles.length+' previous examples unchanged.');
