console.log("background running");


chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'www.crunchyroll.com'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.browserAction.onClicked.addListener(buttonClicked);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        chrome.windows.getCurrent(w => {
            chrome.tabs.query({active: true, windowId: w.id}, tabs => {
        //chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            console.log(tabs);
            let url = tabs[0].url;
            console.log(url);

                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() {
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                        let msg = {
                            text: "tab-info",
                            txt: parseInt(xmlHttp.responseText.substr(xmlHttp.responseText.search("ad_breaks") + 69, 10)),
                            title: tabs[0].title,
                            nextEpUrl: xmlHttp.responseText.match(/nextMediaUrl = "http:\\\/\\\/www.crunchyroll.com\\([A-Za-z0-9.\\\/-]+)/)[0].replace(/\\/g, "").slice(16)
                        }
                        chrome.tabs.sendMessage(tabs[0].id, msg);
                    }
                    //     console.log(xmlHttp.responseText);
                    // console.log(parseInt(xmlHttp.responseText.substr(xmlHttp.responseText.search("ad_breaks") + 69, 10)))
                    // sendResponse(parseInt(xmlHttp.responseText.substr(xmlHttp.responseText.search("ad_breaks") + 69, 10)))
                }
                xmlHttp.open("GET", url, true); // true for asynchronous
                xmlHttp.send(null);
                return true;
            //console.log(xmlHttp.responseText);

            // return true; // keeps the message channel open until `sendResponse` is executed


            // fetch(url)
            //     .then(response => response.text())
            //     .then(data => {
            //         sendResponse(parseInt(data.substr(data.search("ad_breaks") + 69, 10)))
            //         return true;
            //         console.log(data);
            //     })
            //     .catch(error => alert("error"))
            // return true;  // Will respond asynchronously.
        });
        });
    });

function buttonClicked(tab) {
    let msg = {
        txt: "hello"
    }
    chrome.tabs.sendMessage(tab.id, msg);
}