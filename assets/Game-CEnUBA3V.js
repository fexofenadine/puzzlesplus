import { C as DisplayMenu, F as windowClear, J as cx, K as Menu_module_default, S as resumeItems, _ as MenuItem, b as HelpMenu, dt as watchWindow, gt as h, m as gameLinks, s as dailyNote, st as Dialog, v as Separator, x as SizeMenu, y as SubMenuItem } from "./Taskbar-Dz9Nw-2m.js";
import { c as PauseButton, d as Play, f as Digit, i as windowProps, l as SideButton, m as clockDigits, n as PausedCover, r as WindowControls, s as HintIcon, t as HintPanel, u as UndoIcon } from "./Board-C3X6kkCM.js";
import { t as Game_module_default } from "./Game.module-CghLtUtO.js";
import { n as cellName, o as plural, t as capital } from "./grid-BF72XPNL.js";
var Bridges_module_default = {
	field: "Bridges_field",
	active: "Bridges_active Bridges_field",
	inactive: "Bridges_inactive Bridges_field"
};
//#endregion
//#region src/bridges/rules.js
var sizes = [
	7,
	10,
	14
];
var emptyBoard = (links) => new Int8Array(links);
var islandName = (islands, n, i) => `the ${islands[i]} at ${cellName(i, n)}`;
var cache = /* @__PURE__ */ new WeakMap();
var linksOf = (islands, n) => {
	let found = cache.get(islands);
	if (found) return found;
	const links = [];
	const scan = (outer, step, across) => {
		for (let o = 0; o < n; o++) {
			let last = -1;
			for (let k = 0; k < n; k++) {
				const i = across ? o * n + k : k * n + o;
				if (!islands[i]) continue;
				if (last >= 0 && i - last > step) {
					const cells = [];
					for (let c = last + step; c < i; c += step) cells.push(c);
					links.push({
						a: last,
						b: i,
						across,
						cells,
						max: Math.min(2, islands[last], islands[i])
					});
				}
				last = i;
			}
		}
	};
	scan(n, 1, true);
	scan(n, n, false);
	const at = /* @__PURE__ */ new Map();
	const through = /* @__PURE__ */ new Map();
	links.forEach(({ a, b, cells }, l) => {
		for (const i of [a, b]) at.set(i, [...at.get(i) || [], l]);
		for (const c of cells) through.set(c, [...through.get(c) || [], l]);
	});
	const over = links.map(() => []);
	for (const list of through.values()) for (const l of list) for (const o of list) if (l !== o) over[l].push(o);
	found = {
		links,
		at,
		over,
		through
	};
	cache.set(islands, found);
	return found;
};
var islandCells = (islands) => {
	const list = [];
	islands.forEach((v, i) => v && list.push(i));
	return list;
};
var degreesOf = (islands, n, board) => {
	const degree = new Int8Array(n * n);
	linksOf(islands, n).links.forEach(({ a, b }, l) => {
		degree[a] += board[l];
		degree[b] += board[l];
	});
	return degree;
};
var groupsOf = (islands, n, board) => {
	const { links } = linksOf(islands, n);
	const parent = new Map(islandCells(islands).map((i) => [i, i]));
	const find = (i) => {
		while (parent.get(i) !== i) {
			parent.set(i, parent.get(parent.get(i)));
			i = parent.get(i);
		}
		return i;
	};
	links.forEach(({ a, b }, l) => board[l] > 0 && parent.set(find(a), find(b)));
	const groups = /* @__PURE__ */ new Map();
	for (const i of parent.keys()) groups.set(find(i), [...groups.get(find(i)) || [], i]);
	return [...groups.values()];
};
var roomOn = (islands, n, board, degree, l) => {
	const { links, over } = linksOf(islands, n);
	const { a, b, max } = links[l];
	if (over[l].some((o) => board[o] > 0)) return board[l];
	const more = Math.min(max - board[l], islands[a] - degree[a], islands[b] - degree[b]);
	return board[l] + Math.max(0, more);
};
var breaks = (islands, n, board) => {
	const { links, at, over } = linksOf(islands, n);
	const degree = degreesOf(islands, n, board);
	const found = [];
	for (const i of islandCells(islands)) {
		const name = islandName(islands, n, i);
		if (degree[i] > islands[i]) {
			found.push({
				cells: [i],
				text: `${name} has ${plural(degree[i], "bridge")}, too many.`.replace("the", "The")
			});
			continue;
		}
		const reach = (at.get(i) || []).reduce((sum, l) => sum + roomOn(islands, n, board, degree, l) - board[l], 0);
		if (degree[i] + reach < islands[i]) found.push({
			cells: [i],
			text: `${name} can no longer reach its number of bridges.`.replace("the", "The")
		});
	}
	links.forEach((link, l) => {
		const crossed = over[l].find((o) => o > l && board[o] > 0);
		if (board[l] > 0 && crossed !== void 0) found.push({
			cells: [
				link.a,
				link.b,
				links[crossed].a,
				links[crossed].b
			],
			links: [l, crossed],
			text: "These two bridges cross."
		});
	});
	const total = islandCells(islands).length;
	for (const group of groupsOf(islands, n, board)) if (group.length < total && group.every((i) => degree[i] === islands[i])) found.push({
		cells: group,
		text: "These islands have all their bridges, but nothing joins them to the others."
	});
	return found;
};
var violations = (islands, n, board) => new Set(breaks(islands, n, board).flatMap((b) => b.cells));
var solved = (islands, n, board) => {
	const { links, over } = linksOf(islands, n);
	const degree = degreesOf(islands, n, board);
	for (const i of islandCells(islands)) if (degree[i] !== islands[i]) return false;
	for (let l = 0; l < links.length; l++) if (board[l] > 0 && over[l].some((o) => board[o] > 0)) return false;
	return groupsOf(islands, n, board).length === 1;
};
var unfinished = (islands, n, board) => {
	const degree = degreesOf(islands, n, board);
	return islandCells(islands).filter((i) => degree[i] !== islands[i]).length;
};
var linkBetween = (islands, n, a, b) => linksOf(islands, n).links.findIndex((link) => link.a === Math.min(a, b) && link.b === Math.max(a, b));
var stepLink = (islands, n, board, l, back = false) => {
	const { links, over } = linksOf(islands, n);
	const to = (board[l] + (back ? 2 : 1)) % 3;
	if (to > links[l].max) return back ? links[l].max : 0;
	if (to > board[l] && over[l].some((o) => board[o] > 0)) return null;
	return to;
};
//#endregion
//#region src/bridges/solver.js
var startState = (islands, n) => {
	const { links } = linksOf(islands, n);
	return {
		lo: new Int8Array(links.length),
		hi: Int8Array.from(links, (l) => l.max)
	};
};
var copyState = ({ lo, hi }) => ({
	lo: lo.slice(),
	hi: hi.slice()
});
var closedGroups = (islands, n, lo) => {
	const { at } = linksOf(islands, n);
	const total = islandCells(islands).length;
	const sum = (i) => (at.get(i) || []).reduce((s, l) => s + lo[l], 0);
	return groupsOf(islands, n, lo).filter((group) => group.length < total && group.every((i) => sum(i) === islands[i]));
};
var settle = (islands, n, state, why) => {
	const { links, at, over } = linksOf(islands, n);
	const { lo, hi } = state;
	const cells = islandCells(islands);
	for (let changed = true; changed;) {
		changed = false;
		for (let l = 0; l < links.length; l++) {
			if (lo[l] > hi[l]) {
				if (why) why.island = links[l].a;
				return false;
			}
			if (lo[l] === 0) continue;
			for (const o of over[l]) {
				if (lo[o] > 0) {
					if (why) why.island = links[l].a;
					return false;
				}
				if (hi[o] > 0) {
					hi[o] = 0;
					changed = true;
				}
			}
		}
		for (const i of cells) {
			const list = at.get(i) || [];
			let sumLo = 0;
			let sumHi = 0;
			for (const l of list) {
				sumLo += lo[l];
				sumHi += hi[l];
			}
			if (sumLo > islands[i] || sumHi < islands[i]) {
				if (why) why.island = i;
				return false;
			}
			for (const l of list) {
				const most = Math.min(hi[l], islands[i] - (sumLo - lo[l]));
				const least = Math.max(lo[l], islands[i] - (sumHi - hi[l]));
				if (most < hi[l]) {
					hi[l] = most;
					changed = true;
				}
				if (least > lo[l]) {
					lo[l] = least;
					changed = true;
				}
			}
		}
	}
	const closed = closedGroups(islands, n, lo);
	if (closed.length) {
		if (why) why.group = closed[0];
		return false;
	}
	return true;
};
var pick = (islands, n, { lo, hi }) => {
	const { links, at } = linksOf(islands, n);
	let best = -1;
	let fewest = Infinity;
	links.forEach((_, l) => {
		if (lo[l] === hi[l]) return;
		const count = Math.min(...[links[l].a, links[l].b].map((i) => at.get(i).filter((c) => lo[c] < hi[c]).length));
		if (count < fewest) {
			fewest = count;
			best = l;
		}
	});
	return best;
};
var search = (islands, n, state, found, budget = { steps: Infinity }) => {
	if (--budget.steps < 0 || !settle(islands, n, state)) return false;
	const l = pick(islands, n, state);
	if (l < 0) return found(state.lo);
	for (let v = state.hi[l]; v >= state.lo[l]; v--) {
		const trial = copyState(state);
		trial.lo[l] = v;
		trial.hi[l] = v;
		if (search(islands, n, trial, found, budget)) return true;
	}
	return false;
};
var countSolutions = (islands, n, limit = 2, steps = Infinity) => {
	let count = 0;
	const budget = { steps };
	search(islands, n, startState(islands, n), () => ++count >= limit, budget);
	return budget.steps < 0 ? limit : count;
};
var solve = (islands, n) => {
	let solution = null;
	search(islands, n, startState(islands, n), (lo) => {
		solution = lo.slice();
		return true;
	});
	return solution;
};
//#endregion
//#region src/bridges/techniques.js
var levels = [
	"easy",
	"medium",
	"hard",
	"expert"
];
var step = (technique, level, change, sources, say) => ({
	technique,
	level,
	change,
	sources,
	get text() {
		return say();
	}
});
var bridges = (count) => plural(count, "bridge");
var otherEnd = (link, i) => link.a === i ? link.b : link.a;
var readIslands = (islands, n, { lo, hi }) => {
	const { at } = linksOf(islands, n);
	return islandCells(islands).map((i) => {
		const list = at.get(i) || [];
		return {
			i,
			list,
			sumLo: list.reduce((s, l) => s + lo[l], 0),
			sumHi: list.reduce((s, l) => s + hi[l], 0)
		};
	});
};
var need = (islands, n, state) => {
	const { links } = linksOf(islands, n);
	const { lo, hi } = state;
	const steps = [];
	for (const { i, list, sumHi } of readIslands(islands, n, state)) {
		const change = [];
		let target = -1;
		let least = 0;
		let others = 0;
		for (const l of list) {
			const forced = islands[i] - (sumHi - hi[l]);
			if (forced > lo[l]) {
				change.push([
					l,
					forced,
					hi[l]
				]);
				if (forced > least) {
					least = forced;
					target = otherEnd(links[l], i);
					others = sumHi - hi[l];
				}
			}
		}
		if (!change.length) continue;
		const total = sumHi;
		steps.push(step("need", 0, change, [i], () => change.length === 1 ? `${capital(islandName(islands, n, i))} needs ${bridges(islands[i])}, and ${others ? `its other neighbours can take ${others} at most between them` : "it has no other neighbour"}, so at least ${bridges(least)} must go to ${islandName(islands, n, target)}.` : `${capital(islandName(islands, n, i))} needs ${bridges(islands[i])}, and its neighbours can take only ${total} between them, so each of the links shown must hold at least the bridges drawn.`));
	}
	return steps;
};
var full = (islands, n, state) => {
	const { hi } = state;
	const steps = [];
	for (const { i, list, sumLo } of readIslands(islands, n, state)) {
		if (sumLo !== islands[i]) continue;
		const change = list.filter((l) => hi[l] > state.lo[l]).map((l) => [
			l,
			state.lo[l],
			state.lo[l]
		]);
		if (!change.length) continue;
		steps.push(step("full", 0, change, [i], () => `${capital(islandName(islands, n, i))} has all its bridges, so no more can reach it.`));
	}
	return steps;
};
var crossed = (islands, n, state) => {
	const { links, over } = linksOf(islands, n);
	const { lo, hi } = state;
	const steps = [];
	links.forEach((link, l) => {
		if (hi[l] === 0) return;
		const across = over[l].find((o) => lo[o] > 0);
		if (across === void 0) return;
		steps.push(step("crossed", 0, [[
			l,
			0,
			0
		]], [links[across].a, links[across].b], () => "A bridge here would cross the bridge already placed, so there is none."));
	});
	return steps;
};
var limit = (islands, n, state) => {
	const { lo, hi } = state;
	const steps = [];
	for (const { i, list, sumLo } of readIslands(islands, n, state)) {
		const change = [];
		let most = 2;
		for (const l of list) {
			const room = islands[i] - (sumLo - lo[l]);
			if (room < hi[l]) {
				change.push([
					l,
					lo[l],
					Math.max(room, lo[l])
				]);
				most = Math.min(most, room);
			}
		}
		if (!change.length) continue;
		steps.push(step("limit", 1, change, [i], () => {
			const left = islands[i] - sumLo;
			return `${capital(islandName(islands, n, i))} has ${bridges(left)} left to place, so no neighbour can have more than ${left}.`;
		}));
	}
	return steps;
};
var isolate = (islands, n, state) => {
	const { links } = linksOf(islands, n);
	const { lo, hi } = state;
	const steps = [];
	links.forEach((link, l) => {
		for (let v = lo[l] + 1; v <= hi[l]; v++) {
			const trial = lo.slice();
			trial[l] = v;
			const group = closedGroups(islands, n, trial).find((g) => g.includes(link.a));
			if (!group) continue;
			steps.push(step("isolate", 2, [[
				l,
				lo[l],
				v - 1
			]], group, () => `${v === 1 ? "A bridge" : "Another bridge"} here would give the islands outlined all their bridges while leaving the rest of the puzzle cut off, so this link takes ${v === 1 ? "none" : "no more"}.`));
			break;
		}
	});
	return steps;
};
var exit = (islands, n, state) => {
	const { links } = linksOf(islands, n);
	const { lo, hi } = state;
	const groups = groupsOf(islands, n, lo);
	const steps = [];
	for (const group of groups) {
		if (groups.length === 1) break;
		const inside = new Set(group);
		const out = [];
		links.forEach((link, l) => {
			if (hi[l] > 0 && lo[l] === 0 && inside.has(link.a) !== inside.has(link.b)) out.push(l);
		});
		if (out.length !== 1) continue;
		const l = out[0];
		steps.push(step("exit", 2, [[
			l,
			1,
			hi[l]
		]], group, () => "The islands outlined have only this one way out, so a bridge must go here."));
	}
	return steps;
};
var broke = (why, islands, n) => why.group ? "a group of islands would have all its bridges and be cut off from the rest" : `${islandName(islands, n, why.island)} could not be met`;
var whatIf = (islands, n, state) => {
	const { links } = linksOf(islands, n);
	const { lo, hi } = state;
	for (let l = 0; l < links.length; l++) {
		if (lo[l] === hi[l]) continue;
		for (const v of [lo[l], hi[l]]) {
			const trial = copyState(state);
			trial.lo[l] = v;
			trial.hi[l] = v;
			const why = {};
			if (settle(islands, n, trial, why)) continue;
			return [step("what-if", 3, v === lo[l] ? [[
				l,
				lo[l] + 1,
				hi[l]
			]] : [[
				l,
				lo[l],
				hi[l] - 1
			]], [why.group ? why.group[0] : why.island], () => `If this link held ${bridges(v)}, following the plain rules from there, ${broke(why, islands, n)}. So it does not.`)];
		}
	}
	return [];
};
var techniques = [
	[
		need,
		full,
		crossed
	],
	[limit],
	[isolate, exit],
	[whatIf]
];
var nextSteps = (islands, n, state, top = levels.length - 1) => {
	for (let level = 0; level <= top; level++) for (const technique of techniques[level]) {
		const steps = technique(islands, n, state);
		if (steps.length) return {
			level,
			steps
		};
	}
	return { steps: [] };
};
var apply = (state, steps) => {
	for (const { change } of steps) for (const [l, least, most] of change) {
		state.lo[l] = Math.max(state.lo[l], least);
		state.hi[l] = Math.min(state.hi[l], most);
		if (state.lo[l] > state.hi[l]) return false;
	}
	return true;
};
var decided = ({ lo, hi }) => lo.every((v, l) => v === hi[l]);
var rate = (islands, n, top = levels.length - 1) => {
	const state = startState(islands, n);
	let hardest = 0;
	while (!decided(state)) {
		const { level, steps } = nextSteps(islands, n, state, top);
		if (!steps.length || !apply(state, steps)) return null;
		hardest = Math.max(hardest, level);
	}
	if (!solved(islands, n, state.lo)) return null;
	return {
		level: hardest,
		solution: state.lo.slice()
	};
};
//#endregion
//#region src/bridges/hint.js
var completeWithErrors = "Every island has its bridges but the puzzle is not solved. Do you want to use a hint?";
var guideTopic = ({ kind }) => ({
	break: "mistakes",
	wrong: "mistakes",
	reveal: "mistakes",
	solved: null
})[kind] ?? kind;
var scopeOf = (step, links) => /* @__PURE__ */ new Set([...step.sources, ...step.change.flatMap(([l]) => [links[l].a, links[l].b])]);
var findHint = ({ islands, board, solution, n }) => {
	const { links } = linksOf(islands, n);
	if (solved(islands, n, board)) return {
		kind: "solved",
		text: "The puzzle is solved.",
		marks: {
			cells: {},
			links: {}
		}
	};
	const broken = breaks(islands, n, board);
	if (broken.length) {
		const { cells, links: across = [], text } = broken[0];
		return {
			kind: "break",
			text: `${text} The islands outlined in red are the ones to look at.`,
			marks: {
				cells: Object.fromEntries(cells.map((i) => [i, "wrong"])),
				links: Object.fromEntries(across.map((l) => [l, {
					kind: "wrong",
					count: board[l]
				}]))
			}
		};
	}
	const wrong = links.findIndex((_, l) => board[l] > solution[l]);
	if (wrong >= 0) return {
		kind: "wrong",
		text: "This link has more bridges than the puzzle's only solution gives it. Take one away and the reasoning can carry on.",
		marks: {
			cells: {},
			links: { [wrong]: {
				kind: "wrong",
				count: board[wrong]
			} }
		}
	};
	const work = startState(islands, n);
	work.lo.set(board);
	const quiet = [];
	for (;;) {
		const { steps } = nextSteps(islands, n, work);
		if (!steps.length) break;
		const raised = (s) => s.change.some(([l, least]) => least > work.lo[l]);
		const bridge = steps.find(raised);
		if (!bridge) {
			if (!apply(work, steps)) break;
			quiet.push(...steps);
			continue;
		}
		const scope = scopeOf(bridge, links);
		const leaned = quiet.filter((s) => [...scopeOf(s, links)].some((i) => scope.has(i)));
		const first = leaned[0];
		const more = leaned.length > 1 ? " The other links shown are ruled out in the same way." : "";
		const place = bridge.change.filter(([l, least]) => least > work.lo[l]).map(([l, c]) => [l, c]);
		return {
			kind: bridge.technique,
			text: first ? `${first.text}${more} ${bridge.text}` : bridge.text,
			place,
			marks: {
				cells: Object.fromEntries([...leaned.flatMap((s) => s.sources), ...bridge.sources].map((i) => [i, "source"])),
				links: Object.fromEntries([...leaned.flatMap((s) => s.change).map(([l]) => [l, {
					kind: "none",
					count: 0
				}]), ...place.map(([l, count]) => [l, {
					kind: "bridge",
					count
				}])])
			}
		};
	}
	const l = links.findIndex((_, c) => solution[c] > board[c]);
	return {
		kind: "reveal",
		text: "No rule gives the next bridge away, so this one comes from the solution.",
		place: [[l, board[l] + 1]],
		marks: {
			cells: {},
			links: { [l]: {
				kind: "bridge",
				count: board[l] + 1
			} }
		}
	};
};
//#endregion
//#region src/bridges/Menu.jsx
var levelNames = [
	"Easy",
	"Medium",
	"Hard",
	"Expert"
];
var allowed = (n, level) => level >= 0 && level < levelNames.length;
var fallback = (n, level) => allowed(n, level) ? level : 0;
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
	name: "Daily Puzzle",
	hotKey: dailyNote(state.menu, "bridges"),
	checked: Boolean(state.game.daily),
	onClick: () => actions.newGame({ daily: true })
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Undo",
	hotKey: "Ctrl+Z",
	onClick: () => actions.undo()
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Redo",
	hotKey: "Ctrl+Y",
	onClick: () => actions.redo()
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Hint",
	hotKey: "H",
	onClick: () => actions.hint()
}), /* @__PURE__ */ h(Separator, null), levels.map((_, level) => /* @__PURE__ */ h(SubMenuItem, {
	name: levelNames[level],
	checked: state.game.level === level,
	disabled: !allowed(state.game.n, level),
	onClick: () => actions.newGame({ level })
})), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: "Show Errors",
	checked: state.errors,
	onClick: actions.toggleErrors
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Timer",
	checked: state.timer,
	onClick: actions.toggleTimer
}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: "Copy Link...",
	onClick: () => actions.share()
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Best Times...",
	onClick: actions.toggleBestTime
}), /* @__PURE__ */ h(Separator, null), resumeItems(state, actions), gameLinks("bridges")), /* @__PURE__ */ h(SizeMenu, {
	state,
	actions,
	sizes
}), /* @__PURE__ */ h(DisplayMenu, {
	state,
	actions
}), /* @__PURE__ */ h(HelpMenu, {
	state,
	actions,
	name: "Bridges Plus"
}));
var BridgesCell_module_default = {
	root: "BridgesCell_root",
	water: "BridgesCell_water BridgesCell_root",
	island: "BridgesCell_island BridgesCell_root",
	done: "BridgesCell_done",
	islandError: "BridgesCell_islandError",
	selected: "BridgesCell_selected",
	cursor: "BridgesCell_cursor",
	acrossOne: "BridgesCell_acrossOne",
	acrossTwo: "BridgesCell_acrossTwo",
	downOne: "BridgesCell_downOne",
	downTwo: "BridgesCell_downTwo",
	ghost: "BridgesCell_ghost",
	wrongBridge: "BridgesCell_wrongBridge",
	none: "BridgesCell_none",
	hintSource: "BridgesCell_hintSource Board_outline",
	hintWrong: "BridgesCell_hintWrong Board_outline"
};
//#endregion
//#region src/bridges/Cell.jsx
var hintClass = {
	source: BridgesCell_module_default.hintSource,
	wrong: BridgesCell_module_default.hintWrong
};
var lines = {
	across: [
		null,
		BridgesCell_module_default.acrossOne,
		BridgesCell_module_default.acrossTwo
	],
	down: [
		null,
		BridgesCell_module_default.downOne,
		BridgesCell_module_default.downTwo
	]
};
var Cell = ({ i, island, bridge, ghost, none, done, error, mark, selected, cursor, onPress }) => {
	if (island) return /* @__PURE__ */ h("div", {
		"data-cell": i,
		class: cx(BridgesCell_module_default.island, done && BridgesCell_module_default.done, error && BridgesCell_module_default.islandError, selected && BridgesCell_module_default.selected, cursor && BridgesCell_module_default.cursor, mark && hintClass[mark]),
		onpointerdown: (event) => onPress({
			event,
			i
		})
	}, island);
	const hinted = ghost && (!bridge || ghost.count > bridge.count);
	const drawn = hinted ? ghost : bridge;
	return /* @__PURE__ */ h("div", {
		"data-cell": i,
		class: cx(BridgesCell_module_default.water, drawn && lines[drawn.across ? "across" : "down"][drawn.count], hinted && BridgesCell_module_default.ghost, hinted && ghost.wrong && BridgesCell_module_default.wrongBridge, none && BridgesCell_module_default.none, cursor && BridgesCell_module_default.cursor),
		onpointerdown: (event) => onPress({
			event,
			i
		})
	});
};
//#endregion
//#region src/bridges/Game.jsx
var more = (hint) => guideTopic(hint) && `guide/#${guideTopic(hint)}`;
var running = ({ start, win, dealing }) => start >= 0 && !win && !dealing;
var drawings = (islands, n, board, marks) => {
	const { links } = linksOf(islands, n);
	const bridge = /* @__PURE__ */ new Map();
	const ghost = /* @__PURE__ */ new Map();
	const none = /* @__PURE__ */ new Set();
	links.forEach(({ across, cells }, l) => {
		if (board[l] > 0) for (const c of cells) bridge.set(c, {
			across,
			count: board[l]
		});
		const mark = marks.links && marks.links[l];
		if (!mark) return;
		if (mark.kind === "none") none.add(cells[Math.floor(cells.length / 2)]);
		else if (mark.count > 0) for (const c of cells) ghost.set(c, {
			across,
			count: mark.count,
			wrong: mark.kind === "wrong"
		});
	});
	return {
		bridge,
		ghost,
		none
	};
};
var Game = ({ key, state, actions }) => {
	const { game, hint } = state;
	const { n, islands, board, paused } = game;
	const hidden = paused || game.dealing;
	const errors = state.errors && !hidden ? violations(islands, n, board) : null;
	const marks = !paused && hint && hint.marks || {
		cells: {},
		links: {}
	};
	const degree = degreesOf(islands, n, board);
	const { bridge, ghost, none } = hidden ? {
		bridge: /* @__PURE__ */ new Map(),
		ghost: /* @__PURE__ */ new Map(),
		none: /* @__PURE__ */ new Set()
	} : drawings(islands, n, board, marks);
	return /* @__PURE__ */ h(Dialog, {
		clear: windowClear(state),
		key,
		hidden: state.windowState !== "open",
		title: state.theme === "classic" ? "Bridges" : "Bridges Plus",
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
	}), /* @__PURE__ */ h("div", { class: Game_module_default.root }, /* @__PURE__ */ h("div", { class: Game_module_default.scoreboard }, /* @__PURE__ */ h(Digit, { value: game.dealing ? 0 : unfinished(islands, n, board) }), /* @__PURE__ */ h("div", { class: Game_module_default.buttons }, /* @__PURE__ */ h(SideButton, {
		title: "Undo (Ctrl+Z)",
		disabled: !game.history.length || game.win || paused,
		onClick: actions.undo
	}, /* @__PURE__ */ h(UndoIcon, null)), /* @__PURE__ */ h(Play, {
		pressed: false,
		lose: false,
		win: game.win,
		onReset: actions.reset
	}), /* @__PURE__ */ h(SideButton, {
		title: "Hint (H)",
		disabled: game.dealing || game.win || paused,
		onClick: actions.hint
	}, /* @__PURE__ */ h(HintIcon, null)), n >= 10 && /* @__PURE__ */ h(PauseButton, windowProps(state, actions, paused, running(game)))), /* @__PURE__ */ h(Digit, {
		value: game.time,
		digits: clockDigits(state.theme, game.time),
		blank: !state.timer
	})), /* @__PURE__ */ h("div", {
		class: running(game) && !paused ? Bridges_module_default.active : Bridges_module_default.inactive,
		style: { "--n": n }
	}, [...islands].map((island, i) => /* @__PURE__ */ h(Cell, {
		i,
		island: hidden ? 0 : island,
		bridge: bridge.get(i),
		ghost: ghost.get(i),
		none: none.has(i),
		done: !hidden && island > 0 && degree[i] === island,
		error: errors && errors.has(i),
		mark: marks.cells[i],
		selected: !paused && state.selected === i,
		cursor: !paused && state.cursor === i,
		onPress: actions.play
	})), paused && /* @__PURE__ */ h(PausedCover, { onResume: () => actions.pause(false) })), hint && !paused && /* @__PURE__ */ h(HintPanel, {
		text: hint.text,
		more: more(hint)
	})));
};
//#endregion
export { solved as C, Bridges_module_default as E, sizes as S, unfinished as T, degreesOf as _, allowed as a, linkBetween as b, completeWithErrors as c, levels as d, nextSteps as f, startState as g, solve as h, Cell as i, findHint as l, countSolutions as m, drawings as n, fallback as o, rate as p, running as r, levelNames as s, Game as t, apply as u, emptyBoard as v, stepLink as w, linksOf as x, islandCells as y };
