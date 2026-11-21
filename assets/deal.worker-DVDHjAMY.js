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
	const cellName = (i, n) => `row ${Math.floor(i / n) + 1}, column ${i % n + 1}`;
	const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;
	//#endregion
	//#region src/bridges/rules.js
	const islandName = (islands, n, i) => `the ${islands[i]} at ${cellName(i, n)}`;
	const cache = /* @__PURE__ */ new WeakMap();
	const linksOf = (islands, n) => {
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
	const islandCells = (islands) => {
		const list = [];
		islands.forEach((v, i) => v && list.push(i));
		return list;
	};
	const degreesOf = (islands, n, board) => {
		const degree = new Int8Array(n * n);
		linksOf(islands, n).links.forEach(({ a, b }, l) => {
			degree[a] += board[l];
			degree[b] += board[l];
		});
		return degree;
	};
	const groupsOf = (islands, n, board) => {
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
	const solved = (islands, n, board) => {
		const { links, over } = linksOf(islands, n);
		const degree = degreesOf(islands, n, board);
		for (const i of islandCells(islands)) if (degree[i] !== islands[i]) return false;
		for (let l = 0; l < links.length; l++) if (board[l] > 0 && over[l].some((o) => board[o] > 0)) return false;
		return groupsOf(islands, n, board).length === 1;
	};
	//#endregion
	//#region src/bridges/solver.js
	const startState = (islands, n) => {
		const { links } = linksOf(islands, n);
		return {
			lo: new Int8Array(links.length),
			hi: Int8Array.from(links, (l) => l.max)
		};
	};
	const copyState = ({ lo, hi }) => ({
		lo: lo.slice(),
		hi: hi.slice()
	});
	const closedGroups = (islands, n, lo) => {
		const { at } = linksOf(islands, n);
		const total = islandCells(islands).length;
		const sum = (i) => (at.get(i) || []).reduce((s, l) => s + lo[l], 0);
		return groupsOf(islands, n, lo).filter((group) => group.length < total && group.every((i) => sum(i) === islands[i]));
	};
	const settle = (islands, n, state, why) => {
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
	const pick = (islands, n, { lo, hi }) => {
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
	const search = (islands, n, state, found, budget = { steps: Infinity }) => {
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
	const countSolutions = (islands, n, limit = 2, steps = Infinity) => {
		let count = 0;
		const budget = { steps };
		search(islands, n, startState(islands, n), () => ++count >= limit, budget);
		return budget.steps < 0 ? limit : count;
	};
	//#endregion
	//#region src/bridges/techniques.js
	const levels = [
		"easy",
		"medium",
		"hard",
		"expert"
	];
	const step = (technique, level, change, sources, say) => ({
		technique,
		level,
		change,
		sources,
		get text() {
			return say();
		}
	});
	const bridges = (count) => plural(count, "bridge");
	const otherEnd = (link, i) => link.a === i ? link.b : link.a;
	const readIslands = (islands, n, { lo, hi }) => {
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
	const need = (islands, n, state) => {
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
	const full = (islands, n, state) => {
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
	const crossed = (islands, n, state) => {
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
	const limit = (islands, n, state) => {
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
	const isolate = (islands, n, state) => {
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
	const exit = (islands, n, state) => {
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
	const broke = (why, islands, n) => why.group ? "a group of islands would have all its bridges and be cut off from the rest" : `${islandName(islands, n, why.island)} could not be met`;
	const whatIf = (islands, n, state) => {
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
				const change = v === lo[l] ? [[
					l,
					lo[l] + 1,
					hi[l]
				]] : [[
					l,
					lo[l],
					hi[l] - 1
				]];
				const source = why.group ? why.group[0] : why.island;
				return [step("what-if", 3, change, [source], () => `If this link held ${bridges(v)}, following the plain rules from there, ${broke(why, islands, n)}. So it does not.`)];
			}
		}
		return [];
	};
	const techniques = [
		[
			need,
			full,
			crossed
		],
		[limit],
		[isolate, exit],
		[whatIf]
	];
	const nextSteps = (islands, n, state, top = levels.length - 1) => {
		for (let level = 0; level <= top; level++) for (const technique of techniques[level]) {
			const steps = technique(islands, n, state);
			if (steps.length) return {
				level,
				steps
			};
		}
		return { steps: [] };
	};
	const apply = (state, steps) => {
		for (const { change } of steps) for (const [l, least, most] of change) {
			state.lo[l] = Math.max(state.lo[l], least);
			state.hi[l] = Math.min(state.hi[l], most);
			if (state.lo[l] > state.hi[l]) return false;
		}
		return true;
	};
	const decided = ({ lo, hi }) => lo.every((v, l) => v === hi[l]);
	const rate = (islands, n, top = levels.length - 1) => {
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
	//#region src/bridges/generate.js
	const steps = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	];
	const makeIslands = (n, rng) => {
		const cell = (x, y) => x < 0 || y < 0 || x >= n || y >= n ? -1 : y * n + x;
		const isle = new Uint8Array(n * n);
		const water = new Uint8Array(n * n);
		const placed = [];
		const joins = [];
		const first = cell(Math.floor(rng() * n), Math.floor(rng() * n));
		isle[first] = 1;
		placed.push(first);
		const target = Math.round(n * n * (.2 + rng() * .08));
		const lonely = (c) => {
			const x = c % n;
			const y = Math.floor(c / n);
			return steps.every(([dx, dy]) => {
				const o = cell(x + dx, y + dy);
				return o < 0 || !isle[o];
			});
		};
		for (let tries = 0; placed.length < target && tries < target * 60; tries++) {
			const a = placed[Math.floor(rng() * placed.length)];
			const [dx, dy] = steps[Math.floor(rng() * 4)];
			const length = 2 + Math.floor(rng() * 4);
			const path = [];
			let b = -1;
			let ok = true;
			for (let k = 1; k <= length && ok; k++) {
				const c = cell(a % n + dx * k, Math.floor(a / n) + dy * k);
				if (c < 0 || isle[c] || water[c]) {
					ok = false;
					break;
				}
				if (k === length) b = c;
				else path.push(c);
			}
			if (!ok || b < 0 || !lonely(b)) continue;
			isle[b] = 1;
			for (const c of path) water[c] = 1;
			placed.push(b);
			joins.push({
				a,
				b,
				count: rng() < .35 ? 2 : 1,
				path
			});
		}
		const islands0 = Int8Array.from(isle);
		const { links } = linksOf(islands0, n);
		for (const link of shuffled(links, rng)) {
			if (joins.some((j) => j.a === link.a && j.b === link.b || j.a === link.b && j.b === link.a) || rng() < .45 || link.cells.some((c) => water[c])) continue;
			for (const c of link.cells) water[c] = 1;
			joins.push({
				a: link.a,
				b: link.b,
				count: rng() < .35 ? 2 : 1,
				path: link.cells
			});
		}
		const islands = new Int8Array(n * n);
		for (const { a, b, count } of joins) {
			islands[a] += count;
			islands[b] += count;
		}
		const found = linksOf(islands, n).links;
		return {
			islands,
			solution: Int8Array.from(found, (link) => {
				const join = joins.find((j) => j.a === link.a && j.b === link.b || j.a === link.b && j.b === link.a);
				return join ? join.count : 0;
			})
		};
	};
	const makeGame = (n, level, rng, budget = 1500) => {
		const start = performance.now();
		const top = levels.length - 1;
		let best = null;
		do {
			const { islands } = makeIslands(n, rng);
			if (islands.every((v) => !v) || countSolutions(islands, n, 2) !== 1) continue;
			const rated = rate(islands, n, level === top ? top : level);
			if (!rated) continue;
			if (rated.level === level) return {
				islands,
				solution: rated.solution,
				level
			};
			if (!best || rated.level > best.level) best = {
				islands,
				solution: rated.solution,
				level: rated.level
			};
		} while (!best || performance.now() - start < budget);
		return best;
	};
	//#endregion
	//#region src/bridges/deal.worker.js
	self.onmessage = ({ data: { id, n, level, seed, budget } }) => {
		const { islands, solution, level: got } = makeGame(n, level, random(seed), budget);
		self.postMessage({
			id,
			islands,
			solution,
			level: got
		}, [islands.buffer, solution.buffer]);
	};
	//#endregion
})();
