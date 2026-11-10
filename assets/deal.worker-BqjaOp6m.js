//#region src/nonograms/deal.worker.js?raw
var deal_worker_default = "import { deal } from './dealing'\n\nself.onmessage = ({ data }) => {\n  const { solution, clues, level, art } = deal(data)\n  self.postMessage({ id: data.id, solution, clues, level, art }, [solution.buffer])\n}\n";
//#endregion
export { deal_worker_default as default };
