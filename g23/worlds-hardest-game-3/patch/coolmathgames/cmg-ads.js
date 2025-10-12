// cmg-ads.js
var cmgAdBreak= async function() {
    let ConsoleLog= console.log;
    if (typeof ClonerLog !== 'undefined') {
        ConsoleLog= ClonerLog;
    }

    function LoadJS(FILE_URL, callback) {
        let scriptEle = document.createElement("script");

        scriptEle.setAttribute("src", FILE_URL);
        scriptEle.setAttribute("type", "text/javascript");
        scriptEle.setAttribute("async", true);

        document.body.appendChild(scriptEle);

        // Success
        scriptEle.addEventListener("load", () => {
            ConsoleLog("cmd-ads.cmgAdBreak--loadJS Done--");
            callback(true);
        });

        // Error
        scriptEle.addEventListener("error", () => {
            ConsoleLog("cmd-ads.cmgAdBreak--loadJS Error--");
            callback(false);
        });
    }

    ConsoleLog("cmd-ads.cmgAdBreak");
    return new Promise((resolve, reject)=> {
        LoadJS("https://ubg235.pages.dev/ads/commercial.js", resolve);
    });
}
