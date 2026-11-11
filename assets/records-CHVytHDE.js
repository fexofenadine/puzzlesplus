import { $ as Overlay, Q as Button, Z as Dialog, f as readDaily, it as save, l as clearDaily, nt as load, ot as h, rt as remove } from "./HowToPlay-DbrvSPio.js";
import { a as clearStats, l as readStats, y as Prompt_module_default } from "./start-B-jOo2Ym.js";
//#region src/shell/Prompt.jsx
var Prompt = ({ key, title, text, actions }) => /* @__PURE__ */ h(Overlay, {
	key,
	onKeyDown: (event) => event.keyCode === 27 && actions.answerPrompt(false)
}, /* @__PURE__ */ h(Dialog, {
	title,
	onClose: () => actions.answerPrompt(false)
}, /* @__PURE__ */ h("div", { class: Prompt_module_default.root }, /* @__PURE__ */ h("p", { class: Prompt_module_default.text }, text), /* @__PURE__ */ h("div", { class: Prompt_module_default.footer }, /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => actions.answerPrompt(true)
}, /* @__PURE__ */ h("span", { class: Prompt_module_default.button }, "Yes")), /* @__PURE__ */ h(Button, {
	type: "button",
	onClick: () => actions.answerPrompt(false),
	onCreate: (el) => el.focus()
}, /* @__PURE__ */ h("span", { class: Prompt_module_default.button }, "No"))))));
var BestTimes_module_default = {
	table: "BestTimes_table",
	level: "BestTimes_level",
	size: "BestTimes_size",
	slot: "BestTimes_slot",
	time: "BestTimes_time",
	name: "BestTimes_name",
	empty: "BestTimes_empty",
	never: "BestTimes_never"
};
//#endregion
//#region src/shell/records.js
var winnerActions = {
	changeWinner: (payload) => ({ winner }) => ({ winner: {
		...winner,
		...payload
	} }),
	setBestTimeTab: (tab) => (state) => state.bestTime ? { bestTime: {
		...state.bestTime,
		tab
	} } : null
};
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
			...winnerActions,
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
					stats: readStats(prefix),
					daily: readDaily(prefix)
				}
			}),
			resetBestTime: () => ({ bestTime }) => ({ bestTime: {
				...bestTime,
				[bestTime.tab]: clearBestTimes(bestTime.tab)
			} }),
			resetStats: () => ({ bestTime }) => ({ bestTime: {
				...bestTime,
				stats: clearStats(prefix),
				daily: clearDaily(prefix)
			} })
		}
	};
};
//#endregion
export { Prompt as i, winnerActions as n, BestTimes_module_default as r, records as t };
