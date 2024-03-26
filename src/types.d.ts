declare module "node-osc" {
  class Client {
    constructor(host: string, port: number);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    send(address: string, ...args: any[]): void;
  }

  class Server {
    constructor(port: number, host: string, callback?: () => void);
    on(
      event: "message",
      callback: (data: [address: string, value: boolean | string]) => void,
    ): void;
  }
}
