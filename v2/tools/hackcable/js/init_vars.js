/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * @fileoverview List all variable useful in scripts.
 * @author ROBOM
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

var scale = {
		x: 1,
		y: 1
	},
	lines = [],
	lineLayer = new Konva.Layer,
	count = 0,
	line_move = !1,
	el_number = !1,
	point_move = !1,
	isLoaded = !1,
	textForFind = "",
	MainPage = 0,
	beforeUnloader = !1,
	move_background = !1,
	width = window.innerWidth,
	height = window.innerHeight,
	isGrid = !1,
	elemCatchDrag = !1,
	elemIsRect = !1,
	elemIsRect2 = !1,
	stage_dim = {
		w: 2 * width,
		h: 2 * height
	},
	move_element = !1,
	resizeElement = !1,
	isMove = !1,
	elements = [],
	mainzIndex = 5;
	
// Add contextual menu on button div
// $('#functionMenu').addEventListener('contextmenu', function(ev) {
    // ev.preventDefault();
    // alert('success!');
    // return false;
// }, false);