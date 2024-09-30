import { HelperFunctions } from "./HelperFunctions.js";

const lineNumberParentId = "left-panel-numbers";
let lineNumberParent = null;
let lineNumberParentRect = null;

const rightContentParentId = "right-panel";
let rightContentParent = null;
let rightContentParentRect = null;

(function start() {
    lineNumberParent = document.getElementById(lineNumberParentId);
    rightContentParent = document.getElementById(rightContentParentId);

    document.addEventListener("DOMContentLoaded", (e) => setLines());
    document.addEventListener("enablePage", (e) => setLines());
    document.addEventListener("gameDisplayInit", (e) => setLines());
    window.addEventListener("resize", (e) => setLines());
})();

function setLines() {
    if (getRightContentWidth() <= 0) return;

    let number = 1;
    lineNumberParent.innerHTML = "";
    //console.log(`set lines line num rect: ${getLineRectWidth()} right content: ${getRightContentWidth()}`);

    while (getLineRectWidth() < getRightContentWidth()) {
        //console.log(`adding line number ${number}`);
        lineNumberParent.innerHTML += `<p class="inline no-margins">${number}</p>`;
        number++;
    }
}

function getLineRectWidth() {
    return lineNumberParent.getBoundingClientRect().height;
}

function getRightContentWidth() {
    return rightContentParent.getBoundingClientRect().height;
}