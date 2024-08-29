import { HelperFunctions } from "./HelperFunctions.js";
import { PageId } from "./PageSwitcher.js";
import { hasPlayedTodaysDefault } from "./DailyCodeManager.js";
import { hasPlayedTodaysTable } from "./DailyCodeManager.js";

let playDefaultGameButton=null;
let playTableGameButton=null; 
let playButton=null;

function setButtonsIfPage(pageId)
{
    console.log("set buttons");
    if(pageId!== PageId.ModeSelect && pageId!==PageId.MainPage) return;
    
    const playedDefault= hasPlayedTodaysDefault();
    const playedTable= hasPlayedTodaysTable();

    playDefaultGameButton.disabled= playedDefault;
    console.log(`played def: ${playedDefault} dis: ${playDefaultGameButton.disabled}`);

    playTableGameButton.disabled= playedTable;
    playButton.disabled= playedDefault && playedTable;
}

function checkPlayed(e)
{
    console.log("check buttons");
    setButtonsIfPage(e.detail);
}


(function listenForMainPage()
{
    playButton=document.getElementById("play-button");
    playDefaultGameButton= document.getElementById("play-default-button");
    playTableGameButton=document.getElementById("play-table-button");

    document.addEventListener("enablePage", checkPlayed);
    setButtonsIfPage(PageId.MainPage);
}());