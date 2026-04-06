import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { ensureAuth } from "../../../lib/providers/auth/AuthProvider";
import { APIServer } from "../../../lib/types/APITypes";
import ServerListItem from "./ServerListItem";

const ChannelList: Component = () => {
  const { user } = ensureAuth();
  const [servers, setServers] = createSignal<APIServer[]>([]);
  const [loading, setLoading] = createSignal(true);
  createEffect(async () => {
    setLoading(true);
    const s = await user()?.getMutualServers();
    if (!s) return setLoading(false);
    setLoading(false);
    setServers(s);
  });
  return <>
    <style id="channelListStyle"></style>
    <ul id="server-list">
      <Show when={!loading()} fallback={<>Loading...</>}>
        <For each={servers()} fallback="No mutual servers with Remix.">
          {
            (server) => {
              return <ServerListItem server={server}></ServerListItem>
            }
          }
        </For>
      </Show>
    </ul>
  </>
}

export default ChannelList;
