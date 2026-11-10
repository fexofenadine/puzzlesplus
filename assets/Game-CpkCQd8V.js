import { B as Menu_module_default, C as resumeItems, H as cx, I as windowClear, S as SizeMenu, T as ThemeMenu, Z as Dialog, b as SubMenuItem, h as gameLinks, ot as h, tt as watchWindow, v as MenuItem, w as ViewMenu, x as HelpMenu, y as Separator } from "./HowToPlay-B-GK6Mo_.js";
import { a as CrossIcon, c as SideButton, d as Digit, i as windowProps, l as UndoIcon, n as PausedCover, o as FillIcon, p as clockDigits, r as WindowControls, s as HintIcon, t as HintPanel, u as Play } from "./Board-BuZpLT6t.js";
import { t as Game_module_default$1 } from "./Game.module-CghLtUtO.js";
import { n as cellsOf, r as lineName, t as capital } from "./grid-BZP-Z9Tf.js";
var Game_module_default = {
	board: "Game_board",
	columns: "Game_columns",
	rows: "Game_rows",
	clue: "Game_clue",
	wide: "Game_wide",
	done: "Game_done",
	error: "Game_error",
	hinted: "Game_hinted",
	field: "Game_field",
	active: "Game_active Game_field",
	inactive: "Game_inactive Game_field"
};
var sizes = [
	5,
	10,
	15,
	20,
	25
];
var emptyBoard = (n) => new Int8Array(n * n).fill(-1);
var runsOf = (values) => {
	const runs = [];
	let run = 0;
	for (const v of values) if (v === 1) run++;
	else if (run) {
		runs.push(run);
		run = 0;
	}
	if (run) runs.push(run);
	return runs;
};
var sameRuns = (a, b) => a.length === b.length && a.every((run, k) => run === b[k]);
var cluesOf = (solution, n) => cellsOf(n).map((cells) => runsOf(cells.map((i) => solution[i])));
var lineDone = (board, cells, clue) => sameRuns(runsOf(cells.map((i) => board[i])), clue);
var solved = (board, n, clues) => cellsOf(n).every((cells, line) => lineDone(board, cells, clues[line]));
var placements = (values, clue) => {
	const n = values.length;
	const k = clue.length;
	const filled = new Int32Array(n + 1);
	const crossed = new Int32Array(n + 1);
	for (let i = 0; i < n; i++) {
		filled[i + 1] = filled[i] + (values[i] === 1);
		crossed[i + 1] = crossed[i] + (values[i] === 0);
	}
	const clear = (a, b) => filled[b] === filled[a];
	const solid = (a, b) => crossed[b] === crossed[a];
	const gap = (i) => values[i] !== 1;
	const before = Array.from({ length: k + 1 }, () => new Uint8Array(n + 1));
	for (let i = 0; i <= n; i++) before[0][i] = clear(0, i);
	for (let j = 1; j <= k; j++) {
		const run = clue[j - 1];
		for (let i = 1; i <= n; i++) {
			const s = i - run;
			before[j][i] = gap(i - 1) && before[j][i - 1] || s >= 0 && solid(s, i) && (j === 1 ? before[0][s] : s >= 1 && gap(s - 1) && before[j - 1][s - 1]);
		}
	}
	if (!before[k][n]) return null;
	const after = Array.from({ length: k + 1 }, () => new Uint8Array(n + 1));
	for (let i = 0; i <= n; i++) after[k][i] = clear(i, n);
	for (let j = k - 1; j >= 0; j--) {
		const run = clue[j];
		for (let i = n - 1; i >= 0; i--) {
			const e = i + run;
			after[j][i] = gap(i) && after[j][i + 1] || e <= n && solid(i, e) && (j === k - 1 ? after[k][e] : e < n && gap(e) && after[j + 1][e + 1]);
		}
	}
	const canStart = (j, s) => {
		const e = s + clue[j];
		if (s < 0 || e > n || !solid(s, e)) return false;
		const start = j === 0 ? before[0][s] : s >= 1 && gap(s - 1) && before[j][s - 1];
		const end = j === k - 1 ? after[k][e] : e < n && gap(e) && after[j + 1][e + 1];
		return Boolean(start && end);
	};
	const canCross = (c) => {
		if (!gap(c)) return false;
		for (let j = 0; j <= k; j++) if (before[j][c] && after[j][c + 1]) return true;
		return false;
	};
	return {
		canStart,
		canCross
	};
};
var settleLine = (values, clue) => {
	const fit = placements(values, clue);
	if (!fit) return null;
	const n = values.length;
	const cover = new Int32Array(n + 1);
	clue.forEach((run, j) => {
		for (let s = 0; s + run <= n; s++) {
			if (!fit.canStart(j, s)) continue;
			cover[s]++;
			cover[s + run]--;
		}
	});
	const out = Int8Array.from(values);
	let over = 0;
	for (let c = 0; c < n; c++) {
		over += cover[c];
		if (out[c] !== -1) continue;
		if (!fit.canCross(c)) out[c] = 1;
		else if (!over) out[c] = 0;
	}
	return out;
};
var breaks = (board, n, clues) => {
	const found = [];
	cellsOf(n).forEach((cells, line) => {
		if (settleLine(cells.map((i) => board[i]), clues[line])) return;
		const clue = clues[line].length ? clues[line].join(" ") : "0";
		found.push({
			line,
			cells,
			text: `${capital(lineName(line, n))} can't match its clue ${clue} any more.`
		});
	});
	return found;
};
var fillsLeft = (board, n, clues) => clues.slice(0, n).flat().reduce((a, b) => a + b, 0) - board.filter((v) => v === 1).length;
//#endregion
//#region src/nonograms/solver.js
var propagate = (board, n, clues, lines = null, trace = null, settle = settleLine) => {
	const all = cellsOf(n);
	const waiting = new Uint8Array(2 * n);
	const queue = lines ?? all.map((_, line) => line);
	queue.forEach((line) => waiting[line] = 1);
	while (queue.length) {
		const line = queue.pop();
		waiting[line] = 0;
		const cells = all[line];
		const values = cells.map((i) => board[i]);
		const settled = settle(values, clues[line]);
		if (!settled) {
			if (trace) trace.line = line;
			return false;
		}
		for (let k = 0; k < n; k++) {
			if (values[k] !== -1 || settled[k] === -1) continue;
			board[cells[k]] = settled[k];
			const across = line < n ? n + k : k;
			if (!waiting[across]) {
				waiting[across] = 1;
				queue.push(across);
			}
		}
	}
	return true;
};
var linesThrough = (i, n) => [Math.floor(i / n), n + i % n];
var contradiction = (board, n, clues, deadline = Infinity) => {
	for (let i = 0; i < board.length; i++) {
		if (board[i] !== -1) continue;
		if (performance.now() > deadline) return null;
		for (const v of [1, 0]) {
			const trial = board.slice();
			trial[i] = v;
			const trace = {};
			if (!propagate(trial, n, clues, linesThrough(i, n), trace)) return {
				cell: i,
				value: 1 - v,
				line: trace.line
			};
		}
	}
	return null;
};
var deduce = (board, n, clues, deep = true, deadline = Infinity) => {
	if (!propagate(board, n, clues)) return null;
	let level = 0;
	while (board.includes(-1)) {
		const found = deep && contradiction(board, n, clues, deadline);
		if (!found) return null;
		level = 1;
		board[found.cell] = found.value;
		if (!propagate(board, n, clues, linesThrough(found.cell, n))) return null;
	}
	return level;
};
var countSolutions = (clues, n, limit = 2, board = new Int8Array(n * n).fill(-1)) => {
	if (!propagate(board, n, clues)) return 0;
	const i = board.indexOf(-1);
	if (i < 0) return 1;
	let total = 0;
	for (const v of [1, 0]) {
		const branch = board.slice();
		branch[i] = v;
		total += countSolutions(clues, n, limit - total, branch);
		if (total >= limit) break;
	}
	return total;
};
//#endregion
//#region src/nonograms/techniques.js
var levels = [
	"easy",
	"medium",
	"hard",
	"expert"
];
var ordinals = [
	"first",
	"second",
	"third",
	"fourth",
	"fifth",
	"sixth",
	"seventh",
	"eighth"
];
var sum = (clue) => clue.reduce((a, b) => a + b, 0);
var range = (a, b) => Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i);
var empties = (values, ks) => ks.filter((k) => values[k] === -1);
var known = (values) => [...values.keys()].filter((k) => values[k] !== -1);
var clueText = (clue) => clue.length ? clue.join(" ") : "0";
var span = (a, b) => a === b ? `cell ${a + 1}` : `cells ${a + 1} to ${b + 1}`;
var runName = (clue, j) => {
	if (clue.filter((run) => run === clue[j]).length === 1) return `the ${clue[j]}`;
	const nth = clue.slice(0, j + 1).filter((run) => run === clue[j]).length - 1;
	return `the ${ordinals[nth] ?? `number ${nth + 1}`} ${clue[j]}`;
};
var result = (place) => {
	const one = place.length === 1;
	if (place.every(([, v]) => v === 1)) return one ? "that cell is filled" : "those cells are filled";
	if (place.every(([, v]) => v === 0)) return one ? "that cell is empty" : "those cells are empty";
	return "those cells are filled and emptied as shown";
};
var extremes = (fit, clue, n) => clue.map((run, j) => {
	let left = 0;
	while (!fit.canStart(j, left)) left++;
	let right = n - run;
	while (!fit.canStart(j, right)) right--;
	return {
		run,
		left,
		right
	};
});
var pushed = (values, view, clue, [cover, gap], lead) => {
	const n = values.length;
	const fit = placements(view, clue);
	if (!fit) return [];
	const steps = [];
	const reach = new Uint8Array(n);
	extremes(fit, clue, n).forEach(({ run, left, right }, j) => {
		for (let k = left; k < right + run; k++) reach[k] = 1;
		const place = empties(values, range(right, left + run)).map((k) => [k, 1]);
		if (!place.length) return;
		steps.push({
			technique: cover,
			place,
			sources: known(view),
			text: (name, [first, last]) => left === right ? capital(`${lead}${runName(clue, j)} in ${name} only fits in ${span(left, left + run - 1)}, so ${result(place)}.`) : capital(`${lead}${runName(clue, j)} in ${name} covers ${span(left, left + run - 1)} pushed as far ${first} as it goes and ${span(right, right + run - 1)} pushed as far ${last}. Wherever it sits it covers ${span(right, left + run - 1)}, so ${result(place)}.`)
		});
	});
	const place = empties(values, range(0, n)).filter((k) => !reach[k]).map((k) => [k, 0]);
	if (place.length) steps.push({
		technique: gap,
		place,
		sources: known(view),
		text: (name) => capital(`${lead}no run of ${name}'s clue ${clueText(clue)} can reach ${place.length === 1 ? "this cell" : "these cells"}, so ${result(place)}.`)
	});
	return steps;
};
var easy = (values, clue) => {
	const n = values.length;
	const all = range(0, n);
	const whole = (place, sources, text) => [{
		technique: "complete",
		place,
		sources,
		text
	}];
	if (!clue.length) return whole(empties(values, all).map((k) => [k, 0]), [], (name) => `${capital(name)}'s clue is 0, so every cell in it is empty.`);
	if (sum(clue) + clue.length - 1 === n) {
		const exact = clue.flatMap((run, j) => [...j ? [0] : [], ...Array(run).fill(1)]);
		return whole(empties(values, all).map((k) => [k, exact[k]]), [], (name) => `${capital(name)}'s clue ${clueText(clue)} needs all ${n} cells, its runs with one empty cell between each, so it fills the line exactly.`);
	}
	if (sameRuns(runsOf(values), clue)) return whole(empties(values, all).map((k) => [k, 0]), all.filter((k) => values[k] === 1), (name) => `${capital(name)} already has all its runs (${clueText(clue)}), so its other cells are empty.`);
	return pushed(values, values.map((v) => v === 1 ? -1 : v), clue, ["overlap", "gap"], "");
};
var medium = (values, clue) => pushed(values, values, clue, ["forcing", "reach"], "with the cells already known, ");
var hard = (values, clue) => {
	const settled = settleLine(values, clue);
	if (!settled) return [];
	const place = empties(values, range(0, values.length)).filter((k) => settled[k] !== -1).map((k) => [k, settled[k]]);
	if (!place.length) return [];
	return [{
		technique: "line",
		place,
		sources: known(values),
		text: (name) => `Trying every way ${name}'s clue ${clueText(clue)} fits around its known cells, ${place.length === 1 ? "this cell comes" : "these cells come"} out the same in all of them, so ${result(place)}.`
	}];
};
var finders = [
	easy,
	medium,
	hard
];
var lineSteps = (values, clue, level) => finders[level](values, clue);
var settleUpTo = (level) => (values, clue) => {
	if (level >= 2) return settleLine(values, clue);
	const out = Int8Array.from(values);
	for (;;) {
		if (!placements(out, clue)) return null;
		const place = finders[level](out, clue).flatMap((s) => s.place);
		if (!place.length) return out;
		for (const [k, v] of place) out[k] = v;
	}
};
var solveAt = (board, n, clues, level, deadline = Infinity) => {
	if (!propagate(board, n, clues, null, null, settleUpTo(level))) return false;
	if (!board.includes(-1)) return true;
	return level >= 3 && deduce(board, n, clues, true, deadline) !== null;
};
var rate = (clues, n, top = levels.length - 1) => {
	const board = emptyBoard(n);
	for (let level = 0; level <= top; level++) if (solveAt(board, n, clues, level)) return level;
	return null;
};
var nextSteps = (board, n, clues, top = levels.length - 1) => {
	const lines = cellsOf(n);
	for (let level = 0; level <= Math.min(top, 2); level++) {
		const steps = [];
		lines.forEach((cells, line) => {
			const values = cells.map((i) => board[i]);
			if (!values.includes(-1)) return;
			const name = lineName(line, n);
			const ends = line < n ? ["left", "right"] : ["up", "down"];
			for (const found of finders[level](values, clues[line])) steps.push({
				technique: found.technique,
				level,
				line,
				place: found.place.map(([k, v]) => [cells[k], v]),
				sources: found.sources.map((k) => cells[k]),
				text: found.text(name, ends)
			});
		});
		if (steps.length) return {
			steps,
			level
		};
	}
	if (top >= 3) {
		const found = contradiction(board, n, clues);
		if (found) {
			const { cell, value, line } = found;
			return {
				level: 3,
				steps: [{
					technique: "what-if",
					level: 3,
					line,
					place: [[cell, value]],
					sources: [],
					text: `If this cell were ${value === 1 ? "empty" : "filled"}, following the lines from it would leave ${lineName(line, n)} unable to match its clue, so it must be ${value === 1 ? "filled" : "empty"}.`
				}]
			};
		}
	}
	return {
		steps: [],
		level: null
	};
};
//#endregion
//#region src/nonograms/hint.js
var completeWithErrors = "All the filled cells are placed but there are errors. Do you want to use a hint?";
var marked = (entries) => Object.fromEntries(entries);
var guideTopic = ({ kind }) => ({
	break: "mistakes",
	wrong: "mistakes",
	reveal: "mistakes",
	solved: null
})[kind] ?? kind;
var misfit = (board, solution, i) => board[i] === 1 && !solution[i] || board[i] === 0 && solution[i] === 1;
var findHint = ({ board, solution, clues, n }) => {
	if (solved(board, n, clues)) return {
		kind: "solved",
		text: "The puzzle is solved.",
		marks: {}
	};
	const broken = breaks(board, n, clues);
	if (broken.length) {
		const { line, cells, text } = broken[0];
		const bad = cells.filter((i) => misfit(board, solution, i));
		const known = cells.filter((i) => board[i] !== -1);
		return {
			kind: "break",
			line,
			text: bad.length ? `${text} ${bad.length > 1 ? "The cells outlined in red are the ones" : "The cell outlined in red is the one"} to change.` : text,
			marks: marked(known.map((i) => [i, bad.includes(i) ? "wrong" : "source"]))
		};
	}
	const wrong = [...board.keys()].find((i) => misfit(board, solution, i));
	if (wrong !== void 0) return {
		kind: "wrong",
		text: `This ${board[wrong] === 1 ? "filled" : "crossed out"} cell doesn't fit the puzzle's only solution. Clear it and the reasoning can carry on.`,
		marks: { [wrong]: "wrong" }
	};
	const { steps } = nextSteps(board, n, clues);
	if (!steps.length) {
		const i = board.indexOf(-1);
		const value = solution[i] ? 1 : 0;
		return {
			kind: "reveal",
			text: "No rule gives the next cell away, so this one comes from the solution.",
			place: [[i, value]],
			marks: { [i]: value === 1 ? "fill" : "cross" }
		};
	}
	const { technique, line, text, place, sources } = steps[0];
	return {
		kind: technique,
		line,
		text,
		place,
		marks: marked([...sources.map((i) => [i, "source"]), ...place.map(([i, v]) => [i, v === 1 ? "fill" : "cross"])])
	};
};
//#endregion
//#region src/nonograms/Menu.jsx
var levelNames = [
	"Easy",
	"Medium",
	"Hard",
	"Expert"
];
var allowed = (n, level) => !(n === 5 && level === 3);
var fallback = (n, level) => allowed(n, level) ? level : fallback(n, level - 1);
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
}), /* @__PURE__ */ h(Separator, null), levelNames.map((name, level) => /* @__PURE__ */ h(SubMenuItem, {
	name,
	checked: state.game.level === level,
	disabled: !allowed(state.game.n, level),
	onClick: () => actions.newGame({ level })
})), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: "Procedural",
	checked: state.procedural,
	onClick: actions.toggleProcedural
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Symmetric",
	checked: state.symmetric,
	disabled: !state.procedural,
	onClick: actions.toggleSymmetric
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Choose Picture...",
	disabled: state.procedural,
	onClick: actions.togglePictures
}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
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
}), /* @__PURE__ */ h(Separator, null), resumeItems(state, actions), gameLinks("nonograms")), /* @__PURE__ */ h(SizeMenu, {
	state,
	actions,
	sizes
}), /* @__PURE__ */ h(ViewMenu, {
	state,
	actions
}), /* @__PURE__ */ h(ThemeMenu, {
	state,
	actions
}, state.theme === "matrix" && /* @__PURE__ */ h(Separator, null), state.theme === "matrix" && /* @__PURE__ */ h(SubMenuItem, {
	name: "Rain Glyphs",
	checked: state.rain,
	onClick: actions.toggleRain
})), /* @__PURE__ */ h(HelpMenu, {
	state,
	actions,
	name: "Nonograms Plus"
}));
var Cell_module_default = {
	root: "Cell_root",
	empty: "Cell_empty Cell_root",
	fill: "Cell_fill Cell_root",
	cross: "Cell_cross Cell_root",
	blank: "Cell_blank",
	ghostFill: "Cell_ghostFill Cell_empty Cell_root",
	ghostCross: "Cell_ghostCross Cell_cross Cell_root Cell_empty Cell_root",
	hintSource: "Cell_hintSource Board_outline",
	hintPlace: "Cell_hintPlace Board_outline",
	hintWrong: "Cell_hintWrong Board_outline"
};
//#endregion
//#region src/nonograms/Cell.jsx
var hintClass = {
	source: Cell_module_default.hintSource,
	fill: Cell_module_default.hintPlace,
	cross: Cell_module_default.hintPlace,
	wrong: Cell_module_default.hintWrong
};
var classOf = (value, win, mark) => {
	if (value === 1) return Cell_module_default.fill;
	if (value !== -1 || win) return Cell_module_default.cross;
	if (mark === "fill") return Cell_module_default.ghostFill;
	if (mark === "cross") return Cell_module_default.ghostCross;
	return Cell_module_default.empty;
};
var Cell = ({ i, value, win, mark, style, onPress }) => /* @__PURE__ */ h("button", {
	type: "button",
	tabindex: -1,
	"data-cell": i,
	class: cx(classOf(value, win, mark), win && value !== 1 && Cell_module_default.blank, mark && hintClass[mark]),
	style,
	onpointerdown: (event) => onPress({
		event,
		i
	})
});
//#endregion
//#region src/nonograms/Game.jsx
var more = (hint) => guideTopic(hint) && `guide/#${guideTopic(hint)}`;
var captionOf = ({ name, credit, licence }) => `${name}, ${credit} (${licence})`;
var running = ({ start, win, dealing }) => start >= 0 && !win && !dealing;
var tracks = (n) => Array.from({ length: n }, (_, k) => k && k % 5 === 0 ? "2px var(--size)" : "var(--size)").join(" ");
var place = (k) => k + Math.floor(k / 5) + 1;
var Clue = ({ clue, done, error, hinted, hidden, style }) => /* @__PURE__ */ h("div", {
	class: cx(Game_module_default.clue, done && Game_module_default.done, error && Game_module_default.error, hinted && Game_module_default.hinted),
	style
}, !hidden && (clue.length ? clue : [0]).map((run) => /* @__PURE__ */ h("span", { class: run > 9 && Game_module_default.wide }, run)));
var Game = ({ key, state, actions }) => {
	const { game, hint } = state;
	const { n, board, clues, paused } = game;
	const marks = !paused && hint && hint.marks || {};
	const lines = cellsOf(n);
	const hidden = paused || game.dealing;
	const broken = state.errors && !hidden ? new Set(breaks(board, n, clues).map((b) => b.line)) : null;
	const done = lines.map((cells, line) => !hidden && lineDone(board, cells, clues[line]));
	const left = fillsLeft(board, n, clues);
	const clue = (line) => /* @__PURE__ */ h(Clue, {
		clue: clues[line],
		done: done[line],
		error: broken && broken.has(line),
		hinted: !paused && hint && hint.line === line,
		hidden,
		style: line < n ? { gridRow: place(line) } : { gridColumn: place(line - n) }
	});
	return /* @__PURE__ */ h(Dialog, {
		clear: windowClear(state),
		key,
		hidden: state.windowState !== "open",
		title: state.theme === "classic" ? "Nonograms" : "Nonograms Plus",
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
	}), /* @__PURE__ */ h("div", { class: Game_module_default$1.root }, /* @__PURE__ */ h("div", { class: Game_module_default$1.scoreboard }, /* @__PURE__ */ h(Digit, { value: game.dealing ? 0 : left }), /* @__PURE__ */ h("div", { class: Game_module_default$1.buttons }, /* @__PURE__ */ h(SideButton, {
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
	}, /* @__PURE__ */ h(HintIcon, null)), state.touch && /* @__PURE__ */ h(SideButton, {
		title: state.mode === 1 ? "Taps fill cells" : "Taps cross cells out",
		disabled: game.win || paused,
		onClick: () => actions.setMode(state.mode === 1 ? 0 : 1)
	}, state.mode === 1 ? /* @__PURE__ */ h(FillIcon, null) : /* @__PURE__ */ h(CrossIcon, null))), /* @__PURE__ */ h(Digit, {
		value: game.time,
		digits: clockDigits(state.theme, game.time),
		blank: !state.timer
	})), /* @__PURE__ */ h("div", {
		class: Game_module_default.board,
		style: { "--tracks": tracks(n) }
	}, /* @__PURE__ */ h("div", { class: Game_module_default.columns }, lines.slice(n).map((_, x) => clue(n + x))), /* @__PURE__ */ h("div", { class: Game_module_default.rows }, lines.slice(0, n).map((_, y) => clue(y))), /* @__PURE__ */ h("div", { class: running(game) && !paused ? Game_module_default.active : Game_module_default.inactive }, [...board].map((value, i) => /* @__PURE__ */ h(Cell, {
		i,
		value: paused ? -1 : value,
		win: game.win,
		mark: marks[i],
		style: {
			gridColumn: place(i % n),
			gridRow: place(Math.floor(i / n))
		},
		onPress: actions.down
	})), paused && /* @__PURE__ */ h(PausedCover, { onResume: () => actions.pause(false) }))), hint && !paused && /* @__PURE__ */ h(HintPanel, {
		text: hint.text,
		more: more(hint)
	}), game.win && game.art && /* @__PURE__ */ h(HintPanel, { text: captionOf(game.art) })));
};
//#endregion
export { solved as C, sizes as S, deduce as _, Cell as a, fillsLeft as b, levelNames as c, levels as d, lineSteps as f, countSolutions as g, solveAt as h, tracks as i, completeWithErrors as l, rate as m, place as n, allowed as o, nextSteps as p, running as r, fallback as s, Game as t, findHint as u, cluesOf as v, Game_module_default as w, lineDone as x, emptyBoard as y };
