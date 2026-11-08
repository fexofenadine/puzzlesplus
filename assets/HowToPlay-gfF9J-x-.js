import { L as h, t as HowToPlay } from "./HowToPlay-ClOjG6pr.js";
//#region src/2048/HowToPlay.jsx
var Rules = () => [
	/* @__PURE__ */ h("p", null, "Slide every tile at once with the arrow keys or W, A, S and D, or by swiping or dragging across the board. Two equal tiles that meet merge into one of twice the value and add it to your score. After each move a new 2 or 4 appears in an empty cell."),
	/* @__PURE__ */ h("p", null, "Make a 2048 tile to win (512 on 3 × 3), then keep going if you like. The game ends when the board is full and no two neighbours match. The left counter is your score."),
	/* @__PURE__ */ h("p", null, "Ctrl+Z undoes as many moves as you like and Hint suggests a move, but either puts the game's score with the helped ones. The clock is off unless you turn on Timer in the Game menu.")
];
var TwentyHowToPlay = ({ key, actions }) => /* @__PURE__ */ h(HowToPlay, {
	key,
	name: "2048",
	actions
}, /* @__PURE__ */ h(Rules, null));
//#endregion
export { TwentyHowToPlay as n, Rules as t };
