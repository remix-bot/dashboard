import { Component } from "solid-js";
import { useAuth } from "../../../lib/providers/auth/AuthProvider";

const ConnectionDisplay: Component = () => {
  const { channel } = useAuth();
  return <>
    {/* TODO: onclick closecalls */}
    <a style="cursor: initial; opacity: 0.5; text-decoration: none; color: white; float: right;" id="closecall" href="javascript:void(0);"><i class="fa-solid fa-phone-slash"></i></a>
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
