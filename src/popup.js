/*
 * Build html
 */
import cssText from "bundle-text:../dist/style.css";

const html =
`
<style>${cssText}</style>
<div
  id="start-container"
>
  <div class="flex flex-col">
    <button
      id="create-session-btn"
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded p"
    >
      CREATE A NEW SESSION
    </button>
    <button
      id="join-session-btn"
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      JOIN A SESSION
    </button>
  </div>
</div>
<div id="create-session-container">

</div>
<div id="join-session-container">

</div>
<div id="control-container" hidden>
<button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" id="play">
  PLAY
</button>
<button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" id="pause">
  PAUSE
</button>
</div>
<input type="text" id="session"/>
`

document.body.innerHTML = html + document.body.innerHTML;

/*
 * Add logic 
 */
const port = chrome.runtime.connect({name: 'video_control'});

function play() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: 'document.getElementsByTagName("video")[0].play();'
      }
    )
  });
}

function pause() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: 'document.getElementsByTagName("video")[0].pause();'
      }
    )
  });
}

port.onMessage.addListener(function(msg) {
  if (msg.action === 'play') {
    play();
  } else if (msg.action === 'pause') {
    pause();
  }
});


// Initialize logic for play button
const startButton = document.getElementById("play");
startButton.onclick = function() {
  port.postMessage({action: 'play'})
};

// Initialize logic for pause button
const pauseButton = document.getElementById("pause");
pauseButton.onclick = function() {
  port.postMessage({action: 'pause'})
};

const createSessionButton = document.getElementById("create-session-btn");
createSessionButton.onclick = function() {
  document.getElementById("start-container").hidden = true;
  document.getElementById("control-container").hidden = false;
}

const joinSessionButton = document.getElementById("join-session-btn");
joinSessionButton.onclick = function() {
  document.getElementById("start-container").hidden = true;
  document.getElementById("control-container").hidden = false;
}