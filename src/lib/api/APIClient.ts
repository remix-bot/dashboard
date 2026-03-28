import { AuthResponse } from "../types/APITypes";
import { EventEmitter } from "../util/EventEmitter";
import { SocketClient } from "./SocketClient";
import { User } from "./User";

export class APIClient extends EventEmitter {
  token?: string;
  tokenId?: string;

  socket?: SocketClient;
  websocketUrl = "ws://localhost:3000/stoat";
  apiUrl = "http://localhost:3000";

  authenticated = false;

  userId?: string;
  user?: User;
  constructor() {
    super();
  }

  async connect(apiToken: string, tokenId: string) {
    this.socket = new SocketClient({
      token: apiToken, tokenId
    }, {
      url: this.websocketUrl
    });
    this.token = apiToken;
    this.tokenId = tokenId;

    const res = await this.get("/info", this.createHeaders()) as AuthResponse;
    if (!res.user) return false;

    this.authenticated = true;
    this.userId = res.user.id;
    this.user = new User(res.user);
    // express-session should have authenticated this session by now, sending the headers each time shouldn't be necessary
    this.emit("authenticated");
    return true;
  }

  createHeaders() {
    return {
      token: this.token,
      tokenId: this.tokenId
    };
  }

  async get(path: string, headers?: Object): Promise<any> {
    // @ts-ignore
    const h = new Headers({
      "Content-Type": "application/json",
      ...headers
    });
    return (await fetch(this.apiUrl + path, {
      method: "GET",
      headers: h
    })).json();
  }
}
