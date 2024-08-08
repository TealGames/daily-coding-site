import { HelperFunctions } from "./HelperFunctions.mjs";
import { displayText } from "./TextDisplay.mjs";

function display() {
    const newElementId = "#comment-element";
    const emptyTag = "<p class=\"code-comment\"></p>";
    const $element = $("play-container");

    HelperFunctions.addHtmlToStart($element, emptyTag);
    const $newElement = $(`#${newElementId}`);

    const updateText = (str) => {
        HelperFunctions.addHtmlToEnd($newElement, str);
    }

    displayText(comment, 0.3, updateText);
}
display();