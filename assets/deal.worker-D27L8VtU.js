//#region src/lightup/deal.worker.js?raw
var deal_worker_default = "import { makeGame, random } from './generate'\n\nself.onmessage = ({ data: { id, n, level, seed, budget } }) => {\n  const { layout, solution, level: got } = makeGame(n, level, random(seed), budget)\n  self.postMessage({ id, layout, solution, level: got }, [layout.buffer, solution.buffer])\n}\n";
//#endregion
export { deal_worker_default as default };
