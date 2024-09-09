import { HelperFunctions } from "./HelperFunctions.js";
import { CodingLanguage, getDataFromLanguage, getDataFromLanguageString, getTodaysCodeDataUTC, getTodaysTableDataUTC, maxCodeIdLength } from "./DailyCodeData.js";
import { getHtmlFromCodeData, getHtmlFromLanguageData } from "./CodeHtmlConverter.js";
import { CodeHtmlData } from "./CodeHtmlConverter.js";

const inputFieldId = "input-field";
let inputField = null;

const gameReturnMenuContainerId = "game-return-main-container";
let gameReturnMenuContainer = null;

const dislayContainerId = "game-display-container";
let displayContainer = null;

const defaultModeButtonId = "play-default-button";
const tableModeButtonId = "play-table-button";

const codeIdTextId= "code-id-tab-text";
let codeIdText=null;

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

let lastGameWasSuccess=false;

function initGameDisplay() {
    inputField = document.getElementById(inputFieldId);
    displayContainer = document.querySelector(`#${dislayContainerId}`);
    gameReturnMenuContainer = document.getElementById(gameReturnMenuContainerId);
    codeIdText=document.getElementById(codeIdTextId);

    code = getTodaysCodeDataUTC();
    table = getTodaysTableDataUTC();
    todaysCodeDisplay = getHtmlFromCodeData(code);

    const idWith0s= HelperFunctions.padWithLeadingZeros(code.getId(), maxCodeIdLength);
    if (code) codeIdText.innerHTML=`#${idWith0s}`;
    else codeIdText.innerHTML="null_id";

    appearOrderIndex = -1;
    appearLineIndices = [];
    previousInput = [];

    currentAttempts = 0;
    playedDailyDefault = false;

    //To make sure the game does not break, we use the appear order length, (should be 5, but just in case)
    currentTotalAttempts = playingDefaultGame ? todaysCodeDisplay.getAppearOrder().length : defaultTotalAttempts;
    HelperFunctions.disableElement(gameReturnMenuContainerId);
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
        let html = getHtmlFromLanguageData(languageData, guessedLanguages, true);
        displayContainer.innerHTML = html;
    }
}

function showAllCodeLines() {
    if (!playingDefaultGame) return;

    const allHtmlLines = todaysCodeDisplay.getHtmlLines();
    let html = "";
    for (let i = appearOrderIndex + 1; i < allHtmlLines.length; i++) {
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

function checkInput(e) {
    currentAttempts++;
    const text = cleanInput(inputField.value);
    console.log(`input has submit to ${text}`);

    //Don't allow duplicate guessing
    if (!text || (previousInput && HelperFunctions.arrayContains(previousInput, text))) {
        return;
    }
    previousInput.push(text);

    let rightInput = false;
    if (playingDefaultGame) rightInput = text === code.getLang().toLowerCase();
    else rightInput = text === table.getLang().toLowerCase();

    const maxAttemptsReached = currentAttempts >= currentTotalAttempts;
    inputField.dispatchEvent(new CustomEvent("validGuess", {
        detail:
        {
            "Input": text,
            "CorrectGuess": rightInput,
            "MaxAttempts": currentTotalAttempts,
            "CurrentAttempts": currentAttempts,
            "AllAttemptsUsed": maxAttemptsReached,
        }
    }));

    //NO matter what we show the current attempt for table game
    if (!playingDefaultGame) {
        guessedLanguages.unshift(getDataFromLanguageString(text));
    }
    if (maxAttemptsReached) gameEnd(false);

    else if (!rightInput) {
        nextLine();
    }
    else if (rightInput) {
        //We show what player did even if they won for table game
        if (!playingDefaultGame) nextLine();

        //We show remaining lines (if any) for coding game
        else showAllCodeLines();
        gameEnd(true);
    }
}

function cleanInput(input) {
    const cleaned = HelperFunctions.replaceAllMultiple(input, [" ", "<", ">"], "").toLowerCase();
    return cleaned;
}

(function listenForInput() {
    const element = document.getElementById("input-field");
    element.addEventListener("change", checkInput);
}());

function gameEnd(isSuccess) {
    lastGameWasSuccess=isSuccess;
    disableInput();
    HelperFunctions.enableElement(gameReturnMenuContainerId);

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
export function wasLastGameSuccess(){
    return lastGameWasSuccess;
}