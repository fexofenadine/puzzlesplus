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
var LOWEST = .3;
var SLOW = 20;
var HOPELESS = 45;
var GAP = 33;
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
var adapt = (quality, cost) => {
	if (cost <= SLOW) return quality;
	if (quality <= LOWEST) return cost > HOPELESS ? null : quality;
	return Math.max(LOWEST, quality * .7);
};
var compile = (gl, type, source) => {
	const made = gl.createShader(type);
	gl.shaderSource(made, source);
	gl.compileShader(made);
	if (!gl.getShaderParameter(made, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(made));
	return made;
};
var shaderBackground = (meta, shader) => ({
	...meta,
	create: (gl, settings, { giveUp }) => {
		let options = settings;
		const program = gl.createProgram();
		gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
		gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentOf(shader)));
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("no program");
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
		const corner = gl.getAttribLocation(program, "corner");
		const bind = () => {
			gl.useProgram(program);
			gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
			gl.enableVertexAttribArray(corner);
			gl.vertexAttribPointer(corner, 2, gl.FLOAT, false, 0, 0);
		};
		bind();
		const uniforms = {
			resolution: gl.getUniformLocation(program, "iResolution"),
			time: gl.getUniformLocation(program, "iTime"),
			brightness: gl.getUniformLocation(program, "brightness")
		};
		let width = 0;
		let height = 0;
		let quality = 1;
		let clock = 0;
		let last = 0;
		let untilCheck = 0;
		let settled = 0;
		let warming = 2;
		let lost = false;
		let rate = frameRate();
		const pixel = /* @__PURE__ */ new Uint8Array(4);
		const size = () => {
			const scale = options.resolution / 100 * quality;
			gl.canvas.width = Math.max(64, Math.round(width * scale));
			gl.canvas.height = Math.max(36, Math.round(height * scale));
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		};
		gl.canvas.addEventListener("webglcontextlost", () => {
			lost = true;
			giveUp();
		});
		return {
			configure: (next) => {
				const resize = next.resolution !== options.resolution;
				options = next;
				if (!width || !resize) return;
				untilCheck = 0;
				settled = 0;
				size();
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
				if (!last) last = now - GAP;
				const passed = now - last;
				if (passed < GAP) return;
				last = now;
				clock += Math.min(passed, 100) / 1e3 * options.speed;
				const timed = untilCheck-- <= 0;
				const began = timed ? performance.now() : 0;
				gl.uniform3f(uniforms.resolution, gl.canvas.width, gl.canvas.height, 1);
				gl.uniform1f(uniforms.time, clock);
				gl.uniform1f(uniforms.brightness, (options.brightness ?? 100) / 100);
				gl.drawArrays(gl.TRIANGLES, 0, 3);
				if (!timed) return;
				gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
				const cost = performance.now() - began;
				if (warming-- > 0) return;
				gl.canvas.dataset.cost = Math.round(cost);
				const next = adapt(quality, cost);
				if (next === null) return giveUp();
				if (next !== quality) {
					quality = next;
					settled = 0;
					size();
				} else if (++settled >= 3) untilCheck = CHECK;
			}
		};
	}
});
//#endregion
export { shaderBackground as n, adapt as t };
