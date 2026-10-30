# Vendored skills

Copies of third-party skills, committed unmodified so they work in cloud sessions. To update, re-copy from upstream and bump the commit below.

| Folder | Upstream | Commit | License |
|---|---|---|---|
| `design-taste-frontend/` | https://github.com/Leonxlnx/taste-skill (`skills/taste-skill/`) | 12af471f627f866411b4bd785b19646d3672784c | MIT |
| `gsap-*/` and `llms.txt` | https://github.com/greensock/gsap-skills (`skills/`) | aed9cfd3277740755f6bfc1155c7aa645403b760 | MIT |

Each folder carries the upstream LICENSE file. The taste-skill folder was installed under its frontmatter name, `design-taste-frontend`, the way upstream's `install.sh` does.

Things to know before running the taste-skill scripts: they launch a headless Chrome with a throwaway profile in the system temp dir, serve the page on 127.0.0.1 only, and `draw.mjs` writes a history file to `~/.taste-skill/history.json` (override with `TASTE_SKILL_HISTORY`). `assets.mjs` downloads images or video from Openverse, Wikimedia Commons, the Met, the Art Institute of Chicago and NASA, and only runs when asked.
