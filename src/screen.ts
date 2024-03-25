import { getPixelColor, getScreenSize } from "robotjs";
import { send } from "./osc";

const screenSize = getScreenSize();

export const coordinates =
  screenSize.width === 1280 && screenSize.height === 800
    ? {
        listen: [50, 50],
        speak: [50, 190],
      }
    : screenSize.width === 1366 && screenSize.height === 768
      ? {
          listen: [50, 25],
          speak: [50, 95],
        }
      : screenSize.width === 1280 && screenSize.height === 720
        ? {
            listen: [50, 50],
            speak: [50, 145],
          }
        : null;

if (!coordinates) throw new Error("Screen size not supported");
console.log(`Using Screen Size: ${screenSize.width}x${screenSize.height}`);

async function getListenPix() {
  return await getPixelColor(coordinates.listen[0], coordinates.listen[1]);
}

async function getSpeakPix() {
  return await getPixelColor(coordinates.speak[0], coordinates.speak[1]);
}

enum State {
  Idle = "Idle",
  Listening = "Listening",
  Speaking = "Speaking",
}

let state = State.Idle;

let warnNotShownTimeout = false;

export async function getState() {
  const oldState = state;

  const listenPix = await getListenPix();

  if (listenPix.startsWith("163")) {
    state = State.Listening;
  } else if (listenPix !== "74ddfe") {
    if (!warnNotShownTimeout) {
      console.error(
        "Alexa App is not visible. Please leave at least the top left corner of the app visible.",
      );
      warnNotShownTimeout = true;
      setTimeout(() => {
        warnNotShownTimeout = false;
      }, 5000);
    }
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

    send("/avatar/parameters/Listening", state === State.Listening);

    send("/avatar/parameters/Speaking", state === State.Speaking);
  }
}
