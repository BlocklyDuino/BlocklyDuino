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
 
function line_with_element(e) {
    var t = e.el.getAttr("lines"),
    r = !1;
    for (var i in t) {
        var n = lines[t[i]].points;
        for (var s in n)
            if (n[s].getAttr("with_el")) {
                if (e.el.getAttr("count") != n[s].getAttr("with_el").el)
                    continue;
                r = !0;
                var l = getChild(e.el, "className", "Group");
                l = getChild(l, "name", "rect_yellow", !0),
                l = l[n[s].getAttr("with_el").point];
                var a = getXYRotation(l);
                n[s].setAttrs(a);
                var g = lines[t[i]].line.getAttrs("point").points;
                g[2 * s] = a.x,
                g[2 * s + 1] = a.y,
                lines[t[i]].line.setAttrs({
                    points: g
                });
            }
    }
    r && lineLayer.batchDraw();
}
function changeRs(e, t, r, i) {
    elements[e].el
    .getChildren(function (e) {
        return e.getAttr(t) === r;
    })
    .setAttrs(i);
}
function moveResize() {
    elements[resizeElement.el].el
    .getChildren(function (e) {
        return "Image" === e.getClassName();
    })[0]
    .setAttrs({
        stroke: "black",
        strokeWidth: 1,
        dash: [8, 3]
    }),
    elements[resizeElement.el].el
    .getChildren(function (e) {
        return "rect_white" === e.getAttr("name");
    })[0]
    .setAttrs({
        fill: "white"
    }),
    elements[resizeElement.el].el
    .getChildren(function (e) {
        return "rects" === e.getAttr("name");
    })
    .setAttrs({
        opacity: "1"
    });
    var e = elements[resizeElement.el].el.getChildren(function (e) {
        return "rect_white" === e.getAttr("name");
    })[0],
    t = elements[resizeElement.el].el.getWidth(),
    r = elements[resizeElement.el].el.getHeight(),
    i = getCoords();
    if ("tl" == resizeElement.type) {
        var n = i.x - resizeElement.mouse.x + 7,
        s = i.y - resizeElement.mouse.y,
        l = n * (e.getHeight() / e.getWidth()),
        a = resizeElement.size.width + -n,
        g = resizeElement.size.height + -l;
        if (g > a) {
            if (g > 700 || 50 > g)
                return;
        } else if (a > 700 || 50 > a)
            return;
        elements[resizeElement.el].el.setAttrs({
            width: a,
            height: g,
            x: i.x,
            y: i.y + (l - s)
        });
    }
    if ("bl" == resizeElement.type) {
        var n = i.x - resizeElement.mouse.x + 7,
        s = i.y - resizeElement.mouse.y,
        l = n * (e.getHeight() / e.getWidth()),
        a = resizeElement.size.width + -n,
        g = resizeElement.size.height + -l;
        if (g > a) {
            if (g > 700 || 50 > g)
                return;
        } else if (a > 700 || 50 > a)
            return;
        elements[resizeElement.el].el.setAttrs({
            width: a,
            height: g,
            x: i.x,
            y: elements[resizeElement.el].el.getAttr("y")
        });
    }
    if ("tr" == resizeElement.type) {
        var n = i.x - resizeElement.mouse_or.x + 7,
        s = i.y - resizeElement.mouse_or.y,
        l = n * (e.getHeight() / e.getWidth()),
        a = resizeElement.size.width + n,
        g = resizeElement.size.height + l;
        if (g > a) {
            if (g > 700 || 50 > g)
                return;
        } else if (a > 700 || 50 > a)
            return;
        elements[resizeElement.el].el.setAttrs({
            width: a,
            height: g,
            x: elements[resizeElement.el].el.getAttr("x"),
            y: i.y - (l + s)
        });
    }
    if ("br" == resizeElement.type) {
        var n = i.x - resizeElement.mouse_or.x + 7,
        s = i.y - resizeElement.mouse_or.y,
        l = n * (e.getHeight() / e.getWidth()),
        a = resizeElement.size.width + n,
        g = resizeElement.size.height + l;
        if (g > a) {
            if (g > 700 || 50 > g)
                return;
        } else if (a > 700 || 50 > a)
            return;
        elements[resizeElement.el].el.setAttrs({
            width: a,
            height: g,
            x: elements[resizeElement.el].el.getAttr("x"),
            y: elements[resizeElement.el].el.getAttr("y")
        });
    }
    switch (
        elements[resizeElement.el].el
        .getChildren(function (e) {
            return "Image" === e.getClassName();
        })[0]
        .getAttr("rotation")) {
		case 0:
			changeRs(resizeElement.el, "className", "Image", {
				width: a,
				height: g
			}),
			changeRs(resizeElement.el, "className", "Group", {
				width: a,
				height: g
			});
			break;
		case 180:
			changeRs(resizeElement.el, "className", "Image", {
				width: a,
				height: g,
				x: a,
				y: g
			}),
			changeRs(resizeElement.el, "className", "Group", {
				width: a,
				height: g,
				x: a,
				y: g
			});
			break;
		case 270:
			changeRs(resizeElement.el, "className", "Image", {
				width: g,
				height: a,
				y: g
			}),
			changeRs(resizeElement.el, "className", "Group", {
				width: g,
				height: a,
				y: g
			});
			break;
		case 90:
			changeRs(resizeElement.el, "className", "Image", {
				width: g,
				height: a,
				x: a
			}),
			changeRs(resizeElement.el, "className", "Group", {
				width: g,
				height: a,
				x: a
			});
		}
    changeRs(resizeElement.el, "name", "rect_white", {
        width: a,
        height: g
    }),
    changeRs(resizeElement.el, "cl", "bl", {
        y: g - 7
    }),
    changeRs(resizeElement.el, "cl", "tr", {
        x: a - 7
    }),
    changeRs(resizeElement.el, "cl", "br", {
        x: a - 7,
        y: g - 7
    });
    var h = getChild(elements[resizeElement.el].el, "className", "Group"),
        o = getChild(h, "name", "rect_yellow", !0);
    o.each(function (e) {
        e.setAttr("x", (elements[resizeElement.el].el.getWidth() / t) * e.getAttr("x")),
        e.setAttr("y", (elements[resizeElement.el].el.getHeight() / r) * e.getAttr("y")),
        e.setAttr("width", (elements[resizeElement.el].el.getWidth() / t) * e.getAttr("width")),
        e.setAttr("height", (elements[resizeElement.el].el.getHeight() / r) * e.getAttr("height"));
    }),
    line_with_element(elements[resizeElement.el]),
    elements[resizeElement.el].lineLayer.batchDraw();
}

function addEl(elementAdd) {
    var connectorsList = JSON.parse(elementAdd.getAttribute("data-points")),
        elementSVG = elementAdd.getAttribute("data-img");
    addElement(elementSVG, connectorsList, stage.getWidth() / 2, stage.getHeight() / 2, elementAdd.getAttribute("data-width"), elementAdd.getAttribute("data-height"));
}

function addElement(e, t, r, i, n, s) {
    function l(e, t, r, i) {
        var n = new Konva.Rect({
            name: "rects",
            cl: i,
            x: t,
            y: r,
            width: 14,
            height: 14,
            fill: "white",
            stroke: "black",
            strokeWidth: 1,
            opacity: 0
        });
        n.cache();
        n.on("mousedown", function () {
            isMove = !0;
            var e = getCoords(),
            t = JSON.stringify(e);
            t = JSON.parse(t),
            e.x -= this.getAttr("x"),
            e.y -= this.getAttr("y"),
            resizeElement = {
                    type: this.getAttr("cl"),
                    el: this.getParent().getAttr("count"),
                    mouse: e,
                    size: {
                        width: this.getParent().getWidth(),
                        height: this.getParent().getHeight()
                    },
                    mouse_or: t
                };
        }),
        n.on("mouseenter", function () {
            switch (this.getAttr("cl")) {
                case "tl":
                case "br":
                    0 == this.getParent().getAttr("rotation") || 180 == this.getParent().getAttr("rotation") ? (document.body.style.cursor = "nwse-resize") : (document.body.style.cursor = "nesw-resize");
                    break;
                case "tr":
                case "bl":
                    90 == this.getParent().getAttr("rotation") || 270 == this.getParent().getAttr("rotation") ? (document.body.style.cursor = "nwse-resize") : (document.body.style.cursor = "nesw-resize");
            }
        }),
        n.on("mouseleave", function () {
            document.body.style.cursor = "default";
        }),
        e.add(n);
    }
    beforeUnloader = !0;
    var a = new Image(),
        g = new Konva.Group({
            x: r,
            y: i,
            lines: []
        }),
        h = new Konva.Group({
            opacity: 0
        }),
        o = new Konva.Layer();
    g.setAttr("count", elements.length),
    a.onload = function () {
        if (((this.width *= 2), (this.height *= 2), this.width > 700)) {
            var e = this.width / 700;
            (this.width /= e),
            (this.height /= e);
        }
        if (this.height > 700) {
            var e = this.height / 700;
            (this.width /= e),
            (this.height /= e);
        }
        var r,
        i = 0;
        n && (r = this.width / n),
        s && (i = this.height / s),
        (n = this.width),
        (s = this.height),
        g.setAttrs({
            width: n,
            height: s
        });
        var m = new Konva.Rect({
            x: 0,
            y: 0,
            name: "rect_white",
            fill: "transparent",
            width: n,
            height: s
        }),
        d = new Konva.Image({
            x: 0,
            y: 0,
            image: a,
            width: n,
            height: s
        });
        g.add(m),
        g.add(d);
        var c = t;
        for (var u in c) {
            var A = new Konva.Rect({
                x: r ? c[u][0] * r : c[u][0],
                y: i ? c[u][1] * i : c[u][1],
                name: "rect_yellow",
                count_rect: u,
                width: c[u][2] ? (r ? c[u][2] * r : c[u][2]) : 6,
                height: c[u][3] ? (i ? c[u][3] * i : c[u][3]) : 6,
                opacity: 1,
                stroke: "yellow",
                strokeWidth: 3,
            });
            A.on("mouseenter", function () {
                document.body.style.cursor = "cell";
            }),
            A.on("mouseleave", function () {
                document.body.style.cursor = "default";
            }),
            A.on("mousedown", function () {
                var e = this.getParent().getParent().getAttr("lines");
                e.push(count),
                this.getParent().setAttr("lines", e),
                isMove = !0;
                var t = getXYRotation(this);
                addLine(t, {
                    el: this.getParent().getParent().getAttr("count"),
                    point: this.getAttr("count_rect")
                });
            }),
            h.add(A);
        }
        l(g, -7, -7, "tl"),
        l(g, g.getAttr("width") - 7, -7, "tr"),
        l(g, -7, g.getAttr("height") - 7, "bl"),
        l(g, g.getAttr("width") - 7, g.getAttr("height") - 7, "br"),
        g.on("mousedown", function (e) {
            if (mainzIndex > 1e5) {
                for (var t in elements)
                    elements[t].lineLayer.setZIndex(5), elements[t].lineLayer.batchDraw();
                mainzIndex = 5;
            }
            if ((elements[this.getAttr("count")].lineLayer.setZIndex(mainzIndex), lineLayer.setZIndex(999999), lineLayer.batchDraw(), mainzIndex++, 2 == e.evt.button))
                return (el_number = this.getAttr("count")), void elementMenu();
            if (isMove)
                return void(isMove = !1);
            var r = getCoords();
            r.x -= this.getAttr("x"),
            r.y -= this.getAttr("y"),
            move_element = {
                    el: this.getAttr("count"),
                    mouse: r
                },
            document.body.style.cursor = "move";
        }),
        g.on("mouseenter", function () {
            move_element || line_move !== !1 || point_move !== !1 || elemEnter(this);
        }),
        g.on("mouseleave", function () {
            move_element || line_move !== !1 || point_move !== !1 || elemLeave(this);
        }),
        g.add(h),
        o.add(g),
        stage.add(o),
        o.batchDraw();
    },
    a.src = e,
    elements.push({
        el: g,
        lineLayer: o
    });
}

function elemEnter(e) {
    var t = !1,
    r = getChild(e, "className", "Group");
    r && (t || 1 == r.getAttr("opacity") || (t = !0), r.setAttr("opacity", 1)),
    r = getChild(e, "className", "Image"),
    r && (t || "black" == r.getAttr("stroke") || (t = !0), r.setAttrs({
            stroke: "black",
            strokeWidth: 1,
            dash: [8, 3]
        })),
    r = getChild(e, "name", "rect_white"),
    r && (t || "white" == r.getAttr("fill") || (t = !0), r.setAttr("fill", "white")),
    r = getChild(e, "name", "rects", !0),
    r && (t || "1" == r.getAttr("opacity") || (t = !0), r.setAttr("opacity", "1")),
    t && elements[e.getAttr("count")].lineLayer.batchDraw();
}
function elemLeave(e) {
    var t = !1,
    r = getChild(e, "className", "Group");
    r && (t || 0 == r.getAttr("opacity") || (t = !0), r.setAttr("opacity", 0)),
    r = getChild(e, "className", "Image"),
    r && (t || "transparent" == r.getAttr("stroke") || (t = !0), r.setAttr("stroke", "transparent")),
    r = getChild(e, "name", "rect_white"),
    r && (t || "transparent" == r.getAttr("fill") || (t = !0), r.setAttr("fill", "transparent")),
    (r = getChild(e, "name", "rects", !0)),
    r && (t || "0" == r.getAttr("opacity") || (t = !0), r.setAttr("opacity", "0")),
    t && elements[e.getAttr("count")].lineLayer.batchDraw();
}