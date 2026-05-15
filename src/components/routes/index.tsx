import { Component, createSignal, onMount, onCleanup } from "solid-js";
import "../../styles/index.css";
import icon from "../../assets/icon.png";
import stoatLogo from "../../assets/stoat-logo.png";
import fluxerLogo from "../../assets/fluxer-logo.png";

const Main: Component = () => {
  const [inviteOpen, setInviteOpen] = createSignal(false);

  // close a dropdown when clicking outside
  const handleClickOutside = (setter: (v: boolean) => boolean) => (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("[data-dropdown]")) {
      setter(false);
    }
  };

  // attach / detach outside-click listeners
  const attachOutside = (setter: (v: boolean) => boolean) => {
    const handler = handleClickOutside(setter);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  };

  let cleanupInvite: (() => void) | undefined;

  const toggleInvite = () => {
    if (!cleanupInvite) cleanupInvite = attachOutside(setInviteOpen);
    setInviteOpen((v) => !v);
  };

  // scroll-reveal:
  let observer: IntersectionObserver | undefined;

  onMount(() => {
    const sections = document.querySelectorAll(".reveal");
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            // add stagger delay to children if present
            const stagger = entry.target.querySelectorAll(".stagger-child");
            stagger.forEach((el, i) => {
              (el as HTMLElement).style.transitionDelay = `${i * 0.1}s`;
              el.classList.add("revealed");
            });
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    sections.forEach((s) => observer?.observe(s));
  });

  onCleanup(() => observer?.disconnect());

  return (
    <>
      {/* ========== HERO ========== */}
      <section class="hero">
        <div class="hero__inner">
          <div class="hero__glow"></div>
          <img
            src={icon}
            class="hero__icon"
            alt="Remix Logo"
          />
          <h1 class="hero__title">Remix</h1>
          <p class="hero__subtitle">
            A powerful music bot available on <strong>Stoat</strong> &amp; <strong>Fluxer</strong>
          </p>

          {/* platform pill badges */}
          <div class="platform-pills">
            <span class="platform-pill">
              <img src={stoatLogo} alt="Stoat" class="platform-pill__logo" />
              Stoat
            </span>
            <span class="platform-pill">
              <img src={fluxerLogo} alt="Fluxer" class="platform-pill__logo" />
              Fluxer
            </span>
          </div>

          {/* CTA buttons */}
          <div class="hero__actions">

            {/* Invite Remix (dropdown) */}
            <div data-dropdown class="dropdown-wrap">
              <button
                type="button"
                class="cta-btn cta-btn--primary"
                onclick={toggleInvite}
              >
                Invite Remix
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div class="dropdown" classList={{ "dropdown--open": inviteOpen() }}>
                <a href={import.meta.env.VITE_BOT_INVITE} class="dropdown-item">
                  <img src={stoatLogo} alt="Stoat" class="dropdown-item__logo" />
                  Invite on Stoat
                </a>
                <a href={import.meta.env.VITE_FLUXER_BOT_INVITE} class="dropdown-item">
                  <img src={fluxerLogo} alt="Fluxer" class="dropdown-item__logo" />
                  Invite on Fluxer
                </a>
              </div>
            </div>

            {/* Support Us */}
            <a class="cta-btn cta-btn--secondary" href={import.meta.env.VITE_SPONSOR_URL}>
              Support Us
              <svg style="margin: 0 5px;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 5a5.002 5.002 0 0 0 4.027 4.905 6.46 6.46 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05c0-.046 0-.093.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.46 3.46 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98c-.003.046-.003.097-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5zm16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zm-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787H8.25zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674l.077.018z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* scroll hint arrow */}
        <a href="#about" class="hero__scroll-hint">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="floating">
            <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd" />
          </svg>
        </a>
      </section>

      {/* ========== ABOUT ========== */}
      <section id="about" class="section reveal">
        <div class="section__inner">
          <div class="section__header">
            <h2 class="section__title">About</h2>
            <div class="section__accent"></div>
          </div>
          <p class="about-body">
            An advanced music bot that supports YouTube, Spotify, and SoundCloud &mdash; all the power
            just a click away. Create playlists, customize playback, and enjoy seamless music
            streaming across your servers. Available on both Stoat and Fluxer.
          </p>
        </div>
      </section>

      {/* gradient divider */}
      <div class="divider"></div>

      {/* ========== FEATURES ========== */}
      <section id="features" class="section reveal">
        <div class="section__inner">
          <div class="section__header">
            <h2 class="section__title">Features</h2>
            <div class="section__accent"></div>
          </div>
          <div class="features-grid">
            <div class="feature-card stagger-child">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
              </div>
              <h3 class="feature-title">Multi-Platform</h3>
              <p class="feature-desc">YouTube, Spotify, and SoundCloud &mdash; all natively supported with automatic link detection and queueing.</p>
            </div>
            <div class="feature-card stagger-child">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
              </div>
              <h3 class="feature-title">Playlists</h3>
              <p class="feature-desc">Create, save, and manage playlists. Organize your favourite tracks and load them anytime with a single command.</p>
            </div>
            <div class="feature-card stagger-child">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /></svg>
              </div>
              <h3 class="feature-title">Custom Playback</h3>
              <p class="feature-desc">Adjust volume, loop tracks, skip, shuffle, and control the queue with intuitive commands.</p>
            </div>
            <div class="feature-card stagger-child">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </div>
              <h3 class="feature-title">Web Dashboard</h3>
              <p class="feature-desc">Manage your server's music queue, playback, and settings straight from your browser with our full dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* gradient divider */}
      <div class="divider"></div>

      {/* ========== TEAM ========== */}
      <section id="team" class="section reveal">
        <div class="section__inner">
          <div class="section__header">
            <h2 class="section__title">Team</h2>
            <div class="section__accent"></div>
          </div>
          <div class="team-grid" id="teamContainer">
            <div class="team-member stagger-child">
              <div class="team-member__avatar-wrap">
                <img class="team-member__avatar" src="https://cdn.stoatusercontent.com/avatars/r9TTZ2p6hi6_Y3EAAEAIolv810vCK2C88-PmQaXybU/original" alt="NoLogicALan" loading="lazy" />
                <div class="team-member__avatar-ring" />
                <div class="team-member__socials">
                  <a href="https://twitter.com/NoLogicAlan" class="team-member__social" aria-label="Twitter" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg>
                  </a>
                  <a href="https://github.com/NoLogicAlan" class="team-member__social" aria-label="GitHub" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                  </a>
                </div>
              </div>
              <div class="team-member__info">
                <h5 class="team-member__name">NoLogicALan</h5>
                <span class="team-member__role">Founder</span>
                <div class="team-member__links-inline">
                  <a href="https://twitter.com/NoLogicAlan" aria-label="Twitter" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg>
                  </a>
                  <a href="https://github.com/NoLogicAlan" aria-label="GitHub" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div class="team-member stagger-child">
              <div class="team-member__avatar-wrap">
                <img class="team-member__avatar" src="https://cdn.stoatusercontent.com/avatars/Ej0UkdPD6b_QSUdNwgTWidN2k5X4x1UXeCadpQA374/original" alt="ShadowLp174" loading="lazy" />
                <div class="team-member__avatar-ring" />
                <div class="team-member__socials">
                  <a href="https://twitter.com/SLp174" class="team-member__social" aria-label="Twitter" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg>
                  </a>
                  <a href="https://github.com/ShadowLp174" class="team-member__social" aria-label="GitHub" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                  </a>
                </div>
              </div>
              <div class="team-member__info">
                <h5 class="team-member__name">ShadowLp174</h5>
                <span class="team-member__role">Developer</span>
                <div class="team-member__links-inline">
                  <a href="https://twitter.com/SLp174" aria-label="Twitter" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg>
                  </a>
                  <a href="https://github.com/ShadowLp174" aria-label="GitHub" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div class="team-member stagger-child">
              <div class="team-member__avatar-wrap">
                <img class="team-member__avatar" src="https://cdn.stoatusercontent.com/avatars/YCaeEvPCFCDHPV_Y-oEDsnfLm0jPmI3g1WgKSA3Ze7/original" alt="Fantic" loading="lazy" />
                <div class="team-member__avatar-ring" />
                <div class="team-member__socials">
                  <a href="https://twitter.com/fanticwastaken" class="team-member__social" aria-label="Twitter" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg>
                  </a>
                  <a href="https://github.com/fanticwastaken" class="team-member__social" aria-label="GitHub" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                  </a>
                </div>
              </div>
              <div class="team-member__info">
                <h5 class="team-member__name">Fantic</h5>
                <span class="team-member__role">Community Manager</span>
                <div class="team-member__links-inline">
                  <a href="https://twitter.com/fanticwastaken" aria-label="Twitter" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg>
                  </a>
                  <a href="https://github.com/fanticwastaken" aria-label="GitHub" target="_blank" rel="noopener">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* bottom spacer for footer */}
      <div style="height: 4rem;"></div>
    </>
  );
};

export default Main;
