import { B as Menu_module_default, C as resumeItems, H as cx, I as windowClear, S as SizeMenu, T as ThemeMenu, Z as Dialog, b as SubMenuItem, h as gameLinks, ot as h, tt as watchWindow, v as MenuItem, w as ViewMenu, x as HelpMenu, y as Separator } from "./HowToPlay-B-GK6Mo_.js";
import { c as SideButton, d as Digit, i as windowProps, l as UndoIcon, n as PausedCover, p as clockDigits, r as WindowControls, s as HintIcon, t as HintPanel, u as Play } from "./Board-BuZpLT6t.js";
import { t as Game_module_default } from "./Game.module-CghLtUtO.js";
import { i as listOf, t as capital } from "./grid-BZP-Z9Tf.js";
var Board2048_module_default = {
	board: "Board2048_board",
	cell: "Board2048_cell",
	tiles: "Board2048_tiles",
	tile: "Board2048_tile",
	beyond: "Board2048_beyond",
	gone: "Board2048_gone",
	hide: "Board2048_hide",
	fresh: "Board2048_fresh",
	grow: "Board2048_grow",
	merged: "Board2048_merged",
	pop: "Board2048_pop"
};
//#endregion
//#region src/2048/rules.js
var sizes = [
	3,
	4,
	5
];
var targets = {
	3: 512,
	4: 2048,
	5: 2048
};
var directions = [
	"left",
	"right",
	"up",
	"down"
];
var arrows = {
	left: "←",
	right: "→",
	up: "↑",
	down: "↓"
};
var lineCache = {};
var linesOf = (n, dir) => lineCache[`${n}${dir}`] ??= Array.from({ length: n }, (_, a) => Array.from({ length: n }, (_, b) => {
	const k = dir === "right" || dir === "down" ? n - 1 - b : b;
	return dir === "left" || dir === "right" ? a * n + k : k * n + a;
}));
var slide = (values, n, dir) => {
	const out = new Array(n * n).fill(0);
	let score = 0;
	const merges = [];
	for (const cells of linesOf(n, dir)) {
		let pos = 0;
		let open = false;
		for (const c of cells) {
			const v = values[c];
			if (!v) continue;
			if (open && out[cells[pos - 1]] === v) {
				out[cells[pos - 1]] = v * 2;
				score += v * 2;
				merges.push(v * 2);
				open = false;
			} else {
				out[cells[pos++]] = v;
				open = true;
			}
		}
	}
	const moved = out.some((v, i) => v !== values[i]);
	return {
		values: out,
		score,
		moved,
		merges
	};
};
var valuesOf = (tiles, n) => {
	const values = new Array(n * n).fill(0);
	for (const t of tiles) if (!t.gone) values[t.cell] = t.value;
	return values;
};
var move = (tiles, n, dir, nextId) => {
	const at = /* @__PURE__ */ new Map();
	for (const t of tiles) if (!t.gone) at.set(t.cell, t);
	const out = [];
	let score = 0;
	let moved = false;
	let id = nextId;
	for (const cells of linesOf(n, dir)) {
		let pos = 0;
		let last = null;
		for (const c of cells) {
			const t = at.get(c);
			if (!t) continue;
			if (last && !last.merged && last.value === t.value) {
				const cell = last.cell;
				last.gone = true;
				out.push({
					...t,
					cell,
					fresh: false,
					merged: false,
					gone: true
				});
				const made = {
					id: id++,
					value: t.value * 2,
					cell,
					fresh: false,
					merged: true,
					gone: false
				};
				out.push(made);
				score += made.value;
				moved = true;
				last = made;
			} else {
				const cell = cells[pos++];
				if (cell !== t.cell) moved = true;
				const kept = {
					...t,
					cell,
					fresh: false,
					merged: false,
					gone: false
				};
				out.push(kept);
				last = kept;
			}
		}
	}
	return {
		tiles: out,
		score,
		moved,
		nextId: id
	};
};
var empties = (values) => values.flatMap((v, i) => v ? [] : [i]);
var spawn = (tiles, n, rng, nextId) => {
	const free = empties(valuesOf(tiles, n));
	if (!free.length) return {
		tiles,
		nextId
	};
	const cell = free[Math.floor(rng() * free.length)];
	const value = rng() < .9 ? 2 : 4;
	return {
		tiles: [...tiles, {
			id: nextId,
			value,
			cell,
			fresh: true,
			merged: false,
			gone: false
		}],
		nextId: nextId + 1
	};
};
var tilesOf$1 = (values, nextId) => {
	let id = nextId;
	const tiles = [];
	values.forEach((value, cell) => {
		if (value) tiles.push({
			id: id++,
			value,
			cell,
			fresh: false,
			merged: false,
			gone: false
		});
	});
	return {
		tiles,
		nextId: id
	};
};
var canMove = (values, n) => {
	for (let i = 0; i < n * n; i++) {
		if (!values[i]) return true;
		if (i % n < n - 1 && values[i] === values[i + 1]) return true;
		if (i + n < n * n && values[i] === values[i + n]) return true;
	}
	return false;
};
var highest = (values) => Math.max(0, ...values);
//#endregion
//#region src/2048/Menu.jsx
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
	name: "Undo",
	hotKey: "Ctrl+Z",
	onClick: () => actions.undo()
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Hint",
	hotKey: "H",
	onClick: () => actions.hint()
}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: "Timer",
	checked: state.timer,
	onClick: actions.toggleTimer
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Track Losses",
	checked: state.trackLosses,
	onClick: actions.toggleTrackLosses
}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: "Best Scores...",
	onClick: actions.toggleBestTime
}), /* @__PURE__ */ h(Separator, null), resumeItems(state, actions), gameLinks("2048")), /* @__PURE__ */ h(SizeMenu, {
	state,
	actions,
	sizes
}), /* @__PURE__ */ h(ViewMenu, {
	state,
	actions
}), /* @__PURE__ */ h(ThemeMenu, {
	state,
	actions
}), /* @__PURE__ */ h(HelpMenu, {
	state,
	actions,
	name: "2048 Plus"
}));
//#endregion
//#region src/2048/motion.js
var still = () => !globalThis.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches;
var stepOf = (element) => {
	const board = element.parentNode && element.parentNode.parentNode;
	const gap = board ? parseFloat(getComputedStyle(board).columnGap) || 0 : 0;
	return element.offsetWidth + gap;
};
var offsetOf = (element) => {
	const value = element.style.translate || getComputedStyle(element).translate;
	if (!value || value === "none") return [0, 0];
	const [x, y = "0"] = value.split(" ");
	return [parseFloat(x) || 0, parseFloat(y) || 0];
};
var glide = (element, from, to) => {
	if (!(from[0] !== to[0] || from[1] !== to[1]) && !element.style.translate) return;
	if (!element.animate || still()) {
		element.style.translate = "";
		return;
	}
	const step = stepOf(element);
	const [ox, oy] = offsetOf(element);
	const dx = (from[0] - to[0]) * step + ox;
	const dy = (from[1] - to[1]) * step + oy;
	const dragged = Boolean(element.style.translate);
	element.style.translate = "";
	if (element.glide) element.glide.cancel();
	if (!dx && !dy) return;
	const left = Math.hypot(dx, dy) / step;
	element.glide = element.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], {
		duration: dragged ? Math.max(60, Math.min(120, left * 120)) : 100,
		easing: dragged ? "cubic-bezier(0.2, 0.6, 0.35, 1)" : "ease-in-out",
		fill: "backwards"
	});
};
var tilesOf = (board) => board && board.querySelectorAll ? board.querySelectorAll("[data-id]") : [];
var hold = (board, offsets) => {
	for (const element of tilesOf(board)) {
		const offset = offsets[element.dataset.id];
		if (!offset) continue;
		if (element.glide) element.glide.finish();
		const step = stepOf(element);
		element.style.translate = `${offset[0] * step}px ${offset[1] * step}px`;
	}
};
var letGo = (board) => {
	for (const element of tilesOf(board)) {
		if (!element.style.translate) continue;
		const [ox, oy] = offsetOf(element);
		element.style.translate = "";
		if (!element.animate || still()) continue;
		element.glide = element.animate([{ translate: `${ox}px ${oy}px` }, { translate: "0 0" }], {
			duration: 150,
			easing: "cubic-bezier(0.2, 0.6, 0.35, 1)"
		});
	}
};
//#endregion
//#region src/2048/Game.jsx
var running = ({ start, over }) => start >= 0 && !over;
var cellSizes = {
	3: 72,
	4: 60,
	5: 52
};
var Tile = ({ tile, n }) => {
	const k = Math.log2(tile.value);
	const x = tile.cell % n;
	const y = Math.floor(tile.cell / n);
	return /* @__PURE__ */ h("div", {
		key: tile.id,
		"data-id": tile.id,
		"data-k": k,
		class: cx(Board2048_module_default.tile, k > 11 && Board2048_module_default.beyond, tile.fresh && Board2048_module_default.fresh, tile.merged && Board2048_module_default.merged, tile.gone && Board2048_module_default.gone),
		"data-digits": Math.min(5, String(tile.value).length),
		style: {
			"--x": x,
			"--y": y,
			"--k": k
		},
		onupdate: (element, old) => glide(element, [old.style["--x"], old.style["--y"]], [x, y])
	}, tile.value);
};
var byId = (a, b) => a.id - b.id;
var Board = ({ n, tiles, hidden, onDown }, children) => /* @__PURE__ */ h("div", {
	class: Board2048_module_default.board,
	style: {
		"--n": n,
		"--cell": `${cellSizes[n]}px`
	},
	onpointerdown: onDown
}, Array.from({ length: n * n }, () => /* @__PURE__ */ h("div", { class: Board2048_module_default.cell })), !hidden && /* @__PURE__ */ h("div", { class: Board2048_module_default.tiles }, [...tiles].sort(byId).map((tile) => Tile({
	tile,
	n
}))), children);
var scoreDigits = (score) => Math.max(4, String(score).length);
var Game = ({ key, state, actions }) => {
	const { game, hint } = state;
	const { n, paused } = game;
	return /* @__PURE__ */ h(Dialog, {
		clear: windowClear(state),
		key,
		hidden: state.windowState !== "open",
		title: state.theme === "classic" ? "2048" : "2048 Plus",
		titleHint: "Double-click for 100% zoom",
		onTitleDoubleClick: () => actions.zoom(0),
		controls: /* @__PURE__ */ h(WindowControls, windowProps(state, actions, paused, running(game))),
		onClose: actions.close,
		onCreate: (dialog) => {
			watchWindow(dialog, actions.fit);
			actions.fit();
		}
	}, /* @__PURE__ */ h(Menu, {
		state,
		actions
	}), /* @__PURE__ */ h("div", { class: Game_module_default.root }, /* @__PURE__ */ h("div", { class: Game_module_default.scoreboard }, /* @__PURE__ */ h(Digit, {
		value: game.score,
		digits: scoreDigits(game.score)
	}), /* @__PURE__ */ h("div", { class: Game_module_default.buttons }, /* @__PURE__ */ h(SideButton, {
		title: "Undo (Ctrl+Z)",
		disabled: !game.history.length || paused,
		onClick: actions.undo
	}, /* @__PURE__ */ h(UndoIcon, null)), /* @__PURE__ */ h(Play, {
		pressed: false,
		lose: game.over && !game.reached,
		win: game.over && game.reached,
		onReset: actions.reset
	}), /* @__PURE__ */ h(SideButton, {
		title: "Hint (H)",
		disabled: game.over || paused,
		onClick: actions.hint
	}, /* @__PURE__ */ h(HintIcon, null))), /* @__PURE__ */ h(Digit, {
		value: game.time,
		digits: clockDigits(state.theme, game.time),
		blank: !state.timer
	})), /* @__PURE__ */ h(Board, {
		n,
		tiles: game.tiles,
		hidden: paused,
		onDown: actions.swipeStart
	}, paused && /* @__PURE__ */ h(PausedCover, { onResume: () => actions.pause(false) })), hint && !paused && /* @__PURE__ */ h(HintPanel, {
		text: hint.text,
		more: hint.kind === "move" && "guide/#hints"
	})));
};
//#endregion
//#region src/2048/search.js
var corners = (n) => [
	0,
	n - 1,
	n * (n - 1),
	n * n - 1
];
var score = (values, n) => {
	const logs = values.map((v) => v ? Math.log2(v) : 0);
	let free = 0;
	let smooth = 0;
	let mono = 0;
	for (const v of values) if (!v) free++;
	for (let a = 0; a < n; a++) {
		let up = 0;
		let down = 0;
		let left = 0;
		let right = 0;
		for (let b = 0; b + 1 < n; b++) {
			const [r1, r2] = [logs[a * n + b], logs[a * n + b + 1]];
			const [c1, c2] = [logs[b * n + a], logs[(b + 1) * n + a]];
			if (r1 > r2) left += r1 - r2;
			else right += r2 - r1;
			if (c1 > c2) up += c1 - c2;
			else down += c2 - c1;
			if (r1 && r2) smooth -= Math.abs(r1 - r2);
			if (c1 && c2) smooth -= Math.abs(c1 - c2);
		}
		mono -= Math.min(left, right) + Math.min(up, down);
	}
	const top = Math.max(...logs);
	const cornered = corners(n).some((c) => logs[c] === top) ? top : 0;
	return free * 2.7 + mono * 1.5 + smooth * .15 + cornered * 1.2;
};
var SAMPLE = 6;
var chance = (values, n, depth) => {
	const free = empties(values);
	if (!free.length) return score(values, n);
	const step = Math.max(1, Math.floor(free.length / SAMPLE));
	let total = 0;
	let count = 0;
	for (let k = 0; k < free.length; k += step) {
		const c = free[k];
		for (const [v, p] of [[2, .9], [4, .1]]) {
			const next = values.slice();
			next[c] = v;
			total += p * best(next, n, depth);
		}
		count++;
	}
	return total / count;
};
var best = (values, n, depth) => {
	if (depth === 0) return score(values, n);
	let top = -1e9;
	for (const dir of directions) {
		const { values: next, moved } = slide(values, n, dir);
		if (moved) top = Math.max(top, chance(next, n, depth - 1));
	}
	return top;
};
var rank = (values, n, depth = 2) => directions.map((dir) => ({
	dir,
	...slide(values, n, dir)
})).filter((m) => m.moved).map((m) => ({
	...m,
	value: chance(m.values, n, depth - 1)
})).sort((a, b) => b.value - a.value);
var inCorner = (values, n) => corners(n).some((c) => values[c] === highest(values));
var a = (value) => String(value).startsWith("8") ? "an" : "a";
var suggest = (values, n) => {
	const ranked = rank(values, n);
	if (!ranked.length) return null;
	const [pick, ...others] = ranked;
	const top = highest(values);
	const reasons = [];
	if (pick.merges.length) {
		const biggest = Math.max(...pick.merges);
		const count = pick.merges.length;
		reasons.push(count === 1 ? `makes ${a(biggest)} ${biggest}` : `makes ${count} merges, the biggest ${a(biggest)} ${biggest}`);
	}
	const cornered = inCorner(values, n);
	if (cornered && inCorner(pick.values, n)) reasons.push(`keeps your ${top} in its corner`);
	else if (!cornered && inCorner(pick.values, n)) reasons.push(`moves your ${top} into a corner`);
	const free = empties(pick.values).length;
	reasons.push(`leaves ${free} cell${free === 1 ? "" : "s"} free`);
	let text = `${arrows[pick.dir]} ${capital(pick.dir)}: it ${listOf(reasons)}.`;
	if (cornered && others.length && others.every((m) => !inCorner(m.values, n))) text += ` Every other move would pull your ${top} out of its corner.`;
	else if (!others.length) text += " It is the only move left.";
	return {
		dir: pick.dir,
		text
	};
};
//#endregion
export { hold as a, highest as c, spawn as d, targets as f, running as i, move as l, valuesOf as m, Board as n, letGo as o, tilesOf$1 as p, Game as r, canMove as s, suggest as t, sizes as u };
