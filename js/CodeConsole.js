import { getAllCodingLanguagesSafeInit } from "./DailyCodeData.js";
import { PlayingGameType } from "./DailyCodeManager.js";
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

const centerContentContainerId = "center-content";
let centerContentContainer = null;

const bodyContainerId = "body";
let bodyContainer = null;

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

const extraConsoleBuffer = 100;
const updateConsoleFromWidthThreshold= 570;
const bodyConsoleDiffUpdateThreshold= 20;
const gradientHeight = 5;

function updateStyle() {
    footer.style.width = "100%";

    const footerHeight = currentLineHeight;
    footer.style.height = `${footerHeight}%`;

    const gameDisplayRect = displayContainer.getBoundingClientRect();

    console.log(`checking window width ${window.innerWidth} new display top ${gameDisplayRect.top}+height${gameDisplayRect.height}`);
    const centerRect = centerContentContainer.getBoundingClientRect();
    const bodyRect = bodyContainer.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    //console.log(`center container height: ${centerRect.height} pos ${centerRect.y+centerRect.height} footer start: ${footerRect.top}`);
    console.log(`body container height: ${bodyRect.height} pos ${bodyRect.y + bodyRect.height} footer start: ${footerRect.top}`);
    console.log(`DIFF: body ${bodyRect.height}- footer ${footerRect.top} = ${bodyRect.height - footerRect.top} shown: ${isConsoleShown} threshold: ${bodyConsoleDiffUpdateThreshold}`);

    //to move the console up when the width shrinks
    if (isConsoleShown && window.innerWidth <= updateConsoleFromWidthThreshold) {
        console.log(`OVERLAP FOR CONSOLE FOUND WHILE displayed: TRUE :${gameDisplayRect.top + gameDisplayRect.height}`);
        footer.style.removeProperty(`height`);
        footer.style.top = `${gameDisplayRect.top + gameDisplayRect.height + extraConsoleBuffer}px`;
        footer.style.bottom = "0%";
    }
    else if (!isConsoleShown && bodyRect.height - footerRect.top >= bodyConsoleDiffUpdateThreshold) {
        console.log(`OVERLAP FOR CONSOLE FOUND WHILE displayed FALSE: ${gameDisplayRect.top + gameDisplayRect.height}`);
        footer.style.removeProperty(`height`);
        footer.style.top = `${bodyRect.height}px`;
        footer.style.bottom = "0%";
    }
    // else if (!isConsoleShown) {
    //     footer.style.removeProperty(`top`);
    //     footer.style.bottom = "0%";
    // }
    else {
        console.log(`choosing strict height top: ${100 - footer.style.height}`);
        footer.style.removeProperty(`top`);
        footer.style.removeProperty(`bottom`);
    }

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

function updateFromPage(e) {
    console.log("enabled page " + e.detail);
    updateStyle();
    if (e.detail.pageEnabledId !== PageId.GameDisplay) {
        hideConsole();
    }

    //we cant just look for game display to show it since we only want to show it after init
    else if (e.detail.pageEnabledId===PageId.GameDisplay && 
        e.detail.pastPageId===PageId.GameInstructions){
        showConsole();
    }
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
        labelTextActionsForGame(e);
        if (e && e.detail.Game !== PlayingGameType.NameGame && (e.detail.CorrectGuess || e.detail.AllAttemptsUsed)) {
            requestRating();
            return;
        }
    }
    addStyleHeight();
    label.innerHTML += targetTextFull;
}

function labelTextActionsForGame(e) {
    if (!e) return;

    if (e.detail.Game === PlayingGameType.NameGame) {
        clearLabelText();
        if (e.detail.RepeatGuess) {
            label.innerHTML += `<p class=\"code-new-line\"></p>` +
                `<p class=\"inline terminal-warn\">[CONSOLE] repeat of previous input: ${e.detail.Input}</p>`;
        }
        else if (!e.detail.ValidLanguage){
            label.innerHTML += `<p class=\"code-new-line\"></p>` +
                `<p class=\"inline terminal-error\">[CONSOLE] invalid language: ${e.detail.Input}</p>`;
        }
        else {
            label.innerHTML += `<p class=\"code-new-line\"></p>` +
                `<p class=\"inline terminal\">[CONSOLE] named language: ${e.detail.Input}</p>`;
        }
    }
    else {
        addStyleHeight();
        if (e.detail.CorrectGuess) {
            clearLabelText();
            label.innerHTML += `<p class=\"code-new-line\"></p>` +
                `<p class=\"inline terminal-success\">correct input</p>`;
        }
        else if (e.detail.AllAttemptsUsed) {
            clearLabelText();
            label.innerHTML += `<p class=\"code-new-line\"></p>` +
                `<p class=\"inline terminal-error\">max attempts reached: ` +
                `${e.detail.MaxAttempts}/${e.detail.CurrentAttempts} correct answer: ${e.detail.CorrectLanguage}</p>`;
        }
        else {
            label.innerHTML += `<p class=\"code-new-line\"></p>` +
                `<p class=\"inline terminal-error\"> ->  wrong input  ~~~~~~~~  attempts: ` +
                `${e.detail.CurrentAttempts}/${e.detail.MaxAttempts}</p>`;
        }
    }
}

function nameGameOverLabelUpdate(e) {
    if (!e) return;

    clearLabelText();
    label.innerHTML += `<p class=\"code-new-line\"></p>` +
        `<p class=\"inline terminal-success\">Congrats! You named ${e.detail.NamedCount} language(s) in ${e.detail.TotalSecondsTime} seconds</p>`;
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

                <button id="submit-rating-button" type="submit" class="code-font body-text dark-on-hover terminal-ui fit-content">
                Submit Rating</button>
            </form>
            <p class=\"code-2-new-line\"></p>
            <p class=\"inline terminal\">If you want to leave specific code feedback, you can do so</p>
            <p class="inline body-text code-comment">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSfls32E6ZBS75Upn12TMfx2DXJwOMGud9Vyxbxn82YrEY_-0Q/viewform" target="_blank" class="code-comment">here</a>
            </p>
            <p class=\"code-new-line\"></p>
            <p class=\"inline terminal\">You can download all of the code guidelines/rules</p>
            <p class="inline body-text code-comment">
                <a href="./media/CodedleGuidelines.pdf" target="_blank" download class="code-comment">here</a>
            </p>`;

    label.innerHTML += html;
}

function toggleLanguageDropdown(){
    const currentValue = HelperFunctions.replaceAll(languageDropdownText.innerHTML, " ", "").toLowerCase();
    if (currentValue === "true"){
        allowLanguageDropdowns=false;
    }
    else{
        allowLanguageDropdowns=true;
    }

    checkLanguageDropdownState();
}

function checkLanguageDropdownState() {
    //Actions for false
    if (!allowLanguageDropdowns) {
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
    document.addEventListener("enablePage", updateFromPage);
    document.addEventListener("validGuess", updateLabelText);
    document.addEventListener("namedLanguage", updateLabelText);
    document.addEventListener("nameGameTimeOver", nameGameOverLabelUpdate);

    window.addEventListener("resize", (e) => updateStyle());
    document.addEventListener("gameDisplayInit", (e) => showConsole());
})();

(async function start() {
    centerContentContainer = document.getElementById(`${centerContentContainerId}`);
    bodyContainer = document.getElementById(`${bodyContainerId}`);
    displayContainer = document.getElementById(`${dislayContainerId}`);

    footer = document.getElementById(footerId);
    bottomGradient = document.getElementById(bottomGradientId);
    hideConsole();

    languageDropdownText = document.getElementById(languageDropdownTextId);
    languageDropdownButton = document.getElementById(languageDropdownButtonId);
    languageDropdownButton.addEventListener("click", (e) => toggleLanguageDropdown());

    languageDropdown = document.getElementById(languageDropdownId);
    languageDropdown.addEventListener("change", async (e) => {
        inputField.value = e.target.value + " ";
        inputField.focus();
    });

    let langs = await getAllCodingLanguagesSafeInit();
    langs=langs.sort();
    for (let i = 0; i < langs.length; i++) {
        languageDropdown.innerHTML += `<option value="${langs[i]}">${langs[i]}</option>`;
    }
})();