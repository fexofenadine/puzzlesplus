//#region src/shell/backgrounds/neon.js?raw
var neon_default = "import { neon as meta } from './meta'\nimport { shaderBackground } from './shader'\nimport shader from './neontriangulator.glsl?raw'\n\n//mrange's neon triangulator, the shadertoy shader xscreensaver wraps\nexport { adapt } from './shader'\n\nexport default shaderBackground(meta, shader)\n";
//#endregion
export { neon_default as default };
