import { server } from "osc";
import { disableAdminMode, enableAdminMode, handleAdminInput } from "./admin";
import { handleNormalInput } from "./normal";

export function registerMessageHandler() {
  let volUp = false;
  let volDown = false;

  let adminMode = false;
  let firstAdminMode = true;

  server.on("message", ([addr, value]) => {
    if (addr.startsWith("/avatar/parameters/")) {
      switch (addr.slice(19)) {
        case "VolUp": {
          if (!adminMode) volUp = value as boolean;
          break;
        }
        case "VolDown": {
          volDown = value as boolean;
          break;
        }
      }
      let toggleAdminMode = 0;

      if (addr.slice(19).startsWith("Vol")) {
        if (!adminMode && volUp && volDown) {
          toggleAdminMode = 1;
        } else if (adminMode && volUp && volDown) {
          toggleAdminMode = -1;
        }
      }

      if (toggleAdminMode === 1) {
        adminMode = true;
        firstAdminMode = true;
        enableAdminMode();
      } else if (toggleAdminMode === -1) {
        adminMode = false;
        disableAdminMode();
      }

      if (firstAdminMode) {
        firstAdminMode = false;
        return;
      }

      if (adminMode) handleAdminInput(addr, value);
      else handleNormalInput(addr, value);
    }
  });
}
