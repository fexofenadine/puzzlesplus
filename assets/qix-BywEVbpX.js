import { at as qix } from "./HowToPlay-BzzntM0_.js";
//#region src/shell/backgrounds/qix.js
var SKY = ["#00545c", "#3b2c70"];
var palettes = {
	pastel: [
		"#ff71ce",
		"#01cdfe",
		"#05ffa1",
		"#b967ff",
		"#fffb96"
	],
	sunset: [
		"#ff71ce",
		"#b967ff",
		"#fffb96",
		"#ff9e7a"
	],
	sea: [
		"#01cdfe",
		"#05ffa1",
		"#7ee8fa",
		"#b8ffe3"
	]
};
var rgb = (hex) => [
	1,
	3,
	5
].map((at) => parseInt(hex.slice(at, at + 2), 16));
var hueAt = (colours, at) => {
	const k = (at % colours.length + colours.length) % colours.length;
	const a = colours[Math.floor(k)];
	const b = colours[(Math.floor(k) + 1) % colours.length];
	const t = k - Math.floor(k);
	return a.map((v, c) => Math.round(v + (b[c] - v) * t));
};
var makeShape = (corners, width, height, pace, rng) => ({
	points: Array.from({ length: corners }, () => ({
		x: rng() * width,
		y: rng() * height,
		dx: (rng() < .5 ? -1 : 1) * pace * (.5 + rng()),
		dy: (rng() < .5 ? -1 : 1) * pace * (.5 + rng())
	})),
	trail: [],
	hue: rng() * 5
});
var stepShape = (shape, width, height, length) => {
	for (const p of shape.points) {
		p.x += p.dx;
		p.y += p.dy;
		if (p.x < 0 || p.x > width) {
			p.dx = -p.dx;
			p.x = Math.max(0, Math.min(width, p.x));
		}
		if (p.y < 0 || p.y > height) {
			p.dy = -p.dy;
			p.y = Math.max(0, Math.min(height, p.y));
		}
	}
	shape.hue += .004;
	shape.trail.push({
		hue: shape.hue,
		points: shape.points.map(({ x, y }) => [x, y])
	});
	while (shape.trail.length > length) shape.trail.shift();
};
var qix_default = {
	...qix,
	create: (context, settings) => {
		let options = settings;
		let width = 0;
		let height = 0;
		let pixels = 1;
		let shapes = [];
		let last = 0;
		let owed = 0;
		let sky = null;
		let colours = palettes[options.palette].map(rgb);
		const build = () => {
			shapes = Array.from({ length: options.count }, () => makeShape(options.corners, width, height, 3 * pixels, Math.random));
			owed = 0;
		};
		const step = () => {
			for (const shape of shapes) stepShape(shape, width, height, options.trail);
		};
		const draw = () => {
			context.globalAlpha = 1;
			context.fillStyle = sky;
			context.fillRect(0, 0, width, height);
			context.lineWidth = Math.max(1, 1.5 * pixels);
			context.lineJoin = "round";
			for (const shape of shapes) shape.trail.forEach(({ hue, points }, k) => {
				context.globalAlpha = (k + 1) / shape.trail.length * (options.opacity / 100);
				context.strokeStyle = `rgb(${hueAt(colours, hue).join(" ")})`;
				context.beginPath();
				points.forEach(([x, y], n) => n ? context.lineTo(x, y) : context.moveTo(x, y));
				context.closePath();
				context.stroke();
			});
			context.globalAlpha = 1;
		};
		return {
			configure: (next) => {
				const rebuild = next.count !== options.count || next.corners !== options.corners;
				options = next;
				colours = palettes[options.palette].map(rgb);
				if (width && rebuild) build();
			},
			resize: (w, h, scale = 1) => {
				width = w;
				height = h;
				pixels = scale;
				last = performance.now();
				sky = context.createLinearGradient(0, 0, 0, height);
				sky.addColorStop(0, SKY[0]);
				sky.addColorStop(1, SKY[1]);
				build();
			},
			frame: (now) => {
				const passed = Math.min(250, now - last);
				last = now;
				owed = Math.min(4, owed + passed * options.speed / 30);
				if (owed < 1) return;
				for (; owed >= 1; owed--) step();
				draw();
			},
			still: () => {
				for (let k = 0; k < options.trail * 3; k++) step();
				draw();
				return true;
			}
		};
	}
};
//#endregion
export { qix_default as default, hueAt, makeShape, stepShape };
