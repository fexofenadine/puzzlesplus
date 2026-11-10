import { F as Dialog, I as Button, L as Overlay, M as load, N as remove, P as save, z as h } from "./HowToPlay-C4zys83Q.js";
import { a as clearStats, d as StatsList, f as Tabs, l as readStats, p as BestTime_module_default } from "./worker-M9j8t0tS.js";
import { t as BestTimes_module_default } from "./BestTimes.module-BonQhRW3.js";
//#region src/shell/records.js
var records = (prefix, sizes, levelNames, withArt = false) => {
	const timeKey = (n, level, hinted, art = false) => `${prefix}${art ? ".art" : ""}.${n}.${level}${hinted ? ".hints" : ""}`;
	const eachSlot = (fn) => sizes.flatMap((n) => levelNames.map((_, level) => fn(n, level, `${n}.${level}`)));
	const keyOf = (board, n, level) => timeKey(n, level, board === "hinted", board === "art");
	const bestTimes = (board) => Object.fromEntries(eachSlot((n, level, slot) => {
		const key = keyOf(board, n, level);
		const saved = parseInt(load(key), 10);
		return [slot, {
			set: Boolean(saved),
			time: saved || 999,
			name: load(`${key}.name`) || "Anonymous"
		}];
	}));
	const clearBestTimes = (board) => {
		eachSlot((n, level) => {
			const key = keyOf(board, n, level);
			remove(key);
			remove(`${key}.name`);
		});
		return bestTimes(board);
	};
	return {
		timeKey,
		eachSlot,
		actions: {
			win: ({ n, level, hinted, time, art = false }) => () => {
				const board = art ? "art" : hinted ? "hinted" : "clean";
				const key = keyOf(board, n, level);
				const best = parseInt(load(key), 10);
				if (best && best <= time) return null;
				return { winner: {
					key,
					time,
					hinted,
					board,
					level: `${levelNames[level].toLowerCase()} ${n} × ${n}`,
					text: art && `You have the fastest art time for ${levelNames[level].toLowerCase()} ${n} × ${n}.`,
					name: load(`${prefix}.name`) || ""
				} };
			},
			changeWinner: (payload) => ({ winner }) => ({ winner: {
				...winner,
				...payload
			} }),
			submitBestTime: (event) => ({ winner }, actions) => {
				event.preventDefault();
				const name = winner.name.trim();
				save(winner.key, winner.time);
				save(`${winner.key}.name`, name);
				save(`${prefix}.name`, name);
				actions.toggleBestTime();
				actions.setBestTimeTab(winner.board);
				return { winner: null };
			},
			toggleBestTime: () => ({ bestTime }) => ({
				menu: null,
				bestTime: bestTime ? null : {
					tab: "clean",
					clean: bestTimes("clean"),
					hinted: bestTimes("hinted"),
					...withArt && { art: bestTimes("art") },
					stats: readStats(prefix)
				}
			}),
			setBestTimeTab: (tab) => (state) => state.bestTime ? { bestTime: {
				...state.bestTime,
				tab
			} } : null,
			resetBestTime: () => ({ bestTime }) => ({ bestTime: {
				...bestTime,
				[bestTime.tab]: clearBestTimes(bestTime.tab)
			} }),
			resetStats: () => ({ bestTime }) => ({ bestTime: {
				...bestTime,
				stats: clearStats(prefix)
			} })
		}
	};
};
//#endregion
//#region src/shell/BestTimes.jsx
var tabs = [{
	id: "clean",
	name: "No hints"
}, {
	id: "hinted",
	name: "Hints used"
}];
var artTab = {
	id: "art",
	name: "Art"
};
var BestTimes = ({ key, title, sizes, levelNames, allowed, state, actions, art = false }) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.toggleBestTime()
}, /* @__PURE__ */ h(Dialog, {
	title,
	onClose: actions.toggleBestTime
}, /* @__PURE__ */ h("div", { class: BestTime_module_default.root }, /* @__PURE__ */ h(Tabs, {
	tabs: art ? [...tabs, artTab] : tabs,
	active: state.tab,
	onSelect: actions.setBestTimeTab
}), /* @__PURE__ */ h("table", { class: BestTimes_module_default.table }, /* @__PURE__ */ h("thead", null, /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("th", null), levelNames.map((name) => /* @__PURE__ */ h("th", { class: BestTimes_module_default.level }, name)))), /* @__PURE__ */ h("tbody", null, sizes.map((n) => /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("th", { class: BestTimes_module_default.size }, n, " × ", n), levelNames.map((_, level) => {
	const ok = allowed(n, level);
	const best = ok && state[state.tab][`${n}.${level}`];
	return /* @__PURE__ */ h("td", { class: BestTimes_module_default.slot }, !ok && /* @__PURE__ */ h("span", { class: BestTimes_module_default.never }, "–"), ok && !best.set && /* @__PURE__ */ h("span", { class: BestTimes_module_default.empty }, "–"), best && best.set && /* @__PURE__ */ h("span", { class: BestTimes_module_default.time }, best.time, " s"), best && best.set && /* @__PURE__ */ h("span", { class: BestTimes_module_default.name }, best.name));
}))))), state.stats && /* @__PURE__ */ h(StatsList, { stats: state.stats }), /* @__PURE__ */ h("div", { class: BestTime_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.resetBestTime
}, /* @__PURE__ */ h("span", { class: BestTime_module_default.button }, "Reset Scores")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.resetStats
}, /* @__PURE__ */ h("span", { class: BestTime_module_default.button }, "Reset Stats")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: actions.toggleBestTime,
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: BestTime_module_default.button }, "OK"))))));
//#endregion
//#region src/shell/deal.js
var dealer = (start, here) => {
	let worker = null;
	const waiting = /* @__PURE__ */ new Map();
	let count = 0;
	const giveUp = () => {
		worker = false;
		waiting.forEach(({ ask, resolve }) => resolve(here(ask)));
		waiting.clear();
	};
	const open = () => {
		if (worker !== null) return worker;
		try {
			worker = start();
			worker.onmessage = ({ data }) => {
				waiting.get(data.id)?.resolve(data);
				waiting.delete(data.id);
			};
			worker.onerror = giveUp;
		} catch {
			worker = false;
		}
		return worker;
	};
	return (ask) => {
		if (typeof Worker === "undefined" || !open()) return Promise.resolve(here(ask));
		const id = ++count;
		return new Promise((resolve) => {
			waiting.set(id, {
				ask,
				resolve
			});
			worker.postMessage({
				id,
				...ask
			});
		});
	};
};
//#endregion
//#region src/shell/random.js
var random = (seed) => {
	let a = seed >>> 0;
	return () => {
		a = a + 1831565813 >>> 0;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
};
var shuffled = (list, rng) => {
	const copy = list.slice();
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
};
//#endregion
export { records as a, BestTimes as i, shuffled as n, dealer as r, random as t };
