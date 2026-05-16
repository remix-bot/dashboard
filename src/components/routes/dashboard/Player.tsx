import { Component, createEffect } from "solid-js";
import Queue from "./Queue";
import icon from "../../../assets/icon.png";
import { useVoice } from "../../../lib/providers/auth/VoiceProvider";
import { createSignal } from "solid-js";
import { ensureAuth } from "../../../lib/providers/auth/AuthProvider";
import { Utils } from "../../../lib/util/Utils";
import { GenericAPIResponse } from "../../../lib/types/APITypes";
import { useNotifications } from "../../../lib/providers/notifications/NotificationProvider";
import AutocompleteSearch from "./AutocompleteSearch";

const Player: Component = () => {
  const { user } = ensureAuth();
  const { player, skip, pause, resume, setVol, addQuery } = useVoice();
  const { addError, addInfo } = useNotifications();
  const [elapsedTime, setElapsedTime] = createSignal<string>("00:00");
  const [controlsBlocked, setControlsBlocked] = createSignal(true);
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
    setControlsBlocked(player.started === 0);
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

  const invokeControl = async (func: (() => Promise<GenericAPIResponse>), p?: number) => {
    // @ts-ignore
    const res = await func(p);
    if (res.error) {
      return addError("Error", res.error, 7000);
    }
    return addInfo("Success", res.message!);
  }
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
        <button disabled={controlsBlocked()} class={player.paused ? "btn btn-play btn-pbt" : "btn btn-play btn-pbt hidden"} style="margin-right: 0.5rem;" onClick={() => {
          invokeControl(resume);
        }}>
          <i class="fa-solid fa-play" style="color: #e9196c"></i>
        </button>
        <button disabled={controlsBlocked()} class={!player.paused ? "btn btn-play btn-pbt" : "btn btn-play btn-pbt hidden"} onClick={() => {
          invokeControl(pause);
        }}>
          <i class="fa-solid fa-pause" style="color: #e9196c; margin-right: 0.5rem;"></i>
        </button>
        <button class="btn btn-skip btn-pbt" disabled={controlsBlocked()} onClick={() => {
          invokeControl(skip);
        }}>
          <i class="fa-solid fa-forward" style="color: #e9196c"></i>
        </button>
        <div class="slidecontainer" style="margin-left: 0.5rem; display: flex; flex-direction: row; align-items: center; gap: 0.2rem" title="100%">
          <input disabled={controlsBlocked()} type="range" style="accent-color: #e9196c; background: #e9196c" class="slider" value={player.volume * 100} min="0" max="100" id="volumeSlider" onChange={(e) => {
              const val = e.currentTarget.value;
              // @ts-ignore
              invokeControl(setVol, val / 100);
          }}/>
          <i class="fa-solid fa-volume-high" style="float:left;color: #e9196c" id="volumeIcon"></i>
        </div>
      </div>
        <AutocompleteSearch disabled={controlsBlocked()} callback={(query: string) => {
          // @ts-ignore
          invokeControl(addQuery, query);
        }}></AutocompleteSearch>
      <a style="position: absolute; top:1rem; right: 1rem; text-decoration: none;" class="player-maximise" href="javascript:void(0);"><i class="fa-solid fa-up-right-and-down-left-from-center"></i></a>
    </div>
      <Queue></Queue>
    </div>
  </>
}

export default Player;
