import { A as listen, C as HelpMenu, D as ThemeMenu, E as ViewMenu, F as shortcut, G as Menu_module_default, I as toggleAction, J as BackgroundSettings, K as Boss, M as shareAction, N as shellActions, O as gameKey, P as shellState, R as windowClear, S as SubMenuItem, T as resumeItems, U as partsOf, V as codeOf, W as sharedCode, _ as gameLinks, a as Taskbar, b as MenuItem, c as DAILY_BUDGET, ct as watchWindow, d as dayOf, dt as save, f as finish, g as special, h as seedOf, it as Dialog, j as prevent, k as historyKey, lt as load, mt as __exportAll, n as About, pt as h, u as dailyNote, w as SizeMenu, x as Separator, z as celebrate } from "./HowToPlay-C0hyyCJI.js";
import { _ as resumable, b as Winner, g as check, h as boardOf, l as tally, n as FireworksCanvas, r as Switching, t as start, y as OpenGames } from "./start-Zrvth2h-.js";
import { i as Prompt, t as records } from "./records-CIutaYSt.js";
import { S as tickAction, _ as pauseAction, b as startClock, c as PauseButton, d as Play, f as Digit, h as loadTimer, i as windowProps, l as SideButton, m as clockDigits, n as PausedCover, r as WindowControls, s as HintIcon, t as HintPanel, u as UndoIcon, w as timerAction, x as stopTick } from "./Board-C2RPpcv_.js";
import { t as Game_module_default } from "./Game.module-CghLtUtO.js";
import { a as dealer, i as shuffled, n as stepCursor, o as BestTimes, r as random, t as arrows } from "./cursor-C-c6YnrS.js";
import { C as violations, S as solved, _ as darkLeft, a as levels, b as sightsOf, c as nextSteps, g as breaks, h as besideOf, l as rate, m as solve, n as apply, p as countSolutions, t as Cell, v as emptyBoard, w as LightUp_module_default, x as sizes, y as litOf } from "./Cell-Bv0cAULG.js";
import { t as LightUpHowToPlay } from "./HowToPlay-CXyoKIPo.js";
var guideTopic = ({ kind }) => ({
	break: "mistakes",
	wrong: "mistakes",
	reveal: "mistakes",
	solved: null
})[kind] ?? kind;
var wrongAt = (board, solution, i) => board[i] === 1 && !solution[i] || board[i] === 0 && solution[i] === 1;
var markOf = (value) => value === 1 ? "bulb" : "cross";
var scopeOf = (step, layout, n) => {
	const sights = sightsOf(layout, n);
	const beside = besideOf(n);
	const anchors = [...step.sources, ...step.place.map(([i]) => i)];
	return new Set(anchors.flatMap((a) => [...sights[a], ...beside[a]]));
};
var findHint = ({ layout, board, solution, n }) => {
	if (solved(layout, board, n)) return {
		kind: "solved",
		text: "The puzzle is solved.",
		marks: {}
	};
	const broken = breaks(layout, board, n);
	if (broken.length) {
		const { cells, text } = broken[0];
		const bad = cells.filter((i) => layout[i] === -1 && wrongAt(board, solution, i));
		const fix = bad.length ? bad : cells.filter((i) => layout[i] === -1);
		return {
			kind: "break",
			text: `${text} ${fix.length > 1 ? "The cells outlined in red are the ones" : "The cell outlined in red is the one"} to change.`,
			marks: Object.fromEntries(cells.map((i) => [i, fix.includes(i) ? "wrong" : "source"]))
		};
	}
	const wrong = [...board.keys()].find((i) => layout[i] === -1 && wrongAt(board, solution, i));
	if (wrong !== void 0) return {
		kind: "wrong",
		text: board[wrong] === 1 ? "This bulb doesn't fit the puzzle's only solution. Take it away and the reasoning can carry on." : "A bulb belongs where this cross is. Clear it and the reasoning can carry on.",
		marks: { [wrong]: "wrong" }
	};
	const work = board.slice();
	const crossed = [];
	for (;;) {
		const { steps } = nextSteps(layout, work, n);
		if (!steps.length) break;
		const bulb = steps.find((s) => s.place.some(([, value]) => value === 1));
		if (!bulb) {
			if (!apply(work, steps)) break;
			crossed.push(...steps);
			continue;
		}
		const scope = scopeOf(bulb, layout, n);
		const leaned = crossed.filter((s) => s.place.some(([i]) => scope.has(i)));
		const first = leaned[0];
		const more = leaned.length > 1 ? " The other crosses shown are ruled out in the same way." : "";
		return {
			kind: bulb.technique,
			text: first ? `${first.text}${more} ${bulb.text}` : bulb.text,
			place: [...leaned.flatMap((s) => s.place), ...bulb.place],
			marks: Object.fromEntries([
				...leaned.flatMap((s) => s.sources).map((i) => [i, "source"]),
				...bulb.sources.map((i) => [i, "source"]),
				...leaned.flatMap((s) => s.place).map(([i, value]) => [i, markOf(value)]),
				...bulb.place.map(([i, value]) => [i, markOf(value)])
			])
		};
	}
	const i = [...board.keys()].find((c) => solution[c] === 1 && board[c] === -1);
	return {
		kind: "reveal",
		text: "No rule gives the next bulb away, so this one comes from the solution.",
		place: [[i, 1]],
		marks: { [i]: "bulb" }
	};
};
//#endregion
//#region src/lightup/Menu.jsx
var levelNames = [
	"Easy",
	"Medium",
	"Hard",
	"Expert"
];
var allowed = (n, level) => level >= 0 && level < levelNames.length;
var fallback = (n, level) => allowed(n, level) ? level : 0;
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
	hotKey: dailyNote(state.menu, "lightup"),
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
}), /* @__PURE__ */ h(Separator, null), resumeItems(state, actions), gameLinks("lightup")), /* @__PURE__ */ h(SizeMenu, {
	state,
	actions,
	sizes
}), /* @__PURE__ */ h(ViewMenu, {
	state,
	actions
}), /* @__PURE__ */ h(ThemeMenu, {
	state,
	actions
}), /* @__PURE__ */ h(HelpMenu, {
	state,
	actions,
	name: "Light Up Plus"
}));
//#endregion
//#region src/lightup/Game.jsx
var more = (hint) => guideTopic(hint) && `guide/#${guideTopic(hint)}`;
var running = ({ start, win, dealing }) => start >= 0 && !win && !dealing;
var Game = ({ key, state, actions }) => {
	const { game, hint } = state;
	const { n, layout, board, paused } = game;
	const hidden = paused || game.dealing;
	const errors = state.errors && !hidden ? violations(layout, board, n) : null;
	const marks = !paused && hint && hint.marks || {};
	const lit = litOf(layout, board, n);
	return /* @__PURE__ */ h(Dialog, {
		clear: windowClear(state),
		key,
		hidden: state.windowState !== "open",
		title: state.theme === "classic" ? "Light Up" : "Light Up Plus",
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
	}), /* @__PURE__ */ h("div", { class: Game_module_default.root }, /* @__PURE__ */ h("div", { class: Game_module_default.scoreboard }, /* @__PURE__ */ h(Digit, { value: game.dealing ? 0 : darkLeft(layout, board, n) }), /* @__PURE__ */ h("div", { class: Game_module_default.buttons }, /* @__PURE__ */ h(SideButton, {
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
		class: running(game) && !paused ? LightUp_module_default.active : LightUp_module_default.inactive,
		style: { "--n": n }
	}, [...board].map((value, i) => /* @__PURE__ */ h(Cell, {
		i,
		wall: hidden ? -1 : layout[i],
		value: hidden ? -1 : value,
		lit: !hidden && lit[i],
		error: errors && errors.has(i),
		mark: marks[i],
		cursor: !paused && state.cursor === i,
		onPress: actions.play
	})), paused && /* @__PURE__ */ h(PausedCover, { onResume: () => actions.pause(false) })), hint && !paused && /* @__PURE__ */ h(HintPanel, {
		text: hint.text,
		more: more(hint)
	})));
};
//#endregion
//#region src/lightup/generate.js
var makeLayout = (n, rng) => {
	const layout = new Int8Array(n * n).fill(-1);
	const share = .17 + rng() * .08;
	for (let i = 0; i < Math.ceil(n * n / 2); i++) {
		if (rng() >= share) continue;
		layout[i] = 5;
		layout[n * n - 1 - i] = 5;
	}
	return layout;
};
var makeSolution = (layout, n, rng) => {
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
var numbered = (layout, bulbs, n) => {
	const beside = besideOf(n);
	return layout.map((v, i) => v === -1 ? -1 : beside[i].reduce((sum, c) => sum + bulbs[c], 0));
};
var makePuzzle = (n, rng, keep) => {
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
var makeGame = (n, level, rng, budget = 1500) => {
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
//#region src/lightup/deal.js
var dealOne = dealer(() => new Worker(new URL(
	/* @vite-ignore */
	new URL("deal.worker-CsueHX5e.js", import.meta.url).href,
	"" + import.meta.url
), { type: "module" }), ({ n, level, seed, budget }) => makeGame(n, level, random(seed), budget));
var deal = (n, level, seed, budget) => dealOne({
	n,
	level,
	seed,
	budget
});
//#endregion
//#region src/lightup/About.jsx
var LightUpAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "Light Up Plus",
	actions
}, /* @__PURE__ */ h("p", null, "Put bulbs on the white cells until every one of them is lit. A bulb lights its row and column as far as the next wall, no bulb may light another, and a numbered wall has exactly that many bulbs in the cells beside it."), /* @__PURE__ */ h("p", null, "Boards of 7 × 7, 10 × 10 and 14 × 14 in four levels, each with exactly one solution that logic alone finds, graded by the hardest technique it needs. Hints explain their reasoning and link to the guide."), /* @__PURE__ */ h("p", null, "Light Up, also known as Akari, was first published by Nikoli."));
//#endregion
//#region src/lightup/app.jsx
var app_exports = /* @__PURE__ */ __exportAll({
	actions: () => actions,
	createGame: () => createGame,
	gameOf: () => gameOf,
	saved: () => saved,
	state: () => state,
	view: () => view
});
var loadChoice = () => {
	const saved = parseInt(load("lightup.size"), 10);
	const n = sizes.includes(saved) ? saved : 7;
	const level = parseInt(load("lightup.level"), 10);
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
	layout: new Int8Array(n * n).fill(-1),
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
	key: "lightup.saved",
	running,
	fresh: { cursor: -1 },
	label: ({ n, level }) => `${n} × ${n} ${levelNames[level]}`,
	pack: ({ n, level, layout, solution, board, history, future, hinted, untimed, daily, shared }) => ({
		n,
		level,
		layout: Array.from(layout),
		solution: Array.from(solution),
		board: Array.from(board),
		history,
		future,
		hinted,
		untimed,
		daily,
		shared
	}),
	unpack: ({ n, level, layout, solution, board, history, future, hinted, untimed, daily, shared }) => {
		check(sizes.includes(n) && allowed(n, level) && Array.isArray(history));
		return {
			...createGame({
				n,
				level
			}),
			layout: boardOf(layout, n, -1, 5),
			solution: boardOf(solution, n, 0, 1),
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
var { actions: recordActions } = records("lightup", sizes, levelNames);
var DAILY = {
	n: 10,
	level: 1
};
var shareCode = ({ n, level, layout }) => codeOf(n, level, Array.from(layout, (v) => v + 1), 7);
var gameOf = (code) => {
	const parts = partsOf(code, 7, (n, level) => sizes.includes(n) && allowed(n, level));
	if (!parts) return null;
	const { n, level, values } = parts;
	const layout = Int8Array.from(values, (v) => v - 1);
	if (!layout.includes(-1) || countSolutions(layout, n, 2) !== 1) return null;
	return {
		...createGame({
			n,
			level
		}),
		layout,
		solution: solve(layout, n),
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
	1,
	0
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
	next.win = solved(next.layout, board, next.n);
	if (next.win) {
		stopTick(next.raf);
		celebrate();
		if (!state.game.win) tally("lightup", {
			won: true,
			clean: !next.hinted
		});
		finish("lightup", state, next, actions);
	}
	const stuck = !next.win && darkLeft(next.layout, board, next.n) === 0;
	if (stuck && !settled) setTimeout(() => actions.ask(next.change), ASK_AFTER);
	return {
		hint: null,
		prompt: stuck && settled,
		game: next
	};
};
var place = (state, actions, i, to, settled) => {
	const { game } = state;
	if (game.dealing || game.paused || game.win || game.layout[i] !== -1) return null;
	const from = game.board[i];
	if (from === to) return null;
	const board = game.board.slice();
	board[i] = to;
	return changed(state, board, [...game.history, [i, from]], actions, settled);
};
var opened = saved.open(linkedGame());
var state = {
	...shellState("lightup"),
	hint: null,
	prompt: false,
	cursor: -1,
	errors: Boolean(load("lightup.errors")),
	timer: loadTimer("lightup.timer"),
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
		const typed = {
			66: 1,
			88: 0,
			8: -1,
			46: -1,
			32: "next"
		}[key];
		if (arrows[key]) actions.move(arrows[key]);
		else if (typed !== void 0) actions.type(typed);
		else return;
		event.preventDefault();
	},
	reset: (payload) => ({ game }, actions) => {
		stopTick(game.raf);
		const day = payload && payload.daily ? dayOf() : null;
		const base = day ? DAILY : special(game) ? loadChoice() : game;
		const n = payload && payload.n || base.n;
		const level = fallback(n, payload && payload.level !== void 0 ? payload.level : base.level);
		const seed = day ? seedOf(day, "lightup") : Math.floor(Math.random() * 2 ** 32);
		if (!day) {
			save("lightup.size", n);
			save("lightup.level", level);
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
	dealt: ({ id, layout, solution }) => ({ game }) => {
		if (game.deal !== id) return null;
		return { game: {
			...game,
			layout,
			solution,
			dealing: false
		} };
	},
	play: ({ event, i }) => (state, actions) => {
		if (event.button !== 0 && event.button !== 2) return null;
		const back = event.button === 2;
		const to = cycle[(cycle.indexOf(state.game.board[i]) + (back ? 2 : 1)) % 3];
		return {
			cursor: -1,
			...place(state, actions, i, to, to !== 1)
		};
	},
	move: (step) => ({ game, cursor }) => {
		if (game.dealing || game.paused || game.win) return null;
		return { cursor: stepCursor(cursor, step, game.n) };
	},
	type: (to) => (state, actions) => {
		const { game, cursor } = state;
		if (cursor < 0) return null;
		const from = game.board[cursor];
		const next = cycle[(cycle.indexOf(from) + 1) % 3];
		return to === "next" ? place(state, actions, cursor, next, next !== 1) : place(state, actions, cursor, to === from ? -1 : to, true);
	},
	ask: (change) => ({ game }) => {
		if (game.change !== change || game.win || game.paused) return null;
		if (darkLeft(game.layout, game.board, game.n)) return null;
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
		const { layout, board, solution, n } = game;
		return {
			menu: null,
			prompt: false,
			hint: findHint({
				layout,
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
	toggleErrors: toggleAction("errors", "lightup.errors", "yes"),
	toggleTimer: timerAction("lightup.timer"),
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
	name: "Light Up Plus",
	state,
	actions
}), state.winner && /* @__PURE__ */ h(Winner, {
	key: "b",
	state: state.winner,
	actions
}), state.bestTime && /* @__PURE__ */ h(BestTimes, {
	key: "c",
	title: "Fastest Light Up Solvers",
	sizes,
	levelNames,
	allowed,
	state: state.bestTime,
	actions
}), state.prompt && /* @__PURE__ */ h(Prompt, {
	key: "d",
	title: "Light Up",
	text: "Every cell is lit but there are errors. Do you want to use a hint?",
	actions
}), state.backgroundSettings && /* @__PURE__ */ h(BackgroundSettings, {
	key: "e",
	state: state.backgroundSettings,
	actions
}), state.switching && /* @__PURE__ */ h(Switching, {
	key: "k",
	title: "Light Up",
	actions
}), state.about && /* @__PURE__ */ h(LightUpAbout, {
	key: "f",
	actions
}), state.howTo && /* @__PURE__ */ h(LightUpHowToPlay, {
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
//#region src/lightup/index.js
start(app_exports);
//#endregion
