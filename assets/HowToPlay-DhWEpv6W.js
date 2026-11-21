import { gt as h } from "./Taskbar-DNGZckNK.js";
import { t as HowToPlay } from "./HowToPlay-CWk78UqX.js";
//#region src/bridges/HowToPlay.jsx
var Rules = () => [
	/* @__PURE__ */ h("p", null, "Join the islands with bridges. The number on an island is how many bridges it has. Bridges run in straight lines between two islands, a pair takes one or two, and no bridge may cross another or an island. When you are done every island must be reachable from every other."),
	/* @__PURE__ */ h("p", null, "Click an island, then another island in line with it, to build a bridge between them: again for a second one and again to take them away. Dragging from one island to the other does the same, and so does clicking the water between them. Right click steps back. On a keyboard the arrow keys move a cursor from island to island and Shift with an arrow builds a bridge that way."),
	/* @__PURE__ */ h("p", null, "The left counter shows the islands still without their number, Ctrl+Z undoes and Ctrl+Y redoes. An island with all its bridges dims. Show Errors marks islands with too many bridges or no way left to reach their number, bridges that cross, and groups that are complete but cut off, and Hint explains the next step logic gives. Every board has one solution that needs no guessing.")
];
var BridgesHowToPlay = ({ key, actions }) => /* @__PURE__ */ h(HowToPlay, {
	key,
	name: "Bridges",
	actions
}, /* @__PURE__ */ h(Rules, null));
//#endregion
export { Rules as n, BridgesHowToPlay as t };
