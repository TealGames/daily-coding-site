import { HelperFunctions } from "./HelperFunctions.js";

/**
 * @param {string} disablePageId 
 */
function disablePage(disablePageId)
{
    HelperFunctions.disableElement(disablePageId);
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
    HelperFunctions.enableElement(enablePageId);
}

/**
 * @param {string} disablePageId 
 * @param {string} enablePageId 
 */
function switchPage(disablePageId, enablePageId)
{
   disablePage(disablePageId);
   enablePage(enablePageId);

   document.dispatchEvent(new CustomEvent("switchPage", {detail: enablePageId}));
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

export const PageId=Object.freeze(
    {
        "MainPage": "main",
        "ModeSelect": "mode-select",
        "GameDefault": "game-default",
        "GameTable": "game-table",
    }
);


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

