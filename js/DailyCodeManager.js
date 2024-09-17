import { HelperFunctions } from "./HelperFunctions.js";
import { CodingLanguage, getDataFromLanguage, getDataFromLanguageString, getTodaysCodeDataUTC, getTodaysTableDataUTC, maxCodeIdLength } from "./DailyCodeData.js";
import { getCSSClassIfHasTab, getHtmlFromCodeData, getHtmlFromLanguageData } from "./CodeHtmlConverter.js";
import { CodeHtmlData } from "./CodeHtmlConverter.js";

const inputFieldId = "input-field";
let inputField = null;

const submitLanguageButtonId = "submit-language-button";
let submitLanguageButton = null;

const languageDropdownButtonId = "language-pick-toggle-container";
let languageDropdownToggle = null;

const languageDropdownId = "language-select";
let languageDropdown = null;

const gameReturnMenuContainerId = "game-return-main-container";
let gameReturnMenuContainer = null;

const timerElementId = "name-game-timer";
let timerElement = null;

const dislayContainerId = "game-display-container";
let displayContainer = null;

const languageNamingContainerId = "name-game-language-container";
let languageNamingContainer = null;

const defaultModeButtonId = "play-default-button";
const tableModeButtonId = "play-table-button";
const nameModeButtonId = "play-name-button";

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

//For table and code game
const defaultTotalAttempts = 5;
let currentTotalAttempts = defaultTotalAttempts;
let currentAttempts = 0;

//For name game
const defaultMinutesTime = 1;
let currentSecondsLeft = 0;
let timerIntervalId;

let playedDailyDefault = false;
let playedDailyTable = false;

export const PlayingGameType = Object.freeze(
    {
        "None": "None",
        "CodeGame": "CodeGame",
        "TableGame": "TableGame",
        "NameGame": "NameGame",
    }
);
let playingGame = PlayingGameType.None;
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
    if (playingGame === PlayingGameType.CodeGame) {
        currentTotalAttempts = todaysCodeDisplay.getAppearOrder().length;
    }
    else if (playingGame === PlayingGameType.TableGame) {
        currentTotalAttempts = defaultTotalAttempts;
    }
    HelperFunctions.disableElement(gameReturnMenuContainerId);

    if (playingGame === PlayingGameType.CodeGame) HelperFunctions.enableElement(codeIdTabId);
    else HelperFunctions.disableElement(codeIdTabId);

    clearUpdateTime();
    enableInput();
    clearDisplay();
}

function nextLine() {
    if (playingGame === PlayingGameType.CodeGame) {
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
                const tabClass = getCSSClassIfHasTab(todaysCodeDisplay.getTaggedCode()[i]);
                console.log(`HTML line ${allHtmlLines[i]} has tab class: ${tabClass}`);
                const repeated = ("*").repeat(allLines[i].length);
                const repeatedHtml = `<p class="inline code-comment ${tabClass}">${repeated}</p><p class="code-new-line"></p>`;
                html += repeatedHtml;
            }
        }
        displayContainer.innerHTML = html;
    }
    else if (playingGame === PlayingGameType.TableGame) {
        const languageData = getDataFromLanguage(table.getLang());
        //To prevent errors, we need to exit if the language name does not match
        if (!languageData) {
            return;
        }

        let html = getHtmlFromLanguageData(languageData, guessedLanguages, true);
        console.log(`get html from lang data guessed: ${guessedLanguages} html: ${html}`);
        displayContainer.innerHTML = html;
    }
    else {
        console.error(`Tried to go next line on game ${playingGame} which is not allowed`);
    }
}

function addNamedLanguage(e) {
    const cleanedUserText = cleanInput(inputField.value);
    const repeatGuess = isRepeatGuess(cleanedUserText);

    const foundData = getDataFromLanguageString(cleanedUserText);
    if (!repeatGuess && foundData) {
        guessedLanguages.push(foundData);
        languageNamingContainer.innerHTML +=
            `<span class="code-string body-text named-language-box">"${cleanedUserText}"</span>`;
    }

    document.dispatchEvent(new CustomEvent("namedLanguage", {
        detail: {
            "Game": playingGame,
            "Input": cleanedUserText,
            "RepeatGuess": repeatGuess,
        }
    }));
}

function showAllCodeLines() {
    if (!playingGame === PlayingGameType.CodeGame) return;

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

function disableInput() {
    HelperFunctions.disableElement(inputFieldId);
}

function enableInput() {
    HelperFunctions.enableElement(inputFieldId);
}

function isRepeatGuess(text) {
    //Don't allow duplicate guessing
    if (!text || (previousInput && HelperFunctions.arrayContains(previousInput, text))) {
        return true;
    }
    previousInput.push(text);
    return false;
}

function checkInput(text) {
    console.log(`input has submit to ${text}`);

    if (playingGame !== PlayingGameType.CodeGame && playingGame !== PlayingGameType.TableGame) {
        console.error(`Tried to check if input ${text} was valid for game ${playingGame} which is not allowed`);
        return;
    }

    if (isRepeatGuess(text)) return;
    currentAttempts++;

    let rightInput = false;
    let correctLanguage = "";
    if (playingGame === PlayingGameType.CodeGame) {
        correctLanguage = code.getLang().toLowerCase();
    }
    else if (playingGame === PlayingGameType.TableGame) {
        correctLanguage = table.getLang().toLowerCase();
    }
    rightInput = text === correctLanguage;

    const maxAttemptsReached = currentAttempts >= currentTotalAttempts;
    document.dispatchEvent(new CustomEvent("validGuess", {
        detail:
        {
            "Game": playingGame,
            "Input": text,
            "CorrectGuess": rightInput,
            "CorrectLanguage": correctLanguage,
            "MaxAttempts": currentTotalAttempts,
            "CurrentAttempts": currentAttempts,
            "AllAttemptsUsed": maxAttemptsReached,
        }
    }));

    //NO matter what we show the current attempt for table game
    if (playingGame === PlayingGameType.TableGame) {
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

function startTimer() {
    HelperFunctions.enableElement(timerElementId);
    currentSecondsLeft = defaultMinutesTime * 60;
    timerIntervalId = setInterval(updateTime, 1000);

    displayContainer.innerHTML += `<div id="${languageNamingContainerId}"></div>`;
    languageNamingContainer = document.getElementById(languageNamingContainerId);
}

function updateTime() {
    currentSecondsLeft--;
    const min = Math.floor(currentSecondsLeft / 60);
    const sec = Math.floor(currentSecondsLeft % 60);

    const minStr = HelperFunctions.padWithLeadingZeros(min, 2);
    const secStr = HelperFunctions.padWithLeadingZeros(sec, 2);
    timerElement.innerHTML = `Time Left: ${minStr}:${secStr}`;

    if (currentSecondsLeft <= 0) {
        gameEnd(true);
        document.dispatchEvent(new CustomEvent("nameGameTimeOver", {
            detail: {
                "NamedCount": guessedLanguages.length,
                "TotalSecondsTime": defaultMinutesTime * 60
            }
        }));
    }
}

function clearUpdateTime() {
    clearInterval(timerIntervalId);
    HelperFunctions.disableElement(timerElementId);
}

(function start() {
    playingGame = PlayingGameType.None;
    timerElement = document.getElementById(timerElementId);
    clearUpdateTime();

    const element = document.getElementById("input-field");
    element.addEventListener("change", (e) => {
        if (playingGame !== PlayingGameType.NameGame) {
            checkInput(cleanedUserText);
        }
        else addNamedLanguage(e);
    });

    languageDropdownToggle = document.getElementById(languageDropdownButtonId);
    console.log(`lang pick toggle found: ${languageDropdownToggle}`)

    submitLanguageButton = document.getElementById(submitLanguageButtonId);
    submitLanguageButton.addEventListener("click", (e) => {
        checkInput(cleanInput(languageDropdown.value));
    });

    console.log("listen for page change");
    const defaultModeButton = document.getElementById(defaultModeButtonId);
    defaultModeButton.addEventListener("click", (e) => {
        playingGame = PlayingGameType.CodeGame;
        initGameDisplay();
        nextLine();
        HelperFunctions.enableElement(languageDropdownButtonId);
        document.dispatchEvent(new CustomEvent("gameDisplayInit"));
    });

    const tableModeButton = document.getElementById(tableModeButtonId);
    tableModeButton.addEventListener("click", (e) => {
        playingGame = PlayingGameType.TableGame;
        initGameDisplay();
        nextLine();
        HelperFunctions.enableElement(languageDropdownButtonId);
        document.dispatchEvent(new CustomEvent("gameDisplayInit"));
    });

    const nameModeButton = document.getElementById(nameModeButtonId);
    nameModeButton.addEventListener("click", (e) => {
        playingGame = PlayingGameType.NameGame;
        initGameDisplay();
        HelperFunctions.disableElement(languageDropdownButtonId);
        document.dispatchEvent(new CustomEvent("gameDisplayInit"));

        startTimer();
    });
}());

function gameEnd(isSuccess) {
    lastGameWasSuccess = isSuccess;
    clearUpdateTime();
    disableInput();
    HelperFunctions.enableElement(gameReturnMenuContainerId);

    //We show what player did even if they won for table game
    if (playingGame === PlayingGameType.TableGame) {
        playedDailyTable = true;
        nextLine();
    }
    //We show remaining lines (if any) for coding game
    else if (playingGame === PlayingGameType.CodeGame) {
        playedDailyDefault = true;
        showAllCodeLines();
    }
    playingGame = PlayingGameType.None;
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