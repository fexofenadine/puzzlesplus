//#region src/guide/pages/howToPlay.js?raw
var howToPlay_default = "import { startGuide } from '../Guide'\nimport { help } from '../../shell/Taskbar'\nimport { parts } from '../howToPlay'\n\n//one level down from the site's top, closing goes to the first game\nstartGuide({\n  page: 'how-to-play',\n  root: '../',\n  home: '../minesweeper/',\n  title: 'How to Play',\n  icon: help,\n  parts,\n})\n";
//#endregion
export { howToPlay_default as default };
