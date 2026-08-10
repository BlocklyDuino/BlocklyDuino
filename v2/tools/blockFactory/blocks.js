'use strict';

var ALIGNMENT_OPTIONS = [[Blockly.Msg.BF_alignement_left, 'LEFT'], [Blockly.Msg.BF_alignement_right, 'RIGHT'], [Blockly.Msg.BF_alignement_center, 'CENTRE']];

Blockly.Blocks['factory_base'] = { init: function() {
    this.setColour("#5B80A5");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(Blockly.Msg.BF_newBlock), 'NAME');
    this.appendStatementInput('INPUTS').setCheck('Input');
    var dropdown = new Blockly.FieldDropdown([
        [Blockly.Msg.BF_external, 'EXT'],
        [Blockly.Msg.BF_internal, 'INT']]);
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField(dropdown, 'INLINE');
    dropdown = new Blockly.FieldDropdown([
        [Blockly.Msg.BF_connect_updown, 'BOTH'],
        [Blockly.Msg.BF_connect_left, 'LEFT'],
        [Blockly.Msg.BF_connect_no, 'NONE'],
        [Blockly.Msg.BF_connect_up, 'TOP'],
        [Blockly.Msg.BF_connect_down, 'BOTTOM']],
        function(option) {
          this.sourceBlock_.updateShape_(option);
        });
    this.appendDummyInput()
		.setAlign(Blockly.ALIGN_RIGHT)
		.appendField(dropdown, 'CONNECTIONS');
    this.appendValueInput('COLOUR')
		.setAlign(Blockly.ALIGN_RIGHT)
		.setCheck('Colour')
		.appendField(Blockly.Msg.BF_color);
    this.setTooltip('Build a custom block by plugging\nfields, inputs and other blocks here.');
    this.setHelpUrl('https://developers.google.com/blockly/custom-blocks/block-factory');
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('connections', this.getFieldValue('CONNECTIONS'));
    return container;
  },
  domToMutation: function(xmlElement) {
    var connections = xmlElement.getAttribute('connections');
    this.updateShape_(connections);
  },
  updateShape_: function(option) {
    var outputExists = this.getInput('OUTPUTTYPE');
    var topExists = this.getInput('TOPTYPE');
    var bottomExists = this.getInput('BOTTOMTYPE');
    if (option == 'LEFT') {
      if (!outputExists) {
        this.appendValueInput('OUTPUTTYPE')
            .setCheck('Type')
			.setAlign(Blockly.ALIGN_RIGHT)
            .appendField('type');
        this.moveInputBefore('OUTPUTTYPE', 'COLOUR');
      }
    } else if (outputExists) {
      this.removeInput('OUTPUTTYPE');
    }
    if (option == 'TOP' || option == 'BOTH') {
      if (!topExists) {
        this.appendValueInput('TOPTYPE')
            .setCheck('Type')
			.setAlign(Blockly.ALIGN_RIGHT)
            .appendField('type haut');
        this.moveInputBefore('TOPTYPE', 'COLOUR');
      }
    } else if (topExists) {
      this.removeInput('TOPTYPE');
    }
    if (option == 'BOTTOM' || option == 'BOTH') {
      if (!bottomExists) {
        this.appendValueInput('BOTTOMTYPE')
            .setCheck('Type')
			.setAlign(Blockly.ALIGN_RIGHT)
            .appendField('type bas');
        this.moveInputBefore('BOTTOMTYPE', 'COLOUR');
      }
    } else if (bottomExists) {
      this.removeInput('BOTTOMTYPE');
    }
  }
};

Blockly.Blocks['input_value'] = { init: function() {
    this.setColour("#5B80A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_input_value_title)
        .appendField(new Blockly.FieldTextInput('NAME'), 'INPUTNAME');
    this.appendStatementInput('FIELDS')
        .setCheck('Field')
        .appendField(Blockly.Msg.BF_input_alignement)
        .appendField(new Blockly.FieldDropdown(ALIGNMENT_OPTIONS), 'ALIGN');
    this.appendValueInput('TYPE')
        .setCheck('Type')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.BF_input_value_type);
    this.setPreviousStatement(true, 'Input');
    this.setNextStatement(true, 'Input');
    this.setTooltip('A value socket for horizontal connections.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=71');
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    inputNameCheck(this);
  }
};

Blockly.Blocks['input_statement'] = { init: function() {
    this.setColour("#5B80A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_input_statement_title)
        .appendField(new Blockly.FieldTextInput('NAME'), 'INPUTNAME');
    this.appendStatementInput('FIELDS')
        .setCheck('Field')
        .appendField(Blockly.Msg.BF_input_alignement)
        .appendField(new Blockly.FieldDropdown(ALIGNMENT_OPTIONS), 'ALIGN');
    this.appendValueInput('TYPE')
        .setCheck('Type')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.BF_input_alignement);
    this.setPreviousStatement(true, 'Input');
    this.setNextStatement(true, 'Input');
    this.setTooltip('A statement socket for enclosed vertical stacks.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=246');
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    inputNameCheck(this);
  }
};

Blockly.Blocks['input_dummy'] = { init: function() {
    this.setColour("#5B80A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_input_dummy_title);
    this.appendStatementInput('FIELDS')
        .setCheck('Field')
        .appendField(Blockly.Msg.BF_input_alignement)
        .appendField(new Blockly.FieldDropdown(ALIGNMENT_OPTIONS), 'ALIGN');
    this.setPreviousStatement(true, 'Input');
    this.setNextStatement(true, 'Input');
    this.setTooltip('For adding fields on a separate row with no ' +
                    'connections. Alignment options (left, right, centre) ' +
                    'apply only to multi-line fields.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=293');
  }
};

Blockly.Blocks['field_static'] = { init: function() {
    this.setColour("#5BA58C");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_static_title)
        .appendField(new Blockly.FieldTextInput(''), 'TEXT');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Static text that serves as a label.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=88');
  }
};

Blockly.Blocks['field_input'] = { init: function() {
    this.setColour("#5BA58C");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_input_title)
        .appendField(new Blockly.FieldTextInput('default'), 'TEXT')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('An input field for the user to enter text.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=319');
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_math'] = { init: function() {
    this.setColour("#5BA58C");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_math_title)
        .appendField(new Blockly.FieldTextInput('123'), 'TEXT')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('An input field for the user to enter number.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=319');
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_angle'] = { init: function() {
    this.setColour("#5BA58C");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_angle_title)
        .appendField(new Blockly.FieldAngle('90'), 'ANGLE')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('An input field for the user to enter an angle.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=372');
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_dropdown'] = { init: function() {
    this.setColour("#5BA58C");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_dropdown_title)
        .appendField(',')
        .appendField(Blockly.Msg.BF_field_dropdown_title2)
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.appendDummyInput('OPTION0')
        .appendField(new Blockly.FieldTextInput('option'), 'USER0')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('OPTIONNAME'), 'CPU0');
    this.appendDummyInput('OPTION1')
        .appendField(new Blockly.FieldTextInput('option'), 'USER1')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('OPTIONNAME'), 'CPU1');
    this.appendDummyInput('OPTION2')
        .appendField(new Blockly.FieldTextInput('option'), 'USER2')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('OPTIONNAME'), 'CPU2');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setMutator(new Blockly.Mutator(['field_dropdown_option']));
    this.setTooltip('Dropdown menu with a list of options.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
    this.optionCount_ = 3;
  },
  mutationToDom: function(workspace) {
    var container = document.createElement('mutation');
    container.setAttribute('options', this.optionCount_);
    return container;
  },
  domToMutation: function(container) {
    for (var x = 0; x < this.optionCount_; x++) {
      this.removeInput('OPTION' + x);
    }
    this.optionCount_ = parseInt(container.getAttribute('options'), 10);
    for (var x = 0; x < this.optionCount_; x++) {
      var input = this.appendDummyInput('OPTION' + x);
      input.appendField(new Blockly.FieldTextInput('option'), 'USER' + x);
      input.appendField(',');
      input.appendField(new Blockly.FieldTextInput('OPTIONNAME'), 'CPU' + x);
    }
  },
  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'field_dropdown_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 0; x < this.optionCount_; x++) {
      var optionBlock =
          Blockly.Block.obtain(workspace, 'field_dropdown_option');
      optionBlock.initSvg();
      connection.connect(optionBlock.previousConnection);
      connection = optionBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    // Disconnect all input blocks and remove all inputs.
    for (var x = this.optionCount_ - 1; x >= 0; x--) {
      this.removeInput('OPTION' + x);
    }
    this.optionCount_ = 0;
    // Rebuild the block's inputs.
    var optionBlock = containerBlock.getInputTargetBlock('STACK');
    while (optionBlock) {
      this.appendDummyInput('OPTION' + this.optionCount_)
          .appendField(new Blockly.FieldTextInput(
              optionBlock.userData_ || 'option'), 'USER' + this.optionCount_)
          .appendField(',')
          .appendField(new Blockly.FieldTextInput(
              optionBlock.cpuData_ || 'OPTIONNAME'), 'CPU' + this.optionCount_);
      this.optionCount_++;
      optionBlock = optionBlock.nextConnection &&
          optionBlock.nextConnection.targetBlock();
    }
  },
  saveConnections: function(containerBlock) {
    // Store names and values for each option.
    var optionBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 0;
    while (optionBlock) {
      optionBlock.userData_ = this.getFieldValue('USER' + x);
      optionBlock.cpuData_ = this.getFieldValue('CPU' + x);
      x++;
      optionBlock = optionBlock.nextConnection &&
          optionBlock.nextConnection.targetBlock();
    }
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    if (this.optionCount_ < 1) {
      this.setWarningText(Blockly.Msg.BF_field_dropdown_warning);
    } else {
      fieldNameCheck(this);
    }
  }
};

Blockly.Blocks['field_dropdown_container'] = {
  // Container.
  init: function() {
    this.setColour("#5BA58C");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_dropdown_title);
    this.appendStatementInput('STACK');
    this.setTooltip('Add, remove, or reorder options\nto reconfigure this dropdown menu.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
    this.contextMenu = false;
  }
};

Blockly.Blocks['field_dropdown_option'] = {
  // Add option.
  init: function() {
    this.setColour("#5BA58C");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_dropdown_option);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Add a new option to the dropdown menu.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
    this.contextMenu = false;
  }
};

Blockly.Blocks['field_checkbox'] = { init: function() {
    this.setColour("#5BA58C");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_checkbox_title)
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'CHECKED')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Checkbox field.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=485');
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_colour'] = { init: function() {
    this.setColour("#5BA58C");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_colour_title)
        .appendField(new Blockly.FieldColour('#ff0000'), 'COLOUR')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Colour input field.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=495');
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_variable'] = { init: function() {
    this.setColour("#5BA58C");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_variable_title)
        .appendField(new Blockly.FieldTextInput('item'), 'TEXT')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Dropdown menu for variable names.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=510');
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_image'] = { init: function() {
    this.setColour("#5BA58C");
    var src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABA9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkzNEFBOEU3ODUyRTExRTU4RTQwRkQwODFEOUZEMEE3IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkzNEFBOEU2ODUyRTExRTU4RTQwRkQwODFEOUZEMEE3IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YmZlYzFmZjgtZjI0MS00MTdhLWJmYTQtMjZiOTdkYTJkZGI2IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZTJhODNmYmQtY2NkNC0xMTc4LTg4N2EtOWQ5MDZmZTFhNmQ0Ii8+IDxkYzp0aXRsZT4gPHJkZjpBbHQ+IDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+Z2x5cGhpY29uc19zb2NpYWw8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlS4AF8AAADxSURBVHjatFbbDcMgDDRV/8sGzQjdoIySbtAROkpHyAiMwAjJBjABhcpIfBCwE0A6BSFzhx+YAACoABvgOyNyKoGTG4wZDk6ccCXaHSKeMbRDBGbv//sWiv31SGCFEDp8niTb5EYlSQbnOeGGHjwQ1SLZc+8bIGM4MCQy4B0J01q2vnBzoHOSFvAwLAHFIJ/ZVcQ8va4JXAo52Xpe5ZLAnclhWwYl1yZGiBQ3RGkTaQSRmINXamxUD1hlip6s3F7Uq1SrXVMSyGXjwapeEpNEsOd8EFNGbs62a7tDYihPbaubDrlo3QXcQH4Ho39bfgIMAMz8AJn0V4bRAAAAAElFTkSuQmCC';
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_image_title)
        .appendField(new Blockly.FieldTextInput(src), 'SRC');
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_image_width)
        .appendField(new Blockly.FieldTextInput('24', Blockly.FieldTextInput.numberValidator), 'WIDTH')
        .appendField(Blockly.Msg.BF_field_image_height)
        .appendField(new Blockly.FieldTextInput('24', Blockly.FieldTextInput.numberValidator), 'HEIGHT');
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_image_alternativtext)
        .appendField(new Blockly.FieldTextInput('*'), 'ALT');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Static image (JPEG, PNG, GIF, SVG, BMP).\nRetains aspect ratio regardless of height and width.\nAlt text is for when collapsed.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=567');
  }
};

Blockly.Blocks['type_group'] = {
  // Group of types.
  init: function() {
    this.setColour("#5B67A5");
    this.appendValueInput('TYPE0')
        .setCheck('Type')
        .appendField(Blockly.Msg.BF_field_type_group_title);
    this.appendValueInput('TYPE1')
        .setCheck('Type');
    this.setOutput(true, 'Type');
    this.setMutator(new Blockly.Mutator(['type_group_item']));
    this.setTooltip('Allows more than one type to be accepted.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=677');
    this.typeCount_ = 2;
  },
  mutationToDom: function(workspace) {
    var container = document.createElement('mutation');
    container.setAttribute('types', this.typeCount_);
    return container;
  },
  domToMutation: function(container) {
    for (var x = 0; x < this.typeCount_; x++) {
      this.removeInput('TYPE' + x);
    }
    this.typeCount_ = parseInt(container.getAttribute('types'), 10);
    for (var x = 0; x < this.typeCount_; x++) {
      var input = this.appendValueInput('TYPE' + x)
                      .setCheck('Type');
      if (x == 0) {
        input.appendField(Blockly.Msg.BF_field_type_group_title);
      }
    }
  },
  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'type_group_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 0; x < this.typeCount_; x++) {
      var typeBlock = Blockly.Block.obtain(workspace, 'type_group_item');
      typeBlock.initSvg();
      connection.connect(typeBlock.previousConnection);
      connection = typeBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    // Disconnect all input blocks and remove all inputs.
    for (var x = this.typeCount_ - 1; x >= 0; x--) {
      this.removeInput('TYPE' + x);
    }
    this.typeCount_ = 0;
    // Rebuild the block's inputs.
    var typeBlock = containerBlock.getInputTargetBlock('STACK');
    while (typeBlock) {
      var input = this.appendValueInput('TYPE' + this.typeCount_)
                      .setCheck('Type');
      if (this.typeCount_ == 0) {
        input.appendField('any of');
      }
      // Reconnect any child blocks.
      if (typeBlock.valueConnection_) {
        input.connection.connect(typeBlock.valueConnection_);
      }
      this.typeCount_++;
      typeBlock = typeBlock.nextConnection &&
          typeBlock.nextConnection.targetBlock();
    }
  },
  saveConnections: function(containerBlock) {
    // Store a pointer to any connected child blocks.
    var typeBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 0;
    while (typeBlock) {
      var input = this.getInput('TYPE' + x);
      typeBlock.valueConnection_ = input && input.connection.targetConnection;
      x++;
      typeBlock = typeBlock.nextConnection &&
          typeBlock.nextConnection.targetBlock();
    }
  }
};

Blockly.Blocks['type_group_container'] = {
  // Container.
  init: function() {
    this.setColour("#5B67A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_type_group_title2);
    this.appendStatementInput('STACK');
    this.setTooltip('Add, or remove allowed type.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=677');
    this.contextMenu = false;
  }
};

Blockly.Blocks['type_group_item'] = {
  // Add type.
  init: function() {
    this.setColour("#5B67A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_type_group_item);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Add a new allowed type.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=677');
    this.contextMenu = false;
  }
};

Blockly.Blocks['type_null'] = {
  // Null type.
  valueType: null,
  init: function() {
    this.setColour("#5B67A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_type_group_null);
    this.setOutput(true, 'Type');
    this.setTooltip('Any type is allowed.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602');
  }
};

Blockly.Blocks['type_boolean'] = {
  // Boolean type.
  valueType: 'Boolean',
  init: function() {
    this.setColour("#5B67A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_type_boolean);
    this.setOutput(true, 'Type');
    this.setTooltip('Booleans (true/false) are allowed.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602');
  }
};

Blockly.Blocks['type_number'] = {
  // Number type.
  valueType: 'Number',
  init: function() {
    this.setColour("#5B67A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_type_number);
    this.setOutput(true, 'Type');
    this.setTooltip('Numbers (int/float) are allowed.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602');
  }
};

Blockly.Blocks['type_string'] = {
  // String type.
  valueType: 'String',
  init: function() {
    this.setColour("#5B67A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_type_text);
    this.setOutput(true, 'Type');
    this.setTooltip('Strings (text) are allowed.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602');
  }
};

Blockly.Blocks['type_list'] = {
  valueType: 'Array',
  init: function() {
    this.setColour("#5B67A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_type_list);
    this.setOutput(true, 'Type');
    this.setTooltip('Arrays (lists) are allowed.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602');
  }
};

Blockly.Blocks['type_other'] = {
  // Other type.
  init: function() {
    this.setColour("#5B67A5");
    this.appendDummyInput()
        .appendField(Blockly.Msg.BF_field_type_other)
        .appendField(new Blockly.FieldTextInput(''), 'TYPE');
    this.setOutput(true, 'Type');
    this.setTooltip('Custom type to allow.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=702');
  }
};

Blockly.Blocks['colour_hue'] = { init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldAngle('0', this.validator), 'HUE');
    this.setOutput(true, 'Colour');
    this.setTooltip('Paint the block with this colour.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=55');
  },
  validator: function(text) {
    // Update the current block's colour to match.
    this.sourceBlock_.setColour(text);
  },
  mutationToDom: function(workspace) {
    var container = document.createElement('mutation');
    container.setAttribute('colour', this.getColour());
    return container;
  },
  domToMutation: function(container) {
    this.setColour(container.getAttribute('colour'));
  }
};

function fieldNameCheck(referenceBlock) {
  var name = referenceBlock.getFieldValue('FIELDNAME').toLowerCase();
  var count = 0;
  var blocks = referenceBlock.workspace.getAllBlocks();
  for (var x = 0, block; block = blocks[x]; x++) {
    var otherName = block.getFieldValue('FIELDNAME');
    if (!block.disabled && !block.getInheritedDisabled() &&
        otherName && otherName.toLowerCase() == name) {
      count++;
    }
  }
  var msg = (count > 1) ?
      'There are ' + count + ' field blocks\n with this name.' : null;
  referenceBlock.setWarningText(msg);
};

function inputNameCheck(referenceBlock) {
  var name = referenceBlock.getFieldValue('INPUTNAME').toLowerCase();
  var count = 0;
  var blocks = referenceBlock.workspace.getAllBlocks();
  for (var x = 0, block; block = blocks[x]; x++) {
    var otherName = block.getFieldValue('INPUTNAME');
    if (!block.disabled && !block.getInheritedDisabled() &&
        otherName && otherName.toLowerCase() == name) {
      count++;
    }
  }
  var msg = (count > 1) ?
      Blockly.Msg.BF_field_name_warning1 + count + Blockly.Msg.BF_field_name_warning2 : null;
  referenceBlock.setWarningText(msg);
};