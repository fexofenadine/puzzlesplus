import { F as Dialog, I as Button, L as Overlay, z as h } from "./HowToPlay-25rzq32L.js";
import { l as Prompt_module_default } from "./worker-BFJEAaTb.js";
//#region src/shell/Prompt.jsx
var Prompt = ({ key, title, text, actions }) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.answerPrompt(false)
}, /* @__PURE__ */ h(Dialog, {
	title,
	onClose: () => actions.answerPrompt(false)
}, /* @__PURE__ */ h("div", { class: Prompt_module_default.root }, /* @__PURE__ */ h("p", { class: Prompt_module_default.text }, text), /* @__PURE__ */ h("div", { class: Prompt_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => actions.answerPrompt(true)
}, /* @__PURE__ */ h("span", { class: Prompt_module_default.button }, "Yes")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => actions.answerPrompt(false),
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: Prompt_module_default.button }, "No"))))));
var BestTimes_module_default = {
	table: "BestTimes_table",
	level: "BestTimes_level",
	size: "BestTimes_size",
	slot: "BestTimes_slot",
	time: "BestTimes_time",
	name: "BestTimes_name"
};
//#endregion
export { Prompt as n, BestTimes_module_default as t };
