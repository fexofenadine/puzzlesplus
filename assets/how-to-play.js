import { L as h, c as help_default } from "./actions-Cxdp6jdC.js";
import { n as Rules } from "./HowToPlay-TwUi8QRh.js";
import { t as Rules$1 } from "./HowToPlay-DK4sYpQN.js";
import { n as Rules$2 } from "./HowToPlay-dHnZ5qGE.js";
import { n as Page, r as startGuide } from "./Guide-B-V0ozYZ.js";
//#region src/guide/howToPlay.jsx
var game = (id, title, Rules) => ({
	id,
	title,
	body: () => [/* @__PURE__ */ h(Rules, null), /* @__PURE__ */ h("p", null, /* @__PURE__ */ h(Page, { href: `../${id}/` }, "Play ", title), " ·", " ", /* @__PURE__ */ h(Page, { href: `../${id}/guide/` }, title, " guide"), " with every solving technique")]
});
var parts = [{
	title: "How to Play",
	sections: [
		game("minesweeper", "Minesweeper", Rules),
		game("takuzu", "Takuzu", Rules$1),
		game("nonograms", "Nonograms", Rules$2),
		{
			id: "shortcuts",
			title: "Every game",
			body: () => /* @__PURE__ */ h("p", null, "F2 or N starts a new game, H gives a hint, P pauses, + and - zoom, and Esc hides the game behind a spreadsheet. The taskbar's Start button opens any game and its guide.")
		}
	]
}];
//#endregion
//#region src/guide/pages/howToPlay.js
startGuide({
	page: "how-to-play",
	root: "../",
	home: "../minesweeper/",
	title: "How to Play",
	icon: help_default,
	parts
});
//#endregion
