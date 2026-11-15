//#region src/shell/cursor.js?raw
var cursor_default = "//a keyboard cursor on a square board, for games played with the arrow keys\n\n//the step each arrow key takes, by key code\nexport const arrows = { 37: [-1, 0], 38: [0, -1], 39: [1, 0], 40: [0, 1] }\n\n//the cell a step from the cursor on an n x n board: the middle when there is none yet, and the\n//cursor stays where it is at an edge\nexport const stepCursor = (cursor, [dx, dy], n) => {\n  if (cursor < 0) return Math.floor(n / 2) * (n + 1)\n  const x = (cursor % n) + dx\n  const y = Math.floor(cursor / n) + dy\n  return x < 0 || y < 0 || x >= n || y >= n ? cursor : y * n + x\n}\n";
//#endregion
export { cursor_default as default };
