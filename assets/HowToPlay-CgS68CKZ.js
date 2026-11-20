import { ct as Button, gt as h, lt as Overlay, st as Dialog } from "./Taskbar-CoMVUW-1.js";
var About_module_default = {
	root: "About_root",
	wide: "About_wide About_root",
	name: "About_name",
	link: "About_link",
	footer: "About_footer",
	button: "About_button",
	author: "About_author",
	credits: "About_credits"
};
//#endregion
//#region src/shell/About.jsx
var Link = ({ href }, children) => /* @__PURE__ */ h("a", {
	class: About_module_default.link,
	href,
	target: "_blank",
	rel: "noopener noreferrer"
}, children);
var About = ({ key, name, actions, credits }, children) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.toggleAbout()
}, /* @__PURE__ */ h(Dialog, {
	title: `About ${name}`,
	onClose: actions.toggleAbout
}, /* @__PURE__ */ h("div", { class: About_module_default.root }, /* @__PURE__ */ h("p", { class: About_module_default.name }, "Puzzles Plus: ", name), /* @__PURE__ */ h("p", { class: About_module_default.author }, "by fexofenadine"), children, /* @__PURE__ */ h("p", null, "Puzzles Plus began as a fork of", " ", /* @__PURE__ */ h(Link, { href: "https://github.com/frenzzy/minesweeper" }, "Minesweeper"), " by Vladimir Kutepov and has grown far beyond it: seven games, hints that explain their reasoning, guides, themes and animated backgrounds, with little of the original left outside the Classic Minesweeper board. Released under the MIT licence."), /* @__PURE__ */ h("p", null, /* @__PURE__ */ h(Link, { href: "https://github.com/fexofenadine/puzzlesplus" }, "github.com/fexofenadine/puzzlesplus")), /* @__PURE__ */ h("details", { class: About_module_default.credits }, /* @__PURE__ */ h("summary", null, "Credits"), /* @__PURE__ */ h("ul", null, credits, /* @__PURE__ */ h("li", null, "The window, Classic theme and Minesweeper board come from", " ", /* @__PURE__ */ h(Link, { href: "https://github.com/frenzzy/minesweeper" }, "Minesweeper"), " by Vladimir Kutepov (MIT licence)."), /* @__PURE__ */ h("li", null, "Backgrounds are canvas ports of GLMatrix, Substrate, Truchet, Phosphor and HexTrail from xscreensaver, under the xscreensaver licence, Qix written after xscreensaver's, the Neon Triangulator shader by mrange (CC0) and the 2D Clouds shader by drift (free to use), both as xscreensaver ships them."), /* @__PURE__ */ h("li", null, "Fonts are under the SIL Open Font License and LGPL 2.1."), /* @__PURE__ */ h("li", null, "Photos are from Unsplash, and CC0 photos from Wikimedia Commons."), /* @__PURE__ */ h("li", null, "Colour schemes: SynthWave '84, Solarized, Nord and Terafox."), /* @__PURE__ */ h("li", null, "Full credits and licences are in the README."))), /* @__PURE__ */ h("div", { class: About_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.toggleAbout,
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: About_module_default.button }, "OK"))))));
//#endregion
//#region src/shell/HowToPlay.jsx
var HowToPlay = ({ key, name, actions }, children) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.toggleHowTo()
}, /* @__PURE__ */ h(Dialog, {
	title: `How to Play ${name}`,
	onClose: actions.toggleHowTo
}, /* @__PURE__ */ h("div", { class: About_module_default.wide }, children, /* @__PURE__ */ h("p", null, "The ", /* @__PURE__ */ h(Link, { href: "guide/" }, name, " guide"), " explains every solving technique with examples."), /* @__PURE__ */ h("p", null, "Every game: F2 or N starts a new game, H gives a hint, P pauses, + and - zoom, and Esc hides the game behind a spreadsheet. A game in progress comes back paused after a reload, and Game → Timer turns the clock off (no best times then)."), /* @__PURE__ */ h("div", { class: About_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.toggleHowTo,
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: About_module_default.button }, "OK"))))));
//#endregion
export { About_module_default as i, About as n, Link as r, HowToPlay as t };
