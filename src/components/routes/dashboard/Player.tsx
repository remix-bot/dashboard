import { Component, createEffect } from "solid-js";
import Queue from "./Queue";
import icon from "../../../assets/icon.png";
import { useVoice } from "../../../lib/providers/auth/VoiceProvider";
import { createSignal } from "solid-js";
import { ensureAuth } from "../../../lib/providers/auth/AuthProvider";
import { Utils } from "../../../lib/util/Utils";

const Player: Component = () => {
  const { user } = ensureAuth();
  const { player } = useVoice();
  const [elapsedTime, setElapsedTime] = createSignal<string>("00:00");
  var current = 0;
  var interval: number | undefined;
  const updateTimestamp = () => {
    setElapsedTime(Utils.prettifyMS(current, "h:!m:!s"));
  }

  createEffect(() => {
    current = ((user()?.player?.playing) ? user()!.player!.elapsedTime : 0) * 1000;
    updateTimestamp();
  });

  createEffect(() => {
    console.log("volume", player.volume);
  });
  createEffect(() => {
    player.started; player.timeDiff; // subscribe to updates
    current = (user()?.player?.elapsedTime || 0) * 1000;

    clearInterval(interval);
    if (player.started === 0 || player.paused) return;
    updateTimestamp();
    interval = setInterval(() => {
      current += 1000;
      updateTimestamp();
    }, 1000);
  });
  return <>
  <div style="
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    row-gap: 1rem;
    grid-rows: 2;
    align-items: center;
    padding: 1.5rem;
    border-radius: 5px;
    background-color: rgb(31, 41, 55);
    /*border: 1px solid #282828;*/
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
    color: #fff;
    font-family: 'Helvetica Neue', sans-serif;
    font-size: 1rem;" class="remix-player">

    <div style="aspect-ratio: 1/1; margin-right: 2rem; grid-row: 1; grid-column: 1;" class="thumbnail">
      <img id="thumbnail" style="border-radius: 5px; object-fit: cover; height: 100%; width: 100%;" src={player.queue.current?.thumbnail || icon} alt="Thumbnail of the current song." />
    </div>

    <div style="display: flex; justify-content: center; height: 100%; flex-grow: 2; grid-row: 1; grid-column-start: 2; grid-column-end: 4;" class="player-info">
      <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">Currently Playing</h1>
        <p style="font-size: 1rem; margin-bottom: 1rem;"><span id="song">{player.queue.current?.title}</span> - <span id="artist">{player.queue.current?.artist.name}</span></p>
        {/* remove from here */}
        <p>The Player is not functional at the moment. Please be patient as we migrate to our new tech stack.</p>
        <br />
        {/* to here */}
      <span>
          <span id="elapsedTime">{elapsedTime()}</span>/<span id="duration">{
            player.queue.current?.duration || "00:00"
          }</span>
      </span>
      <div style="display: flex; flex-direction: row; justify-content: center; opacity: 0.5">
          <button class="btn btn-play btn-pbt hidden" style="margin-right: 0.5rem;" disabled>
          <i class="fa-solid fa-play" style="color: #e9196c"></i>
        </button>
        <button class="btn btn-pause btn-pbt" disabled>
          <i class="fa-solid fa-pause" style="color: #e9196c; margin-right: 0.5rem;"></i>
        </button>
        <button class="btn btn-skip btn-pbt" disabled>
          <i class="fa-solid fa-forward" style="color: #e9196c"></i>
        </button>
        <div class="slidecontainer" style="margin-left: 0.5rem; display: flex; flex-direction: row; align-items: center; gap: 0.2rem" title="100%">
          <input type="range" style="accent-color: #e9196c; background: #e9196c" class="slider" value={player.volume * 100} min="0" max="100" id="volumeSlider" />
          <i class="fa-solid fa-volume-high" style="float:left;color: #e9196c" id="volumeIcon"></i>
        </div>
      </div>
      <div style="position: relative; display: flex; flex-direction: column" class="search-container">
        <input type="text" name="search" placeholder="Search or paste a link" autocomplete="off" id="search"
          style="margin: 10px 0 0;
            padding: 5px;
            padding-left: 7px;
            padding-right: 7px;
            align-self: center;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            width: 100%;
            max-width: 400px;
            background-color: rgb(19, 25, 39);
            border-color: #bbb;
            transition: all 0.2s ease-in-out;"
          disabled/>
        <div style="position: relative; align-self: center; width: 100%">
          <ul id="completions" style="
            background-color: rgb(19, 25, 39);
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
            border-radius: 5px;/*0 0 5px 5px;*/
            position: absolute;
            display: none;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            algin-self: center;
            width: 100%;
            max-width: 400px;
            padding: 5px">
          </ul>
        </div>
      </div>
      <a style="position: absolute; top:1rem; right: 1rem; text-decoration: none;" class="player-maximise" href="javascript:void(0);"><i class="fa-solid fa-up-right-and-down-left-from-center"></i></a>
    </div>
      <Queue></Queue>
    </div>
  </>
}

export default Player;
