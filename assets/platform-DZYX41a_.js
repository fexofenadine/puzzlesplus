//#region src/shell/platform.js?raw
var platform_default = "//true in the android app's build (vite --mode android), false on the web and in tests\nexport const app = import.meta.env?.MODE === 'android'\n";
//#endregion
export { platform_default as default };
