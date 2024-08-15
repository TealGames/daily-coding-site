import { HelperFunctions } from "./HelperFunctions.js";
import { displayText } from "./TextDisplay.js";

import {getFacts} from "./RandomFacts.js";

const maxLineChars=25;
const newLineOnSpaceOnly=true;
const skipSpecialCharacters=true;

const nextCharDisplayEvent= new Event("onNextCharDisplayed");

function commentDisplay(containerId, comment) {
    const elementContainer = document.querySelector(`#${containerId}`);
    const elementId = `${containerId}-comment-element`;
    const newLine = `<p class=\"no-margins code-comment\" id=\"${elementId}\"></p>`;

    //elementContainer.innerHTML="<p class=\"code-new-line\"></p>"+newLine+ elementContainer.innerHTML;
    elementContainer.innerHTML=newLine+ elementContainer.innerHTML;
    const $newElement= document.querySelector(`#${elementId}`);
    
    const isLongComment= comment.length/maxLineChars>0;
    if (isLongComment) comment= "/*\n * "+comment;
    else comment= "// "+ comment;
    
    let needsNewLine=false;

    if (isLongComment)
    {
        for (let i=0; i<comment.length; i++)
            {
                const text= comment.substring(0, i+1);
                const character= comment.charAt(i);
        
                if (text.length%maxLineChars===0) needsNewLine=true;
                if (newLineOnSpaceOnly && needsNewLine && character!== " ") continue;
        
                if (needsNewLine && i<comment.length-1)
                {
                    needsNewLine=false;
                    comment= text+ "\n * "+ comment.substring(i+1);
                }
            }
    }

    const updateText = str => {
        let old= $newElement.innerHTML;

        const closingCommentIndex= old.lastIndexOf("\n */");
        if (isLongComment && closingCommentIndex!==-1)
        {
            old= old.substring(0, closingCommentIndex);
        }

        $newElement.innerHTML= old+str+ "\n */";
        $newElement.dispatchEvent(nextCharDisplayEvent);
    }

    displayText(comment, 0.1, skipSpecialCharacters, updateText, null);
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
    randomCommentDisplay("fun-fact-container", getFacts());
    //randomCommentDisplay("leaderboard-container", ["poop", "eat"]);
    //randomCommentDisplay("tutorial-container", ["poop", "eat"]);
}

displayAllComments();