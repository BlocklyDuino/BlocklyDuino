'use strict';
const assert = require('node:assert/strict');
const P = require('../../blockly/apps/blocklyduino/serial_protocol.js');
let checks = 0;
function equal(a, b) { assert.deepEqual(a, b); checks++; }
function near(a, b) { assert(Math.abs(a - b) < 1e-9, `${a} != ${b}`); checks++; }
function rejects(fn, pattern) { assert.throws(fn, pattern); checks++; }
function config(fields, widgets) { return {version: 1, id: 'lab', fields, ...(widgets ? {widgets} : {})}; }
function header(parser, profile) { const result = parser.parse('@plot ' + JSON.stringify(profile)); equal(result.kind, 'config'); return result.profile; }
function row(parser, values, t, received) {
  const result = parser.parse('@data ' + JSON.stringify({id: 'lab', values, ...(t == null ? {} : {t})}), received);
  equal(result.kind, 'sample'); return result.sample;
}

// Existing single-instrument configurations still have the legacy property,
// while all renderers may now consistently consume fields / series arrays.
let cfg = config([{id: 'x'}, {id: 'y'}, {id: 'z'}], [
  {type: 'gauge', field: 'x'},
  {type: 'gauge', fields: ['y', 'z'], min: -10, max: 10},
  {type: 'bar', fields: ['x', 'y']},
  {type: 'xy', x: 'x', y: 'y'},
  {type: 'xy', series: [{x: 'x', y: 'y'}, {x: 'x', y: 'z', label: 'Second path'}], xMin: 0, xMax: 50, yMin: -1, yMax: 1},
  {type: 'line', fields: ['y', 'z'], min: -1, max: 1},
  {type: 'raw', fields: ['x']},
  {type: 'image', image: {id: 'scan', width: 128, height: 64, max: 1023}},
  {type: 'image', image: {id: 'color', width: 16, height: 16, mode: 'rgb'}}
]);
let normalized = P.validate(cfg);
equal(normalized.widgets[0].field, 'x'); equal(normalized.widgets[0].fields, ['x']);
equal(normalized.widgets[1].fields, ['y', 'z']); equal(normalized.widgets[1].min, -10);
equal(normalized.widgets[2].min, undefined); equal(normalized.widgets[3].x, 'x');
equal(normalized.widgets[3].series, [{x: 'x', y: 'y', label: 'y'}]);
equal(normalized.widgets[4].series[1].label, 'Second path'); equal(normalized.widgets[4].xMax, 50);
equal(normalized.widgets[5].max, 1);
equal(normalized.widgets[7].image, {version: 1, id: 'scan', width: 128, height: 64, mode: 'gray', max: 1023});
equal(normalized.widgets[8].image.mode, 'rgb');
equal(P.validate(normalized), normalized); // saved profiles round-trip unchanged
for (const widget of [
  {type: 'gauge', fields: []}, {type: 'bar', fields: ['x', 'x']},
  {type: 'bar', fields: ['x'], min: 1, max: 1}, {type: 'line', fields: ['x'], max: Infinity},
  {type: 'xy', series: []}, {type: 'xy', series: [{x: 'missing', y: 'x'}]},
  {type: 'xy', x: 'x', y: 'y', yMin: 5, yMax: 2},
  {type: 'image', image: {id: 'scan', width: 0, height: 1}},
  {type: 'image', image: {id: 'scan', width: 16385, height: 1}},
  {type: 'image', image: {id: 'scan', width: 10000, height: 10000}},
  {type: 'image', image: {id: '__proto__', width: 1, height: 1}},
  {type: 'image', image: {id: 'scan', width: 1, height: 1, mode: 'RGBA'}},
  {type: 'image', image: {id: 'scan', width: 1, height: 1, version: 2}},
  {type: 'image', image: {id: 'scan', width: 1, height: 1, max: 0}}
]) rejects(() => P.validate({...cfg, widgets: [widget]}));
rejects(() => P.validate({...cfg, widgets: [cfg.widgets[7], cfg.widgets[7]]}), /Duplicate image/);
rejects(() => P.validate({...cfg, widgets: [
  {type: 'image', image: {id: 'a', width: 4096, height: 4096}},
  {type: 'image', image: {id: 'b', width: 1, height: 1}}
]}), /16 megapixels/);

// One compact MCU value can feed many host calculations. Scaling happens
// before derivation; units are explicit metadata, never silently rewritten.
cfg = config([
  {id: 'adc', scale: 0.5, unit: 'V'},
  {id: 'power', unit: 'W', derive: {op: 'formula', expr: 'adc * adc / 2'}},
  {id: 'smooth', unit: 'V', derive: {op: 'mean', source: 'adc', window: 3}},
  {id: 'energy', unit: 'J', derive: {op: 'integral', source: 'power', time: 'device'}},
  {id: 'slope', unit: 'V/s', derive: {op: 'derivative', source: 'adc', time: 'device'}},
  {id: 'total', derive: {op: 'sum', source: 'adc'}},
  {id: 'rms', derive: {op: 'rms', source: 'adc', window: 2}},
  {id: 'low', derive: {op: 'min', source: 'adc', window: 2}},
  {id: 'high', derive: {op: 'max', source: 'adc', window: 2}}
]);
let parser = new P.Parser(); normalized = header(parser, cfg);
equal(P.inputFields(normalized).map(f => f.id), ['adc']);
let a = row(parser, [4], 0, 100000);
equal({...a.values}, {adc: 2, power: 2, smooth: 2, energy: 0, slope: null, total: 2, rms: 2, low: 2, high: 2});
equal(a.raw.adc, 4); equal(a.raw.power, null); equal(normalized.fields[3].unit, 'J');
let b = row(parser, {adc: 8}, 1000, 100001);
equal(b.values.energy, 5); equal(b.values.slope, 2); near(b.values.rms, Math.sqrt(10));
equal(b.values.smooth, 3); equal(b.values.total, 6);
let c = parser.parse('adc:12', 100002); equal(c.kind, 'sample');
equal(c.sample.values.energy, null); equal(c.sample.values.slope, null); equal(c.sample.values.smooth, 4);
let d = row(parser, [16], 2000, 100003);
equal(d.values.energy, 5); equal(d.values.slope, null); // missing device time breaks the segment
equal(d.values.smooth, 6); equal(d.values.low, 6); equal(d.values.high, 8);
let e = row(parser, [20], 3000, 100004);
equal(e.values.energy, 46); equal(e.values.slope, 2);
equal(parser.parse('@data [1,2,3]').kind, 'error');
equal(parser.parse('@data {"id":"lab","values":{"adc":1,"power":2}}').kind, 'error');
const exported = P.csv(normalized, [a]);
assert(exported.includes('power,power_raw')); checks++;
assert(exported.includes(',2,,2,,0,,')); checks++; // derived raw columns are empty

// Rejected headers and malformed frames do not reset or partially advance
// integration, rolling windows or accumulation. Valid headers do reset them.
const unchanged = parser.profile;
equal(parser.parse('@plot ' + JSON.stringify({...cfg, fields: [{id: 'x', derive: {op: 'formula', expr: 'notThere'}}]})).kind, 'error');
assert.equal(parser.profile, unchanged); checks++;
equal(parser.parse('@data {"id":"lab","t":3500,"values":["bad"]}').kind, 'error');
equal(parser.parse('@data {"id":"lab","t":3500,"values":[2]}', NaN).kind, 'error');
let f = row(parser, [24], 4000, 100005);
equal(f.values.energy, 107); equal(f.values.smooth, 10); equal(f.values.total, 42);
header(parser, cfg); a = row(parser, [4], 5000, 100006);
equal(a.values.energy, 0); equal(a.values.slope, null); equal(a.values.total, 2);
rejects(() => parser.setProfile({...cfg, version: 2}));
b = row(parser, [8], 6000, 100007); equal(b.values.energy, 5);
parser.reset(); equal(parser.profile, null); equal(parser.calculator, null);

// Millisecond device/received timestamps become seconds. Duplicate and
// backwards times skip that interval and start a fresh forward segment.
cfg = config([{id: 'v'}, {id: 'area', derive: {op: 'integral', source: 'v'}}, {id: 'rate', derive: {op: 'derivative', source: 'v'}}]);
header(parser, cfg); a = row(parser, [1], null, 1000); equal(a.values.area, 0);
b = row(parser, [3], null, 1500); equal(b.values.area, 1); equal(b.values.rate, 4);
c = row(parser, [4], null, 1500); equal(c.values.area, 1); equal(c.values.rate, null);
d = row(parser, [5], null, 500); equal(d.values.area, 1); equal(d.values.rate, null);
e = row(parser, [7], null, 1000); equal(e.values.area, 4); equal(e.values.rate, 4);

// Safe arithmetic, previous-field references and functions; no JS or property
// access. Hyphenated field IDs have an explicit [field-id] notation.
cfg = config([{id: 'sensor-x'}, {id: 'y'},
  {id: 'a', derive: {op: 'formula', expr: '-2^2 + 2^3^2 + [sensor-x] * y'}},
  {id: 'b', derive: {op: 'formula', expr: 'clamp(abs([sensor-x]), 0, 2) + sqrt(9) + sin(pi/2) + cos(0) + tan(0) + log(exp(1)) + min(1,2) + max(2,3) + pow(2,3)'}},
  {id: 'c', scale: 2, offset: 1, derive: {op: 'formula', expr: 'a + b'}}
]);
header(parser, cfg); a = row(parser, [3, 4], null, 1);
equal(a.values.a, 520); near(a.values.b, 20); near(a.values.c, 1081);
for (const expr of ['missing+1', 'sensor-x', 'Math.sin(1)', 'process.exit()', 'this.constructor', '__proto__', 'constructor()', 'x => x', '1;2', '1e999', 'sqrt(1,2)', 'pow(1)', 'min()', '2**3', '2 +', '()', '('.repeat(25) + '1' + ')'.repeat(25), '1+'.repeat(65) + '1', '1'.repeat(513)]) {
  rejects(() => P.validate(config([{id: 'v'}, {id: 'bad', derive: {op: 'formula', expr}}])));
}
for (const derive of [
  {op: 'eval', source: 'v'}, {op: 'mean', source: 'v', window: 0},
  {op: 'mean', source: 'v', window: 1025}, {op: 'mean', source: 'v', window: 1.5},
  {op: 'sum', source: 'v', window: 2}, {op: 'min', source: 'missing', window: 2},
  {op: 'derivative', source: 'v', time: 'seconds'}, {op: 'rms', source: 'v', window: 2, time: 'device'}
]) rejects(() => P.validate(config([{id: 'v'}, {id: 'd', derive}])));
rejects(() => P.validate(config([{id: 'v'}, {id: 'a', derive: {op: 'formula', expr: 'b'}}, {id: 'b'}])));
rejects(() => P.validate(config([{id: 'v', type: 'string'}, {id: 'd', derive: {op: 'mean', source: 'v', window: 2}}])));
rejects(() => P.validate(config([{id: 'v'}, {id: 'd', type: 'boolean', derive: {op: 'formula', expr: 'v'}}])));
rejects(() => P.validate(config([{id: 'd', derive: {op: 'formula', expr: '1'}}])));

// Undefined numerical results are gaps, not rejected frames or infinities.
cfg = config([{id: 'v'}, {id: 'bad', derive: {op: 'formula', expr: 'sqrt(v) / v'}}, {id: 'dependent', derive: {op: 'formula', expr: 'bad+1'}}]);
header(parser, cfg); a = row(parser, [0], null, 0); equal(a.values.bad, null); equal(a.values.dependent, null);
b = row(parser, [-1], null, 1); equal(b.values.bad, null);
c = row(parser, [4], null, 2); equal(c.values.bad, 0.5); equal(c.values.dependent, 1.5);

// A long stream cannot grow the mathematical state. The statistic uses the
// last N accepted samples and starts with the samples actually available.
cfg = config([{id: 'v'}, {id: 'avg', derive: {op: 'mean', source: 'v', window: 7}}]);
header(parser, cfg); for (let i = 0; i < 5000; i++) { a = parser.parse(String(i), i); equal(a.kind, 'sample'); }
equal(a.sample.values.avg, 4996); equal(parser.calculator.states[0].buffer.length, 7);
equal(P.limits.window, 1024); equal(P.limits.imagePixels, 16777216);
console.log(`PASS ${checks} advanced plotter protocol/math assertions`);
