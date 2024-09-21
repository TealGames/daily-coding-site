import { HelperFunctions } from "./HelperFunctions.js";
import { LanguageParadigm, CompilationType, LanguageTyping, LanguageSyntax, LanguageUse, getAllCodingLanguages } from "./DailyCodeData.js";
import { codeStylesPassesTests } from "./CodeHtmlConverter.js";

const languageJsonProperties =
    ["Language", "Aliases", "Release", "Paradigm", "Compilation", "Typing", "Syntax", "Use"];

const tableJsonProperties = ["Year", "Month", "Day", "Language"];
const codeJsonProperties = ["ID", "Year", "Month", "Day", "Language", "Code", "Order"];

/**
 * @param {Object} jsonObj 
 * @returns {Boolean} true of passes validation
 */
export function validateLanguageDataJSON(jsonObj) {
    const properties = HelperFunctions.getPropertyValuesOfObject(jsonObj);
    if (!properties || properties.length < languageJsonProperties.length) {
        console.error(`The object ${HelperFunctions.objAsString(jsonObj)} ` +
            `with property count: ${properties.length} does not have the necessary property amount: `
                `'${languageJsonProperties.length}'`);
        return false;
    }

    const hasLang = hasProperty(jsonObj, languageJsonProperties[0]);
    const hasAliases = hasProperty(jsonObj, languageJsonProperties[1]);
    const hasRelease = hasProperty(jsonObj, languageJsonProperties[2]);
    const hasParadigm = hasProperty(jsonObj, languageJsonProperties[3]);
    const hasCompile = hasProperty(jsonObj, languageJsonProperties[4]);
    const hasTyping = hasProperty(jsonObj, languageJsonProperties[5]);
    const hasSyntax = hasProperty(jsonObj, languageJsonProperties[6]);
    const hasUse = hasProperty(jsonObj, languageJsonProperties[7]);

    if (!hasLang || !hasAliases || !hasRelease || !hasParadigm || !hasCompile
        || !hasTyping || !hasSyntax || !hasUse) return false;

    //const validLanguage = propertyHasValue(jsonObj, languageJsonProperties[0], HelperFunctions.getPropertiesOfObject(CodingLanguage));
    const validLanguage= HelperFunctions.arrayContains(getAllCodingLanguages(), jsonObj[languageJsonProperties[0]]);
    const validParadigm = propertyHasValue(jsonObj, languageJsonProperties[3], HelperFunctions.getPropertiesOfObject(LanguageParadigm));
    const validComp = propertyHasValue(jsonObj, languageJsonProperties[4], HelperFunctions.getPropertiesOfObject(CompilationType));
    const validType = propertyHasValue(jsonObj, languageJsonProperties[5], HelperFunctions.getPropertiesOfObject(LanguageTyping));
    const validSyntax = propertyHasValue(jsonObj, languageJsonProperties[6], HelperFunctions.getPropertiesOfObject(LanguageSyntax));
    const validUse = propertyHasValue(jsonObj, languageJsonProperties[7], HelperFunctions.getPropertiesOfObject(LanguageUse));

    if (!validLanguage || !validParadigm || !validComp || !validType || !validSyntax || !validUse) return false;
    return true;
}

/**
 * @param {Object} jsonObj 
 * @returns {Boolean} true if passes validation
 */
export function validateTableDataJSON(jsonObj) {
    const properties = HelperFunctions.getPropertyValuesOfObject(jsonObj);
    if (!properties || properties.length < tableJsonProperties.length) {
        console.error(`The object ${HelperFunctions.objAsString(jsonObj)} ` +
            `with property count: ${properties.length} does not have the necessary property amount: `
                `'${tableJsonProperties.length}'`);
        return false;
    }

    const hasYear = hasProperty(jsonObj, tableJsonProperties[0]);
    const hasMonth = hasProperty(jsonObj, tableJsonProperties[1]);
    const hasDay = hasProperty(jsonObj, tableJsonProperties[2]);
    const hasLanguage = hasProperty(jsonObj, tableJsonProperties[3]);

    if (!hasYear || !hasMonth || !hasDay || !hasLanguage) return false;

    //const validLanguage = propertyHasValue(jsonObj, tableJsonProperties[3], HelperFunctions.getPropertiesOfObject(CodingLanguage));
    const validLanguage= HelperFunctions.arrayContains(getAllCodingLanguages(), jsonObj[tableJsonProperties[3]]);
    if (!validLanguage) return false;

    return true;
}

/**
 * @param {Object} jsonObj 
 * @returns {Boolean} true if passes validation
 */
export function validateCodeDataJSON(jsonObj) {
    const properties = HelperFunctions.getPropertyValuesOfObject(jsonObj);
    if (!properties || properties.length < codeJsonProperties.length) {
        console.error(`The object ${HelperFunctions.objAsString(jsonObj)} ` +
            `with property count: ${properties.length} does not have the necessary property amount: `
                `'${codeJsonProperties.length}'`);
        return false;
    }

    const hasId = hasProperty(jsonObj, codeJsonProperties[0]);
    const hasYear = hasProperty(jsonObj, codeJsonProperties[1]);
    const hasMonth = hasProperty(jsonObj, codeJsonProperties[2]);
    const hasDay = hasProperty(jsonObj, codeJsonProperties[3]);
    const hasLanguage = hasProperty(jsonObj, codeJsonProperties[4]);
    const hasCode = hasProperty(jsonObj, codeJsonProperties[5]);
    const hasOrder = hasProperty(jsonObj, codeJsonProperties[6]);

    if (!hasId || !hasYear || !hasMonth || !hasDay || !hasLanguage
        || !hasCode || !hasOrder) return false;

    
    const validLanguage= HelperFunctions.arrayContains(getAllCodingLanguages(), jsonObj[codeJsonProperties[4]]);
    //const validLanguage = propertyHasValue(jsonObj, codeJsonProperties[4], HelperFunctions.getPropertiesOfObject(CodingLanguage));
    if (!validLanguage) return false;

    if (!codeStylesPassesTests(jsonObj[codeJsonProperties[0]], jsonObj[codeJsonProperties[5]])) return false;

    return true;
}

/**
 * @param {Object} jsonObj 
 * @param {String} propertyName 
 * @param {Boolean} errorOnFalse 
 * @returns {Boolean}
 */
function hasProperty(jsonObj, propertyName, errorOnFalse = true) {
    const hasIt = HelperFunctions.hasProperty(jsonObj, propertyName);
    if (!hasIt && errorOnFalse) {
        console.error(`The object ${HelperFunctions.objAsString(jsonObj)} ` +
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
function propertyHasValue(jsonObj, propertyName, values, errorOnFalse = true) {
    let hasIt = HelperFunctions.propertyHasValue(jsonObj, propertyName, values);

    //If an array, we iterate through property and check it
    if (!hasIt && HelperFunctions.hasProperty(jsonObj, propertyName) && jsonObj[propertyName].length > 0) {
        const totalProps = jsonObj[propertyName].length;
        let validCount = 0;
        for (let i = 0; i < totalProps; i++) {
            if (HelperFunctions.arrayContains(values, jsonObj[propertyName][i])) validCount++;
        }
        if (validCount === totalProps) hasIt = true;
        else hasIt = false;
    }

    if (!hasIt && errorOnFalse) {
        console.error(`The object ${HelperFunctions.objAsString(jsonObj)} ` +
            `has property '${propertyName}' with value: ${jsonObj[propertyName]} that does not match any value in ${values}`);
    }
    return hasIt;
}