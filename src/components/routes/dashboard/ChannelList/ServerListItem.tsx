import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { SerialisedChannel } from "../../../../lib/api/Player";
import { APIServer } from "../../../../lib/types/APITypes";
import ChannelListItem from "./ChannelListItem";
import { useModal } from "../../../../lib/providers/modal/ModalProvider";
import TextChannelSelector from "./TextChannelSelector";

export type ChannelItemProps = {
  server: APIServer,
  onChannelClick: (server: APIServer, channel: SerialisedChannel) => any,
}

const ServerListItem: Component<ChannelItemProps> = (props) => {
  const [showChannels, setShowChannels] = createSignal(false);

  const initJoin = (channel: SerialisedChannel) => {
    props.onChannelClick(props.server, channel);
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
    <Show when={props.server.icon}>
      <img src={props.server.icon} alt="" style="display: inline-block; vertical-align: middle; border-radius: 4px; object-fit: cover; aspect-ratio: 1/1; height: 1.5rem; width: 1.5rem; margin-right: 0.4rem; margin-left: 0.2rem;" />
    </Show>
    {props.server.name}
    <Show when={showChannels()}>
      <ul class="nested active">
        <For each={props.server.voiceChannels}>
          {(channel) => {
            return <ChannelListItem channel={channel} onClick={initJoin}></ChannelListItem>
          }}
        </For>
      </ul>
    </Show>
  </li>
}

export default ServerListItem;
