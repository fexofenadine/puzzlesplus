//#region src/sudoku/deal.js?raw
var deal_default = "import { dealer } from '../shell/deal'\nimport { makeGame, random } from './generate'\n\nconst dealOne = dealer(\n  () => new Worker(new URL('./deal.worker.js', import.meta.url), { type: 'module' }),\n  ({ n, level, seed, budget }) => makeGame(n, level, random(seed), budget),\n)\n\n//budget is the search time, left out for the usual one\nexport const deal = (n, level, seed, budget) => dealOne({ n, level, seed, budget })\n";
//#endregion
export { deal_default as default };
