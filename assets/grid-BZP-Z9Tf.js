//#region src/shell/grid.js
var cellCache = {};
var cellsOf = (n) => cellCache[n] ??= Array.from({ length: 2 * n }, (_, line) => Array.from({ length: n }, (_, k) => line < n ? line * n + k : k * n + line - n));
var lineName = (line, n) => line < n ? `row ${line + 1}` : `column ${line - n + 1}`;
var capital = (text) => text[0].toUpperCase() + text.slice(1);
var listOf = (items) => items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
//#endregion
export { listOf as i, cellsOf as n, lineName as r, capital as t };
