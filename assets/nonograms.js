import { $ as Overlay, A as shareAction, D as historyKey, E as gameKey, L as codeOf, M as shellState, N as shortcut, O as listen, P as toggleAction, Q as Button, R as partsOf, U as BackgroundSettings, V as Boss, Z as Dialog, a as Taskbar, c as DAILY_BUDGET, d as finish, i as About_module_default, it as save, j as shellActions, k as prevent, m as special, n as About, nt as load, ot as h, p as seedOf, st as __exportAll, u as dayOf, z as sharedCode } from "./HowToPlay-B-GK6Mo_.js";
import { _ as check, b as OpenGames, g as boardOf, i as Switching, n as FireworksCanvas, r as celebrate, t as start, u as tally, v as resumable, x as Winner } from "./start-kzk86FJi.js";
import { i as Prompt, t as records } from "./records-BZ7Vxfhr.js";
import { S as timerAction, b as tickAction, g as pauseAction, m as loadTimer, v as startClock, y as stopTick } from "./Board-BuZpLT6t.js";
import { n as cellsOf } from "./grid-BZP-Z9Tf.js";
import { i as BestTimes, r as dealer, t as random } from "./random-DaCutWSS.js";
import { t as showRain } from "./rain-D7NoZOvq.js";
import { C as solved, S as sizes, _ as deduce, b as fillsLeft, c as levelNames, d as levels$1, g as countSolutions, h as solveAt, m as rate, o as allowed, r as running, s as fallback, t as Game, u as findHint, v as cluesOf, y as emptyBoard } from "./Game-CpkCQd8V.js";
import { t as NonogramsHowToPlay } from "./HowToPlay-B-498h6I.js";
//#region src/nonograms/generate.js
var filled = (cells, n) => {
	const lines = cellsOf(n);
	const edges = [
		lines[0],
		lines[n - 1],
		lines[n],
		lines[2 * n - 1]
	];
	return (n <= 10 ? lines : edges).every((line) => line.some((k) => cells[k]));
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
	"./art/10/heart.txt": "name: Heart\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n.###..###.\n##########\n##########\n##########\n.########.\n.########.\n..######..\n...####...\n....##....\n....##....\n",
	"./art/10/smiley.txt": "name: Smiley\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..######..\n.########.\n##########\n##.####.##\n##########\n##########\n##.####.##\n###....###\n.########.\n..######..\n",
	"./art/10/tree.txt": "name: Tree\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n....##....\n...####...\n..######..\n...####...\n..######..\n.########.\n##########\n....##....\n....##....\n....##....\n",
	"./art/15/heart.txt": "name: Heart\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..####...####..\n.######.######.\n###############\n###############\n###############\n###############\n###############\n.#############.\n.#############.\n..###########..\n...#########...\n....#######....\n.....#####.....\n......###......\n.......#.......\n",
	"./art/15/mushroom.txt": "name: Mushroom\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n....#######....\n..###########..\n.####.###.####.\n###############\n####..###..####\n###############\n.#############.\n..###########..\n.....#####.....\n.....#####.....\n.....#####.....\n.....#####.....\n.....#####.....\n....#######....\n...#########...\n",
	"./art/15/rocket.txt": "name: Rocket\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n.......#.......\n......###......\n.....#####.....\n....#######....\n....#######....\n....##...##....\n....##...##....\n....#######....\n....#######....\n..##.#####.##..\n.###..###..###.\n###...###...###\n......###......\n.....#####.....\n.....#####.....\n",
	"./art/20/cat.txt": "name: Cat\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..##............##..\n..####........####..\n..################..\n.##################.\n####################\n####################\n#####..######..#####\n#####..######..#####\n####################\n####################\n#########..#########\n########.##.########\n#########..#########\n.##################.\n.##################.\n..################..\n...##############...\n....############....\n.....##########.....\n......########......\n",
	"./art/20/trophy.txt": "name: Trophy\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..################..\n..################..\n##.##############.##\n#..##############..#\n#..##############..#\n##.##############.##\n...##############...\n....############....\n.....##########.....\n......########......\n.......######.......\n........####........\n........####........\n........####........\n.....##########.....\n....############....\n....############....\n..################..\n..################..\n..################..\n",
	"./art/20/umbrella.txt": "name: Umbrella\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n......########......\n....############....\n..################..\n.##################.\n####################\n####################\n###.###.####.###.###\n........####........\n........####........\n........####........\n........####........\n........####........\n........####........\n........####........\n........####........\n........####........\n........####........\n.......######.......\n......########......\n......########......\n",
	"./art/25/butterfly.txt": "name: Butterfly\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n#####......#.#......#####\n#######...........#######\n########.........########\n#########..###..#########\n##########.###.##########\n##########.###.##########\n##########.###.##########\n##########.###.##########\n#########..###..#########\n#########..###..#########\n.########..###..########.\n...######..###..######...\n....#####..###..#####....\n..#######..###..#######..\n.#########.###.#########.\n##########.###.##########\n##########.###.##########\n.#########.###.#########.\n..#######..###..#######..\n...#####...###...#####...\n....###....###....###....\n.....##....###....##.....\n...........###...........\n...........###...........\n...........###...........\n",
	"./art/25/castle.txt": "name: Castle\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n............#............\n...........###...........\n..........#####..........\n.........#######.........\n........#########........\n##.##.##.#######.##.##.##\n########.#######.########\n########.#######.########\n###..###.#######.###..###\n###..###.#######.###..###\n########.#######.########\n########.#######.########\n#########################\n#########################\n#########################\n#########################\n#########################\n#########################\n##########.....##########\n##########.....##########\n##########.....##########\n##########.....##########\n##########.....##########\n##########.....##########\n##########.....##########\n",
	"./art/25/pine.txt": "name: Pine Tree\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n............#............\n...........###...........\n...........###...........\n..........#####..........\n.........#######.........\n..........#####..........\n........#########........\n.......###########.......\n........#########........\n......#############......\n.....###############.....\n....#################....\n......#############......\n.....###############.....\n....#################....\n...###################...\n..#####################..\n.#######################.\n#########################\n..........#####..........\n..........#####..........\n..........#####..........\n..........#####..........\n..........#####..........\n........#########........\n",
	"./art/5/arrow.txt": "name: Arrow\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..#..\n.###.\n#.#.#\n..#..\n..#..\n",
	"./art/5/heart.txt": "name: Heart\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n.#.#.\n#####\n#####\n.###.\n..#..\n",
	"./art/5/house.txt": "name: House\ncredit: drawn for Puzzles Plus\nlicence: CC0\nsource: original\n---\n..#..\n.###.\n#####\n##.##\n##.##\n"
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
var deal$1 = ({ n, level, seed, art = false, pick = null, avoid = null, symmetric = true, budget }) => {
	const rng = random(seed);
	return art && pickArt(n, level, rng, pick, avoid) || makeGame(n, level, rng, budget, symmetric);
};
//#endregion
//#region src/nonograms/deal.js
var dealOne = dealer(() => new Worker(new URL(
	/* @vite-ignore */
	new URL("deal.worker-Bz1MbO-C.js", import.meta.url).href,
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
	actions,
	credits: [/* @__PURE__ */ h("li", null, "The pictures are drawn for Puzzles Plus and free to reuse (CC0).")]
}, /* @__PURE__ */ h("p", null, "Picture logic puzzles: the numbers beside each row and above each column give the lengths of its runs of filled cells, in order, with at least one empty cell between runs. Fill the cells that match every clue."), /* @__PURE__ */ h("p", null, "Boards from 5 × 5 to 25 × 25 in four levels, drawn at random or picked from a pool of pictures, each with exactly one solution that logic alone finds. Hints explain their reasoning and link to the guide."), /* @__PURE__ */ h("p", null, "Nonograms were devised in 1987 by Non Ishida and, independently, Tetsuya Nishio."));
//#endregion
//#region src/nonograms/app.jsx
var app_exports = /* @__PURE__ */ __exportAll({
	actions: () => actions,
	createGame: () => createGame,
	gameOf: () => gameOf,
	saved: () => saved,
	state: () => state,
	view: () => view
});
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
	future: [],
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
	daily: null,
	shared: false,
	art: null,
	picked: false
});
var saved = resumable({
	key: "nonograms.saved",
	running,
	label: ({ n, level }) => `${n} × ${n} ${levelNames[level]}`,
	pack: ({ n, level, clues, solution, board, stroke, history, future, hinted, untimed, art, picked, daily, shared }) => ({
		n,
		level,
		clues,
		solution: Array.from(solution),
		board: Array.from(stroke ? stroke.before : board),
		history,
		future,
		hinted,
		untimed,
		art,
		picked,
		daily,
		shared
	}),
	unpack: ({ n, level, clues, solution, board, history, future, hinted, untimed, art, picked, daily, shared }) => {
		check(sizes.includes(n) && level >= 0 && level < levelNames.length && Array.isArray(history));
		check(Array.isArray(clues) && clues.length === 2 * n && clues.every(Array.isArray));
		check(!art || typeof art.id === "string" && typeof art.name === "string" && art.level >= 0);
		return {
			...createGame({
				n,
				level
			}),
			clues,
			solution: boardOf(solution, n, -1, 1),
			board: boardOf(board, n, -1, 1),
			history,
			future: Array.isArray(future) ? future : [],
			hinted: Boolean(hinted),
			untimed: Boolean(untimed),
			daily: typeof daily === "string" ? daily : null,
			shared: Boolean(shared),
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
var changed = (state, game, board, history, actions, settled = false) => {
	const future = history === game.history ? game.future : [];
	const next = {
		...game,
		board,
		history,
		future,
		change: ++changes
	};
	next.win = solved(board, next.n, next.clues);
	if (next.win) {
		stopTick(next.raf);
		celebrate();
		if (!state.game.win) tally("nonograms", {
			won: true,
			clean: !next.hinted
		});
		finish("nonograms", state, next, actions, record);
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
var DAILY = {
	n: 10,
	level: 1
};
var shareCode = ({ n, level, solution }) => codeOf(n, level, Array.from(solution, (v) => v === 1 ? 1 : 0), 2);
var gameOf = (code) => {
	const parts = partsOf(code, 2, (n, level) => sizes.includes(n) && allowed(n, level));
	if (!parts) return null;
	const { n, level, values } = parts;
	const solution = Int8Array.from(values, (v) => v ? 1 : 0);
	const clues = cluesOf(solution, n);
	if (!filled(values, n) || countSolutions(clues, n, 2) !== 1) return null;
	return {
		...createGame({
			n,
			level
		}),
		clues,
		solution,
		dealing: false,
		shared: true
	};
};
var linkedGame = () => {
	const code = sharedCode();
	return code && gameOf(code);
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
var opened = saved.open(linkedGame());
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
	shelf: saved.list(),
	game: opened || createGame(loadChoice()),
	winner: null,
	bestTime: null
};
var actions = {
	...shellActions,
	init: () => (state, actions) => {
		window.addEventListener("keydown", actions.press);
		window.addEventListener("pointermove", actions.trace);
		window.addEventListener("pointerup", () => actions.up());
		window.addEventListener("pointercancel", () => actions.up());
		listen(actions);
		showRain(state.rain);
		if (state.game.dealing) actions.reset();
	},
	press: (event) => (state, actions) => {
		if (historyKey(event, state, actions)) return;
		gameKey(shortcut(event, state, actions), actions);
	},
	reset: (payload) => ({ game, procedural, symmetric }, actions) => {
		stopTick(game.raf);
		const day = payload && payload.daily ? dayOf() : null;
		const base = day ? DAILY : special(game) ? loadChoice() : game;
		const n = payload && payload.n || base.n;
		const asked = payload && payload.level !== void 0 ? payload.level : base.level;
		const level = fallback(n, asked);
		const seed = day ? seedOf(day, "nonograms") : Math.floor(Math.random() * 2 ** 32);
		const pick = payload && payload.pick || null;
		if (!day) {
			save("nonograms.size", n);
			save("nonograms.level", level);
		}
		const id = ++deals;
		deal(n, level, seed, day ? { budget: DAILY_BUDGET } : {
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
				picked: Boolean(pick),
				daily: day
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
				...startClock(game, actions),
				stroke,
				board: paint(stroke, i, game.n)
			}
		};
	},
	trace: (event) => (state, actions) => {
		if (!state.game.stroke) return;
		const i = cellAt(event);
		if (i >= 0) actions.drag(i);
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
		const step = game.history.at(-1);
		const board = game.board.slice();
		for (const [c, from] of step) board[c] = from;
		const next = changed(state, game, board, game.history.slice(0, -1), actions);
		next.game.future = [...game.future, step.map(([c]) => [c, game.board[c]])];
		return {
			menu: null,
			...next
		};
	},
	redo: () => (state, actions) => {
		const { game } = state;
		if (!game.future.length || game.win || game.paused || game.dealing || game.stroke) return { menu: null };
		const step = game.future.at(-1);
		const board = game.board.slice();
		for (const [c, to] of step) board[c] = to;
		const next = changed(state, game, board, [...game.history, step.map(([c]) => [c, game.board[c]])], actions);
		next.game.future = game.future.slice(0, -1);
		return {
			menu: null,
			...next
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
				...startClock(game, actions),
				hinted: true
			}
		};
	},
	answerPrompt: (yes) => (state, actions) => {
		if (yes) actions.hint();
		return { prompt: false };
	},
	setMode: (mode) => ({ mode }),
	toggleErrors: toggleAction("errors", "nonograms.errors", "yes"),
	toggleTimer: timerAction("nonograms.timer"),
	toggleRain: () => (state) => {
		save("nonograms.rain", state.rain ? "" : "yes");
		showRain(!state.rain);
		return {
			menu: null,
			rain: !state.rain
		};
	},
	toggleProcedural: toggleAction("procedural", "nonograms.procedural", "", "off"),
	toggleSymmetric: toggleAction("symmetric", "nonograms.symmetric", "", "off"),
	togglePictures: () => ({ pictures }) => ({
		menu: null,
		pictures: !pictures
	}),
	choosePicture: (id) => (state, actions) => {
		actions.newGame({ pick: id });
		return { pictures: false };
	},
	share: shareAction(shareCode),
	pause: pauseAction(running),
	tick: tickAction,
	...recordActions,
	...saved.actions
};
var view = (state, actions) => /* @__PURE__ */ h("main", {
	oncontextmenu: prevent,
	ondragstart: prevent,
	oncreate: actions.init,
	onupdate: () => saved.keep(state.game)
}, /* @__PURE__ */ h(FireworksCanvas, { key: "fw" }), /* @__PURE__ */ h(Game, {
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
start(app_exports);
//#endregion
