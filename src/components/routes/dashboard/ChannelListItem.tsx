import { Component } from "solid-js";
import { SerialisedChannel } from "../../../lib/api/Player";

export type ChannelListItemProps = {
  channel: SerialisedChannel
}

const ChannelListItem: Component<ChannelListItemProps> = (props) => {
  // TODO: join process initiation
  if (props.channel.icon) {
    const css = document.getElementById("channelListStyle") as HTMLStyleElement;
    if (!css) throw "unable to find style element";
    css.sheet?.insertRule("li[itemid='" + props.channel.id + "']::before {content:''; display: inline-block; position: relative; top: 0.4rem; background-image:url(" + props.channel.icon + "); background-size: cover; aspect-ratio: 1/1; height: 1.5rem; margin-right: 0.2rem; margin-left: 0.2rem; padding: 0; }");
  }
  return <li style={{
    "list-style": "inside"
  }} itemId={props.channel.id}>
    {props.channel.displayName || props.channel.name}
  </li>
}

export default ChannelListItem;
