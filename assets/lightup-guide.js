import { _t as h, o as icons } from "./HowToPlay-BoT0kLlt.js";
import { d as starve, f as whatIf, i as full, o as lone, r as boxed, s as need, t as Cell, u as squeeze, w as LightUp_module_default, y as litOf } from "./Cell-D5lyv-Vq.js";
import { n as Rules } from "./HowToPlay-Ck6Pc4cW.js";
import { r as startGuide, t as Figure } from "./Guide-DOvnOw-U.js";
import { t as desktopSection } from "./desktop-CWs711wR.js";
//#region src/guide/LightUpExample.jsx
var finders = {
	need,
	full,
	boxed,
	lone,
	squeeze,
	starve,
	"what-if": whatIf
};
var boardOf = (rows) => {
	const cells = [...rows.join("")];
	return {
		n: rows.length,
		layout: Int8Array.from(cells, (c) => c === "#" ? 5 : /\d/.test(c) ? Number(c) : -1),
		board: Int8Array.from(cells, (c) => c === "o" ? 1 : c === "x" ? 0 : -1)
	};
};
var exampleStep = (rows, technique) => {
	const { layout, board, n } = boardOf(rows);
	return finders[technique](layout, board, n)[0];
};
var marksOf = (step) => step ? Object.fromEntries([...step.sources.map((i) => [i, "source"]), ...step.place.map(([i, value]) => [i, value === 1 ? "bulb" : "cross"])]) : {};
var noop = () => null;
var LightUpExample = ({ rows, technique }) => {
	const { layout, board, n } = boardOf(rows);
	const step = technique && exampleStep(rows, technique);
	const marks = marksOf(step);
	const lit = litOf(layout, board, n);
	return /* @__PURE__ */ h(Figure, { caption: step && step.text }, /* @__PURE__ */ h("div", {
		class: LightUp_module_default.inactive,
		style: { "--n": n }
	}, [...board].map((value, i) => /* @__PURE__ */ h(Cell, {
		i,
		wall: layout[i],
		value,
		lit: lit[i],
		mark: marks[i],
		onPress: noop
	}))));
};
//#endregion
//#region src/guide/lightup.jsx
var examples = {
	need: [
		"#..o3o.",
		"....o..",
		".1..#..",
		"..o....",
		".o3..0.",
		"..o....",
		"..#...0"
	],
	full: [
		"#..o3o.",
		"....o..",
		"o1..#..",
		"..o....",
		".o3..0.",
		"..o....",
		"..#...0"
	],
	boxed: [
		"#..o3o.",
		"....o..",
		"o1..#..",
		"..o....",
		".o3.x0x",
		"..o....",
		"..#..x0"
	],
	lone: [
		"#o2....",
		".#...#.",
		"o.#..o#",
		"1#..x2#",
		"#x.x1o.",
		"x0x.x#o",
		".x..#o2"
	],
	squeeze: [
		"#o2....",
		".#o..#.",
		"o.#...#",
		"1#...2#",
		"#xo.#o.",
		"x0xox#o",
		"ox.x1o2"
	],
	starve: [
		"..o....",
		"o#x.#..",
		".o3o#.x",
		"#3o4o#0",
		".o#o#o.",
		"o.#.o4o",
		".....o."
	],
	"what-if": [
		".#o#.x.",
		".x##2..",
		"2.2..x.",
		".x.x.x.",
		".x..#.2",
		"..2##x.",
		".x.#o#."
	]
};
var solved = [
	"2o..#o.",
	"o..1o..",
	"..#...#",
	".0...0.",
	"#..o2.o",
	"..o3o..",
	".o2..o#"
];
var Example = ({ technique }) => /* @__PURE__ */ h(LightUpExample, {
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
					/* @__PURE__ */ h("p", null, "A finished 7 × 7 board: every white cell lit, no bulb in another's light, and each number with that many bulbs beside it."),
					/* @__PURE__ */ h(LightUpExample, { rows: solved })
				]
			},
			{
				id: "levels",
				title: "Levels and sizes",
				body: () => [
					/* @__PURE__ */ h("p", null, "Boards are made fresh for each game: walls scattered so the board looks the same turned half round, bulbs placed to light it, every wall numbered, then numbers taken away for as long as the chosen level can still finish it. Every board has exactly one solution, and a board is only dealt at a level if it really needs that level's reasoning."),
					/* @__PURE__ */ h("ul", null, /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Easy"), ": walls that need every free cell, walls that are full, and boxed in cells."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Medium"), " adds the only cell that can light another."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Hard"), " adds squeezes and starving. ", /* @__PURE__ */ h("b", null, "Expert"), " adds a short what-if.")),
					/* @__PURE__ */ h("p", null, "The Size menu has 7 × 7, 10 × 10 and 14 × 14, each at every level.")
				]
			},
			{
				id: "mistakes",
				title: "Hints, errors and mistakes",
				body: () => [
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Hint"), " (H, the Game menu or the ? button) points out a broken rule first, then a bulb or cross that can't fit the only solution, and otherwise the easiest next bulb. The cells it reasons from are outlined in blue, what it places in green and shown faintly, and the reason is under the board with a More button that opens its section here. When the bulb leans on cells you haven't crossed out yet, the hint shows those crosses too and says why the first of them holds."),
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Show Errors"), " (Game menu, off by default) turns bulbs that light each other red, and a number red once it has too many bulbs or too little room left for its own. When every cell is lit but the board isn't solved, the game asks whether you want a hint, or lets you find the mistake yourself. ", /* @__PURE__ */ h("b", null, "Undo"), " (Ctrl+Z or the arrow button) takes back one change at a time."),
					/* @__PURE__ */ h("p", null, "Each size and level keeps a best time, with and without hints, and the Game menu has a Daily Puzzle and Copy Link, which gives the board in play as a link.")
				]
			},
			desktopSection
		]
	},
	{
		title: "Beginner techniques",
		sections: [
			{
				id: "need",
				title: "Walls that need every cell",
				body: () => [/* @__PURE__ */ h("p", null, "Count the free cells beside a numbered wall: white, dark and not crossed out. When the wall needs as many bulbs as it has free cells, each of them holds one. A 4 always does, a 3 against the edge does, a 2 in a corner does."), /* @__PURE__ */ h(Example, { technique: "need" })]
			},
			{
				id: "full",
				title: "Full walls",
				body: () => [/* @__PURE__ */ h("p", null, "Once a wall has its number of bulbs, no other cell beside it can hold one, so cross them out. A 0 is full from the start. The crosses matter: they are what later leaves a cell only one place it can be lit from."), /* @__PURE__ */ h(Example, { technique: "full" })]
			},
			{
				id: "boxed",
				title: "Boxed in cells",
				body: () => [/* @__PURE__ */ h("p", null, "A dark cell has to be lit from somewhere along its row or column. When every other cell it can see is lit already or crossed out, nothing else can light it, so it holds a bulb itself. Cells closed in by walls on all sides are the plainest case."), /* @__PURE__ */ h(Example, { technique: "boxed" })]
			}
		]
	},
	{
		title: "Advanced techniques",
		sections: [
			{
				id: "lone",
				title: "The only light",
				body: () => [/* @__PURE__ */ h("p", null, "A crossed out cell that is still dark can't light itself. Look along its row and column for free cells: when just one is left, the bulb goes there. It is the same question as a boxed in cell, asked of a cell that can't answer it alone."), /* @__PURE__ */ h(Example, { technique: "lone" })]
			},
			{
				id: "squeeze",
				title: "Squeezes",
				body: () => [/* @__PURE__ */ h("p", null, "A wall that still needs bulbs has to keep enough free cells beside it. A bulb elsewhere that would light too many of them, most often one diagonal to the wall, which lights two at once, can't be there. A 3 with four free cells crosses out all four diagonals, and so does a 1 with two free cells on either side of a corner."), /* @__PURE__ */ h(Example, { technique: "squeeze" })]
			},
			{
				id: "starve",
				title: "Starving a cell",
				body: () => [/* @__PURE__ */ h("p", null, "The same idea for a dark cell: it needs at least one of the free cells it can see to stay free. A bulb that would light all of them without lighting the cell itself would leave it dark for good, so that bulb can't be there."), /* @__PURE__ */ h(Example, { technique: "starve" })]
			},
			{
				id: "what-if",
				title: "What-if",
				body: () => [/* @__PURE__ */ h("p", null, "Expert boards sometimes stop every rule above. Then pick a free cell, suppose a bulb there (or suppose none) and follow the beginner rules from it. If a number soon can't be met or a cell can't be lit, the cell is the other way round. Cells beside numbers and in short corridors run into trouble soonest, so try those first."), /* @__PURE__ */ h(Example, { technique: "what-if" })]
			}
		]
	}
];
//#endregion
//#region src/guide/pages/lightup.js
startGuide({
	page: "lightup-guide",
	title: "Light Up Plus Guide",
	icon: icons.lightup,
	parts
});
//#endregion
