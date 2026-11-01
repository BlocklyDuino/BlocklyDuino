#!/usr/bin/env python3
"""Rebuild the small, commented Pro Mini lessons maintained here. No uploads."""
from pathlib import Path
import copy
import json
import xml.etree.ElementTree as E

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'blockly/apps/blocklyduino/examples'

def block(kind, fields=None, values=None, statements=None, comment=None, mutation=None):
    b = E.Element('block', type=kind)
    if mutation: E.SubElement(b, 'mutation', **{k:str(v) for k,v in mutation.items()})
    for k,v in (fields or {}).items(): E.SubElement(b,'field',name=k).text=str(v)
    for k,v in (values or {}).items():
        if v is not None: E.SubElement(b,'value',name=k).append(v)
    for k,v in (statements or {}).items():
        if v is not None: E.SubElement(b,'statement',name=k).append(v)
    if comment: E.SubElement(b,'comment',pinned='false',w='390',h='170').text=comment
    return b

def chain(*items):
    items=[i for i in items if i is not None]
    if not items:return None
    for a,b in zip(items,items[1:]):
        tail=a
        while tail.find('next/block') is not None: tail=tail.find('next/block')
        E.SubElement(tail,'next').append(b)
    return items[0]
def n(v): return block('math_number',{'NUM':v})
def var(v):return block('variables_get',{'VAR':v})
def flag(v):return block('logic_boolean',{'BOOL':'TRUE' if v else 'FALSE'})
def text(v):return block('text',{'TEXT':v})
def op(name,a,b):return block('math_arithmetic',{'OP':name},{'A':a,'B':b})
def mod(a,b):return block('math_modulo',values={'DIVIDEND':a,'DIVISOR':b})
def compare(name,a,b):return block('logic_compare',{'OP':name},{'A':a,'B':b})
def both(a,b):return block('logic_operation',{'OP':'AND'},{'A':a,'B':b})
def conditions(*xs):
    result=xs[0]
    for x in xs[1:]:result=both(result,x)
    return result
def assign(name,value,comment=None):return block('variables_set',{'VAR':name},{'VALUE':value},comment=comment)
def declare(name,kind='uint8_t',initial=None,comment=None):return block('arduino_typed_variable',{'VAR':name,'TYPE':kind},{'VALUE':initial if initial is not None else n(0)},comment=comment)
def arr(name,shape,kind='byte',comment=None):return block('arduino_array_declare',{'VAR':name,'TYPE':kind,'SIZE':shape},comment=comment)
def ref(name):return block('arduino_array_ref',{'VAR':name})
def cell(name,*indices):return block('arduino_array_get',{'VAR':name},{'INDEX'+('' if i==0 else str(i+1)):v for i,v in enumerate(indices)},mutation={'rank':len(indices)})
def put(name,indices,value,comment=None):return block('arduino_array_set',{'VAR':name},{**{'INDEX'+('' if i==0 else str(i+1)):v for i,v in enumerate(indices)},'VALUE':value},comment=comment,mutation={'rank':len(indices)})
def iff(test,yes,no=None,comment=None):return block('controls_if',values={'IF0':test},statements={'DO0':yes,'ELSE':no},mutation={'else':1} if no is not None else None,comment=comment)
def loop(body,comment):return block('arduino_loop_section',statements={'DO':body},comment=comment)
def setup(body,comment):return block('arduino_setup_section',statements={'DO':body},comment=comment)
def function(name,body,comment):return block('procedures_defnoreturn',{'NAME':name},statements={'STACK':body},comment=comment)
def call(name):return block('procedures_callnoreturn',{'NAME':name},mutation={'name':name})
def every(ms,body):return iff(compare('GTE',op('MINUS',block('arduino_millis'),var('lastSample')),n(ms)),chain(assign('lastSample',block('arduino_millis')),body),comment='Use elapsed milliseconds instead of delay. The command reader remains responsive between updates; unsigned subtraction also works when millis wraps.')
def serial(value,last=False):return block('serial_send',{'END':'println' if last else 'print'},{'VALUE':value})
def message(value,last=True,comment=None):return block('serial_text',{'TEXT':value,'END':'println' if last else 'print'},comment=comment)
def csv(*values):
    parts=[]
    for i,v in enumerate(values):
        parts.append(serial(v,i==len(values)-1))
        if i<len(values)-1:parts.append(message(',',False))
    return chain(*parts)
def data(profile,*values):
    parts=[message('@data {"id":"'+profile+'","t":',False),serial(block('arduino_millis')),message(',"values":[',False)]
    for i,v in enumerate(values):
        if i:parts.append(message(',',False))
        parts.append(serial(v))
    parts.append(message(']}'))
    return chain(*parts)
def header(profile):return message('@plot '+json.dumps(profile,separators=(',',':')),comment='This is an ordinary Serial text message stored in Flash. Click it to edit formatted JSON. The computer creates instruments and computes derived fields; this sketch sends only input values.')
def config(kind,uid,name,fields,comment):return block(kind,{'NAME':name,**fields},comment=comment,mutation={'uid':uid})
def action(kind,uid,values=None,fields=None,comment=None):return block(kind,{'DEVICE':uid,**(fields or {})},values,comment=comment)
def forloop(name,last,body,comment=None):return block('controls_for',{'VAR':name},{'FROM':n(0),'TO':n(last),'BY':n(1)},{'DO':body},comment=comment)
def write(filename,*blocks):
    xml=E.Element('xml')
    for i,b in enumerate(blocks):
        if b is None:continue
        b.set('x',str(30+(i%3)*480));b.set('y',str(30+(i//3)*260));xml.append(b)
    E.indent(xml,space='  ');(OUT/filename).write_text(E.tostring(xml,encoding='unicode')+'\n')

def command_matches(word, exact=True):
    checks=[compare('EQ' if exact else 'GTE',var('commandLength'),n(len(word))),compare('EQ',var('commandOverflow'),flag(False))]
    return conditions(*checks,*[compare('EQ',cell('commandBytes',n(i)),n(ord(c))) for i,c in enumerate(word)])

def bounded_reader(on_line, capacity=64):
    """One small fixed line buffer; complete commands only, no heap or wait."""
    finished=chain(iff(compare('EQ',var('commandOverflow'),flag(False)),on_line,message('@msg Command too long; shorten it and try again.')),assign('commandLength',n(0)),assign('commandOverflow',flag(False)))
    collect=iff(compare('NEQ',var('incoming'),n(13)),iff(compare('LT',var('commandLength'),n(capacity-1)),chain(put('commandBytes',[var('commandLength')],var('incoming')),assign('commandLength',op('ADD',var('commandLength'),n(1)))),assign('commandOverflow',flag(True))))
    body=block('controls_whileUntil',{'MODE':'WHILE'},{'BOOL':compare('GT',block('serial_available'),n(0))},{'DO':chain(declare('incoming','int',block('serial_read')),iff(compare('EQ',var('incoming'),n(10)),finished,collect))})
    f=function('readPlotterCommand',body,'Read one complete newline-terminated command. Partial lines stay in a fixed byte buffer. CR is ignored; oversized commands are discarded. There is no String allocation or waiting for bytes. Expand this reusable function to see the ordinary array and logic blocks.')
    f.set('collapsed','true')
    return [arr('commandBytes',str(capacity),'byte',comment='Fixed incoming line buffer, including room for a terminator. Charts, images and the JSON header stay on the computer/Flash, not in this array.'),declare('commandLength'),declare('commandOverflow','bool',flag(False)),f]

def integer_parser():
    """Reusable signed decimal parser. Set valueStart, then check commandValid."""
    digit=cell('commandBytes',var('parseAt'))
    step=iff(conditions(compare('GTE',digit,n(48)),compare('LTE',cell('commandBytes',var('parseAt')),n(57)),compare('LTE',var('commandNumber'),n(1000000))),assign('commandNumber',op('ADD',op('MULTIPLY',var('commandNumber'),n(10)),op('MINUS',cell('commandBytes',var('parseAt')),n(48)))),assign('commandValid',flag(False)))
    body=chain(assign('commandNumber',n(0)),assign('commandValid',flag(True)),declare('parseAt','uint8_t',var('valueStart')),declare('negative','bool',compare('EQ',cell('commandBytes',var('parseAt')),n(45))),iff(var('negative'),assign('parseAt',op('ADD',var('parseAt'),n(1)))),iff(compare('GTE',var('parseAt'),var('commandLength')),assign('commandValid',flag(False))),block('controls_whileUntil',{'MODE':'WHILE'},{'BOOL':both(var('commandValid'),compare('LT',var('parseAt'),var('commandLength')))},{'DO':chain(step,assign('parseAt',op('ADD',var('parseAt'),n(1))))}),iff(var('negative'),assign('commandNumber',op('MINUS',n(0),var('commandNumber')))))
    f=function('parseCommandNumber',body,'Parse a signed whole number from valueStart through the end of the command. Reject empty text, non-digits and oversized values before changing any setting. Each handler also checks its own permitted range and step.')
    f.set('collapsed','true')
    return [declare('valueStart'),declare('commandNumber','int32_t'),declare('commandValid','bool'),f]

def command_reader(on_start):
    finished=iff(command_matches('START'),chain(assign('streaming',flag(True)),assign('lastSample',block('arduino_millis')),on_start),iff(command_matches('STOP'),chain(assign('streaming',flag(False)),message('@msg Paused. Press Start to continue.'))))
    return [block('serial_config',{'BAUD':115200},comment='Upload, open Plotter at 115200 baud, Connect, then Start. The sketch sends its own dashboard and instructions; no manual configuration is needed.'),declare('streaming','bool',flag(False)),declare('lastSample','uint32_t')]+bounded_reader(finished,6)

def plot_example(filename,header_profile,sample,interval=50,extra=None,on_start=None,purpose=''):
    assert header_profile, 'Every Plotter lesson must announce its layout.'
    header_profile=copy.deepcopy(header_profile)
    header_profile.setdefault('description',purpose)
    announce=function('announcePlotter',chain(header(header_profile),message('@msg '+purpose+' Press Start to begin; Stop pauses readings.')),'Send this one header from setup and again after Start. It describes the views and gives the next action. Edit this text block to change the dashboard; data order must match fields.')
    announce.set('collapsed','true')
    start=chain(on_start,call('announcePlotter'))
    blocks=(extra or [])+command_reader(start)+[announce,setup(call('announcePlotter'),'Announce the dashboard immediately after upload/reset, before waiting for Start. Start repeats it if the computer connected later.')]
    blocks.append(loop(chain(call('readPlotterCommand'),iff(var('streaming'),every(interval,sample))),purpose+' Readings begin on Start. No long delay is used; Stop remains responsive.'))
    write(filename,*blocks)

def build_interactive_led():
    profile={'version':1,'id':'led-lab','title':'Your first interactive sketch','description':'Only the Pro Mini is needed. Watch its L / D13 LED. Change the interval, on-time and pattern below; the board confirms each change. Stop turns the LED off.','history':120,'fields':[{'id':'led','label':'Built-in LED','min':0,'max':1}],'widgets':[{'type':'line','fields':['led'],'min':0,'max':1}],'controls':[
        {'id':'period','type':'slider','label':'Blink interval','unit':'ms','min':100,'max':2000,'step':100,'value':500,'help':'One full on/off cycle. Drag, then release.'},
        {'id':'duty','type':'number','label':'On-time','unit':'%','min':10,'max':90,'step':10,'value':50,'help':'Percent of each cycle with the LED on.'},
        {'id':'enabled','type':'checkbox','label':'Enable LED','value':True},
        {'id':'pattern','type':'select','label':'Pattern','value':'blink','options':[{'value':'blink','label':'Blink'},{'value':'steady','label':'Steady light'}]},
        {'id':'message','type':'text','label':'Say something','maxLength':40,'value':'Hello','help':'The board replies in the message box.'},
        {'id':'restart','type':'button','label':'Restart blink cycle'}]}
    state=chain(message('@state {"period":',False),serial(var('period')),message(',"duty":',False),serial(var('duty')),message(',"enabled":',False),serial(var('enabled')),message(',"pattern":"',False),iff(compare('EQ',var('pattern'),n(0)),message('blink',False),message('steady',False)),message('","message":"',False),declare('character','uint8_t'),block('controls_whileUntil',{'MODE':'WHILE'},{'BOOL':both(compare('LT',var('character'),n(40)),compare('NEQ',cell('messageText',var('character')),n(0)))},{'DO':chain(iff(block('logic_operation',{'OP':'OR'},{'A':compare('EQ',cell('messageText',var('character')),n(34)),'B':compare('EQ',cell('messageText',var('character')),n(92))}),block('serial_write_byte',values={'VALUE':n(92)})),block('serial_write_byte',values={'VALUE':cell('messageText',var('character'))}),assign('character',op('ADD',var('character'),n(1))))}),message('"}'))
    statefn=function('sendControlState',state,'Confirm the values actually accepted by the board. JSON escaping preserves quotes and backslashes in the text control. This response updates the controls without sending another command.')
    statefn.set('collapsed','true')
    announce=function('announcePlotter',chain(header(profile),call('sendControlState'),message('@msg The L LED is already blinking. Try a slower interval, then Steady light. Type a message to hear back from the board.')),'Send the layout, current accepted values and a useful next step. Called on boot and on START, so opening Plotter later still works.')
    announce.set('collapsed','true')
    def set_number(prefix,name,lo,hi,step):
        valid=conditions(var('commandValid'),compare('GTE',var('commandNumber'),n(lo)),compare('LTE',var('commandNumber'),n(hi)),compare('EQ',mod(op('MINUS',var('commandNumber'),n(lo)),n(step)),n(0)))
        return chain(assign('valueStart',n(len(prefix))),call('parseCommandNumber'),iff(valid,chain(assign(name,var('commandNumber')),call('sendControlState'),message('@msg '+('Interval changed. Watch the L LED blink faster or slower.' if name=='period' else 'On-time changed. Watch how long the L LED stays lit in each cycle.'))),message('@msg Invalid '+name+': use '+str(lo)+'..'+str(hi)+' in steps of '+str(step)+'.')))
    copytext=chain(forloop('i',40,put('messageText',[var('i')],n(0))),declare('textAt'),declare('validText','bool',flag(True)),block('controls_whileUntil',{'MODE':'WHILE'},{'BOOL':compare('LT',op('ADD',var('textAt'),n(13)),var('commandLength'))},{'DO':chain(iff(compare('LT',cell('commandBytes',op('ADD',var('textAt'),n(13))),n(32)),assign('validText',flag(False))),put('messageText',[var('textAt')],cell('commandBytes',op('ADD',var('textAt'),n(13)))),assign('textAt',op('ADD',var('textAt'),n(1))))}),iff(var('validText'),chain(call('sendControlState'),message('@msg You said: ',False),serial(ref('messageText'),True)),message('@msg Use a single line of printable text.')))
    cases=[('START',chain(assign('streaming',flag(True)),call('announcePlotter'))),('STOP',chain(assign('streaming',flag(False)),message('@msg Paused: LED off. Press Start to continue.'))),('@set enabled 1',chain(assign('enabled',flag(True)),call('sendControlState'),message('@msg LED enabled.'))),('@set enabled 0',chain(assign('enabled',flag(False)),call('sendControlState'),message('@msg LED disabled. Enable it to resume the selected pattern.'))),('@set pattern blink',chain(assign('pattern',n(0)),call('sendControlState'),message('@msg Blink selected. Interval and on-time now change the light pattern.'))),('@set pattern steady',chain(assign('pattern',n(1)),call('sendControlState'),message('@msg Steady light selected. Choose Blink to use interval and on-time again.'))),('@do restart',chain(assign('cycleStart',block('arduino_millis')),message('@msg A fresh blink cycle starts now.')))]
    tail=iff(command_matches('@set message ',False),iff(compare('LTE',var('commandLength'),n(53)),copytext,message('@msg Message is too long: use at most 40 bytes.')),message('@msg Unknown command. Use the controls shown by this sketch.'))
    tail=iff(command_matches('@set duty ',False),set_number('@set duty ','duty',10,90,10),tail)
    tail=iff(command_matches('@set period ',False),set_number('@set period ','period',100,2000,100),tail)
    for name,body in reversed(cases):tail=iff(command_matches(name),body,tail)
    condition=conditions(var('streaming'),var('enabled'),block('logic_operation',{'OP':'OR'},{'A':compare('EQ',var('pattern'),n(1)),'B':compare('LT',mod(op('MINUS',block('arduino_millis'),var('cycleStart')),var('period')),op('MULTIPLY',op('DIVIDE',var('period'),n(100)),var('duty')))}))
    body=chain(call('readPlotterCommand'),assign('led',condition),iff(var('led'),block('inout_buildin_led',{'STAT':'HIGH'}),block('inout_buildin_led',{'STAT':'LOW'})),iff(var('streaming'),every(50,data('led-lab',var('led')))))
    initial=chain(*[put('messageText',[n(i)],n(ord(c))) for i,c in enumerate('Hello')],call('announcePlotter'))
    write('55-serial-auto-plot.xml',block('serial_config',{'BAUD':115200},comment='Purpose: use real controls on a tiny board. Wiring: USB-Serial only; L is the built-in D13 LED. Upload, open Plotter at 115200, Connect and Start. No manual dashboard setup.'),declare('period','uint16_t',n(500),'Change the initial interval here, and keep the header control default in sync. Plotter changes this variable while the program runs.'),declare('duty','uint8_t',n(50)),declare('enabled','bool',flag(True)),declare('pattern'),declare('streaming','bool',flag(True)),declare('led','bool'),declare('cycleStart','uint32_t'),declare('lastSample','uint32_t'),arr('messageText','41','char',comment='Up to 40 UTF-8 bytes plus a zero terminator. Received text is never executed as code.'),*integer_parser(),*bounded_reader(tail,64),statefn,announce,setup(initial,'Begin blinking immediately after upload. Announce the controls once here; Start also requests the current header and values.'),loop(body,'Update the LED continuously without delay. The period is one full cycle; duty is its on percentage. Send a 20 Hz graph sample while running. Try changing controls one at a time and watch both the LED and the graph.'))

def build_plotter():
    build_interactive_led()
    pot={'version':1,'id':'pot-dashboard','title':'Turn the potentiometer','history':200,'fields':[{'id':'adc','label':'ADC','min':0,'max':1023},{'id':'volts','label':'Voltage','unit':'V','min':0,'max':5,'derive':{'op':'formula','expr':'adc * 5 / 1023'}}],'widgets':[{'type':'gauge','field':'volts'},{'type':'bar','field':'adc'},{'type':'line','fields':['adc']},{'type':'raw','fields':['adc','volts']}]}
    plot_example('56-serial-dashboard.xml',pot,data('pot-dashboard',block('inout_analog_read',{'PIN':'A0'})),purpose='Potentiometer dashboard: A0 wiper, outer legs GND/VCC. Send one ADC number; Plotter computes volts assuming 5 V ADC reference. Change the formula for a different measured reference.')
    mixed={'version':1,'id':'mixed','title':'One stream, five views','history':180,'fields':[{'id':'a','label':'Knob','min':0,'max':1023},{'id':'b','label':'Triangle','min':0,'max':1023},{'id':'seconds','unit':'s'}],'widgets':[{'type':'line','fields':['a','b']},{'type':'gauge','fields':['a','b'],'min':0,'max':1023},{'type':'bar','fields':['a','b'],'min':0,'max':1023},{'type':'xy','series':[{'x':'seconds','y':'a','label':'Knob'},{'x':'seconds','y':'b','label':'Triangle'}]},{'type':'raw','fields':['a','b','seconds']}]}
    triangle=iff(compare('LT',var('phase'),n(100)),assign('triangle',op('MULTIPLY',var('phase'),n(10))),assign('triangle',op('MULTIPLY',op('MINUS',n(199),var('phase')),n(10))))
    plot_example('73-plotter-mixed-dashboard.xml',mixed,chain(triangle,data('mixed',block('inout_analog_read',{'PIN':'A0'}),var('triangle'),op('DIVIDE',block('arduino_millis'),n(1000.0))),assign('phase',mod(op('ADD',var('phase'),n(1)),n(200)))),extra=[declare('phase'),declare('triangle','uint16_t')],on_start=assign('phase',n(0)),purpose='Compare a real A0 signal with a generated triangle. One CSV-like data record feeds overlaid lines, two needles on one gauge, side-by-side bars, two XY traces and a raw table. Optional potentiometer on A0. Both signals use the same 0–1023 scale.')
    def maths(title,window):return {'version':1,'id':'maths','title':title,'history':240,'fields':[{'id':'signal','label':'Signal','unit':'V','min':0,'max':5},{'id':'smooth','label':'Mean','unit':'V','derive':{'op':'mean','source':'signal','window':window}},{'id':'rms','unit':'V','derive':{'op':'rms','source':'signal','window':window}},{'id':'slope','unit':'V/s','derive':{'op':'derivative','source':'signal','time':'device'}},{'id':'area','unit':'V·s','derive':{'op':'integral','source':'signal','time':'device'}},{'id':'peak','unit':'V','derive':{'op':'max','source':'signal','window':window}},{'id':'low','unit':'V','derive':{'op':'min','source':'signal','window':window}},{'id':'sum','derive':{'op':'sum','source':'signal'}}],'widgets':[{'type':'line','fields':['signal','smooth','rms']},{'type':'line','fields':['slope']},{'type':'gauge','fields':['signal','smooth'],'min':0,'max':5},{'type':'raw','fields':['area','slope','peak','low','sum']}]}
    plot_example('74-plotter-live-math.xml',maths('PC mathematics: 4-sample window',4),chain(iff(compare('EQ',var('samples'),n(100)),header(maths('Live update: 20-sample window',20)),comment='After five seconds, send a new header while running. It replaces the dashboard and resets calculation state. The stream continues; no Arduino reset or new Start is needed.'),data('maths',op('DIVIDE',op('MULTIPLY',block('inout_analog_read',{'PIN':'A0'}),n(5.0)),n(1023))),assign('samples',op('ADD',var('samples'),n(1)))),extra=[declare('samples','uint32_t')],on_start=assign('samples',n(0)),purpose='Send one A0 voltage and a millisecond timestamp. Plotter computes moving mean/RMS/min/max, slope, running sum and trapezoidal integral. Integral units are volt-seconds, not energy. A new header at sample 100 changes the averaging window and restarts the calculations. Capture records the configuration changes too.')
    # Independently maintained scanner: rebuild only through its own builder.
    import runpy
    runpy.run_path(str(ROOT/'tools/build-photocell-example.py'))['build']()
    rgb={'version':1,'id':'rgb-demo','title':'Paint a rainbow, one pixel at a time','history':128,'fields':[{'id':'red','min':0,'max':255},{'id':'green','min':0,'max':255},{'id':'blue','min':0,'max':255}],'widgets':[{'type':'image','image':{'id':'rainbow','width':32,'height':24,'mode':'rgb','max':255}},{'type':'line','fields':['red','green','blue']},{'type':'bar','fields':['red','green','blue'],'min':0,'max':255}]}
    rgb_advance=chain(assign('x',op('ADD',var('x'),n(1))),iff(compare('GTE',var('x'),n(32)),chain(assign('x',n(0)),assign('y',op('ADD',var('y'),n(1))),iff(compare('GTE',var('y'),n(24)),chain(assign('y',n(0)),assign('phase',mod(op('ADD',var('phase'),n(32)),n(256))))))))
    rgb_sample=chain(declare('red','byte',op('MULTIPLY',var('x'),n(8))),declare('green','byte',op('MULTIPLY',var('y'),n(11))),declare('blue','byte',var('phase')),message('@pixel rainbow ',False),csv(var('x'),var('y'),var('red'),var('green'),var('blue')),data('rgb-demo',var('red'),var('green'),var('blue')),rgb_advance)
    plot_example('75-plotter-rgb-paint.xml',rgb,rgb_sample,interval=10,extra=[declare('x'),declare('y'),declare('phase')],on_start=chain(assign('x',n(0)),assign('y',n(0)),assign('phase',n(0))),purpose='No external hardware. Paint a 32×24 RGB gradient and redraw it with a changing blue channel. Pixel values remain on the computer until overwritten; Save image exports the visible frame. Charts and bars receive the same colour values. Only coordinates and three colours occupy MCU RAM.')

def build_lcd():
    uid='glyph72'
    glyph=[0,10,10,0,17,14,0,0]
    initial=chain(*[put('faceRows',[n(i)],n(v),'Five bits across, one byte per row. Bit 4 is the leftmost dot; binary 01010 = decimal 10 makes two eyes.' if i==1 else None) for i,v in enumerate(glyph)],action('device_lcd_create_glyph',uid,{'SLOT':n(0),'ROWS':ref('faceRows')},comment='Store the face in CGRAM slot 0. The LCD has eight slots, not eight symbols per line. All displayed occurrences change if this slot is redefined.'),action('device_lcd_show_glyph',uid,{'SLOT':n(0),'COL':n(19),'ROW':n(0)},comment='A single-glyph action also accepts variable slot and position. The animation below will replace this with a complete buffer.'))
    frame=chain(forloop('row',3,forloop('column',19,put('frame',[var('row'),var('column')],n(32))),comment='Prepare a blank 80-byte frame using ASCII space (32). In raw mode zero means glyph 0, so zero is deliberately not our blank value.'),put('frame',[n(1),var('position')],n(0),comment='Write the face slot number into an ordinary buffer cell. Slots 0–7 work; normal characters use their LCD character codes.'),put('frame',[n(2),op('MINUS',n(19),var('position'))],n(0)),action('device_lcd_buffer',uid,{'BUFFER':ref('frame')},{'LAYOUT':'YX','ENCODING':'RAW'},'Send the finished frame once, without clearing the LCD. This avoids exposing intermediate RAM edits. The I2C transfer itself still takes time; this is not an instantaneous display swap.'),assign('position',mod(op('ADD',var('position'),n(1)),n(20))))
    write('72-lcd-custom-glyph-buffer.xml',config('device_lcd',uid,'display',{'ADDR':'0x27','COLS':20,'ROWS':4},'Two faces chase each other on a 20×4 HD44780 LCD with PCF8574 I2C backpack. Pro Mini SDA=A4, SCL=A5. Adjust 0x27 if your module differs. Eight row bytes draw a reusable 5×8 glyph; an 80-byte frame holds character codes.'),arr('faceRows','8',comment='One glyph is eight byte rows, values 0–31. Edit these eight assignments in setup to draw another face.'),arr('frame','4,20',comment='Rows first: frame[row][column]. 80 bytes of character codes, not 80 glyph definitions.'),declare('position'),declare('lastSample','uint32_t'),setup(initial,'Define custom symbols once after LCD initialization. The definition does not draw them until a show-glyph or buffer action writes the slot code.'),loop(every(140,frame),'Build both moving faces in RAM and send the finished frame every 140 ms. No delay is used, so other loop tasks can run between updates. Try a second glyph in slot 1.'))

def build_named_devices():
    # Replace pin-repeating legacy lessons with the same hardware, named once.
    ds={'version':1,'id':'temperature','title':'DS18B20 thermometer','history':100,'fields':[{'id':'temperature','unit':'°C'}],'widgets':[{'type':'line','fields':['temperature']},{'type':'gauge','field':'temperature','min':0,'max':50}]}
    plot_example('07-ds18b20-serial.xml',ds,chain(declare('temperature','float',action('device_ds_read','temp07',{'INDEX':n(0)})),iff(compare('GT',var('temperature'),n(-126)),data('temperature',var('temperature')),message('@msg Sensor not found. Check DS18B20 power, D2 data and its 4.7 kOhm pull-up.')),action('device_ds_request','temp07')),interval=800,extra=[config('device_ds18b20','temp07','thermometer',{'PIN':2},'DS18B20 data D2 with 4.7 kΩ pull-up to VCC, VDD to VCC and GND to GND. Powered 3-wire sensor. Conversion starts in setup; the first sample waits 800 ms. -127 means disconnected; 85 may indicate no completed conversion.')],on_start=action('device_ds_request','temp07'),purpose='Nonblocking thermometer: read the previous conversion, start the next, and let loop continue during the 750 ms maximum conversion. Press Plotter Start; temperature is shown as a chart and gauge.')
    dht={'version':1,'id':'climate','title':'DHT22 room climate','history':100,'fields':[{'id':'temperature','unit':'°C'},{'id':'humidity','unit':'%','min':0,'max':100}],'widgets':[{'type':'line','fields':['temperature']},{'type':'gauge','field':'humidity'},{'type':'raw','fields':['temperature','humidity']}]}
    plot_example('22-dht22-serial.xml',dht,chain(declare('temperature','float',action('device_dht_read','dht22',fields={'READ':'TEMP'})),declare('humidity','float',action('device_dht_read','dht22',fields={'READ':'HUM'})),iff(both(compare('EQ',var('temperature'),var('temperature')),compare('EQ',var('humidity'),var('humidity'))),data('climate',var('temperature'),var('humidity')),message('@msg DHT read failed: check the D2 data wire, supply and pull-up. Keep the DHT22 model selected.'),comment='NaN is not equal to itself. Only send complete valid samples; diagnostic text remains visible in Monitor, and is not plotted as a number.')),interval=2100,extra=[config('device_dht','dht22','climate',{'PIN':2,'MODEL':'DHT22'},'DHT22 data D2, supply and common GND. A bare sensor needs a data pull-up (typically 4.7–10 kΩ); breakout boards may include it. The selected model must match your sensor.')],purpose='Read DHT22 no faster than once per 2.1 seconds. Temperature and humidity use separate scales. Sensor access briefly blocks for the protocol; millis scheduling avoids adding a long delay around it.')
    write('25-ir-nec-serial.xml',config('device_ir_nec','ir25','remote',{'PIN':2},'NEC-compatible receiver output D2, correct module supply and common ground. This is a demodulating IR receiver, not a bare photodiode. Library sampling uses Timer2 on ATmega168; do not also allocate that timer to audio or timer interrupts.'),block('serial_config',{'BAUD':115200}),loop(chain(declare('command','int32_t',action('device_ir_command','ir25')),iff(compare('GTE',var('command'),n(0)),serial(var('command'),True))),'Read the next received command once into a variable. Print only valid frames; -1 means no frame. Open Monitor at 115200 and press buttons on an NEC remote. Avoid delay so new frames are handled promptly.'))
    write('26-74hc595-pattern.xml',config('device_shift595','shift26','lamps',{'DATA':8,'CLOCK':9,'LATCH':10},'74HC595 SER→D8, SRCLK→D9, RCLK→D10; OE→GND, MR→VCC, VCC/GND as appropriate. Use a resistor per LED on Q0–Q7. The named action reuses these three wires.'),declare('position'),declare('lastSample','uint32_t'),loop(every(150,chain(action('device_shift595_write','shift26',{'VALUE':block('ll_bits_shift',{'OP':'SHL','WIDTH':'8'},{'VALUE':n(1),'COUNT':var('position')})},comment='Shift a single 1 across eight output bits, latch once, then advance the index. This teaches a bit pattern without eight separate digital writes.'),assign('position',mod(op('ADD',var('position'),n(1)),n(8))))),'A single LED chases along eight outputs. No delay: additional tasks can run between the 150 ms updates.'))
    write('10-ssd1306-spi.xml',config('device_oled_spi','oled10','screen',{'CS':10,'DC':9,'RESET':8},'SSD1306 128×64 SPI OLED: CS D10, DC D9, RESET D8, MOSI D11, SCK D13. Match the supply and input levels of your module. U8x8 sends text directly, so no full framebuffer consumes the 1 KB RAM.'),declare('lastSample','uint32_t'),declare('seconds','uint32_t'),setup(action('device_oled_print','oled10',{'TEXT':text('Tiny RAM, big fun'),'COL':n(0),'ROW':n(0)}),'Initialize the named SPI OLED once and write a heading. Text coordinates are character cells: columns 0–15, rows 0–7.'),loop(every(1000,chain(action('device_oled_print','oled10',{'TEXT':var('seconds'),'COL':n(0),'ROW':n(3)}),assign('seconds',op('ADD',var('seconds'),n(1))))),'Update the seconds counter once per second. For pixel patterns see the packed-buffer lesson; small tiles work on ATmega168.'))
    motor='coils30'
    write('30-accelstepper-28byj.xml',config('device_stepper_coils',motor,'motor',{'IN1':8,'IN2':9,'IN3':10,'IN4':11,'SPEED':500,'ACCEL':100},'28BYJ-48 through ULN2003: IN1 D8, IN2 D9, IN3 D10, IN4 D11. Separate appropriate motor supply, common GND. AccelStepper uses half steps and switches these four GPIOs in software; PWM pins are not required.'),declare('target','int32_t',n(512)),setup(action('device_stepper_move',motor,{'VALUE':var('target')},{'MODE':'TO'}),'Set the first absolute target. This only requests movement; loop must service it.'),loop(chain(action('device_stepper_run',motor),iff(compare('EQ',action('device_stepper_position',motor,fields={'READ':'DISTANCE'}),n(0)),chain(assign('target',op('MINUS',n(0),var('target'))),action('device_stepper_move',motor,{'VALUE':var('target')},{'MODE':'TO'})))),'Call run on every pass. At each target, reverse to the other position with acceleration and deceleration. No delay or slow display writes here; those would interrupt software pulse generation.'))

def build_echo():
    p={'version':1,'id':'echo','title':'Talk to the board','description':'Only USB–Serial is needed. Type a short message and send it. The board receives the characters and sends the reply below.','fields':[],'widgets':[],'controls':[{'id':'text','type':'text','label':'Message to the board','maxLength':40,'value':'Hello'}]}
    announce=function('announcePlotter',chain(header(p),message('@msg Ready. Type a message above and send it; the reply comes from the board.')),'The board defines its own text input and instruction. No manual Plotter configuration is needed.');announce.set('collapsed','true')
    def chars(json=False):
        index='jsonAt' if json else 'echoAt'
        body=chain(iff(block('logic_operation',{'OP':'OR'},{'A':compare('EQ',cell('commandBytes',var(index)),n(34)),'B':compare('EQ',cell('commandBytes',var(index)),n(92))}),block('serial_write_byte',values={'VALUE':n(92)})) if json else None,block('serial_write_byte',values={'VALUE':cell('commandBytes',var(index))}),assign(index,op('ADD',var(index),n(1))))
        return chain(declare(index,'uint8_t',n(10)),block('controls_whileUntil',{'MODE':'WHILE'},{'BOOL':compare('LT',var(index),var('commandLength'))},{'DO':body}))
    reply=chain(message('@msg Board received: ',False),chars(),message(''),message('@state {"text":"',False),chars(True),message('"}'))
    commands=iff(command_matches('START'),call('announcePlotter'),iff(command_matches('STOP'),message('@msg Echo is ready; send another message whenever you want.'),iff(both(command_matches('@set text ',False),compare('LTE',var('commandLength'),n(50))),reply,message('@msg Use the Message field above, then send.'))))
    write('54-serial-monitor-echo.xml',block('serial_config',{'BAUD':115200}),announce,*bounded_reader(commands,52),setup(call('announcePlotter'),'Announce the text control on boot and again when Start is pressed.'),loop(call('readPlotterCommand'),'Read complete incoming lines without waiting. Reply with ordinary Serial bytes; quotes and backslashes are escaped only inside the @state JSON response. Try text with spaces and punctuation.'))

def build_additional_sensors():
    distance={'version':1,'id':'distance','title':'Move an object in front of the sensor','fields':[{'id':'cm','label':'Distance','unit':'cm','min':0,'max':200}],'widgets':[{'type':'gauge','field':'cm'},{'type':'line','fields':['cm']}]}
    plot_example('23-hc-sr04-serial.xml',distance,chain(declare('distance','float',action('device_ultrasonic_read','range23')),iff(compare('GTE',var('distance'),n(0)),data('distance',var('distance')),message('@msg No echo. Put a flat object 5–200 cm in front of the sensor; check TRIG D3 and ECHO D4.'))),interval=100,extra=[config('device_ultrasonic','range23','range',{'TRIG':3,'ECHO':4},'HC-SR04: TRIG D3, ECHO D4, 5V supply and common GND. Place a flat target in front of the transducers. A read can wait up to 30 ms for an echo.')],purpose='HC-SR04 distance in cm. Move a flat object toward and away from the sensor; change the header gauge maximum to zoom the scale.')
    remote={'version':1,'id':'remote','title':'Which remote button did you press?','fields':[{'id':'command','label':'NEC command'}],'widgets':[{'type':'raw','fields':['command']}]}
    plot_example('25-ir-nec-serial.xml',remote,chain(declare('command','int32_t',action('device_ir_command','ir25')),iff(compare('GTE',var('command'),n(0)),chain(data('remote',var('command')),message('@msg Button received. Press another remote button and compare its command value.')))),interval=5,extra=[config('device_ir_nec','ir25','remote',{'PIN':2},'NEC-compatible demodulating receiver output D2, correct module supply and common GND. Timer2 is used for reception; do not share it with an independent sound engine.')],purpose='Press buttons on an NEC remote aimed at the receiver. Each valid command appears in the table; no frame does not create a fake zero.')
    radar={'version':1,'id':'radar','title':'Servo sweep and distance','fields':[{'id':'angle','unit':'deg','min':30,'max':150},{'id':'distance','unit':'cm','min':0,'max':200}],'widgets':[{'type':'xy','x':'angle','y':'distance','xMin':30,'xMax':150,'yMin':0,'yMax':200},{'type':'gauge','field':'distance'}]}
    sample=chain(declare('distance','float',action('device_ultrasonic_read','range35')),iff(compare('GTE',var('distance'),n(0)),data('radar',var('angle'),var('distance')),message('@msg No echo at this angle. Check the target and sensor wiring.')),assign('angle',op('ADD',var('angle'),var('direction'))),iff(block('logic_operation',{'OP':'OR'},{'A':compare('GTE',var('angle'),n(150)),'B':compare('LTE',var('angle'),n(30))}),assign('direction',op('MINUS',n(0),var('direction')))),action('device_servo_write','servo35',{'ANGLE':var('angle')}))
    plot_example('35c-named-radar.xml',radar,sample,interval=100,extra=[config('device_servo','servo35','pan',{'PIN':9,'ENGINE':'HARDWARE'},'Servo signal D9, appropriate servo power and common GND. Keep the 30–150 degree sweep clear.'),config('device_ultrasonic','range35','range',{'TRIG':5,'ECHO':6},'HC-SR04 TRIG D5, ECHO D6, supply and GND. Mount the sensor on the servo.'),declare('angle','int16_t',n(30)),declare('direction','int16_t',n(5))],on_start=action('device_servo_write','servo35',{'ANGLE':var('angle')}),purpose='The servo scans 30–150 degrees. XY shows distance against angle; it is an angle/distance plot, not a Cartesian radar image. First measurement waits 100 ms after positioning.')

def adapt_existing_serial():
    """Keep small educational algorithms; give them an explicit viewing contract."""
    import runpy
    catalogue=runpy.run_path(str(ROOT/'tools/build-example-catalog.py'))
    selected={'12','31','32','33','34','36a','36b','36c','41','46','47','51','52','53','57','58'}
    graph_fields={'31':[{'id':'count','label':'Blink count'}],'53':[{'id':'edges','label':'Input edges'}],'57':[{'id':'pulses','label':'D2 edges'}],'58':[{'id':'left','label':'D4 edges'},{'id':'right','label':'D5 edges'}]}
    for path in sorted(OUT.glob('*.xml')):
        prefix=path.name.split('-')[0]
        if prefix not in selected:continue
        root=E.parse(path).getroot()
        if any(b.get('type')=='procedures_defnoreturn' and b.findtext("field[@name='NAME']")=='announcePlotter' for b in root.findall('block')):continue
        # Use one language for public lesson names and variable/function labels.
        replacements={'skaicius':'count','mirktelti':'blinkOnce','rezultatas':'result'}
        for f in root.iter('field'):
            if f.text in replacements:f.text=replacements[f.text]
        for m in root.iter('mutation'):
            if m.get('name') in replacements:m.set('name',replacements[m.get('name')])
        purpose=catalogue['purposes'][prefix]
        profile={'version':1,'id':'lesson-'+prefix,'title':catalogue['names'][prefix],'description':purpose+' '+catalogue['changes'][prefix],'fields':graph_fields.get(prefix,[]),'widgets':[]}
        if prefix in graph_fields:profile['widgets']=[{'type':'line','fields':[f['id'] for f in profile['fields']]},{'type':'raw','fields':[f['id'] for f in profile['fields']]}]
        announce=function('announcePlotter',chain(header(profile),message('@msg '+purpose+' '+('Readings run automatically. ' if prefix in graph_fields else 'Results appear in the message log. ')+catalogue['changes'][prefix])),'The sketch describes its output to Plotter. This shared function runs at boot and when Start requests the dashboard again.');announce.set('collapsed','true')
        # Literal setup messages must not be interpreted as graph data.
        for b in list(root.iter('block')):
            if b.get('type')=='serial_text' and b.findtext("field[@name='END']")=='println':
                f=b.find("field[@name='TEXT']")
                if f is not None and not (f.text or '').startswith('@'):f.text='@msg '+(f.text or '')
            if b.get('type')=='serial_print' and b.find("value[@name='CONTENT']/block[@type='text']") is not None:
                textfield=b.find("value[@name='CONTENT']/block/field[@name='TEXT']")
                if textfield is not None:textfield.text='@msg '+(textfield.text or '')
        if not any(b.get('type')=='serial_config' for b in root.findall('block')):root.insert(0,block('serial_config',{'BAUD':115200}))
        else:
            for b in root.findall("block[@type='serial_config']"):b.find("field[@name='BAUD']").text='115200'
        root.append(declare('streaming','bool',flag(True)))
        start=chain(assign('streaming',flag(True)),call('announcePlotter'))
        # Memory demonstrations write once in setup. Start reads values again;
        # it must never wear EEPROM or erase Flash just to reconnect the viewer.
        if prefix in {'36a','36b','36c'}:
            for b in root.findall("block[@type='arduino_setup_section']"):
                for x in b.iter('block'):
                    if x.get('type')=='serial_print':
                        cloned=copy.deepcopy(x);nxt=cloned.find('next')
                        if nxt is not None:cloned.remove(nxt)
                        start=chain(start,cloned)
        commands=iff(command_matches('START'),start,iff(command_matches('STOP'),chain(assign('streaming',flag(False)),message('@msg Output paused. Press Start to continue.'))))
        root.extend(bounded_reader(commands,6));root.append(announce)
        init=root.find("block[@type='arduino_setup_section']")
        if init is None:root.append(setup(call('announcePlotter'),'Announce the view immediately after upload/reset.'))
        else:
            statement=init.find("statement[@name='DO']")
            if statement is None:statement=E.SubElement(init,'statement',name='DO')
            old=statement.find('block')
            if old is not None:statement.remove(old)
            statement.append(chain(call('announcePlotter'),old))
        main=root.find("block[@type='arduino_loop_section']")
        if main is None:
            body=None
            if prefix=='12':
                body=root.find("block[@type='i2c_scan_serial']");root.remove(body)
            root.append(loop(chain(call('readPlotterCommand'),iff(var('streaming'),body) if body is not None else None),'The command reader responds to Start/Stop. The existing lesson algorithm stays inside the running branch.'))
        else:
            statement=main.find("statement[@name='DO']")
            old=statement.find('block') if statement is not None else None
            if statement is None:statement=E.SubElement(main,'statement',name='DO')
            if old is not None:statement.remove(old)
            statement.append(chain(call('readPlotterCommand'),iff(var('streaming'),old)))
        for i,b in enumerate(root.findall('block')):
            b.set('x',str(30+(i%3)*480));b.set('y',str(30+(i//3)*260))
        E.indent(root,space='  ');path.write_text(E.tostring(root,encoding='unicode')+'\n')

def refresh_lesson_comments():
    import runpy
    catalog=runpy.run_path(str(ROOT/'tools/build-example-catalog.py'))
    boilerplate=('Hardware: use Connections to check pin ownership','Send this value/text to the computer. A new line finishes','Evaluate the condition first. Execute the enclosed actions','Store the calculated value in this variable. Later blocks read','Runs once after power-on or reset. Initialise the program','Repeats until power is removed. Each block runs in order')
    for path in sorted(OUT.glob('[0-9]*.xml')):
        prefix=path.name.split('-')[0]
        if prefix in {'59','60','61','70'}:continue # Independent control/scanner builders own their comments/layout.
        root=E.parse(path).getroot();types={b.get('type') for b in root.iter('block')};purpose=catalog['purposes'][prefix]
        lesson=catalog['lesson_notes'](root,prefix,[],purpose,types)
        for b in root.iter('block'):
            c=b.find('comment')
            if c is not None and any(x in (c.text or '') for x in boilerplate):b.remove(c)
        first=root.find('block')
        if first is not None:
            c=first.find('comment')
            if c is None:c=E.SubElement(first,'comment',pinned='false',w='480',h='240')
            c.text='Purpose: '+purpose+'\nWiring: '+lesson['wiring']+'\nTry: '+lesson['change']
        E.indent(root,space='  ');path.write_text(E.tostring(root,encoding='unicode')+'\n')

if __name__=='__main__':
    build_plotter();build_lcd();build_named_devices();build_echo();build_additional_sensors();adapt_existing_serial();refresh_lesson_comments()
