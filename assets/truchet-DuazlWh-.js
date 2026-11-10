import { X as truchet } from "./HowToPlay-CdnnUesu.js";
//#region src/shell/backgrounds/truchet.js
var MAXRATIO = 2;
var palettes = {
	accents: [
		"#b58900",
		"#cb4b16",
		"#dc322f",
		"#d33682",
		"#6c71c4",
		"#268bd2",
		"#2aa198",
		"#859900"
	],
	cool: [
		"#6c71c4",
		"#268bd2",
		"#2aa198",
		"#859900"
	],
	warm: [
		"#b58900",
		"#cb4b16",
		"#dc322f",
		"#d33682"
	],
	base: [
		"#586e75",
		"#657b83",
		"#839496",
		"#93a1a1"
	]
};
var BACKGROUND = "#002b36";
var random = (n) => Math.floor(Math.random() * n);
var xarc = (context, x, y, w, h, a1, a2) => {
	const rad = Math.PI / 11520;
	context.moveTo(x + w / 2 + w / 2 * Math.cos(a1 * rad), y + h / 2 - h / 2 * Math.sin(a1 * rad));
	context.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, -a1 * rad, -(a1 + a2) * rad, a2 > 0);
};
var line = (context, x1, y1, x2, y2) => {
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
};
var curve = (context, x, y, w, h, flip) => {
	if (!flip) {
		xarc(context, x - w / 2, y - h / 2, w, h, 0, -5760);
		xarc(context, x + w / 2, y + h / 2, w, h, 11520, -5760);
	} else {
		xarc(context, x + w / 2, y - h / 2, w, h, 17280, -5760);
		xarc(context, x - w / 2, y + h / 2, w, h, 0, 5760);
	}
};
var angle = (context, x, y, w, h, flip) => {
	if (!flip) {
		line(context, x + w / 2, y, x + w, y + h / 2);
		line(context, x, y + h / 2, x + w / 2, y + h);
	} else {
		line(context, x + w / 2, y, x, y + h / 2);
		line(context, x + w, y + h / 2, x + w / 2, y + h);
	}
};
var truchet_default = {
	...truchet,
	create: (context, settings) => {
		let f = settings;
		let width = 0;
		let height = 0;
		let pixels = 1;
		let overlap = 0;
		let layers = [];
		let count = 0;
		let scrolling = 0;
		let last = 0;
		let wait = 0;
		const pattern = () => {
			let linewidth = random(f.maxLineWidth);
			if (linewidth < f.minLineWidth) linewidth = f.minLineWidth;
			if (linewidth % 2) linewidth++;
			let w = random(f.maxWidth);
			let h = random(f.maxWidth);
			if (w === 0 || h === 0) w = h = f.maxWidth;
			if (h < f.minWidth) h = f.minWidth;
			if (w < f.minWidth) w = f.minWidth;
			if (f.square) h = w;
			if (Math.floor(w / h) > MAXRATIO) h = w;
			if (Math.floor(h / w) > MAXRATIO) w = h;
			if (linewidth >= h / 5) linewidth = Math.floor(h / 5);
			linewidth = Math.max(1, linewidth);
			if (f.erase || count >= f.eraseCount) {
				layers = [];
				count = 0;
			}
			overlap = f.scroll ? 400 * pixels : 0;
			const kind = f.angles && (!f.curves || random(2)) ? "angle" : "curve";
			const colours = palettes[f.palette];
			const cols = Math.ceil((width + overlap) / (w * pixels)) + 1;
			const rows = Math.ceil((height + overlap) / (h * pixels)) + 1;
			layers.push({
				kind,
				w: w * pixels,
				h: h * pixels,
				linewidth: linewidth * pixels,
				colour: colours[random(colours.length)],
				cols,
				tiles: Uint8Array.from({ length: cols * rows }, () => random(2))
			});
			count++;
			if (f.scroll) scrolling = Math.floor(overlap / pixels / 4 / f.animStep) * 4;
		};
		const offsetOf = () => {
			if (!f.scroll) return [0, 0];
			const offset = overlap / 2;
			const scroll = overlap / pixels / 4;
			const legs = Math.max(1, Math.floor(scroll / f.animStep));
			const direction = Math.floor(scrolling / legs);
			const progress = scrolling % legs * f.animStep;
			let x = direction & 1 ? progress - scroll : -progress;
			let y = direction & 1 ? progress : progress - scroll;
			if (direction & 2) {
				x = -x;
				y = -y;
			}
			return [x * pixels + offset, y * pixels + offset];
		};
		const draw = () => {
			const [ox, oy] = offsetOf();
			context.globalAlpha = 1;
			context.fillStyle = BACKGROUND;
			context.fillRect(0, 0, width, height);
			context.globalAlpha = f.opacity / 100;
			context.lineCap = "round";
			context.lineJoin = "round";
			for (const layer of layers) {
				const { w, h, cols, tiles } = layer;
				const tile = layer.kind === "curve" ? curve : angle;
				context.strokeStyle = layer.colour;
				context.lineWidth = layer.linewidth;
				context.beginPath();
				const x0 = Math.max(0, Math.floor(ox / w) - 1);
				const y0 = Math.max(0, Math.floor(oy / h) - 1);
				const x1 = Math.min(cols, Math.ceil((ox + width) / w) + 1);
				const y1 = Math.min(tiles.length / cols, Math.ceil((oy + height) / h) + 1);
				for (let cy = y0; cy < y1; cy++) for (let cx = x0; cx < x1; cx++) tile(context, cx * w - ox, cy * h - oy, w, h, tiles[cy * cols + cx]);
				context.stroke();
			}
			context.globalAlpha = 1;
		};
		const restart = () => {
			layers = [];
			count = 0;
			scrolling = 0;
			pattern();
			wait = f.scroll ? f.animDelay : f.delay * 1e3;
			draw();
		};
		return {
			configure: (next) => {
				f = next;
				if (width) restart();
			},
			resize: (w, h, scale = 1) => {
				width = w;
				height = h;
				pixels = scale;
				last = performance.now();
				restart();
			},
			frame: (now) => {
				if (now - last < wait) return;
				last = now;
				if (scrolling) {
					scrolling--;
					wait = f.animDelay;
				} else {
					pattern();
					wait = f.scroll ? f.animDelay : f.delay * 1e3;
				}
				draw();
			},
			still: () => {
				scrolling = 0;
				draw();
				return true;
			}
		};
	}
};
//#endregion
export { truchet_default as default };
