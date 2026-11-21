import { A as shellActions, B as codeOf, D as listen, L as celebrate, M as shortcut, N as toggleAction, O as prevent, R as stopFireworks, T as historyKey, U as partsOf, W as sharedCode, Y as BackgroundSettings, _t as __exportAll, a as DAILY_BUDGET, c as dayOf, f as seedOf, ft as load, gt as h, j as shellState, k as shareAction, l as finish, mt as save, p as special, q as Boss, t as Taskbar, w as gameKey } from "./Taskbar-CGVrYhy9.js";
import { _ as check, b as OpenGames, d as timeOf, g as boardOf, n as FireworksCanvas, r as Switching, t as start, u as tally, v as resumable, x as Winner } from "./start-NN7CkIcG.js";
import { n as About } from "./HowToPlay-B48XL82e.js";
import { i as Prompt, t as records } from "./records-kPz-UY4b.js";
import { S as tickAction, _ as pauseAction, b as startClock, h as loadTimer, w as timerAction, x as stopTick } from "./Board-DYXlugXU.js";
import { a as dealer, i as shuffled, o as BestTimes, r as random, t as arrows } from "./cursor-BQOU-cbh.js";
import { C as solved, S as sizes, T as unfinished, a as allowed, b as linkBetween, d as levels, h as solve, l as findHint, m as countSolutions, o as fallback, p as rate, r as running, s as levelNames, t as Game, v as emptyBoard, w as stepLink, x as linksOf, y as islandCells } from "./Game-UmQPnRKm.js";
import { t as BridgesHowToPlay } from "./HowToPlay-Cmornr7f.js";
//#region src/bridges/generate.js
var steps = [
	[1, 0],
	[-1, 0],
	[0, 1],
	[0, -1]
];
var makeIslands = (n, rng) => {
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
var makeGame = (n, level, rng, budget = 1500) => {
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
//#region src/bridges/deal.js
var dealOne = dealer(() => new Worker(new URL(
	/* @vite-ignore */
	new URL("deal.worker-DVDHjAMY.js", import.meta.url).href,
	"" + import.meta.url
), { type: "module" }), ({ n, level, seed, budget }) => makeGame(n, level, random(seed), budget));
var deal = (n, level, seed, budget) => dealOne({
	n,
	level,
	seed,
	budget
});
//#endregion
//#region src/bridges/About.jsx
var BridgesAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "Bridges Plus",
	actions
}, /* @__PURE__ */ h("p", null, "Join the islands with bridges. Each island's number is how many bridges it has, a pair of islands takes one or two, bridges run straight and never cross, and every island must be reachable from every other."), /* @__PURE__ */ h("p", null, "Boards of 7 × 7, 10 × 10 and 14 × 14 in four levels, each with exactly one solution that logic alone finds, graded by the hardest technique it needs. Hints explain their reasoning and link to the guide."), /* @__PURE__ */ h("p", null, "Bridges, also known as Hashi or Hashiwokakero, was first published by Nikoli."));
//#endregion
//#region src/bridges/app.jsx
var app_exports = /* @__PURE__ */ __exportAll({
	actions: () => actions,
	createGame: () => createGame,
	gameOf: () => gameOf,
	saved: () => saved,
	state: () => state,
	view: () => view
});
var loadChoice = () => {
	const saved = parseInt(load("bridges.size"), 10);
	const n = sizes.includes(saved) ? saved : 7;
	const level = parseInt(load("bridges.level"), 10);
	if (!(level >= 0 && level < levelNames.length)) return {
		n,
		level: 0
	};
	return {
		n,
		level: fallback(n, level)
	};
};
var createGame = ({ n, level }) => ({
	n,
	level,
	islands: new Int8Array(n * n),
	solution: null,
	board: emptyBoard(0),
	history: [],
	future: [],
	change: 0,
	dealing: true,
	deal: 0,
	start: -1,
	time: 0,
	raf: null,
	paused: false,
	pausedAt: 0,
	win: false,
	hinted: false,
	untimed: false,
	daily: null,
	shared: false
});
var countsOf = (list, links) => {
	check(Array.isArray(list) && list.length === links && list.every((v) => v >= 0 && v <= 2));
	return Int8Array.from(list);
};
var saved = resumable({
	key: "bridges.saved",
	running,
	fresh: {
		cursor: -1,
		selected: -1
	},
	label: ({ n, level }) => `${n} × ${n} ${levelNames[level]}`,
	pack: ({ n, level, islands, solution, board, history, future, hinted, untimed, daily, shared }) => ({
		n,
		level,
		islands: Array.from(islands),
		solution: Array.from(solution),
		board: Array.from(board),
		history,
		future,
		hinted,
		untimed,
		daily,
		shared
	}),
	unpack: ({ n, level, islands, solution, board, history, future, hinted, untimed, daily, shared }) => {
		check(sizes.includes(n) && allowed(n, level) && Array.isArray(history));
		const found = boardOf(islands, n, 0, 8);
		const count = linksOf(found, n).links.length;
		return {
			...createGame({
				n,
				level
			}),
			islands: found,
			solution: countsOf(solution, count),
			board: countsOf(board, count),
			history,
			future: Array.isArray(future) ? future : [],
			hinted: Boolean(hinted),
			untimed: Boolean(untimed),
			daily: typeof daily === "string" ? daily : null,
			shared: Boolean(shared),
			dealing: false
		};
	}
});
var { actions: recordActions } = records("bridges", sizes, levelNames);
var DAILY = {
	n: 10,
	level: 1
};
var shareCode = ({ n, level, islands }) => codeOf(n, level, Array.from(islands), 9);
var SHARED_STEPS = 2e5;
var gameOf = (code) => {
	const parts = partsOf(code, 9, (n, level) => sizes.includes(n) && allowed(n, level));
	if (!parts) return null;
	const { n, level, values } = parts;
	const islands = Int8Array.from(values);
	if (!islands.some(Boolean) || countSolutions(islands, n, 2, SHARED_STEPS) !== 1) return null;
	const solution = solve(islands, n);
	return {
		...createGame({
			n,
			level
		}),
		islands,
		solution,
		board: emptyBoard(solution.length),
		dealing: false,
		shared: true
	};
};
var linkedGame = () => {
	const code = sharedCode();
	return code && gameOf(code);
};
var ASK_AFTER = 2500;
var deals = 0;
var changes = 0;
var changed = (state, board, history, actions) => {
	const next = {
		...startClock(state.game, actions),
		board,
		history,
		future: [],
		change: ++changes
	};
	next.win = solved(next.islands, next.n, board);
	if (next.win) {
		stopTick(next.raf);
		celebrate();
		if (!state.game.win) tally("bridges", {
			won: true,
			clean: !next.hinted,
			time: timeOf(state.timer, next),
			level: saved.label(next)
		});
		finish("bridges", state, next, actions);
	}
	if (!next.win && unfinished(next.islands, next.n, board) === 0) setTimeout(() => actions.ask(next.change), ASK_AFTER);
	return {
		hint: null,
		prompt: false,
		game: next
	};
};
var bump = (state, actions, l, back) => {
	const { game } = state;
	if (game.dealing || game.paused || game.win) return null;
	const to = stepLink(game.islands, game.n, game.board, l, back);
	if (to === null || to === game.board[l]) return null;
	const board = game.board.slice();
	board[l] = to;
	return changed(state, board, [...game.history, [l, game.board[l]]], actions);
};
var nearestIsland = (islands, n, from, [dx, dy]) => {
	const all = islandCells(islands);
	if (!all.length) return -1;
	if (from < 0) {
		const mid = (n - 1) / 2;
		const far = (i) => Math.abs(i % n - mid) + Math.abs(Math.floor(i / n) - mid);
		return all.reduce((best, i) => far(i) < far(best) ? i : best);
	}
	const x0 = from % n;
	const y0 = Math.floor(from / n);
	let best = from;
	let bestScore = Infinity;
	for (const i of all) {
		const along = (i % n - x0) * dx + (Math.floor(i / n) - y0) * dy;
		if (along <= 0) continue;
		const aside = Math.abs((i % n - x0) * dy) + Math.abs((Math.floor(i / n) - y0) * dx);
		if (along + 3 * aside < bestScore) {
			bestScore = along + 3 * aside;
			best = i;
		}
	}
	return best;
};
var opened = saved.open(linkedGame());
var state = {
	...shellState("bridges"),
	hint: null,
	prompt: false,
	selected: -1,
	drag: -1,
	cursor: -1,
	errors: Boolean(load("bridges.errors")),
	timer: loadTimer("bridges.timer"),
	shelf: saved.list(),
	game: opened || createGame(loadChoice()),
	winner: null,
	bestTime: null
};
var actions = {
	...shellActions,
	init: () => (state, actions) => {
		window.addEventListener("keydown", actions.press);
		listen(actions);
		if (state.game.dealing) actions.reset();
	},
	press: (event) => (state, actions) => {
		if (historyKey(event, state, actions)) return;
		const key = shortcut(event, state, actions);
		if (key === null || gameKey(key, actions)) return;
		if (!arrows[key]) return;
		if (event.shiftKey) actions.build(arrows[key]);
		else actions.move(arrows[key]);
		event.preventDefault();
	},
	reset: (payload) => ({ game }, actions) => {
		stopTick(game.raf);
		stopFireworks();
		const day = payload && payload.daily ? dayOf() : null;
		const base = day ? DAILY : special(game) ? loadChoice() : game;
		const n = payload && payload.n || base.n;
		const asked = payload && payload.level !== void 0 ? payload.level : base.level;
		const level = fallback(n, asked);
		const seed = day ? seedOf(day, "bridges") : Math.floor(Math.random() * 2 ** 32);
		if (!day) {
			save("bridges.size", n);
			save("bridges.level", level);
		}
		const id = ++deals;
		deal(n, level, seed, day ? DAILY_BUDGET : void 0).then((dealt) => actions.dealt({
			id,
			...dealt
		}));
		return {
			menu: null,
			hint: null,
			prompt: false,
			selected: -1,
			drag: -1,
			cursor: -1,
			game: {
				...createGame({
					n,
					level
				}),
				deal: id,
				daily: day
			}
		};
	},
	dealt: ({ id, islands, solution }) => ({ game }) => {
		if (game.deal !== id) return null;
		return { game: {
			...game,
			islands,
			solution,
			board: emptyBoard(solution.length),
			dealing: false
		} };
	},
	play: ({ event, i }) => (state, actions) => {
		if (event.button !== 0 && event.button !== 2) return null;
		const { game, selected } = state;
		if (game.dealing || game.paused || game.win) return null;
		const back = event.button === 2;
		const { islands, n } = game;
		if (islands[i]) {
			if (selected >= 0 && selected !== i) {
				const l = linkBetween(islands, n, selected, i);
				if (l >= 0) return {
					selected: -1,
					drag: -1,
					cursor: -1,
					...bump(state, actions, l, back)
				};
			}
			window.addEventListener("pointerup", actions.up);
			return {
				selected: selected === i ? -1 : i,
				drag: i,
				cursor: -1
			};
		}
		const list = linksOf(islands, n).through.get(i) || [];
		const hinted = new Set((state.hint && state.hint.place || []).map(([c]) => c));
		const l = list.find((c) => game.board[c] > 0) ?? list.find((c) => hinted.has(c)) ?? list[0];
		if (l === void 0) return {
			selected: -1,
			cursor: -1
		};
		return {
			selected: -1,
			cursor: -1,
			...bump(state, actions, l, back)
		};
	},
	up: (event) => (state, actions) => {
		window.removeEventListener("pointerup", actions.up);
		const { game, drag } = state;
		if (drag < 0) return null;
		const found = document.elementFromPoint(event.clientX, event.clientY);
		const cell = found && found.closest("[data-cell]");
		const to = cell ? Number(cell.dataset.cell) : -1;
		if (to >= 0 && to !== drag && game.islands[to]) {
			const l = linkBetween(game.islands, game.n, drag, to);
			if (l >= 0) return {
				drag: -1,
				selected: -1,
				...bump(state, actions, l, event.button === 2)
			};
		}
		return { drag: -1 };
	},
	move: (step) => ({ game, cursor }) => {
		if (game.dealing || game.paused || game.win) return null;
		return {
			selected: -1,
			cursor: nearestIsland(game.islands, game.n, cursor, step)
		};
	},
	build: (step) => (state, actions) => {
		const { game, cursor } = state;
		if (cursor < 0) return actions.move(step);
		const { links, at } = linksOf(game.islands, game.n);
		const [dx, dy] = step;
		const x = cursor % game.n;
		const y = Math.floor(cursor / game.n);
		const l = (at.get(cursor) || []).find((c) => {
			const other = links[c].a === cursor ? links[c].b : links[c].a;
			return Math.sign(other % game.n - x) === dx && Math.sign(Math.floor(other / game.n) - y) === dy;
		});
		return l === void 0 ? null : bump(state, actions, l, false);
	},
	ask: (change) => ({ game }) => {
		if (game.change !== change || game.win || game.paused) return null;
		if (unfinished(game.islands, game.n, game.board)) return null;
		return { prompt: true };
	},
	undo: () => (state, actions) => {
		const { game } = state;
		if (!game.history.length || game.win || game.paused || game.dealing) return { menu: null };
		const [l, from] = game.history.at(-1);
		const board = game.board.slice();
		board[l] = from;
		const next = changed(state, board, game.history.slice(0, -1), actions);
		next.game.future = [...game.future, [l, game.board[l]]];
		return {
			menu: null,
			...next
		};
	},
	redo: () => (state, actions) => {
		const { game } = state;
		if (!game.future.length || game.win || game.paused || game.dealing) return { menu: null };
		const [l, to] = game.future.at(-1);
		const board = game.board.slice();
		board[l] = to;
		const next = changed(state, board, [...game.history, [l, game.board[l]]], actions);
		next.game.future = game.future.slice(0, -1);
		return {
			menu: null,
			...next
		};
	},
	hint: () => ({ game }, actions) => {
		if (game.dealing || game.win || game.paused) return { menu: null };
		const { islands, board, solution, n } = game;
		return {
			menu: null,
			prompt: false,
			selected: -1,
			hint: findHint({
				islands,
				board,
				solution,
				n
			}),
			game: {
				...startClock(game, actions),
				hinted: true
			}
		};
	},
	answerPrompt: (yes) => (state, actions) => {
		if (yes) actions.hint();
		return { prompt: false };
	},
	toggleErrors: toggleAction("errors", "bridges.errors", "yes"),
	toggleTimer: timerAction("bridges.timer"),
	share: shareAction(shareCode),
	pause: pauseAction(running),
	tick: tickAction,
	...recordActions,
	...saved.actions
};
var view = (state, actions) => /* @__PURE__ */ h("main", {
	oncontextmenu: prevent,
	ondragstart: prevent,
	oncreate: actions.init,
	onupdate: () => saved.keep(state.game)
}, /* @__PURE__ */ h(FireworksCanvas, { key: "fw" }), /* @__PURE__ */ h(Game, {
	key: "a",
	state,
	actions
}), /* @__PURE__ */ h(Taskbar, {
	key: "h",
	name: "Bridges Plus",
	state,
	actions
}), state.winner && /* @__PURE__ */ h(Winner, {
	key: "b",
	state: state.winner,
	actions
}), state.bestTime && /* @__PURE__ */ h(BestTimes, {
	key: "c",
	title: "Fastest Bridge Builders",
	sizes,
	levelNames,
	allowed,
	state: state.bestTime,
	actions
}), state.prompt && /* @__PURE__ */ h(Prompt, {
	key: "d",
	title: "Bridges",
	text: "Every island has its bridges but the puzzle is not solved. Do you want to use a hint?",
	actions
}), state.backgroundSettings && /* @__PURE__ */ h(BackgroundSettings, {
	key: "e",
	state: state.backgroundSettings,
	actions
}), state.switching && /* @__PURE__ */ h(Switching, {
	key: "k",
	title: "Bridges",
	actions
}), state.about && /* @__PURE__ */ h(BridgesAbout, {
	key: "f",
	actions
}), state.howTo && /* @__PURE__ */ h(BridgesHowToPlay, {
	key: "i",
	actions
}), state.openGames && /* @__PURE__ */ h(OpenGames, {
	key: "j",
	state,
	actions
}), state.boss && /* @__PURE__ */ h(Boss, {
	key: "g",
	state: state.boss,
	actions
}));
//#endregion
//#region src/bridges/index.js
start(app_exports);
//#endregion
