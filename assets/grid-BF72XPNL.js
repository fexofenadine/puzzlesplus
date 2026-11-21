//#region src/shell/grid.js
var cellCache = {};
var cellsOf = (n) => cellCache[n] ??= Array.from({ length: 2 * n }, (_, line) => Array.from({ length: n }, (_, k) => line < n ? line * n + k : k * n + line - n));
var lineName = (line, n) => line < n ? `row ${line + 1}` : `column ${line - n + 1}`;
var variants = { jigsaw: "Jigsaw 9 × 9" };
var sizeName = (n) => variants[n] || `${n} × ${n}`;
var capital = (text) => text[0].toUpperCase() + text.slice(1);
var cellName = (i, n) => `row ${Math.floor(i / n) + 1}, column ${i % n + 1}`;
var plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;
var listOf = (items) => items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
//#endregion
export { listOf as a, lineName as i, cellName as n, plural as o, cellsOf as r, sizeName as s, capital as t };
