import { HelperFunctions } from "./HelperFunctions.js";
import { getTodaysDataUTC } from "./DailyCodeData.js";
import { getHtmlFromCodeData } from "./CodeHtmlConverter.js";
import { CodeHtmlData } from "./CodeHtmlConverter.js";

const inputFieldId= "input-field";
let inputField=null;

const gameReturnMenuContainerId= "game-return-main-container";
let gameReturnMenuContainer=null;

let today = null;
let todaysCodeDisplay = null;
let todaysCodeIndex = 0;
let displayContainer = null;
let code=null;

let previousInput=[];
const totalAttempts=5;
let currentAttempts=0;

let playedDailyDefault=false;
let playedDailyTable=false;

let playingDefaultGame=true;

function initCodeDisplay() {
    inputField= document.getElementById(inputFieldId);
    displayContainer = document.querySelector("#game-default-container");
    gameReturnMenuContainer=document.getElementById(gameReturnMenuContainerId);

    code = getTodaysDataUTC();
    console.log(`todays code: ${code}`);
    todaysCodeDisplay = getHtmlFromCodeData(code);
    todaysCodeIndex = -1;
    previousInput=[];

    currentAttempts=0;
    playedDailyDefault=false;

    HelperFunctions.disableElement(gameReturnMenuContainerId);
    if (playingDefaultGame)
    {
        enableInput();
        clearCodeDisplay();
        
    }
    else
    {
        
    }
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

function clearCodeDisplay()
{
    displayContainer.innerHTML="";
}

(function listenForPageChange() {
    const defaultModeButton = document.getElementById("play-default-button");
    defaultModeButton.addEventListener("click", (e) => {
        initCodeDisplay();
        nextLine();
    });
}());

function disableInput()
{
    HelperFunctions.disableElement(inputFieldId);
}

function enableInput()
{
    HelperFunctions.enableElement(inputFieldId);
}

function checkInput(e)
{
    currentAttempts++;
    const text= inputField.value.toLowerCase().replaceAll(" ", "");
    console.log(`input has submit to ${text}`);

    //Don't allow duplicate guessing
    if (!text || (previousInput && HelperFunctions.arrayContains(previousInput, text)))
    {
        return;
    }
    previousInput.push(text);

    const rightInput= text===code.getLang().toLowerCase();
    const maxAttemptsReached= currentAttempts>=totalAttempts;

    inputField.dispatchEvent(new CustomEvent("validGuess", {detail: 
        {
            "CorrectGuess": rightInput,
            "MaxAttempts": totalAttempts,
            "CurrentAttempts": currentAttempts,
            "AllAttemptsUsed": maxAttemptsReached,
        }
    }));

    if (maxAttemptsReached) gameEnd(false);
    else if (!rightInput) nextLine();
    else gameEnd(true);
}

(function listenForInput()
{
    const element = document.getElementById("input-field");
    element.addEventListener("change", checkInput);
}());

function gameEnd(isSuccess)
{
    disableInput();
    HelperFunctions.enableElement(gameReturnMenuContainerId);

    if (playingDefaultGame) playedDailyDefault=true;
    else playedDailyTable=true;
}

export function hasPlayedTodaysDefault()
{
    return playedDailyDefault;
}

export function hasPlayedTodaysTable()
{
    return playedDailyTable;
}

export function getTodaysCodeData()
{
    return code;
}