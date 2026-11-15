import { Z as coral } from "./HowToPlay-C0hyyCJI.js";
//#region src/shell/backgrounds/coral.js
var GROUND = [
	35,
	42,
	46
];
var palettes = {
	forest: [
		"#a7c080",
		"#83c092",
		"#7fbbb3",
		"#5c8a6e",
		"#a7c080"
	],
	autumn: [
		"#dbbc7f",
		"#e69875",
		"#e67e80",
		"#d699b6",
		"#dbbc7f"
	],
	all: [
		"#a7c080",
		"#83c092",
		"#7fbbb3",
		"#d699b6",
		"#e67e80",
		"#e69875",
		"#dbbc7f",
		"#a7c080"
	]
};
var SHADES = 96;
var rgb = (hex) => [
	1,
	3,
	5
].map((at) => parseInt(hex.slice(at, at + 2), 16));
var ramp = (colours, strength, count = SHADES) => Array.from({ length: count }, (_, k) => {
	const at = k / count * (colours.length - 1);
	const a = rgb(colours[Math.floor(at)]);
	const b = rgb(colours[Math.min(colours.length - 1, Math.floor(at) + 1)]);
	const t = at - Math.floor(at);
	const [r, g, bl] = a.map((v, c) => {
		const colour = v + (b[c] - v) * t;
		return Math.round(GROUND[c] + (colour - GROUND[c]) * strength);
	});
	return `rgb(${r} ${g} ${bl})`;
});
var reef = (cols, rows, { seeds, density }, rng, plot) => {
	const set = new Uint8Array(cols * rows);
	const total = Math.floor(cols * rows * density / 100);
	const xs = new Int16Array(total);
	const ys = new Int16Array(total);
	let count = total;
	let frozen = 0;
	const sloth = Math.max(1, Math.ceil(total / SHADES));
	const freeze = (x, y) => {
		set[y * cols + x] = 1;
		plot(x, y, Math.min(95, Math.floor(frozen++ / sloth)));
	};
	for (let n = 0; n < seeds; n++) freeze(1 + Math.floor(rng() * (cols - 2)), 1 + Math.floor(rng() * (rows - 2)));
	for (let n = 0; n < total; n++) {
		xs[n] = 1 + Math.floor(rng() * (cols - 2));
		ys[n] = 1 + Math.floor(rng() * (rows - 2));
	}
	const touching = (x, y) => {
		const at = y * cols + x;
		return set[at - 1] || set[at + 1] || set[at - cols] || set[at + cols] || set[at - cols - 1] || set[at - cols + 1] || set[at + cols - 1] || set[at + cols + 1];
	};
	const step = () => {
		for (let n = count - 1; n >= 0; n--) {
			const x = xs[n];
			const y = ys[n];
			if (set[y * cols + x] || touching(x, y)) {
				if (!set[y * cols + x]) freeze(x, y);
				count--;
				xs[n] = xs[count];
				ys[n] = ys[count];
				continue;
			}
			const way = Math.floor(rng() * 4);
			if (way === 0 && x > 1) xs[n] = x - 1;
			else if (way === 1 && x < cols - 2) xs[n] = x + 1;
			else if (way === 2 && y > 1) ys[n] = y - 1;
			else if (way === 3 && y < rows - 2) ys[n] = y + 1;
		}
		return count > 0;
	};
	return {
		step,
		left: () => count,
		total
	};
};
var coral_default = {
	...coral,
	create: (context, settings) => {
		let options = settings;
		let width = 0;
		let height = 0;
		let pixels = 1;
		let cell = 3;
		let shades = [];
		let growth = null;
		let last = 0;
		let owed = 0;
		let rested = 0;
		let fading = 0;
		const ground = `rgb(${GROUND.join(" ")})`;
		const plot = (x, y, shade) => {
			context.fillStyle = shades[shade];
			context.fillRect(x * cell, y * cell, cell, cell);
		};
		const build = () => {
			cell = Math.max(1, Math.round(options.grain * pixels));
			shades = ramp(palettes[options.palette], options.opacity / 100);
			rested = 0;
			fading = 0;
			owed = 0;
			context.globalAlpha = 1;
			context.fillStyle = ground;
			context.fillRect(0, 0, width, height);
			growth = reef(Math.ceil(width / cell) + 2, Math.ceil(height / cell) + 2, options, Math.random, plot);
		};
		const grown = () => growth.left() <= growth.total * .02;
		return {
			configure: (next) => {
				options = next;
				if (width) build();
			},
			resize: (w, h, scale = 1) => {
				width = w;
				height = h;
				pixels = scale;
				last = performance.now();
				build();
			},
			frame: (now) => {
				const passed = Math.min(250, now - last);
				last = now;
				if (fading) {
					context.globalAlpha = .1;
					context.fillStyle = ground;
					context.fillRect(0, 0, width, height);
					context.globalAlpha = 1;
					if (!--fading) build();
					return;
				}
				if (rested) {
					rested -= passed;
					if (rested <= 0) fading = 45;
					return;
				}
				owed = Math.min(4, owed + passed * options.speed / 1e3);
				for (; owed >= 1; owed--) {
					if (growth.step() && !grown()) continue;
					rested = options.delay * 1e3;
					owed = 0;
					break;
				}
			},
			still: (now) => {
				while (!grown() && performance.now() - now < 30) growth.step();
				return grown();
			}
		};
	}
};
//#endregion
export { coral_default as default, ramp, reef };
