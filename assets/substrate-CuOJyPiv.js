import { X as substrate } from "./HowToPlay-sfgAnlPV.js";
//#region src/shell/backgrounds/substrate.js
var STEP = .42;
var EMPTY = 10001;
var palettes = {
	nord: [
		"#8fbcbb",
		"#88c0d0",
		"#81a1c1",
		"#5e81ac",
		"#bf616a",
		"#d08770",
		"#ebcb8b",
		"#a3be8c",
		"#b48ead"
	],
	frost: [
		"#8fbcbb",
		"#88c0d0",
		"#81a1c1",
		"#5e81ac"
	],
	aurora: [
		"#bf616a",
		"#d08770",
		"#ebcb8b",
		"#a3be8c",
		"#b48ead"
	]
};
var BACKGROUND = "#2e3440";
var FOREGROUND = "#d8dee9";
var rgbCache = /* @__PURE__ */ new Map();
var rgbOf = (hex) => rgbCache.get(hex) ?? rgbCache.set(hex, [
	1,
	3,
	5
].map((i) => parseInt(hex.slice(i, i + 2), 16))).get(hex);
var frand = (n) => Math.random() * n;
var random = (n) => Math.floor(Math.random() * n);
var radians = (degrees) => degrees * Math.PI / 180;
var substrate_default = {
	...substrate,
	create: (context, settings) => {
		let f = settings;
		let width = 0;
		let height = 0;
		let cgrid = /* @__PURE__ */ new Int32Array(0);
		let cracks = [];
		let cycles = 0;
		let last = 0;
		let pace = 1;
		let owed = 0;
		let style = null;
		let pixelsOf = null;
		const plot = (x, y, colour, alpha) => {
			if (x < 0 || x >= width || y < 0 || y >= height) return;
			const a = Math.min(1, alpha);
			if (pixelsOf) {
				const data = pixelsOf.data;
				const i = (y * width + x) * 4;
				const [r, g, b] = rgbOf(colour);
				data[i] += (r - data[i]) * a;
				data[i + 1] += (g - data[i + 1]) * a;
				data[i + 2] += (b - data[i + 2]) * a;
				return;
			}
			context.globalAlpha = a;
			if (colour !== style) context.fillStyle = style = colour;
			context.fillRect(x, y, 1, 1);
		};
		const startCrack = (cr) => {
			let px = 0;
			let py = 0;
			let found = false;
			let timeout = 0;
			while (!found && timeout++ < 1e4) {
				px = random(width);
				py = random(height);
				if (cgrid[py * width + px] < 1e4) found = true;
			}
			if (!found) {
				px = Math.min(width - 1, Math.max(0, Math.trunc(cr.x)));
				py = Math.min(height - 1, Math.max(0, Math.trunc(cr.y)));
				cgrid[py * width + px] = cr.t;
			}
			let a = cgrid[py * width + px];
			if (random(100) < 50) a -= 90 + (frand(4.1) - 2);
			else a += 90 + (frand(4.1) - 2);
			if (random(100) < f.circlePercent) {
				cr.curved = true;
				cr.degreesDrawn = 0;
				let r = 10 + random(Math.floor((width + height) / 2));
				if (random(100) < 50) r *= -1;
				const radianInc = STEP / r;
				cr.tInc = radianInc * 360 / 2 / Math.PI;
				cr.ys = r * Math.sin(radianInc);
				cr.xs = r * (1 - Math.cos(radianInc));
			} else cr.curved = false;
			cr.x = px + .61 * Math.cos(radians(a));
			cr.y = py + .61 * Math.sin(radians(a));
			cr.t = a;
		};
		const makeCrack = () => {
			if (cracks.length >= f.maxCracks) return;
			const colours = palettes[f.palette];
			const cr = {
				sandp: 0,
				sandg: frand(.2) - .01,
				sandcolor: colours[random(colours.length)],
				curved: false,
				degreesDrawn: 0,
				x: random(width),
				y: random(height),
				t: random(360)
			};
			startCrack(cr);
			cracks.push(cr);
		};
		const regionColor = (cr) => {
			let rx = cr.x;
			let ry = cr.y;
			const sx = .81 * Math.sin(radians(cr.t));
			const sy = .81 * Math.cos(radians(cr.t));
			for (let steps = (width + height) * 4; steps > 0; steps--) {
				rx += sx;
				ry -= sy;
				let cx = Math.trunc(rx);
				let cy = Math.trunc(ry);
				if (f.seamless) {
					cx %= width;
					cy %= height;
				}
				if (cx < 0 || cx >= width || cy < 0 || cy >= height) break;
				if (cgrid[cy * width + cx] <= 1e4) break;
			}
			cr.sandg = Math.min(1, Math.max(0, cr.sandg + frand(.1) - .05));
			const grains = f.sandGrains;
			const w = cr.sandg / (grains - 1);
			for (let i = 0; i < grains; i++) {
				const s = Math.sin(cr.sandp + Math.sin(i * w));
				let drawx = cr.x + (rx - cr.x) * s;
				let drawy = cr.y + (ry - cr.y) * s;
				if (f.seamless) {
					drawx = (drawx + width) % width;
					drawy = (drawy + height) % height;
				}
				plot(Math.trunc(drawx), Math.trunc(drawy), cr.sandcolor, .1 - i / (grains * 10));
			}
		};
		const restartCrack = (cr) => {
			startCrack(cr);
			makeCrack();
		};
		const moveDrawCrack = (cr) => {
			if (!cr.curved) {
				cr.x += STEP * Math.cos(radians(cr.t));
				cr.y += STEP * Math.sin(radians(cr.t));
			} else {
				cr.x += cr.ys * Math.cos(radians(cr.t));
				cr.y += cr.ys * Math.sin(radians(cr.t));
				cr.x += cr.xs * Math.cos(radians(cr.t) - Math.PI / 2);
				cr.y += cr.xs * Math.sin(radians(cr.t) - Math.PI / 2);
				cr.t += cr.tInc;
				cr.degreesDrawn += Math.abs(cr.tInc);
			}
			if (f.seamless) {
				cr.x = (cr.x + width) % width;
				cr.y = (cr.y + height) % height;
			}
			let cx = Math.trunc(cr.x + frand(.66) - .33);
			let cy = Math.trunc(cr.y + frand(.66) - .33);
			if (f.seamless) {
				cx %= width;
				cy %= height;
			}
			if (cx < 0 || cx >= width || cy < 0 || cy >= height) {
				cr.x = random(width);
				cr.y = random(height);
				cr.t = random(360);
				restartCrack(cr);
				return;
			}
			if (!f.wireframe) regionColor(cr);
			plot(cx, cy, FOREGROUND, 1);
			const here = cy * width + cx;
			if (cr.curved && cr.degreesDrawn > 360) restartCrack(cr);
			else if (cgrid[here] > 1e4 || Math.abs(cgrid[here] - cr.t) < 5) cgrid[here] = Math.trunc(cr.t);
			else if (Math.abs(cgrid[here] - cr.t) > 2) restartCrack(cr);
		};
		const build = () => {
			pixelsOf = null;
			context.globalAlpha = 1;
			context.fillStyle = style = BACKGROUND;
			context.fillRect(0, 0, width, height);
			cgrid.fill(EMPTY);
			cracks = [];
			cycles = 0;
			for (let n = 0; n < f.initialCracks; n++) makeCrack();
		};
		return {
			configure: (next) => {
				f = next;
				if (width) build();
			},
			resize: (w, h, pixels = 1) => {
				width = w;
				height = h;
				pace = Math.max(1, pixels);
				owed = 0;
				cgrid = new Int32Array(w * h);
				last = performance.now();
				build();
			},
			frame: (now) => {
				const delay = Math.max(1, f.growthDelay);
				const due = Math.min(8, Math.floor((now - last) / delay));
				if (!due) return;
				last = now - delay > last + due * delay ? now : last + due * delay;
				owed += due * pace;
				for (; owed >= 1; owed--) {
					for (let i = 0; i < cracks.length; i++) moveDrawCrack(cracks[i]);
					if (++cycles >= f.maxCycles * pace && f.maxCycles) build();
				}
			},
			still: (now) => {
				const target = Math.min(3e3, (f.maxCycles || Infinity) * .95) * pace;
				if (cycles >= target) return true;
				pixelsOf ??= context.getImageData(0, 0, width, height);
				while (cycles < target && performance.now() - now < 40) {
					for (let i = 0; i < cracks.length; i++) moveDrawCrack(cracks[i]);
					cycles++;
				}
				context.putImageData(pixelsOf, 0, 0);
				if (cycles < target) return false;
				pixelsOf = null;
				return true;
			}
		};
	}
};
//#endregion
export { substrate_default as default };
