import { send } from "./osc";

export function walk() {
  send("/input/MoveForward", 1);
}
export function stopWalk() {
  send("/input/MoveForward", 0);
}

export function run() {
  send("/input/Run", 1);
}
export function stopRun() {
  send("/input/Run", 0);
}

export function lookRight() {
  send("/input/LookLeft", 0);
  send("/input/LookRight", 1);
}
export function stopLookRight() {
  send("/input/LookRight", 0);
}

export function lookLeft() {
  send("/input/LookRight", 0);
  send("/input/LookLeft", 1);
}
export function stopLookLeft() {
  send("/input/LookLeft", 0);
}

export function stop() {
  send("/input/MoveForward", 0);
  send("/input/Run", 0);
  send("/input/LookLeft", 0);
  send("/input/LookRight", 0);
}
