import { D as BackgroundSettings, E as Boss, F as Dialog, I as Button, L as Overlay, M as load, N as remove, O as startBackgrounds, P as save, R as app, _ as listen, a as Taskbar, b as shortcut, n as About, r as Link, v as shellActions, x as typing, y as shellState, z as h } from "./HowToPlay-DAnWEJz0.js";
import { a as check, c as OpenGames, i as BestTime_module_default, l as Winner, n as Switching, o as resumable, r as Tabs, t as registerWorker } from "./worker-D9QuEZo5.js";
import { n as Prompt, t as BestTimes_module_default } from "./BestTimes.module-CP0TO9Z-.js";
import { f as clock, g as seconds, h as pauseAction } from "./Board-D3x1X5-p.js";
import { a as hold, c as highest, d as spawn, f as targets, i as running, l as move, m as valuesOf, o as letGo, p as tilesOf, r as Game, s as canMove, t as suggest, u as sizes } from "./search-CvnrHxWX.js";
import { n as TwentyHowToPlay } from "./HowToPlay-DgzljH5F.js";
//#region src/2048/BestScores.jsx
var tabs = [{
	id: "clean",
	name: "No help"
}, {
	id: "hinted",
	name: "Hints or undo"
}];
var BestScores = ({ key, state, actions }) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.toggleBestTime()
}, /* @__PURE__ */ h(Dialog, {
	title: "Best 2048 Scores",
	onClose: actions.toggleBestTime
}, /* @__PURE__ */ h("div", { class: BestTime_module_default.root }, /* @__PURE__ */ h(Tabs, {
	tabs,
	active: state.tab,
	onSelect: actions.setBestTimeTab
}), /* @__PURE__ */ h("table", { class: BestTimes_module_default.table }, /* @__PURE__ */ h("thead", null, /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("th", null), /* @__PURE__ */ h("th", { class: BestTimes_module_default.level }, "Score"), /* @__PURE__ */ h("th", { class: BestTimes_module_default.level }, "Tile"))), /* @__PURE__ */ h("tbody", null, sizes.map((n) => {
	const best = state[state.tab][n];
	return /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("th", { class: BestTimes_module_default.size }, n, " × ", n), /* @__PURE__ */ h("td", { class: BestTimes_module_default.slot }, best.score > 0 && /* @__PURE__ */ h("span", { class: BestTimes_module_default.time }, best.score), best.score > 0 && /* @__PURE__ */ h("span", { class: BestTimes_module_default.name }, best.name)), /* @__PURE__ */ h("td", { class: BestTimes_module_default.slot }, best.tile > 0 && best.tile));
}))), /* @__PURE__ */ h("div", { class: BestTime_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.resetBestTime
}, /* @__PURE__ */ h("span", { class: BestTime_module_default.button }, "Reset Scores")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.toggleBestTime,
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: BestTime_module_default.button }, "OK"))))));
//#endregion
//#region src/2048/records.js
var keyOf = (n, assisted) => `2048.${n}${assisted ? ".help" : ""}`;
var bestOf = (n, assisted) => {
	const key = keyOf(n, assisted);
	return {
		score: parseInt(load(key), 10) || 0,
		tile: parseInt(load(`${key}.tile`), 10) || 0,
		name: load(`${key}.name`) || "Anonymous"
	};
};
var bestScores = (assisted) => Object.fromEntries(sizes.map((n) => [n, bestOf(n, assisted)]));
var assistedOf = (game) => game.hinted || game.undone;
var offer = (game) => {
	const assisted = assistedOf(game);
	if (!game.score || game.score <= bestOf(game.n, assisted).score) return null;
	return {
		key: keyOf(game.n, assisted),
		score: game.score,
		tile: game.tile,
		assisted,
		name: load("2048.name") || "",
		text: `You have the best score for ${game.n} × ${game.n}${assisted ? " with help" : ""}: ${game.score}.`
	};
};
var recordActions = {
	changeWinner: (payload) => ({ winner }) => ({ winner: {
		...winner,
		...payload
	} }),
	submitBestTime: (event) => ({ winner }, actions) => {
		event.preventDefault();
		const name = winner.name.trim();
		save(winner.key, winner.score);
		save(`${winner.key}.tile`, winner.tile);
		save(`${winner.key}.name`, name);
		save("2048.name", name);
		actions.toggleBestTime();
		actions.setBestTimeTab(winner.assisted ? "hinted" : "clean");
		return { winner: null };
	},
	toggleBestTime: () => ({ bestTime }) => ({
		menu: null,
		bestTime: bestTime ? null : {
			tab: "clean",
			clean: bestScores(false),
			hinted: bestScores(true)
		}
	}),
	setBestTimeTab: (tab) => (state) => state.bestTime ? { bestTime: {
		...state.bestTime,
		tab
	} } : null,
	resetBestTime: () => ({ bestTime }) => {
		const assisted = bestTime.tab === "hinted";
		for (const n of sizes) {
			const key = keyOf(n, assisted);
			remove(key);
			remove(`${key}.tile`);
			remove(`${key}.name`);
		}
		return { bestTime: {
			...bestTime,
			[bestTime.tab]: bestScores(assisted)
		} };
	}
};
var NUDGE = .12;
var lockOf = (dx, dy) => {
	if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return null;
	if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
	return dy > 0 ? "down" : "up";
};
var along = (dir, dx, dy) => ({
	left: -dx,
	right: dx,
	up: -dy,
	down: dy
})[dir];
var planOf = (tiles, n, dir, nextId) => {
	const done = move(tiles, n, dir, nextId);
	const to = /* @__PURE__ */ new Map();
	for (const t of done.tiles) if (t.id < nextId) to.set(t.id, t.cell);
	const shift = {};
	const byCell = {};
	let far = 0;
	for (const t of tiles) {
		if (t.gone) continue;
		const cell = to.get(t.id);
		const dx = cell % n - t.cell % n;
		const dy = Math.floor(cell / n) - Math.floor(t.cell / n);
		shift[t.id] = [dx, dy];
		byCell[t.cell] = shift[t.id];
		far = Math.max(far, Math.abs(dx) + Math.abs(dy));
	}
	for (const t of tiles) if (t.gone) shift[t.id] = byCell[t.cell] || [0, 0];
	return {
		dir,
		moved: done.moved,
		far,
		shift
	};
};
var unit = {
	left: [-1, 0],
	right: [1, 0],
	up: [0, -1],
	down: [0, 1]
};
var offsetsOf = (plan, cells) => {
	const offsets = {};
	if (!plan.moved) {
		const [ux, uy] = unit[plan.dir];
		const r = NUDGE * (1 - Math.exp(-Math.max(0, cells) * 2));
		for (const id in plan.shift) offsets[id] = [ux * r, uy * r];
		return offsets;
	}
	const p = progressOf(plan, cells);
	for (const id in plan.shift) {
		const [dx, dy] = plan.shift[id];
		offsets[id] = [dx * p, dy * p];
	}
	return offsets;
};
var progressOf = (plan, cells) => plan.moved ? Math.min(1, Math.max(0, cells / plan.far)) : 0;
var finishes = (plan, cells, speed) => plan.moved && (progressOf(plan, cells) >= .5 || cells > 0 && speed >= .5);
//#endregion
//#region src/2048/About.jsx
var TwentyAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "2048 Plus",
	actions
}, /* @__PURE__ */ h("p", null, "Slide the tiles: equal tiles that meet merge into one of twice the value. Make a 2048 tile, or keep going for the highest score you can."), /* @__PURE__ */ h("p", null, "Based on ", /* @__PURE__ */ h(Link, { href: "https://github.com/gabrielecirulli/2048" }, "2048"), " by Gabriele Cirulli (MIT licence), itself inspired by 1024 and Threes, with the rules kept and the code written anew. The hint is a short look ahead over the tiles that may appear. Its tiles keep the original's shapes and, on Classic, its colours, with the Clear Sans font by Intel (Apache 2.0 licence)."), /* @__PURE__ */ h("p", null, "Part of Puzzles Plus by fexofenadine, sharing its window, themes and backgrounds with Minesweeper Plus, which is based on", " ", /* @__PURE__ */ h(Link, { href: "https://github.com/frenzzy/minesweeper" }, "Minesweeper"), " by Vladimir Kutepov."));
//#endregion
//#region src/2048/app.jsx
var loadSize = () => {
	const saved = parseInt(load("2048.size"), 10);
	return sizes.includes(saved) ? saved : 4;
};
var rng = Math.random;
var createGame = (n) => {
	let { tiles, nextId } = spawn([], n, rng, 1);
	({tiles, nextId} = spawn(tiles, n, rng, nextId));
	return {
		n,
		tiles,
		nextId,
		score: 0,
		tile: highest(valuesOf(tiles, n)),
		history: [],
		start: -1,
		time: 0,
		raf: null,
		paused: false,
		pausedAt: 0,
		over: false,
		reached: false,
		hinted: false,
		undone: false,
		untimed: false,
		offered: false
	};
};
var valuesCheck = (values, n) => {
	check(Array.isArray(values) && values.length === n * n);
	check(values.every((v) => v === 0 || Number.isInteger(Math.log2(v)) && v >= 2));
	return values;
};
var saved = resumable({
	key: "2048.saved",
	running,
	label: ({ n, score }) => `${n} × ${n}, ${score} points`,
	pack: ({ n, tiles, score, tile, history, reached, hinted, undone, untimed }) => ({
		n,
		values: valuesOf(tiles, n),
		score,
		tile,
		history: history.slice(-100),
		reached,
		hinted,
		undone,
		untimed
	}),
	unpack: ({ n, values, score, tile, history, reached, hinted, undone, untimed }) => {
		check(sizes.includes(n) && Number.isInteger(score) && Array.isArray(history));
		for (const step of history) valuesCheck(step.values, n);
		check(canMove(valuesCheck(values, n), n));
		const { tiles, nextId } = tilesOf(values, 1);
		return {
			...createGame(n),
			tiles,
			nextId,
			score,
			tile: tile || highest(values),
			history,
			reached: Boolean(reached),
			hinted: Boolean(hinted),
			undone: Boolean(undone),
			untimed: Boolean(untimed)
		};
	}
});
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
var keyDirs = {
	37: "left",
	65: "left",
	38: "up",
	87: "up",
	39: "right",
	68: "right",
	40: "down",
	83: "down"
};
var swipe = null;
var RECENT = 100;
var state = {
	...shellState("2048"),
	hint: null,
	prompt: false,
	timer: load("2048.timer") === "on",
	about: false,
	shelf: saved.list(),
	game: saved.restore() || createGame(loadSize()),
	winner: null,
	bestTime: null
};
var actions = {
	...shellActions,
	init: () => (state, actions) => {
		window.addEventListener("keydown", actions.press);
		window.addEventListener("pointermove", actions.swipeMove);
		window.addEventListener("pointerup", actions.swipeEnd);
		window.addEventListener("pointercancel", actions.swipeCancel);
		listen(actions);
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
		if (key === 113 || key === 78) actions.newGame();
		else if (key === 72) actions.hint();
		else if (key === 80) actions.pause();
		else if (keyDirs[key]) {
			event.preventDefault();
			actions.slide(keyDirs[key]);
		}
	},
	reset: (payload) => ({ game, switching }) => {
		cancelAnimationFrame(game.raf);
		const n = payload && payload.n || game.n;
		save("2048.size", n);
		swipe = null;
		const winner = !(switching && switching.parked) && !game.offered && game.history.length ? offer(game) : null;
		return {
			menu: null,
			hint: null,
			prompt: false,
			...winner && { winner },
			game: createGame(n)
		};
	},
	slide: (dir) => (state, actions) => {
		const { game } = state;
		const held = swipe && swipe.board;
		swipe = null;
		const done = !game.paused && !game.over && !state.prompt && move(game.tiles, game.n, dir, game.nextId);
		if (!done || !done.moved) {
			letGo(held);
			return null;
		}
		const { tiles, nextId } = spawn(done.tiles, game.n, rng, done.nextId);
		const values = valuesOf(tiles, game.n);
		const next = {
			...begin(game, actions),
			tiles,
			nextId,
			score: game.score + done.score,
			tile: Math.max(game.tile, highest(values)),
			history: [...game.history, {
				values: valuesOf(game.tiles, game.n),
				score: game.score
			}],
			over: !canMove(values, game.n)
		};
		const reached = !game.reached && highest(values) >= targets[game.n];
		if (reached) next.reached = true;
		let winner = null;
		if (next.over) {
			cancelAnimationFrame(next.raf);
			winner = offer(next);
			next.offered = true;
		}
		return {
			hint: null,
			prompt: reached && !next.over,
			...winner && { winner },
			game: next
		};
	},
	swipeStart: (event) => (state) => {
		const { game } = state;
		if (game.paused || game.over || state.prompt || event.button > 0) return;
		const board = event.currentTarget;
		const rect = board.getBoundingClientRect();
		const { clientX: x, clientY: y, timeStamp: t } = event;
		swipe = {
			x,
			y,
			board,
			size: rect.width / game.n || 1,
			plan: null,
			samples: [{
				t,
				x,
				y
			}]
		};
	},
	swipeMove: (event) => (state) => {
		if (!swipe) return;
		const { clientX: x, clientY: y, timeStamp: t } = event;
		swipe.samples = [...swipe.samples.filter((s) => t - s.t <= RECENT), {
			t,
			x,
			y
		}];
		const dx = x - swipe.x;
		const dy = y - swipe.y;
		if (!swipe.plan) {
			const dir = lockOf(dx, dy);
			if (!dir) return;
			const { game } = state;
			swipe.plan = planOf(game.tiles, game.n, dir, game.nextId);
		}
		hold(swipe.board, offsetsOf(swipe.plan, along(swipe.plan.dir, dx, dy) / swipe.size));
	},
	swipeEnd: (event) => (state, actions) => {
		if (!swipe) return null;
		const { plan, size, samples, board } = swipe;
		const { clientX: x, clientY: y, timeStamp: t } = event;
		const start = swipe;
		swipe = null;
		if (!plan) return null;
		const a = along(plan.dir, x - start.x, y - start.y);
		const first = samples.find((s) => t - s.t <= RECENT);
		const speed = first && t > first.t ? along(plan.dir, x - first.x, y - first.y) / (t - first.t) : 0;
		if (finishes(plan, a / size, speed)) {
			actions.slide(plan.dir);
			return null;
		}
		letGo(board);
		return null;
	},
	swipeCancel: () => () => {
		if (swipe) letGo(swipe.board);
		swipe = null;
	},
	undo: () => ({ game }, actions) => {
		if (!game.history.length || game.paused) return { menu: null };
		swipe = null;
		const { values, score } = game.history.at(-1);
		const { tiles, nextId } = tilesOf(values, game.nextId);
		const next = {
			...game,
			tiles,
			nextId,
			score,
			history: game.history.slice(0, -1),
			over: false,
			undone: true,
			offered: false
		};
		if (game.over && game.start >= 0) next.raf = requestAnimationFrame(actions.tick);
		return {
			menu: null,
			hint: null,
			game: next
		};
	},
	hint: () => ({ game }, actions) => {
		if (game.paused || game.over) return { menu: null };
		const found = suggest(valuesOf(game.tiles, game.n), game.n);
		return {
			menu: null,
			hint: found ? {
				kind: "move",
				...found
			} : {
				kind: "stuck",
				text: "No move is left."
			},
			game: {
				...begin(game, actions),
				hinted: true
			}
		};
	},
	answerPrompt: (yes) => (state, actions) => {
		if (!yes) actions.reset();
		return { prompt: false };
	},
	toggleTimer: () => (state) => {
		save("2048.timer", state.timer ? "" : "on");
		return {
			menu: null,
			timer: !state.timer,
			game: state.timer ? {
				...state.game,
				untimed: true
			} : state.game
		};
	},
	toggleAbout: () => ({ about }) => ({
		menu: null,
		about: !about
	}),
	pause: pauseAction(running, () => {
		swipe = null;
		return {};
	}),
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
	name: "2048 Plus",
	state,
	actions
}), state.winner && /* @__PURE__ */ h(Winner, {
	key: "b",
	state: state.winner,
	actions
}), state.bestTime && /* @__PURE__ */ h(BestScores, {
	key: "c",
	state: state.bestTime,
	actions
}), state.prompt && /* @__PURE__ */ h(Prompt, {
	key: "d",
	title: "2048",
	text: `You made the ${targets[state.game.n]} tile! Do you want to keep going?`,
	actions
}), state.backgroundSettings && /* @__PURE__ */ h(BackgroundSettings, {
	key: "e",
	state: state.backgroundSettings,
	actions
}), state.switching && /* @__PURE__ */ h(Switching, {
	key: "k",
	title: "2048",
	actions
}), state.about && /* @__PURE__ */ h(TwentyAbout, {
	key: "f",
	actions
}), state.howTo && /* @__PURE__ */ h(TwentyHowToPlay, {
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
//#region src/2048/index.js
app(state, actions, view, document.getElementById("app"));
startBackgrounds();
registerWorker();
//#endregion
