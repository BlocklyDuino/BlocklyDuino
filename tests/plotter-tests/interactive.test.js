'use strict';
// Protocol-only: no browser, USB port, or hardware commands are opened here.
const assert = require('node:assert/strict');
const P = require('../../blockly/apps/blocklyduino/serial_protocol.js');
let checks = 0;
function equal(a, b) { assert.deepEqual(a, b); checks++; }
function reject(fn, expression) { assert.throws(fn, expression); checks++; }
const definition = {
  version: 1, id: 'led-lab', title: 'Blink lab',
  description: 'The built-in LED blinks.\nChange its interval or disable it below.',
  fields: [{id: 'led'}], widgets: [{type: 'line', fields: ['led']}],
  controls: [
    {id: 'period', type: 'slider', label: 'Blink interval', unit: 'ms', min: 100, max: 2000, step: 100, value: 500},
    {id: 'count', type: 'number', label: 'Blink count', min: 1, max: 20, value: 5},
    {id: 'enabled', type: 'checkbox', value: true},
    {id: 'message', type: 'text', value: 'Hello', maxLength: 40},
    {id: 'pattern', type: 'select', options: [{value: 'blink', label: 'Blink'}, {value: 'double', label: 'Double flash'}]},
    {id: 'restart', type: 'button', label: 'Restart', help: 'Restart the blink counter.'}
  ]
};
let profile = P.validate(definition);
equal(P.validate(profile), profile);
equal(profile.controls[1].step, 1);
equal(profile.controls[4].value, 'blink');
equal(profile.controls[0].unit, 'ms');
equal(profile.description, definition.description);
const byId = Object.fromEntries(profile.controls.map(c => [c.id, c]));
equal(P.controlCommand(byId.period, '800'), '@set period 800');
equal(P.controlCommand(byId.count, 7), '@set count 7');
equal(P.controlCommand(byId.enabled, false), '@set enabled 0');
equal(P.controlCommand(byId.enabled, 'true'), '@set enabled 1');
equal(P.controlCommand(byId.message, 'Hello Arduino'), '@set message Hello Arduino');
equal(P.controlCommand(byId.message, ''), '@set message ');
equal(P.controlCommand(byId.pattern, 'double'), '@set pattern double');
equal(P.controlCommand(byId.restart), '@do restart');
equal(P.controlValue(byId.period, '5e2'), 500);
equal(P.controlValue({...byId.period, min: -2, max: 2, step: .1}, '-0.3'), -0.3);
equal(P.controlValue(byId.message, 'ą'.repeat(20)), 'ą'.repeat(20));
equal(P.controlValue(byId.message, '😀'.repeat(10)), '😀'.repeat(10));
equal(P.validate({...definition, controls: [{id: 'negative', type: 'number', max: -5, step: 2}]}).controls[0].value, -6);
for (const [control, value, reason] of [
  [byId.period, 150, /increments/], [byId.period, 2100, /within/], [byId.period, 0, /within/],
  [byId.period, 'NaN', /finite/], [byId.period, Infinity, /finite/], [byId.period, true, /finite/],
  [byId.enabled, 2, /true\/false/], [byId.pattern, 'unknown', /options/],
  [byId.message, 'a'.repeat(41), /40 UTF-8 bytes/], [byId.message, 'ą'.repeat(21), /40 UTF-8 bytes/],
  [byId.message, '😀'.repeat(11), /40 UTF-8 bytes/], [byId.message, '\ud800', /Unicode/],
  [byId.restart, 1, /no value/]
]) reject(() => P.controlValue(control, value), reason);
for (const injection of ['one\n@do restart', 'one\r@do restart', 'one\tmore', '\x00', '\x1b[31m', '\u2028', '\u0085']) {
  reject(() => P.controlCommand(byId.message, injection), /one line/);
}
reject(() => P.controlCommand({...byId.restart, id: 'restart\nSTOP'}), /Control ID/);

// Header-first is the default, including after reset. Manual mode must have a
// real installed profile too; no arbitrary debug number becomes a new chart.
let parser = new P.Parser({getProfile: key => key === definition.id ? definition : null});
for (const line of ['100,200', 'a:100 b:200', 'A,B', '@data [1]', '@data {bad}', '@state {"enabled":true}', 'debug 123']) {
  const result = parser.parse(line); equal(result.kind, 'ignored'); equal(parser.profile, null);
  assert(result.message.includes('@plot')); checks++;
}
equal(parser.parse('@msg Connect the potentiometer to A0.').text, 'Connect the potentiometer to A0.');
equal(parser.parse('@msg {"text":"Press Start when ready.","level":"success"}'), {kind: 'message', text: 'Press Start when ready.', level: 'success'});
equal(parser.parse('@msg').text, '');
equal(parser.parse('@msg {"text":"bad","level":"fatal"}').kind, 'error');
equal(parser.parse('@msg ' + 'x'.repeat(2001)).kind, 'error');
equal(parser.parse('@msg {bad}').kind, 'error');
equal(parser.parse('@use led-lab').kind, 'config');
equal(parser.parse('1').sample.values.led, 1);
equal(parser.parse('@data [1,2]').kind, 'error');
equal(parser.parse('@data {"id":"elsewhere","values":[1]}').kind, 'ignored');
const before = JSON.stringify(parser.profile);
let state = parser.parse('@state {"period":800,"enabled":false,"message":"Look at D13","pattern":"double"}');
equal(state.kind, 'state');
equal({...state.values}, {period: 800, enabled: false, message: 'Look at D13', pattern: 'double'});
equal(JSON.stringify(parser.profile), before); // Ack values are not new defaults.
for (const row of [
  '@state {"period":900,"enabled":2}', '@state {"unknown":1}', '@state {"restart":true}',
  '@state {"__proto__":{}}', '@state {"constructor":{}}', '@state []', '@state {}',
  '@state {"period":150}', '@state {"message":"bad\\n@do restart"}', '@state {bad}'
]) { equal(parser.parse(row).kind, 'error'); equal(JSON.stringify(parser.profile), before); }
equal({}.polluted, undefined);
parser.mode = 'manual';
equal(parser.parse('@plot '+JSON.stringify({...definition, title: 'Wrong'})).kind, 'ignored');
equal(parser.parse('@use nowhere').kind, 'ignored');
equal(parser.parse('@state {"enabled":1}').values.enabled, true);
equal(parser.parse('@msg Still running').kind, 'message');
equal(parser.parse('0').sample.values.led, 0);
parser.reset(); equal(parser.parse('0').kind, 'ignored');
parser.setProfile(definition); equal(parser.parse('0').kind, 'sample');

// Empty data arrays are useful: a dashboard may contain controls, instructions,
// or a streamed image without inventing a dummy numeric channel.
const empty = {version: 1, id: 'controls', fields: [], widgets: [], controls: [definition.controls[5]]};
equal(P.validate(empty).fields, []);
equal(P.validate({...empty, controls: [], description: 'Messages arrive from the board.'}).widgets, []);
const messages = new P.Parser();
equal(messages.parse('123').kind,'ignored');
messages.setProfile({...empty, description:'Serial text appears here.'});
equal(messages.parse('123'),{kind:'message',text:'123',level:'info'});
equal(messages.parse('Device found at address 0x27').text,'Device found at address 0x27');
equal(messages.parse('{"ordinary":"printed JSON"}').text,'{"ordinary":"printed JSON"}');
equal(messages.parse('@state {"restart":1}').kind,'error');
equal(messages.parse('@data [123]').kind,'error');
const imageOnly = P.validate({version: 1, id: 'image', fields: [], widgets: [{type: 'image', image: {id: 'picture', width: 8, height: 8}}]});
equal(imageOnly.widgets[0].type, 'image');
reject(() => P.validate({...empty, controls: []}), /needs instruments, controls or a description/);

// A dynamic hardware limit may leave exactly one permitted control value.
// Numeric controls accept it; chart axes must still have a nonzero range.
for (const type of ['number', 'slider']) {
  const fixed = P.validate({...empty, controls: [{id: 'fixed', type, min: 1, max: 1}]}).controls[0];
  equal(fixed.value, 1); equal(P.controlValue(fixed, '1'), 1);
  equal(P.controlCommand(fixed, 1), '@set fixed 1');
  reject(() => P.controlValue(fixed, 2), /within/);
  reject(() => P.validate({...empty, controls: [{...fixed, value: 0}]}), /within/);
  equal(P.validate({...empty, controls: [{id: 'fixed', type, min: 1e300, max: 1e300}]}).controls[0].value, 1e300);
}
reject(() => P.validate({...definition, fields: [{id: 'led', min: 1, max: 1}]}), /less than/);
for (const type of ['line', 'gauge', 'bar'])
  reject(() => P.validate({...definition, widgets: [{type, fields: ['led'], min: 1, max: 1}]}), /less than/);
reject(() => P.validate({...definition, widgets: [{type: 'xy', x: 'led', y: 'led', xMin: 1, xMax: 1}]}), /less than/);

// Schema rejects malformed ranges, ambiguous options, oversized definitions and
// duplicate/prototype IDs before replacing the current valid profile.
for (const control of [
  {id: 'x', type: 'slider'}, {id: 'x', type: 'slider', min: 2, max: 1},
  {id: 'x', type: 'number', min: 2, max: 1},
  {id: 'x', type: 'slider', min: 0, max: 10, step: 0}, {id: 'x', type: 'number', step: Infinity},
  {id: 'x', type: 'number', min: NaN}, {id: 'x', type: 'number', min: 0, max: 10, value: 11},
  {id: 'x', type: 'slider', min: -1e308, max: 1e308}, {id: 'x', type: 'number', min: 1e300, step: 1},
  {id: 'x', type: 'number', min: 0, max: 10, step: 2, value: 3},
  {id: 'x', type: 'text', maxLength: 161}, {id: 'x', type: 'text', maxLength: 0},
  {id: 'x', type: 'text', value: '\n'}, {id: 'x', type: 'select', options: []},
  {id: 'x', type: 'select', options: [{value: 'same'}, {value: 'same'}]},
  {id: 'x', type: 'select', options: [{value: 'x\n'}]},
  {id: 'x', type: 'select', options: [{value: 'a'}], value: 'b'},
  {id: '__proto__', type: 'button'}, {id: 'x', type: 'button', value: 'go'},
  {id: 'x', type: 'eval'}, {id: 'x', type: 'button', help: 'x'.repeat(241)}
]) reject(() => P.validate({...empty, controls: [control]}));
reject(() => P.validate({...empty, controls: [definition.controls[5], definition.controls[5]]}), /Duplicate/);
assert.equal(P.validate({...empty, controls: Array.from({length: 32}, (_, i) => ({id: 'c'+i, type: 'button'}))}).controls.length, 32);
reject(() => P.validate({...empty, controls: Array.from({length: 33}, (_, i) => ({id: 'c'+i, type: 'button'}))}), /32 controls/);
reject(() => P.validate({...empty, description: 'x'.repeat(1001)}), /1000/);
const old = parser.profile;
equal(parser.mode = 'auto', 'auto');
equal(parser.parse('@plot '+JSON.stringify({...empty, controls: [{id: '__proto__', type: 'button'}]})).kind, 'error');
equal(parser.profile, old);
equal(parser.parse('1').sample.values.led, 1);
console.log('PASS '+checks+' interactive controls/message/header-first protocol assertions');
