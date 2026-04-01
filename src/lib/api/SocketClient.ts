import { SocketMessage } from "../types/APITypes";
import { EventEmitter } from "../util/EventEmitter";
import { APIClient } from "./APIClient";

export enum OP {
  AUTH = "AUTH",
  MSG = "MSG",
  PING = "PING",
}

export class SocketClient extends EventEmitter {
  socket: WebSocket;
  tokenData: { token: string, id: string };
  ping?: number;
  constructor(auth: { token: string, tokenId: string }, config: { url: string }) {
    super();
    this.socket = new WebSocket(config.url);

    this.socket.addEventListener("message", (e) => {
      this.onMessage(e.data);
    });
    this.socket.addEventListener("open", this.auth.bind(this));
    this.tokenData = {
      token: auth.token,
      id: auth.tokenId
    };
  }
  auth() {
    console.log("auth");
    this.send(OP.AUTH, this.tokenData);
  }
  onMessage(message: string) {
    const data = JSON.parse(message) as SocketMessage;
    console.log(data);
    if (data.op !== OP.MSG) {
      console.warn("Unknown OP code: ", data);
      return;
    }
    const payload = data.data.data;
    const type = data.data.type;
    this.emit(type, payload);
  }

  resetPing() {
    if (this.ping) clearTimeout(this.ping);
    this.ping = setTimeout(() => {
      this.send(OP.PING, {});
    }, 10 * 1000);
  }

  send(type: OP, data: Object) {
    this.resetPing();
    const payload = {
      op: type,
      data
    };
    const msg = JSON.stringify(payload);
    this.socket.send(msg);
  }
}
