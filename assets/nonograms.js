import { A as load, E as startBackgrounds, I as app, L as h, M as save, a as typing, d as About, f as Link, i as shortcut, l as Boss, m as BackgroundSettings, n as shellActions, o as Taskbar, r as shellState, t as listen } from "./actions-Cxdp6jdC.js";
import { n as pauseAction } from "./clock-BsNqUIwy.js";
import { a as Winner, n as OpenGames, t as registerWorker } from "./worker-CXk3NMNA.js";
import { a as Prompt, i as dealer, n as random, o as BestTimes, s as records, t as showRain } from "./rain-C_nuW7v8.js";
import { S as solved, _ as cluesOf, c as levelNames, d as levels, g as deduce, h as solveAt, m as rate, o as allowed, r as running, s as fallback, t as Game, u as findHint, v as emptyBoard, x as sizes, y as fillsLeft } from "./Game-B1Y9MNzb.js";
import { t as NonogramsHowToPlay } from "./HowToPlay-dHnZ5qGE.js";
//#region src/nonograms/generate.js
var makePicture = (n, rng, dense = 0) => {
	const density = .48 + dense + .08 * rng();
	let cells = Int8Array.from({ length: n * n }, () => rng() < density ? 1 : 0);
	for (let pass = 0; pass < (n < 10 ? 0 : 2); pass++) {
		const next = cells.slice();
		for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
			let count = 0;
			for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
				const yy = y + dy;
				const xx = x + dx;
				if (yy >= 0 && yy < n && xx >= 0 && xx < n) count += cells[yy * n + xx];
			}
			if (count >= 6) next[y * n + x] = 1;
			else if (count <= 3) next[y * n + x] = 0;
		}
		cells = next;
	}
	if (rng() < .5) for (let y = 0; y < n; y++) for (let x = Math.ceil(n / 2); x < n; x++) cells[y * n + x] = cells[y * n + n - 1 - x];
	return cells;
};
var makePuzzle = (n, rng, top = levels.length - 1, deadline = Infinity) => {
	while (performance.now() < deadline) {
		const solution = makePicture(n, rng, top ? 0 : .12);
		for (let flips = 0; flips < 4 * n && performance.now() < deadline; flips++) {
			const clues = cluesOf(solution, n);
			const board = emptyBoard(n);
			if (solveAt(board, n, clues, Math.min(top, 2))) return {
				solution,
				clues,
				level: rate(clues, n, Math.min(top, 2))
			};
			const open = board.filter((v) => v === -1).length;
			if (top >= 3 && open * 4 <= n * n && deduce(board, n, clues, true, deadline) !== null) return {
				solution,
				clues,
				level: 3
			};
			const unsettled = [...board.keys()].filter((i) => board[i] === -1);
			solution[unsettled[Math.floor(rng() * unsettled.length)]] ^= 1;
		}
	}
	return null;
};
var makeGame = (n, level, rng, budget = n >= 20 ? 3e3 : 1500) => {
	const deadline = performance.now() + budget;
	let best = null;
	for (;;) {
		const puzzle = makePuzzle(n, rng, level, deadline);
		if (!puzzle) break;
		if (puzzle.level === level) return puzzle;
		if (!best || puzzle.level > best.level) best = puzzle;
	}
	return best ?? makePuzzle(n, rng, 1);
};
//#endregion
//#region src/nonograms/deal.js
var dealOne = dealer(() => new Worker(new URL(
	/* @vite-ignore */
	new URL("deal.worker-f_4U9A5A.js", import.meta.url).href,
	"" + import.meta.url
), { type: "module" }), ({ n, level, seed }) => makeGame(n, level, random(seed)));
var deal = (n, level, seed) => dealOne({
	n,
	level,
	seed
});
//#endregion
//#region src/nonograms/About.jsx
var NonogramsAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "Nonograms Plus",
	actions
}, /* @__PURE__ */ h("p", null, "Picture logic puzzles: the numbers beside each row and above each column give the lengths of its runs of filled cells, in order, with at least one empty cell between runs. Fill the cells that match every clue."), /* @__PURE__ */ h("p", null, "Every board has exactly one solution and can be solved by logic alone. Nonograms were devised in 1987 by Non Ishida and, independently, Tetsuya Nishio."), /* @__PURE__ */ h("p", null, "Part of Puzzles Plus by fexofenadine, sharing its window, themes and backgrounds with Minesweeper Plus, which is based on", " ", /* @__PURE__ */ h(Link, { href: "https://github.com/frenzzy/minesweeper" }, "Minesweeper"), " by Vladimir Kutepov."));
//#endregion
//#region src/nonograms/app.jsx
var loadChoice = () => {
	const saved = parseInt(load("nonograms.size"), 10);
	const n = sizes.includes(saved) ? saved : 10;
	const level = parseInt(load("nonograms.level"), 10);
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
	clues: Array.from({ length: 2 * n }, () => []),
	solution: null,
	board: emptyBoard(n),
	history: [],
	change: 0,
	stroke: null,
	dealing: true,
	deal: 0,
	start: -1,
	time: 0,
	raf: null,
	paused: false,
	pausedAt: 0,
	win: false,
	hinted: false
});
var { actions: recordActions } = records("nonograms", sizes, levelNames);
var cycle = [
	-1,
	1,
	0
];
var ASK_AFTER = 2500;
var deals = 0;
var changes = 0;
var prevent = (event) => {
	event.preventDefault();
	return false;
};
var begin = (game, actions) => {
	if (game.start >= 0) return game;
	game.raf = requestAnimationFrame(actions.tick);
	return {
		...game,
		start: performance.now(),
		time: 1
	};
};
var changed = (game, board, history, actions, settled = false) => {
	const next = {
		...game,
		board,
		history,
		change: ++changes
	};
	next.win = solved(board, next.n, next.clues);
	if (next.win) {
		cancelAnimationFrame(next.raf);
		actions.win(next);
	}
	const stuck = !next.win && fillsLeft(board, next.n, next.clues) === 0;
	if (stuck && !settled) setTimeout(() => actions.ask(next.change), ASK_AFTER);
	return {
		hint: null,
		prompt: stuck && settled,
		game: next
	};
};
var span = ({ start, axis }, i, n) => {
	const [sx, sy] = [start % n, Math.floor(start / n)];
	const [x, y] = [i % n, Math.floor(i / n)];
	const cells = [];
	if (axis === "row") for (let k = Math.min(sx, x); k <= Math.max(sx, x); k++) cells.push(sy * n + k);
	else if (axis === "column") for (let k = Math.min(sy, y); k <= Math.max(sy, y); k++) cells.push(k * n + sx);
	else cells.push(start);
	return cells;
};
var paint = (stroke, i, n) => {
	const board = stroke.before.slice();
	for (const c of span(stroke, i, n)) if (board[c] === stroke.from) board[c] = stroke.to;
	return board;
};
var axisOf = (stroke, i, n) => {
	if (stroke.axis || i === stroke.start) return stroke.axis;
	return Math.abs(i % n - stroke.start % n) >= Math.abs(Math.floor(i / n) - Math.floor(stroke.start / n)) ? "row" : "column";
};
var cellAt = (event) => {
	const target = document.elementFromPoint?.(event.clientX, event.clientY);
	const cell = target && target.closest("[data-cell]");
	return cell ? Number(cell.dataset.cell) : -1;
};
var state = {
	...shellState("nonograms"),
	hint: null,
	prompt: false,
	errors: Boolean(load("nonograms.errors")),
	rain: Boolean(load("nonograms.rain")),
	touch: Boolean(window.matchMedia && matchMedia("(pointer: coarse)").matches),
	mode: 1,
	about: false,
	game: createGame(loadChoice()),
	winner: null,
	bestTime: null
};
var actions = {
	...shellActions,
	init: () => (state, actions) => {
		window.addEventListener("keydown", actions.press);
		window.addEventListener("pointermove", (event) => {
			const i = cellAt(event);
			if (i >= 0) actions.drag(i);
		});
		window.addEventListener("pointerup", () => actions.up());
		window.addEventListener("pointercancel", () => actions.up());
		listen(actions);
		showRain(state.rain);
		actions.reset();
	},
	press: (event) => (state, actions) => {
		if ((event.ctrlKey || event.metaKey) && !event.altKey && event.keyCode === 90) {
			if (typing(event) || state.boss || state.windowState !== "open") return;
			event.preventDefault();
			actions.undo();
			return;
		}
		const key = shortcut(event, state, actions);
		if (key === 113 || key === 78) actions.reset();
		else if (key === 72) actions.hint();
		else if (key === 80) actions.pause();
	},
	reset: (payload) => ({ game }, actions) => {
		cancelAnimationFrame(game.raf);
		const n = payload && payload.n || game.n;
		const asked = payload && payload.level !== void 0 ? payload.level : game.level;
		const level = fallback(n, asked);
		save("nonograms.size", n);
		save("nonograms.level", level);
		const id = ++deals;
		deal(n, level, Math.floor(Math.random() * 2 ** 32)).then((dealt) => actions.dealt({
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
				deal: id
			}
		};
	},
	dealt: ({ id, clues, solution }) => ({ game }) => {
		if (game.deal !== id) return null;
		return { game: {
			...game,
			clues,
			solution,
			dealing: false
		} };
	},
	down: ({ event, i }) => ({ game, mode }, actions) => {
		if (event.button !== 0 && event.button !== 2) return null;
		if (game.dealing || game.paused || game.win || game.stroke) return null;
		const touch = event.pointerType === "touch";
		const from = game.board[i];
		let to = cycle[(cycle.indexOf(from) + (event.button === 2 ? 2 : 1)) % 3];
		if (touch) to = from === mode ? -1 : mode;
		const stroke = {
			start: i,
			from,
			to,
			axis: null,
			before: game.board,
			touch
		};
		return {
			...touch && { touch },
			game: {
				...begin(game, actions),
				stroke,
				board: paint(stroke, i, game.n)
			}
		};
	},
	drag: (i) => ({ game }) => {
		const { stroke, n } = game;
		if (!stroke) return null;
		const next = {
			...stroke,
			axis: axisOf(stroke, i, n)
		};
		const board = paint(next, i, n);
		if (board.every((v, c) => v === game.board[c])) return null;
		return { game: {
			...game,
			stroke: next,
			board
		} };
	},
	up: () => ({ game }, actions) => {
		const { stroke, board } = game;
		if (!stroke) return null;
		const step = [...board.keys()].filter((c) => board[c] !== stroke.before[c]).map((c) => [c, stroke.before[c]]);
		const history = step.length ? [...game.history, step] : game.history;
		const passing = step.length === 1 && stroke.from === -1 && stroke.to === 1 && !stroke.touch;
		return changed({
			...game,
			stroke: null
		}, board, history, actions, !passing);
	},
	undo: () => ({ game }, actions) => {
		if (!game.history.length || game.win || game.paused || game.dealing || game.stroke) return { menu: null };
		const board = game.board.slice();
		for (const [c, from] of game.history[game.history.length - 1]) board[c] = from;
		return {
			menu: null,
			...changed(game, board, game.history.slice(0, -1), actions)
		};
	},
	ask: (change) => ({ game }) => {
		if (game.change !== change || game.win || game.paused || game.stroke) return null;
		return { prompt: fillsLeft(game.board, game.n, game.clues) === 0 };
	},
	hint: () => ({ game }, actions) => {
		if (game.dealing || game.win || game.paused || game.stroke) return { menu: null };
		const { board, solution, clues, n } = game;
		return {
			menu: null,
			prompt: false,
			hint: findHint({
				board,
				solution,
				clues,
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
	setMode: (mode) => ({ mode }),
	toggleErrors: () => (state) => {
		save("nonograms.errors", state.errors ? "" : "yes");
		return {
			menu: null,
			errors: !state.errors
		};
	},
	toggleRain: () => (state) => {
		save("nonograms.rain", state.rain ? "" : "yes");
		showRain(!state.rain);
		return {
			menu: null,
			rain: !state.rain
		};
	},
	toggleAbout: () => ({ about }) => ({
		menu: null,
		about: !about
	}),
	pause: pauseAction(running),
	tick: (now) => ({ game }, actions) => {
		game.raf = requestAnimationFrame(actions.tick);
		const next = Math.floor((now - game.start) / 1e3) + 1;
		if (game.time === next) return null;
		return { game: {
			...game,
			time: next
		} };
	},
	...recordActions
};
var view = (state, actions) => /* @__PURE__ */ h("main", {
	oncontextmenu: prevent,
	ondragstart: prevent,
	oncreate: actions.init
}, /* @__PURE__ */ h(Game, {
	key: "a",
	state,
	actions
}), /* @__PURE__ */ h(Taskbar, {
	key: "h",
	name: "Nonograms Plus",
	state,
	actions
}), state.winner && /* @__PURE__ */ h(Winner, {
	key: "b",
	state: state.winner,
	actions
}), state.bestTime && /* @__PURE__ */ h(BestTimes, {
	key: "c",
	title: "Fastest Nonogram Solvers",
	sizes,
	levelNames,
	allowed,
	state: state.bestTime,
	actions
}), state.prompt && /* @__PURE__ */ h(Prompt, {
	key: "d",
	title: "Nonograms",
	text: "All the filled cells are placed but there are errors. Do you want to use a hint?",
	actions
}), state.backgroundSettings && /* @__PURE__ */ h(BackgroundSettings, {
	key: "e",
	state: state.backgroundSettings,
	actions
}), state.about && /* @__PURE__ */ h(NonogramsAbout, {
	key: "f",
	actions
}), state.howTo && /* @__PURE__ */ h(NonogramsHowToPlay, {
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
//#region src/nonograms/index.js
app(state, actions, view, document.getElementById("app"));
startBackgrounds();
registerWorker();
//#endregion
