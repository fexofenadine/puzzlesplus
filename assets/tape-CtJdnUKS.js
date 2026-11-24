//#region src/shell/backgrounds/tape.js
var tape = (seconds) => {
	const two = (value) => String(value).padStart(2, "0");
	return `${Math.floor(seconds / 3600)}:${two(Math.floor(seconds / 60) % 60)}:${two(seconds % 60)}`;
};
var tapeCounter = () => {
	let played = 0;
	let shown = -1;
	return (passed) => {
		played += passed;
		const seconds = Math.floor(played / 1e3);
		if (seconds === shown) return;
		shown = seconds;
		document.documentElement.style.setProperty("--tape", `'SP  ${tape(seconds)}'`);
	};
};
//#endregion
export { tapeCounter as n, tape as t };
