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

//new line is the only tag that does not need a closing pair of tag
const newLineTag = "new";

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
        default:
            console.error(`Tried to retrieve CSS class from tag ${tag} but it has no corresponding class!`);
            break;
    }
}

export class CodeHtmlData {
    #linesText;
    #htmlLines = "";
    #html = "";
    #lineAppearOrder;

    /**
     * @param {String[]} linesText - just the text (no tags) of each line in program structure
     * @param {String} html - the full html in program structure
     * @param {String[]} htmlLines - each lines's html in program structure
     * @param {Number[][]} appearOrder - the line(s) that should appear
     */
    constructor(linesText, html, htmlLines, appearOrder) {
        this.#linesText = linesText;
        this.#html = html;
        this.#htmlLines = htmlLines;
        this.#lineAppearOrder = appearOrder;
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
 * @param {CodeData} data 
 * @returns {CodeHtmlData}
 */
export function getHtmlFromCodeData(data) {
    const code = data.getCode();
    let html = "";
    let currentTag = null;

    let lines = [];
    let linesText = [];

    let currentLine = "";
    let currentLineText = "";

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
                }

                //Otherwise we are an opening tag, so we get the current tag and then we
                //increase to next character past tag so tag + > and next space
                else {
                    currentTag = fullLine.substring(j + 1, j + 1 + tagLength);
                    j += tagLength + 1;

                    if (currentTag === newLineTag && j) {
                        currentLine += "<p class=\"code-new-line\"></p>";

                        //lines.push(currentLine);
                        //linesText.push(currentLineText);

                        html += currentLine;
                        //currentLine="";
                        //currentLineText="";
                    }
                    else {
                        currentLine += `<p class=\"inline ${getCSSClassFromTag(currentTag)}\">`;
                    }
                }
            }
            else {
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

    return new CodeHtmlData(linesText, html, lines, data.getLineOrder());
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

    console.log(`html conversion for ${guessedLanguages.length}`);
    const correctClass="table-correct";
    const halfCorrectClass="table-half-correct";
    const wrongClass="table-wrong";

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
        console.log(`guessing lang with target paradigm:${targetLanguage.getParadigm()} and guessed ${guessedLanguage.getParadigm()} `);
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
        console.log(`main row html: ${mainRowHtml} total: ${html}`);
    }

    if (includeTableTag) html += `</table`;
    console.log(`result html: ${html}`);
    return html;
}

