(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var images = [{ name: "skyline", value: "skyline.png" }, { name: "stairway", value: "stairway.png" }, { name: "night sky", value: "nightsky.jpg" }, { name: "skyline", value: "skyline.png" }, { name: "moire", value: "moire2.jpg" }, { name: "swoosh", value: "swoosh.jpeg" }, { name: "contour", value: "contour.jpg" }, { name: "bird", value: "bird.png" }, { name: "dots", value: "newsdots.jpg" }, { name: "basquiat", value: "basquiat.jpg" }, { name: "keith haring", value: "haring2.jpeg" }, { name: "maze", value: "maze.png" }, { name: "text", value: "text.png" }];

var scales = ['major', 'naturalMinor', 'harmonicMinor', 'melodicMinor', 'chromatic', 'wholeTone', 'majorPentatonic', 'minorPentatonic', 'kuomiPentatonic', 'chinesePentatonic'];

var notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

var numNotes = [5, 10, 20, 40, 60, 100, 200];

var headerElements = ["image", "sound", "draw"];
var panelElements = [];
var container, icon;

var Controls = function () {
	function Controls(imageCanvas, drawCanvas, settings, handlePlay, handleStop, regenerateSynth) {
		_classCallCheck(this, Controls);

		this.settings = settings;
		this.imageCanvas = imageCanvas;
		this.drawCanvas = drawCanvas;
		this.handlePlay = handlePlay;
		this.handleStop = handleStop;
		this.regenerateSynth = regenerateSynth;
		this.createHeader();
		//this.createControls();
		//console.log(this.imageCanvas);
		//nx.onload = function() {
		// Slider will not jump to touch position.
		//slider1.mode = "relative"
		//  slider1.hslider = true
		// slider1.draw();
		// }
	}

	_createClass(Controls, [{
		key: "createHeader",
		value: function createHeader() {
			container = document.createElement('div');
			container.id = "controls";
			container.className = "container-style";
			document.body.appendChild(container);
			var header = document.createElement("div");
			header.id = "header";
			container.appendChild(header);
			for (var i = 0; i < headerElements.length; i++) {
				var button = document.createElement('div');
				button.innerHTML = headerElements[i];
				button.className = "header-button";
				button.id = i;
				button.onclick = this.handleMenuChange;
				header.appendChild(button);
				headerElements[i] = button;
			}
			headerElements[0].className += " selected";
			this.createImagePanel(container);
			this.createSoundPanel(container);
			this.createDrawPanel(container);
			panelElements[1].className = "panel hide";
			panelElements[2].className = "panel hide";
			var div = document.createElement('div');
			div.id = "close-button";
			div.innerHTML = "close controls";
			div.onclick = this.hideMenu;
			container.appendChild(div);
			icon = document.createElement('div');
			icon.className = "icon hidden";
			icon.onclick = this.showMenu;
			document.body.appendChild(icon);
		}
	}, {
		key: "hideMenu",
		value: function hideMenu() {
			//console.log(this.container);
			console.log("hiding");
			icon.className = "icon";
			container.className = "container-style hidden";
		}
	}, {
		key: "showMenu",
		value: function showMenu() {
			icon.className = "icon hidden";
			container.className = "container-style";
		}
	}, {
		key: "createImagePanel",
		value: function createImagePanel(container) {
			var panel = document.createElement('div');
			panel.className = "panel";
			container.appendChild(panel);

			this.addDropdown(images, panel, "select background image: ", "nightsky.jpg", this.selectImage.bind(this));
			var label = document.createElement("LABEL");
			label.className = "upload-container";
			var span = document.createElement("SPAN");
			span.innerHTML = "...or upload from file";

			var x = document.createElement("INPUT");
			x.setAttribute("type", "file");
			x.onchange = this.uploadFile.bind(this);
			label.appendChild(x);
			label.appendChild(span);
			panel.appendChild(label);
			this.addDial("invert", "toggle", panel, this.updateSetting.bind(this), { value: this.settings.invert }, "invert");
			this.addDial("brightness", "dial", panel, this.updateSetting.bind(this), { value: this.settings.brightness }, "calculatePixels");
			this.addDial("contrast", "dial", panel, this.updateSetting.bind(this), { value: this.settings.brightness }, "calculatePixels");
			this.addDial("repetitions", "position", panel, this.updateSetting.bind(this), { x: this.settings.repetitions.x, y: this.settings.repetitions.y }, "drawRepetitions");
			this.addDial("spacing", "position", panel, this.updateSetting.bind(this), { x: this.settings.spacing.x, y: this.settings.spacing.y }, "drawRepetitions");
			this.addDial("offset", "position", panel, this.updateSetting.bind(this), { x: this.settings.offset.x, y: this.settings.offset.y }, "drawRepetitions");
			// 	this.addDial("reset", "button", panel, this.invert.bind(this));
			//this.addDial("clear image", "button", panel, this.imageCanvas.clearImage.bind(this.imageCanvas));
			this.addDial("rotation", "dial", panel, this.updateSetting.bind(this), { value: this.settings.rotation }, "drawRepetitions");
			this.addDial("clear background", "button", panel, this.updateSetting.bind(this), {}, "clearImage");

			nx.colorize('#f06');
			nx.colorize("fill", "#444");
			panelElements.push(panel);
		}
	}, {
		key: "createSoundPanel",
		value: function createSoundPanel(container) {
			var panel = document.createElement('div');
			panel.className = "panel";
			container.appendChild(panel);
			this.addDial("play", "toggle", panel, this.togglePlay.bind(this));
			this.addDial("speed", "dial", panel, this.updateSetting.bind(this), { value: this.settings.speed });
			this.addDropdown(scales, panel, "scale: ", this.settings.scale.type, this.selectScale.bind(this));
			this.addDropdown(notes, panel, "start note: ", this.settings.scale.note, this.selectKey.bind(this));
			var octaves = [];
			for (var i = 0; i < 9; i++) {
				octaves.push(i);
			}
			this.addDropdown(octaves, panel, "start octave: ", this.settings.scale.octave, this.selectOctave.bind(this));
			this.addDropdown(numNotes, panel, "number of notes: ", this.settings.scale.numSteps, this.selectNum.bind(this));

			panelElements.push(panel);
		}
	}, {
		key: "createDrawPanel",
		value: function createDrawPanel(container) {
			var panel = document.createElement('div');
			panel.className = "panel";
			container.appendChild(panel);
			this.addDial("stroke_width", "dial", panel, this.updateSetting.bind(this), { value: this.settings.stroke_width });
			this.addDial("stroke_repetitions", "dial", panel, this.updateSetting.bind(this), { value: this.settings.stroke_repetitions });
			this.addDial("stroke_opacity", "dial", panel, this.updateSetting.bind(this), { value: this.settings.stroke_opacity });

			this.addDial("eraser", "toggle", panel, this.updateSetting.bind(this), { value: this.settings.eraser });
			this.addDial("stroke_offset", "position", panel, this.updateSetting.bind(this), { x: this.settings.stroke_offset.x, y: this.settings.stroke_offset.y });

			this.addDial("clear drawing", "button", panel, this.drawCanvas.clear.bind(this.drawCanvas));

			panelElements.push(panel);
		}
	}, {
		key: "togglePlay",
		value: function togglePlay() {
			if (this.settings.play) {
				this.handleStop();
			} else {
				this.handlePlay();
			}
		}
	}, {
		key: "toggleDraw",
		value: function toggleDraw() {}
	}, {
		key: "handleMenuChange",
		value: function handleMenuChange(e) {
			//console.log(e.target);
			for (var i = 0; i < headerElements.length; i++) {
				headerElements[i].className = "header-button";
			}
			for (var i = 0; i < panelElements.length; i++) {
				panelElements[i].className = "panel hide";
			}
			headerElements[e.target.id].className += " selected";
			panelElements[e.target.id].className = "panel";
		}
	}, {
		key: "updateSpeed",
		value: function updateSpeed(e) {
			this.settings.pixel_step = e.value * 400 - 200;
			//console.log(this.settings.pixel_step);
		}
	}, {
		key: "updateSetting",
		value: function updateSetting(label, canvasEvent, e) {
			//console.log(label);
			//console.log(e);
			//console.log(canvasEvent);
			if ('value' in e) {
				//console.log("setting eraser to" + e.value);
				this.settings[label] = e.value;
				//console.log(this.settings[label]);
			} else if (e.press) {
					//this.settings[label]= e.value;
				} else if (e.x && this.settings[label]) {
						this.settings[label].x = e.x;
						this.settings[label].y = e.y;
					}
			if (canvasEvent != null) {
				var fn = this.imageCanvas[canvasEvent].bind(this.imageCanvas);
				fn();
			}
		}
	}, {
		key: "addDial",
		value: function addDial(label, type, container, handler, startVal, canvasHandler) {
			var dialHolder = document.createElement('div');
			dialHolder.style.padding = "5px";
			dialHolder.style.display = "inline-block";
			var testDial = document.createElement('canvas');
			if (type == "position") {
				dialHolder.style.padding = "3px";
				testDial.width = 68;
				testDial.height = 68;
				var l = label.replace(/_/g, ' ');
				this.addLabel(l, dialHolder, "dropdown-label");
			} else {
				testDial.className = "small-canvas";
				var l = label.replace(/_/g, ' ');
				this.addLabel(l, dialHolder, "label");
			}
			testDial.setAttribute("nx", type);
			testDial.setAttribute("label", label);
			testDial.id = label;

			container.appendChild(dialHolder);

			dialHolder.appendChild(testDial);
			nx.transform(testDial);
			nx.widgets[label].on('*', handler.bind(this, label, canvasHandler));
			if (startVal) {
				nx.widgets[label].set(startVal);
			}
		}
	}, {
		key: "addDropdown",
		value: function addDropdown(options, container, label, value, handler) {
			var dropdown = document.createElement("select");
			for (var i = 0; i < options.length; i++) {
				var op = new Option();
				if (options[i].value) {
					op.value = options[i].value;
					op.text = options[i].name;
				} else {
					op.value = options[i];
					op.text = options[i];
				}
				dropdown.options.add(op);
			}
			dropdown.onchange = handler;
			dropdown.value = value;
			this.addLabel(label, container, "header-label");
			container.appendChild(dropdown);
		}
	}, {
		key: "addLabel",
		value: function addLabel(text, container, className) {
			var label = document.createElement("div");
			label.className = className;
			label.innerHTML = text;

			container.appendChild(label);
		}
	}, {
		key: "selectImage",
		value: function selectImage(e) {
			//console.log(this.imageCanvas);
			this.imageCanvas.loadImage("./images/" + e.target.value);
		}
	}, {
		key: "selectKey",
		value: function selectKey(e) {
			//console.log(e.target.value);
			this.settings.scale.note = e.target.value;
			this.regenerateSynth();
		}
	}, {
		key: "selectOctave",
		value: function selectOctave(e) {
			this.settings.scale.octave = e.target.value;
			this.regenerateSynth();
		}
	}, {
		key: "selectNum",
		value: function selectNum(e) {
			//console.log(e.target.value);
			this.settings.scale.numSteps = e.target.value;
			this.regenerateSynth();
			////console.log(scale);
		}
	}, {
		key: "selectScale",
		value: function selectScale(e) {
			//console.log(e.target.value);
			this.settings.scale.type = e.target.value;
			this.regenerateSynth();
		}
	}, {
		key: "uploadFile",
		value: function uploadFile(e) {
			// TO DO : VALIDATE FILE
			var file = URL.createObjectURL(e.target.files[0]);
			this.imageCanvas.loadImage(file);
		}
	}, {
		key: "show",
		value: function show() {}
	}, {
		key: "hide",
		value: function hide() {}
	}]);

	return Controls;
}();

exports.default = Controls;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var drawCanvas = function () {
	function drawCanvas(settings) {
		_classCallCheck(this, drawCanvas);

		//output canvas
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.position = "fixed";
		this.canvas.style.top = "0px";
		this.canvas.style.left = "0px";
		this.settings = settings;
		this.isDrawing = false;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.lineJoin = "round";
		this.ctx.lineCap = "round";

		document.body.appendChild(this.canvas);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		//Data of what is currently being displayed
		this.imageData = this.data.data;
	}

	_createClass(drawCanvas, [{
		key: "startStroke",
		value: function startStroke(x, y) {
			this.prevX = x;
			this.prevY = y;
			this.ctx.strokeStyle = "#fff";
			//this.ctx.fillRect(x, y, 10, 10);
			this.isDrawing = true;
			//console.log(this.settings.eraser);
			if (this.settings.eraser == 1) {
				console.log("erasing");
				this.ctx.globalCompositeOperation = "destination-out";
				this.ctx.strokeStyle = "rgba(0,0,0,1)";
				this.ctx.lineWidth = 10.0 + this.settings.stroke_width * 100;
			} else {
				this.ctx.globalCompositeOperation = "source-over";
				this.ctx.strokeStyle = "rgba(255, 255, 255," + this.settings.stroke_opacity + ")";
				this.ctx.lineWidth = 0.1 + (this.settings.stroke_width * 4 + 1) * (this.settings.stroke_width * 4 + 1) * (this.settings.stroke_width * 4 + 1);
			}
		}
	}, {
		key: "continueStroke",
		value: function continueStroke(x, y) {
			if (this.isDrawing) {
				var repetitions = 1;
				if (!this.settings.eraser) repetitions = Math.ceil(this.settings.stroke_repetitions * 10);
				var xOffset = this.settings.stroke_offset.x * 200 - 100;
				var yOffset = this.settings.stroke_offset.y * 200 - 100;
				//console.log(repetitions);

				for (var i = 0; i < repetitions; i++) {
					//this.ctx.fillRect(x, y, 10, 10);
					//this.ctx.lineWidth = 0.1 + (this.settings.stroke_width*4+1)*(this.settings.stroke_width*4+1)*(this.settings.stroke_width*4+1);
					this.ctx.beginPath();
					this.ctx.moveTo(this.prevX + xOffset * i, this.prevY + yOffset * i);
					this.ctx.lineTo(x + xOffset * i, y + yOffset * i);
					this.ctx.stroke();
				}
				this.prevX = x;
				this.prevY = y;
			}
		}
	}, {
		key: "resize",
		value: function resize(w, h) {
			var tempCanvas = document.createElement("canvas");
			tempCanvas.width = w;
			tempCanvas.height = h;
			var tempCtx = tempCanvas.getContext('2d');
			tempCtx.drawImage(this.canvas, 0, 0, w, h);
			this.canvas.width = w;
			this.canvas.height = h;
			this.ctx.drawImage(tempCanvas, 0, 0);
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			this.imageData = this.data.data;
		}
	}, {
		key: "clear",
		value: function clear() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			this.imageData = this.data.data;
		}
	}, {
		key: "endStroke",
		value: function endStroke() {
			this.isDrawing = false;
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			this.imageData = this.data.data;
		}
	}]);

	return drawCanvas;
}();

exports.default = drawCanvas;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageCanvas = function () {
	function ImageCanvas(settings, handlePlay) {
		_classCallCheck(this, ImageCanvas);

		//output canvas
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.position = "fixed";
		this.canvas.style.top = "0px";
		this.canvas.style.left = "0px";
		this.settings = settings;
		this.handlePlay = handlePlay;

		//filtered image
		this.filterCanvas = document.createElement("canvas");
		this.filterCanvas.width = window.innerWidth;
		this.filterCanvas.height = window.innerHeight;
		this.filterCtx = this.filterCanvas.getContext('2d');
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		//this.ctx = ctx;
		document.body.appendChild(this.canvas);
		this.loadImage("./images/nightsky.jpg");
	}

	_createClass(ImageCanvas, [{
		key: "clearImage",
		value: function clearImage() {
			console.log("clearing");
			this.ctx.globalCompositeOperation = "source-over";

			this.filterCtx.fillStyle = "rgb(0, 0, 0)";
			this.filterCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillStyle = "rgb(0, 0, 0)";
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			//var data = [];
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			//Data of what is currently being displayed
			this.imageData = this.data.data;
			//data of original image
			this.originalData = [];
			for (var i = 0; i < this.data.data.length; i++) {
				this.originalData[i] = this.data.data[i];
			}
		}
	}, {
		key: "loadImage",
		value: function loadImage(filename) {
			console.log(filename);
			var img = new Image();
			img.src = filename;
			img.onload = function () {
				this.filterCtx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
				this.ctx.fillStyle = "rgb(0, 0, 0)";
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.drawImage(this.filterCanvas, 0, 0, this.canvas.width, this.canvas.height);
				this.toGrayscale();
				if (this.settings.play) this.handlePlay();
			}.bind(this);
			this.img = img;
		}
	}, {
		key: "resize",
		value: function resize(w, h) {
			this.canvas.width = w;
			this.canvas.height = h;
			this.filterCanvas.width = w;
			this.filterCanvas.height = h;
			this.filterCtx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
			this.ctx.drawImage(this.filterCanvas, 0, 0, this.canvas.width, this.canvas.height);
			this.toGrayscale();
		}
	}, {
		key: "toGrayscale",
		value: function toGrayscale() {
			//0.299r + 0.587g + 0.114b.
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			var imageData = this.data.data;
			for (var i = 0; i < imageData.length; i += 4) {
				var grey = imageData[i] * 0.299 + imageData[i + 1] * 0.587 + imageData[i + 2] * 0.114;
				imageData[i] = grey;
				// green
				imageData[i + 1] = grey;
				// blue
				imageData[i + 2] = grey;
			}
			//  this.data.data = imageData;
			this.ctx.putImageData(this.data, 0, 0);
			this.filterCtx.putImageData(this.data, 0, 0);
			this.imageData = imageData;

			this.originalData = [];
			for (var i = 0; i < imageData.length; i++) {
				this.originalData[i] = imageData[i];
			}
			console.log(this.originalData);
			console.log(imageData);
			// this.ctx.putImageData(this.data, 0, 0);
			if (this.settings.invert) {
				this.invert();
			} else {
				this.calculatePixels();
			}
		}
	}, {
		key: "drawRepetitions",
		value: function drawRepetitions() {
			var rotation = this.settings.rotation * Math.PI * 2;
			var width = this.canvas.width / (1 + this.settings.repetitions.x * 5);
			var height = this.canvas.height / (1 + this.settings.repetitions.y * 5);
			console.log(this.settings.spacing.x);
			var spacingX = (3 * this.settings.spacing.x + 0.5) * width;
			var spacingY = (3 * this.settings.spacing.y + 0.5) * height;
			var numCols = this.canvas.width / spacingX;
			var numRows = this.canvas.height / spacingY;
			var modCanvas = document.createElement("canvas");
			modCanvas.width = width;
			modCanvas.height = height;
			var modCtx = modCanvas.getContext('2d');
			modCtx.translate(width / 2, height / 2);
			modCtx.rotate(rotation);
			modCtx.drawImage(this.filterCanvas, -width / 2, -height / 2, width, height);
			this.ctx.fillStyle = "rgb(0, 0, 0)";
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.globalCompositeOperation = "lighter";
			for (var i = 0; i < numCols + 1; i++) {
				for (var j = 0; j < numRows; j++) {
					var xPos = i * spacingX - this.settings.offset.x * spacingX * j;
					var yPos = j * spacingY - this.settings.offset.y * spacingY * i;

					if (xPos <= -spacingX) xPos += this.canvas.width;
					if (yPos <= -spacingY) yPos += this.canvas.height;
					//if(xPos > this.canvas.width) xPos -= this.canvas.width;
					this.ctx.drawImage(modCanvas, xPos, yPos, width, height);
				}
			}
			// this.ctx.drawImage(modCanvas, 0, 0, width, height);
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			this.imageData = this.data.data;
			//this.originalData = this.data.data.slice(0);
		}
	}, {
		key: "invert",
		value: function invert() {
			// imageData ;

			for (var i = 0; i < this.imageData.length; i += 4) {
				//if(this.originalData[i] < 10) console.log(this.imageData[i]);
				//red
				this.imageData[i] = 255 - this.originalData[i];
				// green
				this.imageData[i + 1] = 255 - this.originalData[i + 1];
				// blue
				this.imageData[i + 2] = 255 - this.originalData[i + 2];
			}
			this.ctx.putImageData(this.data, 0, 0);
			this.filterCtx.putImageData(this.data, 0, 0);
			this.originalData = [];
			for (var i = 0; i < this.data.data.length; i++) {
				this.originalData[i] = this.data.data[i];
			}
			this.calculatePixels();
		}
	}, {
		key: "regenerateImage",
		value: function regenerateImage() {}
		//adjust brightness and contrast based on settings

	}, {
		key: "calculatePixels",
		value: function calculatePixels() {
			//var this.settings.contrast = e.value*255*2 -255;
			var contrast = 255 * this.settings.contrast * 2 - 255;
			var brightness = 255 * this.settings.brightness * 2 - 255;
			console.log(contrast);
			var factor = 259 * (contrast + 255) / (255 * (259 - contrast));
			for (var i = 0; i < this.imageData.length; i += 4) {
				// red
				this.imageData[i] = factor * (this.originalData[i] + brightness - 128) + 128;
				this.imageData[i + 1] = factor * (this.originalData[i + 1] + brightness - 128) + 128;
				this.imageData[i + 2] = factor * (this.originalData[i + 2] + brightness - 128) + 128;
			}
			this.ctx.putImageData(this.data, 0, 0);
			this.filterCtx.putImageData(this.data, 0, 0);
			this.drawRepetitions();
		}
	}]);

	return ImageCanvas;
}();

exports.default = ImageCanvas;

},{}],4:[function(require,module,exports){
'use strict';

var _synthesizer = require('./synthesizer.js');

var _synthesizer2 = _interopRequireDefault(_synthesizer);

var _scaleMaker = require('scale-maker');

var _scaleMaker2 = _interopRequireDefault(_scaleMaker);

var _controls = require('./controls.js');

var _controls2 = _interopRequireDefault(_controls);

var _imageCanvas = require('./imageCanvas.js');

var _imageCanvas2 = _interopRequireDefault(_imageCanvas);

var _drawCanvas = require('./drawCanvas.js');

var _drawCanvas2 = _interopRequireDefault(_drawCanvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var synth, controls, imageCanvas, drawCanvas;
//squares

var prevTime, data;
var colPos = 0;
var isPlaying = true;

var settings = {
  brightness: 0.5,
  contrast: 0.5,
  invert: false,
  repetitions: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  spacing: {
    x: 0.16,
    y: 0.16
  },
  rotation: 0,
  play: true,
  speed: 0.7,
  drawMode: true,
  stroke_width: 0.1,
  stroke_repetitions: 0.3,
  stroke_opacity: 1.0,
  eraser: 0,
  stroke_offset: {
    x: 0.6,
    y: 0.6
  },
  scale: {
    numSteps: 100,
    note: "C",
    octave: 1,
    type: 'chromatic'
  }
};

var synthObj = {};
//var numSteps = 30;

//var isPlaying = false;

var scaleFrequencies;
//var settings.speed = 60;
var playheadCanvas, imageData, ctx, playheadCtx, compressor, ongoingTouches, mouse, touchObject, audioCtx, backgroundColor, oscillators;
// timing params
var requestId, startTime;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

//var scaleFrequencies = ScaleMaker.makeScale('chinesePentatonic', 'A#3', numSteps).inHertz;

//console.log(settings.scale);

window.onload = function () {
  var l = document.getElementById("landing");
  l.onclick = init;
  // init();
};

function handlePlay() {
  prevTime = audioCtx.currentTime;
  settings.play = true;
  // console.log(audioCtx);
  if (audioCtx.resume) {
    audioCtx.resume();
  } else {
    //browser doesnt support resume()
  }

  requestId = requestAnimationFrame(nextStep);
}

function regenerateSynth() {
  synth.endSynth();
  var note = settings.scale.note + "" + settings.scale.octave;
  //console.log(settings.scale.numSteps);
  scaleFrequencies = _scaleMaker2.default.makeScale(settings.scale.type, note, parseInt(settings.scale.numSteps)).inHertz;
  synth = new _synthesizer2.default(scaleFrequencies, compressor, audioCtx);
}

function handleStop() {
  settings.play = false;
  if (audioCtx.suspend) {
    // audioCtx.resume();
    audioCtx.suspend();
  } else {
    //browser doesnt support suspend()
    // synth.zeroGains();
    var gainVals = [];
    for (var i = 0; i < settings.scale.numSteps; i++) {
      gainVals[i] = 0;
    }
    synth.updateGains(gainVals);
    cancelAnimationFrame(requestId);
  }
}

function init() {
  //log("init");
  document.body.removeChild(document.getElementById("landing"));
  ongoingTouches = new Array();

  touchObject = {};
  oscillators = {};

  imageCanvas = new _imageCanvas2.default(settings, handlePlay);
  drawCanvas = new _drawCanvas2.default(settings);
  playheadCanvas = document.createElement("canvas");
  playheadCanvas.width = window.innerWidth;
  playheadCanvas.height = window.innerHeight;
  playheadCanvas.style.position = "fixed";
  playheadCanvas.style.top = "0px";
  playheadCanvas.style.left = "0px";
  playheadCtx = playheadCanvas.getContext('2d');
  backgroundColor = "rgba(242, 35, 12, 0.1)";

  initAudioCtx();

  document.body.appendChild(playheadCanvas);
  controls = new _controls2.default(imageCanvas, drawCanvas, settings, handlePlay, handleStop, regenerateSynth);
  setEventHandlers();

  document.body.onkeydown = function (e) {
    if (e.keyCode == 32) {
      if (settings.play) {
        settings.play = false;
        handleStop();
      } else {
        settings.play = true;
        handlePlay();
      }
    }
    // else if(e.keyCode == 38){ // up key
    //   settings.speed +=5;
    // } else if(e.keyCode == 40){
    //   settings.speed -=5;
    // } else if(e.keyCode == 73){
    //   invert();
    // } else if(e.keyCode == 67){
    //   contrast();
    //  } else if(e.keyCode == 66){
    //   brighter();
    //  } else if(e.keyCode == 68){
    //   darker();
    // }
  };
}

function setEventHandlers() {
  console.log("setting event handlers");
  playheadCanvas.addEventListener("touchstart", handleTouchStart, false);
  playheadCanvas.addEventListener("touchend", handleTouchEnd, false);
  playheadCanvas.addEventListener("touchcancel", handleTouchCancel, false);
  playheadCanvas.addEventListener("touchmove", handleTouchMove, false);
  playheadCanvas.addEventListener("mousedown", handleMouseStart, false);
  playheadCanvas.addEventListener("mousemove", handleMouseMove, false);
  playheadCanvas.addEventListener("mouseup", handleMouseUp, false);
  playheadCanvas.addEventListener("mouseout", handleMouseUp, false);
  playheadCanvas.addEventListener("mouseleave", handleMouseUp, false);
  window.addEventListener("resize", onResize);
}

function initAudioCtx() {
  audioCtx = new window.AudioContext();
  compressor = audioCtx.createDynamicsCompressor();
  compressor.connect(audioCtx.destination);
  scaleFrequencies = _scaleMaker2.default.makeScale(settings.scale.type, 'C3', settings.scale.numSteps).inHertz;
  synth = new _synthesizer2.default(scaleFrequencies, compressor, audioCtx);
}

function nextStep() {
  //var col = Math.floor(audioCtx.currentTime*settings.speed);
  var step = Math.floor((audioCtx.currentTime - prevTime) * (settings.speed * 400 - 200));
  var col = colPos + step;
  if (col >= imageCanvas.canvas.width) {
    while (col >= imageCanvas.canvas.width) {
      col -= imageCanvas.canvas.width;
    }
  }
  if (col < 0) col += imageCanvas.canvas.width;
  playheadCtx.clearRect(0, 0, playheadCanvas.width, playheadCanvas.height);

  playheadCtx.fillStyle = "rgba(255, 0, 102, 1)";
  playheadCtx.fillRect(col - 5, 0, 10, imageCanvas.canvas.height);
  playheadCtx.fillStyle = "rgba(153, 255, 204, 1)";

  var gainVals = [];
  for (var i = 0; i < settings.scale.numSteps; i++) {
    var row = Math.floor((i + 0.5) * imageCanvas.canvas.height / settings.scale.numSteps);
    var off = (row * imageCanvas.canvas.width + col) * 4;
    var val;

    //val = imageCanvas.imageData[off]+imageCanvas.imageData[off+1]+imageCanvas.imageData[off+2])/(255*3);
    val = (imageCanvas.imageData[off] + drawCanvas.imageData[off] * (drawCanvas.imageData[off + 3] / 255)) / 255;
    // console.log(val);
    // console.log(row);
    // }
    playheadCtx.fillRect(col - 5, row, 10, val * 5);
    gainVals[i] = val;
    // if(val > 0) synth.playNote(i, val);
  }
  synth.updateGains(gainVals);
  requestId = requestAnimationFrame(nextStep);
  colPos = col;
  prevTime = audioCtx.currentTime;
}

function handleMouseStart(e) {
  // isScrubbing = true;
  // console.log(e.pageX);
  // colPos = e.pageX;
  // console.log(colPos);
  drawCanvas.startStroke(e.pageX, e.pageY);
}

function handleMouseMove(e) {
  // if(isScrubbing){
  //    colPos = e.pageX;
  //  }
  drawCanvas.continueStroke(e.pageX, e.pageY);
}

function handleMouseUp() {
  //isScrubbing = false;
  drawCanvas.endStroke();
}

function handleTouchStart(e) {
  // isScrubbing = true;
  //  var touches = e.changedTouches;
  if (e.touches != undefined) {
    // colPos = e.touches[0].pageX;
    drawCanvas.startStroke(e.touches[0].pageX, e.touches[0].pageY);
  }
}

function onResize() {
  imageCanvas.resize(window.innerWidth, window.innerHeight);
  drawCanvas.resize(window.innerWidth, window.innerHeight);
  playheadCanvas.width = window.innerWidth;
  playheadCanvas.height = window.innerHeight;
}

function handleTouchMove(e) {
  drawCanvas.continueStroke(e.touches[0].pageX, e.touches[0].pageY);
}

function handleTouchEnd(e) {
  drawCanvas.endStroke();
}

function handleTouchCancel(e) {}

},{"./controls.js":1,"./drawCanvas.js":2,"./imageCanvas.js":3,"./synthesizer.js":6,"scale-maker":5}],5:[function(require,module,exports){
module.exports = (function () {
  'use strict';

  /*
   * useful references for the frequency of musical notes and related forumlae:
   * 
   * ref: http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html
   * http://www.phy.mtu.edu/~suits/notefreqs.html
   */
  
  var TWELFTH_ROOT = getNthRoot(2, 12), // the basis for getting the frequency of a semitone / single interval
      REF_FREQUENCIES = {
        A4: 440,
        C0: 16.35,
        B8: 7902.13
      },
      MIN_FREQUENCY = REF_FREQUENCIES.C0, // C0
      MAX_FREQUENCY = REF_FREQUENCIES.B8, // B8
      CENTS_PER_SEMITONE = 100,
      scaleDefs = {};

  // the sequence of intervals (in semitones) between each note in a given type of scale
  // expressed as an array for each scale
  // TODO: complete basic set of scales
  scaleDefs.chromatic = [1];
  scaleDefs.wholeTone = [2];
  scaleDefs.major = [2, 2, 1, 2, 2, 2, 1];
  scaleDefs.majorPentatonic = [2, 2, 3, 2, 3];
  scaleDefs.minorPentatonic = [3, 2, 2, 3, 2];
  scaleDefs.kuomiPentatonic = [1, 4, 2, 1, 4];
  scaleDefs.chinesePentatonic = [4, 2, 1, 4, 1];
  scaleDefs.naturalMinor = [2, 1, 2, 2, 1, 2, 2];
  scaleDefs.harmonicMinor = [2, 1, 2, 2, 1, 3, 1];
  scaleDefs.melodicMinor = [2, 1, 2, 2, 2, 2, 1];

  /*
   * Maths helpers
   */
  function getNthRoot (value, n) {
    return Math.pow(value, 1 / n);
  }

  /*
   * returns true if passed a valid note name such as:
   * 'A4', 'C0', 'F#5', 'Gb2', 'Cb7'
   * otherwise returns false
   */
  function isValidNoteName (noteName) {
    var validNameRegex = /^[A-G][b#]?[0-8]$/;

    return typeof noteName === 'string' && validNameRegex.test(noteName);
  }

  /*
   * returns true if a scale type with the specified scaleName is in the scale type collection
   * otherwise returns false
   */
  function isScaleTypeDefined (scaleName) {
    return scaleDefs.hasOwnProperty(scaleName);
  }

  /*
   * returns true if passed a valid scale type (ie. is a string and is in scale definitions)
   * otherwise returns false
   */
  function isValidScaleName (scaleName) {
    var scaleNameRegex = /^[A-Za-z\-\_ ]+$/;

    return typeof scaleName === 'string' && scaleNameRegex.test(scaleName);
  }

   /*
    * returns true if passed a valid scale definition (ie. an array of integers)
    * otherwise returns false
    */
  function isValidScaleDefinition (scaleDef) {
    return Array.isArray(scaleDef) && scaleDef.every(isPositiveIntegerGreaterThanZero);
  }

  /*
    * returns true if passed an integer
    * otherwise returns false
    */
  function isPositiveIntegerGreaterThanZero (value) {
    return (typeof value === 'number') && (value % 1 === 0) && (value > 0);
  }

  /*
   * returns the frequency of a note that's a given number of semitones from the reference frequency (interval can be negative)
   */ 
  function getNoteByInterval (reference, interval) {
    // formula: http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html
    var frequency = reference * Math.pow(TWELFTH_ROOT, interval);
    frequency = (frequency > MAX_FREQUENCY) ? MAX_FREQUENCY : frequency;
    frequency = (frequency < MIN_FREQUENCY) ? MIN_FREQUENCY : frequency;

    // round to 2 decimal places for ease of reference & testing
    return Math.round(frequency * 100) / 100;
  }

  /**
   * returns the number of cents (detune) given an interval in semitones
   */
  function getCentsByInterval (interval) {
     return interval * CENTS_PER_SEMITONE;
  }

  /*
   * returns the interval in semitones, relative to A4
   * eg. ('A', 4) returns 0; ('C', 6) returns 13; ('A', 3) returns -12
   */
  function getIntervalFromA4 (noteName, octave) {
    var semitonesInOctave = 12,
        A4Octave = 4,
        intervalsRelativeToA = {
          C: -9,
          D: -7,
          E: -5,
          F: -4,
          G: -2,
          A: 0,
          B: 2    
        };
    
    return intervalsRelativeToA[noteName] + ((octave - A4Octave) * semitonesInOctave);
  }

  /*
   * returns the interval adjustment for flat and sharp ('#' and 'b')
   */
  function getIntervalAdjustment (sharpOrFlat) {
    var adjustments = {
      '#': 1,
      'b': -1
    };

    if (sharpOrFlat !== '#' && sharpOrFlat !== 'b') {
      return 0;
    }

    return adjustments[sharpOrFlat];
  }

  /**
   * returns an array of the names of all available scales
   */
  function getScaleNames () {
    var scaleName,
        scaleNames = [];

    for (scaleName in scaleDefs) {
      if (scaleDefs.hasOwnProperty(scaleName)) {
        scaleNames.push(scaleName);
      }
    }

    return scaleNames;
  }

  /*
   * returns the frequency of a note that's equivalent to a friendly string,
   * such as 'A4', 'C0', 'F#5', 'Gb2', 'Cb7'
   */
  function getNote (noteString) {
    if (!isValidNoteName(noteString)) {
      throw new Error('Invalid argument noteString: getNote(noteString) noteString should be a valid note name, eg. "Ab0", "C7"');
    }

    var noteNameMatch = noteString.match(/^[A-G]/g),
        sharpOrFlatMatch = noteString.match(/[b#]/g),
        octaveMatch = noteString.match(/[0-8]/g),
        noteName = noteNameMatch ? noteNameMatch[0] : null,
        sharpOrFlat = sharpOrFlatMatch ? sharpOrFlatMatch[0] : null,
        octave = octaveMatch ? parseInt(octaveMatch[0], 10) : null,
        intervalFromA,
        adjustedInterval;

    intervalFromA = getIntervalFromA4(noteName, octave);
    adjustedInterval = intervalFromA + getIntervalAdjustment(sharpOrFlat);

    return getNoteByInterval(REF_FREQUENCIES.A4, adjustedInterval);
  }

  /*
   * returns an array of frequencies in Hz, representing the notes in a musical scale,
   * given the type of scale, the frequency of a starting note, and the number of notes
   */
  function makeScale (scaleType, startNote, noteCount) {
    if (arguments.length < 3) {
      throw new Error('Missing argument(s): makeScale() expects three arguments');
    }
    if (!isValidScaleName(scaleType)) {
      throw new Error('Invalid argument scaleType: makeScale(scaleType, startNote, noteCount) expects scaleType to be a string consisting of lower or upper case letters (A-Z, a-z), spaces, hyphens(-) or underscores(_) only');
    }
    if (!isScaleTypeDefined(scaleType)) {
      throw new Error('Scale type is undefined: makeScale(scaleType, startNote, noteCount) scale with name provided for scaleType is not defined – make sure you choose from available scale types');
    }
    if (!isPositiveIntegerGreaterThanZero(noteCount)) {
      throw new Error('Invalid argument noteCount: makeScale(scaleType, startNote, noteCount) expects noteCount to be a positive integer greater than 0');
    }
    if (!isValidNoteName(startNote)) {
      throw new Error('Invalid argument startNote: makeScale(scaleType, startNote, noteCount) startNote should be a valid note name, eg. "Ab0", "C7"');
    }
    var i,
        scaleDef = scaleDefs[scaleType],
        scaleInHertz = [],
        scaleInCents = [],
        scaleInSemitones = [],
        intervalsFromStartNote = 0,
        intervalCounter = 0,
        startFrequency = getNote(startNote);

    // the first note is always the starting frequency
    scaleInHertz.push(startFrequency);
    scaleInCents.push(0);
    scaleInSemitones.push(0);

    for(i = 0; i < noteCount - 1; i += 1) {
      intervalsFromStartNote += scaleDef[intervalCounter];

      scaleInHertz.push(getNoteByInterval(startFrequency, intervalsFromStartNote));
      scaleInCents.push(getCentsByInterval(intervalsFromStartNote));
      scaleInSemitones.push(intervalsFromStartNote);

      intervalCounter = (intervalCounter === scaleDef.length - 1) ? 0 : intervalCounter + 1;
    }

    return {
      startNote: startFrequency,
      inHertz: scaleInHertz,
      inCents: scaleInCents,
      inSemiTones: scaleInSemitones
    };
  }

  /*
   * adds a new scale definition of the given name and semitone intervals definition array
   * to the scale definitions collection
   */
  function addScale (name, scaleDef) {
    if (arguments.length < 2) {
      throw new Error('Missing argument(s): addScale() expects two arguments');
    }
    if (!isValidScaleName(name)) {
      throw new Error('Invalid argument name: addScale(name, scaleDef) expects name to be a string consisting of lower or upper case letters (A-Z, a-z), spaces, hyphens(-) or underscores(_) only');
    }
    if (isScaleTypeDefined(name)) {
      throw new Error('Scale type already defined: addScale(name, scaleDef) scale with value of name argument is already defined – make sure you choose a scale name not already in use');
    }
    if (!isValidScaleDefinition(scaleDef)) {
      throw new Error('Invalid argument scaleDef: addScale(name, scaleDef) expects scaleDef to be an array of only positive integers greater than 0');
    }

    scaleDefs[name] = scaleDef;
  }

  /*
   * module export functions
   */
  return {
    makeScale: makeScale,
    getNote: getNote,
    addScale: addScale,
    getScaleNames: getScaleNames,

    // exported for testing purposes – not part of the public API
    test: {
      getIntervalFromA4: getIntervalFromA4,
      getIntervalAdjustment: getIntervalAdjustment,
      getCentsByInterval: getCentsByInterval,
      getNoteByInterval: getNoteByInterval,
      isValidNoteName: isValidNoteName,
      isValidScaleName: isValidScaleName,
      isValidScaleDefinition: isValidScaleDefinition,
      isPositiveIntegerGreaterThanZero: isPositiveIntegerGreaterThanZero,
      isScaleTypeDefined: isScaleTypeDefined
    }
  };
  
}());

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Synthesizer = function () {
	function Synthesizer(frequencies, compressor, ctx) {
		_classCallCheck(this, Synthesizer);

		this.frequencies = frequencies;
		this.ctx = ctx;
		this.oscillators = [];
		this.compressor = compressor;
		this.initOscillators(frequencies);
	}

	_createClass(Synthesizer, [{
		key: 'playNote',
		value: function playNote(index, gainVal) {
			var osc = this.ctx.createOscillator();
			osc.type = 'sine';
			//	//console.log(osc.frequency);
			osc.frequency.value = this.frequencies[this.frequencies.length - 1 - index];
			var gain = this.ctx.createGain();
			gain.connect(this.compressor);
			gain.gain.value = 0;
			osc.connect(gain);
			gain.gain.linearRampToValueAtTime(gainVal, this.ctx.currentTime + 0.1);
			gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
			osc.start();
			osc.stop(this.ctx.currentTime + 0.8);
		}
	}, {
		key: 'initOscillators',
		value: function initOscillators(frequencies) {
			//console.log(frequencies);
			for (var i = 0; i < frequencies.length; i++) {
				var osc = this.ctx.createOscillator();
				osc.type = 'sine';
				var gain = this.ctx.createGain();
				gain.connect(this.compressor);
				gain.gain.value = 0.0;
				osc.connect(gain);
				osc.frequency.value = frequencies[frequencies.length - 1 - i];
				//console.log(osc);
				osc.start(this.ctx.currentTime);
				this.oscillators[i] = { osc: osc, gain: gain, val: 0 };
			}
			//console.log(this.oscillators);, 0
		}
	}, {
		key: 'updateGains',
		value: function updateGains(gainVals) {
			for (var i = 0; i < gainVals.length; i++) {
				if (this.oscillators[i].val != gainVals[i]) {
					this.oscillators[i].val = gainVals[i];
					this.oscillators[i].gain.gain.cancelScheduledValues(this.ctx.currentTime);
					this.oscillators[i].gain.gain.linearRampToValueAtTime(gainVals[i], this.ctx.currentTime + 0.1);
				}
			}
		}
	}, {
		key: 'endSynth',
		value: function endSynth() {
			//console.log(this.oscillators);
			for (var i = 0; i < this.oscillators.length; i++) {
				this.oscillators[i].gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
				this.oscillators[i].osc.stop(this.ctx.currentTime + 0.8);
			}
		}
	}]);

	return Synthesizer;
}();

exports.default = Synthesizer;

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb250cm9scy5qcyIsImRyYXdDYW52YXMuanMiLCJpbWFnZUNhbnZhcy5qcyIsIm1haW4uanMiLCJub2RlX21vZHVsZXMvc2NhbGUtbWFrZXIvbGliL25vZGUvc2NhbGVNYWtlci5qcyIsInN5bnRoZXNpemVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBLElBQUksU0FBTyxDQUNYLEVBQUMsTUFBTSxTQUFOLEVBQWlCLE9BQU8sYUFBUCxFQURQLEVBRVgsRUFBQyxNQUFNLFVBQU4sRUFBa0IsT0FBTyxjQUFQLEVBRlIsRUFHWCxFQUFDLE1BQU0sV0FBTixFQUFtQixPQUFPLGNBQVAsRUFIVCxFQUlYLEVBQUMsTUFBTSxTQUFOLEVBQWlCLE9BQU8sYUFBUCxFQUpQLEVBS1gsRUFBQyxNQUFNLE9BQU4sRUFBZSxPQUFPLFlBQVAsRUFMTCxFQU1YLEVBQUMsTUFBTSxRQUFOLEVBQWdCLE9BQU8sYUFBUCxFQU5OLEVBT1gsRUFBRSxNQUFNLFNBQU4sRUFBaUIsT0FBTyxhQUFQLEVBUFIsRUFRWCxFQUFFLE1BQU0sTUFBTixFQUFjLE9BQU8sVUFBUCxFQVJMLEVBU1gsRUFBRSxNQUFNLE1BQU4sRUFBYyxPQUFPLGNBQVAsRUFUTCxFQVVYLEVBQUUsTUFBTSxVQUFOLEVBQWtCLE9BQU8sY0FBUCxFQVZULEVBV1gsRUFBRSxNQUFNLGNBQU4sRUFBc0IsT0FBTyxjQUFQLEVBWGIsRUFZWCxFQUFFLE1BQU0sTUFBTixFQUFjLE9BQU8sVUFBUCxFQVpMLEVBYVgsRUFBQyxNQUFNLE1BQU4sRUFBYyxPQUFPLFVBQVAsRUFiSixDQUFQOztBQWdCSixJQUFJLFNBQVMsQ0FBQyxPQUFELEVBQ2IsY0FEYSxFQUViLGVBRmEsRUFH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QUFnRDtBQUMvQyxTQUFLLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0IsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBOEIsdUJBQTlCLENBQXNELENBQXRELEVBQXlELEtBQUssR0FBTCxDQUFTLFdBQVQsR0FBcUIsR0FBckIsQ0FBekQsQ0FEK0M7QUFFL0MsU0FBSyxXQUFMLENBQWlCLENBQWpCLEVBQW9CLEdBQXBCLENBQXdCLElBQXhCLENBQTZCLEtBQUssR0FBTCxDQUFTLFdBQVQsR0FBcUIsR0FBckIsQ0FBN0IsQ0FGK0M7SUFBaEQ7Ozs7UUFyREk7OztRQTREa0IsVUFBZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgaW1hZ2VzPVtcbntuYW1lOiBcInNreWxpbmVcIiwgdmFsdWU6IFwic2t5bGluZS5wbmdcIn0sXG57bmFtZTogXCJzdGFpcndheVwiLCB2YWx1ZTogXCJzdGFpcndheS5wbmdcIn0sXG57bmFtZTogXCJuaWdodCBza3lcIiwgdmFsdWU6IFwibmlnaHRza3kuanBnXCJ9LFxue25hbWU6IFwic2t5bGluZVwiLCB2YWx1ZTogXCJza3lsaW5lLnBuZ1wifSxcbntuYW1lOiBcIm1vaXJlXCIsIHZhbHVlOiBcIm1vaXJlMi5qcGdcIn0sXG57bmFtZTogXCJzd29vc2hcIiwgdmFsdWU6IFwic3dvb3NoLmpwZWdcIn0sXG57IG5hbWU6IFwiY29udG91clwiLCB2YWx1ZTogXCJjb250b3VyLmpwZ1wifSxcbnsgbmFtZTogXCJiaXJkXCIsIHZhbHVlOiBcImJpcmQucG5nXCJ9LFxueyBuYW1lOiBcImRvdHNcIiwgdmFsdWU6IFwibmV3c2RvdHMuanBnXCJ9LFxueyBuYW1lOiBcImJhc3F1aWF0XCIsIHZhbHVlOiBcImJhc3F1aWF0LmpwZ1wifSxcbnsgbmFtZTogXCJrZWl0aCBoYXJpbmdcIiwgdmFsdWU6IFwiaGFyaW5nMi5qcGVnXCJ9LFxueyBuYW1lOiBcIm1hemVcIiwgdmFsdWU6IFwibWF6ZS5wbmdcIn0sXG57bmFtZTogXCJ0ZXh0XCIsIHZhbHVlOiBcInRleHQucG5nXCJ9XG5dO1xuXG52YXIgc2NhbGVzID0gWydtYWpvcicsXG4nbmF0dXJhbE1pbm9yJyxcbidoYXJtb25pY01pbm9yJyxcbidtZWxvZGljTWlub3InLFxuJ2Nocm9tYXRpYycsXG4nd2hvbGVUb25lJyxcbidtYWpvclBlbnRhdG9uaWMnLFxuJ21pbm9yUGVudGF0b25pYycsXG4na3VvbWlQZW50YXRvbmljJyxcbidjaGluZXNlUGVudGF0b25pYyddO1xuXG52YXIgbm90ZXMgPSBbXG4gIFwiQVwiLFxuICBcIkEjXCIsXG4gIFwiQlwiLFxuICBcIkNcIixcbiAgXCJDI1wiLFxuICBcIkRcIixcbiAgXCJEI1wiLFxuICBcIkVcIixcbiAgXCJGXCIsXG4gIFwiRiNcIixcbiAgXCJHXCIsXG4gIFwiRyNcIlxuXTtcblxudmFyIG51bU5vdGVzID0gW1xuICA1LFxuICAxMCxcbiAgMjAsXG4gIDQwLFxuICA2MCxcbiAgMTAwLFxuICAyMDBcbl07XG5cblxudmFyIGhlYWRlckVsZW1lbnRzID0gW1wiaW1hZ2VcIiwgXCJzb3VuZFwiLCBcImRyYXdcIl07XG52YXIgcGFuZWxFbGVtZW50cyA9IFtdO1xudmFyIGNvbnRhaW5lciwgaWNvbjtcbmNsYXNzIENvbnRyb2xzIHtcblx0Y29uc3RydWN0b3IoaW1hZ2VDYW52YXMsIGRyYXdDYW52YXMsIHNldHRpbmdzLCBoYW5kbGVQbGF5LCBoYW5kbGVTdG9wLCByZWdlbmVyYXRlU3ludGgpe1xuXHRcdHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcblx0XHR0aGlzLmltYWdlQ2FudmFzID0gaW1hZ2VDYW52YXM7XG5cdFx0dGhpcy5kcmF3Q2FudmFzID0gZHJhd0NhbnZhcztcblx0XHR0aGlzLmhhbmRsZVBsYXkgPSBoYW5kbGVQbGF5O1xuXHRcdHRoaXMuaGFuZGxlU3RvcCA9IGhhbmRsZVN0b3A7XG5cdFx0dGhpcy5yZWdlbmVyYXRlU3ludGggPSByZWdlbmVyYXRlU3ludGg7XG5cdFx0dGhpcy5jcmVhdGVIZWFkZXIoKTtcblx0XHQvL3RoaXMuY3JlYXRlQ29udHJvbHMoKTtcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMuaW1hZ2VDYW52YXMpO1xuXHRcdC8vbngub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gIC8vIFNsaWRlciB3aWxsIG5vdCBqdW1wIHRvIHRvdWNoIHBvc2l0aW9uLlxuICAvL3NsaWRlcjEubW9kZSA9IFwicmVsYXRpdmVcIlxuICAvLyAgc2xpZGVyMS5oc2xpZGVyID0gdHJ1ZVxuICAvLyBzbGlkZXIxLmRyYXcoKTtcbi8vIH1cblx0fVxuXHRjcmVhdGVIZWFkZXIoKXtcblx0XHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0IGNvbnRhaW5lci5pZCA9IFwiY29udHJvbHNcIjtcblx0ICBjb250YWluZXIuY2xhc3NOYW1lID0gXCJjb250YWluZXItc3R5bGVcIjtcblx0ICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdCAgdmFyIGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdCAgaGVhZGVyLmlkID0gXCJoZWFkZXJcIjtcblx0ICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaGVhZGVyKTtcblx0ICBmb3IodmFyIGkgPSAwOyBpIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBpKyspe1xuXHQgIFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHQgIFx0YnV0dG9uLmlubmVySFRNTCA9IGhlYWRlckVsZW1lbnRzW2ldO1xuXHQgIFx0YnV0dG9uLmNsYXNzTmFtZSA9IFwiaGVhZGVyLWJ1dHRvblwiO1xuXHQgIFx0YnV0dG9uLmlkID0gaTtcblx0ICBcdGJ1dHRvbi5vbmNsaWNrID0gdGhpcy5oYW5kbGVNZW51Q2hhbmdlO1xuXHQgIFx0aGVhZGVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cdCAgXHRoZWFkZXJFbGVtZW50c1tpXT0gYnV0dG9uO1xuXHQgIH1cblx0ICBoZWFkZXJFbGVtZW50c1swXS5jbGFzc05hbWUgKz0gXCIgc2VsZWN0ZWRcIjtcblx0ICB0aGlzLmNyZWF0ZUltYWdlUGFuZWwoY29udGFpbmVyKTtcblx0ICB0aGlzLmNyZWF0ZVNvdW5kUGFuZWwoY29udGFpbmVyKTtcblx0ICB0aGlzLmNyZWF0ZURyYXdQYW5lbChjb250YWluZXIpO1xuXHQgcGFuZWxFbGVtZW50c1sxXS5jbGFzc05hbWUgPSBcInBhbmVsIGhpZGVcIjtcblx0IHBhbmVsRWxlbWVudHNbMl0uY2xhc3NOYW1lID0gXCJwYW5lbCBoaWRlXCI7XG5cdCB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdCBkaXYuaWQgPSBcImNsb3NlLWJ1dHRvblwiO1xuXHQgZGl2LmlubmVySFRNTCA9IFwiY2xvc2UgY29udHJvbHNcIjtcblx0IGRpdi5vbmNsaWNrID0gdGhpcy5oaWRlTWVudTtcblx0IGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuXHRcdGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRpY29uLmNsYXNzTmFtZSA9IFwiaWNvbiBoaWRkZW5cIjtcblx0XHRpY29uLm9uY2xpY2sgPSB0aGlzLnNob3dNZW51O1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWNvbik7XG5cblxuXHR9XG5cblx0aGlkZU1lbnUoKXtcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMuY29udGFpbmVyKTtcblx0XHRjb25zb2xlLmxvZyhcImhpZGluZ1wiKTtcblx0XHQgaWNvbi5jbGFzc05hbWUgPSBcImljb25cIjtcblx0XHRjb250YWluZXIuY2xhc3NOYW1lID0gXCJjb250YWluZXItc3R5bGUgaGlkZGVuXCI7XG5cdH1cblxuXHRzaG93TWVudSgpe1xuXHRcdCBpY29uLmNsYXNzTmFtZSA9IFwiaWNvbiBoaWRkZW5cIjtcblx0XHRjb250YWluZXIuY2xhc3NOYW1lID0gXCJjb250YWluZXItc3R5bGVcIjtcblxuXHR9XG5cblx0Y3JlYXRlSW1hZ2VQYW5lbChjb250YWluZXIpe1xuXHRcdHZhciBwYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHBhbmVsLmNsYXNzTmFtZSA9IFwicGFuZWxcIjtcblx0ICBcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYW5lbCk7XG5cdCAgXHRcblxuXHQgXHR0aGlzLmFkZERyb3Bkb3duKGltYWdlcywgcGFuZWwsIFwic2VsZWN0IGJhY2tncm91bmQgaW1hZ2U6IFwiLCBcIm5pZ2h0c2t5LmpwZ1wiLCB0aGlzLnNlbGVjdEltYWdlLmJpbmQodGhpcykpO1xuXHQgXHR2YXIgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiTEFCRUxcIik7XG5cdCBcdGxhYmVsLmNsYXNzTmFtZT0gXCJ1cGxvYWQtY29udGFpbmVyXCI7XG5cdCBcdHZhciBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlNQQU5cIik7XG5cdCBcdHNwYW4uaW5uZXJIVE1MID0gXCIuLi5vciB1cGxvYWQgZnJvbSBmaWxlXCI7XG5cblx0IFx0dmFyIHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiSU5QVVRcIik7XG5cdCBcdHguc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImZpbGVcIik7XG5cdFx0eC5vbmNoYW5nZSA9IHRoaXMudXBsb2FkRmlsZS5iaW5kKHRoaXMpO1xuXHQgXHRsYWJlbC5hcHBlbmRDaGlsZCh4KTtcblx0IFx0bGFiZWwuYXBwZW5kQ2hpbGQoc3Bhbik7XG5cdCBcdHBhbmVsLmFwcGVuZENoaWxkKGxhYmVsKTtcblx0IFx0dGhpcy5hZGREaWFsKFwiaW52ZXJ0XCIsIFwidG9nZ2xlXCIsIHBhbmVsLCB0aGlzLnVwZGF0ZVNldHRpbmcuYmluZCh0aGlzKSwge3ZhbHVlOiB0aGlzLnNldHRpbmdzLmludmVydH0sIFwiaW52ZXJ0XCIpO1xuXHRcdHRoaXMuYWRkRGlhbChcImJyaWdodG5lc3NcIiwgXCJkaWFsXCIsIHBhbmVsLCB0aGlzLnVwZGF0ZVNldHRpbmcuYmluZCh0aGlzKSwge3ZhbHVlOiB0aGlzLnNldHRpbmdzLmJyaWdodG5lc3N9LCBcImNhbGN1bGF0ZVBpeGVsc1wiKTtcblx0ICBcdHRoaXMuYWRkRGlhbChcImNvbnRyYXN0XCIsIFwiZGlhbFwiLCBwYW5lbCwgdGhpcy51cGRhdGVTZXR0aW5nLmJpbmQodGhpcyksIHt2YWx1ZTogdGhpcy5zZXR0aW5ncy5icmlnaHRuZXNzfSwgXCJjYWxjdWxhdGVQaXhlbHNcIik7XG5cdCAgICB0aGlzLmFkZERpYWwoXCJyZXBldGl0aW9uc1wiLCBcInBvc2l0aW9uXCIsIHBhbmVsLCB0aGlzLnVwZGF0ZVNldHRpbmcuYmluZCh0aGlzKSwge3g6IHRoaXMuc2V0dGluZ3MucmVwZXRpdGlvbnMueCwgeTogdGhpcy5zZXR0aW5ncy5yZXBldGl0aW9ucy55fSwgXCJkcmF3UmVwZXRpdGlvbnNcIik7XG5cdCAgICB0aGlzLmFkZERpYWwoXCJzcGFjaW5nXCIsIFwicG9zaXRpb25cIiwgcGFuZWwsIHRoaXMudXBkYXRlU2V0dGluZy5iaW5kKHRoaXMpLCB7eDogdGhpcy5zZXR0aW5ncy5zcGFjaW5nLngsIHk6IHRoaXMuc2V0dGluZ3Muc3BhY2luZy55fSwgXCJkcmF3UmVwZXRpdGlvbnNcIik7XG5cdCAgIFx0dGhpcy5hZGREaWFsKFwib2Zmc2V0XCIsIFwicG9zaXRpb25cIiwgcGFuZWwsIHRoaXMudXBkYXRlU2V0dGluZy5iaW5kKHRoaXMpLCB7eDogdGhpcy5zZXR0aW5ncy5vZmZzZXQueCwgeTogdGhpcy5zZXR0aW5ncy5vZmZzZXQueX0sIFwiZHJhd1JlcGV0aXRpb25zXCIpO1xuXHQgIC8vIFx0dGhpcy5hZGREaWFsKFwicmVzZXRcIiwgXCJidXR0b25cIiwgcGFuZWwsIHRoaXMuaW52ZXJ0LmJpbmQodGhpcykpO1xuXHQgICBcdC8vdGhpcy5hZGREaWFsKFwiY2xlYXIgaW1hZ2VcIiwgXCJidXR0b25cIiwgcGFuZWwsIHRoaXMuaW1hZ2VDYW52YXMuY2xlYXJJbWFnZS5iaW5kKHRoaXMuaW1hZ2VDYW52YXMpKTtcblx0ICAgXHR0aGlzLmFkZERpYWwoXCJyb3RhdGlvblwiLCBcImRpYWxcIiwgcGFuZWwsIHRoaXMudXBkYXRlU2V0dGluZy5iaW5kKHRoaXMpLCB7dmFsdWU6IHRoaXMuc2V0dGluZ3Mucm90YXRpb259LCBcImRyYXdSZXBldGl0aW9uc1wiKTtcblx0ICBcdHRoaXMuYWRkRGlhbChcImNsZWFyIGJhY2tncm91bmRcIiwgXCJidXR0b25cIiwgcGFuZWwsIHRoaXMudXBkYXRlU2V0dGluZy5iaW5kKHRoaXMpLCB7fSwgXCJjbGVhckltYWdlXCIpO1xuXG5cdCAgXHRueC5jb2xvcml6ZSgnI2YwNicpO1xuXHRcdG54LmNvbG9yaXplKFwiZmlsbFwiLCBcIiM0NDRcIik7XG5cdCAgXHRwYW5lbEVsZW1lbnRzLnB1c2gocGFuZWwpO1xuXHR9XG5cblx0Y3JlYXRlU291bmRQYW5lbChjb250YWluZXIpe1xuXHRcdHZhciBwYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHBhbmVsLmNsYXNzTmFtZSA9IFwicGFuZWxcIjtcblx0ICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGFuZWwpO1xuXHQgIHRoaXMuYWRkRGlhbChcInBsYXlcIiwgXCJ0b2dnbGVcIiwgcGFuZWwsIHRoaXMudG9nZ2xlUGxheS5iaW5kKHRoaXMpKTtcblx0ICBcdCB0aGlzLmFkZERpYWwoXCJzcGVlZFwiLCBcImRpYWxcIiwgcGFuZWwsIHRoaXMudXBkYXRlU2V0dGluZy5iaW5kKHRoaXMpLCB7dmFsdWU6IHRoaXMuc2V0dGluZ3Muc3BlZWR9KTtcblx0ICBcdHRoaXMuYWRkRHJvcGRvd24oc2NhbGVzLCBwYW5lbCwgXCJzY2FsZTogXCIsIHRoaXMuc2V0dGluZ3Muc2NhbGUudHlwZSwgdGhpcy5zZWxlY3RTY2FsZS5iaW5kKHRoaXMpKTtcblx0ICBcdHRoaXMuYWRkRHJvcGRvd24obm90ZXMsIHBhbmVsLCBcInN0YXJ0IG5vdGU6IFwiLCB0aGlzLnNldHRpbmdzLnNjYWxlLm5vdGUsIHRoaXMuc2VsZWN0S2V5LmJpbmQodGhpcykpO1xuXHQgIFx0dmFyIG9jdGF2ZXMgPSBbXTtcblx0ICBcdGZvcih2YXIgaSA9IDA7IGkgPCA5OyBpKyspe1xuXHQgIFx0XHRvY3RhdmVzLnB1c2goaSk7XG5cdCAgXHR9XG5cdCAgXHR0aGlzLmFkZERyb3Bkb3duKG9jdGF2ZXMsIHBhbmVsLCBcInN0YXJ0IG9jdGF2ZTogXCIsIHRoaXMuc2V0dGluZ3Muc2NhbGUub2N0YXZlLCB0aGlzLnNlbGVjdE9jdGF2ZS5iaW5kKHRoaXMpKTtcblx0ICBcdHRoaXMuYWRkRHJvcGRvd24obnVtTm90ZXMsIHBhbmVsLCBcIm51bWJlciBvZiBub3RlczogXCIsIHRoaXMuc2V0dGluZ3Muc2NhbGUubnVtU3RlcHMsIHRoaXMuc2VsZWN0TnVtLmJpbmQodGhpcykpO1xuXG5cdCAgXHRwYW5lbEVsZW1lbnRzLnB1c2gocGFuZWwpO1xuXHR9XG5cblx0Y3JlYXRlRHJhd1BhbmVsKGNvbnRhaW5lcil7XG5cdFx0dmFyIHBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cGFuZWwuY2xhc3NOYW1lID0gXCJwYW5lbFwiO1xuXHQgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYW5lbCk7XG5cdCAgdGhpcy5hZGREaWFsKFwic3Ryb2tlX3dpZHRoXCIsIFwiZGlhbFwiLCBwYW5lbCwgdGhpcy51cGRhdGVTZXR0aW5nLmJpbmQodGhpcyksIHt2YWx1ZTogdGhpcy5zZXR0aW5ncy5zdHJva2Vfd2lkdGh9KTtcblx0ICB0aGlzLmFkZERpYWwoXCJzdHJva2VfcmVwZXRpdGlvbnNcIiwgXCJkaWFsXCIsIHBhbmVsLCB0aGlzLnVwZGF0ZVNldHRpbmcuYmluZCh0aGlzKSwge3ZhbHVlOiB0aGlzLnNldHRpbmdzLnN0cm9rZV9yZXBldGl0aW9uc30pO1xuXHQgXHR0aGlzLmFkZERpYWwoXCJzdHJva2Vfb3BhY2l0eVwiLCBcImRpYWxcIiwgcGFuZWwsIHRoaXMudXBkYXRlU2V0dGluZy5iaW5kKHRoaXMpLCB7dmFsdWU6IHRoaXMuc2V0dGluZ3Muc3Ryb2tlX29wYWNpdHl9KTtcblxuXHQgIHRoaXMuYWRkRGlhbChcImVyYXNlclwiLCBcInRvZ2dsZVwiLCBwYW5lbCwgdGhpcy51cGRhdGVTZXR0aW5nLmJpbmQodGhpcyksIHt2YWx1ZTogdGhpcy5zZXR0aW5ncy5lcmFzZXJ9KTtcblx0ICB0aGlzLmFkZERpYWwoXCJzdHJva2Vfb2Zmc2V0XCIsIFwicG9zaXRpb25cIiwgcGFuZWwsIHRoaXMudXBkYXRlU2V0dGluZy5iaW5kKHRoaXMpLCB7eDogdGhpcy5zZXR0aW5ncy5zdHJva2Vfb2Zmc2V0LngsIHk6IHRoaXMuc2V0dGluZ3Muc3Ryb2tlX29mZnNldC55fSk7XG5cblx0ICB0aGlzLmFkZERpYWwoXCJjbGVhciBkcmF3aW5nXCIsIFwiYnV0dG9uXCIsIHBhbmVsLCB0aGlzLmRyYXdDYW52YXMuY2xlYXIuYmluZCh0aGlzLmRyYXdDYW52YXMpKTtcblxuXHQgIFx0cGFuZWxFbGVtZW50cy5wdXNoKHBhbmVsKTtcblx0fVxuXG5cdHRvZ2dsZVBsYXkoKXtcblx0XHRpZih0aGlzLnNldHRpbmdzLnBsYXkpe1xuXHRcdFx0dGhpcy5oYW5kbGVTdG9wKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuaGFuZGxlUGxheSgpO1xuXHRcdH1cblx0fVxuXG5cdHRvZ2dsZURyYXcoKXtcblxuXHR9XG5cblx0aGFuZGxlTWVudUNoYW5nZShlKXtcblx0XHQvL2NvbnNvbGUubG9nKGUudGFyZ2V0KTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0aGVhZGVyRWxlbWVudHNbaV0uY2xhc3NOYW1lID0gXCJoZWFkZXItYnV0dG9uXCI7XG5cdFx0fVxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBwYW5lbEVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHBhbmVsRWxlbWVudHNbaV0uY2xhc3NOYW1lID0gXCJwYW5lbCBoaWRlXCI7XG5cdFx0fVxuXHRcdGhlYWRlckVsZW1lbnRzW2UudGFyZ2V0LmlkXS5jbGFzc05hbWUgKz0gXCIgc2VsZWN0ZWRcIjtcblx0XHRwYW5lbEVsZW1lbnRzW2UudGFyZ2V0LmlkXS5jbGFzc05hbWUgPSBcInBhbmVsXCI7XG5cdH1cblxuXHR1cGRhdGVTcGVlZChlKXtcblx0XHR0aGlzLnNldHRpbmdzLnBpeGVsX3N0ZXAgPSBlLnZhbHVlKjQwMCAtIDIwMDtcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMuc2V0dGluZ3MucGl4ZWxfc3RlcCk7XG5cdH1cblx0XG5cblx0dXBkYXRlU2V0dGluZyhsYWJlbCwgY2FudmFzRXZlbnQsIGUpe1xuXHRcdC8vY29uc29sZS5sb2cobGFiZWwpO1xuXHRcdC8vY29uc29sZS5sb2coZSk7XG5cdFx0Ly9jb25zb2xlLmxvZyhjYW52YXNFdmVudCk7XG5cdFx0aWYoJ3ZhbHVlJyBpbiBlKXtcblx0XHRcdC8vY29uc29sZS5sb2coXCJzZXR0aW5nIGVyYXNlciB0b1wiICsgZS52YWx1ZSk7XG5cdFx0XHR0aGlzLnNldHRpbmdzW2xhYmVsXT0gZS52YWx1ZTtcblx0XHRcdC8vY29uc29sZS5sb2codGhpcy5zZXR0aW5nc1tsYWJlbF0pO1xuXHRcdH0gZWxzZSBpZiAoZS5wcmVzcyl7XG5cdFx0XHQvL3RoaXMuc2V0dGluZ3NbbGFiZWxdPSBlLnZhbHVlO1xuXHRcdH0gZWxzZSBpZiAoZS54ICYmIHRoaXMuc2V0dGluZ3NbbGFiZWxdKSB7XG5cdFx0XHR0aGlzLnNldHRpbmdzW2xhYmVsXS54ID0gZS54O1xuXHRcdFx0dGhpcy5zZXR0aW5nc1tsYWJlbF0ueSA9IGUueTtcblx0XHR9XG5cdFx0aWYoY2FudmFzRXZlbnQhPW51bGwpIHtcblx0XHRcdHZhciBmbiA9IHRoaXMuaW1hZ2VDYW52YXNbY2FudmFzRXZlbnRdLmJpbmQodGhpcy5pbWFnZUNhbnZhcyk7XG5cdFx0XHRmbigpO1xuXHRcdH1cblx0fVxuXG5cdGFkZERpYWwobGFiZWwsIHR5cGUsIGNvbnRhaW5lciwgaGFuZGxlciwgc3RhcnRWYWwsIGNhbnZhc0hhbmRsZXIpe1xuXHRcdHZhciBkaWFsSG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0ZGlhbEhvbGRlci5zdHlsZS5wYWRkaW5nID0gXCI1cHhcIjtcblx0XHRkaWFsSG9sZGVyLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuXHRcdHZhciB0ZXN0RGlhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRcdGlmKHR5cGU9PVwicG9zaXRpb25cIil7XG5cdFx0XHRkaWFsSG9sZGVyLnN0eWxlLnBhZGRpbmcgPSBcIjNweFwiO1xuXHRcdFx0dGVzdERpYWwud2lkdGggPSA2ODtcblx0XHRcdHRlc3REaWFsLmhlaWdodCA9IDY4O1xuXHRcdFx0dmFyIGwgPSBsYWJlbC5yZXBsYWNlKC9fL2csJyAnKTtcblx0XHRcdHRoaXMuYWRkTGFiZWwobCwgZGlhbEhvbGRlciwgXCJkcm9wZG93bi1sYWJlbFwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGVzdERpYWwuY2xhc3NOYW1lID0gXCJzbWFsbC1jYW52YXNcIjtcblx0XHRcdHZhciBsID0gbGFiZWwucmVwbGFjZSgvXy9nLCcgJyk7XG5cdFx0XHR0aGlzLmFkZExhYmVsKGwsIGRpYWxIb2xkZXIsIFwibGFiZWxcIik7XG5cdFx0fVxuXHRcdHRlc3REaWFsLnNldEF0dHJpYnV0ZShcIm54XCIsIHR5cGUpO1xuXHRcdHRlc3REaWFsLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGxhYmVsKTtcblx0XHR0ZXN0RGlhbC5pZCA9IGxhYmVsO1xuXG5cdFx0XG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKGRpYWxIb2xkZXIpO1xuXHRcdFxuXHRcdGRpYWxIb2xkZXIuYXBwZW5kQ2hpbGQodGVzdERpYWwpO1xuXHRcdG54LnRyYW5zZm9ybSh0ZXN0RGlhbCk7XG5cdFx0bngud2lkZ2V0c1tsYWJlbF0ub24oJyonLCBoYW5kbGVyLmJpbmQodGhpcyxsYWJlbCwgY2FudmFzSGFuZGxlcikpO1xuXHRcdGlmKHN0YXJ0VmFsKXtcblx0XHRcdG54LndpZGdldHNbbGFiZWxdLnNldChzdGFydFZhbCk7XG5cdFx0IH1cblx0fVxuXG5cdGFkZERyb3Bkb3duKG9wdGlvbnMsIGNvbnRhaW5lciwgbGFiZWwsIHZhbHVlLCBoYW5kbGVyKXtcblx0XHR2YXIgZHJvcGRvd249ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcblx0IFx0Zm9yKHZhciBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspe1xuXHRcdCAgIFx0dmFyIG9wID0gbmV3IE9wdGlvbigpO1xuXHRcdCAgIFx0aWYob3B0aW9uc1tpXS52YWx1ZSl7XG5cdFx0ICAgXHRcdG9wLnZhbHVlID0gb3B0aW9uc1tpXS52YWx1ZTtcblx0XHQgICBcdFx0b3AudGV4dCA9IG9wdGlvbnNbaV0ubmFtZTtcblxuXHRcdCAgIFx0fWVsc2V7XG5cdFx0ICAgXHRcdG9wLnZhbHVlID0gb3B0aW9uc1tpXTtcblx0XHQgICBcdFx0b3AudGV4dCA9IG9wdGlvbnNbaV07XG5cdFx0ICAgXHR9XG5cdFx0ICAgXHRkcm9wZG93bi5vcHRpb25zLmFkZChvcCk7IFxuXHQgICBcdH1cblx0ICAgXHRkcm9wZG93bi5vbmNoYW5nZSA9IGhhbmRsZXI7XG5cdCAgIFx0ZHJvcGRvd24udmFsdWUgPSB2YWx1ZTtcblx0ICAgXHR0aGlzLmFkZExhYmVsKGxhYmVsLCBjb250YWluZXIsIFwiaGVhZGVyLWxhYmVsXCIpO1xuXHQgICBcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChkcm9wZG93bik7XG5cdH1cblxuXHRhZGRMYWJlbCh0ZXh0LCBjb250YWluZXIsIGNsYXNzTmFtZSl7XG5cdFx0IHZhciBsYWJlbD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHQgICBsYWJlbC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cdCAgIGxhYmVsLmlubmVySFRNTCA9IHRleHQ7XG5cblx0ICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsKTtcblx0fVxuXG5cdHNlbGVjdEltYWdlKGUpe1xuXHRcdC8vY29uc29sZS5sb2codGhpcy5pbWFnZUNhbnZhcyk7XG4gIFx0XHR0aGlzLmltYWdlQ2FudmFzLmxvYWRJbWFnZShcIi4vaW1hZ2VzL1wiICsgZS50YXJnZXQudmFsdWUpO1xuXHR9XG5cblx0c2VsZWN0S2V5KGUpe1xuXHQgIC8vY29uc29sZS5sb2coZS50YXJnZXQudmFsdWUpO1xuXHQgIHRoaXMuc2V0dGluZ3Muc2NhbGUubm90ZSA9IGUudGFyZ2V0LnZhbHVlO1xuXHQgIHRoaXMucmVnZW5lcmF0ZVN5bnRoKCk7XG4gXHR9XG5cbiAgc2VsZWN0T2N0YXZlKGUpe1xuICAgIHRoaXMuc2V0dGluZ3Muc2NhbGUub2N0YXZlID0gZS50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5yZWdlbmVyYXRlU3ludGgoKTtcbiAgfVxuXG4gIHNlbGVjdE51bShlKXtcbiAgXHQvL2NvbnNvbGUubG9nKGUudGFyZ2V0LnZhbHVlKTtcbiAgICB0aGlzLnNldHRpbmdzLnNjYWxlLm51bVN0ZXBzID0gZS50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5yZWdlbmVyYXRlU3ludGgoKTtcbiAgLy8vL2NvbnNvbGUubG9nKHNjYWxlKTtcbiAgfVxuXG5zZWxlY3RTY2FsZShlKXtcbiAgLy9jb25zb2xlLmxvZyhlLnRhcmdldC52YWx1ZSk7XG4gdGhpcy5zZXR0aW5ncy5zY2FsZS50eXBlID0gZS50YXJnZXQudmFsdWU7XG4gdGhpcy5yZWdlbmVyYXRlU3ludGgoKTtcbn1cblxuXG5cdHVwbG9hZEZpbGUoZSl7XG4gIC8vIFRPIERPIDogVkFMSURBVEUgRklMRVxuICBcdFx0dmFyIGZpbGUgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGUudGFyZ2V0LmZpbGVzWzBdKTtcbiAgXHRcdHRoaXMuaW1hZ2VDYW52YXMubG9hZEltYWdlKGZpbGUpO1xuXHR9XG5cblx0XG5cdHNob3coKXtcblxuXHR9XG5cblx0aGlkZSgpe1xuXG5cdH1cbn1cblxuZXhwb3J0IHsgQ29udHJvbHMgYXMgZGVmYXVsdH0iLCJjbGFzcyBkcmF3Q2FudmFzIHtcblx0Y29uc3RydWN0b3Ioc2V0dGluZ3Mpe1xuXHRcdC8vb3V0cHV0IGNhbnZhc1xuXHRcdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblx0ICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0ICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHQgICB0aGlzLmNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcblx0ICAgdGhpcy5jYW52YXMuc3R5bGUudG9wID0gXCIwcHhcIjtcblx0ICAgdGhpcy5jYW52YXMuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG5cdCB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG5cdCB0aGlzLmlzRHJhd2luZyA9IGZhbHNlO1xuXHQgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0IHRoaXMuY3R4LmxpbmVKb2luPVwicm91bmRcIjtcblx0IHRoaXMuY3R4LmxpbmVDYXA9XCJyb3VuZFwiO1xuXG5cdCAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdCAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHQgICB0aGlzLmRhdGEgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cdCAgICAgICAgLy9EYXRhIG9mIHdoYXQgaXMgY3VycmVudGx5IGJlaW5nIGRpc3BsYXllZFxuXHQgICAgdGhpcy5pbWFnZURhdGEgPSB0aGlzLmRhdGEuZGF0YTtcblx0fVxuXG5cdHN0YXJ0U3Ryb2tlKHgsIHkpe1xuXHRcdHRoaXMucHJldlggPSB4O1xuXHRcdHRoaXMucHJldlkgPSB5O1xuICAgXHRcdHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gXCIjZmZmXCI7XG4gICBcdFx0Ly90aGlzLmN0eC5maWxsUmVjdCh4LCB5LCAxMCwgMTApO1xuICAgXHRcdHRoaXMuaXNEcmF3aW5nID0gdHJ1ZTtcbiAgIFx0XHQvL2NvbnNvbGUubG9nKHRoaXMuc2V0dGluZ3MuZXJhc2VyKTtcbiAgIFx0XHRpZih0aGlzLnNldHRpbmdzLmVyYXNlciA9PSAxKXtcbiAgIFx0XHRcdGNvbnNvbGUubG9nKFwiZXJhc2luZ1wiKTtcbiAgIFx0XHRcdHRoaXMuY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGVzdGluYXRpb24tb3V0XCI7XG4gICBcdFx0XHR0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgwLDAsMCwxKVwiO1xuICAgXHRcdFx0dGhpcy5jdHgubGluZVdpZHRoID0gMTAuMCArIHRoaXMuc2V0dGluZ3Muc3Ryb2tlX3dpZHRoKjEwMDtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcInNvdXJjZS1vdmVyXCI7XG4gICBcdFx0XHR0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LFwiK3RoaXMuc2V0dGluZ3Muc3Ryb2tlX29wYWNpdHkgKyBcIilcIjtcbiAgIFx0XHRcdHRoaXMuY3R4LmxpbmVXaWR0aCA9IDAuMSArICh0aGlzLnNldHRpbmdzLnN0cm9rZV93aWR0aCo0KzEpKih0aGlzLnNldHRpbmdzLnN0cm9rZV93aWR0aCo0KzEpKih0aGlzLnNldHRpbmdzLnN0cm9rZV93aWR0aCo0KzEpO1xuXG5cdFx0fVxuXHR9XG5cblx0Y29udGludWVTdHJva2UoeCwgeSl7XG5cdFx0aWYodGhpcy5pc0RyYXdpbmcpe1xuXHRcdFx0dmFyIHJlcGV0aXRpb25zID0gMTtcblx0XHRcdGlmKCF0aGlzLnNldHRpbmdzLmVyYXNlcikgcmVwZXRpdGlvbnMgPSBNYXRoLmNlaWwodGhpcy5zZXR0aW5ncy5zdHJva2VfcmVwZXRpdGlvbnMqMTApO1xuXHRcdFx0dmFyIHhPZmZzZXQgPSB0aGlzLnNldHRpbmdzLnN0cm9rZV9vZmZzZXQueCoyMDAgLTEwMDtcblx0XHRcdHZhciB5T2Zmc2V0ID0gdGhpcy5zZXR0aW5ncy5zdHJva2Vfb2Zmc2V0LnkqMjAwIC0xMDA7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHJlcGV0aXRpb25zKTtcblxuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IHJlcGV0aXRpb25zOyBpKyspe1xuXHRcdFx0XHQvL3RoaXMuY3R4LmZpbGxSZWN0KHgsIHksIDEwLCAxMCk7XG5cdFx0XHRcdC8vdGhpcy5jdHgubGluZVdpZHRoID0gMC4xICsgKHRoaXMuc2V0dGluZ3Muc3Ryb2tlX3dpZHRoKjQrMSkqKHRoaXMuc2V0dGluZ3Muc3Ryb2tlX3dpZHRoKjQrMSkqKHRoaXMuc2V0dGluZ3Muc3Ryb2tlX3dpZHRoKjQrMSk7XG5cdFx0XHRcdHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuXHQgICAgICBcdFx0dGhpcy5jdHgubW92ZVRvKHRoaXMucHJldlgreE9mZnNldCppLCB0aGlzLnByZXZZK3lPZmZzZXQqaSk7XG5cdCAgICAgIFx0XHR0aGlzLmN0eC5saW5lVG8oeCt4T2Zmc2V0KmksIHkreU9mZnNldCppKTtcblx0ICAgICAgXHRcdHRoaXMuY3R4LnN0cm9rZSgpO1xuXHQgICAgICBcdFx0XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnByZXZYID0geDtcblx0ICAgICAgXHR0aGlzLnByZXZZID0geTtcblx0XHR9XG5cdH1cblxuXHRyZXNpemUodywgaCl7XG5cdFx0dmFyIHRlbXBDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuXHQgICB0ZW1wQ2FudmFzLndpZHRoID0gdztcblx0ICAgdGVtcENhbnZhcy5oZWlnaHQgPSBoO1xuXHQgICB2YXIgdGVtcEN0eCA9IHRlbXBDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0ICAgdGVtcEN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDAsIHcsIGgpO1xuXHRcdHRoaXMuY2FudmFzLndpZHRoID0gdztcblx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSBoO1xuXHRcdHRoaXMuY3R4LmRyYXdJbWFnZSh0ZW1wQ2FudmFzLCAwLCAwKTtcblx0XHQgIHRoaXMuZGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0ICAgIHRoaXMuaW1hZ2VEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG5cdH1cblxuXHRjbGVhcigpe1xuXHRcdHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0XHR0aGlzLmRhdGEgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cdFx0dGhpcy5pbWFnZURhdGEgPSB0aGlzLmRhdGEuZGF0YTtcblx0fVxuXHRlbmRTdHJva2UoKXtcblx0XHR0aGlzLmlzRHJhd2luZyA9IGZhbHNlO1xuXHRcdHRoaXMuZGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0XHR0aGlzLmltYWdlRGF0YSA9IHRoaXMuZGF0YS5kYXRhO1xuXHR9XG5cbn1cblxuZXhwb3J0IHsgZHJhd0NhbnZhcyBhcyBkZWZhdWx0fSIsImNsYXNzIEltYWdlQ2FudmFzIHtcblx0Y29uc3RydWN0b3Ioc2V0dGluZ3MsIGhhbmRsZVBsYXkpe1xuXHRcdC8vb3V0cHV0IGNhbnZhc1xuXHRcdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblx0ICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0ICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHQgICB0aGlzLmNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcblx0ICAgdGhpcy5jYW52YXMuc3R5bGUudG9wID0gXCIwcHhcIjtcblx0ICAgdGhpcy5jYW52YXMuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG5cdCB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG5cdCB0aGlzLmhhbmRsZVBsYXkgPSBoYW5kbGVQbGF5O1xuXG5cdCAvL2ZpbHRlcmVkIGltYWdlXG5cdCB0aGlzLmZpbHRlckNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cdCAgIHRoaXMuZmlsdGVyQ2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdCAgIHRoaXMuZmlsdGVyQ2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0ICB0aGlzLmZpbHRlckN0eCA9IHRoaXMuZmlsdGVyQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdCAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHQgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHQgIC8vdGhpcy5jdHggPSBjdHg7XG5cdCAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdCAgIHRoaXMubG9hZEltYWdlKFwiLi9pbWFnZXMvbmlnaHRza3kuanBnXCIpO1xuXHR9XG5cblx0XG5cblx0Y2xlYXJJbWFnZSgpe1xuXHRcdGNvbnNvbGUubG9nKFwiY2xlYXJpbmdcIik7XG5cdFx0XHR0aGlzLmN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb249XCJzb3VyY2Utb3ZlclwiO1xuXG5cdFx0dGhpcy5maWx0ZXJDdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwgMCwgMClcIjtcblx0XHR0aGlzLmZpbHRlckN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0XHR0aGlzLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiO1xuXHRcdHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHRcdC8vdmFyIGRhdGEgPSBbXTtcblx0XHQgdGhpcy5kYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHQgICAgICAgIC8vRGF0YSBvZiB3aGF0IGlzIGN1cnJlbnRseSBiZWluZyBkaXNwbGF5ZWRcblx0ICAgICAgICB0aGlzLmltYWdlRGF0YSA9IHRoaXMuZGF0YS5kYXRhO1xuXHQgICAgICAgIC8vZGF0YSBvZiBvcmlnaW5hbCBpbWFnZVxuXHQgICAgICAgIFx0dGhpcy5vcmlnaW5hbERhdGEgPSBbXTtcblx0ICAgXHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhLmRhdGEubGVuZ3RoOyBpKyspe1xuXHQgICBcdFx0dGhpcy5vcmlnaW5hbERhdGFbaV0gPSB0aGlzLmRhdGEuZGF0YVtpXTtcblx0ICAgXHR9XG5cdH1cblxuXHRsb2FkSW1hZ2UoZmlsZW5hbWUpe1xuICAgXHRcdGNvbnNvbGUubG9nKGZpbGVuYW1lKTtcbiAgICBcdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBcdGltZy5zcmMgPSBmaWxlbmFtZTtcbiAgICBcdGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBcdFx0dGhpcy5maWx0ZXJDdHguZHJhd0ltYWdlKGltZywgMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgXHRcdCB0aGlzLmN0eC5maWxsU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiO1xuXHQgICBcdFx0dGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHQgIFx0XHR0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0ICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UodGhpcy5maWx0ZXJDYW52YXMsIDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHQgICAgICAgIHRoaXMudG9HcmF5c2NhbGUoKTtcblx0ICAgICAgICAgaWYodGhpcy5zZXR0aW5ncy5wbGF5KSB0aGlzLmhhbmRsZVBsYXkoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmltZyA9IGltZztcblx0fVxuXG5cdHJlc2l6ZSh3LCBoKXtcblx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IHc7XG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gaDtcblx0XHR0aGlzLmZpbHRlckNhbnZhcy53aWR0aCA9IHc7XG5cdFx0dGhpcy5maWx0ZXJDYW52YXMuaGVpZ2h0ID0gaDtcblx0XHR0aGlzLmZpbHRlckN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHRcdHRoaXMuY3R4LmRyYXdJbWFnZSh0aGlzLmZpbHRlckNhbnZhcywgMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cdFx0dGhpcy50b0dyYXlzY2FsZSgpO1xuXHR9XG5cblx0dG9HcmF5c2NhbGUoKXtcblx0XHQvLzAuMjk5ciArIDAuNTg3ZyArIDAuMTE0Yi5cblx0XHQgIHRoaXMuZGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0XHQgIHZhciBpbWFnZURhdGEgPSB0aGlzLmRhdGEuZGF0YTtcblx0XHQgZm9yKHZhciBpID0gMDsgaSA8IGltYWdlRGF0YS5sZW5ndGg7IGkgKz0gNCkge1xuXHQgICAgICAgICAgdmFyIGdyZXkgPSBpbWFnZURhdGFbaV0qMC4yOTkgKyBpbWFnZURhdGFbaSsxXSowLjU4NyArIGltYWdlRGF0YVtpKzJdKjAuMTE0O1xuXHQgICAgICAgICAgaW1hZ2VEYXRhW2ldID0gZ3JleTtcblx0ICAgICAgICAgIC8vIGdyZWVuXG5cdCAgICAgICAgICBpbWFnZURhdGFbaSArIDFdID0gZ3JleTtcblx0ICAgICAgICAgIC8vIGJsdWVcblx0ICAgICAgICAgIGltYWdlRGF0YVtpICsgMl0gPSBncmV5O1xuXHQgICAgICAgIH1cblx0ICAgICAvLyAgdGhpcy5kYXRhLmRhdGEgPSBpbWFnZURhdGE7XG5cdCAgICB0aGlzLmN0eC5wdXRJbWFnZURhdGEodGhpcy5kYXRhLCAwLCAwKTtcblx0ICAgIHRoaXMuZmlsdGVyQ3R4LnB1dEltYWdlRGF0YSh0aGlzLmRhdGEsIDAsIDApO1xuXHQgICAgdGhpcy5pbWFnZURhdGEgPSBpbWFnZURhdGE7XG5cdCAgXG5cdCAgIFxuXHQgICBcdHRoaXMub3JpZ2luYWxEYXRhID0gW107XG5cdCAgIFx0Zm9yKHZhciBpID0gMDsgaSA8IGltYWdlRGF0YS5sZW5ndGg7IGkrKyl7XG5cdCAgIFx0XHR0aGlzLm9yaWdpbmFsRGF0YVtpXSA9IGltYWdlRGF0YVtpXTtcblx0ICAgXHR9XG5cdCAgIFx0Y29uc29sZS5sb2codGhpcy5vcmlnaW5hbERhdGEpO1xuXHQgICBcdGNvbnNvbGUubG9nKGltYWdlRGF0YSk7XG5cdCAgIFx0Ly8gdGhpcy5jdHgucHV0SW1hZ2VEYXRhKHRoaXMuZGF0YSwgMCwgMCk7XG5cdCAgIGlmKHRoaXMuc2V0dGluZ3MuaW52ZXJ0KXtcblx0ICAgICAgICBcdHRoaXMuaW52ZXJ0KCk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBcdHRoaXMuY2FsY3VsYXRlUGl4ZWxzKCk7XG5cdCAgICAgICAgfVxuXHR9XG5cblx0ZHJhd1JlcGV0aXRpb25zKCl7XG5cdFx0dmFyIHJvdGF0aW9uID0gdGhpcy5zZXR0aW5ncy5yb3RhdGlvbipNYXRoLlBJKjI7XG5cdFx0dmFyIHdpZHRoID0gdGhpcy5jYW52YXMud2lkdGgvKDErdGhpcy5zZXR0aW5ncy5yZXBldGl0aW9ucy54KjUpO1xuXHRcdHZhciBoZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQvKDErdGhpcy5zZXR0aW5ncy5yZXBldGl0aW9ucy55KjUpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuc2V0dGluZ3Muc3BhY2luZy54KTtcblx0XHR2YXIgc3BhY2luZ1ggPSAoMyp0aGlzLnNldHRpbmdzLnNwYWNpbmcueCArIDAuNSkqd2lkdGg7XG5cdFx0dmFyIHNwYWNpbmdZID0gKDMqdGhpcy5zZXR0aW5ncy5zcGFjaW5nLnkgKyAwLjUpKmhlaWdodDtcblx0XHR2YXIgbnVtQ29scyA9IHRoaXMuY2FudmFzLndpZHRoL3NwYWNpbmdYO1xuXHRcdHZhciBudW1Sb3dzID0gdGhpcy5jYW52YXMuaGVpZ2h0L3NwYWNpbmdZO1xuXHRcdCB2YXIgbW9kQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblx0ICAgbW9kQ2FudmFzLndpZHRoID0gd2lkdGg7XG5cdCAgIG1vZENhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdCAgdmFyIG1vZEN0eCA9IG1vZENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHQgIG1vZEN0eC50cmFuc2xhdGUod2lkdGgvMiwgaGVpZ2h0LzIpO1xuXHQgIG1vZEN0eC5yb3RhdGUocm90YXRpb24pO1xuXHQgIG1vZEN0eC5kcmF3SW1hZ2UodGhpcy5maWx0ZXJDYW52YXMsIC13aWR0aC8yLCAtaGVpZ2h0LzIsIHdpZHRoLCBoZWlnaHQpO1xuXHQgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmdiKDAsIDAsIDApXCI7XG5cdCAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0ICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0dGhpcy5jdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPVwibGlnaHRlclwiO1xuXHQgIGZvcih2YXIgaSA9IDA7IGkgPCBudW1Db2xzKzE7IGkrKyl7XG5cdCAgXHRmb3IodmFyIGogPSAwOyBqIDwgbnVtUm93czsgaisrKXtcblx0ICBcdFx0dmFyIHhQb3MgPSBpKnNwYWNpbmdYLSB0aGlzLnNldHRpbmdzLm9mZnNldC54KnNwYWNpbmdYKmo7XG5cdCAgXHRcdHZhciB5UG9zID0gaipzcGFjaW5nWS0gdGhpcy5zZXR0aW5ncy5vZmZzZXQueSpzcGFjaW5nWSppO1xuXG5cdCAgXHRcdGlmKHhQb3MgPD0gLXNwYWNpbmdYKSB4UG9zICs9IHRoaXMuY2FudmFzLndpZHRoO1xuXHQgIFx0XHRpZih5UG9zIDw9IC1zcGFjaW5nWSkgeVBvcyArPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG5cdCAgXHRcdC8vaWYoeFBvcyA+IHRoaXMuY2FudmFzLndpZHRoKSB4UG9zIC09IHRoaXMuY2FudmFzLndpZHRoO1xuXHQgIFx0XHR0aGlzLmN0eC5kcmF3SW1hZ2UobW9kQ2FudmFzLCB4UG9zLCB5UG9zLCB3aWR0aCwgaGVpZ2h0KTtcblx0ICBcdH1cblx0ICB9XG5cdCAvLyB0aGlzLmN0eC5kcmF3SW1hZ2UobW9kQ2FudmFzLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblx0ICAgdGhpcy5kYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHQgICAgICAgIHRoaXMuaW1hZ2VEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG5cdCAgICAgICAgLy90aGlzLm9yaWdpbmFsRGF0YSA9IHRoaXMuZGF0YS5kYXRhLnNsaWNlKDApO1xuXHR9XG5cblx0aW52ZXJ0KCl7XG5cdCAvLyBpbWFnZURhdGEgO1xuXG5cdCAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmltYWdlRGF0YS5sZW5ndGg7IGkgKz0gNCkge1xuXHQgICBcdC8vaWYodGhpcy5vcmlnaW5hbERhdGFbaV0gPCAxMCkgY29uc29sZS5sb2codGhpcy5pbWFnZURhdGFbaV0pO1xuXHQgICAgICAgICAgLy9yZWRcblx0ICAgICAgICAgIHRoaXMuaW1hZ2VEYXRhW2ldID0gMjU1IC0gdGhpcy5vcmlnaW5hbERhdGFbaV07XG5cdCAgICAgICAgICAvLyBncmVlblxuXHQgICAgICAgICAgdGhpcy5pbWFnZURhdGFbaSArIDFdID0gMjU1IC0gdGhpcy5vcmlnaW5hbERhdGFbaSArIDFdO1xuXHQgICAgICAgICAgLy8gYmx1ZVxuXHQgICAgICAgICAgdGhpcy5pbWFnZURhdGFbaSArIDJdID0gMjU1IC0gdGhpcy5vcmlnaW5hbERhdGFbaSArIDJdO1xuXHQgICAgICAgIH1cblx0ICAgIHRoaXMuY3R4LnB1dEltYWdlRGF0YSh0aGlzLmRhdGEsIDAsIDApO1xuXHQgICAgIHRoaXMuZmlsdGVyQ3R4LnB1dEltYWdlRGF0YSh0aGlzLmRhdGEsIDAsIDApO1xuXHQgICBcdFx0dGhpcy5vcmlnaW5hbERhdGEgPSBbXTtcblx0ICAgXHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhLmRhdGEubGVuZ3RoOyBpKyspe1xuXHQgICBcdFx0dGhpcy5vcmlnaW5hbERhdGFbaV0gPSB0aGlzLmRhdGEuZGF0YVtpXTtcblx0ICAgXHR9XG5cdCAgdGhpcy5jYWxjdWxhdGVQaXhlbHMoKTtcblx0fVxuXG5cdHJlZ2VuZXJhdGVJbWFnZSgpe1xuXG5cdH1cblx0Ly9hZGp1c3QgYnJpZ2h0bmVzcyBhbmQgY29udHJhc3QgYmFzZWQgb24gc2V0dGluZ3Ncblx0Y2FsY3VsYXRlUGl4ZWxzKCl7XG5cdFx0Ly92YXIgdGhpcy5zZXR0aW5ncy5jb250cmFzdCA9IGUudmFsdWUqMjU1KjIgLTI1NTtcblx0ICBcdHZhciBjb250cmFzdCA9IDI1NSp0aGlzLnNldHRpbmdzLmNvbnRyYXN0KjIgLSAyNTU7XG5cdCAgXHR2YXIgYnJpZ2h0bmVzcyA9IDI1NSAqIHRoaXMuc2V0dGluZ3MuYnJpZ2h0bmVzcyoyIC0gMjU1O1xuXHQgIFx0Y29uc29sZS5sb2coY29udHJhc3QpO1xuXHQgIFx0dmFyIGZhY3RvciA9ICgyNTkgKiAoY29udHJhc3QgKyAyNTUpKSAvICgyNTUgKiAoMjU5IC0gY29udHJhc3QpKTtcblx0ICBcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmltYWdlRGF0YS5sZW5ndGg7IGkgKz0gNCkge1xuXHQgICAgICAgICAgLy8gcmVkXG4gICAgICAgIFx0dGhpcy5pbWFnZURhdGFbaV0gPSBmYWN0b3IgKiAodGhpcy5vcmlnaW5hbERhdGFbaV0rYnJpZ2h0bmVzcyAtIDEyOCkgKyAxMjg7XG4gICAgICAgIFx0dGhpcy5pbWFnZURhdGFbaSsxXSA9IGZhY3RvciAqICh0aGlzLm9yaWdpbmFsRGF0YVtpKzFdK2JyaWdodG5lc3MgLSAxMjgpICsgMTI4O1xuICAgICAgICBcdHRoaXMuaW1hZ2VEYXRhW2krMl0gPSBmYWN0b3IgKiAodGhpcy5vcmlnaW5hbERhdGFbaSsyXSticmlnaHRuZXNzIC0gMTI4KSArIDEyODtcbiAgICBcdH1cbiAgICBcdHRoaXMuY3R4LnB1dEltYWdlRGF0YSh0aGlzLmRhdGEsIDAsIDApO1xuICAgIFx0dGhpcy5maWx0ZXJDdHgucHV0SW1hZ2VEYXRhKHRoaXMuZGF0YSwgMCwgMCk7XG4gICAgXHR0aGlzLmRyYXdSZXBldGl0aW9ucygpO1xuXHR9XG59XG5cbmV4cG9ydCB7IEltYWdlQ2FudmFzIGFzIGRlZmF1bHR9IiwiXG4vL3NxdWFyZXNcblxuaW1wb3J0IFN5bnRoZXNpemVyIGZyb20gJy4vc3ludGhlc2l6ZXIuanMnO1xuaW1wb3J0IFNjYWxlTWFrZXIgIGZyb20gJ3NjYWxlLW1ha2VyJztcbmltcG9ydCBDb250cm9scyBmcm9tICcuL2NvbnRyb2xzLmpzJztcbmltcG9ydCBJbWFnZUNhbnZhcyBmcm9tICcuL2ltYWdlQ2FudmFzLmpzJztcbmltcG9ydCBEcmF3Q2FudmFzIGZyb20gJy4vZHJhd0NhbnZhcy5qcyc7XG5cblxudmFyIHN5bnRoLCBjb250cm9scywgaW1hZ2VDYW52YXMsIGRyYXdDYW52YXM7XG5cbnZhciBwcmV2VGltZSwgZGF0YTtcbnZhciBjb2xQb3MgPSAwO1xudmFyIGlzUGxheWluZyA9IHRydWU7XG5cblxuXG52YXIgc2V0dGluZ3MgPSB7XG4gIGJyaWdodG5lc3M6IDAuNSxcbiAgY29udHJhc3QgOiAwLjUsXG4gIGludmVydDogZmFsc2UsXG4gIHJlcGV0aXRpb25zIDoge1xuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgfSxcbiAgb2Zmc2V0OiB7XG4gICAgeDogMCwgXG4gICAgeTogMFxuICB9LFxuICBzcGFjaW5nOiB7XG4gICAgeDogMC4xNixcbiAgICB5OiAwLjE2XG4gIH0sXG4gIHJvdGF0aW9uOiAwLFxuICBwbGF5OiB0cnVlLFxuICBzcGVlZDogMC43LFxuICBkcmF3TW9kZTogdHJ1ZSxcbiAgc3Ryb2tlX3dpZHRoOiAwLjEsXG4gIHN0cm9rZV9yZXBldGl0aW9uczogMC4zLFxuICBzdHJva2Vfb3BhY2l0eTogMS4wLFxuICBlcmFzZXI6IDAsXG4gIHN0cm9rZV9vZmZzZXQ6IHtcbiAgICB4OiAwLjYsXG4gICAgeTogMC42XG4gIH0sXG4gIHNjYWxlOiB7XG4gICAgbnVtU3RlcHM6IDEwMCxcbiAgICBub3RlOiBcIkNcIixcbiAgICBvY3RhdmU6IDEsXG4gICAgdHlwZTogJ2Nocm9tYXRpYydcbiAgfVxufTtcblxudmFyIHN5bnRoT2JqID0ge307XG4vL3ZhciBudW1TdGVwcyA9IDMwO1xuXG4vL3ZhciBpc1BsYXlpbmcgPSBmYWxzZTtcblxuXG52YXIgc2NhbGVGcmVxdWVuY2llcztcbi8vdmFyIHNldHRpbmdzLnNwZWVkID0gNjA7XG52YXIgcGxheWhlYWRDYW52YXMsIGltYWdlRGF0YSwgY3R4LCBwbGF5aGVhZEN0eCwgY29tcHJlc3Nvciwgb25nb2luZ1RvdWNoZXMsIG1vdXNlLCB0b3VjaE9iamVjdCwgYXVkaW9DdHgsIGJhY2tncm91bmRDb2xvciwgb3NjaWxsYXRvcnM7XG4vLyB0aW1pbmcgcGFyYW1zXG52YXIgcmVxdWVzdElkLCBzdGFydFRpbWU7XG53aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgIFxuLy92YXIgc2NhbGVGcmVxdWVuY2llcyA9IFNjYWxlTWFrZXIubWFrZVNjYWxlKCdjaGluZXNlUGVudGF0b25pYycsICdBIzMnLCBudW1TdGVwcykuaW5IZXJ0ejtcblxuLy9jb25zb2xlLmxvZyhzZXR0aW5ncy5zY2FsZSk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpe1xuICB2YXIgbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGFuZGluZ1wiKTtcbiAgbC5vbmNsaWNrID0gaW5pdDtcbiAvLyBpbml0KCk7XG59O1xuXG5mdW5jdGlvbiBoYW5kbGVQbGF5KCl7XG4gcHJldlRpbWUgPSBhdWRpb0N0eC5jdXJyZW50VGltZTtcbiBzZXR0aW5ncy5wbGF5ID0gdHJ1ZTtcbi8vIGNvbnNvbGUubG9nKGF1ZGlvQ3R4KTtcbiBpZihhdWRpb0N0eC5yZXN1bWUpe1xuICAgIGF1ZGlvQ3R4LnJlc3VtZSgpO1xuIH0gZWxzZSB7XG4gIC8vYnJvd3NlciBkb2VzbnQgc3VwcG9ydCByZXN1bWUoKVxuIH1cbiBcbiAgcmVxdWVzdElkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG5leHRTdGVwKTtcbn1cblxuZnVuY3Rpb24gcmVnZW5lcmF0ZVN5bnRoKCl7XG4gIHN5bnRoLmVuZFN5bnRoKCk7XG4gIHZhciBub3RlID0gc2V0dGluZ3Muc2NhbGUubm90ZSArIFwiXCIgKyBzZXR0aW5ncy5zY2FsZS5vY3RhdmU7XG4gIC8vY29uc29sZS5sb2coc2V0dGluZ3Muc2NhbGUubnVtU3RlcHMpO1xuICBzY2FsZUZyZXF1ZW5jaWVzID0gU2NhbGVNYWtlci5tYWtlU2NhbGUoc2V0dGluZ3Muc2NhbGUudHlwZSwgbm90ZSwgcGFyc2VJbnQoc2V0dGluZ3Muc2NhbGUubnVtU3RlcHMpKS5pbkhlcnR6O1xuICBzeW50aCA9IG5ldyBTeW50aGVzaXplcihzY2FsZUZyZXF1ZW5jaWVzLCBjb21wcmVzc29yLCBhdWRpb0N0eCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVN0b3AoKXtcbiAgc2V0dGluZ3MucGxheSA9IGZhbHNlO1xuICBpZihhdWRpb0N0eC5zdXNwZW5kKXtcbiAgIC8vIGF1ZGlvQ3R4LnJlc3VtZSgpO1xuICAgIGF1ZGlvQ3R4LnN1c3BlbmQoKTtcbiB9IGVsc2Uge1xuICAvL2Jyb3dzZXIgZG9lc250IHN1cHBvcnQgc3VzcGVuZCgpXG4gICAvLyBzeW50aC56ZXJvR2FpbnMoKTtcbiAgICB2YXIgZ2FpblZhbHMgPSBbXTtcbiAgZm9yKHZhciBpID0gMDsgaSA8IHNldHRpbmdzLnNjYWxlLm51bVN0ZXBzOyBpKyspe1xuICAgIGdhaW5WYWxzW2ldID0gMDtcbiB9XG4gc3ludGgudXBkYXRlR2FpbnMoZ2FpblZhbHMpO1xuICBjYW5jZWxBbmltYXRpb25GcmFtZShyZXF1ZXN0SWQpO1xufVxufVxuXG5mdW5jdGlvbiBpbml0KCl7XG4gIC8vbG9nKFwiaW5pdFwiKTtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhbmRpbmdcIikpO1xuICBvbmdvaW5nVG91Y2hlcyA9IG5ldyBBcnJheSgpO1xuICBcbiAgdG91Y2hPYmplY3QgPSB7fTtcbiAgb3NjaWxsYXRvcnMgPSB7fTtcbiAgIFxuICAgaW1hZ2VDYW52YXMgPSBuZXcgSW1hZ2VDYW52YXMoc2V0dGluZ3MsIGhhbmRsZVBsYXkpO1xuICAgZHJhd0NhbnZhcyA9IG5ldyBEcmF3Q2FudmFzKHNldHRpbmdzKTtcbiAgcGxheWhlYWRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgcGxheWhlYWRDYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgIHBsYXloZWFkQ2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgIHBsYXloZWFkQ2FudmFzLnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgcGxheWhlYWRDYW52YXMuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgIHBsYXloZWFkQ2FudmFzLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgcGxheWhlYWRDdHggPSBwbGF5aGVhZENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGJhY2tncm91bmRDb2xvciA9IFwicmdiYSgyNDIsIDM1LCAxMiwgMC4xKVwiO1xuIFxuICAgICAgIFxuICBpbml0QXVkaW9DdHgoKTtcbiAgIFxuICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwbGF5aGVhZENhbnZhcyk7IFxuICAgY29udHJvbHMgPSBuZXcgQ29udHJvbHMoaW1hZ2VDYW52YXMsIGRyYXdDYW52YXMsIHNldHRpbmdzLCBoYW5kbGVQbGF5LCBoYW5kbGVTdG9wLCByZWdlbmVyYXRlU3ludGgpO1xuICAgc2V0RXZlbnRIYW5kbGVycygpO1xuXG4gICBkb2N1bWVudC5ib2R5Lm9ua2V5ZG93biA9IGZ1bmN0aW9uKGUpe1xuICAgIGlmKGUua2V5Q29kZSA9PSAzMil7XG4gICAgICAgIGlmKHNldHRpbmdzLnBsYXkpe1xuICAgICAgICAgIHNldHRpbmdzLnBsYXkgPSBmYWxzZTtcbiAgICAgICAgICBoYW5kbGVTdG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0dGluZ3MucGxheSA9IHRydWU7XG4gICAgICAgICAgaGFuZGxlUGxheSgpO1xuICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfSBcbiAgICAvLyBlbHNlIGlmKGUua2V5Q29kZSA9PSAzOCl7IC8vIHVwIGtleVxuICAgIC8vICAgc2V0dGluZ3Muc3BlZWQgKz01O1xuICAgIC8vIH0gZWxzZSBpZihlLmtleUNvZGUgPT0gNDApe1xuICAgIC8vICAgc2V0dGluZ3Muc3BlZWQgLT01O1xuICAgIC8vIH0gZWxzZSBpZihlLmtleUNvZGUgPT0gNzMpe1xuICAgIC8vICAgaW52ZXJ0KCk7XG4gICAgLy8gfSBlbHNlIGlmKGUua2V5Q29kZSA9PSA2Nyl7XG4gICAgLy8gICBjb250cmFzdCgpO1xuICAgIC8vICB9IGVsc2UgaWYoZS5rZXlDb2RlID09IDY2KXtcbiAgICAvLyAgIGJyaWdodGVyKCk7XG4gICAgLy8gIH0gZWxzZSBpZihlLmtleUNvZGUgPT0gNjgpe1xuICAgIC8vICAgZGFya2VyKCk7XG4gICAgLy8gfVxuICB9XG4gXG59XG5cbmZ1bmN0aW9uIHNldEV2ZW50SGFuZGxlcnMoKXtcbiAgY29uc29sZS5sb2coXCJzZXR0aW5nIGV2ZW50IGhhbmRsZXJzXCIpO1xuICBwbGF5aGVhZENhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVUb3VjaFN0YXJ0LCBmYWxzZSk7XG4gIHBsYXloZWFkQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVUb3VjaEVuZCwgZmFsc2UpO1xuICBwbGF5aGVhZENhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgaGFuZGxlVG91Y2hDYW5jZWwsIGZhbHNlKTtcbiAgcGxheWhlYWRDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBoYW5kbGVUb3VjaE1vdmUsIGZhbHNlKTtcbiAgIHBsYXloZWFkQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgaGFuZGxlTW91c2VTdGFydCwgZmFsc2UpO1xuICAgIHBsYXloZWFkQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgaGFuZGxlTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgcGxheWhlYWRDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgaGFuZGxlTW91c2VVcCwgZmFsc2UpO1xuICAgICBwbGF5aGVhZENhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgaGFuZGxlTW91c2VVcCwgZmFsc2UpO1xuICAgICAgcGxheWhlYWRDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgaGFuZGxlTW91c2VVcCwgZmFsc2UpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25SZXNpemUpO1xufVxuXG5cblxuXG5mdW5jdGlvbiBpbml0QXVkaW9DdHgoKXtcbiAgYXVkaW9DdHggPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuICBjb21wcmVzc29yID0gYXVkaW9DdHguY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG4gIGNvbXByZXNzb3IuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG4gIHNjYWxlRnJlcXVlbmNpZXMgPSBTY2FsZU1ha2VyLm1ha2VTY2FsZShzZXR0aW5ncy5zY2FsZS50eXBlLCAnQzMnLCBzZXR0aW5ncy5zY2FsZS5udW1TdGVwcykuaW5IZXJ0ejtcbiAgc3ludGggPSBuZXcgU3ludGhlc2l6ZXIoc2NhbGVGcmVxdWVuY2llcywgY29tcHJlc3NvciwgYXVkaW9DdHgpO1xufVxuXG5mdW5jdGlvbiBuZXh0U3RlcCgpe1xuICAvL3ZhciBjb2wgPSBNYXRoLmZsb29yKGF1ZGlvQ3R4LmN1cnJlbnRUaW1lKnNldHRpbmdzLnNwZWVkKTtcbiAgdmFyIHN0ZXAgPSBNYXRoLmZsb29yKChhdWRpb0N0eC5jdXJyZW50VGltZSAtIHByZXZUaW1lKSooc2V0dGluZ3Muc3BlZWQqNDAwLTIwMCkpO1xuICB2YXIgY29sID0gY29sUG9zICsgc3RlcDtcbiBpZihjb2w+PWltYWdlQ2FudmFzLmNhbnZhcy53aWR0aCl7XG4gIHdoaWxlKGNvbD49aW1hZ2VDYW52YXMuY2FudmFzLndpZHRoKXtcbiAgICBjb2wtPWltYWdlQ2FudmFzLmNhbnZhcy53aWR0aDtcbiAgfVxuIH1cbiBpZihjb2wgPCAwKSBjb2wrPWltYWdlQ2FudmFzLmNhbnZhcy53aWR0aDtcbiAgcGxheWhlYWRDdHguY2xlYXJSZWN0KDAsIDAsIHBsYXloZWFkQ2FudmFzLndpZHRoLCBwbGF5aGVhZENhbnZhcy5oZWlnaHQpO1xuXG4gICAgcGxheWhlYWRDdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMCwgMTAyLCAxKVwiO1xuICAgIHBsYXloZWFkQ3R4LmZpbGxSZWN0KGNvbC01LCAwLCAxMCwgaW1hZ2VDYW52YXMuY2FudmFzLmhlaWdodCk7XG4gICAgcGxheWhlYWRDdHguZmlsbFN0eWxlID0gXCJyZ2JhKDE1MywgMjU1LCAyMDQsIDEpXCI7XG4gIFxuICB2YXIgZ2FpblZhbHMgPSBbXTtcbiAgZm9yKHZhciBpID0gMDsgaSA8IHNldHRpbmdzLnNjYWxlLm51bVN0ZXBzOyBpKyspe1xuICAgICAgIHZhciByb3cgPSBNYXRoLmZsb29yKChpKzAuNSkqaW1hZ2VDYW52YXMuY2FudmFzLmhlaWdodC9zZXR0aW5ncy5zY2FsZS5udW1TdGVwcyk7XG4gICAgICAgdmFyIG9mZiA9IChyb3cqaW1hZ2VDYW52YXMuY2FudmFzLndpZHRoK2NvbCkqNDtcbiAgICAgICB2YXIgdmFsO1xuICAgICAgXG4gICAgICAgIC8vdmFsID0gaW1hZ2VDYW52YXMuaW1hZ2VEYXRhW29mZl0raW1hZ2VDYW52YXMuaW1hZ2VEYXRhW29mZisxXStpbWFnZUNhbnZhcy5pbWFnZURhdGFbb2ZmKzJdKS8oMjU1KjMpO1xuICAgICAgIHZhbCA9IChpbWFnZUNhbnZhcy5pbWFnZURhdGFbb2ZmXStkcmF3Q2FudmFzLmltYWdlRGF0YVtvZmZdKihkcmF3Q2FudmFzLmltYWdlRGF0YVtvZmYrM10vMjU1KSkvMjU1O1xuICAgICAgLy8gY29uc29sZS5sb2codmFsKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJvdyk7XG4gICAgICAgLy8gfVxuICAgICAgICBwbGF5aGVhZEN0eC5maWxsUmVjdChjb2wtNSwgcm93LCAxMCwgdmFsKjUpO1xuICAgICAgICBnYWluVmFsc1tpXSA9IHZhbDtcbiAgICAgICAvLyBpZih2YWwgPiAwKSBzeW50aC5wbGF5Tm90ZShpLCB2YWwpO1xuICAgIH1cbiBzeW50aC51cGRhdGVHYWlucyhnYWluVmFscyk7XG4gIHJlcXVlc3RJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShuZXh0U3RlcCk7XG4gIGNvbFBvcyA9IGNvbDtcbiAgcHJldlRpbWUgPSBhdWRpb0N0eC5jdXJyZW50VGltZTtcbn1cblxuXG5mdW5jdGlvbiBoYW5kbGVNb3VzZVN0YXJ0KGUpe1xuICAvLyBpc1NjcnViYmluZyA9IHRydWU7XG4gIC8vIGNvbnNvbGUubG9nKGUucGFnZVgpO1xuICAvLyBjb2xQb3MgPSBlLnBhZ2VYO1xuICAvLyBjb25zb2xlLmxvZyhjb2xQb3MpO1xuICBkcmF3Q2FudmFzLnN0YXJ0U3Ryb2tlKGUucGFnZVgsIGUucGFnZVkpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVNb3VzZU1vdmUoZSl7XG4gIC8vIGlmKGlzU2NydWJiaW5nKXtcbiAgLy8gICAgY29sUG9zID0gZS5wYWdlWDtcbiAgLy8gIH0gXG4gICBkcmF3Q2FudmFzLmNvbnRpbnVlU3Ryb2tlKGUucGFnZVgsIGUucGFnZVkpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVNb3VzZVVwKCl7XG4gIC8vaXNTY3J1YmJpbmcgPSBmYWxzZTtcbiAgZHJhd0NhbnZhcy5lbmRTdHJva2UoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlVG91Y2hTdGFydChlKSB7XG4gIC8vIGlzU2NydWJiaW5nID0gdHJ1ZTtcbiAgLy8gIHZhciB0b3VjaGVzID0gZS5jaGFuZ2VkVG91Y2hlcztcbiAgaWYoZS50b3VjaGVzIT11bmRlZmluZWQpe1xuICAgIC8vIGNvbFBvcyA9IGUudG91Y2hlc1swXS5wYWdlWDtcbiAgICBkcmF3Q2FudmFzLnN0YXJ0U3Ryb2tlKGUudG91Y2hlc1swXS5wYWdlWCwgZS50b3VjaGVzWzBdLnBhZ2VZKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvblJlc2l6ZSgpe1xuICBpbWFnZUNhbnZhcy5yZXNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIGRyYXdDYW52YXMucmVzaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBwbGF5aGVhZENhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICBwbGF5aGVhZENhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVRvdWNoTW92ZShlKSB7XG4gIGRyYXdDYW52YXMuY29udGludWVTdHJva2UoZS50b3VjaGVzWzBdLnBhZ2VYLCBlLnRvdWNoZXNbMF0ucGFnZVkpO1xuICBcbn1cblxuZnVuY3Rpb24gaGFuZGxlVG91Y2hFbmQoZSkge1xuICBkcmF3Q2FudmFzLmVuZFN0cm9rZSgpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVUb3VjaENhbmNlbChlKSB7XG4gIFxufSIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qXG4gICAqIHVzZWZ1bCByZWZlcmVuY2VzIGZvciB0aGUgZnJlcXVlbmN5IG9mIG11c2ljYWwgbm90ZXMgYW5kIHJlbGF0ZWQgZm9ydW1sYWU6XG4gICAqIFxuICAgKiByZWY6IGh0dHA6Ly93d3cucGh5Lm10dS5lZHUvfnN1aXRzL05vdGVGcmVxQ2FsY3MuaHRtbFxuICAgKiBodHRwOi8vd3d3LnBoeS5tdHUuZWR1L35zdWl0cy9ub3RlZnJlcXMuaHRtbFxuICAgKi9cbiAgXG4gIHZhciBUV0VMRlRIX1JPT1QgPSBnZXROdGhSb290KDIsIDEyKSwgLy8gdGhlIGJhc2lzIGZvciBnZXR0aW5nIHRoZSBmcmVxdWVuY3kgb2YgYSBzZW1pdG9uZSAvIHNpbmdsZSBpbnRlcnZhbFxuICAgICAgUkVGX0ZSRVFVRU5DSUVTID0ge1xuICAgICAgICBBNDogNDQwLFxuICAgICAgICBDMDogMTYuMzUsXG4gICAgICAgIEI4OiA3OTAyLjEzXG4gICAgICB9LFxuICAgICAgTUlOX0ZSRVFVRU5DWSA9IFJFRl9GUkVRVUVOQ0lFUy5DMCwgLy8gQzBcbiAgICAgIE1BWF9GUkVRVUVOQ1kgPSBSRUZfRlJFUVVFTkNJRVMuQjgsIC8vIEI4XG4gICAgICBDRU5UU19QRVJfU0VNSVRPTkUgPSAxMDAsXG4gICAgICBzY2FsZURlZnMgPSB7fTtcblxuICAvLyB0aGUgc2VxdWVuY2Ugb2YgaW50ZXJ2YWxzIChpbiBzZW1pdG9uZXMpIGJldHdlZW4gZWFjaCBub3RlIGluIGEgZ2l2ZW4gdHlwZSBvZiBzY2FsZVxuICAvLyBleHByZXNzZWQgYXMgYW4gYXJyYXkgZm9yIGVhY2ggc2NhbGVcbiAgLy8gVE9ETzogY29tcGxldGUgYmFzaWMgc2V0IG9mIHNjYWxlc1xuICBzY2FsZURlZnMuY2hyb21hdGljID0gWzFdO1xuICBzY2FsZURlZnMud2hvbGVUb25lID0gWzJdO1xuICBzY2FsZURlZnMubWFqb3IgPSBbMiwgMiwgMSwgMiwgMiwgMiwgMV07XG4gIHNjYWxlRGVmcy5tYWpvclBlbnRhdG9uaWMgPSBbMiwgMiwgMywgMiwgM107XG4gIHNjYWxlRGVmcy5taW5vclBlbnRhdG9uaWMgPSBbMywgMiwgMiwgMywgMl07XG4gIHNjYWxlRGVmcy5rdW9taVBlbnRhdG9uaWMgPSBbMSwgNCwgMiwgMSwgNF07XG4gIHNjYWxlRGVmcy5jaGluZXNlUGVudGF0b25pYyA9IFs0LCAyLCAxLCA0LCAxXTtcbiAgc2NhbGVEZWZzLm5hdHVyYWxNaW5vciA9IFsyLCAxLCAyLCAyLCAxLCAyLCAyXTtcbiAgc2NhbGVEZWZzLmhhcm1vbmljTWlub3IgPSBbMiwgMSwgMiwgMiwgMSwgMywgMV07XG4gIHNjYWxlRGVmcy5tZWxvZGljTWlub3IgPSBbMiwgMSwgMiwgMiwgMiwgMiwgMV07XG5cbiAgLypcbiAgICogTWF0aHMgaGVscGVyc1xuICAgKi9cbiAgZnVuY3Rpb24gZ2V0TnRoUm9vdCAodmFsdWUsIG4pIHtcbiAgICByZXR1cm4gTWF0aC5wb3codmFsdWUsIDEgLyBuKTtcbiAgfVxuXG4gIC8qXG4gICAqIHJldHVybnMgdHJ1ZSBpZiBwYXNzZWQgYSB2YWxpZCBub3RlIG5hbWUgc3VjaCBhczpcbiAgICogJ0E0JywgJ0MwJywgJ0YjNScsICdHYjInLCAnQ2I3J1xuICAgKiBvdGhlcndpc2UgcmV0dXJucyBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNWYWxpZE5vdGVOYW1lIChub3RlTmFtZSkge1xuICAgIHZhciB2YWxpZE5hbWVSZWdleCA9IC9eW0EtR11bYiNdP1swLThdJC87XG5cbiAgICByZXR1cm4gdHlwZW9mIG5vdGVOYW1lID09PSAnc3RyaW5nJyAmJiB2YWxpZE5hbWVSZWdleC50ZXN0KG5vdGVOYW1lKTtcbiAgfVxuXG4gIC8qXG4gICAqIHJldHVybnMgdHJ1ZSBpZiBhIHNjYWxlIHR5cGUgd2l0aCB0aGUgc3BlY2lmaWVkIHNjYWxlTmFtZSBpcyBpbiB0aGUgc2NhbGUgdHlwZSBjb2xsZWN0aW9uXG4gICAqIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc1NjYWxlVHlwZURlZmluZWQgKHNjYWxlTmFtZSkge1xuICAgIHJldHVybiBzY2FsZURlZnMuaGFzT3duUHJvcGVydHkoc2NhbGVOYW1lKTtcbiAgfVxuXG4gIC8qXG4gICAqIHJldHVybnMgdHJ1ZSBpZiBwYXNzZWQgYSB2YWxpZCBzY2FsZSB0eXBlIChpZS4gaXMgYSBzdHJpbmcgYW5kIGlzIGluIHNjYWxlIGRlZmluaXRpb25zKVxuICAgKiBvdGhlcndpc2UgcmV0dXJucyBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNWYWxpZFNjYWxlTmFtZSAoc2NhbGVOYW1lKSB7XG4gICAgdmFyIHNjYWxlTmFtZVJlZ2V4ID0gL15bQS1aYS16XFwtXFxfIF0rJC87XG5cbiAgICByZXR1cm4gdHlwZW9mIHNjYWxlTmFtZSA9PT0gJ3N0cmluZycgJiYgc2NhbGVOYW1lUmVnZXgudGVzdChzY2FsZU5hbWUpO1xuICB9XG5cbiAgIC8qXG4gICAgKiByZXR1cm5zIHRydWUgaWYgcGFzc2VkIGEgdmFsaWQgc2NhbGUgZGVmaW5pdGlvbiAoaWUuIGFuIGFycmF5IG9mIGludGVnZXJzKVxuICAgICogb3RoZXJ3aXNlIHJldHVybnMgZmFsc2VcbiAgICAqL1xuICBmdW5jdGlvbiBpc1ZhbGlkU2NhbGVEZWZpbml0aW9uIChzY2FsZURlZikge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHNjYWxlRGVmKSAmJiBzY2FsZURlZi5ldmVyeShpc1Bvc2l0aXZlSW50ZWdlckdyZWF0ZXJUaGFuWmVybyk7XG4gIH1cblxuICAvKlxuICAgICogcmV0dXJucyB0cnVlIGlmIHBhc3NlZCBhbiBpbnRlZ2VyXG4gICAgKiBvdGhlcndpc2UgcmV0dXJucyBmYWxzZVxuICAgICovXG4gIGZ1bmN0aW9uIGlzUG9zaXRpdmVJbnRlZ2VyR3JlYXRlclRoYW5aZXJvICh2YWx1ZSkge1xuICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgJiYgKHZhbHVlICUgMSA9PT0gMCkgJiYgKHZhbHVlID4gMCk7XG4gIH1cblxuICAvKlxuICAgKiByZXR1cm5zIHRoZSBmcmVxdWVuY3kgb2YgYSBub3RlIHRoYXQncyBhIGdpdmVuIG51bWJlciBvZiBzZW1pdG9uZXMgZnJvbSB0aGUgcmVmZXJlbmNlIGZyZXF1ZW5jeSAoaW50ZXJ2YWwgY2FuIGJlIG5lZ2F0aXZlKVxuICAgKi8gXG4gIGZ1bmN0aW9uIGdldE5vdGVCeUludGVydmFsIChyZWZlcmVuY2UsIGludGVydmFsKSB7XG4gICAgLy8gZm9ybXVsYTogaHR0cDovL3d3dy5waHkubXR1LmVkdS9+c3VpdHMvTm90ZUZyZXFDYWxjcy5odG1sXG4gICAgdmFyIGZyZXF1ZW5jeSA9IHJlZmVyZW5jZSAqIE1hdGgucG93KFRXRUxGVEhfUk9PVCwgaW50ZXJ2YWwpO1xuICAgIGZyZXF1ZW5jeSA9IChmcmVxdWVuY3kgPiBNQVhfRlJFUVVFTkNZKSA/IE1BWF9GUkVRVUVOQ1kgOiBmcmVxdWVuY3k7XG4gICAgZnJlcXVlbmN5ID0gKGZyZXF1ZW5jeSA8IE1JTl9GUkVRVUVOQ1kpID8gTUlOX0ZSRVFVRU5DWSA6IGZyZXF1ZW5jeTtcblxuICAgIC8vIHJvdW5kIHRvIDIgZGVjaW1hbCBwbGFjZXMgZm9yIGVhc2Ugb2YgcmVmZXJlbmNlICYgdGVzdGluZ1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGZyZXF1ZW5jeSAqIDEwMCkgLyAxMDA7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyB0aGUgbnVtYmVyIG9mIGNlbnRzIChkZXR1bmUpIGdpdmVuIGFuIGludGVydmFsIGluIHNlbWl0b25lc1xuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q2VudHNCeUludGVydmFsIChpbnRlcnZhbCkge1xuICAgICByZXR1cm4gaW50ZXJ2YWwgKiBDRU5UU19QRVJfU0VNSVRPTkU7XG4gIH1cblxuICAvKlxuICAgKiByZXR1cm5zIHRoZSBpbnRlcnZhbCBpbiBzZW1pdG9uZXMsIHJlbGF0aXZlIHRvIEE0XG4gICAqIGVnLiAoJ0EnLCA0KSByZXR1cm5zIDA7ICgnQycsIDYpIHJldHVybnMgMTM7ICgnQScsIDMpIHJldHVybnMgLTEyXG4gICAqL1xuICBmdW5jdGlvbiBnZXRJbnRlcnZhbEZyb21BNCAobm90ZU5hbWUsIG9jdGF2ZSkge1xuICAgIHZhciBzZW1pdG9uZXNJbk9jdGF2ZSA9IDEyLFxuICAgICAgICBBNE9jdGF2ZSA9IDQsXG4gICAgICAgIGludGVydmFsc1JlbGF0aXZlVG9BID0ge1xuICAgICAgICAgIEM6IC05LFxuICAgICAgICAgIEQ6IC03LFxuICAgICAgICAgIEU6IC01LFxuICAgICAgICAgIEY6IC00LFxuICAgICAgICAgIEc6IC0yLFxuICAgICAgICAgIEE6IDAsXG4gICAgICAgICAgQjogMiAgICBcbiAgICAgICAgfTtcbiAgICBcbiAgICByZXR1cm4gaW50ZXJ2YWxzUmVsYXRpdmVUb0Fbbm90ZU5hbWVdICsgKChvY3RhdmUgLSBBNE9jdGF2ZSkgKiBzZW1pdG9uZXNJbk9jdGF2ZSk7XG4gIH1cblxuICAvKlxuICAgKiByZXR1cm5zIHRoZSBpbnRlcnZhbCBhZGp1c3RtZW50IGZvciBmbGF0IGFuZCBzaGFycCAoJyMnIGFuZCAnYicpXG4gICAqL1xuICBmdW5jdGlvbiBnZXRJbnRlcnZhbEFkanVzdG1lbnQgKHNoYXJwT3JGbGF0KSB7XG4gICAgdmFyIGFkanVzdG1lbnRzID0ge1xuICAgICAgJyMnOiAxLFxuICAgICAgJ2InOiAtMVxuICAgIH07XG5cbiAgICBpZiAoc2hhcnBPckZsYXQgIT09ICcjJyAmJiBzaGFycE9yRmxhdCAhPT0gJ2InKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gYWRqdXN0bWVudHNbc2hhcnBPckZsYXRdO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYW4gYXJyYXkgb2YgdGhlIG5hbWVzIG9mIGFsbCBhdmFpbGFibGUgc2NhbGVzXG4gICAqL1xuICBmdW5jdGlvbiBnZXRTY2FsZU5hbWVzICgpIHtcbiAgICB2YXIgc2NhbGVOYW1lLFxuICAgICAgICBzY2FsZU5hbWVzID0gW107XG5cbiAgICBmb3IgKHNjYWxlTmFtZSBpbiBzY2FsZURlZnMpIHtcbiAgICAgIGlmIChzY2FsZURlZnMuaGFzT3duUHJvcGVydHkoc2NhbGVOYW1lKSkge1xuICAgICAgICBzY2FsZU5hbWVzLnB1c2goc2NhbGVOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2NhbGVOYW1lcztcbiAgfVxuXG4gIC8qXG4gICAqIHJldHVybnMgdGhlIGZyZXF1ZW5jeSBvZiBhIG5vdGUgdGhhdCdzIGVxdWl2YWxlbnQgdG8gYSBmcmllbmRseSBzdHJpbmcsXG4gICAqIHN1Y2ggYXMgJ0E0JywgJ0MwJywgJ0YjNScsICdHYjInLCAnQ2I3J1xuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Tm90ZSAobm90ZVN0cmluZykge1xuICAgIGlmICghaXNWYWxpZE5vdGVOYW1lKG5vdGVTdHJpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgbm90ZVN0cmluZzogZ2V0Tm90ZShub3RlU3RyaW5nKSBub3RlU3RyaW5nIHNob3VsZCBiZSBhIHZhbGlkIG5vdGUgbmFtZSwgZWcuIFwiQWIwXCIsIFwiQzdcIicpO1xuICAgIH1cblxuICAgIHZhciBub3RlTmFtZU1hdGNoID0gbm90ZVN0cmluZy5tYXRjaCgvXltBLUddL2cpLFxuICAgICAgICBzaGFycE9yRmxhdE1hdGNoID0gbm90ZVN0cmluZy5tYXRjaCgvW2IjXS9nKSxcbiAgICAgICAgb2N0YXZlTWF0Y2ggPSBub3RlU3RyaW5nLm1hdGNoKC9bMC04XS9nKSxcbiAgICAgICAgbm90ZU5hbWUgPSBub3RlTmFtZU1hdGNoID8gbm90ZU5hbWVNYXRjaFswXSA6IG51bGwsXG4gICAgICAgIHNoYXJwT3JGbGF0ID0gc2hhcnBPckZsYXRNYXRjaCA/IHNoYXJwT3JGbGF0TWF0Y2hbMF0gOiBudWxsLFxuICAgICAgICBvY3RhdmUgPSBvY3RhdmVNYXRjaCA/IHBhcnNlSW50KG9jdGF2ZU1hdGNoWzBdLCAxMCkgOiBudWxsLFxuICAgICAgICBpbnRlcnZhbEZyb21BLFxuICAgICAgICBhZGp1c3RlZEludGVydmFsO1xuXG4gICAgaW50ZXJ2YWxGcm9tQSA9IGdldEludGVydmFsRnJvbUE0KG5vdGVOYW1lLCBvY3RhdmUpO1xuICAgIGFkanVzdGVkSW50ZXJ2YWwgPSBpbnRlcnZhbEZyb21BICsgZ2V0SW50ZXJ2YWxBZGp1c3RtZW50KHNoYXJwT3JGbGF0KTtcblxuICAgIHJldHVybiBnZXROb3RlQnlJbnRlcnZhbChSRUZfRlJFUVVFTkNJRVMuQTQsIGFkanVzdGVkSW50ZXJ2YWwpO1xuICB9XG5cbiAgLypcbiAgICogcmV0dXJucyBhbiBhcnJheSBvZiBmcmVxdWVuY2llcyBpbiBIeiwgcmVwcmVzZW50aW5nIHRoZSBub3RlcyBpbiBhIG11c2ljYWwgc2NhbGUsXG4gICAqIGdpdmVuIHRoZSB0eXBlIG9mIHNjYWxlLCB0aGUgZnJlcXVlbmN5IG9mIGEgc3RhcnRpbmcgbm90ZSwgYW5kIHRoZSBudW1iZXIgb2Ygbm90ZXNcbiAgICovXG4gIGZ1bmN0aW9uIG1ha2VTY2FsZSAoc2NhbGVUeXBlLCBzdGFydE5vdGUsIG5vdGVDb3VudCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50KHMpOiBtYWtlU2NhbGUoKSBleHBlY3RzIHRocmVlIGFyZ3VtZW50cycpO1xuICAgIH1cbiAgICBpZiAoIWlzVmFsaWRTY2FsZU5hbWUoc2NhbGVUeXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50IHNjYWxlVHlwZTogbWFrZVNjYWxlKHNjYWxlVHlwZSwgc3RhcnROb3RlLCBub3RlQ291bnQpIGV4cGVjdHMgc2NhbGVUeXBlIHRvIGJlIGEgc3RyaW5nIGNvbnNpc3Rpbmcgb2YgbG93ZXIgb3IgdXBwZXIgY2FzZSBsZXR0ZXJzIChBLVosIGEteiksIHNwYWNlcywgaHlwaGVucygtKSBvciB1bmRlcnNjb3JlcyhfKSBvbmx5Jyk7XG4gICAgfVxuICAgIGlmICghaXNTY2FsZVR5cGVEZWZpbmVkKHNjYWxlVHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2NhbGUgdHlwZSBpcyB1bmRlZmluZWQ6IG1ha2VTY2FsZShzY2FsZVR5cGUsIHN0YXJ0Tm90ZSwgbm90ZUNvdW50KSBzY2FsZSB3aXRoIG5hbWUgcHJvdmlkZWQgZm9yIHNjYWxlVHlwZSBpcyBub3QgZGVmaW5lZCDigJPCoG1ha2Ugc3VyZSB5b3UgY2hvb3NlIGZyb20gYXZhaWxhYmxlIHNjYWxlIHR5cGVzJyk7XG4gICAgfVxuICAgIGlmICghaXNQb3NpdGl2ZUludGVnZXJHcmVhdGVyVGhhblplcm8obm90ZUNvdW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50IG5vdGVDb3VudDogbWFrZVNjYWxlKHNjYWxlVHlwZSwgc3RhcnROb3RlLCBub3RlQ291bnQpIGV4cGVjdHMgbm90ZUNvdW50IHRvIGJlIGEgcG9zaXRpdmUgaW50ZWdlciBncmVhdGVyIHRoYW4gMCcpO1xuICAgIH1cbiAgICBpZiAoIWlzVmFsaWROb3RlTmFtZShzdGFydE5vdGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgc3RhcnROb3RlOiBtYWtlU2NhbGUoc2NhbGVUeXBlLCBzdGFydE5vdGUsIG5vdGVDb3VudCkgc3RhcnROb3RlIHNob3VsZCBiZSBhIHZhbGlkIG5vdGUgbmFtZSwgZWcuIFwiQWIwXCIsIFwiQzdcIicpO1xuICAgIH1cbiAgICB2YXIgaSxcbiAgICAgICAgc2NhbGVEZWYgPSBzY2FsZURlZnNbc2NhbGVUeXBlXSxcbiAgICAgICAgc2NhbGVJbkhlcnR6ID0gW10sXG4gICAgICAgIHNjYWxlSW5DZW50cyA9IFtdLFxuICAgICAgICBzY2FsZUluU2VtaXRvbmVzID0gW10sXG4gICAgICAgIGludGVydmFsc0Zyb21TdGFydE5vdGUgPSAwLFxuICAgICAgICBpbnRlcnZhbENvdW50ZXIgPSAwLFxuICAgICAgICBzdGFydEZyZXF1ZW5jeSA9IGdldE5vdGUoc3RhcnROb3RlKTtcblxuICAgIC8vIHRoZSBmaXJzdCBub3RlIGlzIGFsd2F5cyB0aGUgc3RhcnRpbmcgZnJlcXVlbmN5XG4gICAgc2NhbGVJbkhlcnR6LnB1c2goc3RhcnRGcmVxdWVuY3kpO1xuICAgIHNjYWxlSW5DZW50cy5wdXNoKDApO1xuICAgIHNjYWxlSW5TZW1pdG9uZXMucHVzaCgwKTtcblxuICAgIGZvcihpID0gMDsgaSA8IG5vdGVDb3VudCAtIDE7IGkgKz0gMSkge1xuICAgICAgaW50ZXJ2YWxzRnJvbVN0YXJ0Tm90ZSArPSBzY2FsZURlZltpbnRlcnZhbENvdW50ZXJdO1xuXG4gICAgICBzY2FsZUluSGVydHoucHVzaChnZXROb3RlQnlJbnRlcnZhbChzdGFydEZyZXF1ZW5jeSwgaW50ZXJ2YWxzRnJvbVN0YXJ0Tm90ZSkpO1xuICAgICAgc2NhbGVJbkNlbnRzLnB1c2goZ2V0Q2VudHNCeUludGVydmFsKGludGVydmFsc0Zyb21TdGFydE5vdGUpKTtcbiAgICAgIHNjYWxlSW5TZW1pdG9uZXMucHVzaChpbnRlcnZhbHNGcm9tU3RhcnROb3RlKTtcblxuICAgICAgaW50ZXJ2YWxDb3VudGVyID0gKGludGVydmFsQ291bnRlciA9PT0gc2NhbGVEZWYubGVuZ3RoIC0gMSkgPyAwIDogaW50ZXJ2YWxDb3VudGVyICsgMTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnROb3RlOiBzdGFydEZyZXF1ZW5jeSxcbiAgICAgIGluSGVydHo6IHNjYWxlSW5IZXJ0eixcbiAgICAgIGluQ2VudHM6IHNjYWxlSW5DZW50cyxcbiAgICAgIGluU2VtaVRvbmVzOiBzY2FsZUluU2VtaXRvbmVzXG4gICAgfTtcbiAgfVxuXG4gIC8qXG4gICAqIGFkZHMgYSBuZXcgc2NhbGUgZGVmaW5pdGlvbiBvZiB0aGUgZ2l2ZW4gbmFtZSBhbmQgc2VtaXRvbmUgaW50ZXJ2YWxzIGRlZmluaXRpb24gYXJyYXlcbiAgICogdG8gdGhlIHNjYWxlIGRlZmluaXRpb25zIGNvbGxlY3Rpb25cbiAgICovXG4gIGZ1bmN0aW9uIGFkZFNjYWxlIChuYW1lLCBzY2FsZURlZikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGFyZ3VtZW50KHMpOiBhZGRTY2FsZSgpIGV4cGVjdHMgdHdvIGFyZ3VtZW50cycpO1xuICAgIH1cbiAgICBpZiAoIWlzVmFsaWRTY2FsZU5hbWUobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBuYW1lOiBhZGRTY2FsZShuYW1lLCBzY2FsZURlZikgZXhwZWN0cyBuYW1lIHRvIGJlIGEgc3RyaW5nIGNvbnNpc3Rpbmcgb2YgbG93ZXIgb3IgdXBwZXIgY2FzZSBsZXR0ZXJzIChBLVosIGEteiksIHNwYWNlcywgaHlwaGVucygtKSBvciB1bmRlcnNjb3JlcyhfKSBvbmx5Jyk7XG4gICAgfVxuICAgIGlmIChpc1NjYWxlVHlwZURlZmluZWQobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2NhbGUgdHlwZSBhbHJlYWR5IGRlZmluZWQ6IGFkZFNjYWxlKG5hbWUsIHNjYWxlRGVmKSBzY2FsZSB3aXRoIHZhbHVlIG9mIG5hbWUgYXJndW1lbnQgaXMgYWxyZWFkeSBkZWZpbmVkIOKAk8KgbWFrZSBzdXJlIHlvdSBjaG9vc2UgYSBzY2FsZSBuYW1lIG5vdCBhbHJlYWR5IGluIHVzZScpO1xuICAgIH1cbiAgICBpZiAoIWlzVmFsaWRTY2FsZURlZmluaXRpb24oc2NhbGVEZWYpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgc2NhbGVEZWY6IGFkZFNjYWxlKG5hbWUsIHNjYWxlRGVmKSBleHBlY3RzIHNjYWxlRGVmIHRvIGJlIGFuIGFycmF5IG9mIG9ubHkgcG9zaXRpdmUgaW50ZWdlcnMgZ3JlYXRlciB0aGFuIDAnKTtcbiAgICB9XG5cbiAgICBzY2FsZURlZnNbbmFtZV0gPSBzY2FsZURlZjtcbiAgfVxuXG4gIC8qXG4gICAqIG1vZHVsZSBleHBvcnQgZnVuY3Rpb25zXG4gICAqL1xuICByZXR1cm4ge1xuICAgIG1ha2VTY2FsZTogbWFrZVNjYWxlLFxuICAgIGdldE5vdGU6IGdldE5vdGUsXG4gICAgYWRkU2NhbGU6IGFkZFNjYWxlLFxuICAgIGdldFNjYWxlTmFtZXM6IGdldFNjYWxlTmFtZXMsXG5cbiAgICAvLyBleHBvcnRlZCBmb3IgdGVzdGluZyBwdXJwb3NlcyDigJMgbm90IHBhcnQgb2YgdGhlIHB1YmxpYyBBUElcbiAgICB0ZXN0OiB7XG4gICAgICBnZXRJbnRlcnZhbEZyb21BNDogZ2V0SW50ZXJ2YWxGcm9tQTQsXG4gICAgICBnZXRJbnRlcnZhbEFkanVzdG1lbnQ6IGdldEludGVydmFsQWRqdXN0bWVudCxcbiAgICAgIGdldENlbnRzQnlJbnRlcnZhbDogZ2V0Q2VudHNCeUludGVydmFsLFxuICAgICAgZ2V0Tm90ZUJ5SW50ZXJ2YWw6IGdldE5vdGVCeUludGVydmFsLFxuICAgICAgaXNWYWxpZE5vdGVOYW1lOiBpc1ZhbGlkTm90ZU5hbWUsXG4gICAgICBpc1ZhbGlkU2NhbGVOYW1lOiBpc1ZhbGlkU2NhbGVOYW1lLFxuICAgICAgaXNWYWxpZFNjYWxlRGVmaW5pdGlvbjogaXNWYWxpZFNjYWxlRGVmaW5pdGlvbixcbiAgICAgIGlzUG9zaXRpdmVJbnRlZ2VyR3JlYXRlclRoYW5aZXJvOiBpc1Bvc2l0aXZlSW50ZWdlckdyZWF0ZXJUaGFuWmVybyxcbiAgICAgIGlzU2NhbGVUeXBlRGVmaW5lZDogaXNTY2FsZVR5cGVEZWZpbmVkXG4gICAgfVxuICB9O1xuICBcbn0oKSk7XG4iLCJjbGFzcyBTeW50aGVzaXplciB7XG5cdGNvbnN0cnVjdG9yKGZyZXF1ZW5jaWVzLCBjb21wcmVzc29yLCBjdHgpe1xuXHRcdHRoaXMuZnJlcXVlbmNpZXMgPSBmcmVxdWVuY2llcztcblx0XHR0aGlzLmN0eCA9IGN0eDtcblx0XHR0aGlzLm9zY2lsbGF0b3JzID0gW107XG5cdFx0dGhpcy5jb21wcmVzc29yID0gY29tcHJlc3Nvcjtcblx0XHR0aGlzLmluaXRPc2NpbGxhdG9ycyhmcmVxdWVuY2llcyk7XG5cdH1cblxuXHRwbGF5Tm90ZShpbmRleCwgZ2FpblZhbCl7XG5cdFx0dmFyIG9zYyA9IHRoaXMuY3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0XHRvc2MudHlwZSA9ICdzaW5lJztcblx0Ly9cdC8vY29uc29sZS5sb2cob3NjLmZyZXF1ZW5jeSk7XG5cdFx0b3NjLmZyZXF1ZW5jeS52YWx1ZSA9IHRoaXMuZnJlcXVlbmNpZXNbdGhpcy5mcmVxdWVuY2llcy5sZW5ndGgtMS1pbmRleF07XG5cdFx0dmFyIGdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgXHRnYWluLmNvbm5lY3QodGhpcy5jb21wcmVzc29yKTtcbiAgICBcdGdhaW4uZ2Fpbi52YWx1ZSA9IDA7XG4gICAgXHRvc2MuY29ubmVjdChnYWluKTtcbiAgICBcdGdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShnYWluVmFsLCB0aGlzLmN0eC5jdXJyZW50VGltZSswLjEpO1xuICAgIFx0Z2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIHRoaXMuY3R4LmN1cnJlbnRUaW1lKzAuOCk7XG4gICAgXHRvc2Muc3RhcnQoKTtcbiAgICBcdG9zYy5zdG9wKHRoaXMuY3R4LmN1cnJlbnRUaW1lKyAwLjgpO1xuXHR9XG5cdGluaXRPc2NpbGxhdG9ycyhmcmVxdWVuY2llcyl7XHRcblx0XHQvL2NvbnNvbGUubG9nKGZyZXF1ZW5jaWVzKTtcbiAgXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBmcmVxdWVuY2llcy5sZW5ndGg7IGkrKyl7XG4gICAgXHRcdHZhciBvc2MgPSB0aGlzLmN0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICBcdFx0XHRvc2MudHlwZSA9ICdzaW5lJztcbiAgIFx0XHRcdHZhciBnYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgIFx0XHRnYWluLmNvbm5lY3QodGhpcy5jb21wcmVzc29yKTtcbiAgICBcdFx0Z2Fpbi5nYWluLnZhbHVlID0gMC4wO1xuICAgIFx0XHRvc2MuY29ubmVjdChnYWluKTtcbiAgICBcdFx0b3NjLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXF1ZW5jaWVzW2ZyZXF1ZW5jaWVzLmxlbmd0aC0xLWldO1xuICAgIFx0XHQvL2NvbnNvbGUubG9nKG9zYyk7XG4gICAgXHRcdG9zYy5zdGFydCh0aGlzLmN0eC5jdXJyZW50VGltZSk7XG4gICAgXHRcdHRoaXMub3NjaWxsYXRvcnNbaV0gPSB7b3NjOiBvc2MsIGdhaW46IGdhaW4sIHZhbDogMH07XG4gIFx0XHR9XG4gIFx0XHQvL2NvbnNvbGUubG9nKHRoaXMub3NjaWxsYXRvcnMpOywgMFxuXHR9XG5cblx0dXBkYXRlR2FpbnMoZ2FpblZhbHMpe1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBnYWluVmFscy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZih0aGlzLm9zY2lsbGF0b3JzW2ldLnZhbCE9Z2FpblZhbHNbaV0pe1xuICAgICAgXHRcdFx0dGhpcy5vc2NpbGxhdG9yc1tpXS52YWw9Z2FpblZhbHNbaV07XG4gICAgICBcdFx0XHR0aGlzLm9zY2lsbGF0b3JzW2ldLmdhaW4uZ2Fpbi5jYW5jZWxTY2hlZHVsZWRWYWx1ZXModGhpcy5jdHguY3VycmVudFRpbWUpO1xuICAgICAgICBcdFx0dGhpcy5vc2NpbGxhdG9yc1tpXS5nYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoZ2FpblZhbHNbaV0sIHRoaXMuY3R4LmN1cnJlbnRUaW1lKzAuMSk7XG4gICAgICBcdFx0fVxuXHRcdH1cblx0XHRcblx0fVxuXG5cdGVuZFN5bnRoKCl7XG5cdFx0Ly9jb25zb2xlLmxvZyh0aGlzLm9zY2lsbGF0b3JzKTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5vc2NpbGxhdG9ycy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR0aGlzLm9zY2lsbGF0b3JzW2ldLmdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCB0aGlzLmN0eC5jdXJyZW50VGltZSswLjgpO1xuXHRcdFx0dGhpcy5vc2NpbGxhdG9yc1tpXS5vc2Muc3RvcCh0aGlzLmN0eC5jdXJyZW50VGltZSswLjgpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgeyBTeW50aGVzaXplciBhcyBkZWZhdWx0fSJdfQ==
