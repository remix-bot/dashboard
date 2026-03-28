import { Component, createEffect, createSignal, Show } from "solid-js";
import { useAuth } from "../lib/providers/auth/AuthProvider";
import '@fortawesome/fontawesome-free/js/all.js';

const LoginWidget: Component = () => {
  const [drop, setDrop] = createSignal(false);

  const { user } = useAuth();
  createEffect(() => {
    console.log("user", user());
  });
  return <>
    <Show when={user()} fallback={
      <a href="/login" class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-pink-600 dark:hover:bg-gray-700 dark:hover:text-pink-600 md:dark:hover:bg-transparent">
        Login
      </a>
    }>
      <a class="block text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-pink-600 dark:hover:bg-gray-700 dark:hover:text-pink-600 md:dark:hover:bg-transparent"
        style="
        background-color: rgb(19, 25, 39);
        padding: 0.4rem;
        display: flex;
        align-items: center;"
        href="javascript:void(0)" onclick={
          () => {
            setDrop((prev) => !prev)
          }
        }>
        <img src={user()?.avatar.url} height="100%" style="aspect-ratio: 1/1; height: 1.5rem;float:left; padding-right: 0.2rem"/>
        {user()?.username}
        <i class="fa-solid fa-caret-down" style="padding-left: 0.2rem"></i>
      </a>
      <Show when={drop()}>
        <div id="profile-dropdown" style="display: block; position: absolute; background-color: rgb(19, 25, 39); padding: 0.4rem;box-shadow: 0px 4px 12px rgb(0 0 0 / 40%); color: rgb(156 163 175); border-radius: 3px">
          <ul style="list-style: none; line-height: 1.4rem;">
            <li>
              <a href="/dashboard" class="hover:text-pink-600"><i class="fa-solid fa-gauge-high"></i> Dashboard</a>
            </li>
            <li>
              <a href="/logout" class="hover:text-pink-600"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
            </li>
          </ul>
        </div>
      </Show>
    </Show>
  </>
}

export default LoginWidget;
