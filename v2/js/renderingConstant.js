/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Function to save important parameters in UI
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

/**
 * Create select listing for various dropdown menus
 */
Code.renderingConstantsInit = function() {
	/* add boards from list in boards.json
	 * in both boardMenu, hidden, but used for compilation,
	 * and boardDescriptionSelector in boards modal */
    // for (var k in profile) {
        // if (profile[k][0] instanceof Object) {
            // var option = document.createElement('option');
            // option.value = profile[k][0]._id;
            // option.text = profile[k][0].description;
            // document.getElementById('boardMenu').appendChild(option);
        // }
        // ;
    // }
    // for (var k in profile) {
        // if (profile[k][0] instanceof Object) {
            // var option = document.createElement('option');
            // option.value = profile[k][0]._id;
            // option.text = profile[k][0].description;
            // document.getElementById('boardDescriptionSelector').appendChild(option);
        // }
        // ;
    // }
}

/**
 * Change categories visibility in toolbox
 */
function toggleCategory(categoryChecked) {
    var toolbox = Blockly.getMainWorkspace().getToolbox();
    var category = toolbox.getToolboxItems()[categoryChecked];
    if (document.getElementById('checkbox_' + categoryChecked).checked == false) {
        category.hide();
		window.localStorage.toolboxids -= category;
	} else {
		category.show();
		window.localStorage.toolboxids += category;
	}
}