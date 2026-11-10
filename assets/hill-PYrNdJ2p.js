import { K as hill } from "./HowToPlay-B-GK6Mo_.js";
//#region src/shell/backgrounds/hill.webp
var hill_default$1 = new URL("hill.webp", import.meta.url).href;
//#endregion
//#region src/shell/backgrounds/ridge.json
var ridge_default = [
	[0, .0057],
	[.0208, .0069],
	[.0417, .0082],
	[.0625, .0095],
	[.0834, .0108],
	[.1042, .0121],
	[.1251, .0133],
	[.1459, .0144],
	[.1667, .0155],
	[.1876, .0164],
	[.2084, .0172],
	[.2293, .0179],
	[.2501, .0185],
	[.2709, .019],
	[.2918, .0194],
	[.3126, .0197],
	[.3335, .02],
	[.3543, .0202],
	[.3752, .0205],
	[.396, .0207],
	[.4168, .021],
	[.4377, .0213],
	[.4585, .0217],
	[.4794, .0222],
	[.5002, .0229],
	[.5211, .0237],
	[.5419, .0247],
	[.5627, .0259],
	[.5836, .0272],
	[.6044, .0288],
	[.6253, .0307],
	[.6461, .0327],
	[.6669, .035],
	[.6878, .0375],
	[.7086, .0403],
	[.7295, .0432],
	[.7503, .0464],
	[.7712, .0497],
	[.792, .0531],
	[.8128, .0566],
	[.8337, .0601],
	[.8545, .0636],
	[.8754, .067],
	[.8962, .0703],
	[.917, .0733],
	[.9379, .0759],
	[.9587, .0781],
	[.9796, .0797],
	[1, .0806]
];
//#endregion
//#region src/shell/backgrounds/hill.js
var HILL_WIDTH = 2400;
var HILL_HEIGHT = 851;
var RIDGE = .53;
var sky = [
	[0, "#4279ee"],
	[.2, "#3d76ee"],
	[.3, "#4e84f1"],
	[.42, "#84a8f2"],
	[.56, "#96b2f2"]
];
var hash = (x, y, seed) => {
	const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
	return n - Math.floor(n);
};
var smooth = (t) => t * t * (3 - 2 * t);
var noise = (x, y, seed) => {
	const xi = Math.floor(x);
	const yi = Math.floor(y);
	const u = smooth(x - xi);
	const v = smooth(y - yi);
	const a = hash(xi, yi, seed);
	const b = hash(xi + 1, yi, seed);
	const c = hash(xi, yi + 1, seed);
	const d = hash(xi + 1, yi + 1, seed);
	return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
var fbm = (x, y, seed) => {
	let sum = 0;
	let amp = .5;
	for (let octave = 0; octave < 5; octave++) {
		sum += amp * noise(x, y, seed + octave * 13);
		x *= 2.03;
		y *= 2.03;
		amp /= 2;
	}
	return sum;
};
var SPRITE_WIDTH = 384;
var SPRITE_HEIGHT = 128;
var makeCloud = (seed, kind) => {
	const canvas = document.createElement("canvas");
	canvas.width = SPRITE_WIDTH;
	canvas.height = SPRITE_HEIGHT;
	const context = canvas.getContext("2d");
	if (!context) return null;
	const image = context.createImageData(SPRITE_WIDTH, SPRITE_HEIGHT);
	for (let y = 0; y < SPRITE_HEIGHT; y++) for (let x = 0; x < SPRITE_WIDTH; x++) {
		const dx = x / SPRITE_WIDTH * 2 - 1;
		const dy = y / SPRITE_HEIGHT * 2 - 1;
		const i = (y * SPRITE_WIDTH + x) * 4;
		let alpha;
		let shade;
		if (kind === "cirrus") {
			const falloff = Math.max(0, 1 - dx * dx - dy * dy * 2);
			const n = fbm(x / SPRITE_WIDTH * 2.5, y / SPRITE_HEIGHT * 9, seed);
			alpha = Math.min(1, Math.max(0, (n - .42) * 3)) * falloff;
			shade = 252;
		} else {
			const falloff = Math.max(0, 1 - dx * dx - dy * dy * (dy > 0 ? 4 : 1.1));
			const n = fbm(x / SPRITE_WIDTH * 4, y / SPRITE_HEIGHT * 2.6, seed);
			alpha = Math.min(1, Math.max(0, (n * falloff - .14) * 5));
			shade = 255 - 55 * Math.max(0, dy + .15) * Math.min(1, alpha * 1.5);
		}
		image.data[i] = shade - 10;
		image.data[i + 1] = shade - 5;
		image.data[i + 2] = shade;
		image.data[i + 3] = alpha * 255;
	}
	context.putImageData(image, 0, 0);
	return canvas;
};
var kinds = [
	"cumulus",
	"cumulus",
	"cumulus",
	"cumulus",
	"cirrus",
	"cirrus"
];
var hillLayout = (width, height) => {
	const scale = Math.max(width / HILL_WIDTH, height * .47 / HILL_HEIGHT);
	const w = HILL_WIDTH * scale;
	return {
		x: (width - w) / 2,
		y: height * RIDGE,
		w,
		h: HILL_HEIGHT * scale
	};
};
var hill_default = {
	...hill,
	create: (context, settings) => {
		let f = settings;
		let width = 0;
		let height = 0;
		let last = 0;
		const hill = new Image();
		hill.src = hill_default$1;
		let shape = null;
		const sprites = {
			cumulus: [],
			cirrus: []
		};
		let made = 0;
		let clouds = [];
		const layers = [
			{
				top: .38,
				bottom: .47,
				size: .35,
				alpha: .95,
				speed: 3,
				kind: "cumulus"
			},
			{
				top: .15,
				bottom: .32,
				size: .7,
				alpha: .95,
				speed: 7,
				kind: "cumulus"
			},
			{
				top: 0,
				bottom: .14,
				size: 1.6,
				alpha: .6,
				speed: 10,
				kind: "cirrus"
			}
		];
		const spriteOf = (cloud) => {
			const list = sprites[cloud.layer.kind];
			return list[cloud.sprite % list.length];
		};
		const scatter = () => {
			const count = Math.round(f.cover / 100 * 18);
			clouds = Array.from({ length: count }, (_, i) => {
				const layer = layers[i % layers.length];
				return {
					layer,
					sprite: i,
					x: Math.random(),
					y: layer.top + Math.random() * (layer.bottom - layer.top),
					stretch: .7 + Math.random() * .8
				};
			});
		};
		const outline = () => {
			const { x, y, w, h } = hillLayout(width, height);
			const path = new Path2D();
			path.moveTo(x, height);
			for (const [px, py] of ridge_default) path.lineTo(x + px * w, y + py * h);
			path.lineTo(x + w, height);
			path.closePath();
			return path;
		};
		const cloudBox = (cloud) => {
			const w = width / 3 * cloud.layer.size * cloud.stretch;
			const h = w * SPRITE_HEIGHT / SPRITE_WIDTH;
			const span = width + w;
			return {
				x: cloud.x * span % span - w,
				y: cloud.y * height,
				w,
				h
			};
		};
		const draw = () => {
			const gradient = context.createLinearGradient(0, 0, 0, height * RIDGE);
			for (const [stop, colour] of sky) gradient.addColorStop(stop / sky[sky.length - 1][0], colour);
			context.globalAlpha = 1;
			context.fillStyle = gradient;
			context.fillRect(0, 0, width, height);
			for (const cloud of clouds) {
				const sprite = spriteOf(cloud);
				if (!sprite) continue;
				const { x, y, w, h } = cloudBox(cloud);
				context.globalAlpha = cloud.layer.alpha;
				context.drawImage(sprite, x, y, w, h);
			}
			context.globalAlpha = 1;
			if (!hill.complete || !hill.naturalWidth) return;
			const { x, y, w, h } = hillLayout(width, height);
			context.drawImage(hill, x, y, w, h);
			if (f.shadows && shape) {
				context.save();
				context.clip(shape);
				for (const cloud of clouds) {
					if (cloud.layer !== layers[1]) continue;
					const sprite = spriteOf(cloud);
					if (!sprite) continue;
					const box = cloudBox(cloud);
					context.globalAlpha = .18;
					context.globalCompositeOperation = "multiply";
					context.drawImage(sprite, box.x, height * .62 + box.y * .6, box.w * 1.3, box.h * 1.8);
				}
				context.restore();
			}
		};
		return {
			configure: (next) => {
				f = next;
				scatter();
			},
			resize: (w, h) => {
				width = w;
				height = h;
				last = performance.now();
				shape = typeof Path2D === "undefined" ? null : outline();
				if (!clouds.length) scatter();
				draw();
			},
			frame: (now) => {
				if (made < kinds.length) {
					const kind = kinds[made++];
					const sprite = makeCloud(made, kind);
					if (sprite) sprites[kind].push(sprite);
				}
				const seconds = Math.min(.1, (now - last) / 1e3);
				last = now;
				for (const cloud of clouds) cloud.x += cloud.layer.speed * f.wind * seconds / 1e3;
				draw();
			}
		};
	}
};
//#endregion
export { hill_default as default, hillLayout, noise };
