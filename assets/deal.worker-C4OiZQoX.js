//#region src/futoshiki/deal.worker.js?raw
var deal_worker_default = "import { makeGame, random } from './generate'\n\nself.onmessage = ({ data: { id, n, level, seed, budget } }) => {\n  const { givens, right, down, solution, level: got } = makeGame(n, level, random(seed), budget)\n  self.postMessage({ id, givens, right, down, solution, level: got })\n}\n";
//#endregion
export { deal_worker_default as default };
