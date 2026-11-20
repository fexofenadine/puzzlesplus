//#region src/sudoku/deal.worker.js?raw
var deal_worker_default = "import { makeGame, random } from './generate'\n\nself.onmessage = ({ data: { id, n, level, seed, budget, regions } }) => {\n  const { givens, solution, level: got, layout } = makeGame(n, level, random(seed), budget, regions)\n  self.postMessage({ id, givens, solution, level: got, layout }, [givens.buffer, solution.buffer])\n}\n";
//#endregion
export { deal_worker_default as default };
