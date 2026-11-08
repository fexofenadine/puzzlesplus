//#region src/shell/ResumeItems.jsx?raw
var ResumeItems_default = "import { h } from 'hyperapp'\nimport { Separator, SubMenuItem } from '../Menu'\n\nconst clockText = (ms) => {\n  const total = Math.floor(ms / 1000)\n  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`\n}\n\n//a game menu's parked games, nothing while the shelf is empty\nexport const resumeItems = ({ shelf }, actions) =>\n  shelf.length\n    ? [\n        ...shelf.map(({ id, label, elapsed }) => (\n          <SubMenuItem\n            name={`Resume ${label} ${clockText(elapsed)}`}\n            onClick={() => actions.resumeGame(id)}\n          />\n        )),\n        <Separator />,\n      ]\n    : null\n";
//#endregion
export { ResumeItems_default as default };
