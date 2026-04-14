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
  playing: boolean,
  queue: SerialisedQueue,
  volume: number,
  started: number, // ISO JS timestamp
  timeDiff: number, // time elapsed before the last restart (add onto started)
}
export type SerialisedVideo = {
  title: string,
  url: string,
  videoId: string,
  type: "radio" | "external" | "video",
  duration: string,
  description: string,
  thumbnail: string,
  artist: {
    name: string,
    url: string,
  }
}
export type SerialisedQueue = {
  current: SerialisedVideo | undefined,
  data: SerialisedVideo[]
}

export class Player {
  loop!: number;
  paused!: boolean;
  playing!: boolean;
  volume!: number;
  channel!: SerialisedChannel;
  started!: number;
  timeDiff!: number;
  queue!: SerialisedQueue;
  constructor(serialisedPlayer: SerialisedPlayer) {
    this.deserialise(serialisedPlayer);
  }
  deserialise(serialisedPlayer: SerialisedPlayer) {
    this.loop = serialisedPlayer.loop;
    this.paused = serialisedPlayer.paused;
    this.volume = serialisedPlayer.volume;
    this.channel = serialisedPlayer.channel;
    this.started = serialisedPlayer.started;
    this.timeDiff = serialisedPlayer.timeDiff;
    this.playing = serialisedPlayer.playing;
    this.queue = serialisedPlayer.queue;
  }

  /** @description in seconds */
  get elapsedTime() {
    return ((this.paused) ? this.timeDiff : (Date.now() - this.started) + this.timeDiff) / 1000;
  }
  get songLoop() {
    return (this.loop & 2) === 2;
  }
  get queueLoop() {
    return (this.loop & 1) === 1;
  }
}
