import { HelperFunctions } from "./HelperFunctions.js";

export async function displayText(text, waitTime, displayCallback) {
    const minTime = 0;
    const maxTime = 1;

    waitTime = HelperFunctions.clamp(waitTime, minTime, maxTime);
    let foundTag = false;
    for (let i = 0; i < text.length; i++) {
        const character = text.charAt(i);

        //Using type coercion empty strings are false
        if (!character || character === " ") continue;

        if (character === "<") {
            foundTag = true;
            continue;
        }
        else if (character === ">" && foundTag) {
            foundTag = false;
            continue;
        }
        else if (foundTag) continue;

        await HelperFunctions.delay(waitTime);
        displayCallback(character);
    }
}