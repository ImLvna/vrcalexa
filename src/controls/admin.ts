import {
  lookLeft,
  lookRight,
  run,
  stopLookLeft,
  stopLookRight,
  stopRun,
  stopWalk,
  walk,
} from "../movement";
import { send } from "../osc";

export function disableAdminMode() {
  console.log("Admin Mode Off");
  send("/avatar/parameters/AdminMode", false);
  send("/input/MoveForward", 0);
  send("/input/LookLeft", 0);
  send("/input/LookRight", 0);
  send("/input/Run", 0);
}

export function enableAdminMode() {
  console.log("Admin Mode On");
  send("/avatar/parameters/AdminMode", true);
}

export async function handleAdminInput(addr, value) {
  switch (addr.slice(19)) {
    // Mute button
    case "MuteButton": {
      // Turn left
      (value ? lookLeft : stopLookLeft)();

      break;
    }

    // Listen button
    case "Listen": {
      // Turn right
      (value ? lookRight : stopLookRight)();
      break;
    }

    // Vol Up button
    case "VolUp": {
      // Move Forward
      (value ? walk : stopWalk)();
      (value ? run : stopRun)();
      break;
    }
  }
}
