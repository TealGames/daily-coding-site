import { HelperFunctions } from "./HelperFunctions.js";
import { displayText } from "./TextDisplay.js";

function display() {
    const newElementId = "comment-element";
    const emptyTag = `<p class=\"code-comment\" id=\"${newElementId}\"></p>`;
    //const $element = $("play-container");
    const $element= document.querySelector("#play-container");

    //HelperFunctions.addHtmlToStart($element, emptyTag);
    $element.innerHTML=emptyTag+$element.innerHTML;
    //const $newElement = $(`#${newElementId}`);
    const $newElement= document.querySelector(`#${newElementId}`);

    const updateText = str => {
        $newElement.innerHTML= $newElement.innerHTML+str;
        //HelperFunctions.addHtmlToEnd($newElement, str);
    }

    const comment= "//Hello World!";
    displayText(comment, 0.3, updateText);
}
display();