import { APIUser } from "../types/APITypes";

export class User {
  id: string;
  discriminator: string;
  username: string;
  displayName: string;
  avatar: {
    url: string
  }
  constructor(user: APIUser) {
    this.id = user.id;
    this.discriminator = user.discriminator;
    this.username = user.username;
    this.displayName = user.displayName;
    this.avatar = user.avatar;
  }
}
