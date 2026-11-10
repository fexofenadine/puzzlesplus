const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./matrix-DNxVhnbq.js","./glyph-DM9oq3hS.js"])))=>i.map(i=>d[i]);
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/hyperapp/src/index.js
function h(name, attributes) {
	var rest = [];
	var children = [];
	var length = arguments.length;
	while (length-- > 2) rest.push(arguments[length]);
	while (rest.length) {
		var node = rest.pop();
		if (node && node.pop) for (length = node.length; length--;) rest.push(node[length]);
		else if (node != null && node !== true && node !== false) children.push(node);
	}
	return typeof name === "function" ? name(attributes || {}, children) : {
		nodeName: name,
		attributes: attributes || {},
		children,
		key: attributes && attributes.key
	};
}
function app(state, actions, view, container) {
	var map = [].map;
	var rootElement = container && container.children[0] || null;
	var oldNode = rootElement && recycleElement(rootElement);
	var lifecycle = [];
	var skipRender;
	var isRecycling = true;
	var globalState = clone(state);
	var wiredActions = wireStateToActions([], globalState, clone(actions));
	scheduleRender();
	return wiredActions;
	function recycleElement(element) {
		return {
			nodeName: element.nodeName.toLowerCase(),
			attributes: {},
			children: map.call(element.childNodes, function(element) {
				return element.nodeType === 3 ? element.nodeValue : recycleElement(element);
			})
		};
	}
	function resolveNode(node) {
		return typeof node === "function" ? resolveNode(node(globalState, wiredActions)) : node != null ? node : "";
	}
	function render() {
		skipRender = !skipRender;
		var node = resolveNode(view);
		if (container && !skipRender) rootElement = patch(container, rootElement, oldNode, oldNode = node);
		isRecycling = false;
		while (lifecycle.length) lifecycle.pop()();
	}
	function scheduleRender() {
		if (!skipRender) {
			skipRender = true;
			setTimeout(render);
		}
	}
	function clone(target, source) {
		var out = {};
		for (var i in target) out[i] = target[i];
		for (var i in source) out[i] = source[i];
		return out;
	}
	function setPartialState(path, value, source) {
		var target = {};
		if (path.length) {
			target[path[0]] = path.length > 1 ? setPartialState(path.slice(1), value, source[path[0]]) : value;
			return clone(source, target);
		}
		return value;
	}
	function getPartialState(path, source) {
		var i = 0;
		while (i < path.length) source = source[path[i++]];
		return source;
	}
	function wireStateToActions(path, state, actions) {
		for (var key in actions) typeof actions[key] === "function" ? (function(key, action) {
			actions[key] = function(data) {
				var result = action(data);
				if (typeof result === "function") result = result(getPartialState(path, globalState), actions);
				if (result && result !== (state = getPartialState(path, globalState)) && !result.then) scheduleRender(globalState = setPartialState(path, clone(state, result), globalState));
				return result;
			};
		})(key, actions[key]) : wireStateToActions(path.concat(key), state[key] = clone(state[key]), actions[key] = clone(actions[key]));
		return actions;
	}
	function getKey(node) {
		return node ? node.key : null;
	}
	function eventListener(event) {
		return event.currentTarget.events[event.type](event);
	}
	function updateAttribute(element, name, value, oldValue, isSvg) {
		if (name === "key") {} else if (name === "style") {
			if (typeof value === "string") element.style.cssText = value;
			else {
				if (typeof oldValue === "string") oldValue = element.style.cssText = "";
				for (var i in clone(oldValue, value)) {
					var style = value == null || value[i] == null ? "" : value[i];
					if (i[0] === "-") element.style.setProperty(i, style);
					else element.style[i] = style;
				}
			}
		} else {
			if (name[0] === "o" && name[1] === "n") {
				name = name.slice(2);
				if (element.events) {
					if (!oldValue) oldValue = element.events[name];
				} else element.events = {};
				element.events[name] = value;
				if (value) {
					if (!oldValue) element.addEventListener(name, eventListener);
				} else element.removeEventListener(name, eventListener);
			} else if (name in element && name !== "list" && name !== "type" && name !== "draggable" && name !== "spellcheck" && name !== "translate" && !isSvg) element[name] = value == null ? "" : value;
			else if (value != null && value !== false) element.setAttribute(name, value);
			if (value == null || value === false) element.removeAttribute(name);
		}
	}
	function createElement(node, isSvg) {
		var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSvg = isSvg || node.nodeName === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.nodeName) : document.createElement(node.nodeName);
		var attributes = node.attributes;
		if (attributes) {
			if (attributes.oncreate) lifecycle.push(function() {
				attributes.oncreate(element);
			});
			for (var i = 0; i < node.children.length; i++) element.appendChild(createElement(node.children[i] = resolveNode(node.children[i]), isSvg));
			for (var name in attributes) updateAttribute(element, name, attributes[name], null, isSvg);
		}
		return element;
	}
	function updateElement(element, oldAttributes, attributes, isSvg) {
		for (var name in clone(oldAttributes, attributes)) if (attributes[name] !== (name === "value" || name === "checked" ? element[name] : oldAttributes[name])) updateAttribute(element, name, attributes[name], oldAttributes[name], isSvg);
		var cb = isRecycling ? attributes.oncreate : attributes.onupdate;
		if (cb) lifecycle.push(function() {
			cb(element, oldAttributes);
		});
	}
	function removeChildren(element, node) {
		var attributes = node.attributes;
		if (attributes) {
			for (var i = 0; i < node.children.length; i++) removeChildren(element.childNodes[i], node.children[i]);
			if (attributes.ondestroy) attributes.ondestroy(element);
		}
		return element;
	}
	function removeElement(parent, element, node) {
		function done() {
			parent.removeChild(removeChildren(element, node));
		}
		var cb = node.attributes && node.attributes.onremove;
		if (cb) cb(element, done);
		else done();
	}
	function patch(parent, element, oldNode, node, isSvg) {
		if (node === oldNode) {} else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
			var newElement = createElement(node, isSvg);
			parent.insertBefore(newElement, element);
			if (oldNode != null) removeElement(parent, element, oldNode);
			element = newElement;
		} else if (oldNode.nodeName == null) element.nodeValue = node;
		else {
			updateElement(element, oldNode.attributes, node.attributes, isSvg = isSvg || node.nodeName === "svg");
			var oldKeyed = {};
			var newKeyed = {};
			var oldElements = [];
			var oldChildren = oldNode.children;
			var children = node.children;
			for (var i = 0; i < oldChildren.length; i++) {
				oldElements[i] = element.childNodes[i];
				var oldKey = getKey(oldChildren[i]);
				if (oldKey != null) oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
			}
			var i = 0;
			var k = 0;
			while (k < children.length) {
				var oldKey = getKey(oldChildren[i]);
				var newKey = getKey(children[k] = resolveNode(children[k]));
				if (newKeyed[oldKey]) {
					i++;
					continue;
				}
				if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
					if (oldKey == null) removeElement(element, oldElements[i], oldChildren[i]);
					i++;
					continue;
				}
				if (newKey == null || isRecycling) {
					if (oldKey == null) {
						patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
						k++;
					}
					i++;
				} else {
					var keyedNode = oldKeyed[newKey] || [];
					if (oldKey === newKey) {
						patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
						i++;
					} else if (keyedNode[0]) patch(element, element.insertBefore(keyedNode[0], oldElements[i]), keyedNode[1], children[k], isSvg);
					else patch(element, oldElements[i], null, children[k], isSvg);
					newKeyed[newKey] = children[k];
					k++;
				}
			}
			while (i < oldChildren.length) {
				if (getKey(oldChildren[i]) == null) removeElement(element, oldElements[i], oldChildren[i]);
				i++;
			}
			for (var i in oldKeyed) if (!newKeyed[i]) removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
		}
		return element;
	}
}
var Overlay_module_default = {
	root: "Overlay_root",
	table: "Overlay_table",
	cell: "Overlay_cell"
};
var Dialog_module_default = {
	a: "Dialog_a",
	b: "Dialog_b",
	dialog: "Dialog_dialog",
	glow: "Dialog_glow",
	container: "Dialog_container",
	header: "Dialog_header",
	title: "Dialog_title",
	button: "Dialog_button",
	controls: "Dialog_controls",
	close: "Dialog_close",
	clear: "Dialog_clear"
};
//#endregion
//#region src/shell/storage.js
var load = (key) => {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
};
var frozen = false;
var freeze = () => {
	frozen = true;
};
var save = (key, value) => {
	if (frozen) return;
	try {
		localStorage.setItem(key, value);
	} catch {}
};
var remove = (key) => {
	if (frozen) return;
	try {
		localStorage.removeItem(key);
	} catch {}
};
var keys = () => {
	try {
		return Object.keys(localStorage);
	} catch {
		return [];
	}
};
//#endregion
//#region src/shell/zoom.js
var root$7 = document.documentElement;
var steps = [
	.5,
	.625,
	.75,
	.875,
	1,
	1.25,
	1.5,
	1.75,
	2,
	2.5,
	3,
	4
];
var MIN_FIT = .625;
var loadZoom = () => {
	const scale = parseFloat(load("scale"));
	return Number.isFinite(scale) ? Math.min(4, Math.max(.5, scale)) : 1;
};
var stepZoom = (scale, direction) => direction > 0 ? steps.find((step) => step > scale + .001) ?? steps[steps.length - 1] : steps.findLast((step) => step < scale - .001) ?? steps[0];
var fitZoom = (chosen, fit) => fit >= chosen ? chosen : Math.min(chosen, Math.max(MIN_FIT, Math.floor(fit * 50) / 50));
var maxZoom = (fit) => Math.max(MIN_FIT, Math.floor(fit * 100) / 100);
var loadMaximised = () => load("maximised") === "yes";
var saveMaximised = (maximised) => save("maximised", maximised ? "yes" : "");
var applyZoom = (scale) => root$7.style.setProperty("--scale", scale);
var saveZoom = (scale) => save("scale", scale);
var gameWindow = null;
var hanging = 0;
var measureFit = () => {
	if (!gameWindow || !gameWindow.offsetWidth || !gameWindow.offsetHeight) return {
		fit: Infinity,
		size: null
	};
	const frame = getComputedStyle(gameWindow.parentElement.parentElement);
	const width = innerWidth - parseFloat(frame.marginLeft) - parseFloat(frame.marginRight);
	const bar = parseFloat(getComputedStyle(gameWindow.closest("main")).paddingBottom) || 0;
	const height = innerHeight - parseFloat(frame.marginTop) - parseFloat(frame.marginBottom) - bar;
	const size = {
		width: gameWindow.offsetWidth,
		height: gameWindow.offsetHeight - hanging,
		room: `${width}x${height}`
	};
	return {
		fit: Math.min(width / size.width, height / size.height) * .99,
		size
	};
};
var sameSize = (a, b) => Boolean(a && b) && a.room === b.room && Math.abs(a.width / b.width - 1) < .03 && Math.abs(a.height / b.height - 1) < .03;
var bottom = (el) => el.offsetTop + el.offsetHeight;
var hang = (panel) => {
	const height = panel ? bottom(panel) - bottom(panel.previousElementSibling) : 0;
	if (!gameWindow || Math.abs(height - hanging) < .5) return;
	hanging = height;
	gameWindow.parentElement.style.marginBottom = height ? `calc(env(safe-area-inset-bottom) - ${height}px * var(--scale, 1))` : "";
};
var hangBelow = {
	oncreate: (panel) => hang(panel),
	onupdate: (panel) => hang(panel),
	ondestroy: () => hang(null)
};
var watchWindow = (dialog, refit) => {
	gameWindow = dialog;
	if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => refit()).observe(dialog);
	window.addEventListener("resize", () => refit());
};
//#endregion
//#region src/Overlay.jsx
var keyDown = (onKeyDown) => (event) => {
	if (event.keyCode === 27 && onKeyDown) event.stopPropagation();
	if (onKeyDown) onKeyDown(event);
};
var guardClicks = (el) => {
	let pressed = false;
	el.addEventListener("pointerdown", () => pressed = true, true);
	el.addEventListener("click", (event) => {
		if (pressed || !event.detail) return;
		event.preventDefault();
		event.stopPropagation();
	}, true);
};
var dialogOpen = () => Boolean(document.querySelector(`.${Overlay_module_default.root}`));
var MIN_SCALE = .8;
var fitDialog = (el) => {
	const dialog = el.querySelector(`.${Dialog_module_default.dialog}`);
	if (!dialog || !dialog.offsetWidth) return;
	const frame = getComputedStyle(dialog.parentElement.parentElement);
	const room = Math.min(el.clientWidth, document.documentElement.clientWidth) - parseFloat(frame.marginLeft) - parseFloat(frame.marginRight);
	const shown = parseFloat(getComputedStyle(el).getPropertyValue("--scale")) || 1;
	const scale = Math.max(shown, loadZoom());
	el.style.setProperty("--scale", 1);
	const fit = Math.floor(room / dialog.offsetWidth * 100) / 100;
	const best = fit >= scale ? scale : Math.max(MIN_SCALE, fit);
	if (best === shown) el.style.removeProperty("--scale");
	else el.style.setProperty("--scale", best);
};
var Overlay = ({ key, onKeyDown }, children) => /* @__PURE__ */ h("section", {
	key,
	class: Overlay_module_default.root,
	tabindex: -1,
	onkeydown: keyDown(onKeyDown),
	oncreate: (el) => {
		guardClicks(el);
		fitDialog(el);
	}
}, /* @__PURE__ */ h("div", { class: Overlay_module_default.table }, /* @__PURE__ */ h("div", { class: Overlay_module_default.cell }, children)));
var Button_module_default = { root: "Button_root" };
//#endregion
//#region src/Button.jsx
var Button = ({ key, type, tabIndex, title, disabled, onClick, onCreate }, children) => /* @__PURE__ */ h("button", {
	key,
	class: Button_module_default.root,
	type,
	tabindex: tabIndex,
	title,
	disabled,
	onclick: onClick,
	oncreate: onCreate
}, children);
//#endregion
//#region src/Dialog.jsx
var Dialog = ({ key, hidden, title, titleHint, onTitleDoubleClick, controls, onClose, onCreate, clear }, children) => /* @__PURE__ */ h("div", {
	key,
	hidden
}, /* @__PURE__ */ h("div", { class: Dialog_module_default.a }, /* @__PURE__ */ h("div", { class: Dialog_module_default.b }, /* @__PURE__ */ h("div", {
	class: clear === null || clear === void 0 ? Dialog_module_default.dialog : `${Dialog_module_default.dialog} ${Dialog_module_default.clear}`,
	style: clear === null || clear === void 0 ? {} : { "--window": `${clear}%` },
	oncreate: onCreate
}, /* @__PURE__ */ h("div", { class: Dialog_module_default.container }, title && /* @__PURE__ */ h("div", { class: Dialog_module_default.header }, /* @__PURE__ */ h("h1", {
	class: Dialog_module_default.title,
	title: titleHint,
	ondblclick: onTitleDoubleClick
}, title), controls && /* @__PURE__ */ h("div", { class: Dialog_module_default.controls }, controls), onClose && /* @__PURE__ */ h("div", { class: Dialog_module_default.button }, /* @__PURE__ */ h(Button, {
	tabIndex: -1,
	onClick: onClose
}, /* @__PURE__ */ h("svg", {
	class: Dialog_module_default.close,
	width: "13",
	height: "11"
}, /* @__PURE__ */ h("path", { d: "M10.977 2.406l-.883-.883L7 4.616 3.906 1.523l-.883.883L6.116 5.5 3.023 8.594l.883.883L7 6.384l3.094 3.093.883-.883L7.884 5.5l3.093-3.094z" }))))), children)))));
var BackgroundSettings_module_default = {
	root: "BackgroundSettings_root",
	row: "BackgroundSettings_row",
	name: "BackgroundSettings_name",
	range: "BackgroundSettings_range",
	slider: "BackgroundSettings_slider",
	value: "BackgroundSettings_value",
	check: "BackgroundSettings_check",
	frame: "BackgroundSettings_frame",
	select: "BackgroundSettings_select",
	credit: "BackgroundSettings_credit",
	footer: "BackgroundSettings_footer",
	button: "BackgroundSettings_button"
};
//#endregion
//#region src/shell/backgrounds/meta.js
var meta_exports = /* @__PURE__ */ __exportAll({
	hill: () => hill,
	matrix: () => matrix,
	phosphor: () => phosphor,
	substrate: () => substrate,
	truchet: () => truchet
});
var matrix = {
	name: "GLMatrix",
	credit: "Ported from GLMatrix by Jamie Zawinski, part of xscreensaver",
	wallpaper: true,
	filter: (pixels) => `blur(${.6 / pixels}px)`,
	ratio: (pixels) => Math.min(pixels, 2),
	options: [
		{
			key: "density",
			label: "Density",
			type: "range",
			min: 10,
			max: 100,
			step: 1,
			value: 44
		},
		{
			key: "speed",
			label: "Speed",
			type: "range",
			min: .25,
			max: 3,
			step: .25,
			value: 1,
			format: (v) => `${v}×`
		},
		{
			key: "encoding",
			label: "Glyphs",
			type: "select",
			choices: [
				["matrix", "Matrix"],
				["binary", "Binary"],
				["hexadecimal", "Hexadecimal"],
				["decimal", "Decimal"],
				["dna", "DNA"]
			],
			value: "matrix"
		},
		{
			key: "fog",
			label: "Fog",
			type: "toggle",
			value: true
		},
		{
			key: "waves",
			label: "Waves",
			type: "toggle",
			value: true
		}
	]
};
var substrate = {
	name: "Substrate",
	credit: "Ported from Substrate by J. Tarbell and Mike Kershaw, part of xscreensaver",
	ratio: (pixels, { detail }) => detail === "sharp" ? pixels : detail === "balanced" ? Math.min(pixels, 1.5) : 1,
	options: [
		{
			key: "growthDelay",
			label: "Growth delay",
			type: "range",
			min: 0,
			max: 50,
			step: 1,
			value: 18,
			format: (v) => `${v} ms`
		},
		{
			key: "initialCracks",
			label: "Initial cracks",
			type: "range",
			min: 3,
			max: 20,
			step: 1,
			value: 3
		},
		{
			key: "maxCracks",
			label: "Max cracks",
			type: "range",
			min: 11,
			max: 300,
			step: 1,
			value: 100
		},
		{
			key: "sandGrains",
			label: "Sand grains",
			type: "range",
			min: 2,
			max: 256,
			step: 1,
			value: 64
		},
		{
			key: "circlePercent",
			label: "Circular cracks",
			type: "range",
			min: 0,
			max: 100,
			step: 1,
			value: 33,
			format: (v) => `${v}%`
		},
		{
			key: "maxCycles",
			label: "Restart after",
			type: "range",
			min: 0,
			max: 5e4,
			step: 1e3,
			value: 1e4,
			format: (v) => v ? `${v} cycles` : "never"
		},
		{
			key: "palette",
			label: "Colours",
			type: "select",
			choices: [
				["nord", "Frost and aurora"],
				["frost", "Frost"],
				["aurora", "Aurora"]
			],
			value: "nord"
		},
		{
			key: "wireframe",
			label: "Wireframe",
			type: "toggle",
			value: false
		},
		{
			key: "seamless",
			label: "Seamless",
			type: "toggle",
			value: false
		},
		{
			key: "detail",
			label: "Detail",
			type: "select",
			choices: [
				["balanced", "Balanced"],
				["sharp", "Sharp (slow on big screens)"],
				["original", "Original"]
			],
			value: "balanced"
		}
	]
};
var truchet = {
	name: "Truchet",
	credit: "Ported from Truchet by Adrian Likins, part of xscreensaver",
	wallpaper: true,
	ratio: (pixels) => pixels,
	options: [
		{
			key: "minWidth",
			label: "Smallest tile",
			type: "range",
			min: 12,
			max: 256,
			step: 4,
			value: 40
		},
		{
			key: "maxWidth",
			label: "Largest tile",
			type: "range",
			min: 12,
			max: 512,
			step: 4,
			value: 150
		},
		{
			key: "minLineWidth",
			label: "Thinnest line",
			type: "range",
			min: 1,
			max: 48,
			step: 1,
			value: 2
		},
		{
			key: "maxLineWidth",
			label: "Thickest line",
			type: "range",
			min: 2,
			max: 96,
			step: 1,
			value: 25
		},
		{
			key: "curves",
			label: "Curves",
			type: "toggle",
			value: true
		},
		{
			key: "angles",
			label: "Angles",
			type: "toggle",
			value: true
		},
		{
			key: "square",
			label: "Square tiles",
			type: "toggle",
			value: true
		},
		{
			key: "erase",
			label: "Erase each pattern",
			type: "toggle",
			value: true
		},
		{
			key: "eraseCount",
			label: "Layers before erasing",
			type: "range",
			min: 2,
			max: 50,
			step: 1,
			value: 25
		},
		{
			key: "scroll",
			label: "Scroll",
			type: "toggle",
			value: true
		},
		{
			key: "delay",
			label: "Pattern delay",
			type: "range",
			min: .2,
			max: 20,
			step: .2,
			value: 6,
			format: (v) => `${v} s`
		},
		{
			key: "animDelay",
			label: "Scroll step delay",
			type: "range",
			min: 10,
			max: 200,
			step: 5,
			value: 30,
			format: (v) => `${v} ms`
		},
		{
			key: "animStep",
			label: "Scroll step size",
			type: "range",
			min: 1,
			max: 9,
			step: 1,
			value: 1
		},
		{
			key: "palette",
			label: "Colours",
			type: "select",
			choices: [
				["accents", "All accents"],
				["cool", "Violet to green"],
				["warm", "Yellow to magenta"],
				["base", "Base tones"]
			],
			value: "accents"
		},
		{
			key: "opacity",
			label: "Line strength",
			type: "range",
			min: 10,
			max: 100,
			step: 5,
			value: 45,
			format: (v) => `${v}%`
		}
	]
};
var phosphor = {
	name: "Phosphor",
	credit: "Ported from Phosphor by Jamie Zawinski, part of xscreensaver",
	wallpaper: true,
	ratio: (pixels) => pixels,
	options: [
		{
			key: "scale",
			label: "Scale",
			type: "range",
			min: 2,
			max: 12,
			step: 1,
			value: 6
		},
		{
			key: "ticks",
			label: "Fade",
			type: "range",
			min: 4,
			max: 40,
			step: 1,
			value: 20
		},
		{
			key: "delay",
			label: "Typing delay",
			type: "range",
			min: 10,
			max: 200,
			step: 5,
			value: 50,
			format: (v) => `${v} ms`
		},
		{
			key: "cursor",
			label: "Cursor blink",
			type: "range",
			min: 100,
			max: 1e3,
			step: 1,
			value: 333,
			format: (v) => `${v} ms`
		},
		{
			key: "colour",
			label: "Colour",
			type: "select",
			choices: [
				["cyan", "Cyan"],
				["base1", "Grey"],
				["green", "Green"],
				["yellow", "Yellow"],
				["blue", "Blue"],
				["violet", "Violet"]
			],
			value: "cyan"
		},
		{
			key: "brightness",
			label: "Brightness",
			type: "range",
			min: 10,
			max: 100,
			step: 5,
			value: 20,
			format: (v) => `${v}%`
		}
	]
};
var hill = {
	name: "Hill",
	credit: "Hill from a CC0 photo of Cattle Hill, Roedean by Hassocks5489, colour matched to Bliss, under a sky drawn live",
	wallpaper: true,
	animated: false,
	ratio: (pixels) => pixels,
	options: [
		{
			key: "wind",
			label: "Wind speed",
			type: "range",
			min: .25,
			max: 4,
			step: .25,
			value: 1,
			format: (v) => `${v}×`
		},
		{
			key: "cover",
			label: "Cloud cover",
			type: "range",
			min: 0,
			max: 100,
			step: 5,
			value: 35,
			format: (v) => `${v}%`
		},
		{
			key: "shadows",
			label: "Cloud shadows",
			type: "toggle",
			value: true
		}
	]
};
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = /* @__PURE__ */ (function detectScriptRel() {
	const relList = typeof document !== "undefined" && document.createElement("link").relList;
	return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
})();
var assetsURL = function(dep, importerUrl) {
	return new URL(dep, importerUrl).href;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					link.addEventListener("load", res);
					link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region src/shell/backgrounds/index.js
var loaders = {
	matrix: () => __vitePreload(() => import("./matrix-DNxVhnbq.js"), __vite__mapDeps([0,1]), import.meta.url),
	substrate: () => __vitePreload(() => import("./substrate-DEMyPSBS.js"), [], import.meta.url),
	truchet: () => __vitePreload(() => import("./truchet-CIYCrSUa.js"), [], import.meta.url),
	phosphor: () => __vitePreload(() => import("./phosphor-Cf7VG63j.js"), [], import.meta.url),
	hill: () => __vitePreload(() => import("./hill-PYrNdJ2p.js"), [], import.meta.url)
};
var themeBackgrounds = {
	classic: "hill",
	matrix: "matrix",
	nord: "substrate",
	solarized: "truchet",
	"solarized-phosphor": "phosphor"
};
var backgroundFor = (theme) => themeBackgrounds[theme] || null;
var optionsOf = (id) => [{
	key: "animated",
	label: "Animated",
	type: "toggle",
	value: meta_exports[id].animated ?? true
}, ...meta_exports[id].options];
var defaults = (id) => Object.fromEntries(optionsOf(id).map((option) => [option.key, option.value]));
var clean = (option, value) => {
	if (option.type === "toggle") return typeof value === "boolean" ? value : option.value;
	if (option.type === "select") return option.choices.some(([choice]) => choice === value) ? value : option.value;
	const number = Number(value);
	if (value === null || value === "" || !Number.isFinite(number)) return option.value;
	return Math.min(option.max, Math.max(option.min, number));
};
var loadSettings = () => {
	let stored = {};
	try {
		stored = JSON.parse(load("backgrounds")) || {};
	} catch {}
	return Object.fromEntries(Object.keys(meta_exports).map((id) => [id, Object.fromEntries(optionsOf(id).map((option) => [option.key, clean(option, stored[id]?.[option.key])]))]));
};
var saveSettings = (settings) => save("backgrounds", JSON.stringify(settings));
var settings = loadSettings();
var instances = {};
var refresh = () => {};
var configure = (id, values) => {
	settings = {
		...settings,
		[id]: values
	};
	instances[id]?.configure(values);
	refresh(id);
};
var startBackgrounds = () => {
	const root = document.documentElement;
	const canvas = document.createElement("canvas");
	canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:none";
	document.body.prepend(canvas);
	const context = canvas.getContext("2d");
	let active = null;
	let mode = null;
	let frame = null;
	const loop = (now) => {
		frame = requestAnimationFrame(loop);
		instances[active].frame(now);
	};
	const settle = (now) => {
		if (!instances[active].still(now)) frame = requestAnimationFrame(settle);
	};
	const resize = () => {
		const { ratio, filter } = meta_exports[active];
		const pixels = window.devicePixelRatio || 1;
		const scale = ratio(pixels, settings[active]);
		canvas.width = Math.round(innerWidth * scale);
		canvas.height = Math.round(innerHeight * scale);
		canvas.style.filter = filter ? filter(pixels) : "none";
		instances[active].resize(canvas.width, canvas.height, scale);
	};
	const start = () => {
		cancelAnimationFrame(frame);
		if (mode === "wallpaper" || !instances[active]) return;
		resize();
		if (!root.dataset.boss) frame = requestAnimationFrame(mode === "animated" ? loop : settle);
	};
	const cover = () => {
		cancelAnimationFrame(frame);
		if (root.dataset.boss || !instances[active] || mode === "wallpaper") return;
		frame = requestAnimationFrame(mode === "animated" ? loop : settle);
	};
	const watchPixels = () => {
		matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`).addEventListener("change", () => {
			if (active) start();
			watchPixels();
		}, { once: true });
	};
	const update = (changed) => {
		const id = backgroundFor(root.dataset.theme);
		const still = meta_exports[id]?.wallpaper ? "wallpaper" : "still";
		const next = id && (settings[id].animated ? "animated" : still);
		if (next) root.dataset.background = next;
		else delete root.dataset.background;
		if (id === active && next === mode && changed !== id) return;
		cancelAnimationFrame(frame);
		active = id;
		mode = next;
		canvas.style.display = id && mode !== "wallpaper" ? "block" : "none";
		if (!id || mode === "wallpaper") return;
		if (instances[id]) return start();
		loaders[id]().then((loaded) => {
			instances[id] ??= loaded.default.create(context, settings[id]);
			if (active === id) start();
		}).catch(() => {
			if (active !== id) return;
			canvas.style.display = "none";
			root.dataset.background = "wallpaper";
		});
	};
	refresh = update;
	new MutationObserver(() => update()).observe(root, {
		attributes: true,
		attributeFilter: ["data-theme"]
	});
	new MutationObserver(cover).observe(root, {
		attributes: true,
		attributeFilter: ["data-boss"]
	});
	window.addEventListener("resize", () => active && start());
	watchPixels();
	update();
};
//#endregion
//#region src/shell/BackgroundSettings.jsx
var Control = ({ option, value, onChange }) => {
	if (option.type === "toggle") return /* @__PURE__ */ h("input", {
		type: "checkbox",
		class: BackgroundSettings_module_default.check,
		checked: value,
		onchange: (event) => onChange(event.target.checked)
	});
	if (option.type === "select") return /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.frame }, /* @__PURE__ */ h("select", {
		class: BackgroundSettings_module_default.select,
		onchange: (event) => onChange(event.target.value)
	}, option.choices.map(([choice, name]) => /* @__PURE__ */ h("option", {
		value: choice,
		selected: choice === value
	}, name))));
	return /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.range }, /* @__PURE__ */ h("input", {
		type: "range",
		class: BackgroundSettings_module_default.slider,
		min: option.min,
		max: option.max,
		step: option.step,
		value,
		oninput: (event) => onChange(Number(event.target.value))
	}), /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.value }, option.format ? option.format(value) : value));
};
var opacityOption = {
	type: "range",
	min: 0,
	max: 100,
	step: 5,
	format: (value) => `${value}%`
};
var BackgroundSettings = ({ key, state, actions }) => {
	const background = state.id && meta_exports[state.id];
	return /* @__PURE__ */ h(Overlay, {
		key,
		onKeyDown: (event) => event.keyCode === 27 && actions.toggleBackgroundSettings()
	}, /* @__PURE__ */ h(Dialog, {
		title: background ? `${background.name} Settings` : "Window Settings",
		onClose: actions.toggleBackgroundSettings
	}, /* @__PURE__ */ h("form", {
		class: BackgroundSettings_module_default.root,
		autocomplete: "off",
		onsubmit: actions.submitBackgroundSettings
	}, state.opacity !== void 0 && /* @__PURE__ */ h("label", { class: BackgroundSettings_module_default.row }, /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.name }, "Window:"), /* @__PURE__ */ h(Control, {
		option: opacityOption,
		value: state.opacity,
		onChange: actions.changeOpacity
	})), (state.id ? optionsOf(state.id) : []).map((option) => /* @__PURE__ */ h("label", { class: BackgroundSettings_module_default.row }, /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.name }, option.label, ":"), /* @__PURE__ */ h(Control, {
		option,
		value: state.draft[option.key],
		onChange: (value) => actions.changeBackgroundSettings({ [option.key]: value })
	}))), background && /* @__PURE__ */ h("p", { class: BackgroundSettings_module_default.credit }, background.credit), /* @__PURE__ */ h("div", { class: BackgroundSettings_module_default.footer }, /* @__PURE__ */ h(Button, { onCreate: (el) => el.focus() }, /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.button }, "OK")), /* @__PURE__ */ h(Button, {
		type: "button",
		onClick: actions.toggleBackgroundSettings
	}, /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.button }, "Cancel")), /* @__PURE__ */ h(Button, {
		type: "button",
		onClick: actions.resetBackgroundSettings
	}, /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.button }, "Defaults"))))));
};
//#endregion
//#region src/shell/classes.js
var cx = (...names) => names.filter(Boolean).join(" ");
var Boss_module_default = {
	root: "Boss_root",
	header: "Boss_header",
	title: "Boss_title",
	menus: "Boss_menus",
	formula: "Boss_formula",
	ref: "Boss_ref",
	fx: "Boss_fx",
	grid: "Boss_grid",
	table: "Boss_table",
	corner: "Boss_corner",
	number: "Boss_number",
	figure: "Boss_figure",
	negative: "Boss_negative",
	total: "Boss_total",
	selected: "Boss_selected",
	footer: "Boss_footer",
	tabs: "Boss_tabs",
	tab: "Boss_tab",
	tabActive: "Boss_tabActive Boss_tab",
	status: "Boss_status",
	exit: "Boss_exit"
};
//#endregion
//#region src/shell/Boss.jsx
var departments = [
	"Engineering",
	"Sales",
	"Marketing",
	"Customer support",
	"Operations",
	"Finance",
	"People",
	"Facilities",
	"IT",
	"Legal"
];
var headings = [
	"Department",
	"Jul",
	"Aug",
	"Sep",
	"Q3 total",
	"Budget",
	"Variance",
	"% of budget"
];
var columns = "ABCDEFGHIJKLMN".split("");
var icon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' rx='2' fill='%232b6cb0'/%3E%3Cpath d='M3 5.5h10M3 8.5h10M3 11.5h10M6.5 3v10M10 3v10' stroke='%23fff'/%3E%3C/svg%3E";
var makeSheet = () => ({ rows: departments.map((name) => {
	const base = 2e4 + Math.random() * 18e4;
	const spend = [
		0,
		1,
		2
	].map(() => Math.round(base * (.9 + Math.random() * .2)));
	const total = spend[0] + spend[1] + spend[2];
	const budget = Math.round(total * (.92 + Math.random() * .16) / 1e3) * 1e3;
	return [
		name,
		...spend,
		total,
		budget,
		budget - total
	];
}) });
var money = (n) => n < 0 ? `(${(-n).toLocaleString()})` : n.toLocaleString();
var Row = ({ number, cells, total }) => /* @__PURE__ */ h("tr", { class: total ? Boss_module_default.total : null }, /* @__PURE__ */ h("th", { class: Boss_module_default.number }, number), columns.map((_, i) => {
	const value = cells && cells[i];
	const negative = typeof value === "number" && value < 0 && i === 6;
	return /* @__PURE__ */ h("td", { class: cx(i > 0 && Boss_module_default.figure, negative && Boss_module_default.negative, total && i === 4 && Boss_module_default.selected) }, typeof value === "number" ? money(value) : value);
}));
var saved = null;
var cover = (el) => {
	const link = document.querySelector("link[rel~=\"icon\"]");
	saved = {
		title: document.title,
		href: link && link.getAttribute("href")
	};
	document.title = "Q3 budget";
	if (link) link.setAttribute("href", icon);
	document.documentElement.dataset.boss = "true";
	el.focus();
};
var uncover = () => {
	const link = document.querySelector("link[rel~=\"icon\"]");
	document.title = saved.title;
	if (link && saved.href) link.setAttribute("href", saved.href);
	delete document.documentElement.dataset.boss;
};
var Boss = ({ key, state, actions }) => {
	const sums = [
		1,
		2,
		3,
		4,
		5,
		6
	].map((i) => state.rows.reduce((sum, row) => sum + row[i], 0));
	const percent = (row) => `${(row[4] / row[5] * 100).toFixed(1)}%`;
	const rows = [
		headings,
		...state.rows.map((row) => [...row, percent(row)]),
		[
			"Total",
			...sums,
			percent([0, ...sums])
		]
	];
	return /* @__PURE__ */ h("section", {
		key,
		class: Boss_module_default.root,
		tabindex: -1,
		oncreate: cover,
		ondestroy: uncover
	}, /* @__PURE__ */ h("header", { class: Boss_module_default.header }, /* @__PURE__ */ h("button", {
		type: "button",
		class: Boss_module_default.title,
		onclick: () => actions.boss()
	}, "Q3 budget"), /* @__PURE__ */ h("nav", { class: Boss_module_default.menus }, [
		"File",
		"Edit",
		"View",
		"Insert",
		"Format",
		"Data",
		"Tools",
		"Help"
	].map((name) => /* @__PURE__ */ h("span", null, name)))), /* @__PURE__ */ h("div", { class: Boss_module_default.formula }, /* @__PURE__ */ h("span", { class: Boss_module_default.ref }, "E", rows.length), /* @__PURE__ */ h("span", { class: Boss_module_default.fx }, "fx"), /* @__PURE__ */ h("span", null, "=SUM(E2:E", rows.length - 1, ")")), /* @__PURE__ */ h("div", { class: Boss_module_default.grid }, /* @__PURE__ */ h("table", { class: Boss_module_default.table }, /* @__PURE__ */ h("thead", null, /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("th", { class: Boss_module_default.corner }), columns.map((c) => /* @__PURE__ */ h("th", null, c)))), /* @__PURE__ */ h("tbody", null, Array.from({ length: 60 }, (_, i) => /* @__PURE__ */ h(Row, {
		number: i + 1,
		cells: rows[i],
		total: i === rows.length - 1
	}))))), /* @__PURE__ */ h("footer", { class: Boss_module_default.footer }, /* @__PURE__ */ h("div", { class: Boss_module_default.tabs }, /* @__PURE__ */ h("span", { class: Boss_module_default.tab }, "Summary"), /* @__PURE__ */ h("span", { class: Boss_module_default.tabActive }, "Departments"), /* @__PURE__ */ h("span", { class: Boss_module_default.tab }, "Assumptions")), /* @__PURE__ */ h("div", { class: Boss_module_default.status }, /* @__PURE__ */ h("span", null, "Ready"), /* @__PURE__ */ h("span", null, "Sum: ", money(sums[3])), /* @__PURE__ */ h("button", {
		type: "button",
		class: Boss_module_default.exit,
		onclick: () => actions.boss()
	}, "100%"))));
};
var Taskbar_module_default = {
	root: "Taskbar_root",
	button: "Taskbar_button",
	pressed: "Taskbar_pressed Taskbar_button",
	start: "Taskbar_start",
	startLabel: "Taskbar_startLabel",
	avatar: "Taskbar_avatar",
	tasks: "Taskbar_tasks",
	task: "Taskbar_task Taskbar_button",
	taskPressed: "Taskbar_taskPressed Taskbar_pressed Taskbar_button",
	name: "Taskbar_name",
	tray: "Taskbar_tray",
	boss: "Taskbar_boss Taskbar_button",
	clock: "Taskbar_clock",
	menu: "Taskbar_menu",
	banner: "Taskbar_banner",
	list: "Taskbar_list",
	item: "Taskbar_item",
	itemIcon: "Taskbar_itemIcon",
	separator: "Taskbar_separator"
};
var Menu_module_default = {
	root: "Menu_root",
	column: "Menu_column",
	columnActive: "Menu_columnActive Menu_column",
	button: "Menu_button",
	menu: "Menu_menu",
	item: "Menu_item",
	list: "Menu_list",
	option: "Menu_option",
	hotKey: "Menu_hotKey",
	check: "Menu_check",
	separator: "Menu_separator"
};
//#endregion
//#region src/shell/themes.js
var themes = [
	["classic", "Classic"],
	["synthwave", "Synthwave"],
	["solarized", "Solarized Truchet"],
	["solarized-phosphor", "Solarized Phosphor"],
	["matrix", "Matrix"],
	["nord", "Nord"]
];
//#endregion
//#region src/shell/backup.js
var plain = [
	"theme",
	"scale",
	"maximised",
	"backgrounds",
	"windowOpacity",
	"windowHidden",
	"fireworks",
	"lastGame",
	"losses",
	"level",
	"safeStart",
	"noGuess",
	"marks",
	"timer",
	"savedGame",
	"savedGame.shelf",
	"windowCard"
];
var ours = (key) => plain.includes(key) || /^(minesweeper|takuzu|nonograms|sudoku|2048)\./.test(key) || /^(beginner|intermediate|expert|extreme)(Hints)?(Name)?$/.test(key);
var exportData = (now = /* @__PURE__ */ new Date()) => JSON.stringify({
	app: "puzzlesplus",
	version: 1,
	saved: now.toISOString(),
	data: Object.fromEntries(keys().filter(ours).map((key) => [key, load(key)]))
});
var readBackup = (text) => {
	try {
		const { app, version, data } = JSON.parse(text);
		if (app !== "puzzlesplus" || version !== 1 || !data || typeof data !== "object") return null;
		const entries = Object.entries(data).filter(([key, value]) => ours(key) && typeof value === "string");
		return entries.length ? entries : null;
	} catch {
		return null;
	}
};
var importData = (text) => {
	const entries = readBackup(text);
	if (!entries) return false;
	keys().filter(ours).forEach(remove);
	entries.forEach(([key, value]) => save(key, value));
	freeze();
	return true;
};
//#endregion
//#region src/shell/share.js
var SITE = "https://fexofenadine.github.io/puzzlesplus/";
var pack = (values, base) => {
	let all = 0n;
	for (const value of values) all = all * BigInt(base) + BigInt(value);
	return all.toString(36);
};
var unpack = (text, count, base) => {
	if (!/^[0-9a-z]+$/.test(text)) return null;
	let all = 0n;
	for (const letter of text) all = all * 36n + BigInt(parseInt(letter, 36));
	const values = new Array(count);
	for (let i = count - 1; i >= 0; i--) {
		values[i] = Number(all % BigInt(base));
		all /= BigInt(base);
	}
	return all === 0n ? values : null;
};
var codeOf = (n, level, values, base) => `${n}.${level}.${pack(values, base)}`;
var partsOf = (code, base, check) => {
	const [size, grade, data, ...rest] = code.split(".");
	const n = Number(size);
	const level = Number(grade);
	if (rest.length || !data || !check(n, level)) return null;
	const values = unpack(data, n * n, base);
	return values && {
		n,
		level,
		values
	};
};
var linkOf = (page, code) => {
	const { protocol, hostname, origin, pathname } = location;
	return `${/^https?:$/.test(protocol) && hostname !== "localhost" && hostname !== "127.0.0.1" ? origin + pathname : `${SITE}${page}/`}#play=${code}`;
};
var sharedCode = () => {
	const found = /^#play=([\w.]+)$/.exec(location.hash);
	if (!found) return null;
	history.replaceState(null, "", location.pathname + location.search);
	return found[1];
};
var copy = async (text) => {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
};
//#endregion
//#region src/shell/actions.js
var loadGlass = () => {
	const saved = load("windowOpacity");
	const opacity = Number(saved);
	return {
		opacity: saved && opacity >= 0 && opacity <= 100 ? opacity : 100,
		hidden: Boolean(load("windowHidden"))
	};
};
var windowClear = ({ glass, backgroundSettings }) => {
	const opacity = glass.hidden ? 0 : backgroundSettings && backgroundSettings.opacity !== void 0 ? backgroundSettings.opacity : glass.opacity;
	return opacity < 100 ? opacity : null;
};
var isGame = (page) => games.some(([id]) => id === page);
var loadTheme = () => {
	const theme = load("theme");
	return themes.some(([id]) => id === theme) ? theme : "classic";
};
var remember = (page) => {
	if (isGame(page)) save("lastGame", page);
	return page;
};
var shellState = (page, root = "../") => ({
	page: remember(page),
	root,
	menu: null,
	windowState: "open",
	openGames: null,
	switching: null,
	theme: loadTheme(),
	boss: null,
	backgrounds: loadSettings(),
	backgroundSettings: null,
	glass: loadGlass(),
	fireworks: load("fireworks") !== "off",
	howTo: false,
	about: false,
	share: null,
	backup: null,
	zoom: {
		chosen: loadZoom(),
		scale: loadZoom(),
		seen: null,
		maximised: loadMaximised()
	},
	portrait: Boolean(window.matchMedia && matchMedia("(orientation: portrait)").matches)
});
var listen = (actions) => {
	const away = () => {
		actions.pause(true);
		if (actions.keepGame) actions.keepGame();
	};
	document.addEventListener("visibilitychange", () => document.hidden && away());
	window.addEventListener("pagehide", away);
	window.addEventListener("blur", () => actions.pause(true));
	if (window.matchMedia) matchMedia("(orientation: portrait)").addEventListener("change", (event) => actions.setPortrait(event.matches));
};
var typing = (event) => [
	"INPUT",
	"SELECT",
	"TEXTAREA"
].includes(event.target.tagName);
var shortcut = (event, state, actions) => {
	if (typing(event) || event.ctrlKey || event.metaKey || event.altKey) return null;
	if (event.keyCode === 27) {
		if (state.menu) actions.closeMenu();
		else actions.boss();
		return null;
	}
	if (state.boss || state.windowState !== "open" || dialogOpen()) return null;
	const zoom = {
		"+": 1,
		"=": 1,
		"-": -1
	}[event.key];
	if (zoom) {
		actions.zoom(zoom);
		return null;
	}
	return event.keyCode;
};
var gameKey = (key, actions) => {
	if (key === 113 || key === 78) actions.newGame();
	else if (key === 72) actions.hint();
	else if (key === 80) actions.pause();
	else return false;
	return true;
};
var modified = (event, state) => (event.ctrlKey || event.metaKey) && !event.altKey && !typing(event) && !state.boss && state.windowState === "open" && !dialogOpen();
var undoKey = (event, state) => modified(event, state) && event.keyCode === 90 && !event.shiftKey;
var redoKey = (event, state) => modified(event, state) && (event.keyCode === 89 || event.keyCode === 90 && event.shiftKey);
var historyKey = (event, state, actions) => {
	const step = undoKey(event, state) ? actions.undo : redoKey(event, state) ? actions.redo : null;
	if (!step) return false;
	event.preventDefault();
	step();
	return true;
};
var prevent = (event) => {
	event.preventDefault();
	return false;
};
var toggleAction = (name, key, on, off = "") => () => (state) => {
	save(key, state[name] ? off : on);
	return {
		menu: null,
		[name]: !state[name]
	};
};
var shareAction = (code) => () => (state, actions) => {
	if (state.game.dealing) return { menu: null };
	const link = linkOf(state.page, code(state.game));
	copy(link).then(actions.shareCopied);
	return {
		menu: null,
		share: {
			link,
			copied: false
		}
	};
};
var shellActions = {
	closeShare: () => ({ share: null }),
	shareCopied: (copied) => ({ share }) => share && { share: {
		...share,
		copied
	} },
	copyShare: () => ({ share }, actions) => {
		copy(share.link).then(actions.shareCopied);
	},
	toggleBackup: () => ({ backup }, actions) => {
		if (!backup && actions.keepGame) actions.keepGame();
		return {
			menu: null,
			backup: backup ? null : {
				text: "",
				note: "",
				pending: null
			}
		};
	},
	changeBackup: (values) => ({ backup }) => backup && { backup: {
		...backup,
		...values
	} },
	restoreBackup: () => ({ backup }) => {
		if (importData(backup.pending)) location.reload();
		else return { backup: {
			...backup,
			pending: null,
			note: "That is not a Puzzles Plus backup."
		} };
	},
	closeMenu: () => ({ menu: null }),
	toggleStart: () => ({ menu }) => ({ menu: menu && menu.start ? null : { start: true } }),
	minimise: () => (state, actions) => {
		actions.pause(true);
		return {
			menu: null,
			windowState: "minimised"
		};
	},
	close: () => (state, actions) => {
		actions.closeGame();
	},
	finishClose: () => (state, actions) => {
		actions.reset();
		return {
			menu: null,
			windowState: "closed",
			openGames: state.page
		};
	},
	selectGame: (openGames) => ({ openGames }),
	openGame: (id) => (state) => {
		if (id !== state.page) {
			location.assign(`${state.root}${id}/`);
			return { menu: null };
		}
		return {
			menu: null,
			openGames: null,
			windowState: "open"
		};
	},
	taskbarGame: (id) => (state, actions) => {
		if (id === state.page && state.windowState === "open") return actions.minimise();
		return actions.openGame(id);
	},
	setPortrait: (portrait) => ({ portrait }),
	toggleHowTo: () => ({ howTo }) => ({
		menu: null,
		howTo: !howTo
	}),
	toggleAbout: () => ({ about }) => ({
		menu: null,
		about: !about
	}),
	boss: () => ({ boss }, actions) => {
		if (boss) return { boss: null };
		actions.pause(true);
		return {
			menu: null,
			boss: makeSheet()
		};
	},
	toggleBackgroundSettings: () => ({ page, theme, backgrounds, backgroundSettings, glass }) => {
		if (backgroundSettings) {
			if (backgroundSettings.id) configure(backgroundSettings.id, backgrounds[backgroundSettings.id]);
			return { backgroundSettings: null };
		}
		const id = backgroundFor(theme);
		const opacity = isGame(page) ? glass.opacity : void 0;
		if (!id && opacity === void 0) return { menu: null };
		return {
			menu: null,
			backgroundSettings: {
				id,
				draft: id ? { ...backgrounds[id] } : {},
				opacity
			}
		};
	},
	changeBackgroundSettings: (values) => ({ backgroundSettings }) => {
		const draft = {
			...backgroundSettings.draft,
			...values
		};
		if (backgroundSettings.id) configure(backgroundSettings.id, draft);
		return { backgroundSettings: {
			...backgroundSettings,
			draft
		} };
	},
	changeOpacity: (opacity) => ({ backgroundSettings }) => ({ backgroundSettings: {
		...backgroundSettings,
		opacity
	} }),
	resetBackgroundSettings: () => (state, actions) => {
		const { id, opacity } = state.backgroundSettings;
		if (opacity !== void 0) actions.changeOpacity(100);
		if (id) actions.changeBackgroundSettings(defaults(id));
	},
	submitBackgroundSettings: (event) => ({ backgrounds, backgroundSettings: { id, draft, opacity }, glass }) => {
		event.preventDefault();
		const next = id ? {
			...backgrounds,
			[id]: draft
		} : backgrounds;
		if (id) saveSettings(next);
		if (opacity !== void 0) save("windowOpacity", opacity === 100 ? "" : opacity);
		return {
			backgrounds: next,
			backgroundSettings: null,
			glass: opacity === void 0 ? glass : {
				...glass,
				opacity
			}
		};
	},
	toggleHideWindow: () => ({ glass }) => {
		save("windowHidden", glass.hidden ? "" : "yes");
		return {
			menu: null,
			glass: {
				...glass,
				hidden: !glass.hidden
			}
		};
	},
	toggleFireworks: () => ({ fireworks }) => {
		save("fireworks", fireworks ? "off" : "");
		return {
			menu: null,
			fireworks: !fireworks
		};
	},
	setOpacity: (opacity) => ({ glass }) => {
		save("windowOpacity", opacity === 100 ? "" : opacity);
		return { glass: {
			...glass,
			opacity
		} };
	},
	fit: () => ({ zoom }) => {
		const { fit, size } = measureFit();
		if (!size || sameSize(size, zoom.seen)) return null;
		const scale = zoom.maximised ? maxZoom(fit) : fitZoom(zoom.chosen, fit);
		applyZoom(scale);
		return { zoom: {
			...zoom,
			scale,
			seen: size
		} };
	},
	maximise: () => ({ zoom }) => {
		const maximised = !zoom.maximised;
		const { fit, size } = measureFit();
		const scale = maximised ? maxZoom(fit) : fitZoom(zoom.chosen, fit);
		if (!Number.isFinite(scale)) return { menu: null };
		saveMaximised(maximised);
		applyZoom(scale);
		return {
			menu: null,
			zoom: {
				...zoom,
				maximised,
				scale,
				seen: size
			}
		};
	},
	zoom: (direction) => ({ zoom }) => {
		const { fit, size } = measureFit();
		const chosen = direction ? stepZoom(zoom.scale, direction) : 1;
		const scale = direction ? chosen : fitZoom(chosen, fit);
		saveZoom(chosen);
		saveMaximised(false);
		applyZoom(scale);
		return {
			menu: null,
			zoom: {
				chosen,
				scale,
				seen: size,
				maximised: false
			}
		};
	},
	setTheme: (theme) => () => {
		save("theme", theme);
		document.documentElement.dataset.theme = theme;
		return {
			menu: null,
			theme
		};
	},
	toggleMenu: (event) => ({ menu }) => {
		const { name } = event.currentTarget.dataset;
		if (event.type === "click") return { menu: menu && menu[name] ? null : { [name]: true } };
		if (event.type === "mouseenter") return menu ? { menu: { [name]: true } } : null;
		if (event.type === "focusout" && !event.currentTarget.contains(event.relatedTarget)) return { menu: null };
		return null;
	}
};
//#endregion
//#region src/shell/ThemeMenu.jsx
var ThemeMenu = ({ state, actions }, children) => /* @__PURE__ */ h(MenuItem, {
	name: "Theme",
	type: "theme",
	active: state.menu,
	onChange: actions.toggleMenu
}, themes.map(([theme, name]) => /* @__PURE__ */ h(SubMenuItem, {
	name,
	checked: state.theme === theme,
	onClick: () => actions.setTheme(theme)
})), (backgroundFor(state.theme) || isGame(state.page)) && /* @__PURE__ */ h(Separator, null), backgroundFor(state.theme) ? /* @__PURE__ */ h(SubMenuItem, {
	name: "Background Settings...",
	onClick: actions.toggleBackgroundSettings
}) : isGame(state.page) && /* @__PURE__ */ h(SubMenuItem, {
	name: "Window Settings...",
	onClick: actions.toggleBackgroundSettings
}), isGame(state.page) && /* @__PURE__ */ h(SubMenuItem, {
	name: "Hide Window",
	checked: state.glass.hidden,
	onClick: actions.toggleHideWindow
}), isGame(state.page) && /* @__PURE__ */ h(SubMenuItem, {
	name: "Fireworks",
	checked: state.fireworks,
	onClick: actions.toggleFireworks
}), children);
//#endregion
//#region src/shell/ViewMenu.jsx
var ViewMenu = ({ state, actions }) => {
	const { scale, maximised } = state.zoom;
	return /* @__PURE__ */ h(MenuItem, {
		name: "View",
		type: "view",
		active: state.menu,
		onChange: actions.toggleMenu
	}, /* @__PURE__ */ h(SubMenuItem, {
		name: "Zoom In",
		hotKey: "+",
		disabled: scale >= steps[steps.length - 1],
		onClick: () => actions.zoom(1)
	}), /* @__PURE__ */ h(SubMenuItem, {
		name: "Zoom Out",
		hotKey: "-",
		disabled: scale <= steps[0],
		onClick: () => actions.zoom(-1)
	}), /* @__PURE__ */ h(SubMenuItem, {
		name: "Actual Size",
		checked: !maximised && scale === 1,
		onClick: () => actions.zoom(0)
	}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
		name: "Maximise",
		checked: maximised,
		onClick: () => actions.maximise()
	}));
};
//#endregion
//#region src/shell/ResumeItems.jsx
var clockText = (ms) => {
	const total = Math.floor(ms / 1e3);
	return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};
var resumeItems = ({ shelf }, actions) => shelf.length ? [...shelf.map(({ id, label, elapsed }) => /* @__PURE__ */ h(SubMenuItem, {
	name: `Resume ${label} ${clockText(elapsed)}`,
	onClick: () => actions.resumeGame(id)
})), /* @__PURE__ */ h(Separator, null)] : null;
//#endregion
//#region src/shell/GameMenus.jsx
var SizeMenu = ({ state, actions, sizes }) => /* @__PURE__ */ h(MenuItem, {
	name: "Size",
	type: "size",
	active: state.menu,
	onChange: actions.toggleMenu
}, sizes.map((n) => /* @__PURE__ */ h(SubMenuItem, {
	name: `${n} × ${n}`,
	checked: state.game.n === n,
	onClick: () => actions.newGame({ n })
})));
var HelpMenu = ({ state, actions, name }) => /* @__PURE__ */ h(MenuItem, {
	name: "Help",
	type: "help",
	active: state.menu,
	onChange: actions.toggleMenu
}, /* @__PURE__ */ h(SubMenuItem, {
	name: "How to Play...",
	onClick: actions.toggleHowTo
}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: `About ${name}...`,
	onClick: actions.toggleAbout
}));
//#endregion
//#region src/Menu.jsx
var SubMenuItem = ({ key, name, hotKey, checked, disabled, onClick }, children) => /* @__PURE__ */ h("li", {
	key,
	class: Menu_module_default.item
}, /* @__PURE__ */ h("button", {
	type: "button",
	class: Menu_module_default.option,
	tabindex: -1,
	disabled,
	onclick: onClick
}, checked && /* @__PURE__ */ h("svg", {
	class: Menu_module_default.check,
	width: "7",
	height: "7"
}, /* @__PURE__ */ h("path", { d: "M0 4.5L2.5 7 7 2.5V0L2.5 4.5 0 2v2.5z" })), name, hotKey && /* @__PURE__ */ h("span", { class: Menu_module_default.hotKey }, hotKey)), children.length > 0 && /* @__PURE__ */ h("div", { class: Menu_module_default.menu }, /* @__PURE__ */ h("ul", { class: Menu_module_default.list }, children)));
var MenuItem = ({ key, name, type, active, onChange }, children) => /* @__PURE__ */ h("li", {
	key,
	class: active && active[type] ? Menu_module_default.columnActive : Menu_module_default.column
}, /* @__PURE__ */ h("button", {
	type: "button",
	class: Menu_module_default.button,
	tabindex: -1,
	"data-name": type,
	onclick: onChange,
	onmouseenter: onChange
}, name), children.length > 0 && /* @__PURE__ */ h("div", { class: Menu_module_default.menu }, /* @__PURE__ */ h("ul", { class: Menu_module_default.list }, children)));
var Separator = () => /* @__PURE__ */ h("li", { class: Menu_module_default.separator });
var Menu = ({ state, actions }) => /* @__PURE__ */ h("ul", {
	class: Menu_module_default.root,
	tabindex: -1,
	onfocusout: actions.toggleMenu
}, /* @__PURE__ */ h(MenuItem, {
	name: "Game",
	type: "game",
	active: state.menu,
	onChange: actions.toggleMenu
}, /* @__PURE__ */ h(SubMenuItem, {
	name: "New",
	hotKey: "F2",
	onClick: () => actions.newGame()
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Hint",
	hotKey: "H",
	onClick: () => actions.hint()
}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: "Beginner",
	checked: state.game.level === "beginner",
	onClick: () => actions.newGame({ level: "beginner" })
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Intermediate",
	checked: state.game.level === "intermediate",
	onClick: () => actions.newGame({ level: "intermediate" })
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Expert",
	checked: state.game.level === "expert",
	onClick: () => actions.newGame({ level: "expert" })
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Extreme",
	checked: state.game.level === "extreme",
	onClick: () => actions.newGame({ level: "extreme" })
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Custom...",
	checked: state.game.level === "custom",
	onClick: actions.toggleCustomField
}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: "Marks (?)",
	checked: state.marks,
	onClick: actions.toggleMarks
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Safe First Click",
	checked: state.safeStart || state.noGuess,
	onClick: actions.toggleSafeStart
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "No Guessing",
	checked: state.noGuess,
	onClick: actions.toggleNoGuess
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Timer",
	checked: state.timer,
	onClick: actions.toggleTimer
}), state.theme !== "classic" && /* @__PURE__ */ h(SubMenuItem, {
	name: "Track Losses",
	checked: state.trackLosses,
	onClick: actions.toggleTrackLosses
}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: "Best Times...",
	onClick: actions.toggleBestTime
}), /* @__PURE__ */ h(Separator, null), resumeItems(state, actions), gameLinks("minesweeper")), /* @__PURE__ */ h(ViewMenu, {
	state,
	actions
}), /* @__PURE__ */ h(ThemeMenu, {
	state,
	actions
}), /* @__PURE__ */ h(HelpMenu, {
	state,
	actions,
	name: "Minesweeper Plus"
}));
//#endregion
//#region src/shell/GameLinks.jsx
var games = [
	["minesweeper", "Minesweeper"],
	["takuzu", "Takuzu"],
	["nonograms", "Nonograms"],
	["sudoku", "Sudoku"],
	["2048", "2048"]
];
var gameLinks = (current) => games.map(([id, name]) => /* @__PURE__ */ h(SubMenuItem, {
	name,
	checked: id === current,
	onClick: () => id !== current && location.assign(`../${id}/`)
}));
var Transfer_module_default = {
	root: "Transfer_root",
	row: "Transfer_row",
	button: "Transfer_button",
	field: "Transfer_field",
	note: "Transfer_note",
	file: "Transfer_file",
	footer: "Transfer_footer"
};
//#endregion
//#region src/shell/daily.js
var DAILY_BUDGET = 15e3;
var pad = (value) => String(value).padStart(2, "0");
var dayOf = (date = /* @__PURE__ */ new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
var dayBefore = (day) => {
	const [year, month, date] = day.split("-").map(Number);
	return dayOf(new Date(year, month - 1, date - 1));
};
var seedOf = (day, prefix) => {
	let hash = 2166136261;
	for (const letter of `${prefix} ${day}`) hash = Math.imul(hash ^ letter.charCodeAt(0), 16777619);
	return hash >>> 0;
};
var keyOf = (prefix) => `${prefix}.daily`;
var read = (prefix) => {
	let saved = null;
	try {
		saved = JSON.parse(load(keyOf(prefix)));
	} catch {}
	const count = (value) => Math.max(0, parseInt(value, 10) || 0);
	return {
		last: saved && /^\d{4}-\d\d-\d\d$/.test(saved.last) ? saved.last : "",
		streak: count(saved && saved.streak),
		best: count(saved && saved.best),
		time: count(saved && saved.time),
		fastest: count(saved && saved.fastest)
	};
};
var readDaily = (prefix, today = dayOf()) => {
	const { last, streak, best, time, fastest } = read(prefix);
	const done = last === today;
	const alive = done || last === dayBefore(today);
	return {
		done,
		time: done ? time : 0,
		streak: alive ? streak : 0,
		best,
		fastest
	};
};
var solveDaily = (prefix, day, time = 0) => {
	const { last, streak, best, fastest } = read(prefix);
	if (last >= day) return;
	const next = last === dayBefore(day) ? streak + 1 : 1;
	save(keyOf(prefix), JSON.stringify({
		last: day,
		streak: next,
		best: Math.max(best, next),
		time,
		fastest: time && (!fastest || time < fastest) ? time : fastest
	}));
};
var clearDaily = (prefix) => {
	remove(keyOf(prefix));
	return readDaily(prefix);
};
var special = (game) => Boolean(game.daily || game.shared);
var finish = (prefix, state, game, actions, record = (won) => actions.win(won)) => {
	const counts = state.timer && !game.untimed;
	if (game.daily) {
		solveDaily(prefix, game.daily, counts && !game.hinted ? game.time : 0);
		actions.toggleBestTime();
	} else if (counts && !game.shared) record(game, actions);
};
//#endregion
//#region src/shell/BackupBox.jsx
var download = (name, text) => {
	const link = document.createElement("a");
	link.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
	link.download = name;
	link.click();
	setTimeout(() => URL.revokeObjectURL(link.href), 1e3);
};
var offer = (actions, text) => {
	const entries = readBackup(text);
	actions.changeBackup(entries ? {
		pending: text,
		note: `Replace everything kept here with this backup?`
	} : {
		pending: null,
		note: "That is not a Puzzles Plus backup."
	});
};
var Backup = ({ key, state, actions }) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.toggleBackup()
}, /* @__PURE__ */ h(Dialog, {
	title: "Backup",
	onClose: actions.toggleBackup
}, /* @__PURE__ */ h("div", { class: Transfer_module_default.root }, /* @__PURE__ */ h("p", null, "Everything Puzzles Plus keeps in this browser: settings, best times, statistics and games in progress. Save it as a file, or copy it as text to paste into another browser or the app."), /* @__PURE__ */ h("div", { class: Transfer_module_default.row }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => {
		download(`puzzlesplus-${dayOf()}.json`, exportData());
		actions.changeBackup({
			pending: null,
			note: "Saved as a file."
		});
	}
}, /* @__PURE__ */ h("span", { class: Transfer_module_default.button }, "Save to File")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => {
		const text = exportData();
		actions.changeBackup({
			text,
			pending: null,
			note: ""
		});
		copy(text).then((copied) => actions.changeBackup({ note: copied ? "Copied to the clipboard." : "Select the text below and copy it." }));
	}
}, /* @__PURE__ */ h("span", { class: Transfer_module_default.button }, "Copy as Text"))), /* @__PURE__ */ h("textarea", {
	class: Transfer_module_default.field,
	spellcheck: false,
	placeholder: "Paste a backup's text here to restore it",
	value: state.text,
	oninput: (event) => actions.changeBackup({ text: event.target.value })
}), /* @__PURE__ */ h("div", { class: Transfer_module_default.row }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: (event) => event.currentTarget.nextSibling.click()
}, /* @__PURE__ */ h("span", { class: Transfer_module_default.button }, "Open File...")), /* @__PURE__ */ h("input", {
	class: Transfer_module_default.file,
	type: "file",
	accept: ".json,application/json,text/plain",
	onchange: (event) => {
		const [file] = event.target.files;
		if (file) file.text().then((text) => offer(actions, text));
		event.target.value = "";
	}
}), /* @__PURE__ */ h(Button, {
	type: "button",
	disabled: !state.text.trim(),
	onClick: () => offer(actions, state.text)
}, /* @__PURE__ */ h("span", { class: Transfer_module_default.button }, "Restore from Text"))), /* @__PURE__ */ h("p", { class: Transfer_module_default.note }, state.note), /* @__PURE__ */ h("div", { class: Transfer_module_default.footer }, state.pending && /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.restoreBackup
}, /* @__PURE__ */ h("span", { class: Transfer_module_default.button }, "Restore")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.toggleBackup,
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: Transfer_module_default.button }, state.pending ? "Cancel" : "Close"))))));
//#endregion
//#region src/shell/ShareBox.jsx
var Share = ({ key, state, actions }) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.closeShare()
}, /* @__PURE__ */ h(Dialog, {
	title: "Copy Link",
	onClose: actions.closeShare
}, /* @__PURE__ */ h("div", { class: Transfer_module_default.root }, /* @__PURE__ */ h("p", null, "This link opens the same board, from its start, for anyone. A board from a link keeps no best time."), /* @__PURE__ */ h("input", {
	class: Transfer_module_default.field,
	type: "text",
	readonly: true,
	value: state.link,
	onfocus: (event) => event.target.select()
}), /* @__PURE__ */ h("p", { class: Transfer_module_default.note }, state.copied ? "Copied to the clipboard." : ""), /* @__PURE__ */ h("div", { class: Transfer_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => actions.copyShare()
}, /* @__PURE__ */ h("span", { class: Transfer_module_default.button }, "Copy")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.closeShare,
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: Transfer_module_default.button }, "Close"))))));
//#endregion
//#region src/shell/avatar.png
var avatar_default = new URL("avatar.png", import.meta.url).href;
//#endregion
//#region src/shell/icons/minesweeper.png
var minesweeper_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAHdklEQVR42u2XW4xdVRnHf/t2bnM7M2faaaftTLm2psUWCkgMbbkKqICJToJRMcQH0ICKJiaamIwRE5CIUWO8gMZIfKA+IV6QmBY6YlMEtAMFbKF0hs6tM2fmnDnn7L3uy4dpiUDVsY1v/J/2w177+33f+q/v2wve1WlqaGgo+ukDuzfdccePVp7Jd8LTC74r+tLnv/mTNevLf++M+0av2XHfe04XIPhfXn780T3n9g/2f2p+NtthRbg9l89Fv/3NYY5O1yauu3rd6MxUfY8Q6a++8e2PT54RwNDQUFSdufzu51+a21mbm7nt6afv6qqUy/e1t5Vu1tbERlkO/u04B184ztPPTtASip3vW8WKlR1Y5WQq5C+UWrhn89b1XQdHj39m3zMzI4/vnnkUht3bY8WnArh826fvf+nl9AvHq0F45ZXn/WlgTd9AnETdURKQuBwUYfXaDp7ZP4aWhkPHamht+cD2QXp6CnmtgtuNKd80Oa6SI69nvdNVc1f76uzq5hR7lwXQs6KrbTOlcOOGFey87uwtcRJTKCZEcYR3HqMsxnjiKCaXxKzu72D75YOsXdeNyDRRYmimevXo6CyvjTcZm63HUqpzYJkAi2Lqyxs3bbykb037hT3dbSS5iCiOAE8QBhBBd6XA1ov7OWdjL5W+IoFxzFczROoJAojCgDgO6e4skBTZrWk9suxTkCe/qtxTXBeFMcZarHE4Z4EA7z1WO9o6c1xwYR9bLlxJWzFBG4d3S67yHqwFPOTjmM39fQObuvsLywYoVyr3Okevd6CNQUuLEhYlDCozGOXQyqKkwWiHVQ5nwXmwegkkCDzOe5y3QHhuHLR/bVkA37t310AhLt0kpMEYi5IOITRZqkhbgrSlSDOJlgatHUJatLZLQNrgnMcYg1YerTzee5SxhGHutm39w6X/6oFcLvfRLLVJFBuSRFME8B6lDFEUnCivw2iHkoYs1WSZQUiD0R4pHdZ6jLVoY5HKY43H+7An7eq4kUke+bcVGBoaitpK5asIlva62VC0moos1YhMI1JN2lKIVFOvC2amWtTmM6QwZJlBZhqpLUpZhLQo45Daks/HFIp5ksBeAcNviRmdfPjlj/944/mD2x9+7bX5Sza9d22ur68Nox2LiwqpLEY7pDRIYWk2FXPTGWmqee7ZKTJpyCURjaZEZJo0taRNQ5Zpdu4Y4OaPnMfZ56+ks6e8wUj1YRddPNVcfOrwmwC7HthVXLF+/VMDZ3Wde/RII7d3ZJzqTIPagiQEvAtQ0iJPGHF+LqOjrcBFl67hH69UeWLvGKt7ixjlaKaaVkvTbClSYRlY28HiguTYtGRyopGfmqmvq6X6qqyy44fUnjQxwMjr7a48Od7s6S5VXnylxiuvL1CtKuotyfXXDNDbWyKOIAhDnAto1AUTx1rML2SMjdV4eWyO9o6EzevLZM0lT2RCs9iy7Bl5gzgKmW9IFluK+VYL7Ywkrvq3zIJLL/3BxVZHt2tvP9hZSPprTU1DKq57/wCbNlYgDIiCAOfBOccLL84xeqjKbC1jMctoL+TYvmUNeKg3NPWmQkiNtR4PCGOoNsXRpsz2Gjl/v1r4/otv8cDExB8mp6Z/99jVl92ytaentGV8chFvA5Ty9PWWsMohpUMKjRSWJBcx/kaNZqopxAmBB3xAGAQ0UkV24pim0pIKRaosLbHwUGv6ns9Zsf/4O0x4UpXKtblCknzMGAc+wDlPuT0H3qO1RQhDJgzGeDpKOZqpJSIgl8TgwTgQ0qCVRWi31Mi8QxlHqhfvsem+V/9jH2iI2cfiem62WIhXxHFCLgnJMoMz7s0Ns8bjnEdbx6qeIvN1AUGAdx4hDUobhHIYa7A4pNVIJ4/I2fEn3h7vHRWYmnpSr+m/vsO5aGc+F1LIJVjrEGqpIwrpaGWGNLM0U4NUBucDtHFLnfNE5tZarHcIZTHGoXTj6zp9cP+ypmGqDnyns3TJJ+tNfVYcW+IwIIrCpelCiHMO55dKDf5E53Mo67HWYa1BeY82Fu0tyurd6Wzbg6eKdUqAoQ9dcWsUV9Y9+vujZMIgPIRhgPOeIAjAQzEf091ZYL6ekUmLcQ7vHA6HsEtZC2vxAfR3l22hb6E8OsrxZQFUq7k7Jiar8XQtRWlDRz5/InfwPsDjuPbKdXgD+5+f5o3qIm1JgvAGZz3KOJRzVLpyKONYSFvX9scdTwBblzWOXzpUHRk5MMZ49RizjYVDzVTslsqSakOmNNoZSsUcSRIQhAHSOVKjUcojjEFZ60uFYPTuW7eJGy4bIE4iji2kh08VKzqlB+TgvrlMOec4LKPFT9TL+Z/lRWvGeTYa57vz+TwXXdDHzEyLuapgupairEFZh3XBEWvVV+uTc3feeMP6Q6sqPdc4Lf7y3NFXbyH9qzqj33IYilat3bC93JXcNNg/eHfaVIRByGx98eVXjzceDiO/T0wfHIFf25Mrhr/43TLlejo8PKzO+F5wUhs2fKWj0jmwJ4oLW4MgUM6rO/+877M//79fTP5V27YNlwLN2TrQCwcOfGvi3cvq6eqfVc+ru11tO5cAAAAASUVORK5CYII=";
//#endregion
//#region src/shell/icons/takuzu.png
var takuzu_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFbElEQVR42sWXX2gc1xWHv3Pv3FlptcpKimXJf4Ibh6S1bDU4UGgLJQG9FZvmpS8hT6EPCaWmNA+lLXWJIWleEtKWlD40fSqBFgpxE/rSpGwdaENKHZo/dqukDYHIlhUla2lX2tmZuff0YVbaXUW2V8KQgYWd3bn3/Oaec3/fPVKr1ZTP8Ir6bxXRAMgAQxUVgyLsYAhi+h+N+iY0Dm+Hiid7LhGDatgymyB5QiwZpZKgaBFABOmJoAqqClIETjIhD10RUW9wt36Fcv0CKlFHhIAGNEsQN1TI3/g95GR7ZljIp5lf8FhbBE4zJfNdsc4aYieoQh7gC/sCk6O6KSICEFW8HaJcf4dDr50mjytFKjQgrkw0eQf5R++haQuMQcUgSZP6fWd4uXGYn55tURm2pF6ZHo/ZU3WoKiLC8krGYj0ltsJqopz+RsZtEzmNpBBs+nPqyOMRvKsQ4iq5B6ZmGPve68j+4+QS4eNb8K6CjyuoOCKjVIagOgJplvHIiUnOPXWMV5+e5dxTx/j2yb2kaUZ1BEaHIDL9CTbbFaERQ1hbpjL3KBPf+kPnr4Bs+RSiISistQIvnjlGZAxfOfUG9//kHY489A/amfLS47OstTyqwtYtZ7av1oBEJfLLb9Oe/0u3hK9zBVWO31nBWuG1iw1q/7rK3D1jzN0zzl0Hhq85blsBqgEpVUjePEvzz08OvKfXEo9XZe94zFdnbuHBuSkOTw/xSSPDGBlcwOYqlCqYkVsHFuCM0Fz37J+I+dMTszzys/f41UuX2Ft15F4HMaJtnEM7A8XQt8G3TmSFpZWMh0/s52uzVb7+w7e49ElKpWzJgu4sBRtGo3mKpuuFlHQdzdNrWl4IysSo43+LCb995Qp/u7DKUj3FijAyZAe14m5wQo4dO0i07yhoINp3lNBYQpNVMNsPm19ocX6+wSvnr3Lf3WNcqad4r7zxbhMjA9WAFCZjHT5ZpXzvKcYeeA5VGHvgOcr3nsInq4h1qJjCjhWMwMiw5cSP3qLkhIu/+RIvPHaUv//8OHkInDz9NiPDBhH91PpF/W+dIe01ggpWhFbtGdr/fL6oAxFCYwkrgiZXkXYTCTl5gGarsN6SM/zyj5f5/V+XN4awvJJRigwrTU8zgTz0i5ACx0oQR7m9yHjjAsFECAI+RULWyXvBC2yMokjwNKtHeD87yH+uxES2YESWBzLfKVoNOAsuKhiSB+HIZIupSkoWpMsCRYglYyHfx8vNw0SdxGQesp7t46zgOvWUe/h8OeV29yGzoxdREyGqiBGkB2CKQVVREUzIqEczrOs0huLFog1klhzMX/I88ULC6FARuAuW7nIu1lOcFZqtwA++WeaLlYtUaz9GSz0Ai8vYPXfgl/9b7CIpAGazJs0vn0EPfQ5JU1SkWwMKREaoDBuqI8LCxykPn5zmO/cf3FyBZ88u8P1fv8+ealwUkAE1EVqqFAIQwnodNz3Drd99lY9/MUf6wetIqYICahSM67N1s8V2UJWBwBIUVHYHsBsa0a7AsguAXdcJdwqW3QLM3Eyw7AZg0c0Ey04Bdu0a2CVYdgqw6+L4xmDRmwIws2UKRHQgsBgB0d0BbNsVEIpzeyMpvsex49kXl/jduXrfETt2jpU1OmARRDNs2gQDxgrtc8+Qn39+s3/wzSWcFWhfxaZriGZ9IqRWq6l2XO2jhvDvy4aoUzvXazK8V+46YDkQLeKWL3SX2Keo7wJMbAGwov/IWR+fIStPbUIu6n37yVHltom8yO62bVboabOEduZZ1yn00CE6zVlB0S29maIbcjA+6SHsdiloyQ0aTelpNAVDhqTtHTW0vc9GnypCM6CDSO8pyu66Pf8/71syYdXn+moAAAAASUVORK5CYII=";
//#endregion
//#region src/shell/icons/nonograms.png
var nonograms_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEbElEQVR42s1XTUvrTBg9k0nSJNqKVVyKIohpryCIK0H9BdKVG10I6l7p3n8guBEXrl0qalEXXdhAwT9QwS9w49fC+lHbJk2azF1cMjS29rX6wr0DhXZ6enoyOc95npBMJsPwF5eAv7zEjxuMMTD251AE4Y8+QggIIYHvf4JrKkCSJA60bRsA4DgOXNflJJIkfRvHGOMiAwIYY5AkCSMjIyiVSpAkCalUCv39/dja2oJhGACA8fFxrK6uoq+vD5ZltYQ7OjpCZ2cnIpEIFxoQIAgCSqUSzs/PEQ6HUSgUQCmFbdswTZNfBaUUxWIR19fXLeO6urr4LakzISEEbW1t/CWKYkPj/ARX++eBExAEAZVKBTs7O3h7e4Moisjn8xBFEZRSyLLMPVKpVLC7u4tisdgS7vX1Ff39/QER5GMOUEpBKQVjDKIowjRNTg4AnufBtm2+1yrOsqyAALH2uGzbxubmJnc1pRTLy8tIpVLI5XIAgF+/fmF6ehrr6+uoVqst4SRJwtLSEmRZ5iICAjzPg2EY3EiyLCOZTOLs7AzpdJrjEokEMpkMF/pVnKqqWFhYACGkXsDHMPrK+j9wdWU4MTEBx3H40Xqeh3g8zkni8Tg8z8Pk5CSv5a/i/FBqasJQKBRQWKlUAmnmeR4cx/kR7tMyNE0Ti4uLsCyL39vt7W2sra0hk8kAAKamppBMJjE7OxvwwFdwiqJgY2MDqqrC87zGHnAch//AX67r8j3/OG3bbhnnl+i/3Y41TePdyo/Y2oTzr8L/XPu+EU7TNM7z0Q91JmSMoVwuBwwpiuK3TWjbdh2fJEmNk5AxBkopxsbGeElms1lEo1GecIwxnnBra2uBMlxZWcHBwQFyuRwIIdB1HTMzM9B1HYQQCIKA09NTyLIMTdPqTehntaqquLq6Qnt7O+7v79HT04NcLod0Os2HiUQiAcMweEmFQqFAEhJC4DgO5ufnEQqFcHNzw/l6e3s/9wBjDC8vL3h+fuburZ1eWll+3P4Xn1jbBSuVCg4PD+E4DgghoJSCEIKhoSHeUGKx2KdJqOs6xw0PD6NYLMIwDLiuy29DKBRqnoSKovD2Wa1WYVkWwuEwVFUFABSLRZimCUVRAldiWRba29vrcKqqcj7HcXjMfzoTxuNxPhMeHx8jHA4jFouBUopCoYBsNovBwUHMzc1xD6iqivX1dei6Dkop3t/fYRgGRkdHEYvFUC6X+UwYjUabz4TlchkXFxcIh8N4f39HR0cHCCG4u7vD09MTd29tYvp1TgjB7e0t8vk8XNcFpRSlUgmXl5ecr7u7u3EZNpvhFEVBW1sbTNNsaErfcD7Osiz+jNDyTLi3t8dnwtfXVwwMDODk5ASPj498xCKEQFEULkaWZSiKgkwmg4eHB9i2zfn29/dRKBS+NhP6SVg7w8myDNM04XkeBEGALMuc/KN5G+FKpVKAT5Kkz3OAEIJIJMIV+o9VmqbVPbr5bveX53kNcY34mjYj350fyb+714jvn2rHvwFtgl66p1J10QAAAABJRU5ErkJggg==";
//#endregion
//#region src/shell/icons/sudoku.png
var sudoku_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAxklEQVR4nO2W0Q3DIAxEjyiD3CgZhVEYJaMwikepRJsoIByEKVU/8r4SBfuCbXS4bdswjRDCCmDfd22F937kK4AFk1mvLyTfDyLSm4hKbCZgS30NPGVOyhIxAROsBWYCkrBlh7L7eg8MUInNBL7++/jBmLrnJLcoD9oN5KeNIh3D1tFkEXal7hZA2kSvxvQxXf5LQGb3wMBzkptUHA0meHAnMGI4UCyhtMwRATY9eQRR/LxSIluhqFxHHk++J4TgYoyNVWO8AN9zYE7pwVcMAAAAAElFTkSuQmCC";
//#endregion
//#region src/shell/icons/2048.png
var _2048_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAABBUlEQVR4nGP4TzSorq4+cOAAqepZGBgYZrybz0AKOP2ilDiF7AwMDEwMNAZMw9GCTOEkCCLSCDPJHjhJlAXT386b/nYeA5UAC6YQ8W6HA1zOx24BxBMMRINTz0tICyJ4NDBQA2DxAXkRcArsjxGSD6gLWGpqakjSUANSDyrFiASMBw4cYKAp+E+H+uBhXzBxjtGEULcNyolS7sM6LFIRE60tYMEUki9aC2EQEzeqFzohUaJ6oRNrDGH3AZHRrgozFG40ZvxjtwDuCfwAzTjVC51oVlLqAzSANflS5ANVsHvhrsZ0PvZIJt75t5GcjCv3Df18wESf+kCTeA0g9eBSjEhA8/oAAJg/AY//APaSAAAAAElFTkSuQmCC";
//#endregion
//#region src/shell/icons/help.svg
var help_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%20shape-rendering='crispEdges'%3e%3cpath%20fill='%23000'%20d='M6%203h20v24H8v2h18v2H6z'/%3e%3cpath%20fill='%23a01e1e'%20d='M7%204h18v22H7z'/%3e%3cpath%20fill='%23d85a5a'%20d='M9%204h2v22H9z'/%3e%3cpath%20fill='%23fff'%20d='M8%2027h18v1H8z'/%3e%3cpath%20fill='%23ffd34e'%20d='M14%208h7v1h1v4h-1v1h-2v2h-3v-3h1v-1h2v-3h-2v2h-3V9h1z%20M16%2018h3v3h-3z'/%3e%3c/svg%3e";
//#endregion
//#region src/shell/Taskbar.jsx
var icons = {
	minesweeper: minesweeper_default,
	takuzu: takuzu_default,
	nonograms: nonograms_default,
	sudoku: sudoku_default,
	2048: _2048_default
};
var REPO = "https://github.com/fexofenadine/puzzlesplus";
var clock = (el) => {
	const show = () => {
		el.textContent = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
			hour: "numeric",
			minute: "2-digit"
		});
	};
	show();
	setInterval(show, 1e3);
};
var leave = (actions) => (event) => {
	if (!event.currentTarget.contains(event.relatedTarget)) actions.closeMenu();
};
var StartItem = ({ icon, onClick }, children) => /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("button", {
	type: "button",
	class: Taskbar_module_default.item,
	tabindex: -1,
	onclick: onClick
}, /* @__PURE__ */ h("span", { class: Taskbar_module_default.itemIcon }, icon && /* @__PURE__ */ h("img", {
	src: icon,
	alt: "",
	width: "24",
	height: "24"
})), children));
var go = (actions, href) => () => {
	actions.closeMenu();
	location.assign(href);
};
var Taskbar = ({ key, name, own, state, actions }) => {
	const open = state.menu && state.menu.start;
	const { root } = state;
	return [
		/* @__PURE__ */ h("footer", {
			key,
			class: Taskbar_module_default.root
		}, /* @__PURE__ */ h("div", {
			class: Taskbar_module_default.start,
			tabindex: -1,
			onfocusout: leave(actions)
		}, /* @__PURE__ */ h("button", {
			type: "button",
			class: open ? Taskbar_module_default.pressed : Taskbar_module_default.button,
			tabindex: -1,
			title: "Start",
			onclick: () => actions.toggleStart()
		}, /* @__PURE__ */ h("img", {
			class: Taskbar_module_default.avatar,
			src: avatar_default,
			alt: "",
			width: "16",
			height: "16"
		}), /* @__PURE__ */ h("span", { class: Taskbar_module_default.startLabel }, "Start")), open && /* @__PURE__ */ h("div", { class: Taskbar_module_default.menu }, /* @__PURE__ */ h("div", { class: Taskbar_module_default.banner }, "Puzzles ", /* @__PURE__ */ h("b", null, "Plus")), /* @__PURE__ */ h("ul", { class: Taskbar_module_default.list }, games.map(([id, title]) => /* @__PURE__ */ h(StartItem, {
			icon: icons[id],
			onClick: () => actions.openGame(id)
		}, title)), /* @__PURE__ */ h("li", { class: Taskbar_module_default.separator }), /* @__PURE__ */ h(StartItem, {
			icon: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%20shape-rendering='crispEdges'%3e%3cpath%20fill='%23000'%20d='M6%203h20v24H8v2h18v2H6z'/%3e%3cpath%20fill='%23a01e1e'%20d='M7%204h18v22H7z'/%3e%3cpath%20fill='%23d85a5a'%20d='M9%204h2v22H9z'/%3e%3cpath%20fill='%23fff'%20d='M8%2027h18v1H8z'/%3e%3cpath%20fill='%23ffd34e'%20d='M14%208h7v1h1v4h-1v1h-2v2h-3v-3h1v-1h2v-3h-2v2h-3V9h1z%20M16%2018h3v3h-3z'/%3e%3c/svg%3e",
			onClick: go(actions, `${root}how-to-play/`)
		}, "How to Play"), games.map(([id, title]) => /* @__PURE__ */ h(StartItem, {
			icon: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%20shape-rendering='crispEdges'%3e%3cpath%20fill='%23000'%20d='M6%203h20v24H8v2h18v2H6z'/%3e%3cpath%20fill='%231e50a0'%20d='M7%204h18v22H7z'/%3e%3cpath%20fill='%235a8ad8'%20d='M9%204h2v22H9z'/%3e%3cpath%20fill='%23fff'%20d='M8%2027h18v1H8z'/%3e%3cpath%20fill='%23ffd34e'%20d='M14%209h8v2h-8zM14%2013h8v1h-8z'/%3e%3c/svg%3e",
			onClick: go(actions, `${root}${id}/guide/`)
		}, title, " Guide")), /* @__PURE__ */ h("li", { class: Taskbar_module_default.separator }), /* @__PURE__ */ h(StartItem, { onClick: () => actions.toggleBackup() }, "Backup..."), name && /* @__PURE__ */ h(StartItem, { onClick: () => actions.toggleAbout() }, "About ", name, "..."), /* @__PURE__ */ h(StartItem, {
			icon: avatar_default,
			onClick: () => {
				actions.closeMenu();
				window.open(REPO, "_blank", "noopener");
			}
		}, "GitHub")))), /* @__PURE__ */ h("div", { class: Taskbar_module_default.tasks }, games.map(([id, title]) => /* @__PURE__ */ h("button", {
			type: "button",
			class: id === state.page && state.windowState === "open" ? Taskbar_module_default.taskPressed : Taskbar_module_default.task,
			tabindex: -1,
			title,
			onclick: () => actions.taskbarGame(id)
		}, /* @__PURE__ */ h("img", {
			src: icons[id],
			alt: "",
			width: "16",
			height: "16"
		}), /* @__PURE__ */ h("span", { class: Taskbar_module_default.name }, title))), own && /* @__PURE__ */ h("button", {
			type: "button",
			class: state.windowState === "open" ? Taskbar_module_default.taskPressed : Taskbar_module_default.task,
			tabindex: -1,
			title: own.title,
			onclick: () => actions.taskbarGame(state.page)
		}, /* @__PURE__ */ h("img", {
			src: own.icon,
			alt: "",
			width: "16",
			height: "16"
		}), /* @__PURE__ */ h("span", { class: Taskbar_module_default.name }, own.title))), /* @__PURE__ */ h("div", { class: Taskbar_module_default.tray }, /* @__PURE__ */ h("button", {
			type: "button",
			class: Taskbar_module_default.boss,
			tabindex: -1,
			title: "Boss key (Esc)",
			onclick: () => actions.boss()
		}, "Esc"), /* @__PURE__ */ h("span", {
			class: Taskbar_module_default.clock,
			oncreate: clock
		}))),
		state.share && /* @__PURE__ */ h(Share, {
			key: "share",
			state: state.share,
			actions
		}),
		state.backup && /* @__PURE__ */ h(Backup, {
			key: "backup",
			state: state.backup,
			actions
		})
	];
};
var About_module_default = {
	root: "About_root",
	wide: "About_wide About_root",
	name: "About_name",
	link: "About_link",
	footer: "About_footer",
	button: "About_button",
	author: "About_author",
	credits: "About_credits"
};
//#endregion
//#region src/shell/About.jsx
var Link = ({ href }, children) => /* @__PURE__ */ h("a", {
	class: About_module_default.link,
	href,
	target: "_blank",
	rel: "noopener noreferrer"
}, children);
var About = ({ key, name, actions, credits }, children) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.toggleAbout()
}, /* @__PURE__ */ h(Dialog, {
	title: `About ${name}`,
	onClose: actions.toggleAbout
}, /* @__PURE__ */ h("div", { class: About_module_default.root }, /* @__PURE__ */ h("p", { class: About_module_default.name }, "Puzzles Plus: ", name), /* @__PURE__ */ h("p", { class: About_module_default.author }, "by fexofenadine"), children, /* @__PURE__ */ h("p", null, "Puzzles Plus began as a fork of", " ", /* @__PURE__ */ h(Link, { href: "https://github.com/frenzzy/minesweeper" }, "Minesweeper"), " by Vladimir Kutepov and has grown far beyond it: five games, hints that explain their reasoning, guides, themes and animated backgrounds, with little of the original left outside the Classic Minesweeper board. Released under the MIT licence."), /* @__PURE__ */ h("p", null, /* @__PURE__ */ h(Link, { href: "https://github.com/fexofenadine/puzzlesplus" }, "github.com/fexofenadine/puzzlesplus")), /* @__PURE__ */ h("details", { class: About_module_default.credits }, /* @__PURE__ */ h("summary", null, "Credits"), /* @__PURE__ */ h("ul", null, credits, /* @__PURE__ */ h("li", null, "The window, Classic theme and Minesweeper board come from", " ", /* @__PURE__ */ h(Link, { href: "https://github.com/frenzzy/minesweeper" }, "Minesweeper"), " by Vladimir Kutepov (MIT licence)."), /* @__PURE__ */ h("li", null, "Backgrounds are canvas ports of GLMatrix, Substrate, Truchet and Phosphor from xscreensaver, under the xscreensaver licence."), /* @__PURE__ */ h("li", null, "Fonts are under the SIL Open Font License and LGPL 2.1."), /* @__PURE__ */ h("li", null, "Photos are from Unsplash, and CC0 photos from Wikimedia Commons."), /* @__PURE__ */ h("li", null, "Colour schemes: SynthWave '84, Solarized and Nord."), /* @__PURE__ */ h("li", null, "Full credits and licences are in the README."))), /* @__PURE__ */ h("div", { class: About_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.toggleAbout,
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: About_module_default.button }, "OK"))))));
//#endregion
//#region src/shell/HowToPlay.jsx
var HowToPlay = ({ key, name, actions }, children) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.toggleHowTo()
}, /* @__PURE__ */ h(Dialog, {
	title: `How to Play ${name}`,
	onClose: actions.toggleHowTo
}, /* @__PURE__ */ h("div", { class: About_module_default.wide }, children, /* @__PURE__ */ h("p", null, "The ", /* @__PURE__ */ h(Link, { href: "guide/" }, name, " guide"), " explains every solving technique with examples."), /* @__PURE__ */ h("p", null, "Every game: F2 or N starts a new game, H gives a hint, P pauses, + and - zoom, and Esc hides the game behind a spreadsheet. A game in progress comes back paused after a reload, and Game → Timer turns the clock off (no best times then)."), /* @__PURE__ */ h("div", { class: About_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.toggleHowTo,
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: About_module_default.button }, "OK"))))));
//#endregion
export { Overlay as $, shareAction as A, Menu_module_default as B, resumeItems as C, historyKey as D, gameKey as E, undoKey as F, __vitePreload as G, cx as H, windowClear as I, phosphor as J, hill as K, codeOf as L, shellState as M, shortcut as N, listen as O, toggleAction as P, Button as Q, partsOf as R, SizeMenu as S, ThemeMenu as T, BackgroundSettings as U, Boss as V, startBackgrounds as W, truchet as X, substrate as Y, Dialog as Z, Menu as _, Taskbar as a, app as at, SubMenuItem as b, DAILY_BUDGET as c, finish as d, hangBelow as et, readDaily as f, games as g, gameLinks as h, About_module_default as i, save as it, shellActions as j, prevent as k, clearDaily as l, special as m, About as n, load as nt, icons as o, h as ot, seedOf as p, matrix as q, Link as r, remove as rt, help_default as s, __exportAll as st, HowToPlay as t, watchWindow as tt, dayOf as u, MenuItem as v, ViewMenu as w, HelpMenu as x, Separator as y, sharedCode as z };
