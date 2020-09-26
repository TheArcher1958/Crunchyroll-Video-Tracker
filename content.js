console.log("Chrome extension is a go!");

chrome.runtime.onMessage.addListener(messageRecieved);

window.onload = function() {

    const videoPlayer = document.querySelector('video');
    if (videoPlayer != null) {
        init(videoPlayer);
        videoPlayer.currentTime = 50;
        window.setInterval(() => getTimeLeftInEpisode(videoPlayer), 2000);
    }
}


function getTimeLeftInEpisode(vp) {
    let currentTime = vp.currentTime;
    //console.log(vp.duration - currentTime);
    //console.log(currentTime / vp.duration);
    if(currentTime / vp.duration > 0.83) {
        // chrome.storage.sync.set({'foo': 'hello', 'bar': 'hi'}, function() {
        //     console.log('Settings saved');
        // });

        //console.log(tabTitle);
        //console.log("Next Ep!")
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
        introTime = message.txt / 1000
        tabTitle = message.title;
        nextEpURL = message.nextEpUrl;
        addSkipButton();
    }
}

function init(vp) {
    chrome.runtime.sendMessage(
        {episode: ""});
}

let introTime = 0;
let tabTitle = "";
let nextEpURL = "";
