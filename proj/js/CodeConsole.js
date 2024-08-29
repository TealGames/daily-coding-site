import { HelperFunctions } from "./HelperFunctions.js";
import { PageId } from "./PageSwitcher.js";

const footerId = "footer";
const inputContainerId = "language-input";
const inputElementId= "input-field";
const labelElementId= "input-label-text";

let label=null;
let inputField=null;

let previousInput=[];

function showConsole() {
    //console.log("show console");
    const footer = document.getElementById(footerId);
    footer.className = "displayed-console";

    label= document.getElementById(labelElementId);
    inputField= document.getElementById(inputElementId);

    HelperFunctions.enableElement(inputContainerId);
    const input = document.getElementById(inputContainerId);
    clearLabelText();
    updateLabelText(null);
    
    HelperFunctions.clearInput(inputField);
    inputField.focus();

    previousInput=[];
}

function hideConsole() {
    //console.log("hide console");
    const element = document.getElementById(footerId);
    element.className = "hidden-console";

    HelperFunctions.disableElement(inputContainerId);
}

function checkPageForConsole(e) {
    console.log("enabled page "+e.detail);
    if (e.detail === PageId.GameDefault || e.detail === PageId.GameTable) {
        showConsole();
    }
    else {
        hideConsole();
    }
}

function clearLabelText()
{
    const label= document.getElementById(labelElementId);
    label.innerHTML="";
}

function updateLabelText(e)
{
    const label= document.getElementById(labelElementId);
    const inputField= document.getElementById(inputElementId);

    const input= inputField.value.toLowerCase().replaceAll(" ", "");
    const repeatInput= HelperFunctions.arrayContains(previousInput, input);

    const targetTextStart=  `<p class=\"code-new-line\"></p>
                 <p class=\"inline terminal\">language guess:`;
    const targetTextFull=targetTextStart+`</p>`;

    const lastIndex= label.innerHTML.lastIndexOf("</p>");
    let oldHtml=label.innerHTML;

    //If we have the label, we just append the answer, otherwise we create a new label
    console.log(`update label val: ${input} @idx${lastIndex} ${e?.detail?.CorrectGuess}`);
    if (lastIndex>=0)
    {
        oldHtml=oldHtml.substring(0, lastIndex);
        label.innerHTML=oldHtml+` ${input}</p>`;
        if (e)
        {
            if (e.detail.AllAttemptsUsed)
            {
                label.innerHTML+=`<p class=\"code-new-line\"></p>`+
                `<p class=\"inline terminal-error\">max attempts reached: `+
                `${e.detail.MaxAttempts}/${e.detail.CurrentAttempts}</p>`; 
                return; 
            }
            else if (!e.detail.CorrectGuess)
            {
                label.innerHTML+=`<p class=\"code-new-line\"></p>`+
                `<p class=\"inline terminal-error\">wrong input-> ~~~~~~~~  try again</p>`;        
            }
            else{
                label.innerHTML+=`<p class=\"code-new-line\"></p>`+
                `<p class=\"inline terminal-success\">correct input</p>`;       
            }
        }
    }
    label.innerHTML+=targetTextFull;
    
}

(function listenForConsoleEvents() {
    document.addEventListener("enablePage", checkPageForConsole);

    const inputField= document.getElementById(inputElementId);
    inputField.addEventListener("validGuess", updateLabelText);
}());

(function hideConsoleOnStart() {
    //console.log("hide console start");
    hideConsole();
}());