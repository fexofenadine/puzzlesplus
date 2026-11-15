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
	const emptyBoard = (n) => new Int8Array(n * n).fill(-1);
	const cellName = (i, n) => `row ${Math.floor(i / n) + 1}, column ${i % n + 1}`;
	const besideCache = {};
	const besideOf = (n) => besideCache[n] ??= Array.from({ length: n * n }, (_, i) => {
		const x = i % n;
		const y = Math.floor(i / n);
		const list = [];
		if (y > 0) list.push(i - n);
		if (x > 0) list.push(i - 1);
		if (x < n - 1) list.push(i + 1);
		if (y < n - 1) list.push(i + n);
		return list;
	});
	const sightCache = /* @__PURE__ */ new WeakMap();
	const sightsOf = (layout, n) => {
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
	const litOf = (layout, board, n) => {
		const sights = sightsOf(layout, n);
		const lit = new Uint8Array(n * n);
		for (let i = 0; i < n * n; i++) {
			if (board[i] !== 1 || layout[i] !== -1) continue;
			lit[i] = 1;
			for (const c of sights[i]) lit[c] = 1;
		}
		return lit;
	};
	const darkLeft = (layout, board, n) => {
		const lit = litOf(layout, board, n);
		let left = 0;
		for (let i = 0; i < n * n; i++) if (layout[i] === -1 && !lit[i]) left++;
		return left;
	};
	//#endregion
	//#region src/lightup/solver.js
	const settle = (layout, n, board, why) => {
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
	const pick = (layout, n, board) => {
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
	const search = (layout, n, board, found) => {
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
	const countSolutions = (layout, n, limit = 2) => {
		let count = 0;
		search(layout, n, emptyBoard(n), () => ++count >= limit);
		return count;
	};
	//#endregion
	//#region src/lightup/techniques.js
	const levels = [
		"easy",
		"medium",
		"hard",
		"expert"
	];
	const step = (technique, level, place, sources, say) => ({
		technique,
		level,
		place,
		sources,
		get text() {
			return say();
		}
	});
	const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;
	const read = (layout, board, n) => {
		const lit = litOf(layout, board, n);
		const free = (i) => layout[i] === -1 && board[i] === -1 && !lit[i];
		return {
			lit,
			free,
			sights: sightsOf(layout, n),
			beside: besideOf(n)
		};
	};
	const walls = (layout, board, n, { free, beside }) => {
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
	const darks = (layout, board, n, { lit, free, sights }) => {
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
	const full = (layout, board, n) => {
		const view = read(layout, board, n);
		return walls(layout, board, n, view).filter(({ number, bulbs, open }) => bulbs.length === number && open.length).map(({ wall, number, bulbs, open }) => step("full", 0, open.map((c) => [c, 0]), [wall, ...bulbs], () => number ? `The ${number} at ${cellName(wall, n)} has its ${plural(number, "bulb")}, so no other cell beside it holds one.` : `The 0 at ${cellName(wall, n)} takes no bulbs, so no cell beside it holds one.`));
	};
	const need = (layout, board, n) => {
		const view = read(layout, board, n);
		return walls(layout, board, n, view).filter(({ number, bulbs, open }) => open.length && bulbs.length + open.length === number).map(({ wall, number, bulbs, open }) => step("need", 0, open.map((c) => [c, 1]), [wall, ...bulbs], () => `The ${number} at ${cellName(wall, n)} needs ${plural(number - bulbs.length, "more bulb")} and has just ${plural(open.length, "free cell")} beside it, so ${open.length === 1 ? "it holds a bulb" : "each holds a bulb"}.`));
	};
	const boxed = (layout, board, n) => {
		const view = read(layout, board, n);
		return darks(layout, board, n, view).filter(({ dark, places }) => places.length === 1 && places[0] === dark).map(({ dark }) => step("boxed", 0, [[dark, 1]], [], () => `No other free cell can light the cell at ${cellName(dark, n)}, so it holds a bulb itself.`));
	};
	const lone = (layout, board, n) => {
		const view = read(layout, board, n);
		const seen = /* @__PURE__ */ new Set();
		return darks(layout, board, n, view).filter(({ dark, places }) => places.length === 1 && places[0] !== dark).filter(({ places }) => !seen.has(places[0]) && seen.add(places[0])).map(({ dark, places }) => step("lone", 1, [[places[0], 1]], [dark], () => `The cell at ${cellName(dark, n)} is dark and can't hold a bulb, and only one free cell can still light it, so the bulb goes there.`));
	};
	const squeeze = (layout, board, n) => {
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
	const starve = (layout, board, n) => {
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
	const broke = (why, layout, n) => why.wall !== void 0 ? `the ${layout[why.wall]} at ${cellName(why.wall, n)} could not be met` : `the cell at ${cellName(why.dark, n)} could not be lit properly`;
	const whatIf = (layout, board, n) => {
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
	const techniques = [
		[
			need,
			full,
			boxed
		],
		[lone],
		[squeeze, starve],
		[whatIf]
	];
	const nextSteps = (layout, board, n, top = levels.length - 1) => {
		for (let level = 0; level <= top; level++) for (const technique of techniques[level]) {
			const steps = technique(layout, board, n);
			if (steps.length) return {
				level,
				steps
			};
		}
		return { steps: [] };
	};
	const apply = (board, steps) => {
		for (const { place } of steps) for (const [i, value] of place) {
			if (board[i] !== -1 && board[i] !== value) return false;
			board[i] = value;
		}
		return true;
	};
	const rate = (layout, n, top = levels.length - 1) => {
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
	//#endregion
	//#region src/lightup/generate.js
	const makeLayout = (n, rng) => {
		const layout = new Int8Array(n * n).fill(-1);
		const share = .17 + rng() * .08;
		for (let i = 0; i < Math.ceil(n * n / 2); i++) {
			if (rng() >= share) continue;
			layout[i] = 5;
			layout[n * n - 1 - i] = 5;
		}
		return layout;
	};
	const makeSolution = (layout, n, rng) => {
		const sights = sightsOf(layout, n);
		const bulbs = new Int8Array(n * n);
		const lit = new Uint8Array(n * n);
		for (const i of shuffled([...layout.keys()], rng)) {
			if (layout[i] !== -1 || lit[i]) continue;
			bulbs[i] = 1;
			lit[i] = 1;
			for (const c of sights[i]) lit[c] = 1;
		}
		return bulbs;
	};
	const numbered = (layout, bulbs, n) => {
		const beside = besideOf(n);
		return layout.map((v, i) => v === -1 ? -1 : beside[i].reduce((sum, c) => sum + bulbs[c], 0));
	};
	const makePuzzle = (n, rng, keep) => {
		const walls = makeLayout(n, rng);
		const solution = makeSolution(walls, n, rng);
		let layout = numbered(walls, solution, n);
		if (!keep(layout)) return null;
		for (const i of shuffled([...layout.keys()], rng)) {
			if (layout[i] === -1) continue;
			const trial = layout.slice();
			trial[i] = 5;
			if (keep(trial)) layout = trial;
		}
		return {
			layout,
			solution
		};
	};
	const makeGame = (n, level, rng, budget = 1500) => {
		const start = performance.now();
		const keep = level === levels.length - 1 ? (layout) => countSolutions(layout, n, 2) === 1 : (layout) => rate(layout, n, level) !== null;
		let best = null;
		do {
			const puzzle = makePuzzle(n, rng, keep);
			const rated = puzzle && rate(puzzle.layout, n, level);
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
	//#region src/lightup/deal.worker.js
	self.onmessage = ({ data: { id, n, level, seed, budget } }) => {
		const { layout, solution, level: got } = makeGame(n, level, random(seed), budget);
		self.postMessage({
			id,
			layout,
			solution,
			level: got
		}, [layout.buffer, solution.buffer]);
	};
	//#endregion
})();
