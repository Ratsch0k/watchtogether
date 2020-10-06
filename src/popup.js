/*
 * Build html
 */
import cssText from "bundle-text:../dist/style.css";

const html =
`
<style>${cssText}</style>

<div
  id="start-container"
  style="height: 100%; width: 100%"
>
  <div class="h-full w-full flex flex-col justify-evenly">
    <div class="w-full py-2 px-4">
      <button
        id="to-create-session-btn"
        class="bg-green-500 hover:bg-green-700 text-white font-bold rounded h-8 w-full"
      >
        CREATE A NEW SESSION
      </button>
    </div>
    <div class="w-full py-2 px-4">
      <button
        id="to-join-session-btn"
        class="bg-green-500 hover:bg-green-700 text-white font-bold rounded h-8 w-full"
      >
        JOIN A SESSION
      </button>
    </div>
  </div>
</div>

<div
  id="create-session-container"
  hidden
  style="height: 100%; width: 100%"
>
  <div class="h-full flex flex-col justify-evenly px-4">
    <div class="flex">
      <input
        class="form-input w-full p-1 shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-8 font-bold"
        type="password"
        id="create-session-password"
        placeholder="Password"
      />
    </div>
    <div
      id="create-session-footer"
      class="flex"
    >
      <button
        id="back-from-create-btn"
        class="bg-transparent text-green-700 font-semibold py-2 px-4 rounded w-1/2 mr-1"
      >
        BACK
      </button>
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2  ml-1" id="create-session-btn">
        CREATE
      </button>
    </div>
  </div>
</div>

<div
  id="join-session-container"
  style="height: 100%; width: 100%"
  hidden
>
  <div class="h-full flex flex-col justify-evenly px-4">
    <input
      class="form-input w-full p-1 shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-8 font-bold"
      type="text"
      id="join-session-id"
      placeholder="Session ID"
    />
    <input
      class="form-input w-full p-1 shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-8 font-bold"
      type="password"
      id="join-session-password"
      placeholder="Password"
    />
    <div class="flex">
      <button
      id="back-from-join-btn"
      class="bg-transparent text-green-700 font-semibold py-2 px-4 rounded w-1/2 ml-1"
    >
      BACK
    </button>
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2 mr-1" id="join-session-btn">
      JOIN
    </button>
    </div>
  </div>
  </div>

<div
  id="control-container"
  hidden
  style="width: 100%; height: 100%;"
>
  <div class="h-full w-full flex flex-col px-4 justify-center items-center">
    <div class="w-full flex">
      <input
        class="form-input w-full p-1 shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline foc h-8 font-bold"
        type="text"
        id="session-id"
        placeholder="Session ID"
      />
    </div>
    <div class="w-full flex mt-2">
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2 mx-2 h-8" id="play">
        PLAY
      </button>
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2 mx-2 h-8" id="pause">
        PAUSE
      </button>
    </div>
    <div class="w-full flex mt-6">
      <button class="bg-transparent text-green-500 font-semibold py-2 rounded h-8 w-full mx-2" id="exit-session">
        EXIT
      </button>
    </div>
  </div>
</div>
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

// Get all components
const startContainer = document.getElementById("start-container");
const startButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const controlContainer = document.getElementById("control-container");

const createSessionContainer = document.getElementById("create-session-container");
const toCreateSessionButton = document.getElementById("to-create-session-btn");
const backFromCreateSessionButton = document.getElementById("back-from-create-btn");
const createSessionButton = document.getElementById("create-session-btn");

const joinSessionContainer = document.getElementById("join-session-container");
const toJoinSessionButton = document.getElementById("to-join-session-btn");
const backFromJoinSessionButton = document.getElementById("back-from-join-btn");
const joinSessionButton = document.getElementById("join-session-btn");


// Initialize logic for play button
startButton.onclick = function() {
  port.postMessage({action: 'play'})
};

// Initialize logic for pause button
pauseButton.onclick = function() {
  port.postMessage({action: 'pause'})
};

toCreateSessionButton.onclick = function() {
  startContainer.hidden = true;
  createSessionContainer.hidden = false;
}

backFromCreateSessionButton.onclick = function() {
  startContainer.hidden = false;
  createSessionContainer.hidden = true;
}

createSessionButton.onclick = function() {
  createSessionContainer.hidden = true;
  controlContainer.hidden = false;
}

toJoinSessionButton.onclick = function() {
  startContainer.hidden = true;
  joinSessionContainer.hidden = false;
}

backFromJoinSessionButton.onclick = function() {
  startContainer.hidden = false;
  joinSessionContainer.hidden = true;
}

joinSessionButton.onclick = function() {
  joinSessionContainer.hidden = true;
  controlContainer.hidden = false;
}