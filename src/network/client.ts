import type {
  ClosedCallbackFn_t,
  ConnectedCallbackFn_t,
  DataCallbackFn_t,
  DialResult_t,
  ErrCallbackFn_t,
  ITransport,
} from "../interfaces/transport";
import { CDefaultTransport } from "./transports/default";

export type ConnectionOptions_t = {
  address: string;
  port?: number;
};

export class CConnection {
  transport: ITransport;
  options?: ConnectionOptions_t;

  onData?: DataCallbackFn_t;
  onConnect?: ConnectedCallbackFn_t;
  onClose?: ClosedCallbackFn_t;
  onError?: ErrCallbackFn_t;

  constructor(_opts: ConnectionOptions_t, _t: ITransport) {
    this.transport = _t;
    this.options = _opts;
  }

  IsOpen(): boolean {
    return this.transport.IsConnected();
  }

  async Connect() {
    await this.transport.Dial(this.options);

    return true;
  }

  async Close() {
    return this.transport.Close();
  }
}

export type ClientOptions_t = {
  transport?: ITransport;
  connectionOpts: ConnectionOptions_t;
};

export class CClient {
  opts: ClientOptions_t;
  connection: CConnection;
  clientTransport: ITransport;

  constructor(_opts: ClientOptions_t) {
    this.opts = _opts;
    this.clientTransport = _opts.transport || new CDefaultTransport();
    this.connection = new CConnection(
      this.opts.connectionOpts,
      this.clientTransport,
    );
  }

  IsOpen(): boolean {
    return this.connection.IsOpen();
  }

  async Connect() {
    await this.connection.Connect();

    return true;
  }

  async Close() {
    return this.connection.Close();
  }
}
