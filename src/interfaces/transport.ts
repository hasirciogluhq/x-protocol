export enum EDialError {
  ECONNRESET,
  UNCATEGORIZED,
}

export interface ITransportError {
  err: Error;
}

export type DialResult_t = {
  success: boolean;
  err: ITransportError & { dialErrorType: EDialError };
};

export interface ITransport {
  Dial(): Promise<DialResult_t>;
  Send(data: ArrayBuffer): Promise<DialResult_t>;
  Recv(): Promise<ArrayBuffer>;
  IsConnected(): boolean;
}
