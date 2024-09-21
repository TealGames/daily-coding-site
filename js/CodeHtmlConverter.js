import { CodeData, LanguageData, LanguageParadigm, LanguageTyping, LanguageUse } from "./DailyCodeData.js";
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
const commentTag = "cmt";
const allTags = [defaultTag, defaultKeywordTag, specialKeywordTag, variableTag,
    functionTag, objectTag, enumTag, stringTag, commentTag];

//new line is the only tag that does not need a closing pair of tag
const newLineTag = "new";
//adds the set amount of tabs (if t2 then 2 tabs are added)
const tabTag = "t";

//tab tags must be first index in line
const tabTagOnlyAtStart = true;
//one lined symbols will auto get the def tag
const autoAddDefToSymbols = false;

const noTagFoundTag = defaultTag;

class CodeWordTags {
    #tagName;
    #keywords;

    /**
     * @param {String} tagName 
     * @param {String[]} keywords 
     */
    constructor(tagName, keywords) {
        this.#tagName = tagName;
        this.#keywords = keywords;
    }

    /**
     * @returns {String}
     */
    getTagName() {
        return this.#tagName;
    }

    /**
     * @returns {String[]}
     */
    getKeywords() {
        return this.#keywords;
    }
}

const codeWordTags =
    [new CodeWordTags(specialKeywordTag, ["if"])];

/**
 * @param {String} code 
 * @returns {String}
 */
function tryAddCodeTags(code) {
    let taggedCode = "";

    const tryAddTag = (index) => {
        let keyword = "";
        let keywordEndIndex;
        let codeTagData = null;

        for (let i = 0; i < codeWordTags.length; i++) {
            codeTagData = codeWordTags[i];

            for (let j = 0; j < codeTagData.getKeywords().length; j++) {

                keyword = codeTagData.getKeywords()[j];
                keywordEndIndex = index + keyword.length - 1;

                //if we go past the length, we can't do anything
                if (keywordEndIndex >= code.length) continue;

                const codeStr = code.substring(index, keywordEndIndex + 1);
                keyword = keyword.toLowerCase();

                //If the next character is not a special one or a space
                //it means it must be a normal character, so we don't transform
                //it since it could be part of a variable name for example
                if (keywordEndIndex + 1 < code.length) {
                    const nextCode = code.substring(keywordEndIndex + 1, keywordEndIndex + 2);

                    if (nextCode !== " " && !HelperFunctions.isSpecialCharacter(nextCode)) {
                        continue;
                    }
                }

                if (codeStr.toLowerCase() === keyword) {

                    const tag = codeTagData.getTagName();
                    code = code.substring(0, index) + `<${tag}>` + codeStr + `</${tag}>`
                        + code.substring(keywordEndIndex);
                    return;
                }
            }
        }
    }

    for (let i = 0; i < code.length; i++) {
        tryAddTag(i);
    }
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
                else if (index >= index - tagLength - 2 && result[i][index - 1] === ">" && result[i][index - tagLength - 2] !== "/"
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
        case commentTag:
            return "code-comment";
        case tabTag:
            return "code-tab-space";
        case tabTag + "2":
            return "code-2-tab-space";
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
                console.log(`checking tag substring: ${tagSubstring}`);
                if (!HelperFunctions.arrayContains(allTags, tagSubstring)) {
                    failTest(i, `Found tag that does not exist: ${tagSubstring}`);
                    return false;
                }
            }
        }

        let allTagIndices = [];
        for (let j = 0; j < allTags.length; j++) {
            allTagIndices = HelperFunctions.getIndicesOfString(line, `${allTags[j]}>`);
            if (allTagIndices && allTagIndices.length !== 0 && allTagIndices.length % 2 !== 0) {
                failTest(i, `Found tag that either has no closing or start tag: ${allTags[j]}`);
                return false;
            }
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
    if (autoAddDefToSymbols){
        const codeBefore= code;
        code= tryAddTagToSymbols(code);
        //console.log(`BEFORE def tag: ${codeBefore}       AFTER: ${code}`);
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
            if (c === "<" && j + 1 < fullLine.length) {
                //If we are at closing tag, we can skip to the next text (since we know it has to be
                //of the form </TAG>) so we have to do / + tag length + > and next space
                if (fullLine[j + 1] === "/") {
                    j += currentTag.length + 2;
                    currentTag = "";
                    currentLine += "</p>";

                    emptyTagHtml = "";
                }

                //Otherwise we are an opening tag, so we get the current tag and then we
                //increase to next character past tag so tag + > and next space
                else {

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

                    //If after tab tag we encounter another tag can we check for it
                    if (fullLine.charAt(j) === "<") {
                        currentTag = fullLine.substring(j + 1, j + 1 + tagLength);
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
                        currentLine += "<p class=\"code-new-line\"></p>";
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
                        currentLine += `<p class=\"inline ${cssClasses}\">`;
                        foundTabTag = "";
                    }
                }
            }
            else {
                if (noTagFoundTag && !currentTag) {
                    let classes = getCSSClassFromTag(noTagFoundTag);
                    if (foundTabTag) classes = getCSSClassFromTag(foundTabTag) + " " + classes;
                    currentLine += `<p class=\"inline ${classes}\">`;
                    foundTabTag = "";
                }

                currentLine += c;
                currentLineText += c;
            }
        }

        //If we still have a line at the end not cleared (meaning we did not end on END tag)
        //we then add it here
        //if (currentLine) lines.push(currentLine);
        //if (currentLineText) linesText.push(currentLineText);

        //We add a new line at the end no matter what
        currentLine += "<p class=\"code-new-line\"></p>";

        lines.push(currentLine);
        currentLine = "";
        linesText.push(currentLineText);
        currentLineText = "";
    }

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


