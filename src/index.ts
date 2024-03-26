import { registerMessageHandler } from "controls";
import { registerRespawnHandler } from "./respawn";
import { getState } from "./screen";

setInterval(() => {
  getState();
}, 100);

registerMessageHandler();
registerRespawnHandler();

console.log(
  "Program running. Make Sure the Alexa App is visible in the top left of the screen.",
);
