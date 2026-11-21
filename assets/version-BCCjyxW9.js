//#region src/shell/version.js?raw
var version_default = "import { releaseDate, version } from '../../package.json'\n\n//the version the about boxes show, from package.json, and the day it was released\nexport { version }\n\nexport const released = new Date(`${releaseDate}T00:00:00Z`).toLocaleDateString('en-GB', {\n  day: 'numeric',\n  month: 'long',\n  year: 'numeric',\n  timeZone: 'UTC',\n})\n\n//the list of what changed in each release\nexport const changelog = 'https://github.com/fexofenadine/puzzlesplus/blob/master/CHANGELOG.md'\n";
//#endregion
export { version_default as default };
