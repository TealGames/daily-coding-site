import { CodingLanguage } from "./DailyCodeData.js";
import { HelperFunctions } from "./HelperFunctions.js";
import { PageId } from "./PageSwitcher.js";

const footerId = "footer";
const inputContainerId = "language-input";
const inputElementId = "input-field";
const labelElementId = "input-label-text";
const languageDropdownButtonId = "language-pick-toggle";
const languageDropdownTextId = "language-pick-toggle-state";
const languageDropdownId = "language-select";
const bottomGradientId = "bottom-gradient";

let languageDropdownButton = null;
let languageDropdownText = null;
let languageDropdown = null;
let allowLanguageDropdowns = false;

let footer = null;

let label = null;
let inputField = null;
let bottomGradient = null;
let previousInput = [];

const newLineHeightChange = 1;
let currentLineHeight = 0;

function updateStyle() {
    footer.style.top = `${100 - currentLineHeight}%`;
    footer.style.bottom = "0%";
    footer.style.width = "100%";
    footer.style.height = `${currentLineHeight}%`;

    console.log(`update style`);
    bottomGradient.style.top = `${100 - footer.style.height - bottomGradient.style.height}%`;
    bottomGradient.style.bottom = `${currentLineHeight}%`;
}

function addStyleHeight() {
    currentLineHeight += newLineHeightChange;
    updateStyle();
}

function showConsole() {
    currentLineHeight = 30;
    updateStyle();

    label = document.getElementById(labelElementId);
    inputField = document.getElementById(inputElementId);

    HelperFunctions.enableElement(inputContainerId);
    const input = document.getElementById(inputContainerId);
    clearLabelText();
    updateLabelText(null);

    HelperFunctions.clearInput(inputField);
    inputField.focus();

    previousInput = [];
}

function hideConsole() {
    const element = document.getElementById(footerId);
    currentLineHeight = 10;
    updateStyle();

    HelperFunctions.disableElement(inputContainerId);
}

function checkPageForConsole(e) {
    console.log("enabled page " + e.detail);
    if (e.detail.pageEnabledId === PageId.GameDisplay) {
        showConsole();
    }
    else {
        hideConsole();
    }
}

function clearLabelText() {
    const label = document.getElementById(labelElementId);
    label.innerHTML = "";
}

function updateLabelText(e) {
    const label = document.getElementById(labelElementId);
    const inputField = document.getElementById(inputElementId);

    const input = e ? e.detail.Input : "";
    const repeatInput = HelperFunctions.arrayContains(previousInput, input);

    const targetTextStart = `<p class=\"code-new-line\"></p>
                 <p class=\"inline terminal\">language guess:`;
    const targetTextFull = targetTextStart + `</p>`;

    const lastIndex = label.innerHTML.lastIndexOf("</p>");
    let oldHtml = label.innerHTML;

    //If we have the label, we just append the answer, otherwise we create a new label
    console.log(`update label val: ${input} @idx${lastIndex} ${e?.detail?.CorrectGuess}`);
    if (lastIndex >= 0) {
        oldHtml = oldHtml.substring(0, lastIndex);

        //WARNING: potentially dangerous code because allowing input to be added to HTML
        //which could include script tags with injection attacks
        label.innerHTML = oldHtml + ` ${input}</p>`;
        if (e) {
            addStyleHeight();
            if (e.detail.AllAttemptsUsed) {
                label.innerHTML += `<p class=\"code-new-line\"></p>` +
                    `<p class=\"inline terminal-error\">max attempts reached: ` +
                    `${e.detail.MaxAttempts}/${e.detail.CurrentAttempts}</p>`;
                return;
            }
            else if (e.detail.CorrectGuess) {
                label.innerHTML += `<p class=\"code-new-line\"></p>` +
                    `<p class=\"inline terminal-success\">correct input</p>`;
                return;

            }
            else {
                label.innerHTML += `<p class=\"code-new-line\"></p>` +
                    `<p class=\"inline terminal-error\"> ->  wrong input  ~~~~~~~~  try again</p>`;
            }
        }
    }
    addStyleHeight();
    label.innerHTML += targetTextFull;
}

(function listenForConsoleEvents() {
    document.addEventListener("enablePage", checkPageForConsole);

    const inputField = document.getElementById(inputElementId);
    inputField.addEventListener("validGuess", updateLabelText);
}());

(function start() {
    footer = document.getElementById(footerId);
    bottomGradient = document.getElementById(bottomGradientId);
    hideConsole();

    languageDropdownText = document.getElementById(languageDropdownTextId);
    languageDropdownButton = document.getElementById(languageDropdownButtonId);
    languageDropdownButton.addEventListener("click", (e) => {
        const currentValue = languageDropdownText.innerHTML.ex_replaceAll(" ", "").toLowerCase();

        //Actions for false
        if (currentValue === "true") {
            languageDropdownText.innerHTML = "false";
            allowLanguageDropdowns = false;
            HelperFunctions.disableElement(languageDropdownId);
        }

        //Actions for true
        else {
            languageDropdownText.innerHTML = "true";
            allowLanguageDropdowns = true;
            HelperFunctions.enableElement(languageDropdownId);
        }
    });

    languageDropdown = document.getElementById(languageDropdownId);
    languageDropdown.addEventListener("change", async (e) => {
        inputField.value = e.target.value + " ";
        inputField.focus();
    });

    const langs = HelperFunctions.getPropertiesOfObject(CodingLanguage).sort();
    for (let i = 0; i < langs.length; i++) {
        languageDropdown.innerHTML += `<option value="${langs[i]}">${langs[i]}</option>`;
    }

}());