import { et as hextrail } from "./Taskbar-CoMVUW-1.js";
//#region src/shell/backgrounds/hextrail.js
var EMPTY = 0;
var IN = 1;
var WAIT = 2;
var OUT = 3;
var DONE = 4;
var FIRST = 0;
var DRAW = 1;
var FADE = 2;
var H = Math.sqrt(3) / 2;
var corners = [
	[0, -1],
	[H, -.5],
	[H, .5],
	[0, 1],
	[-H, .5],
	[-H, -.5]
];
var shifts = [
	[
		0,
		1,
		-1
	],
	[
		1,
		1,
		0
	],
	[
		0,
		1,
		1
	],
	[
		-1,
		0,
		1
	],
	[
		-1,
		-1,
		0
	],
	[
		-1,
		0,
		-1
	]
];
var palettes = {
	sea: [
		"#2bb3b1",
		"#35b58f",
		"#3aa66c",
		"#2f9fa8",
		"#3585c4",
		"#3a63c8",
		"#4a4fc4",
		"#7a4fc0"
	],
	teal: [
		"#a1cdd8",
		"#7aa4a1",
		"#5a93aa",
		"#4fb3a5",
		"#3f9e9a",
		"#5a93aa",
		"#7aa4a1",
		"#a1cdd8"
	],
	ember: [
		"#fda47f",
		"#ff8349",
		"#e85c51",
		"#cb7985",
		"#ad5c7c",
		"#cb7985",
		"#e85c51",
		"#ff8349"
	]
};
var GROUND = [
	15,
	28,
	30
];
var rgb = (hex) => [
	1,
	3,
	5
].map((at) => parseInt(hex.slice(at, at + 2), 16));
var makePlane = (gridW, gridH, colours, rng) => {
	const hexagons = Array.from({ length: gridW * gridH }, (_, i) => ({
		x: i % gridW,
		y: Math.floor(i / gridW),
		neighbors: new Array(6).fill(null),
		arms: Array.from({ length: 6 }, () => ({
			state: 0,
			ratio: 0,
			speed: 0
		})),
		ccolor: Math.floor(rng() * colours),
		borderState: 0,
		borderRatio: 0
	}));
	for (const h0 of hexagons) shifts.forEach(([even, odd, down], arm) => {
		const x1 = h0.x + (h0.y & 1 ? odd : even);
		const y1 = h0.y + down;
		if (x1 >= 0 && x1 < gridW && y1 >= 0 && y1 < gridH) h0.neighbors[arm] = hexagons[y1 * gridW + x1];
	});
	return hexagons;
};
var emptyHexagon = (h) => h.arms.every((arm) => arm.state === 0);
var network = (gridW, gridH, colours, rng) => {
	const plane = {
		hexagons: makePlane(gridW, gridH, colours, rng),
		live: 0,
		state: FIRST,
		fade: 1
	};
	const addArms = (h0, out, speed) => {
		let added = 0;
		let target = 1 + Math.floor(rng() * 4);
		const order = [
			0,
			1,
			2,
			3,
			4,
			5
		];
		for (let i = 0; i < 6; i++) {
			const j = Math.floor(rng() * 6);
			[order[i], order[j]] = [order[j], order[i]];
		}
		if (out) target--;
		for (const j of order) {
			const h1 = h0.neighbors[j];
			const a0 = h0.arms[j];
			if (!h1 || !emptyHexagon(h1) || a0.state !== 0) continue;
			const a1 = h1.arms[(j + 3) % 6];
			a0.state = out ? 3 : 1;
			a1.state = 2;
			a0.ratio = 0;
			a1.ratio = 0;
			a0.speed = .05 * speed * (.8 + rng());
			a1.speed = a0.speed;
			if (h1.borderState === 0) {
				h1.borderState = 1;
				h1.ccolor = h0.ccolor;
				if (!Math.floor(rng() * 5)) h1.ccolor = (h0.ccolor + 1) % colours;
			}
			plane.live++;
			added++;
			if (added >= target) break;
		}
		return added;
	};
	const tick = (speed) => {
		const { hexagons } = plane;
		for (const h0 of hexagons) {
			for (let j = 0; j < 6; j++) {
				const a0 = h0.arms[j];
				if (a0.state === 3) {
					a0.ratio += a0.speed;
					if (a0.ratio > 1) {
						const a1 = h0.neighbors[j].arms[(j + 3) % 6];
						a0.state = 4;
						a0.ratio = 1;
						a1.state = 1;
						a1.ratio = 0;
						a1.speed = a0.speed;
					}
				} else if (a0.state === 1) {
					a0.ratio += a0.speed;
					if (a0.ratio > 1) {
						a0.state = 4;
						a0.ratio = 1;
						plane.live--;
						addArms(h0, true, speed);
					}
				}
			}
			if (h0.borderState === 1) {
				h0.borderRatio += .05 * speed;
				if (h0.borderRatio >= 1) {
					h0.borderRatio = 1;
					h0.borderState = 2;
				}
			} else if (h0.borderState === 3) {
				h0.borderRatio -= .05 * speed;
				if (h0.borderRatio <= 0) {
					h0.borderRatio = 0;
					h0.borderState = 0;
				}
			} else if (h0.borderState === 2) {
				if (!Math.floor(rng() * 50)) h0.borderState = 3;
			}
		}
		if (plane.live <= 0) for (let i = 0; i < hexagons.length / 3; i++) {
			let x;
			let y;
			if (plane.state === FIRST) {
				x = Math.floor(gridW / 2);
				y = Math.floor(gridH / 2);
				plane.state = DRAW;
				plane.fade = 1;
			} else {
				x = Math.floor(rng() * gridW);
				y = Math.floor(rng() * gridH);
			}
			const h0 = hexagons[y * gridW + x];
			if (emptyHexagon(h0) && addArms(h0, true, speed)) break;
		}
		if (plane.live <= 0 && plane.state !== 2) {
			plane.state = 2;
			plane.fade = 1;
			for (const h of hexagons) if (h.borderState === 1 || h.borderState === 2) h.borderState = 3;
		} else if (plane.state === 2) {
			plane.fade -= .01 * speed;
			if (plane.fade <= 0) {
				plane.hexagons = makePlane(gridW, gridH, colours, rng);
				plane.live = 0;
				plane.state = FIRST;
				plane.fade = 1;
			}
		}
	};
	return {
		plane,
		tick
	};
};
var hextrail_default = {
	...hextrail,
	create: (context, settings) => {
		let options = settings;
		let width = 0;
		let height = 0;
		let pixels = 1;
		let size = 30;
		let gridW = 0;
		let gridH = 0;
		let net = null;
		let colours = [];
		let last = 0;
		let owed = 0;
		const ground = `rgb(${GROUND.join(" ")})`;
		const build = () => {
			size = options.size * pixels;
			gridW = Math.ceil(width / (2 * H * size)) + 2;
			gridH = Math.ceil(height / (1.5 * size)) + 2;
			colours = palettes[options.palette].map(rgb);
			net = network(gridW, gridH, colours.length, Math.random);
			owed = 0;
		};
		const centre = (h) => [(h.x + (h.y & 1 ? .5 : 0) - .5) * 2 * H * size, (h.y - .5) * 1.5 * size];
		const shade = (colour, ratio = 1) => {
			const k = net.plane.fade * (options.opacity / 100) * ratio;
			return `rgb(${colour.map((v, c) => Math.round(GROUND[c] + (v - GROUND[c]) * k)).join(" ")})`;
		};
		const draw = () => {
			context.globalAlpha = 1;
			context.fillStyle = ground;
			context.fillRect(0, 0, width, height);
			const thick = options.thickness / 100;
			const thick2 = thick * net.plane.fade;
			const margin = thick * .4;
			const size1 = size * (1 - margin * 2);
			const size2 = size * (1 - margin * 3);
			context.lineCap = "butt";
			for (const h of net.plane.hexagons) {
				const [cx, cy] = centre(h);
				const colour = colours[h.ccolor];
				let total = 0;
				for (const arm of h.arms) if (arm.state === 3 || arm.state === 4) total++;
				if (options.borders && h.borderState !== 0) {
					context.strokeStyle = shade(colour, h.borderRatio);
					context.lineWidth = size1 - size2;
					context.beginPath();
					const middle = (size1 + size2) / 2;
					corners.forEach(([x, y], k) => {
						if (k) context.lineTo(cx + x * middle, cy + y * middle);
						else context.moveTo(cx + x * middle, cy + y * middle);
					});
					context.closePath();
					context.stroke();
				}
				for (let j = 0; j < 6; j++) {
					const arm = h.arms[j];
					if (arm.state !== 1 && arm.state !== 3 && arm.state !== 4) continue;
					const k = (j + 1) % 6;
					const x = (corners[j][0] + corners[k][0]) / 2;
					const y = (corners[j][1] + corners[k][1]) / 2;
					const near = colours[h.neighbors[j].ccolor].map((v, c) => (v + colour[c]) / 2);
					const [start, end, from, to] = arm.state === 3 ? [
						0,
						size * arm.ratio,
						colour,
						near
					] : [
						size,
						size * (1 - arm.ratio),
						near,
						colour
					];
					const x0 = cx + x * start;
					const y0 = cy + y * start;
					const x1 = cx + x * end;
					const y1 = cy + y * end;
					if (x0 === x1 && y0 === y1) continue;
					const line = context.createLinearGradient(x0, y0, x1, y1);
					line.addColorStop(0, shade(from));
					line.addColorStop(1, shade(to));
					context.strokeStyle = line;
					context.lineWidth = Math.max(1, 2 * size2 * thick2);
					context.beginPath();
					context.moveTo(x0, y0);
					context.lineTo(x1, y1);
					context.stroke();
				}
				if (total) {
					const size3 = size * thick2 * .8 * (total === 1 ? 2 : 1) * 1.2;
					context.fillStyle = shade(colour);
					context.beginPath();
					corners.forEach(([x, y], k) => {
						if (k) context.lineTo(cx + x * size3, cy + y * size3);
						else context.moveTo(cx + x * size3, cy + y * size3);
					});
					context.closePath();
					context.fill();
				}
			}
		};
		return {
			configure: (next) => {
				const rebuild = next.size !== options.size || next.palette !== options.palette;
				options = next;
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
				owed = Math.min(4, owed + passed / 30);
				if (owed < 1) return;
				for (; owed >= 1; owed--) net.tick(options.speed);
				draw();
			},
			still: () => {
				for (let guard = 0; guard < 2e5 && net.plane.state !== 2; guard++) net.tick(4);
				net.plane.fade = 1;
				draw();
				return true;
			}
		};
	}
};
//#endregion
export { DONE, EMPTY, FADE, IN, OUT, WAIT, hextrail_default as default, makePlane, network };
