import { L as h, u as HowToPlay } from "./actions-CNd4PGRw.js";
//#region src/HowToPlay.jsx
var Rules = () => [
	/* @__PURE__ */ h("p", null, "Open every square that hides no mine. Click a square to open it: a number tells how many of the eight squares around it hide mines. Open a mine and the game is lost."),
	/* @__PURE__ */ h("p", null, "Right click a square to flag it as a mine, and again for a question mark when Marks is on. Once a number has as many flags around it as it says, double-click it, click it with both buttons or Shift click it to open the rest of its neighbours. On a touch screen, tap to open and hold to flag."),
	/* @__PURE__ */ h("p", null, "The left counter shows the mines left to flag and the right one the seconds played. No Guessing deals boards that logic alone can clear, and Hint explains the next safe move from the numbers you can see.")
];
var MinesweeperHowToPlay = ({ key, actions }) => /* @__PURE__ */ h(HowToPlay, {
	key,
	name: "Minesweeper",
	actions
}, /* @__PURE__ */ h(Rules, null));
//#endregion
export { Rules as n, MinesweeperHowToPlay as t };
