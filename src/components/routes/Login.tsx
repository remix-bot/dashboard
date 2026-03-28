import { Component, createEffect, createSignal, Show } from "solid-js";
import { AuthState, useAuth } from "../../lib/providers/auth/AuthProvider";
import { useLocation, useNavigate } from "@solidjs/router";

const Login: Component = () => {
  const { authState, createCode, verifyLogin } = useAuth();

  // redirect on successfull auth
  const redirect = useNavigate();
  const location = useLocation();
  const path = (location.query.r) ? location.query.r as string : "/";
  createEffect(() => {
    if (authState() === AuthState.AUTHENTICATED) redirect(path);
  });

  const [code, setCode] = createSignal<string | null>(null);

  return <>
    <link rel="stylesheet" href="/src/styles/login.css"></link>
    <section class="content-container">
      <div class="form-container">
        <h1>Login</h1>
        <Show when={!code()}>
            <input type="text" placeholder="Username#XXXX or Revolt user ID"></input>
            <p style="color: red" id="error">

            </p>
          <p style="text-align: center">Logging in with Username and Discriminator has been disabled temporarily!</p>
          <br></br>
            <button onClick={async (e) => {
              const value = e.target.parentElement?.querySelector("input")?.value;
              if (!value) return;
              const token = await createCode(value);
              setCode(token);
            }} type="button" style="width: 85%; background-color: rgb(219 39 119)" class="text-white bg-pink-700 hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">
              <i class="fas fa-sign-in-alt mr-2"></i>Submit
            </button>
        </Show>
        <Show when={!!code()}>
          <p>
            Login process started! In a server that has Remix, run
            <span class="tooltip-container">
              <span class="tooltip">Click to copy</span>
              <code id="command">{code()}</code>
            </span>! (You may need to edit the prefix depending on the server)
          </p>
          <p>
            Do <b>NOT</b> close this browser window, as this login is only valid in the current browser session.<br />
            After verifying with the command, this device will remember you for a few weeks.
          </p>
          <p style="color: red" id="verError">

          </p>
          <button onClick={async () => {
            verifyLogin();
          }} type="button" class="text-white bg-pink-700 hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">
            <i class="fas fa-check mr-2"></i>Check for verification
          </button>
        </Show>
      </div>
    </section>
  </>
}

export default Login;
