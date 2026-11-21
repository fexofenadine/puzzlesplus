//#region src/bridges/deal.js?raw
var deal_default = "import { dealer } from '../shell/deal'\r\nimport { makeGame, random } from './generate'\r\n\r\nconst dealOne = dealer(\r\n  () => new Worker(new URL('./deal.worker.js', import.meta.url), { type: 'module' }),\r\n  ({ n, level, seed, budget }) => makeGame(n, level, random(seed), budget),\r\n)\r\n\r\n//budget is the search time, left out for the usual one\r\nexport const deal = (n, level, seed, budget) => dealOne({ n, level, seed, budget })\r\n";
//#endregion
export { deal_default as default };
