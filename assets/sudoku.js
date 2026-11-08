import { A as load, E as startBackgrounds, I as app, L as h, M as save, T as BackgroundSettings, a as shellActions, c as typing, i as listen, n as About, o as shellState, r as Link, s as shortcut, u as Taskbar, w as Boss } from "./HowToPlay-DzZqCJtt.js";
import { a as resumable, i as check, o as OpenGames, s as Winner, t as registerWorker } from "./worker-CUMYqhkT.js";
import { n as Prompt } from "./BestTimes.module-D4qAuhKH.js";
import { _ as timed, f as clock, g as seconds, h as pauseAction, m as loadTimer, v as timerAction } from "./Board-Cajad2cE.js";
import { a as records, i as BestTimes, n as shuffled, r as dealer, t as random } from "./random-DTobraYn.js";
import { A as emptyBoard, D as bit, E as solve, F as solved, M as geometry, O as boxShapes, P as sizes, T as countSolutions, c as levelNames, j as full, k as candidatesOf, m as levels, o as allowed, r as running, s as fallback, t as Game, u as findHint, y as rate } from "./Game-D68rpAxS.js";
import { n as SudokuHowToPlay } from "./HowToPlay-DAeHgUFh.js";
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
	new URL("deal.worker-DxYtC8LP.js", import.meta.url).href,
	"" + import.meta.url
), { type: "module" }), ({ n, level, seed }) => makeGame(n, level, random(seed)));
var deal = (n, level, seed) => dealOne({
	n,
	level,
	seed
});
//#endregion
//#region src/sudoku/About.jsx
var SudokuAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "Sudoku Plus",
	actions
}, /* @__PURE__ */ h("p", null, "Number placement puzzles: fill the grid so every row, column and box holds each digit from 1 to 9 exactly once."), /* @__PURE__ */ h("p", null, "Every board has exactly one solution and can be solved by logic alone, graded by the hardest technique it needs. The puzzle was devised by Howard Garns as Number Place in 1979 and named Sudoku by Nikoli in 1984."), /* @__PURE__ */ h("p", null, "Part of Puzzles Plus by fexofenadine, sharing its window, themes and backgrounds with Minesweeper Plus, which is based on", " ", /* @__PURE__ */ h(Link, { href: "https://github.com/frenzzy/minesweeper" }, "Minesweeper"), " by Vladimir Kutepov."));
//#endregion
//#region src/sudoku/app.jsx
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
	dealing: true,
	deal: 0,
	start: -1,
	time: 0,
	raf: null,
	paused: false,
	pausedAt: 0,
	win: false,
	hinted: false,
	untimed: false
});
var boardOf = (cells, n) => {
	check(Array.isArray(cells) && cells.length === n * n && cells.every((v) => v >= 0 && v <= n));
	return Int8Array.from(cells);
};
var saved = resumable({
	key: "sudoku.saved",
	running,
	pack: ({ n, level, givens, solution, board, notes, history, hinted, untimed }) => ({
		n,
		level,
		givens: Array.from(givens),
		solution: Array.from(solution),
		board: Array.from(board),
		notes: Array.from(notes),
		history,
		hinted,
		untimed
	}),
	unpack: ({ n, level, givens, solution, board, notes, history, hinted, untimed }) => {
		check(sizes.includes(n) && boxShapes[n] && level >= 0 && level < levels.length);
		check(Array.isArray(notes) && notes.length === n * n && Array.isArray(history));
		return {
			...createGame({
				n,
				level
			}),
			givens: boardOf(givens, n),
			solution: boardOf(solution, n),
			board: boardOf(board, n),
			notes: Int32Array.from(notes),
			history,
			hinted: Boolean(hinted),
			untimed: Boolean(untimed),
			dealing: false
		};
	}
});
var { actions: recordActions } = records("sudoku", sizes, levelNames);
var deals = 0;
var prevent = (event) => {
	event.preventDefault();
	return false;
};
var begin = (game, actions) => {
	if (game.start >= 0) return game;
	game.raf = requestAnimationFrame(actions.tick);
	return {
		...game,
		start: clock(),
		time: 1
	};
};
var editable = (game, i) => i >= 0 && game.givens[i] === 0;
var playable = (game) => !game.dealing && !game.paused && !game.win;
var changed = (state, board, notes, history, actions) => {
	const next = {
		...begin(state.game, actions),
		board,
		notes,
		history
	};
	next.win = solved(board, next.n);
	if (next.win) {
		cancelAnimationFrame(next.raf);
		if (timed({
			...state,
			game: next
		})) actions.win(next);
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
	about: false,
	game: saved.restore() || createGame(loadChoice()),
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
		if ((event.ctrlKey || event.metaKey) && !event.altKey && event.keyCode === 90) {
			if (typing(event) || state.boss || state.windowState !== "open") return;
			event.preventDefault();
			actions.undo();
			return;
		}
		const key = shortcut(event, state, actions);
		if (key === null) return;
		const digit = digitOf(event);
		if (key === 113 || key === 78) actions.reset();
		else if (key === 72) actions.hint();
		else if (key === 80) actions.pause();
		else if (arrows[key]) {
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
		cancelAnimationFrame(game.raf);
		const n = payload && payload.n || game.n;
		const asked = payload && payload.level !== void 0 ? payload.level : game.level;
		const level = fallback(n, asked);
		save("sudoku.size", n);
		save("sudoku.level", level);
		const id = ++deals;
		deal(n, level, Math.floor(Math.random() * 2 ** 32)).then((dealt) => actions.dealt({
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
				deal: id
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
		for (const [i, digit, mask] of game.history.at(-1)) {
			board[i] = digit;
			notes[i] = mask;
		}
		return {
			menu: null,
			...changed(state, board, notes, game.history.slice(0, -1), actions)
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
				...begin(game, actions),
				hinted: true
			}
		};
	},
	answerPrompt: (yes) => (state, actions) => {
		if (yes) actions.hint();
		return { prompt: false };
	},
	toggleNoting: () => ({ noting }) => ({ noting: !noting }),
	toggleErrors: () => (state) => {
		save("sudoku.errors", state.errors ? "" : "yes");
		return {
			menu: null,
			errors: !state.errors
		};
	},
	toggleTidy: () => (state) => {
		save("sudoku.tidy", state.tidy ? "off" : "");
		return {
			menu: null,
			tidy: !state.tidy
		};
	},
	toggleTimer: timerAction("sudoku.timer"),
	toggleAbout: () => ({ about }) => ({
		menu: null,
		about: !about
	}),
	pause: pauseAction(running),
	tick: () => ({ game }, actions) => {
		game.raf = requestAnimationFrame(actions.tick);
		const next = seconds(game.start);
		if (game.time === next) return null;
		return { game: {
			...game,
			time: next
		} };
	},
	...recordActions,
	...saved.actions
};
var view = (state, actions) => /* @__PURE__ */ h("main", {
	oncontextmenu: prevent,
	ondragstart: prevent,
	oncreate: actions.init,
	onupdate: () => saved.keep(state.game)
}, /* @__PURE__ */ h(Game, {
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
app(state, actions, view, document.getElementById("app"));
startBackgrounds();
registerWorker();
//#endregion
