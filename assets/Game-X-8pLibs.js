import { F as Dialog, S as windowClear, T as Menu_module_default, c as gameLinks, d as MenuItem, f as Separator, g as ThemeMenu, h as ViewMenu, m as resumeItems, p as SubMenuItem, w as watchWindow, z as h } from "./HowToPlay-CY1p7JOT.js";
import { c as SideButton, d as Digit, i as windowProps, l as UndoIcon, n as PausedCover, p as clockDigits, r as WindowControls, s as HintIcon, t as HintPanel, u as Play } from "./Board-DWftJVEI.js";
import { t as Game_module_default } from "./Game.module-CghLtUtO.js";
import { t as capital } from "./grid-D_4m0l-G.js";
var Sudoku_module_default = {
	board: "Sudoku_board",
	field: "Sudoku_field",
	active: "Sudoku_active Sudoku_field",
	inactive: "Sudoku_inactive Sudoku_field",
	pad: "Sudoku_pad",
	digits: "Sudoku_digits",
	tools: "Sudoku_tools",
	key: "Sudoku_key",
	picked: "Sudoku_picked",
	used: "Sudoku_used"
};
var sizes = [9];
var boxShapes = {
	4: [2, 2],
	6: [3, 2],
	9: [3, 3],
	12: [4, 3],
	16: [4, 4]
};
var emptyBoard = (n) => new Int8Array(n * n);
var bit = (d) => 1 << d - 1;
var all = (n) => (1 << n) - 1;
var countBits = (mask) => {
	let count = 0;
	for (let m = mask; m; m &= m - 1) count++;
	return count;
};
var digitsOf = (mask) => {
	const digits = [];
	for (let d = 1; mask >> d - 1; d++) if (mask & bit(d)) digits.push(d);
	return digits;
};
var onlyDigit = (mask) => 31 - Math.clz32(mask) + 1;
var boxNames = [
	"top left",
	"top middle",
	"top right",
	"middle left",
	"centre",
	"middle right",
	"bottom left",
	"bottom middle",
	"bottom right"
];
var nameOf = (kind, index, n) => {
	if (kind !== "box") return `${kind} ${index + 1}`;
	return n === 9 ? `the ${boxNames[index]} box` : `box ${index + 1}`;
};
var geometries = {};
var geometry = (n) => {
	if (geometries[n]) return geometries[n];
	const [bw, bh] = boxShapes[n];
	const units = [];
	const add = (kind, index, cells) => units.push({
		kind,
		index,
		cells,
		name: nameOf(kind, index, n)
	});
	for (let r = 0; r < n; r++) add("row", r, Array.from({ length: n }, (_, c) => r * n + c));
	for (let c = 0; c < n; c++) add("column", c, Array.from({ length: n }, (_, r) => r * n + c));
	for (let b = 0; b < n; b++) {
		const top = Math.floor(b / (n / bw)) * bh;
		const left = b % (n / bw) * bw;
		const cells = [];
		for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) cells.push((top + y) * n + left + x);
		add("box", b, cells);
	}
	const unitsOf = Array.from({ length: n * n }, () => []);
	units.forEach((unit) => unit.cells.forEach((i) => unitsOf[i].push(unit)));
	const peers = unitsOf.map((list, i) => {
		const set = new Set(list.flatMap((unit) => unit.cells));
		set.delete(i);
		return [...set];
	});
	const boxOf = (i) => unitsOf[i].find((unit) => unit.kind === "box").index;
	geometries[n] = {
		n,
		bw,
		bh,
		units,
		unitsOf,
		peers,
		boxOf
	};
	return geometries[n];
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
var breaks = (board, n) => {
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
				unit,
				text: `${capital(unit.name)} has ${d} more than once.`
			});
		});
	}
	return found;
};
var violations = (board, n) => new Set(breaks(board, n).flatMap(({ cells }) => cells));
var solved = (board, n) => full(board) && breaks(board, n).length === 0;
var digitCounts = (board, n) => {
	const counts = new Array(n + 1).fill(0);
	for (const d of board) counts[d]++;
	return counts;
};
//#endregion
//#region src/sudoku/solver.js
var place$1 = (board, cands, peers, i, d) => {
	board[i] = d;
	cands[i] = 0;
	const b = bit(d);
	for (const p of peers[i]) {
		if (board[p] !== 0 || !(cands[p] & b)) continue;
		cands[p] &= ~b;
		if (!cands[p]) return false;
	}
	return true;
};
var settle = (board, cands, n) => {
	const { units, peers } = geometry(n);
	for (let changed = true; changed;) {
		changed = false;
		for (let i = 0; i < board.length; i++) {
			if (board[i] !== 0) continue;
			const mask = cands[i];
			if (!mask) return false;
			if (mask & mask - 1) continue;
			if (!place$1(board, cands, peers, i, onlyDigit(mask))) return false;
			changed = true;
		}
		for (const { cells } of units) {
			let once = 0;
			let twice = 0;
			let placed = 0;
			for (const i of cells) {
				if (board[i] !== 0) {
					placed |= bit(board[i]);
					continue;
				}
				twice |= once & cands[i];
				once |= cands[i];
			}
			if ((once | placed) !== (1 << n) - 1) return false;
			let lone = once & ~twice & ~placed;
			while (lone) {
				const b = lone & -lone;
				lone &= lone - 1;
				const i = cells.find((c) => board[c] === 0 && cands[c] & b);
				if (i === void 0) continue;
				if (!place$1(board, cands, peers, i, onlyDigit(b))) return false;
				changed = true;
			}
		}
	}
	return true;
};
var narrowest = (board, cands) => {
	let best = -1;
	let fewest = 99;
	for (let i = 0; i < board.length; i++) {
		if (board[i] !== 0) continue;
		const count = countBits(cands[i]);
		if (count < fewest) {
			fewest = count;
			best = i;
			if (count === 2) break;
		}
	}
	return best;
};
var search = (board, cands, n, found, order, budget) => {
	if (!settle(board, cands, n)) return false;
	const i = narrowest(board, cands);
	if (i < 0) return found(board);
	for (const d of order(digitsOf(cands[i]))) {
		if (--budget.steps < 0) return null;
		const nextBoard = board.slice();
		const nextCands = cands.slice();
		if (!place$1(nextBoard, nextCands, geometry(n).peers, i, d)) continue;
		const done = search(nextBoard, nextCands, n, found, order, budget);
		if (done !== false) return done;
	}
	return false;
};
var asIs = (list) => list;
var countSolutions = (board, n, limit = 2) => {
	let count = 0;
	search(board.slice(), candidatesOf(board, n), n, () => ++count >= limit, asIs, { steps: Infinity });
	return count;
};
var solve = (board, n, order = asIs, steps = Infinity) => {
	let solution = null;
	return search(board.slice(), candidatesOf(board, n), n, (b) => {
		solution = b.slice();
		return true;
	}, order, { steps }) ? solution : null;
};
//#endregion
//#region src/sudoku/techniques.js
var levels = [
	"easy",
	"medium",
	"hard",
	"expert"
];
var words = [
	"no",
	"one",
	"two",
	"three",
	"four"
];
var listOf = (items) => items.length < 2 ? `${items[0]}` : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
var orList = (items) => `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;
var step = (technique, level, { place = [], remove = [], sources = [] }, text) => ({
	technique,
	level,
	place,
	remove,
	sources,
	text
});
var combinations = (list, k, start = 0, picked = [], out = []) => {
	if (picked.length === k) {
		out.push(picked.slice());
		return out;
	}
	for (let i = start; i <= list.length - (k - picked.length); i++) {
		picked.push(list[i]);
		combinations(list, k, i + 1, picked, out);
		picked.pop();
	}
	return out;
};
var blocker = (board, n, i, d) => geometry(n).peers[i].find((p) => board[p] === d);
var unique = (list) => [...new Set(list.filter((x) => x !== void 0))];
var removals = (cands, cells, mask, keep = []) => cells.filter((i) => !keep.includes(i) && cands[i] & mask).map((i) => [i, cands[i] & mask]);
var unitOrder = (n) => {
	const { units } = geometry(n);
	return [...units.filter((u) => u.kind === "box"), ...units.filter((u) => u.kind !== "box")];
};
var hiddenSingles = (board, cands, n) => {
	const steps = [];
	const seen = /* @__PURE__ */ new Set();
	for (const unit of unitOrder(n)) for (let d = 1; d <= n; d++) {
		const spots = unit.cells.filter((i) => board[i] === 0 && cands[i] & bit(d));
		if (spots.length !== 1 || seen.has(spots[0])) continue;
		const [i] = spots;
		seen.add(i);
		const others = unit.cells.filter((c) => c !== i && board[c] === 0);
		steps.push(step("hidden-single", 0, {
			place: [[i, d]],
			sources: unique(others.map((c) => blocker(board, n, c, d)))
		}, `${d} can only go in one cell of ${unit.name}, so it goes here.`));
	}
	return steps;
};
var nakedSingles = (board, cands, n) => {
	const steps = [];
	for (let i = 0; i < board.length; i++) {
		const mask = cands[i];
		if (board[i] !== 0 || !mask || mask & mask - 1) continue;
		const d = onlyDigit(mask);
		const others = digitsOf(all(n) & ~mask);
		const sources = unique(others.map((o) => blocker(board, n, i, o)));
		const plain = sources.length === others.length;
		steps.push(step("naked-single", 0, {
			place: [[i, d]],
			sources
		}, plain ? `Every other digit is already in this cell's row, column or box, so it must be ${d}.` : `Only ${d} is left as a candidate for this cell, so it must be ${d}.`));
	}
	return steps;
};
var lockedCandidates = (board, cands, n) => {
	const { units, unitsOf } = geometry(n);
	const steps = [];
	for (const unit of units) for (let d = 1; d <= n; d++) {
		const spots = unit.cells.filter((i) => board[i] === 0 && cands[i] & bit(d));
		if (spots.length < 2) continue;
		const shared = unitsOf[spots[0]].filter((other) => other !== unit && spots.every((i) => other.cells.includes(i)));
		for (const other of shared) {
			if (unit.kind === "box" === (other.kind === "box")) continue;
			const remove = removals(cands, other.cells, bit(d), spots);
			if (!remove.length) continue;
			const pointing = unit.kind === "box";
			steps.push(step(pointing ? "pointing" : "claiming", 1, {
				remove,
				sources: spots
			}, `In ${unit.name}, ${d} can only go in ${other.name}, so ${d} can't go anywhere else in ${other.name}.`));
		}
	}
	return steps;
};
var nakedSubsets = (k, level) => (board, cands, n) => {
	const steps = [];
	for (const unit of geometry(n).units) {
		const open = unit.cells.filter((i) => board[i] === 0 && countBits(cands[i]) <= k);
		for (const cells of combinations(open, k)) {
			const mask = cells.reduce((m, i) => m | cands[i], 0);
			if (countBits(mask) !== k) continue;
			const remove = removals(cands, unit.cells, mask, cells);
			if (!remove.length) continue;
			steps.push(step(`naked-${[
				"",
				"",
				"pair",
				"triple",
				"quad"
			][k]}`, level, {
				remove,
				sources: cells
			}, `These ${words[k]} cells in ${unit.name} can only hold ${listOf(digitsOf(mask))} between them, so those digits can't go anywhere else in ${unit.name}.`));
		}
	}
	return steps;
};
var hiddenSubsets = (k, level) => (board, cands, n) => {
	const steps = [];
	for (const unit of geometry(n).units) {
		const open = unit.cells.filter((i) => board[i] === 0);
		const placed = unit.cells.reduce((m, i) => board[i] ? m | bit(board[i]) : m, 0);
		const spotsOf = (d) => open.filter((i) => cands[i] & bit(d));
		const digits = digitsOf(all(n) & ~placed).filter((d) => {
			const count = spotsOf(d).length;
			return count >= 2 && count <= k;
		});
		for (const group of combinations(digits, k)) {
			const cells = unique(group.flatMap(spotsOf));
			if (cells.length !== k) continue;
			const remove = removals(cands, cells, ~group.reduce((m, d) => m | bit(d), 0) & all(n));
			if (!remove.length) continue;
			steps.push(step(`hidden-${[
				"",
				"",
				"pair",
				"triple",
				"quad"
			][k]}`, level, {
				remove,
				sources: cells
			}, `${capital(listOf(group))} can only go in these ${words[k]} cells of ${unit.name}, so those cells can't hold anything else.`));
		}
	}
	return steps;
};
var fishNames = [
	"",
	"",
	"x-wing",
	"swordfish",
	"jellyfish"
];
var fish = (k, level) => (board, cands, n) => {
	const { units } = geometry(n);
	const steps = [];
	for (const [base, cover] of [["row", "column"], ["column", "row"]]) {
		const bases = units.filter((u) => u.kind === base);
		const covers = units.filter((u) => u.kind === cover);
		const along = (i) => cover === "column" ? i % n : Math.floor(i / n);
		for (let d = 1; d <= n; d++) {
			const lines = bases.map((unit) => ({
				unit,
				spots: unit.cells.filter((i) => !board[i] && cands[i] & bit(d))
			})).filter(({ spots }) => spots.length >= 2 && spots.length <= k);
			for (const group of combinations(lines, k)) {
				const crossed = unique(group.flatMap(({ spots }) => spots.map(along))).sort((a, b) => a - b);
				if (crossed.length !== k) continue;
				const spots = group.flatMap((line) => line.spots);
				const remove = crossed.flatMap((c) => removals(cands, covers[c].cells, bit(d), spots));
				if (!remove.length) continue;
				const baseNames = listOf(group.map(({ unit }) => unit.index + 1));
				const coverNames = listOf(crossed.map((c) => c + 1));
				steps.push(step(fishNames[k], level, {
					remove,
					sources: spots
				}, `In ${base}s ${baseNames}, ${d} can only go in ${cover}s ${coverNames}. Whichever cells it takes, it fills those ${cover}s, so ${d} can't go anywhere else in them.`));
			}
		}
	}
	return steps;
};
var sees = (n, a, b) => a !== b && geometry(n).peers[a].includes(b);
var xyWing = (board, cands, n) => {
	const { peers } = geometry(n);
	const steps = [];
	const pairs = [...board.keys()].filter((i) => !board[i] && countBits(cands[i]) === 2);
	for (const pivot of pairs) {
		const [x, y] = digitsOf(cands[pivot]);
		const wings = peers[pivot].filter((p) => !board[p] && countBits(cands[p]) === 2);
		for (const a of wings) {
			if ((cands[a] & cands[pivot]) !== bit(x)) continue;
			const z = onlyDigit(cands[a] & ~bit(x));
			for (const b of wings) {
				if (b === a || cands[b] !== (bit(y) | bit(z))) continue;
				const remove = removals(cands, peers[a].filter((c) => c !== b && c !== pivot && sees(n, b, c)), bit(z));
				if (!remove.length) continue;
				steps.push(step("xy-wing", 2, {
					remove,
					sources: [
						pivot,
						a,
						b
					]
				}, `The middle cell is ${x} or ${y}. Either way one of the outer cells becomes ${z}, so no cell that sees both outer cells can be ${z}.`));
			}
		}
	}
	return steps;
};
var xyzWing = (board, cands, n) => {
	const { peers } = geometry(n);
	const steps = [];
	for (let pivot = 0; pivot < board.length; pivot++) {
		if (board[pivot] || countBits(cands[pivot]) !== 3) continue;
		const wings = peers[pivot].filter((p) => !board[p] && countBits(cands[p]) === 2 && (cands[p] & cands[pivot]) === cands[p]);
		for (const [a, b] of combinations(wings, 2)) {
			const z = cands[a] & cands[b];
			if (countBits(z) !== 1 || (cands[a] | cands[b]) !== cands[pivot]) continue;
			const remove = removals(cands, peers[pivot].filter((c) => c !== a && c !== b && sees(n, a, c) && sees(n, b, c)), z);
			if (!remove.length) continue;
			const d = onlyDigit(z);
			const [x, y] = digitsOf(cands[pivot] & ~z);
			steps.push(step("xyz-wing", 3, {
				remove,
				sources: [
					pivot,
					a,
					b
				]
			}, `The middle cell is ${orList(digitsOf(cands[pivot]))}, and the outer cells are ${orList([x, d].sort())} and ${orList([y, d].sort())}. One of the three must be ${d}, so no cell that sees all three can be ${d}.`));
		}
	}
	return steps;
};
var whatIf = (board, cands, n) => {
	const open = [...board.keys()].filter((i) => !board[i]).sort((a, b) => countBits(cands[a]) - countBits(cands[b]));
	const { peers } = geometry(n);
	for (const i of open) for (const d of digitsOf(cands[i])) {
		const trialBoard = board.slice();
		const trialCands = cands.slice();
		trialBoard[i] = d;
		trialCands[i] = 0;
		for (const p of peers[i]) trialCands[p] &= ~bit(d);
		if (settle(trialBoard, trialCands, n)) continue;
		return [step("what-if", 3, {
			remove: [[i, bit(d)]],
			sources: [i]
		}, `If this cell were ${d}, the singles would soon leave a cell or a ${d} with nowhere to go, so it can't be ${d}.`)];
	}
	return [];
};
var nakedPairs = nakedSubsets(2, 1);
var hiddenPairs = hiddenSubsets(2, 1);
var nakedTriples = nakedSubsets(3, 2);
var hiddenTriples = hiddenSubsets(3, 2);
var nakedQuads = nakedSubsets(4, 2);
var hiddenQuads = hiddenSubsets(4, 2);
var xWing = fish(2, 2);
var swordfish = fish(3, 3);
var jellyfish = fish(4, 3);
var techniques = [
	[hiddenSingles, nakedSingles],
	[
		lockedCandidates,
		nakedPairs,
		hiddenPairs
	],
	[
		nakedTriples,
		hiddenTriples,
		xWing,
		xyWing,
		nakedQuads,
		hiddenQuads
	],
	[
		swordfish,
		xyzWing,
		jellyfish,
		whatIf
	]
];
var broken = (board, cands, n) => {
	for (let i = 0; i < board.length; i++) if (!board[i] && !cands[i]) return true;
	for (const { cells } of geometry(n).units) {
		let mask = 0;
		for (const i of cells) mask |= board[i] ? bit(board[i]) : cands[i];
		if (mask !== all(n)) return true;
	}
	return false;
};
var nextSteps = (board, cands, n, top = levels.length - 1, from = 0) => {
	if (broken(board, cands, n)) return {
		contradiction: true,
		steps: []
	};
	for (let level = from; level <= top; level++) for (const technique of techniques[level]) {
		const steps = technique(board, cands, n);
		if (steps.length) return {
			level,
			steps
		};
	}
	return { steps: [] };
};
var apply = (board, cands, n, steps) => {
	const { peers } = geometry(n);
	for (const { place, remove } of steps) {
		for (const [i, mask] of remove) cands[i] &= ~mask;
		for (const [i, d] of place) {
			if (board[i] !== 0) {
				if (board[i] !== d) return false;
				continue;
			}
			if (!(cands[i] & bit(d))) return false;
			board[i] = d;
			cands[i] = 0;
			for (const p of peers[i]) cands[p] &= ~bit(d);
		}
	}
	return true;
};
var rate = (givens, n, top = levels.length - 1) => {
	const board = givens.slice();
	const cands = candidatesOf(board, n);
	let hardest = 0;
	for (;;) {
		if (!settle(board, cands, n)) return null;
		if (full(board)) break;
		if (top < 1) return null;
		const { contradiction, level, steps } = nextSteps(board, cands, n, top, 1);
		if (contradiction || !steps.length) return null;
		hardest = Math.max(hardest, level);
		if (!apply(board, cands, n, steps)) return null;
	}
	return {
		level: hardest,
		solution: board
	};
};
//#endregion
//#region src/sudoku/hint.js
var completeWithErrors = "The board is complete but there are errors. Do you want to use a hint?";
var marked = (entries) => Object.fromEntries(entries);
var guideTopic = ({ kind }) => ({
	break: "mistakes",
	wrong: "mistakes",
	note: "mistakes",
	reveal: "mistakes",
	solved: null,
	"naked-quad": "naked-triple",
	"hidden-quad": "hidden-triple",
	jellyfish: "swordfish"
})[kind] ?? kind;
var enabler = (rounds, placement, n) => {
	const [[i, d]] = placement.place;
	const units = geometry(n).unitsOf[i];
	const matters = ([c, mask]) => c === i || mask & bit(d) && units.some((unit) => unit.cells.includes(c));
	for (let r = rounds.length - 1; r >= 0; r--) {
		const found = rounds[r].find((s) => s.remove.some(matters));
		if (found) return found;
	}
	return rounds.at(-1)[0];
};
var lower = (text) => text[0].toLowerCase() + text.slice(1);
var nextDigit = (board, n) => {
	const work = board.slice();
	const cands = candidatesOf(work, n);
	const rounds = [];
	for (let k = 0; k < 200; k++) {
		const { steps } = nextSteps(work, cands, n);
		if (!steps.length) return null;
		const placement = steps.find((s) => s.place.length);
		if (placement) {
			if (!rounds.length) return { placement };
			return {
				placement,
				via: enabler(rounds, placement, n)
			};
		}
		rounds.push(steps);
		if (!apply(work, cands, n, steps)) return null;
	}
	return null;
};
var findHint = ({ board, notes, solution, n }) => {
	if (solved(board, n)) return {
		kind: "solved",
		text: "The puzzle is solved.",
		marks: {}
	};
	const broken = breaks(board, n);
	if (broken.length) {
		const { cells, text } = broken[0];
		const bad = cells.filter((i) => board[i] !== solution[i]);
		const fix = bad.length ? bad : cells;
		return {
			kind: "break",
			text: `${text} ${fix.length > 1 ? "The cells outlined in red are the ones" : "The cell outlined in red is the one"} to change.`,
			marks: marked(cells.map((i) => [i, fix.includes(i) ? "wrong" : "source"]))
		};
	}
	const wrong = [...board.keys()].find((i) => board[i] !== 0 && board[i] !== solution[i]);
	if (wrong !== void 0) return {
		kind: "wrong",
		text: `This ${board[wrong]} breaks no rule yet but doesn't fit the puzzle's only solution. Clear it and the reasoning can carry on.`,
		marks: { [wrong]: "wrong" }
	};
	const missing = [...board.keys()].find((i) => board[i] === 0 && notes && notes[i] && !(notes[i] & bit(solution[i])));
	if (missing !== void 0) return {
		kind: "note",
		text: "This cell's notes leave out the digit it needs. Check them again, or use Auto Notes.",
		marks: { [missing]: "wrong" }
	};
	const found = nextDigit(board, n);
	if (!found) {
		const i = board.indexOf(0);
		return {
			kind: "reveal",
			text: "No technique gives the next digit away, so this one comes from the solution.",
			place: [[i, solution[i]]],
			marks: { [i]: "place" }
		};
	}
	const { placement, via } = found;
	const [[i]] = placement.place;
	if (!via) return {
		kind: placement.technique,
		text: placement.text,
		place: placement.place,
		marks: marked([...placement.sources.map((c) => [c, "source"]), [i, "place"]])
	};
	return {
		kind: via.technique,
		text: `${via.text} Then ${lower(placement.text)}`,
		place: placement.place,
		marks: marked([
			...via.remove.map(([c]) => [c, "remove"]),
			...via.sources.map((c) => [c, "source"]),
			[i, "place"]
		])
	};
};
//#endregion
//#region src/sudoku/Menu.jsx
var levelNames = [
	"Easy",
	"Medium",
	"Hard",
	"Expert"
];
var allowed = () => true;
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
	name: "Undo",
	hotKey: "Ctrl+Z",
	onClick: () => actions.undo()
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
	name: "Best Times...",
	onClick: actions.toggleBestTime
}), /* @__PURE__ */ h(Separator, null), resumeItems(state, actions), gameLinks("sudoku")), sizes.length > 1 && /* @__PURE__ */ h(MenuItem, {
	name: "Size",
	type: "size",
	active: state.menu,
	onChange: actions.toggleMenu
}, sizes.map((n) => /* @__PURE__ */ h(SubMenuItem, {
	name: `${n} × ${n}`,
	checked: state.game.n === n,
	onClick: () => actions.newGame({ n })
}))), /* @__PURE__ */ h(ViewMenu, {
	state,
	actions
}), /* @__PURE__ */ h(ThemeMenu, {
	state,
	actions
}), /* @__PURE__ */ h(MenuItem, {
	name: "Help",
	type: "help",
	active: state.menu,
	onChange: actions.toggleMenu
}, /* @__PURE__ */ h(SubMenuItem, {
	name: "How to Play...",
	onClick: actions.toggleHowTo
}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: "About Sudoku Plus...",
	onClick: actions.toggleAbout
})));
var SudokuCell_module_default = {
	root: "SudokuCell_root",
	given: "SudokuCell_given",
	entry: "SudokuCell_entry",
	peer: "SudokuCell_peer",
	same: "SudokuCell_same",
	selected: "SudokuCell_selected",
	error: "SudokuCell_error",
	notes: "SudokuCell_notes",
	note: "SudokuCell_note",
	noteOff: "SudokuCell_noteOff",
	noteFocus: "SudokuCell_noteFocus",
	ghost: "SudokuCell_ghost",
	hintSource: "SudokuCell_hintSource Board_outline",
	hintPlace: "SudokuCell_hintPlace Board_outline",
	hintRemove: "SudokuCell_hintRemove Board_outline",
	hintWrong: "SudokuCell_hintWrong Board_outline"
};
//#endregion
//#region src/sudoku/Cell.jsx
var hintClass = {
	source: SudokuCell_module_default.hintSource,
	place: SudokuCell_module_default.hintPlace,
	remove: SudokuCell_module_default.hintRemove,
	wrong: SudokuCell_module_default.hintWrong
};
var Notes = ({ notes, n, cols, focus }) => /* @__PURE__ */ h("span", {
	class: SudokuCell_module_default.notes,
	style: { "--cols": cols }
}, Array.from({ length: n }, (_, k) => /* @__PURE__ */ h("span", { class: notes & bit(k + 1) ? k + 1 === focus ? SudokuCell_module_default.noteFocus : SudokuCell_module_default.note : SudokuCell_module_default.noteOff }, k + 1)));
var Cell = ({ i, digit, given, notes, n, cols, focus, look, error, mark, ghost, style, onPress }) => /* @__PURE__ */ h("button", {
	type: "button",
	tabindex: -1,
	"data-cell": i,
	style,
	class: [
		SudokuCell_module_default.root,
		given ? SudokuCell_module_default.given : SudokuCell_module_default.entry,
		look && SudokuCell_module_default[look],
		error && SudokuCell_module_default.error,
		mark && hintClass[mark]
	].filter(Boolean).join(" "),
	onpointerdown: (event) => onPress({
		event,
		i
	})
}, digit ? String(digit) : ghost ? /* @__PURE__ */ h("span", { class: SudokuCell_module_default.ghost }, ghost) : notes ? /* @__PURE__ */ h(Notes, {
	notes,
	n,
	cols,
	focus
}) : "");
//#endregion
//#region src/sudoku/Game.jsx
var more = (hint) => guideTopic(hint) && `guide/#${guideTopic(hint)}`;
var running = ({ start, win, dealing }) => start >= 0 && !win && !dealing;
var tracks = (n, box) => Array.from({ length: n }, (_, k) => k < n - 1 ? `var(--size) ${(k + 1) % box ? 1 : 2}px` : "var(--size)").join(" ");
var place = (k) => 2 * k + 1;
var lookOf = (i, { selected, focus, board, peers }) => {
	if (i === selected) return "selected";
	if (focus && board[i] === focus) return "same";
	if (peers && peers.has(i)) return "peer";
	return null;
};
var Pad = ({ state, actions, counts }) => {
	const { game, picked, noting } = state;
	const { n } = game;
	const off = game.dealing || game.paused || game.win;
	return /* @__PURE__ */ h("div", { class: Sudoku_module_default.pad }, /* @__PURE__ */ h("div", {
		class: Sudoku_module_default.digits,
		style: { gridTemplateColumns: tracks(n, geometry(n).bw) }
	}, Array.from({ length: n }, (_, k) => /* @__PURE__ */ h("button", {
		type: "button",
		tabindex: -1,
		class: [
			Sudoku_module_default.key,
			picked === k + 1 && Sudoku_module_default.picked,
			counts[k + 1] >= n && Sudoku_module_default.used
		].filter(Boolean).join(" "),
		style: { gridColumn: place(k) },
		disabled: off,
		title: counts[k + 1] >= n ? `Every ${k + 1} is placed` : void 0,
		onclick: () => actions.pad({ d: k + 1 })
	}, k + 1))), /* @__PURE__ */ h("div", { class: Sudoku_module_default.tools }, /* @__PURE__ */ h("button", {
		type: "button",
		tabindex: -1,
		class: noting ? `${Sudoku_module_default.key} ${Sudoku_module_default.picked}` : Sudoku_module_default.key,
		title: "Digits go in as notes (Space)",
		disabled: off,
		onclick: () => actions.toggleNoting()
	}, "Notes ", noting ? "On" : "Off"), /* @__PURE__ */ h("button", {
		type: "button",
		tabindex: -1,
		class: Sudoku_module_default.key,
		title: "Erase (Backspace)",
		disabled: off,
		onclick: () => actions.erase()
	}, "Erase")));
};
var Game = ({ key, state, actions }) => {
	const { game, hint, selected, picked } = state;
	const { n, board, givens, notes, paused } = game;
	const { bw, bh, peers } = geometry(n);
	const errors = state.errors && !paused ? violations(board, n) : null;
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
		title: state.theme === "classic" ? "Sudoku" : "Sudoku Plus",
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
	}, /* @__PURE__ */ h(HintIcon, null))), /* @__PURE__ */ h(Digit, {
		value: game.time,
		digits: clockDigits(state.theme, game.time),
		blank: !state.timer
	})), /* @__PURE__ */ h("div", { class: Sudoku_module_default.board }, /* @__PURE__ */ h("div", {
		class: running(game) && !paused ? Sudoku_module_default.active : Sudoku_module_default.inactive,
		style: {
			"--tracks": tracks(n, bw),
			"--rows": tracks(n, bh)
		}
	}, [...board].map((digit, i) => /* @__PURE__ */ h(Cell, {
		i,
		digit: paused ? 0 : digit,
		given: givens[i] !== 0,
		notes: paused ? 0 : notes[i],
		n,
		cols: bw,
		focus,
		look: !paused && !game.dealing && lookOf(i, seen),
		error: errors && errors.has(i),
		mark: marks[i],
		ghost: ghosts[i],
		style: {
			gridColumn: place(i % n),
			gridRow: place(Math.floor(i / n))
		},
		onPress: actions.tap
	})), paused && /* @__PURE__ */ h(PausedCover, { onResume: () => actions.pause(false) })), /* @__PURE__ */ h(Pad, {
		state,
		actions,
		counts: digitCounts(board, n)
	})), hint && !paused && /* @__PURE__ */ h(HintPanel, {
		text: hint.text,
		more: more(hint)
	})));
};
//#endregion
export { emptyBoard as A, xyWing as C, bit as D, solve as E, solved as F, Sudoku_module_default as I, geometry as M, onlyDigit as N, boxShapes as O, sizes as P, xWing as S, countSolutions as T, nakedSingles as _, Cell as a, swordfish as b, levelNames as c, hiddenPairs as d, hiddenSingles as f, nakedPairs as g, lockedCandidates as h, tracks as i, full as j, candidatesOf as k, completeWithErrors as l, levels as m, place as n, allowed as o, hiddenTriples as p, running as r, fallback as s, Game as t, findHint as u, nakedTriples as v, xyzWing as w, whatIf as x, rate as y };
