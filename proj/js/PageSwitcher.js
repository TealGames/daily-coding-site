import { HelperFunctions } from "./HelperFunctions.js";

/**
 * @param {string} disablePageId 
 */
function disablePage(disablePageId)
{
    const disableElement= document.getElementById(disablePageId);
    console.log("disable"+disableElement);
    disableElement.style.display= "none";
}

/**
 * @param {string[]} disablePageIds
 */
function disablePageAll(disablePageIds)
{
    for (let i=0; i<disablePageIds.length; i++)   
    {
        disablePage(disablePageIds[i]);
    }
}

/**
 * @param {string} enablePageId 
 */
function enablePage(enablePageId)
{
    const enableElement= document.getElementById(enablePageId);
    const nodeType= enableElement.nodeName;
    console.log("enable"+enableElement);
    
    //Block elements need to be changed to display as blocks, while others are inline
    if (nodeType==="DIV" ||nodeType==="P") enableElement.style.display="block";
    else enableElement.style.display="inline";
}

/**
 * @param {string} disablePageId 
 * @param {string} enablePageId 
 */
function switchPage(disablePageId, enablePageId)
{
   disablePage(disablePageId);
   enablePage(enablePageId);
}

/**
 * @param {string[]} disablePageId 
 * @param {string} enablePageId 
 */
function disablePagesAndEnable(disablePageIds, enablePageId)
{
    disablePageAll(disablePageIds);
    enablePage(enablePageId);
}

const mainPage=  "main";
const modeSelectPage= "mode-select";
const defaultGamePage= "game-default";
const tableGamePage= "game-table";

const pageIds= [
    mainPage,
    modeSelectPage,
    defaultGamePage,
    tableGamePage,
];

(function pageSwitchButtonListen()
{
    const playButton= document.getElementById("play-button");
    playButton.addEventListener("click", () =>
    {
        switchPage(mainPage, modeSelectPage);
    });

    const defaultModeButton= document.getElementById("play-default-button");
    defaultModeButton.addEventListener("click", () =>
    {
        switchPage(modeSelectPage, defaultGamePage);
    });

    const tableModeButton= document.getElementById("play-table-button");
    tableModeButton.addEventListener("click", () =>
    {
        switchPage(modeSelectPage, tableGamePage);
    });

    const returnMenuButtons= document.getElementsByClassName("return-main-button");
    for (let i=0; i<returnMenuButtons.length; i++)
    {
        returnMenuButtons[i].addEventListener("click", () =>
        {
            disablePagesAndEnable(pageIds, mainPage);
        });
    }
    
})();

(function disableAllOtherPages()
{
    disablePagesAndEnable(pageIds, mainPage);
})();

