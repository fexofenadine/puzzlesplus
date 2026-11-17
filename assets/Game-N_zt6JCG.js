import { C as HelpMenu, D as ThemeMenu, E as ViewMenu, J as Menu_module_default, R as windowClear, S as SubMenuItem, T as resumeItems, _ as gameLinks, b as MenuItem, lt as Dialog, pt as watchWindow, u as dailyNote, vt as h, w as SizeMenu, x as Separator } from "./HowToPlay-DghiV_5t.js";
import { c as PauseButton, d as Play, f as Digit, i as windowProps, l as SideButton, m as clockDigits, n as PausedCover, r as WindowControls, s as HintIcon, t as HintPanel, u as UndoIcon } from "./Board-Ceq0kt-d.js";
import { t as Game_module_default } from "./Game.module-CghLtUtO.js";
import { t as capital } from "./grid-BZP-Z9Tf.js";
import { B as onlyDigit, D as all, F as digitsOf, N as countBits, P as digitCounts, k as bit, n as Pad, r as lookOf, s as Cell } from "./Game-Bsh-QLYk.js";
var Futoshiki_module_default = {
	board: "Futoshiki_board",
	field: "Futoshiki_field",
	active: "Futoshiki_active Futoshiki_field",
	inactive: "Futoshiki_inactive Futoshiki_field",
	sign: "Futoshiki_sign",
	turned: "Futoshiki_turned Futoshiki_sign"
};
var sizes = [
	4,
	5,
	6,
	7
];
var allowed = (n, level) => level >= 0 && level < 4 && !(n === 4 && level === 2);
var fallback = (n, level) => allowed(n, level) ? level : fallback(n, level - 1);
var emptyBoard = (n) => new Int8Array(n * n);
var cellName = (i, n) => `row ${Math.floor(i / n) + 1}, column ${i % n + 1}`;
var geometries = {};
var geometry = (n) => {
	if (geometries[n]) return geometries[n];
	const units = [];
	for (let r = 0; r < n; r++) {
		const cells = Array.from({ length: n }, (_, c) => r * n + c);
		units.push({
			kind: "row",
			index: r,
			cells,
			name: `row ${r + 1}`
		});
	}
	for (let c = 0; c < n; c++) {
		const cells = Array.from({ length: n }, (_, r) => r * n + c);
		units.push({
			kind: "column",
			index: c,
			cells,
			name: `column ${c + 1}`
		});
	}
	const unitsOf = Array.from({ length: n * n }, () => []);
	units.forEach((unit) => unit.cells.forEach((i) => unitsOf[i].push(unit)));
	geometries[n] = {
		n,
		units,
		unitsOf,
		peers: unitsOf.map((list, i) => {
			const set = new Set(list.flatMap((unit) => unit.cells));
			set.delete(i);
			return [...set];
		})
	};
	return geometries[n];
};
var pairCache = /* @__PURE__ */ new WeakMap();
var pairsOf = ({ n, right, down }) => {
	let byDown = pairCache.get(right);
	if (!byDown) pairCache.set(right, byDown = /* @__PURE__ */ new WeakMap());
	let pairs = byDown.get(down);
	if (pairs) return pairs;
	pairs = [];
	for (let i = 0; i < n * n; i++) {
		if (right[i] === 1) pairs.push([i, i + 1]);
		if (right[i] === 2) pairs.push([i + 1, i]);
		if (down[i] === 1) pairs.push([i, i + n]);
		if (down[i] === 2) pairs.push([i + n, i]);
	}
	byDown.set(down, pairs);
	return pairs;
};
var full = (board) => !board.includes(0);
var candidatesOf = (board, n) => {
	const { peers } = geometry(n);
	const cands = new Int32Array(n * n);
	for (let i = 0; i < n * n; i++) {
		if (board[i] !== 0) continue;
		let mask = all(n);
		for (const p of peers[i]) if (board[p] !== 0) mask &= ~bit(board[p]);
		cands[i] = mask;
	}
	return cands;
};
var breaks = (board, puzzle) => {
	const { n } = puzzle;
	const found = [];
	for (const unit of geometry(n).units) {
		const seen = /* @__PURE__ */ new Map();
		for (const i of unit.cells) {
			const d = board[i];
			if (d === 0) continue;
			if (!seen.has(d)) seen.set(d, []);
			seen.get(d).push(i);
		}
		seen.forEach((cells, d) => {
			if (cells.length < 2) return;
			found.push({
				cells,
				text: `${capital(unit.name)} has ${d} more than once.`
			});
		});
	}
	for (const [small, big] of pairsOf(puzzle)) {
		if (board[small] === 0 || board[big] === 0 || board[small] < board[big]) continue;
		found.push({
			cells: [small, big],
			text: `The sign between these cells says the ${board[small]} should be the smaller one.`
		});
	}
	return found;
};
var violations = (board, puzzle) => new Set(breaks(board, puzzle).flatMap(({ cells }) => cells));
var solved = (board, puzzle) => full(board) && breaks(board, puzzle).length === 0;
//#endregion
//#region src/futoshiki/solver.js
var lowest$1 = (mask) => 31 - Math.clz32(mask & -mask);
var highest$1 = (mask) => 31 - Math.clz32(mask);
var single = (mask) => mask && !(mask & mask - 1);
var masksOf = (board, n) => {
	const masks = new Int32Array(n * n);
	for (let i = 0; i < n * n; i++) masks[i] = board[i] === 0 ? all(n) : bit(board[i]);
	return masks;
};
var tighten = (masks, puzzle) => {
	const { n } = puzzle;
	const { units, peers } = geometry(n);
	const pairs = pairsOf(puzzle);
	const done = new Uint8Array(n * n);
	for (;;) {
		let changed = false;
		const narrow = (i, mask) => {
			if (masks[i] === mask) return true;
			masks[i] = mask;
			changed = true;
			return mask !== 0;
		};
		for (const [small, big] of pairs) {
			if (!masks[small] || !masks[big]) return false;
			if (!narrow(small, masks[small] & (1 << highest$1(masks[big])) - 1)) return false;
			if (!narrow(big, masks[big] & ~((2 << lowest$1(masks[small])) - 1))) return false;
		}
		for (let i = 0; i < n * n; i++) {
			if (done[i] || !single(masks[i])) continue;
			done[i] = 1;
			for (const p of peers[i]) if (!narrow(p, masks[p] & ~masks[i])) return false;
		}
		for (const unit of units) for (let d = 0; d < n; d++) {
			let spot = -1;
			let count = 0;
			for (const i of unit.cells) if (masks[i] & 1 << d) {
				spot = i;
				count++;
			}
			if (!count) return false;
			if (count === 1 && !narrow(spot, 1 << d)) return false;
		}
		if (!changed) return true;
	}
};
var search = (masks, puzzle, found) => {
	if (!tighten(masks, puzzle)) return false;
	let pick = -1;
	let fewest = 99;
	for (let i = 0; i < masks.length; i++) {
		if (single(masks[i])) continue;
		let count = 0;
		for (let m = masks[i]; m; m &= m - 1) count++;
		if (count < fewest) {
			fewest = count;
			pick = i;
		}
	}
	if (pick < 0) return found(masks);
	for (let m = masks[pick]; m; m &= m - 1) {
		const trial = masks.slice();
		trial[pick] = m & -m;
		if (search(trial, puzzle, found)) return true;
	}
	return false;
};
var countSolutions = (puzzle, limit = 2) => {
	let count = 0;
	search(masksOf(puzzle.givens, puzzle.n), puzzle, () => ++count >= limit);
	return count;
};
var solve = (puzzle) => {
	let solution = null;
	search(masksOf(puzzle.givens, puzzle.n), puzzle, (masks) => {
		solution = Int8Array.from(masks, (mask) => highest$1(mask) + 1);
		return true;
	});
	return solution;
};
//#endregion
//#region src/futoshiki/techniques.js
var levels = [
	"easy",
	"medium",
	"hard",
	"expert"
];
var step = (technique, level, { place = [], remove = [], sources = [] }, say) => ({
	technique,
	level,
	place,
	remove,
	sources,
	get text() {
		return say();
	}
});
var lowest = (mask) => 31 - Math.clz32(mask & -mask) + 1;
var highest = (mask) => 31 - Math.clz32(mask) + 1;
var orList = (items) => items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;
var unique = (list) => [...new Set(list.filter((x) => x !== void 0))];
var blocker = (board, n, i, d) => geometry(n).peers[i].find((p) => board[p] === d);
var nakedSingles = (puzzle, board, cands) => {
	const { n } = puzzle;
	const steps = [];
	for (let i = 0; i < board.length; i++) {
		const mask = cands[i];
		if (board[i] !== 0 || !mask || mask & mask - 1) continue;
		const d = onlyDigit(mask);
		const others = digitsOf(all(n) & ~mask);
		const sources = unique(others.map((o) => blocker(board, n, i, o)));
		steps.push(step("naked-single", 0, {
			place: [[i, d]],
			sources
		}, () => sources.length === others.length ? `Every other digit is already in this cell's row or column, so it must be ${d}.` : `Only ${d} is left as a candidate for this cell, so it must be ${d}.`));
	}
	return steps;
};
var hiddenSingles = (puzzle, board, cands) => {
	const { n } = puzzle;
	const steps = [];
	const seen = /* @__PURE__ */ new Set();
	for (const unit of geometry(n).units) for (let d = 1; d <= n; d++) {
		if (unit.cells.some((i) => board[i] === d)) continue;
		const spots = unit.cells.filter((i) => board[i] === 0 && cands[i] & bit(d));
		if (spots.length !== 1 || seen.has(spots[0])) continue;
		const [i] = spots;
		seen.add(i);
		const others = unit.cells.filter((c) => c !== i && board[c] === 0);
		steps.push(step("hidden-single", 0, {
			place: [[i, d]],
			sources: unique(others.map((c) => blocker(board, n, c, d)))
		}, () => `${d} can only go in one cell of ${unit.name}, so it goes here.`));
	}
	return steps;
};
var chains = (puzzle) => {
	const { n } = puzzle;
	const pairs = pairsOf(puzzle);
	const depth = (from, to) => {
		const memo = new Int8Array(n * n).fill(-1);
		const walk = (i) => {
			if (memo[i] >= 0) return memo[i];
			memo[i] = 0;
			let best = 0;
			for (const pair of pairs) if (pair[from] === i) best = Math.max(best, walk(pair[to]) + 1);
			memo[i] = best;
			return best;
		};
		return Array.from({ length: n * n }, (_, i) => walk(i));
	};
	return {
		below: depth(1, 0),
		above: depth(0, 1)
	};
};
var ends = (puzzle, board, cands) => {
	const { n } = puzzle;
	const { below, above } = chains(puzzle);
	const steps = [];
	for (let i = 0; i < n * n; i++) {
		if (board[i] !== 0 || !below[i] && !above[i]) continue;
		const keep = all(n) & ~((1 << below[i]) - 1) & (1 << n - above[i]) - 1;
		const gone = cands[i] & ~keep;
		if (!gone) continue;
		steps.push(step("ends", 0, { remove: [[i, gone]] }, () => {
			const parts = [];
			if (below[i]) parts.push(`greater than ${below[i] === 1 ? "another cell" : `a chain of ${below[i]} cells`}, so it is at least ${below[i] + 1}`);
			if (above[i]) parts.push(`less than ${above[i] === 1 ? "another cell" : `a chain of ${above[i]} cells`}, so it is at most ${n - above[i]}`);
			return `The cell at ${cellName(i, n)} is ${parts.join(", and ")}.`;
		}));
	}
	return steps;
};
var beside = (puzzle, board, cands) => {
	const { n } = puzzle;
	const steps = [];
	for (const [small, big] of pairsOf(puzzle)) {
		if (board[big] !== 0 && board[small] === 0) {
			const gone = cands[small] & ~((1 << board[big] - 1) - 1);
			if (gone) steps.push(step("beside", 0, {
				remove: [[small, gone]],
				sources: [big]
			}, () => {
				const left = digitsOf(cands[small] & ~gone);
				return `The cell at ${cellName(small, n)} is less than the ${board[big]} beside it, so it can only be ${orList(left)}.`;
			}));
		}
		if (board[small] !== 0 && board[big] === 0) {
			const gone = cands[big] & (1 << board[small]) - 1;
			if (gone) steps.push(step("beside", 0, {
				remove: [[big, gone]],
				sources: [small]
			}, () => {
				const left = digitsOf(cands[big] & ~gone);
				return `The cell at ${cellName(big, n)} is greater than the ${board[small]} beside it, so it can only be ${orList(left)}.`;
			}));
		}
	}
	return steps;
};
var limits = (puzzle, board, cands) => {
	const { n } = puzzle;
	const steps = [];
	for (const [small, big] of pairsOf(puzzle)) {
		if (board[small] !== 0 || board[big] !== 0 || !cands[small] || !cands[big]) continue;
		const top = highest(cands[big]);
		const goneSmall = cands[small] & ~((1 << top - 1) - 1);
		if (goneSmall) steps.push(step("limits", 1, {
			remove: [[small, goneSmall]],
			sources: [big]
		}, () => `The cell at ${cellName(big, n)} is at most ${top}, and the cell at ${cellName(small, n)} is less than it, so it is at most ${top - 1}.`));
		const bottom = lowest(cands[small]);
		const goneBig = cands[big] & (1 << bottom) - 1;
		if (goneBig) steps.push(step("limits", 1, {
			remove: [[big, goneBig]],
			sources: [small]
		}, () => `The cell at ${cellName(small, n)} is at least ${bottom}, and the cell at ${cellName(big, n)} is greater than it, so it is at least ${bottom + 1}.`));
	}
	return steps;
};
var nakedPairs = (puzzle, board, cands) => {
	const steps = [];
	for (const unit of geometry(puzzle.n).units) {
		const open = unit.cells.filter((i) => board[i] === 0);
		for (let a = 0; a < open.length; a++) for (let b = a + 1; b < open.length; b++) {
			const mask = cands[open[a]];
			if (countBits(mask) !== 2 || cands[open[b]] !== mask) continue;
			const remove = open.filter((i) => i !== open[a] && i !== open[b] && cands[i] & mask).map((i) => [i, cands[i] & mask]);
			if (!remove.length) continue;
			const [x, y] = digitsOf(mask);
			steps.push(step("naked-pair", 2, {
				remove,
				sources: [open[a], open[b]]
			}, () => `Two cells of ${unit.name} can only be ${x} or ${y}, so between them they take both, and no other cell of ${unit.name} can be ${x} or ${y}.`));
		}
	}
	return steps;
};
var hiddenPairs = (puzzle, board, cands) => {
	const { n } = puzzle;
	const steps = [];
	for (const unit of geometry(n).units) {
		const spots = (d) => unit.cells.filter((i) => board[i] === 0 && cands[i] & bit(d));
		for (let x = 1; x <= n; x++) {
			const first = spots(x);
			if (first.length !== 2) continue;
			for (let y = x + 1; y <= n; y++) {
				const second = spots(y);
				if (second.length !== 2 || second[0] !== first[0] || second[1] !== first[1]) continue;
				const mask = bit(x) | bit(y);
				const remove = first.filter((i) => cands[i] & ~mask).map((i) => [i, cands[i] & ~mask]);
				if (!remove.length) continue;
				steps.push(step("hidden-pair", 2, {
					remove,
					sources: first
				}, () => `In ${unit.name}, ${x} and ${y} can only go in these two cells, so the two cells hold nothing else.`));
			}
		}
	}
	return steps;
};
var whatIf = (puzzle, board, cands) => {
	const { n } = puzzle;
	const open = [...board.keys()].filter((i) => board[i] === 0 && countBits(cands[i]) > 1).sort((a, b) => countBits(cands[a]) - countBits(cands[b]));
	const base = masksOf(board, n);
	for (const i of open) base[i] = cands[i];
	for (const i of open) for (const d of digitsOf(cands[i])) {
		const trial = base.slice();
		trial[i] = bit(d);
		if (tighten(trial, puzzle)) continue;
		return [step("what-if", 3, {
			remove: [[i, bit(d)]],
			sources: [i]
		}, () => `If the cell at ${cellName(i, n)} were ${d}, the simpler rules would soon leave a cell with no digit or a line with no place for one, so it isn't ${d}.`)];
	}
	return [];
};
var techniques = [
	[
		nakedSingles,
		hiddenSingles,
		beside,
		ends
	],
	[limits],
	[nakedPairs, hiddenPairs],
	[whatIf]
];
var dead = (board, cands) => board.some((v, i) => v === 0 && !cands[i]);
var nextSteps = (puzzle, board, cands, top = levels.length - 1) => {
	if (dead(board, cands)) return {
		contradiction: true,
		steps: []
	};
	for (let level = 0; level <= top; level++) for (const technique of techniques[level]) {
		const steps = technique(puzzle, board, cands);
		if (steps.length) return {
			level,
			steps
		};
	}
	return { steps: [] };
};
var apply = (puzzle, board, cands, steps) => {
	const { peers } = geometry(puzzle.n);
	for (const { place, remove } of steps) {
		for (const [i, d] of place) {
			if (board[i] !== 0 && board[i] !== d) return false;
			if (board[i] === d) continue;
			if (!(cands[i] & bit(d))) return false;
			board[i] = d;
			cands[i] = 0;
			for (const p of peers[i]) cands[p] &= ~bit(d);
		}
		for (const [i, mask] of remove) cands[i] &= ~mask;
	}
	return !dead(board, cands);
};
var rate = (puzzle, top = levels.length - 1) => {
	const board = puzzle.givens.slice();
	const cands = candidatesOf(board, puzzle.n);
	let hardest = 0;
	while (!full(board)) {
		const { contradiction, level, steps } = nextSteps(puzzle, board, cands, top);
		if (contradiction || !steps.length) return null;
		hardest = Math.max(hardest, level);
		if (!apply(puzzle, board, cands, steps)) return null;
	}
	return {
		level: hardest,
		solution: board
	};
};
//#endregion
//#region src/futoshiki/hint.js
var completeWithErrors = "The board is complete but there are errors. Do you want to use a hint?";
var guideTopic = ({ kind }) => ({
	break: "mistakes",
	wrong: "mistakes",
	reveal: "mistakes",
	solved: null
})[kind] ?? kind;
var lower = (text) => text[0].toLowerCase() + text.slice(1);
var enabler = (removals, [i, d], n) => {
	const { peers } = geometry(n);
	const near = /* @__PURE__ */ new Set([i, ...peers[i]]);
	return removals.findLast((step) => step.remove.some(([c, mask]) => c === i || near.has(c) && mask & bit(d)));
};
var findHint = ({ board, solution, puzzle }) => {
	const { n } = puzzle;
	if (solved(board, puzzle)) return {
		kind: "solved",
		text: "The puzzle is solved.",
		marks: {}
	};
	const broken = breaks(board, puzzle);
	if (broken.length) {
		const { cells, text } = broken[0];
		const bad = cells.filter((i) => board[i] !== solution[i]);
		const fix = bad.length ? bad : cells.filter((i) => puzzle.givens[i] === 0);
		return {
			kind: "break",
			text: `${text} ${fix.length > 1 ? "The cells outlined in red are the ones" : "The cell outlined in red is the one"} to change.`,
			marks: Object.fromEntries(cells.map((i) => [i, fix.includes(i) ? "wrong" : "source"]))
		};
	}
	const wrong = [...board.keys()].find((i) => board[i] !== 0 && board[i] !== solution[i]);
	if (wrong !== void 0) return {
		kind: "wrong",
		text: `This ${board[wrong]} doesn't fit the puzzle's only solution. Clear it and the reasoning can carry on.`,
		marks: { [wrong]: "wrong" }
	};
	const work = board.slice();
	const cands = candidatesOf(work, n);
	const removals = [];
	for (let round = 0; round < 500; round++) {
		const { contradiction, steps } = nextSteps(puzzle, work, cands);
		if (contradiction || !steps.length) break;
		const placement = steps.find((step) => step.place.length);
		if (!placement) {
			if (!apply(puzzle, work, cands, steps)) break;
			removals.push(...steps);
			continue;
		}
		const before = enabler(removals, placement.place[0], n);
		return {
			kind: before ? before.technique : placement.technique,
			text: before ? `${before.text} Then ${lower(placement.text)}` : placement.text,
			place: placement.place,
			marks: Object.fromEntries([
				...(before ? before.sources : []).map((i) => [i, "source"]),
				...(before ? before.remove : []).map(([i]) => [i, "remove"]),
				...placement.sources.map((i) => [i, "source"]),
				...placement.place.map(([i]) => [i, "place"])
			])
		};
	}
	const i = board.indexOf(0);
	return {
		kind: "reveal",
		text: "No rule gives the next digit away, so this one comes from the solution.",
		place: [[i, solution[i]]],
		marks: { [i]: "place" }
	};
};
//#endregion
//#region src/futoshiki/Menu.jsx
var levelNames = [
	"Easy",
	"Medium",
	"Hard",
	"Expert"
];
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
	hotKey: dailyNote(state.menu, "futoshiki"),
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
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Auto Notes",
	onClick: () => actions.autoNotes()
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
	name: "Tidy Notes",
	checked: state.tidy,
	onClick: actions.toggleTidy
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
}), /* @__PURE__ */ h(Separator, null), resumeItems(state, actions), gameLinks("futoshiki")), /* @__PURE__ */ h(SizeMenu, {
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
	name: "Futoshiki Plus"
}));
//#endregion
//#region src/futoshiki/Game.jsx
var more = (hint) => guideTopic(hint) && `guide/#${guideTopic(hint)}`;
var running = ({ start, win, dealing }) => start >= 0 && !win && !dealing;
var tracks = (n) => Array.from({ length: n }, () => "var(--size)").join(" var(--gap) ");
var padTracks = (n) => Array.from({ length: n }, () => "1fr").join(" 4px ");
var place = (k) => 2 * k + 1;
var noteColumns = (n) => n <= 4 ? 2 : 3;
var Signs = ({ n, right, down }) => [...right.keys()].flatMap((i) => {
	const column = place(i % n);
	const row = place(Math.floor(i / n));
	return [right[i] !== 0 && /* @__PURE__ */ h("span", {
		class: Futoshiki_module_default.sign,
		style: {
			gridColumn: column + 1,
			gridRow: row
		}
	}, right[i] === 1 ? "<" : ">"), down[i] !== 0 && /* @__PURE__ */ h("span", {
		class: Futoshiki_module_default.turned,
		style: {
			gridColumn: column,
			gridRow: row + 1
		}
	}, down[i] === 1 ? "<" : ">")];
});
var Game = ({ key, state, actions }) => {
	const { game, hint, selected, picked } = state;
	const { n, board, givens, notes, paused } = game;
	const { peers } = geometry(n);
	const hidden = paused || game.dealing;
	const errors = state.errors && !hidden ? violations(board, game) : null;
	const marks = !paused && hint && hint.marks || {};
	const ghosts = !paused && hint && hint.place && Object.fromEntries(hint.place) || {};
	const left = board.filter((v) => v === 0).length;
	const focus = picked || (selected >= 0 ? board[selected] : 0);
	const seen = {
		selected,
		focus,
		board,
		peers: selected >= 0 ? new Set(peers[selected]) : null
	};
	return /* @__PURE__ */ h(Dialog, {
		clear: windowClear(state),
		key,
		hidden: state.windowState !== "open",
		title: state.theme === "classic" ? "Futoshiki" : "Futoshiki Plus",
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
	}), /* @__PURE__ */ h("div", { class: Game_module_default.root }, /* @__PURE__ */ h("div", { class: Game_module_default.scoreboard }, /* @__PURE__ */ h(Digit, { value: game.dealing ? 0 : left }), /* @__PURE__ */ h("div", { class: Game_module_default.buttons }, /* @__PURE__ */ h(SideButton, {
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
	}, /* @__PURE__ */ h(HintIcon, null)), n >= 6 && /* @__PURE__ */ h(PauseButton, windowProps(state, actions, paused, running(game)))), /* @__PURE__ */ h(Digit, {
		value: game.time,
		digits: clockDigits(state.theme, game.time),
		blank: !state.timer
	})), /* @__PURE__ */ h("div", { class: Futoshiki_module_default.board }, /* @__PURE__ */ h("div", {
		class: running(game) && !paused ? Futoshiki_module_default.active : Futoshiki_module_default.inactive,
		style: { "--tracks": tracks(n) }
	}, [...board].map((digit, i) => /* @__PURE__ */ h(Cell, {
		i,
		digit: paused ? 0 : digit,
		given: givens[i] !== 0,
		notes: paused ? 0 : notes[i],
		n,
		cols: noteColumns(n),
		focus,
		look: !hidden && lookOf(i, seen),
		error: errors && errors.has(i),
		mark: marks[i],
		ghost: ghosts[i],
		style: {
			gridColumn: place(i % n),
			gridRow: place(Math.floor(i / n))
		},
		onPress: actions.tap
	})), !hidden && /* @__PURE__ */ h(Signs, {
		n,
		right: game.right,
		down: game.down
	}), paused && /* @__PURE__ */ h(PausedCover, { onResume: () => actions.pause(false) })), /* @__PURE__ */ h(Pad, {
		state,
		actions,
		counts: digitCounts(board, n),
		columns: padTracks(n)
	})), hint && !paused && /* @__PURE__ */ h(HintPanel, {
		text: hint.text,
		more: more(hint)
	})));
};
//#endregion
export { sizes as C, geometry as S, Futoshiki_module_default as T, breaks as _, running as a, fallback as b, completeWithErrors as c, levels as d, nextSteps as f, allowed as g, solve as h, place as i, findHint as l, countSolutions as m, Signs as n, tracks as o, rate as p, noteColumns as r, levelNames as s, Game as t, apply as u, candidatesOf as v, solved as w, full as x, emptyBoard as y };
