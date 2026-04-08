import { Component, createResource, createSignal, ErrorBoundary, For, Show } from "solid-js";
import { ensureAuth } from "../../../../lib/providers/auth/AuthProvider";
import { APIServer } from "../../../../lib/types/APITypes";
import { useNotifications } from "../../../../lib/providers/notifications/NotificationProvider";
import { SerialisedChannel } from "../../../../lib/api/Player";
import ChannelListItem from "./ChannelListItem";
import "../../../../styles/textchannelselector.css";

export type TextChannelSelectorProps = {
  server?: APIServer,
  onSelect: (channel: SerialisedChannel) => any;
}

const TextChannelSelector: Component<TextChannelSelectorProps> = (props) => {
  const { api } = ensureAuth();
  const { addError } = useNotifications();

  const [channels] = createResource<SerialisedChannel[]>(async () => {
    if (!props.server) return [];
    const channels = await api.authorisedGet("/server/" + props.server.id + "/channels");
    if (channels.error) {
      addError("Text Channel Selection", channels.error, 10000);
      throw new Error(channels.error);
    }
    return (channels as SerialisedChannel[]).filter(c => !c.isVoice);
  }, { initialValue: [] });

  const [selected, setSelected] = createSignal<SerialisedChannel | null>(null);

  const select = (channel: SerialisedChannel) => {
    setSelected(channel);
  }
  const confirm = () => {
    if (!selected()) return console.error("An error occured.");
    props.onSelect(selected()!);
  }
  return <>
    <h1 style="text-align: center; font-size: 120%">Text Channel Selection</h1>
    <ErrorBoundary fallback={<p>An Error occured.</p>}>
      <p>
        Please select a text channel. Messages about the player, like song announcements, are going to be sent in there.
      </p>
      <br />
      <ul class="channels">
        <For each={channels()}>
          {(channel) => {
            return <>
              <ChannelListItem channel={channel} onClick={select} selected={channel.id === selected()?.id}></ChannelListItem>
            </>
          }}
        </For>
      </ul>
      <br />
      <button class="button" id="confirm" disabled={!selected()} onClick={confirm}>Join</button>
    </ErrorBoundary>
  </>
}

export default TextChannelSelector;
