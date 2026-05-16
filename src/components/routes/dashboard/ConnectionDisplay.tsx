import { Component } from "solid-js";
import { useVoice } from "../../../lib/providers/auth/VoiceProvider";
import { useNotifications } from "../../../lib/providers/notifications/NotificationProvider";

const ConnectionDisplay: Component = () => {
  const { addError, addInfo } = useNotifications();
  const { channel, leave } = useVoice();
  return <>
    {/* TODO: onclick closecalls */}
    <a style="cursor: initial; opacity: 0.5; text-decoration: none; color: white; float: right;" id="closecall" href="javascript:void(0);" onClick={async () => {
      if (!channel()) return;
      const res = await leave(channel()!.id);
      if (res.error) {
        return addError("Error", res.error, 7000);
      }
      return addInfo("Success", res.message!);
    }}><i class="fa-solid fa-phone-slash"></i></a>
    <p style="font-size: 120%">
      Connected to: <span style="font-weight: bold;">{
        channel()?.displayName || channel()?.name || "-"
      }</span>
    </p>
    <p>In Server <span id="currs" style="font-weight: bold;">{
      channel()?.server.name || "-"
    }</span></p>
  </>
}

export default ConnectionDisplay;
