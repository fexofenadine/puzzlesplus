import { lt as h, s as help_default } from "./HowToPlay-CPLbgow-.js";
import { t as Rules } from "./HowToPlay-Bw_fqDl0.js";
import { n as Rules$1 } from "./HowToPlay-CJgLMHvH.js";
import { t as Rules$2 } from "./HowToPlay-CKqwc3Ms.js";
import { n as Rules$3 } from "./HowToPlay-CItEMxTP.js";
import { t as Rules$4 } from "./HowToPlay-DXjYIKF8.js";
import { n as Page, r as startGuide } from "./Guide-CN8w7mdl.js";
//#region src/guide/howToPlay.jsx
var game = (id, title, Rules) => ({
	id,
	title,
	body: () => [/* @__PURE__ */ h(Rules, null), /* @__PURE__ */ h("p", null, /* @__PURE__ */ h(Page, { href: `../${id}/` }, "Play ", title), " ·", " ", /* @__PURE__ */ h(Page, { href: `../${id}/guide/` }, title, " guide"), " with every solving technique")]
});
var parts = [{
	title: "How to Play",
	sections: [
		game("minesweeper", "Minesweeper", Rules$1),
		game("takuzu", "Takuzu", Rules$2),
		game("nonograms", "Nonograms", Rules$3),
		game("sudoku", "Sudoku", Rules$4),
		game("2048", "2048", Rules),
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
