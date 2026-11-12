import { A as shareAction, B as sharedCode, D as historyKey, E as gameKey, H as Boss, L as celebrate, M as shellState, N as shortcut, O as listen, P as toggleAction, R as codeOf, W as BackgroundSettings, a as Taskbar, at as save, c as DAILY_BUDGET, ct as __exportAll, d as finish, j as shellActions, k as prevent, m as special, n as About, p as seedOf, rt as load, st as h, u as dayOf, z as partsOf } from "./HowToPlay-sfgAnlPV.js";
import { _ as resumable, b as Winner, g as check, h as boardOf, l as tally, n as FireworksCanvas, r as Switching, t as start, y as OpenGames } from "./start-DG6zwpFh.js";
import { i as Prompt, t as records } from "./records-nWOS4Msv.js";
import { C as timerAction, _ as pauseAction, b as stopTick, h as loadTimer, x as tickAction, y as startClock } from "./Board-xFGCjAaj.js";
import { i as BestTimes, n as shuffled, r as dealer, t as random } from "./random-BoflYgvq.js";
import { A as emptyBoard, C as countSolutions, D as boxShapes, E as bit, F as sizes, I as solved, M as full, N as geometry, O as breaks, T as allowed, _ as rate, c as findHint, f as levels, j as fallback, k as candidatesOf, o as levelNames, r as running, t as Game, w as solve } from "./Game-CselVgDk.js";
import { n as SudokuHowToPlay } from "./HowToPlay-CeSN4syz.js";
//#region src/sudoku/generate.js
var fewest = [
	36,
	30,
	25,
	20
];
var minGivens = (n, level) => Math.round(fewest[level] / 81 * n * n);
var makeSolution = (n, rng) => {
	for (;;) {
		const board = solve(emptyBoard(n), n, (list) => shuffled(list, rng), 50 * n);
		if (board) return board;
	}
};
var makePuzzle = (n, rng, keep, least = 0) => {
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
var makeGame = (n, level, rng, budget = 1500) => {
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
//#region src/sudoku/deal.js
var dealOne = dealer(() => new Worker(new URL(
	/* @vite-ignore */
	new URL("deal.worker-D5yl7rUA.js", import.meta.url).href,
	"" + import.meta.url
), { type: "module" }), ({ n, level, seed, budget }) => makeGame(n, level, random(seed), budget));
var deal = (n, level, seed, budget) => dealOne({
	n,
	level,
	seed,
	budget
});
//#endregion
//#region src/sudoku/About.jsx
var SudokuAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "Sudoku Plus",
	actions
}, /* @__PURE__ */ h("p", null, "Number placement puzzles: fill the grid so every row, column and box holds each digit exactly once, on the classic 9×9 board or a smaller 6×6 or 4×4."), /* @__PURE__ */ h("p", null, "Four levels, each board with exactly one solution that logic alone finds, graded by the hardest technique it needs, from singles to swordfish. Notes, Auto Notes and hints that explain their reasoning and link to the guide."), /* @__PURE__ */ h("p", null, "The puzzle was devised by Howard Garns as Number Place in 1979 and named Sudoku by Nikoli in 1984."));
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
	const n = sizes.includes(saved) ? saved : 9;
	const level = parseInt(load("sudoku.level"), 10);
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
	label: ({ n, level }) => `${n} × ${n} ${levelNames[level]}`,
	fresh: {
		selected: -1,
		picked: 0
	},
	pack: ({ n, level, givens, solution, board, notes, history, future, hinted, untimed, daily, shared }) => ({
		n,
		level,
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
	unpack: ({ n, level, givens, solution, board, notes, history, future, hinted, untimed, daily, shared }) => {
		check(sizes.includes(n) && boxShapes[n] && level >= 0 && level < levels.length);
		check(Array.isArray(notes) && notes.length === n * n && Array.isArray(history));
		return {
			...createGame({
				n,
				level
			}),
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
var { actions: recordActions } = records("sudoku", sizes, levelNames);
var DAILY = {
	n: 9,
	level: 1
};
var shareCode = ({ n, level, givens }) => codeOf(n, level, givens, n + 1);
var gameOf = (code) => {
	const base = Number(code.split(".")[0]) + 1;
	const parts = partsOf(code, base, (n, level) => sizes.includes(n) && allowed(n, level));
	if (!parts) return null;
	const { n, level, values } = parts;
	const givens = Int8Array.from(values);
	if (breaks(givens, n).length || countSolutions(givens, n, 2) !== 1) return null;
	return {
		...createGame({
			n,
			level
		}),
		givens,
		solution: solve(givens, n),
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
	next.win = solved(board, next.n);
	if (next.win) {
		stopTick(next.raf);
		celebrate();
		if (!state.game.win) tally("sudoku", {
			won: true,
			clean: !next.hinted
		});
		finish("sudoku", state, next, actions);
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
		for (const p of geometry(game.n).peers[i]) if (game.notes[p] & bit(d)) changes.push([
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
	if (keyCode >= 48 && keyCode <= 57) return keyCode - 48;
	if (keyCode >= 96 && keyCode <= 105) return keyCode - 96;
	return -1;
};
var arrows = {
	37: [-1, 0],
	38: [0, -1],
	39: [1, 0],
	40: [0, 1]
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
		} else if (key === 32) {
			event.preventDefault();
			actions.toggleNoting();
		} else if (key === 8 || key === 46 || digit === 0) {
			event.preventDefault();
			actions.erase();
		} else if (digit > 0 && digit <= state.game.n) actions.pad({
			d: digit,
			note: event.shiftKey
		});
	},
	reset: (payload) => ({ game }, actions) => {
		stopTick(game.raf);
		const day = payload && payload.daily ? dayOf() : null;
		const base = day ? DAILY : special(game) ? loadChoice() : game;
		const n = payload && payload.n || base.n;
		const asked = payload && payload.level !== void 0 ? payload.level : base.level;
		const level = fallback(n, asked);
		const seed = day ? seedOf(day, "sudoku") : Math.floor(Math.random() * 2 ** 32);
		if (!day) {
			save("sudoku.size", n);
			save("sudoku.level", level);
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
			picked: 0,
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
	dealt: ({ id, givens, solution }) => ({ game }) => {
		if (game.deal !== id) return null;
		return { game: {
			...game,
			givens,
			solution,
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
	move: ([dx, dy]) => ({ game, selected }) => {
		if (!playable(game)) return null;
		const { n } = game;
		if (selected < 0) return {
			selected: Math.floor(n * n / 2),
			picked: 0
		};
		const x = selected % n + dx;
		const y = Math.floor(selected / n) + dy;
		if (x < 0 || y < 0 || x >= n || y >= n) return null;
		return {
			selected: y * n + x,
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
		const cands = candidatesOf(game.board, game.n);
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
		const { board, notes, solution, n } = game;
		return {
			menu: null,
			prompt: false,
			hint: findHint({
				board,
				notes,
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
	sizes,
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
