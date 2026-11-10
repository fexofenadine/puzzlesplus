import { $ as Overlay, E as gameKey, F as undoKey, M as shellState, N as shortcut, O as listen, Q as Button, U as BackgroundSettings, V as Boss, Z as Dialog, a as Taskbar, it as save, j as shellActions, k as prevent, n as About, nt as load, ot as h, r as Link, rt as remove, st as __exportAll } from "./HowToPlay-CdnnUesu.js";
import { _ as check, a as clearStats, b as OpenGames, c as lossesOn, d as StatsList, h as BestTime_module_default, i as Switching, l as readStats, n as FireworksCanvas, o as lossActions, p as Tabs, r as celebrate, s as lossState, t as start, u as tally, v as resumable, x as Winner } from "./start-BqCHtXOL.js";
import { i as Prompt, n as winnerActions, r as BestTimes_module_default } from "./records-icyXVvxG.js";
import { S as timerAction, b as tickAction, g as pauseAction, h as nextTick, v as startClock, y as stopTick } from "./Board-JF5Te-JW.js";
import { a as hold, c as highest, d as spawn, f as targets, i as running, l as move, m as valuesOf, o as letGo, p as tilesOf, r as Game, s as canMove, t as suggest, u as sizes } from "./search-C1uDNW8L.js";
import { n as TwentyHowToPlay } from "./HowToPlay-1td59A68.js";
var keyOf = (n, assisted) => `2048.${n}${assisted ? ".help" : ""}`;
var clean = (entry) => ({
	score: parseInt(entry && entry.score, 10) || 0,
	tile: parseInt(entry && entry.tile, 10) || 0,
	name: String(entry && entry.name || "Anonymous")
});
var topOf = (n, assisted) => {
	const key = keyOf(n, assisted);
	let list = [];
	try {
		const saved = JSON.parse(load(`${key}.top`));
		if (Array.isArray(saved)) list = saved.map(clean);
	} catch {}
	const old = clean({
		score: load(key),
		tile: load(`${key}.tile`),
		name: load(`${key}.name`)
	});
	if (!list.length && old.score > 0) list = [old];
	return list.filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
};
var bestScores = (assisted) => Object.fromEntries(sizes.map((n) => [n, topOf(n, assisted)]));
var assistedOf = (game) => game.hinted || game.undone;
var offer = (game) => {
	const assisted = assistedOf(game);
	const list = topOf(game.n, assisted);
	if (!game.score || list.length >= 5 && game.score <= list[4].score) return null;
	const first = !list.length || game.score > list[0].score;
	const where = `${game.n} × ${game.n}${assisted ? " with help" : ""}`;
	return {
		key: keyOf(game.n, assisted),
		n: game.n,
		score: game.score,
		tile: game.tile,
		assisted,
		name: load("2048.name") || "",
		text: first ? `You have the best score for ${where}: ${game.score}.` : `You have a top 5 score for ${where}: ${game.score}.`
	};
};
var recordActions = {
	...winnerActions,
	submitBestTime: (event) => ({ winner }, actions) => {
		event.preventDefault();
		const name = winner.name.trim();
		const list = [...topOf(winner.n, winner.assisted), clean({
			...winner,
			name
		})].sort((a, b) => b.score - a.score).slice(0, 5);
		save(`${winner.key}.top`, JSON.stringify(list));
		save(winner.key, list[0].score);
		save(`${winner.key}.tile`, list[0].tile);
		save(`${winner.key}.name`, list[0].name);
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
			hinted: bestScores(true),
			stats: readStats("2048"),
			losses: lossesOn()
		}
	}),
	resetBestTime: () => ({ bestTime }) => {
		const assisted = bestTime.tab === "hinted";
		for (const n of sizes) {
			const key = keyOf(n, assisted);
			remove(key);
			remove(`${key}.tile`);
			remove(`${key}.name`);
			remove(`${key}.top`);
		}
		return { bestTime: {
			...bestTime,
			[bestTime.tab]: bestScores(assisted)
		} };
	},
	resetStats: () => ({ bestTime }) => ({ bestTime: {
		...bestTime,
		stats: clearStats("2048")
	} })
};
//#endregion
//#region src/2048/BestScores.jsx
var tabs = [{
	id: "clean",
	name: "No help"
}, {
	id: "hinted",
	name: "Hints or undo"
}];
var places = Array.from({ length: 5 }, (_, place) => place);
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
}), /* @__PURE__ */ h("table", { class: BestTimes_module_default.table }, /* @__PURE__ */ h("thead", null, /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("th", null), sizes.map((n) => /* @__PURE__ */ h("th", { class: BestTimes_module_default.level }, n, " × ", n)))), /* @__PURE__ */ h("tbody", null, places.map((place) => /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("th", { class: BestTimes_module_default.size }, place + 1), sizes.map((n) => {
	const best = state[state.tab][n][place];
	return /* @__PURE__ */ h("td", { class: BestTimes_module_default.slot }, !best && /* @__PURE__ */ h("span", { class: BestTimes_module_default.empty }, "–"), best && /* @__PURE__ */ h("span", { class: BestTimes_module_default.time }, best.score), best && /* @__PURE__ */ h("span", { class: BestTimes_module_default.name }, best.tile, " · ", best.name));
}))))), state.stats && /* @__PURE__ */ h(StatsList, {
	stats: state.stats,
	wonLabel: "Made the target",
	losses: state.losses
}), /* @__PURE__ */ h("div", { class: BestTime_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.resetBestTime
}, /* @__PURE__ */ h("span", { class: BestTime_module_default.button }, "Reset Scores")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.resetStats
}, /* @__PURE__ */ h("span", { class: BestTime_module_default.button }, "Reset Stats")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.toggleBestTime,
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: BestTime_module_default.button }, "OK"))))));
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
var finishes = (plan, pixels) => plan.moved && pixels > 10;
//#endregion
//#region src/2048/About.jsx
var TwentyAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "2048 Plus",
	actions,
	credits: [/* @__PURE__ */ h("li", null, "Rules, tile shapes and Classic's tile colours follow", " ", /* @__PURE__ */ h(Link, { href: "https://github.com/gabrielecirulli/2048" }, "2048"), " by Gabriele Cirulli (MIT licence), itself inspired by 1024 and Threes; the code is written anew."), /* @__PURE__ */ h("li", null, "The tiles use the Clear Sans font by Intel (Apache 2.0 licence).")]
}, /* @__PURE__ */ h("p", null, "Slide the tiles: equal tiles that meet merge into one of twice the value. Make a 2048 tile, or keep going for the highest score you can."), /* @__PURE__ */ h("p", null, "Boards of 3 × 3, 4 × 4 and 5 × 5, unlimited undo, and a hint that looks a short way ahead over the tiles that may appear and says why it likes a move. The best five scores per size are kept, apart for games that used help."));
//#endregion
//#region src/2048/app.jsx
var app_exports = /* @__PURE__ */ __exportAll({
	actions: () => actions,
	createGame: () => createGame,
	saved: () => saved,
	setRandom: () => setRandom,
	state: () => state,
	view: () => view
});
var loadSize = () => {
	const saved = parseInt(load("2048.size"), 10);
	return sizes.includes(saved) ? saved : 4;
};
var rng = Math.random;
var setRandom = (next) => {
	rng = next;
};
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
var state = {
	...shellState("2048"),
	...lossState(),
	hint: null,
	prompt: false,
	timer: load("2048.timer") === "on",
	shelf: saved.list(),
	game: saved.restore() || createGame(loadSize()),
	winner: null,
	bestTime: null
};
var actions = {
	...shellActions,
	...lossActions,
	init: () => (state, actions) => {
		window.addEventListener("keydown", actions.press);
		window.addEventListener("pointermove", actions.swipeMove);
		window.addEventListener("pointerup", actions.swipeEnd);
		window.addEventListener("pointercancel", actions.swipeCancel);
		listen(actions);
	},
	press: (event) => (state, actions) => {
		if (undoKey(event, state)) {
			event.preventDefault();
			actions.undo();
			return;
		}
		const key = shortcut(event, state, actions);
		if (key === null) return;
		if (gameKey(key, actions)) return;
		if (keyDirs[key]) {
			event.preventDefault();
			actions.slide(keyDirs[key]);
		}
	},
	reset: (payload) => ({ game, switching }) => {
		stopTick(game.raf);
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
			...startClock(game, actions),
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
		if (reached) {
			next.reached = true;
			celebrate();
			tally("2048", {
				won: true,
				clean: !assistedOf(next)
			});
		}
		let winner = null;
		if (next.over) {
			stopTick(next.raf);
			if (!next.reached) tally("2048", { won: false });
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
		const { clientX: x, clientY: y } = event;
		swipe = {
			x,
			y,
			board,
			size: rect.width / game.n || 1,
			plan: null
		};
	},
	swipeMove: (event) => (state) => {
		if (!swipe) return;
		const { clientX: x, clientY: y } = event;
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
		const { plan, board } = swipe;
		const start = swipe;
		swipe = null;
		if (!plan) return null;
		if (finishes(plan, along(plan.dir, event.clientX - start.x, event.clientY - start.y))) {
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
		if (game.over && game.start >= 0) next.raf = nextTick(actions.tick, game.start);
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
				...startClock(game, actions),
				hinted: true
			}
		};
	},
	answerPrompt: (yes) => (state, actions) => {
		if (!yes) actions.reset();
		return { prompt: false };
	},
	toggleTimer: timerAction("2048.timer", "on", ""),
	pause: pauseAction(running, () => {
		swipe = null;
		return {};
	}),
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
start(app_exports);
//#endregion
