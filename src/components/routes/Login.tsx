import { Component, createEffect, createSignal, Show } from "solid-js";
import { AuthState, useAuth } from "../../lib/providers/auth/AuthProvider";
import { useLocation, useNavigate } from "@solidjs/router";
import "../../styles/login.css";
import stoatLogo from "../../assets/stoat-logo.png";
import fluxerLogo from "../../assets/fluxer-logo.png";
import { useNotifications } from "../../lib/providers/notifications/NotificationProvider";

type BotType = "fluxer" | "stoat";

export enum loginAction {
  DEFAULT = "default",
  COMPLETE_FLUXER = "complete_fluxer",
}

const Login: Component = () => {
  const { authState, createCode, verifyLogin, getExistingCode } = useAuth();
  const { addError } = useNotifications();

  const [selectedBot, setSelectedBot] = createSignal<BotType | null>(null);
  const [code, setCode] = createSignal<string | null>(null);
  const [copied, setCopied] = createSignal(false);
  const [fluxerProcessing, setFluxerProcessing] = createSignal(false);

  // redirect on successfull auth
  const redirect = useNavigate();
  const location = useLocation();
  const action = (location.query.a) ? location.query.a as string : loginAction.DEFAULT;
  const path = (location.query.r) ? location.query.r as string : "/";
  createEffect(() => {
    if (authState() === AuthState.AUTHENTICATED) redirect(path);
  });

  if (action === loginAction.COMPLETE_FLUXER) {
    setFluxerProcessing(true);
    verifyLogin().then(s => {
      setFluxerProcessing(false);
      if (!!s) return;
      addError("Fluxer Auth Error", "An error occured.");
    });
  } else {
    getExistingCode().then(code => {
      if (!code) {
        localStorage.removeItem("loginStarted");
        return;
      }
      setCode(code);
      setSelectedBot("stoat");
      localStorage.setItem("loginStarted", "true");
    });
  }

  const selectBot = (bot: BotType) => {
    if (bot === "fluxer") {
      // Redirect to the backend's /auth/fluxer/authorize endpoint.
      // The backend will redirect to Fluxer OAuth, then back to backend,
      // which redirects here with ?fluxer_token=...&fluxer_id=...
      const authUrl = import.meta.env.VITE_API_ENDPOINT + "/auth/fluxer/authorize";
      window.location.href = authUrl;
      return;
    }
    setSelectedBot(bot);
  };

  const copyCode = () => {
    const el = document.getElementById("command");
    if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCheckVerification = async () => {
    const s = await verifyLogin();
    if (!s) return;
    localStorage.removeItem("loginStarted");
  };

  const handleSubmitStoat = async (e: MouseEvent) => {
    const input = (e.target as HTMLElement).closest(".stoat-form")?.querySelector("input") as HTMLInputElement;
    if (!input?.value) return;
    const token = await createCode(input.value);
    localStorage.setItem("loginStarted", "true");
    setCode(token);
  };

  return (
    <section class="login-page">
      {/* Decorative background orbs */}
      <div class="login-orb login-orb--1" />
      <div class="login-orb login-orb--2" />
      <div class="login-orb login-orb--3" />

      <div class="login-card">
        {/* ── Fluxer OAuth callback processing ── */}
        <Show when={fluxerProcessing()}>
          <div class="login-card__header">
            <div class="login-badge login-badge--fluxer">
              <img src={fluxerLogo} alt="Fluxer" />
              <span>Fluxer</span>
            </div>
            <h2 class="login-card__title login-card__title--sm">Authenticating</h2>
            <p class="login-card__subtitle">Verifying your Fluxer login...</p>
          </div>
          <div style="text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--accent);" />
          </div>
        </Show>

        {/* ── Step 1: Bot Selection ── */}
        <Show when={!selectedBot() && !code() && !fluxerProcessing()}>
          <div class="login-card__header">
            <h1 class="login-card__title">Welcome Back</h1>
            <p class="login-card__subtitle">Choose a login method to continue</p>
          </div>

          <div class="login-options">
            {/* Fluxer card — OAuth redirect */}
            <button class="login-option" onclick={() => selectBot("fluxer")}>
              <div class="login-option__glow login-option__glow--fluxer" />
              <div class="login-option__icon login-option__icon--fluxer">
                <img src={fluxerLogo} alt="Fluxer" />
              </div>
              <div class="login-option__info">
                <span class="login-option__name">Fluxer</span>
                <span class="login-option__desc">Authenticate via Fluxer</span>
              </div>
              <div class="login-option__arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>

            {/* Stoat card — username/code flow */}
            <button class="login-option" onclick={() => selectBot("stoat")}>
              <div class="login-option__glow login-option__glow--stoat" />
              <div class="login-option__icon login-option__icon--stoat">
                <img src={stoatLogo} alt="Stoat" />
              </div>
              <div class="login-option__info">
                <span class="login-option__name">Stoat</span>
                <span class="login-option__desc">Login with username or ID</span>
              </div>
              <div class="login-option__arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          </div>

          <p class="login-card__footer-text">
            By logging in you agree to our Terms of Service
          </p>
        </Show>

        {/* ── Step 2a: Stoat login form ── */}
        <Show when={selectedBot() === "stoat" && !code()}>
          <button class="login-back" onclick={() => setSelectedBot(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>

          <div class="login-card__header">
            <div class="login-badge login-badge--stoat">
              <img src={stoatLogo} alt="Stoat" />
              <span>Stoat</span>
            </div>
            <h2 class="login-card__title login-card__title--sm">Verify Your Identity</h2>
            <p class="login-card__subtitle">Enter your username or Stoat user ID</p>
          </div>

          <div class="stoat-form">
            <div class="login-input-group">
              <svg class="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input type="text" placeholder="Username#XXXX or Stoat user ID" />
            </div>

            <p class="login-form-notice">
              Logging in with Username and Discriminator has been disabled temporarily!
            </p>

            <button class="login-submit" onclick={handleSubmitStoat}>
              <i class="fas fa-arrow-right" />
              Submit
            </button>
          </div>
        </Show>

        {/* ── Step 2b: Stoat verification ── */}
        <Show when={!!code()}>
          <div class="login-card__header">
            <div class="login-badge login-badge--stoat">
              <img src={stoatLogo} alt="Stoat" />
              <span>Stoat</span>
            </div>
            <h2 class="login-card__title login-card__title--sm">Verification Required</h2>
            <p class="login-card__subtitle">Run the command below in a server with Remix</p>
          </div>

          <div class="login-verify">
            <div class="login-code-box" onclick={copyCode}>
              <code id="command">{code()}</code>
              <span class="login-code-copy">
                {copied() ? (
                  <><i class="fas fa-check" /> Copied</>
                ) : (
                  <><i class="fas fa-copy" /> Copy</>
                )}
              </span>
            </div>

            <div class="login-verify-info">
              <div class="login-verify-step">
                <span class="login-verify-step__num">1</span>
                <span>Copy the command above</span>
              </div>
              <div class="login-verify-step">
                <span class="login-verify-step__num">2</span>
                <span>Paste it in any server that has Remix (edit prefix if needed)</span>
              </div>
              <div class="login-verify-step">
                <span class="login-verify-step__num">3</span>
                <span>Come back and click the verify button below</span>
              </div>
            </div>

            <div class="login-verify-warning">
              <i class="fas fa-exclamation-triangle" />
              <span>Do <b>NOT</b> close this window. This session is only valid here.</span>
            </div>

            <button class="login-submit" onclick={handleCheckVerification}>
              <i class="fas fa-shield-alt" />
              Check Verification
            </button>
          </div>
        </Show>
      </div>
    </section>
  );
};

export default Login;
