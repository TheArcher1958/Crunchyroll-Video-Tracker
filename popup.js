
chrome.storage.sync.get(['nextEpisodeUrl','episodeTitle', 'imageURL', 'percentageWatched'], function(items) {

    document.getElementById('crimage').src = items.imageURL;
    document.getElementById('crsubtitle').innerHTML = items.episodeTitle
    var link = document.getElementById('crlink')
    link.onclick = () => {
        chrome.tabs.create({ url: items.nextEpisodeUrl });
    };
    document.getElementById('crprogressbar').setAttribute("style","width:" + (160 * items.percentageWatched).toString() + "px");
});


