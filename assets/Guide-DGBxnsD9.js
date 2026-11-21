import { A as shellActions, C as DisplayMenu, D as listen, K as Menu_module_default, M as shortcut, X as startBackgrounds, Y as BackgroundSettings, gt as h, ht as app, j as shellState, q as Boss, st as Dialog, t as Taskbar } from "./Taskbar-Dz9Nw-2m.js";
import { t as Guide_module_default } from "./Guide.module-Ih_jRsKN.js";
//#region src/guide/Guide.jsx
var showHash = () => {
	const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
	document.querySelectorAll("[data-current]").forEach((el) => delete el.dataset.current);
	if (!target) return;
	target.dataset.current = "";
	target.scrollIntoView();
};
var Contents = ({ parts }) => /* @__PURE__ */ h("nav", {
	class: Guide_module_default.contents,
	"aria-label": "Contents"
}, parts.map((part) => /* @__PURE__ */ h("div", { class: Guide_module_default.part }, /* @__PURE__ */ h("a", {
	class: Guide_module_default.partLink,
	href: `#${part.sections[0].id}`
}, part.title), /* @__PURE__ */ h("ul", { class: Guide_module_default.list }, part.sections.map((section) => /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("a", {
	class: Guide_module_default.link,
	href: `#${section.id}`
}, section.title)))))));
var Article = ({ parts }) => /* @__PURE__ */ h("article", {
	class: Guide_module_default.article,
	oncreate: () => setTimeout(showHash)
}, parts.map((part) => [/* @__PURE__ */ h("h2", { class: Guide_module_default.partTitle }, part.title), part.sections.map((section) => /* @__PURE__ */ h("section", {
	class: Guide_module_default.section,
	id: section.id
}, /* @__PURE__ */ h("h3", { class: Guide_module_default.title }, section.title), section.body()))]));
var startGuide = ({ page, root = "../../", home = "../", title, icon, parts }) => {
	const state = { ...shellState(page, root) };
	const actions = {
		...shellActions,
		init: () => (state, actions) => {
			window.addEventListener("keydown", actions.press);
			window.addEventListener("hashchange", showHash);
			listen(actions);
		},
		press: (event) => (state, actions) => {
			if (event.keyCode === 27) shortcut(event, state, actions);
		},
		pause: () => null,
		reset: () => null,
		closeGame: () => (state, actions) => actions.finishClose()
	};
	const view = (state, actions) => /* @__PURE__ */ h("main", { oncreate: actions.init }, /* @__PURE__ */ h("div", {
		key: "a",
		class: Guide_module_default.page
	}, /* @__PURE__ */ h(Dialog, {
		hidden: state.windowState !== "open",
		title,
		onClose: () => location.assign(home)
	}, /* @__PURE__ */ h("ul", {
		class: Menu_module_default.root,
		tabindex: -1,
		onfocusout: actions.toggleMenu
	}, /* @__PURE__ */ h(DisplayMenu, {
		state,
		actions
	})), /* @__PURE__ */ h("div", { class: Guide_module_default.body }, /* @__PURE__ */ h(Contents, { parts }), /* @__PURE__ */ h(Article, { parts })))), /* @__PURE__ */ h(Taskbar, {
		key: "h",
		own: {
			title,
			icon
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
var noop = () => null;
var Figure = ({ caption }, children) => /* @__PURE__ */ h("figure", { class: Guide_module_default.figure }, /* @__PURE__ */ h("div", { class: Guide_module_default.board }, children), caption && /* @__PURE__ */ h("figcaption", { class: Guide_module_default.caption }, caption));
var Page = ({ href }, children) => /* @__PURE__ */ h("a", {
	class: Guide_module_default.inline,
	href
}, children);
//#endregion
export { startGuide as i, Page as n, noop as r, Figure as t };
