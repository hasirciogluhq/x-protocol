import type { Socket } from "net";

export enum EDialError {
  ECONNRESET,
  UNCATEGORIZED,
}

export interface ITransportError {
  err: Error;
}

export type DialOptions_t = {
  address: string;
  port?: number;
};

export type DialResult_t = {
  success: boolean;
  err: ITransportError & { dialErrorType: EDialError };
};

export type DataCallbackFn_t = (sock: Socket, data: Buffer) => void;
export type ConnectedCallbackFn_t = (sock: Socket) => void;
export type ErrCallbackFn_t = (sock: Socket, err?: ITransportError) => void;
export type ClosedCallbackFn_t = ErrCallbackFn_t;

export enum ETransportCallback {
  ONCONNECT = "onConnect",
  ONERROR = "onError",
  ONCLOSE = "onClose",
  ONDATA = "onData",
}

export type CallbackDefinitionPairs_t = {
  [ETransportCallback.ONCONNECT]: ConnectedCallbackFn_t;
  [ETransportCallback.ONCLOSE]: ClosedCallbackFn_t;
  [ETransportCallback.ONDATA]: DataCallbackFn_t;
  [ETransportCallback.ONERROR]: ErrCallbackFn_t;
};

export interface ITransport {
  // callbacks
  onConnected?: ConnectedCallbackFn_t;
  onError?: ErrCallbackFn_t;
  onData?: DataCallbackFn_t;
  onClosed?: ClosedCallbackFn_t;

  // main function shits
  Dial(opts?: DialOptions_t): Promise<DialResult_t>;
  Close(): void;
  Send(data: ArrayBuffer): Promise<DialResult_t>;
  IsConnected(): boolean;

  SetCallback<T extends ETransportCallback>(
    eType: T,
    fn: CallbackDefinitionPairs_t[T],
  ): void;
}
