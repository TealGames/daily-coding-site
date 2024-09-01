import { HelperFunctions } from "./HelperFunctions.js";
import { CodingLanguage, getDataFromLanguage, getDataFromLanguageString, getTodaysCodeDataUTC, getTodaysTableDataUTC } from "./DailyCodeData.js";
import { getHtmlFromCodeData, getHtmlFromLanguageData } from "./CodeHtmlConverter.js";
import { CodeHtmlData } from "./CodeHtmlConverter.js";

const inputFieldId= "input-field";
let inputField=null;

const gameReturnMenuContainerId= "game-return-main-container";
let gameReturnMenuContainer=null;

const dislayContainerId= "game-display-container";
let displayContainer = null;

const defaultModeButtonId= "play-default-button";
const tableModeButtonId= "play-table-button";

let today = null;
let todaysCodeDisplay = null;
let todaysCodeIndex = 0;
let code=null;

let table=null;
let guessedLanguages=[];

let previousInput=[];
const totalAttempts=5;
let currentAttempts=0;

let playedDailyDefault=false;
let playedDailyTable=false;

let playingDefaultGame=true;

function initGameDisplay() {
    inputField= document.getElementById(inputFieldId);
    displayContainer = document.querySelector(`#${dislayContainerId}`);
    gameReturnMenuContainer=document.getElementById(gameReturnMenuContainerId);

    code = getTodaysCodeDataUTC();
    table= getTodaysTableDataUTC();
    todaysCodeDisplay = getHtmlFromCodeData(code);
    todaysCodeIndex = -1;
    previousInput=[];

    currentAttempts=0;
    playedDailyDefault=false;

    HelperFunctions.disableElement(gameReturnMenuContainerId);
    enableInput();
    clearDisplay();
}

function nextLine() {
    if(playingDefaultGame){
        todaysCodeIndex++;
        const allLines= todaysCodeDisplay.getLines();
        const allHtmlLines= todaysCodeDisplay.getHtmlLines();

        if (todaysCodeIndex > allHtmlLines.length - 1) {
            console.warn(`tried to procede to next line of code but has passed lines bounds`);
            return;
        }

        let html="";
        for (let i=0; i<allHtmlLines.length; i++)
        {
            console.log("print line"+ allHtmlLines[i]);
            if (i<=todaysCodeIndex)
            {
                html+=allHtmlLines[i];
            }
            else{
                const repeated= ("*").repeat(allLines[i].length);
                const repeatedHtml= `<p class="inline body-text code-default">${repeated}</p><p class="code-new-line"></p>`;
                html+=repeatedHtml;
            }
        }
        displayContainer.innerHTML = html;
    }
    else{
        const languageData= getDataFromLanguage(table.getLang());
        let html= getHtmlFromLanguageData(languageData, guessedLanguages, true);
        displayContainer.innerHTML = html;
    }
}

function showAllCodeLines()
{
    if(!playingDefaultGame) return;

    const allHtmlLines= todaysCodeDisplay.getHtmlLines();
    let html="";
    for (let i=todaysCodeIndex+1; i<allHtmlLines.length; i++){
        html+=allHtmlLines[i];
    }

    displayContainer.innerHTML = html;
}

function clearDisplay()
{
    displayContainer.innerHTML="";
}

(function listenForPageChange() {
    const defaultModeButton = document.getElementById(defaultModeButtonId);
    defaultModeButton.addEventListener("click", (e) => {
        playingDefaultGame=true;
        initGameDisplay();
        nextLine();
    });

    const tableModeButton = document.getElementById(tableModeButtonId);
    tableModeButton.addEventListener("click", (e) => {
        playingDefaultGame=false;
        initGameDisplay();
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
    const text= cleanInput(inputField.value);
    console.log(`input has submit to ${text}`);

    //Don't allow duplicate guessing
    if (!text || (previousInput && HelperFunctions.arrayContains(previousInput, text)))
    {
        return;
    }
    previousInput.push(text);

    let rightInput=false;
    if (playingDefaultGame) rightInput= text===code.getLang().toLowerCase();
    else rightInput= text===table.getLang().toLowerCase();

    const maxAttemptsReached= currentAttempts>=totalAttempts;
    inputField.dispatchEvent(new CustomEvent("validGuess", {detail: 
        {
            "Input": text,
            "CorrectGuess": rightInput,
            "MaxAttempts": totalAttempts,
            "CurrentAttempts": currentAttempts,
            "AllAttemptsUsed": maxAttemptsReached,
        }
    }));

    //NO matter what we show the current attempt for table game
    if (!playingDefaultGame){
        guessedLanguages.unshift(getDataFromLanguageString(text));
    }
    if (maxAttemptsReached) gameEnd(false);

    else if (!rightInput)
    {
        nextLine();
    }
    else if (rightInput)
    {
        //We show what player did even if they won for table game
        if (!playingDefaultGame) nextLine();

        //We show remaining lines (if any) for coding game
        else showAllCodeLines();
        gameEnd(true);
    }
}

function cleanInput(input)
{
    const cleaned= input.toLowerCase().replaceAll(" ", "").replaceAll("<", "").replaceAll(">","");
    return cleaned;
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