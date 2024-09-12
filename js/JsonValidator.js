import { HelperFunctions } from "./HelperFunctions.js";
import {LanguageParadigm, CompilationType, LanguageTyping, LanguageSyntax, LanguageUse } from "./DailyCodeData.js";

const languageJsonProperties= 
["Language", "Release", "Paradigm","Compilation","Typing","Syntax","Use"];

/**
 * @param {Object} jsonObj 
 * @returns {Boolean} true of passes validation
 */
export function validateLanguageDataJSON(jsonObj){
    const properties= HelperFunctions.getPropertyValuesOfObject(jsonObj);
    if (!properties || properties.length<languageJsonProperties.length){
        console.error(`The object ${HelperFunctions.objAsString(jsonObj)} `+
        `with property count: ${properties.length} does not have the necessary property amount: `
        `'${languageJsonProperties.length}'`);
        return false;
    }

    const hasLang= hasProperty(jsonObj, languageJsonProperties[0]);
    const hasRelease= hasProperty(jsonObj, languageJsonProperties[1]);
    const hasParadigm= hasProperty(jsonObj, languageJsonProperties[2]);
    const hasCompile= hasProperty(jsonObj, languageJsonProperties[3]);
    const hasTyping= hasProperty(jsonObj, languageJsonProperties[4]);
    const hasSyntax= hasProperty(jsonObj, languageJsonProperties[5]);
    const hasUse= hasProperty(jsonObj, languageJsonProperties[6]);

    if(!hasLang || !hasRelease || !hasParadigm || !hasCompile 
        || !hasTyping || !hasSyntax || !hasUse) return false;

    const validParadigm= propertyHasValue(jsonObj, languageJsonProperties[2], HelperFunctions.getPropertiesOfObject(LanguageParadigm));
    const validComp= propertyHasValue(jsonObj, languageJsonProperties[3], HelperFunctions.getPropertiesOfObject(CompilationType));
    const validType= propertyHasValue(jsonObj, languageJsonProperties[4], HelperFunctions.getPropertiesOfObject(LanguageTyping));
    const validSyntax= propertyHasValue(jsonObj, languageJsonProperties[5], HelperFunctions.getPropertiesOfObject(LanguageSyntax));
    const validUse= propertyHasValue(jsonObj, languageJsonProperties[6], HelperFunctions.getPropertiesOfObject(LanguageUse));

    if (!validParadigm || !validComp || !validType || !validSyntax || !validUse) return false;
    return true;
}

/**
 * @param {Object} jsonObj 
 * @param {String} propertyName 
 * @param {Boolean} errorOnFalse 
 * @returns {Boolean}
 */
function hasProperty(jsonObj, propertyName, errorOnFalse=true){
    const hasIt= HelperFunctions.hasProperty(jsonObj, propertyName);
    if(!hasIt && errorOnFalse){
        console.error(`The object ${HelperFunctions.objAsString(jsonObj)} `+
        `does not have the property '${propertyName}'`);
    }
    return hasIt;
}

/**
 * @param {Object} jsonObj 
 * @param {String} propertyName 
 * @param {*[]} values 
 * @param {Boolean} errorOnFalse 
 * @returns {Boolean}
 */
function propertyHasValue(jsonObj, propertyName, values, errorOnFalse=true){
    let hasIt= HelperFunctions.propertyHasValue(jsonObj, propertyName, values);

    //If an array, we iterate through property and check it
    if (!hasIt && HelperFunctions.hasProperty(jsonObj, propertyName) && jsonObj[propertyName].length>0){
        const totalProps= jsonObj[propertyName].length;
        let validCount=0;
        for (let i=0; i<totalProps; i++){
            if (HelperFunctions.arrayContains(values, jsonObj[propertyName][i])) validCount++;
        }
        if (validCount===totalProps) hasIt=true;
        else hasIt=false;
    }

    if(!hasIt && errorOnFalse){
        console.error(`The object ${HelperFunctions.objAsString(jsonObj)} `+
        `has property '${propertyName}' with value: ${jsonObj[propertyName]} that does not match any value in ${values}`);
    }
    return hasIt;
}