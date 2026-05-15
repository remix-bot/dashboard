import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
import { useAuth } from "../lib/providers/auth/AuthProvider";
import '@fortawesome/fontawesome-free/js/all.js';

const LoginWidget: Component = () => {
  const [drop, setDrop] = createSignal(false);

  const { user } = useAuth();
  createEffect(() => {
    console.log("user", user());
  });

  // close dropdown when clicking outside
  const handleClick = (e: MouseEvent) => {
    if (!drop()) return;
    const target = e.target as HTMLElement;
    if (!target.closest("[data-login-widget]")) {
      setDrop(false);
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClick);
  })

  return <>
    <Show when={user()} fallback={
      <a href="/login" class="nav-link nav-login-link">
        <i class="fas fa-right-to-bracket" style="font-size: 0.8rem;" />
        Login
      </a>
    }>
      <div data-login-widget style="position: relative;">
        <a
          class="nav-link nav-profile-btn"
          href="javascript:void(0)"
          onclick={() => setDrop((prev) => !prev)}
        >
          <img
            src={user()?.avatar.url}
            alt=""
            style="width: 1.35rem; height: 1.35rem; border-radius: 50%; object-fit: cover; flex-shrink: 0;"
          />
          <span style="max-width: 6rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            {user()?.username}
          </span>
          <i class="fa-solid fa-caret-down" style="font-size: 0.65rem; opacity: 0.5;" />
        </a>
        <Show when={drop()}>
          <div class="nav-dropdown" id="profile-dropdown" style="right: -70%; left: auto;">
            <a href="/dashboard" class="nav-dropdown-item">
              <i class="fas fa-gauge-high" style="width: 1rem; text-align: center; font-size: 0.8rem;" />
              Dashboard
            </a>
            <a href="/logout" class="nav-dropdown-item">
              <i class="fas fa-right-from-bracket" style="width: 1rem; text-align: center; font-size: 0.8rem;" />
              Logout
            </a>
          </div>
        </Show>
      </div>
    </Show>
  </>
}

export default LoginWidget;
