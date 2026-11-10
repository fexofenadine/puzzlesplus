//#region src/nonograms/deal.js?raw
var deal_default = "import { dealer } from '../shell/deal'\nimport { deal as dealWith } from './dealing'\n\nconst dealOne = dealer(\n  () => new Worker(new URL('./deal.worker.js', import.meta.url), { type: 'module' }),\n  dealWith,\n)\n\n//options: symmetric for drawn pictures, art for the pool (pick a picture by id, avoid the last)\nexport const deal = (n, level, seed, options = {}) => dealOne({ n, level, seed, ...options })\n";
//#endregion
export { deal_default as default };
