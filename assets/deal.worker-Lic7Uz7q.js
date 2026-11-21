//#region src/bridges/deal.worker.js?raw
var deal_worker_default = "import { makeGame, random } from './generate'\r\n\r\nself.onmessage = ({ data: { id, n, level, seed, budget } }) => {\r\n  const { islands, solution, level: got } = makeGame(n, level, random(seed), budget)\r\n  self.postMessage({ id, islands, solution, level: got }, [islands.buffer, solution.buffer])\r\n}\r\n";
//#endregion
export { deal_worker_default as default };
