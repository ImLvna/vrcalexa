declare module "node-osc" {
  class Client {
    constructor(host: string, port: number);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    send(address: string, ...args: any[]): void;
  }
}
