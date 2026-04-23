import { SerialisedChannel } from "../api/Player"
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

export type APIServer = {
  name: string,
  id: string,
  icon?: string, // url
  voiceChannels: SerialisedChannel[]
}

export type AuthResponse = {
  user?: APIUser
}
export type GenericAPIResponse = {
  error?: string,
  message?: string,
}

export type SocketMessage = {
  op: OP,
  data: {
    type: string,
    data: APIUser | any
  }
}
