import { send } from "osc";
import { keyTap } from "robotjs";

let muted = false;

export async function handleNormalInput(addr, value) {
  switch (addr.slice(19)) {
    // Mute button
    case "MuteButton": {
      if (value) {
        console.log("Toggling Mute");
        muted = !muted;
        send("/input/Voice", muted ? 1 : 0);
      }

      break;
    }

    // Listen button
    case "Listen": {
      if (value) {
        console.log("Toggling Listen");
        keyTap("a", ["control", "shift"]);
      }
      break;
    }

    // Vol Up button
    case "VolUp": {
      // todo
      break;
    }

    // Vol Down button
    case "VolDown": {
      // todo
      break;
    }
  }
}
