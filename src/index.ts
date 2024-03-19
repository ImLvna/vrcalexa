import { Client } from "node-osc";
import { getPixelColor } from "robotjs";

enum State {
  Idle = "Idle",
  Listening = "Listening",
  Speaking = "Speaking",
}

let state = State.Idle;

const osc = new Client("127.0.0.1", 9000);

const dummyCallback = (err: Error | null) => {};

async function getState() {
  const oldState = state;

  const listenPix = await getPixelColor(50, 50);

  if (listenPix.startsWith("163")) {
    state = State.Listening;
  } else {
    const speakPix = await getPixelColor(0, 144);

    if (speakPix.startsWith("00")) {
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
