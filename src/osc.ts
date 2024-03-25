import { Client, Server } from "node-osc";

export const client = new Client("127.0.0.1", 9000);
export const server = new Server(9001, "127.0.0.1");

export const dummyCallback = (err: Error | null) => {};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function send(addr: string, value: any) {
  client.send(addr, value, dummyCallback);
}
