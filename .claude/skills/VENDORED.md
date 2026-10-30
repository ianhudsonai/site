# Vendored skills

Copies of third-party skills, committed unmodified so they work in cloud sessions. To update, re-copy from upstream and bump the commit below.

| Folder | Upstream | Commit | License |
|---|---|---|---|
| `design-taste-frontend/` | https://github.com/Leonxlnx/taste-skill (`skills/taste-skill/`) | 12af471f627f866411b4bd785b19646d3672784c | MIT |
| `gsap-*/` and `llms.txt` | https://github.com/greensock/gsap-skills (`skills/`) | aed9cfd3277740755f6bfc1155c7aa645403b760 | MIT |
| `impeccable/` and `../agents/impeccable-*.md` | https://github.com/pbakaus/impeccable (`.claude/skills/impeccable/` and `.claude/agents/`) | 02523aec3e4c4580102d996d1b6a71fbe062e03f | Apache-2.0 |

Each folder carries the upstream LICENSE file. The taste-skill folder was installed under its frontmatter name, `design-taste-frontend`, the way upstream's `install.sh` does.

Things to know before running the taste-skill scripts: they launch a headless Chrome with a throwaway profile in the system temp dir, serve the page on 127.0.0.1 only, and `draw.mjs` writes a history file to `~/.taste-skill/history.json` (override with `TASTE_SKILL_HISTORY`). `assets.mjs` downloads images or video from Openverse, Wikimedia Commons, the Met, the Art Institute of Chicago and NASA, and only runs when asked.

## Impeccable: what was left out, and why

Impeccable ships a Claude Code hook config at `.claude/settings.json` (SessionStart, PostToolUse on Edit/Write, Stop). It was **not** copied, so no hooks run in this project. Do not enable them (`/impeccable hooks on`, `impeccable install`) without reviewing them first: they run on every edit and `hooks on` can also write to `.claude/settings.local.json`, `~/.claude/settings.json` and other agents' settings.

The skill's launcher, `impeccable/scripts/impeccable`, runs a prebuilt Rust engine that is **not in this repo**. If no engine is installed, the launcher downloads `impeccable-<os>-<arch>` from GitHub releases (`engine-v0.1.18`), checks its SHA-256 against `engine-checksums.txt`, caches it under `~/.impeccable/bin/`, and runs it. The checksums come from the same upstream repo, so they only prove the download matches what upstream published. Without the engine the skill is meant to fall back to reading `PRODUCT.md` and `DESIGN.md` directly.

Live mode (`/impeccable live`) injects `scripts/live-browser.js` into the dev page and talks to a helper server on localhost with a per-session token. It edits source files when you accept a variant.
