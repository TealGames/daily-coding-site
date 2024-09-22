import { HelperFunctions } from "./HelperFunctions.js";

const lineNumberParentId= "left-panel";
let lineNumberParent=null;
let lineNumberParentRect=null;

const rightContentParentId= "right-panel";
let rightContentParent=null;
let rightContentParentRect=null;

(function start(){
    lineNumberParent=document.getElementById(lineNumberParentId);
    lineNumberParentRect=lineNumberParent.getBoundingClientRect();

    rightContentParent= document.getElementById(rightContentParentId);
    rightContentParentRect= rightContentParent.getBoundingClientRect();

    setLines();
})();

function setLines(){

    let number=1;
    lineNumberParent.innerHTML="";
    while(lineNumberParentRect.width<rightContentParentRect.width){
        lineNumberParent.innerHTML+=`<p class="inline no-margins">${number}</p>`;
        number++;
    }
}