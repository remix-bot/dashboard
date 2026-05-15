import { Component, createResource, createSignal, For, Show } from "solid-js";
import { useAuth } from "../../lib/providers/auth/AuthProvider";
import "../../styles/commands.css";

type Command = {
  name: string;
  description: string;
  usage: string;
  aliases: string[];
  category?: string;
};

const COMMAND_CATEGORIES = [
  { key: "all", label: "All", icon: "fa-layer-group" },
  { key: "default", label: "Music", icon: "fa-music" },
  { key: "queue", label: "Queue", icon: "fa-list" },
  { key: "util", label: "Utility", icon: "fa-wrench" },
  { key: "settings", label: "Settings", icon: "fa-cog" },
];

const Commands: Component = () => {
  const { api } = useAuth();
  const [commands] = createResource(async () => {
    const res = await api.get("/commands");
    return res;
  });

  const [search, setSearch] = createSignal("");
  const [activeCategory, setActiveCategory] = createSignal("all");

  const filteredCommands = () => {
    const q = search().toLowerCase();
    const cat = activeCategory();
    const cmds = commands() || [];
    console.log(cmds);
    return cmds.filter((cmd: Command) => {
      const matchSearch = !q
        || cmd.name.toLowerCase().includes(q)
        || cmd.description.toLowerCase().includes(q);
      const matchCat = cat === "all"
        || (cmd.category || "").toLowerCase() === cat
        || cmd.name.toLowerCase().startsWith(cat);
      return matchSearch && matchCat;
    });
  };

  const commandCount = () => filteredCommands().length;
  const totalCount = () => (commands() || []).length;

  return (
    <div class="cmd-page">
      {/* Decorative orbs */}
      <div class="cmd-orb cmd-orb--1" />
      <div class="cmd-orb cmd-orb--2" />

      {/* Header */}
      <div class="cmd-header">
        <div class="cmd-header__glow" />
        <div class="cmd-header__icon">
          <i class="fas fa-terminal" />
        </div>
        <h1 class="cmd-header__title">Commands</h1>
        <p class="cmd-header__subtitle">
          Explore all available commands for Remix
        </p>
        <div class="cmd-header__count">
          <span class="cmd-header__count-num">{commandCount()}</span>
          <span class="cmd-header__count-label">
            {commandCount() === totalCount() ? "commands" : "of " + totalCount() + " commands"}
          </span>
        </div>
      </div>

      {/* Search + Filters bar */}
      <div class="cmd-toolbar">
        <div class="cmd-search">
          <svg class="cmd-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search commands..."
            value={search()}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
          <Show when={search()}>
            <button class="cmd-search__clear" onClick={() => setSearch("")}>
              <i class="fas fa-times" />
            </button>
          </Show>
        </div>

        <div class="cmd-filters">
          <For each={COMMAND_CATEGORIES}>
            {(cat) => (
              <button
                class={`cmd-filter ${activeCategory() === cat.key ? "cmd-filter--active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                <i class={`fas ${cat.icon}`} />
                <span>{cat.label}</span>
              </button>
            )}
          </For>
        </div>
      </div>

      {/* Command list */}
      <div class="cmd-list">
        <Show
          when={commandCount() > 0}
          fallback={
            <div class="cmd-empty">
              <div class="cmd-empty__icon">
                <i class="fas fa-search" />
              </div>
              <p class="cmd-empty__title">No commands found</p>
              <p class="cmd-empty__desc">Try adjusting your search or filter</p>
            </div>
          }
        >
          <For each={filteredCommands()}>
            {(cmd: Command) => (
              <div class="cmd-card">
                <div class="cmd-card__header">
                  <div class="cmd-card__name-wrap">
                    <span class="cmd-card__prefix">
                      {import.meta.env.VITE_COMMAND_PREFIX || "/"}
                    </span>
                    <span class="cmd-card__name">{cmd.name}</span>
                  </div>
                  <Show when={cmd.aliases && cmd.aliases.length > 0}>
                    <div class="cmd-card__aliases">
                      <For each={cmd.aliases.filter((a: string) => a !== cmd.name)}>
                        {(alias: string) => (
                          <span class="cmd-card__alias">{alias}</span>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
                <p class="cmd-card__desc">{cmd.description}</p>
                <Show when={cmd.usage}>
                  <div class="cmd-card__usage">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="4 17 10 11 4 5" />
                      <line x1="12" y1="19" x2="20" y2="19" />
                    </svg>
                    <code>{cmd.usage}</code>
                  </div>
                </Show>
              </div>
            )}
          </For>
        </Show>
      </div>

      {/* Bottom spacer */}
      <div style="height: 2rem;" />
    </div>
  );
};

export default Commands;
