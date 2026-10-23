import type { Socket } from "net";
import { ETransportCallback } from "../interfaces/transport";
import { CClient } from "../network/client";

const sleep = (seconds: number): Promise<void> => {
  return new Promise((yes, no) => {
    setTimeout(() => {
      yes();
    }, seconds * 1000);
  });
};

const listener = Bun.listen({
  port: 5059,
  hostname: "0.0.0.0",
  socket: {
    data(socket, data) {
      console.log(data);
    },
    open(socket) {
      console.log("Server: New Connection appeared");
      socket.write("Server message: Hello World!");
    },
  },
});

await sleep(1);

const client = new CClient({
  connectionOpts: {
    address: "127.0.0.1",
    port: 5059,
  },
});

client.connection.transport.SetCallback(
  ETransportCallback.ONDATA,
  (sock: Socket, str: Buffer) => {
    console.log("Server: " + str);
  },
);

client.connection.transport.SetCallback(
  ETransportCallback.ONCONNECT,
  (sock: Socket) => {
    console.log("Connected");
  },
);

await client.Connect();
await sleep(0.3);

if (client.IsOpen()) {
  console.log("Conn is open");

  await client.Close();
  console.log("Conn is closed");
} else {
  console.log("Conn is shit");
}

listener.stop();
