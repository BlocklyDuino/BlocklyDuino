/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * @fileoverview Point control added on a wire.
 * @author ROBOM
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

function addPoint(pointX, pointY, n) {
    var pointToDraw = new Konva.Circle({
        x: pointX,
        y: pointY,
        radius: 5,
        fill: "white",
        stroke: "black",
        strokeWidth: 1,
        with_el: n ? n : !1
    });
    return (
		//make point transparent on mouse leave
        pointToDraw.on("mouseleave", function () {
            lineLayer.setZIndex(999999);
            for (var pointX = lines[this.getAttr("count")].points, pointY = pointX.length, n = 0; pointY > n; n++)
                pointX[n].setAttrs({
                    fill: "transparent",
                    stroke: "transparent"
                });
        }),
		//need an event listener
        pointToDraw.on("mouseenter", function () {
            lineLayer.setZIndex(999999);
            for (var pointX = lines[this.getAttr("count")].points, pointY = pointX.length, n = 0; pointY > n; n++)
                pointX[n].setAttrs({
                    fill: "white",
                    stroke: "black"
                });
        }),
		// moving point on mouse click
        pointToDraw.on("mousedown", function (pointX) {
            if ((line_move = this.getAttr("count"), point_move = this.getAttr("count_point"), lineLayer.setZIndex(999999), 2 == pointX.evt.button && lines[line_move].points.length > 2))
                return (line_number = this.getAttr("count")), void pointMenu(line_move, point_move);
            if (this.getAttr("with_el")) {
                var e = elements[this.getAttr("with_el").el].el.getAttr("lines");
                e.splice(e.indexOf(line_move), 1),
                elements[this.getAttr("with_el").el].el.setAttr("lines", e);
            }
            this.setAttr("with_el", !1);
        }),
        lineLayer.add(pointToDraw),
        beforeUnloader = !0,
        pointToDraw,
		pointToDraw.cache()
		);
}