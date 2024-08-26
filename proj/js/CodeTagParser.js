import { CodeData } from "./DailyCodeData";

const tagLength=3;
const defaultTag= "def";
const defaultKeywordTag= "key";
const specialKeywordTag= "spc";
const variableTag= "var";
const functionTag= "fnc";
const objectTag= "obj";
const enumTag= "enm";
const stringTag= "str";
const commentTag= "cmt";
const newLineTag= "new";

function getCSSClassFromTag(tag)
{
    switch (tag)
    {
        case defaultTag:
            return "code-default";
        case defaultKeywordTag:
            return "code-default-keyword";
        case specialKeywordTag:
            return "code-special-keyword";
        case variableTag:
            return "code-local-variable";
        case functionTag:
            return "code-method";
        case objectTag:
            return "code-object";
        case enumTag:
            return "code-enum";
        case stringTag:
            return "code-string";
        case commentTag:
            return "code-comment";
        default:
            console.error(`Tried to retrieve CSS class from tag ${tag} but it has no corresponding class!`);
            break;
    }
}

/**
 * @param {CodeData} data 
 */
export function getHtmlFromCodeData(data)
{
    const code= data.getCode();
    let html="";
    let currentTag=null;

    for (let i=0; i<code.length; i++)
    {
        const c= code.charAt(i);
        if(c==="<")
        {
            //If we are at closing tag, we can skip to the next text (since we know it has to be
            //of the form </TAG>) so we have to do / + tag length + > and next space occurs with i++
            if (i+1<code.length && code[i+1]==="/")
            {
                i+= currentTag.length+2;
                currentTag=null;
            }

            //Otherwise we are an opening tag, so we get the current tag and then we
            //increase to next character past tag so tag + > and next space occurs with i++
            else
            {
                currentTag= code.substring(i+1, i+1+tagLength);
                i+=i+tagLength+1;

                if (currentTag===newLineTag) html+="<p class=\"code-new-line\"></p>";
                else html+=`<p class=\"inline ${getCSSClassFromTag(currentTag)}\"></p>`;
            }
        }
    }

    return html;
}