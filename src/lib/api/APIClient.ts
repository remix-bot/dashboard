import { SocketClient } from "./SocketClient";

export class APIClient {
  token?: string;
  tokenId?: string;

  socket?: SocketClient;
  websocketUrl = "ws://localhost:3000/stoat";
  apiUrl = "http://localhost:3000";

  authenticated = false;

  userId?: string;
  constructor() {

  }

  async connect(apiToken: string, tokenId: string) {
    this.socket = new SocketClient({
      token: apiToken, tokenId
    }, {
      url: this.websocketUrl
    });
    this.token = apiToken;
    this.tokenId = tokenId;

    const res = await this.get("/info", this.createHeaders());
    if (!res.user) return false;
    this.authenticated = true;
    this.userId = res.user;
    return true;
  }

  createHeaders() {
    if (!this.authenticated) return undefined;
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
