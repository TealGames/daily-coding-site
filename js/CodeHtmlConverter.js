import { CodeData, getDataFromLanguage, isValidLanguage, LanguageData, LanguageParadigm, LanguageTyping, LanguageUse } from "./DailyCodeData.js";
import { HelperFunctions } from "./HelperFunctions.js";

const tagLength = 3;
const defaultTag = "def";
const defaultKeywordTag = "key";
const specialKeywordTag = "spc";
const variableTag = "var";
const functionTag = "fnc";
const objectTag = "obj";
const enumTag = "enm";
const stringTag = "str";
const numberTag = "num";
const commentTag = "cmt";

//new line is the only tag that does not need a closing pair of tag
const newLineTag = "new";
//adds the set amount of tabs (if t2 then 2 tabs are added)
const tabTag = "t";

//We need to determine if a < sign is a tag or just the symbol so this is the escape
const lessThanEscape = " ";

//when parsing strings for inferred tags we need to know if it is a "
//in a string or just a " for starting/ending strings
const stringInStringEscape = "/";

export const codeTokenTag = "p";

const allTags = [defaultTag, defaultKeywordTag, specialKeywordTag, variableTag,
    functionTag, objectTag, enumTag, stringTag, numberTag, commentTag, newLineTag];

//tab tags must be first index in line
const tabTagOnlyAtStart = true;
//one lined symbols will auto get the def tag
const autoAddDefToSymbols = false;
//If lang has tag data, will use it to auto add tags
const autoAddLangTagData = true;

const autoAddFuncTag = true;
const autoAddNumTag = true;
const autoAddStrTag = true;
const stringSymbols = ["\"", "'", "`"];

const inferStringProperty = "InferString";
const inferNumberProperty = "InferNumber";
const inferFunctionProperty = "InferFunction";

const noTagFoundTag = defaultTag;

let taggedLangData = [];
const taggedLangDataJson = "./data/LanguageData.json";

/**
 * @param {String} tag 
 * @returns {Boolean}
 */
function isValidTag(tag) {
    return HelperFunctions.arrayContains(allTags, tag);
}

class LanguageTagData {
    #language;
    tagData;

    static TAG_SECTION_PROPERTY = "SyntaxData";
    static TAG_PROPERTIES = [[defaultKeywordTag, "DefaultKeywords"], [specialKeywordTag, "SpecialKeywords"]];
    static TAG_FUNCTION_PROPERTY = "FunctionSyntax";
    static TAG_STRING_PROPERTY = "StringSyntax";

    /**
     * @param {String} language 
     * @param {Object} tagData 
     */
    constructor(language, tagData) {
        this.#language = language;
        this.tagData = tagData;
    }

    /**
     * @returns {String}
     */
    getLanguage() {
        return this.#language;
    }

    /**
     * @returns {Object[]} {Tag, Data}
     */
    getAllTagData() {
        let result = [];

        for (let i = 0; i < LanguageTagData.TAG_PROPERTIES.length; i++) {
            const data = LanguageTagData.TAG_PROPERTIES[i];

            if (this.tagData[data[1]]) {
                result.push({
                    "Tag": data[0],
                    "Data": this.tagData[data[1]],
                });
            }
        }

        return result;
    }

    /**
     * @returns {Boolean}
     */
    getInferString() {
        if (this.tagData[LanguageTagData.TAG_STRING_PROPERTY]) {
            return this.tagData[LanguageTagData.TAG_STRING_PROPERTY];
        }

        console.error(`tried to get infer string for language ${this.#language} `+
            `but it does not have property ${LanguageTagData.TAG_STRING_PROPERTY} so it defaulted to FALSE`);
        return false;
    }

    /**
     * @returns {Boolean}
     */
    getInferFunction() {
        if (this.tagData[LanguageTagData.TAG_FUNCTION_PROPERTY]) {
            return this.tagData[LanguageTagData.TAG_FUNCTION_PROPERTY];
        }

        console.error(`tried to get infer function for language ${this.#language} `+
            `but it does not have property ${LanguageTagData.TAG_FUNCTION_PROPERTY} so it defaulted to FALSE`);
        return false;
    }

    /**
     * @returns {Boolean}
     */
    getInferNumber() {
        return true;
    }

    /**
     * @param {String} tag 
     * @returns {String[]}
     */
    getTagData(tag) {
        if (!isValidTag(tag)) {
            console.error(`tried to get language tag data for tag ${tag} but it is not a valid tag!`);
            return [];
        }

        for (let i = 0; i < LanguageTagData.TAG_PROPERTIES.length; i++) {
            const data = LanguageTagData.TAG_PROPERTIES[i];
            if (data[0] === tag) {
                if (!this.tagData[data[1]]) {
                    console.error(`tried to get the langauge tag data fro tag ${tag} but the tag data obj ` +
                        `${this.tagData} does not contain a property for this tag`);
                    return [];
                }

                return this.tagData[data[1]];
            }
        }
        return [];
    }
}

(async function initLanguageTagData() {
    const text = await HelperFunctions.getFileText(taggedLangDataJson);
    if (!text) {
        console.log(`tried to init language tag data, but failed to retrieve the ` +
            `text from json ${taggedLangDataJson} that contains it`);
        return;
    }

    const jsonObj = HelperFunctions.getObjFromJson(text);
    if (jsonObj) {
        taggedLangData.length = 0;
    }

    for (let i = 0; i < jsonObj.length; i++) {
        const obj = jsonObj[i];
        if (obj[LanguageTagData.TAG_SECTION_PROPERTY]) {
            taggedLangData.push(new LanguageTagData(obj.Language, obj[LanguageTagData.TAG_SECTION_PROPERTY]));
        }
    }
})();

/**
 * @param {String} language 
 * @returns {Object[]}
 */
function getTagDataFromLanguage(language) {
    const isValid = isValidLanguage(language, true);
    if (!isValid) {
        console.error(`tried to get the tag data from language ${language} but it is not a valid language!`);
        return;
    }

    //console.log(`total tag lang data: ${taggedLangData.length}`);
    for (let i = 0; i < taggedLangData.length; i++) {
        //console.log(`checking tag data ${HelperFunctions.objAsString(taggedLangData[i])}`);
        if (taggedLangData[i].getLanguage() === language) {
            return taggedLangData[i].getAllTagData();
        }
    }

    return null;
}

/**
 * @param {String} language 
 * @returns {Object}
 */
function getInferredTagsForLanguage(language) {
    const isValid = isValidLanguage(language, true);
    if (!isValid) {
        console.error(`tried to get inferred tag data from language ${language} but it is not a valid language!`);
        return;
    }

    for (let i = 0; i < taggedLangData.length; i++) {
        //console.log(`checking tag data ${HelperFunctions.objAsString(taggedLangData[i])}`);
        if (taggedLangData[i].getLanguage() === language) {
            let obj = {};
            obj[inferStringProperty] = taggedLangData[i].getInferString();
            obj[inferFunctionProperty] = taggedLangData[i].getInferFunction();
            obj[inferNumberProperty] = taggedLangData[i].getInferNumber();

            return obj;
        }
    }
    return null;
}

/**
 * @param {String} language 
 * @param {String[]} codeLines
 * @returns {String}
 */
function tryAddCodeTags(language, codeLines) {
    const dataArr = getTagDataFromLanguage(language);
    if (!dataArr || dataArr.length == 0) {
        console.error(`tried to add code tags to the langauge ${language} for lines ` +
            `${codeLines} but the lang has no tag data!`);
        return;
    }

    let line = "";
    let currentTag = "";
    let currentTagData = null;
    let currentData = [];
    let checkString = "";

    let checkStrIsTag = false;

    let result = [];
    let index = 0;
    let endIndex = -1;
    let nextSearchStart = -1;

    for (let i = 0; i < codeLines.length; i++) {
        line = codeLines[i];
        result.push(line);

        for (let j = 0; j < dataArr.length; j++) {
            currentTagData = dataArr[j];
            currentTag = currentTagData.Tag;
            currentData = currentTagData.Data;

            for (let k = 0; k < currentData.length; k++) {
                checkString = currentData[k];
                checkStrIsTag = isValidTag(checkString);
                //console.log(`checking string ${checkString} of tag ${currentTag} for line ${line}`);

                index = result[i].indexOf(checkString);
                while (index >= 0) {
                    endIndex = -1;

                    //By default we have index+1 so that we don't check the current index again
                    //but we don't want to advance too much since we might not take any actions
                    nextSearchStart = index + 1;

                    //If we cannot fit the current check string, we break
                    if (index <= result[i].length - checkString.length) endIndex = index + checkString.length - 1;
                    else break;

                    //if we have a tag before this and is NOT a closing tag, it means if must be for this segment, so we don't add any tags
                    if (index - tagLength - 2 >= 0 && result[i].charAt(index - 1) === ">" && result[i].charAt(index - tagLength - 2) !== "/") { }

                    //If the check string is a tag and we are at a tag (meaning we have < or </ on left and > on right)
                    //then we don't do anything
                    else if (checkStrIsTag && ((index > 0 && result[i].charAt(index - 1) === "<") ||
                        (index > 1 && result[i].length - 2 && result[i].substring(index - 2, index) === "</")) &&
                        index + tagLength - 1 < result[i].length - 1 && result[i].charAt(index + tagLength) === ">") { }
                    else {
                        //If we are at the start or the one prior is a space
                        const spaceBefore = index > 0 && result[i].substring(index - 1, index) === " ";
                        const startFree = index === 0 || spaceBefore || (index > 0 &&
                            HelperFunctions.isSpecialCharacter(result[i].charAt(index - 1)));

                        //If we are at the end or the next character is either a space or special character
                        const spaceAfter = endIndex < result[i].length - 1 && result[i].charAt(endIndex + 1) === " ";
                        const endFree = endIndex === result[i].length - 1 || spaceAfter || (endIndex < result[i].length - 1 &&
                            HelperFunctions.isSpecialCharacter(result[i].charAt(endIndex + 1)));

                        nextSearchStart = endIndex + 1;
                        if (startFree && endFree && result[i].substring(index, endIndex + 1) === checkString) {
                            let insertionStr = `<${currentTag}>`;
                            if (spaceBefore) insertionStr += " ";
                            insertionStr += checkString;
                            if (spaceAfter) insertionStr += " ";
                            insertionStr += `</${currentTag}>`;

                            result[i] = result[i].substring(0, index) + insertionStr + result[i].substring(endIndex + 1);

                            //We add to the not found tag index the amount of special chars added (5)
                            //and the 2 extra tags added
                            nextSearchStart += (5 + 2 * currentTag.length);
                        }
                    }

                    //if we were at the last index, we exit
                    if (nextSearchStart >= result[i].length) break;

                    //console.log(`next search start pos is ${nextSearchStart}`);
                    index = result[i].indexOf(checkString, nextSearchStart);
                    index = -1;
                }
            }
        }
    }
    return result;
}

function tryAddInferredTags(language, codeLines) {
    if (!autoAddFuncTag && !autoAddNumTag && !autoAddStrTag) return;

    const langData = getInferredTagsForLanguage(language);
    if (!langData) {
        console.error(`tried to get inferred tag data from lang ${language} but it was not found for language`);
        return;
    }

    let line = "";
    let result = [];

    let index = -1;
    let searchStartPos = 0;

    //Used for function tag
    let previousSpaceIndex = -1;

    //used for string tag
    let nextStringSymbolIndex = -1;

    //used for number tag
    let nextNonNumberIndex=-1;

    //Checks if the indices before have > and it is not a closing tag, it must be for this tag
    const isStartTagBefore = (currentLine) => {
        if (index - tagLength - 2 >= 0 && currentLine.charAt(index - 1) === ">" &&
            currentLine.charAt(index - tagLength - 2) !== "/") return true;
        else return false;
    }

    const getNextIndex = (property, currentLine, startPosIndex) => {
        const searchIndexStart = startPosIndex >= 0 ? startPosIndex : 0;
        if (autoAddStrTag && property === inferStringProperty && langData[inferStringProperty]) {
            return HelperFunctions.getIndexOfAny(currentLine, stringSymbols, searchIndexStart);
        }
        else if (autoAddFuncTag && property === inferFunctionProperty && langData[inferFunctionProperty]) {
            return currentLine.indexOf("(", searchIndexStart);
        }
        else if (autoAddNumTag && property === inferNumberProperty && langData[inferNumberProperty]) {
            return HelperFunctions.getIndexOfAny(currentLine, HelperFunctions.digitCharacters, searchIndexStart);
        }
        else{
            console.error(`tried to get next index for property ${property} for line ${currentLine} which is not a valid property!`);
            return -1;
        }
    }

    for (let i = 0; i < codeLines.length; i++) {
        line = codeLines[i];
        result.push(line);

        for (let property in langData) {
            if (!langData[property]){
                //console.log(`continuing because lang data ${langData[property]} is false`);
                continue;
            }

            searchStartPos=0;
            index = getNextIndex(property, result[i], searchStartPos);
            //console.log(`checking property ${property} for lang data ${HelperFunctions.objAsString(langData)} for line ${line} index ${index}`);
            while (index >= 0) {
                searchStartPos = index + 1;

                if (isStartTagBefore(result[i])) { }

                //When we find string symbol we try to find another one since strings are all
                //found in pairs and then we sorround that segment with tags and set the next index to past second string
                //we have to also consider strings in strings, so we have to find escape
                else if (autoAddStrTag && property === inferStringProperty) {
                    //console.log(`adding str tag`);
                    nextStringSymbolIndex = -1;
                    let nextStringIndex = HelperFunctions.getIndexOfAny(result[i], stringSymbols, index + 1);
                    //console.log(`next string ${nextStringIndex} when searching from ${index} at line ${result[i]} len: ${result[i].length}`);

                    //We search for the next string tag since they are found in pairs
                    //and break if we reach end or we if find one without a string in string escape
                    while (nextStringIndex >= 0) {
                        if (nextStringIndex > 0 && result[i].charAt(nextStringIndex - 1) !== stringInStringEscape) {
                            nextStringSymbolIndex = nextStringIndex;
                            break;
                        }

                        if (nextStringIndex + 1 >= result[i].length) {
                            break;
                        }
                        nextStringIndex = HelperFunctions.getIndexOfAny(currentLine, stringSymbols, nextStringIndex + 1);
                    }

                    if (nextStringSymbolIndex === -1) {
                        console.error(`tried to infer the string tag for string symbol from line ${line} ` +
                            `at index ${index} for langauge ${language} but it has no second string symbol pair!`);
                        return;
                    }
                    else {
                        result[i] = result[i].substring(0, index) + `<${stringTag}>` + result[i].substring(index, nextStringSymbolIndex + 1) +
                            `</${stringTag}>`+ result[i].substring(nextStringSymbolIndex + 1);

                        //1 for going to the next index after last one and 5 for <> and </>
                        searchStartPos = nextStringSymbolIndex + 6+ 2*stringTag.length;
                    }
                }

                //when we find ( symbol we look back until we find a space or start of line
                //so we can extract the area for function name and use it to be sorrounded
                else if (autoAddFuncTag && property === inferFunctionProperty) {

                    //If we have a closing tag before the parenthesis it means the area that would be a func
                    //is overriden with a custom tag, so we don't do anything
                    if (index-tagLength-2>=0 && result[i].charAt(index-1)===">" && (result[i].charAt(index-tagLength-2)==="<" || 
                    (index-tagLength-3>=0 && result[i].substring(index-tagLength-3, index-tagLength-1)==="</"))){}
                    else{
                        //console.log(`adding func tag`);
                        previousSpaceIndex = -1;
                        for (let j = index - 1; j >= 0; j--) {
                            //Functions can be called by themselves or they can be used on another variable
                            if (result[i].charAt(j) === " " || result[i].charAt(j)===".") {
                                previousSpaceIndex = j;
                                break;
                            }
                        }
                        if (index == 0 || previousSpaceIndex >= 0) {
                            result[i] = result[i].substring(0, previousSpaceIndex+1) + `<${functionTag}>` +
                                result[i].substring(previousSpaceIndex+1, index) + `</${functionTag}>` + result[i].substring(index);
    
                            //5 for <> and </> for tag length added
                            searchStartPos += (5 + 2 * functionTag.length);
                        }
                        else {
                            console.warn(`found a ( for a function when inferring tags for langauge ${language}` +
                                `at index ${index} for line ${line} but found no space before for function or start of line!`);
                        }
                    }
                }

                //When we find a number, we keep looking forward until we no longer have a number
                //and then we exit and sorround that whole area with the number tag
                else if (autoAddNumTag && property === inferNumberProperty) {

                    //If this number belongs to a tab tag, we don't do anything
                    //Note: we need to check index-len-1 and not idx-len since we need extra 1 to check if it has valid start/end tag part
                    if (index-tabTag.length-1>=0 && index<result[i].length-1 && result[i].charAt(index+1)===">" && 
                        result[i].substring(index-tabTag.length, index)===tabTag && 
                        (result[i].charAt(index-tabTag.length-1)==="/" || result[i].charAt(index-tabTag.length-1)==="<")) {}
                    else{
                        //console.log(`adding num tag`);
                        for (let j = index + 1; j < result[i].length; j++) {
                            if (!HelperFunctions.isNumber(result[i].charAt(j))) {
                                nextNonNumberIndex=j;
                                break;
                            }
                        }
                        result[i] = result[i].substring(0, index) + `<${numberTag}>` +
                            result[i].substring(index, nextNonNumberIndex) + `</${numberTag}>` + result[i].substring(nextNonNumberIndex);
    
                        //5 for <> and </> and for tag length added
                        searchStartPos += (5 + 2 * numberTag.length);
                    }   
                }
                else{
                    console.error(`tried to add inferred tag to language ${language} line ${line} at property ${property} `+
                        `but it does not match any auto add tag property!`);
                }

                //If we go past line, we don't search anymore
                if (searchStartPos >= result[i].length) {
                    break;
                }

                index = getNextIndex(property, result[i], searchStartPos);
            }
        }
    }
    return result;
}

/**
 * @param {String[]} strings 
 * @returns {String[]}
 */
export function tryAddTagToSymbols(strings) {
    const symbols = HelperFunctions.specialCharacters;
    const startTag = `<${defaultTag}>`;
    const endTag = `</${defaultTag}>`;

    let line = "";
    let symbolIndices = [];
    let index = -1;
    let result = [];

    for (let i = 0; i < strings.length; i++) {
        line = strings[i];
        result.push(line);

        for (let j = 0; j < symbols.length; j++) {
            if (symbols[j] === ">" || symbols[j] === "<" || symbols[j] == "\"") continue;
            //symbolIndices= HelperFunctions.getIndicesOfString(line, symbols[j]);

            index = result[i].indexOf(symbols[j]);
            while (index >= 0) {
                //If we already have a tag whether before or after, we don't do anything
                // if ((index>0 && result[i][index-1]===">") || (index<result[i].length-1 
                //     && result[i][index+1]==="<")){}

                //If we have enclosing tags around this symbol (and we are sure it is for this symbol)
                //then we can not do anything for it to not override it
                if (index > 0 && result[i][index - 1] === ">" && index < result[i].length - 2 &&
                    result[i].substring(index + 1, index + 3) === "</") { }

                //If we have a tag on the left that is not closing (meaning it is for this symbol)
                //and the next is another symbol it means we can not do anything since
                //the tag might encompass more than 1 symbol
                else if (index - tagLength - 2 >= 0 && result[i][index - 1] === ">" && result[i][index - tagLength - 2] !== "/"
                    && index < result[i].length - 1 && HelperFunctions.isSpecialCharacter(result[i][index + 1], ["<", ">"])) { }

                //Same condition as the one above, just considering the symbl on the left and end tag on right
                else if (index > 0 && HelperFunctions.isSpecialCharacter(result[i][index - 1], ["<", ">"]) &&
                    index < result[i].length - 2 && result[i].substring(index + 1, index + 3) === "</") { }

                //If we are just an end tag symbol we also dont do anything
                else if (symbols[j] === "/" && index > 0 && result[i][index - 1] === "<") { }
                else {
                    result[i] = result[i].substring(0, index) + startTag +
                        result[i].substring(index, index + 1) + endTag + result[i].substring(index + 1);
                }

                //If we are at last index in the current line, we don't look anymore
                if (index >= result[i].length - 1) break;

                //Otherwise we find the next index, which we have to also add
                //the additional amount of indices to compensate for adding the tag
                //and then obviously +1 to not include the symbol we just found
                index = result[i].indexOf(symbols[j], index + startTag.length + 1);
            }

            // for (let k=0; k<symbolIndices.length; k++){
            //     index= symbolIndices[k];

            //     //If we already have a tag, we don't do anything
            //     if (index>0 && result[i][index-1]===">" && index<result[i].length-1 
            //         && result[i][index+1]==="<") continue;

            //     //If we are just an end tag symbol we also dont do anything
            //     else if (symbols[j]==="/" && index>0 && result[i][index-1]==="<")continue;

            //     result[i]= result[i].substring(0, index)+ startTag+ 
            //         result[i].substring(index, index+1) +endTag+ result[i].substring(index+1);
            // }
        }
        //result[i]= HelperFunctions.replaceAll(result[i], `</${defaultTag}><${defaultTag}>`, "");
    }
    return result;
}

/**
 * @param {String} string 
 * @returns {Number}
 */
export function getCSSClassIfHasTab(string) {

    const index = string.indexOf(`<${tabTag}`);
    if (index >= 0) {
        const nextChar = string.charAt(index + tabTag.length + 1);
        let tabString = "";
        if (nextChar === ">") {
            tabString = string.substring(index + 1, index + 1 + tabTag.length);
        }
        else {
            tabString = string.substring(index + 1, index + 2 + tabTag.length);
        }
        return getCSSClassFromTag(tabString);
    }
    else return "";
}

function getCSSClassFromTag(tag) {
    switch (tag) {
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
        case numberTag:
            return "code-number";
        case commentTag:
            return "code-comment";
        case tabTag:
            return "code-tab-space";
        case tabTag + "2":
            return "code-2-tab-space";
        case tabTag + "3":
            return "code-3-tab-space";
        default:
            console.error(`Tried to retrieve CSS class from tag ${tag} but it has no corresponding class!`);
            break;
    }
}

export class CodeHtmlData {
    #taggedCode = [];
    #linesText;
    #htmlLines;
    #html = "";
    #lineAppearOrder;

    /**
     * @param {String[]} taggedCode - the default styled tag code before any html conversion is applied 
     * @param {String[]} linesText - just the text (no tags) of each line in program structure
     * @param {String} html - the full html in program structure
     * @param {String[]} htmlLines - each lines's html in program structure
     * @param {Number[][]} appearOrder - the line(s) that should appear
     */
    constructor(taggedCode, linesText, html, htmlLines, appearOrder) {
        this.#taggedCode = taggedCode;
        this.#linesText = linesText;
        this.#html = html;
        this.#htmlLines = htmlLines;
        this.#lineAppearOrder = appearOrder;
    }

    /**
     * @returns {string[]}
     */
    getTaggedCode() {
        return this.#taggedCode;
    }

    /**
     * @returns {string[]}
     */
    getLines() {
        return this.#linesText;
    }

    /**
     * @returns {string}
     */
    getHtml() {
        return this.#html;
    }

    /**
     * @returns {String[]}
     */
    getHtmlLines() {
        return this.#htmlLines;
    }

    /**
     * @returns {Number[][]}
     */
    getAppearOrder() {
        return this.#lineAppearOrder;
    }
}

/**
 * @param {String} id 
 * @param {String[]} strings
 * @returns {Boolean}
 */
export function codeStylesPassesTests(id, strings) {

    let instancesOfTabTag = [];
    let tagIndices = [];
    let line = "";

    const failTest = (lineIdx, reason) => {
        console.error(`Tried to validate the code style str with id ${id} ` +
            `but line ${strings[lineIdx]} @idx ${lineIdx} failed. Reason: ${reason}`);
    }

    for (let i = 0; i < strings.length; i++) {
        line = strings[i];

        //CORRECT TAG SYNTAX TEST
        tagIndices = HelperFunctions.getIndicesOfString(line, `<`);
        let tagIndex = -1;
        let tagSubstring = "";
        let isEndTag = false;
        for (let j = 0; j < tagIndices.length; j++) {
            tagIndex = tagIndices[j];
            if (tagIndex + 1 < line.length && line[tagIndex + 1] === "/") {
                isEndTag = true;
            }

            tagIndex += tagLength + 1;
            if (isEndTag) tagIndex++;

            if (tagIndex < line.length && line[tagIndex] === ">") {
                if (isEndTag) tagIndex = tagIndices[j] + 2;
                else tagIndex = tagIndices[j] + 1;

                tagSubstring = line.substring(tagIndex, tagIndex + tagLength);
                //console.log(`checking tag substring: ${tagSubstring}`);

                if (!isValidTag(tagSubstring)) {
                    failTest(i, `Found tag that does not exist: ${tagSubstring}`);
                    return false;
                }
            }
        }

        //CHECK FOR START AND CLOSING TAGS
        let allTagIndices = [];
        for (let j = 0; j < allTags.length; j++) {

            //New line tag does not need closing tag
            if (allTags[j] == newLineTag) continue;

            allTagIndices = HelperFunctions.getIndicesOfString(line, `${allTags[j]}>`);
            if (allTagIndices && allTagIndices.length !== 0 && allTagIndices.length % 2 !== 0) {
                failTest(i, `Found tag that either has no closing or start tag: ${allTags[j]}`);
                return false;
            }
        }

        instancesOfTabTag = HelperFunctions.getIndicesOfString(line, `<${tabTag}`);
        if (instancesOfTabTag.length > 1) {
            failTest(i, "More than one tab tag per line is not allowed");
            return false;
        }
        else if (instancesOfTabTag.length == 0) continue;

        const index = instancesOfTabTag[0];
        if (index !== 0) {
            failTest(i, "Tab tags must start at index 0 of line");
            return false;
        }

        //If we can't get after it, it might be a multi tab tag so we move up one more
        let charAfterTag = line.charAt(index + tabTag.length + 2);
        if (charAfterTag === ">") charAfterTag = line.charAt(index + tabTag.length + 3);

        if (charAfterTag !== "<" && !(defaultKeywordTag ||
            (HelperFunctions.isSpecialCharacter(charAfterTag) && autoAddDefToSymbols))) {
            failTest(i, "Tab tags must be followed by another tag");
            return false;
        }
    }
    return true;
}

/**
 * @param {CodeData} data 
 * @returns {CodeHtmlData}
 */
export function getHtmlFromCodeData(data) {
    let code = data.getCode();
    const codeLanguage = data.getLang();
    const codeBefore = code;

    if (autoAddDefToSymbols) {
        code = tryAddTagToSymbols(code);
        //console.log(`DEF TAG BEFORE: ${codeBefore} AFTER ${code}`);
    }
    if (autoAddLangTagData) {
        code = tryAddCodeTags(codeLanguage, code);
        //console.log(`LANG TAG BEFORE: ${codeBefore} AFTER ${code}`);
    }
    if (autoAddFuncTag || autoAddNumTag || autoAddStrTag) {
        code= tryAddInferredTags(codeLanguage, code);
        //console.log(`INFER TAG BEFORE: ${codeBefore} AFTER ${code}`);
    }

    let html = "";
    let currentTag = null;

    let lines = [];
    let linesText = [];

    let currentLine = "";
    let currentLineText = "";

    let emptyTagHtml = "";
    let foundTabTag = "";

    for (let i = 0; i < code.length; i++) {
        const fullLine = code[i];
        for (let j = 0; j < fullLine.length; j++) {
            const c = fullLine.charAt(j);
            if (c === "<" && j + 1 < fullLine.length && fullLine.charAt(j + 1) !== lessThanEscape) {
                //If we are at closing tag, we can skip to the next text (since we know it has to be
                //of the form </TAG>) so we have to do / + tag length + > and next space
                if (fullLine[j + 1] === "/") {
                    j += currentTag.length + 2;
                    currentTag = "";
                    currentLine += `</${codeTokenTag}}>`;

                    emptyTagHtml = "";
                }

                //Otherwise we are an opening tag, so we get the current tag and then we
                //increase to next character past tag so tag + > and next space
                else {

                    //If we have no tag and we are not at 0 it means we have found a new open tag
                    //when the old did not have any, so we can assume it was filled with no tag option, so we close it
                    if (j != 0 && !currentTag && emptyTagHtml) {
                        currentLine += `</${codeTokenTag}}>`;
                        emptyTagHtml = "";
                    }

                    //If we encounter a tab
                    foundTabTag = "";
                    const endTabIndex = j + tabTag.length;
                    const singleTab = fullLine.substring(endTabIndex + 1, endTabIndex + 2) === ">";
                    const multiTab = fullLine.substring(endTabIndex + 2, endTabIndex + 3) === ">";
                    if (fullLine.substring(j + 1, endTabIndex + 1) === tabTag && (singleTab || multiTab)) {

                        if (singleTab) {
                            foundTabTag = fullLine.substring(j + 1, endTabIndex + 1);
                        }
                        else {
                            foundTabTag = fullLine.substring(j + 1, endTabIndex + 2);
                        }
                        j += foundTabTag.length + 2;

                        if (j >= fullLine.length) {
                            console.error(`tried to parse a tab tag in code style with id ${data.getId()} ` +
                                `but it occured at the end of a line which is not allowed!`);
                            return;
                        }
                        else if (fullLine.charAt(j) === " ") {
                            console.error(`tried to parse a tab tag in code style with id ${data.getId()} ` +
                                `but it has an empty space after the tag which is not allowed!`);
                            return;
                        }
                        else if (fullLine.charAt(j) !== "<" && !defaultKeywordTag) {
                            console.error(`tried to parse a tab tag in code style with id ${data.getId()} ` +
                                `but it does not have a tag after it which is not allowed!`);
                            return;
                        }
                    }

                    //If after tab checking we encounter another tag can we check for it 
                    //ONLY IF IT IS NOT A GREATER THAN SYMBOL BY ITSELF

                    //j < fullLine.length - 1 && fullLine.charAt(j + 1) !== " "
                    if (fullLine.charAt(j) === "<") {
                        if (j < fullLine.length - 1 && fullLine.charAt(j + 1) === " ") {
                            currentTag = "";
                            continue;
                        }

                        currentTag = fullLine.substring(j + 1, j + 1 + tagLength);
                        //if (j < fullLine.length - 1) console.log(`At line ${i} index ${j} after tag ${currentTag}: ${fullLine[j + 1]} space: ${fullLine.charAt(j + 1) === " "}`);
                        //console.log(`CURRENT TAG found tag: ${currentTag} on line ${i} index: ${j}`);
                        j += tagLength + 1;
                    }

                    //To prevent issues, we don't want to use no tag for the 
                    //remaining operations so we continue
                    else {
                        j--;
                        currentTag = "";
                        continue;
                    }

                    if (currentTag === newLineTag) {
                        currentLine += `<${codeTokenTag} class=\"code-new-line\"></${codeTokenTag}>`;
                        html += currentLine;
                    }
                    else if (!currentTag) {
                        console.error(`At index ${j} of line ${i} for code data with id ` +
                            `${data.getId()} there is empty current tag! Current line: ${currentLine}`);
                        return;
                    }
                    else {
                        let cssClasses = getCSSClassFromTag(currentTag);
                        if (foundTabTag) cssClasses = getCSSClassFromTag(foundTabTag) + " " + cssClasses;
                        currentLine += `<${codeTokenTag} class=\"inline ${cssClasses} code-display-font\">`;
                        foundTabTag = "";
                    }
                }
            }
            else {
                //If we don't have a tag and we either are at 0 or have empty tag, it means we are starting 
                //a new empty tag html line so we start a html tag and add the character
                if (noTagFoundTag && !currentTag && (!emptyTagHtml || j == 0)) {
                    let classes = getCSSClassFromTag(noTagFoundTag);
                    if (foundTabTag) classes = getCSSClassFromTag(foundTabTag) + " " + classes;
                    emptyTagHtml += `<${codeTokenTag} class=\"inline ${classes} code-display-font\">`;
                    currentLine += emptyTagHtml;
                    foundTabTag = "";
                }

                //We want the empty tag character to be added to the empty tag html, so we 
                //can't just use this for both and only if it does have a tag
                currentLine += c;
                currentLineText += c;
            }
        }

        //If we end and still have empty tag html it means we have ended on empty tag
        //so we must finish the empty tag html statement and also reset html
        if (emptyTagHtml) currentLine += `</${codeTokenTag}>`;
        emptyTagHtml = "";

        //We add a new line at the end no matter what
        currentLine += `<${codeTokenTag} class=\"code-new-line\"></${codeTokenTag}>`;

        lines.push(currentLine);
        html += currentLine;
        currentLine = "";

        linesText.push(currentLineText);
        currentLineText = "";
    }

    //console.log(`HTML: ${html}    CODE STYLED: ${code}     BEFORE: ${data.getCode()}`);
    return new CodeHtmlData(code, linesText, html, lines, data.getLineOrder());
}

/**
 * @param {LanguageData} targetLanguage 
 * @param {LanguageData[]} guessedLanguages
 * @returns {String}
 */
export function getHtmlFromLanguageData(targetLanguage, guessedLanguages, includeTableTag) {
    const rows = 7;
    let html = "";
    if (includeTableTag) {
        html += `<table class="body-text code-comment">`;
    }

    const headerRowElement = `<tr>
                                <th>Language</th>
                                <th>Release</th>
                                <th><a class= "code-comment" href="https://www.geeksforgeeks.org/introduction-of-programming-paradigms/" 
                                        target="_blank">Paradigm</a></th>
                                <th><a class= "code-comment" href="https://www.geeksforgeeks.org/difference-between-compiled-and-interpreted-language/" 
                                        target="_blank">Compilation</a></th>
                                <th><a class= "code-comment" href="https://www.geeksforgeeks.org/what-is-a-typed-language/" 
                                        target="_blank">Typed</a></th>
                                <th>Syntax</th>
                                <th>Use</th>
                            </tr>`;
    html += headerRowElement;

    //If we don't have data, we can just exit after header row
    if (!guessedLanguages || guessedLanguages.length <= 0 || !targetLanguage) {
        html += `</table>`;
        return html;
    }

    const correctClass = "table-correct";
    const halfCorrectClass = "table-half-correct";
    const wrongClass = "table-wrong";

    for (let i = 0; i < guessedLanguages.length; i++) {
        let mainRowHtml = `<tr> `;
        let guessedLanguage = guessedLanguages[i];

        //LANGUAGE
        const sameLanguage = targetLanguage.getLang() === guessedLanguage.getLang();
        mainRowHtml += `<td class= "${sameLanguage ? correctClass : wrongClass}"> ${guessedLanguage.getLang()}</td >`;

        //RELEASE YEAR
        const targetYear = targetLanguage.getReleaseYear();
        const guessedYear = guessedLanguage.getReleaseYear();
        const dirIcon = guessedYear < targetYear ? "▲" : "▼";
        const sameYear = targetYear === guessedYear;
        mainRowHtml += `<td class= "${sameYear ? correctClass : wrongClass}">` +
            `${guessedLanguage.getReleaseYear()}${sameYear ? "" : dirIcon}</td >`;

        //PARADIGM
        let paradigmClass = "";
        if (targetLanguage.getParadigm() === guessedLanguage.getParadigm()) {
            paradigmClass = correctClass;
        }
        else if (targetLanguage.hasParadigm(guessedLanguage.getParadigm())) {
            paradigmClass = halfCorrectClass;
        }
        else {
            paradigmClass = wrongClass;
        }
        const paradigm = guessedLanguage.getParadigm();
        mainRowHtml += `<td class="${paradigmClass}">${HelperFunctions.flagEnumToString(LanguageParadigm, paradigm)}</td>`;

        //COMPILATION TYPE
        const compilationType = targetLanguage.getCompilationType() === guessedLanguage.getCompilationType();
        mainRowHtml += `<td class="${compilationType ? correctClass : wrongClass}">${guessedLanguage.getCompilationType()}</td>`;

        //LANGUAGE TYPING
        let typingClass = "";
        if (targetLanguage.getTypedType() === guessedLanguage.getTypedType()) {
            typingClass = correctClass;
        }
        else if (targetLanguage.hasTyped(guessedLanguage.getTypedType())) {
            typingClass = halfCorrectClass;
        }
        else {
            typingClass = wrongClass;
        }
        const typed = guessedLanguage.getTypedType();
        mainRowHtml += `<td class="${typingClass}">${HelperFunctions.flagEnumToString(LanguageTyping, typed)}</td>`;

        //SYNTAX TYPE
        const syntaxType = targetLanguage.getSyntax() === guessedLanguage.getSyntax();
        mainRowHtml += `<td class="${syntaxType ? correctClass : wrongClass}">${guessedLanguage.getSyntax()}</td>`;

        //LANGUAGE USE
        let useClass = "";
        if (targetLanguage.getUse() === guessedLanguage.getUse()) {
            useClass = correctClass;
        }
        else if (targetLanguage.hasUse(guessedLanguage.getUse())) {
            useClass = halfCorrectClass;
        }
        else {
            useClass = wrongClass;
        }
        const use = guessedLanguage.getUse();
        mainRowHtml += `<td class="${useClass}">${HelperFunctions.flagEnumToString(LanguageUse, use)}</td>`;
        mainRowHtml += `</tr>`;

        html += mainRowHtml;
    }

    if (includeTableTag) html += `</table`;
    return html;
}


