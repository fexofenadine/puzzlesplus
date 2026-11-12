import { $ as Button, G as startBackgrounds, Q as Dialog, at as save, et as Overlay, g as games, i as About_module_default, it as remove, o as icons, ot as app, rt as load, st as h } from "./HowToPlay-sfgAnlPV.js";
import { b as stopTick, p as clock } from "./Board-xFGCjAaj.js";
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
export { resumable as _, lossActions as a, Winner as b, readStats as c, StatsList_module_default as d, Tabs as f, check as g, boardOf as h, clearStats as i, tally as l, BestTime_module_default as m, FireworksCanvas as n, lossState as o, hintTabs as p, Switching as r, lossesOn as s, start as t, StatsList as u, Prompt_module_default as v, Input as x, OpenGames as y };
