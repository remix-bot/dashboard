import { Component, createEffect, createSignal } from "solid-js";
import { NotificationType } from "./NotificationProvider";

export type NotificationElementProps = {
  type: NotificationType,
  title: string,
  description: string,
  time?: number, // in ms
  onRemove: (id: string) => void,
  id: string,
}

const NotificationElement: Component<NotificationElementProps> = (props) => {
  const [transform, setTransform] = createSignal("");
  const remove = () => {
    setTimeout(() => {
      props.onRemove(props.id);
    }, 100);
    setTransform("scale(0.7)");
  }
  var timeout: number | null = null;
  const resetTimer = () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      remove();
    }, props.time);
  }

  createEffect(() => {
    // subscribe to all prop changes
    props.description;
    props.title;
    props.type;
    props.time;
    resetTimer();
  });

  return <div class={"notification " + props.type} style={{
    transform: transform()
  }}>
    <h1 class="notif-title">{props.title}</h1>
    <div class="notif-content">
      {props.description}
    </div>
    <div class="closebtn" onClick={() => {
      remove();
    }}>
      <i class="fa-solid fa-xmark"></i>
    </div>
  </div>
}

export default NotificationElement;
