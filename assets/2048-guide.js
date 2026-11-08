import { o as icons, z as h } from "./HowToPlay-CmhOznvD.js";
import { n as Board, p as tilesOf, t as suggest } from "./search-DMB5Vnx_.js";
import { t as Rules } from "./HowToPlay-DVIqMqV6.js";
import { r as startGuide, t as Figure } from "./Guide-DULIDQFu.js";
import { t as desktopSection } from "./desktop-Dq2SDJM7.js";
//#region src/guide/2048.jsx
var examples = {
	corner: {
		values: [
			128,
			64,
			16,
			4,
			8,
			8,
			4,
			2,
			2,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		dir: "left"
	},
	row: {
		values: [
			512,
			256,
			128,
			64,
			2,
			4,
			16,
			8,
			0,
			2,
			4,
			0,
			0,
			0,
			2,
			0
		],
		dir: "left"
	},
	merge: {
		values: [
			64,
			32,
			16,
			8,
			4,
			8,
			8,
			4,
			2,
			0,
			0,
			2,
			0,
			0,
			0,
			0
		],
		dir: "right"
	}
};
var start = [
	0,
	0,
	0,
	0,
	0,
	2,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	2,
	0
];
var noop = () => null;
var TwentyExample = ({ values, hint }) => {
	const n = Math.sqrt(values.length);
	const caption = hint && suggest(values, n).text;
	return /* @__PURE__ */ h(Figure, { caption }, /* @__PURE__ */ h(Board, {
		n,
		tiles: tilesOf(values, 1).tiles,
		onDown: noop
	}));
};
var Example = ({ id }) => /* @__PURE__ */ h(TwentyExample, {
	values: examples[id].values,
	hint: true
});
var parts = [{
	title: "How to Play",
	sections: [
		{
			id: "rules",
			title: "The rules",
			body: () => [
				/* @__PURE__ */ h(Rules, null),
				/* @__PURE__ */ h("p", null, "A new game starts with two tiles."),
				/* @__PURE__ */ h(TwentyExample, { values: start })
			]
		},
		{
			id: "records",
			title: "Sizes and best scores",
			body: () => [/* @__PURE__ */ h("p", null, "The Size menu has 3 × 3 to 5 × 5. Smaller boards fill up fast and need care from the first move, bigger ones forgive more and run longer. On 3 × 3 the winning tile is 512, since 2048 can't fit."), /* @__PURE__ */ h("p", null, "Each size keeps a best score with the highest tile of that game, one table for games played alone and one for games that used a hint or undo. The name box opens when a game ends, or when you leave it for a new one, with a better score than the table's.")]
		},
		{
			id: "hints",
			title: "Hints and undo",
			body: () => [/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Hint"), " (H, the Game menu or the ? button) looks two moves ahead, over the tiles that might appear, and picks the move that leaves the board in the best shape: free cells, rows and columns that run one way, neighbours close in value and the biggest tile in a corner. It says why under the board. It is advice, not a proof, since the next tile is chance."), /* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Undo"), " (Ctrl+Z or the arrow button) takes back as many moves as you like, even out of a lost game. Either one moves the game's score to the helped table. The clock is off unless you turn on ", /* @__PURE__ */ h("b", null, "Timer"), " in the Game menu.")]
		},
		desktopSection
	]
}, {
	title: "Strategy",
	sections: [
		{
			id: "corner",
			title: "Keep the biggest tile in a corner",
			body: () => [/* @__PURE__ */ h("p", null, "Pick a corner and keep your biggest tile there. Mostly use the two moves that push towards it, a third when you must, and the fourth only when nothing else moves, since that is the one that pulls the big tile out."), /* @__PURE__ */ h(Example, { id: "corner" })]
		},
		{
			id: "row",
			title: "Keep its row full and in order",
			body: () => [/* @__PURE__ */ h("p", null, "Build the corner's row from big to small. While that row is full, sliding along it can't shift the big tile, and tiles coming down from the rest of the board meet the row's small end first."), /* @__PURE__ */ h(Example, { id: "row" })]
		},
		{
			id: "merge",
			title: "Merge towards the corner",
			body: () => [/* @__PURE__ */ h("p", null, "Bring each new tile up to the size of its neighbour in the row, so the row merges down like a chain into the corner. Moves that make several merges at once are worth most, as long as they keep the corner."), /* @__PURE__ */ h(Example, { id: "merge" })]
		},
		{
			id: "stuck",
			title: "When the corner is lost",
			body: () => [/* @__PURE__ */ h("p", null, "Sooner or later only the fourth move is left and the big tile leaves its corner. Don't panic: a small tile usually drops into the gap, so look for the move that slides the big tile straight back, or build the new corner tile up to match it. Undo is there too, if you don't mind the helped table.")]
		}
	]
}];
//#endregion
//#region src/guide/pages/2048.js
startGuide({
	page: "2048-guide",
	title: "2048 Plus Guide",
	icon: icons[2048],
	parts
});
//#endregion
