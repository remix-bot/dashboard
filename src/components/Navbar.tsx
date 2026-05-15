import icon from "../assets/icon.png";
import stoatLogo from "../assets/stoat-logo.png";
import fluxerLogo from "../assets/fluxer-logo.png";

import { Component, createSignal, Show, onMount, onCleanup } from "solid-js";
import LoginWidget from "./LoginWidget";

const Navbar: Component = () => {
  const [supportOpen, setSupportOpen] = createSignal(false);
  const [mobileOpen, setMobileOpen] = createSignal(false);
  let cleanupFn: (() => void) | undefined;

  const toggleSupport = (e: MouseEvent) => {
    e.stopPropagation();
    if (!cleanupFn) {
      const handler = (ev: MouseEvent) => {
        const target = ev.target as HTMLElement;
        if (!target.closest("[data-nav-support]")) setSupportOpen(false);
      };
      document.addEventListener("click", handler);
      cleanupFn = () => document.removeEventListener("click", handler);
    }
    setSupportOpen((v) => !v);
  };

  const toggleMobile = () => {
    setMobileOpen((v) => !v);
    // close support dropdown when toggling mobile
    if (mobileOpen()) setSupportOpen(false);
  };

  // close mobile menu on resize to desktop
  const handleResize = () => {
    if (window.innerWidth > 768) setMobileOpen(false);
  };
  onMount(() => window.addEventListener("resize", handleResize));
  onCleanup(() => {
    cleanupFn?.();
    window.removeEventListener("resize", handleResize);
  });

  return <>
  <nav class="nav-bar">
    <div class="nav-inner">
      <a href="/" class="nav-logo" onclick={() => setMobileOpen(false)}>
        <img src={icon} class="nav-logo-img" alt="Remix Logo" />
      </a>
      <button class="nav-burger" aria-expanded={mobileOpen() ? "true" : "false"} onclick={toggleMobile}>
        <span class="sr-only">Open main menu</span>
        <svg width="24" height="24" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
          <Show
            when={!mobileOpen()}
            fallback={
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            }
          >
            <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </Show>
        </svg>
      </button>
      <div class={`nav-menu${mobileOpen() ? " nav-menu--open" : ""}`}>
        <ul class="nav-links">
          <li>
            <a href="/" class="nav-link" onclick={() => setMobileOpen(false)}>
              Home
            </a>
          </li>
          <li>
            <a href="/commands" class="nav-link" onclick={() => setMobileOpen(false)}>
              Commands
            </a>
          </li>
          <li data-nav-support style="position: relative;">
            <a
              href="javascript:void(0)"
              class="nav-link nav-support-btn"
              onclick={toggleSupport}
            >
              Support
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
            <Show when={supportOpen()}>
              <div class="nav-dropdown">
                <a href={import.meta.env.VITE_SUPPORT_INVITE} class="nav-dropdown-item">
                  <img src={stoatLogo} alt="Stoat" class="nav-dropdown-item__logo" />
                  Stoat Support
                </a>
                <a href={import.meta.env.VITE_FLUXER_SUPPORT_INVITE} class="nav-dropdown-item">
                  <img src={fluxerLogo} alt="Fluxer" class="nav-dropdown-item__logo" />
                  Fluxer Support
                </a>
              </div>
            </Show>
          </li>
          <li>
            <LoginWidget></LoginWidget>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  </>
}

export default Navbar;
