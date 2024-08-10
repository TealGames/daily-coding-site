import { HelperFunctions } from "./HelperFunctions.js";
import { displayText } from "./TextDisplay.js";

import {getFacts} from "./RandomFacts.js";

function commentDisplay(containerId, comment) {
    const elementContainer = document.querySelector(`#${containerId}`);
    const elementId = `${containerId}-comment-element`;
    const emptyTag = `<p class=\"no-margins code-comment\" id=\"${elementId}\"></p>`;

    elementContainer.innerHTML="<p class=\"code-2-new-line\"></p>"+emptyTag+ elementContainer.innerHTML;
    const $newElement= document.querySelector(`#${elementId}`);

    const updateText = str => {
        $newElement.innerHTML= $newElement.innerHTML+str;
    }

    if (comment.substr(0, 2)!=="//") comment= "//"+comment;
    displayText(comment, 0.1, updateText);
}

function randomCommentDisplay(containerId, possibleComments) 
{
    const index= Math.floor(Math.random()*possibleComments.length);
    commentDisplay(containerId, possibleComments[index]);
}

function randomCommentDisplayFromJson(containerId, json)
{
    const data= HelperFunctions.getObjFromJson(json).data;
    const index= Math.floor(Math.random()*data.length);
    commentDisplay(containerId, data[index]);
}

function displayAllComments()
{
    randomCommentDisplay("play-container", getFacts());
    randomCommentDisplay("leaderboard-container", ["poop", "eat"]);
    randomCommentDisplay("tutorial-container", ["poop", "eat"]);
}

displayAllComments();