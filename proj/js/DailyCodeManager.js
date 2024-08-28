import { HelperFunctions } from "./HelperFunctions.js";
import { getCode } from "./DailyCodeData.js";
import { getHtmlFromCodeData } from "./CodeHtmlConverter.js";
import { CodeHtmlData } from "./CodeHtmlConverter.js";

let today = null;
let todaysCodeDisplay = null;
let todaysCodeIndex = 0;
let displayContainer = null;
let code=null;

function initCodeDisplay() {
    today = new Date();
    code = getCode(today);
    todaysCodeDisplay = getHtmlFromCodeData(code);
    todaysCodeIndex = -1;

    displayContainer = document.querySelector("#game-default-container");
    for (let i=0; i<todaysCodeDisplay.getLines().length; i++)
        console.log(`code line: ${todaysCodeDisplay.getLines()[i]}`);
}

function nextLine() {
    todaysCodeIndex++;
    if (todaysCodeIndex > todaysCodeDisplay.getLines().length - 1) {
        console.warn(`tried to procede to next line of code but has passed lines bounds`);
        return;
    }

    const line = todaysCodeDisplay.getLines()[todaysCodeIndex];

    if (displayContainer.innerHTML) displayContainer.innerHTML += line;
    else displayContainer.innerHTML = line;
}

(function listenForPageChange() {
    const defaultModeButton = document.getElementById("play-default-button");
    defaultModeButton.addEventListener("click", (e) => {
        initCodeDisplay();
        nextLine();
    });
}());

function checkInput(e)
{
    const inputField = document.getElementById("input-field");
    const text= inputField.value;
    console.log(`input details: ${text}`);
    if (text!==code.getLang()) nextLine();
}

(function listenForInput()
{
    const element = document.getElementById("input-field");
    element.addEventListener("change", checkInput);
}());