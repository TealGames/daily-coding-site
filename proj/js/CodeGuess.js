import { HelperFunctions } from "./HelperFunctions.js";

const footerId= "footer";
const inputElementId= "language-input";

function showConsole()
{
    const element= document.getElementById(footerId);
    element.className= "displayed-console";

    HelperFunctions.enableElement(inputElementId);
}

function hideConsole()
{
    const element= document.getElementById(footerId);
    element.className= "hidden-console";

    HelperFunctions.disableElement(inputElementId);
}

function checkPageForConsole(e)
{
    //if (e.details===)
}

(function listenForConsoleEvents()
{
    const element= document.getElementById(inputElementId);
    element.addEventListener("input", );

    document.addEventListener("switchPage");
}());