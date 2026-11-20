//#region src/shell/themes.js?raw
var themes_default = "//the theme a first visit opens with\nexport const defaultTheme = 'synthwave'\n\n//the theme menu, in order\nexport const themes = [\n  ['synthwave', 'Synthwave'],\n  ['classic', 'Classic'],\n  ['solarized', 'Solarized Truchet'],\n  ['solarized-phosphor', 'Solarized Phosphor'],\n  ['matrix', 'Matrix'],\n  ['nord', 'Nord'],\n  ['vaporwave', 'Vaporwave'],\n  ['terafox', 'Terafox Hex Trail'],\n  ['terafox-coral', 'Terafox Coral'],\n]\n\n//theme ids that were renamed, so a saved choice still finds its theme\nexport const renamed = { everforest: 'terafox-coral' }\n";
//#endregion
export { themes_default as default };
