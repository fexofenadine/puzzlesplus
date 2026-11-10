(function() {
	//#region src/shell/random.js
	const random = (seed) => {
		let a = seed >>> 0;
		return () => {
			a = a + 1831565813 >>> 0;
			let t = a;
			t = Math.imul(t ^ t >>> 15, t | 1);
			t ^= t + Math.imul(t ^ t >>> 7, t | 61);
			return ((t ^ t >>> 14) >>> 0) / 4294967296;
		};
	};
	const shuffled = (list, rng) => {
		const copy = list.slice();
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(rng() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	};
	//#endregion
	//#region src/shell/grid.js
	const capital = (text) => text[0].toUpperCase() + text.slice(1);
	const listOf = (items) => items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
	const boxShapes = {
		4: [2, 2],
		6: [3, 2],
		9: [3, 3],
		12: [4, 3],
		16: [4, 4]
	};
	const emptyBoard = (n) => new Int8Array(n * n);
	const bit = (d) => 1 << d - 1;
	const all = (n) => (1 << n) - 1;
	const countBits = (mask) => {
		let count = 0;
		for (let m = mask; m; m &= m - 1) count++;
		return count;
	};
	const digitsOf = (mask) => {
		const digits = [];
		for (let d = 1; mask >> d - 1; d++) if (mask & bit(d)) digits.push(d);
		return digits;
	};
	const onlyDigit = (mask) => 31 - Math.clz32(mask) + 1;
	const places = (count, first, last) => count === 2 ? [first, last] : count === 3 ? [
		first,
		"middle",
		last
	] : null;
	const boxName = (index, n) => {
		const [bw, bh] = boxShapes[n];
		const across = places(n / bw, "left", "right");
		const down = places(n / bh, "top", "bottom");
		if (!across || !down) return `box ${index + 1}`;
		const x = across[index % (n / bw)];
		const y = down[Math.floor(index / (n / bw))];
		return x === "middle" && y === "middle" ? "the centre box" : `the ${y} ${x} box`;
	};
	const nameOf = (kind, index, n) => kind === "box" ? boxName(index, n) : `${kind} ${index + 1}`;
	const geometries = {};
	const geometry = (n) => {
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
	const full = (board) => !board.includes(0);
	const candidatesOf = (board, n) => {
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
	//#endregion
	//#region src/sudoku/solver.js
	const place = (board, cands, peers, i, d) => {
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
	const settle = (board, cands, n) => {
		const { units, peers } = geometry(n);
		for (let changed = true; changed;) {
			changed = false;
			for (let i = 0; i < board.length; i++) {
				if (board[i] !== 0) continue;
				const mask = cands[i];
				if (!mask) return false;
				if (mask & mask - 1) continue;
				if (!place(board, cands, peers, i, onlyDigit(mask))) return false;
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
					if (!place(board, cands, peers, i, onlyDigit(b))) return false;
					changed = true;
				}
			}
		}
		return true;
	};
	const narrowest = (board, cands) => {
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
	const search = (board, cands, n, found, order, budget) => {
		if (!settle(board, cands, n)) return false;
		const i = narrowest(board, cands);
		if (i < 0) return found(board);
		for (const d of order(digitsOf(cands[i]))) {
			if (--budget.steps < 0) return null;
			const nextBoard = board.slice();
			const nextCands = cands.slice();
			if (!place(nextBoard, nextCands, geometry(n).peers, i, d)) continue;
			const done = search(nextBoard, nextCands, n, found, order, budget);
			if (done !== false) return done;
		}
		return false;
	};
	const asIs = (list) => list;
	const countSolutions = (board, n, limit = 2) => {
		let count = 0;
		search(board.slice(), candidatesOf(board, n), n, () => ++count >= limit, asIs, { steps: Infinity });
		return count;
	};
	const solve = (board, n, order = asIs, steps = Infinity) => {
		let solution = null;
		return search(board.slice(), candidatesOf(board, n), n, (b) => {
			solution = b.slice();
			return true;
		}, order, { steps }) ? solution : null;
	};
	//#endregion
	//#region src/sudoku/techniques.js
	const levels = [
		"easy",
		"medium",
		"hard",
		"expert"
	];
	const words = [
		"no",
		"one",
		"two",
		"three",
		"four"
	];
	const orList = (items) => `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;
	const step = (technique, level, { place = [], remove = [], sources = [] }, text) => ({
		technique,
		level,
		place,
		remove,
		sources,
		text
	});
	const combinations = (list, k, start = 0, picked = [], out = []) => {
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
	const blocker = (board, n, i, d) => geometry(n).peers[i].find((p) => board[p] === d);
	const unique = (list) => [...new Set(list.filter((x) => x !== void 0))];
	const removals = (cands, cells, mask, keep = []) => cells.filter((i) => !keep.includes(i) && cands[i] & mask).map((i) => [i, cands[i] & mask]);
	const unitOrder = (n) => {
		const { units } = geometry(n);
		return [...units.filter((u) => u.kind === "box"), ...units.filter((u) => u.kind !== "box")];
	};
	const hiddenSingles = (board, cands, n) => {
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
	const nakedSingles = (board, cands, n) => {
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
	const lockedCandidates = (board, cands, n) => {
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
	const nakedSubsets = (k, level) => (board, cands, n) => {
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
	const hiddenSubsets = (k, level) => (board, cands, n) => {
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
				const mask = group.reduce((m, d) => m | bit(d), 0);
				const remove = removals(cands, cells, ~mask & all(n));
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
	const fishNames = [
		"",
		"",
		"x-wing",
		"swordfish",
		"jellyfish"
	];
	const fish = (k, level) => (board, cands, n) => {
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
	const sees = (n, a, b) => a !== b && geometry(n).peers[a].includes(b);
	const xyWing = (board, cands, n) => {
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
					const targets = peers[a].filter((c) => c !== b && c !== pivot && sees(n, b, c));
					const remove = removals(cands, targets, bit(z));
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
	const xyzWing = (board, cands, n) => {
		const { peers } = geometry(n);
		const steps = [];
		for (let pivot = 0; pivot < board.length; pivot++) {
			if (board[pivot] || countBits(cands[pivot]) !== 3) continue;
			const wings = peers[pivot].filter((p) => !board[p] && countBits(cands[p]) === 2 && (cands[p] & cands[pivot]) === cands[p]);
			for (const [a, b] of combinations(wings, 2)) {
				const z = cands[a] & cands[b];
				if (countBits(z) !== 1 || (cands[a] | cands[b]) !== cands[pivot]) continue;
				const targets = peers[pivot].filter((c) => c !== a && c !== b && sees(n, a, c) && sees(n, b, c));
				const remove = removals(cands, targets, z);
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
	const whatIf = (board, cands, n) => {
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
	const nakedPairs = nakedSubsets(2, 1);
	const hiddenPairs = hiddenSubsets(2, 1);
	const nakedTriples = nakedSubsets(3, 2);
	const hiddenTriples = hiddenSubsets(3, 2);
	const nakedQuads = nakedSubsets(4, 2);
	const hiddenQuads = hiddenSubsets(4, 2);
	const xWing = fish(2, 2);
	const swordfish = fish(3, 3);
	const jellyfish = fish(4, 3);
	const techniques = [
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
	const broken = (board, cands, n) => {
		for (let i = 0; i < board.length; i++) if (!board[i] && !cands[i]) return true;
		for (const { cells } of geometry(n).units) {
			let mask = 0;
			for (const i of cells) mask |= board[i] ? bit(board[i]) : cands[i];
			if (mask !== all(n)) return true;
		}
		return false;
	};
	const nextSteps = (board, cands, n, top = levels.length - 1, from = 0) => {
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
	const apply = (board, cands, n, steps) => {
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
	const rate = (givens, n, top = levels.length - 1) => {
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
	//#region src/sudoku/generate.js
	const fewest = [
		36,
		30,
		25,
		20
	];
	const minGivens = (n, level) => Math.round(fewest[level] / 81 * n * n);
	const makeSolution = (n, rng) => {
		for (;;) {
			const board = solve(emptyBoard(n), n, (list) => shuffled(list, rng), 50 * n);
			if (board) return board;
		}
	};
	const makePuzzle = (n, rng, keep, least = 0) => {
		const solution = makeSolution(n, rng);
		const givens = solution.slice();
		let count = n * n;
		const last = n * n - 1;
		for (const i of shuffled([...givens.keys()], rng)) {
			if (i > last - i || givens[i] === 0) continue;
			const pair = i === last - i ? [i] : [i, last - i];
			if (count - pair.length < least) continue;
			for (const c of pair) givens[c] = 0;
			if (keep(givens)) count -= pair.length;
			else for (const c of pair) givens[c] = solution[c];
		}
		return {
			givens,
			solution
		};
	};
	const makeGame = (n, level, rng, budget = 1500) => {
		const start = performance.now();
		const keep = level === levels.length - 1 ? (board) => countSolutions(board, n, 2) === 1 : (board) => rate(board, n, level) !== null;
		let best = null;
		do {
			const puzzle = makePuzzle(n, rng, keep, minGivens(n, level));
			const rated = rate(puzzle.givens, n, level)?.level;
			if (rated === void 0) continue;
			if (rated === level) return {
				...puzzle,
				level
			};
			if (!best || rated > best.level) best = {
				...puzzle,
				level: rated
			};
		} while (performance.now() - start < budget);
		return best;
	};
	//#endregion
	//#region src/sudoku/deal.worker.js
	self.onmessage = ({ data: { id, n, level, seed, budget } }) => {
		const { givens, solution, level: got } = makeGame(n, level, random(seed), budget);
		self.postMessage({
			id,
			givens,
			solution,
			level: got
		}, [givens.buffer, solution.buffer]);
	};
	//#endregion
})();
