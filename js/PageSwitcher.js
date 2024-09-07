import { HelperFunctions } from "./HelperFunctions.js";

let currentPageId="";

/**
 * @param {string} disablePageId 
 */
function disablePage(disablePageId) {
    console.log("disabling page "+ disablePageId);
    HelperFunctions.disableElement(disablePageId);
}

/**
 * @param {string[]} disablePageIds
 */
function disablePageAll(disablePageIds) {
    for (let i = 0; i < disablePageIds.length; i++) {
        disablePage(disablePageIds[i]);
    }
}

/**
 * @param {string} enablePageId 
 */
function enablePage(enablePageId) {
    HelperFunctions.enableElement(enablePageId);
    document.dispatchEvent(new CustomEvent("enablePage", { detail: 
        {
            pageEnabledId: enablePageId,
            pastPageId: currentPageId,
        }
    }));

    currentPageId= enablePageId;
}

/**
 * @param {string} disablePageId 
 * @param {string} enablePageId 
 */
function switchPage(disablePageId, enablePageId) {
    disablePage(disablePageId);
    enablePage(enablePageId);
}

/**
 * @param {string[]} disablePageId 
 * @param {string} enablePageId 
 */
function disablePagesAndEnable(disablePageIds, enablePageId) {
    disablePageAll(disablePageIds);
    enablePage(enablePageId);
}

export const PageId = Object.freeze(
    {
        "MainPage": "main",
        "ModeSelect": "mode-select",
        "GameDisplay": "game-display",
        "GameInstructions": "game-instructions",
    }
);

function getAllPageIds() {
    return HelperFunctions.getPropertiesOfObject(PageId);
}


(function pageSwitchButtonListen() {
    const playButton = document.getElementById("play-button");
    playButton.addEventListener("click", () => {
        switchPage(PageId.MainPage, PageId.ModeSelect);
    });

    const defaultModeButton = document.getElementById("play-default-button");
    defaultModeButton.addEventListener("click", () => {
        switchPage(PageId.ModeSelect, PageId.GameDisplay);
    });

    const tableModeButton = document.getElementById("play-table-button");
    tableModeButton.addEventListener("click", () => {
        switchPage(PageId.ModeSelect, PageId.GameDisplay);
    });

    const returnMenuButtons = document.getElementsByClassName("return-main-button");
    for (let i = 0; i < returnMenuButtons.length; i++) {
        returnMenuButtons[i].addEventListener("click", () => {
            disablePagesAndEnable(getAllPageIds(), PageId.MainPage);
        });
    }

    const tutorialButtons = document.getElementsByClassName("instruction-button");
    for (let i = 0; i < tutorialButtons.length; i++) {
        tutorialButtons[i].addEventListener("click", () => {
            disablePagesAndEnable(getAllPageIds(), PageId.GameInstructions);
        });
    }

    const returnToGameButton= document.getElementById("return-game-button");
    returnToGameButton.addEventListener("click", () => {
        switchPage(PageId.GameInstructions, PageId.GameDisplay);
    });
})();

(function disableAllOtherPages() {
    console.log(`disable all pages: ${getAllPageIds()}`);
    disablePagesAndEnable(getAllPageIds(), PageId.MainPage);
})();

