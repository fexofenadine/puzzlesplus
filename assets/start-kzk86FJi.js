import { $ as Overlay, Q as Button, W as startBackgrounds, Z as Dialog, at as app, g as games, i as About_module_default, it as save, nt as load, o as icons, ot as h, rt as remove } from "./HowToPlay-B-GK6Mo_.js";
import { f as clock, y as stopTick } from "./Board-BuZpLT6t.js";
var Winner_module_default = {
	root: "Winner_root",
	text: "Winner_text",
	input: "Winner_input",
	button: "Winner_button"
};
var Input_module_default = {
	root: "Input_root",
	input: "Input_input"
};
//#endregion
//#region src/Input.jsx
var Input = ({ key, id, type, name, value, maxLength, inputMode, onInput, onCreate }) => /* @__PURE__ */ h("span", { class: Input_module_default.root }, /* @__PURE__ */ h("input", {
	key,
	id,
	class: Input_module_default.input,
	type: type || "text",
	name,
	value,
	maxlength: maxLength,
	inputmode: inputMode,
	oninput: onInput,
	oncreate: onCreate
}));
//#endregion
//#region src/Winner.jsx
var Winner = ({ key, state, actions }) => /* @__PURE__ */ h(Overlay, { key }, /* @__PURE__ */ h(Dialog, null, /* @__PURE__ */ h("form", {
	class: Winner_module_default.root,
	autocomplete: "off",
	onsubmit: actions.submitBestTime
}, /* @__PURE__ */ h("label", {
	for: "winner",
	class: Winner_module_default.text
}, state.text || `You have the fastest time for ${state.level} level${state.hinted ? " with hints" : ""}.`), /* @__PURE__ */ h("label", {
	for: "winner",
	class: Winner_module_default.text
}, "Please enter your name."), /* @__PURE__ */ h("div", { class: Winner_module_default.input }, /* @__PURE__ */ h(Input, {
	id: "winner",
	name: "winner",
	value: state.name,
	maxLength: 32,
	inputMode: "latin-name",
	onInput: (event) => actions.changeWinner({ name: event.target.value }),
	onCreate: (input) => {
		input.focus();
		input.select();
	}
})), /* @__PURE__ */ h(Button, null, /* @__PURE__ */ h("span", { class: Winner_module_default.button }, "OK")))));
var OpenGames_module_default = {
	root: "OpenGames_root",
	text: "OpenGames_text",
	list: "OpenGames_list",
	option: "OpenGames_option",
	label: "OpenGames_label",
	selected: "OpenGames_selected OpenGames_option",
	footer: "OpenGames_footer"
};
//#endregion
//#region src/shell/OpenGames.jsx
var keyDown = (state, actions) => (event) => {
	const at = games.findIndex(([id]) => id === state.openGames);
	if (event.keyCode === 27) actions.openGame(state.page);
	else if (event.keyCode === 13) actions.openGame(state.openGames);
	else if (event.keyCode === 38 || event.keyCode === 40) {
		event.preventDefault();
		const next = (at + (event.keyCode === 40 ? 1 : -1) + games.length) % games.length;
		actions.selectGame(games[next][0]);
	}
};
var OpenGames = ({ key, state, actions }) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: keyDown(state, actions)
}, /* @__PURE__ */ h(Dialog, {
	title: "Open Games",
	onClose: () => actions.openGame(state.page)
}, /* @__PURE__ */ h("div", {
	class: OpenGames_module_default.root,
	oncreate: (el) => el.focus(),
	tabindex: -1
}, /* @__PURE__ */ h("p", { class: OpenGames_module_default.text }, "Choose a game to open."), /* @__PURE__ */ h("ul", {
	class: OpenGames_module_default.list,
	role: "listbox"
}, games.map(([id, title]) => /* @__PURE__ */ h("li", {
	role: "option",
	"aria-selected": id === state.openGames,
	class: id === state.openGames ? OpenGames_module_default.selected : OpenGames_module_default.option,
	onclick: () => actions.selectGame(id),
	ondblclick: () => actions.openGame(id)
}, /* @__PURE__ */ h("img", {
	src: icons[id],
	alt: "",
	width: "32",
	height: "32"
}), /* @__PURE__ */ h("span", { class: OpenGames_module_default.label }, title)))), /* @__PURE__ */ h("p", { class: OpenGames_module_default.text }, /* @__PURE__ */ h("a", {
	class: About_module_default.link,
	href: "../how-to-play/",
	target: "_blank",
	rel: "noopener"
}, "How to play each game")), /* @__PURE__ */ h("div", { class: OpenGames_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => actions.openGame(state.openGames)
}, /* @__PURE__ */ h("span", { class: About_module_default.button }, "OK")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => actions.openGame(state.page)
}, /* @__PURE__ */ h("span", { class: About_module_default.button }, "Cancel"))))));
var Prompt_module_default = {
	root: "Prompt_root",
	text: "Prompt_text",
	footer: "Prompt_footer",
	button: "Prompt_button"
};
//#endregion
//#region src/shell/resume.js
var SHELF = 3;
var resumable = ({ key, running, pack, unpack, label = () => "", fresh = {} }) => {
	let last = null;
	const shelfKey = `${key}.shelf`;
	const elapsedOf = (game) => Math.max(0, Math.floor((game.paused ? game.pausedAt : clock()) - game.start));
	const keep = (game, force = false) => {
		if (!running(game)) {
			if (last !== "") remove(key);
			last = "";
			return;
		}
		const parts = JSON.stringify(pack(game));
		const seen = `${game.paused}${parts}`;
		if (seen === last && !force) return;
		last = seen;
		save(key, `{"version":1,"elapsed":${elapsedOf(game)},"game":${parts}}`);
	};
	const revive = (saved) => {
		if (!saved || saved.version !== 1 || !(saved.elapsed >= 0)) throw new Error("no saved game");
		const now = clock();
		return {
			...unpack(saved.game),
			start: now - saved.elapsed,
			time: Math.floor(saved.elapsed / 1e3) + 1,
			raf: null,
			paused: true,
			pausedAt: now
		};
	};
	const restore = () => {
		try {
			return revive(JSON.parse(load(key)));
		} catch {
			return null;
		}
	};
	const read = () => {
		try {
			const entries = JSON.parse(load(shelfKey));
			return Array.isArray(entries) ? entries.filter((e) => e && e.game && e.elapsed >= 0) : [];
		} catch {
			return [];
		}
	};
	const list = () => read().map(({ id, label, elapsed }) => ({
		id,
		label,
		elapsed
	}));
	const park = (game) => {
		const entry = {
			version: 1,
			id: Date.now(),
			label: label(game),
			elapsed: elapsedOf(game),
			game: pack(game)
		};
		save(shelfKey, JSON.stringify([entry, ...read()].slice(0, SHELF)));
	};
	const actions = {
		keepGame: () => ({ game }) => {
			keep(game, true);
		},
		newGame: (payload) => ({ game }, actions) => {
			if (!running(game)) {
				actions.reset(payload);
				return null;
			}
			return {
				menu: null,
				switching: { payload }
			};
		},
		closeGame: () => ({ game }, actions) => {
			if (!running(game)) {
				actions.finishClose();
				return null;
			}
			return {
				menu: null,
				switching: { close: true }
			};
		},
		answerSwitch: (choice) => ({ switching, game }, actions) => {
			if (!switching) return null;
			if (choice === "save" || choice === "discard") {
				if (choice === "save") {
					park(game);
					switching.parked = true;
				}
				if (switching.close) actions.finishClose();
				else actions.reset(switching.payload);
			}
			return {
				switching: null,
				shelf: list()
			};
		},
		resumeGame: (id) => ({ game }) => {
			const entries = read();
			const entry = entries.find((e) => e.id === id);
			let back;
			save(shelfKey, JSON.stringify(entries.filter((e) => e.id !== id)));
			try {
				back = revive(entry);
			} catch {
				return {
					menu: null,
					shelf: list()
				};
			}
			stopTick(game.raf);
			if (running(game)) park(game);
			return {
				menu: null,
				hint: null,
				prompt: false,
				...fresh,
				game: back,
				shelf: list()
			};
		}
	};
	const open = (linked) => {
		const kept = restore();
		if (linked && kept) park(kept);
		return linked || kept;
	};
	return {
		keep,
		restore,
		open,
		list,
		actions
	};
};
var check = (ok) => {
	if (!ok) throw new Error("saved game does not fit");
};
var boardOf = (cells, n, low, high) => {
	check(Array.isArray(cells) && cells.length === n * n);
	check(cells.every((v) => v >= low && v <= high));
	return Int8Array.from(cells);
};
var BestTime_module_default = {
	root: "BestTime_root",
	table: "BestTime_table",
	cell: "BestTime_cell",
	footer: "BestTime_footer",
	button: "BestTime_button",
	tabs: "BestTime_tabs",
	tab: "BestTime_tab",
	tabActive: "BestTime_tabActive BestTime_tab"
};
//#endregion
//#region src/shell/Tabs.jsx
var hintTabs = [{
	id: "clean",
	name: "No hints"
}, {
	id: "hinted",
	name: "Hints used"
}];
var Tabs = ({ tabs, active, onSelect }) => /* @__PURE__ */ h("div", {
	class: BestTime_module_default.tabs,
	role: "tablist"
}, tabs.map((tab) => /* @__PURE__ */ h("button", {
	type: "button",
	role: "tab",
	tabindex: -1,
	"aria-selected": active === tab.id,
	class: active === tab.id ? BestTime_module_default.tabActive : BestTime_module_default.tab,
	onclick: () => onSelect(tab.id)
}, tab.name)));
var StatsList_module_default = {
	root: "StatsList_root",
	list: "StatsList_list",
	row: "StatsList_row",
	note: "StatsList_note"
};
//#endregion
//#region src/shell/StatsList.jsx
var StatsList = ({ stats, losses = false, wonLabel = "Won" }) => {
	const played = stats.won + stats.lost;
	const rows = [
		[wonLabel, stats.won],
		...losses ? [["Lost", stats.lost], ["Win rate", played ? `${Math.round(100 * stats.won / played)}%` : "–"]] : [],
		["Without help", stats.clean],
		["Streak", stats.streak],
		["Best streak", stats.best]
	];
	return /* @__PURE__ */ h("div", { class: StatsList_module_default.root }, /* @__PURE__ */ h("dl", { class: StatsList_module_default.list }, rows.map(([name, value]) => /* @__PURE__ */ h("div", { class: StatsList_module_default.row }, /* @__PURE__ */ h("dt", null, name), /* @__PURE__ */ h("dd", null, value)))), /* @__PURE__ */ h("p", { class: StatsList_module_default.note }, "Streaks count wins without hints or undo."));
};
//#endregion
//#region src/shell/stats.js
var fields = [
	"won",
	"lost",
	"clean",
	"streak",
	"best"
];
var keyOf = (prefix) => `${prefix}.stats`;
var readStats = (prefix) => {
	let saved = null;
	try {
		saved = JSON.parse(load(keyOf(prefix)));
	} catch {}
	return Object.fromEntries(fields.map((field) => [field, Math.max(0, parseInt(saved && saved[field], 10) || 0)]));
};
var lossesOn = () => load("losses") === "on";
var lossState = () => ({ trackLosses: lossesOn() });
var lossActions = { toggleTrackLosses: () => ({ trackLosses }) => {
	save("losses", trackLosses ? "off" : "on");
	return {
		menu: null,
		trackLosses: !trackLosses
	};
} };
var tally = (prefix, { won, clean = true }) => {
	if (!won && !lossesOn()) return;
	const stats = readStats(prefix);
	if (won) stats.won++;
	else stats.lost++;
	if (won && clean) {
		stats.clean++;
		stats.streak++;
		stats.best = Math.max(stats.best, stats.streak);
	} else stats.streak = 0;
	save(keyOf(prefix), JSON.stringify(stats));
};
var clearStats = (prefix) => {
	remove(keyOf(prefix));
	return readStats(prefix);
};
//#endregion
//#region src/shell/Switching.jsx
var Switching = ({ key, title, actions }) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.answerSwitch(null)
}, /* @__PURE__ */ h(Dialog, {
	title,
	onClose: () => actions.answerSwitch(null)
}, /* @__PURE__ */ h("div", { class: Prompt_module_default.root }, /* @__PURE__ */ h("p", { class: Prompt_module_default.text }, "A game is in progress. Save it to resume later, or discard it?"), /* @__PURE__ */ h("div", { class: Prompt_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => actions.answerSwitch("save")
}, /* @__PURE__ */ h("span", { class: Prompt_module_default.button }, "Save")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => actions.answerSwitch("discard")
}, /* @__PURE__ */ h("span", { class: Prompt_module_default.button }, "Discard")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => actions.answerSwitch(null),
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: Prompt_module_default.button }, "Cancel"))))));
//#endregion
//#region src/shell/fireworks.js
var square = "square";
var dot = "dot";
var glyph = "glyph";
var looks = {
	classic: {
		colors: [
			"#ff0000",
			"#ffff00",
			"#00ff00",
			"#00ffff",
			"#ff00ff",
			"#ffffff"
		],
		shape: square,
		gravity: 90,
		size: 3
	},
	synthwave: {
		colors: [
			"#ff2a95",
			"#00e5ff",
			"#ffe600",
			"#a259ff"
		],
		shape: dot,
		gravity: 70,
		size: 2.6,
		glow: 10
	},
	solarized: {
		colors: [
			"#b58900",
			"#cb4b16",
			"#dc322f",
			"#d33682",
			"#6c71c4",
			"#268bd2",
			"#2aa198",
			"#859900"
		],
		shape: dot,
		gravity: 80,
		size: 2.6
	},
	matrix: {
		colors: [
			"#2cff6e",
			"#d4ffe0",
			"#0f9d3a"
		],
		shape: glyph,
		gravity: 40,
		size: 15,
		glyphs: "ｼﾓｱｦｿﾅﾊﾋﾌﾍﾎ"
	},
	nord: {
		colors: [
			"#88c0d0",
			"#81a1c1",
			"#8fbcbb",
			"#eceff4",
			"#b48ead"
		],
		shape: dot,
		gravity: 30,
		size: 2.4,
		glow: 6
	}
};
looks["solarized-phosphor"] = looks.solarized;
var lookOf = (theme) => looks[theme] || looks.classic;
var SPARKS = 70;
var TRAIL = 5;
var LIMIT = 120;
var launch = (rng) => ({
	x: .15 + rng() * .7,
	y: .15 + rng() * .4,
	wait: .3 + rng() * .4
});
var sparks = (look, x, y, rng) => {
	const main = look.colors[Math.floor(rng() * look.colors.length)];
	const other = look.colors[Math.floor(rng() * look.colors.length)];
	return Array.from({ length: SPARKS }, () => {
		const angle = rng() * Math.PI * 2;
		const speed = (.25 + .75 * Math.sqrt(rng())) * 220;
		const life = 1.1 + rng() * .9;
		return {
			x,
			y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			life,
			age: 0,
			trail: [],
			color: rng() < .2 ? other : main,
			char: look.glyphs ? look.glyphs[Math.floor(rng() * look.glyphs.length)] : ""
		};
	});
};
var advance = (list, dt, look) => list.filter((p) => {
	p.age += dt;
	if (p.age >= p.life) return false;
	p.trail.push([p.x, p.y]);
	if (p.trail.length > TRAIL) p.trail.shift();
	const drag = Math.exp(-1.6 * dt);
	p.vx *= drag;
	p.vy = p.vy * drag + look.gravity * dt;
	p.x += p.vx * dt;
	p.y += p.vy * dt;
	return true;
});
var calm = () => !globalThis.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches;
var canvas$1 = null;
var running = false;
var place = () => {
	const page = document.getElementById("fireworks");
	if (page) return page;
	if (canvas$1?.isConnected) return canvas$1;
	canvas$1 = document.createElement("canvas");
	canvas$1.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:none";
	const background = document.body.querySelector("canvas");
	if (background) background.after(canvas$1);
	else document.body.prepend(canvas$1);
	return canvas$1;
};
var celebrate = (theme = document.documentElement.dataset.theme) => {
	if (running || load("fireworks") === "off" || document.hidden || calm()) return;
	const root = document.documentElement;
	if (root.dataset.boss) return;
	const target = place();
	const context = target.getContext?.("2d");
	if (!context) return;
	const look = lookOf(theme);
	const scale = Math.min(window.devicePixelRatio || 1, 2);
	const width = innerWidth;
	const height = innerHeight;
	target.width = Math.round(width * scale);
	target.height = Math.round(height * scale);
	target.style.display = "block";
	context.setTransform(scale, 0, 0, scale, 0, 0);
	const started = performance.now();
	let open = true;
	let wait = 0;
	let alive = [];
	let rockets = [];
	let clock = 0;
	let last = null;
	running = true;
	const interrupt = (event) => {
		if (event.timeStamp > started && !event.repeat) open = false;
	};
	const listening = ["pointerdown", "keydown"];
	for (const name of listening) window.addEventListener(name, interrupt, true);
	const stop = () => {
		for (const name of listening) window.removeEventListener(name, interrupt, true);
		running = false;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, target.width, target.height);
		target.style.display = "none";
	};
	const frame = (now) => {
		const dt = last === null ? 0 : Math.min(Math.max((now - last) / 1e3, 0), .05);
		last = now;
		clock += dt;
		if (root.dataset.boss || document.hidden) return stop();
		if (clock > LIMIT) open = false;
		wait -= dt;
		while (open && wait <= 0) {
			const next = launch(Math.random);
			wait += next.wait;
			rockets.push({
				x: next.x * width,
				y: height,
				top: next.y * height,
				speed: 520 + Math.random() * 120,
				trail: []
			});
		}
		rockets = rockets.filter((r) => {
			r.trail.push([r.x, r.y]);
			if (r.trail.length > 10) r.trail.shift();
			r.y -= r.speed * dt;
			if (r.y > r.top) return true;
			alive.push(...sparks(look, r.x, r.y, Math.random));
			return false;
		});
		alive = advance(alive, dt, look);
		context.clearRect(0, 0, width, height);
		context.globalCompositeOperation = "lighter";
		if (look.shape === glyph) context.font = `${look.size}px monospace`;
		for (const r of rockets) draw(context, look, {
			...r,
			color: look.colors[0],
			char: look.glyphs?.[0] || ""
		}, 1);
		for (const p of alive) draw(context, look, p, 1 - p.age / p.life);
		if (open || rockets.length || alive.length) requestAnimationFrame(frame);
		else stop();
	};
	requestAnimationFrame(frame);
};
var mark = (context, look, p, x, y, alpha) => {
	context.globalAlpha = Math.max(0, alpha);
	context.fillStyle = p.color;
	if (look.shape === glyph) context.fillText(p.char, x, y);
	else if (look.shape === square) context.fillRect(Math.round(x), Math.round(y), look.size, look.size);
	else {
		context.beginPath();
		const radius = look.size * (.4 + .6 * alpha);
		context.arc(x, y, radius, 0, Math.PI * 2);
		context.fill();
		if (look.glow) {
			context.globalAlpha = Math.max(0, alpha) * .25;
			context.beginPath();
			context.arc(x, y, radius * 2.4, 0, Math.PI * 2);
			context.fill();
		}
	}
};
var draw = (context, look, p, alpha) => {
	const { trail } = p;
	trail.forEach(([x, y], k) => mark(context, look, p, x, y, alpha * (k + 1) / (trail.length + 2)));
	mark(context, look, p, p.x, p.y, alpha);
	context.globalAlpha = 1;
};
var FireworksCanvas_module_default = { canvas: "FireworksCanvas_canvas" };
//#endregion
//#region src/shell/FireworksCanvas.jsx
var FireworksCanvas = ({ key }) => /* @__PURE__ */ h("canvas", {
	key,
	id: "fireworks",
	class: FireworksCanvas_module_default.canvas
});
//#endregion
//#region src/shell/worker.js
var registerWorker = () => {
	if ("serviceWorker" in navigator && true) navigator.serviceWorker.register("../service-worker.js", { scope: "./" }).catch(() => {});
};
//#endregion
//#region src/shell/start.js
var start = ({ state, actions, view }) => {
	app(state, actions, view, document.getElementById("app"));
	startBackgrounds();
	registerWorker();
};
//#endregion
export { Input as S, check as _, clearStats as a, OpenGames as b, lossesOn as c, StatsList as d, StatsList_module_default as f, boardOf as g, BestTime_module_default as h, Switching as i, readStats as l, hintTabs as m, FireworksCanvas as n, lossActions as o, Tabs as p, celebrate as r, lossState as s, start as t, tally as u, resumable as v, Winner as x, Prompt_module_default as y };
