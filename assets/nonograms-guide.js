import { o as icons, z as h } from "./HowToPlay-CmhOznvD.js";
import { n as cellsOf } from "./grid-D_4m0l-G.js";
import { C as Game_module_default, _ as cluesOf, a as Cell, b as lineDone, f as lineSteps, i as tracks, n as place, p as nextSteps } from "./Game-CmliCjWk.js";
import { n as Rules } from "./HowToPlay-jW-lKD0x.js";
import { r as startGuide, t as Figure } from "./Guide-DULIDQFu.js";
import { t as desktopSection } from "./desktop-Dq2SDJM7.js";
//#region src/guide/NonogramsExample.jsx
var levelOf = {
	complete: 0,
	overlap: 0,
	gap: 0,
	forcing: 1,
	reach: 1,
	line: 2
};
var valueOf = (c) => c === "#" ? 1 : c === "x" ? 0 : -1;
var lineOf = (text) => Int8Array.from(text, valueOf);
var boardOf = (rows) => Int8Array.from(rows.join(""), valueOf);
var lineStep = (clue, text, technique) => {
	const found = lineSteps(lineOf(text), clue, levelOf[technique]).find((step) => step.technique === technique);
	return found && {
		...found,
		text: found.text("this row", ["left", "right"])
	};
};
var boardStep = (clues, rows, technique) => nextSteps(boardOf(rows), rows.length, clues).steps.find((step) => step.technique === technique);
var marksOf = (step) => step ? Object.fromEntries([...step.sources.map((i) => [i, "source"]), ...step.place.map(([i, v]) => [i, v === 1 ? "fill" : "cross"])]) : {};
var noop = () => null;
var Clue = ({ clue, done, hinted, style }) => /* @__PURE__ */ h("div", {
	class: [
		Game_module_default.clue,
		done && Game_module_default.done,
		hinted && Game_module_default.hinted
	].filter(Boolean).join(" "),
	style
}, (clue.length ? clue : [0]).map((run) => /* @__PURE__ */ h("span", { class: run > 9 && Game_module_default.wide }, run)));
var LineExample = ({ clue, values, technique }) => {
	const step = technique && lineStep(clue, values, technique);
	const marks = marksOf(step);
	const one = { gridTemplateRows: "var(--size)" };
	return /* @__PURE__ */ h(Figure, { caption: step && step.text }, /* @__PURE__ */ h("div", {
		class: Game_module_default.board,
		style: { "--tracks": tracks(values.length) }
	}, /* @__PURE__ */ h("div", {
		class: Game_module_default.rows,
		style: one
	}, /* @__PURE__ */ h(Clue, {
		clue,
		hinted: Boolean(step)
	})), /* @__PURE__ */ h("div", {
		class: Game_module_default.inactive,
		style: one
	}, [...lineOf(values)].map((value, k) => /* @__PURE__ */ h(Cell, {
		i: k,
		value,
		mark: marks[k],
		style: {
			gridColumn: place(k),
			gridRow: 1
		},
		onPress: noop
	})))));
};
var BoardExample = ({ rows, clues, technique }) => {
	const n = rows.length;
	const board = boardOf(rows);
	const allClues = clues || cluesOf(board.map((v) => v === 1 ? 1 : 0), n);
	const step = technique && boardStep(allClues, rows, technique);
	const marks = marksOf(step);
	const lines = cellsOf(n);
	const clue = (line) => /* @__PURE__ */ h(Clue, {
		clue: allClues[line],
		done: lineDone(board, lines[line], allClues[line]),
		hinted: step && step.line === line,
		style: line < n ? { gridRow: place(line) } : { gridColumn: place(line - n) }
	});
	return /* @__PURE__ */ h(Figure, { caption: step && step.text }, /* @__PURE__ */ h("div", {
		class: Game_module_default.board,
		style: { "--tracks": tracks(n) }
	}, /* @__PURE__ */ h("div", { class: Game_module_default.columns }, lines.slice(n).map((_, x) => clue(n + x))), /* @__PURE__ */ h("div", { class: Game_module_default.rows }, lines.slice(0, n).map((_, y) => clue(y))), /* @__PURE__ */ h("div", { class: Game_module_default.inactive }, [...board].map((value, i) => /* @__PURE__ */ h(Cell, {
		i,
		value,
		mark: marks[i],
		style: {
			gridColumn: place(i % n),
			gridRow: place(Math.floor(i / n))
		},
		onPress: noop
	})))));
};
//#endregion
//#region src/guide/nonograms.jsx
var lines = {
	complete: {
		clue: [
			3,
			3,
			2
		],
		values: ".........."
	},
	overlap: {
		clue: [7],
		values: ".........."
	},
	gap: {
		clue: [3],
		values: "x..x......"
	},
	forcing: {
		clue: [1, 4],
		values: "........#."
	},
	reach: {
		clue: [1, 2],
		values: ".......#.."
	},
	line: {
		clue: [1, 1],
		values: "..#.x....."
	}
};
var whatIf = {
	clues: [
		[1, 1],
		[3, 3],
		[9],
		[6],
		[4],
		[2],
		[],
		[],
		[6],
		[1, 1],
		[2],
		[3],
		[3, 1],
		[3, 2],
		[4, 1],
		[4, 1],
		[3, 2],
		[3, 1],
		[3],
		[1]
	],
	rows: [
		"x..xxxx..x",
		"###xxxx###",
		"#########x",
		"x..####..x",
		"xxx####xxx",
		"xxxx##xxxx",
		"xxxxxxxxxx",
		"xxxxxxxxxx",
		"xx######xx",
		"xxx#xx#xxx"
	]
};
var picture = [
	"#####",
	"##.##",
	"##.##",
	".#.#.",
	"#####"
];
var Line = ({ technique }) => /* @__PURE__ */ h(LineExample, {
	...lines[technique],
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
					/* @__PURE__ */ h("p", null, "A finished 5 × 5 picture, every clue dimmed because its line matches:"),
					/* @__PURE__ */ h(BoardExample, { rows: picture })
				]
			},
			{
				id: "levels",
				title: "Levels and sizes",
				body: () => [
					/* @__PURE__ */ h("p", null, "Pictures are random blobs made fresh for each game, sometimes mirrored. A picture that logic can't finish is touched up cell by cell until it can, so every board has exactly one solution and needs no guessing. A board is only dealt at a level if it needs that level's reasoning."),
					/* @__PURE__ */ h("ul", null, /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Easy"), ": lines a clue settles alone, overlaps and gaps, counting only crossed out cells."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Medium"), ": the same overlaps and reach with filled cells counted too."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Hard"), ": everything one line proves when every way of fitting its clue is tried."), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("b", null, "Expert"), ": adds what-if across lines.")),
					/* @__PURE__ */ h("p", null, "The Size menu has 5 × 5 to 25 × 25, with a thicker line every five cells. 5 × 5 has no Expert, since boards that small never need it.")
				]
			},
			{
				id: "mistakes",
				title: "Hints, errors and mistakes",
				body: () => [
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Hint"), " (H, the Game menu or the ? button) points out a clue that can't be matched any more first, then a cell that can't fit the only solution, and otherwise the easiest next step. Its clue and the cells it reasons from are outlined in blue, the cells it settles show faintly in green, and a More button under the board opens its section here."),
					/* @__PURE__ */ h("p", null, /* @__PURE__ */ h("b", null, "Show Errors"), " (Game menu, off by default) turns a clue red once its line can't match. When every fill is placed but the picture is wrong, the game asks whether you want a hint. ", /* @__PURE__ */ h("b", null, "Undo"), " (Ctrl+Z) takes back a whole drag at a time."),
					/* @__PURE__ */ h("p", null, "Each size and level keeps a best time, with and without hints. On Matrix,", " ", /* @__PURE__ */ h("b", null, "Rain Glyphs"), " in the Theme menu draws filled cells as a glyph from the code rain.")
				]
			},
			desktopSection
		]
	},
	{
		title: "Beginner techniques",
		sections: [
			{
				id: "complete",
				title: "Lines a clue settles alone",
				body: () => [/* @__PURE__ */ h("p", null, "Some clues need no thought. A clue of 0 means the whole line is empty. A clue whose runs, with one empty cell between each, add up to the line's length fills it exactly. And a line that already shows all its runs has nothing else to fill."), /* @__PURE__ */ h(Line, { technique: "complete" })]
			},
			{
				id: "overlap",
				title: "Overlaps",
				body: () => [/* @__PURE__ */ h("p", null, "Push a run as far left as it can go, then as far right. The cells it covers both times are filled wherever it really sits. A run longer than half the line always overlaps itself, and with several runs, push them all together."), /* @__PURE__ */ h(Line, { technique: "overlap" })]
			},
			{
				id: "gap",
				title: "Gaps",
				body: () => [/* @__PURE__ */ h("p", null, "Crossed out cells split a line into pieces. A piece too short for any run that could reach it stays empty, and so does any cell beyond the furthest any run can be pushed."), /* @__PURE__ */ h(Line, { technique: "gap" })]
			},
			{
				id: "forcing",
				title: "Forcing with filled cells",
				body: () => [/* @__PURE__ */ h("p", null, "Filled cells pin runs down. A run must cover each filled cell, so pushing runs as far as they go while keeping every filled cell covered gives tighter overlaps than the empty line does."), /* @__PURE__ */ h(Line, { technique: "forcing" })]
			},
			{
				id: "reach",
				title: "Reach",
				body: () => [/* @__PURE__ */ h("p", null, "The same pushing shows how far each run can reach once filled cells pin it. Cells no run can reach any more are empty, which often clears the ends of a line."), /* @__PURE__ */ h(Line, { technique: "reach" })]
			}
		]
	},
	{
		title: "Advanced techniques",
		sections: [{
			id: "line",
			title: "Every way a line fits",
			body: () => [/* @__PURE__ */ h("p", null, "When the quick rules stop, take one line and think through every way its clue can sit around the cells already known. Any cell that comes out the same in all of them is settled. This finds everything one line can prove on its own."), /* @__PURE__ */ h(Line, { technique: "line" })]
		}, {
			id: "what-if",
			title: "What-if",
			body: () => [/* @__PURE__ */ h("p", null, "Expert boards stop even full line logic. Then suppose a cell is filled, or empty, and follow the lines from it. If some line ends up unable to match its clue, the cell must be the other way. Cells beside long clues make good places to try."), /* @__PURE__ */ h(BoardExample, {
				...whatIf,
				technique: "what-if"
			})]
		}]
	}
];
//#endregion
//#region src/guide/pages/nonograms.js
startGuide({
	page: "nonograms-guide",
	title: "Nonograms Plus Guide",
	icon: icons.nonograms,
	parts
});
//#endregion
