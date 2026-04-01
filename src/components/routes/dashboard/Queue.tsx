import { Component } from "solid-js";

const Queue: Component = () => {
  return <>
    <div style="grid-row: 2; grid-column-start: 1; grid-column-end: 4" class="queue-container">
      <h1 style="font-size: 1.5rem">Queue</h1>
      <br />
      <div style="width: 100%; height: 4rem; padding: 0.3rem; display: flex; display: none; flex-direction: row; gap: 0.5rem; align-items: center; border-bottom: 1px solid rgb(19, 25, 39)" id="originItem"> {/* for the simplicity of the script, this has been moved out of .queue */}
        <img alt="song cover" src="/assets/icon.png" style="aspect-ratio: 1 / 1; height: 100%; border-radius: 5px; object-fit: cover" />
        <div style="flex-grow: 3; display: flex; flex-direction: column; align-items: flex-start; gap: 0.1rem">
          <span style="font-size: 1.1rem">Song name</span>
          <span style="font-size: 0.8rem">Artist name</span>
        </div>
        <p style="align-self: center">3:08</p>
      </div>
      <div class="queue" style="width: 100%; display: flex; flex-direction: column;"></div> {/* inspired by yt music */}
    </div>
  </>
}

export default Queue;
