const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./matrix-DdjVjevu.js","./glyph-DM9oq3hS.js","./driftclouds-C9lmvwAp.js","./shader-CUQO-K7v.js","./neon-DSeQKq5U.js"])))=>i.map(i=>d[i]);
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
var root$6 = document.documentElement;
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
var applyZoom = (scale) => root$6.style.setProperty("--scale", scale);
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
var moveWindow_module_default = { outline: "moveWindow_outline" };
//#endregion
//#region src/shell/moveWindow.js
var THRESHOLD = 4;
var EDGE = 40;
var TITLE = 18;
var roomOf = () => {
	const main = document.querySelector("main");
	const taskbar = main ? parseFloat(getComputedStyle(main).paddingBottom) || 0 : 0;
	return {
		width: document.documentElement.clientWidth,
		height: window.innerHeight - taskbar
	};
};
var tooBig = (rect, room) => rect.width >= room.width - 4 || rect.height >= room.height - 4;
var clampMove = (rect, dx, dy, room) => {
	const left = Math.min(Math.max(rect.left + dx, EDGE - rect.width), room.width - EDGE);
	const top = Math.min(Math.max(rect.top + dy, 0), room.height - TITLE);
	return [Math.round(left - rect.left), Math.round(top - rect.top)];
};
var offsetOf = (frame) => [parseFloat(frame.style.getPropertyValue("--move-x")) || 0, parseFloat(frame.style.getPropertyValue("--move-y")) || 0];
var moved = /* @__PURE__ */ new Set();
var observer = null;
var setOffset = (frame, x, y) => {
	if (!x && !y) {
		frame.style.removeProperty("--move-x");
		frame.style.removeProperty("--move-y");
		moved.delete(frame);
		return;
	}
	frame.style.setProperty("--move-x", `${x}px`);
	frame.style.setProperty("--move-y", `${y}px`);
	if (!moved.has(frame)) watch(frame);
	moved.add(frame);
};
var settle = () => {
	const room = roomOf();
	for (const frame of moved) {
		const dialog = frame.querySelector(`.${Dialog_module_default.dialog}`);
		if (!frame.isConnected || !dialog) {
			moved.delete(frame);
			if (observer) observer.unobserve(frame);
			continue;
		}
		const rect = dialog.getBoundingClientRect();
		if (!rect.width) continue;
		const [x, y] = offsetOf(frame);
		if (tooBig(rect, room)) setOffset(frame, 0, 0);
		else {
			const [dx, dy] = clampMove(rect, 0, 0, room);
			if (dx || dy) setOffset(frame, x + dx, y + dy);
		}
	}
};
var watch = (frame) => {
	if (!observer) {
		window.addEventListener("resize", settle);
		if (window.ResizeObserver) observer = new ResizeObserver(settle);
	}
	if (observer) observer.observe(frame);
};
var startMove = (event) => {
	if (event.button !== 0 || event.pointerType !== "mouse") return;
	if (event.target.closest("button")) return;
	const header = event.currentTarget;
	const frame = header.closest(`.${Dialog_module_default.b}`);
	const dialog = header.closest(`.${Dialog_module_default.dialog}`);
	if (!frame || !dialog) return;
	const rect = dialog.getBoundingClientRect();
	const room = roomOf();
	if (tooBig(rect, room)) return;
	const start = [event.clientX, event.clientY];
	let shift = null;
	let outline = null;
	const draw = () => {
		outline.style.left = `${rect.left + shift[0]}px`;
		outline.style.top = `${rect.top + shift[1]}px`;
	};
	const move = (e) => {
		const dx = e.clientX - start[0];
		const dy = e.clientY - start[1];
		if (!outline) {
			if (Math.hypot(dx, dy) < THRESHOLD) return;
			outline = document.createElement("div");
			outline.className = moveWindow_module_default.outline;
			outline.style.width = `${rect.width}px`;
			outline.style.height = `${rect.height}px`;
			document.body.append(outline);
		}
		shift = clampMove(rect, dx, dy, room);
		draw();
	};
	const key = (e) => {
		if (e.key !== "Escape") return;
		e.preventDefault();
		e.stopPropagation();
		end(null);
	};
	const end = (e) => {
		window.removeEventListener("pointermove", move);
		window.removeEventListener("pointerup", end);
		window.removeEventListener("pointercancel", end);
		window.removeEventListener("keydown", key, true);
		if (!outline) return;
		outline.remove();
		if (e && e.type === "pointerup") {
			const [x, y] = offsetOf(frame);
			setOffset(frame, x + shift[0], y + shift[1]);
		}
	};
	window.addEventListener("pointermove", move);
	window.addEventListener("pointerup", end);
	window.addEventListener("pointercancel", end);
	window.addEventListener("keydown", key, true);
};
//#endregion
//#region src/Dialog.jsx
var Dialog = ({ key, hidden, title, titleHint, onTitleDoubleClick, controls, onClose, onCreate, clear }, children) => /* @__PURE__ */ h("div", {
	key,
	hidden
}, /* @__PURE__ */ h("div", { class: Dialog_module_default.a }, /* @__PURE__ */ h("div", { class: Dialog_module_default.b }, /* @__PURE__ */ h("div", {
	class: clear === null || clear === void 0 ? Dialog_module_default.dialog : `${Dialog_module_default.dialog} ${Dialog_module_default.clear}`,
	style: clear === null || clear === void 0 ? {} : { "--window": `${clear}%` },
	oncreate: onCreate
}, /* @__PURE__ */ h("div", { class: Dialog_module_default.container }, title && /* @__PURE__ */ h("div", {
	class: Dialog_module_default.header,
	onpointerdown: startMove
}, /* @__PURE__ */ h("h1", {
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
	driftclouds: () => driftclouds,
	hextrail: () => hextrail,
	matrix: () => matrix,
	neon: () => neon,
	phosphor: () => phosphor,
	qix: () => qix,
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
			value: 2
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
var qix = {
	name: "Qix",
	credit: "After Qix by Jamie Zawinski, part of xscreensaver, and the Mystify screensaver of Windows 95",
	wallpaper: true,
	ratio: (pixels) => Math.min(pixels, 2),
	options: [
		{
			key: "speed",
			label: "Speed",
			type: "range",
			min: .25,
			max: 3,
			step: .25,
			value: .6,
			format: (v) => `${v}×`
		},
		{
			key: "count",
			label: "Shapes",
			type: "range",
			min: 0,
			max: 5,
			step: 1,
			value: 2
		},
		{
			key: "corners",
			label: "Corners",
			type: "range",
			min: 2,
			max: 6,
			step: 1,
			value: 4
		},
		{
			key: "trail",
			label: "Trail",
			type: "range",
			min: 2,
			max: 40,
			step: 1,
			value: 18
		},
		{
			key: "bleed",
			label: "Colour bleed",
			type: "range",
			min: 0,
			max: 8,
			step: 1,
			value: 3,
			format: (v) => v ? `${v} px` : "none"
		},
		{
			key: "opacity",
			label: "Strength",
			type: "range",
			min: 20,
			max: 100,
			step: 5,
			value: 80,
			format: (v) => `${v}%`
		}
	]
};
var hextrail = {
	name: "Hex Trail",
	credit: "Ported from HexTrail by Jamie Zawinski, part of xscreensaver",
	ratio: (pixels) => Math.min(pixels, 2),
	options: [
		{
			key: "speed",
			label: "Speed",
			type: "range",
			min: .25,
			max: 4,
			step: .25,
			value: 1,
			format: (v) => `${v}×`
		},
		{
			key: "size",
			label: "Hexagon size",
			type: "range",
			min: 12,
			max: 80,
			step: 1,
			value: 15
		},
		{
			key: "thickness",
			label: "Thickness",
			type: "range",
			min: 5,
			max: 50,
			step: 1,
			value: 10,
			format: (v) => `${v}%`
		},
		{
			key: "borders",
			label: "Hexagon outlines",
			type: "toggle",
			value: true
		},
		{
			key: "palette",
			label: "Colours",
			type: "select",
			choices: [
				["sea", "Sea greens and blues"],
				["teal", "Teals"],
				["ember", "Embers"]
			],
			value: "sea"
		},
		{
			key: "opacity",
			label: "Strength",
			type: "range",
			min: 20,
			max: 100,
			step: 5,
			value: 70,
			format: (v) => `${v}%`
		}
	]
};
var resolution = (web) => ({
	key: "resolution",
	label: "Resolution",
	type: "range",
	min: 20,
	max: 100,
	step: 5,
	value: web,
	format: (v) => `${v}%`
});
var speed = (value) => ({
	key: "speed",
	label: "Speed",
	type: "range",
	min: .1,
	max: 2,
	step: .1,
	value,
	format: (v) => `${v}×`
});
var fps = {
	key: "fps",
	label: "Frame rate",
	type: "range",
	min: 10,
	max: 30,
	step: 5,
	value: 30,
	format: (v) => `${v} fps`
};
var neon = {
	name: "Neon Triangulator",
	credit: "Neon Triangulator by mrange (CC0, shadertoy.com/view/tXGGRD), as in xscreensaver",
	gl: true,
	wallpaper: true,
	ratio: () => 1,
	options: [
		speed(.2),
		resolution(65),
		fps,
		{
			key: "brightness",
			label: "Brightness",
			type: "range",
			min: 20,
			max: 100,
			step: 5,
			value: 75,
			format: (v) => `${v}%`
		}
	]
};
var driftclouds = {
	name: "Drift Clouds",
	credit: "2D Clouds by drift (shadertoy.com/view/4tdSWr, free to use), as Drift Clouds in xscreensaver",
	gl: true,
	wallpaper: true,
	animated: false,
	ratio: () => 1,
	options: [
		speed(1),
		resolution(50),
		fps
	]
};
//#endregion
//#region src/shell/motion.js
var motions = [
	["system", "System Motion"],
	["reduce", "Reduced Motion"],
	["full", "Full Motion"]
];
var loadMotion = () => {
	const saved = load("motion");
	return motions.some(([id]) => id === saved) ? saved : "full";
};
var applyMotion = (motion) => {
	const root = document.documentElement;
	if (motion === "system") delete root.dataset.motion;
	else root.dataset.motion = motion;
};
var saveMotion = (motion) => {
	if (motion === "full") remove("motion");
	else save("motion", motion);
	applyMotion(motion);
};
var reduced = () => {
	const chosen = globalThis.document?.documentElement.dataset.motion || loadMotion();
	if (chosen !== "system") return chosen === "reduce";
	return !globalThis.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches;
};
//#endregion
//#region src/shell/glitches.js
var retro = [
	"synthwave",
	"vaporwave",
	"matrix"
];
var effects = [
	{
		id: "jump",
		name: "Picture jumps",
		themes: ["synthwave", "vaporwave"],
		glitch: true
	},
	{
		id: "tear",
		name: "Torn bands",
		themes: ["synthwave", "matrix"],
		glitch: true,
		moving: true
	},
	{
		id: "burst",
		name: "Static bursts",
		themes: ["synthwave"],
		glitch: true
	},
	{
		id: "corrupt",
		name: "Corrupted columns",
		themes: ["matrix"],
		glitch: true,
		moving: true
	},
	{
		id: "drop",
		name: "Signal drops",
		themes: ["matrix"],
		glitch: true,
		off: true,
		moving: true
	},
	{
		id: "lcd",
		name: "Counter glitches",
		themes: retro,
		glitch: true
	},
	{
		id: "lost",
		name: "Meltdown when a game is lost",
		themes: retro,
		glitch: true
	},
	{
		id: "scanlines",
		name: "Scanlines",
		themes: retro
	},
	{
		id: "band",
		name: "Tracking band",
		themes: retro
	},
	{
		id: "grain",
		name: "Tape grain",
		themes: ["synthwave", "vaporwave"]
	},
	{
		id: "flicker",
		name: "Flicker",
		themes: retro
	}
];
var effectsOf = (theme) => effects.filter((effect) => effect.themes.includes(theme));
var defaultEffects = () => Object.fromEntries(effects.map((effect) => [effect.id, !effect.off]));
var loadEffects = () => {
	const on = defaultEffects();
	try {
		const saved = JSON.parse(load("effects"));
		for (const id in on) if (typeof saved?.[id] === "boolean") on[id] = saved[id];
	} catch {}
	return on;
};
var current = null;
var chosen = () => current ??= loadEffects();
var offList = (on) => effects.filter((effect) => !on[effect.id]).map((effect) => effect.id).join(" ");
var applyEffects = (on) => {
	current = on;
	const root = globalThis.document?.documentElement;
	if (root) root.dataset.effectsOff = offList(on);
};
var saveEffects = (on) => {
	const defaults = defaultEffects();
	const changed = Object.fromEntries(Object.entries(on).filter(([id, v]) => v !== defaults[id]));
	if (Object.keys(changed).length) save("effects", JSON.stringify(changed));
	else remove("effects");
	applyEffects(on);
};
var gaps = {
	jump: {
		synthwave: [2, 5.5],
		vaporwave: [7, 16]
	},
	tear: {
		synthwave: [3, 7],
		matrix: [6, 14]
	},
	burst: { synthwave: [7, 15] },
	corrupt: { matrix: [7, 15] },
	drop: { matrix: [10, 20] },
	lcd: {
		synthwave: [.8, 3],
		vaporwave: [.8, 3],
		matrix: [.8, 3]
	}
};
var between = (low, high, rng = Math.random) => low + rng() * (high - low);
var pick = (rng, list) => list[Math.floor(rng() * list.length)];
var sign = (rng) => rng() < .5 ? -1 : 1;
var px = (value) => `${value.toFixed(1)}px`;
var deg = (value) => `${value.toFixed(1)}deg`;
var band = (top, height) => [top, Math.min(100, top + height)];
var bands = (list) => `polygon(${list.map(([a, b]) => `0 ${a}%, 100% ${a}%, 100% ${b}%, 0 ${b}%`).join(", ")})`;
var stepsOf = (id, theme, rng = Math.random) => {
	if (id === "jump" && theme === "vaporwave") {
		const x = between(4, 9, rng) * sign(rng);
		return [[{
			"--jump-x": px(x),
			"--jump-skew": deg(-x / 12)
		}, 70], [{
			"--jump-x": px(-x * between(.3, .7, rng)),
			"--jump-skew": "0deg"
		}, 70]];
	}
	if (id === "jump") {
		const step = () => ({
			"--jump-x": px(between(6, 16, rng) * sign(rng)),
			"--jump-y": px(between(-3, 6, rng)),
			"--jump-skew": deg(between(-4, 4, rng)),
			"--jump-hue": deg(between(15, 40, rng) * sign(rng)),
			"--jump-bright": between(.9, 1.5, rng).toFixed(2),
			"--jump-sat": between(.4, 1.8, rng).toFixed(2)
		});
		return rng() < .6 ? [[step(), 70], [step(), 70]] : [[step(), 70]];
	}
	if (id === "tear" && theme === "matrix") {
		const step = () => ({ bands: Array.from({ length: 2 + Math.floor(rng() * 2) }, () => ({
			top: between(0, .88, rng),
			height: between(.02, .11, rng),
			dx: between(15, 70, rng) * sign(rng)
		})) });
		return rng() < .7 ? [[step(), 90], [step(), 90]] : [[step(), 120]];
	}
	if (id === "tear") {
		const step = () => ({
			"--tear-clip": bands([band(between(5, 80, rng), between(2, 7, rng)), band(between(5, 90, rng), between(1, 3, rng))]),
			"--tear-hue": deg(between(120, 180, rng))
		});
		return rng() < .7 ? [[step(), 180], [step(), 180]] : [[step(), 220]];
	}
	if (id === "burst") return [[{}, between(200, 450, rng)]];
	if (id === "corrupt") return [[{ columns: Array.from({ length: 3 + Math.floor(rng() * 3) }, () => ({
		x: rng(),
		top: between(0, .6, rng),
		length: 6 + Math.floor(rng() * 14)
	})) }, between(450, 900, rng)]];
	if (id === "drop") return [[{ dim: between(.5, .8, rng) }, between(70, 130, rng)], [{ roll: true }, between(250, 400, rng)]];
	if (id === "lcd") {
		const step = () => {
			const top = rng() < .6 ? between(0, 50, rng) : 0;
			const bottom = top ? between(10, 40, rng) : rng() < .4 ? 55 : 0;
			return {
				"--lcd-move": `translate(${px(between(1, 3, rng) * sign(rng))}, ${px(between(-1, 1, rng))}) skewX(${deg(rng() < .4 ? between(-6, 6, rng) : 0)})`,
				"--lcd-clip": top || bottom ? `inset(${top.toFixed(0)}% 0 ${bottom.toFixed(0)}% 0)` : "none",
				"--lcd-fringe": px(between(2, 3.5, rng)),
				"--lcd-hue": rng() < .3 ? "60deg" : "0deg"
			};
		};
		return rng() < .5 ? [[step(), 106], [step(), 106]] : [[step(), 106]];
	}
	return [];
};
var canvasGlitches = /* @__PURE__ */ new Set([
	"tear",
	"corrupt",
	"drop"
]);
var drawn = (id, theme) => theme === "matrix" && canvasGlitches.has(id);
var playing = /* @__PURE__ */ new Map();
var layer = null;
var drawing = false;
var source = () => [...document.querySelectorAll("body > canvas")].find((canvas) => canvas !== layer && canvas.style.display === "block");
var glyphs = "▓▒░█▄▀■□◆◇╳╱╲┼╪╬#%&@$";
var paint = (context, rain, w, h, id, step) => {
	if (id === "tear") for (const { top, height, dx } of step.bands) {
		const y = top * h;
		const bh = Math.max(4, height * h);
		context.fillStyle = "#000";
		context.fillRect(0, y, w, bh);
		context.drawImage(rain, 0, y, w, bh, dx, y, w, bh);
		context.fillStyle = "rgba(44, 255, 110, 0.35)";
		context.fillRect(0, y, w, 1);
	}
	else if (id === "corrupt") {
		const size = Math.round(h / 40);
		step.frozen ??= (() => {
			const copy = document.createElement("canvas");
			copy.width = w;
			copy.height = h;
			copy.getContext("2d").drawImage(rain, 0, 0);
			return copy;
		})();
		context.font = `${size}px monospace`;
		context.textAlign = "center";
		for (const column of step.columns) {
			const x = Math.round(column.x * w);
			context.fillStyle = "#000";
			context.fillRect(x - size, 0, size * 2, h);
			context.drawImage(step.frozen, x - size, 0, size * 2, h, x - size, 0, size * 2, h);
			for (let k = 0; k < column.length; k++) {
				context.fillStyle = Math.random() < .15 ? "#d4ffe0" : "#2cff6e";
				context.globalAlpha = .5 + Math.random() * .5;
				const nudge = Math.random() < .2 ? (Math.random() - .5) * size : 0;
				context.fillText(pick(Math.random, glyphs), x + nudge, column.top * h + k * size * 1.15);
			}
			context.globalAlpha = 1;
		}
	} else if (id === "drop") {
		if (step.dim) {
			context.fillStyle = `rgba(0, 0, 0, ${step.dim})`;
			context.fillRect(0, 0, w, h);
		} else {
			step.start ??= performance.now();
			const y = (performance.now() - step.start) / 300 * h * 1.2 - h * .1;
			const shade = context.createLinearGradient(0, y - 60, 0, y + 60);
			shade.addColorStop(0, "rgba(0, 0, 0, 0)");
			shade.addColorStop(.5, "rgba(0, 0, 0, 1)");
			shade.addColorStop(1, "rgba(0, 0, 0, 0)");
			context.fillStyle = shade;
			context.fillRect(0, y - 60, w, 120);
		}
	}
};
var draw$1 = () => {
	const rain = source();
	const active = [...playing].filter(([id]) => canvasGlitches.has(id));
	if (!rain || !active.length) {
		layer.style.display = "none";
		drawing = false;
		return;
	}
	if (layer.width !== rain.width || layer.height !== rain.height) {
		layer.width = rain.width;
		layer.height = rain.height;
	}
	layer.style.filter = rain.style.filter;
	layer.style.display = "block";
	const context = layer.getContext("2d");
	context.clearRect(0, 0, layer.width, layer.height);
	for (const [id, step] of active) paint(context, rain, layer.width, layer.height, id, step);
	requestAnimationFrame(draw$1);
};
var drawOn = () => {
	if (!layer) {
		layer = document.createElement("canvas");
		layer.id = "glitch";
		layer.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:none";
	}
	const rain = source();
	if (!rain || !layer.getContext?.("2d")) return false;
	if (layer.previousElementSibling !== rain) rain.after(layer);
	if (!drawing) {
		drawing = true;
		requestAnimationFrame(draw$1);
	}
	return true;
};
var mark$1 = (root) => {
	const ids = [...playing.keys()];
	if (ids.length) root.dataset.glitch = ids.join(" ");
	else delete root.dataset.glitch;
};
var play = (id, theme, rng = Math.random) => {
	const root = document.documentElement;
	if (playing.has(id)) return;
	const steps = stepsOf(id, theme, rng);
	if (!steps.length) return;
	const canvas = drawn(id, theme);
	if (canvas && root.dataset.background !== "animated") return;
	const names = new Set(steps.flatMap(([vars]) => Object.keys(vars).filter((k) => k[0] === "-")));
	const run = (k) => {
		if (k === steps.length) {
			playing.delete(id);
			for (const name of names) root.style.removeProperty(name);
			mark$1(root);
			return;
		}
		const [vars, ms] = steps[k];
		for (const [name, value] of Object.entries(vars)) if (name[0] === "-") root.style.setProperty(name, value);
		playing.set(id, vars);
		mark$1(root);
		setTimeout(() => run(k + 1), ms);
	};
	run(0);
	if (canvas && !drawOn()) {
		playing.delete(id);
		mark$1(root);
	}
};
var ready = (id, root) => chosen()[id] && !document.hidden && !root.dataset.boss && !reduced();
var started = false;
var startGlitches = () => {
	if (started) return;
	started = true;
	const root = document.documentElement;
	applyEffects(chosen());
	for (const id of Object.keys(gaps)) {
		const next = (first) => {
			const gap = gaps[id][root.dataset.theme];
			if (!gap) return setTimeout(() => next(true), 2e3);
			setTimeout(() => {
				const theme = root.dataset.theme;
				if (gaps[id][theme] && ready(id, root)) play(id, theme);
				next(false);
			}, between(first ? .5 : 1, 1, Math.random) * between(...gap) * 1e3);
		};
		next(true);
	}
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
	matrix: () => __vitePreload(() => import("./matrix-DdjVjevu.js"), __vite__mapDeps([0,1]), import.meta.url),
	substrate: () => __vitePreload(() => import("./substrate-D7lUricn.js"), [], import.meta.url),
	truchet: () => __vitePreload(() => import("./truchet-DLY-Y4d-.js"), [], import.meta.url),
	phosphor: () => __vitePreload(() => import("./phosphor-CizO2jmk.js"), [], import.meta.url),
	driftclouds: () => __vitePreload(() => import("./driftclouds-C9lmvwAp.js"), __vite__mapDeps([2,3]), import.meta.url),
	qix: () => __vitePreload(() => import("./qix-CQQvkqfb.js"), [], import.meta.url),
	hextrail: () => __vitePreload(() => import("./hextrail-RoiJH5QP.js"), [], import.meta.url),
	neon: () => __vitePreload(() => import("./neon-DSeQKq5U.js"), __vite__mapDeps([4,3]), import.meta.url)
};
var themeBackgrounds = {
	classic: "driftclouds",
	matrix: "matrix",
	nord: "substrate",
	solarized: "truchet",
	"solarized-phosphor": "phosphor",
	synthwave: "neon",
	vaporwave: "qix",
	terafox: "hextrail"
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
var VERSION = 2;
var upgrades = {
	1: {
		neon: [
			"animated",
			"speed",
			"resolution"
		],
		hextrail: [
			"speed",
			"size",
			"thickness",
			"borders"
		],
		phosphor: ["scale"]
	},
	2: { hextrail: ["speed"] }
};
var upgrade = (stored) => {
	for (let version = (stored.version || 0) + 1; version <= VERSION; version++) for (const [id, keys] of Object.entries(upgrades[version])) for (const key of keys) delete stored[id]?.[key];
	return stored;
};
var loadSettings = () => {
	let stored = {};
	try {
		stored = JSON.parse(load("backgrounds")) || {};
	} catch {}
	const old = Object.keys(stored).length && (stored.version || 0) < VERSION;
	if (old) upgrade(stored);
	const loaded = Object.fromEntries(Object.keys(meta_exports).map((id) => [id, Object.fromEntries(optionsOf(id).map((option) => [option.key, clean(option, stored[id]?.[option.key])]))]));
	if (old) saveSettings(loaded);
	return loaded;
};
var saveSettings = (settings) => save("backgrounds", JSON.stringify({
	...settings,
	version: VERSION
}));
var settings = loadSettings();
var instances = {};
var refresh = () => {};
var gaveUp = /* @__PURE__ */ new Set();
var dead = /* @__PURE__ */ new Set();
var configure = (id, values) => {
	if (values.animated && !settings[id].animated && !dead.has(id)) gaveUp.delete(id);
	settings = {
		...settings,
		[id]: values
	};
	instances[id]?.configure(values);
	refresh(id);
};
var gap = 0;
var startBackgrounds = () => {
	startGlitches();
	const root = document.documentElement;
	const makeCanvas = () => {
		const canvas = document.createElement("canvas");
		canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:none";
		document.body.prepend(canvas);
		return canvas;
	};
	const flat = makeCanvas();
	const surfaces = {
		flat: {
			canvas: flat,
			context: flat.getContext("2d")
		},
		gl: null
	};
	const surfaceOf = (id) => {
		if (!meta_exports[id].gl) return surfaces.flat;
		if (!surfaces.gl) {
			const canvas = makeCanvas();
			const context = canvas.getContext("webgl2", {
				alpha: false,
				antialias: false,
				powerPreference: "low-power"
			});
			if (!context) {
				canvas.remove();
				throw new Error("no webgl2");
			}
			surfaces.gl = {
				canvas,
				context
			};
		}
		return surfaces.gl;
	};
	const show = (id) => {
		for (const surface of [surfaces.flat, surfaces.gl]) if (surface) surface.canvas.style.display = "none";
		if (id && instances[id]) surfaceOf(id).canvas.style.display = "block";
	};
	let active = null;
	let mode = null;
	let frame = null;
	let drawn = 0;
	const loop = (now) => {
		frame = requestAnimationFrame(loop);
		if (gap && now - drawn < gap) return;
		drawn = now;
		instances[active].frame(now);
	};
	const settle = (now) => {
		if (!instances[active].still(now)) frame = requestAnimationFrame(settle);
	};
	const resize = () => {
		const { ratio, filter } = meta_exports[active];
		const pixels = window.devicePixelRatio || 1;
		const scale = ratio(pixels, settings[active]);
		const { canvas } = surfaceOf(active);
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
		const next = id && (settings[id].animated && !gaveUp.has(id) ? "animated" : still);
		if (next) root.dataset.background = next;
		else delete root.dataset.background;
		if (id === active && next === mode && changed !== id) return;
		cancelAnimationFrame(frame);
		active = id;
		mode = next;
		show(id && mode !== "wallpaper" ? id : null);
		if (!id || mode === "wallpaper") return;
		if (instances[id]) return start();
		const giveUp = (forGood) => {
			gaveUp.add(id);
			if (forGood === true) dead.add(id);
			if (active !== id) return;
			cancelAnimationFrame(frame);
			mode = "wallpaper";
			show(null);
			root.dataset.background = "wallpaper";
		};
		loaders[id]().then((loaded) => {
			instances[id] ??= loaded.default.create(surfaceOf(id).context, settings[id], { giveUp });
			if (active !== id) return;
			show(id);
			start();
		}).catch(giveUp);
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
var own = (id) => id ? optionsOf(id).filter((option) => option.key !== "animated") : [];
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
	})), own(state.id).map((option) => /* @__PURE__ */ h("label", { class: BackgroundSettings_module_default.row }, /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.name }, option.label, ":"), /* @__PURE__ */ h(Control, {
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
var icon$1 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' rx='2' fill='%232b6cb0'/%3E%3Cpath d='M3 5.5h10M3 8.5h10M3 11.5h10M6.5 3v10M10 3v10' stroke='%23fff'/%3E%3C/svg%3E";
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
var Row$1 = ({ number, cells, total }) => /* @__PURE__ */ h("tr", { class: total ? Boss_module_default.total : null }, /* @__PURE__ */ h("th", { class: Boss_module_default.number }, number), columns.map((_, i) => {
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
	if (link) link.setAttribute("href", icon$1);
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
	].map((name) => /* @__PURE__ */ h("span", null, name)))), /* @__PURE__ */ h("div", { class: Boss_module_default.formula }, /* @__PURE__ */ h("span", { class: Boss_module_default.ref }, "E", rows.length), /* @__PURE__ */ h("span", { class: Boss_module_default.fx }, "fx"), /* @__PURE__ */ h("span", null, "=SUM(E2:E", rows.length - 1, ")")), /* @__PURE__ */ h("div", { class: Boss_module_default.grid }, /* @__PURE__ */ h("table", { class: Boss_module_default.table }, /* @__PURE__ */ h("thead", null, /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("th", { class: Boss_module_default.corner }), columns.map((c) => /* @__PURE__ */ h("th", null, c)))), /* @__PURE__ */ h("tbody", null, Array.from({ length: 60 }, (_, i) => /* @__PURE__ */ h(Row$1, {
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
	icon: "Menu_icon",
	hotKey: "Menu_hotKey",
	check: "Menu_check",
	arrow: "Menu_arrow",
	flyout: "Menu_flyout Menu_menu",
	separator: "Menu_separator"
};
//#endregion
//#region src/shell/themes.js
var defaultTheme = "synthwave";
var themes = [
	["classic", "Classic"],
	["matrix", "Matrix"],
	["nord", "Nord"],
	["solarized-phosphor", "Solarized Phosphor"],
	["solarized", "Solarized Truchet"],
	["synthwave", "Synthwave"],
	["terafox", "Terafox Hex Trail"],
	["vaporwave", "Vaporwave"]
];
var renamed = {
	everforest: "terafox",
	"terafox-coral": "terafox"
};
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
	"motion",
	"effects",
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
var ours = (key) => plain.includes(key) || /^(minesweeper|takuzu|nonograms|sudoku|2048|lightup|futoshiki|bridges)\./.test(key) || /^(beginner|intermediate|expert|extreme)(Hints)?(Name|Date)?$/.test(key);
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
//#region src/shell/fireworks.js
var square = "square";
var dot = "dot";
var glyph = "glyph";
var looks = {
	classic: {
		colors: [
			"#ff0000",
			"#ffff00",
			"#00ff00",
			"#00ffff",
			"#ff00ff",
			"#ffffff"
		],
		shape: square,
		gravity: 90,
		size: 3
	},
	synthwave: {
		colors: [
			"#ff2a95",
			"#00e5ff",
			"#ffe600",
			"#a259ff"
		],
		shape: dot,
		gravity: 70,
		size: 2.6,
		glow: 10
	},
	solarized: {
		colors: [
			"#b58900",
			"#cb4b16",
			"#dc322f",
			"#d33682",
			"#6c71c4",
			"#268bd2",
			"#2aa198",
			"#859900"
		],
		shape: dot,
		gravity: 80,
		size: 2.6
	},
	matrix: {
		colors: [
			"#2cff6e",
			"#d4ffe0",
			"#0f9d3a"
		],
		shape: glyph,
		gravity: 40,
		size: 15,
		glyphs: "ｼﾓｱｦｿﾅﾊﾋﾌﾍﾎ"
	},
	nord: {
		colors: [
			"#88c0d0",
			"#81a1c1",
			"#8fbcbb",
			"#eceff4",
			"#b48ead"
		],
		shape: dot,
		gravity: 30,
		size: 2.4,
		glow: 6
	}
};
looks["solarized-phosphor"] = looks.solarized;
looks.vaporwave = {
	colors: [
		"#ff71ce",
		"#01cdfe",
		"#05ffa1",
		"#b967ff",
		"#fffb96"
	],
	shape: square,
	gravity: 80,
	size: 3
};
looks.terafox = {
	colors: [
		"#5a93aa",
		"#7aa4a1",
		"#a1cdd8",
		"#fda47f",
		"#e85c51",
		"#ad5c7c"
	],
	shape: dot,
	gravity: 50,
	size: 2.5,
	glow: 5
};
var lookOf = (theme) => looks[theme] || looks.classic;
var SPARKS = 70;
var TRAIL = 5;
var LIMIT = 300;
var STEP = .25;
var launch = (rng) => ({
	x: .15 + rng() * .7,
	y: .15 + rng() * .4,
	wait: .3 + rng() * .4
});
var sparks = (look, x, y, rng) => {
	const main = look.colors[Math.floor(rng() * look.colors.length)];
	const other = look.colors[Math.floor(rng() * look.colors.length)];
	return Array.from({ length: SPARKS }, () => {
		const angle = rng() * Math.PI * 2;
		const speed = (.25 + .75 * Math.sqrt(rng())) * 220;
		const life = 1.1 + rng() * .9;
		return {
			x,
			y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			life,
			age: 0,
			trail: [],
			color: rng() < .2 ? other : main,
			char: look.glyphs ? look.glyphs[Math.floor(rng() * look.glyphs.length)] : ""
		};
	});
};
var advance = (list, dt, look) => list.filter((p) => {
	p.age += dt;
	if (p.age >= p.life) return false;
	p.trail.push([p.x, p.y]);
	if (p.trail.length > TRAIL) p.trail.shift();
	const drag = Math.exp(-1.6 * dt);
	p.vx *= drag;
	p.vy = p.vy * drag + look.gravity * dt;
	p.x += p.vx * dt;
	p.y += p.vy * dt;
	return true;
});
var calm = reduced;
var canvas = null;
var running = false;
var finish$1 = () => {};
var stopFireworks = () => finish$1();
var place = () => {
	const page = document.getElementById("fireworks");
	if (page) return page;
	if (canvas?.isConnected) return canvas;
	canvas = document.createElement("canvas");
	canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:none";
	const background = document.body.querySelector("canvas");
	if (background) background.after(canvas);
	else document.body.prepend(canvas);
	return canvas;
};
var fireworksKey = (page, theme) => page === "minesweeper" && theme === "classic" ? "minesweeper.fireworks" : "fireworks";
var fireworksOn = (page, theme) => fireworksKey(page, theme) === "fireworks" ? load("fireworks") !== "off" : load("minesweeper.fireworks") === "on";
var celebrate = (page, theme = document.documentElement.dataset.theme) => {
	if (running || !fireworksOn(page, theme) || document.hidden || calm()) return;
	const root = document.documentElement;
	if (root.dataset.boss) return;
	const target = place();
	const context = target.getContext?.("2d");
	if (!context) return;
	const look = lookOf(theme);
	let width = 0;
	let height = 0;
	target.style.display = "block";
	let open = true;
	let wait = 0;
	let alive = [];
	let rockets = [];
	let clock = 0;
	let last = null;
	running = true;
	finish$1 = () => {
		open = false;
	};
	const fit = () => {
		if (innerWidth === width && innerHeight === height) return;
		if (width && height) {
			const sx = innerWidth / width;
			const sy = innerHeight / height;
			const move = (p) => {
				p.x *= sx;
				p.y *= sy;
				p.trail = p.trail.map(([x, y]) => [x * sx, y * sy]);
			};
			rockets.forEach((r) => {
				move(r);
				r.top *= sy;
			});
			alive.forEach(move);
		}
		width = innerWidth;
		height = innerHeight;
		const scale = Math.min(window.devicePixelRatio || 1, 2);
		target.width = Math.round(width * scale);
		target.height = Math.round(height * scale);
		context.setTransform(scale, 0, 0, scale, 0, 0);
	};
	fit();
	const stop = () => {
		finish$1 = () => {};
		running = false;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, target.width, target.height);
		target.style.display = "none";
	};
	const frame = (now) => {
		const dt = last === null ? 0 : Math.min(Math.max((now - last) / 1e3, 0), STEP);
		last = now;
		clock += dt;
		if (root.dataset.boss || document.hidden) return stop();
		fit();
		if (clock > LIMIT) open = false;
		wait -= dt;
		while (open && wait <= 0) {
			const next = launch(Math.random);
			wait += next.wait;
			rockets.push({
				x: next.x * width,
				y: height,
				top: next.y * height,
				speed: 520 + Math.random() * 120,
				trail: []
			});
		}
		rockets = rockets.filter((r) => {
			r.trail.push([r.x, r.y]);
			if (r.trail.length > 10) r.trail.shift();
			r.y -= r.speed * dt;
			if (r.y > r.top) return true;
			alive.push(...sparks(look, r.x, r.y, Math.random));
			return false;
		});
		alive = advance(alive, dt, look);
		context.clearRect(0, 0, width, height);
		context.globalCompositeOperation = "lighter";
		if (look.shape === glyph) context.font = `${look.size}px monospace`;
		for (const r of rockets) draw(context, look, {
			...r,
			color: look.colors[0],
			char: look.glyphs?.[0] || ""
		}, 1);
		for (const p of alive) draw(context, look, p, 1 - p.age / p.life);
		if (open || rockets.length || alive.length) requestAnimationFrame(frame);
		else stop();
	};
	requestAnimationFrame(frame);
};
var mark = (context, look, p, x, y, alpha) => {
	context.globalAlpha = Math.max(0, alpha);
	context.fillStyle = p.color;
	if (look.shape === glyph) context.fillText(p.char, x, y);
	else if (look.shape === square) context.fillRect(Math.round(x), Math.round(y), look.size, look.size);
	else {
		context.beginPath();
		const radius = look.size * (.4 + .6 * alpha);
		context.arc(x, y, radius, 0, Math.PI * 2);
		context.fill();
		if (look.glow) {
			context.globalAlpha = Math.max(0, alpha) * .25;
			context.beginPath();
			context.arc(x, y, radius * 2.4, 0, Math.PI * 2);
			context.fill();
		}
	}
};
var draw = (context, look, p, alpha) => {
	const { trail } = p;
	trail.forEach(([x, y], k) => mark(context, look, p, x, y, alpha * (k + 1) / (trail.length + 2)));
	mark(context, look, p, p.x, p.y, alpha);
	context.globalAlpha = 1;
};
//#endregion
//#region src/shell/screensaver.js
var ends = ["pointerdown", "keydown"];
var showScreensaver = () => {
	const root = document.documentElement;
	if ("screensaver" in root.dataset) return;
	root.dataset.screensaver = "";
	const swallow = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};
	const end = (event) => {
		swallow(event);
		for (const name of ends) window.removeEventListener(name, end, true);
		delete root.dataset.screensaver;
		if (event.type === "pointerdown") {
			window.addEventListener("click", swallow, {
				capture: true,
				once: true
			});
			setTimeout(() => window.removeEventListener("click", swallow, true), 600);
		}
	};
	setTimeout(() => {
		for (const name of ends) window.addEventListener(name, end, true);
	});
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
	const saved = load("theme");
	const theme = renamed[saved] || saved;
	return themes.some(([id]) => id === theme) ? theme : defaultTheme;
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
	fireworks: fireworksOn(page, loadTheme()),
	motion: loadMotion(),
	howTo: false,
	about: false,
	share: null,
	backup: null,
	glitches: false,
	effects: loadEffects(),
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
var once = [
	27,
	113,
	78,
	72,
	80
];
var shortcut = (event, state, actions) => {
	if (typing(event) || event.ctrlKey || event.metaKey || event.altKey) return null;
	if (event.repeat && once.includes(event.keyCode)) return null;
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
	toggleGlitches: () => ({ glitches }) => ({
		menu: null,
		glitches: !glitches
	}),
	setEffect: ([id, on]) => ({ effects }) => {
		const next = {
			...effects,
			[id]: on
		};
		saveEffects(next);
		return { effects: next };
	},
	resetEffects: () => () => {
		const next = defaultEffects();
		saveEffects(next);
		return { effects: next };
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
		const { id, draft, opacity } = state.backgroundSettings;
		if (opacity !== void 0) actions.changeOpacity(100);
		if (id) actions.changeBackgroundSettings({
			...defaults(id),
			animated: draft.animated
		});
	},
	toggleAnimated: () => ({ theme, backgrounds }) => {
		const id = backgroundFor(theme);
		if (!id) return { menu: null };
		const next = {
			...backgrounds,
			[id]: {
				...backgrounds[id],
				animated: !backgrounds[id].animated
			}
		};
		saveSettings(next);
		configure(id, next[id]);
		return {
			menu: null,
			backgrounds: next
		};
	},
	screensaver: () => (state, actions) => {
		actions.pause(true);
		showScreensaver();
		return { menu: null };
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
	toggleFireworks: () => ({ fireworks, page, theme }) => {
		const key = fireworksKey(page, theme);
		save(key, key === "fireworks" ? fireworks ? "off" : "" : fireworks ? "" : "on");
		return {
			menu: null,
			fireworks: !fireworks
		};
	},
	setMotion: (motion) => {
		saveMotion(motion);
		return {
			menu: null,
			motion
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
	setTheme: (theme) => ({ page }) => {
		save("theme", theme);
		document.documentElement.dataset.theme = theme;
		return {
			menu: null,
			theme,
			fireworks: fireworksOn(page, theme)
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
//#region src/shell/DisplayMenu.jsx
var pictures = {
	classic: "data:image/webp;base64,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",
	matrix: "data:image/webp;base64,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",
	nord: new URL("nord.webp", import.meta.url).href,
	solarized: "data:image/webp;base64,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",
	"solarized-phosphor": "data:image/webp;base64,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",
	synthwave: "data:image/webp;base64,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",
	terafox: "data:image/webp;base64,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",
	vaporwave: new URL("vaporwave.webp", import.meta.url).href
};
var zoomItems = (state, actions) => {
	const { scale, maximised } = state.zoom;
	return [
		/* @__PURE__ */ h(SubMenuItem, {
			name: "Zoom In",
			hotKey: "+",
			disabled: scale >= steps[steps.length - 1],
			onClick: () => actions.zoom(1)
		}),
		/* @__PURE__ */ h(SubMenuItem, {
			name: "Zoom Out",
			hotKey: "-",
			disabled: scale <= steps[0],
			onClick: () => actions.zoom(-1)
		}),
		/* @__PURE__ */ h(SubMenuItem, {
			name: "Actual Size",
			checked: !maximised && scale === 1,
			onClick: () => actions.zoom(0)
		}),
		/* @__PURE__ */ h(SubMenuItem, {
			name: "Maximise",
			checked: maximised,
			onClick: () => actions.maximise()
		}),
		/* @__PURE__ */ h(Separator, null)
	];
};
var DisplayMenu = ({ state, actions }, children) => /* @__PURE__ */ h(MenuItem, {
	name: "Display",
	type: "display",
	active: state.menu,
	onChange: actions.toggleMenu
}, isGame(state.page) && zoomItems(state, actions), themes.map(([theme, name]) => /* @__PURE__ */ h(SubMenuItem, {
	name,
	icon: pictures[theme],
	checked: state.theme === theme,
	onClick: () => actions.setTheme(theme)
})), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, { name: "Motion" }, motions.map(([motion, name]) => /* @__PURE__ */ h(SubMenuItem, {
	name,
	checked: state.motion === motion,
	onClick: () => actions.setMotion(motion)
}))), (backgroundFor(state.theme) || isGame(state.page)) && /* @__PURE__ */ h(Separator, null), backgroundFor(state.theme) ? /* @__PURE__ */ h(SubMenuItem, {
	name: "Background Settings...",
	onClick: actions.toggleBackgroundSettings
}) : isGame(state.page) && /* @__PURE__ */ h(SubMenuItem, {
	name: "Window Settings...",
	onClick: actions.toggleBackgroundSettings
}), backgroundFor(state.theme) && /* @__PURE__ */ h(SubMenuItem, {
	name: "Animated",
	checked: state.backgrounds[backgroundFor(state.theme)].animated,
	onClick: actions.toggleAnimated
}), isGame(state.page) && /* @__PURE__ */ h(SubMenuItem, {
	name: "Hide Window",
	checked: state.glass.hidden,
	onClick: actions.toggleHideWindow
}), isGame(state.page) && /* @__PURE__ */ h(SubMenuItem, {
	name: "Fireworks",
	checked: state.fireworks,
	onClick: actions.toggleFireworks
}), effectsOf(state.theme).length > 0 && /* @__PURE__ */ h(SubMenuItem, {
	name: "Glitches...",
	onClick: actions.toggleGlitches
}), children);
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
var SubMenuItem = ({ key, name, hotKey, checked, disabled, onClick, icon }, children) => /* @__PURE__ */ h("li", {
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
}, /* @__PURE__ */ h("path", { d: "M0 4.5L2.5 7 7 2.5V0L2.5 4.5 0 2v2.5z" })), icon && /* @__PURE__ */ h("img", {
	class: Menu_module_default.icon,
	src: icon,
	alt: "",
	width: "16",
	height: "16"
}), name, hotKey && /* @__PURE__ */ h("span", { class: Menu_module_default.hotKey }, hotKey), children.length > 0 && /* @__PURE__ */ h("svg", {
	class: Menu_module_default.arrow,
	width: "4",
	height: "7"
}, /* @__PURE__ */ h("path", { d: "M0 0L4 3.5 0 7z" }))), children.length > 0 && /* @__PURE__ */ h("div", { class: Menu_module_default.flyout }, /* @__PURE__ */ h("ul", { class: Menu_module_default.list }, children)));
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
}), /* @__PURE__ */ h(Separator, null), resumeItems(state, actions), gameLinks("minesweeper")), /* @__PURE__ */ h(DisplayMenu, {
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
	["sudoku", "Sudoku"],
	["futoshiki", "Futoshiki"],
	["nonograms", "Nonograms"],
	["lightup", "Light Up"],
	["bridges", "Bridges"],
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
var dailyNote = (menu, prefix) => menu && menu.game && readDaily(prefix).done ? "Solved" : void 0;
var resultText = (name, link, { time, streak }, day = dayOf()) => `Puzzles Plus ${name} daily ${day}: solved${time ? ` in ${time} s` : ""}${streak > 1 ? `, ${streak} days in a row` : ""}\n${link}`;
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
var GlitchSettings_module_default = { group: "GlitchSettings_group" };
//#endregion
//#region src/shell/GlitchSettings.jsx
var listed = (names) => names.map((name, k) => k ? name.toLowerCase() : name).join(", ").replace(/, ([^,]*)$/, " and $1");
var Row = ({ effect, on, actions }) => /* @__PURE__ */ h("label", { class: BackgroundSettings_module_default.row }, /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.name }, effect.name), /* @__PURE__ */ h("input", {
	type: "checkbox",
	class: BackgroundSettings_module_default.check,
	checked: on,
	onchange: (event) => actions.setEffect([effect.id, event.target.checked])
}));
var GlitchSettings = ({ key, state, actions }) => {
	const list = effectsOf(state.theme);
	const now = list.filter((effect) => effect.glitch);
	const always = list.filter((effect) => !effect.glitch);
	const moving = now.filter((effect) => effect.moving).map((effect) => effect.name);
	return /* @__PURE__ */ h(Overlay, {
		key,
		onKeyDown: (event) => event.keyCode === 27 && actions.toggleGlitches()
	}, /* @__PURE__ */ h(Dialog, {
		title: "Glitches",
		onClose: actions.toggleGlitches
	}, /* @__PURE__ */ h("form", {
		class: BackgroundSettings_module_default.root,
		autocomplete: "off",
		onsubmit: (event) => {
			event.preventDefault();
			actions.toggleGlitches();
		}
	}, now.length > 0 && /* @__PURE__ */ h("p", { class: GlitchSettings_module_default.group }, "Now and then"), now.map((effect) => /* @__PURE__ */ h(Row, {
		effect,
		on: state.effects[effect.id],
		actions
	})), always.length > 0 && /* @__PURE__ */ h("p", { class: GlitchSettings_module_default.group }, "All the time"), always.map((effect) => /* @__PURE__ */ h(Row, {
		effect,
		on: state.effects[effect.id],
		actions
	})), /* @__PURE__ */ h("p", { class: BackgroundSettings_module_default.credit }, moving.length ? `${listed(moving)} show only over the animated background. ` : "", "Nothing glitches under Reduced Motion."), /* @__PURE__ */ h("div", { class: BackgroundSettings_module_default.footer }, /* @__PURE__ */ h(Button, { onCreate: (el) => el.focus() }, /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.button }, "OK")), /* @__PURE__ */ h(Button, {
		type: "button",
		onClick: actions.resetEffects
	}, /* @__PURE__ */ h("span", { class: BackgroundSettings_module_default.button }, "Defaults"))))));
};
//#endregion
//#region src/shell/avatar.png
var avatar_default = new URL("avatar.png", import.meta.url).href;
//#endregion
//#region src/shell/icons/minesweeper.png
var minesweeper_default = "data:image/png;base64,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";
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
//#region src/shell/icons/lightup.png
var lightup_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAyklEQVR4nO1VwQnDMAw8m8zQRbpAvEnewc/+Ff/7NH5nE3uBLtIlWkoKKQ1RHWolBHIvCdk6fNJh1XUdxFDXdQWgaZq5E33f0+U0V3XXe0qJ6Q5AQxj6IPiFQ6LtJVJrOJlYr9IfVQAvgkw42w4B+ZB/K5fA2ZbsR5zNoRd0Pz+GlOz4mjIEb9wU9upk8sH5MXV+wZxzh0w+yG4RFvZd18mJ/VeJ9Sr/n2+xRTFGQYJYuju+CIwxsgQS0FOJygpV7V4iJe1kxdi4CJ6Jq0uagWdxkQAAAABJRU5ErkJggg==";
//#endregion
//#region src/shell/icons/futoshiki.png
var futoshiki_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAA3UlEQVR4nO1V2wnDMAxUTAbRKBklo3gUj+JRNEpp1X4UnxQrRJRCDoPB6GGfrNPSe6dMlNToRLTqVmv17epgMOnyTkBErTXLdN93eD7jkk5RgafM7PjItg32omsqwWF0Hj6eCItgL5BARELRFfD64Rpw7yM/isALlCKLKEY5rAJ8fdMZihSwBvTjTia7mxzMuCx/L3YFnlp/8QSK1U1X5Sgwut9TIaQXedXtHjg2oNg9tcgSLwj+IKvR5IVZNY1en9whCOWaT+QQ4wWXaREbNcAU+TMkNKPugXOIdIoerSxqkc/Se+wAAAAASUVORK5CYII=";
//#endregion
//#region src/shell/icons/bridges.png
var bridges_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAABGElEQVR4nNWW4RGCMAyFY49BGCVsklEc5W1iR2EUT0GobdIGpXf6fpaveSlJA5cYI/XUQET9PJj5YUBEInJ6dADrCTJlZnhylppwqG+g6uE8cPDEEm3dCQf1we0lMrb5YaUGRDRN07KTEo3Xvdm4BTcMLPoDWDfY8ko1X/e8RVCHzS7alL3WuirwfgIAW3HKjPDe4H44eO4UtPU4igcOzViwb3LpUcJKkQEsHZlW1dIWMW1iV5HPUvh7g6FcEhFObhN84/pVLm4YqBM4Gh3Jc+4tIrU2tSYwF4GsxTLIYE3g7JbyjDS1OpyeQy/y9JT66Cj8S+N6ND44/zmuibj7uIYP/mpcwwHr49qKSMfh1eBQ0EO69P59vwN18buNmYZVCAAAAABJRU5ErkJggg==";
//#endregion
//#region src/shell/icons/help.svg
var help_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%20shape-rendering='crispEdges'%3e%3cpath%20fill='%23000'%20d='M6%203h20v24H8v2h18v2H6z'/%3e%3cpath%20fill='%23a01e1e'%20d='M7%204h18v22H7z'/%3e%3cpath%20fill='%23d85a5a'%20d='M9%204h2v22H9z'/%3e%3cpath%20fill='%23fff'%20d='M8%2027h18v1H8z'/%3e%3cpath%20fill='%23ffd34e'%20d='M14%208h7v1h1v4h-1v1h-2v2h-3v-3h1v-1h2v-3h-2v2h-3V9h1z%20M16%2018h3v3h-3z'/%3e%3c/svg%3e";
//#endregion
//#region src/shell/icons/home.svg
var home_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%20shape-rendering='crispEdges'%3e%3cpath%20fill='%23000'%20d='M16%203l14%2013h-4v13H6V16H2z'/%3e%3cpath%20fill='%23c04040'%20d='M16%205l11%2010H5z'/%3e%3cpath%20fill='%23e8e8e8'%20d='M8%2016h16v11H8z'/%3e%3cpath%20fill='%236a8fd8'%20d='M14%2020h4v7h-4z'/%3e%3cpath%20fill='%23fff'%20d='M8%2016h16v1H8z'/%3e%3c/svg%3e";
//#endregion
//#region src/shell/Taskbar.jsx
var icons = {
	minesweeper: minesweeper_default,
	takuzu: takuzu_default,
	nonograms: nonograms_default,
	sudoku: sudoku_default,
	2048: _2048_default,
	lightup: lightup_default,
	futoshiki: futoshiki_default,
	bridges: bridges_default
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
	const to = event.relatedTarget;
	if (!(to && to.closest && to.closest("[data-start]"))) actions.closeMenu();
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
			"data-start": true,
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
		}), /* @__PURE__ */ h("span", { class: Taskbar_module_default.startLabel }, "Start"))), /* @__PURE__ */ h("div", { class: Taskbar_module_default.tasks }, games.map(([id, title]) => /* @__PURE__ */ h("button", {
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
		/* @__PURE__ */ h("div", {
			key: "looks",
			id: "looks"
		}),
		open && /* @__PURE__ */ h("div", {
			key: "start",
			class: Taskbar_module_default.menu,
			tabindex: -1,
			"data-start": true,
			onfocusout: leave(actions)
		}, /* @__PURE__ */ h("div", { class: Taskbar_module_default.banner }, "Puzzles ", /* @__PURE__ */ h("b", null, "Plus")), /* @__PURE__ */ h("ul", { class: Taskbar_module_default.list }, state.page !== "home" && /* @__PURE__ */ h(StartItem, {
			icon: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%20shape-rendering='crispEdges'%3e%3cpath%20fill='%23000'%20d='M16%203l14%2013h-4v13H6V16H2z'/%3e%3cpath%20fill='%23c04040'%20d='M16%205l11%2010H5z'/%3e%3cpath%20fill='%23e8e8e8'%20d='M8%2016h16v11H8z'/%3e%3cpath%20fill='%236a8fd8'%20d='M14%2020h4v7h-4z'/%3e%3cpath%20fill='%23fff'%20d='M8%2016h16v1H8z'/%3e%3c/svg%3e",
			onClick: go(actions, root)
		}, "Home"), games.map(([id, title]) => /* @__PURE__ */ h(StartItem, {
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
		}, "GitHub"))),
		state.share && /* @__PURE__ */ h(Share, {
			key: "share",
			state: state.share,
			actions
		}),
		state.backup && /* @__PURE__ */ h(Backup, {
			key: "backup",
			state: state.backup,
			actions
		}),
		state.glitches && /* @__PURE__ */ h(GlitchSettings, {
			key: "glitches",
			state,
			actions
		})
	];
};
//#endregion
export { driftclouds as $, shellActions as A, codeOf as B, DisplayMenu as C, listen as D, isGame as E, windowClear as F, unpack as G, pack as H, showScreensaver as I, cx as J, Menu_module_default as K, celebrate as L, shortcut as M, toggleAction as N, prevent as O, undoKey as P, reduced as Q, stopFireworks as R, resumeItems as S, historyKey as T, partsOf as U, copy as V, sharedCode as W, startBackgrounds as X, BackgroundSettings as Y, __vitePreload as Z, MenuItem as _, __exportAll as _t, DAILY_BUDGET as a, substrate as at, HelpMenu as b, dayOf as c, Button as ct, resultText as d, watchWindow as dt, hextrail as et, seedOf as f, load as ft, Menu as g, h as gt, games as h, app as ht, help_default as i, qix as it, shellState as j, shareAction as k, finish as l, Overlay as lt, gameLinks as m, save as mt, icons as n, neon as nt, clearDaily as o, truchet as ot, special as p, remove as pt, Boss as q, home_default as r, phosphor as rt, dailyNote as s, Dialog as st, Taskbar as t, matrix as tt, readDaily as u, hangBelow as ut, Separator as v, gameKey as w, SizeMenu as x, SubMenuItem as y, SITE as z };
