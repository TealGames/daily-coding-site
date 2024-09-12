import { HelperFunctions } from "./HelperFunctions.js";

const containerId="credit-names";
let container=null;

const jsonPath="../data/Credits.json";
let json="";
let data=[];

(async function display()
{
    container= document.getElementById(containerId);
    let html="";

    json= await HelperFunctions.getFileText(jsonPath);
    if (json) data= HelperFunctions.getObjFromJson(json);

    if (!json || !data || data.length===0){
        html=`<p class="inline code-2-tab-space code-comment">//Data not found.</p>`;
    }
    else{
        for (let i=0; i<data.length; i++){
            html+=getHtml(data[i]);
        }
    }

    container.innerHTML=html;
})();

function getHtml(keyValuePair)
{
    const html=
    `<div>
        <p class="inline code-2-tab-space code-method">put</p>
        <p class="inline code-default">(</p>
        <p class="inline code-local-variable">${keyValuePair.id}</p>
        <p class="inline code-default">,</p>
        <p class="inline code-string">"${keyValuePair.name}"</p>
        <p class="inline code-default">);</p>
    </div>`;

    return html;
}