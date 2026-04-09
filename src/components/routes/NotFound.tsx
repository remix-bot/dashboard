import { useLocation } from "@solidjs/router";
import { Component } from "solid-js";

const NotFound: Component = () => {
  const location = useLocation();
  return <>
    <div style="display: flex; width: 100%; align-items: center; flex-direction: column; padding-top: 5rem; font-size: 130%">
      <h1 style="font-size: 350%; text-align: center">404 Not Found</h1>
      <br />
      <p style="text-align: center">
        The path <code style="font-family: 'Courier New'">{location.pathname}</code> could not be found.
        <br />
        Are you sure you spelt it right?
      </p>
      <br />
      <a href="/" class="button" style="background-color: #e9196c">Back to home</a>
    </div>
  </>
}

export default NotFound;
