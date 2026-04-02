import { APIUser } from "../types/APITypes";
import { EventEmitter } from "../util/EventEmitter";
import { APIClient } from "./APIClient";
import { Player, SerialisedPlayer } from "./Player";

export class User extends EventEmitter {
  id: string;
  discriminator: string;
  username: string;
  displayName: string;
  avatar: {
    url: string
  };
  connectedTo: string[]
  client: APIClient;
  player?: Player;
  constructor(user: APIUser, client: APIClient) {
    super();

    this.id = user.id;
    this.discriminator = user.discriminator;
    this.username = user.username;
    this.displayName = user.displayName;
    this.avatar = user.avatar;
    this.connectedTo = user.connectedTo;

    this.client = client;
    this.setupEvents();
  }

  setupEvents() {
    const closeJoin = this.client.socket?.on("join", (data: SerialisedPlayer) => {
      this.player = new Player(data);
      this.emit("join", this.player);
    });
    const closeAuth = this.client.socket?.on("auth", (user: APIUser) => {
      // TODO: check for changes in connectedChannel
      console.log("auth", user);
    });
  }
}
