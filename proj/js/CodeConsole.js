import { HelperFunctions } from "./HelperFunctions.js";
import { PageId } from "./PageSwitcher.js";

const footerId = "footer";
const inputContainerId = "language-input";
const inputElementId= "input-field";
const labelElementId= "input-label-text";

function showConsole() {
    //console.log("show console");
    const footer = document.getElementById(footerId);
    footer.className = "displayed-console";

    HelperFunctions.enableElement(inputContainerId);
    const input = document.getElementById(inputContainerId);
    updateLabelText();
    input.focus();
    //input.select();
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

function updateLabelText()
{
    const label= document.getElementById(labelElementId);
    const inputField= document.getElementById(inputElementId);

    const targetTextStart=  `<p class=\"code-new-line\"></p>
                 <p class=\"inline terminal\">language guess:`;
    const targetTextFull=targetTextStart+`</p>`;

    const lastIndex= label.innerHTML.lastIndexOf("</p>");
    let oldHtml=label.innerHTML;

    //If we have the label, we just append the answer, otherwise we create a new label
    console.log(`update label val: ${inputField.value} @idx${lastIndex}`);
    if (lastIndex>=0)
    {
        oldHtml=oldHtml.substring(0, lastIndex);
        label.innerHTML=oldHtml+` ${inputField.value}</p>`;
    }
    label.innerHTML+=targetTextFull;
}

(function listenForConsoleEvents() {
    document.addEventListener("enablePage", checkPageForConsole);

    const inputField= document.getElementById(inputElementId);
    inputField.addEventListener("change", updateLabelText);
}());

(function hideConsoleOnStart() {
    //console.log("hide console start");
    hideConsole();
}());