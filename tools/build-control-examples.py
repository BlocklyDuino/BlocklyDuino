#!/usr/bin/env python3
"""Rebuild interactive interrupt and Timer1 motion lessons. Never uploads."""
from pathlib import Path
import importlib.util

spec = importlib.util.spec_from_file_location('guided', Path(__file__).with_name('build-guided-examples.py'))
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)
for name in ('block chain n var flag text op compare conditions assign declare iff loop setup function call every serial message csv header config action write command_matches bounded_reader integer_parser').split():
    globals()[name] = getattr(g, name)

def atomic(body):
    return block('avr_atomic', statements={'DO': body}, comment='Copy or clear the shared counter atomically: an interrupt must not change half of a multibyte value during this operation.')

def volatile(name, kind):
    result = declare(name, kind, comment='The interrupt changes this counter. Keep the handler short and copy the value atomically before displaying it.')
    g.E.SubElement(result, 'field', name='QUALIFIER').text = 'volatile'
    return result

def folded(name, body, comment):
    result = function(name, body, comment)
    result.set('collapsed', 'true')
    return result

def choose(cases, fallback=None):
    result = fallback if fallback is not None else message('@msg Use the controls shown by this sketch.')
    for command, body in reversed(cases):
        result = iff(command_matches(command), body, result)
    return result

def base(purpose):
    return [block('serial_config', {'BAUD': 115200}, comment=purpose+' Upload, connect Plotter at 115200 baud, then Start. The board sends the complete layout and instructions.'),
            declare('streaming', 'bool', flag(True)), declare('lastSample', 'uint32_t')]

def timer_control(operation):
    return block('irq_timer1_control', {'ACTION': operation})

def timer_lesson():
    profile = {'version':1, 'id':'timer', 'title':'Timer1 counts without blocking',
        'description':'Only the board and USB-Serial are needed. The counter rises 10 times per second. Uncheck Running to freeze it. Clear resets the count; Restart begins a fresh timer period.',
        'fields':[{'id':'ticks','label':'Interrupt count'}, {'id':'running','type':'boolean'}],
        'widgets':[{'type':'line','fields':['ticks'],'min':0}, {'type':'raw','fields':['ticks','running']}],
        'controls':[{'id':'running','type':'checkbox','label':'Running','value':True},
                    {'id':'clear','type':'button','label':'Clear count'}, {'id':'restart','type':'button','label':'Restart timer'}]}
    state = folded('sendControlState', chain(message('@state {"running":',False),serial(block('irq_timer1_running')),message('}')),
        'Report whether Timer1 is actually enabled. This updates the checkbox without sending another command.')
    announce = folded('announcePlotter', chain(header(profile),message('@msg Watch the count rise. Running pauses/resumes it; Clear sets it to zero.')),
        'Send the same dashboard on boot and on Start. Edit this Serial text to change its appearance.')
    changed = lambda: call('sendControlState')
    commands = choose([
        ('START', chain(assign('streaming',flag(True)),timer_control('RESTART'),call('announcePlotter'),changed())),
        ('STOP', chain(assign('streaming',flag(False)),timer_control('PAUSE'),changed(),message('@msg Timer paused. Press Start to resume counting.'))),
        ('@set running 1',chain(timer_control('RESTART'),changed(),message('@msg Counting again: ten interrupts per second.'))),
        ('@set running 0',chain(timer_control('PAUSE'),changed(),message('@msg Timer paused; the last count stays visible.'))),
        ('@do clear',chain(atomic(assign('tickCount',n(0))),message('@msg Count cleared.'))),
        ('@do restart',chain(timer_control('RESTART'),changed(),message('@msg A fresh timer period starts now. The count is retained.')))
    ])
    count = atomic(assign('snapshot',var('tickCount')))
    sample = chain(count,csv(var('snapshot'),block('irq_timer1_running')))
    write('59-timer-interrupt.xml',*base('Use Timer1 to count at 10 Hz while loop remains available.'),
        volatile('tickCount','uint32_t'),declare('snapshot','uint32_t'),
        block('irq_timer1', values={'PERIOD_US':n(100000)}, statements={'DO':assign('tickCount',op('ADD',var('tickCount'),n(1)))}, comment='100000 microseconds = 0.1 second. Change this period to change the interrupt rate. Timer1 is reserved; do not combine this lesson with a Timer1 motor or Servo engine.'),
        *bounded_reader(commands,24),state,announce,
        setup(call('announcePlotter'),'Announce the dashboard before loop. The Timer1 block starts its configured interrupt at the end of setup.'),
        loop(chain(call('readPlotterCommand'),iff(var('streaming'),every(200,sample))), 'Read complete commands, then copy and display the counter five times per second. The interrupt itself runs ten times per second; no delay blocks command handling.'))

def external_lesson():
    source = 'irq-attach-pulse'
    enabled = lambda: block('irq_enabled', {'SOURCE':source})
    control = lambda operation: block('irq_control', {'SOURCE':source,'ACTION':operation})
    profile = {'version':1,'id':'edges','title':'Attach an interrupt, then press a button',
        'description':'Connect a pushbutton between D2 and GND; the internal pull-up is enabled. Check Attached, then press it. Mechanical bounce may count several edges per press. Uncheck Attached and compare.',
        'fields':[{'id':'count','label':'Falling edges'},{'id':'attached','type':'boolean'}],
        'widgets':[{'type':'line','fields':['count'],'min':0},{'type':'raw','fields':['count','attached']}],
        'controls':[{'id':'attached','type':'checkbox','label':'Attached','value':False}, {'id':'clear','type':'button','label':'Clear count'}]}
    state = folded('sendControlState', chain(message('@state {"attached":',False),serial(enabled()),message('}')),
        'Confirm the actual interrupt enable bit; the checkbox always reflects the accepted setting.')
    announce = folded('announcePlotter',chain(header(profile),call('sendControlState'),message('@msg Check Attached, then press the D2-to-GND button. Clear resets the count.')),
        'Tell Plotter how to display the count and attach checkbox, on boot and whenever Start is pressed.')
    commands = choose([
        ('START',chain(assign('streaming',flag(True)),call('announcePlotter'))),
        ('STOP',chain(assign('streaming',flag(False)),control('DISABLE'),call('sendControlState'),message('@msg Paused and detached. Start resumes readings; check Attached to count again.'))),
        ('@set attached 1',chain(control('ENABLE'),call('sendControlState'),message('@msg Attached. Press the button and watch the counter.'))),
        ('@set attached 0',chain(control('DISABLE'),call('sendControlState'),message('@msg Detached. Button edges are no longer counted.'))),
        ('@do clear',chain(atomic(assign('pulseCount',n(0))),message('@msg Edge count cleared.')))
    ])
    sample = chain(atomic(assign('snapshot',var('pulseCount'))),csv(var('snapshot'),enabled()))
    write('60-interrupt-attach-detach.xml',*base('Use a D2-to-GND button to see attach/detach change interrupt behavior.'),
        volatile('pulseCount','uint16_t'),declare('snapshot','uint16_t'),
        block('irq_external', {'NAME':'pulseInput','PIN':'2','EDGE':'FALLING','INPUT':'INPUT_PULLUP','START':'DISABLED'}, statements={'DO':assign('pulseCount',op('ADD',var('pulseCount'),n(1)))},mutation={'uid':source},comment='Start detached so the checkbox demonstrates attaching an interrupt. D2 is pulled high internally; a button to GND creates the falling edge. This is an edge counter, not a debounced button counter.'),
        *bounded_reader(commands,24),state,announce,
        setup(call('announcePlotter'),'Show the wiring and controls immediately after reset. The interrupt remains disabled until Attached is checked.'),
        loop(chain(call('readPlotterCommand'),iff(var('streaming'),every(100,sample))), 'Receive complete commands without waiting, then copy the shared counter atomically and display it at 10 Hz.'))

def motor_lesson():
    uid = 'interactive-fast-motor'
    target = lambda: action('device_stepper_speed',uid,{'SPEED':var('targetSpeed')})
    profile = {'version':1,'id':'motor','title':'Stepper',
        'description':'Requested steps/s. Zero ramps to stop.',
        'fields':[{'id':'speed'}],
        'controls':[{'id':'speed','type':'number','label':'Steps/s','min':-30000,'max':30000,'value':0}]}
    state = folded('sendControlState',chain(message('@state {"speed":',False),serial(var('targetSpeed')),message('}')),'Confirm the accepted speed. The timer library ramps toward this target.')
    announce = folded('announcePlotter',chain(header(profile),call('sendControlState')),'Send the dashboard on boot and Start. Motor stays stopped until a nonzero speed is entered.')
    stopfn = folded('stopMotor',chain(assign('targetSpeed',n(0)),target(),call('sendControlState'),message('@msg Stopping.')),'Plotter Stop requests zero speed with deceleration.')
    stop = lambda: call('stopMotor')
    valid = conditions(var('commandValid'),compare('GTE',var('commandNumber'),n(-30000)),compare('LTE',var('commandNumber'),n(30000)))
    speed = chain(assign('valueStart',n(11)),call('parseCommandNumber'),iff(valid,chain(assign('targetSpeed',var('commandNumber')),target(),call('sendControlState')),message('@msg Use -30000..30000.')))
    commands = choose([('START',chain(assign('streaming',flag(True)),call('announcePlotter'))),('STOP',chain(assign('streaming',flag(False)),stop()))],iff(command_matches('@set speed ',False),speed))
    # This lesson is deliberately bounded to +/-30000. A 16-bit parser rejects
    # a value before multiplication can overflow; it saves Flash on ATmega168.
    parsers=integer_parser()
    for node in parsers:
        if node.find("field[@name='VAR']") is not None and node.find("field[@name='VAR']").text=='commandNumber':node.find("field[@name='TYPE']").text='int16_t'
        for field in node.iter('field'):
            if field.get('name')=='NUM' and field.text=='1000000':field.text='3000'
    readers=bounded_reader(commands,20)
    for node in readers:
        for field in node.iter('field'):
            if field.get('name')=='TEXT' and field.text.startswith('@msg Command too long;'):field.text='@msg Command too long.'
    write('70-timer-stepper-speed.xml',config('device_stepper_driver',uid,'motor',{'ENGINE':'TIMER','STEP':'9','DIR':'4','SPEED':'30000','ACCEL':'5000','DRIVE_MODE':'RAMPED','DIR_DELAY_US':'40'},'Timer1 generates STEP on D9; DIR uses D4. Connect the TB6600 control inputs according to its input wiring, with common signal ground. Acceleration is 5000 steps/s²; change it here. Timer1 cannot simultaneously run the Timer1/Servo lessons.'),
        *base('Start stopped, then set an exact signed target from Plotter.'),declare('targetSpeed','int16_t'),
        *parsers,*readers,state,announce,stopfn,
        setup(call('announcePlotter'),'Initialize the hardware engine but request no motion. Start only announces the dashboard; enter a nonzero speed to move.'),
        loop(chain(call('readPlotterCommand'),iff(var('streaming'),every(100,serial(var('targetSpeed'),True)))), 'The hardware engine plans acceleration and generates pulses in the background. Report the requested target at 10 Hz; no run call or delay is needed.'))

if __name__ == '__main__':
    timer_lesson()
    external_lesson()
    motor_lesson()
