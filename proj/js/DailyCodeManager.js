import { HelperFunctions } from "./HelperFunctions.js";
import { getCode } from "./DailyCodeData.js"; 
import {getHtmlFromCodeData} from "./CodeHtmlConverter.js";
import { CodeHtmlData } from "./CodeHtmlConverter.js";

let today=null;
let todaysCodeDisplay=null;
let todaysCodeIndex=0;
let displayContainer= null;

function initCodeDisplay()
{
    today= new Date();
    const code= getCode(today);
    todaysCodeDisplay= getHtmlFromCodeData(code);
    todaysCodeIndex=-1;

    displayContainer= document.querySelector("#game-default-container");
    console.log(`code: ${todaysCodeDisplay.getHtml()}`);
}

function nextLine()
{
    todaysCodeIndex++;
    if(todaysCodeIndex>todaysCodeDisplay.getLines().length-1)
    {
        console.warn(`tried to procede to next line of code but has passed lines bounds`);
        return;
    }

    const line= todaysCodeDisplay.getLines()[todaysCodeIndex];

    if (displayContainer.innerHTML) displayContainer.innerHTML+=line;
    else displayContainer.innerHTML=line;

    console.log(`displaying ${line} to ${displayContainer} ${displayContainer.innerHTML}`);
}

(function listenForPageChange()
{
    const defaultModeButton= document.getElementById("play-default-button");
    defaultModeButton.addEventListener("click", (e) =>
    {
        initCodeDisplay();
        nextLine();
        nextLine();
        nextLine();
    });
}());