//#region src/shell/backgrounds/shader.js
var vertex = `#version 300 es
in vec2 corner;
void main() { gl_Position = vec4(corner, 0., 1.); }`;
var fragmentOf = (shader) => `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform float brightness;
out vec4 shade;
${shader}
void main() {
  mainImage(shade, gl_FragCoord.xy);
  shade = vec4(shade.rgb * brightness, 1.);
}`;
var stretch = `#version 300 es
precision highp float;
uniform sampler2D image;
uniform vec2 imageSize;
uniform vec2 screen;
out vec4 shade;
void main() {
  vec2 at = gl_FragCoord.xy / screen * imageSize;
  vec2 centre = floor(at - 0.5) + 0.5;
  vec2 f = at - centre;
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;
  vec2 w0 = f2 - 0.5 * (f3 + f);
  vec2 w1 = 1.5 * f3 - 2.5 * f2 + 1.;
  vec2 w3 = 0.5 * (f3 - f2);
  vec2 w2 = 1. - w0 - w1 - w3;
  vec2 w12 = w1 + w2;
  vec2 p0 = (centre - 1.) / imageSize;
  vec2 p3 = (centre + 2.) / imageSize;
  vec2 p12 = (centre + w2 / w12) / imageSize;
  vec3 sum =
      texture(image, vec2(p0.x, p0.y)).rgb * w0.x * w0.y
    + texture(image, vec2(p12.x, p0.y)).rgb * w12.x * w0.y
    + texture(image, vec2(p3.x, p0.y)).rgb * w3.x * w0.y
    + texture(image, vec2(p0.x, p12.y)).rgb * w0.x * w12.y
    + texture(image, vec2(p12.x, p12.y)).rgb * w12.x * w12.y
    + texture(image, vec2(p3.x, p12.y)).rgb * w3.x * w12.y
    + texture(image, vec2(p0.x, p3.y)).rgb * w0.x * w3.y
    + texture(image, vec2(p12.x, p3.y)).rgb * w12.x * w3.y
    + texture(image, vec2(p3.x, p3.y)).rgb * w3.x * w3.y;
  shade = vec4(clamp(sum, 0., 1.), 1.);
}`;
var LOWEST = .3;
var BUDGET = .6;
var HOPELESS = 45;
var LONGEST = 66;
var gapOf = (fps) => Math.round(1e3 / (fps || 30));
var CHECK = 150;
var SETTLE = 1e3;
var COUNT = 20;
var LEAST_FPS = 10;
var frameRate = () => {
	let start = null;
	let last = null;
	let gaps = [];
	return (now) => {
		if (last !== null && now - last > 1e3) {
			start = now;
			gaps = [];
		}
		start ??= now;
		if (last !== null && now - start > SETTLE) gaps.push(now - last);
		last = now;
		if (gaps.length < COUNT) return null;
		return 1e3 / [...gaps].sort((x, y) => x - y)[10];
	};
};
var tooSlow = (fps) => fps !== null && fps < LEAST_FPS;
var adapt = ({ quality, gap }, cost, longest = LONGEST) => {
	if (cost <= gap * BUDGET) return {
		quality,
		gap
	};
	if (gap < longest) return {
		quality,
		gap: Math.min(longest, Math.ceil(cost / BUDGET))
	};
	if (quality <= LOWEST) return cost > HOPELESS ? null : {
		quality,
		gap
	};
	return {
		quality: Math.max(LOWEST, quality * .7),
		gap
	};
};
var compile = (gl, type, source) => {
	const made = gl.createShader(type);
	gl.shaderSource(made, source);
	gl.compileShader(made);
	if (!gl.getShaderParameter(made, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(made));
	return made;
};
var link = (gl, fragment) => {
	const program = gl.createProgram();
	gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
	gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
	gl.bindAttribLocation(program, 0, "corner");
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("no program");
	return program;
};
var shaderBackground = (meta, shader) => ({
	...meta,
	create: (gl, settings, { giveUp }) => {
		let options = settings;
		const program = link(gl, fragmentOf(shader));
		const upscale = link(gl, stretch);
		const triangle = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			3,
			-1,
			-1,
			3
		]), gl.STATIC_DRAW);
		const bind = () => {
			gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		};
		bind();
		const uniforms = {
			resolution: gl.getUniformLocation(program, "iResolution"),
			time: gl.getUniformLocation(program, "iTime"),
			brightness: gl.getUniformLocation(program, "brightness"),
			image: gl.getUniformLocation(upscale, "image"),
			imageSize: gl.getUniformLocation(upscale, "imageSize"),
			screen: gl.getUniformLocation(upscale, "screen")
		};
		const small = {
			texture: gl.createTexture(),
			framebuffer: gl.createFramebuffer(),
			w: 0,
			h: 0
		};
		let width = 0;
		let height = 0;
		let quality = 1;
		let gap = gapOf(options.fps);
		let clock = 0;
		let last = 0;
		let untilCheck = 0;
		let settled = 0;
		let warming = 2;
		let lost = false;
		const always = "always" in (globalThis.document?.documentElement.dataset ?? {});
		let rate = always ? null : frameRate();
		const pixel = /* @__PURE__ */ new Uint8Array(4);
		let drawn = {
			w: 0,
			h: 0
		};
		const size = () => {
			const scale = Math.min(1, options.resolution / 100 * quality);
			if (gl.canvas.width !== width || gl.canvas.height !== height) {
				gl.canvas.width = width;
				gl.canvas.height = height;
			}
			const w = Math.max(64, Math.round(width * scale));
			const h = Math.max(36, Math.round(height * scale));
			drawn = {
				w: Math.min(w, width),
				h: Math.min(h, height)
			};
			gl.canvas.dataset.size = `${drawn.w}x${drawn.h}`;
			if (drawn.w >= width && drawn.h >= height) return;
			if (small.w === drawn.w && small.h === drawn.h) return;
			small.w = drawn.w;
			small.h = drawn.h;
			gl.bindTexture(gl.TEXTURE_2D, small.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, small.w, small.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindFramebuffer(gl.FRAMEBUFFER, small.framebuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, small.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		};
		const paint = () => {
			const direct = drawn.w >= width && drawn.h >= height;
			gl.bindFramebuffer(gl.FRAMEBUFFER, direct ? null : small.framebuffer);
			gl.viewport(0, 0, direct ? width : small.w, direct ? height : small.h);
			gl.useProgram(program);
			gl.uniform3f(uniforms.resolution, direct ? width : small.w, direct ? height : small.h, 1);
			gl.uniform1f(uniforms.time, clock);
			gl.uniform1f(uniforms.brightness, (options.brightness ?? 100) / 100);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			if (direct) return;
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.viewport(0, 0, width, height);
			gl.useProgram(upscale);
			gl.bindTexture(gl.TEXTURE_2D, small.texture);
			gl.uniform1i(uniforms.image, 0);
			gl.uniform2f(uniforms.imageSize, small.w, small.h);
			gl.uniform2f(uniforms.screen, width, height);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		};
		gl.canvas.addEventListener("webglcontextlost", () => {
			lost = true;
			giveUp(true);
		});
		return {
			configure: (next) => {
				const resize = next.resolution !== options.resolution;
				const paced = next.fps !== options.fps;
				options = next;
				if (paced) gap = gapOf(options.fps);
				if (!width || !(resize || paced)) return;
				untilCheck = 0;
				settled = 0;
				if (resize) size();
			},
			resize: (w, h) => {
				bind();
				width = w;
				height = h;
				last = 0;
				untilCheck = 0;
				settled = 0;
				size();
			},
			frame: (now) => {
				if (lost) return;
				const fps = rate ? rate(now) : null;
				if (fps !== null) rate = null;
				if (tooSlow(fps)) return giveUp();
				if (!last) last = now - gap;
				const passed = now - last;
				if (passed < gap - 3) return;
				last = now;
				clock += Math.min(passed, 100) / 1e3 * options.speed;
				const timed = untilCheck-- <= 0;
				const began = timed ? performance.now() : 0;
				paint();
				if (!timed) return;
				gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
				const cost = performance.now() - began;
				if (warming-- > 0) return;
				gl.canvas.dataset.cost = Math.round(cost);
				const next = adapt({
					quality,
					gap
				}, cost, Math.max(LONGEST, gapOf(options.fps))) ?? (always ? {
					quality,
					gap
				} : null);
				if (next === null) return giveUp();
				if (next.quality !== quality || next.gap !== gap) {
					const resized = next.quality !== quality;
					quality = next.quality;
					gap = next.gap;
					settled = 0;
					if (resized) size();
				} else if (++settled >= 3) untilCheck = CHECK;
			}
		};
	}
});
//#endregion
export { shaderBackground as n, adapt as t };
