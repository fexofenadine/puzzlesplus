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
	//#region src/sudoku/rules.js
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
	const cellName = (i, n) => `row ${Math.floor(i / n) + 1}, column ${i % n + 1}`;
	const geometries = {};
	const geometry = (n) => {
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
		const peers = unitsOf.map((list, i) => {
			const set = new Set(list.flatMap((unit) => unit.cells));
			set.delete(i);
			return [...set];
		});
		geometries[n] = {
			n,
			units,
			unitsOf,
			peers
		};
		return geometries[n];
	};
	const pairCache = /* @__PURE__ */ new WeakMap();
	const pairsOf = ({ n, right, down }) => {
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
	//#region src/futoshiki/solver.js
	const lowest$1 = (mask) => 31 - Math.clz32(mask & -mask);
	const highest$1 = (mask) => 31 - Math.clz32(mask);
	const single = (mask) => mask && !(mask & mask - 1);
	const masksOf = (board, n) => {
		const masks = new Int32Array(n * n);
		for (let i = 0; i < n * n; i++) masks[i] = board[i] === 0 ? all(n) : bit(board[i]);
		return masks;
	};
	const tighten = (masks, puzzle) => {
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
	const search = (masks, puzzle, found) => {
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
	const countSolutions = (puzzle, limit = 2) => {
		let count = 0;
		search(masksOf(puzzle.givens, puzzle.n), puzzle, () => ++count >= limit);
		return count;
	};
	//#endregion
	//#region src/futoshiki/techniques.js
	const levels = [
		"easy",
		"medium",
		"hard",
		"expert"
	];
	const step = (technique, level, { place = [], remove = [], sources = [] }, say) => ({
		technique,
		level,
		place,
		remove,
		sources,
		get text() {
			return say();
		}
	});
	const lowest = (mask) => 31 - Math.clz32(mask & -mask) + 1;
	const highest = (mask) => 31 - Math.clz32(mask) + 1;
	const orList = (items) => items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;
	const unique = (list) => [...new Set(list.filter((x) => x !== void 0))];
	const blocker = (board, n, i, d) => geometry(n).peers[i].find((p) => board[p] === d);
	const nakedSingles = (puzzle, board, cands) => {
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
	const hiddenSingles = (puzzle, board, cands) => {
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
	const chains = (puzzle) => {
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
	const ends = (puzzle, board, cands) => {
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
	const beside = (puzzle, board, cands) => {
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
	const limits = (puzzle, board, cands) => {
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
	const nakedPairs = (puzzle, board, cands) => {
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
	const hiddenPairs = (puzzle, board, cands) => {
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
	const whatIf = (puzzle, board, cands) => {
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
	const techniques = [
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
	const dead = (board, cands) => board.some((v, i) => v === 0 && !cands[i]);
	const nextSteps = (puzzle, board, cands, top = levels.length - 1) => {
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
	const apply = (puzzle, board, cands, steps) => {
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
	const rate = (puzzle, top = levels.length - 1) => {
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
	//#region src/futoshiki/generate.js
	const makeSolution = (n, rng) => {
		const order = [...Array(n).keys()];
		const rows = shuffled(order, rng);
		const cols = shuffled(order, rng);
		const digits = shuffled(order, rng);
		return Int8Array.from({ length: n * n }, (_, i) => {
			const r = rows[Math.floor(i / n)];
			const c = cols[i % n];
			return digits[(r + c) % n] + 1;
		});
	};
	const allSigns = (solution, n) => {
		const right = new Int8Array(n * n);
		const down = new Int8Array(n * n);
		for (let i = 0; i < n * n; i++) {
			if (i % n < n - 1) right[i] = solution[i] < solution[i + 1] ? 1 : 2;
			if (i + n < n * n) down[i] = solution[i] < solution[i + n] ? 1 : 2;
		}
		return {
			right,
			down
		};
	};
	const makePuzzle = (n, rng, keep) => {
		const solution = makeSolution(n, rng);
		let puzzle = {
			n,
			givens: solution.slice(),
			...allSigns(solution, n)
		};
		const clues = [...solution.keys()].flatMap((i) => [
			["givens", i],
			["right", i],
			["down", i]
		]);
		for (const [part, i] of shuffled(clues, rng)) {
			if (puzzle[part][i] === 0) continue;
			const less = puzzle[part].slice();
			less[i] = 0;
			const trial = {
				...puzzle,
				[part]: less
			};
			if (keep(trial)) puzzle = trial;
		}
		return {
			...puzzle,
			solution
		};
	};
	const makeGame = (n, level, rng, budget = 1500) => {
		const start = performance.now();
		const keep = level === levels.length - 1 ? (puzzle) => countSolutions(puzzle, 2) === 1 : (puzzle) => rate(puzzle, level) !== null;
		let best = null;
		do {
			const puzzle = makePuzzle(n, rng, keep);
			const rated = rate(puzzle, level);
			if (!rated) continue;
			if (rated.level === level) return {
				...puzzle,
				level
			};
			if (!best || rated.level > best.level) best = {
				...puzzle,
				level: rated.level
			};
		} while (!best || performance.now() - start < budget);
		return best;
	};
	//#endregion
	//#region src/futoshiki/deal.worker.js
	self.onmessage = ({ data: { id, n, level, seed, budget } }) => {
		const { givens, right, down, solution, level: got } = makeGame(n, level, random(seed), budget);
		self.postMessage({
			id,
			givens,
			right,
			down,
			solution,
			level: got
		});
	};
	//#endregion
})();
