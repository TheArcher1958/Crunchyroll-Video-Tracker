

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


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        chrome.windows.getCurrent(w => {
            chrome.tabs.query({active: true, windowId: w.id}, tabs => {
            let url = tabs[0].url;

                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() {
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                        var images = xmlHttp.responseText.match(/<img class="mug" src="https:[\/a-z0-9._-]+/g);
                        let nextTitle = xmlHttp.responseText.match(/next" title="([A-Za-z 0-9-])+/g);
                        let msg = {
                            text: "tab-info",
                            nextEpTitle: nextTitle[0].slice(13),
                            currentEpisodeImage: images[2].replace(/\\/g, "").slice(22),
                            nextEpisodeImage: images[3].replace(/\\/g, "").slice(22),
                            currentUrl: tabs[0].url,
                            introTime: parseInt(xmlHttp.responseText.substr(xmlHttp.responseText.search("ad_breaks") + 69, 10)),
                            title: tabs[0].title,
                            nextEpUrl: xmlHttp.responseText.match(/nextMediaUrl = "http:\\\/\\\/www.crunchyroll.com\\([A-Za-z0-9.\\\/-]+)/)[0].replace(/\\/g, "").slice(16)
                        }
                        chrome.tabs.sendMessage(tabs[0].id, msg);
                    }

                }
                xmlHttp.open("GET", url, true); // true for asynchronous
                xmlHttp.send(null);
                return true;

        });
    });
});
