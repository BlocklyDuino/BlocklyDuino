/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * @fileoverview Function to control UI.
 * @author ROBOM
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

stage.add(lineLayer);

//internal batchDraw needed for rendering
function getChild(t, e, a, n, i) {
	if (!t) return !1;
	var o = t.getChildren(function(t) {
		return t.getAttr(e) === a;
	});
	return i && o && n && i(o), n ? o : o[0];
}

//send back position of mouse on stage
function getCoords() {
	var mousePosition = stage.getPointerPosition();
	return mousePosition.x = mousePosition.x / stage.getScaleX() + stage.getOffsetX(), mousePosition.y = mousePosition.y / stage.getScaleY() + stage.getOffsetY(), mousePosition;
}

// turn part media on background and send back new center/position of media
function getXYRotation(partToRotate) {
    var newPosX = 0,
		newPosY = 0,
		mediaToRotate = getChild(partToRotate.getParent().getParent(), "className", "Image");
    switch (partToRotate.getParent().getAttr("rotation")) {
		case 0:
			newPosX = partToRotate.getAttr("x") + partToRotate.getParent().getParent().getAttr("x") + partToRotate.getAttr("width") / 2,
			newPosY = partToRotate.getAttr("y") + partToRotate.getParent().getParent().getAttr("y") + partToRotate.getAttr("height") / 2;
			break;
		case 90:
			newPosX = -partToRotate.getAttr("y") + mediaToRotate.getHeight() + partToRotate.getParent().getParent().getAttr("x") - partToRotate.getAttr("width") / 2,
			newPosY = partToRotate.getAttr("x") + partToRotate.getParent().getParent().getAttr("y") + partToRotate.getAttr("height") / 2;
			break;
		case 180:
			newPosX = -partToRotate.getAttr("x") + i.getWidth() + partToRotate.getParent().getParent().getAttr("x") - partToRotate.getAttr("width") / 2,
			newPosY = -partToRotate.getAttr("y") + i.getHeight() + partToRotate.getParent().getParent().getAttr("y") - partToRotate.getAttr("height") / 2;
			break;
		case 270:
			newPosX = partToRotate.getAttr("y") + partToRotate.getParent().getParent().getAttr("x") + partToRotate.getAttr("width") / 2,
			newPosY = -partToRotate.getAttr("x") + i.getWidth() + partToRotate.getParent().getParent().getAttr("y") - partToRotate.getAttr("height") / 2;
		}
		return {
			x: newPosX,
			y: newPosY
    };
}

//UI draw
function previous_parts() {
	isLoaded || (MainPage -= 1, 0 > MainPage ? MainPage = 1 : pageLoad());
}

function next_parts() {
	isLoaded || (MainPage += 1, parseInt($("#to").html()) < MainPage ? MainPage -= 1 : pageLoad());
}

function finds(thisPart) {
	thisPart.preventDefault(), textForFind = $("#searchText").val(), MainPage = 1, pageLoad();
}

function pageLoad() {
	isLoaded = !0;
	var part = "";
	$("#all_parts").html('<img src="media/wait.gif">'), $('#all_parts').load(componentsList[MainPage] + "?page=" + MainPage + "&text=" + encodeURIComponent(textForFind), function(e) {
		isLoaded = !1, e = componentsList[MainPage];
		for (var a in e.el) data = e.el[a], part += '<img data-name="' + data.name.replace(/\"/, "") + '" data-descr="' + data.description.replace(/\"/, "") + '"  class="mini_parts" data-points=\'' + JSON.stringify(data.points) + "' data-width=\"" + data.width + '" data-height="' + data.height + '" data-img="parts/svg/' + data.image + '" width=75px height=75px src="parts/svg/' + data.icon + '">';
		$("#froms").html(e.page), $("#to").html(e.count), $("#all_parts").html(part), $(".mini_parts").hover(function() {
			$(".partsDescription_title").html(this.getAttribute("data-name")), $(".partsDescription_text").html(this.getAttribute("data-descr")), $(".partsDescription_img").attr("src", this.getAttribute("data-img"));
		}).draggable({
			cursor: "grabbing",
			helper: "clone",
			stop: function(part, e) {
				var listConnectors = JSON.parse(this.getAttribute("data-points")),
					elementImg = this.getAttribute("data-img");
				addElement(elementImg, listConnectors, stage.getOffsetX() + part.clientX / stage.getScaleX(), stage.getOffsetY() + part.clientY / stage.getScaleY(), this.getAttribute("data-width"), this.getAttribute("data-height"));
			}
		})
	})
}
		
window.addEventListener("load", function() {
	pageLoad();
});

function changeScale(scaleByIndice) {
	var scaleHor = width / stage.getScaleX(),
        scaleVer = height / stage.getScaleY();
	if (scaleByIndice > 0) {
		if (scale.x >= 2.5)
			return;
		(scale.x += 0.1),
		(scale.y += 0.1);
	}
	if (0 > scaleByIndice && ((scale.x -= 0.1), (scale.y -= 0.1), width > stage.getWidth() * scale.x || height > stage.getHeight() * scale.y))
		return (scale.x += 0.1), void(scale.y += 0.1);
	stage.setScale(scale);
	var l = stage.getOffsetX() + (scaleHor - width / scale.x) / 2,
		o = stage.getOffsetY() + (scaleVer - height / scale.y) / 2;
	0 > l && (l = 0),
	0 > o && (o = 0),
	l * stage.getScaleX() > stage.getWidth() * stage.getScaleX() - width && (l = (stage.getWidth() * stage.getScaleX() - width) / stage.getScaleX()),
	o * stage.getScaleY() > stage.getHeight() * stage.getScaleY() - height && (o = (stage.getHeight() * stage.getScaleY() - height) / stage.getScaleY()),
	stage.setOffsetX(l),
	stage.setOffsetY(o);
	for (var g in contextMenu)
		contextMenu[g].destroy();
	stage.draw();
};

function saveImg() {
	beforeUnloader = !1;
	for (var t in elements) elemLeave(elements[t].el);
	cropPlusExport(stage.toDataURL(), 200, 50, window.innerWidth - 200, window.innerHeight - 50);
}

// améliorer : https://stackoverflow.com/questions/34242155/how-to-crop-canvas-todataurl
function cropPlusExport(img, cropX, cropY, cropWidth, cropHeight) {
	var canvasToSave = document.createElement("canvas");
	canvasToSave.width = cropWidth + 20, canvasToSave.height = cropHeight + 20;
	var newImage = new Image();
	newImage.onload = function() {
		canvasToSave.getContext("2d").drawImage(newImage, cropX, cropY, cropWidth, cropHeight, 10, 10, cropWidth, cropHeight);
		var img = new Image();
		img.onload = function() {
			cropWidth > cropHeight ? ww = cropHeight / 3 : ww = cropWidth / 3, canvasToSave.getContext("2d").drawImage(img, 0, 0, this.height, this.width, 0, cropHeight - ww, ww, ww), window.open(canvasToSave.toDataURL());
		}
	}, newImage.src = img;
}

function Unloader() {
	var t = this;
	this.unload = function(t) {
		if (beforeUnloader) {
			var e = "Toutes vos données seront perdues.";
			return "undefined" == typeof t && (t = window.event), t && (t.returnValue = e), e;
		}
	}, this.resetUnload = function() {
		$(window).off("beforeunload", t.unload), setTimeout(function() {
			$(window).on("beforeunload", t.unload);
		}, 2e3)
	}, this.init = function() {
		$(window).on("beforeunload", t.unload), $("a").on("click", function() {
			t.resetUnload;
		}), $(document).on("submit", "form", function() {
			t.resetUnload;
		}), $(document).on("keydown", function(e) {
			(e.ctrlKey && 116 == e.keyCode || 116 == e.keyCode) && t.resetUnload;
		})
	}, this.init()
}

function saveStage() {
	// save stage as a json string
	var json = stage.toJSON();
}

function loadStage() {
	// create node using json string
	var stage = Konva.Node.create(json, 'container');
}

$(function() {
	"object" != typeof window.obUnloader && (window.obUnloader = new Unloader);
});