import { APIUser, SocketMessage } from "../types/APITypes";
import { EventEmitter } from "../util/EventEmitter";
import { APIClient } from "./APIClient";

export enum OP {
  AUTH = "AUTH",
  MSG = "MSG",
  PING = "PING",
}

export class SocketClient extends EventEmitter {
  socket?: WebSocket;
  tokenData: { token: string, id: string };
  ping?: number;
  endpointUrl: string;

  reconnectTimeout?: number;
  RECONNECT_AFTER = 1000;
  constructor(auth: { token: string, tokenId: string }, config: { url: string }) {
    super();

    this.endpointUrl = config.url;
    this.connect();

    this.tokenData = {
      token: auth.token,
      id: auth.tokenId
    };
  }
  auth() {
    console.log("auth");
    this.send(OP.AUTH, this.tokenData);
  }
  onAuth(user: APIUser) {
    this.emit("auth", user);
  }
  connect() {
    this.socket = new WebSocket(this.endpointUrl);

    // TODO: unsubscribe on close
    this.socket.addEventListener("message", (e) => {
      this.onMessage(e.data);
    });
    this.socket.addEventListener("open", this.auth.bind(this));
    this.socket.addEventListener("error", (e) => {
      console.warn("Websocket Error: ", e);
    });
    this.socket.addEventListener("close", this.reconnect.bind(this));
  }
  reconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.RECONNECT_AFTER);
  }

  onMessage(message: string) {
    const data = JSON.parse(message) as SocketMessage;
    console.log(data);
    if (data.op === OP.AUTH) {
      this.onAuth(data.data.data as APIUser);
      return;
    }
    if (data.op === OP.PING) {
      return;
    }
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
    this.socket?.send(msg);
  }
}
