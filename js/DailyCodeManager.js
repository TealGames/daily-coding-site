import { HelperFunctions } from "./HelperFunctions.js";
import { CodingLanguage, getDataFromLanguage, getDataFromLanguageString, getTodaysCodeDataUTC, getTodaysTableDataUTC, maxCodeIdLength } from "./DailyCodeData.js";
import { getHtmlFromCodeData, getHtmlFromLanguageData } from "./CodeHtmlConverter.js";
import { CodeHtmlData } from "./CodeHtmlConverter.js";

const inputFieldId = "input-field";
let inputField = null;

const submitLanguageButtonId = "submit-language-button";
let submitLanguageButton = null;

const languageDropdownId = "language-select";
let languageDropdown = null;

const gameReturnMenuContainerId = "game-return-main-container";
let gameReturnMenuContainer = null;

const dislayContainerId = "game-display-container";
let displayContainer = null;

const defaultModeButtonId = "play-default-button";
const tableModeButtonId = "play-table-button";

const codeIdTabId = "code-id-tab";
const codeIdTextId = "code-id-tab-text";
let codeIdText = null;

let today = null;
let todaysCodeDisplay = null;
let appearOrderIndex = 0;
let appearLineIndices = [];
let code = null;

let table = null;
let guessedLanguages = [];

let previousInput = [];
const defaultTotalAttempts = 5;
let currentTotalAttempts = defaultTotalAttempts;
let currentAttempts = 0;

let playedDailyDefault = false;
let playedDailyTable = false;

let playingDefaultGame = true;

let lastGameWasSuccess = false;

function initGameDisplay() {
    inputField = document.getElementById(inputFieldId);
    displayContainer = document.querySelector(`#${dislayContainerId}`);
    gameReturnMenuContainer = document.getElementById(gameReturnMenuContainerId);
    codeIdText = document.getElementById(codeIdTextId);
    languageDropdown = document.getElementById(languageDropdownId);

    code = getTodaysCodeDataUTC();
    table = getTodaysTableDataUTC();

    console.log(`todays code: ${HelperFunctions.objAsString(code)}`);
    console.log(`todays table: ${HelperFunctions.objAsString(table)}`);
    todaysCodeDisplay = getHtmlFromCodeData(code);

    const idWith0s = HelperFunctions.padWithLeadingZeros(code.getId(), maxCodeIdLength);
    if (code) codeIdText.innerHTML = `#${idWith0s}`;
    else codeIdText.innerHTML = "null_id";

    appearOrderIndex = -1;
    appearLineIndices = [];
    previousInput = [];

    currentAttempts = 0;
    playedDailyDefault = false;

    //To make sure the game does not break, we use the appear order length, (should be 5, but just in case)
    currentTotalAttempts = playingDefaultGame ? todaysCodeDisplay.getAppearOrder().length : defaultTotalAttempts;
    HelperFunctions.disableElement(gameReturnMenuContainerId);

    if (playingDefaultGame) HelperFunctions.enableElement(codeIdTabId);
    else HelperFunctions.disableElement(codeIdTabId);

    enableInput();
    clearDisplay();
}

function nextLine() {
    if (playingDefaultGame) {
        appearOrderIndex++;
        const allLines = todaysCodeDisplay.getLines();
        const allHtmlLines = todaysCodeDisplay.getHtmlLines();
        const appearOrder = todaysCodeDisplay.getAppearOrder();


        if (appearOrderIndex > appearOrder.length - 1) {
            console.warn(`tried to procede to next line of code but has passed appear order bounds`);
            return;
        }

        //Every new line to appear gets added
        for (let i = 0; i < appearOrder[appearOrderIndex].length; i++) {
            appearLineIndices.push(appearOrder[appearOrderIndex][i]);
        }
        console.log(`html: ${allHtmlLines.length} appear order: ${appearOrder} current: ${appearLineIndices}`);

        let html = "";

        //Iterate over every html line, if it is in the appear array, it means it can be shown, 
        //otherwise we set as hidden
        for (let i = 0; i < allHtmlLines.length; i++) {
            console.log("print line" + allHtmlLines[i]);
            if (HelperFunctions.arrayContains(appearLineIndices, i)) {
                html += allHtmlLines[i];
            }
            else {
                const repeated = ("*").repeat(allLines[i].length);
                const repeatedHtml = `<p class="inline body-text code-comment">${repeated}</p><p class="code-new-line"></p>`;
                html += repeatedHtml;
            }
        }
        displayContainer.innerHTML = html;
    }
    else {
        const languageData = getDataFromLanguage(table.getLang());
        //To prevent errors, we need to exit if the language name does not match
        if (!languageData) {
            return;
        }

        let html = getHtmlFromLanguageData(languageData, guessedLanguages, true);
        console.log(`get html from lang data guessed: ${guessedLanguages} html: ${html}`);
        displayContainer.innerHTML = html;
    }
}

function showAllCodeLines() {
    if (!playingDefaultGame) return;

    const allHtmlLines = todaysCodeDisplay.getHtmlLines();
    let html = "";
    for (let i = 0; i < allHtmlLines.length; i++) {
        html += allHtmlLines[i];
    }

    displayContainer.innerHTML = html;
}

function clearDisplay() {
    displayContainer.innerHTML = "";
}

(function listenForPageChange() {
    console.log("listen for page change");
    const defaultModeButton = document.getElementById(defaultModeButtonId);
    defaultModeButton.addEventListener("click", (e) => {
        playingDefaultGame = true;
        initGameDisplay();
        nextLine();
    });

    const tableModeButton = document.getElementById(tableModeButtonId);
    tableModeButton.addEventListener("click", (e) => {
        playingDefaultGame = false;
        initGameDisplay();
        nextLine();
    });
})();

function disableInput() {
    HelperFunctions.disableElement(inputFieldId);
}

function enableInput() {
    HelperFunctions.enableElement(inputFieldId);
}

function checkInput(text) {
    console.log(`input has submit to ${text}`);

    //Don't allow duplicate guessing
    if (!text || (previousInput && HelperFunctions.arrayContains(previousInput, text))) {
        return;
    }
    currentAttempts++;
    previousInput.push(text);

    let rightInput = false;
    let correctLanguage= "";
    if (playingDefaultGame){
        correctLanguage= code.getLang().toLowerCase(); 
    }
    else{
        correctLanguage = table.getLang().toLowerCase();
    }
    rightInput = text === correctLanguage;

    const maxAttemptsReached = currentAttempts >= currentTotalAttempts;
    document.dispatchEvent(new CustomEvent("validGuess", {
        detail:
        {
            "Input": text,
            "CorrectGuess": rightInput,
            "CorrectLanguage" : correctLanguage,
            "MaxAttempts": currentTotalAttempts,
            "CurrentAttempts": currentAttempts,
            "AllAttemptsUsed": maxAttemptsReached,
        }
    }));

    //NO matter what we show the current attempt for table game
    if (!playingDefaultGame) {
        const foundData = getDataFromLanguageString(text);
        if (foundData) {
            if (guessedLanguages.length > 0) guessedLanguages.unshift(foundData);
            else guessedLanguages.push(foundData);
        }
    }

    if (maxAttemptsReached) gameEnd(false);
    else if (!rightInput) {
        nextLine();
    }
    else if (rightInput) {
        gameEnd(true);
    }
}

function cleanInput(input) {
    const cleaned = HelperFunctions.replaceAllMultiple(input, [" ", "<", ">"], "").toLowerCase();
    return cleaned;
}

(function listenForInput() {
    const element = document.getElementById("input-field");
    element.addEventListener("change", (e) => checkInput(cleanInput(inputField.value)));

    submitLanguageButton = document.getElementById(submitLanguageButtonId);
    submitLanguageButton.addEventListener("click", (e) => {
        checkInput(cleanInput(languageDropdown.value));
    });
}());

function gameEnd(isSuccess) {
    lastGameWasSuccess = isSuccess;
    disableInput();
    HelperFunctions.enableElement(gameReturnMenuContainerId);

    //We show what player did even if they won for table game
    if (!playingDefaultGame) nextLine();
    //We show remaining lines (if any) for coding game
    else showAllCodeLines();

    if (playingDefaultGame) playedDailyDefault = true;
    else playedDailyTable = true;
}

export function hasPlayedTodaysDefault() {
    return playedDailyDefault;
}

export function hasPlayedTodaysTable() {
    return playedDailyTable;
}

export function getTodaysCodeData() {
    return code;
}

/**
 * @returns {Boolean}
 */
export function wasLastGameSuccess() {
    return lastGameWasSuccess;
}