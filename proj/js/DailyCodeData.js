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
     * @returns {Date}
     */
    getDay() {
        return this.#day;
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

const dailyCode =
    [
        new CodeData(new Date(2024, 7, 27), "<spc>if </spc><def>(</def><var>reallyCool</var><def>) " +
            "{</def><new><def>someText</def>", CodingLanguage.Java),
    ];

/**
 * @param {Date} day 
 * @returns 
 */
export function getCode(day) {
    for (let i = 0; i < dailyCode.length; i++) {
        //console.log(`testing day ${HelperFunctions.isSameDay(day, dailyCode[i].getDay())}`);
        if (HelperFunctions.isSameDay(day, dailyCode[i].getDay())) {
            return dailyCode[i];
        }
    }

    console.warn(`Tried to retrieve the daily code data for day ${day} but it does not exist!`);
    return null;
}