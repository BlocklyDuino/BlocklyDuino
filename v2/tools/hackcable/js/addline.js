/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * @fileoverview Functions to environment, relative to right click on element.
 * @author ROBOM
 * @author scanet@libreduc.cc (Sébastien CANET)
 */
 
 function addLine(t, e) {
    var mouseXY = getCoords();
    if (t)
        var o = [t.x, t.y, t.x, t.y];
    else
        var o = [mouseXY.x, mouseXY.y, mouseXY.x, mouseXY.y];
    var lineToDraw = new Konva.Line({
        points: o,
        stroke: last_color,
        strokeWidth: 5,
        lineCap: "round",
        lineJoin: "round"
    });
    lineToDraw.on("mouseleave", function () {
        lineLayer.setZIndex(999999),
        document.body.style.cursor = "default";
        for (var t = lines[this.getAttr("count")].points, e = t.length, mouseXY = 0; e > mouseXY; mouseXY++)
            t[mouseXY].setAttrs({
                fill: "transparent",
                stroke: "transparent"
            });
    }),
    lineToDraw.on("mouseenter", function () {
        lineLayer.setZIndex(999999),
        (document.body.style.cursor = "crosshair");
        for (var t = lines[this.getAttr("count")].points, e = t.length, mouseXY = 0; e > mouseXY; mouseXY++)
            t[mouseXY].setAttrs({
                fill: "white",
                stroke: "black"
            });
    }),
    lineToDraw.on("mousedown", function (t) {
        if ((lineLayer.setZIndex(999999), 2 == t.evt.button))
            return (line_number = this.getAttr("count")), void lineMenu();
        for (var e = getCoords(), n = lines[this.getAttr("count")].line.getAttrs("point").points, o = !1, lineToDraw = 0; lineToDraw < n.length - 1; lineToDraw += 2) {
            var r = this.getAttrs("point").points[lineToDraw + 0],
            s = this.getAttrs("point").points[lineToDraw + 1],
            l = this.getAttrs("point").points[lineToDraw + 2],
            a = this.getAttrs("point").points[lineToDraw + 3],
            u = e.x,
            c = e.y,
            h = l - r,
            d = a - s,
            p = u - r,
            A = c - s,
            v = h * A - p * d,
            g = Math.sqrt(h * h + d * d),
            f = v / g;
            if (Math.abs(f) < 3) {
                o = lineToDraw;
                break;
            }
        }
        if (o !== !1) {
            var y = addPoint(e.x, e.y);
            y.setAttr("count", this.getAttr("count")),
            n.splice(o + 2, 0, e.x, e.y),
            lines[this.getAttr("count")].points.splice(o / 2 + 1, 0, y),
            lines[this.getAttr("count")].line.setAttrs({
                points: n
            });
            for (var i = 0; i < lines[this.getAttr("count")].points.length; i++)
                lines[this.getAttr("count")].points[i].setAttr("count_point", i);
            (line_move = this.getAttr("count")),
            (point_move = o / 2 + 1);
        }
    }),
    lineToDraw.setAttr("count", count),
    lineLayer.add(lineToDraw);
    var r = addPoint(t ? t.x : mouseXY.x, t ? t.y : mouseXY.y, e);
    r.setAttr("count", count),
    r.setAttr("count_point", 0);
    var s = addPoint(mouseXY.x, mouseXY.y);
    s.setAttr("count", count),
    s.setAttr("count_point", 1),
    point_move = 1,
    lines[count] = {
            line: lineToDraw,
            points: [r, s]
        },
    line_move = count,
    beforeUnloader = !0,
    count++;
}