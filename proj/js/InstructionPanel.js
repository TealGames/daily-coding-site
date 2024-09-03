import { HelperFunctions } from "./HelperFunctions.js";
import { PageId } from "./PageSwitcher.js";

const mainReturnContainerId= "instructions-main-return-container";
const gameReturnContainerId= "instructions-game-return-container";

(function listenToPageSwitch()
{
    document.addEventListener("enablePage", (e) =>
    {
        console.log(`past page: ${e.detail.pastPageId}`);
        if (!e || e.detail.pageEnabledId !==PageId.GameInstructions) return;
        
        const pastPage= e.detail.pastPageId;
        if (pastPage===PageId.MainPage)
        {
            HelperFunctions.disableElement(gameReturnContainerId);
            HelperFunctions.enableElement(mainReturnContainerId);
        }
        else if (pastPage === PageId.GameDisplay)
        {
            HelperFunctions.enableElement(gameReturnContainerId);
            HelperFunctions.disableElement(mainReturnContainerId);
        }
    });
}());