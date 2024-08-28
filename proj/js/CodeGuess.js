import { HelperFunctions } from "./HelperFunctions.js";
import { PageId } from "./PageSwitcher.js";

const footerId = "footer";
const inputElementId = "language-input";

function showConsole() {
    //console.log("show console");
    const element = document.getElementById(footerId);
    element.className = "displayed-console";

    HelperFunctions.enableElement(inputElementId);
}

function hideConsole() {
    //console.log("hide console");
    const element = document.getElementById(footerId);
    element.className = "hidden-console";

    HelperFunctions.disableElement(inputElementId);
}

function checkPageForConsole(e) {
    if (e.details === PageId.GameDefault || e.details === PageId.GameTable) {
        showConsole();
    }
    else {
        hideConsole();
    }
}

(function listenForConsoleEvents() {
    const element = document.getElementById(inputElementId);
    element.addEventListener("input",);

    document.addEventListener("switchPage", checkPageForConsole);
}());

(function hideConsoleOnStart() {
    //console.log("hide console start");
    hideConsole();
}());