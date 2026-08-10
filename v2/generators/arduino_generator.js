/**
 * @license
 * Copyright 2012 Fred Lin
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Helper functions for generating Arduino for blocks.
 * @author gasolin@gmail.com (Fred Lin)
 * @author scanet@libreduc.cc (SebCanet)
 */

'use strict';

goog.provide('Blockly.Arduino');

goog.require('Blockly.Boards');
goog.require('Blockly.Generator');
goog.require('Blockly.utils.string');

/**
 * Arduino code generator.
 * @type !Blockly.Generator
 */
Blockly.Arduino = new Blockly.Generator('Arduino');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Arduino.addReservedWords(
        // http://arduino.cc/en/Reference/HomePage
        'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bookean,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts');

/**
 * Order of operation ENUMs.
 *
 */
Blockly.Arduino.ORDER_ATOMIC = 0; // 0 "" ...
Blockly.Arduino.ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] .
Blockly.Arduino.ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr
Blockly.Arduino.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Arduino.ORDER_ADDITIVE = 4; // + -
Blockly.Arduino.ORDER_SHIFT = 5; // << >>
Blockly.Arduino.ORDER_RELATIONAL = 6; // is is! >= > <= <
Blockly.Arduino.ORDER_EQUALITY = 7; // == != === !==
Blockly.Arduino.ORDER_BITWISE_AND = 8; // &
Blockly.Arduino.ORDER_BITWISE_XOR = 9; // ^
Blockly.Arduino.ORDER_BITWISE_OR = 10; // |
Blockly.Arduino.ORDER_LOGICAL_AND = 11; // &&
Blockly.Arduino.ORDER_LOGICAL_OR = 12; // ||
Blockly.Arduino.ORDER_CONDITIONAL = 13; // expr ? expr : expr
Blockly.Arduino.ORDER_ASSIGNMENT = 14; // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Arduino.ORDER_COMMA = 15;    // ,
Blockly.Arduino.ORDER_UNARY_NEGATION = 16;
Blockly.Arduino.ORDER_MEMBER = 17;
Blockly.Arduino.ORDER_NONE = 99; // (...)

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
Blockly.Arduino.ORDER_OVERRIDES = [
    // (foo()).bar -> foo().bar
    // (foo())[0] -> foo()[0]
    [Blockly.Arduino.ORDER_FUNCTION_CALL, Blockly.Arduino.ORDER_MEMBER],
    // (foo())() -> foo()()
    [Blockly.Arduino.ORDER_FUNCTION_CALL, Blockly.Arduino.ORDER_FUNCTION_CALL],
    // (foo.bar).baz -> foo.bar.baz
    // (foo.bar)[0] -> foo.bar[0]
    // (foo[0]).bar -> foo[0].bar
    // (foo[0])[1] -> foo[0][1]
    [Blockly.Arduino.ORDER_MEMBER, Blockly.Arduino.ORDER_MEMBER],
    // (foo.bar)() -> foo.bar()
    // (foo[0])() -> foo[0]()
    [Blockly.Arduino.ORDER_MEMBER, Blockly.Arduino.ORDER_FUNCTION_CALL],
    // !(!foo) -> !!foo
    [Blockly.Arduino.ORDER_LOGICAL_NOT, Blockly.Arduino.ORDER_LOGICAL_NOT],
    // a * (b * c) -> a * b * c
    [Blockly.Arduino.ORDER_MULTIPLICATION, Blockly.Arduino.ORDER_MULTIPLICATION],
    // a + (b + c) -> a + b + c
    [Blockly.Arduino.ORDER_ADDITION, Blockly.Arduino.ORDER_ADDITION],
    // a && (b && c) -> a && b && c
    [Blockly.Arduino.ORDER_LOGICAL_AND, Blockly.Arduino.ORDER_LOGICAL_AND],
    // a || (b || c) -> a || b || c
    [Blockly.Arduino.ORDER_LOGICAL_OR, Blockly.Arduino.ORDER_LOGICAL_OR]
];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Arduino.init = function (workspace) {
    // Create a dictionary of definitions to be printed at the top of the sketch
    Blockly.Arduino.includes_ = Object.create(null);
    // Create a dictionary of global definitions to be printed after variables
    Blockly.Arduino.definitions_ = Object.create(null);
    // Create a dictionary of variables
    Blockly.Arduino.variables_ = Object.create(null);
    // Create a dictionary of functions from the code generator
    Blockly.Arduino.codeFunctions_ = Object.create(null);
    // Create a dictionary of functions created by the user
    Blockly.Arduino.userFunctions_ = Object.create(null);
    // Create a dictionary mapping desired function names in definitions_
    // to actual function names (to avoid collisions with user functions)
    Blockly.Arduino.functionNames_ = Object.create(null);
    // Create a dictionary of setups to be printed in the setup() function
    Blockly.Arduino.setups_ = Object.create(null);

    if (!Blockly.Arduino.variableDB_) {
        Blockly.Arduino.variableDB_ =
                new Blockly.Names(Blockly.Arduino.RESERVED_WORDS_);
    } else {
        Blockly.Arduino.variableDB_.reset();
    }

    Blockly.Arduino.variableDB_.setVariableMap(workspace.getVariableMap());
    Blockly.Arduino.definitions_['variables'] = "";

    // get all types from all variable in workspace
    var allTypes = Code.workspace.getVariableTypes();
    for (var i = 0; i < allTypes.length - 1; i++) {
        var defvars = [];
        // get all variable for one of this type
        var allVarOfType = Code.workspace.getVariablesOfType(allTypes[i]);
        for (var j = 0; j < allVarOfType.length; j++) {
            defvars.push(allVarOfType[j].name);
        }
        Blockly.Arduino.definitions_['variables'] += allTypes[i] + ' ' + defvars.join(', ') + ';\n';
    }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Arduino.finish = function (code) {
    var includes = [],
        definitions = [],
        variables = [],
        functions = [],
        BLOCK_GLOBALS_ARRAY_SIZE = [];
    for (var name in Blockly.Arduino.includes_) {
        includes.push(Blockly.Arduino.includes_[name]);
    }
    if (includes.length) {
        includes.push('\n');
    }
    for (var name in Blockly.Arduino.definitions_) {
        definitions.push(Blockly.Arduino.definitions_[name]);
    }
    if (definitions.length) {
        definitions.push('\n');
    }
    for (var name in Blockly.Arduino.variables_) {
        variables.push(Blockly.Arduino.variables_[name]);
    }
    if (variables.length) {
        variables.push('\n');
    }
    for (var name in Blockly.Arduino.codeFunctions_) {
        functions.push(Blockly.Arduino.codeFunctions_[name]);
    }
    for (var name in Blockly.Arduino.userFunctions_) {
        functions.push(Blockly.Arduino.userFunctions_[name]);
    }
    if (functions.length) {
        functions.push('\n');
    }
    var setups = [''],
        userSetupCode = '';
    if (Blockly.Arduino.setups_['userSetupCode'] !== undefined) {
        userSetupCode = '\n' + Blockly.Arduino.setups_['userSetupCode'];
        delete Blockly.Arduino.setups_['userSetupCode'];
    }
    for (var name in Blockly.Arduino.setups_) {
        setups.push(Blockly.Arduino.setups_[name]);
    }
    if (userSetupCode) {
        setups.push(userSetupCode);
    }
    delete Blockly.Arduino.includes_;
    delete Blockly.Arduino.definitions_;
    delete Blockly.Arduino.codeFunctions_;
    delete Blockly.Arduino.userFunctions_;
    delete Blockly.Arduino.functionNames_;
    delete Blockly.Arduino.setups_;
    delete Blockly.Arduino.pins_;
    Blockly.Arduino.variableDB_.reset();
    var allDefs = includes.join('\n') + definitions.join('\n') + variables.join('\n') + functions.join('\n');
    var setup = 'void setup() {' + setups.join('\n  ') + '\n}\n\n';
    var loop = 'void loop() {\n  ' + code.replace(/\n/g, '\n  ') + '\n}';
    return allDefs + setup + loop;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Arduino.scrubNakedValue = function (line) {
    return line + ';\n';
};

/**
 * Encode a string as a properly escaped Arduino string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
Blockly.Arduino.quote_ = function (string) {
    // TODO: This is a quick hack.  Replace with goog.string.quote
    string = string.replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\\n')
            .replace(/\$/g, '\\$')
            .replace(/'/g, '\\\'');
    return '\"' + string + '\"';
};

/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @private
 */
Blockly.Arduino.scrub_ = function (block, code, opt_thisOnly) {
    if (code === null) {
        // Block has handled code generation itself.
        return '';
    }
    var commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
        // Collect comment for this block.
        var comment = block.getCommentText();
        if (comment) {
            commentCode += Blockly.Arduino.prefixLines(comment, '// ') + '\n';
        }
        // Collect comments for all value arguments.
        // Don't collect comments for nested statements.
        for (var x = 0; x < block.inputList.length; x++) {
            if (block.inputList[x].type == Blockly.INPUT_VALUE) {
                var childBlock = block.inputList[x].connection.targetBlock();
                if (childBlock) {
                    var comment = Blockly.Arduino.allNestedComments(childBlock);
                    if (comment) {
                        commentCode += Blockly.Arduino.prefixLines(comment, '// ');
                    }
                }
            }
        }
    }
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = Blockly.Arduino.blockToCode(nextBlock);
    return commentCode + code + nextCode;
};
