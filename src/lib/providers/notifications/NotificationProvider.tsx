import "../../../styles/notifications.css";

import { createSignal, For, ParentComponent, useContext } from "solid-js";
import { createContext } from "solid-js"
import NotificationElement, { NotificationElementProps } from "./NotificationElement";
import { JSX } from "solid-js";

export type NotificationContextType = {
  addInfo: (title: string, description: string, time?: number) => void;
  addError: (title: string, description: string, time?: number) => void;
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
  const [notifications, setNotifications] = createSignal<(NotificationElementProps)[]>([]);

  const handleRemove = (id: string) => {
    setNotifications((prev) => {
      const replacement = [...prev];
      const idx = replacement.findIndex(e => e.id === id);
      if (idx === -1) return replacement;
      replacement.splice(idx, 1);
      return replacement;
    });
  }

  const getNotif = (id: string) => {
    return notifications().find(n => n.id === id);
  }
  const replaceNotif = (notif: NotificationElementProps) => {
    setNotifications(prev => {
      const notifs = [...prev];
      const idx = notifs.findIndex(e => e.id === notif.id);
      if (idx === -1) return notifs;
      notif.id = Math.random().toString().replaceAll(".", "");
      notifs[idx] = notif;
      return notifs;
    });
  }
  const setValue = (id: string, key: string, value: any) => {
    const notif = {...getNotif(id)} as NotificationElementProps;
    if (!notif) return;
    (notif as any)[key] = value;
    replaceNotif(notif);
  }

  const addNotification = (title: string, description: string, time: number, type: NotificationType) => {
    const id = Math.random().toString().replaceAll(".", "");
    //const el = <NotificationElement onRemove={handleRemove} id={id} description={description} time={time || 5000} title={title} type={type} />;
    const data = {
      id,
      description,
      title,
      time: time || 5000,
      type,
      onRemove: handleRemove
    }

    setNotifications((prev) => {
      return [
        ...prev,
        data
      ]
    });

    return {
      get title() {
        return getNotif(this.id)?.title || "";
      },
      set title(t: string) {
        setValue(this.id, "title", t);
      },
      get description() {
        return getNotif(this.id)?.description || "";
      },
      set description(d: string) {
        setValue(this.id, "description", d);
      },
      get time() {
        return getNotif(this.id)?.time || 0;
      },
      set time(t: number) {
        setValue(this.id, "time", t);
      },
      get type() {
        return getNotif(this.id)?.type || NotificationType.ERROR;
      },
      set type(t: NotificationType) {
        setValue(this.id, "type", t);
      },
      id
    }
  }

  const addInfo = (title: string, description: string, time?: number) => {
    return addNotification(title, description, time || 5000, NotificationType.INFO);
  }
  const addError = (title: string, description: string, time?: number) => {
    return addNotification(title, description, time || 5000, NotificationType.ERROR);
  }

  (window as any).notifications = {
    addInfo,
    addError,
    addNotification
  }

  return <NotificationContext.Provider value={{
    addInfo,
    addError
  }}>
    <div class="notifications">
      <For each={notifications()}>
        {(notif) => {
          return <NotificationElement description={notif.description} id={notif.id} onRemove={notif.onRemove} title={notif.title} type={notif.type} time={notif.time}></NotificationElement>
        }}
      </For>
    </div>
    {props.children}
  </NotificationContext.Provider>
}

export default NotificationProvider;
