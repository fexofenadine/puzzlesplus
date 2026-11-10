import { D as BackgroundSettings, E as Boss, F as Dialog, I as Button, L as Overlay, M as load, O as startBackgrounds, P as save, R as app, _ as listen, a as Taskbar, b as shortcut, i as About_module_default, n as About, r as Link, v as shellActions, x as typing, y as shellState, z as h } from "./HowToPlay-BSugkO4s.js";
import { a as check, c as OpenGames, l as Winner, n as Switching, o as resumable, t as registerWorker } from "./worker-BYEAi_0D.js";
import { n as Prompt } from "./BestTimes.module-Co1LdOkt.js";
import { _ as timed, f as clock, g as seconds, h as pauseAction, m as loadTimer, v as timerAction } from "./Board-aQlUKWW2.js";
import { a as records, i as BestTimes, r as dealer, t as random } from "./random-DtZnze6y.js";
import { t as showRain } from "./rain-CDSUa0yA.js";
import { S as solved, _ as cluesOf, c as levelNames, d as levels$1, g as deduce, h as solveAt, m as rate, o as allowed, r as running, s as fallback, t as Game, u as findHint, v as emptyBoard, x as sizes, y as fillsLeft } from "./Game-B7nW7lUk.js";
import { t as NonogramsHowToPlay } from "./HowToPlay-BMVU5RVs.js";
//#region src/nonograms/art/10/heart.txt?raw
var heart_default$2 = "name: Heart\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n.###..###.\n##########\n##########\n##########\n.########.\n.########.\n..######..\n...####...\n....##....\n....##....\n";
//#endregion
//#region src/nonograms/art/10/smiley.txt?raw
var smiley_default = "name: Smiley\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..######..\n.########.\n##########\n##.####.##\n##########\n##########\n##.####.##\n###....###\n.########.\n..######..\n";
//#endregion
//#region src/nonograms/art/10/tree.txt?raw
var tree_default = "name: Tree\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n....##....\n...####...\n..######..\n...####...\n..######..\n.########.\n##########\n....##....\n....##....\n....##....\n";
//#endregion
//#region src/nonograms/art/15/heart.txt?raw
var heart_default$1 = "name: Heart\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..####...####..\n.######.######.\n###############\n###############\n###############\n###############\n###############\n.#############.\n.#############.\n..###########..\n...#########...\n....#######....\n.....#####.....\n......###......\n.......#.......\n";
//#endregion
//#region src/nonograms/art/15/mushroom.txt?raw
var mushroom_default = "name: Mushroom\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n....#######....\n..###########..\n.####.###.####.\n###############\n####..###..####\n###############\n.#############.\n..###########..\n.....#####.....\n.....#####.....\n.....#####.....\n.....#####.....\n.....#####.....\n....#######....\n...#########...\n";
//#endregion
//#region src/nonograms/art/15/rocket.txt?raw
var rocket_default = "name: Rocket\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n.......#.......\n......###......\n.....#####.....\n....#######....\n....#######....\n....##...##....\n....##...##....\n....#######....\n....#######....\n..##.#####.##..\n.###..###..###.\n###...###...###\n......###......\n.....#####.....\n.....#####.....\n";
//#endregion
//#region src/nonograms/art/20/cat.txt?raw
var cat_default = "name: Cat\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..##............##..\n..####........####..\n..################..\n.##################.\n####################\n####################\n#####..######..#####\n#####..######..#####\n####################\n####################\n#########..#########\n########.##.########\n#########..#########\n.##################.\n.##################.\n..################..\n...##############...\n....############....\n.....##########.....\n......########......\n";
//#endregion
//#region src/nonograms/art/20/trophy.txt?raw
var trophy_default = "name: Trophy\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..################..\n..################..\n##.##############.##\n#..##############..#\n#..##############..#\n##.##############.##\n...##############...\n....############....\n.....##########.....\n......########......\n.......######.......\n........####........\n........####........\n........####........\n.....##########.....\n....############....\n....############....\n..################..\n..################..\n..################..\n";
//#endregion
//#region src/nonograms/art/20/umbrella.txt?raw
var umbrella_default = "name: Umbrella\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n......########......\n....############....\n..################..\n.##################.\n####################\n####################\n###.###.####.###.###\n........####........\n........####........\n........####........\n........####........\n........####........\n........####........\n........####........\n........####........\n........####........\n........####........\n.......######.......\n......########......\n......########......\n";
//#endregion
//#region src/nonograms/art/25/butterfly.txt?raw
var butterfly_default = "name: Butterfly\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n#####......#.#......#####\n#######...........#######\n########.........########\n#########..###..#########\n##########.###.##########\n##########.###.##########\n##########.###.##########\n##########.###.##########\n#########..###..#########\n#########..###..#########\n.########..###..########.\n...######..###..######...\n....#####..###..#####....\n..#######..###..#######..\n.#########.###.#########.\n##########.###.##########\n##########.###.##########\n.#########.###.#########.\n..#######..###..#######..\n...#####...###...#####...\n....###....###....###....\n.....##....###....##.....\n...........###...........\n...........###...........\n...........###...........\n";
//#endregion
//#region src/nonograms/art/25/castle.txt?raw
var castle_default = "name: Castle\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n............#............\n...........###...........\n..........#####..........\n.........#######.........\n........#########........\n##.##.##.#######.##.##.##\n########.#######.########\n########.#######.########\n###..###.#######.###..###\n###..###.#######.###..###\n########.#######.########\n########.#######.########\n#########################\n#########################\n#########################\n#########################\n#########################\n#########################\n##########.....##########\n##########.....##########\n##########.....##########\n##########.....##########\n##########.....##########\n##########.....##########\n##########.....##########\n";
//#endregion
//#region src/nonograms/art/25/pine.txt?raw
var pine_default = "name: Pine Tree\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n............#............\n...........###...........\n...........###...........\n..........#####..........\n.........#######.........\n..........#####..........\n........#########........\n.......###########.......\n........#########........\n......#############......\n.....###############.....\n....#################....\n......#############......\n.....###############.....\n....#################....\n...###################...\n..#####################..\n.#######################.\n#########################\n..........#####..........\n..........#####..........\n..........#####..........\n..........#####..........\n..........#####..........\n........#########........\n";
//#endregion
//#region src/nonograms/art/5/arrow.txt?raw
var arrow_default = "name: Arrow\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..#..\n.###.\n#.#.#\n..#..\n..#..\n";
//#endregion
//#region src/nonograms/art/5/heart.txt?raw
var heart_default = "name: Heart\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n.#.#.\n#####\n#####\n.###.\n..#..\n";
//#endregion
//#region src/nonograms/art/5/house.txt?raw
var house_default = "name: House\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..#..\n.###.\n#####\n##.##\n##.##\n";
//#endregion
//#region src/nonograms/generate.js
var filled = (cells, n) => {
	const used = (line) => line.some((k) => cells[k]);
	const rows = [...Array(n).keys()].map((y) => [...Array(n).keys()].map((x) => y * n + x));
	const columns = [...Array(n).keys()].map((x) => [...Array(n).keys()].map((y) => y * n + x));
	return (n <= 10 ? [...rows, ...columns] : [
		rows[0],
		rows[n - 1],
		columns[0],
		columns[n - 1]
	]).every(used);
};
var mirrored = (cells, n) => {
	for (let y = 0; y < n; y++) for (let x = 0; x < n / 2; x++) if (cells[y * n + x] !== cells[y * n + n - 1 - x]) return false;
	return true;
};
var twin = (i, n) => i - i % n + n - 1 - i % n;
var shaped = (cells, n, symmetric) => filled(cells, n) && mirrored(cells, n) === symmetric;
var makePicture = (n, rng, dense = 0, symmetric = true) => {
	for (;;) {
		const cells = scatter(n, rng, dense, symmetric);
		if (shaped(cells, n, symmetric)) return cells;
	}
};
var scatter = (n, rng, dense, symmetric) => {
	const density = .48 + dense + .08 * rng();
	let cells = Int8Array.from({ length: n * n }, () => rng() < density ? 1 : 0);
	for (let pass = 0; pass < (n < 10 ? 0 : 2); pass++) {
		const next = cells.slice();
		for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
			let count = 0;
			for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
				const yy = y + dy;
				const xx = x + dx;
				if (yy >= 0 && yy < n && xx >= 0 && xx < n) count += cells[yy * n + xx];
			}
			if (count >= 6) next[y * n + x] = 1;
			else if (count <= 3) next[y * n + x] = 0;
		}
		cells = next;
	}
	if (symmetric) for (let y = 0; y < n; y++) for (let x = Math.ceil(n / 2); x < n; x++) cells[y * n + x] = cells[y * n + n - 1 - x];
	return cells;
};
var makePuzzle = (n, rng, top = levels$1.length - 1, deadline = Infinity, symmetric = true) => {
	while (performance.now() < deadline) {
		const solution = makePicture(n, rng, top ? 0 : .12, symmetric);
		for (let flips = 0; flips < 4 * n && performance.now() < deadline; flips++) {
			const clues = cluesOf(solution, n);
			const board = emptyBoard(n);
			if (solveAt(board, n, clues, Math.min(top, 2))) return {
				solution,
				clues,
				level: rate(clues, n, Math.min(top, 2))
			};
			const open = board.filter((v) => v === -1).length;
			if (top >= 3 && open * 4 <= n * n && deduce(board, n, clues, true, deadline) !== null) return {
				solution,
				clues,
				level: 3
			};
			const unsettled = [...board.keys()].filter((i) => board[i] === -1);
			const flip = unsettled[Math.floor(rng() * unsettled.length)];
			const cells = symmetric ? [flip, twin(flip, n)] : [flip];
			for (const k of cells) solution[k] ^= 1;
			if (!shaped(solution, n, symmetric)) for (const k of cells) solution[k] ^= 1;
		}
	}
	return null;
};
var makeGame = (n, level, rng, budget = n >= 20 ? 3e3 : 1500, symmetric = true) => {
	const deadline = performance.now() + budget;
	let best = null;
	for (;;) {
		const puzzle = makePuzzle(n, rng, level, deadline, symmetric);
		if (!puzzle) break;
		if (puzzle.level === level) return puzzle;
		if (!best || puzzle.level > best.level) best = puzzle;
	}
	return best ?? makePuzzle(n, rng, 1, Infinity, symmetric);
};
//#endregion
//#region src/nonograms/art.js
var files = /* #__PURE__ */ Object.assign({
	"./art/10/heart.txt": heart_default$2,
	"./art/10/smiley.txt": smiley_default,
	"./art/10/tree.txt": tree_default,
	"./art/15/heart.txt": heart_default$1,
	"./art/15/mushroom.txt": mushroom_default,
	"./art/15/rocket.txt": rocket_default,
	"./art/20/cat.txt": cat_default,
	"./art/20/trophy.txt": trophy_default,
	"./art/20/umbrella.txt": umbrella_default,
	"./art/25/butterfly.txt": butterfly_default,
	"./art/25/castle.txt": castle_default,
	"./art/25/pine.txt": pine_default,
	"./art/5/arrow.txt": arrow_default,
	"./art/5/heart.txt": heart_default,
	"./art/5/house.txt": house_default
});
var required = [
	"name",
	"credit",
	"licence"
];
var parseArt = (path, text) => {
	const fail = (why) => {
		throw new Error(`${path}: ${why}`);
	};
	const [head, ...rest] = text.replace(/\r/g, "").split(/^---$/m);
	if (rest.length !== 1) fail("needs one --- line between the header and the grid");
	const info = {};
	for (const line of head.split("\n")) {
		const at = line.indexOf(":");
		if (line.trim() && at > 0) info[line.slice(0, at).trim()] = line.slice(at + 1).trim();
	}
	for (const key of required) if (!info[key]) fail(`missing ${key}`);
	const rows = rest[0].split("\n").map((row) => row.trim()).filter(Boolean);
	const n = rows.length;
	if (n < 5 || n > 25) fail(`${n} rows, sizes go from 5 to 25`);
	if (rows.some((row) => row.length !== n || /[^#.]/.test(row))) fail("rows must be n of # or .");
	if (path.split("/").at(-2) !== String(n)) fail(`a ${n} × ${n} grid belongs in the ${n} folder`);
	const cells = Int8Array.from(rows.join(""), (c) => c === "#" ? 1 : 0);
	if (!filled(cells, n)) fail("must touch every edge, and have no empty line up to 10 × 10");
	return {
		id: path.replace(/^.*art\//, "").replace(/\.txt$/, ""),
		n,
		cells,
		name: info.name,
		credit: info.credit,
		licence: info.licence,
		source: info.source ?? ""
	};
};
var pool = Object.entries(files).flatMap(([path, text]) => {
	try {
		return [parseArt(path, text)];
	} catch {
		return [];
	}
});
var levels = /* @__PURE__ */ new Map();
var levelOf = (art) => {
	if (!levels.has(art.id)) levels.set(art.id, rate(cluesOf(art.cells, art.n), art.n));
	return levels.get(art.id);
};
var infoOf = ({ id, name, credit, licence, source }) => ({
	id,
	name,
	credit,
	licence,
	source
});
var artFor = (n) => pool.filter((art) => art.n === n && levelOf(art) !== null);
var pickArt = (n, level, rng, id = null, avoid = null) => {
	const all = artFor(n);
	let options = all.filter((art) => art.id === id);
	if (!options.length) {
		const others = all.length > 1 ? all.filter((art) => art.id !== avoid) : all;
		const gap = (art) => Math.abs(levelOf(art) - level);
		const nearest = Math.min(...others.map(gap));
		options = others.filter((art) => gap(art) === nearest);
	}
	if (!options.length) return null;
	const art = options[Math.floor(rng() * options.length)];
	return {
		solution: art.cells.slice(),
		clues: cluesOf(art.cells, art.n),
		level: levelOf(art),
		art: infoOf(art)
	};
};
//#endregion
//#region src/nonograms/dealing.js
var deal$1 = ({ n, level, seed, art = false, pick = null, avoid = null, symmetric = true }) => {
	const rng = random(seed);
	return art && pickArt(n, level, rng, pick, avoid) || makeGame(n, level, rng, void 0, symmetric);
};
//#endregion
//#region src/nonograms/deal.js
var dealOne = dealer(() => new Worker(new URL(
	/* @vite-ignore */
	new URL("deal.worker-D3TW1Oei.js", import.meta.url).href,
	"" + import.meta.url
), { type: "module" }), deal$1);
var deal = (n, level, seed, options = {}) => dealOne({
	n,
	level,
	seed,
	...options
});
var Pictures_module_default = {
	root: "Pictures_root",
	text: "Pictures_text",
	list: "Pictures_list",
	option: "Pictures_option",
	thumb: "Pictures_thumb",
	label: "Pictures_label",
	level: "Pictures_level",
	footer: "Pictures_footer"
};
//#endregion
//#region src/nonograms/Pictures.jsx
var outline = ({ cells, n }) => [...cells.keys()].filter((i) => cells[i]).map((i) => `M${i % n} ${Math.floor(i / n)}h1v1h-1z`).join("");
var Thumb = ({ art, solved }) => solved ? /* @__PURE__ */ h("svg", {
	class: Pictures_module_default.thumb,
	viewBox: `0 0 ${art.n} ${art.n}`,
	"shape-rendering": "crispEdges"
}, /* @__PURE__ */ h("path", { d: outline(art) })) : /* @__PURE__ */ h("span", { class: Pictures_module_default.thumb }, "?");
var Pictures = ({ key, state, actions }) => {
	const { n } = state.game;
	const pool = artFor(n);
	return /* @__PURE__ */ h(Overlay, {
		key,
		onKeyDown: (event) => event.keyCode === 27 && actions.togglePictures()
	}, /* @__PURE__ */ h(Dialog, {
		title: "Choose Picture",
		onClose: actions.togglePictures
	}, /* @__PURE__ */ h("div", { class: Pictures_module_default.root }, /* @__PURE__ */ h("p", { class: Pictures_module_default.text }, pool.length ? `Pick a ${n} × ${n} picture to solve. Times aren't kept for a picture you choose.` : `There are no ${n} × ${n} pictures yet.`), /* @__PURE__ */ h("ul", { class: Pictures_module_default.list }, pool.map((art) => {
		const solved = state.solved.includes(art.id);
		return /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("button", {
			type: "button",
			class: Pictures_module_default.option,
			onclick: () => actions.choosePicture(art.id)
		}, /* @__PURE__ */ h(Thumb, {
			art,
			solved
		}), /* @__PURE__ */ h("span", { class: Pictures_module_default.label }, solved ? art.name : "Unsolved"), /* @__PURE__ */ h("span", { class: Pictures_module_default.level }, levelNames[levelOf(art)])));
	})), /* @__PURE__ */ h("div", { class: Pictures_module_default.footer }, /* @__PURE__ */ h(Button, {
		type: "button",
		onClick: actions.togglePictures,
		onCreate: (el) => el.focus()
	}, /* @__PURE__ */ h("span", { class: About_module_default.button }, "Cancel"))))));
};
//#endregion
//#region src/nonograms/About.jsx
var NonogramsAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "Nonograms Plus",
	actions
}, /* @__PURE__ */ h("p", null, "Picture logic puzzles: the numbers beside each row and above each column give the lengths of its runs of filled cells, in order, with at least one empty cell between runs. Fill the cells that match every clue."), /* @__PURE__ */ h("p", null, "Every board has exactly one solution and can be solved by logic alone. Nonograms were devised in 1987 by Non Ishida and, independently, Tetsuya Nishio. The pictures are drawn for Puzzles Plus and free to reuse (CC0)."), /* @__PURE__ */ h("p", null, "Part of Puzzles Plus by fexofenadine, sharing its window, themes and backgrounds with Minesweeper Plus, which is based on", " ", /* @__PURE__ */ h(Link, { href: "https://github.com/frenzzy/minesweeper" }, "Minesweeper"), " by Vladimir Kutepov."));
//#endregion
//#region src/nonograms/app.jsx
var loadChoice = () => {
	const saved = parseInt(load("nonograms.size"), 10);
	const n = sizes.includes(saved) ? saved : 10;
	const level = parseInt(load("nonograms.level"), 10);
	if (!(level >= 0 && level < levelNames.length)) return {
		n,
		level: 0
	};
	return {
		n,
		level: fallback(n, level)
	};
};
var createGame = ({ n, level }) => ({
	n,
	level,
	clues: Array.from({ length: 2 * n }, () => []),
	solution: null,
	board: emptyBoard(n),
	history: [],
	change: 0,
	stroke: null,
	dealing: true,
	deal: 0,
	start: -1,
	time: 0,
	raf: null,
	paused: false,
	pausedAt: 0,
	win: false,
	hinted: false,
	untimed: false,
	art: null,
	picked: false
});
var boardOf = (cells, n) => {
	check(Array.isArray(cells) && cells.length === n * n && cells.every((v) => v >= -1 && v <= 1));
	return Int8Array.from(cells);
};
var saved = resumable({
	key: "nonograms.saved",
	running,
	label: ({ n, level }) => `${n} × ${n} ${levelNames[level]}`,
	pack: ({ n, level, clues, solution, board, stroke, history, hinted, untimed, art, picked }) => ({
		n,
		level,
		clues,
		solution: Array.from(solution),
		board: Array.from(stroke ? stroke.before : board),
		history,
		hinted,
		untimed,
		art,
		picked
	}),
	unpack: ({ n, level, clues, solution, board, history, hinted, untimed, art, picked }) => {
		check(sizes.includes(n) && level >= 0 && level < levelNames.length && Array.isArray(history));
		check(Array.isArray(clues) && clues.length === 2 * n && clues.every(Array.isArray));
		check(!art || typeof art.id === "string" && typeof art.name === "string" && art.level >= 0);
		return {
			...createGame({
				n,
				level
			}),
			clues,
			solution: boardOf(solution, n),
			board: boardOf(board, n),
			history,
			hinted: Boolean(hinted),
			untimed: Boolean(untimed),
			art: art || null,
			picked: Boolean(picked),
			dealing: false
		};
	}
});
var { actions: recordActions } = records("nonograms", sizes, levelNames, true);
var cycle = [
	-1,
	1,
	0
];
var ASK_AFTER = 2500;
var deals = 0;
var changes = 0;
var prevent = (event) => {
	event.preventDefault();
	return false;
};
var begin = (game, actions) => {
	if (game.start >= 0) return game;
	game.raf = requestAnimationFrame(actions.tick);
	return {
		...game,
		start: clock(),
		time: 1
	};
};
var changed = (state, game, board, history, actions, settled = false) => {
	const next = {
		...game,
		board,
		history,
		change: ++changes
	};
	next.win = solved(board, next.n, next.clues);
	if (next.win) {
		cancelAnimationFrame(next.raf);
		if (timed({
			...state,
			game: next
		})) record(next, actions);
	}
	const stuck = !next.win && fillsLeft(board, next.n, next.clues) === 0;
	if (stuck && !settled) setTimeout(() => actions.ask(next.change), ASK_AFTER);
	const done = next.win && next.art ? { solved: markSolved(state.solved, next.art.id) } : null;
	return {
		hint: null,
		prompt: stuck && settled,
		game: next,
		...done
	};
};
var record = (game, actions) => {
	if (!game.art) actions.win({
		...game,
		art: false
	});
	else if (!game.picked && !game.hinted) actions.win({
		...game,
		level: game.art.level,
		art: true
	});
};
var markSolved = (solved, id) => {
	if (solved.includes(id)) return solved;
	const next = [...solved, id];
	save("nonograms.solved", JSON.stringify(next));
	return next;
};
var loadSolved = () => {
	try {
		const list = JSON.parse(load("nonograms.solved"));
		return Array.isArray(list) ? list.filter((id) => typeof id === "string") : [];
	} catch {
		return [];
	}
};
var span = ({ start, axis }, i, n) => {
	const [sx, sy] = [start % n, Math.floor(start / n)];
	const [x, y] = [i % n, Math.floor(i / n)];
	const cells = [];
	if (axis === "row") for (let k = Math.min(sx, x); k <= Math.max(sx, x); k++) cells.push(sy * n + k);
	else if (axis === "column") for (let k = Math.min(sy, y); k <= Math.max(sy, y); k++) cells.push(k * n + sx);
	else cells.push(start);
	return cells;
};
var paint = (stroke, i, n) => {
	const board = stroke.before.slice();
	for (const c of span(stroke, i, n)) if (board[c] === stroke.from) board[c] = stroke.to;
	return board;
};
var axisOf = (stroke, i, n) => {
	if (stroke.axis || i === stroke.start) return stroke.axis;
	return Math.abs(i % n - stroke.start % n) >= Math.abs(Math.floor(i / n) - Math.floor(stroke.start / n)) ? "row" : "column";
};
var cellAt = (event) => {
	const target = document.elementFromPoint?.(event.clientX, event.clientY);
	const cell = target && target.closest("[data-cell]");
	return cell ? Number(cell.dataset.cell) : -1;
};
var state = {
	...shellState("nonograms"),
	hint: null,
	prompt: false,
	errors: Boolean(load("nonograms.errors")),
	timer: loadTimer("nonograms.timer"),
	rain: Boolean(load("nonograms.rain")),
	procedural: load("nonograms.procedural") !== "off",
	symmetric: load("nonograms.symmetric") !== "off",
	pictures: false,
	solved: loadSolved(),
	touch: Boolean(window.matchMedia && matchMedia("(pointer: coarse)").matches),
	mode: 1,
	about: false,
	shelf: saved.list(),
	game: saved.restore() || createGame(loadChoice()),
	winner: null,
	bestTime: null
};
var actions = {
	...shellActions,
	init: () => (state, actions) => {
		window.addEventListener("keydown", actions.press);
		window.addEventListener("pointermove", (event) => {
			const i = cellAt(event);
			if (i >= 0) actions.drag(i);
		});
		window.addEventListener("pointerup", () => actions.up());
		window.addEventListener("pointercancel", () => actions.up());
		listen(actions);
		showRain(state.rain);
		if (state.game.dealing) actions.reset();
	},
	press: (event) => (state, actions) => {
		if ((event.ctrlKey || event.metaKey) && !event.altKey && event.keyCode === 90) {
			if (typing(event) || state.boss || state.windowState !== "open") return;
			event.preventDefault();
			actions.undo();
			return;
		}
		const key = shortcut(event, state, actions);
		if (key === 113 || key === 78) actions.newGame();
		else if (key === 72) actions.hint();
		else if (key === 80) actions.pause();
	},
	reset: (payload) => ({ game, procedural, symmetric }, actions) => {
		cancelAnimationFrame(game.raf);
		const n = payload && payload.n || game.n;
		const asked = payload && payload.level !== void 0 ? payload.level : game.level;
		const level = fallback(n, asked);
		const pick = payload && payload.pick || null;
		save("nonograms.size", n);
		save("nonograms.level", level);
		const id = ++deals;
		deal(n, level, Math.floor(Math.random() * 2 ** 32), {
			art: Boolean(pick) || !procedural,
			pick,
			avoid: game.art && game.art.id,
			symmetric
		}).then((dealt) => actions.dealt({
			id,
			...dealt
		}));
		return {
			menu: null,
			hint: null,
			prompt: false,
			game: {
				...createGame({
					n,
					level
				}),
				deal: id,
				picked: Boolean(pick)
			}
		};
	},
	dealt: ({ id, clues, solution, level, art }) => ({ game }) => {
		if (game.deal !== id) return null;
		const picture = art ? {
			...art,
			level
		} : null;
		return { game: {
			...game,
			clues,
			solution,
			dealing: false,
			art: picture
		} };
	},
	down: ({ event, i }) => ({ game, mode }, actions) => {
		if (event.button !== 0 && event.button !== 2) return null;
		if (game.dealing || game.paused || game.win || game.stroke) return null;
		const touch = event.pointerType === "touch";
		const from = game.board[i];
		let to = cycle[(cycle.indexOf(from) + (event.button === 2 ? 2 : 1)) % 3];
		if (touch) to = from === mode ? -1 : mode;
		const stroke = {
			start: i,
			from,
			to,
			axis: null,
			before: game.board,
			touch
		};
		return {
			...touch && { touch },
			game: {
				...begin(game, actions),
				stroke,
				board: paint(stroke, i, game.n)
			}
		};
	},
	drag: (i) => ({ game }) => {
		const { stroke, n } = game;
		if (!stroke) return null;
		const next = {
			...stroke,
			axis: axisOf(stroke, i, n)
		};
		const board = paint(next, i, n);
		if (board.every((v, c) => v === game.board[c])) return null;
		return { game: {
			...game,
			stroke: next,
			board
		} };
	},
	up: () => (state, actions) => {
		const { game } = state;
		const { stroke, board } = game;
		if (!stroke) return null;
		const step = [...board.keys()].filter((c) => board[c] !== stroke.before[c]).map((c) => [c, stroke.before[c]]);
		const history = step.length ? [...game.history, step] : game.history;
		const passing = step.length === 1 && stroke.from === -1 && stroke.to === 1 && !stroke.touch;
		return changed(state, {
			...game,
			stroke: null
		}, board, history, actions, !passing);
	},
	undo: () => (state, actions) => {
		const { game } = state;
		if (!game.history.length || game.win || game.paused || game.dealing || game.stroke) return { menu: null };
		const board = game.board.slice();
		for (const [c, from] of game.history[game.history.length - 1]) board[c] = from;
		return {
			menu: null,
			...changed(state, game, board, game.history.slice(0, -1), actions)
		};
	},
	ask: (change) => ({ game }) => {
		if (game.change !== change || game.win || game.paused || game.stroke) return null;
		return { prompt: fillsLeft(game.board, game.n, game.clues) === 0 };
	},
	hint: () => ({ game }, actions) => {
		if (game.dealing || game.win || game.paused || game.stroke) return { menu: null };
		const { board, solution, clues, n } = game;
		return {
			menu: null,
			prompt: false,
			hint: findHint({
				board,
				solution,
				clues,
				n
			}),
			game: {
				...begin(game, actions),
				hinted: true
			}
		};
	},
	answerPrompt: (yes) => (state, actions) => {
		if (yes) actions.hint();
		return { prompt: false };
	},
	setMode: (mode) => ({ mode }),
	toggleErrors: () => (state) => {
		save("nonograms.errors", state.errors ? "" : "yes");
		return {
			menu: null,
			errors: !state.errors
		};
	},
	toggleTimer: timerAction("nonograms.timer"),
	toggleRain: () => (state) => {
		save("nonograms.rain", state.rain ? "" : "yes");
		showRain(!state.rain);
		return {
			menu: null,
			rain: !state.rain
		};
	},
	toggleProcedural: () => (state) => {
		save("nonograms.procedural", state.procedural ? "off" : "");
		return {
			menu: null,
			procedural: !state.procedural
		};
	},
	toggleSymmetric: () => (state) => {
		save("nonograms.symmetric", state.symmetric ? "off" : "");
		return {
			menu: null,
			symmetric: !state.symmetric
		};
	},
	togglePictures: () => ({ pictures }) => ({
		menu: null,
		pictures: !pictures
	}),
	choosePicture: (id) => (state, actions) => {
		actions.newGame({ pick: id });
		return { pictures: false };
	},
	toggleAbout: () => ({ about }) => ({
		menu: null,
		about: !about
	}),
	pause: pauseAction(running),
	tick: () => ({ game }, actions) => {
		game.raf = requestAnimationFrame(actions.tick);
		const next = seconds(game.start);
		if (game.time === next) return null;
		return { game: {
			...game,
			time: next
		} };
	},
	...recordActions,
	...saved.actions
};
var view = (state, actions) => /* @__PURE__ */ h("main", {
	oncontextmenu: prevent,
	ondragstart: prevent,
	oncreate: actions.init,
	onupdate: () => saved.keep(state.game)
}, /* @__PURE__ */ h(Game, {
	key: "a",
	state,
	actions
}), /* @__PURE__ */ h(Taskbar, {
	key: "h",
	name: "Nonograms Plus",
	state,
	actions
}), state.winner && /* @__PURE__ */ h(Winner, {
	key: "b",
	state: state.winner,
	actions
}), state.bestTime && /* @__PURE__ */ h(BestTimes, {
	key: "c",
	title: "Fastest Nonogram Solvers",
	sizes,
	levelNames,
	allowed,
	art: true,
	state: state.bestTime,
	actions
}), state.prompt && /* @__PURE__ */ h(Prompt, {
	key: "d",
	title: "Nonograms",
	text: "All the filled cells are placed but there are errors. Do you want to use a hint?",
	actions
}), state.backgroundSettings && /* @__PURE__ */ h(BackgroundSettings, {
	key: "e",
	state: state.backgroundSettings,
	actions
}), state.pictures && /* @__PURE__ */ h(Pictures, {
	key: "l",
	state,
	actions
}), state.switching && /* @__PURE__ */ h(Switching, {
	key: "k",
	title: "Nonograms",
	actions
}), state.about && /* @__PURE__ */ h(NonogramsAbout, {
	key: "f",
	actions
}), state.howTo && /* @__PURE__ */ h(NonogramsHowToPlay, {
	key: "i",
	actions
}), state.openGames && /* @__PURE__ */ h(OpenGames, {
	key: "j",
	state,
	actions
}), state.boss && /* @__PURE__ */ h(Boss, {
	key: "g",
	state: state.boss,
	actions
}));
//#endregion
//#region src/nonograms/index.js
app(state, actions, view, document.getElementById("app"));
startBackgrounds();
registerWorker();
//#endregion
