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
    this.fetchPlayer();
    this.setupEvents();
  }

  async fetchPlayer() {
    const channel = this.connectedTo[0];
    if (!channel) return;
    const res = await this.client.authorisedGet("/player/" + channel);
    console.log("player", res);
    this.player = new Player(res);
    this.emit("join", this.player);
  }
  setupEvents() {
    const closeJoin = this.client.socket?.on("join", (data: SerialisedPlayer) => {
      this.player = new Player(data);
      this.emit("join", this.player);
    });
    const closeLeave = this.client.socket?.on("leave", (channel: string) => {
      if (this.player?.channel.id === channel) this.player = undefined;
      const idx = this.connectedTo.findIndex(e => e === channel);
      if (idx !== -1) {
        this.connectedTo.splice(idx, 1);
      }
      this.emit("leave", channel);
    });
    const closeAuth = this.client.socket?.on("auth", (user: APIUser) => {
      // TODO: check for changes in connectedChannel
      console.log("auth", user);
    });
  }
}
