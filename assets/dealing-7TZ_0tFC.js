//#region src/nonograms/dealing.js?raw
var dealing_default = "import { pickArt } from './art'\nimport { makeGame, random } from './generate'\n\n//one deal, on the page or in the worker: a picture from the pool when art is asked for and the\n//size has one, otherwise a drawn board\nexport const deal = ({\n  n,\n  level,\n  seed,\n  art = false,\n  pick = null,\n  avoid = null,\n  symmetric = true,\n}) => {\n  const rng = random(seed)\n  const found = art && pickArt(n, level, rng, pick, avoid)\n  return found || makeGame(n, level, rng, undefined, symmetric)\n}\n";
//#endregion
export { dealing_default as default };
