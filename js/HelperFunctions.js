export class HashTable {
    #keys = [];
    #values = [];

    constructor() {
        this.#keys = [];
        this.#values = [];
    }

    //TODO: custom hashing algorithm to have constant retrieval complexity

    add(key, value) {
        this.#keys.push(key);
        this.#values.push(value);
    }

    /**
     * Return index of the key, -1 if not found
     * @param {*} key 
     * @returns {Number} index of key
     */
    getKeyIndex(key) {
        return this.#keys.indexOf(key);
    }

    /**
     * @param {*} key 
     * @returns {Boolean} true if has key
     */
    hasKey(key) {
        return this.getKeyIndex(key) >= 0;
    }

    /**
     * @param {*} key 
     * @returns {Boolean} true if success
     */
    tryRemove(key) {
        const index = this.#keys.indexOf(key);
        if (index <= -1) {
            console.log(`tried to remove key ${key} but it does not exist in the hash table`);
            return false;
        }

        this.#keys.splice(index, 1);
        this.#values.splice(index, 1);
        return true;
    }

    /**
     * @param {Number} index 
     * @returns {Object} {key, value}
     */
    pairAtIndex(index) {
        if (index < 0 || index > this.#keys.length || index > this.#values.length) {
            console.log(`tried to get pair at index ${index} but it is past the bounds of the hash table`);
            return {};
        }

        const k = this.#keys[index];
        const v = this.#values[index];
        return { key: k, value: v };
    }

    /**
     * @param {*} key 
     * @returns {Object} {key, value}
     */
    pairWithKey(key) {
        const index = this.getKeyIndex(key);
        if (index < 0) {
            console.log(`tried to get pair with key ${key} but that key does not exist in the hash table`);
            return {};
        }

        return this.pairAtIndex(index);
    }

    /**
     * @returns {Number} - size
     */
    size() {
        return this.#keys.length;
    }
}

export class HelperFunctions {

    //-------------------------------------------------------------------------------------------------
    // BASIC
    //-------------------------------------------------------------------------------------------------
    static specialCharacters = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "="
        , "+", "{", "}", "[", "]", "\\", "|", ";", ":", "'", "\"", "<", ">", ","
        , ".", "?", "/"
    ];

    static digitCharacters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    static startWidth = window.innerWidth;
    static startHeight = window.innerHeight;

    static #timeoutIds = new HashTable();

    static #disableCSSClass = "disabled";
    static #enableBlockCSSClass = "block-display";
    static #enableInlineCSSClass = "inline-display";

    static delay(seconds, outCancelId) {
        const promise = new Promise((resolve, reject) => {
            if (seconds === 0) {
                resolve(`Delay of ${seconds} has successfully completed!`);
            }
            else {

                const cancelCallback = (e) => {
                    if (e.detail !== outCancelId || !this.#timeoutIds.hasKey(outCancelId)) return;
                    resolve(`Delay of ${seconds} has been cancelled`);
                }

                //If we decide to cancel the delay while we are delaying(we know we are delaying still if we have
                //the cancel id still in the hash table, we end promise
                document.addEventListener("cancelDelay", cancelCallback);

                //Otherwise, we set the hash table with this id and beginthe timeout which when finished
                //will successfully end the promise and remove this from the hash table
                this.#timeoutIds.add(outCancelId, setTimeout(() => {
                    resolve(`Delay of ${seconds} has successfully completed!`);
                    document.removeEventListener("cancelDelay", cancelCallback);
                    if (this.#timeoutIds.hasKey(outCancelId)) this.#timeoutIds.tryRemove(outCancelId);
                }, 1000 * seconds));
            }
        });
        return promise;
    }

    static cancelDelay(cancelId) {
        const pair = this.#timeoutIds.pairWithKey(cancelId);

        if (!pair) {
            console.log(`no timeouts with id ${id} exist right now to cancel`);
            return;
        }
        document.dispatchEvent(new CustomEvent("cancelDelay", { detail: pair.key }));
        if (this.#timeoutIds.hasKey(cancelId)) this.#timeoutIds.tryRemove(cancelId);
        clearTimeout(pair.value);
    }

    //-------------------------------------------------------------------------------------------------
    // HTML
    //-------------------------------------------------------------------------------------------------

    static addHtmlToStart(element, html) {
        element.html(html + element.html());
    }

    static addHtmlToEnd(element, html) {
        element.html(element.html() + html);
    }

    static doesContentNotFitPage() {
        const b = document.body;
        return b.scrollHeight > b.offsetHeight || b.scrollWidth > b.offsetWidth
    }

    /**
     * @param {Element} element1 
     * @param {Element} element2 
     * @returns {Boolean}
     */
    static doElementsOverlap(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        return rect1.right >= rect2.left && rect1.left <= rect2.right &&
            rect1.bottom >= rect2.top && rect1.top <= rect2.bottom;
    }

    /**
    * @param {Element} element 
    * @returns {String[]}
    */
    static getClassesList(element) {
        if (!element || !element.className) return [];

        return element.className.split(" ");
    }

    /**
     * @param {Element} element 
     * @param {String} cssClass
     * @returns {Boolean} true if has it
     */
    static hasClass(element, cssClass) {
        if (!element || !cssClass) return;
        cssClass = this.replaceAll(cssClass, " ", "-").trim();

        const classes = this.getClassesList(element);
        if (!classes || classes.length == 0) return false;

        return classes.indexOf(cssClass) >= 0;
    }

    /**
     * @param {Element} element 
     * @param {String} cssClass 
     */
    static addClass(element, cssClass) {
        if (!element || !cssClass) return;
        cssClass = this.replaceAll(cssClass, " ", "-").trim();

        if (this.hasClass(element, cssClass)) {
            console.warn(`Tried to add the CSS class ${cssClass} to element ` +
                `${element} with id ${element.id} but its classes (${element.className}) already has it!`);
            return;
        }

        if (element.classList) {
            element.classList.add(cssClass);
        }
        else {

            //If we already have classes, we add it with a space 
            //(so other classes are not ruined)
            if (element.className) {
                element.className += ` ${cssClass}`;
            }

            //Otherwise, we can just set it if we know there are no other classes
            else {
                element.className = cssClass;
            }
        }
    }

    /**
     * @param {Element} element 
     * @param {String} cssClass 
     * @returns {Boolean} returns true if success
     */
    static tryRemoveClass(element, cssClass) {
        if (!element || !cssClass) return false;
        cssClass = this.replaceAll(cssClass, " ", "-").trim();

        const className = element.className;
        if (!className) return false;

        //If we don't have it, we exit now
        if (!HelperFunctions.hasClass(element, cssClass)) return false;

        if (element.classList) {
            element.classList.remove(cssClass);
        }

        //Note: this has potentially to not work if the css class to remove
        //is a stirng part of another larger css class, so it might remove parts
        //of another class if they share the same string (how indexOf works)
        else {
            const index = element.indexOf(className, cssClass);
            if (index < 0) return false;

            let resultClass = className.substring(0, index) + className.substring(index + cssClass.length);
            resultClass = resultClass.trim();

            if (!resultClass) return false;

            element.className = resultClass;
        }
        return true;
    }

    /**
     * @param {Element} element 
     * @param {String[]} cssClasses
     * @returns {Boolean} returns true if all are removed
     */
    static tryRemoveClasses(element, cssClasses) {
        if (!element || !cssClasses) return false;

        let allRemoved = true;
        for (let i = 0; i < cssClasses.length; i++) {
            const removed = this.tryRemoveClass(element, cssClasses[i]);
            if (!removed) allRemoved = false;
        }
        return allRemoved;
    }


    static windowWidthShrunk() {
        return window.innerWidth < this.startWidth;
    }

    static windowHeightShrunk() {
        return window.innerHeight < this.startHeight;
    }

    static disableElement(elementId) {
        console.log(`disabling element ${elementId}`);
        const disableElement = document.getElementById(elementId);

        //To prevent conflicts with disable class, we remove any enable classes we might have added
        HelperFunctions.tryRemoveClasses(disableElement, [this.#enableBlockCSSClass, this.#enableInlineCSSClass]);
        HelperFunctions.addClass(disableElement, this.#disableCSSClass);
    }

    static enableElement(elementId) {
        console.log(`enabling element ${elementId}`);
        const enableElement = document.getElementById(elementId);
        const nodeType = enableElement.nodeName;

        //To prevent class conflicts, we replace the disable class
        HelperFunctions.tryRemoveClass(enableElement, this.#disableCSSClass);

        //Block elements need to be changed to display as blocks, while others are inline
        if (nodeType === "DIV" || nodeType === "P") HelperFunctions.addClass(enableElement, this.#enableBlockCSSClass);
        else HelperFunctions.addClass(enableElement, this.#enableInlineCSSClass);

        if (!enableElement.className) return;
    }

    static clearInput(inputTag) {
        inputTag.value = "";
    }

    /**
     * Will pad the start with the target length specified
     * Example 1: (5, 3) -> 005
     * Example 2: (69, 3) -> 069
     * Example 3: (420, 3) -> 420
     * Example 4: (1234, 3) -> 1234
     * @param {Number} num 
     * @param {Number} totalLength 
     * @returns {String}
     */
    static padWithLeadingZeros(num, totalLength) {
        const numStr = num.toString();
        return numStr.padStart(totalLength, '0');
    }

    //-------------------------------------------------------------------------------------------------
    // REPETITION
    //-------------------------------------------------------------------------------------------------
    /**
     * @param {String} c 
     * @param {String[]} [specialCharExclude=[]] 
     * @returns {Boolean}
     */
    static isSpecialCharacter(c, specialCharExclude = []) {
        if (specialCharExclude && specialCharExclude.length > 0 &&
            HelperFunctions.arrayContains(specialCharExclude, c)) return false;

        return this.specialCharacters.indexOf(c) != -1;
    }

    /**
     * Replaces ALL occurences on a string. While it is already implemented in the string class
     * in JS, it does not work on IE, so this is an alternative to that function.
     * @param {String} target 
     * @param {String} replaceVal
     * @param {String} newVal
     * @returns {String} 
     */
    static replaceAll(target, replaceVal, newVal) {
        if (!target || !replaceVal) {
            console.warn(`Tried to use replaceAll with args (target: ${target} replace: ${replaceVal} new: ${newVal}) ` +
                `but either target or replace value is undefined!`);
            return target;
        }

        let result = target;
        let valIndex = target.indexOf(replaceVal);
        while (valIndex >= 0 && valIndex < result.length) {
            let newStr = result.substring(0, valIndex) + newVal + result.substring(valIndex + replaceVal.length);
            result = newStr;

            valIndex = target.indexOf(replaceVal);
        }
        return result;
    }

    static isNumber(str) {
        return !isNaN(str);
    }

    /**
     * Gets the indices of all the occurences of instanceStr in string
     * @param {String} string 
     * @param {String} instanceStr 
     * @returns {Number[]}
     */
    static getIndicesOfString(string, instanceStr) {
        let valIndex = string.indexOf(instanceStr);
        let indices = [];
        while (valIndex >= 0) {
            indices.push(valIndex);

            if (valIndex >= string.length - 1) break;
            valIndex = string.indexOf(instanceStr, valIndex + 1);
        }
        return indices;
    }

    /**
     * Will go through each element in findStrings until it finds the 
     * str in string otherwise -1
     * @param {String} string 
     * @param {String[]} findStrings 
     * @param {number} [startIndex=0] 
     * @return {Number}
     */
    static getIndexOfAny(string, findStrings, startIndex = 0) {
        let index = -1;

        for (let i = 0; i < findStrings.length; i++) {
            index = string.indexOf(findStrings[i], startIndex);
            if (index >= 0) return index;
        }
        return -1;
    }

    /**
     * @param {String[]} stringArray 
     * @returns {String}
     */
    static combineStringArrayToOne(stringArray) {
        let result = "";
        for (let i = 0; i < stringArray.length; i++) {
            result += stringArray[i];
        }
        return result;
    }

    /**
     * Replaces ALL occurences on a string. While it is already implemented in the string class
     * in JS, it does not work on IE, so this is an alternative to that function.
     * @param {String} target 
     * @param {String[]} replaceVals
     * @param {String} newVal
     * @returns {String} 
     */
    static replaceAllMultiple(target, replaceVals, newVal) {
        if (!target || !replaceVals) {
            console.warn(`Tried to use replaceAll with args (target: ${target} replace: ${replaceVals} new: ${newVal}) ` +
                `but either target or replace value is undefined!`);
            return target;
        }

        let result = target;
        for (let i = 0; i < replaceVals.length; i++) {
            result = HelperFunctions.replaceAll(target, replaceVals[i], newVal);
        }
        return result;
    }

    /**
     * @param {String} json 
     * @returns {Object}
     */
    static getObjFromJson(json) {
        let obj = null;
        try {
            obj = JSON.parse(json);
        }
        catch (e) {
            console.error(`tried to parse the json ${json} but encountered error: ${e}`);
        }
        return obj;
    }

    /**
     * @param {String} filePath path relative to HelperFunctions file, 
     * including the file extension (.json, .js, etc.)
     * @param {Boolean} logSuccess
     * @returns {String} string of the result file text
     */
    static async getFileText(filePath, logSuccess = true) {
        let result = "";

        try {
            const response = await fetch(filePath);
            result = await response.text();
            if (logSuccess) console.log(`Successfully found the data ${result} at path ${filePath}`);
        } catch (error) {
            console.error(`Error fetching the file at ${filePath}:`, error);
        }

        return result;
    }

    static clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }

    /**
     * @param {Date} date 
     * @returns {Date}
     */
    static deepCopyDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
            date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }

    /**
     * @param {Number} month - month- where 0 is January, 1 is February, etc.
     * @param {Number} year -  full year
     * @returns {boolean}
     */
    static daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameWeekday(day1, day2) {
        return day1.getDay() === day2.getDay();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameMonth(day1, day2) {
        return day1.getMonth() === day2.getMonth();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameDayNumber(day1, day2) {
        return day1.getDate() === day2.getDate();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameYear(day1, day2) {
        return day1.getFullYear() === day2.getFullYear();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameDay(day1, day2) {
        return this.isSameDayNumber(day1, day2) &&
            this.isSameYear(day1, day2) && this.isSameMonth(day1, day2);
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameDayAndTime(day1, day2) {
        return this.isSameDay(day1, day2) && day1.getHours() === day2.getHours() &&
            day1.getMinutes() === day2.getMinutes() && day1.getSeconds() === day2.getSeconds();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isTomorrow(day1, day2) {
        const sameMonth = this.isSameYear(day1, day2) && this.isSameMonth(day1, day2) &&
            day2.getDate() === day1.getDate() + 1;

        const nextMonth = this.isSameYear(day1, day2) &&
            this.daysInMonth(day1.getMonth(), day1.getFullYear()) === day1.getDate()
            && day2.getDate() === 1 && day1.getMonth() + 1 === day2.getMonth()

        const nextYear = day1.getFullYear() + 1 === day2.getFullYear() && day1.getMonth() === 11 &&
            this.daysInMonth(day1.getMonth(), day1.getFullYear()) === day1.getDate()
            && day2.getMonth() === 0 && day2.getDate() === 1;

        return sameMonth || nextMonth || nextYear;
    }

    /**
     * Will convert the date to have its default amounts be the UTC timezone from the argument
     * (Yes you can just use separate UTC functions, but easier to convert whole object)
     * @param {Date} date 
     * @returns {Date}
     */
    static convertToUTC(date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
            date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    }

    /**
     * @param {Date} date 
     * @returns {Date}
     */
    static getDateAsMidnight(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    /**
     * @param {Date} time1 
     * @param {Date} time2
     * @returns {Object} - {Hours, Minutes, Seconds} *hours from 0-23
     */
    static getTimeDifference(time1, time2) {
        //Since the time may get messed up if we do each time unit separately
        //(if next day's time unit,like min, is smaller, it will be wrong even if further day)
        const diffInUnixTime = Math.abs(time2.getTime() - time1.getTime());
        const timeObj = this.getTimeFromMilliseconds(diffInUnixTime);

        return {
            Hours: timeObj.Hours,
            Minutes: timeObj.Minutes,
            Seconds: timeObj.Seconds,
        }
    }

    /**
     * @param {Number} milliseconds 
     * @returns {Object} - {Hours, Minutes, Seconds}
     */
    static getTimeFromMilliseconds(milliseconds) {
        const millisecondsForHour = (1000 * 60 * 60);
        const millisecondsForMinute = (1000 * 60);

        const hours = Math.floor(milliseconds / millisecondsForHour);
        const minutes = Math.floor(milliseconds % millisecondsForHour / millisecondsForMinute);
        const seconds = Math.floor(milliseconds % millisecondsForHour % millisecondsForMinute / 1000);

        return {
            Hours: hours,
            Minutes: minutes,
            Seconds: seconds,
        }
    }

    /**
     * @param {Object} obj 
     * @returns {String[]} obj property names
     */
    static getPropertiesOfObject(obj) {
        let props = [];
        for (let key in obj) {
            props.push(key);
        }

        return props;
    }

    /**
     * @param {Object} obj 
     * @returns {Object[]} obj property values
     */
    static getPropertyValuesOfObject(obj) {
        let vals = [];
        for (let key in obj) {
            vals.push(obj[key]);
        }

        return vals;
    }

    /**
     * @param {Object} obj 
     * @param {String} propertyName 
     * @returns {Boolean} true if valid property (has to follow exact string)
     */
    static hasProperty(obj, propertyName) {
        const properties = this.getPropertiesOfObject(obj);
        const rightName = this.arrayContains(properties, propertyName);
        return rightName;
    }

    /**
     * @param {Object} obj 
     * @param {String} propertyName 
     * @returns {*} returns the value of property if exists, otherwise null is returned
     */
    static getProperty(obj, propertyName) {
        if (this.hasProperty(obj, propertyName)) return obj[propertyName];
        else return null;
    }

    /**
     * @param {Object} obj 
     * @param {String} propertyName 
     * @param {Any[]} acceptableValues 
     * @returns {Boolean}
     */
    static propertyHasValue(obj, propertyName, acceptableValues) {
        if (!obj || !acceptableValues) return false;

        const value = this.getProperty(obj, propertyName);
        if (!value) return false;

        for (let i = 0; i < acceptableValues.length; i++) {
            if (acceptableValues[i] === value) return true;
        }
        return false;
    }

    /**
     * @param {Object} obj 
     */
    static objAsString(obj) {
        let str = "{";
        for (let key in obj) {
            str += `${key}:${obj[key]},`;
        }
        const lastCommaIndex = str.lastIndexOf(",");
        if (lastCommaIndex >= 0) {
            str = str.substring(0, lastCommaIndex);
        }
        str += "}";
        return str;
    }

    /**
     * @param {Object} type 
     * @returns {Number} obj property values
     */
    static getAllFlagEnumProperties(type) {
        const values = this.getPropertyValuesOfObject(type);

        let result = values[0];
        for (let i = 1; i < values.length; i++) {
            result |= values[i];
        }
        return result;
    }

    /**
     * Will return TRUE if flagEnumValue has a 1 in the 1 bits in valueToCheck
     * Example: (101, 001) -> true because 101 has 1 bit in least significant place
     * Example: (10110, 01110) -> false because first arg missing first 1 bit in valueToCheck
     * @param {Number} flagEnumValue
     * @param {Number} valueToCheck
     * @returns {Boolean}
     */
    static flagEnumHasProperty(flagEnumValue, valueToCheck) {
        //We need to check the result is the same as the value to check (and cant do !==0) 
        //because if value to check has multiple bits, all of them need to appear in the value not just 1
        return (flagEnumValue & valueToCheck) === valueToCheck;
    }

    /**
     * Will return TRUE if flagEnumValue ANY of the same bits as in valueToCheck
     * Example: (101, 001) -> true because 101 has 1 bit in least significant place
     * Example: (10110, 01110) -> true because one bit missing in first arg, there is at least one bit in arg1 from arg2
     * Example: (1000, 0100) -> false because no bits from arg2 are present in arg1
     * @param {Number} flagEnumValue
     * @param {Number} valueToCheck
     * @returns {Boolean}
     */
    static flagEnumHasAnyProperty(flagEnumValue, valueToCheck) {
        return (flagEnumValue & valueToCheck) != 0;
    }

    /**
     * @param {Object} type
     * @param {Number} flagEnumValue
     * @returns {String}
     */
    static flagEnumToString(type, flagEnumValue) {
        let str = "";
        for (let key in type) {
            if ((flagEnumValue & type[key]) !== 0) {
                str += key + ", ";
            }
        }
        str = str.trim();
        const lastComma = str.lastIndexOf(",");
        if (lastComma >= 0) str = str.substring(0, lastComma);

        return str;
    }

    /**
     * @param {Object} type
     * @param {Number} exceptValue
     * @returns {Object}
     */
    static getFullFlagEnumExcept(type, exceptValue) {
        const allProperties = this.getAllFlagEnumProperties(type);
        const allIndividual = this.getPropertyValuesOfObject(type);

        //By changing the exception values to the inverse and using and, the spots not in the enum
        //get cancelled by the all properties 0 bits, and the ones that all has 
        //get removed with 0 in exception (that used to be 1 bits)
        return allProperties & ~exceptValue;
    }

    /**
     * @param {Object} type 
     * @param {String[]} stringArray 
     * @returns {Number} result
     */
    static getFlagEnumFromString(type, stringArray) {
        let result = 0;

        for (let key in type) {

            if (this.arrayContains(stringArray, key)) {
                result |= type[key];
            }
        }
        //console.log(`the result for ${stringArray} is ${result}`);
        return result;
    }

    /**
     * @param {any[]} array 
     * @param {any} value 
     * @returns {boolean}
     */
    static arrayContains(array, value) {
        const contains = array.some((el, idx, arr) => {
            return el === value;
        });
        return contains;
    }

    /**
     * Will check and return all the values that array1 does not have from array2
     * All duplicates from array 2 are removed
     * @param {any[]} arr1 
     * @param {any[]} arr2 
     * @returns {any[]}
     */
    static getDifferenceFromArray(arr1, arr2) {
        const set2 = new Set(arr2);
        return arr1.filter(item => !set2.has(item));
    }

    /**
     * @param {String} str 
     * @returns {Boolean}
     */
    static isNumber(str) {
        if (typeof str != "string") return false;
        // use type coercion to parse the string
        //(`parseFloat` alone does not do this)...
        //...and ensure strings of whitespace fail
        return !isNaN(str) && !isNaN(parseFloat(str));
    }
}


