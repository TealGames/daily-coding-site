import { HelperFunctions } from "./HelperFunctions.js";

/**
 * @param {string} disablePageId 
 */
function disablePage(disablePageId) {
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
    document.dispatchEvent(new CustomEvent("enablePage", { detail: enablePageId }));
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
        "GameDefault": "game-default",
        "GameTable": "game-table",
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
        switchPage(PageId.ModeSelect, PageId.GameDefault);
    });

    const tableModeButton = document.getElementById("play-table-button");
    tableModeButton.addEventListener("click", () => {
        switchPage(PageId.ModeSelect, PageId.GameTable);
    });

    const returnMenuButtons = document.getElementsByClassName("return-main-button");
    for (let i = 0; i < returnMenuButtons.length; i++) {
        returnMenuButtons[i].addEventListener("click", () => {
            disablePagesAndEnable(getAllPageIds(), PageId.MainPage);
        });
    }

})();

(function disableAllOtherPages() {
    console.log("disable all pages");
    disablePagesAndEnable(getAllPageIds(), PageId.MainPage);
})();

