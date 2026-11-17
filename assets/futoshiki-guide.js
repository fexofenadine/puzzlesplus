import { _t as h, o as icons } from "./HowToPlay-BzzntM0_.js";
import { s as Cell } from "./Game-BCd8x0O5.js";
import { T as Futoshiki_module_default, f as nextSteps, i as place, n as Signs, o as tracks, r as noteColumns, u as apply, v as candidatesOf } from "./Game-By7dnxPU.js";
import { n as Rules } from "./HowToPlay-GQrC75Lf.js";
import { r as startGuide, t as Figure } from "./Guide-Do5-ejb9.js";
import { t as desktopSection } from "./desktop-Cis-yCON.js";
//#region src/guide/FutoshikiExample.jsx
var puzzleOf = ({ rows, right, down }) => {
	const n = rows.length;
	const signs = (lines, less, more) => Int8Array.from(lines.join(""), (c) => c === less ? 1 : c === more ? 2 : 0);
	return {
		n,
		givens: Int8Array.from(rows.join(""), (c) => c === "." ? 0 : Number(c)),
		right: signs(right, "<", ">"),
		down: signs(down, "^", "v")
	};
};
var exampleStep = (example, technique) => {
	const puzzle = puzzleOf(example);
	const board = puzzle.givens.slice();
	const cands = candidatesOf(board, puzzle.n);
	for (let round = 0; round < 200; round++) {
		const { steps } = nextSteps(puzzle, board, cands);
		if (!steps.length) return null;
		const found = steps.find((step) => step.technique === technique);
		if (found) return {
			step: found,
			cands
		};
		if (steps.some((step) => step.place.length)) return null;
		if (!apply(puzzle, board, cands, steps)) return null;
	}
	return null;
};
var noop = () => null;
var FutoshikiExample = ({ example, technique }) => {
	const puzzle = puzzleOf(example);
	const { n, givens } = puzzle;
	const found = technique && exampleStep(example, technique);
	const step = found && found.step;
	const marks = step ? Object.fromEntries([
		...step.sources.map((i) => [i, "source"]),
		...step.remove.map(([i]) => [i, "remove"]),
		...step.place.map(([i]) => [i, "place"])
	]) : {};
	const ghosts = step ? Object.fromEntries(step.place) : {};
	return /* @__PURE__ */ h(Figure, { caption: step && step.text }, /* @__PURE__ */ h("div", {
		class: Futoshiki_module_default.inactive,
		style: {
			"--tracks": tracks(n),
			"--size": "32px",
			"--gap": "15px"
		}
	}, [...givens].map((digit, i) => /* @__PURE__ */ h(Cell, {
		i,
		digit,
		given: digit !== 0,
		notes: found && marks[i] && !ghosts[i] ? found.cands[i] : 0,
		n,
		cols: noteColumns(n),
		focus: 0,
		mark: marks[i],
		ghost: ghosts[i],
		style: {
			gridColumn: place(i % n),
			gridRow: place(Math.floor(i / n))
		},
		onPress: noop
	})), /* @__PURE__ */ h(Signs, {
		n,
		right: puzzle.right,
		down: puzzle.down
	})));
};
//#endregion
//#region src/guide/futoshiki.jsx
var blank = [
	"     ",
	"     ",
	"     ",
	"     ",
	"     "
];
var first = {
	right: [" < > ", ...blank.slice(1)],
	down: [
		"v    ",
		"v   ^",
		...blank.slice(2)
	]
};
var examples = {
	"naked-single": {
		rows: [
			"....4",
			".3...",
			".....",
			"..4..",
			"....."
		],
		...first
	},
	"hidden-single": {
		rows: [
			"3..54",
			".3...",
			".....",
			"..4..",
			"....."
		],
		...first
	},
	beside: {
		rows: [
			"....4",
			".3...",
			".....",
			"..4..",
			"....."
		],
		...first
	},
	ends: {
		rows: [
			"...54",
			".3...",
			".....",
			"..4..",
			"....."
		],
		...first
	},
	limits: {
		rows: [
			"31254",
			"23541",
			"1....",
			"...1.",
			"..1.."
		],
		right: [" < > ", ...blank.slice(1)],
		down: [
			"v    ",
			"v   ^",
			"  ^  ",
			"     ",
			"     "
		]
	},
	"naked-pair": {
		rows: [
			".....",
			"...3.",
			"3....",
			"4.51.",
			"....."
		],
		right: [
			"     ",
			"     ",
			" <   ",
			"     ",
			"     "
		],
		down: [
			"   v ",
			"     ",
			"^    ",
			"vv   ",
			"     "
		]
	},
	"hidden-pair": {
		rows: [
			"43..5",
			"..4.3",
			"....1",
			"....2",
			"3...4"
		],
		right: [
			"     ",
			" <   ",
			"     ",
			"     ",
			" <   "
		],
		down: [
			"   ^ ",
			"     ",
			"   ^ ",
			"     ",
			"     "
		]
	},
	"what-if": {
		rows: [
			"52341",
			"4...5",
			".54.2",
			".4.53",
			"..5.4"
		],
		right: [
			"     ",
			"  <  ",
			"     ",
			" >   ",
			"     "
		],
		down: [
			"   v ",
			"     ",
			"     ",
			"^    ",
			"     "
		]
	}
};
var solved = {
	rows: [
		"31254",
		"23541",
		"14325",
		"52413",
		"45132"
	],
	right: [" < > ", ...blank.slice(1)],
	down: [
		"v    ",
		"v   ^",
		"  ^  ",
		"     ",
		"     "
	]
};
var Example = ({ technique }) => /* @__PURE__ */ h(FutoshikiExample, {
	example: examples[technique],
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
					/* @__PURE__ */ h("p", null, "A finished 5 × 5 board: 1 to 5 once in every row and column, and every sign true."),
					/* @__PURE__ */ h(FutoshikiExample, { example: solved })
				]
			},
			{
				id: "levels",
				title: "Levels and sizes",
				body: () => [
					/* @__PURE__ */ h("p", null, "Boards are made fresh for each game: a random full grid with every sign, then digits and signs taken away for as long as the chosen level can still finish it. Every board has exactly one solution, and a board is only dealt at a level if it really needs that level's reasoning."),
					/* @__PURE__ */ h("ul", null, /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Easy"), ": singles, signs beside a placed digit, and the ends of chains of signs."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Medium"), " adds limits between two empty cells."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Hard"), " adds naked and hidden pairs. ", /* @__PURE__ */ h("b", null, "Expert"), " adds a short what-if.")),
					/* @__PURE__ */ h("p", null, "The Size menu has 4 × 4 to 7 × 7. A 4 × 4 board that needs pairs is too rare to deal, so it has no Hard.")
				]
			},
			{
				id: "mistakes",
				title: "Notes, hints and mistakes",
				body: () => [
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Notes"), " are small candidate digits. Turn Notes on at the pad (or press Space), hold Shift while typing, or right click a cell with a digit picked. ", /* @__PURE__ */ h("b", null, "Auto Notes"), " fills in what each cell's row and column allow, and ", /* @__PURE__ */ h("b", null, "Tidy Notes"), " takes a digit out of the notes in its row and column as you place it. The signs are yours to apply: the techniques below are how they trim the notes."),
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Hint"), " (H, the Game menu or the ? button) points out a broken rule first, then a digit that can't fit the only solution, and otherwise the next digit. When that digit only shows once candidates have been taken away, the hint explains the removal that opened it up and then the digit. The cells it reasons from are outlined in blue, the digit it places in green, and the More button opens the technique's section here."),
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Show Errors"), " (Game menu, off by default) marks digits that repeat in a line and pairs the wrong way round for their sign. When every cell is filled but the board isn't solved, the game asks whether you want a hint. ", /* @__PURE__ */ h("b", null, "Undo"), " (Ctrl+Z or the arrow button) takes back one change, notes included, and Ctrl+Y redoes it.")
				]
			},
			desktopSection
		]
	},
	{
		title: "Beginner techniques",
		sections: [
			{
				id: "naked-single",
				title: "Naked singles",
				body: () => [/* @__PURE__ */ h("p", null, "Cross off every digit already in a cell's row and column, and every digit the signs around it rule out. When one digit is left, the cell holds it."), /* @__PURE__ */ h(Example, { technique: "naked-single" })]
			},
			{
				id: "hidden-single",
				title: "Hidden singles",
				body: () => [/* @__PURE__ */ h("p", null, "Take one digit and one line. Every cell of the line that already sees that digit in its own column or row, or can't hold it for a sign, is out. When one cell is left, the digit goes there, whatever else that cell could have been."), /* @__PURE__ */ h(Example, { technique: "hidden-single" })]
			},
			{
				id: "beside",
				title: "Beside a digit",
				body: () => [/* @__PURE__ */ h("p", null, "A sign next to a placed digit is a plain limit: the cell on the small side is less than that digit, the cell on the large side greater. Beside a 2 on its large side only a 1 fits."), /* @__PURE__ */ h(Example, { technique: "beside" })]
			},
			{
				id: "ends",
				title: "Ends of chains",
				body: () => [/* @__PURE__ */ h("p", null, "A cell that is greater than another can't be 1, and one that is less than another can't be the largest digit. Signs that follow on from each other count up: the cell at the top of a chain of three signs is at least 4, the one at the bottom at most the largest digit less three."), /* @__PURE__ */ h(Example, { technique: "ends" })]
			}
		]
	},
	{
		title: "Advanced techniques",
		sections: [
			{
				id: "limits",
				title: "Limits",
				body: () => [/* @__PURE__ */ h("p", null, "The same sign works between two empty cells, through their candidates. The small cell has to stay below the largest digit the big cell can still be, and the big cell above the smallest the small cell can be. Each trim can set off the next along a chain."), /* @__PURE__ */ h(Example, { technique: "limits" })]
			},
			{
				id: "naked-pair",
				title: "Naked pairs",
				body: () => [/* @__PURE__ */ h("p", null, "Two cells of a line that can each only be the same two digits will take those two between them, in one order or the other. No other cell of the line can hold either."), /* @__PURE__ */ h(Example, { technique: "naked-pair" })]
			},
			{
				id: "hidden-pair",
				title: "Hidden pairs",
				body: () => [/* @__PURE__ */ h("p", null, "Two digits that can each only go in the same two cells of a line fill those cells, so every other candidate there goes."), /* @__PURE__ */ h(Example, { technique: "hidden-pair" })]
			},
			{
				id: "what-if",
				title: "What-if",
				body: () => [/* @__PURE__ */ h("p", null, "Expert boards sometimes stop every rule above. Then pick a cell with two candidates, suppose one and follow the simpler rules from it. If a cell soon has no digit left, or a line no place for one, the cell isn't that digit."), /* @__PURE__ */ h(Example, { technique: "what-if" })]
			}
		]
	}
];
//#endregion
//#region src/guide/pages/futoshiki.js
startGuide({
	page: "futoshiki-guide",
	title: "Futoshiki Plus Guide",
	icon: icons.futoshiki,
	parts
});
//#endregion
