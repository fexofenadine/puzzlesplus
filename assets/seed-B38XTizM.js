//#region src/screensaver/seed.js?raw
var seed_default = "import { load, save } from '../shell/storage'\n\n//imported before the backgrounds, which read their settings as they load\n//a screensaver starts with every background moving, classic's clouds too (the web keeps its photo)\n//version 2 is the backgrounds' settings version at the time, so nothing of it is dropped\nif (load('backgrounds') === null) {\n  save('backgrounds', JSON.stringify({ driftclouds: { animated: true }, version: 2 }))\n}\n";
//#endregion
export { seed_default as default };
