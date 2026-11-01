/* Program structure, lexical declarations and fixed-size arrays for BlocklyDuino. */
(function () {
  'use strict';
  var A = Blockly.Arduino;
  var TYPES = [['int','int'], ['unsigned int','unsigned int'], ['long','long'],
    ['unsigned long','unsigned long'], ['int8_t','int8_t'], ['uint8_t','uint8_t'],
    ['int16_t','int16_t'], ['uint16_t','uint16_t'], ['int32_t','int32_t'],
    ['uint32_t','uint32_t'], ['float','float'], ['double','double'],
    ['bool','bool'], ['char','char'], ['String','String'], ['byte','byte']];
  function typeOf(b) { return (b.getFieldValue('QUALIFIER') === 'volatile' ? 'volatile ' : '') + b.getFieldValue('TYPE'); }
  function getVars() { return [this.getFieldValue('VAR')]; }
  function renameVar(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
      if (this.syncArrayShape_) this.syncArrayShape_();
    }
  }
  function nameOf(block) {
    return A.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  }
  function value(block, input, fallback) {
    return A.valueToCode(block, input, A.ORDER_NONE) || fallback;
  }
  function shape(text) {
    var parts = String(text || '8').split(/\s*[,xX]\s*/);
    for (var i = 0; i < parts.length; i++) {
      parts[i]=parts[i].replace(/^\s+|\s+$/g,'');
      if (!/^\d+$/.test(parts[i]) || Number(parts[i]) < 1 || Number(parts[i]) > 255)
        throw Error('Each array dimension must be between 1 and 255.');
      parts[i] = String(Number(parts[i]));
    }
    return parts;
  }
  function suffix(block) { return '[' + shape(block.getFieldValue('SIZE')).join('][') + ']'; }
  function isFunction(b) { return b.type === 'procedures_defnoreturn' || b.type === 'procedures_defreturn'; }
  /* Follow statement-input edges rather than previous-statement edges: each C++
     body has its own scope, while a function RETURN input shares its body scope. */
  function scopes(block) {
    var result = [], child = block, parent;
    while (child && (parent = child.getParent())) {
      if (isFunction(parent)) {
        if (result.indexOf('function:' + parent.id) < 0) result.push('function:' + parent.id);
      } else {
        for (var i = 0; i < parent.inputList.length; i++) {
          var input = parent.inputList[i];
          if (input.type === Blockly.NEXT_STATEMENT && input.connection && input.connection.targetBlock() === child) {
            result.push(parent.id + ':' + input.name);
            break;
          }
        }
      }
      child = parent;
    }
    return result;
  }
  function enabled(block) {
    return !block.disabled && !block.getInheritedDisabled();
  }
  function declaration(block) {
    return block.type === 'arduino_typed_variable' || block.type === 'arduino_array_declare';
  }
  var originalInit = A.init;
  A.init = function (workspace) {
    originalInit.call(this, workspace);
    var initialBlocks = workspace.getAllBlocks();
    for (var ai=0;ai<initialBlocks.length;ai++) if (enabled(initialBlocks[ai]) && initialBlocks[ai].syncArrayShape_) {
      arrayDeclaration(initialBlocks[ai], null, true);
      initialBlocks[ai].syncArrayShape_();
    }
    var blocks = workspace.getAllBlocks(), declared = Object.create(null), globals = [];
    var implicit = Object.create(null);
    function add(name, scope, block, isParameter) {
      var key = name.toLowerCase();
      var entries = declared[key] || (declared[key] = []);
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].scope === scope) throw Error('Duplicate declaration of "' + name + '" in the same scope.');
      }
      entries.push({scope:scope, block:block, parameter:!!isParameter});
    }
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (!enabled(b)) continue;
      if (declaration(b)) {
        var scope = scopes(b)[0] || 'global';
        add(b.getFieldValue('VAR'), scope, b, false);
        if (scope === 'global') globals.push(typeOf(b) + ' ' + nameOf(b) +
          (b.type === 'arduino_array_declare' ? suffix(b) : '') + ';');
      }
      if (isFunction(b)) {
        for (var j = 0; j < b.arguments_.length; j++) add(b.arguments_[j], 'function:' + b.id, b, true);
      }
    }
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (!enabled(b) || declaration(b) || isFunction(b) || !b.getVars) continue;
      var refs = b.getVars(), chain = scopes(b);
      chain.push('global');
      for (var j = 0; j < refs.length; j++) {
        var raw = refs[j];
        if (!raw) continue;
        var entries = declared[raw.toLowerCase()], found = false;
        if (entries) {
          for (var k = 0; k < entries.length; k++) if (chain.indexOf(entries[k].scope) >= 0) found = true;
          if (!found) throw Error('Variable "' + raw + '" is local to another body. Move its declaration outside the function to share it.');
        } else {
          // Preserve old BlocklyDuino XML programs whose variables had no declaration blocks.
          implicit[raw.toLowerCase()] = A.variableDB_.getName(raw, Blockly.Variables.NAME_TYPE);
        }
      }
    }
    for (var key in implicit) globals.push('int ' + implicit[key] + ';');
    A.definitions_['variables'] = globals.join('\n');
  };
  var originalFinish = A.finish;
  A.finish = function (code) {
    var ordered = Object.create(null), keys = Object.keys(A.setups_);
    function group(prefix, invert) {
      keys.forEach(function (key) {
        var match = prefix.test(key);
        if (invert ? !match : match) ordered[key] = A.setups_[key];
      });
    }
    group(/^var_initial_/, false);
    group(/^(var_initial_|user_setup_)/, true);
    group(/^user_setup_/, false);
    A.setups_ = ordered;
    return originalFinish.call(this, code);
  };

  Blockly.Blocks.arduino_setup_section = {init:function () {
    this.setColour(120); this.appendStatementInput('DO').appendField('setup');
    this.setTooltip('Runs once after power-up or reset. Put initialization here. A variable declared inside this body is local to setup.');
  }};
  A.arduino_setup_section = function () {
    A.setups_['user_setup_' + this.id] = A.statementToCode(this, 'DO'); return '';
  };
  Blockly.Blocks.arduino_loop_section = {init:function () {
    this.setColour(120); this.appendStatementInput('DO').appendField('loop');
    this.setTooltip('Repeats while the board is powered. Variables declared here are local and reinitialized on each pass. Use a top-level declaration to retain state.');
  }};
  A.arduino_loop_section = function () { return A.statementToCode(this, 'DO'); };

  Blockly.Blocks.arduino_typed_variable = {
    init:function () {
      this.setColour(330);
      this.appendValueInput('VALUE').appendField(new Blockly.FieldDropdown([['declare','normal'],['volatile','volatile']]),'QUALIFIER')
        .appendField(new Blockly.FieldDropdown(TYPES), 'TYPE')
        .appendField(new Blockly.FieldVariable('value'), 'VAR').appendField('=');
      this.setPreviousStatement(true, null); this.setNextStatement(true, null);
      this.setTooltip('Declare a typed variable before its first use. Outside every body it is global; inside setup, loop or a function it is local to that body. Initial value defaults to zero. Choose volatile for a variable shared with an interrupt; use an atomic section for multi-byte access or read-modify-write.');
    }, getVars:getVars, renameVar:renameVar
  };
  A.arduino_typed_variable = function () {
    var type = this.getFieldValue('TYPE'), name = nameOf(this);
    var initial = value(this, 'VALUE', type === 'String' ? '""' : type === 'bool' ? 'false' : '0');
    if (scopes(this).length) return typeOf(this) + ' ' + name + ' = ' + initial + ';\n';
    A.setups_['var_initial_' + name] = name + ' = ' + initial + ';';
    return '';
  };
  Blockly.Blocks.arduino_array_declare = {
    init:function () {
      this.setColour(330);
      this.appendDummyInput().appendField(new Blockly.FieldDropdown([['array','normal'],['volatile array','volatile']]),'QUALIFIER')
        .appendField(new Blockly.FieldDropdown(TYPES.filter(function (p) { return p[1] !== 'String'; })), 'TYPE')
        .appendField(new Blockly.FieldVariable('data'), 'VAR').appendField('shape')
        .appendField(new Blockly.FieldTextInput('8', function (text) {
          try { return shape(text).join(','); } catch (e) { return null; }
        }), 'SIZE');
      this.setPreviousStatement(true, null); this.setNextStatement(true, null);
      this.setTooltip('Fixed-size array, initially zero. Enter comma-separated dimensions: 8 or 4,8 or 2,3,4,5. Access blocks automatically show one index socket per dimension. Sizes are compile-time whole numbers; the full array must fit RAM. Outside bodies it is global; inside a body it is local. Choose volatile array when an interrupt also accesses its elements; volatile does not make accesses atomic.');
    }, getVars:getVars, renameVar:renameVar
  };
  A.arduino_array_declare = function () {
    if (!scopes(this).length) return '';
    return typeOf(this) + ' ' + nameOf(this) + suffix(this) + ' = {};\n';
  };
  function arrayWorkspace(block) {
    return block.workspace.targetWorkspace || block.workspace;
  }
  // Resolve the nearest declaration, including scalar/argument shadows. UI
  // previews local arrays in flyouts; actual generation requires visible scope.
  function arrayDeclaration(block, selected, required) {
    var name=selected===null||selected===undefined?block.getFieldValue('VAR'):selected;
    var all=arrayWorkspace(block).getAllBlocks(), chain=scopes(block), best=null, distance=Infinity, elsewhere=false;
    chain.push('global');
    for(var i=0;i<all.length;i++) {
      var b=all[i]; if(!enabled(b)) continue;
      if(declaration(b)&&Blockly.Names.equals(name,b.getFieldValue('VAR'))) {
        var scope=scopes(b)[0]||'global', at=chain.indexOf(scope);
        if(b.type==='arduino_array_declare') elsewhere=true;
        if(at>=0&&at<distance){best=b;distance=at;}
      }
      if(isFunction(b)) for(var j=0;j<b.arguments_.length;j++) {
        if(Blockly.Names.equals(name,b.arguments_[j])) {
          var at=chain.indexOf('function:'+b.id);
          if(at>=0&&at<distance){best=b;distance=at;}
        }
      }
    }
    if(best&&best.type==='arduino_array_declare')return best;
    if(!required&&block.isInFlyout&&!best) {
      for(var i=0;i<all.length;i++) if(all[i].type==='arduino_array_declare'&&Blockly.Names.equals(name,all[i].getFieldValue('VAR')))return all[i];
    }
    if(required) {
      if(best)throw Error('"'+name+'" is not an array in this body. Choose a declared array.');
      if(elsewhere)throw Error('Array "'+name+'" is local to another body. Move its declaration outside the function to share it.');
      throw Error('Array "'+(name||'?')+'" is not declared. Add an array declaration, then choose its name.');
    }
    return null;
  }
  function arrayOptions() {
    var b=this.sourceBlock_, names=[], seen=Object.create(null);
    if(b&&b.workspace) {
      var all=arrayWorkspace(b).getAllBlocks();
      for(var i=0;i<all.length;i++)if(all[i].type==='arduino_array_declare'&&enabled(all[i])) {
        var name=all[i].getFieldValue('VAR');
        if(!seen[name.toLowerCase()]){names.push(name);seen[name.toLowerCase()]=true;}
      }
    }
    names.sort(function(a,b){return a.toLowerCase().localeCompare(b.toLowerCase());});
    return names.length?names.map(function(n){return [n,n];}):[['declare an array first','']];
  }
  function arrayField() {
    return new Blockly.FieldDropdown(arrayOptions,function(name){
      if(this.sourceBlock_&&this.sourceBlock_.syncArrayShape_)this.sourceBlock_.syncArrayShape_(name);
    });
  }
  function syncArrayShape(selected) {
    var def=arrayDeclaration(this,selected,false);
    if(def) {
      var rank=shape(def.getFieldValue('SIZE')).length;
      if(this.updateShape_)this.updateShape_(rank);
      if(this.getField('AXIS')&&Number(this.getFieldValue('AXIS'))>rank)this.setFieldValue('1','AXIS');
    }
    if(this.setWarningText&&!this.isInFlyout)this.setWarningText(def?null:'Choose an array declared in this body or outside all bodies.');
  }
  function indexedBlock(setter) {
    return {
      init:function () {
        this.setColour(330);this.rank_=0;
        this.appendDummyInput('HEAD').appendField(setter?'set':'get').appendField(arrayField(),'VAR');
        this.appendDummyInput('TAIL').appendField(']');
        if(setter){this.appendValueInput('VALUE').appendField('=');this.setPreviousStatement(true);this.setNextStatement(true);}
        else this.setOutput(true);
        // Read old XML's DIM field without showing a manual dimension selector.
        this.appendDummyInput('LEGACY_DIM').appendField(new Blockly.FieldTextInput('1'),'DIM').setVisible(false);
        this.updateShape_(1);this.setInputsInline(true);
        this.setTooltip((setter?'Write':'Read')+' one array element. The declaration determines the index sockets. Drag variables, numbers or calculations into the brackets; empty indices mean 0. Fractional results are truncated toward zero. Keep each index at least zero and below its dimension size.');
      },
      updateShape_:function(rank) {
        var old=this.rank_||0;
        for(var n=old;n>rank;n--)if(this.getInput(n===1?'INDEX':'INDEX'+n))this.removeInput(n===1?'INDEX':'INDEX'+n);
        for(var n=1;n<=rank;n++) {
          var input=n===1?'INDEX':'INDEX'+n;
          if(!this.getInput(input)){this.appendValueInput(input).setCheck('Number').appendField(n===1?'[':'][');this.moveInputBefore(input,'TAIL');}
        }
        this.rank_=rank;
        if(this.getField('DIM')&&this.getFieldValue('DIM')!==String(rank))this.setFieldValue(String(rank),'DIM');
      },
      syncArrayShape_:syncArrayShape,
      onchange:function(){if(this.workspace)this.syncArrayShape_();},
      mutationToDom:function(){var el=document.createElement('mutation');el.setAttribute('rank',this.rank_);return el;},
      domToMutation:function(el){var rank=Math.max(1,Math.floor(Number(el.getAttribute('rank'))||1));this.updateShape_(rank);},
      getVars:getVars,renameVar:renameVar
    };
  }
  Blockly.Blocks.arduino_array_get=indexedBlock(false);
  Blockly.Blocks.arduino_array_set=indexedBlock(true);
  function indexedName(block) {
    var rank=shape(arrayDeclaration(block,null,true).getFieldValue('SIZE')).length,result=nameOf(block);
    for(var i=1;i<=rank;i++) {
      var input=i===1?'INDEX':'INDEX'+i;
      result+='[(int)('+value(block,input,'0')+')]';
    }
    return result;
  }
  A.arduino_array_get=function(){return [indexedName(this),A.ORDER_ATOMIC];};
  A.arduino_array_set=function(){return indexedName(this)+' = '+value(this,'VALUE','0')+';\n';};
  Blockly.Blocks.arduino_array_length={
    init:function(){
      this.setColour(330);this.appendDummyInput().appendField('size').appendField(arrayField(),'VAR')
        .appendField(new Blockly.FieldDropdown(function(){
          var def=this.sourceBlock_&&arrayDeclaration(this.sourceBlock_,null,false),rank=def?shape(def.getFieldValue('SIZE')).length:1,options=[];
          for(var i=1;i<=rank;i++)options.push(['axis '+i,String(i)]);
          return options;
        }),'AXIS');
      this.setOutput(true,'Number');this.setTooltip('Size of one array dimension. For shape 4,8, axis 1 is 4 and axis 2 is 8. The declaration supplies the available axes.');
    },syncArrayShape_:syncArrayShape,onchange:function(){if(this.workspace)this.syncArrayShape_();},getVars:getVars,renameVar:renameVar
  };
  A.arduino_array_length=function(){
    var rank=shape(arrayDeclaration(this,null,true).getFieldValue('SIZE')).length,name=nameOf(this),axis=Number(this.getFieldValue('AXIS')||'1');
    if(axis<1||axis>rank)throw Error('Array size axis does not exist in the declaration.');
    for(var i=1;i<axis;i++)name+='[0]';
    return ['(sizeof('+name+') / sizeof('+name+'[0]))',A.ORDER_ATOMIC];
  };
  ['millis','micros'].forEach(function (fn) {
    Blockly.Blocks['arduino_'+fn]={init:function () {
      this.setColour(120); this.appendDummyInput().appendField(fn+'()'); this.setOutput(true,'Number');
      this.setTooltip((fn==='millis'?'Milliseconds':'Microseconds')+' since startup, as unsigned long. Compare elapsed time with unsigned subtraction so counter rollover remains safe.');
    }};
    A['arduino_'+fn]=function () { return [fn+'()',A.ORDER_ATOMIC]; };
  });

  // Extend the existing function mutator instead of introducing a second family
  // of function blocks. Old <arg name="..."> XML keeps its int default.
  function scalarType(type) {
    for(var i=0;i<TYPES.length;i++)if(TYPES[i][1]===type)return type;
    return 'int';
  }
  function argumentType(block,index) { return scalarType(block.argumentTypes_&&block.argumentTypes_[index]); }
  function zeroValue(type) { return type==='String'?'""':type==='bool'?'false':'0'; }
  Blockly.Blocks.procedures_mutatorarg.init=function(){
    this.setColour(Blockly.Blocks.procedures.HUE);
    this.appendDummyInput().appendField(new Blockly.FieldDropdown(TYPES),'TYPE')
      .appendField(new Blockly.FieldTextInput('x',this.validator_),'NAME');
    this.setPreviousStatement(true);this.setNextStatement(true);this.contextMenu=false;
    this.setTooltip('Choose a scalar argument type and name. Values are copied into the function. Use float for fractions or uint32_t for large positive counters.');
  };
  ['procedures_defnoreturn','procedures_defreturn'].forEach(function(kind){
    var def=Blockly.Blocks[kind],init=def.init,serialize=def.mutationToDom,deserialize=def.domToMutation;
    var decompose=def.decompose,compose=def.compose,update=def.updateParams_;
    def.init=function(){
      this.argumentTypes_=[];init.call(this);
      if(kind==='procedures_defreturn')this.getInput('RETURN').setCheck(null).appendField(new Blockly.FieldDropdown(TYPES),'RETURN_TYPE');
      this.setTooltip(kind==='procedures_defreturn'?
        'Define a function with a result. Choose its return type; use the gear to add typed arguments. Values are copied into the function.':
        'Define a reusable function. Use the gear to add typed arguments, then place its call block where it should run. Values are copied into the function.');
    };
    def.updateParams_=function(){
      update.call(this);
      var params=[];for(var i=0;i<this.arguments_.length;i++)params.push(argumentType(this,i)+' '+this.arguments_[i]);
      this.setFieldValue(params.length?'('+params.join(', ')+')':'','PARAMS');
    };
    def.mutationToDom=function(){
      var dom=serialize.call(this),args=dom.getElementsByTagName('arg');
      for(var i=0;i<args.length;i++)args[i].setAttribute('type',argumentType(this,i));
      return dom;
    };
    def.domToMutation=function(dom){
      this.argumentTypes_=[];
      for(var i=0;i<dom.childNodes.length;i++)if(dom.childNodes[i].nodeName.toLowerCase()==='arg')
        this.argumentTypes_.push(scalarType(dom.childNodes[i].getAttribute('type')));
      deserialize.call(this,dom);
    };
    def.decompose=function(workspace){
      var container=decompose.call(this,workspace),param=container.getInputTargetBlock('STACK'),i=0;
      while(param){param.setFieldValue(argumentType(this,i++),'TYPE');param=param.nextConnection&&param.nextConnection.targetBlock();}
      return container;
    };
    def.compose=function(container){
      this.argumentTypes_=[];var param=container.getInputTargetBlock('STACK');
      while(param){this.argumentTypes_.push(scalarType(param.getFieldValue('TYPE')));param=param.nextConnection&&param.nextConnection.targetBlock();}
      compose.call(this,container);
    };
  });
  A.procedures_defnoreturn=A.procedures_defreturn=function(){
    var name=A.variableDB_.getName(this.getFieldValue('NAME'),Blockly.Procedures.NAME_TYPE);
    var returns=this.type==='procedures_defreturn',type=returns?(this.getFieldValue('RETURN_TYPE')||'int'):'void';
    var body=A.statementToCode(this,'STACK');
    if(A.INFINITE_LOOP_TRAP)body=A.INFINITE_LOOP_TRAP.replace(/%1/g,"'"+this.id+"'")+body;
    var args=[];for(var i=0;i<this.arguments_.length;i++)args.push(argumentType(this,i)+' '+A.variableDB_.getName(this.arguments_[i],Blockly.Variables.NAME_TYPE));
    if(returns)body+='  return '+value(this,'RETURN',zeroValue(type))+';\n';
    A.definitions_[name]=A.scrub_(this,type+' '+name+'('+args.join(', ')+') {\n'+body+'}\n');return null;
  };
  ['procedures_callnoreturn','procedures_callreturn'].forEach(function(kind){
    A[kind]=function(){
      var raw=this.getFieldValue('NAME'),name=A.variableDB_.getName(raw,Blockly.Procedures.NAME_TYPE),args=[];
      var definition=Blockly.Procedures.getDefinition(raw,this.workspace);
      for(var i=0;i<this.arguments_.length;i++)args.push(value(this,'ARG'+i,zeroValue(definition?argumentType(definition,i):'int')));
      var call=name+'('+args.join(', ')+')';
      return kind==='procedures_callreturn'?[call,A.ORDER_UNARY_POSTFIX]:call+';\n';
    };
  });

  // The old bundled generator ignored BY. Add the socket to older block builds
  // and use step magnitude; direction follows FROM/TO, including descending loops.
  var forInit = Blockly.Blocks.controls_for.init;
  Blockly.Blocks.controls_for.init = function () {
    forInit.call(this);
    if (!this.getInput('BY')) {
      this.appendValueInput('BY').setCheck('Number').appendField('step');
      this.moveInputBefore('BY', 'DO');
    }
    this.setTooltip('Count in whole-number steps, including both ends. Direction follows from/to. Step defaults to 1; negative steps use their magnitude. Step must not be zero. Use a counter type large enough for the range.');
  };
  A.controls_for = function () {
    var variable = nameOf(this), start = value(this, 'FROM', '0'), end = value(this, 'TO', '0'), step = value(this, 'BY', '1');
    var body = A.statementToCode(this, 'DO');
    if (A.INFINITE_LOOP_TRAP) body = A.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + this.id + "'") + body;
    if (/^-?\d+(?:\.0+)?$/.test(step) && Number(step) === 0) throw Error('For-loop step must not be zero.');
    if (/^-?\d+$/.test(start) && /^-?\d+$/.test(end) && /^-?\d+$/.test(step)) {
      var up = Number(start) <= Number(end), stride = Math.abs(Number(step));
      return 'for (' + variable + ' = ' + start + '; ' + variable + (up ? ' <= ' : ' >= ') + end + '; ' + variable + (up ? ' += ' : ' -= ') + stride + ') {\n' + body + '}\n';
    }
    var startName = A.variableDB_.getDistinctName(variable + '_from', Blockly.Variables.NAME_TYPE);
    var endName = A.variableDB_.getDistinctName(variable + '_to', Blockly.Variables.NAME_TYPE);
    var stepName = A.variableDB_.getDistinctName(variable + '_step', Blockly.Variables.NAME_TYPE);
    return 'long ' + startName + ' = ' + start + ';\nlong ' + endName + ' = ' + end + ';\nlong ' + stepName + ' = ' + step + ';\n' +
      'if (' + stepName + ' < 0) ' + stepName + ' = -' + stepName + ';\n' +
      'for (' + variable + ' = ' + startName + '; ' + stepName + ' != 0 && (' + startName + ' <= ' + endName + ' ? ' + variable + ' <= ' + endName + ' : ' + variable + ' >= ' + endName + '); ' +
      variable + ' += (' + startName + ' <= ' + endName + ' ? ' + stepName + ' : -' + stepName + ')) {\n' + body + '}\n';
  };

  Blockly.Blocks.arduino_array_ref={init:function(){this.setColour(330);this.appendDummyInput().appendField('array').appendField(arrayField(),'VAR');this.setOutput(true,'Array');this.setTooltip('Pass the whole array to an operation, without copying it. Its dimensions and element type come from the declaration. Use get [index] for a single element.');},getVars:getVars,renameVar:renameVar};
  A.arduino_array_ref=function(){arrayDeclaration(this,null,true);return [nameOf(this),A.ORDER_ATOMIC];};
  Blockly.ArrayRegistry={declaration:arrayDeclaration,shape:shape,name:nameOf};
  var previousScrub=A.scrub_;
  A.scrub_=function(block,code){
    if(code===''&&block.getCommentText()){
      var comment=A.prefixLines(block.getCommentText(),'// ')+'\n';
      if(block.type==='arduino_setup_section')A.setups_['user_setup_'+block.id]=comment+(A.setups_['user_setup_'+block.id]||'');
      else A.definitions_['comment_'+block.id]=comment;
      // These declarations already emitted code elsewhere. Only scrub the next
      // statement here; otherwise their comments incorrectly appear in loop.
      return A.blockToCode(block.nextConnection&&block.nextConnection.targetBlock());
    }
    return previousScrub.call(this,block,code);
  };
  // One compact Variables flyout instead of a getter/setter pair for every name.
  Blockly.Variables.flyoutCategory = function (blocks, gaps, margin, workspace) {
    var target=workspace.targetWorkspace, all=target.getAllBlocks(), scalar='value', array='data';
    for (var i=0;i<all.length;i++) {
      if (all[i].type==='arduino_typed_variable') scalar=all[i].getFieldValue('VAR');
      if (all[i].type==='arduino_array_declare') array=all[i].getFieldValue('VAR');
    }
    var specs=[['arduino_typed_variable',scalar],['variables_set',scalar],['variables_get',scalar],
      ['arduino_array_declare',array],['arduino_array_set',array],['arduino_array_get',array],['arduino_array_length',array],['arduino_array_ref',array]];
    for(var i=0;i<specs.length;i++) {
      var block=Blockly.Block.obtain(workspace,specs[i][0]); block.initSvg(); block.setFieldValue(specs[i][1],'VAR');
      if(block.syncArrayShape_)block.syncArrayShape_();
      blocks.push(block); gaps.push(i===2?margin*3:margin*1.5);
    }
  };
}());
