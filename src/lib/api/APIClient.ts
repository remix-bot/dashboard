import { AuthResponse } from "../types/APITypes";
import { EventEmitter } from "../util/EventEmitter";
import { SocketClient } from "./SocketClient";
import { User } from "./User";

export class APIClient extends EventEmitter {
  token?: string;
  tokenId?: string;

  socket?: SocketClient;
  websocketUrl = import.meta.env.VITE_WS_ENDPOINT + "/stoat";
  apiUrl = import.meta.env.VITE_API_ENDPOINT;

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
    this.user = new User(res.user, this);
    // express-session should have authenticated this session by now, sending the headers each time shouldn't be necessary
    this.emit("authenticated");
    return true;
  }
  async getLoginCode(userId: string) {
    const res = await this.post("/login", {
      user: userId
    });
    if (!res.code) {
      console.error("invalid response: ", res);
      return null;
    }
    return res.code as string;
  }
  async verifyCode() {
    const res = await this.post("/login/verify");
    if (!res.verified) return null;
    return res.token as { token: string, id: string };
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
      credentials: "include",
      headers: h
    })).json();
  }
  async post(path: string, body?: Object): Promise<any> {
    return (await fetch(this.apiUrl + path, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      // @ts-ignore
      body: JSON.stringify(body)
    })).json();
  }
}
