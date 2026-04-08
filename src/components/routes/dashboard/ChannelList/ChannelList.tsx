import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { ensureAuth } from "../../../../lib/providers/auth/AuthProvider";
import { APIServer } from "../../../../lib/types/APITypes";
import ServerListItem from "./ServerListItem";
import { SerialisedChannel } from "../../../../lib/api/Player";
import { useModal } from "../../../../lib/providers/modal/ModalProvider";
import TextChannelSelector from "./TextChannelSelector";
import { useNotifications } from "../../../../lib/providers/notifications/NotificationProvider";

const ChannelList: Component = () => {
  const { user, api } = ensureAuth();
  const { open, close } = useModal();
  const { addInfo, addError } = useNotifications();

  const [servers, setServers] = createSignal<APIServer[]>([]);
  const [loading, setLoading] = createSignal(true);
  createEffect(async () => {
    setLoading(true);
    const s = await user()?.getMutualServers();
    if (!s) return setLoading(false);
    setLoading(false);
    setServers(s);
  });

  const [currServer, setCurrServer] = createSignal<APIServer | undefined>();
  var channel: SerialisedChannel | undefined;

  const selectChannel = (server: APIServer, c: SerialisedChannel) => {
    channel = c;
    setCurrServer(server);
  }
  const initJoin = async (voice: SerialisedChannel, text: SerialisedChannel) => {
    const notif = addInfo("Joining", "Attempting to join; View progress in the selected text channel");
    //const data = await api.post("/voice/" + voice.id + "/join", { text: text.id });

  }

  createEffect(() => {
    const server = currServer();
    if (!server) return;

    const selector = <TextChannelSelector server={server} onSelect={(c) => {
      initJoin(channel!, c);
      close();
      setCurrServer(undefined);
    }}></TextChannelSelector>;
    open(selector, () => {
      setCurrServer(undefined);
    });
  });
  return <>
    <style id="channelListStyle"></style>
    <ul id="server-list">
      <Show when={!loading()} fallback={<>Loading...</>}>
        <For each={servers()} fallback="No mutual servers with Remix.">
          {
            (server) => {
              return <ServerListItem server={server} onChannelClick={selectChannel}></ServerListItem>
            }
          }
        </For>
      </Show>
    </ul>
  </>
}

export default ChannelList;
