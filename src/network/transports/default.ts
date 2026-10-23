import type { Socket } from "bun";
import {
  ETransportCallback,
  type CallbackDefinitionPairs_t,
  type DataCallbackFn_t,
  type DialOptions_t,
  type DialResult_t,
  type ITransport,
} from "../../interfaces/transport";

export class CDefaultTransport implements ITransport {
  sock?: Socket;

  // callbacks
  callbackPairs: Partial<CallbackDefinitionPairs_t> = {};

  // constructor() {
  //   console.log("def transport up!");
  // }

  /**
   * Safely closes the socket connection.
   */
  Close(): void {
    if (this.sock) {
      this.sock.end();
      this.sock = undefined;
    }
  }

  /**
   * Opens a connection to the target address and attaches event listeners.
   */
  async Dial(opts: DialOptions_t): Promise<DialResult_t> {
    const callCBP = <T extends ETransportCallback>(
      eType: T,
      ...args: Parameters<CallbackDefinitionPairs_t[T]>
    ) => {
      const callback = this.callbackPairs[eType];
      if (callback) {
        (callback as any)(...args);
      }
    };

    try {
      this.sock = await Bun.connect({
        hostname: opts?.address,
        port: opts.port!,
        socket: {
          open: (socket) => {
            callCBP(ETransportCallback.ONCONNECT, socket as any);
          },
          data: (socket, data) => {
            // Trigger both the general onData callback and, if set, the SetOnReceive callback
            callCBP(ETransportCallback.ONDATA, socket as any, data);
          },
          error: (socket, error) => {
            callCBP(ETransportCallback.ONERROR, socket as any, {
              err: error,
            });
          },
          close: (socket) => {
            callCBP(ETransportCallback.ONCLOSE, socket as any);
            this.sock = undefined; // Clear the reference as the connection is closed
          },
        },
      });

      // You can customize this according to the DialResult_t interface structure, for now just return success
      return { success: true } as any;
    } catch (err) {
      return { success: false, error: err } as any;
    }
  }

  /**
   * Checks whether the socket is connected.
   */
  IsConnected(): boolean {
    // In Bun.js sockets, the existence of the sock reference is checked for a definite "connected" state
    return this.sock !== undefined;
  }

  /**
   * Sends data over the open socket.
   */
  async Send(data: ArrayBuffer): Promise<DialResult_t> {
    if (!this.sock) {
      return { success: false, error: "Socket is not connected" } as any;
    }

    try {
      // The Bun.js write method writes data and returns the number of bytes written
      this.sock.write(data);
      return { success: true } as any;
    } catch (err) {
      return { success: false, error: err } as any;
    }
  }

  /**
   * Dynamically registers a callback for all transport events.
   */
  SetCallback<T extends ETransportCallback>(
    eType: T,
    fn: CallbackDefinitionPairs_t[T],
  ): void {
    this.callbackPairs[eType] = fn;
  }
}
