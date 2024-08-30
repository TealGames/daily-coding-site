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

    static startWidth = window.innerWidth;
    static startHeight = window.innerHeight;

    static #timeoutIds = new HashTable();

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
        console.log(`Adding html ${html} to element ${element} new html: ${element.html()}`);
    }

    static addHtmlToEnd(element, html) {
        element.html(element.html() + html);
    }

    static isSpecialCharacter(c) {
        return this.specialCharacters.indexOf(c) != -1;
    }

    static windowWidthShrunk() {
        return window.innerWidth < this.startWidth;
    }

    static windowHeightShrunk() {
        return window.innerHeight < this.startHeight;
    }

    static disableElement(elementId) {
        const disableElement = document.getElementById(elementId);
        disableElement.style.display = "none";
    }

    static enableElement(elementId) {
        const enableElement = document.getElementById(elementId);
        const nodeType = enableElement.nodeName;

        //Block elements need to be changed to display as blocks, while others are inline
        if (nodeType === "DIV" || nodeType === "P") enableElement.style.display = "block";
        else enableElement.style.display = "inline";
    }

    static clearInput(inputTag)
    {
        inputTag.value="";
        console.log(`clearing tag ${inputTag} to value: ${inputTag.value}`);
    }

    //-------------------------------------------------------------------------------------------------
    // REPETITION
    //-------------------------------------------------------------------------------------------------
    static getObjFromJson(json) {
        return JSON.parse(json);
    }

    static clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }

    /**
     * @param {Date} date 
     * @returns {Date}
     */
    static deepCopyDate(date)
    {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
        date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }
    
    /**
     * @param {Number} month - month- where 0 is January, 1 is February, etc.
     * @param {Number} year -  full year
     * @returns {boolean}
     */
    static daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameWeekday(day1, day2)
    {
        return day1.getDay() === day2.getDay();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameMonth(day1, day2)
    {
        return day1.getMonth()===day2.getMonth();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameDayNumber(day1, day2)
    {
        return day1.getDate() === day2.getDate();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameYear(day1, day2)
    {
        return day1.getFullYear()===day2.getFullYear();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameDay(day1, day2) {
        return this.isSameWeekday(day1, day2) && this.isSameDayNumber(day1, day2) && 
        this.isSameYear(day1, day2) && this.isSameMonth(day1, day2);
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isSameDayAndTime(day1, day2)
    {
        return this.isSameDay(day1, day2) && day1.getHours()===day2.getHours() && 
               day1.getMinutes()===day2.getMinutes() && day1.getSeconds() ===day2.getSeconds();
    }

    /**
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     * @returns {boolean}
     */
    static isTomorrow(day1, day2)
    {
        const sameMonth= this.isSameYear(day1, day2) && this.isSameMonth(day1, day2) &&
                         day2.getDate()===day1.getDate()+1;

        const nextMonth= this.isSameYear(day1, day2) && 
                         this.daysInMonth(day1.getMonth(), day1.getFullYear())===day1.getDate()
                         && day2.getDate() ===1 && day1.getMonth()+1===day2.getMonth() 

        const nextYear= day1.getFullYear()+1===day2.getFullYear() && day1.getMonth()===11 && 
                        this.daysInMonth(day1.getMonth(), day1.getFullYear())===day1.getDate() 
                        && day2.getMonth() ===0 && day2.getDate()===1;
        
        return sameMonth || nextMonth || nextYear;
    }

    /**
     * Will convert the date to have its default amounts be the UTC timezone from the argument
     * (Yes you can just use separate UTC functions, but easier to convert whole object)
     * @param {Date} date 
     * @returns {Date}
     */
    static convertToUTC(date)
    {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    }

    /**
     * @param {Date} date 
     * @returns {Date}
     */
    static getDateAsMidnight(date)
    {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    /**
     * @param {Date} time1 
     * @param {Date} time2
     * @returns {Object} - {Hours, Minutes, Seconds} *hours from 0-23
     */
    static getTimeDifference(time1, time2)
    {
        //Since the time may get messed up if we do each time unit separately
        //(if next day's time unit,like min, is smaller, it will be wrong even if further day)
        const diffInUnixTime= Math.abs(time2.getTime()-time1.getTime());
        const timeObj= this.getTimeFromMilliseconds(diffInUnixTime);

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
    static getTimeFromMilliseconds(milliseconds)
    {
        const millisecondsForHour= (1000*60*60);
        const millisecondsForMinute= (1000*60);

        const hours= Math.floor(milliseconds/millisecondsForHour);
        const minutes= Math.floor(milliseconds%millisecondsForHour/millisecondsForMinute);
        const seconds= Math.floor(milliseconds%millisecondsForHour%millisecondsForMinute/1000);

        return {
            Hours: hours,
            Minutes: minutes,
            Seconds: seconds,
        }
    }

    /**
     * @param {Object} obj 
     * @returns {Object[]} obj properties
     */
    static getPropertiesOfObject(obj) {
        let vals = [];
        for (let key in obj) {
            vals.push(obj[key]);
        }

        return vals;
    }

    /**
     * @param {any[]} array 
     * @param {any} value 
     * @returns {boolean}
     */
    static arrayContains(array, value)
    {
        const contains= array.some((el, idx, arr) =>
        {
            console.log(`element ${el} is value: ${value} ${el===value}`);
            return el===value;
        });
        console.log(`array ${array} contains ${value} ${contains}`);
        return contains;
    }
}


