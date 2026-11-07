//#region src/sudoku/index.js?raw
var sudoku_default = "import { app } from 'hyperapp'\nimport { state, actions, view } from './app'\nimport { startBackgrounds } from '../shell/backgrounds'\nimport { registerWorker } from '../shell/worker'\n\napp(state, actions, view, document.getElementById('app'))\nstartBackgrounds()\n\nregisterWorker()\n";
//#endregion
export { sudoku_default as default };
