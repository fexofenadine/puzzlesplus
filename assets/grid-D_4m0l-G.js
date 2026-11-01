//#region src/shell/grid.js
var cellCache = {};
var cellsOf = (n) => cellCache[n] ??= Array.from({ length: 2 * n }, (_, line) => Array.from({ length: n }, (_, k) => line < n ? line * n + k : k * n + line - n));
var lineName = (line, n) => line < n ? `row ${line + 1}` : `column ${line - n + 1}`;
var capital = (text) => text[0].toUpperCase() + text.slice(1);
//#endregion
export { cellsOf as n, lineName as r, capital as t };
