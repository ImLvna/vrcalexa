import { registerMessageHandler } from "controls";
import { getState } from "./screen";

setInterval(() => {
  getState();
}, 100);

registerMessageHandler();

console.log(
  "Program running. Make Sure the Alexa App is visible in the top left of the screen.",
);
