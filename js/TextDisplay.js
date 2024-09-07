import { HelperFunctions } from "./HelperFunctions.js";

/**
 * Displays text asyncrhonously by awaiting each non-space character
 * @param {string} text - The text to display
 * @param {number} waitTime - The time to wait at EACH character
 * @param {boolean} skipSpecialChars - If true, will still invoke callbacks on the character, 
 * but will not delay for the time (default behavior for space)
 * @param {string} cancelId - the cancellation id to be used for cancelling the WHOLE display 
 * @param {function(string)} charAction -Callback when character finishes delay with the new character as the arg
 * @param {function(string)} strAction - Callback when character finishes delay with the full string up to that newest char as the arg
 */
export async function displayText(text, waitTime, skipSpecialChars, cancelId, charAction, strAction) {
    const minTime = 0;
    const maxTime = 1;

    waitTime = HelperFunctions.clamp(waitTime, minTime, maxTime);
    let foundTag = false;
    for (let i = 0; i < text.length; i++) {
        const character = text.charAt(i);

        //Using type coercion empty strings are false
        if (!character) continue;
        else if (character === " " || (skipSpecialChars && HelperFunctions.isSpecialCharacter(character)))
        {
            if (charAction) charAction(character);
            if (strAction) strAction(text.substring(0, i+1));
            continue;
        }
        else if (character === "<") {
            foundTag = true;
            continue;
        }
        else if (character === ">" && foundTag) {
            foundTag = false;
            continue;
        }
        else if (foundTag) continue;
        
        await HelperFunctions.delay(waitTime, cancelId);

        // //We need to catch error in case the delay is rejected by promise
        // try{
        //     await HelperFunctions.delay(waitTime, cancelId);
        // }
        // catch (e)
        // {
        //     console.log(`display text was cancelled!`);
        //     return;
        // }
        
        if (charAction) charAction(character);
        if (strAction) strAction(text.substring(0, i+1));
    }
}