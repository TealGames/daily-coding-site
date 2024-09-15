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
const submitLanguageButtonId = "submit-language-button";

const dislayContainerId = "game-display-container";
let displayContainer = null;

let languageDropdownButton = null;
let languageDropdownText = null;
let languageDropdown = null;
let submitLanguageButton = null;

let isConsoleShown = false;
let allowLanguageDropdowns = false;
const doRating = true;

let footer = null;

let label = null;
let inputField = null;
let bottomGradient = null;

const startShowConsoleHeight = 30;
const hideConsoleHeight = 10;
const newLineHeightChange = 3;
let currentLineHeight = 0;

const extraConsoleBuffer= 100;
const gradientHeight = 5;

function updateStyle() {
    //footer.style.top = `${100 - currentLineHeight}%`;

    console.log(`not fit: ${HelperFunctions.doesContentNotFitPage()}`);
    footer.style.width = "100%";

    const footerHeight = currentLineHeight;
    footer.style.height = `${footerHeight}%`;

    const gameDisplayRect = displayContainer.getBoundingClientRect();

    // if (footer.style.height === `${hideConsoleHeight}%`) {
    //     footer.style.bottom = "0%";
    // }
    console.log(`checking window width ${window.innerWidth} new display top ${gameDisplayRect.top}+height${gameDisplayRect.height}`);
    if (!isConsoleShown) {
        footer.style.removeProperty(`top`);
        footer.style.bottom = "0%";
    }
    // else (HelperFunctions.doesContentNotFitPage()) {
    //     footer.style.top = `${100 - startShowConsoleHeight}%`;
    // }
    // else {
    //     footer.style.top = `${100 - startShowConsoleHeight}%`;
    // }
    //footer.style.top = `${100 - startShowConsoleHeight}%`;
    else if (window.innerWidth<=570){
        console.log(`top of display: ${gameDisplayRect.top+gameDisplayRect.height}`);
        //footer.style.removeProperty(`height`);
        footer.style.removeProperty(`height`);
        footer.style.top = `${gameDisplayRect.top+gameDisplayRect.height+extraConsoleBuffer}px`;
        footer.style.bottom="0%";
    }
    else {
        console.log(`choosing strict height top: ${100 - footer.style.height}`);
        footer.style.removeProperty(`top`);
        footer.style.removeProperty(`bottom`);
        //footer.style.top = `${100 - footer.style.height}%`;
    }
    //footer.style.top = `${100 - footer.style.height}%`;

    //bottomGradient.style.top = `${100 - footerHeight}%`;
    // bottomGradient.style.bottom = `${footerHeight + gradientHeight}%`;
    // console.log(`update gradient: ${bottomGradient} new top: ${100 - footerHeight} actual: ${bottomGradient.style.top}`);

    
    const gameDisplayBottomPos = gameDisplayRect.y + gameDisplayRect.height;
}

function addStyleHeight() {
    currentLineHeight += newLineHeightChange;
    updateStyle();
}

function showConsole() {
    isConsoleShown = true;
    currentLineHeight = startShowConsoleHeight
    updateStyle();

    label = document.getElementById(labelElementId);
    inputField = document.getElementById(inputElementId);

    HelperFunctions.enableElement(inputContainerId);
    const input = document.getElementById(inputContainerId);
    clearLabelText();
    updateLabelText(null);

    checkLanguageDropdownState();
    HelperFunctions.clearInput(inputField);
    inputField.focus();
}

function hideConsole() {
    isConsoleShown = false;
    const element = document.getElementById(footerId);
    currentLineHeight = hideConsoleHeight;
    updateStyle();

    HelperFunctions.disableElement(inputContainerId);
}

function checkPageForConsole(e) {
    console.log("enabled page " + e.detail);
    if (e.detail.pageEnabledId !== PageId.GameDisplay) {
        hideConsole();
    }
    // else {
    //     showConsole();
    // }
}

function clearLabelText() {
    const label = document.getElementById(labelElementId);
    label.innerHTML = "";
}

function updateLabelText(e) {
    const label = document.getElementById(labelElementId);
    const input = e ? e.detail.Input : "";

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
            if (e.detail.CorrectGuess) {
                clearLabelText();
                label.innerHTML += `<p class=\"code-new-line\"></p>` +
                    `<p class=\"inline terminal-success\">correct input</p>`;
                requestRating();
                return;

            }
            else if (e.detail.AllAttemptsUsed) {
                clearLabelText();
                label.innerHTML += `<p class=\"code-new-line\"></p>` +
                    `<p class=\"inline terminal-error\">max attempts reached: ` +
                    `${e.detail.MaxAttempts}/${e.detail.CurrentAttempts} correct answer: ${e.detail.CorrectLanguage}</p>`;
                requestRating();
                return;
            }
            else {
                label.innerHTML += `<p class=\"code-new-line\"></p>` +
                    `<p class=\"inline terminal-error\"> ->  wrong input  ~~~~~~~~  attempts: ` +
                    `${e.detail.CurrentAttempts}/${e.detail.MaxAttempts}</p>`;
            }
        }
    }
    addStyleHeight();
    label.innerHTML += targetTextFull;
}

function requestRating() {
    if (!doRating) return;

    HelperFunctions.disableElement(languageDropdownId);
    HelperFunctions.disableElement(submitLanguageButtonId);
    const html = `
            <p class=\"code-new-line\"></p>
            <p class=\"inline terminal\">How would you rate today's code from ★(1) to ★★★★★(5)?</p>
            <p class=\"code-new-line\"></p>
            <p class=\"inline terminal\">(Your response will be anonymous)</p>
            <p class=\"code-new-line\"></p>
            <form id="rating-form" action="https://formspree.io/f/xzzpwwad" method="POST">
                <input id="rating-field" name="rating-number" type="number" max="5" min="1" placeholder="type rating..." form="rating-form"
                required class="body-text terminal">

                <button id="submit-rating-button" type="submit" class="terminal-ui code-font body-text dark-on-hover ">
                Submit Rating</button>
            </form>
            <p class=\"code-2-new-line\"></p>
            <p class=\"inline terminal\">If you want to leave specific code feedback, you can do so</p>
            <p class="inline body-text code-comment">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSfls32E6ZBS75Upn12TMfx2DXJwOMGud9Vyxbxn82YrEY_-0Q/viewform" target="_blank" class="code-comment">here</a>
            </p>`;

    label.innerHTML += html;
}

function checkLanguageDropdownState() {
    const currentValue = HelperFunctions.replaceAll(languageDropdownText.innerHTML, " ", "").toLowerCase();

    //Actions for false
    if (currentValue === "true") {
        languageDropdownText.innerHTML = "false";
        allowLanguageDropdowns = false;
        HelperFunctions.disableElement(languageDropdownId);
        HelperFunctions.disableElement(submitLanguageButtonId);

        HelperFunctions.enableElement(inputElementId);
        inputField.focus();
    }

    //Actions for true
    else {
        languageDropdownText.innerHTML = "true";
        allowLanguageDropdowns = true;
        HelperFunctions.enableElement(languageDropdownId);
        HelperFunctions.enableElement(submitLanguageButtonId);

        HelperFunctions.disableElement(inputElementId);
    }
}

(function listenForConsoleEvents() {
    document.addEventListener("enablePage", checkPageForConsole);
    document.addEventListener("validGuess", updateLabelText);
    window.addEventListener("resize", (e) => updateStyle());
    document.addEventListener("gameDisplayInit", (e) => showConsole());
})();

(function start() {
    displayContainer = document.getElementById(`${dislayContainerId}`);
    footer = document.getElementById(footerId);
    bottomGradient = document.getElementById(bottomGradientId);
    hideConsole();

    languageDropdownText = document.getElementById(languageDropdownTextId);
    languageDropdownButton = document.getElementById(languageDropdownButtonId);
    languageDropdownButton.addEventListener("click", (e) => checkLanguageDropdownState());

    languageDropdown = document.getElementById(languageDropdownId);
    languageDropdown.addEventListener("change", async (e) => {
        inputField.value = e.target.value + " ";
        inputField.focus();
    });

    const langs = HelperFunctions.getPropertyValuesOfObject(CodingLanguage).sort();
    for (let i = 0; i < langs.length; i++) {
        languageDropdown.innerHTML += `<option value="${langs[i]}">${langs[i]}</option>`;
    }

})();