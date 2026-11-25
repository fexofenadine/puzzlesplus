import { it as pastelclouds } from "./Taskbar-CoR5e2rF.js";
import { n as shaderBackground } from "./shader-DrI_gCtb.js";
import { t as driftclouds_default } from "./driftclouds-DaU32WkO.js";
import { n as tapeCounter } from "./tape-CtJdnUKS.js";
//#region src/shell/backgrounds/pastelclouds.js
var swaps = [
	["skycolour1 = vec3(0.2, 0.4, 0.6)", "skycolour1 = vec3(0.66, 0.45, 1.0)"],
	["skycolour2 = vec3(0.4, 0.7, 1.0)", "skycolour2 = vec3(1.0, 0.55, 0.85)"],
	["vec3(1.1, 1.1, 0.9)", "vec3(1.12, 0.98, 1.15)"]
];
var pastel = (source) => swaps.reduce((text, [from, to]) => {
	if (!text.includes(from)) throw new Error(`pastel clouds: no ${from}`);
	return text.replace(from, to);
}, source);
var base = shaderBackground(pastelclouds, pastel(driftclouds_default));
var pastelclouds_default = {
	...base,
	create: (gl, settings, host) => {
		const drawn = base.create(gl, settings, host);
		const count = tapeCounter();
		let last = 0;
		return {
			...drawn,
			frame: (now) => {
				if (last) count(Math.min(250, now - last));
				last = now;
				drawn.frame(now);
			}
		};
	}
};
//#endregion
export { pastelclouds_default as default, pastel };
