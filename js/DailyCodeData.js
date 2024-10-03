import { HelperFunctions } from "./HelperFunctions.js";
import { validateCodeDataJSON, validateLanguageDataJSON, validateTableDataJSON } from "./JsonValidator.js";

const getCodeRandomly = true;
const useJson = true;
const codingLanguagesJson = "./data/Languages.json";
const languageDataJsonPath = "./data/LanguageData.json";
const tableDataJsonPath = "./data/TableData.json";
const codeDataJsonPath = "./data/CodeData.json";

let langaugeData = [];
let dailyTable = [];
let dailyCode = [];

const todayForcedCodeId = -1;

//Set the forced queued ids to make the code data appear in the order of the queue
const queuedForcedId= [];
//1, 2, 3, 51, 52, 53, 54, 101, 102, 103, 151, 152, 153, 201, 202, 203
let queuedIds=[];

export const maxCodeIdLength = 4;

export const CodingLanguage = {}
export const codingLanguages = [];

export class CodeData {
    #id;
    #day;
    #codeLines;
    #lang;
    #lineAppearOrder;
    #addTags;

    static OVERRIDE_TAG_ADDING_PROPERTY= "OverrideTagAdding";

    /**
     * @param {String} id
     * @param {Date} day - day's code
     * @param {string[]} codeLines - the code for the day
     * @param {String} lang - language
     * @param {Number[][]} lineAppearOrder - order lines appear (as indices)
     * @param {Boolean} addTags 
     */
    constructor(id, day, lang, codeLines, lineAppearOrder, addTags) {
        this.#id = id;
        this.#day = day;
        this.#codeLines = codeLines;
        this.#lang = lang;
        this.#lineAppearOrder = lineAppearOrder;
        this.#addTags= addTags;
    }

    /**
     * @returns {Number}
     */
    getId() {
        return this.#id;
    }

    /**
     * Returns a deep copy of the date set 
     * (to prevent accidental setting of this time object properties)
     * @returns {Date}
     */
    getDay() {
        return HelperFunctions.deepCopyDate(this.#day);
    }

    /**
     * @returns {String}
     */
    getLang() {
        return this.#lang;
    }

    /**
     * @returns {string[]}
     */
    getCode() {
        return this.#codeLines;
    }

    /**
     * @returns {Number[][]}
     */
    getLineOrder() {
        return this.#lineAppearOrder;
    }
    
    /**
     * @returns {Boolean}
     */
    getAddTags(){
        return this.#addTags;
    }
}

/**
 * @param {Object} collection 
 * @returns {Object}
 */
function getTodaysDataUTC(collection) {
    if (getCodeRandomly) {
        const randomIndex = Math.floor(Math.random() * collection.length);
        return collection[randomIndex];
    }

    const todayLocal = new Date();
    const todayUTC = HelperFunctions.convertToUTC(todayLocal);

    for (let i = 0; i < collection.length; i++) {

        //We set the day to check time to the target day so that hour differences
        //between get time and current time don't mess up the UTC conversion 
        //(since if it is great enough, it could change to next day)
        //we also do it from the local time since doing it from UTC time will result in wrong time when doing UTC again
        const dayToCheck = collection[i].getDay();
        dayToCheck.setHours(todayLocal.getHours());
        dayToCheck.setMinutes(todayLocal.getMinutes());
        dayToCheck.setSeconds(todayLocal.getSeconds());
        dayToCheck.setMilliseconds(todayLocal.getMilliseconds());
        const utcTime = HelperFunctions.convertToUTC(dayToCheck);

        //console.log(`testing day ${todayUTC} with ${utcTime} (or: ${collection[i].getDay()}) ${HelperFunctions.isSameDay(todayUTC, utcTime)}`);
        if (HelperFunctions.isSameDay(todayUTC, utcTime)) {
            return collection[i];
        }
    }
}

/**
* @returns {CodeData}
*/
export function getTodaysCodeDataUTC() {
    if (todayForcedCodeId >= 0) return getCodeDataFromId(todayForcedCodeId);
    else if (queuedForcedId && queuedForcedId.length>0 && queuedIds && queuedIds.length>0){
        return getCodeDataFromId(queuedIds.shift());
    }

    return getTodaysDataUTC(dailyCode);
}


export const LanguageParadigm = Object.freeze({
    "Declarative": 1 << 0,
    "Functional": 1 << 1,
    "Object-Oriented": 1 << 2,
    "Procedural": 1 << 3,
    "Structural": 1 << 4,
});

export const CompilationType = Object.freeze({
    "Compiled": "Compiled",
    "Interpreted": "Interpreted",
    "Compiled or Interpreted": "Compiled or Interpreted",
    "Other": "Other",
});

/*
Weak type: can easily be converted via implicit conversions
Dyamic type: types are resolved during runtime
*/
export const LanguageTyping = Object.freeze({
    "Weak": 1 << 0,
    "Strong": 1 << 1,
    "Dynamic": 1 << 2,
    "Static": 1 << 3,
    "Other": 1 << 4,
});

export const LanguageUse = Object.freeze({
    "Web": 1 << 0,
    "Server": 1 << 1,
    "Scripting": 1 << 2,
    "Applications": 1 << 3,
    "Systems": 1 << 4,
    "Game Development": 1 << 5,
    "AI": 1 << 6,
    "Database": 1 << 7,
    "Esoteric": 1 << 8,
    "Science": 1 << 9,
});

export const LanguageSyntax = Object.freeze({
    "C-like": "C-like",
    "ALGOL-like": "ALGOL-like",
    "Fortran-like": "Fortran-like",
    "Perl-like": "Perl-like",
    "Lisp-like": "Lisp-like",
    "Assembly-like": "Assembly-like",
    "XML-like": "XML-like",
});

export class TableData {
    #day;
    #lang;

    /**
     * @param {Date} day - day's code
     * @param {String} lang - language
     */
    constructor(day, lang) {
        this.#day = day;
        this.#lang = lang;
    }

    /**
     * Returns a deep copy of the date set 
     * (to prevent accidental setting of this time object properties)
     * @returns {Date}
     */
    getDay() {
        return HelperFunctions.deepCopyDate(this.#day);
    }

    /**
     * @returns {String}
     */
    getLang() {
        return this.#lang;
    }
}

export class LanguageData {
    #lang;
    #aliases;
    #releaseYear;
    #paradigm;
    #compilationType;
    #typed;
    #syntax;
    #use;

    /**
     * @param {String} lang - language
     * @param {String[]} aliases - aliases
     * @param {Number} releaseYear - release year
     * @param {LanguageParadigm} paradigm - paradigm
     * @param {CompilationType} compilation - compilation
     * @param {LanguageTyping} typed - typed
     * @param {LanguageSyntax} syntax - syntax
     * @param {LanguageUse} languageUse - use
     */
    constructor(lang, aliases, releaseYear, paradigm, compilation, typed, syntax, languageUse) {
        this.#lang = lang;
        this.#aliases = aliases;
        this.#releaseYear = releaseYear;
        this.#paradigm = paradigm;
        this.#compilationType = compilation;
        this.#typed = typed;
        this.#syntax = syntax;
        this.#use = languageUse;
    }

    /**
     * @returns {String}
     */
    getLang() {
        return this.#lang;
    }

    /**
     * @returns {String[]}
     */
    getAliases() {
        return this.#aliases;
    }

    /**
     * @returns {Number}
     */
    getReleaseYear() {
        return this.#releaseYear;
    }

    /**
     * @returns {LanguageParadigm}
     */
    getParadigm() {
        return this.#paradigm;
    }

    /**
     * @param {LanguageParadigm} paradigm 
     * @returns {boolean}
     */
    hasParadigm(paradigm) {
        return HelperFunctions.flagEnumHasAnyProperty(this.getParadigm(), paradigm);
    }

    /**
     * @returns {CompilationType}
     */
    getCompilationType() {
        return this.#compilationType;
    }

    /**
     * @returns {LanguageTyping}
     */
    getTypedType() {
        return this.#typed;
    }

    /**
     * @param {LanguageTyping} typed 
     * @returns {boolean}
     */
    hasTyped(typed) {
        return HelperFunctions.flagEnumHasAnyProperty(this.getTypedType(), typed);
    }

    /**
     * @returns {LanguageUse}
     */
    getUse() {
        return this.#use;
    }

    /**
     * @param {LanguageUse} use 
     * @returns {boolean}
     */
    hasUse(use) {
        return HelperFunctions.flagEnumHasAnyProperty(this.getUse(), use);
    }

    /**
     * @returns {LanguageSyntax}
     */
    getSyntax() {
        return this.#syntax;
    }

    toString() {
        return `{${this.getLang()} released:${this.getReleaseYear()} paradigm:${HelperFunctions.flagEnumToString(LanguageParadigm, this.getParadigm())} ` +
            `(${this.getParadigm()}) complile:${this.getCompilationType()} typed:${this.getTypedType()} use:${this.getUse()} syntax:${this.getSyntax()}}`;
    }

    printObj() {
        console.log(this.toString());
    }
}

/**
 * @param {Object} json
 * @returns {LanguageData}
 */
function getLanguageDataFromJSON(json) {
    validateLanguageDataJSON(json);

    const paradigm = HelperFunctions.getFlagEnumFromString(LanguageParadigm, json.Paradigm);
    const typing = HelperFunctions.getFlagEnumFromString(LanguageTyping, json.Typing);
    const use = HelperFunctions.getFlagEnumFromString(LanguageUse, json.Use);

    const data = new LanguageData(json.Language, json.Aliases, json.Release, paradigm, json.Compilation,
        typing, json.Syntax, use);
    //console.log(`LANGUAGE data for json ${HelperFunctions.objAsString(json)} is ${data} ${HelperFunctions.objAsString(data)}`);
    return data;
}

/**
 * @param {Object} json
 * @returns {TableData}
 */
function getTableDataFromJSON(json) {
    validateTableDataJSON(json);

    const data = new TableData(new Date(json.Year, json.Month, json.Day), json.Language);
    //console.log(`data for json ${HelperFunctions.objAsString(json)} is ${HelperFunctions.objAsString(data)}`);
    return data;
}

/**
 * @param {Object} json
 * @returns {CodeData}
 */
function getCodeDataFromJSON(json) {
    validateCodeDataJSON(json);

    let hasAddTag= true;
    if (HelperFunctions.hasProperty(json, CodeData.OVERRIDE_TAG_ADDING_PROPERTY) && 
        json[CodeData.OVERRIDE_TAG_ADDING_PROPERTY]) hasAddTag=false;

    const data = new CodeData(json.ID, new Date(json.Year, json.Month, json.Day), json.Language,
        json.Code, json.Order, hasAddTag);
    // console.log(`data for json ${HelperFunctions.objAsString(json)} is ${json.Language}` +
    //     `${HelperFunctions.objAsString(data)}`);
    return data;
}

/**
 * @param {String} language 
 * @returns {LanguageData}
 */
export function getDataFromLanguage(language, warn = true) {
    for (let i = 0; i < langaugeData.length; i++) {
        //console.log(`checking lang ${langaugeData[i].getLang()} with ${language}`);
        if (language === langaugeData[i].getLang()) {
            return langaugeData[i];
        }
    }

    if (warn) console.warn(`Could not find the language data from argument ${language}. all langs: ${langaugeData}`);
    return null;
}

/**
 * @param {String} language 
 * @returns {Boolean}
 */
export function isValidLanguage(language, warn = false) {
    return getDataFromLanguage(language, warn) !== null;
}

/**
 * @returns {string[]}
 */
function getAllLanguagesWithData() {
    let langs = [];
    for (let i = 0; i < langaugeData.length; i++) {
        langs.push(langaugeData[i].getLang());
    }
    return langs;
}

/**
 * @callback addDataAction
 * @param {Object} jsonObject
 * @returns {*}
 */
/**
 * @param {String} path 
 * @param {*[]} dataArray 
 * @param {addDataAction} actionOnObject 
 * @returns 
 */
async function initJsonData(path, dataArray, actionOnObject) {
    if (!useJson) return;

    const json = await HelperFunctions.getFileText(path);
    const jsonObj = HelperFunctions.getObjFromJson(json);
    //console.log(`for json at path ${ path } found ${ json } the obj: ${ jsonObj.length } `);
    //dataArray.length = 0;

    for (let i = 0; i < jsonObj.length; i++) {
        dataArray.push(actionOnObject(jsonObj[i]));
    }
}

(async function start() {
    if (queuedForcedId && queuedForcedId.length>0){
        queuedIds= queuedForcedId;
    }

    await initCodingLanguages();

    await initJsonData(languageDataJsonPath, langaugeData, (object) => {
        return getLanguageDataFromJSON(object);
    });

    await initJsonData(tableDataJsonPath, dailyTable, (object) => {
        return getTableDataFromJSON(object);
    });

    if (dailyTable.length != 0 && dailyTable.length != codingLanguages.length) {
        const tableLangs = getAllLanguagesWithData();
        const codeLangs = getAllCodingLanguages();
        const diff = HelperFunctions.getDifferenceFromArray(codeLangs, tableLangs);
        if (diff && diff.length > 0) console.error(`from all table code data, the following languages ` +
            `have no corresponding data (but can be guessed): ${diff}`);
    }

    await initJsonData(codeDataJsonPath, dailyCode, (object) => {
        return getCodeDataFromJSON(object);
    });

    // console.log(`language data: ${langaugeData} `);
    // console.log(`daily table data: ${dailyTable} `);
    // console.log(`daily code data: ${dailyCode} `);

})();

async function initCodingLanguages() {
    const json = await HelperFunctions.getFileText(codingLanguagesJson);
    const jsonObj = HelperFunctions.getObjFromJson(json);

    //If we have all the languages from json, we don't need to readd it
    if (codingLanguages && codingLanguages.length > 0) {
        if (jsonObj.length <= codingLanguages.length) return;
        else codingLanguages.length = 0;
    }

    let codeLangName = "";
    for (let i = 0; i < jsonObj.length; i++) {
        codeLangName = jsonObj[i];
        codingLanguages.push(codeLangName);
        //console.log(`after adding lang ${codeLangName} val: ${CodingLanguage[codeLangName]}`)
    }
    //console.log(`Coding language json: ${json} obj: ${jsonObj} len: ${jsonObj.length}`);
}

/**
 * @returns {String[]}
 */
export async function getAllCodingLanguagesSafeInit() {
    const firstInit = !codingLanguages || codingLanguages.length <= 0;
    if (firstInit) {
        await initCodingLanguages();
    }

    return getAllCodingLanguages();
}

/**
 * @returns {String[]}
 */
export function getAllCodingLanguages() {
    let copy = [];
    for (let i = 0; i < codingLanguages.length; i++) {
        copy.push(codingLanguages[i]);
    }
    if (!copy || copy.length == 0) {
        console.error(`tried to get all coding languages but found 0. This could be due to the fact ` +
            `that the language data is not init yet. Try retrieving using safe initialization and async await version`);
    }
    return copy;
}

/**
 * @param {String} str 
 * @returns {LanguageData}
 */
export function getDataFromLanguageString(str) {
    const simplifyName = (str) => {
        return HelperFunctions.replaceAll(str, " ", "").toLowerCase().trim();
    }
    str = simplifyName(str);

    for (let i = 0; i < langaugeData.length; i++) {
        const simplified = simplifyName(langaugeData[i].getLang());
        const aliases = langaugeData[i].getAliases();

        if (str === simplified) {
            return langaugeData[i];
        }
        else if (aliases && aliases.length >= 1) {
            for (let j = 0; j < aliases.length; j++) {
                if (str === simplifyName(aliases[j])) {
                    return langaugeData[i];
                }
            }
        }
    }

    console.warn(`Could not find the language data from argument(str) ${str} `);
    return null;
}

/**
 * @param {String} id 
 * @returns {CodeData}
 */
export function getCodeDataFromId(id) {
    if (!id) return null;

    for (let i = 0; i < dailyCode.length; i++) {
        if (dailyCode[i].getId() === id) return dailyCode[i];
    }

    return null;
}

/**
 * Needs to wait for all coding languages
* @returns {TableData}
*/
export function getTodaysTableDataUTC() {

    //If we get todays table data and we get randomly, we can just choose a random langauge
    //and we don't need to care about a specific day's data
    //time should also not matter since it is never used and only used for specific day data retrieval
    if (getCodeRandomly) {
        const allLangs = getAllCodingLanguages();
        const randomIndex = Math.floor(Math.random() * allLangs.length);
        const data = new TableData(new Date(), allLangs[randomIndex]);
        return data;
    }

    return getTodaysDataUTC(dailyTable);
}


