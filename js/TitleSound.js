const titleElementId="title-button";
let titleElement=null;

const soundElementId= "title-button-audio";
let soundElement= null;

(function start(){
    document.addEventListener("DOMContentLoaded", init);
})();

function init(){
    titleElement=document.getElementById(titleElementId);
    soundElement= document.getElementById(soundElementId);

    titleElement.addEventListener("click", (e) =>{
        soundElement.play();
    });
}