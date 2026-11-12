import { A as shareAction, B as sharedCode, C as resumeItems, D as historyKey, E as gameKey, H as Boss, I as windowClear, L as celebrate, M as shellState, N as shortcut, O as listen, P as toggleAction, Q as Dialog, R as codeOf, S as SizeMenu, T as ThemeMenu, V as Menu_module_default, W as BackgroundSettings, a as Taskbar, at as save, b as SubMenuItem, c as DAILY_BUDGET, ct as __exportAll, d as finish, h as gameLinks, it as remove, j as shellActions, k as prevent, m as special, n as About, nt as watchWindow, p as seedOf, rt as load, st as h, u as dayOf, v as MenuItem, w as ViewMenu, x as HelpMenu, y as Separator, z as partsOf } from "./HowToPlay-sfgAnlPV.js";
import { _ as resumable, b as Winner, g as check, h as boardOf, l as tally, n as FireworksCanvas, r as Switching, t as start, y as OpenGames } from "./start-DG6zwpFh.js";
import { i as Prompt, t as records } from "./records-nWOS4Msv.js";
import { C as timerAction, _ as pauseAction, b as stopTick, c as PauseButton, d as Play, f as Digit, h as loadTimer, i as windowProps, l as SideButton, m as clockDigits, n as PausedCover, r as WindowControls, s as HintIcon, t as HintPanel, u as UndoIcon, x as tickAction, y as startClock } from "./Board-xFGCjAaj.js";
import { t as Game_module_default } from "./Game.module-CghLtUtO.js";
import { _ as full, a as levels, b as violations, g as emptyBoard, h as breaks, l as rate, m as solve, o as nextSteps, p as countSolutions, t as Cell, v as sizes, x as Game_module_default$1, y as solved } from "./Cell-D_u32ubG.js";
import { i as BestTimes, n as shuffled, r as dealer, t as random } from "./random-BoflYgvq.js";
import { t as showRain } from "./rain-D7NoZOvq.js";
import { n as TakuzuHowToPlay } from "./HowToPlay-VCxQY7UU.js";
var marked = (entries) => Object.fromEntries(entries);
var guideTopic = ({ kind }) => ({
	break: "mistakes",
	wrong: "mistakes",
	reveal: "mistakes",
	solved: null
})[kind] ?? kind;
var findHint = ({ board, solution, n }) => {
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
	const wrong = [...board.keys()].find((i) => board[i] !== -1 && board[i] !== solution[i]);
	if (wrong !== void 0) return {
		kind: "wrong",
		text: `This ${board[wrong]} doesn't fit the puzzle's only solution. Clear it and the reasoning can carry on.`,
		marks: { [wrong]: "wrong" }
	};
	const { steps } = nextSteps(board, n);
	if (!steps.length) {
		const i = board.indexOf(-1);
		return {
			kind: "reveal",
			text: "No rule gives the next cell away, so this one comes from the solution.",
			place: [[i, solution[i]]],
			marks: { [i]: solution[i] ? "one" : "zero" }
		};
	}
	const { technique, text, place, sources } = steps[0];
	return {
		kind: technique,
		text,
		place,
		marks: marked([...sources.map((i) => [i, "source"]), ...place.map(([i, v]) => [i, v ? "one" : "zero"])])
	};
};
//#endregion
//#region src/takuzu/Menu.jsx
var levelNames = [
	"Easy",
	"Medium",
	"Tricky",
	"Hard",
	"Expert"
];
var allowed = (n, level) => !(n === 6 && level === levelNames.length - 1);
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
	name: "Daily Puzzle",
	checked: Boolean(state.game.daily),
	onClick: () => actions.newGame({ daily: true })
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Undo",
	hotKey: "Ctrl+Z",
	onClick: () => actions.undo()
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Redo",
	hotKey: "Ctrl+Y",
	onClick: () => actions.redo()
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Hint",
	hotKey: "H",
	onClick: () => actions.hint()
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
	name: "Timer",
	checked: state.timer,
	onClick: actions.toggleTimer
}), /* @__PURE__ */ h(Separator, null), /* @__PURE__ */ h(SubMenuItem, {
	name: "Copy Link...",
	onClick: () => actions.share()
}), /* @__PURE__ */ h(SubMenuItem, {
	name: "Best Times...",
	onClick: actions.toggleBestTime
}), /* @__PURE__ */ h(Separator, null), resumeItems(state, actions), gameLinks("takuzu")), /* @__PURE__ */ h(SizeMenu, {
	state,
	actions,
	sizes
}), /* @__PURE__ */ h(ViewMenu, {
	state,
	actions
}), /* @__PURE__ */ h(ThemeMenu, {
	state,
	actions
}, state.theme === "matrix" && /* @__PURE__ */ h(Separator, null), state.theme === "matrix" && /* @__PURE__ */ h(SubMenuItem, {
	name: "Rain Glyphs",
	checked: state.rain,
	onClick: actions.toggleRain
})), /* @__PURE__ */ h(HelpMenu, {
	state,
	actions,
	name: "Takuzu Plus"
}));
//#endregion
//#region src/takuzu/Game.jsx
var more = (hint) => guideTopic(hint) && `guide/#${guideTopic(hint)}`;
var running = ({ start, win, dealing }) => start >= 0 && !win && !dealing;
var Game = ({ key, state, actions }) => {
	const { game, hint } = state;
	const { n, board, givens, paused } = game;
	const errors = state.errors && !paused ? violations(board, n) : null;
	const marks = !paused && hint && hint.marks || {};
	const left = board.filter((v) => v === -1).length;
	return /* @__PURE__ */ h(Dialog, {
		clear: windowClear(state),
		key,
		hidden: state.windowState !== "open",
		title: state.theme === "classic" ? "Takuzu" : "Takuzu Plus",
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
	}, /* @__PURE__ */ h(HintIcon, null)), n >= 10 && /* @__PURE__ */ h(PauseButton, windowProps(state, actions, paused, running(game)))), /* @__PURE__ */ h(Digit, {
		value: game.time,
		digits: clockDigits(state.theme, game.time),
		blank: !state.timer
	})), /* @__PURE__ */ h("div", {
		class: running(game) && !paused ? Game_module_default$1.active : Game_module_default$1.inactive,
		style: { "--n": n }
	}, [...board].map((value, i) => /* @__PURE__ */ h(Cell, {
		i,
		value: paused ? -1 : value,
		given: !paused && givens[i] !== -1,
		error: errors && errors.has(i),
		mark: marks[i],
		onPress: actions.play
	})), paused && /* @__PURE__ */ h(PausedCover, { onResume: () => actions.pause(false) })), hint && !paused && /* @__PURE__ */ h(HintPanel, {
		text: hint.text,
		more: more(hint)
	})));
};
//#endregion
//#region src/takuzu/generate.js
var makeSolution = (n, rng) => {
	for (;;) {
		const board = solve(emptyBoard(n), n, (list) => shuffled(list, rng), 4 * n);
		if (board) return board;
	}
};
var makePuzzle = (n, rng, keep = (board) => countSolutions(board, n, 2) === 1) => {
	const solution = makeSolution(n, rng);
	const givens = solution.slice();
	for (const i of shuffled([...givens.keys()], rng)) {
		givens[i] = -1;
		if (!keep(givens)) givens[i] = solution[i];
	}
	return {
		givens,
		solution
	};
};
var makeGame = (n, level, rng, budget = 1500) => {
	const start = performance.now();
	const keep = (board) => rate(board, n, level) !== null;
	let best = null;
	do {
		const puzzle = makePuzzle(n, rng, keep);
		const rated = rate(puzzle.givens, n, level).level;
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
//#region src/takuzu/deal.js
var dealOne = dealer(() => new Worker(new URL(
	/* @vite-ignore */
	new URL("deal.worker-C5Bq1nz4.js", import.meta.url).href,
	"" + import.meta.url
), { type: "module" }), ({ n, level, seed, budget }) => makeGame(n, level, random(seed), budget));
var deal = (n, level, seed, budget) => dealOne({
	n,
	level,
	seed,
	budget
});
//#endregion
//#region src/takuzu/About.jsx
var TakuzuAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "Takuzu Plus",
	actions
}, /* @__PURE__ */ h("p", null, "Binary puzzles: fill the grid with 0s and 1s so that no row or column has three alike in a row, every row and column holds as many 0s as 1s, and no two rows or two columns are the same."), /* @__PURE__ */ h("p", null, "Boards from 6 × 6 to 14 × 14 in five levels, each with exactly one solution that logic alone finds, graded by the hardest technique it needs. Hints explain their reasoning and link to the guide."), /* @__PURE__ */ h("p", null, "Takuzu, also known as Binairo, was devised by Frank Coussement and Peter De Schepper."));
//#endregion
//#region src/takuzu/app.jsx
var app_exports = /* @__PURE__ */ __exportAll({
	actions: () => actions,
	createGame: () => createGame,
	gameOf: () => gameOf,
	saved: () => saved,
	state: () => state,
	upgradeLadder: () => upgradeLadder,
	view: () => view
});
var loadChoice = () => {
	const saved = parseInt(load("takuzu.size"), 10);
	const n = sizes.includes(saved) ? saved : 8;
	const level = parseInt(load("takuzu.level"), 10);
	if (!(level >= 0 && level < levelNames.length)) return {
		n,
		level: 1
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
var saved = resumable({
	key: "takuzu.saved",
	running,
	label: ({ n, level }) => `${n} × ${n} ${levelNames[level]}`,
	pack: ({ n, level, givens, solution, board, history, future, hinted, untimed, daily, shared }) => ({
		n,
		level,
		givens: Array.from(givens),
		solution: Array.from(solution),
		board: Array.from(board),
		history,
		future,
		hinted,
		untimed,
		daily,
		shared
	}),
	unpack: ({ n, level, givens, solution, board, history, future, hinted, untimed, daily, shared }) => {
		check(sizes.includes(n) && level >= 0 && level < levels.length && Array.isArray(history));
		return {
			...createGame({
				n,
				level
			}),
			givens: boardOf(givens, n, -1, 1),
			solution: boardOf(solution, n, -1, 1),
			board: boardOf(board, n, -1, 1),
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
var { timeKey, eachSlot, actions: recordActions } = records("takuzu", sizes, levelNames);
var DAILY = {
	n: 8,
	level: 1
};
var shareCode = ({ n, level, givens }) => codeOf(n, level, Array.from(givens, (v) => v + 1), 3);
var gameOf = (code) => {
	const parts = partsOf(code, 3, (n, level) => sizes.includes(n) && allowed(n, level));
	if (!parts) return null;
	const { n, level, values } = parts;
	const givens = Int8Array.from(values, (v) => v - 1);
	if (countSolutions(givens, n, 2) !== 1) return null;
	const solution = solve(givens, n);
	return {
		...createGame({
			n,
			level
		}),
		givens,
		solution,
		board: givens.slice(),
		dealing: false,
		shared: true
	};
};
var linkedGame = () => {
	const code = sharedCode();
	return code && gameOf(code);
};
var cycle = [
	-1,
	0,
	1
];
var ASK_AFTER = 2500;
var deals = 0;
var changes = 0;
var changed = (state, board, history, actions, settled = false) => {
	const next = {
		...startClock(state.game, actions),
		board,
		history,
		future: [],
		change: ++changes
	};
	next.win = solved(board, next.n);
	if (next.win) {
		stopTick(next.raf);
		celebrate();
		if (!state.game.win) tally("takuzu", {
			won: true,
			clean: !next.hinted
		});
		finish("takuzu", state, next, actions);
	}
	const stuck = !next.win && full(board);
	if (stuck && !settled) setTimeout(() => actions.ask(next.change), ASK_AFTER);
	return {
		hint: null,
		prompt: stuck && settled,
		game: next
	};
};
var upgradeLadder = () => {
	if (load("takuzu.ladder") === "5") return;
	eachSlot((n, level) => {
		for (const key of [timeKey(n, level, false), timeKey(n, level, true)]) {
			remove(key);
			remove(`${key}.name`);
		}
	});
	const level = parseInt(load("takuzu.level"), 10);
	if (level >= 2) save("takuzu.level", level + 1);
	save("takuzu.ladder", "5");
};
upgradeLadder();
var opened = saved.open(linkedGame());
var state = {
	...shellState("takuzu"),
	hint: null,
	prompt: false,
	errors: Boolean(load("takuzu.errors")),
	timer: loadTimer("takuzu.timer"),
	rain: Boolean(load("takuzu.rain")),
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
		showRain(state.rain);
		if (state.game.dealing) actions.reset();
	},
	press: (event) => (state, actions) => {
		if (historyKey(event, state, actions)) return;
		gameKey(shortcut(event, state, actions), actions);
	},
	reset: (payload) => ({ game }, actions) => {
		stopTick(game.raf);
		const day = payload && payload.daily ? dayOf() : null;
		const base = day ? DAILY : special(game) ? loadChoice() : game;
		const n = payload && payload.n || base.n;
		const level = fallback(n, payload && payload.level !== void 0 ? payload.level : base.level);
		const seed = day ? seedOf(day, "takuzu") : Math.floor(Math.random() * 2 ** 32);
		if (!day) {
			save("takuzu.size", n);
			save("takuzu.level", level);
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
	play: ({ event, i }) => (state, actions) => {
		const { game } = state;
		if (event.button !== 0 && event.button !== 2) return null;
		if (game.dealing || game.paused || game.win || game.givens[i] !== -1) return null;
		const back = event.button === 2;
		const from = game.board[i];
		const board = game.board.slice();
		board[i] = cycle[(cycle.indexOf(from) + (back ? 2 : 1)) % 3];
		const settled = board[i] === (back ? 0 : 1);
		return changed(state, board, [...game.history, [i, from]], actions, settled);
	},
	ask: (change) => ({ game }) => {
		if (game.change !== change || game.win || game.paused || !full(game.board)) return null;
		return { prompt: true };
	},
	undo: () => (state, actions) => {
		const { game } = state;
		if (!game.history.length || game.win || game.paused || game.dealing) return { menu: null };
		const [i, from] = game.history.at(-1);
		const board = game.board.slice();
		board[i] = from;
		const next = changed(state, board, game.history.slice(0, -1), actions);
		next.game.future = [...game.future, [i, game.board[i]]];
		return {
			menu: null,
			...next
		};
	},
	redo: () => (state, actions) => {
		const { game } = state;
		if (!game.future.length || game.win || game.paused || game.dealing) return { menu: null };
		const [i, to] = game.future.at(-1);
		const board = game.board.slice();
		board[i] = to;
		const next = changed(state, board, [...game.history, [i, game.board[i]]], actions);
		next.game.future = game.future.slice(0, -1);
		return {
			menu: null,
			...next
		};
	},
	hint: () => ({ game }, actions) => {
		if (game.dealing || game.win || game.paused) return { menu: null };
		const { board, solution, n } = game;
		return {
			menu: null,
			prompt: false,
			hint: findHint({
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
	toggleErrors: toggleAction("errors", "takuzu.errors", "yes"),
	toggleTimer: timerAction("takuzu.timer"),
	toggleRain: () => (state) => {
		save("takuzu.rain", state.rain ? "" : "yes");
		showRain(!state.rain);
		return {
			menu: null,
			rain: !state.rain
		};
	},
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
	name: "Takuzu Plus",
	state,
	actions
}), state.winner && /* @__PURE__ */ h(Winner, {
	key: "b",
	state: state.winner,
	actions
}), state.bestTime && /* @__PURE__ */ h(BestTimes, {
	key: "c",
	title: "Fastest Takuzu Solvers",
	sizes,
	levelNames,
	allowed,
	state: state.bestTime,
	actions
}), state.prompt && /* @__PURE__ */ h(Prompt, {
	key: "d",
	title: "Takuzu",
	text: "The board is complete but there are errors. Do you want to use a hint?",
	actions
}), state.backgroundSettings && /* @__PURE__ */ h(BackgroundSettings, {
	key: "e",
	state: state.backgroundSettings,
	actions
}), state.switching && /* @__PURE__ */ h(Switching, {
	key: "k",
	title: "Takuzu",
	actions
}), state.about && /* @__PURE__ */ h(TakuzuAbout, {
	key: "f",
	actions
}), state.howTo && /* @__PURE__ */ h(TakuzuHowToPlay, {
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
//#region src/takuzu/index.js
start(app_exports);
//#endregion
