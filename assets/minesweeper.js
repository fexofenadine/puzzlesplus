import { D as BackgroundSettings, E as Boss, F as Dialog, I as Button, L as Overlay, M as load, N as remove, O as startBackgrounds, P as save, R as app, S as windowClear, _ as listen, a as Taskbar, b as shortcut, n as About, r as Link, u as Menu, v as shellActions, w as watchWindow, y as shellState, z as h } from "./HowToPlay-B8mFKdpg.js";
import { a as check, c as OpenGames, i as BestTime_module_default, l as Winner, n as Switching, o as resumable, r as Tabs, t as registerWorker, u as Input } from "./worker-BRCwxoE3.js";
import { _ as timed, c as SideButton, d as Digit, f as clock, g as seconds, h as pauseAction, i as windowProps, m as loadTimer, n as PausedCover, p as clockDigits, r as WindowControls, s as HintIcon, t as HintPanel, u as Play, v as timerAction } from "./Board-DQcUInwY.js";
import { t as Game_module_default } from "./Game.module-CghLtUtO.js";
import { i as noHint, n as findHint, o as placeMines, r as guideTopic, s as Cell, t as explainChord } from "./hint-jARodJ0S.js";
import { t as MinesweeperHowToPlay } from "./HowToPlay-B8higK0l.js";
//#region src/Game.jsx
var more = (hint) => guideTopic(hint) && `guide/#${guideTopic(hint)}`;
var running = ({ start, win, lose }) => start >= 0 && !win && !lose;
var transposed = ({ portrait, game }) => portrait && game.width > game.height;
var rowsOf = (state) => {
	const { field } = state.game;
	if (!transposed(state)) return field.map((row, y) => row.map((cell, x) => ({
		cell,
		x,
		y
	})));
	return field[0].map((_, x) => field.map((row, y) => ({
		cell: row[x],
		x,
		y
	})));
};
var Face = ({ state, actions }) => /* @__PURE__ */ h(Play, {
	pressed: state.game.pressed,
	lose: state.game.lose,
	win: state.game.win,
	onReset: actions.reset
});
var Game = ({ key, state, actions }) => /* @__PURE__ */ h(Dialog, {
	clear: windowClear(state),
	key,
	hidden: state.windowState !== "open",
	title: state.theme === "classic" ? "Minesweeper" : "Minesweeper Plus",
	titleHint: "Double-click for 100% zoom",
	onTitleDoubleClick: () => actions.zoom(0),
	controls: /* @__PURE__ */ h(WindowControls, windowProps(state, actions, state.game.paused, running(state.game))),
	onClose: actions.close,
	onCreate: (dialog) => {
		watchWindow(dialog, actions.fit);
		actions.fit();
	}
}, /* @__PURE__ */ h(Menu, {
	state,
	actions
}), /* @__PURE__ */ h("div", { class: Game_module_default.root }, /* @__PURE__ */ h("div", { class: Game_module_default.scoreboard }, /* @__PURE__ */ h(Digit, { value: state.game.flags }), state.theme === "classic" ? /* @__PURE__ */ h(Face, {
	state,
	actions
}) : /* @__PURE__ */ h("div", { class: Game_module_default.buttons }, /* @__PURE__ */ h(Face, {
	state,
	actions
}), /* @__PURE__ */ h(SideButton, {
	title: "Hint (H)",
	disabled: state.game.win || state.game.lose || state.game.paused,
	onClick: actions.hint
}, /* @__PURE__ */ h(HintIcon, null))), /* @__PURE__ */ h(Digit, {
	value: state.game.time,
	digits: clockDigits(state.theme, state.game.time),
	blank: !state.timer
})), /* @__PURE__ */ h("div", { class: state.game.lose ? Game_module_default.fieldLost : Game_module_default.field }, rowsOf(state).map((row) => /* @__PURE__ */ h("div", { class: running(state.game) && !state.game.paused ? Game_module_default.active : Game_module_default.inactive }, row.map(({ cell, x, y }) => /* @__PURE__ */ h(Cell, {
	x,
	y,
	pressed: state.game.pressed,
	pressedX: state.game.pressedX,
	pressedY: state.game.pressedY,
	group: state.game.group,
	opened: cell.opened && !state.game.paused,
	mined: cell.mined,
	flag: cell.flag && !state.game.paused,
	mark: cell.mark && !state.game.paused,
	num: cell.num,
	hint: !state.game.paused && state.hint && state.hint.marks[y * state.game.width + x],
	lose: state.game.lose,
	onDown: actions.down,
	onMove: actions.move,
	onTouch: actions.touch,
	onChord: actions.chord
})))), state.game.paused && /* @__PURE__ */ h(PausedCover, { onResume: () => actions.pause(false) })), state.hint && !state.game.paused && /* @__PURE__ */ h(HintPanel, {
	text: state.hint.text,
	more: more(state.hint)
})));
//#endregion
//#region src/BestTime.jsx
var tabs = [{
	id: "clean",
	name: "No hints"
}, {
	id: "hinted",
	name: "Hints used"
}];
var BestTime = ({ key, state, actions }) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.toggleBestTime()
}, /* @__PURE__ */ h(Dialog, {
	title: "Fastest Mine Sweepers",
	onClose: actions.toggleBestTime
}, /* @__PURE__ */ h("div", { class: BestTime_module_default.root }, /* @__PURE__ */ h(Tabs, {
	tabs,
	active: state.tab,
	onSelect: actions.setBestTimeTab
}), /* @__PURE__ */ h("table", { class: BestTime_module_default.table }, /* @__PURE__ */ h("tbody", null, state[state.tab].map((row) => /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("td", { class: BestTime_module_default.cell }, row.level, ":"), /* @__PURE__ */ h("td", { class: BestTime_module_default.cell }, row.time, " seconds"), /* @__PURE__ */ h("td", { class: BestTime_module_default.cell }, row.name))))), /* @__PURE__ */ h("div", { class: BestTime_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.resetBestTime
}, /* @__PURE__ */ h("span", { class: BestTime_module_default.button }, "Reset Scores")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.toggleBestTime,
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: BestTime_module_default.button }, "OK"))))));
var CustomField_module_default = {
	root: "CustomField_root",
	row: "CustomField_row",
	name: "CustomField_name",
	value: "CustomField_value",
	footer: "CustomField_footer",
	button: "CustomField_button"
};
//#endregion
//#region src/CustomField.jsx
var CustomField = ({ key, state, actions }) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.toggleCustomField()
}, /* @__PURE__ */ h(Dialog, {
	title: "Custom Field",
	onClose: actions.toggleCustomField
}, /* @__PURE__ */ h("form", {
	class: CustomField_module_default.root,
	autocomplete: "off",
	onsubmit: actions.submitCustomField
}, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("label", { class: CustomField_module_default.row }, /* @__PURE__ */ h("span", { class: CustomField_module_default.name }, "Height: "), /* @__PURE__ */ h("span", { class: CustomField_module_default.value }, /* @__PURE__ */ h(Input, {
	value: state.height,
	maxLength: 5,
	inputMode: "numeric",
	onInput: (event) => actions.changeCustomField({ height: event.target.value })
}))), /* @__PURE__ */ h("label", { class: CustomField_module_default.row }, /* @__PURE__ */ h("span", { class: CustomField_module_default.name }, "Width: "), /* @__PURE__ */ h("span", { class: CustomField_module_default.value }, /* @__PURE__ */ h(Input, {
	value: state.width,
	maxLength: 5,
	inputMode: "numeric",
	onInput: (event) => actions.changeCustomField({ width: event.target.value })
}))), /* @__PURE__ */ h("label", { class: CustomField_module_default.row }, /* @__PURE__ */ h("span", { class: CustomField_module_default.name }, "Mines: "), /* @__PURE__ */ h("span", { class: CustomField_module_default.value }, /* @__PURE__ */ h(Input, {
	value: state.mines,
	maxLength: 5,
	inputMode: "numeric",
	onInput: (event) => actions.changeCustomField({ mines: event.target.value })
})))), /* @__PURE__ */ h("div", { class: CustomField_module_default.footer }, /* @__PURE__ */ h(Button, { onCreate: (el) => el.focus() }, /* @__PURE__ */ h("span", { class: CustomField_module_default.button }, "OK")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.toggleCustomField
}, /* @__PURE__ */ h("span", { class: CustomField_module_default.button }, "Cancel"))))));
//#endregion
//#region src/About.jsx
var MinesweeperAbout = ({ key, actions }) => /* @__PURE__ */ h(About, {
	key,
	name: "Minesweeper Plus",
	actions
}, /* @__PURE__ */ h("p", null, "A Windows style minesweeper with boards that never need a guess, hints that explain their reasoning, zoom, and animated themes ported from xscreensaver."), /* @__PURE__ */ h("p", null, "Based on ", /* @__PURE__ */ h(Link, { href: "https://github.com/frenzzy/minesweeper" }, "Minesweeper"), " by Vladimir Kutepov, extended by fexofenadine."));
//#endregion
//#region src/app.jsx
var levels = {
	beginner: {
		level: "beginner",
		width: 9,
		height: 9,
		mines: 10
	},
	intermediate: {
		level: "intermediate",
		width: 16,
		height: 16,
		mines: 40
	},
	expert: {
		level: "expert",
		width: 30,
		height: 16,
		mines: 99
	},
	extreme: {
		level: "extreme",
		width: 39,
		height: 21,
		mines: 169
	}
};
var levelNames = Object.keys(levels);
var createGame = ({ level, width, height, mines }) => {
	const field = new Array(height);
	for (let y = 0; y < height; y++) {
		field[y] = new Array(width);
		for (let x = 0; x < width; x++) field[y][x] = {
			opened: false,
			mined: false,
			flag: false,
			mark: false,
			num: 0
		};
	}
	return {
		level,
		width,
		height,
		mines,
		field,
		left: width * height - mines,
		pressed: false,
		pressedX: -1,
		pressedY: -1,
		group: false,
		flags: mines,
		start: -1,
		time: 0,
		raf: null,
		lose: false,
		win: false,
		touch: false,
		hinted: false,
		paused: false,
		pausedAt: 0,
		openedAt: {
			x: -1,
			y: -1,
			time: 0
		},
		untimed: false
	};
};
var packCell = ({ opened, mined, flag, mark, num }) => num | (opened ? 16 : 0) | (mined ? 32 : 0) | (flag ? 64 : 0) | (mark ? 128 : 0);
var unpackCell = (v) => {
	check(Number.isInteger(v) && v >= 0 && v < 256 && (v & 15) <= 8);
	return {
		opened: !!(v & 16),
		mined: !!(v & 32),
		flag: !!(v & 64),
		mark: !!(v & 128),
		num: v & 15
	};
};
var saved = resumable({
	key: "savedGame",
	running,
	label: ({ level, width, height, mines }) => level === "custom" ? `${width} × ${height}, ${mines} mines` : level[0].toUpperCase() + level.slice(1),
	pack: ({ level, width, height, mines, field, left, flags, hinted, untimed }) => ({
		level,
		width,
		height,
		mines,
		field: field.map((row) => row.map(packCell)),
		left,
		flags,
		hinted,
		untimed
	}),
	unpack: ({ level, width, height, mines, field, left, flags, hinted, untimed }) => {
		check(typeof level === "string" && Array.isArray(field) && field.length === height);
		check(field.every((row) => Array.isArray(row) && row.length === width));
		check(Number.isInteger(left) && Number.isInteger(flags) && Number.isInteger(mines));
		return {
			...createGame({
				level,
				width,
				height,
				mines
			}),
			field: field.map((row) => row.map(unpackCell)),
			left,
			flags,
			hinted: Boolean(hinted),
			untimed: Boolean(untimed)
		};
	}
});
var openable = (game, x, y) => {
	const cell = game.field[y][x];
	if (cell.opened) {
		let num = 0;
		for (let offsetX = -1; offsetX <= 1; offsetX++) for (let offsetY = -1; offsetY <= 1; offsetY++) {
			const dx = offsetX + x;
			const dy = offsetY + y;
			if (dx >= 0 && dy >= 0 && dx < game.width && dy < game.height) num += game.field[dy][dx].flag ? 1 : 0;
		}
		return num === cell.num;
	}
	return false;
};
var toggleFlag = (game, x, y, marks) => {
	const cell = game.field[y][x];
	const field = game.field.slice();
	field[y] = field[y].slice();
	field[y][x] = {
		...cell,
		flag: marks ? !cell.mark && !cell.flag : !cell.flag,
		mark: marks && cell.flag
	};
	const change = cell.flag === field[y][x].flag ? 0 : field[y][x].flag ? -1 : 1;
	return {
		field,
		flags: game.flags + change
	};
};
var revealRange = (x, y, fn) => fn(x - 1, y - 1) + fn(x - 1, y + 1) + fn(x + 1, y - 1) + fn(x + 1, y + 1) + fn(x - 1, y) + fn(x + 1, y) + fn(x, y - 1) + fn(x, y + 1);
var customLevel = (data, defaults) => {
	const width = Math.max(9, Math.min(40, parseInt(data.width, 10) || defaults.width));
	const height = Math.max(9, Math.min(30, parseInt(data.height, 10) || defaults.height));
	const mines = parseInt(data.mines, 10) || defaults.mines;
	return {
		level: "custom",
		width,
		height,
		mines: Math.max(10, Math.min(Math.floor(width * height * .8), mines))
	};
};
var loadLevel = () => {
	const level = load("level");
	if (typeof level !== "string") return levels.beginner;
	if (levels[level]) return levels[level];
	const data = level.split(",");
	return customLevel({
		width: data[0],
		height: data[1],
		mines: data[2]
	}, levels.beginner);
};
var timeKey = (level, hinted) => hinted ? `${level}Hints` : level;
var bestTimes = (hinted) => levelNames.map((level) => {
	const key = timeKey(level, hinted);
	return {
		level,
		name: load(`${key}Name`) || "Anonymous",
		time: parseInt(load(key), 10) || 999
	};
});
var clearBestTimes = (hinted) => {
	levelNames.forEach((level) => {
		const key = timeKey(level, hinted);
		remove(key);
		remove(`${key}Name`);
	});
	return bestTimes(hinted);
};
var prevent = (event) => {
	event.preventDefault();
	return false;
};
var state = {
	...shellState("minesweeper"),
	hint: null,
	shelf: saved.list(),
	game: saved.restore() || createGame(loadLevel()),
	marks: Boolean(load("marks")),
	safeStart: load("safeStart") !== "off",
	noGuess: Boolean(load("noGuess")),
	timer: loadTimer("timer"),
	winner: null,
	bestTime: null,
	about: false,
	customField: null
};
var actions = {
	...shellActions,
	init: () => (state, actions) => {
		window.addEventListener("keydown", actions.press);
		listen(actions);
	},
	press: (event) => (state, actions) => {
		const key = shortcut(event, state, actions);
		if (key === 113 || key === 78) actions.newGame();
		else if (key === 72) actions.hint();
		else if (key === 80) actions.pause();
	},
	pause: pauseAction(running, (game, actions) => {
		window.removeEventListener("mouseup", actions.up);
		return {
			pressed: false,
			group: false,
			pressedX: -1,
			pressedY: -1
		};
	}),
	reset: (payload) => ({ game }) => {
		cancelAnimationFrame(game.raf);
		const params = payload && levels[payload.level] || payload || game;
		save("level", params.level === "custom" ? [
			params.width,
			params.height,
			params.mines
		].join() : params.level);
		return {
			menu: null,
			hint: null,
			game: createGame(params)
		};
	},
	hint: () => (state) => {
		const { game } = state;
		if (game.win || game.lose || game.paused) return { menu: null };
		if (game.start < 0) return {
			menu: null,
			hint: noHint("Open a cell first, then ask for a hint.", "start")
		};
		const { field, width, height, flags } = game;
		return {
			menu: null,
			hint: findHint({
				field,
				width,
				height,
				minesLeft: flags,
				transposed: transposed(state)
			}),
			game: {
				...game,
				hinted: true
			}
		};
	},
	touch: ({ event, x, y }) => ({ game }, actions) => {
		if (game.win || game.lose || game.paused) return null;
		const cell = event.currentTarget;
		const on = ({ clientX, clientY }) => cell.contains(document.elementFromPoint(clientX, clientY));
		const timer = setTimeout(actions.flag, 600);
		const move = ({ touches }) => {
			if (!touches || touches.length !== 1 || !on(touches[0])) {
				clearTimeout(timer);
				actions.move({
					x: -1,
					y: -1
				});
			}
		};
		const stop = ({ changedTouches }) => {
			clearTimeout(timer);
			window.removeEventListener("scroll", move);
			window.removeEventListener("touchmove", move);
			window.removeEventListener("touchend", stop);
			window.removeEventListener("touchcancel", stop);
			move({ touches: changedTouches });
			actions.up();
		};
		window.addEventListener("scroll", move);
		window.addEventListener("touchmove", move);
		window.addEventListener("touchend", stop);
		window.addEventListener("touchcancel", stop);
		return { game: {
			...game,
			pressed: true,
			pressedX: x,
			pressedY: y,
			group: event.shiftKey || openable(game, x, y),
			touch: true
		} };
	},
	flag: () => ({ game, marks }) => {
		const { pressedX, pressedY } = game;
		if (game.paused || pressedX < 0 || pressedY < 0 || game.field[pressedY][pressedX].opened) return null;
		return {
			hint: null,
			game: {
				...game,
				...toggleFlag(game, pressedX, pressedY, marks),
				pressedX: -1,
				pressedY: -1
			}
		};
	},
	down: ({ event, x, y }) => ({ game, marks }, actions) => {
		if (game.touch || event.button > 2 || game.win || game.lose || game.paused) return null;
		window.addEventListener("mouseup", actions.up);
		const { field, flags } = !game.pressed && event.button === 2 && !game.field[y][x].opened ? toggleFlag(game, x, y, marks) : game;
		return {
			...field !== game.field && { hint: null },
			game: {
				...game,
				field,
				pressed: event.button !== 2,
				pressedX: x,
				pressedY: y,
				group: event.shiftKey || event.buttons > 2,
				flags
			}
		};
	},
	chord: ({ x, y }) => ({ game }, actions) => {
		if (game.win || game.lose || game.paused) return null;
		if (!openable(game, x, y)) {
			const { openedAt } = game;
			return openedAt.x === x && openedAt.y === y && performance.now() - openedAt.time < 500 ? null : { hint: explainChord(game, x, y) };
		}
		actions.aim({
			x,
			y
		});
		actions.up();
		return null;
	},
	aim: ({ x, y }) => ({ game }) => ({ game: {
		...game,
		pressed: false,
		pressedX: x,
		pressedY: y,
		group: true
	} }),
	move: ({ x, y }) => ({ game }) => {
		if (x === game.pressedX && y === game.pressedY) return null;
		return { game: {
			...game,
			pressedX: x,
			pressedY: y
		} };
	},
	up: () => ({ game, safeStart, noGuess }, actions) => {
		window.removeEventListener("mouseup", actions.up);
		const { width, height, pressedX, pressedY } = game;
		if (game.win || game.lose || game.paused || pressedX < 0 || pressedY < 0) {
			if (!game.pressed && !game.group) return null;
			return { game: {
				...game,
				pressed: false,
				group: false
			} };
		}
		const field = game.field.map((row) => row.map((c) => ({ ...c })));
		const outBounds = (x, y) => x < 0 || y < 0 || x >= width || y >= height;
		const calcNear = (x, y, fn) => {
			let num = 0;
			for (let offsetX = -1; offsetX <= 1; offsetX++) for (let offsetY = -1; offsetY <= 1; offsetY++) if (!outBounds(offsetX + x, offsetY + y)) num += fn(field[offsetY + y][offsetX + x]) ? 1 : 0;
			return num;
		};
		let { left, lose } = game;
		const reveal = (x, y) => {
			if (outBounds(x, y)) return 0;
			const c = field[y][x];
			if (c.opened || c.flag) return 0;
			c.opened = true;
			c.num = calcNear(x, y, (i) => i.mined);
			if (c.mined) lose = true;
			if (c.num) return 1;
			return revealRange(x, y, reveal) + 1;
		};
		const begin = game.start < 0 && game.pressed && !game.group && !field[pressedY][pressedX].flag;
		if (begin) {
			const { mined } = placeMines({
				width,
				height,
				mines: game.mines,
				x: pressedX,
				y: pressedY,
				safe: safeStart,
				noGuess
			});
			field.forEach((row, y) => row.forEach((c, x) => c.mined = mined[y * width + x] === 1));
			game.raf = requestAnimationFrame(actions.tick);
		}
		const cell = field[pressedY][pressedX];
		const wasOpened = cell.opened;
		let chordHint = null;
		if (game.group) {
			if (cell.opened) {
				if (calcNear(pressedX, pressedY, (c) => c.flag) === cell.num) left -= revealRange(pressedX, pressedY, reveal);
				else chordHint = explainChord({
					field,
					width,
					height
				}, pressedX, pressedY);
			}
		} else if (game.pressed) {
			if (game.touch && wasOpened) chordHint = explainChord({
				field,
				width,
				height
			}, pressedX, pressedY);
			left -= reveal(pressedX, pressedY);
		}
		const win = left <= 0;
		if (win || lose) {
			cancelAnimationFrame(game.raf);
			if (!lose) actions.win();
		}
		if (win && !lose) field.forEach((row) => row.forEach((c) => {
			if (c.mined) Object.assign(c, {
				flag: true,
				mark: false
			});
		}));
		const changed = left !== game.left || lose || begin;
		return {
			...(chordHint || changed) && { hint: chordHint },
			game: {
				...game,
				left,
				field,
				flags: win && !lose ? 0 : game.flags,
				openedAt: !wasOpened && cell.opened ? {
					x: pressedX,
					y: pressedY,
					time: performance.now()
				} : game.openedAt,
				pressed: false,
				group: false,
				start: begin ? clock() : game.start,
				time: begin ? 1 : game.time,
				lose,
				win,
				touch: false
			}
		};
	},
	tick: () => ({ game }, actions) => {
		game.raf = requestAnimationFrame(actions.tick);
		const next = seconds(game.start);
		if (game.time === next) return null;
		return { game: {
			...game,
			time: next
		} };
	},
	win: () => (state) => {
		const { game } = state;
		if (game.level === "custom" || !timed(state)) return null;
		const time = parseInt(load(timeKey(game.level, game.hinted)), 10);
		if (time && time <= game.time) return null;
		return { winner: {
			name: "Anonymous",
			time: game.time,
			level: game.level,
			hinted: game.hinted
		} };
	},
	changeWinner: (payload) => ({ winner }) => ({ winner: {
		...winner,
		...payload
	} }),
	submitBestTime: (event) => ({ winner }, actions) => {
		event.preventDefault();
		const key = timeKey(winner.level, winner.hinted);
		save(key, winner.time);
		save(`${key}Name`, winner.name.trim());
		actions.toggleBestTime();
		actions.setBestTimeTab(winner.hinted ? "hinted" : "clean");
		return { winner: null };
	},
	toggleAbout: () => ({ about }) => ({
		menu: null,
		about: !about
	}),
	toggleBestTime: () => ({ bestTime }) => ({
		menu: null,
		bestTime: bestTime ? null : {
			tab: "clean",
			clean: bestTimes(false),
			hinted: bestTimes(true)
		}
	}),
	setBestTimeTab: (tab) => (state) => state.bestTime ? { bestTime: {
		...state.bestTime,
		tab
	} } : null,
	resetBestTime: () => ({ bestTime }) => ({ bestTime: {
		...bestTime,
		[bestTime.tab]: clearBestTimes(bestTime.tab === "hinted")
	} }),
	toggleCustomField: () => ({ game, customField }) => ({
		menu: null,
		customField: customField ? null : {
			width: String(game.width),
			height: String(game.height),
			mines: String(game.mines)
		}
	}),
	changeCustomField: (payload) => ({ customField }) => ({ customField: {
		...customField,
		...payload
	} }),
	submitCustomField: (event) => ({ game, customField }, actions) => {
		event.preventDefault();
		actions.newGame(customLevel(customField, game));
		return { customField: null };
	},
	toggleSafeStart: () => (state) => {
		const safeStart = !state.safeStart;
		save("safeStart", safeStart ? "" : "off");
		return {
			menu: null,
			safeStart
		};
	},
	toggleNoGuess: () => (state) => {
		const noGuess = !state.noGuess;
		save("noGuess", noGuess ? "yes" : "");
		return {
			menu: null,
			noGuess
		};
	},
	toggleTimer: timerAction("timer"),
	toggleMarks: () => (state) => {
		const marks = !state.marks;
		save("marks", marks ? "yes" : "");
		return {
			menu: null,
			marks
		};
	},
	...saved.actions
};
var view = (state, actions) => /* @__PURE__ */ h("main", {
	oncontextmenu: prevent,
	ondragstart: prevent,
	oncreate: actions.init,
	onupdate: () => saved.keep(state.game)
}, state.game && /* @__PURE__ */ h(Game, {
	key: "a",
	state,
	actions
}), /* @__PURE__ */ h(Taskbar, {
	key: "h",
	name: "Minesweeper Plus",
	state,
	actions
}), state.winner && /* @__PURE__ */ h(Winner, {
	key: "b",
	state: state.winner,
	actions
}), state.bestTime && /* @__PURE__ */ h(BestTime, {
	key: "c",
	state: state.bestTime,
	actions
}), state.customField && /* @__PURE__ */ h(CustomField, {
	key: "d",
	state: state.customField,
	actions
}), state.backgroundSettings && /* @__PURE__ */ h(BackgroundSettings, {
	key: "e",
	state: state.backgroundSettings,
	actions
}), state.switching && /* @__PURE__ */ h(Switching, {
	key: "k",
	title: "Minesweeper Plus",
	actions
}), state.about && /* @__PURE__ */ h(MinesweeperAbout, {
	key: "f",
	actions
}), state.howTo && /* @__PURE__ */ h(MinesweeperHowToPlay, {
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
//#region src/index.js
app(state, actions, view, document.getElementById("app"));
startBackgrounds();
registerWorker();
//#endregion
