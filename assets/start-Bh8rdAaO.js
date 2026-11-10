//#region src/shell/start.js?raw
var start_default = "import { app } from 'hyperapp'\nimport { startBackgrounds } from './backgrounds'\nimport { registerWorker } from './worker'\n\n//a game page: its app in the page, the background behind it and the offline worker\nexport const start = ({ state, actions, view }) => {\n  app(state, actions, view, document.getElementById('app'))\n  startBackgrounds()\n  registerWorker()\n}\n";
//#endregion
export { start_default as default };
