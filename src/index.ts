import { Client, Server } from "node-osc";
import { getPixelColor, getScreenSize, keyTap } from "robotjs";

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

const client = new Client("127.0.0.1", 9000);
const server = new Server(9001, "127.0.0.1");

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

    client.send(
      "/avatar/parameters/Listening",
      state === State.Listening,
      dummyCallback,
    );

    client.send(
      "/avatar/parameters/Speaking",
      state === State.Speaking,
      dummyCallback,
    );
  }
}

setInterval(() => {
  getState();
}, 100);

let volUp = false;
let volDown = false;
let adminMode = false;
let firstAdminMode = true;

server.on("message", ([addr, value]) => {
  if (addr.startsWith("/avatar/parameters/")) {
    switch (addr.slice(19)) {
      case "VolUp": {
        if (!adminMode) {
          volUp = value;
          if (value) console.log("Volume Up");
        }
        break;
      }
      case "VolDown": {
        volDown = value;
        if (!adminMode) {
          if (value) console.log("Volume Down");
        }
        break;
      }
    }
    let enableAdminMode = 0;

    if (addr.slice(19).startsWith("Vol")) {
      if (!adminMode && volUp && volDown) {
        enableAdminMode = 1;
      } else if (adminMode && volUp && volDown) {
        enableAdminMode = -1;
      }
    }

    if (addr.slice(19).startsWith("AdminMode"))
      enableAdminMode = value ? 1 : -1;

    if (enableAdminMode === 1) {
      adminMode = true;
      firstAdminMode = true;
      console.log("Admin Mode: ", adminMode);
      client.send("/avatar/parameters/AdminMode", adminMode, dummyCallback);
    } else if (enableAdminMode === -1) {
      adminMode = false;
      console.log("Admin Mode: ", adminMode);
      client.send("/avatar/parameters/AdminMode", adminMode, dummyCallback);
      client.send("/input/MoveForward", 0, dummyCallback);
      client.send("/input/LookLeft", 0, dummyCallback);
      client.send("/input/LookRight", 0, dummyCallback);
    }

    if (firstAdminMode) {
      firstAdminMode = false;
      return;
    }

    switch (addr.slice(19)) {
      // Mute button
      case "MuteButton": {
        // Turn left
        if (adminMode) {
          if (value) {
            console.log("Turning Left");
            client.send("/input/LookLeft", 1, dummyCallback);
          } else client.send("/input/LookLeft", 0, dummyCallback);
        } else {
          console.log("Toggling Mute");
          keyTap("v");
        }
        break;
      }

      // Listen button
      case "Listen": {
        // Turn right
        if (adminMode) {
          if (value) {
            console.log("Turning right");
            client.send("/input/LookRight", 1, dummyCallback);
          } else client.send("/input/LookRight", 0, dummyCallback);
        } else {
          // todo: implement listen button
        }
        break;
      }

      // Vol Up button
      case "VolUp": {
        // Move Forward
        if (adminMode) {
          if (value) {
            console.log("Moving Forward");
            client.send("/input/MoveForward", 1, dummyCallback);
          } else client.send("/input/MoveForward", 0, dummyCallback);
        } else {
          // Todo
        }
        break;
      }
    }
  }
});

console.log(
  "Program running. Make Sure the Alexa App is visible in the top left of the screen.",
);
