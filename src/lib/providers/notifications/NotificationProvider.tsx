import "../../../styles/notifications.css";

import { createEffect, createSignal, For, ParentComponent, useContext } from "solid-js";
import { createContext } from "solid-js"
import NotificationElement from "./NotificationElement";
import { JSX } from "solid-js";

export type NotificationContextType = {
  addInfo: (title: string, description: string, time?: 5000) => void;
  addError: (title: string, description: string, time?: 5000) => void;
}

export const NotificationContext = createContext<NotificationContextType>();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifiations: cannot find a NotificationContext");
  return context;
}

export enum NotificationType {
  INFO = "info",
  ERROR = "error"
}

const NotificationProvider: ParentComponent = (props) => {
  const [notifications, setNotifications] = createSignal<{ id: string, element: JSX.Element }[]>([]);

  const handleRemove = (id: string) => {
    setNotifications((prev) => {
      const replacement = [...prev];
      const idx = replacement.findIndex(e => e.id === id);
      if (idx === -1) return replacement;
      replacement.splice(idx, 1);
      return replacement;
    });
  }

  const addNotification = (title: string, description: string, time: number, type: NotificationType) => {
    const id = Math.random().toString().replaceAll(".", "");
    const el = <NotificationElement onRemove={handleRemove} id={id} description={description} time={time || 5000} title={title} type={type} />;
    const data = {
      id,
      element: el
    }

    setNotifications((prev) => {
      return [
        ...prev,
        data
      ]
    });
  }

  const addInfo = (title: string, description: string, time?: number) => {
    addNotification(title, description, time || 5000, NotificationType.INFO);
  }
  const addError = (title: string, description: string, time?: number) => {
    addNotification(title, description, time || 5000, NotificationType.ERROR);
  }

  return <NotificationContext.Provider value={{
    addInfo,
    addError
  }}>
    <div class="notifications">
      <For each={notifications()}>
        {(notif) => {
          return notif.element;
        }}
      </For>
    </div>
    {props.children}
  </NotificationContext.Provider>
}

export default NotificationProvider;
