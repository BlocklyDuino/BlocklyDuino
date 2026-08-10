/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * @fileoverview Function to control stage layer.
 * @author ROBOM
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

stage = new Konva.Stage({
		container: "konvaContainer",
		width: stage_dim.w,
		height: stage_dim.h,
		offset: {
			x: (stage_dim.w - width) / 2,
			y: (stage_dim.h - height) / 2
		}
	}),
	stage.on("wheel", function (e) {
        e.evt.preventDefault();
		changeScale(e.evt.deltaY/3);
	}),
	stage.on("mousedown", function () {
		if (contextMenu && !contextMenuOpen) {
			for (var e in contextMenu)
				contextMenu[e].remove();
			lineLayer.draw(),
			(contextMenu = []);
		}
		contextMenuOpen = !1;
	}),
	stage.on("contentMousemove", function () {
		if ((resizeElement && moveResize(), move_element)) {
			var e = getCoords();
			isGrid && ((e.x = 20 * Math.round(e.x / 20)), (e.y = 20 * Math.round(e.y / 20))),
			elements[move_element.el].el.setAttrs({
				x: e.x - move_element.mouse.x,
				y: e.y - move_element.mouse.y
			}),
			line_with_element(elements[move_element.el]),
			elements[move_element.el].lineLayer.draw();
		}
		if (move_background) {
			var e = stage.getPointerPosition();
			e.x -= move_background.mouse.x,
			e.y -= move_background.mouse.y;
			var t = {
				x: move_background.stage.x - e.x,
				y: move_background.stage.y - e.y
			},
			a = window.innerWidth,
			n = window.innerHeight;
			t.x < 0 && (t.x = 0),
			t.y < 0 && (t.y = 0),
			t.x * stage.getScaleX() > stage.getWidth() * stage.getScaleX() - a && (t.x = (stage.getWidth() * stage.getScaleX() - a) / stage.getScaleX()),
			t.y * stage.getScaleY() > stage.getHeight() * stage.getScaleY() - n && (t.y = (stage.getHeight() * stage.getScaleY() - n) / stage.getScaleY()),
			stage.setOffset(t),
			stage.draw();
		}
		if (line_move !== !1 && point_move !== !1) {
			(elemCatchDrag = !1),
			(elemParent = !1);
			var e = getCoords();
			for (var s in elements) {
				var l = elements[s].el,
				o = l.getAttr("x") - 10,
				g = l.getAttr("x") + l.getWidth() + 20,
				i = l.getAttr("y") - 10,
				r = l.getAttr("y") + l.getHeight() + 20;
				if (e.x > o && e.x < g && e.y > i && e.y < r) {
					(elemParent = l),
					(elemIsRect2 = !0);
					var m = getChild(l, "className", "Group"),
					c = getChild(m, "name", "rect_yellow", !0);
					c &&
					c.each(function (t) {
						var a = getXYRotation(t);
						return e.x < a.x + t.getWidth() / 2 && e.x > a.x - t.getWidth() / 2 && e.y > a.y - t.getHeight() / 2 && e.y < a.y + t.getHeight() / 2 ? ((elemCatchDrag = t), !1) : void 0;
					});
				}
			}
			for (var v = 0; v < lines[line_move].points.length; v++)
				lines[line_move].points[v].setAttrs({
					fill: "white",
					stroke: "black"
				});
			if (elemIsRect != elemParent) {
				elemIsRect = elemParent;
				for (var v in elements)
					elemParent && v == elemParent.getAttr("count") ? elemEnter(elements[v].el) : elemLeave(elements[v].el);
				stage.draw();
			}
			elemCatchDrag
			 ? ((document.body.style.cursor = "cell"), lines[line_move].points[point_move].setAttrs({
					fill: "transparent",
					stroke: "yellow"
				}))
			 : ((document.body.style.cursor = "default"), lines[line_move].points[point_move].setAttrs({
					fill: "white",
					stroke: "black"
				}));
			var h = lines[line_move].line.getAttrs("point").points;
			isGrid && ((e.x = 20 * Math.round(e.x / 20)), (e.y = 20 * Math.round(e.y / 20))),
			h[2 * point_move] = e.x,
			h[2 * point_move + 1] = e.y,
			lines[line_move].line.setAttrs({
				points: h
			}),
			lines[line_move].points[point_move].setAttrs({
				x: e.x,
				y: e.y
			}),
			lineLayer.setZIndex(999999),
			lineLayer.draw();
		}
	}),
	stage.on("mouseup", function () {
		if (elemCatchDrag) {
			var e = getXYRotation(elemCatchDrag),
				t = lines[line_move].line.getAttrs("point").points;
			t[2 * point_move] = e.x,
			t[2 * point_move + 1] = e.y,
			lines[line_move].line.setAttrs({
				points: t
			}),
			t = elemCatchDrag.getParent().getParent().getAttr("lines"),
			t.push(line_move),
			elemCatchDrag.getParent().setAttr("lines", t),
			lines[line_move].points[point_move].setAttrs({
				x: e.x,
				y: e.y,
				with_el: {
					el: elemCatchDrag.getParent().getParent().getAttr("count"),
					point: elemCatchDrag.getAttr("count_rect")
				}
			}),
			lineLayer.draw();
		}
		elemCatchDrag = !1,
		resizeElement = !1,
		move_element = !1,
		move_background = !1,
		document.body.style.cursor = "default",
		point_move = !1,
		line_move = !1;
	}
);

// create smaller preview stage
let previewStage = new Konva.Stage({
        container: 'konvaPreview',
        width: window.innerWidth / 5,
        height: window.innerHeight / 5,
        scaleX: 1 / 5,
        scaleY: 1 / 5
      });
	  
stage.on('click', function (e) {
	previewLayerBackground.destroy();
	previewLayerBackground = background.clone({ hitGraphEnabled: false });
	previewStage.add(previewLayerBackground);
});