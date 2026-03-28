export type APIUser = {
  id: string,
  discriminator: string,
  username: string,
  displayName: string,
  avatar: {
    url: string
  }
}

export type AuthResponse = {
  user?: APIUser
}
