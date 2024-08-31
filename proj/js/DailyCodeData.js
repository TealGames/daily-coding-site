import { HelperFunctions } from "./HelperFunctions.js";

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
        "GDScript": "GDScript",
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
        "SmallTalk": "SmallTalk",

        //Other
        "Ruby": "Ruby",
        "Perl": "Perl",
        "HTML" : "HTML",

        //GOAT
        "PHP": "PHP",
    }
);

export class CodeData {
    #day;
    #code = "";
    #lang;

    /**
     * @param {Date} day - day's code
     * @param {string} code - the code for the day
     * @param {CodingLanguage} lang - language
     */
    constructor(day, code, lang) {
        this.#day = day;
        this.#code = code;
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
     * @returns {string}
     */
    getCode() {
        return this.#code;
    }

    /**
     * @returns {CodingLanguage}
     */
    getLang() {
        return this.#lang;
    }
}

export class TableData
{
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

export const LanguageParadigm= Object.freeze({
    "Functional" : 1 << 0,
    "Object-Oriented" : 1 << 1,
    "Data-Oriented" : 1 << 2,
    "Procedural" : 1 << 3,
    "Structural" : 1 << 4,
});

export const CompilationType= Object.freeze({
    "Compiled" : "Compiled",
    "Interpreted" : "Interpreted",
});

/*
Weak type: can easily be converted via implicit conversions
Dyamic type: types are resolved during runtime
*/
export const LanguageTyping= Object.freeze({
    "Weak/Dynamic" : "Weak/Dynamic",
    "Weak/Static" : "Weak/Static",
    "Strong/Dynamic" : "Strong/Dynamic",
    "Strong/Static" : "Strong/Static",
});

export const LanguageUse= Object.freeze({
    "Web": 1 << 0,
    "Server" : 1 << 1,
    "Scripting": 1 << 2,
    "Applications": 1 << 3,
    "Systems" : 1 << 4,
    "AI" : 1 << 5,
    "Database": 1 << 6,
    "Esoteric" : 1 << 7,
    "Science" : 1 << 8,
});

export const LanguageSyntax= Object.freeze({
    "C-like": "C-like",
    "ALGOL-like": "ALGOL-like",
    "Perl-like" : "Perl-like",
    "Lisp-like" : "Lisp-like",
    "Assembly-like" : "Assembly-like",
    "XML-like" : "XML-like",
});


export class LanguageData
{
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
        this.#releaseYear= releaseYear;
        this.#paradigm= paradigm;
        this.#compilationType= compilation;
        this.#typed= typed;
        this.#syntax= syntax;
        this.#use= languageUse;
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
    hasParadigm(paradigm){
        return (this.getParadigm() & paradigm) !=0;
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
     * @returns {LanguageUse}
     */
    getUse() {
        return this.#use;
    }

    /**
     * @returns {LanguageSyntax}
     */
    getSyntax() {
        return this.#use;
    }
}

const langaugeData= [
    
];

const dailyCode =
    [
        new CodeData(new Date(2024, 7, 30), "<spc>if </spc><def>(</def><var>reallyCool</var><def>) " +
            "{</def><new><def>someText</def>", CodingLanguage.Java),
    ];

/**
 * @param {Date} day 
 * @returns 
 */
export function getTodaysDataUTC() {
    const todayLocal= new Date();
    const todayUTC= HelperFunctions.convertToUTC(todayLocal);
    console.log(`today local: ${todayLocal} utc: ${todayUTC}`);

    for (let i = 0; i < dailyCode.length; i++) {

        //We set the day to check time to the target day so that hour differences
        //between get time and current time don't mess up the UTC conversion 
        //(since if it is great enough, it could change to next day)
        //we also do it from the local time since doing it from UTC time will result in wrong time when doing UTC again
        const dayToCheck= dailyCode[i].getDay();
        dayToCheck.setHours(todayLocal.getHours());
        dayToCheck.setMinutes(todayLocal.getMinutes());
        dayToCheck.setSeconds(todayLocal.getSeconds());
        dayToCheck.setMilliseconds(todayLocal.getMilliseconds());
        const utcTime= HelperFunctions.convertToUTC(dayToCheck);

        console.log(`testing day ${todayUTC} with ${utcTime} (or: ${dailyCode[i].getDay()}) ${HelperFunctions.isSameDay(todayUTC, utcTime)}`);
        if (HelperFunctions.isSameDay(todayUTC, utcTime)) {
            return dailyCode[i];
        }
    }

    console.warn(`Tried to retrieve the daily code data for day ${todayUTC} but it does not exist!`);
    return null;
}