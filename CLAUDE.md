@AGENTS.md

## Claude-specific

- Owner is Jan. Concise, code-first. Expand acronyms on first use.
- Never push to `prod`. Branch `claude/<topic>`, open a PR, let `check.yml` run.
- Verify before claiming: run `node scripts/check-site.mjs`; for live paths, curl `https://artsrun.github.io/<path>` and report the status code.
- When a link 404s, find the cause in the sibling repo (deploy trigger branch, Pages off, WIP) before editing the hub.
- `ROADMAP.md` is the plan. Tick items there in the same PR that does them.
