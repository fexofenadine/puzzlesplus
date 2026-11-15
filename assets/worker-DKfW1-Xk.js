//#region src/shell/worker.js?raw
var worker_default = "import { warmWhenIdle } from './offline'\n\n//the shared worker sits beside the game folders, each game is its own scope\nexport const registerWorker = () => {\n  if ('serviceWorker' in navigator && import.meta.env.PROD) {\n    //refused when storage is blocked, which is fine\n    navigator.serviceWorker\n      .register('../service-worker.js', { scope: './' })\n      .then(warmWhenIdle)\n      .catch(() => {})\n  }\n}\n";
//#endregion
export { worker_default as default };
