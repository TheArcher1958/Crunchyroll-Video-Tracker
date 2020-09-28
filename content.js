console.log("Chrome extension is a go!");

chrome.runtime.onMessage.addListener(messageRecieved);

window.onload = function() {

    const videoPlayer = document.querySelector('video');
    if (videoPlayer != null) {
        vp = videoPlayer;

        init();
    }
}

function startInterval() {
    window.setInterval(() => getTimeLeftInEpisode(vp), 5000);

}

function getTimeLeftInEpisode() {
    let currentTime = vp.currentTime;

    //console.log(vp.duration - currentTime);
    //console.log(currentTime / vp.duration);
    if(currentTime / vp.duration > 0.83) {
        chrome.storage.sync.set({'nextEpisodeUrl': nextEpURL, 'currentTime': 0.0}, function() {
            console.log('Settings saved');
        });

        //console.log(tabTitle);
        //console.log("Next Ep!")
    } else {
        chrome.storage.sync.set({'nextEpisodeUrl': currentURL, 'currentTime': currentTime}, function() {
            console.log('Settings saved');
        });
    }
}

// ALL SKIP INTRO CODE FROM https://github.com/ianjjhsiao/skipintro
function addSkipButton() {
    let root = document.getElementById("vilosRoot");
    let button = document.createElement("div");
    let player = document.getElementById('player0');
    button.style.zIndex = 999;
    button.style.color = "white";
    button.style.position = "fixed";
    button.style.right = 0;
    button.style.bottom = "80px";
    button.style.backgroundColor = "rgba(0,0,0,0.3)";
    button.style.border = "1px solid white";
    button.style.padding = "10px 10px 9px 10px";
    button.style.margin = "0 20px 0 0";
    button.style.fontSize = "16px";
    button.style.cursor = "pointer";
    button.style.display = "none";
    button.id = "skipButton";
    button.onclick = () => {
        player.currentTime = introTime;
    };
    root.append(button);
    window.setInterval(showHideSkipButton, 1000);
}


function showHideSkipButton() {
    let skipButton = document.getElementById("skipButton");
    let player = document.getElementById('player0');
    let time = parseInt(player.currentTime);

    //display the button
    if (time < introTime) {
        skipButton.innerText = "SKIP INTRO";
        skipButton.style.display = "block";
    } else {
        skipButton.style.display = "none";
    }
}

function messageRecieved(message, sender, response) {
    if(message.text == "tab-info") {
        introTime = message.introTime / 1000
        tabTitle = message.title;
        nextEpURL = message.nextEpUrl;
        currentURL = message.currentUrl;
        currentImage = message.currentEpisodeImage;
        nextEpisodeImage = message.nextEpisodeImage;
        console.log("images: " + currentImage + " " + nextEpisodeImage)
        addSkipButton();
        chrome.storage.sync.get(['nextEpisodeUrl','currentTime'], function(items) {
            console.log(items.currentTime);
            console.log(items.nextEpisodeUrl == currentURL)
            console.log(items.nextEpisodeUrl)
            console.log(currentURL)
            if(items.currentTime > 0.0 && items.nextEpisodeUrl == currentURL) {
                vp.currentTime = items.currentTime;
            }
        });
        window.setTimeout(startInterval, 5)
        // let links = document.getElementsByClassName('link block-link block');
        // console.log(links);
        // console.log(links[2].children[0]);
        // console.log(links[2].children[0].getAttribute("src"))
    }
}

function init() {
    chrome.runtime.sendMessage(
        {episode: ""});
}
let vp = null;
let introTime = 0;
let tabTitle = "";
let nextEpURL = "";
let currentURL = "";
let currentImage = "";
let nextEpisodeImage = "";

