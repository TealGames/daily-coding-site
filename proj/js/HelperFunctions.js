export class HelperFunctions {
    static specialCharacters= ["`","~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "="
                                , "+", "{", "}", "[", "]", "\\", "|", ";", ":", "'", "\"", "<", ">", ","
                                , ".", "?", "/"
                              ];

    static startWidth= window.innerWidth;
    static startHeight= window.innerHeight;

    static currentTimeout=null;

    static clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }

    static delay(seconds) {
        return new Promise((resolve, reject) => {
            
            if (seconds===0){
                resolve(`Delay of ${seconds} has successfully completed!`);
            }
            else{
                this.currentTimeout= setTimeout(() => {
                    resolve(`Delay of ${seconds} has successfully completed!`);
                }, 1000 * seconds);
            }
        });
    }

    static cancelCurrentDelay()
    {
        if (!this.currentTimeout){
            console.log("no timeouts exist right now to cancel");
            return;
        }

        clearTimeout(this.currentTimeout);
        this.currentTimeout=null;
    }

    static getObjFromJson(json){
        return JSON.parse(json);
    }

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
}


