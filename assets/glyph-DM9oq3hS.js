//#region src/shell/backgrounds/glyph.js
var PAD = 1.6;
var GLYPH = "#2cff6e";
var BRIGHT = "#d4ffe0";
var drawGlyph = (context, glyph, x, y, cell, colour) => {
	context.save();
	context.font = `${Math.round(cell / PAD * .8)}px monospace`;
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = colour;
	context.shadowColor = colour;
	context.translate(x, y);
	context.scale(-1, 1);
	context.shadowBlur = cell * .3;
	context.fillText(glyph, 0, 0);
	context.fillText(glyph, 0, 0);
	context.shadowBlur = cell * .07;
	context.fillText(glyph, 0, 0);
	context.restore();
};
var glyphImage = (glyph, cell, colour = GLYPH) => {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = cell;
	const context = canvas.getContext("2d");
	if (!context) return null;
	drawGlyph(context, glyph, cell / 2, cell / 2, cell, colour);
	return canvas.toDataURL();
};
//#endregion
export { glyphImage as a, drawGlyph as i, GLYPH as n, PAD as r, BRIGHT as t };
