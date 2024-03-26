import { send, server } from "osc";
import {
  lookLeft,
  lookRight,
  run,
  stop,
  stopLookLeft,
  stopLookRight,
  stopRun,
  stopWalk,
  walk,
} from "./movement";
import { sleep } from "./util";

let shouldRespawn = true;
let isBlackCat = true;

export async function respawn() {
  if (!shouldRespawn) return;
  console.log("Respawning...");

  if (isBlackCat) {
    console.log("Black Cat Mode");

    const int = setInterval(() => {
      send("/input/chatbox", "Respawning... Assuming in black cat");
    }, 1500);

    walk();
    run();
    await sleep(670);
    lookRight();
    await sleep(300);
    stopLookRight();
    await sleep(3000);

    // In the middle of the open area

    lookLeft();
    await sleep(500);
    stopLookLeft();

    await sleep(2000);

    lookLeft();

    await sleep(250);
    stopLookLeft();

    await sleep(2500);

    lookRight();

    await sleep(250);

    stopLookRight();

    await sleep(500);

    stopWalk();
    stopRun();

    lookRight();

    await sleep(750);

    stopLookRight();

    stop();

    clearInterval(int);
    send("/input/chatbox", "");
  }
}

export function registerRespawnHandler() {
  server.on("message", ([addr, value]) => {
    if (addr === "/avatar/parameters/isBlackCat") {
      isBlackCat = value as boolean;
      return;
    }

    if (addr === "/avatar/parameters/shouldRespawn") {
      shouldRespawn = value as boolean;
      return;
    }

    if (addr === "/avatar/change") {
      if (value !== "avtr_6e55a635-3813-4996-86f9-3968477052af") return;
      console.log("Avatar swapped to alexa");
      respawn();
    }
  });
}
