import { HelperFunctions } from "./HelperFunctions.js";
import { PageId } from "./PageSwitcher.js";
import { hasPlayedTodaysDefault } from "./DailyCodeManager.js";
import { hasPlayedTodaysTable } from "./DailyCodeManager.js";
import { getTodaysCodeData } from "./DailyCodeManager.js";

let playDefaultGameButton=null;
let playTableGameButton=null; 
let playButton=null;

const playButtonId= "play-button";
const playDefaultButtonId= "play-default-button";
const playTableButtonId= "play-table-button";

let intervalId=0;

function setButtonsIfPage(pageId)
{
    const playedDefault= hasPlayedTodaysDefault();
    const playedTable= hasPlayedTodaysTable();

    clearUpdateTime();

    if(pageId===PageId.ModeSelect)
    {
        playDefaultGameButton.disabled= playedDefault;
        playTableGameButton.disabled= playedTable;

        const timeElements=[];
        if (playedDefault) timeElements.push(playDefaultButtonId);
        if (playedTable) timeElements.push(playTableButtonId);

        if (playedDefault || playedTable) startUpdateTime(timeElements);
    }
    else if (pageId===PageId.MainPage)
    {
        const playedAll= playedDefault && playedTable;
        playButton.disabled= playedAll;
        
        if (playedAll) startUpdateTime([playButtonId]);
    }
}

function checkPlayed(e)
{
    setButtonsIfPage(e.detail.pageEnabledId);
}

(function listenForEvents()
{
    playButton=document.getElementById(playButtonId);
    playDefaultGameButton= document.getElementById(playDefaultButtonId);
    playTableGameButton=document.getElementById(playTableButtonId);

    document.addEventListener("enablePage", checkPlayed);
    setButtonsIfPage(PageId.MainPage);

    //We reset all buttons on event so they can be clicked again
    document.addEventListener("timeDoneToNextDaily", () =>
    {
        playDefaultGameButton.disabled=false;
        playTableGameButton.disabled=false;
        playButton.disabled=false;
    });
}());

function updateTime(elementId)
{
    const element= document.getElementById(elementId);
    const currentTime=HelperFunctions.convertToUTC(new Date());

    //We have to get in relation to completed code assigned day (not in terms of player, but my local time)
    //since we don't know the player completes it and how close to the next time it is
    let nextDaily= getTodaysCodeData().getDay();
    nextDaily.setDate(nextDaily.getDate()+1);
    nextDaily= HelperFunctions.convertToUTC(HelperFunctions.getDateAsMidnight(nextDaily));

    //If we finish the time, we dispatch event
    if (HelperFunctions.isSameDayAndTime(currentTime, nextDaily))
    {
        document.dispatchEvent(new CustomEvent("timeDoneToNextDaily"));
        return;
    }

    const timeDelta= HelperFunctions.getTimeDifference(currentTime, nextDaily);
    const generalHtml=`<p class="code-2-new-line"></p>`+
                    `<p class="inline code-tab-space code-comment">//Next Daily In:`;
    const htmlToAdd= generalHtml+ ` ${timeDelta.Hours}:`+
                    `${timeDelta.Minutes}:${timeDelta.Seconds}</p>`;

    const html= element.innerHTML;
    const index= html.indexOf(generalHtml);

    if (index>=0) {
        element.innerHTML= html.substring(0, index)+htmlToAdd;
    }
    else{
        element.innerHTML+=htmlToAdd;
    }
}

function updateTimeMultiple(elementIds)
{
    for (let i=0; i<elementIds.length; i++) updateTime(elementIds[i]);
}

function startUpdateTime(elementIds)
{
    intervalId= setInterval(() => updateTimeMultiple(elementIds), 1000);
}

function clearUpdateTime()
{  
    clearInterval(intervalId);
}