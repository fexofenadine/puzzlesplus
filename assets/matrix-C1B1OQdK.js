import { q as matrix } from "./HowToPlay-CdnnUesu.js";
import { i as drawGlyph, n as GLYPH, r as PAD, t as BRIGHT } from "./glyph-DM9oq3hS.js";
//#region src/shell/backgrounds/matrix.js
var GRID_SIZE = 70;
var GRID_DEPTH = 35;
var WAVE_SIZE = 22;
var SPLASH_RATIO = .7;
var TICK = 30;
var encodings = {
	matrix: [..."ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789"],
	binary: [..."01"],
	hexadecimal: [..."0123456789ABCDEF"],
	decimal: [..."0123456789"],
	dna: [..."ACGT"]
};
var frand = (n) => Math.random() * n;
var bellrand = (n) => (frand(n) + frand(n) + frand(n)) / 3;
var randomGlyph = (count) => Math.floor(Math.random() * count) + 1;
var ramp = Array.from({ length: WAVE_SIZE }, (_, i) => {
	return .2 + Math.sin((WAVE_SIZE - i) / 21 * Math.PI / 2) * .8;
});
var resetStrip = (s, count) => {
	s.x = frand(GRID_SIZE) - GRID_SIZE / 2;
	s.y = GRID_SIZE / 2 + bellrand(.5);
	s.z = GRID_DEPTH * .2 - frand(GRID_DEPTH * .7);
	s.dz = bellrand(.02);
	s.erasing = false;
	s.spinnerY = 0;
	s.spinnerSpeed = bellrand(.3);
	s.spinnerGlyph = -randomGlyph(count);
	s.spinSpeed = Math.floor(bellrand(2)) + 1;
	s.spinTick = 0;
	s.wavePosition = 0;
	s.waveSpeed = Math.floor(bellrand(3)) + 1;
	s.waveTick = 0;
	s.glyphs = Array.from({ length: GRID_SIZE }, () => {
		if (!Math.floor(Math.random() * 7)) return 0;
		const g = randomGlyph(count);
		return Math.floor(Math.random() * 20) ? g : -g;
	});
};
var tickStrip = (s, count) => {
	s.z += s.dz;
	if (s.z > GRID_DEPTH * SPLASH_RATIO) return resetStrip(s, count);
	s.spinnerY += s.spinnerSpeed;
	if (s.spinnerY >= GRID_SIZE) {
		if (s.erasing) return resetStrip(s, count);
		s.erasing = true;
		s.spinnerY = 0;
		s.spinnerSpeed /= 2;
	}
	if (++s.spinTick > s.spinSpeed) {
		s.spinTick = 0;
		s.spinnerGlyph = -randomGlyph(count);
		s.glyphs.forEach((g, i) => {
			if (g >= 0) return;
			s.glyphs[i] = Math.floor(Math.random() * 800) ? -randomGlyph(count) : randomGlyph(count);
		});
	}
	if (++s.waveTick > s.waveSpeed) {
		s.waveTick = 0;
		s.wavePosition = (s.wavePosition + 1) % WAVE_SIZE;
	}
};
var newStrip = (count) => {
	const s = {};
	resetStrip(s, count);
	s.erasing = Math.random() < .5;
	s.spinnerY = frand(GRID_SIZE);
	return s;
};
var buildAtlas = (glyphs, cell) => {
	const atlas = document.createElement("canvas");
	atlas.width = cell * glyphs.length;
	atlas.height = cell * 2;
	const context = atlas.getContext("2d");
	[GLYPH, BRIGHT].forEach((colour, row) => {
		glyphs.forEach((glyph, i) => {
			drawGlyph(context, glyph, (i + .5) * cell, (row + .5) * cell, cell, colour);
		});
	});
	return atlas;
};
var matrix_default = {
	...matrix,
	create: (context, settings) => {
		const cell = 96;
		let options = settings;
		let glyphs = encodings[options.encoding];
		let atlas = null;
		let strips = [];
		let width = 0;
		let height = 0;
		let last = 0;
		const configure = (next) => {
			if (next.encoding !== options.encoding || !strips.length) {
				glyphs = encodings[next.encoding];
				atlas = null;
				strips = [];
			}
			options = next;
			while (strips.length < options.density) strips.push(newStrip(glyphs.length));
			strips.length = options.density;
		};
		const draw = () => {
			context.globalCompositeOperation = "source-over";
			context.globalAlpha = 1;
			context.fillStyle = "#000";
			context.fillRect(0, 0, width, height);
			context.globalCompositeOperation = "lighter";
			const focal = height / 2 / Math.tan(40 * Math.PI / 180);
			const glyph = (g, x, y, z, brightness) => {
				const changing = g < 0;
				if (changing) brightness *= 1.5;
				if (options.fog) brightness *= .2 + (z / GRID_DEPTH + .5) * .8;
				if (z > GRID_DEPTH / 2) {
					const ratio = (z - GRID_DEPTH / 2) / (GRID_DEPTH * SPLASH_RATIO - GRID_DEPTH / 2);
					brightness *= ramp[Math.min(21, Math.max(0, Math.floor(ratio * WAVE_SIZE)))];
				}
				const top = y + 1;
				const depth = 25 - z;
				if (depth < 1) return;
				const scale = focal / depth;
				const sx = width / 2 + x * scale;
				const sy = height / 2 - top * scale;
				if (scale < 2 || sx > width || sy > height || sx + scale < 0 || sy + scale < 0) return;
				context.globalAlpha = Math.min(1, brightness);
				const index = Math.abs(g) - 1;
				const size = scale * PAD;
				const offset = (size - scale) / 2;
				context.drawImage(atlas, index * cell, changing ? cell : 0, cell, cell, sx - offset, sy - offset, size, size);
			};
			for (const s of strips) {
				s.glyphs.forEach((g, i) => {
					const passed = s.erasing ? s.spinnerY < i : s.spinnerY >= i;
					if (!g || !passed) return;
					const wave = WAVE_SIZE - (i + (GRID_SIZE - s.wavePosition)) % WAVE_SIZE;
					glyph(g, s.x, s.y - i, s.z, options.waves ? ramp[Math.min(wave, 21)] : 1);
				});
				if (!s.erasing) glyph(s.spinnerGlyph, s.x, s.y - s.spinnerY, s.z, 1);
			}
		};
		configure(settings);
		return {
			configure,
			resize: (w, h) => {
				width = w;
				height = h;
				last = performance.now();
			},
			frame: (now) => {
				const tick = TICK / options.speed;
				if (now - last < tick) return;
				const ticks = Math.min(3, Math.floor((now - last) / tick));
				last = now;
				for (let n = 0; n < ticks; n++) strips.forEach((s) => tickStrip(s, glyphs.length));
				atlas ??= buildAtlas(glyphs, cell);
				draw();
			}
		};
	}
};
//#endregion
export { matrix_default as default };
