import { A as prevent, B as stopFireworks, D as gameKey, F as toggleAction, G as sharedCode, H as codeOf, M as shellActions, N as shellState, O as historyKey, P as shortcut, W as partsOf, Y as BackgroundSettings, _t as h, a as Taskbar, c as DAILY_BUDGET, d as dayOf, f as finish, g as special, h as seedOf, ht as save, j as shareAction, k as listen, n as About, pt as load, q as Boss, vt as __exportAll, z as celebrate } from "./HowToPlay-B1bbVemk.js";
import { _ as resumable, b as Winner, g as check, h as boardOf, l as tally, n as FireworksCanvas, r as Switching, t as start, y as OpenGames } from "./start-DzsGLcgX.js";
import { i as Prompt, t as records } from "./records-CWgjIbGb.js";
import { S as tickAction, _ as pauseAction, b as startClock, h as loadTimer, w as timerAction, x as stopTick } from "./Board-CKpcwMAY.js";
import { a as dealer, i as shuffled, n as stepCursor, o as BestTimes, r as random, t as arrows } from "./cursor-Br4dwdUF.js";
import { k as bit } from "./Game-BYzgThNu.js";
import { C as sizes, S as geometry, _ as breaks, a as running, b as fallback, d as levels, g as allowed, h as solve, l as findHint, m as countSolutions, p as rate, s as levelNames, t as Game, v as candidatesOf, w as solved, x as full, y as emptyBoard } from "./Game-Bkg0Xiqi.js";
import { t as FutoshikiHowToPlay } from "./HowToPlay-DHa-FapW.js";
//#region src/futoshiki/generate.js
var makeSolution = (n, rng) => {
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
var allSigns = (solution, n) => {
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
var makePuzzle = (n, rng, keep) => {
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
var makeGame = (n, level, rng, budget = 1500) => {
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
//#region src/futoshiki/deal.js
var dealOne = dealer(() => new Worker(new URL(
	/* @vite-ignore */
	new URL("deal.worker-DA7m7SWN.js", import.meta.url).href,
	"" + import.meta.url
), { type: "module" }), ({ n, level, seed, budget }) => makeGame(n, level, random(seed), budget));
var deal = (n, level, seed, budget) => dealOne({
	n,
	level,
	seed,
	budget
});
//#endregion
//#region src/futoshiki/About.jsx
var FutoshikiAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "Futoshiki Plus",
	actions
}, /* @__PURE__ */ h("p", null, "Fill the grid so every row and column holds each digit once, with the signs between cells saying which neighbour is the smaller."), /* @__PURE__ */ h("p", null, "Boards from 4 × 4 to 7 × 7 in four levels, each with exactly one solution that logic alone finds, graded by the hardest technique it needs. Notes, hints that explain their reasoning and a guide to every technique."), /* @__PURE__ */ h("p", null, "Futoshiki, \"not equal\" in Japanese, was devised by Tamaki Seto."));
//#endregion
//#region src/futoshiki/app.jsx
var app_exports = /* @__PURE__ */ __exportAll({
	actions: () => actions,
	createGame: () => createGame,
	gameOf: () => gameOf,
	saved: () => saved,
	state: () => state,
	view: () => view
});
var loadChoice = () => {
	const saved = parseInt(load("futoshiki.size"), 10);
	const n = sizes.includes(saved) ? saved : 5;
	const level = parseInt(load("futoshiki.level"), 10);
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
	right: new Int8Array(n * n),
	down: new Int8Array(n * n),
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
	key: "futoshiki.saved",
	running,
	label: ({ n, level }) => `${n} × ${n} ${levelNames[level]}`,
	fresh: {
		selected: -1,
		picked: 0
	},
	pack: ({ n, level, givens, right, down, solution, board, notes, history, future, hinted, untimed, daily, shared }) => ({
		n,
		level,
		givens: Array.from(givens),
		right: Array.from(right),
		down: Array.from(down),
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
	unpack: ({ n, level, givens, right, down, solution, board, notes, history, future, hinted, untimed, daily, shared }) => {
		check(sizes.includes(n) && level >= 0 && level < levels.length);
		check(Array.isArray(notes) && notes.length === n * n && Array.isArray(history));
		return {
			...createGame({
				n,
				level
			}),
			givens: boardOf(givens, n, 0, n),
			right: boardOf(right, n, 0, 2),
			down: boardOf(down, n, 0, 2),
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
var { actions: recordActions } = records("futoshiki", sizes, levelNames);
var DAILY = {
	n: 6,
	level: 1
};
var shareCode = ({ n, level, givens, right, down }) => codeOf(n, level, Array.from(givens, (v, i) => v * 9 + right[i] * 3 + down[i]), (n + 1) * 9);
var gameOf = (code) => {
	const base = (Number(code.split(".")[0]) + 1) * 9;
	const parts = partsOf(code, base, (n, level) => sizes.includes(n) && allowed(n, level));
	if (!parts) return null;
	const { n, level, values } = parts;
	const puzzle = {
		n,
		givens: Int8Array.from(values, (v) => Math.floor(v / 9)),
		right: Int8Array.from(values, (v) => Math.floor(v / 3) % 3),
		down: Int8Array.from(values, (v) => v % 3)
	};
	const off = (i) => i % n === n - 1 && puzzle.right[i] !== 0 || i >= n * (n - 1) && puzzle.down[i] !== 0;
	if ([...values.keys()].some(off)) return null;
	if (breaks(puzzle.givens, puzzle).length || countSolutions(puzzle, 2) !== 1) return null;
	return {
		...createGame({
			n,
			level
		}),
		...puzzle,
		solution: solve(puzzle),
		board: puzzle.givens.slice(),
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
	next.win = solved(board, next);
	if (next.win) {
		stopTick(next.raf);
		celebrate();
		if (!state.game.win) tally("futoshiki", {
			won: true,
			clean: !next.hinted
		});
		finish("futoshiki", state, next, actions);
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
var opened = saved.open(linkedGame());
var state = {
	...shellState("futoshiki"),
	hint: null,
	prompt: false,
	errors: Boolean(load("futoshiki.errors")),
	tidy: load("futoshiki.tidy") !== "off",
	timer: loadTimer("futoshiki.timer"),
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
		stopFireworks();
		const day = payload && payload.daily ? dayOf() : null;
		const base = day ? DAILY : special(game) ? loadChoice() : game;
		const n = payload && payload.n || base.n;
		const asked = payload && payload.level !== void 0 ? payload.level : base.level;
		const level = fallback(n, asked);
		const seed = day ? seedOf(day, "futoshiki") : Math.floor(Math.random() * 2 ** 32);
		if (!day) {
			save("futoshiki.size", n);
			save("futoshiki.level", level);
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
	dealt: ({ id, givens, right, down, solution }) => ({ game }) => {
		if (game.deal !== id) return null;
		const dealt = {
			givens,
			right,
			down,
			solution,
			board: givens.slice(),
			dealing: false
		};
		return { game: {
			...game,
			...dealt
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
		const { board, solution } = game;
		return {
			menu: null,
			prompt: false,
			hint: findHint({
				board,
				solution,
				puzzle: game
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
	toggleErrors: toggleAction("errors", "futoshiki.errors", "yes"),
	toggleTidy: toggleAction("tidy", "futoshiki.tidy", "", "off"),
	toggleTimer: timerAction("futoshiki.timer"),
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
	name: "Futoshiki Plus",
	state,
	actions
}), state.winner && /* @__PURE__ */ h(Winner, {
	key: "b",
	state: state.winner,
	actions
}), state.bestTime && /* @__PURE__ */ h(BestTimes, {
	key: "c",
	title: "Fastest Futoshiki Solvers",
	sizes,
	levelNames,
	allowed,
	state: state.bestTime,
	actions
}), state.prompt && /* @__PURE__ */ h(Prompt, {
	key: "d",
	title: "Futoshiki",
	text: "The board is complete but there are errors. Do you want to use a hint?",
	actions
}), state.backgroundSettings && /* @__PURE__ */ h(BackgroundSettings, {
	key: "e",
	state: state.backgroundSettings,
	actions
}), state.switching && /* @__PURE__ */ h(Switching, {
	key: "k",
	title: "Futoshiki",
	actions
}), state.about && /* @__PURE__ */ h(FutoshikiAbout, {
	key: "f",
	actions
}), state.howTo && /* @__PURE__ */ h(FutoshikiHowToPlay, {
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
//#region src/futoshiki/index.js
start(app_exports);
//#endregion
