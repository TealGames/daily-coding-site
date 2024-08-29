import { CodeData } from "./DailyCodeData.js";

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

//new line is the only tag that does not need a closing pair of tag
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

export class CodeHtmlData{
    #lines="";
    #html="";

    constructor(lines, html)
    {
        this.#lines= lines;
        this.#html= html;
    }

    /**
     * @returns {string[]}
     */
    getLines()
    {
        return this.#lines;
    }

    /**
     * @returns {string}
     */
    getHtml()
    {
        return this.#html;
    }
}

/**
 * @param {CodeData} data 
 * @returns {CodeHtmlData}
 */
export function getHtmlFromCodeData(data)
{
    const code= data.getCode();
    let html="";
    let currentTag=null;

    let lines= [];
    let currentLine="";

    for (let i=0; i<code.length; i++)
    {
        const c= code.charAt(i);
        if(c==="<" && i+1<code.length)
        {
            //If we are at closing tag, we can skip to the next text (since we know it has to be
            //of the form </TAG>) so we have to do / + tag length + > and next space
            if (code[i+1]==="/")
            {
                i+= currentTag.length+2;
                currentTag="";
            }

            //Otherwise we are an opening tag, so we get the current tag and then we
            //increase to next character past tag so tag + > and next space
            else
            {
                currentTag= code.substring(i+1, i+1+tagLength);
                i+=tagLength+1;
                
                if (currentTag===newLineTag)
                {
                    currentLine+="<p class=\"code-new-line\"></p>";

                    lines.push(currentLine);
                    html+=currentLine;
                    currentLine="";
                }
                else{
                    currentLine+=`<p class=\"inline ${getCSSClassFromTag(currentTag)}\">`;
                }
            }
        }
        else currentLine+=c;
    }

    //If we still have a line at the end not cleared (meaning we did not end on END tag)
    //we then add it here
    if (currentLine) lines.push(currentLine);

    return new CodeHtmlData(lines, html);
}