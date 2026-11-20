import { A as shellActions, C as DisplayMenu, D as listen, E as isGame, K as Menu_module_default, M as shortcut, X as startBackgrounds, Y as BackgroundSettings, ft as load, gt as h, h as games, ht as app, j as shellState, n as icons, q as Boss, r as home_default, st as Dialog, t as Taskbar } from "./Taskbar-CoMVUW-1.js";
import { t as Guide_module_default } from "./Guide.module-Ih_jRsKN.js";
var Home_module_default = {
	body: "Home_body",
	panel: "Home_panel",
	heading: "Home_heading",
	lead: "Home_lead",
	cards: "Home_cards",
	card: "Home_card",
	play: "Home_play",
	name: "Home_name",
	text: "Home_text",
	links: "Home_links",
	"continue": "Home_continue",
	footer: "Home_footer"
};
//#endregion
//#region src/home/home.jsx
var about = {
	minesweeper: "Clear the board without touching a mine. Hints explain themselves, and No Guessing boards never need a guess.",
	takuzu: "Fill the grid with zeros and ones: never three alike in a row, equal counts, no repeated line.",
	nonograms: "Fill in a hidden picture from the number clues beside every row and column.",
	sudoku: "Every row, column and box holds each digit once, on 4x4, 6x6 and 9x9 boards, or as a Jigsaw.",
	2048: "Slide the tiles and merge equal ones to make 2048, and go on from there.",
	lightup: "Place bulbs to light every square, never two bulbs lighting each other.",
	futoshiki: "A Latin square with greater and less than signs between some of its cells."
};
var Card = ({ id, title }) => /* @__PURE__ */ h("li", { class: Home_module_default.card }, /* @__PURE__ */ h("a", {
	class: Home_module_default.play,
	href: `${id}/`
}, /* @__PURE__ */ h("img", {
	src: icons[id],
	alt: "",
	width: "32",
	height: "32"
}), /* @__PURE__ */ h("span", { class: Home_module_default.name }, title), /* @__PURE__ */ h("span", { class: Home_module_default.text }, about[id])), /* @__PURE__ */ h("div", { class: Home_module_default.links }, /* @__PURE__ */ h("a", { href: `${id}/guide/` }, title, " guide")));
var startHome = () => {
	const saved = load("lastGame");
	const last = isGame(saved) ? saved : null;
	const state = {
		...shellState("home", "./"),
		last
	};
	const actions = {
		...shellActions,
		init: () => (state, actions) => {
			window.addEventListener("keydown", actions.press);
			listen(actions);
		},
		press: (event) => (state, actions) => {
			if (event.keyCode === 27) shortcut(event, state, actions);
		},
		pause: () => null,
		reset: () => null,
		closeGame: () => (state, actions) => actions.finishClose()
	};
	const title = "Puzzles Plus";
	const view = (state, actions) => /* @__PURE__ */ h("main", { oncreate: actions.init }, /* @__PURE__ */ h("div", {
		key: "a",
		class: Guide_module_default.page
	}, /* @__PURE__ */ h(Dialog, {
		hidden: state.windowState !== "open",
		title
	}, /* @__PURE__ */ h("ul", {
		class: Menu_module_default.root,
		tabindex: -1,
		onfocusout: actions.toggleMenu
	}, /* @__PURE__ */ h(DisplayMenu, {
		state,
		actions
	})), /* @__PURE__ */ h("div", { class: Home_module_default.body }, /* @__PURE__ */ h("div", { class: Home_module_default.panel }, /* @__PURE__ */ h("h2", { class: Home_module_default.heading }, "Choose a game"), /* @__PURE__ */ h("p", { class: Home_module_default.lead }, "Seven puzzles with hints that explain their reasoning, in eight themes."), state.last && /* @__PURE__ */ h("ul", {
		class: `${Home_module_default.cards} ${Home_module_default.continue}`,
		"aria-label": "Continue"
	}, /* @__PURE__ */ h("li", { class: Home_module_default.card }, /* @__PURE__ */ h("a", {
		class: Home_module_default.play,
		href: `${state.last}/`
	}, /* @__PURE__ */ h("img", {
		src: icons[state.last],
		alt: "",
		width: "32",
		height: "32"
	}), /* @__PURE__ */ h("span", { class: Home_module_default.name }, "Continue ", games.find(([id]) => id === state.last)[1]), /* @__PURE__ */ h("span", { class: Home_module_default.text }, "Pick up where you left off.")))), /* @__PURE__ */ h("ul", { class: Home_module_default.cards }, games.map(([id, name]) => /* @__PURE__ */ h(Card, {
		id,
		title: name
	}))), /* @__PURE__ */ h("p", { class: Home_module_default.footer }, /* @__PURE__ */ h("a", { href: "how-to-play/" }, "How to play every game")))))), /* @__PURE__ */ h(Taskbar, {
		key: "h",
		own: {
			title,
			icon: home_default
		},
		state,
		actions
	}), state.backgroundSettings && /* @__PURE__ */ h(BackgroundSettings, {
		key: "e",
		state: state.backgroundSettings,
		actions
	}), state.boss && /* @__PURE__ */ h(Boss, {
		key: "g",
		state: state.boss,
		actions
	}));
	app(state, actions, view, document.getElementById("app"));
	startBackgrounds();
};
//#endregion
//#region src/home/index.js
startHome();
//#endregion
