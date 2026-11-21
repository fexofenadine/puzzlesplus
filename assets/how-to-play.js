import { gt as h, i as help_default } from "./Taskbar-CGVrYhy9.js";
import { t as Rules } from "./HowToPlay-Qg5xIPw8.js";
import { n as Rules$1 } from "./HowToPlay-DH8rYZX6.js";
import { t as Rules$2 } from "./HowToPlay-BJ7spUL7.js";
import { n as Rules$3 } from "./HowToPlay-BWzuPqSo.js";
import { t as Rules$4 } from "./HowToPlay-DV3QG3h1.js";
import { n as Rules$5 } from "./HowToPlay-BZ0KFGmc.js";
import { n as Rules$6 } from "./HowToPlay-B0NWycnY.js";
import { n as Rules$7 } from "./HowToPlay-Cmornr7f.js";
import { i as startGuide, n as Page } from "./Guide-CExn2CLO.js";
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
		game("sudoku", "Sudoku", Rules$4),
		game("futoshiki", "Futoshiki", Rules$6),
		game("nonograms", "Nonograms", Rules$3),
		game("lightup", "Light Up", Rules$5),
		game("bridges", "Bridges", Rules$7),
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
