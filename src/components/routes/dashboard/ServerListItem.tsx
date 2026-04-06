import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { SerialisedChannel } from "../../../lib/api/Player";
import { APIServer } from "../../../lib/types/APITypes";
import ChannelListItem from "./ChannelListItem";

export type ChannelItemProps = {
  server: APIServer
}

const ServerListItem: Component<ChannelItemProps> = (props) => {
  const [showChannels, setShowChannels] = createSignal(false);

  if (props.server.icon) {
    const css = document.getElementById("channelListStyle") as HTMLStyleElement;
    if (!css) throw "unable to find style element";
    css.sheet?.insertRule("li[itemid='" + props.server.id + "']::before {content:''; display: inline-block; position: relative; top: 0.4rem; background-image:url(" + props.server.icon + "); background-size: cover; aspect-ratio: 1/1; height: 1.5rem; margin-right: 0.2rem; margin-left: 0.2rem; padding: 0; }");
  }
  return <li itemId={props.server.id} style={{
    "list-style": (props.server.icon || props.server.voiceChannels.length > 0) ? "none" : "initial"
  }}>
    <Show when={props.server.voiceChannels.length > 0}>
      <span class="caret" onClick={(e) => {
        if (props.server.voiceChannels.length <= 0) return;
        setShowChannels(!showChannels());
        e.currentTarget.classList.toggle("caret-down");
      }}></span>
    </Show>
    {props.server.name}
    <Show when={showChannels()}>
      <ul class="nested active">
        <For each={props.server.voiceChannels}>
          {(channel) => {
            return <ChannelListItem channel={channel}></ChannelListItem>
          }}
        </For>
      </ul>
    </Show>
  </li>
}

export default ServerListItem;
