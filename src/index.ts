import { Client } from "node-osc";
import { getPixelColor, getScreenSize } from "robotjs";

const screenSize = getScreenSize();

enum State {
  Idle = "Idle",
  Listening = "Listening",
  Speaking = "Speaking",
}

const invalidScreenSizeError = new Error(
  "Program not calibrated for this screen size. Please use 1280x1080 on 150% zoom or 1366x768 on 100% zoom.",
);

let state = State.Idle;

const osc = new Client("127.0.0.1", 9000);

const dummyCallback = (err: Error | null) => {};

async function getListenPix() {
  if (![1280, 1366].includes(screenSize.width)) throw invalidScreenSizeError;
  return await getPixelColor(50, screenSize.width === 1280 ? 50 : 25);
}

async function getSpeakPix() {
  if (![1280, 1366].includes(screenSize.width)) throw invalidScreenSizeError;
  return await getPixelColor(50, screenSize.width === 1280 ? 144 : 95);
}

async function getState() {
  const oldState = state;

  const listenPix = await getListenPix();

  if (listenPix.startsWith("163")) {
    state = State.Listening;
  } else if (listenPix !== "74ddfe") {
    console.error(
      "Alexa App is not visible. Please leave at least the top left corner of the app visible.",
    );
  } else {
    const speakPix = await getSpeakPix();

    if (speakPix.startsWith("00") || speakPix.startsWith("01")) {
      state = State.Speaking;
    } else {
      state = State.Idle;
    }
  }

  if (oldState !== state) {
    console.log("State:", state);

    osc.send(
      "/avatar/parameters/Listening",
      state === State.Listening,
      dummyCallback,
    );

    osc.send(
      "/avatar/parameters/Speaking",
      state === State.Speaking,
      dummyCallback,
    );
  }
}

setInterval(() => {
  getState();
}, 100);

console.log(
  "Program running. Make Sure the Alexa App is visible in the top left of the screen.",
);
