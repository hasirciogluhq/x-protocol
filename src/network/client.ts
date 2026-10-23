import { DialResult_t, ITransport } from "../interfaces/transport";

export type ConnectionOptions_t = {
  address: string;
  port?: number;
};

export class CConnection {
  transport: ITransport;
  options?: ConnectionOptions_t;

  constructor(_t: ITransport) {
    this.transport = _t;
  }

  IsOpen(): boolean {
    return this.transport.IsConnected();
  }

  async Connect() {
    await this.transport.Dial();

    return true;
  }
}
