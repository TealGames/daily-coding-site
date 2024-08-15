export class HelperFunctions {
    static specialCharacters= ["`","~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "="
                                , "+", "{", "}", "[", "]", "\\", "|", ";", ":", "'", "\"", "<", ">", ","
                                , ".", "?", "/"
                              ];

    static clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }

    static delay(seconds) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(`Delay of ${seconds} has successfully completed!`);
            }, 1000 * seconds);
        });
    }

    static getObjFromJson(json)
    {
        return JSON.parse(json);
    }

    static addHtmlToStart(element, html) {
        element.html(html + element.html());
        console.log(`Adding html ${html} to element ${element} new html: ${element.html()}`);
    }

    static addHtmlToEnd(element, html) {
        element.html(element.html() + html);
    }

    static isSpecialCharacter(c)
    {
        console.log(`is special: ${c} ${ this.specialCharacters.indexOf(c)!=-1}`);
        return this.specialCharacters.indexOf(c)!=-1;
    }
}


