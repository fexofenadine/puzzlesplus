import { A as shellActions, B as codeOf, D as listen, G as unpack, H as pack, L as celebrate, M as shortcut, N as toggleAction, O as prevent, R as stopFireworks, T as historyKey, U as partsOf, W as sharedCode, X as keys, Y as BackgroundSettings, a as DAILY_BUDGET, c as dayOf, f as seedOf, gt as save, j as shellState, k as shareAction, l as finish, mt as load, p as special, q as Boss, t as Taskbar, vt as h, w as gameKey, yt as __exportAll } from "./Taskbar-CoR5e2rF.js";
import { _ as check, b as OpenGames, d as timeOf, g as boardOf, n as FireworksCanvas, r as Switching, t as start, u as tally, v as resumable, x as Winner } from "./start-KCAKdMy7.js";
import { n as About } from "./HowToPlay-BgElZGFG.js";
import { i as Prompt, t as records } from "./records-DJpM9gKS.js";
import { S as tickAction, _ as pauseAction, b as startClock, h as loadTimer, w as timerAction, x as stopTick } from "./Board-CUHQmMKg.js";
import { a as dealer, i as shuffled, n as stepCursor, o as BestTimes, r as random, t as arrows } from "./cursor-CPZQt8n8.js";
import { A as bit, B as full, D as solve, E as countSolutions, G as solved, H as jigsaw, K as validLayout, M as breaks, N as candidatesOf, P as connected, R as emptyBoard, V as geometry, W as sizes, a as running, b as rate, d as findHint, h as levels, j as boxShapes, k as allowed, l as levelNames, t as Game, z as fallback } from "./Game-Ca8KTm2l.js";
import { n as SudokuHowToPlay } from "./HowToPlay-BOPYSVEw.js";
//#region src/sudoku/generate.js
var fewest = [
	36,
	30,
	25,
	20
];
var minGivens = (n, level) => Math.round(fewest[level] / 81 * n * n);
var makeLayout = (rng, n = 9, swaps = 300) => {
	const regions = Array.from({ length: n * n }, (_, i) => Math.floor(i / n / 3) * 3 + Math.floor(i % n / 3));
	const near = (i) => [
		i - n,
		i + n,
		i % n ? i - 1 : -1,
		i % n < n - 1 ? i + 1 : -1
	].filter((j) => j >= 0 && j < n * n);
	const piece = (r) => regions.flatMap((v, i) => v === r ? [i] : []);
	const pick = (list) => list[Math.floor(rng() * list.length)];
	for (let done = 0, tries = 0; done < swaps && tries < swaps * 40; tries++) {
		const a = Math.floor(rng() * n * n);
		const x = regions[a];
		const y = regions[pick(near(a))];
		if (x === y) continue;
		const back = piece(y).filter((c) => c !== a && near(c).some((j) => regions[j] === x));
		if (!back.length) continue;
		const c = pick(back);
		regions[a] = y;
		regions[c] = x;
		if (connected(piece(x), n) && connected(piece(y), n)) done++;
		else {
			regions[a] = x;
			regions[c] = y;
		}
	}
	return regions.join("");
};
var makeSolution = (n, rng, layout, tries = Infinity) => {
	for (let k = 0; k < tries; k++) {
		const board = solve(emptyBoard(n), n, (list) => shuffled(list, rng), 50 * n, layout);
		if (board) return board;
	}
	return null;
};
var makePuzzle = (n, rng, keep, least = 0, layout) => {
	const solution = makeSolution(n, rng, layout, layout ? 10 : Infinity);
	if (!solution) return null;
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
		solution,
		layout
	};
};
var makeGame = (n, level, rng, budget = 1500, regions = false) => {
	const start = performance.now();
	const top = level === levels.length - 1;
	let best = null;
	do {
		const layout = regions ? makeLayout(rng, n) : void 0;
		const puzzle = makePuzzle(n, rng, top ? (board) => countSolutions(board, n, 2, layout) === 1 : (board) => rate(board, n, level, layout) !== null, minGivens(n, level), layout);
		if (!puzzle) continue;
		const rated = rate(puzzle.givens, n, level, layout)?.level;
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
//#region src/sudoku/deal.js
var dealOne = dealer(() => new Worker(new URL(
	/* @vite-ignore */
	new URL("deal.worker-BH0BxfI1.js", import.meta.url).href,
	"" + import.meta.url
), { type: "module" }), ({ n, level, seed, budget, regions }) => makeGame(n, level, random(seed), budget, regions));
var deal = (n, level, seed, budget, regions) => dealOne({
	n,
	level,
	seed,
	budget,
	regions
});
//#endregion
//#region src/sudoku/About.jsx
var SudokuAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "Sudoku Plus",
	actions
}, /* @__PURE__ */ h("p", null, "Number placement puzzles: fill the grid so every row, column and box holds each digit exactly once, on the classic 9×9 board or a smaller 6×6 or 4×4, or as a Jigsaw, where irregular regions take the place of the boxes."), /* @__PURE__ */ h("p", null, "Four levels, each board with exactly one solution that logic alone finds, graded by the hardest technique it needs, from singles to swordfish. Notes, Auto Notes and hints that explain their reasoning and link to the guide."), /* @__PURE__ */ h("p", null, "The puzzle was devised by Howard Garns as Number Place in 1979 and named Sudoku by Nikoli in 1984."));
//#endregion
//#region src/sudoku/app.jsx
var app_exports = /* @__PURE__ */ __exportAll({
	actions: () => actions,
	createGame: () => createGame,
	gameOf: () => gameOf,
	saved: () => saved,
	state: () => state,
	view: () => view
});
var loadChoice = () => {
	const saved = parseInt(load("sudoku.size"), 10);
	const variant = load("sudoku.variant") === jigsaw;
	const n = variant ? 9 : sizes.includes(saved) ? saved : 9;
	const level = parseInt(load("sudoku.level"), 10);
	if (!(level >= 0 && level < levelNames.length)) return {
		n,
		level: 0,
		jigsaw: variant
	};
	return {
		n,
		level: fallback(n, level),
		jigsaw: variant
	};
};
var createGame = ({ n, level, jigsaw: regions = false }) => ({
	n,
	level,
	jigsaw: regions,
	layout: null,
	givens: emptyBoard(n),
	solution: null,
	board: emptyBoard(n),
	notes: new Int32Array(n * n),
	history: [],
	future: [],
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
var saved = resumable({
	key: "sudoku.saved",
	running,
	label: ({ n, level, layout }) => `${layout ? "Jigsaw " : ""}${n} × ${n} ${levelNames[level]}`,
	fresh: {
		selected: -1,
		picked: 0
	},
	pack: ({ n, level, layout, givens, solution, board, notes, history, future, hinted, untimed, daily, shared }) => ({
		n,
		level,
		layout,
		givens: Array.from(givens),
		solution: Array.from(solution),
		board: Array.from(board),
		notes: Array.from(notes),
		history,
		future,
		hinted,
		untimed,
		daily,
		shared
	}),
	unpack: ({ n, level, layout, givens, solution, board, notes, history, future, hinted, untimed, daily, shared }) => {
		check(sizes.includes(n) && boxShapes[n] && level >= 0 && level < levels.length);
		check(Array.isArray(notes) && notes.length === n * n && Array.isArray(history));
		check(!layout || n === 9 && validLayout(layout, n));
		return {
			...createGame({
				n,
				level,
				jigsaw: Boolean(layout)
			}),
			layout: layout || null,
			givens: boardOf(givens, n, 0, n),
			solution: boardOf(solution, n, 0, n),
			board: boardOf(board, n, 0, n),
			notes: Int32Array.from(notes),
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
var { actions: recordActions } = records("sudoku", [...sizes, jigsaw], levelNames);
var DAILY = {
	n: 9,
	level: 1
};
var shareCode = ({ n, level, givens, layout }) => {
	const code = codeOf(n, level, givens, n + 1);
	return layout ? `${code}.${pack(Array.from(layout, Number), n)}` : code;
};
var gameOf = (whole) => {
	const [size, grade, data, region, ...rest] = whole.split(".");
	if (rest.length) return null;
	const code = [
		size,
		grade,
		data
	].join(".");
	const base = Number(size) + 1;
	const parts = partsOf(code, base, (n, level) => sizes.includes(n) && allowed(n, level));
	if (!parts) return null;
	const { n, level, values } = parts;
	let layout;
	if (region !== void 0) {
		const regions = unpack(region, n * n, n);
		layout = regions && regions.join("");
		if (n !== 9 || !validLayout(layout, n)) return null;
	}
	const givens = Int8Array.from(values);
	if (breaks(givens, n, layout).length || countSolutions(givens, n, 2, layout) !== 1) return null;
	return {
		...createGame({
			n,
			level,
			jigsaw: Boolean(layout)
		}),
		layout: layout || null,
		givens,
		solution: solve(givens, n, void 0, void 0, layout),
		board: givens.slice(),
		dealing: false,
		shared: true
	};
};
var linkedGame = () => {
	const code = sharedCode();
	return code && gameOf(code);
};
var deals = 0;
var editable = (game, i) => i >= 0 && game.givens[i] === 0;
var playable = (game) => !game.dealing && !game.paused && !game.win;
var changed = (state, board, notes, history, actions) => {
	const next = {
		...startClock(state.game, actions),
		board,
		notes,
		history,
		future: []
	};
	next.win = solved(board, next.n, next.layout);
	if (next.win) {
		stopTick(next.raf);
		celebrate();
		if (!state.game.win) tally("sudoku", {
			won: true,
			clean: !next.hinted,
			time: timeOf(state.timer, next),
			level: saved.label(next)
		});
		finish("sudoku", state, next, actions, (won) => actions.win({
			...won,
			n: won.layout ? jigsaw : won.n
		}));
	}
	return {
		hint: null,
		prompt: !next.win && full(board),
		game: next
	};
};
var edit = (state, actions, changes) => {
	const { game } = state;
	const board = game.board.slice();
	const notes = game.notes.slice();
	const step = [];
	for (const [i, digit, mask] of changes) {
		if (board[i] === digit && notes[i] === mask) continue;
		step.push([
			i,
			board[i],
			notes[i]
		]);
		board[i] = digit;
		notes[i] = mask;
	}
	if (!step.length) return null;
	return changed(state, board, notes, [...game.history, step], actions);
};
var placeDigit = (state, actions, i, d) => {
	const { game, tidy } = state;
	if (game.board[i] === d) return edit(state, actions, [[
		i,
		0,
		game.notes[i]
	]]);
	const changes = [[
		i,
		d,
		game.notes[i]
	]];
	if (tidy) {
		for (const p of geometry(game.n, game.layout).peers[i]) if (game.notes[p] & bit(d)) changes.push([
			p,
			game.board[p],
			game.notes[p] & ~bit(d)
		]);
	}
	return edit(state, actions, changes);
};
var toggleNote = (state, actions, i, d) => {
	const { game } = state;
	if (game.board[i] !== 0) return null;
	return edit(state, actions, [[
		i,
		0,
		game.notes[i] ^ bit(d)
	]]);
};
var enter = (state, actions, i, d, note) => note ? toggleNote(state, actions, i, d) : placeDigit(state, actions, i, d);
var digitOf = (event) => {
	const { keyCode } = event;
	if (keyCode >= keys.zero && keyCode <= keys.nine) return keyCode - keys.zero;
	if (keyCode >= keys.pad0 && keyCode <= keys.pad9) return keyCode - keys.pad0;
	return -1;
};
var opened = saved.open(linkedGame());
var state = {
	...shellState("sudoku"),
	hint: null,
	prompt: false,
	errors: Boolean(load("sudoku.errors")),
	tidy: load("sudoku.tidy") !== "off",
	timer: loadTimer("sudoku.timer"),
	selected: -1,
	picked: 0,
	noting: false,
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
		if (key === null) return;
		const digit = digitOf(event);
		if (gameKey(key, actions)) return;
		if (arrows[key]) {
			event.preventDefault();
			actions.move(arrows[key]);
		} else if (key === keys.space) {
			event.preventDefault();
			actions.toggleNoting();
		} else if (key === keys.backspace || key === keys.del || digit === 0) {
			event.preventDefault();
			actions.erase();
		} else if (digit > 0 && digit <= state.game.n) actions.pad({
			d: digit,
			note: event.shiftKey
		});
	},
	reset: (payload) => ({ game }, actions) => {
		stopTick(game.raf);
		stopFireworks();
		const day = payload && payload.daily ? dayOf() : null;
		const base = day ? DAILY : special(game) ? loadChoice() : game;
		const size = payload && payload.n;
		const regions = payload && payload.jigsaw !== void 0 ? payload.jigsaw : Boolean(base.jigsaw) && !(size && size !== 9);
		const n = regions ? 9 : size || base.n;
		const asked = payload && payload.level !== void 0 ? payload.level : base.level;
		const level = fallback(n, asked);
		const seed = day ? seedOf(day, "sudoku") : Math.floor(Math.random() * 2 ** 32);
		if (!day) {
			save("sudoku.size", n);
			save("sudoku.level", level);
			save("sudoku.variant", regions ? jigsaw : "classic");
		}
		const id = ++deals;
		deal(n, level, seed, day ? DAILY_BUDGET : void 0, regions).then((dealt) => actions.dealt({
			id,
			...dealt
		}));
		return {
			menu: null,
			hint: null,
			prompt: false,
			selected: -1,
			picked: 0,
			game: {
				...createGame({
					n,
					level,
					jigsaw: regions
				}),
				deal: id,
				daily: day
			}
		};
	},
	dealt: ({ id, givens, solution, layout }) => ({ game }) => {
		if (game.deal !== id) return null;
		return { game: {
			...game,
			givens,
			solution,
			layout: layout || null,
			board: givens.slice(),
			dealing: false
		} };
	},
	tap: ({ event, i }) => (state, actions) => {
		const { game, picked, selected } = state;
		if (event.button !== 0 && event.button !== 2) return null;
		if (!playable(game)) return null;
		if (picked && editable(game, i)) return enter(state, actions, i, picked, state.noting || event.button === 2);
		return {
			selected: selected === i && !picked ? -1 : i,
			picked: 0
		};
	},
	pad: ({ d, note = false }) => (state, actions) => {
		const { game, selected, picked } = state;
		if (!playable(game)) return null;
		if (editable(game, selected)) return enter(state, actions, selected, d, note || state.noting);
		return {
			selected: -1,
			picked: picked === d ? 0 : d
		};
	},
	move: (step) => ({ game, selected }) => {
		if (!playable(game)) return null;
		return {
			selected: stepCursor(selected, step, game.n),
			picked: 0
		};
	},
	erase: () => (state, actions) => {
		const { game, selected } = state;
		if (!playable(game) || !editable(game, selected)) return null;
		if (game.board[selected] !== 0) return edit(state, actions, [[
			selected,
			0,
			game.notes[selected]
		]]);
		return edit(state, actions, [[
			selected,
			0,
			0
		]]);
	},
	autoNotes: () => (state, actions) => {
		const { game } = state;
		if (!playable(game)) return { menu: null };
		const cands = candidatesOf(game.board, game.n, game.layout);
		return {
			menu: null,
			...edit(state, actions, [...game.board.keys()].filter((i) => game.board[i] === 0).map((i) => [
				i,
				0,
				cands[i]
			]))
		};
	},
	undo: () => (state, actions) => {
		const { game } = state;
		if (!game.history.length || !playable(game)) return { menu: null };
		const board = game.board.slice();
		const notes = game.notes.slice();
		const step = game.history.at(-1);
		for (const [i, digit, mask] of step) {
			board[i] = digit;
			notes[i] = mask;
		}
		const next = changed(state, board, notes, game.history.slice(0, -1), actions);
		next.game.future = [...game.future, step.map(([i]) => [
			i,
			game.board[i],
			game.notes[i]
		])];
		return {
			menu: null,
			...next
		};
	},
	redo: () => (state, actions) => {
		const { game } = state;
		if (!game.future.length || !playable(game)) return { menu: null };
		const board = game.board.slice();
		const notes = game.notes.slice();
		const step = game.future.at(-1);
		for (const [i, digit, mask] of step) {
			board[i] = digit;
			notes[i] = mask;
		}
		const next = changed(state, board, notes, [...game.history, step.map(([i]) => [
			i,
			game.board[i],
			game.notes[i]
		])], actions);
		next.game.future = game.future.slice(0, -1);
		return {
			menu: null,
			...next
		};
	},
	hint: () => ({ game }, actions) => {
		if (!playable(game)) return { menu: null };
		const { board, notes, solution, n, layout } = game;
		return {
			menu: null,
			prompt: false,
			hint: findHint({
				board,
				notes,
				solution,
				n,
				layout
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
	toggleNoting: () => ({ noting }) => ({ noting: !noting }),
	toggleErrors: toggleAction("errors", "sudoku.errors", "yes"),
	toggleTidy: toggleAction("tidy", "sudoku.tidy", "", "off"),
	toggleTimer: timerAction("sudoku.timer"),
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
	name: "Sudoku Plus",
	state,
	actions
}), state.winner && /* @__PURE__ */ h(Winner, {
	key: "b",
	state: state.winner,
	actions
}), state.bestTime && /* @__PURE__ */ h(BestTimes, {
	key: "c",
	title: "Fastest Sudoku Solvers",
	sizes: [...sizes, "jigsaw"],
	levelNames,
	allowed,
	state: state.bestTime,
	actions
}), state.prompt && /* @__PURE__ */ h(Prompt, {
	key: "d",
	title: "Sudoku",
	text: "The board is complete but there are errors. Do you want to use a hint?",
	actions
}), state.backgroundSettings && /* @__PURE__ */ h(BackgroundSettings, {
	key: "e",
	state: state.backgroundSettings,
	actions
}), state.switching && /* @__PURE__ */ h(Switching, {
	key: "k",
	title: "Sudoku",
	actions
}), state.about && /* @__PURE__ */ h(SudokuAbout, {
	key: "f",
	actions
}), state.howTo && /* @__PURE__ */ h(SudokuHowToPlay, {
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
//#region src/sudoku/index.js
start(app_exports);
//#endregion
