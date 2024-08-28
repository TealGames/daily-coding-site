export class HashTable
{
    #keys= [];
    #values= [];

    constructor()
    {
        this.#keys= [];
        this.#values= [];
    }

    //TODO: custom hashing algorithm to have constant retrieval complexity

    add(key, value)
    {
        this.#keys.push(key);
        this.#values.push(value);
    }

    /**
     * Return index of the key, -1 if not found
     * @param {*} key 
     * @returns {Number} index of key
     */
    getKeyIndex(key)
    {
        return this.#keys.indexOf(key);
    }

    /**
     * @param {*} key 
     * @returns {Boolean} true if has key
     */
    hasKey(key)
    {
        return this.getKeyIndex(key) >=0;
    }

    /**
     * @param {*} key 
     * @returns {Boolean} true if success
     */
    tryRemove(key)
    {
        const index= this.#keys.indexOf(key);
        if (index<=-1){
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
    pairAtIndex(index)
    {
        if (index<0 || index>this.#keys.length || index>this.#values.length)
        {
            console.log(`tried to get pair at index ${index} but it is past the bounds of the hash table`);
            return {};
        }

        const k= this.#keys[index];
        const v= this.#values[index];
        return {key: k, value: v};
    }

    /**
     * @param {*} key 
     * @returns {Object} {key, value}
     */
    pairWithKey(key)
    {
        const index= this.getKeyIndex(key);
        if (index<0)
        {
            console.log(`tried to get pair with key ${key} but that key does not exist in the hash table`);
            return {};
        }

        return this.pairAtIndex(index);
    }

    /**
     * @returns {Number} - size
     */
    size()
    {
        return this.#keys.length;
    }
}

export class HelperFunctions {
    
    //-------------------------------
    // BASIC
    //-------------------------------
    static specialCharacters= ["`","~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "="
                                , "+", "{", "}", "[", "]", "\\", "|", ";", ":", "'", "\"", "<", ">", ","
                                , ".", "?", "/"
                              ];

    static startWidth= window.innerWidth;
    static startHeight= window.innerHeight;
    
    static #timeoutIds= new HashTable();

    static delay(seconds, outCancelId) {
        const promise= new Promise((resolve, reject) => {
            if (seconds===0){
                resolve(`Delay of ${seconds} has successfully completed!`);
            }
            else{

                const cancelCallback= (e) =>{
                    if (e.detail!==outCancelId || !this.#timeoutIds.hasKey(outCancelId)) return;
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

    static cancelDelay(cancelId)
    {
        const pair= this.#timeoutIds.pairWithKey(cancelId);

        if (!pair){
            console.log(`no timeouts with id ${id} exist right now to cancel`);
            return;
        }
        document.dispatchEvent(new CustomEvent("cancelDelay", {detail: pair.key}));
        if (this.#timeoutIds.hasKey(cancelId)) this.#timeoutIds.tryRemove(cancelId);
        clearTimeout(pair.value);
    }

    //-------------------------------
    // HTML
    //-------------------------------
    static addHtmlToStart(element, html) {
        element.html(html + element.html());
        console.log(`Adding html ${html} to element ${element} new html: ${element.html()}`);
    }

    static addHtmlToEnd(element, html) {
        element.html(element.html() + html);
    }

    static isSpecialCharacter(c){
        return this.specialCharacters.indexOf(c)!=-1;
    }

    static windowWidthShrunk(){
        return window.innerWidth< this.startWidth;
    }

    static windowHeightShrunk(){
        return window.innerHeight< this.startHeight;
    }

    //-------------------------------
    // REPETITION
    //-------------------------------
    static getObjFromJson(json){
        return JSON.parse(json);
    }

    static clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }

    /**
     * Compares the times of the days using Unix Time in milleseconds
     * @param {Date} day1 - first day to compare
     * @param {Date} day2 -  second day to compare
     */
    static isSameDay(day1, day2)
    {
        return day1.getDay()===day2.getDay() && day1.getFullYear() ===day2.getFullYear() &&
               day1.getMonth() ===day2.getMonth();
    }

    static disableElement(elementId)
    {
        const disableElement= document.getElementById(elementId);
        disableElement.style.display= "none";
    }

    static enableElement(elementId)
    {
        const enableElement= document.getElementById(elementId);
        const nodeType= enableElement.nodeName;
    
        //Block elements need to be changed to display as blocks, while others are inline
        if (nodeType==="DIV" ||nodeType==="P") enableElement.style.display="block";
        else enableElement.style.display="inline";
    }

}


