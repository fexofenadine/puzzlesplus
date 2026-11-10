import { z as h } from "./HowToPlay-CY1p7JOT.js";
var Cell_module_default = {
	root: "Cell_root",
	pressed: "Cell_pressed Cell_root",
	image: "Cell_image",
	hurt: "Cell_hurt Cell_image",
	n1: "Cell_n1",
	n2: "Cell_n2",
	n3: "Cell_n3",
	n4: "Cell_n4",
	n5: "Cell_n5",
	n6: "Cell_n6",
	n7: "Cell_n7",
	n8: "Cell_n8",
	flagCloth: "Cell_flagCloth",
	wrong: "Cell_wrong",
	mine: "Cell_mine",
	shine: "Cell_shine",
	hintSource: "Cell_hintSource Board_outline",
	hintSafe: "Cell_hintSafe Board_outline",
	hintMine: "Cell_hintMine Board_outline",
	hintWrong: "Cell_hintWrong Board_outline",
	hintUnsure: "Cell_hintUnsure Board_outline"
};
//#endregion
//#region src/Cell.jsx
var inRange = (x, y, u, v) => u >= 0 && v >= 0 && (x - u - 1) * (x - u + 1) <= 0 && (y - v - 1) * (y - v + 1) <= 0;
var Num1 = () => /* @__PURE__ */ h("path", {
	class: Cell_module_default.n1,
	d: "M4 12v-2h2V6H4V5l3-3h2v8h2v2H4z"
});
var Num2 = () => /* @__PURE__ */ h("path", {
	class: Cell_module_default.n2,
	d: "M2 12h10v-2H6v-.5L11 7l1-1V3l-1-1H3L2 3v2h3V4h4v1L8 6 2 9v3z"
});
var Num3 = () => /* @__PURE__ */ h("path", {
	class: Cell_module_default.n3,
	d: "M2 10h7V8H5V6h4V4H2V2h9l1 1v3l-1 1 1 1v3l-1 1H2v-2z"
});
var Num4 = () => /* @__PURE__ */ h("path", {
	class: Cell_module_default.n4,
	d: "M8 12h3V8h1V6h-1V2H8v4H5l2-4H4L2 6v2h6v4z"
});
var Num5 = () => /* @__PURE__ */ h("path", {
	class: Cell_module_default.n5,
	d: "M2 2h10v2H5v2h6l1 1v4l-1 1H2v-2h7V8H2V2z"
});
var Num6 = () => /* @__PURE__ */ h("path", {
	class: Cell_module_default.n6,
	d: "M11 6H5V4h6V2H3L2 3v8l1 1h8l1-1V7zm-2 4H5V8h4z"
});
var Num7 = () => /* @__PURE__ */ h("path", {
	class: Cell_module_default.n7,
	d: "M2 2h10v4l-3 6H6l3-6V4H2V2z"
});
var Num8 = () => /* @__PURE__ */ h("path", {
	class: Cell_module_default.n8,
	d: "M12 3l-1-1H3L2 3v3l1 1-1 1v3l1 1h8l1-1V8l-1-1 1-1zm-3 7H5V8h4zm0-4H5V4h4z"
});
var Flag = () => /* @__PURE__ */ h("g", { class: Cell_module_default.flag }, /* @__PURE__ */ h("path", { d: "M9 10.5V3H8v7l-4 2v1h8v-1z" }), /* @__PURE__ */ h("path", {
	class: Cell_module_default.flagCloth,
	d: "M9 3v5H8L4 5.5 8 3z"
}));
var Mark = () => /* @__PURE__ */ h("text", {
	x: "50%",
	y: "50%",
	dx: ".5",
	dy: ".4em",
	"text-anchor": "middle"
}, "?");
var Fail = () => /* @__PURE__ */ h("path", {
	class: Cell_module_default.wrong,
	d: "M13.854 1.854l-.708-.708L7.5 6.793 1.854 1.146l-.708.708L6.793 7.5l-5.647 5.646.708.708L7.5 8.207l5.646 5.647.708-.708L8.207 7.5l5.647-5.646z"
});
var Mine = () => /* @__PURE__ */ h("g", { class: Cell_module_default.mine }, /* @__PURE__ */ h("path", { d: "M13.5 7h-1.55A4.445 4.445 0 0 0 11 4.705l.741-.741a.5.5 0 1 0-.707-.707l-.74.743A4.446 4.446 0 0 0 8 3.05V1.5a.5.5 0 0 0-1 0v1.55A4.452 4.452 0 0 0 4.705 4l-.741-.741a.5.5 0 0 0-.707.707L4 4.705A4.452 4.452 0 0 0 3.05 7H1.5a.5.5 0 0 0 0 1h1.55A4.446 4.446 0 0 0 4 10.294l-.741.741a.5.5 0 0 0 .354.854.5.5 0 0 0 .353-.147L4.705 11A4.445 4.445 0 0 0 7 11.95v1.55a.5.5 0 0 0 1 0v-1.55a4.452 4.452 0 0 0 2.3-.95l.74.74a.5.5 0 0 0 .707-.707L11 10.3a4.452 4.452 0 0 0 .95-2.3h1.55a.5.5 0 0 0 0-1z" }), /* @__PURE__ */ h("circle", {
	class: Cell_module_default.shine,
	cx: "6",
	cy: "6",
	r: "1"
}));
var Symbol = ({ opened, mined, flag, mark, num, lose }) => {
	if (opened) {
		if (mined) return /* @__PURE__ */ h(Mine, null);
		switch (num) {
			case 1: return /* @__PURE__ */ h(Num1, null);
			case 2: return /* @__PURE__ */ h(Num2, null);
			case 3: return /* @__PURE__ */ h(Num3, null);
			case 4: return /* @__PURE__ */ h(Num4, null);
			case 5: return /* @__PURE__ */ h(Num5, null);
			case 6: return /* @__PURE__ */ h(Num6, null);
			case 7: return /* @__PURE__ */ h(Num7, null);
			case 8: return /* @__PURE__ */ h(Num8, null);
			default: return null;
		}
	}
	if (flag) {
		if (lose && !mined) return /* @__PURE__ */ h("g", null, /* @__PURE__ */ h(Mine, null), /* @__PURE__ */ h(Fail, null));
		return /* @__PURE__ */ h(Flag, null);
	}
	if (lose && mined) return /* @__PURE__ */ h(Mine, null);
	if (mark) return /* @__PURE__ */ h(Mark, null);
	return null;
};
var hintClass = {
	source: Cell_module_default.hintSource,
	safe: Cell_module_default.hintSafe,
	mine: Cell_module_default.hintMine,
	wrong: Cell_module_default.hintWrong,
	unsure: Cell_module_default.hintUnsure
};
var isPressed = ({ x, y, pressed, pressedX, pressedY, group, opened, mined, flag, lose }) => opened || pressed && !flag && pressedX === x && pressedY === y || group && !flag && inRange(x, y, pressedX, pressedY) || lose && (!flag && mined || flag && !mined);
var Cell = ({ x, y, pressed, pressedX, pressedY, group, opened, mined, flag, mark, num, lose, hint, onDown, onMove, onTouch, onChord }) => /* @__PURE__ */ h("button", {
	type: "button",
	class: [isPressed({
		x,
		y,
		pressed,
		pressedX,
		pressedY,
		group,
		opened,
		mined,
		flag,
		lose
	}) ? Cell_module_default.pressed : Cell_module_default.root, hint && hintClass[hint]].filter(Boolean).join(" "),
	tabindex: -1,
	onmousedown: (event) => {
		onDown({
			event,
			x,
			y
		});
	},
	onmouseenter: () => {
		onMove({
			x,
			y
		});
	},
	onmouseleave: () => {
		onMove({
			x: -1,
			y: -1
		});
	},
	ontouchstart: (event) => {
		onTouch({
			event,
			x,
			y
		});
	},
	ondblclick: () => {
		onChord({
			x,
			y
		});
	}
}, /* @__PURE__ */ h("svg", {
	class: opened && mined ? Cell_module_default.hurt : Cell_module_default.image,
	width: "15",
	height: "15"
}, /* @__PURE__ */ h(Symbol, {
	opened,
	mined,
	flag,
	mark,
	num,
	lose
})));
//#endregion
//#region src/mines.js
var neighbourCache = /* @__PURE__ */ new Map();
var neighboursOf = (width, height) => {
	const key = `${width}x${height}`;
	if (!neighbourCache.has(key)) {
		const list = [];
		for (let i = 0; i < width * height; i++) {
			const x = i % width;
			const y = (i - x) / width;
			const around = [];
			for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
				const nx = x + dx;
				const ny = y + dy;
				if ((dx || dy) && nx >= 0 && ny >= 0 && nx < width && ny < height) around.push(ny * width + nx);
			}
			list.push(around);
		}
		neighbourCache.set(key, list);
	}
	return neighbourCache.get(key);
};
var scatter = (size, mines, clear) => {
	const free = [];
	for (let i = 0; i < size; i++) if (!clear.has(i)) free.push(i);
	const mined = new Uint8Array(size);
	for (let n = 0; n < mines; n++) {
		const j = n + Math.floor(Math.random() * (free.length - n));
		const pick = free[j];
		free[j] = free[n];
		free[n] = pick;
		mined[pick] = 1;
	}
	return mined;
};
var UNKNOWN = 0;
var OPEN = 1;
var FLAG = 2;
var solvable = (mined, width, height, start) => {
	const size = width * height;
	const around = neighboursOf(width, height);
	const nums = new Uint8Array(size);
	let mines = 0;
	for (let i = 0; i < size; i++) {
		if (mined[i]) mines++;
		for (const n of around[i]) nums[i] += mined[n];
	}
	if (mined[start]) return false;
	const state = new Uint8Array(size);
	let opened = 0;
	let flagged = 0;
	const open = (first) => {
		const stack = [first];
		while (stack.length) {
			const i = stack.pop();
			if (state[i] !== UNKNOWN) continue;
			state[i] = OPEN;
			opened++;
			if (nums[i] === 0) {
				for (const n of around[i]) if (state[n] === UNKNOWN) stack.push(n);
			}
		}
	};
	const flag = (i) => {
		if (state[i] !== UNKNOWN) return;
		state[i] = FLAG;
		flagged++;
	};
	const frontier = (i) => {
		const unknown = [];
		let need = nums[i];
		for (const n of around[i]) if (state[n] === UNKNOWN) unknown.push(n);
		else if (state[n] === FLAG) need--;
		return {
			unknown,
			need
		};
	};
	open(start);
	while (opened < size - mines) {
		let progress = false;
		for (let i = 0; i < size; i++) {
			if (state[i] !== OPEN || !nums[i]) continue;
			const { unknown, need } = frontier(i);
			if (!unknown.length) continue;
			if (need === 0) unknown.forEach(open);
			else if (need === unknown.length) unknown.forEach(flag);
			else continue;
			progress = true;
		}
		if (!progress) for (let a = 0; a < size && !progress; a++) {
			if (state[a] !== OPEN || !nums[a]) continue;
			const A = frontier(a);
			if (!A.unknown.length) continue;
			const inA = new Set(A.unknown);
			const nearby = new Set(A.unknown.flatMap((u) => around[u]));
			for (const b of nearby) {
				if (b === a || state[b] !== OPEN || !nums[b]) continue;
				const B = frontier(b);
				if (B.unknown.length <= A.unknown.length) continue;
				if (!A.unknown.every((u) => B.unknown.includes(u))) continue;
				const rest = B.unknown.filter((u) => !inA.has(u));
				const extra = B.need - A.need;
				if (extra === 0) rest.forEach(open);
				else if (extra === rest.length) rest.forEach(flag);
				else continue;
				progress = true;
				break;
			}
		}
		if (!progress) {
			const left = mines - flagged;
			const unknown = [];
			for (let i = 0; i < size; i++) if (state[i] === UNKNOWN) unknown.push(i);
			if (left === 0) unknown.forEach(open);
			else if (left === unknown.length) unknown.forEach(flag);
			else return false;
		}
	}
	return true;
};
var placeMines = ({ width, height, mines, x, y, safe, noGuess, budget = 1500 }) => {
	const size = width * height;
	const start = y * width + x;
	const around = neighboursOf(width, height);
	let clear = /* @__PURE__ */ new Set();
	if (noGuess) clear = /* @__PURE__ */ new Set([start, ...around[start]]);
	else if (safe) clear = /* @__PURE__ */ new Set([start]);
	if (size - clear.size < mines) clear = new Set(safe || noGuess ? [start] : []);
	if (!noGuess) return {
		mined: scatter(size, mines, clear),
		solvable: false
	};
	const deadline = Date.now() + budget;
	let mined;
	do {
		mined = scatter(size, mines, clear);
		if (solvable(mined, width, height, start)) return {
			mined,
			solvable: true
		};
	} while (Date.now() < deadline);
	return {
		mined,
		solvable: false
	};
};
//#endregion
//#region src/hint.js
var count = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
var allMines = (n) => n === 1 ? "it is a mine" : "they are all mines";
var where = (a, b, width, transposed) => {
	const across = b % width - a % width;
	const down = Math.floor(b / width) - Math.floor(a / width);
	const [dx, dy] = transposed ? [down, across] : [across, down];
	const v = dy < 0 ? "above" : dy > 0 ? "below" : "";
	const h = dx < 0 ? "left" : dx > 0 ? "right" : "";
	if (v && h) return `${v} and to the ${h} of it`;
	return v ? `${v} it` : `to the ${h} of it`;
};
var hint = (kind, cells, sources, text, role = {
	clear: "safe",
	mine: "mine",
	conflict: "wrong"
}[kind]) => {
	const marks = {};
	sources.forEach((i) => marks[i] = "source");
	cells.forEach((i) => marks[i] = role);
	return {
		kind,
		cells,
		sources,
		marks,
		text
	};
};
var noHint = (text, kind = "none") => hint(kind, [], [], text);
var guideTopic = ({ kind, sources }) => {
	if (kind === "conflict") return "wrong-flags";
	if (kind === "chord") return "chording";
	if (kind === "none") return "guessing";
	if (kind === "start") return "first-click";
	if (!sources.length) return "mine-counter";
	if (sources.length > 1) return "shared-cells";
	return kind === "clear" ? "safe-cells" : "all-mines";
};
var explainChord = ({ field, width, height }, x, y) => {
	const i = y * width + x;
	const { opened, num } = field[y][x];
	if (!opened || !num) return null;
	const hidden = [];
	const flagged = [];
	for (const n of neighboursOf(width, height)[i]) {
		const c = field[Math.floor(n / width)][n % width];
		if (c.flag) flagged.push(n);
		else if (!c.opened) hidden.push(n);
	}
	const rule = "Chording needs exactly as many flags around a number as it shows.";
	if (flagged.length > num) return hint("chord", flagged, [i], `${rule} This ${num} touches ${count(flagged.length, "flag")}, so at least one of the highlighted flags is wrong.`, "wrong");
	if (flagged.length < num && hidden.length) {
		const has = flagged.length ? `only ${count(flagged.length, "flag")}` : "none";
		return hint("chord", hidden, [i], `${rule} This ${num} has ${has}, so flag ${count(num - flagged.length, "more mine")} among the highlighted cells first.`, "unsure");
	}
	return null;
};
var findHint = ({ field, width, height, minesLeft, transposed = false }) => {
	const around = neighboursOf(width, height);
	const cells = field.flat();
	const numbered = [];
	for (let i = 0; i < width * height; i++) if (cells[i].opened && cells[i].num) numbered.push(i);
	const look = (i) => {
		const hidden = [];
		const flagged = [];
		for (const n of around[i]) if (cells[n].flag) flagged.push(n);
		else if (!cells[n].opened) hidden.push(n);
		return {
			hidden,
			flagged,
			need: cells[i].num - flagged.length
		};
	};
	const seen = new Map(numbered.map((i) => [i, look(i)]));
	for (const i of numbered) {
		const { flagged, need } = seen.get(i);
		if (need < 0) return hint("conflict", flagged, [i], `The highlighted ${cells[i].num} touches ${count(flagged.length, "flag")}, more than its number, so at least one of those flags is wrong.`);
	}
	for (const i of numbered) {
		const { hidden, flagged, need } = seen.get(i);
		if (!hidden.length) continue;
		const num = cells[i].num;
		if (need === 0) return hint("clear", hidden, [i], `The highlighted ${num} already has ${count(flagged.length, "flag")} around it, so its other hidden neighbours are safe.`);
		if (need === hidden.length) {
			const needs = flagged.length ? `touches ${count(flagged.length, "flag")} and needs ${count(need, "more mine")}` : `needs ${count(need, "mine")}`;
			return hint("mine", hidden, [i], `The highlighted ${num} ${needs}, and has exactly ${count(need, "hidden neighbour")} left, so ${allMines(need)}.`);
		}
	}
	for (const a of numbered) {
		const A = seen.get(a);
		if (!A.hidden.length) continue;
		const nearby = new Set(A.hidden.flatMap((u) => around[u]));
		for (const b of nearby) {
			const B = seen.get(b);
			if (b === a || !B || B.hidden.length <= A.hidden.length) continue;
			if (!A.hidden.every((u) => B.hidden.includes(u))) continue;
			const rest = B.hidden.filter((u) => !A.hidden.includes(u));
			const extra = B.need - A.need;
			if (extra !== 0 && extra !== rest.length) continue;
			const shared = `Every hidden cell next to the highlighted ${cells[a].num} is also next to the ${cells[b].num} ${where(a, b, width, transposed)}. Those shared cells hold exactly ${count(A.need, "mine")}`;
			if (extra === 0) return hint("clear", rest, [a, b], `${shared}, which is all the ${cells[b].num} needs, so its other hidden neighbours are safe.`);
			return hint("mine", rest, [a, b], `${shared}, so the ${cells[b].num} needs ${extra} more among its ${count(rest.length, "other hidden neighbour")}, and ${allMines(rest.length)}.`);
		}
	}
	const left = [];
	cells.forEach((c, i) => !c.opened && !c.flag && left.push(i));
	if (left.length && minesLeft === 0) return hint("clear", left, [], "The mine counter is at 0, so every hidden cell without a flag is safe.");
	if (left.length && minesLeft === left.length) return hint("mine", left, [], `The mine counter shows ${minesLeft} and exactly ${count(left.length, "hidden cell")} without a flag ${left.length === 1 ? "is" : "are"} left, so ${allMines(left.length)}.`);
	return noHint("Nothing on the board can be worked out for certain right now, so this needs a guess.");
};
//#endregion
export { neighboursOf as a, noHint as i, findHint as n, placeMines as o, guideTopic as r, Cell as s, explainChord as t };
