import { $ as Overlay, Q as Button, Z as Dialog, ot as h } from "./HowToPlay-CdnnUesu.js";
import { d as StatsList, f as StatsList_module_default, h as BestTime_module_default, m as hintTabs, p as Tabs } from "./start-BqCHtXOL.js";
import { r as BestTimes_module_default } from "./records-icyXVvxG.js";
//#region src/shell/DailyList.jsx
var days = (count) => `${count} ${count === 1 ? "day" : "days"}`;
var DailyList = ({ daily }) => {
	const rows = [
		["Today", daily.done ? daily.time ? `${daily.time} s` : "Solved" : "Not yet"],
		["Fastest", daily.fastest ? `${daily.fastest} s` : "–"],
		["Streak", days(daily.streak)],
		["Best streak", days(daily.best)]
	];
	return /* @__PURE__ */ h("div", { class: StatsList_module_default.root }, /* @__PURE__ */ h("dl", { class: StatsList_module_default.list }, rows.map(([name, value]) => /* @__PURE__ */ h("div", { class: StatsList_module_default.row }, /* @__PURE__ */ h("dt", null, name), /* @__PURE__ */ h("dd", null, value)))), /* @__PURE__ */ h("p", { class: StatsList_module_default.note }, "Daily Puzzle: one board a day, the same for everyone. Times count without hints."));
};
//#endregion
//#region src/shell/BestTimes.jsx
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
	tabs: art ? [...hintTabs, artTab] : hintTabs,
	active: state.tab,
	onSelect: actions.setBestTimeTab
}), /* @__PURE__ */ h("table", { class: BestTimes_module_default.table }, /* @__PURE__ */ h("thead", null, /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("th", null), levelNames.map((name) => /* @__PURE__ */ h("th", { class: BestTimes_module_default.level }, name)))), /* @__PURE__ */ h("tbody", null, sizes.map((n) => /* @__PURE__ */ h("tr", null, /* @__PURE__ */ h("th", { class: BestTimes_module_default.size }, n, " × ", n), levelNames.map((_, level) => {
	const ok = allowed(n, level);
	const best = ok && state[state.tab][`${n}.${level}`];
	return /* @__PURE__ */ h("td", { class: BestTimes_module_default.slot }, !ok && /* @__PURE__ */ h("span", { class: BestTimes_module_default.never }, "–"), ok && !best.set && /* @__PURE__ */ h("span", { class: BestTimes_module_default.empty }, "–"), best && best.set && /* @__PURE__ */ h("span", { class: BestTimes_module_default.time }, best.time, " s"), best && best.set && /* @__PURE__ */ h("span", { class: BestTimes_module_default.name }, best.name));
}))))), state.stats && /* @__PURE__ */ h(StatsList, { stats: state.stats }), state.daily && /* @__PURE__ */ h(DailyList, { daily: state.daily }), /* @__PURE__ */ h("div", { class: BestTime_module_default.footer }, /* @__PURE__ */ h(Button, {
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
export { BestTimes as i, shuffled as n, dealer as r, random as t };
