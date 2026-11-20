import { it as qix } from "./HowToPlay-DBO26GVD.js";
//#region src/shell/backgrounds/qix.js
var palettes = {
	pastel: [
		"#ff2e97",
		"#0096d6",
		"#00a878",
		"#8a3ffc",
		"#ff7a3d"
	],
	sunset: [
		"#ff2e97",
		"#8a3ffc",
		"#ff7a3d",
		"#d6246e"
	],
	sea: [
		"#0096d6",
		"#00a878",
		"#3a6ff2",
		"#00b3c4"
	]
};
var GHOSTS = [[-1, "#ff71ce"], [1, "#01cdfe"]];
var tape = (seconds) => {
	const two = (value) => String(value).padStart(2, "0");
	return `${Math.floor(seconds / 3600)}:${two(Math.floor(seconds / 60) % 60)}:${two(seconds % 60)}`;
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
		let colours = palettes[options.palette].map(rgb);
		let played = 0;
		let shown = -1;
		const count = (passed) => {
			played += passed;
			const seconds = Math.floor(played / 1e3);
			if (seconds === shown) return;
			shown = seconds;
			document.documentElement.style.setProperty("--tape", `'SP  ${tape(seconds)}'`);
		};
		const outline = (points, shift) => {
			context.beginPath();
			points.forEach(([x, y], n) => n ? context.lineTo(x + shift, y) : context.moveTo(x + shift, y));
			context.closePath();
			context.stroke();
		};
		const build = () => {
			shapes = Array.from({ length: options.count }, () => makeShape(options.corners, width, height, 3 * pixels, Math.random));
			owed = 0;
		};
		const step = () => {
			for (const shape of shapes) stepShape(shape, width, height, options.trail);
		};
		const draw = () => {
			context.clearRect(0, 0, width, height);
			context.lineWidth = Math.max(1, 1.5 * pixels);
			context.lineJoin = "round";
			const bleed = options.bleed * pixels;
			for (const shape of shapes) shape.trail.forEach(({ hue, points }, k) => {
				const alpha = (k + 1) / shape.trail.length * (options.opacity / 100);
				if (bleed) {
					context.globalAlpha = alpha * .45;
					for (const [side, colour] of GHOSTS) {
						context.strokeStyle = colour;
						outline(points, side * bleed);
					}
				}
				context.globalAlpha = alpha;
				context.strokeStyle = `rgb(${hueAt(colours, hue).join(" ")})`;
				outline(points, 0);
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
				build();
			},
			frame: (now) => {
				const passed = Math.min(250, now - last);
				last = now;
				count(passed);
				owed = Math.min(4, owed + passed * options.speed / 30);
				if (owed < 1) return;
				for (; owed >= 1; owed--) step();
				draw();
			}
		};
	}
};
//#endregion
export { qix_default as default, hueAt, makeShape, stepShape, tape };
