import { C as hangBelow, F as Button, L as h } from "./actions-CwmsdzSZ.js";
var Digit_module_default = {
	root: "Digit_root",
	digit: "Digit_digit",
	t: "Digit_t",
	rt: "Digit_rt",
	rb: "Digit_rb",
	b: "Digit_b",
	lb: "Digit_lb",
	lt: "Digit_lt",
	m: "Digit_m",
	lcdGlitch: "Digit_lcdGlitch",
	lcdBand: "Digit_lcdBand",
	lcdFlicker: "Digit_lcdFlicker"
};
//#endregion
//#region src/Digit.jsx
var Digit = ({ value, digits = 3 }) => /* @__PURE__ */ h("div", { class: Digit_module_default.root }, `000${Math.max(-99, Math.min(10 ** digits - 1, value))}`.slice(-digits).split("").sort((a) => a === "-" ? -1 : 0).map((digit) => /* @__PURE__ */ h("svg", {
	class: Digit_module_default.digit,
	width: "13",
	height: "23",
	"data-n": digit
}, /* @__PURE__ */ h("path", {
	class: Digit_module_default.t,
	d: "M1.5 1l3 3h4l3-3h-10z"
}), /* @__PURE__ */ h("path", {
	class: Digit_module_default.rt,
	d: "M12 1.5l-3 3v4l3 3v-10z"
}), /* @__PURE__ */ h("path", {
	class: Digit_module_default.rb,
	d: "M12 11.5l-3 3v4l3 3v-10z"
}), /* @__PURE__ */ h("path", {
	class: Digit_module_default.b,
	d: "M11.5 22l-3-3h-4l-3 3h10z"
}), /* @__PURE__ */ h("path", {
	class: Digit_module_default.lb,
	d: "M1 21.5l3-3v-4l-3-3v10z"
}), /* @__PURE__ */ h("path", {
	class: Digit_module_default.lt,
	d: "M1 1.5v10l3-3v-4l-3-3z"
}), /* @__PURE__ */ h("path", {
	class: Digit_module_default.m,
	d: "M8.5 13h-4L3 11.5 4.5 10h4l1.5 1.5L8.5 13z"
}))));
var Play_module_default = {
	root: "Play_root",
	down: "Play_down",
	up: "Play_up",
	face: "Play_face",
	skin: "Play_skin"
};
//#endregion
//#region src/Play.jsx
var Smile = () => /* @__PURE__ */ h("g", null, /* @__PURE__ */ h("circle", {
	cx: "12",
	cy: "7",
	r: "1.5"
}), /* @__PURE__ */ h("circle", {
	cx: "7",
	cy: "7",
	r: "1.5"
}), /* @__PURE__ */ h("path", { d: "M13.779 11.1a.5.5 0 0 0-.7.1 4.455 4.455 0 0 1-7.158 0 .5.5 0 0 0-.8.6 5.455 5.455 0 0 0 8.752 0 .5.5 0 0 0-.094-.7z" }));
var Afraid = () => /* @__PURE__ */ h("g", null, /* @__PURE__ */ h("circle", {
	cx: "12.5",
	cy: "6.5",
	r: "1.5"
}), /* @__PURE__ */ h("circle", {
	cx: "6.5",
	cy: "6.5",
	r: "1.5"
}), /* @__PURE__ */ h("path", { d: "M9.5 10a2.5 2.5 0 1 0 2.5 2.5A2.5 2.5 0 0 0 9.5 10zm0 4a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 9.5 14z" }));
var Sunglasses = () => /* @__PURE__ */ h("path", { d: "M12.227 12.188a5.067 5.067 0 0 1-5.454 0 .5.5 0 0 0-.546.837 5.981 5.981 0 0 0 6.546 0 .5.5 0 1 0-.546-.837zm4.627-3.042l-3-3A.5.5 0 0 0 13.5 6h-8a.5.5 0 0 0-.354.146l-3 3a.5.5 0 0 0 .708.708L5 7.707V9a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2V7h1v1a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1V7.707l2.146 2.147a.5.5 0 0 0 .708-.708z" });
var Sad = () => /* @__PURE__ */ h("path", { d: "M5.146 7.854a.5.5 0 0 0 .708 0l.646-.647.646.647a.5.5 0 0 0 .708-.708L7.207 6.5l.647-.646a.5.5 0 0 0-.708-.708l-.646.647-.646-.647a.5.5 0 0 0-.708.708l.647.646-.647.646a.5.5 0 0 0 0 .708zM13.207 6.5l.647-.646a.5.5 0 0 0-.708-.708l-.646.647-.646-.647a.5.5 0 0 0-.708.708l.647.646-.647.646a.5.5 0 0 0 .708.708l.646-.647.646.647a.5.5 0 0 0 .708-.708zM9.5 11a5.455 5.455 0 0 0-4.376 2.2.5.5 0 0 0 .8.6 4.455 4.455 0 0 1 7.158 0 .5.5 0 0 0 .8-.6A5.453 5.453 0 0 0 9.5 11z" });
var Face = ({ pressed, win, lose }) => {
	if (pressed) return /* @__PURE__ */ h(Afraid, null);
	if (lose) return /* @__PURE__ */ h(Sad, null);
	if (win) return /* @__PURE__ */ h(Sunglasses, null);
	return /* @__PURE__ */ h(Smile, null);
};
var Play = ({ pressed, lose, win, onReset }) => /* @__PURE__ */ h("button", {
	class: Play_module_default.root,
	type: "button",
	tabindex: -1,
	onclick: () => onReset(),
	oncreate: (el) => el.focus()
}, /* @__PURE__ */ h("svg", {
	class: Play_module_default.face,
	width: "19",
	height: "19"
}, /* @__PURE__ */ h("circle", {
	class: Play_module_default.skin,
	cx: "9.5",
	cy: "9.5",
	r: "8.5"
}), /* @__PURE__ */ h("path", { d: "M9.5 2A7.5 7.5 0 1 1 2 9.5 7.508 7.508 0 0 1 9.5 2m0-1A8.5 8.5 0 1 0 18 9.5 8.5 8.5 0 0 0 9.5 1z" }), /* @__PURE__ */ h("g", { class: Play_module_default.up }, /* @__PURE__ */ h(Face, {
	pressed,
	lose,
	win
})), /* @__PURE__ */ h("g", { class: Play_module_default.down }, /* @__PURE__ */ h(Smile, null))));
var SideButton_module_default = { root: "SideButton_root" };
//#endregion
//#region src/shell/SideButton.jsx
var SideButton = ({ title, disabled, onClick }, children) => /* @__PURE__ */ h("button", {
	type: "button",
	class: SideButton_module_default.root,
	tabindex: -1,
	title,
	disabled,
	onclick: () => onClick()
}, /* @__PURE__ */ h("svg", {
	width: "19",
	height: "19"
}, children));
var HintIcon = () => /* @__PURE__ */ h("path", { d: "M9.5 2a4.5 4.5 0 0 0-4.5 4.5h2a2.5 2.5 0 1 1 3.4 2.3c-1 .4-1.9 1.3-1.9 2.6V13h2v-1.6c0-.4.3-.7.7-.8A4.5 4.5 0 0 0 9.5 2zm-1 12.5v2h2v-2z" });
var UndoIcon = () => /* @__PURE__ */ h("path", { d: "M8 4L3 8.5 8 13v-3h4.5a2.5 2.5 0 0 1 0 5H9v2h3.5a4.5 4.5 0 0 0 0-9H8z" });
var FillIcon = () => /* @__PURE__ */ h("path", { d: "M4 4h11v11H4z" });
var CrossIcon = () => /* @__PURE__ */ h("path", { d: "M4.5 3L3 4.5 8 9.5l-5 5L4.5 16l5-5 5 5 1.5-1.5-5-5 5-5L14.5 3l-5 5z" });
//#endregion
//#region src/shell/WindowControls.jsx
var MAXIMISE = "M2 1h9v9H2zM3 3v6h7V3z";
var RESTORE = "M2 4h6v6H2zM3 6v3h4V6zM4 1h6v6H8V6h1V3H5v1H4z";
var WindowControls = ({ paused, canPause, onPause, maximised, onMinimise, onMaximise }) => [
	/* @__PURE__ */ h(Button, {
		tabIndex: -1,
		title: paused ? "Resume (P)" : "Pause (P)",
		disabled: !canPause,
		onClick: () => onPause()
	}, /* @__PURE__ */ h("svg", {
		width: "13",
		height: "11"
	}, /* @__PURE__ */ h("path", { d: paused ? "M4 1.5v8l6-4z" : "M4 2h2v7H4zM8 2h2v7H8z" }))),
	/* @__PURE__ */ h(Button, {
		tabIndex: -1,
		title: "Minimise",
		onClick: () => onMinimise()
	}, /* @__PURE__ */ h("svg", {
		width: "13",
		height: "11"
	}, /* @__PURE__ */ h("path", { d: "M3 8h6v2H3z" }))),
	/* @__PURE__ */ h(Button, {
		tabIndex: -1,
		title: maximised ? "Restore" : "Maximise",
		onClick: () => onMaximise()
	}, /* @__PURE__ */ h("svg", {
		width: "13",
		height: "11"
	}, /* @__PURE__ */ h("path", {
		"fill-rule": "evenodd",
		d: maximised ? RESTORE : MAXIMISE
	})))
];
var windowProps = (state, actions, paused, canPause) => ({
	paused,
	canPause,
	onPause: actions.pause,
	maximised: state.zoom.maximised,
	onMinimise: actions.minimise,
	onMaximise: actions.maximise
});
var Board_module_default = {
	paused: "Board_paused",
	hint: "Board_hint",
	more: "Board_more",
	outline: "Board_outline"
};
//#endregion
//#region src/shell/Board.jsx
var PausedCover = ({ onResume }) => /* @__PURE__ */ h("div", { class: Board_module_default.paused }, /* @__PURE__ */ h(Button, {
	tabIndex: -1,
	title: "Resume (P)",
	onClick: () => onResume()
}, /* @__PURE__ */ h("svg", {
	width: "40",
	height: "40"
}, /* @__PURE__ */ h("path", { d: "M14 9v22l17-11z" }))));
var HintPanel = ({ text, more }) => /* @__PURE__ */ h("p", {
	class: Board_module_default.hint,
	role: "status",
	...hangBelow
}, more && /* @__PURE__ */ h("a", {
	class: Board_module_default.more,
	href: more,
	target: "_blank",
	rel: "noopener",
	title: "Read more in the guide"
}, "More"), text);
//#endregion
//#region src/shell/clock.js
var clockDigits = (theme, time) => theme !== "classic" && time > 999 ? 4 : 3;
var pauseAction = (running, onPause = () => ({})) => (paused) => ({ game }, actions) => {
	const next = paused === void 0 ? !game.paused : paused;
	if (!running(game) || next === game.paused) return null;
	if (!next) {
		game.raf = requestAnimationFrame(actions.tick);
		return { game: {
			...game,
			paused: false,
			start: game.start + performance.now() - game.pausedAt
		} };
	}
	cancelAnimationFrame(game.raf);
	return {
		menu: null,
		game: {
			...game,
			...onPause(game, actions),
			paused: true,
			pausedAt: performance.now()
		}
	};
};
//#endregion
export { WindowControls as a, FillIcon as c, UndoIcon as d, Play as f, PausedCover as i, HintIcon as l, pauseAction as n, windowProps as o, Digit as p, HintPanel as r, CrossIcon as s, clockDigits as t, SideButton as u };
