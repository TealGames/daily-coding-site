import { HelperFunctions } from "./HelperFunctions.js";
import { getDataFromLanguage, getDataFromLanguageString, getTodaysCodeDataUTC, getTodaysTableDataUTC, LanguageData, maxCodeIdLength } from "./DailyCodeData.js";
import { codeTokenTag, getCSSClassIfHasTab, getHtmlFromCodeData, getHtmlFromLanguageData } from "./CodeHtmlConverter.js";
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

const learnGameRulesContainerId="learn-games-rules-container";
let learnGameRulesContainer=null;

const timerElementId = "name-game-timer";
let timerElement = null;

const dislayContainerId = "game-display-container";
const displayAreaId = "code-display-area";
let displayArea = null;
const visibleDisplayContainerClass = "code-display-area-visible";
const hiddenDisplayContainerClass = "code-display-area-hidden";
let displayContainer = null;

const languageNamingContainerId = "name-game-language-container";
let languageNamingContainer = null;

const defaultModeButtonId = "play-default-button";
const tableModeButtonId = "play-table-button";
const nameModeButtonId = "play-name-button";

const codeIdTabContainerId = "code-id-tab-container";
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
const timerWarningSecondsTime = 20;
const timerWarningCssClass = "terminal-error";
const defaultTimerCssClass = "code-comment";
let timerIntervalId;

const clearInputAfterGuess = true;
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

const creditsJsonPath = "./data/Credits.json";
let credits = [];

function initGameDisplay() {
    inputField = document.getElementById(inputFieldId);
    displayContainer = document.querySelector(`#${dislayContainerId}`);
    gameReturnMenuContainer = document.getElementById(gameReturnMenuContainerId);
    codeIdText = document.getElementById(codeIdTextId);
    languageDropdown = document.getElementById(languageDropdownId);

    code = getTodaysCodeDataUTC();
    table = getTodaysTableDataUTC();

    // console.log(`todays code: ${HelperFunctions.objAsString(code)}`);
    // console.log(`todays table: ${HelperFunctions.objAsString(table)}`);
    todaysCodeDisplay = getHtmlFromCodeData(code);
    guessedLanguages.length=0;

    const id = code.getId();
    const idWith0s = HelperFunctions.padWithLeadingZeros(id, maxCodeIdLength);
    if (code) codeIdText.innerHTML = `#${idWith0s}`;
    else codeIdText.innerHTML = "null_id";

    const contributorData = getContributorForId(id);
    if (contributorData.Name) {
        let contributorMessage = "";

        if (contributorData.Link) {
            contributorMessage += `<a class="code-comment" href="${contributorData.Link}">${contributorData.Name}</a>`;
        }
        else contributorMessage += contributorData.Name;
        codeIdText.innerHTML += `<em class="no-margins inline small-text">(${contributorMessage})</em>`;
    }

    appearOrderIndex = -1;
    appearLineIndices = [];
    previousInput = [];

    currentAttempts = 0;
    playedDailyDefault = false;

    //To make sure the game does not break, we use the appear order length
    if (playingGame === PlayingGameType.CodeGame) {
        currentTotalAttempts = todaysCodeDisplay.getAppearOrder().length;
    }
    else if (playingGame === PlayingGameType.TableGame) {
        currentTotalAttempts = defaultTotalAttempts;
    }
    HelperFunctions.disableElement(gameReturnMenuContainerId);
    HelperFunctions.enableElement(learnGameRulesContainerId);

    if (playingGame === PlayingGameType.CodeGame) HelperFunctions.enableElement(codeIdTabContainerId);
    else HelperFunctions.disableElement(codeIdTabContainerId);

    clearUpdateTime();
    enableInput();
    clearDisplay();
}


/**
 * @param {String} id 
 * @returns {Object}
 */
function getContributorForId(id) {
    let result = {
        "Name": "",
        "Link": ""
    }
    if (!credits) return result;

    for (let i = 0; i < credits.length; i++) {
        if (credits[i].id === id) {
            result.Name = credits[i].name;
            result.Link = credits[i].link;
            return result;
        }
    }
    return result;
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

        let html = "";

        //Iterate over every html line, if it is in the appear array, it means it can be shown, 
        //otherwise we set as hidden
        for (let i = 0; i < allHtmlLines.length; i++) {
            if (HelperFunctions.arrayContains(appearLineIndices, i)) {
                html += allHtmlLines[i];
            }
            else {
                const tabClass = getCSSClassIfHasTab(todaysCodeDisplay.getTaggedCode()[i]);
                const repeated = ("*").repeat(allLines[i].length);
                const repeatedHtml = `<${codeTokenTag} class="inline code-comment ${tabClass}">${repeated}</${codeTokenTag}>`+
                `<${codeTokenTag} class="code-new-line"></${codeTokenTag}>`;
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
        displayContainer.innerHTML = html;
    }
    else {
        console.error(`Tried to go next line on game ${playingGame} which is not allowed`);
    }
}

function addNamedLanguage(cleanedUserText) {
    const foundData = getDataFromLanguageString(cleanedUserText);
    //If we don't have data, we don't try to check if its a repeat guess
    const repeatGuess = foundData ? isRepeatGuess(foundData) : false;

    if (foundData && !repeatGuess) {
        guessedLanguages.push(foundData);

        const html = `<span class="code-string body-text named-language-box">"${foundData.getLang()}"</span>`;
        languageNamingContainer.innerHTML += html;

        if (guessedLanguages.length >= 2) {
            const elements = document.getElementsByClassName("named-language-box");
            const secondLastElement = elements[elements.length - 2];
            secondLastElement.innerHTML += `<span class="code-default">,</span>`;
        }
    }

    document.dispatchEvent(new CustomEvent("namedLanguage", {
        detail: {
            "Game": playingGame,
            "Input": cleanedUserText,
            "ValidLanguage": foundData !== null,
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

/**
 * @param {LanguageData} data 
 * @returns 
 */
function isRepeatGuess(data) {
    //Don't allow duplicate guessing
    // if (!text || (previousInput && HelperFunctions.arrayContains(previousInput, text))) {
    //     return true;
    // }
    // previousInput.push(text);
    if (!data) return false;
    return HelperFunctions.arrayContains(guessedLanguages, data);
}

function checkInput(text) {
    if (playingGame !== PlayingGameType.CodeGame && playingGame !== PlayingGameType.TableGame) {
        console.error(`Tried to check if input ${text} was valid for game ${playingGame} which is not allowed`);
        return;
    }

    if (!text) return;

    const foundData = getDataFromLanguageString(text);
    //console.log(`checking repeat guess: ${guessedLanguages}`);
    if (isRepeatGuess(foundData)) return;

    //NO matter what we show the current attempt for table game
    if (playingGame === PlayingGameType.TableGame || playingGame === PlayingGameType.CodeGame) {
        if (foundData) {
            if (guessedLanguages.length > 0) guessedLanguages.unshift(foundData);
            else guessedLanguages.push(foundData);
        }
    }
    
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

    if (maxAttemptsReached) gameEnd(false);
    else if (!rightInput) {
        nextLine();
    }
    else if (rightInput) {
        gameEnd(true);
    }
}

function cleanInput(input) {
    const cleaned = HelperFunctions.replaceAllMultiple(input, [" ", "<", ">"], "").toLowerCase().trim();
    return cleaned;
}

function startTimer() {
    HelperFunctions.enableElement(timerElementId);
    currentSecondsLeft = defaultMinutesTime * 60;
    timerIntervalId = setInterval(updateTime, 1000);

    displayContainer.innerHTML +=
        `<div class="body-text">` +
        `<p class="code-2-new-line"</p>` +
        `<p class="inline code-object">String</p>` +
        `<p class="inline code-default">[]</p>` +
        `<p class="inline code-local-variable"> named</p>` +
        `<p class="inline code-default">=</p>` +
        `<p class="code-new-line"></p>` +
        `<p class="inline code-default">{</p>` +
        `<div id = "${languageNamingContainerId}"></div >` +
        `<p class="inline code-default">}</p></div`;

    languageNamingContainer = document.getElementById(languageNamingContainerId);

    HelperFunctions.tryRemoveClasses(timerElement, [defaultTimerCssClass, timerWarningCssClass]);
    HelperFunctions.addClass(timerElement, defaultTimerCssClass);
}

function updateTime() {
    currentSecondsLeft--;
    const min = Math.floor(currentSecondsLeft / 60);
    const sec = Math.floor(currentSecondsLeft % 60);

    const minStr = HelperFunctions.padWithLeadingZeros(min, 2);
    const secStr = HelperFunctions.padWithLeadingZeros(sec, 2);
    timerElement.innerHTML = `Time Left: ${minStr}:${secStr} `;

    if (currentSecondsLeft <= timerWarningSecondsTime) {
        HelperFunctions.tryRemoveClasses(timerElement, [defaultTimerCssClass, timerWarningCssClass]);
        HelperFunctions.addClass(timerElement, timerWarningCssClass);
    }
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

    HelperFunctions.tryRemoveClasses(timerElement, [defaultTimerCssClass, timerWarningCssClass]);
    HelperFunctions.addClass(timerElement, defaultTimerCssClass);
}

(async function start() {
    playingGame = PlayingGameType.None;
    timerElement = document.getElementById(timerElementId);
    displayArea = document.getElementById(displayAreaId);
    learnGameRulesContainer= document.getElementById(learnGameRulesContainerId);

    clearUpdateTime();

    const element = document.getElementById("input-field");
    element.addEventListener("change", (e) => {
        const cleanedUserText = cleanInput(inputField.value);
        if (!cleanedUserText) {
            return;
        }

        if (clearInputAfterGuess) HelperFunctions.clearInput(inputField);
        if (playingGame !== PlayingGameType.NameGame) {
            checkInput(cleanedUserText);
        }
        else addNamedLanguage(cleanedUserText);
    });

    languageDropdownToggle = document.getElementById(languageDropdownButtonId);

    submitLanguageButton = document.getElementById(submitLanguageButtonId);
    submitLanguageButton.addEventListener("click", (e) => {
        checkInput(cleanInput(languageDropdown.value));
    });

    const defaultModeButton = document.getElementById(defaultModeButtonId);
    defaultModeButton.addEventListener("click", (e) => {
        playingGame = PlayingGameType.CodeGame;
        initGameDisplay();
        nextLine();

        HelperFunctions.enableElement(languageDropdownButtonId);
        HelperFunctions.disableElement(timerElementId);

        HelperFunctions.tryRemoveClasses(displayArea, [visibleDisplayContainerClass, hiddenDisplayContainerClass]);
        HelperFunctions.addClass(displayArea, visibleDisplayContainerClass);

        document.dispatchEvent(new CustomEvent("gameDisplayInit"));
    });

    const tableModeButton = document.getElementById(tableModeButtonId);
    tableModeButton.addEventListener("click", (e) => {
        playingGame = PlayingGameType.TableGame;
        initGameDisplay();
        nextLine();

        HelperFunctions.enableElement(languageDropdownButtonId);
        HelperFunctions.disableElement(timerElementId);

        HelperFunctions.tryRemoveClasses(displayArea, [visibleDisplayContainerClass, hiddenDisplayContainerClass]);
        HelperFunctions.addClass(displayArea, visibleDisplayContainerClass);

        document.dispatchEvent(new CustomEvent("gameDisplayInit"));
    });

    const nameModeButton = document.getElementById(nameModeButtonId);
    nameModeButton.addEventListener("click", (e) => {
        playingGame = PlayingGameType.NameGame;
        initGameDisplay();

        HelperFunctions.disableElement(languageDropdownButtonId);
        HelperFunctions.enableElement(timerElementId);

        HelperFunctions.tryRemoveClasses(displayArea, [visibleDisplayContainerClass, hiddenDisplayContainerClass]);
        HelperFunctions.addClass(displayArea, visibleDisplayContainerClass);

        document.dispatchEvent(new CustomEvent("gameDisplayInit"));
        startTimer();
    });

    const creditsJson = await HelperFunctions.getFileText(creditsJsonPath);
    //console.log(`credits json ${creditsJson}`);
    if (creditsJson) credits = HelperFunctions.getObjFromJson(creditsJson);
}());

function gameEnd(isSuccess) {
    lastGameWasSuccess = isSuccess;
    clearUpdateTime();
    disableInput();

    HelperFunctions.enableElement(gameReturnMenuContainerId);
    HelperFunctions.disableElement(languageDropdownButtonId);
    HelperFunctions.disableElement(learnGameRulesContainerId);

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