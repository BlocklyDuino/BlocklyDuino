/* Execute the actual scanner generated from its XML, with timed ADC/UART stubs. */
const {spawnSync}=require('node:child_process');
const {fs,path,assert,B,out,load,generate}=require('../project-device-tests/harness');
const P=require('../../blockly/apps/blocklyduino/serial_protocol');

function run(options={}) {
 const dir=path.resolve('.test-build/scanner-tests'); fs.mkdirSync(dir,{recursive:true});
 const xml=fs.readFileSync(path.join(out,'examples/61-serial-image-scanner.xml'),'utf8');
 const ws=load(xml), code=generate(ws); ws.dispose();
 assert(!code.includes('delay(')&&!code.includes('delayMicroseconds('),'No per-pixel motion wait');
 assert(!/\bString\b/.test(code),'No heap String command buffer');
 assert(code.includes('BxHardwareServo bddev_pan')&&code.includes('BxHardwareServo bddev_tilt'));
 assert(code.includes('writeMicroseconds(')&&!code.includes('.write('),'Servo coordinates use pulse microseconds');
 assert(xml.includes('Parameters — change these first')&&xml.includes('Internal state — normally leave unchanged'));
 for(const name of ['readPlotterCommand','announcePlotter','publishPixel','serviceMotion','serviceSamples']) {
  assert(code.includes('void '+name+'()'),'Readable named function: '+name);
 }
 const prototypes=Array.from(code.matchAll(/^void (\w+)\(\)/gm),m=>'void '+m[1]+'();').join('\n');
 const preamble=`#include <Arduino.h>
#include <BlocklyHardwareServo.h>
#include <cassert>
#include <iostream>
#include <cstdio>
uint64_t fakeTime=0;
int adcValue=512;
int (*adcReader)(uint64_t)=nullptr;
std::vector<AdcEvent> adcEvents;
std::vector<ServoEvent> servoEvents;
SerialMock Serial;
${prototypes}
`;
 const main=String.raw`
struct Pixel { unsigned x,y,value; };
std::vector<Pixel> pixels(){std::vector<Pixel> found;std::istringstream lines(Serial.output);std::string line;while(std::getline(lines,line)){Pixel p;if(std::sscanf(line.c_str(),"@pixel scan %u,%u,%u",&p.x,&p.y,&p.value)==3)found.push_back(p);}return found;}
void command(const std::string &line){Serial.push(line+"\n");while(Serial.available())loop();}
void runFor(uint64_t duration){uint64_t end=fakeTime+duration;while(fakeTime<end){loop();fakeTime+=50;}}
void basic(){command("STOP");command("@set width 3");command("@set height 2");command("@set sweep 120");command("@set samples 2");command("@set transition 50");command("@set settle 0");}
int delayedScene(uint64_t now){
 const uint64_t at=now-100000;int pulse=1500;
 for(auto it=servoEvents.rbegin();it!=servoEvents.rend();++it)if(it->pin==9&&it->time<=at){pulse=it->pulse;break;}
 return constrain((pulse-1100)*1023/800,0,1023);
}
unsigned rowDifference(const std::vector<Pixel> &p){assert(p.size()>=8);unsigned diff=0;for(unsigned x=0;x<4;++x)diff+=unsigned(std::abs(int(p[x].value)-int(p[7-x].value)));return diff;}
int main(){
 setup();assert(Serial.baud==115200&&settingsValid&&!streaming);
 assert(Serial.output.find("@plot ")==0&&Serial.output.find("@image-clear scan")!=std::string::npos);
 assert(imageWidth==32&&imageHeight==24&&brightnessLevels==1024&&multiSamples==4);
 assert(samplePeriodUs>=minimumAdcUs&&minSweepMs==188);
 Serial.output.clear();runFor(10000);assert(adcEvents.empty()&&pixels().empty());
 basic();command("@set levels 65536");command("START");
 Serial.output.clear();servoEvents.clear();adcEvents.clear();runFor(410000);
 auto p=pixels();assert(p.size()>=6);unsigned order[6][2]={{0,0},{1,0},{2,0},{2,1},{1,1},{0,1}};
 for(unsigned i=0;i<6;++i){assert(p[i].x==order[i][0]&&p[i].y==order[i][1]);assert(p[i].value==32800);}
 assert(streaming&&adcEvents.size()>=p.size()*2);
 assert(servoEvents.size()>p.size()*3); // motion updates between pixels
 for(const auto &a:adcEvents)assert(a.pin==A0);
 // Both gain and offset affect the actual pixel; the new header uses the same globals.
 command("@set gain 125");command("@set offset -10");assert(gainPercent==125&&offset==-10);
 Serial.output.clear();runFor(130000);p=pixels();assert(!p.empty());
 assert(p[0].value==unsigned((630.0/1023.0)*65535.0+0.5));
 // A changed geometry restarts from the held commanded pose after the header.
 int oldPan=currentPanUs,oldTilt=currentTiltUs;command("@set width 5");
 assert(imageWidth==5&&row==0&&pixel==0&&phase==1&&currentPanUs==oldPan&&currentTiltUs==oldTilt);
 assert(Serial.output.find("@image-clear scan")!=std::string::npos);
 // Invalid settings retain the value and report a canonical keyed state.
 long before=imageWidth;command("@set width 16385");assert(imageWidth==before&&!streaming&&phase==0);
 assert(Serial.output.find("@state {\"width\":5}")!=std::string::npos);
 command("@set samples 3.5");assert(multiSamples==2);
 command("@set levels 65537");assert(brightnessLevels==65536);
 command("@set gain NaN");assert(gainPercent==125);
 command("@set low 1023");assert(signalLow==0);
 command("@set high 0");assert(signalHigh==1023);
 command("@set pan0 543");assert(panStartUs==1100);
 command("@set both 2");assert(bidirectional==1);
 command("@set skip -1");assert(skipPixels==0);
 command("@set skip 5");assert(skipPixels==0);
 // Complete-line parsing; no suffix of an overlong line becomes a command.
 command(std::string(60,'x')+"START");assert(!streaming);
 Serial.push("STA");loop();assert(!streaming);Serial.push("RT\r\n");while(Serial.available())loop();assert(streaming);
 // Endpoints can run in either direction. A single row/column is supported.
 command("STOP");command("@set width 1");command("@set height 1");command("@set pan0 1900");command("@set pan1 1100");
 command("@set gain 100");command("@set offset 0");command("@set levels 2");adcValue=1023;command("START");
 Serial.output.clear();runFor(180000);p=pixels();assert(!p.empty()&&p[0].x==0&&p[0].y==0&&p[0].value==1);
 assert(targetTiltUs==1500&&panStartUs>panEndUs);
 // Timers cross micros() rollover without a missed row or burst of old pixels.
 command("STOP");fakeTime=uint64_t(0xffffffffUL)-20000;Serial.txEnd=fakeTime;
 command("START");fakeTime=(uint64_t(1)<<33)-10000;phaseStartedUs=micros();phase=3;pixel=0;samplesTaken=0;sampleSum=0;nextSampleUs=firstSampleUs;lastServoUs=micros();
 Serial.output.clear();runFor(130000);assert(streaming&&!pixels().empty());
 // A whole missed ADC interval stops visibly instead of catch-up sampling.
 phase=3;pixel=0;phaseStartedUs=micros()-nextSampleUs-samplePeriodUs-1;Serial.output.clear();loop();
 assert(!streaming&&phase==0&&Serial.output.find("Timing overrun")!=std::string::npos);
 // Large averaging is allowed by time, not an arbitrary 8/16/32-sample cap.
 command("@set sweep 20000");command("@set samples 65535");command("@set levels 65536");command("@set transition 0");command("START");
 Serial.output.clear();adcEvents.clear();runFor(20100000);p=pixels();assert(!p.empty()&&p[0].value==65535&&multiSamples==65535&&streaming);
 assert(adcEvents.size()>=65535);
 // One-direction rows always start at x=0, including an odd-height frame wrap.
 command("STOP");command("@set samples 1");command("@set width 3");command("@set height 3");command("@set sweep 90");command("@set pan0 1100");command("@set pan1 1900");command("@set transition 30");command("@set both 0");command("START");
 Serial.output.clear();runFor(510000);p=pixels();assert(p.size()>=12);
 for(unsigned i=0;i<12;++i){assert(p[i].x==i%3&&p[i].y==(i/3)%3);}
 command("@set both 1");Serial.output.clear();runFor(510000);p=pixels();assert(p.size()>=12);
 for(unsigned i=0;i<12;++i){unsigned r=i/3;assert(p[i].x==(r%2?2-i%3:i%3)&&p[i].y==r%3);}
 // A sensor reads an actual commanded servo pulse from 100 ms earlier.
 // Delaying capture by one 100 ms pixel period aligns both directions without
 // dropping columns, including the delayed tail after the servo reaches its end.
 command("STOP");command("@set width 4");command("@set height 2");command("@set sweep 400");command("@set transition 100");command("@set levels 1024");
 adcReader=delayedScene;command("START");Serial.output.clear();servoEvents.clear();runFor(1100000);auto lagged=pixels();assert(rowDifference(lagged)>1000);
 command("@set skip 1");assert(firstSampleUs==150000&&minWidth==2&&maxSkip==3);
 Serial.output.clear();servoEvents.clear();adcEvents.clear();uint64_t begun=fakeTime;runFor(1300000);p=pixels();
 assert(p.size()>=8&&rowDifference(p)<80&&streaming);
 for(unsigned i=0;i<8;++i)assert(p[i].x==(i<4?i:7-i)&&p[i].y==i/4);
 assert(adcEvents[0].time-begun>=250000);assert(adcEvents[3].time-adcEvents[0].time>=299000);
 assert(adcEvents[4].time-adcEvents[3].time>=249000); // next transition + skipped period
 adcReader=nullptr;command("STOP");command("@set width 1");assert(imageWidth==4&&skipPixels==1);
 command("@set skip 0");command("@set width 1");assert(imageWidth==1&&maxSkip==0);
 // Geometry is not capped by the old 3 s row: increase width directly and let
 // the board announce the minimum duration required by ADC/UART throughput.
 command("@set sweep 3000");command("@set width 1024");assert(imageWidth==1024&&sweepMs==6001&&pixelPeriodUs>=serialPixelBudgetUs);
 command("@set width 16384");assert(imageWidth==16384&&sweepMs==96011&&pixelPeriodUs>=serialPixelBudgetUs);
 // Limits reflect PC image capacity and ADC/UART budgets at actual dimensions.
 command("STOP");command("@set samples 1");command("@set sweep 2147483");command("@set width 16384");command("@set height 1024");
 assert(imageWidth==16384&&imageHeight==1024&&maxHeight==1024&&maxSamples==524);
 command("@set height 1025");assert(imageHeight==1024&&!streaming);
 command("@set samples 65535");assert(multiSamples==1);
 // Worst allowed delay extends beyond half a micros() wrap, but remains below
 // a full unsigned wrap with >130 ms for the final UART record and loop work.
 command("@set skip 16383");command("START");assert(skipPixels==16383&&firstSampleUs>2140000000UL);
 uint64_t duration=uint64_t(imageWidth-1)*pixelPeriodUs+firstSampleUs;
 assert(duration>(uint64_t(1)<<31)&&duration<(uint64_t(1)<<32)-130000);
 fakeTime=(uint64_t(1)<<32)-10000;Serial.txEnd=fakeTime;phaseStartedUs=micros();phase=3;pixel=imageWidth-1;samplesTaken=0;sampleSum=0;nextSampleUs=uint32_t(duration);lastServoUs=micros();
 fakeTime+=duration;Serial.output.clear();loop();loop();p=pixels();assert(p.size()==1&&p[0].x==16383&&streaming&&phase==1);
 // The percent-gain parameter and emitted header share the same integer value.
 gainPercent=1601;validateSettings();assert(!settingsValid);gainPercent=123;validateSettings();assert(settingsValid);
 std::cout<<Serial.history;
}
`;
 const source=path.join(dir,'scanner.cpp'),binary=path.join(dir,'scanner');
 fs.writeFileSync(source,preamble+code+main);
 const compile=spawnSync('g++',['-std=c++11','-Itests/scanner-tests/stubs','-Iarduino/libraries/BlocklySerial/src',source,'-o',binary],{encoding:'utf8'});
 assert.strictEqual(compile.status,0,compile.stdout+compile.stderr);
 const result=spawnSync(binary,[],{encoding:'utf8',maxBuffer:4*1024*1024});
 assert.strictEqual(result.status,0,result.stderr);
 const headers=result.stdout.split('\n').filter(line=>line.startsWith('@plot ')).map(line=>JSON.parse(line.slice(6)));
 assert(headers.length>20,'Runtime configuration changes emit actual headers');
 for(const header of headers)P.validate(header);
 const initial=headers[0];assert.strictEqual(initial.controls.length,17);
 assert.deepStrictEqual(initial.widgets[0].image,{id:'scan',width:32,height:24,mode:'gray',max:1023});
 const modes=new Set(initial.controls.map(c=>c.id));for(const id of ['width','height','gain','offset','samples','levels','pan0','pan1','tilt0','tilt1','sweep','transition','settle','low','high','both','skip'])assert(modes.has(id));
 assert.equal(initial.controls.find(c=>c.id==='both').type,'checkbox');
 assert.equal(initial.controls.find(c=>c.id==='width').max,16384);
 assert(headers.some(h=>h.widgets&&h.widgets[0]&&h.widgets[0].image.width===5),'Changed geometry appears in real header');
 assert(headers.some(h=>h.widgets&&h.widgets[0]&&h.widgets[0].image.max===65535),'High-depth output appears in real header');
 fs.writeFileSync(path.join(dir,'generated-headers.json'),JSON.stringify(headers,null,2)+'\n');
 if(!options.quiet)console.log('PASS generated scanner: 17 controls, one/both directions, delayed sensor alignment, complete rows, automatic resolution timing, averaging, rejection, high depth and full-duration micros rollover');
 return {headers,initial,code};
}
module.exports={run};
if(require.main===module)run();
