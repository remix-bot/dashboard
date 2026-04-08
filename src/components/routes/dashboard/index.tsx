import { Component } from "solid-js";
import { ensureAuth } from "../../../lib/providers/auth/AuthProvider";
import Player from "./Player";
import ChannelList from "./ChannelList/ChannelList";
import ConnectionDisplay from "./ConnectionDisplay";

const Dashboard: Component = () => {
  const { user } = ensureAuth(); // forces authentication on the /dashboard route
  console.log(user);
  console.log("rendering")
  return <>
    <link rel="stylesheet" href="/src/styles/dashboard.css"></link>
  <section class="main">
    <h1 style="font-size: 200%; color: rgb(219 39 119)" class="self-center text-2xl font-semibold whitespace-nowrap dark:text-pink-600">Remix Dashboard</h1>
    <br />
    <div class="main-container">
      <div style="flex-grow: 2; display: flex; flex-direction: column; gap: 1.5rem; justify-content: center">
        <div class="channel">
          <ConnectionDisplay></ConnectionDisplay>
          {/* TODO: Player status here */}
        </div>
        <div class="sidebar">
          <h1>Your Servers</h1>
          <br />
          <ChannelList></ChannelList>
        </div>
      </div>
      <Player></Player>
    </div>
    <p>
      Please note that the dashboard is experimental at the moment and that things might not work the way you expect them to. <br />
      Feel free to report bugs on our <a href={import.meta.env.VITE_SUPPORT_INVITE} style="text-decoration: underline" target="_blank">Revolt Server <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
    </p>
  </section>
  </>
}

export default Dashboard;
