/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Intercept data to modify toolbox for user
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

var jsonToolbox = {
	"kind": "categoryToolbox",
	"contents": []
};
jsonToolbox["contents"][0] = toolbox_standard["contents"][0];
jsonToolbox["contents"][1] = toolbox_standard["contents"][1];
jsonToolbox["contents"][2] = toolbox_standard["contents"][2];
jsonToolbox["contents"][3] = toolbox_standard["contents"][3];
jsonToolbox["contents"][4] = toolbox_standard["contents"][4];
jsonToolbox["contents"][5] = toolbox_standard["contents"][5];
jsonToolbox["contents"][6] = toolbox_standard["contents"][6];
jsonToolbox["contents"][7] = toolbox_standard["contents"][7];
jsonToolbox["contents"][8] = toolbox_arduino["contents"][0];
jsonToolbox["contents"][9] = toolbox_ds18b20["contents"][0];
jsonToolbox["contents"][10] = toolbox_grove["contents"][0];
jsonToolbox["contents"][11] = toolbox_relay["contents"][0];
jsonToolbox["contents"][12] = toolbox_servo["contents"][0];

/**
 * Build the toolbox using toolbox definition in json files
 */
Code.buildToolbox = function() {
	// set the toolbox from url 
	var toolboxIds = Code.getStringParamFromUrl('toolboxids', '');
	var boardSelected = Code.getStringParamFromUrl('board', '');
	// set the default toolbox if none
	if (toolboxIds === undefined || toolboxIds === "") {
		if (boardSelected) {
			toolboxIds = 'LOGIC,LOOPS,MATH,TEXT,LIST,COLOUR,VARIABLES,FUNCTIONS,BOARD';
			window.localStorage.defaultToolbox = 1;
		}
		else {
			toolboxIds = 'LOGIC,LOOPS,MATH,TEXT,LIST,COLOUR,VARIABLES,FUNCTIONS';
			window.localStorage.defaultToolbox = 0;
		}
	} else {
		toolboxIds += ',LOGIC,LOOPS,MATH,TEXT,LIST,COLOUR,VARIABLES,FUNCTIONS,BOARD';
			window.localStorage.defaultToolbox = 2;
	}
	//save config in local browser storage for rendering in menu categories list
	window.localStorage.toolboxids = toolboxIds;
	// needed to delacre an empty var first, instead it keeps contents
	var jsonToolboxToKeep = {};
	jsonToolboxToKeep = {
		"kind": "categoryToolbox",
		"contents": []
	};
	var k = 0;
	toolboxIds = toolboxIds.split(",");
	for (let i = 0; i < jsonToolbox.contents.length; i++ ) {
		if (window.localStorage.defaultToolbox != 0) {
			for (var j = 0; j < toolboxIds.length; j++) {
				if (jsonToolbox.contents[i].toolboxitemid == toolboxIds[j]) {
					jsonToolboxToKeep.contents[k] = jsonToolbox.contents[i];
					k++;
				}
			}
		}
		// if launched by default, with no argument in URL, add all entries from XML in categories list
		else if (jsonToolbox.contents[i].level == "1") {
				jsonToolboxToKeep.contents[k] = jsonToolbox.contents[i];
				k++;
		}
	}
	return jsonToolboxToKeep;
}

/** add categories from list in jsonToolbox
 * in both boardMenu, hidden, but used for compilation,
 * and boardDescriptionSelector in boards modal
 */
Code.buildControlPanelForToolbox = function() {
	// clear modal
    $('#categories_content')[0].innerHTML = "<br>";
	var ligne = "", id_liste = "";
	for (let i = 0; i < jsonToolbox.contents.length; i++ ) {
		if (jsonToolbox.contents[i].level == "1") {
			var rankInDisplayedToolbox = Blockly.getMainWorkspace().getToolbox().getToolboxItems().findIndex(x => x['id_'] == jsonToolbox.contents[i].toolboxitemid);
			if (rankInDisplayedToolbox >= 0) {
				ligne = '<input type="checkbox" checked="checked" onchange="toggleCategory(' + rankInDisplayedToolbox + ')" name="checkbox_' + rankInDisplayedToolbox + '" id="checkbox_' + rankInDisplayedToolbox + '"/> '
						+ '<span id="checkboxSpan_' + rankInDisplayedToolbox + '">' + Blockly.getMainWorkspace().getToolbox().getToolboxItems()[rankInDisplayedToolbox]['name_'] + '</span><br/>';
				id_liste += jsonToolbox.contents[i].toolboxitemid + ',';
				$('#categories_content')[0].innerHTML += ligne;
			}
			else if (window.localStorage.defaultToolbox == 0) {
				ligne = '<input type="checkbox" onchange="toggleCategory(' + rankInDisplayedToolbox + ')" name="checkbox_' + rankInDisplayedToolbox + '" id="checkbox_' + rankInDisplayedToolbox + '"/> '
						+ '<span id="checkboxSpan_' + rankInDisplayedToolbox + '">' + Blockly.getMainWorkspace().getToolbox().getToolboxItems()[rankInDisplayedToolbox]['name_'] + '<br/>';
				$('#categories_content')[0].innerHTML += ligne;
			}
		}
	}
	// default is hiding everything else than basis categories
	if (window.localStorage.defaultToolbox == 0)
		for (var j = 11; j < i; j++) 
			if (document.getElementById('checkbox_' + j) != null) document.getElementById('checkbox_' + j).click();
	window.localStorage.toolboxids = id_liste.slice(0, -1);
}