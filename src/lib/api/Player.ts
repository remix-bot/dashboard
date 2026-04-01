export type SerialisedChannel = {
  icon: string,
  displayName: string,
  name: string,
  id: string,
  isVoice: boolean,
  server: {
    name: string,
    description: string,
    channelIds: string[],
    id: string,
    ownerId: string
  },
  serverId: string,
  voiceParticipants: Object[]
}

export type SerialisedPlayer = {
  channel: SerialisedChannel,
  loop: number,
  paused: boolean,
  queue: Object,
  volume: number
}

export class Player {
  loop: number;
  paused: boolean;
  volume: number;
  channel: SerialisedChannel;
  constructor(serialisedPlayer: SerialisedPlayer) {
    this.loop = serialisedPlayer.loop;
    this.paused = serialisedPlayer.paused;
    this.volume = serialisedPlayer.volume;
    this.channel = serialisedPlayer.channel;
  }

  get songLoop() {
    return (this.loop & 2) === 2;
  }
  get queueLoop() {
    return (this.loop & 1) === 1;
  }
}
