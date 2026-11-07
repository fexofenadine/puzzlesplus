import { A as load, F as Overlay, L as h, M as save, N as Dialog, P as Button, d as icons, j as remove, l as About_module_default, m as games } from "./HowToPlay-jSr8LPG_.js";
import { f as clock } from "./Board-u56121_g.js";
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
//#endregion
//#region src/shell/resume.js
var resumable = ({ key, running, pack, unpack }) => {
	let last = null;
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
		const elapsed = Math.max(0, (game.paused ? game.pausedAt : clock()) - game.start);
		save(key, `{"version":1,"elapsed":${Math.floor(elapsed)},"game":${parts}}`);
	};
	const restore = () => {
		try {
			const saved = JSON.parse(load(key));
			if (!saved || saved.version !== 1 || !(saved.elapsed >= 0)) return null;
			const now = clock();
			return {
				...unpack(saved.game),
				start: now - saved.elapsed,
				time: Math.floor(saved.elapsed / 1e3) + 1,
				raf: null,
				paused: true,
				pausedAt: now
			};
		} catch {
			return null;
		}
	};
	return {
		keep,
		restore,
		actions: { keepGame: () => ({ game }) => {
			keep(game, true);
		} }
	};
};
var check = (ok) => {
	if (!ok) throw new Error("saved game does not fit");
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
//#endregion
//#region src/shell/worker.js
var registerWorker = () => {
	if ("serviceWorker" in navigator && true) navigator.serviceWorker.register("../service-worker.js", { scope: "./" }).catch(() => {});
};
//#endregion
export { resumable as a, Input as c, check as i, Tabs as n, OpenGames as o, BestTime_module_default as r, Winner as s, registerWorker as t };
