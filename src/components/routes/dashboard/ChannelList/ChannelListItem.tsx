import { Component, Show } from "solid-js";
import { SerialisedChannel } from "../../../../lib/api/Player";
import { useModal } from "../../../../lib/providers/modal/ModalProvider";

export type ChannelListItemProps = {
  channel: SerialisedChannel,
  onClick: (channel: SerialisedChannel) => any,
  selected?: boolean
}

const ChannelListItem: Component<ChannelListItemProps> = (props) => {
  return <li style={{
    "list-style": "inside"
  }} itemId={props.channel.id} onClick={() => {
    props.onClick(props.channel);
  }} class={props.selected ? "selected" : ""}>
    <Show when={props.channel.icon}>
      <img src={props.channel.icon} alt="" style="display: inline-block; vertical-align: middle; border-radius: 3px; object-fit: cover; aspect-ratio: 1/1; height: 1.2rem; width: 1.2rem; margin-right: 0.3rem;" />
    </Show>
    {props.channel.displayName || props.channel.name}
  </li>
}

export default ChannelListItem;
