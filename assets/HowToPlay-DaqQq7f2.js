import { L as h, t as HowToPlay } from "./HowToPlay-ClOjG6pr.js";
//#region src/sudoku/HowToPlay.jsx
var Rules = () => [
	/* @__PURE__ */ h("p", null, "Fill the empty cells so every row, every column and every 3×3 box holds each digit from 1 to 9 exactly once. The digits in bold are the puzzle's own and can't be changed."),
	/* @__PURE__ */ h("p", null, "Select a cell, then pick a digit on the pad below the board or type it. Picking the same digit again clears it. With no cell selected, a pad digit stays picked and every cell you tap gets it. The arrow keys move the selection, and Backspace, Delete or 0 erases."),
	/* @__PURE__ */ h("p", null, "Notes are small candidate digits: turn on Notes on the pad (or press Space) and digits become notes, or hold Shift while typing one, or right click a cell with a digit picked. Auto Notes fills in every candidate, and placing a digit takes it out of the notes it rules out."),
	/* @__PURE__ */ h("p", null, "The left counter shows the cells still empty and Ctrl+Z undoes. Show Errors marks a digit that repeats in a row, column or box, and Hint explains the next digit logic gives. Every board has one solution that needs no guessing.")
];
var SudokuHowToPlay = ({ key, actions }) => /* @__PURE__ */ h(HowToPlay, {
	key,
	name: "Sudoku",
	actions
}, /* @__PURE__ */ h(Rules, null));
//#endregion
export { SudokuHowToPlay as n, Rules as t };
