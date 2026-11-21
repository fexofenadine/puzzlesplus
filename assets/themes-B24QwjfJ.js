//#region src/shell/themes.js?raw
var themes_default = "//the theme a first visit opens with\nexport const defaultTheme = 'synthwave'\n\n//the theme menu, in alphabetical order by name (the default theme does not lead it)\nexport const themes = [\n  ['classic', 'Classic'],\n  ['matrix', 'Matrix'],\n  ['nord', 'Nord'],\n  ['solarized-phosphor', 'Solarized Phosphor'],\n  ['solarized', 'Solarized Truchet'],\n  ['synthwave', 'Synthwave'],\n  ['terafox', 'Terafox Hex Trail'],\n  ['vaporwave', 'Vaporwave'],\n]\n\n//theme ids that were renamed, so a saved choice still finds its theme\nexport const renamed = { everforest: 'terafox', 'terafox-coral': 'terafox' }\n";
//#endregion
export { themes_default as default };
