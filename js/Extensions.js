import { HelperFunctions } from "./HelperFunctions.js";

/**
 * @param {String} replaceVal 
 * @param {String} newVal 
 * @returns {String} 
 */
String.prototype.ex_replaceAll = (replaceVal, newVal) => {
    const result = HelperFunctions.replaceAll(this, replaceVal, newVal);
    console.log(`replacing ${replaceVal} of ${this} with ${newVal}`);
    return result;
}

(function start() {
    console.log("test");
    const str = "tingtangtoo";
    str.ex_replaceAll("tang", "");
}());