/* Execute the generated command handlers with mocked serial and AVR registers.
 * No USB device is opened. Timer/STEP electrical timing belongs to hardware tests. */
const {spawnSync}=require('node:child_process');
const h=require('../project-device-tests/harness'),{assert,win,B,fs,path,out}=h;
const P=require('../../blockly/apps/blocklyduino/serial_protocol');
win.Blockly=B;
for(const file of ['interrupt_blocks.js','timer_interrupt_blocks.js'])win.eval(fs.readFileSync(path.join(out,file),'utf8'));
const dir=path.resolve('.test-build/interrupt-example-controls');fs.mkdirSync(dir,{recursive:true});
const stub=String.raw`
#include <cstdint>
#include <string>
#include <deque>
#include <sstream>
#include <iostream>
#include <cassert>
using byte=uint8_t;
#define F(x) x
#define F_CPU 16000000UL
#define _BV(x) (1U<<(x))
#define ATOMIC_RESTORESTATE 0
#define ATOMIC_BLOCK(x) for(bool atomicOnce=true;atomicOnce;atomicOnce=false)
#define ISR(name) void name()
enum {WGM12=3,OCF1A=1,OCF1B=2,TOV1=0,ICF1=5,OCIE1A=1,INT0=0,INTF0=0,INPUT_PULLUP=2,FALLING=2};
uint8_t TIMSK1=0,TCCR1B=0,TIFR1=0,TCCR1A=0,TCCR1C=0,EIMSK=0,EIFR=0;
uint16_t TCNT1=0,OCR1A=0;
uint32_t now=0;uint32_t millis(){return now;}
void pinMode(int,int){}
int digitalPinToInterrupt(int pin){return pin-2;}
void (*buttonCallback)()=nullptr;
void attachInterrupt(int,void(*callback)(),int){buttonCallback=callback;EIMSK|=1;}
void detachInterrupt(int){EIMSK&=~1U;}
void button(){if((EIMSK&1)&&buttonCallback)buttonCallback();}
struct FastAccelStepperEngine{void init(){}};
struct BxFastStepper{float target=0;unsigned commands=0;
 bool begin(FastAccelStepperEngine&,uint8_t step,uint8_t dir,float maximum,int32_t accel,uint16_t){assert(step==9&&dir==4&&maximum==30000&&accel==5000);return true;}
 bool setTarget(float value){target=value;commands++;return true;}};
struct SerialMock{std::deque<unsigned char> rx;std::ostringstream tx;
 void begin(unsigned long b){assert(b==115200);}
 int available(){return rx.size();}int read(){int c=rx.front();rx.pop_front();return c;}
 template<class T>void print(T v){tx<<v;}void print(unsigned char v){tx<<unsigned(v);}
 template<class T>void println(T v){print(v);tx<<'\n';}
 void push(const std::string&s){for(char c:s)rx.push_back(c);}
}Serial;
void readPlotterCommand();void sendControlState();void announcePlotter();void parseCommandNumber();void stopMotor();
void setup();void loop();
void command(const std::string&s){Serial.push(s);loop();}
`;
const common=String.raw`
setup();assert(Serial.tx.str().find("@plot ")==0);
auto boot=Serial.tx.str();command("STA");assert(Serial.tx.str()==boot);
command("RTX\n");assert(commandLength==0&&!commandOverflow);
command(std::string(80,'x')+"\n");assert(commandLength==0&&!commandOverflow);
`;
const trials={
 '59-timer-interrupt':String.raw`
 assert(BxTimer1::running());TIMER1_COMPA_vect();assert(tickCount==1);
 command("@set running 0\n");assert(!BxTimer1::running());assert(tickCount==1);
 command("START\r\n");assert(streaming&&BxTimer1::running());assert(tickCount==1);
 command("@set running 1junk\n");assert(BxTimer1::running());
 command("@do clear\n");assert(tickCount==0);TIMER1_COMPA_vect();
 command("@do restart\n");assert(tickCount==1&&BxTimer1::running());
 now=1000;loop();command("STOP\n");assert(!streaming&&!BxTimer1::running());
 command("START\n");assert(streaming&&BxTimer1::running());now+=200;loop();
 `,
 '60-interrupt-attach-detach':String.raw`
 assert(!(EIMSK&1));button();assert(pulseCount==0);
 command("START\r\n");assert(streaming&&!(EIMSK&1));
 command("@set attached 1\n");assert(EIMSK&1);button();button();assert(pulseCount==2);
 command("@set attached 0\n");assert(!(EIMSK&1));button();assert(pulseCount==2);
 command("@set attached 1junk\n");assert(!(EIMSK&1));
 command("@do clear\n");assert(pulseCount==0);
 command("@set attached 1\nSTOP\n");assert(!streaming&&!(EIMSK&1));
 command("START\n");assert(streaming&&!(EIMSK&1));now=1000;loop();
 `,
 '70-timer-stepper-speed':String.raw`
 assert(targetSpeed==0&&bddev_motor.commands==0);
 command("START\r\n");assert(targetSpeed==0&&bddev_motor.commands==0);
 command("@set speed 123");assert(targetSpeed==0);
 command("\n");assert(targetSpeed==123&&bddev_motor.target==123);
 for(const auto& bad:{"@set speed 30001\n","@set speed -30001\n","@set speed -\n","@set speed 1.5\n","@set speed 9999999\n","@set speed 12x\n"}){
  auto count=bddev_motor.commands;command(bad);assert(targetSpeed==123&&bddev_motor.commands==count);
 }
 command("@set speed -30000\n");assert(targetSpeed==-30000&&bddev_motor.target==-30000);
 command("@set speed 30000\n");assert(targetSpeed==30000&&bddev_motor.target==30000);
 command("STOP\n");assert(!streaming&&targetSpeed==0&&bddev_motor.target==0);
 command("START\n");assert(streaming&&targetSpeed==0);now=1000;loop();
 `
};
for(const [name,trial] of Object.entries(trials)){
 const xml=fs.readFileSync(path.join(out,'examples',name+'.xml'),'utf8'),ws=h.load(xml),code=h.generate(ws);
 assert.equal(h.generate(h.load(h.save(ws))),code,name+' roundtrip');
 assert(!code.includes('delay('),name+' no blocking wait');
 const stripped=code.replace(/^\s*#.*$/mg,'');
 const cpp=path.join(dir,name+'.cpp'),binary=path.join(dir,name);
 fs.writeFileSync(cpp,stub+stripped+'\nint main(){'+common+trial+'std::cout<<Serial.tx.str();}\n');
 let result=spawnSync('g++',['-std=c++11',cpp,'-o',binary],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 result=spawnSync(binary,[],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 const parser=new P.Parser();let headers=0,states=0,samples=0;
 for(const row of result.stdout.split('\n').filter(Boolean)){
  const event=parser.parse(row);assert.notEqual(event.kind,'error',name+': '+row+' '+event.message);
  if(event.kind==='config')headers++;if(event.kind==='state')states++;if(event.kind==='sample')samples++;
 }
 assert(headers>=3&&states>=2&&samples>=1,name+' exercises headers, control confirmations and live values');
 console.log('PASS generated '+name+': complete commands, boot/START header, real controls, safe STOP, valid protocol');
}
