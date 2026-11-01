import { L as h, s as icons } from "./actions-CNd4PGRw.js";
import { c as pairs, d as twins, f as whatIf, i as gaps, n as balance, r as counts, s as oneLeft, t as Cell, u as repeats, x as Game_module_default } from "./Cell-C9r-4nTU.js";
import { t as Rules } from "./HowToPlay-loH2Xc0U.js";
import { r as startGuide, t as Figure } from "./Guide-CRT0e_EO.js";
import { t as desktopSection } from "./desktop-CCPfAWSB.js";
//#region src/guide/TakuzuExample.jsx
var finders = {
	pair: pairs,
	gap: gaps,
	count: counts,
	"one-left": oneLeft,
	twins,
	balance,
	repeat: repeats,
	"what-if": whatIf
};
var boardOf = (rows) => Int8Array.from(rows.join(""), (c) => c === "." ? -1 : Number(c));
var exampleStep = (rows, technique) => finders[technique](boardOf(rows), rows.length).find((step) => step.technique === technique);
var marksOf = (step) => step ? Object.fromEntries([...step.sources.map((i) => [i, "source"]), ...step.place.map(([i, v]) => [i, v ? "one" : "zero"])]) : {};
var noop = () => null;
var TakuzuExample = ({ rows, technique }) => {
	const board = boardOf(rows);
	const step = technique && exampleStep(rows, technique);
	const marks = marksOf(step);
	return /* @__PURE__ */ h(Figure, { caption: step && step.text }, /* @__PURE__ */ h("div", {
		class: Game_module_default.inactive,
		style: { "--n": rows.length }
	}, [...board].map((value, i) => /* @__PURE__ */ h(Cell, {
		i,
		value,
		given: false,
		mark: marks[i],
		onPress: noop
	}))));
};
//#endregion
//#region src/guide/takuzu.jsx
var examples = {
	pair: [
		"0.11.1",
		"1...0.",
		".0...1",
		"..0..1",
		".1....",
		"11.0.0"
	],
	gap: [
		"0.11.1",
		"1...0.",
		".0...1",
		"..0..1",
		".1....",
		"11.0.0"
	],
	count: [
		"...1..",
		"1101..",
		"0..0..",
		"10.101",
		"01.0..",
		"110..."
	],
	"one-left": [
		"001...",
		"110100",
		"001...",
		"10...1",
		"01....",
		"110..."
	],
	twins: [
		"001..1",
		"110100",
		"001011",
		"10..01",
		"01...0",
		"110..0"
	],
	balance: [
		"1.01010.",
		"..1...1.",
		".....0..",
		"0....1.0",
		"..0..011",
		"..101001",
		"10110100",
		"..0...1."
	],
	repeat: [
		"110010",
		"001011",
		"...101",
		"...010",
		"0..101",
		"101100"
	],
	"what-if": [
		".0..1...",
		"10..0...",
		"01101100",
		"010.....",
		"10010011",
		"0.10.1..",
		"...1..0.",
		"...0...."
	]
};
var solved = [
	"001011",
	"101100",
	"010011",
	"001101",
	"110100",
	"110010"
];
var Example = ({ technique }) => /* @__PURE__ */ h(TakuzuExample, {
	rows: examples[technique],
	technique
});
var parts = [
	{
		title: "How to Play",
		sections: [
			{
				id: "rules",
				title: "The rules",
				body: () => [
					/* @__PURE__ */ h(Rules, null),
					/* @__PURE__ */ h("p", null, "A finished 6 × 6 board: no three alike in a row, three of each per line, no repeats."),
					/* @__PURE__ */ h(TakuzuExample, { rows: solved })
				]
			},
			{
				id: "levels",
				title: "Levels and sizes",
				body: () => [
					/* @__PURE__ */ h("p", null, "Boards are made fresh for each game: a random full grid, then clues taken away for as long as the chosen level can still finish it. Every board has exactly one solution, and a board is only dealt at a level if it really needs that level's reasoning, the way puzzle collections such as Simon Tatham's Unruly grade them."),
					/* @__PURE__ */ h("ul", null, /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Easy"), ": pairs and gaps. ", /* @__PURE__ */ h("b", null, "Medium"), " adds full counts."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Tricky"), " adds one left and twins. ", /* @__PURE__ */ h("b", null, "Hard"), " adds balance and repeats."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Expert"), " adds a short what-if.")),
					/* @__PURE__ */ h("p", null, "The Size menu has 6 × 6 to 14 × 14. 6 × 6 has no Expert. Big Expert boards are dealt in the background, so the window never stalls.")
				]
			},
			{
				id: "mistakes",
				title: "Hints, errors and mistakes",
				body: () => [
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Hint"), " (H, the Game menu or the ? button) points out a broken rule first, then a cell that can't fit the only solution, and otherwise the easiest next step. The cells it reasons from are outlined in blue, the cell it fills in green, and the reason shows under the board with a More button that opens its section here."),
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Show Errors"), " (Game menu, off by default) stripes cells that break a rule as you go. When every cell is filled but the board isn't solved, the game asks whether you want a hint, or lets you find the mistake yourself. ", /* @__PURE__ */ h("b", null, "Undo"), " (Ctrl+Z or the arrow button) takes back one change at a time."),
					/* @__PURE__ */ h("p", null, "Each size and level keeps a best time, with and without hints. On Matrix,", " ", /* @__PURE__ */ h("b", null, "Rain Glyphs"), " in the Theme menu draws the two values as glyphs from the code rain.")
				]
			},
			desktopSection
		]
	},
	{
		title: "Beginner techniques",
		sections: [
			{
				id: "pair",
				title: "Pairs",
				body: () => [/* @__PURE__ */ h("p", null, "Two of the same digit side by side can't have a third beside them, so the cells at both ends of a pair take the other digit. Look along every row and column for pairs first; they are the most common step."), /* @__PURE__ */ h(Example, { technique: "pair" })]
			},
			{
				id: "gap",
				title: "Gaps",
				body: () => [/* @__PURE__ */ h("p", null, "A single empty cell between two of the same digit would make three in a row, so it takes the other digit."), /* @__PURE__ */ h(Example, { technique: "gap" })]
			},
			{
				id: "count",
				title: "Full counts",
				body: () => [/* @__PURE__ */ h("p", null, "Every line holds as many 0s as 1s, half its length each. Once a line has all of one digit, the rest of it is the other."), /* @__PURE__ */ h(Example, { technique: "count" })]
			}
		]
	},
	{
		title: "Advanced techniques",
		sections: [
			{
				id: "one-left",
				title: "One left",
				body: () => [/* @__PURE__ */ h("p", null, "When a line needs just one more of a digit, every other empty cell gets the other one. Try the last digit in each empty cell: wherever that would leave three alike in a row, it can't go, so that cell takes the other digit."), /* @__PURE__ */ h(Example, { technique: "one-left" })]
			},
			{
				id: "twins",
				title: "Twins",
				body: () => [/* @__PURE__ */ h("p", null, "No two rows, and no two columns, may be the same. A line two cells short of matching a full one has to finish the other way round from it."), /* @__PURE__ */ h(Example, { technique: "twins" })]
			},
			{
				id: "balance",
				title: "Balance",
				body: () => [/* @__PURE__ */ h("p", null, "Count how many of each digit a line still needs, then think through the ways to fit them in without three alike. Where every way agrees on a cell, that cell is settled. It helps most in lines with a few cells left and a known digit in the middle."), /* @__PURE__ */ h(Example, { technique: "balance" })]
			},
			{
				id: "repeat",
				title: "Repeats",
				body: () => [/* @__PURE__ */ h("p", null, "Balance again, but leaving out any way to finish that would copy a full line. When that rules out all but one way, or all ways but those that agree on a cell, the cell is settled."), /* @__PURE__ */ h(Example, { technique: "repeat" })]
			},
			{
				id: "what-if",
				title: "What-if",
				body: () => [/* @__PURE__ */ h("p", null, "Expert boards sometimes stop every line rule. Then pick a cell, suppose one digit and follow the simpler rules from it. If they soon break a rule, the cell must be the other digit. Lines with few empty cells left make the best places to try, since they run out of room quickly."), /* @__PURE__ */ h(Example, { technique: "what-if" })]
			}
		]
	}
];
//#endregion
//#region src/guide/pages/takuzu.js
startGuide({
	page: "takuzu-guide",
	title: "Takuzu Plus Guide",
	icon: icons.takuzu,
	parts
});
//#endregion
