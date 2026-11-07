//#region src/2048/index.js?raw
var _2048_default = "import { app } from 'hyperapp'\nimport { state, actions, view } from './app'\nimport { startBackgrounds } from '../shell/backgrounds'\nimport { registerWorker } from '../shell/worker'\n\napp(state, actions, view, document.getElementById('app'))\nstartBackgrounds()\n\nregisterWorker()\n";
//#endregion
export { _2048_default as default };
