import { HelperFunctions } from "./HelperFunctions.js";

const getCodeRandomly = true;
const useJson= true;
const languageDataJsonPath= "./data/LanguageData.json";

export const maxCodeIdLength=4;

export const CodingLanguage = Object.freeze(
    {
        //OOP
        "C": "C",
        "C++": "C++",
        "C#": "C#",
        "Java": "Java",

        //System
        "Rust": "Rust",
        "Zig": "Zig",
        "Lua": "Lua",

        //Weak type
        "JavaScript": "JavaScript",
        "TypeScript": "TypeScript",
        "Python": "Python",

        //Device apps
        "Go": "Go",
        "Swift": "Swift",
        "Kotlin": "Kotlin",

        //Functional
        "F#": "F#",
        "Caml": "Caml",
        "OCaml": "OCaml",
        "Haskell": "Haskell",
        "Erlang": "Erlang",
        "Elixir": "Elixir",
        "Lisp": "Lisp",
        "Clojure": "Clojure",

        //Ancient
        "Fortran": "Fortran",
        "BASIC": "BASIC",
        "COBOL": "COBOL",
        "ALGOL": "ALGOL",
        "Ada": "Ada",
        "Objective-C": "Objective-C",
        "Pascal": "Pascal",

        //Other
        "Ruby": "Ruby",
        "Perl": "Perl",
        "HTML": "HTML",

        //GOAT
        "PHP": "PHP",
    }
);

export class CodeData {
    #id;
    #day;
    #codeLines;
    #lang;
    #lineAppearOrder;

    /**
     * @param {String} id
     * @param {Date} day - day's code
     * @param {string[]} codeLines - the code for the day
     * @param {CodingLanguage} lang - language
     * @param {Number[][]} lineAppearOrder - order lines appear (as indices)
     */
    constructor(id, day, lang, codeLines, lineAppearOrder) {
        this.#id= id;
        this.#day = day;
        this.#codeLines = codeLines;
        this.#lang = lang;
        this.#lineAppearOrder = lineAppearOrder;
    }

    /**
     * @returns {Number}
     */
    getId(){
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
     * @returns {CodingLanguage}
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
}

const dailyCode = [
    new CodeData(1, new Date(2024, 8, 3), CodingLanguage.Java,
        ["<spc>if </spc><def>(</def><var>reallyCool</var><def>){</def><new><spc>else if</spc><def>(</def><var>poophead</var><def>){</def>",
            "<def>someText</def>",
            "<def>someText</def><def>evenmorenew</def>",
            "<def>someText</def><def>here</def>"], [[2, 0], [3], [1]]),
];

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

        console.log(`testing day ${todayUTC} with ${utcTime} (or: ${collection[i].getDay()}) ${HelperFunctions.isSameDay(todayUTC, utcTime)}`);
        if (HelperFunctions.isSameDay(todayUTC, utcTime)) {
            return collection[i];
        }
    }
}

/**
* @returns {CodeData}
*/
export function getTodaysCodeDataUTC() {
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
     * @param {CodingLanguage} lang - language
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
     * @returns {CodingLanguage}
     */
    getLang() {
        return this.#lang;
    }
}

export class LanguageData {
    #lang;
    #releaseYear;
    #paradigm;
    #compilationType;
    #typed;
    #syntax;
    #use;

    /**
     * @param {CodingLanguage} lang - language
     * @param {Number} releaseYear - release year
     * @param {LanguageParadigm} paradigm - paradigm
     * @param {CompilationType} compilation - compilation
     * @param {LanguageTyping} typed - typed
     * @param {LanguageSyntax} syntax - syntax
     * @param {LanguageUse} languageUse - use
     */
    constructor(lang, releaseYear, paradigm, compilation, typed, syntax, languageUse) {
        this.#lang = lang;
        this.#releaseYear = releaseYear;
        this.#paradigm = paradigm;
        this.#compilationType = compilation;
        this.#typed = typed;
        this.#syntax = syntax;
        this.#use = languageUse;
    }

    /**
     * @returns {CodingLanguage}
     */
    getLang() {
        return this.#lang;
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

    printObj() {
        console.log(`{${this.getLang()} released:${this.getReleaseYear()} paradigm:${HelperFunctions.flagEnumToString(LanguageParadigm, this.getParadigm())} ` +
            `(${this.getParadigm()}) complile:${this.getCompilationType()} typed:${this.getTypedType()} use:${this.getUse()} syntax:${this.getSyntax()}}`);
    }
}

function validateJSON(jsonObj, errorOnWrong){
    if (errorOnWrong){
        console.error(`The object ${obj} `);
    }
}

/**
 * @param {Object} json
 * @returns {LanguageData}
 */
function getLanguageDataFromJSON(json, throwOnWrongPropertyName=true){


    const paradigm= HelperFunctions.getFlagEnumFromString(LanguageParadigm, json.Paradigm);
    const typing= HelperFunctions.getFlagEnumFromString(LanguageTyping, json.Typing);
    const use= HelperFunctions.getFlagEnumFromString(LanguageUse, json.Use);

    const data= new LanguageData(json.Language, json.Release, paradigm, json.Compilation, 
        typing, json.Syntax,  use);
    console.log(`data for json ${json} is ${data.getCompilationType()}`);
    return data;
}

let langaugeData = [
    //----------------------------------------------------------------------------------------------------------
    // INTERPRETED LANGUAGES
    //----------------------------------------------------------------------------------------------------------
    new LanguageData(CodingLanguage["JavaScript"], 1995,
        LanguageParadigm["Object-Oriented"] | LanguageParadigm.Functional,
        CompilationType.Interpreted, LanguageTyping.Weak | LanguageTyping.Dynamic,
        LanguageSyntax["C-like"], LanguageUse.Web | LanguageUse.Server),

    new LanguageData(CodingLanguage["TypeScript"], 2012,
        LanguageParadigm["Object-Oriented"] | LanguageParadigm.Functional,
        CompilationType.Interpreted, LanguageTyping.Other,
        LanguageSyntax["C-like"], LanguageUse.Web | LanguageUse.Server),

    new LanguageData(CodingLanguage["Python"], 1991,
        HelperFunctions.getFullFlagEnumExcept(LanguageParadigm, LanguageParadigm.Declarative),
        CompilationType.Interpreted, LanguageTyping.Dynamic | LanguageUse.Strong,
        LanguageSyntax["ALGOL-like"], LanguageUse.AI | LanguageUse.Scripting | LanguageUse.Science | LanguageUse.Web),

    new LanguageData(CodingLanguage["HTML"], 1993,
        LanguageParadigm.Declarative,
        CompilationType.Interpreted, LanguageTyping.Other,
        LanguageSyntax["XML-like"], LanguageUse.Web | LanguageUse.Server),

    new LanguageData(CodingLanguage["PHP"], 1995,
        LanguageParadigm["Object-Oriented"] | LanguageParadigm.Functional,
        CompilationType.Interpreted, LanguageTyping.Dynamic | LanguageUse.Weak,
        LanguageSyntax["Perl-like"], LanguageUse.Web | LanguageUse.Server),

    //----------------------------------------------------------------------------------------------------------
    // OOP/GOOD LANGUAGES
    //----------------------------------------------------------------------------------------------------------
    new LanguageData(CodingLanguage["Java"], 1995,
        LanguageParadigm["Object-Oriented"] | LanguageParadigm.Functional,
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["C-like"], LanguageUse.Web | LanguageUse.Applications),

    new LanguageData(CodingLanguage["C#"], 2001,
        LanguageParadigm["Object-Oriented"] | LanguageParadigm.Functional | LanguageParadigm.Structural,
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["C-like"], LanguageUse["Game Development"] | LanguageUse.Applications),

    new LanguageData(CodingLanguage["C"], 1972,
        LanguageParadigm.Structural | LanguageParadigm.Procedural,
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Weak,
        LanguageSyntax["C-like"], LanguageUse.Applications | LanguageUse.Systems),

    new LanguageData(CodingLanguage["C++"], 1985,
        HelperFunctions.getFullFlagEnumExcept(LanguageParadigm, LanguageParadigm.Structural | LanguageParadigm.Declarative),
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["C-like"], LanguageUse.Applications | LanguageUse.Systems | LanguageUse["Game Development"]),

    new LanguageData(CodingLanguage["Rust"], 2015,
        LanguageParadigm.Structural | LanguageParadigm.Functional,
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["C-like"], LanguageUse.Applications | LanguageUse.Systems | LanguageUse.Scripting),

    new LanguageData(CodingLanguage["Zig"], 2016,
        LanguageParadigm.Procedural | LanguageParadigm.Functional,
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["C-like"], LanguageUse.Applications | LanguageUse.Systems),

    new LanguageData(CodingLanguage["Lua"], 1993,
        HelperFunctions.getFullFlagEnumExcept(LanguageParadigm, LanguageParadigm.Structural | LanguageParadigm.Declarative),
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["C-like"], LanguageUse.Applications | LanguageUse["Game Development"] | LanguageUse.Scripting),

    new LanguageData(CodingLanguage["Go"], 2009,
        LanguageParadigm["Object-Oriented"] | LanguageParadigm.Functional,
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["C-like"], LanguageUse.Applications | LanguageUse.Web),

    new LanguageData(CodingLanguage["Swift"], 2014,
        HelperFunctions.getFullFlagEnumExcept(LanguageParadigm, LanguageParadigm.Procedural | LanguageParadigm.Declarative),
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["C-like"], LanguageUse.Applications),

    new LanguageData(CodingLanguage["Kotlin"], 2011,
        HelperFunctions.getFullFlagEnumExcept(LanguageParadigm, LanguageParadigm.Procedural | LanguageParadigm.Declarative),
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["C-like"], LanguageUse.Applications | LanguageUse.Web | LanguageUse.Server),


    //----------------------------------------------------------------------------------------------------------
    // OTHER LANGUAGES
    //----------------------------------------------------------------------------------------------------------
    new LanguageData(CodingLanguage["Ruby"], 1995,
        LanguageParadigm.Functional | LanguageParadigm["Object-Oriented"],
        CompilationType.Interpreted, LanguageTyping.Dynamic | LanguageTyping.Strong,
        LanguageSyntax["Perl-like"], LanguageUse.Web | LanguageUse.Applications | LanguageUse.Scripting),

    new LanguageData(CodingLanguage["Perl"], 1987,
        LanguageParadigm.Functional | LanguageParadigm["Object-Oriented"] | LanguageParadigm.Procedural,
        CompilationType.Interpreted, LanguageTyping.Dynamic,
        LanguageSyntax["Perl-like"], LanguageUse.Scripting | LanguageUse.Database | LanguageUse.Server),


    //----------------------------------------------------------------------------------------------------------
    // FUNCTIONAL LANGUAGES
    //----------------------------------------------------------------------------------------------------------
    new LanguageData(CodingLanguage["F#"], 2005,
        LanguageParadigm.Functional | LanguageParadigm["Object-Oriented"],
        CompilationType.Interpreted, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["Lisp-like"], LanguageUse.Science | LanguageUse.Scripting | LanguageUse.Server),

    new LanguageData(CodingLanguage["Caml"], 1985,
        LanguageParadigm.Functional,
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["Lisp-like"], LanguageUse.Applications | LanguageUse.Systems | LanguageUse.Scripting),

    new LanguageData(CodingLanguage["OCaml"], 1996,
        LanguageParadigm.Functional | LanguageParadigm["Object-Oriented"],
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["Lisp-like"], LanguageUse.Applications | LanguageUse.Systems | LanguageUse.Science),

    new LanguageData(CodingLanguage["Haskell"], 1990,
        LanguageParadigm.Functional,
        CompilationType["Compiled or Interpreted"], LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["Lisp-like"], LanguageUse.Applications | LanguageUse.Systems),

    new LanguageData(CodingLanguage["Erlang"], 1986,
        LanguageParadigm.Functional | LanguageParadigm["Object-Oriented"],
        CompilationType.Compiled, LanguageTyping.Dynamic | LanguageTyping.Strong,
        LanguageSyntax["Lisp-like"], LanguageUse.Applications | LanguageUse.Systems | LanguageUse.Server),

    new LanguageData(CodingLanguage["Elixir"], 2012,
        LanguageParadigm.Functional,
        CompilationType.Compiled, LanguageTyping.Dynamic | LanguageTyping.Strong,
        LanguageSyntax["Lisp-like"], LanguageUse.Applications | LanguageUse.Web | LanguageUse.Server),

    new LanguageData(CodingLanguage["Lisp"], 1960,
        LanguageParadigm.Functional | LanguageParadigm.Procedural,
        CompilationType["Compiled or Interpreted"], LanguageTyping.Dynamic | LanguageTyping.Strong,
        LanguageSyntax["Lisp-like"], LanguageUse.Applications | LanguageUse.Scripting | LanguageUse.AI),

    new LanguageData(CodingLanguage["Clojure"], 2007,
        LanguageParadigm.Functional,
        CompilationType.Compiled, LanguageTyping.Dynamic | LanguageTyping.Strong,
        LanguageSyntax["Lisp-like"], LanguageUse.Applications | LanguageUse.Server | LanguageUse.Science),

    //----------------------------------------------------------------------------------------------------------
    // ANCIENT LANGUAGES
    //----------------------------------------------------------------------------------------------------------
    new LanguageData(CodingLanguage["Fortran"], 1957,
        LanguageParadigm.Structural | LanguageParadigm.Procedural,
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["Fortran-like"], LanguageUse.Science | LanguageUse.Applications | LanguageUse.Systems),

    new LanguageData(CodingLanguage["BASIC"], 1958,
        LanguageParadigm.Procedural,
        CompilationType["Compiled or Interpreted"], LanguageTyping.Dynamic | LanguageTyping.Weak,
        LanguageSyntax["Fortran-like"], LanguageUse.Applications | LanguageUse.Scripting),

    new LanguageData(CodingLanguage["COBOL"], 1959,
        LanguageParadigm.Procedural,
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Weak,
        LanguageSyntax["Assembly-like"], LanguageUse.Applications | LanguageUse.Systems | LanguageUse.Database),

    new LanguageData(CodingLanguage["ALGOL"], 1958,
        LanguageParadigm.Procedural | LanguageParadigm.Structural | LanguageParadigm["Object-Oriented"],
        CompilationType["Compiled or Interpreted"], LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["Fortran-like"], LanguageUse.Applications | LanguageUse.Systems),

    new LanguageData(CodingLanguage["Ada"], 1980,
        LanguageParadigm.Procedural | LanguageParadigm["Object-Oriented"],
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["ALGOL-like"], LanguageUse.Applications | LanguageUse.Systems | LanguageUse.Science),

    new LanguageData(CodingLanguage["Objective-C"], 1984,
        LanguageParadigm["Object-Oriented"],
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Weak,
        LanguageSyntax["C-like"], LanguageUse.Applications | LanguageUse.Systems | LanguageUse["Game Development"]),

    new LanguageData(CodingLanguage["Pascal"], 1970,
        LanguageParadigm.Structural | LanguageParadigm.Procedural,
        CompilationType.Compiled, LanguageTyping.Static | LanguageTyping.Strong,
        LanguageSyntax["ALGOL-like"], LanguageUse.Applications | LanguageUse.Systems),
];

const dailyTable = [
    new TableData(new Date(2024, 8, 2), CodingLanguage["C#"]),
];

/**
 * @param {CodingLanguage} language 
 * @returns {LanguageData}
 */
export function getDataFromLanguage(language) {
    for (let i = 0; i < langaugeData.length; i++) {
        if (language === langaugeData[i].getLang()) {
            return langaugeData[i];
        }
    }

    console.error(`Could not find the language data from argument ${language}`);
    return null;
}

(async function initLanguageData()
{
    if (!useJson) return;

    const json= await HelperFunctions.getFileText(languageDataJsonPath);
    console.log(`json text: ${json}`);
    const jsonObj= HelperFunctions.getObjFromJson(json);

    langaugeData=[];
    for (let i=0; i<jsonObj.length; i++){
        langaugeData.push(getLanguageDataFromJSON(jsonObj[i]));
    }
})();

/**
 * @param {String} str 
 * @returns {LanguageData}
 */
export function getDataFromLanguageString(str) {
    str = HelperFunctions.replaceAll(str," ", "").trim().toLowerCase();
    
    for (let i = 0; i < langaugeData.length; i++) {
        const simplified = HelperFunctions.replaceAll(langaugeData[i].getLang(), " ", "").toLowerCase().trim();
        if (str === simplified) {
            return langaugeData[i];
        }
    }

    console.error(`Could not find the language data from argument (str) ${str}`);
    return null;
}

/**
* @returns {TableData}
*/
export function getTodaysTableDataUTC() {
    return getTodaysDataUTC(dailyTable);
}


