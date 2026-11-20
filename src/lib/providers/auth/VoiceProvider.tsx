import { createContext, useContext, ParentComponent, createEffect, onCleanup, Accessor, createSignal } from "solid-js";
import { useAuth } from "./AuthProvider";
import { Player, SerialisedChannel, SerialisedQueue } from "../../api/Player";
import { createStore } from "solid-js/store";
import { User } from "../../api/User";
import { GenericAPIResponse } from "../../types/APITypes";

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

  setVol: (v: number) => Promise<GenericAPIResponse>;
  pause: () => Promise<GenericAPIResponse>;
  resume: () => Promise<GenericAPIResponse>;
  skip: () => Promise<GenericAPIResponse>;

  addQuery: (query: string) => Promise<GenericAPIResponse>;
  leave: (channel: string) => Promise<GenericAPIResponse>;
}

export const VoiceContext = createContext<VoiceContextType>();

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error("useVoice: cannot find a VoiceContext");
  return context;
}

const VoiceProvider: ParentComponent = (props) => {
  const { user, api } = useAuth();

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
    },
  });

  const addQuery = async (query: string) => {
    if ((user()?.connectedTo.length || 0) === 0) return { error: "Not connected to a voice channel" };
    return await api.post("/dashboard/queue", {
      query
    });
  }

  const leave = async  (c: string) => {
    if ((user()?.connectedTo.length || 0) === 0) return { error: "Not connected to a voice channel" };
    return await api.post("/voice/" + c + "/leave");
  }

  const setVol = async (v: number) => {
    if ((user()?.connectedTo.length || 0) === 0) return { error: "Not connected to a voice channel" };
    return await api.post("/dashboard/control", {
      action: "volume",
      volume: v
    });
  }
  const pause = async () => {
    if ((user()?.connectedTo.length || 0) === 0) return { error: "Not connected to a voice channel" };
    return await api.post("/dashboard/control", {
      action: "pausePlayback"
    });
  }
  const resume = async () => {
    if ((user()?.connectedTo.length || 0) === 0) return { error: "Not connected to a voice channel" };
    return await api.post("/dashboard/control", {
      action: "resumePlayback"
    });
  }
  const skip = async () => {
    if ((user()?.connectedTo.length || 0) === 0) return { error: "Not connected to a voice channel" };
    return await api.post("/dashboard/control", {
      action: "skip"
    });
  }

  createEffect(() => {
    const u = user();
    if (!u) return;

    if (u.player) {
      if (u.player.channel) setChannel(u.player.channel);
      setPlayer("loop", u.player.loop);
      setPlayer("paused", u.player.paused);
      setPlayer("volume", u.player.volume);
      setPlayer("started", u.player.started);
      setPlayer("timeDiff", u.player.timeDiff);
      setPlayer("queue", u.player.queue);
    }

    const subJoin = u.on("join", (p: Player) => {
      if (p?.channel) setChannel(p.channel);
      if (p) {
        setPlayer("loop", p.loop);
        setPlayer("paused", p.paused);
        setPlayer("volume", p.volume);
        setPlayer("started", p.started);
        setPlayer("timeDiff", p.timeDiff);
        setPlayer("queue", p.queue);
      }
    });
    const subLeave = u.on("leave", (_channel: string) => {
      setChannel(null);
      setPlayer({
        loop: 0,
        paused: false,
        volume: 100,
        started: 0,
        timeDiff: 0,
        queue: {
          current: undefined,
          data: []
        }
      });
    });
    const subUpdate = u.on("playerUpdate", (p: Player) => {
      if (p?.channel) setChannel(p.channel);
      if (p) {
        setPlayer("loop", p.loop);
        setPlayer("paused", p.paused);
        setPlayer("volume", p.volume);
        setPlayer("started", p.started);
        setPlayer("timeDiff", p.timeDiff);
        setPlayer("queue", p.queue);
      }
    });
    onCleanup(() => {
      subJoin.close();
      subLeave.close();
      subUpdate.close();
    });
  });

  return <VoiceContext.Provider value={{
    channel,
    player,
    setVol,
    pause,
    skip,
    resume,
    addQuery,
    leave
  }}>
    {props.children}
  </VoiceContext.Provider>
}

export default VoiceProvider;
