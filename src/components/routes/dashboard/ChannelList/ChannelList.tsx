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
  const initJoin = (voice: SerialisedChannel, text: SerialisedChannel) => {

  }

  createEffect(() => {
    const server = currServer();
    if (!server) return;

    const selector = <TextChannelSelector server={server} onSelect={(c) => {
      console.log(c, "voice:", channel);
      close();
    }}></TextChannelSelector>;
    open(selector);
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
