import { createContext, useContext, ParentComponent, createEffect, Accessor, createSignal } from "solid-js";
import { ensureAuth } from "./AuthProvider";
import { Player, SerialisedChannel } from "../../api/Player";

export type VoiceContextType = {
  channel: Accessor<SerialisedChannel | null>;
}

export const VoiceContext = createContext<VoiceContextType>();

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error("useVoice: cannot find a VoiceContext");
  return context;
}

const VoiceProvider: ParentComponent = (props) => {
  const { user } = ensureAuth();

  const [channel, setChannel] = createSignal<SerialisedChannel | null>(null);

  createEffect(() => {
    const u = user();
    if (!u) return;
    u.on("join", (player: Player) => {
      setChannel(player.channel);
    });
    u.on("leave", (channel: string) => {
      setChannel(null);
    });
  });

  return <VoiceContext.Provider value={{
    channel
  }}>
    {props.children}
  </VoiceContext.Provider>
}

export default VoiceProvider;
