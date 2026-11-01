/* Generic Serial messages/commands. No USB or physical hardware is opened. */
const h=require('../project-device-tests/harness'),{assert,fs,path,B}=h,{spawnSync}=require('child_process');
let checks=0;function check(condition,message){assert(condition,message);checks++;}
function eq(a,b,message){assert.deepStrictEqual(a,b,message);checks++;}
function fails(fn,re){assert.throws(fn,re);checks++;}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function block(type,fields={},values={},statements={}){return '<block type="'+type+'">'+Object.entries(fields).map(([k,v])=>'<field name="'+k+'">'+esc(v)+'</field>').join('')+Object.entries(values).map(([k,v])=>'<value name="'+k+'">'+v+'</value>').join('')+Object.entries(statements).map(([k,v])=>'<statement name="'+k+'">'+v+'</statement>').join('')+'</block>';}
const n=v=>block('math_number',{NUM:v}),variable=v=>block('variables_get',{VAR:v});
const declaration=(name,type,value)=>block('arduino_typed_variable',{VAR:name,TYPE:type},{VALUE:n(value)});
function chain(...blocks){return blocks.reduceRight((next,b)=>next?b.slice(0,-8)+'<next>'+next+'</next></block>':b,'');}
function workspace(...blocks){return h.load('<xml>'+blocks.join('')+'</xml>');}
function template(text,values){return block('serial_template',{TEXT:text,END:'println'},Object.fromEntries(Object.entries(values||{}).map(([k,v])=>['ARG_'+k,v])));}
function setNumber(command,name,min,max,step){return block('serial_set_number',{COMMAND:command,VAR:name},{MIN:n(min),MAX:n(max),STEP:n(step)},{DO:template('@state {"'+name+'":{{'+name+(name==='gain'?':2':'')+'}}}',{[name]:variable(name)}),INVALID:template('@msg Invalid '+name)});}
const s=h.win.SerialMessageTemplate;
const formatted=s.format('@plot {"width":{{width}},"again":{{width}},"gain":{{gain:2}},"label":"x {{width}}"}');
check(formatted.includes('\n  "width": {{width}}'),'Formatting keeps numeric placeholders outside JSON quotes');
check(formatted.includes('"label": "x {{width}}"'),'Formatting preserves placeholders already in a string');
eq(s.compact(formatted),'@plot {"width":{{width}},"again":{{width}},"gain":{{gain:2}},"label":"x {{width}}"}');
eq(Array.from(s.parse('a={{width}}/{{width}};b={{gain:3}}').names),['width','gain']);
fails(()=>s.compact('@plot {"width":{{width} }'),/Close every/);
fails(()=>s.compact('bad {{width:9}}'),/precision/);
fails(()=>s.compact('bad {{ name }}'),/Use/);
fails(()=>s.compact('@plot {"width":{{width}},}'),/Invalid JSON/);
const basic=workspace(template('Count {{value:3}}', {value:n(12)}));
check(h.generate(basic).includes('Serial.print((double)(12), 3);'),'Explicit precision casts integer inputs instead of selecting base 3');
const literalEnd=workspace(template('Value {{n}} done', {n:n(12)}));
check(h.generate(literalEnd).includes('Serial.println(F(" done"));'),'Final Flash literal and newline share one call');
const sameLine=workspace(block('serial_template',{TEXT:'Value {{n}} done',END:'print'},{ARG_n:n(12)}));
check(h.generate(sameLine).includes('Serial.print(F(" done"));')&&!h.generate(sameLine).includes('Serial.println('),'Same-line templates add no newline');
const renamed=workspace(template('Count {{count}} / {{count}}', {count:n(12)}));
eq(Array.from(renamed.getAllBlocks().find(b=>b.type==='serial_template').inputList.filter(i=>i.name.indexOf('ARG_')===0).map(i=>i.name)),['ARG_count']);
const renamedAgain=h.load(h.save(renamed));eq(h.generate(renamedAgain),h.generate(renamed),'Mutation restores names before expression children');
check(renamedAgain.getAllBlocks().find(b=>b.type==='serial_template').getInputsInline(),'Small messages keep their value sockets inline');
const longTemplate=workspace(template(Array.from({length:22},(_,i)=>'{{value'+i+'}}').join(','),Object.fromEntries(Array.from({length:22},(_,i)=>['value'+i,n(i)]))));
check(!longTemplate.getAllBlocks().find(b=>b.type==='serial_template').getInputsInline(),'Large headers stack their sockets below the compact text field');
const edited=renamedAgain.getAllBlocks().find(b=>b.type==='serial_template');edited.setFieldValue('Other {{other}}','TEXT');
check(edited.getInput('ARG_count').connection.targetBlock(),'Changing text keeps obsolete connected expressions');
fails(()=>h.generate(renamedAgain),/unused/);
edited.getInput('ARG_count').connection.targetBlock().dispose();edited.syncTemplate_();
check(!edited.getInput('ARG_count'),'Disconnected obsolete sockets disappear');fails(()=>h.generate(renamedAgain),/Connect a value to other/);
const restored=h.load('<xml><block type="serial_template"><mutation names="[&quot;unused&quot;,&quot;actual&quot;]"/><field name="TEXT">{{actual}}</field><value name="ARG_unused">'+n(1)+'</value><value name="ARG_actual">'+n(2)+'</value></block></xml>');
fails(()=>h.generate(restored),/unused/);
// The multiline editor refuses invalid placeholders without losing its draft.
h.win.HTMLDialogElement.prototype.showModal=function(){this.open=true;};h.win.HTMLDialogElement.prototype.close=function(){this.open=false;};
const field=basic.getAllBlocks().find(b=>b.type==='serial_template').getField('TEXT');field.showEditor_();
const dialog=h.win.document.getElementById('message-editor');dialog.querySelector('textarea').value='Oops {{bad:name}}';
Array.from(dialog.querySelectorAll('button')).find(b=>b.textContent==='Save').click();
check(dialog.open&&dialog.querySelector('.error').textContent,'Invalid template stays open with a useful error');eq(field.getValue(),'Count {{value:3}}');dialog.remove();
const reader=body=>block('serial_receive_line',{CAPACITY:48},{},{DO:body});
fails(()=>h.generate(workspace(block('serial_when_command',{COMMAND:'START'}))),/inside read serial lines/);
fails(()=>h.generate(workspace(reader(''),reader(''))),/one read serial lines/);
fails(()=>h.generate(workspace(reader(''),block('serial_read'))),/owns the incoming bytes/);
fails(()=>h.generate(workspace(reader(setNumber('@set missing','missing',0,10,1)))),/Declare a global numeric variable/);
fails(()=>h.generate(workspace(declaration('width','uint16_t',32),reader(setNumber('@set width\nSTART','width',2,128,1)))),/ASCII command/);
const commands=chain(block('serial_when_command',{COMMAND:'START'},{},{DO:template('Ready {{width}}, gain={{gain:2}}',{width:variable('width'),gain:variable('gain')})}),setNumber('@set width','width',2,1024,2),setNumber('@set gain','gain',.01,16,.01),setNumber('@set offset','offset',-100,100,1));
const ws=workspace(block('serial_config',{BAUD:115200}),declaration('width','uint16_t',32),declaration('gain','float',1),declaration('offset','int16_t',0),block('arduino_loop_section',{},{},{DO:reader(commands)}));
const code=h.generate(ws);check(code.includes('#include <BlocklySerial.h>'));check(code.includes('BxSerialLine<48> bxSerialLine;'));check(code.includes('::width'),'Commands bind the declared global explicitly');check(!/\bString\b|readString|readBytes/.test(code),'Generated commands use no dynamic String or blocking serial read');
eq(h.generate(h.load(h.save(ws))),code,'Whole command program survives XML roundtrip');
const out=path.resolve('.test-build/serial-message-helper');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'serial-message-helper.ino'),code);
const host=path.resolve('.test-build/serial-message-runtime');fs.mkdirSync(host,{recursive:true});
for(const file of ['Arduino.h','runtime.cpp'])if(fs.existsSync(path.join(out,file)))fs.unlinkSync(path.join(out,file));
// Runtime checks compile the actual bundled parser with an Arduino Stream mock.
fs.writeFileSync(path.join(host,'Arduino.h'),`#pragma once
#include <stdint.h>
struct __FlashStringHelper;
#define F(s) reinterpret_cast<const __FlashStringHelper *>(s)
class Stream { public: virtual int available()=0; virtual int read()=0; };
`);
const runtime=String.raw`#include <string>
#include <cassert>
#include <iostream>
#include <limits>
#include "BlocklySerial.h"
class Input : public Stream { public: std::string bytes; int reads=0; int available(){return bytes.size();} int read(){if(bytes.empty())return -1;unsigned char c=bytes[0];bytes.erase(0,1);reads++;return c;} } input;
BxSerialLine<48> line;
bool receive(const std::string &s){input.bytes+=s;bool ready=false;while(input.available()){if(line.poll(input)){ready=true;break;}}return ready;}
int main(){
 uint16_t width=32;float gain=1;int16_t offset=0;
 assert(!receive("STA"));assert(!line.matches(F("START")));assert(receive("RT\r\n"));assert(line.matches(F("START")));assert(!line.matches(F("S")));
 assert(receive("STARTmore\n"));assert(!line.matches(F("START")));
 assert(!receive("STAR\rT\n"));assert(!line.matches(F("START")));
 assert(!receive("@set width 6"));assert(line.number(F("@set width"),width,2,128,2)==0);assert(width==32);
 assert(receive("4\n"));assert(line.number(F("@set width"),width,2,128,2)==1);assert(width==64);
 for(const auto &s:{"@set widths 20\n","@set width20\n","@set height 20\n"}){receive(s);assert(line.number(F("@set width"),width,2,128,2)==0);assert(width==64);}
 for(const auto &s:{"@set width\n","@set width \n","@set width 20x\n","@set width  20\n","@set width 20 \n","@set width 20.0\n","@set width 2e1\n","@set width 65\n","@set width -2\n","@set width 130\n","@set width 4294967296\n"}){receive(s);assert(line.number(F("@set width"),width,2,128,2)==-1);assert(width==64);}
 assert(!receive(std::string(80,'x')+"START\n"));assert(receive("START\n"));assert(line.matches(F("START")));
 assert(!receive(std::string("@set width 2\0",13)+"0\n"));assert(width==64);
 input.bytes=std::string(40,'x');int before=input.reads;assert(!line.poll(input));assert(input.reads-before==32);receive("\n");
 receive("@set width 100\n");assert(line.number(F("@set width"),width,2,128,0)==-1);assert(line.number(F("@set width"),width,2,128,-1)==-1);assert(line.number(F("@set width"),width,2.5,128,1)==-1);assert(line.number(F("@set width"),width,200,128,1)==-1);assert(width==64);
 receive("@set width 100\n");int upper=90;assert(line.number(F("@set width"),width,2,upper,2)==-1);upper=110;assert(line.number(F("@set width"),width,2,upper,2)==1);assert(width==100);
 receive("@set gain 0.01\n");assert(line.number(F("@set gain"),gain,.01,16,.01)==1);assert(fabs(gain-.01)<1e-8);
 receive("@set gain +1.25e0\n");assert(line.number(F("@set gain"),gain,.01,16,.01)==1);assert(gain==1.25);
 for(const auto &s:{"@set gain nan\n","@set gain inf\n","@set gain 0x1p2\n","@set gain 1.255\n","@set gain 1e999\n","@set gain 1e-999\n","@set gain .\n","@set gain 1.2suffix\n"}){receive(s);assert(line.number(F("@set gain"),gain,.01,16,.01)==-1);assert(gain==1.25);}
 receive("@set gain 0.00000001\n");assert(line.number(F("@set gain"),gain,0,16,1)==-1);assert(gain==1.25);
 receive("@set offset -99\n");assert(line.number(F("@set offset"),offset,-100,100,1)==1);assert(offset==-99);
 receive("@set offset -32769\n");assert(line.number(F("@set offset"),offset,-32768,32767,1)==-1);assert(offset==-99);
 uint32_t whole=1;receive("@set n 4294967295\n");assert(line.number(F("@set n"),whole,uint32_t(0),UINT32_MAX,uint32_t(1))==1);assert(whole==UINT32_MAX);
 receive("@set n 4294967295\n");assert(line.number(F("@set n"),whole,0,4294967295LL,1)==1);assert(whole==UINT32_MAX);
 receive("@set n 300000001\n");assert(line.number(F("@set n"),whole,uint32_t(0),uint32_t(300000000),uint32_t(1))==-1);assert(whole==UINT32_MAX);
 int32_t signedWhole=1;receive("@set n -2147483648\n");assert(line.number(F("@set n"),signedWhole,INT32_MIN,INT32_MAX,1)==1);assert(signedWhole==INT32_MIN);
 receive("@set n 2147483647\n");assert(line.number(F("@set n"),signedWhole,INT32_MIN,INT32_MAX,1)==1);assert(signedWhole==INT32_MAX);
 volatile int16_t shared=0;receive("@set n -5\n");assert(line.number(F("@set n"),shared,-10,10,1)==1);assert(shared==-5);
 std::cout<<"PASS bounded native Serial parser: complete commands,32-byte budget,overflow recovery,finite fractions,exact32-bit integer boundaries,dynamic constraints,no mutation on rejection\n";
}
`;
fs.writeFileSync(path.join(host,'runtime.cpp'),runtime);
let result=spawnSync('g++',['-std=c++11','-Wall','-Wextra','-Werror','-I',host,'-I',path.resolve('arduino/libraries/BlocklySerial/src'),path.join(host,'runtime.cpp'),'-o',path.join(host,'runtime')],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
result=spawnSync(path.join(host,'runtime'),[],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);process.stdout.write(result.stdout);
const executable=String.raw`#include <string>
#include <sstream>
#include <iomanip>
#include <cassert>
#include "Arduino.h"
class FakeSerial : public Stream {
 public: std::string incoming, output;
 void begin(long) {} int available(){return incoming.size();}
 int read(){unsigned char c=incoming[0];incoming.erase(0,1);return c;}
 void print(const __FlashStringHelper *s){output+=reinterpret_cast<const char *>(s);}
 template<typename T> void print(T value){std::ostringstream text;text<<value;output+=text.str();}
 void print(double value,int precision){std::ostringstream text;text<<std::fixed<<std::setprecision(precision)<<value;output+=text.str();}
 void println(){output+='\n';}
 template<typename T> void println(T value){print(value);println();}
} Serial;
`+code+String.raw`
void send(const std::string &s){Serial.incoming+=s;while(Serial.available())loop();}
int main(){
 setup();send("STA");assert(Serial.output.empty());send("RT\n");assert(Serial.output=="Ready 32, gain=1.00\n");
 Serial.output.clear();send("@set width 64\n");assert(width==64);assert(Serial.output=="@state {\"width\":64}\n");
 Serial.output.clear();send("@set width 65\n");assert(width==64);assert(Serial.output=="@msg Invalid width\n");
 Serial.output.clear();send("@set gain 0.01\n");assert(Serial.output=="@state {\"gain\":0.01}\n");
 Serial.output.clear();send("@set gain 1.255\n");assert(fabs(gain-.01)<1e-8);assert(Serial.output=="@msg Invalid gain\n");
 Serial.output.clear();send("STARTsuffix\n");assert(Serial.output.empty());
 send(std::string(70,'x')+"START\n");assert(Serial.output.empty());send("START\n");assert(Serial.output=="Ready 64, gain=0.01\n");
}
`;
fs.writeFileSync(path.join(host,'generated.cpp'),executable);
result=spawnSync('g++',['-std=c++11','-Wall','-Wextra','-Werror','-I',host,'-I',path.resolve('arduino/libraries/BlocklySerial/src'),path.join(host,'generated.cpp'),'-o',path.join(host,'generated')],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
result=spawnSync(path.join(host,'generated'),[],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);checks++;
console.log('PASS Serial message blocks: '+checks+' checks; multiline templates,unique/restored sockets,Flash streams,precision,strict global commands; generated AVR sketch '+out);
