import { HelperFunctions } from "./HelperFunctions.js";
import { PageId } from "./PageSwitcher.js";
import { wasLastGameSuccess } from "./DailyCodeManager.js";

const sendURL= 'https://formspree.io/f/xzzpwwad';
const submitButtonId= "submit-rating-button";
let submitButton=null;

const selectedStarIcon="★";
const emptyStarIcon="☆";

let starElements=[];
let selectedAmount=-1;

function initRefs()
{
    starElements=[];

    starElements.push(document.getElementById("star-1"));
    starElements.push(document.getElementById("star-2"));
    starElements.push(document.getElementById("star-3"));
    starElements.push(document.getElementById("star-4"));
    starElements.push(document.getElementById("star-5"));

    setStarsToIndex(-1);
}

function setStarsToIndex(index)
{
    for (let i=0; i<starElements.length; i++)
    {
        if (i<=index) starElements[i].innerHTML= selectedStarIcon;
        else starElements[i].innerHTML= emptyStarIcon;
    }
}

(function setup()
{
    initRefs();
    submitButton= document.getElementById(submitButtonId);

    submitButton.addEventListener("click", (e) =>
    {
        const lastGameSuccess= wasLastGameSuccess();
        const json= JSON.stringify({ rating: selectedAmount, guessedLang:lastGameSuccess});
        fetch(sendURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        })
        .then(response =>{
            console.log(`Successfully set data: response.json()`);
        })
        .catch(error => {
            console.error('Error submitting rating:', error);
        });
    });

    document.addEventListener("enablePage", (e) =>
    {
        if (!e.details || e.details.pageEnabledId!==PageId.RatingPage) return;
        setStarsToIndex(-1);
    });

    for(let i=0; i<starElements.length; i++)
    {
        starElements[i].addEventListener("click", (e) =>
        {
            setStarsToIndex(i);
            selectedAmount=i+1;
        });
    }
})();