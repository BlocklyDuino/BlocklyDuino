/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * @fileoverview Function to control background layer.
 * @author ROBOM
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

const background = new Konva.Layer();
stage.add(background);

background.add(new Konva.Rect({
        x: 0,
        y: 0,
        width: stage_dim.w,
        height: stage_dim.h
    })
);

// detect if passive argument is unsupported, like in Edge
var passiveSupported = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, "passive", { get: function() { passiveSupported = true; } }));
} catch(err) {}

background.addEventListener('mousedown', function listenerBackgroundMoveStart() {
    document.body.style.cursor = "move",
    move_background = {
            stage: stage.getOffset(),
            mouse: stage.getPointerPosition()
    };
	updatePreview();
}, passiveSupported ? { passive: false } : false);

function backgroundRedraw(coeff) {	
	for (var i = 20; i < (stage_dim.w * 1); i += 20) {
		background.add(new Konva.Line({
				points: [i, 0, i, stage_dim.h],
				stroke: i % 100 == 0 ? "black" : "#929292",
				strokeWidth: 0.7,
				lineCap: "round",
				lineJoin: "round"
				})
			)
	};
	for (var i = 20; i < (stage_dim.h * 1); i += 20) {
		background.add(new Konva.Line({
				points: [0, i, stage_dim.w, i],
				stroke: i % 100 == 0 ? "black" : "#929292",
				strokeWidth: 0.7,
				lineCap: "round",
				lineJoin: "round"
			})
		)
	}
	background.batchDraw();
};
backgroundRedraw(1);

function rebootBackground() {	
	background.destroyChildren();
	backgroundRedraw(1);
}

function backgroundShowHide() {
	background.hide();
	stage.batchDraw();
}

// mini workspace on upper right
let previewLayerBackground = background.clone({ hitGraphEnabled: false });
let previewLayerLine = lineLayer.clone({ hitGraphEnabled: false });
previewStage.add(previewLayerBackground);
previewStage.add(previewLayerLine);

previewStage.on("mousedown", function () {
    updatePreview();
});

// https://konvajs.org/docs/sandbox/Stage_Preview.html
function updatePreview() {
	// lineLayer.children.forEach(shape => {
		// const clone = previewLayerLine.findOne('.' + shape.name());
		// clone.position(shape.position());
	// });
	// previewLayerLine.batchDraw();
}