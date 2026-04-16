import { createContext, useContext, ParentComponent, createEffect, Accessor, createSignal } from "solid-js";
import { useAuth } from "./AuthProvider";
import { Player, SerialisedChannel, SerialisedQueue } from "../../api/Player";
import { createStore } from "solid-js/store";
import { User } from "../../api/User";

export type PlayerStore = {
  loop: number;
  paused: boolean;
  volume: number;
  /*queue: {
    current: null;
    data: [];
    };*/
  started: number;
  timeDiff: number;
  queue: SerialisedQueue;
}

export type VoiceContextType = {
  channel: Accessor<SerialisedChannel | null>;
  player: PlayerStore;
}

export const VoiceContext = createContext<VoiceContextType>();

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error("useVoice: cannot find a VoiceContext");
  return context;
}

const VoiceProvider: ParentComponent = (props) => {
  const { user } = useAuth();

  const [channel, setChannel] = createSignal<SerialisedChannel | null>(null);
  const [player, setPlayer] = createStore<PlayerStore>({
    loop: 0,
    paused: false,
    volume: 100,
    /*queue: {
      current: null,
      data: []
      },*/
    started: 0,
    timeDiff: 0,
    queue: {
      current: undefined,
      data: []
    }
  });

  const init = (u: User) => {
    u.on("join", (player: Player) => {
      setChannel(player.channel);
    });
    u.on("leave", (channel: string) => {
      setChannel(null);
      setPlayer({
        loop: 0,
        paused: false,
        volume: 100,
        /*queue: {
          current: null,
          data: []
          },*/
        started: 0,
        timeDiff: 0,
        queue: {
          current: undefined,
          data: []
        }
      });
    });
    u.on("playerUpdate", (p: Player) => {
      setPlayer({
        loop: p.loop,
        paused: p.paused,
        volume: p.volume,
        started: p.started,
        timeDiff: p.timeDiff,
        queue: p.queue
      });
    });
  }

  createEffect(() => {
    const u = user();
    if (!u) return;
    init(u);
  });

  return <VoiceContext.Provider value={{
    channel,
    player
  }}>
    {props.children}
  </VoiceContext.Provider>
}

export default VoiceProvider;
