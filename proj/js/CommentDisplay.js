import { HelperFunctions } from "./HelperFunctions.js";
import { displayText } from "./TextDisplay.js";

import {getFacts} from "./RandomFacts.js";

let maxLineChars= 30;
const newLineOnSpaceOnly=true;
const skipSpecialCharacters=true;

const nextCharDisplayEvent= new Event("onNextCharDisplayed");

function commentDisplay(containerId, comment) {
    const elementContainer = document.querySelector(`#${containerId}`);
    const elementId = `${containerId}-comment-element`;
    const newLine = `<p class=\"no-margins code-comment\" id=\"${elementId}\"></p>`;

    maxLineChars= Math.floor(window.innerWidth/20);
    console.log(`chars: ${maxLineChars}`);
    
    
    //elementContainer.innerHTML="<p class=\"code-new-line\"></p>"+newLine+ elementContainer.innerHTML;
    elementContainer.innerHTML=newLine+ elementContainer.innerHTML;
    const newElement= document.querySelector(`#${elementId}`);
    
    let displayStr=comment;
    const isLongComment= displayStr.length/maxLineChars>0;

    const formatComment= function (){
        displayStr=comment;
        if (isLongComment) displayStr= "/*\n * "+displayStr;
        else{
            displayStr= "// "+ displayStr;
            return;
        }
    
        let needsNewLine=false;

        for (let i=0; i<displayStr.length; i++)
            {
                const text= displayStr.substring(0, i+1);
                const character= displayStr.charAt(i);
        
                if (text.length%maxLineChars===0) needsNewLine=true;
                if (newLineOnSpaceOnly && needsNewLine && character!== " ") continue;
        
                if (needsNewLine && i<displayStr.length-1)
                {
                    needsNewLine=false;
                    displayStr= text+ "\n * "+ displayStr.substring(i+1);
                }
            }
    }
    formatComment();

    const updateText = function(str) {
        let old= newElement.innerHTML;

        const closingCommentIndex= old.lastIndexOf("\n */");
        if (isLongComment && closingCommentIndex!==-1)
        {
            old= old.substring(0, closingCommentIndex);
        }

        newElement.innerHTML= old+str+ "\n */";
        newElement.dispatchEvent(nextCharDisplayEvent);
    }

    displayText(displayStr, 0.1, skipSpecialCharacters, updateText, null);

    window.addEventListener("resize", function(e) {
        newElement.innerHTML="";
        HelperFunctions.cancelCurrentDelay();
        formatComment();
        displayText(comment, 0, skipSpecialCharacters, updateText, null);
    });
}

function updateComment(event, element)
{
    if (HelperFunctions.windowWidthShrunk())
    {
        const oldHtml= element.innerHTML;
        element.innerHTML= oldHtml.replace("\.", '\n* ');
    }
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

document.addEventListener("DOMContentLoaded", displayAllComments);