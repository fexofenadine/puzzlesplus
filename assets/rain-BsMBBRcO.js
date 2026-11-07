import { D as BRIGHT, O as GLYPH, k as glyphImage } from "./HowToPlay-BQuQEqsA.js";
//#region src/shell/rain.js
var rain = ["ｼ", "ﾓ"];
var showRain = (on) => {
	const root = document.documentElement;
	if (!on) {
		delete root.dataset.rain;
		return;
	}
	if (!root.style.getPropertyValue("--rain-0")) {
		const dim = glyphImage(rain[0], 192, GLYPH);
		const bright = glyphImage(rain[1], 192, BRIGHT);
		if (!dim || !bright) return;
		root.style.setProperty("--rain-0", `url(${dim})`);
		root.style.setProperty("--rain-1", `url(${bright})`);
	}
	root.dataset.rain = "on";
};
//#endregion
export { showRain as t };
