import { o as icons, z as h } from "./HowToPlay-DAnWEJz0.js";
import { t as Game_module_default } from "./Game.module-CghLtUtO.js";
import { a as neighboursOf, n as findHint, s as Cell, t as explainChord } from "./hint-C3RSrlcq.js";
import { n as Rules } from "./HowToPlay-B1cmtQzV.js";
import { r as startGuide, t as Figure } from "./Guide-nDuKpE8L.js";
import { t as desktopSection } from "./desktop-C3z4NlHd.js";
//#region src/guide/MinesExample.jsx
var fieldOf = (rows) => {
	const width = rows[0].length;
	const height = rows.length;
	const cells = rows.join("");
	const around = neighboursOf(width, height);
	const mined = (c) => c === "*" || c === "F";
	return Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => {
		const i = y * width + x;
		return {
			opened: cells[i] === "o",
			mined: mined(cells[i]),
			flag: cells[i] === "F" || cells[i] === "f",
			mark: false,
			num: around[i].filter((n) => mined(cells[n])).length
		};
	}));
};
var exampleHint = ({ rows, mines, chord }) => {
	const field = fieldOf(rows);
	const width = rows[0].length;
	const height = rows.length;
	if (chord) return explainChord({
		field,
		width,
		height
	}, chord[0], chord[1]);
	const flags = field.flat().filter((c) => c.flag).length;
	return findHint({
		field,
		width,
		height,
		minesLeft: mines - flags
	});
};
var noop = () => null;
var MinesExample = ({ rows, mines, chord }) => {
	const field = fieldOf(rows);
	const hint = exampleHint({
		rows,
		mines,
		chord
	});
	const width = rows[0].length;
	return /* @__PURE__ */ h(Figure, { caption: hint && hint.text }, /* @__PURE__ */ h("div", { class: Game_module_default.field }, field.map((row, y) => /* @__PURE__ */ h("div", { class: Game_module_default.inactive }, row.map((cell, x) => /* @__PURE__ */ h(Cell, {
		x,
		y,
		pressed: false,
		pressedX: -1,
		pressedY: -1,
		group: false,
		opened: cell.opened,
		mined: cell.mined,
		flag: cell.flag,
		mark: false,
		num: cell.num,
		hint: hint && hint.marks[y * width + x],
		lose: false,
		onDown: noop,
		onMove: noop,
		onTouch: noop,
		onChord: noop
	}))))));
};
//#endregion
//#region src/guide/minesweeper.jsx
var examples = {
	"safe-cells": {
		rows: [
			".**..*.",
			"oo.....",
			"oFFF...",
			"ooooo*.",
			"ooooo.."
		],
		mines: 7
	},
	"all-mines": {
		rows: [
			"*oooooo",
			".oooooo",
			".oFoooo",
			"*.*.*oo",
			"..*..oo"
		],
		mines: 6
	},
	chording: {
		rows: [
			".**..*.",
			"oo.....",
			"oFFF...",
			"ooooo*.",
			"ooooo.."
		],
		mines: 7,
		chord: [0, 1]
	},
	"shared-cells": {
		rows: [
			"*...ooo",
			"...*ooo",
			"...oFoo",
			".....*.",
			".**.*.."
		],
		mines: 7
	},
	"mine-counter": {
		rows: [
			".Foo",
			"FFoo",
			"oooo"
		],
		mines: 3
	},
	"wrong-flags": {
		rows: [
			"...fooo",
			".*.Fooo",
			"**.oooo",
			"..*Fooo",
			".*..ooo"
		],
		mines: 7
	},
	guessing: {
		rows: [
			"oo*..*.",
			"oo.....",
			"*......",
			"*..*.**",
			"......*"
		],
		mines: 8
	}
};
var Example = ({ topic }) => /* @__PURE__ */ h(MinesExample, examples[topic]);
var parts = [
	{
		title: "How to Play",
		sections: [
			{
				id: "rules",
				title: "The rules",
				body: () => /* @__PURE__ */ h(Rules, null)
			},
			{
				id: "levels",
				title: "Levels and options",
				body: () => [/* @__PURE__ */ h("ul", null, /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Beginner"), " is 9 × 9 with 10 mines, ", /* @__PURE__ */ h("b", null, "Intermediate"), " 16 × 16 with 40 and", " ", /* @__PURE__ */ h("b", null, "Expert"), " 30 × 16 with 99."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Extreme"), " is 39 × 21 with 169 mines, Expert grown by 30% each way at the same density."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Custom"), " takes any size up to 40 × 30.")), /* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Safe First Click"), " (on by default) places the mines only once your first click opens a cell, never under it. Flagging or chording first does not start the game.", " ", /* @__PURE__ */ h("b", null, "No Guessing"), " goes further: the first click opens an empty area, and every board is checked by a solver so that logic alone can clear it. ", /* @__PURE__ */ h("b", null, "Marks"), " lets a right click cycle on to a question mark, a note for cells you are unsure of.")]
			},
			{
				id: "hints",
				title: "Hints and best times",
				body: () => [/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Hint"), " (H, the Game menu, or the ? button beside the face on every theme but Classic) finds a move that follows for certain and explains it under the board. Blue outlines the numbers it reasons from, green marks safe cells, red marks mines and amber marks flags that can't be right. It only uses the numbers you can see and your flags, never the hidden mines, so a wrong flag can mislead it. The More button opens the part of this guide about that kind of step."), /* @__PURE__ */ h("p", null, "Every level keeps a best time, in two tabs: games played without hints and games where a hint was used.")]
			},
			desktopSection
		]
	},
	{
		title: "Beginner techniques",
		sections: [
			{
				id: "first-click",
				title: "Opening moves",
				body: () => [/* @__PURE__ */ h("p", null, "The first click is always safe. With No Guessing it also opens an empty area, so the board starts with numbers to work from. Without it a first click may open a single number, and the next click is a guess: cells away from that number are no more likely to hide a mine than average, while its neighbours may be much more."), /* @__PURE__ */ h("p", null, "Each number counts the mines among the eight cells around it, including diagonals. Everything else in this guide follows from reading those counts against the hidden cells and flags around them.")]
			},
			{
				id: "safe-cells",
				title: "A number with all its flags",
				body: () => [/* @__PURE__ */ h("p", null, "Once a number has as many flags around it as it shows, its mines are all found, so every other hidden cell around it is safe to open."), /* @__PURE__ */ h(Example, { topic: "safe-cells" })]
			},
			{
				id: "all-mines",
				title: "A number with only mines left",
				body: () => [/* @__PURE__ */ h("p", null, "The other way round: when a number still needs as many mines as it has hidden neighbours, every one of them is a mine. Flag them, and the numbers beside them often become the first case."), /* @__PURE__ */ h(Example, { topic: "all-mines" })]
			},
			{
				id: "chording",
				title: "Chording",
				body: () => [/* @__PURE__ */ h("p", null, "Double-click a number, click it with both buttons or Shift click it (tap it on a touch screen) to open all its unflagged neighbours at once. It only works when the number has exactly as many flags around it as it shows. When it doesn't, the game explains why: extra flags are outlined in amber, and the cells where missing flags belong in dashed violet."), /* @__PURE__ */ h(Example, { topic: "chording" })]
			}
		]
	},
	{
		title: "Advanced techniques",
		sections: [
			{
				id: "shared-cells",
				title: "Shared cells",
				body: () => [/* @__PURE__ */ h("p", null, "When every hidden cell next to one number is also next to another, the first number's mines are among the second's. If both need the same number of mines, the second number's other hidden cells are safe. If the second needs more, and has exactly that many more hidden cells, those are all mines."), /* @__PURE__ */ h(Example, { topic: "shared-cells" })]
			},
			{
				id: "patterns",
				title: "Patterns along a wall",
				body: () => [
					/* @__PURE__ */ h("p", null, "Players learn a few shapes by heart, and each one is shared cells used along a straight edge of opened cells:"),
					/* @__PURE__ */ h("ul", null, /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "1 2 1"), " along a wall: the mines are under both 1s, and the cell under the 2 is safe."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "1 2 2 1"), ": the mines are under the two 2s, and the cells under the 1s are safe."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "1 1"), " starting at a corner or a cleared edge: the cell beyond the second 1 is safe.")),
					/* @__PURE__ */ h("p", null, "Hint finds these the long way, one pair of numbers at a time, so its explanation names the two numbers that make each step.")
				]
			},
			{
				id: "mine-counter",
				title: "The mine counter",
				body: () => [/* @__PURE__ */ h("p", null, "Near the end, the counter of mines left to flag can settle what the numbers can't. At 0 every hidden cell without a flag is safe. When it equals the number of hidden cells left without a flag, they are all mines. It only counts your flags, so it is only right when they are."), /* @__PURE__ */ h(Example, { topic: "mine-counter" })]
			},
			{
				id: "wrong-flags",
				title: "Flags that can’t be right",
				body: () => [/* @__PURE__ */ h("p", null, "A number with more flags around it than it shows means at least one of those flags is wrong. Hint looks for this first, since every step after a wrong flag can be wrong too."), /* @__PURE__ */ h(Example, { topic: "wrong-flags" })]
			},
			{
				id: "guessing",
				title: "When only a guess is left",
				body: () => [/* @__PURE__ */ h("p", null, "Some boards reach a point where nothing follows for certain. Make the guess that tells you the most: a cell whose number would open up the most of the board, or one far from the numbers when they make their own neighbours likely mines. Corners are no safer, but a guess there often opens an area. No Guessing deals boards that never need this."), /* @__PURE__ */ h(Example, { topic: "guessing" })]
			}
		]
	}
];
//#endregion
//#region src/guide/pages/minesweeper.js
startGuide({
	page: "minesweeper-guide",
	title: "Minesweeper Plus Guide",
	icon: icons.minesweeper,
	parts
});
//#endregion
