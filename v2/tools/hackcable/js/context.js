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
 
function getEl(e, t) {
    return elements[el_number].el.getChildren(function (n) {
        return n.getAttr(e) === t
    })[0]
}
function rotateAll(e, t) {
    var n = getEl("className", "Image"),
		o = getEl("className", "Group"),
		r = getEl("name", "rect_white"),
		l = getEl("cl", "tr"),
		i = getEl("cl", "br"),
		a = getEl("cl", "bl");
		n.setAttr("rotation", e),
		o.setAttr("rotation", e);
    var s = {
        width: elements[el_number].el.getAttr("height"),
        height: elements[el_number].el.getAttr("width")
    };
    elements[el_number].el.setAttrs(s),
    r.setAttrs(s);
    var c = 0,
        g = 0;
    switch (e) {
        case 0:
            l.setAttr("x", n.getWidth() - l.getWidth() / 2),
            a.setAttr("y", n.getHeight() - a.getWidth() / 2),
            i.setAttrs({
                y: n.getHeight() - a.getWidth() / 2,
                x: n.getWidth() - l.getWidth() / 2
            });
            break;
        case 90:
            c = n.getHeight(),
            l.setAttr("x", n.getHeight() - l.getWidth() / 2),
            a.setAttr("y", n.getWidth() - a.getWidth() / 2),
            i.setAttrs({
                y: n.getWidth() - a.getWidth() / 2,
                x: n.getHeight() - l.getWidth() / 2
            });
            break;
        case 180:
            c = n.getWidth(),
            g = n.getHeight(),
            l.setAttr("x", c - l.getWidth() / 2),
            a.setAttr("y", g - a.getWidth() / 2),
            i.setAttrs({
                y: g - a.getWidth() / 2,
                x: c - l.getWidth() / 2
            });
            break;
        case 270:
            g = n.getWidth(),
            l.setAttr("x", n.getHeight() - l.getWidth() / 2),
            a.setAttr("y", n.getWidth() - a.getWidth() / 2),
            i.setAttrs({
                y: n.getWidth() - a.getWidth() / 2,
                x: n.getHeight() - l.getWidth() / 2
            })
    }
    n.setAttrs({
        x: c,
        y: g
    }),
    o.setAttrs({
        x: c,
        y: g
    });
    var d = getCoords();
    d.x -= t.getAttr("x"),
    d.y -= t.getAttr("y"),
    elements[el_number].lineLayer.batchDraw(),
    line_with_element(elements[el_number])
}
function elementMenu() {
    context_men(element_menu_context)
}
function pointMenu(e, t) {
    for (var n in contextMenu)
        contextMenu[n].destroy();
    lineLayer.batchDraw(),
    contextMenu = [],
    contextMenuOpen = !0;
    var o = getCoords(),
        r = 20,
        l = new Konva.Rect({
            x: o.x + 10,
            y: o.y + 10,
            width: 170,
            height: r,
            fill: "black",
            strokeWidth: 20,
            shadowColor: "black",
            shadowBlur: 10,
            shadowOffset: {
                x: 0,
                y: 0
            },
            shadowOpacity: .9
        });
    contextMenu.push(l),
    r = 0;
    var i = new Konva.Group({
        x: o.x + 10,
        y: o.y + 10
    });
    imageObj = new Image,
    imageObj.src = "media/suppr.jpg";
    var a = new Konva.Image({
        x: 1,
        y: r + 1,
        image: imageObj,
        width: 18,
        height: 18
    }),
    s = new Konva.Text({
        x: 30,
        y: 3 + r,
        text: "Supprimer le point",
        fontSize: 14,
        fontFamily: "Sans",
        fill: "red"
    }),
    c = new Konva.Rect({
        x: 0,
        y: r,
        width: 170,
        height: 20,
        fill: "white"
    });
    i.add(c),
    i.add(a),
    i.add(s),
    i.on("mousedown", function () {
        lines[e].points[t].destroy(),
        lines[e].points.splice(t, 1);
        var n = lines[e].line.getAttr("points");
        n.splice(2 * t, 2),
        lines[e].line.setAttr("points", n);
        for (var o = 0; o < lines[e].points.length; o++)
            lines[e].points[o].setAttr("count_point", o);
        lineLayer.batchDraw()
    }),
    i.on("mouseenter", function () {
        document.body.style.cursor = "pointer",
        this.getChildren(function (e) {
            return "Rect" === e.getClassName()
        })[0].setAttr("fill", "lightgray"),
        lineLayer.batchDraw()
    }),
    i.on("mouseleave", function () {
        document.body.style.cursor = "default",
        this.getChildren(function (e) {
            return "Rect" === e.getClassName()
        })[0].setAttr("fill", "white"),
        lineLayer.batchDraw()
    }),
    r += 20,
    contextMenu.push(i);
    for (var n in contextMenu) {
        var g = 100 * stage.getScaleX();
        g = g > 100 ? (100 - (g - 100) / (g / 100)) / 100 : 100 / (g / 100) / 100,
        g = g.toFixed(1),
        contextMenu[n].setScale({
            x: g,
            y: g
        }),
        lineLayer.add(contextMenu[n])
    }
    lineLayer.batchDraw()
}
function lineMenu() {
    context_men(line_menu_context)
}
function context_men(e) {
    for (var t in contextMenu)
        contextMenu[t].destroy();
    lineLayer.batchDraw(),
    contextMenu = [],
    contextMenuOpen = !0;
    var n = getCoords(),
        o = 0;
    for (var t in e)
        switch (e[t].type) {
            default:
                o += 20;
                break;
            case "empty":
                o += 10
            }
    var r = new Konva.Rect({
        x: n.x + 10,
        y: n.y + 10,
        width: 170,
        height: o,
        fill: "black",
        strokeWidth: 20,
        shadowColor: "black",
        shadowBlur: 10,
        shadowOffset: {
            x: 0,
            y: 0
        },
        shadowOpacity: .9
    });
    contextMenu.push(r),
    o = 0;
    for (var t in e) {
        var l = new Konva.Group({
            x: n.x + 10,
            y: n.y + 10
        });
        if (0 != t) {
            var i = new Konva.Line({
                points: [0, o, 170, o],
                stroke: "gray",
                strokeWidth: .5
            });
            l.add(i)
        }
        switch (e[t].type) {
        case "color":
            var a = new Konva.Rect({
                x: 1,
                y: o + 1,
                width: 18,
                height: 18,
                fill: e[t].color
            }),
            s = new Konva.Rect({
                x: 0,
                y: o,
                width: 170,
                height: 20,
                fill: "white"
            }),
            c = new Konva.Text({
                x: 30,
                y: 3 + o,
                text: e[t].name,
                fontSize: 14,
                fontFamily: "Sans",
                fill: "black"
            });
            l.add(s),
            l.add(a),
            l.add(c),
            l.setAttr("color", e[t].color),
            l.on("mousedown", function () {
                last_color = this.getAttr("color"),
                lines[line_number].line.setAttr("stroke", last_color)
            }),
            l.on("mouseenter", function () {
                document.body.style.cursor = "pointer",
                this.getChildren(function (e) {
                    return "Rect" === e.getClassName()
                })[1].setAttr("opacity", "0.6"),
                this.getChildren(function (e) {
                    return "Rect" === e.getClassName()
                })[0].setAttr("fill", "lightgray"),
                lineLayer.batchDraw()
            }),
            l.on("mouseleave", function () {
                document.body.style.cursor = "default",
                this.getChildren(function (e) {
                    return "Rect" === e.getClassName()
                })[1].setAttr("opacity", "1"),
                this.getChildren(function (e) {
                    return "Rect" === e.getClassName()
                })[0].setAttr("fill", "white"),
                lineLayer.batchDraw()
            }),
            o += 20;
            break;
        case "empty":
            var s = new Konva.Rect({
                x: 0,
                y: o,
                width: 170,
                height: 20,
                fill: "white"
            });
            l.add(s),
            o += 10;
            break;
        case "func":
            imageObj = new Image,
            imageObj.src = e[t].img;
            var g = new Konva.Image({
                x: 1,
                y: o + 1,
                image: imageObj,
                width: 18,
                height: 18
            }),
            c = new Konva.Text({
                x: 30,
                y: 3 + o,
                text: e[t].text,
                fontSize: 14,
                fontFamily: "Sans",
                fill: e[t].color
            }),
            s = new Konva.Rect({
                x: 0,
                y: o,
                width: 170,
                height: 20,
                fill: "white"
            });
            l.add(s),
            l.add(g),
            l.add(c),
            l.on("mousedown", e[t].func),
            l.on("mouseenter", function () {
                document.body.style.cursor = "pointer",
                this.getChildren(function (e) {
                    return "Rect" === e.getClassName()
                })[0].setAttr("fill", "lightgray"),
                lineLayer.batchDraw()
            }),
            l.on("mouseleave", function () {
                document.body.style.cursor = "default",
                this.getChildren(function (e) {
                    return "Rect" === e.getClassName()
                })[0].setAttr("fill", "white"),
                lineLayer.batchDraw()
            }),
            o += 20
        }
        contextMenu.push(l)
    }
    for (var t in contextMenu) {
        var d = 100 * stage.getScaleX();
        d = d > 100 ? (100 - (d - 100) / (d / 100)) / 100 : 100 / (d / 100) / 100,
        d = d.toFixed(1),
        contextMenu[t].setScale({
            x: d,
            y: d
        }),
        lineLayer.add(contextMenu[t])
    }
    lineLayer.batchDraw()
}
var contextMenu = [], contextMenuOpen = !1, line_number = 0, last_color = "red", line_menu_context = [{
        type: "color",
        color: "red",
        name: "Rouge"
    }, {
        type: "color",
        color: "black",
        name: "Noir"
    }, {
        type: "color",
        color: "#4676FF",
        name: "Bleu"
    }, {
        type: "color",
        color: "#00FF08",
        name: "Vert"
    }, {
        type: "color",
        color: "yellow",
        name: "Jaune"
    }, {
        type: "color",
        color: "purple",
        name: "Violet"
    }, {
        type: "color",
        color: "gray",
        name: "Gris"
    }, {
        type: "color",
        color: "orange",
        name: "Orange"
    }, {
        type: "color",
        color: "cyan",
        name: "Cyan"
    }, {
        type: "color",
        color: "#A23C00",
        name: "Marron"
    }, {
        type: "color",
        color: "#FFA8B7",
        name: "Rose"
    }, {
        type: "empty"
    }, {
        type: "func",
        func: function () {
            lines[line_number].line.destroy();
            for (var e in lines[line_number].points)
                lines[line_number].points[e].destroy();
            lineLayer.batchDraw()
        },
        text: "Supprimer la ligne",
        color: "red",
        img: "media/suppr.jpg"
    }
], element_menu_context = [{
        type: "func",
        func: function () {
            var e = getChild(elements[el_number].el, "className", "Image");
            e = e.getAttr("rotation") + 90,
            360 == e && (e = 0),
            rotateAll(e, this)
        },
        text: "90° horaire",
        color: "black",
        img: "media/turn_right.png"
    }, {
        type: "func",
        func: function () {
            var e = getChild(elements[el_number].el, "className", "Image");
            e = e.getAttr("rotation"),
            0 == e && (e = 360),
            e -= 90,
            rotateAll(e, this)
        },
        text: "90° trigonométrique",
        color: "black",
        img: "media/turn_left.png"
    }, {
        type: "empty"
    }, {
        type: "func",
        func: function () {
            elements[el_number].el.destroy(),
            elements[el_number].lineLayer.batchDraw()
        },
        text: "Supprimer le composant",
        color: "red",
        img: "media/suppr.jpg"
    }
];
document.oncontextmenu = function (e) {
    e.preventDefault()
};
