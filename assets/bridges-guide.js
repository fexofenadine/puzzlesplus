import { n as icons, vt as h } from "./Taskbar-9d9Z-Iik.js";
import { E as Bridges_module_default, _ as degreesOf, f as nextSteps, g as startState, i as Cell, n as drawings, u as apply, x as linksOf } from "./Game-CwK6-y_c.js";
import { n as Rules } from "./HowToPlay-bevUhCvm.js";
import { i as startGuide, r as noop, t as Figure } from "./Guide-C0ixFVSH.js";
import { t as desktopSection } from "./desktop-Dt7DKokT.js";
//#region src/guide/BridgesExample.jsx
var boardOf = (rows) => {
	const n = rows.length;
	const cells = [...rows.join("")];
	const islands = Int8Array.from(cells, (c) => /\d/.test(c) ? Number(c) : 0);
	const { links } = linksOf(islands, n);
	return {
		n,
		islands,
		board: Int8Array.from(links, ({ cells: water }) => {
			const c = cells[water[0]];
			return "-|".includes(c) ? 1 : "=:".includes(c) ? 2 : 0;
		})
	};
};
var exampleStep = (rows, technique) => {
	const { n, islands, board } = boardOf(rows);
	const state = startState(islands, n);
	state.lo.set(board);
	for (let round = 0; round < 200; round++) {
		const { steps } = nextSteps(islands, n, state);
		if (!steps.length) return null;
		const found = steps.find((step) => step.technique === technique);
		if (found) return found;
		if (steps.some((s) => s.change.some(([l, least]) => least > state.lo[l]))) return null;
		if (!apply(state, steps)) return null;
	}
	return null;
};
var marksOf = (step, board) => ({
	cells: step ? Object.fromEntries(step.sources.map((i) => [i, "source"])) : {},
	links: step ? Object.fromEntries(step.change.flatMap(([l, least, most]) => {
		if (least > board[l]) return [[l, {
			kind: "bridge",
			count: least
		}]];
		return most === 0 ? [[l, {
			kind: "none",
			count: 0
		}]] : [];
	})) : {}
});
var BridgesExample = ({ rows, technique }) => {
	const { n, islands, board } = boardOf(rows);
	const step = technique && exampleStep(rows, technique);
	const marks = marksOf(step, board);
	const degree = degreesOf(islands, n, board);
	const { bridge, ghost, none } = drawings(islands, n, board, marks);
	return /* @__PURE__ */ h(Figure, { caption: step && step.text }, /* @__PURE__ */ h("div", {
		class: Bridges_module_default.inactive,
		style: { "--n": n }
	}, [...islands].map((island, i) => /* @__PURE__ */ h(Cell, {
		i,
		island,
		bridge: bridge.get(i),
		ghost: ghost.get(i),
		none: none.has(i),
		done: island > 0 && degree[i] === island,
		mark: marks.cells[i],
		onPress: noop
	}))));
};
//#endregion
//#region src/guide/bridges.jsx
var examples = {
	need: [
		"..2.5.2",
		".3.1...",
		".......",
		"......3",
		".5..4..",
		".......",
		".2....3"
	],
	full: [
		".2....2",
		"1.2--3.",
		"|....|.",
		"|2...2.",
		"|......",
		"3=3...2",
		"......."
	],
	crossed: [
		"2.2..1.",
		".......",
		"3--2.1.",
		".......",
		"3---1..",
		"|......",
		"2.1...."
	],
	limit: [
		"1.3--3.",
		".....|.",
		"2..1.3.",
		".......",
		"..2..4.",
		".....|.",
		"2----3."
	],
	isolate: [
		".......",
		"3---3.1",
		"|......",
		"|......",
		"3..1..2",
		"......|",
		"2.2.4-3"
	],
	exit: [
		"3-4.4-3",
		"|.|.|.|",
		"|.|.|.3",
		"3.|.|.|",
		"|.|.3-4",
		"3-4--1|",
		".1----2"
	],
	"what-if": [
		"2.3.2..",
		".......",
		"..1....",
		"4...4..",
		"|.2.|..",
		"|.|.|..",
		"3-3.2.."
	]
};
var solved = [
	".4===3.",
	".:...|.",
	".4--3|.",
	".|..:|.",
	".|2=5|.",
	".|..|1.",
	".2--3-1"
];
var Example = ({ technique }) => /* @__PURE__ */ h(BridgesExample, {
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
					/* @__PURE__ */ h("p", null, "A finished 7 × 7 board: every island has its number of bridges, none cross, and all the islands are joined into one."),
					/* @__PURE__ */ h(BridgesExample, { rows: solved })
				]
			},
			{
				id: "levels",
				title: "Levels and sizes",
				body: () => [
					/* @__PURE__ */ h("p", null, "Boards are made fresh for each game: islands grown from one by bridges, a few more bridges added between neighbours, then every island numbered by the bridges it ended up with. Every board has exactly one solution, and a board is only dealt at a level if it really needs that level's reasoning."),
					/* @__PURE__ */ h("ul", null, /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Easy"), ": islands whose neighbours can't give them their bridges between them, islands that are full, and bridges that would cross."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Medium"), " adds islands with only so many bridges left to place."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Hard"), " adds groups that would be cut off and groups with one way out.", " ", /* @__PURE__ */ h("b", null, "Expert"), " adds a short what-if.")),
					/* @__PURE__ */ h("p", null, "The Size menu has 7 × 7, 10 × 10 and 14 × 14, each at every level.")
				]
			},
			{
				id: "mistakes",
				title: "Hints, errors and mistakes",
				body: () => [
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Hint"), " (H, the Game menu or the ? button) points out a broken rule first, then a link with more bridges than the only solution gives it, and otherwise the easiest next bridge. The islands it reasons from are outlined in blue, the bridge it places is drawn faintly in green, and the reason is under the board with a More button that opens its section here. When the bridge leans on links that can't hold one, the hint marks those with a small cross and says why the first of them holds none."),
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Show Errors"), " (Game menu, off by default) turns an island red when it has too many bridges or no way left to reach its number, and the islands of a finished group that is cut off from the rest. When every island has its number but the puzzle isn't solved, the game asks whether you want a hint, or lets you find the mistake yourself. ", /* @__PURE__ */ h("b", null, "Undo"), " ", "(Ctrl+Z or the arrow button) takes back one change at a time."),
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
				title: "Islands that need every neighbour",
				body: () => [/* @__PURE__ */ h("p", null, "Add up the most bridges an island's neighbours can take. When that is only just enough, or so few that something must go to each, those bridges are certain. A 1 beside a lone neighbour, a 4 in a corner, a 6 on an edge and an 8 anywhere have no choice at all, and a 3 in a corner with two neighbours needs at least one bridge to each."), /* @__PURE__ */ h(Example, { technique: "need" })]
			},
			{
				id: "full",
				title: "Full islands",
				body: () => [/* @__PURE__ */ h("p", null, "Once an island has its number of bridges, no other bridge can reach it. Every link that is still open to it is closed, which often leaves its neighbours with fewer places to go."), /* @__PURE__ */ h(Example, { technique: "full" })]
			},
			{
				id: "crossed",
				title: "Crossing bridges",
				body: () => [/* @__PURE__ */ h("p", null, "Bridges never cross. A link with a bridge already across it has none, so it can be ruled out, and the islands at its ends have one place fewer to turn to."), /* @__PURE__ */ h(Example, { technique: "crossed" })]
			}
		]
	},
	{
		title: "Advanced techniques",
		sections: [
			{
				id: "limit",
				title: "Only so many left",
				body: () => [/* @__PURE__ */ h("p", null, "An island that still has one bridge to place can take no double bridge anywhere, and one with two to place can't give three. Cap each link by what its islands have left, and a link capped at one often cannot take a second bridge from either end."), /* @__PURE__ */ h(Example, { technique: "limit" })]
			},
			{
				id: "isolate",
				title: "Cut off groups",
				body: () => [/* @__PURE__ */ h("p", null, "Every island has to be reachable from every other. When another bridge on a link would give a group of islands all their bridges while the rest of the puzzle stays outside, that bridge can't go there. Two 1s side by side, or a pair of 2s joined twice, are the plainest cases."), /* @__PURE__ */ h(Example, { technique: "isolate" })]
			},
			{
				id: "exit",
				title: "One way out",
				body: () => [/* @__PURE__ */ h("p", null, "Look at a group of islands joined so far. When only one link could still lead out of it, a bridge must go there, or the group stays cut off for good."), /* @__PURE__ */ h(Example, { technique: "exit" })]
			},
			{
				id: "what-if",
				title: "What-if",
				body: () => [/* @__PURE__ */ h("p", null, "Expert boards sometimes stop every rule above. Then pick a link, suppose it holds a certain number of bridges and follow the beginner rules from it. If an island soon can't be met or a group is cut off, the link holds something else. Links between islands with small numbers run into trouble soonest, so try those first."), /* @__PURE__ */ h(Example, { technique: "what-if" })]
			}
		]
	}
];
//#endregion
//#region src/guide/pages/bridges.js
startGuide({
	page: "bridges-guide",
	title: "Bridges Plus Guide",
	icon: icons.bridges,
	parts
});
//#endregion
