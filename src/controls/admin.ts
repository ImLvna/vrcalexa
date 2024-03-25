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
      send("/input/LookLeft", value ? 1 : 0);

      break;
    }

    // Listen button
    case "Listen": {
      // Turn right
      send("/input/LookRight", value ? 1 : 0);
      break;
    }

    // Vol Up button
    case "VolUp": {
      // Move Forward
      send("/input/Run", value ? 1 : 0);
      send("/input/MoveForward", value ? 1 : 0);
      break;
    }
  }
}
