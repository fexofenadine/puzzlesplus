import { J as cx, _t as h } from "./HowToPlay-BoT0kLlt.js";
var LightUp_module_default = {
	field: "LightUp_field",
	active: "LightUp_active LightUp_field",
	inactive: "LightUp_inactive LightUp_field"
};
var sizes = [
	7,
	10,
	14
];
var emptyBoard = (n) => new Int8Array(n * n).fill(-1);
var cellName = (i, n) => `row ${Math.floor(i / n) + 1}, column ${i % n + 1}`;
var besideCache = {};
var besideOf = (n) => besideCache[n] ??= Array.from({ length: n * n }, (_, i) => {
	const x = i % n;
	const y = Math.floor(i / n);
	const list = [];
	if (y > 0) list.push(i - n);
	if (x > 0) list.push(i - 1);
	if (x < n - 1) list.push(i + 1);
	if (y < n - 1) list.push(i + n);
	return list;
});
var sightCache = /* @__PURE__ */ new WeakMap();
var sightsOf = (layout, n) => {
	let sights = sightCache.get(layout);
	if (sights) return sights;
	sights = Array.from({ length: n * n }, (_, i) => {
		if (layout[i] !== -1) return [];
		const x = i % n;
		const y = Math.floor(i / n);
		const seen = [];
		for (const [dx, dy] of [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
		]) {
			let cx = x + dx;
			let cy = y + dy;
			while (cx >= 0 && cy >= 0 && cx < n && cy < n && layout[cy * n + cx] === -1) {
				seen.push(cy * n + cx);
				cx += dx;
				cy += dy;
			}
		}
		return seen;
	});
	sightCache.set(layout, sights);
	return sights;
};
var litOf = (layout, board, n) => {
	const sights = sightsOf(layout, n);
	const lit = new Uint8Array(n * n);
	for (let i = 0; i < n * n; i++) {
		if (board[i] !== 1 || layout[i] !== -1) continue;
		lit[i] = 1;
		for (const c of sights[i]) lit[c] = 1;
	}
	return lit;
};
var darkLeft = (layout, board, n) => {
	const lit = litOf(layout, board, n);
	let left = 0;
	for (let i = 0; i < n * n; i++) if (layout[i] === -1 && !lit[i]) left++;
	return left;
};
var breaks = (layout, board, n) => {
	const sights = sightsOf(layout, n);
	const beside = besideOf(n);
	const lit = litOf(layout, board, n);
	const found = [];
	for (let i = 0; i < n * n; i++) {
		if (layout[i] === -1) {
			if (board[i] !== 1) continue;
			const other = sights[i].find((c) => c > i && board[c] === 1);
			if (other !== void 0) found.push({
				cells: [i, other],
				text: "These two bulbs light each other."
			});
			continue;
		}
		if (layout[i] === 5) continue;
		const around = beside[i].filter((c) => layout[c] === -1);
		const bulbs = around.filter((c) => board[c] === 1);
		const free = around.filter((c) => board[c] === -1 && !lit[c]);
		if (bulbs.length > layout[i]) found.push({
			cells: [i, ...bulbs],
			text: `The ${layout[i]} at ${cellName(i, n)} has ${bulbs.length} bulbs beside it, too many.`
		});
		else if (bulbs.length + free.length < layout[i]) found.push({
			cells: [i, ...around.filter((c) => board[c] !== 1)],
			text: `The ${layout[i]} at ${cellName(i, n)} has too little room left beside it for its bulbs.`
		});
	}
	return found;
};
var violations = (layout, board, n) => new Set(breaks(layout, board, n).flatMap((b) => b.cells));
var solved = (layout, board, n) => {
	if (darkLeft(layout, board, n)) return false;
	const sights = sightsOf(layout, n);
	const beside = besideOf(n);
	for (let i = 0; i < n * n; i++) if (layout[i] === -1) {
		if (board[i] === 1 && sights[i].some((c) => board[c] === 1)) return false;
	} else if (layout[i] !== 5) {
		if (beside[i].filter((c) => layout[c] === -1 && board[c] === 1).length !== layout[i]) return false;
	}
	return true;
};
//#endregion
//#region src/lightup/solver.js
var settle = (layout, n, board, why) => {
	const sights = sightsOf(layout, n);
	const beside = besideOf(n);
	for (;;) {
		let changed = false;
		const lit = litOf(layout, board, n);
		const light = (i) => {
			board[i] = 1;
			lit[i] = 1;
			for (const c of sights[i]) {
				if (board[c] === 1) return false;
				lit[c] = 1;
			}
			changed = true;
			return true;
		};
		for (let i = 0; i < n * n; i++) {
			if (layout[i] === -1) {
				if (board[i] === 1 && sights[i].some((c) => board[c] === 1)) {
					if (why) why.dark = i;
					return false;
				}
				continue;
			}
			if (layout[i] === 5) continue;
			let bulbs = 0;
			const free = [];
			for (const c of beside[i]) {
				if (layout[c] !== -1) continue;
				if (board[c] === 1) bulbs++;
				else if (board[c] === -1 && !lit[c]) free.push(c);
			}
			if (bulbs > layout[i] || bulbs + free.length < layout[i]) {
				if (why) why.wall = i;
				return false;
			}
			if (!free.length) continue;
			if (bulbs === layout[i]) {
				for (const c of free) board[c] = 0;
				changed = true;
			} else if (bulbs + free.length === layout[i]) {
				for (const c of free) if (lit[c] || !light(c)) {
					if (why) why.wall = i;
					return false;
				}
			}
		}
		for (let i = 0; i < n * n; i++) {
			if (layout[i] !== -1 || lit[i]) continue;
			let only = board[i] === -1 ? i : -1;
			let count = only < 0 ? 0 : 1;
			for (const c of sights[i]) if (board[c] === -1 && !lit[c]) {
				only = c;
				if (++count > 1) break;
			}
			if (!count || count === 1 && !light(only)) {
				if (why) why.dark = i;
				return false;
			}
		}
		if (!changed) return true;
	}
};
var pick = (layout, n, board) => {
	const sights = sightsOf(layout, n);
	const lit = litOf(layout, board, n);
	let best = -1;
	let fewest = Infinity;
	for (let i = 0; i < n * n; i++) {
		if (layout[i] !== -1 || lit[i]) continue;
		const count = (board[i] === -1 ? 1 : 0) + sights[i].filter((c) => board[c] === -1 && !lit[c]).length;
		if (count < fewest) {
			fewest = count;
			best = i;
		}
	}
	return best;
};
var search = (layout, n, board, found) => {
	if (!settle(layout, n, board)) return false;
	const dark = pick(layout, n, board);
	if (dark < 0) return found(board);
	const sights = sightsOf(layout, n);
	const lit = litOf(layout, board, n);
	const places = [dark, ...sights[dark]].filter((c) => board[c] === -1 && !lit[c]);
	const base = board.slice();
	for (const place of places) {
		const trial = base.slice();
		trial[place] = 1;
		if (search(layout, n, trial, found)) return true;
		base[place] = 0;
	}
	return false;
};
var countSolutions = (layout, n, limit = 2) => {
	let count = 0;
	search(layout, n, emptyBoard(n), () => ++count >= limit);
	return count;
};
var solve = (layout, n) => {
	let solution = null;
	search(layout, n, emptyBoard(n), (board) => {
		solution = Int8Array.from(board, (v) => v === 1 ? 1 : 0);
		return true;
	});
	return solution;
};
//#endregion
//#region src/lightup/techniques.js
var levels = [
	"easy",
	"medium",
	"hard",
	"expert"
];
var step = (technique, level, place, sources, say) => ({
	technique,
	level,
	place,
	sources,
	get text() {
		return say();
	}
});
var plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;
var read = (layout, board, n) => {
	const lit = litOf(layout, board, n);
	const free = (i) => layout[i] === -1 && board[i] === -1 && !lit[i];
	return {
		lit,
		free,
		sights: sightsOf(layout, n),
		beside: besideOf(n)
	};
};
var walls = (layout, board, n, { free, beside }) => {
	const list = [];
	for (let i = 0; i < n * n; i++) {
		if (layout[i] === -1 || layout[i] === 5) continue;
		const around = beside[i].filter((c) => layout[c] === -1);
		list.push({
			wall: i,
			number: layout[i],
			bulbs: around.filter((c) => board[c] === 1),
			open: around.filter(free)
		});
	}
	return list;
};
var darks = (layout, board, n, { lit, free, sights }) => {
	const list = [];
	for (let i = 0; i < n * n; i++) {
		if (layout[i] !== -1 || lit[i]) continue;
		list.push({
			dark: i,
			places: [...free(i) ? [i] : [], ...sights[i].filter(free)]
		});
	}
	return list;
};
var full = (layout, board, n) => {
	return walls(layout, board, n, read(layout, board, n)).filter(({ number, bulbs, open }) => bulbs.length === number && open.length).map(({ wall, number, bulbs, open }) => step("full", 0, open.map((c) => [c, 0]), [wall, ...bulbs], () => number ? `The ${number} at ${cellName(wall, n)} has its ${plural(number, "bulb")}, so no other cell beside it holds one.` : `The 0 at ${cellName(wall, n)} takes no bulbs, so no cell beside it holds one.`));
};
var need = (layout, board, n) => {
	return walls(layout, board, n, read(layout, board, n)).filter(({ number, bulbs, open }) => open.length && bulbs.length + open.length === number).map(({ wall, number, bulbs, open }) => step("need", 0, open.map((c) => [c, 1]), [wall, ...bulbs], () => `The ${number} at ${cellName(wall, n)} needs ${plural(number - bulbs.length, "more bulb")} and has just ${plural(open.length, "free cell")} beside it, so ${open.length === 1 ? "it holds a bulb" : "each holds a bulb"}.`));
};
var boxed = (layout, board, n) => {
	return darks(layout, board, n, read(layout, board, n)).filter(({ dark, places }) => places.length === 1 && places[0] === dark).map(({ dark }) => step("boxed", 0, [[dark, 1]], [], () => `No other free cell can light the cell at ${cellName(dark, n)}, so it holds a bulb itself.`));
};
var lone = (layout, board, n) => {
	const view = read(layout, board, n);
	const seen = /* @__PURE__ */ new Set();
	return darks(layout, board, n, view).filter(({ dark, places }) => places.length === 1 && places[0] !== dark).filter(({ places }) => !seen.has(places[0]) && seen.add(places[0])).map(({ dark, places }) => step("lone", 1, [[places[0], 1]], [dark], () => `The cell at ${cellName(dark, n)} is dark and can't hold a bulb, and only one free cell can still light it, so the bulb goes there.`));
};
var squeeze = (layout, board, n) => {
	const view = read(layout, board, n);
	const { free, sights } = view;
	const steps = [];
	const crossed = /* @__PURE__ */ new Set();
	for (const { wall, number, bulbs, open } of walls(layout, board, n, view)) {
		const wanted = number - bulbs.length;
		if (wanted <= 0 || open.length <= wanted) continue;
		const near = new Set(open.flatMap((c) => sights[c]));
		for (const c of near) {
			if (!free(c) || open.includes(c) || crossed.has(c)) continue;
			const taken = open.filter((o) => sights[c].includes(o));
			if (open.length - taken.length >= wanted) continue;
			crossed.add(c);
			steps.push(step("squeeze", 2, [[c, 0]], [wall, ...taken], () => `A bulb here would light ${plural(taken.length, "free cell")} beside the ${number} at ${cellName(wall, n)}, leaving it too few for ${plural(wanted, "more bulb")}, so this cell holds none.`));
		}
	}
	return steps;
};
var starve = (layout, board, n) => {
	const view = read(layout, board, n);
	const { free, sights } = view;
	const steps = [];
	const crossed = /* @__PURE__ */ new Set();
	for (const { dark, places } of darks(layout, board, n, view)) {
		if (places.length < 2) continue;
		for (const c of sights[places[0]]) {
			if (!free(c) || crossed.has(c) || places.includes(c)) continue;
			if (!places.every((p) => sights[c].includes(p))) continue;
			crossed.add(c);
			steps.push(step("starve", 2, [[c, 0]], [dark, ...places], () => `A bulb here would light every cell that could still light the cell at ${cellName(dark, n)}, and leave it dark for good, so this cell holds none.`));
		}
	}
	return steps;
};
var broke = (why, layout, n) => why.wall !== void 0 ? `the ${layout[why.wall]} at ${cellName(why.wall, n)} could not be met` : `the cell at ${cellName(why.dark, n)} could not be lit properly`;
var whatIf = (layout, board, n) => {
	const { free } = read(layout, board, n);
	for (let i = 0; i < n * n; i++) {
		if (!free(i)) continue;
		for (const value of [1, 0]) {
			const trial = board.slice();
			trial[i] = value;
			const why = {};
			if (settle(layout, n, trial, why)) continue;
			const sources = [why.wall !== void 0 ? why.wall : why.dark];
			return [step("what-if", 3, [[i, value === 1 ? 0 : 1]], sources, () => value === 1 ? `If this cell held a bulb, following the plain rules from there, ${broke(why, layout, n)}. So it holds none.` : `If this cell held no bulb, following the plain rules from there, ${broke(why, layout, n)}. So it holds a bulb.`)];
		}
	}
	return [];
};
var techniques = [
	[
		need,
		full,
		boxed
	],
	[lone],
	[squeeze, starve],
	[whatIf]
];
var nextSteps = (layout, board, n, top = levels.length - 1) => {
	for (let level = 0; level <= top; level++) for (const technique of techniques[level]) {
		const steps = technique(layout, board, n);
		if (steps.length) return {
			level,
			steps
		};
	}
	return { steps: [] };
};
var apply = (board, steps) => {
	for (const { place } of steps) for (const [i, value] of place) {
		if (board[i] !== -1 && board[i] !== value) return false;
		board[i] = value;
	}
	return true;
};
var rate = (layout, n, top = levels.length - 1) => {
	const board = new Int8Array(n * n).fill(-1);
	let hardest = 0;
	while (darkLeft(layout, board, n)) {
		const { level, steps } = nextSteps(layout, board, n, top);
		if (!steps.length || !apply(board, steps)) return null;
		hardest = Math.max(hardest, level);
	}
	if (!settle(layout, n, board.slice())) return null;
	return {
		level: hardest,
		solution: Int8Array.from(board, (v) => v === 1 ? 1 : 0)
	};
};
var LightUpCell_module_default = {
	root: "LightUpCell_root",
	dark: "LightUpCell_dark LightUpCell_root",
	lit: "LightUpCell_lit LightUpCell_root",
	wall: "LightUpCell_wall LightUpCell_root",
	wallDone: "LightUpCell_wallDone",
	wallError: "LightUpCell_wallError",
	bulb: "LightUpCell_bulb",
	cross: "LightUpCell_cross",
	ghost: "LightUpCell_ghost",
	error: "LightUpCell_error",
	cursor: "LightUpCell_cursor",
	hintSource: "LightUpCell_hintSource Board_outline",
	hintPlace: "LightUpCell_hintPlace Board_outline",
	hintWrong: "LightUpCell_hintWrong Board_outline"
};
//#endregion
//#region src/lightup/Cell.jsx
var hintClass = {
	source: LightUpCell_module_default.hintSource,
	bulb: LightUpCell_module_default.hintPlace,
	cross: LightUpCell_module_default.hintPlace,
	wrong: LightUpCell_module_default.hintWrong
};
var Cell = ({ i, wall, number = wall, value, lit, error, mark, cursor, onPress }) => {
	if (wall !== -1) return /* @__PURE__ */ h("div", { class: cx(LightUpCell_module_default.wall, wall !== 5 && number === 0 && wall !== 0 && LightUpCell_module_default.wallDone, (error || number < 0) && LightUpCell_module_default.wallError, mark && hintClass[mark]) }, wall === 5 ? "" : number);
	const bulb = value === 1 || mark === "bulb" && value !== 0;
	const cross = value === 0 || mark === "cross" && value !== 1;
	return /* @__PURE__ */ h("button", {
		type: "button",
		tabindex: -1,
		class: cx(lit ? LightUpCell_module_default.lit : LightUpCell_module_default.dark, error && LightUpCell_module_default.error, mark && value !== 1 && value !== 0 && LightUpCell_module_default.ghost, mark && hintClass[mark], cursor && LightUpCell_module_default.cursor),
		onpointerdown: (event) => onPress({
			event,
			i
		})
	}, bulb && /* @__PURE__ */ h("i", { class: LightUpCell_module_default.bulb }), cross && !bulb && /* @__PURE__ */ h("i", { class: LightUpCell_module_default.cross }));
};
//#endregion
export { violations as C, solved as S, darkLeft as _, levels as a, sightsOf as b, nextSteps as c, starve as d, whatIf as f, breaks as g, besideOf as h, full as i, rate as l, solve as m, apply as n, lone as o, countSolutions as p, boxed as r, need as s, Cell as t, squeeze as u, emptyBoard as v, LightUp_module_default as w, sizes as x, litOf as y };
