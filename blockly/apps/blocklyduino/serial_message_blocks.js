/* SPDX-License-Identifier: Apache-2.0
 * General Serial templates and bounded command lines. No dashboard-specific API.
 */
(function () {
  'use strict';
  var A = Blockly.Arduino;
  function templateParts(text) {
    text = String(text == null ? '' : text);
    if (text.length > 16384) throw Error('Serial template is too long (16384 characters maximum).');
    var pattern = /\{\{([^{}]*)\}\}/g, match, names = [], pieces = [], at = 0;
    while ((match = pattern.exec(text))) {
      if (text.slice(at, match.index).indexOf('{{') >= 0) throw Error('Close every template placeholder with }}.');
      var token = /^([A-Za-z][A-Za-z0-9_]{0,31})(?::([0-8]))?$/.exec(match[1]);
      if (!token) throw Error('Use {{name}} or {{name:3}}; names start with a letter and decimal precision is 0–8.');
      pieces.push({text:text.slice(at, match.index)});
      pieces.push({name:token[1], precision:token[2], token:match[0], at:match.index});
      if (names.indexOf(token[1]) < 0) names.push(token[1]);
      at = pattern.lastIndex;
    }
    if (text.slice(at).indexOf('{{') >= 0) throw Error('Close every template placeholder with }}.');
    if (names.length > 32) throw Error('Use at most 32 named values in one Serial template.');
    pieces.push({text:text.slice(at)});
    return {names:names, pieces:pieces};
  }
  function jsonTemplate(text, pretty, required) {
    var parsed = templateParts(text), start = String(text).trim().match(/^(@[^\s]+\s+)?([\[{][\s\S]*)$/);
    if (!start) { if (required) throw Error('Enter a JSON object or array, optionally after a command such as @plot.'); return text; }
    var prefix = start[1] || '', body = start[2], marker = '__BlocklySerialPlaceholder_';
    while (body.indexOf(marker) >= 0) marker += '_';
    var quoted = false, escaped = false, position = 0, tokens = [];
    var masked = body.replace(/\{\{[^{}]*\}\}/g, function (token, offset) {
      for (; position < offset; position++) {
        var ch = body.charAt(position);
        if (escaped) escaped = false;
        else if (quoted && ch === '\\') escaped = true;
        else if (ch === '"') quoted = !quoted;
      }
      var key = marker + tokens.length + '__', inString = quoted;
      position = offset + token.length;
      tokens.push({key:key, token:token, quoted:inString});
      return inString ? key : JSON.stringify(key);
    });
    try {
      var result = JSON.stringify(JSON.parse(masked), null, pretty ? 2 : 0);
      tokens.forEach(function (token) { result = result.split(token.quoted ? token.key : JSON.stringify(token.key)).join(token.token); });
      return prefix + result;
    } catch (e) { if (required || /^@(plot|image)\s/.test(prefix)) throw Error('Invalid JSON template: ' + e.message); return text; }
  }
  Blockly.FieldSerialTemplate = function (text) { Blockly.FieldMessage.call(this, text, 'Serial message template', false); };
  Blockly.FieldSerialTemplate.prototype = Object.create(Blockly.FieldMessage.prototype);
  Blockly.FieldSerialTemplate.prototype.constructor = Blockly.FieldSerialTemplate;
  Blockly.FieldSerialTemplate.prototype.clone = function () { return new Blockly.FieldSerialTemplate(this.getValue()); };
  Blockly.FieldSerialTemplate.prototype.setValue = function (text) {
    Blockly.FieldMessage.prototype.setValue.call(this, text);
    var block = this.serialBlock_ || this.sourceBlock_;
    if (block && block.syncTemplate_) { block.syncTemplate_(); block.savedTemplateNames_ = null; }
  };
  Blockly.FieldSerialTemplate.prototype.showEditor_ = function () {
    var field = this, old = document.getElementById('message-editor'); if (old) old.remove();
    var dialog = document.createElement('dialog'); dialog.id = 'message-editor'; dialog.className = 'workbench-dialog message-editor';
    var title = document.createElement('h2'); title.textContent = 'Serial message template'; dialog.appendChild(title);
    var help = document.createElement('p'); help.textContent = 'Write {{width}} to add a value socket. Repeated names share one socket. Use {{gain:2}} for two decimal places. Connect numbers, variables or calculations. Values are printed directly: quote/escape text yourself when making JSON. Static text stays in Flash; no large String is built.'; dialog.appendChild(help);
    var area = document.createElement('textarea'); area.setAttribute('aria-label', 'Serial message template'); area.spellcheck = false;
    try { area.value = jsonTemplate(field.getValue(), true, false); } catch (e) { area.value = field.getValue(); }
    dialog.appendChild(area);
    var error = document.createElement('p'); error.className = 'error'; error.setAttribute('role', 'alert'); dialog.appendChild(error);
    var buttons = document.createElement('div'); buttons.className = 'dialog-actions';
    function button(label, action) { var b = document.createElement('button'); b.textContent = label; b.onclick = action; buttons.appendChild(b); }
    button('Format JSON', function () { try { area.value = jsonTemplate(area.value, true, true); error.textContent = ''; } catch (e) { error.textContent = e.message; } });
    button('Cancel', function () { dialog.close(); });
    button('Save', function () { try { var text = jsonTemplate(area.value, false, false); (field.serialBlock_ || field.sourceBlock_).savedTemplateNames_ = null; field.setValue(text); dialog.close(); } catch (e) { error.textContent = e.message; } });
    dialog.appendChild(buttons); document.body.appendChild(dialog); dialog.showModal(); area.focus();
  };
  function serial() { if (A.serialBaud_ == null) A.setups_.setup_serial_9600 = 'Serial.begin(9600);'; }
  function value(block, input) { var code = A.valueToCode(block, input, A.ORDER_NONE); if (!code) throw Error('Connect a value to ' + input.replace(/^ARG_/, '') + '.'); return code; }
  function statement(block) { block.setPreviousStatement(true); block.setNextStatement(true); block.setColour(170); }
  function enabled(block) { return !block.disabled && !block.getInheritedDisabled(); }
  function capacity(block) { var n = Number(block.getFieldValue('CAPACITY')); if (!Number.isInteger(n) || n < 8 || n > 192) throw Error('Serial line capacity must be a whole number from 8 to 192 bytes.'); return n; }
  function command(block) { var text = block.getFieldValue('COMMAND'); if (!text || text.length > 96 || /[\x00-\x1f\x7f-\uffff]/.test(text) || text !== text.trim()) throw Error('Use a nonempty ASCII command without leading/trailing spaces or line breaks.'); if (A.serialMessageCapacity_ && text.length + (block.type === 'serial_set_number' ? 2 : 0) >= A.serialMessageCapacity_) throw Error('Command does not fit the Serial line capacity. Increase the receive block capacity.'); return JSON.stringify(text); }
  function inReceiver() { if (!A.serialMessageDepth_) throw Error('Put Serial command handlers inside read serial lines.'); }
  function isGlobal(block) {
    var child = block, parent;
    while ((parent = child.getParent())) {
      if (/^procedures_def/.test(parent.type)) return false;
      for (var i = 0; i < parent.inputList.length; i++) { var input = parent.inputList[i]; if (input.type === Blockly.NEXT_STATEMENT && input.connection && input.connection.targetBlock() === child) return false; }
      child = parent;
    }
    return true;
  }
  Blockly.Blocks.serial_template = {
    init:function () {
      this.templateNames_ = [];
      var field = new Blockly.FieldSerialTemplate('Value: {{value}}'); field.serialBlock_ = this;
      this.appendDummyInput('MESSAGE').appendField('serial template').appendField(field, 'TEXT').appendField(new Blockly.FieldDropdown([['new line','println'],['same line','print']]), 'END');
      statement(this); this.setInputsInline(true); this.syncTemplate_();
      this.setTooltip('Click the message to edit it. {{name}} creates one value socket; repeated names reuse it. {{gain:3}} prints three decimal places. Static pieces use Flash and values stream directly, without a String/JSON buffer. Serial output can still wait for the UART transmit buffer; avoid large messages in time-critical loops. Collapse a long block or its function from the context menu.');
    },
    syncTemplate_:function () {
      var parsed; try { parsed = templateParts(this.getFieldValue('TEXT')); } catch (e) { this.setWarningText(e.message); return; }
      this.templateNames_ = parsed.names;
      this.setInputsInline(parsed.names.length <= 4);
      this.inputList.slice().forEach(function (input) {
        if (input.name.indexOf('ARG_') !== 0 || parsed.names.indexOf(input.name.slice(4)) >= 0) return;
        if (input.connection && input.connection.targetBlock()) return;
        if (this.savedTemplateNames_ && this.savedTemplateNames_.indexOf(input.name.slice(4)) >= 0) return;
        this.removeInput(input.name);
      }, this);
      parsed.names.forEach(function (name) { if (!this.getInput('ARG_' + name)) this.appendValueInput('ARG_' + name).appendField(name); }, this);
      // Keep old sockets until their values are disconnected: an edited template
      // must never silently discard a user's expression. Generation reports them.
      var unused = this.inputList.filter(function (input) { return input.name.indexOf('ARG_') === 0 && parsed.names.indexOf(input.name.slice(4)) < 0 && input.connection && input.connection.targetBlock(); });
      this.setWarningText(unused.length ? 'Unused template values: ' + unused.map(function (input) { return input.name.slice(4); }).join(', ') + '. Restore their {{placeholders}} or disconnect the values.' : null);
    },
    onchange:function () { if (this.workspace) this.syncTemplate_(); },
    mutationToDom:function () { var node = document.createElement('mutation'); node.setAttribute('names', JSON.stringify(this.inputList.filter(function (i) { return i.name.indexOf('ARG_') === 0; }).map(function (i) { return i.name.slice(4); }))); return node; },
    domToMutation:function (node) {
      var names; try { names = JSON.parse(node.getAttribute('names') || '[]'); } catch (e) { throw Error('Invalid Serial template socket names.'); }
      if (!Array.isArray(names) || names.length > 32 || names.some(function (n) { return typeof n !== 'string' || !/^[A-Za-z][A-Za-z0-9_]{0,31}$/.test(n); })) throw Error('Invalid Serial template socket names.');
      this.savedTemplateNames_ = names;
      if (this.getInput('ARG_value') && names.indexOf('value') < 0) this.removeInput('ARG_value');
      names.forEach(function (name) { if (!this.getInput('ARG_' + name)) this.appendValueInput('ARG_' + name).appendField(name); }, this);
    }
  };
  A.serial_template = function () {
    serial(); var parsed = templateParts(jsonTemplate(this.getFieldValue('TEXT'), false, false)), self = this, code = '';
    this.inputList.forEach(function (input) { if (input.name.indexOf('ARG_') === 0 && parsed.names.indexOf(input.name.slice(4)) < 0 && input.connection && input.connection.targetBlock()) throw Error('Serial template value ' + input.name.slice(4) + ' is unused. Restore its {{placeholder}} or disconnect that value.'); });
    var values = Object.create(null); parsed.names.forEach(function (name) { values[name] = value(self, 'ARG_' + name); });
    var newline = this.getFieldValue('END') === 'println';
    parsed.pieces.forEach(function (piece, i) {
      if (piece.name) code += 'Serial.print(' + (piece.precision == null ? values[piece.name] : '(double)(' + values[piece.name] + '), ' + piece.precision) + ');\n';
      else if (piece.text) {
        // Finish a literal and its newline in one call. The wire text is identical,
        // but repeated short state replies cost less Flash on small AVR boards.
        var end = newline && i === parsed.pieces.length - 1;
        code += 'Serial.' + (end ? 'println' : 'print') + '(F(' + JSON.stringify(piece.text) + '));\n';
        if (end) newline = false;
      }
    });
    if (newline) code += 'Serial.println();\n';
    return code;
  };
  Blockly.Blocks.serial_receive_line = {init:function () {
    this.appendDummyInput().appendField('read serial lines').appendField(new Blockly.FieldTextInput('48'), 'CAPACITY').appendField('bytes');
    this.appendStatementInput('DO').appendField('on complete line'); statement(this);
    this.setTooltip('Put in loop. Reads at most 32 already-arrived bytes per pass, then runs the body for one complete LF/CRLF line. Partial input waits for a later pass without blocking. Capacity includes the terminator. Overlong lines or misplaced control characters are discarded through the next newline; no suffix becomes a command. One receiver per project; do not also consume these bytes with serial read byte.');
  }};
  A.serial_receive_line = function () { serial(); var body; A.serialMessageDepth_++; try { body = A.statementToCode(this, 'DO'); } finally { A.serialMessageDepth_--; } return 'if (' + A.serialMessageName_ + '.poll(Serial)) {\n' + body + '}\n'; };
  Blockly.Blocks.serial_when_command = {init:function () {
    this.appendDummyInput().appendField('when command').appendField(new Blockly.FieldTextInput('START'), 'COMMAND'); this.appendStatementInput('DO').appendField('do'); statement(this);
    this.setTooltip('Inside read serial lines: execute only when the complete line exactly matches this command. START and STOP are ordinary commands, not individual letter checks. No trailing text is accepted.');
  }};
  A.serial_when_command = function () { inReceiver(); return 'if (' + A.serialMessageName_ + '.matches(F(' + command(this) + '))) {\n' + A.statementToCode(this, 'DO') + '}\n'; };
  Blockly.Blocks.serial_set_number = {init:function () {
    this.appendDummyInput().appendField('when number').appendField(new Blockly.FieldTextInput('@set width'), 'COMMAND').appendField('set').appendField(new Blockly.FieldVariable('width'), 'VAR');
    this.appendValueInput('MIN').setCheck('Number').appendField('min'); this.appendValueInput('MAX').setCheck('Number').appendField('max'); this.appendValueInput('STEP').setCheck('Number').appendField('step');
    this.appendStatementInput('DO').appendField('accepted'); this.appendStatementInput('INVALID').appendField('invalid'); this.setInputsInline(true); statement(this);
    this.setTooltip('Inside read serial lines: match the command plus one number, for example @set width 64. Choose an explicitly declared global numeric variable. Integer variables require whole values AND whole min/max/step; float accepts finite decimal/exponent notation. Bounds and step can be variables/calculations; steps start at min. Only a valid complete value changes the variable, then accepted runs. Matching bad values run invalid unchanged; other commands do nothing.');
  }, getVars:function () { return [this.getFieldValue('VAR')]; }, renameVar:function (oldName, newName) { if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) this.setFieldValue(newName, 'VAR'); }};
  A.serial_set_number = function () {
    inReceiver(); var raw = this.getFieldValue('VAR'), found = this.workspace.getAllBlocks().filter(function (b) { return enabled(b) && b.type === 'arduino_typed_variable' && isGlobal(b) && Blockly.Names.equals(raw, b.getFieldValue('VAR')); });
    if (found.length !== 1 || !/^(int|unsigned int|long|unsigned long|int8_t|uint8_t|int16_t|uint16_t|int32_t|uint32_t|byte|char|float|double)$/.test(found[0].getFieldValue('TYPE'))) throw Error('Declare a global numeric variable named ' + raw + ' before using a Serial number command.');
    var name = A.variableDB_.getName(raw, Blockly.Variables.NAME_TYPE), result = A.variableDB_.getDistinctName('serialResult', Blockly.Variables.NAME_TYPE);
    return '{\n  int8_t ' + result + ' = ' + A.serialMessageName_ + '.number(F(' + command(this) + '), ::' + name + ', ' + value(this, 'MIN') + ', ' + value(this, 'MAX') + ', ' + value(this, 'STEP') + ');\n  if (' + result + ' == 1) {\n' + A.statementToCode(this, 'DO') + '  } else if (' + result + ' == -1) {\n' + A.statementToCode(this, 'INVALID') + '  }\n}\n';
  };
  var previousInit = A.init;
  A.init = function (workspace) {
    previousInit.call(this, workspace); A.serialMessageDepth_ = 0; A.serialMessageCapacity_ = null;
    var readers = workspace.getAllBlocks().filter(function (b) { return enabled(b) && b.type === 'serial_receive_line'; });
    if (readers.length > 1) throw Error('Use one read serial lines block per project.');
    if (readers.length) {
      if (workspace.getAllBlocks().some(function (b) { return enabled(b) && b.type === 'serial_read'; })) throw Error('read serial lines owns the incoming bytes. Remove serial read byte so it cannot steal part of a command.');
      A.serialMessageCapacity_ = capacity(readers[0]);
      A.serialMessageName_ = A.variableDB_.getDistinctName('bxSerialLine', Blockly.Variables.NAME_TYPE);
      A.definitions_.include_BlocklySerial = '#include <BlocklySerial.h>';
      A.definitions_.serial_message_reader = 'BxSerialLine<' + A.serialMessageCapacity_ + '> ' + A.serialMessageName_ + ';';
    }
  };
  window.SerialMessageTemplate = {parse:templateParts, format:function (text) { return jsonTemplate(text, true, true); }, compact:function (text) { return jsonTemplate(text, false, false); }};
})();
