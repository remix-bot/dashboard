import { OP } from "../api/SocketClient"

export type APIUser = {
  id: string,
  discriminator: string,
  username: string,
  displayName: string,
  avatar: {
    url: string
  },
  connectedTo: string[]
}

export type AuthResponse = {
  user?: APIUser
}

export type SocketMessage = {
  op: OP,
  data: {
    type: string,
    data: APIUser | any
  }
}
