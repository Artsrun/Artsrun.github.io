# Roadmap — artsrun.github.io

Audit date: 29 Oct 2026. Every finding below was checked live (curl status / git refs / screenshots), not inferred.

## State at audit

- 19 pages here, 16 sibling demos linked (other repos' Pages under `/<repo>/`).
- Deploy: legacy "Deploy from branch `prod`". The old `pages.yml` targeted `main`, which is stale since 12 Sep → it never ran.
- Same copy-paste bug in sibling repos: Pages workflows triggering on `main` while the repo lives on `prod`.
- Two shared files hold the look: `css/site.css` (tokens, light/dark) + `js/theme.js` (toggle). 13 shell pages use them, 6 are islands with their own palette.

## P0 — broken now

- [ ] **Flip Pages source** → Settings → Pages → Source: *GitHub Actions*. Needed for the new gated `pages.yml`. (Jan, 1 click)
- [ ] **`/joke-jar/` 404** — its `deploy.yml` pushes on `["main"]`, repo only has `prod`. Fix: `branches: [prod]` in Artsrun/joke-jar.
- [ ] **`/room-scanic/` 404** — Pages off and `NOTE.txt` says WIP. Unlink from hub until it ships, or enable Pages.
- [ ] **`/agents/` board 404** — Artsrun/agents `pages.yml` on `main`, default is `prod`. Align the trigger.
- [ ] **max-perf-webgl** — live today, but `pages.yml` triggers on `"main"` while default is `prod`. Next `prod` push won't deploy.
- [ ] **`/fools-journey/lexicon/catalog.json`** — linked from the field page ("next commit attaches catalog.json"), never shipped. Ship it or drop the link. Checker lists it as `PENDING`.
- [ ] **`latent-journey/` here is shadowed** — live `/latent-journey/` is served by the Artsrun/latent-journey repo (`deck.css?v=7`). This folder (~700 KB of frames) is never served. Delete it; the repo is the source of truth.
- [ ] Delete stale `main` branch here (12 Sep, behind `prod`).
- [x] Light-mode contrast: `/blog/chain/`, `/blog/ai-stack-kamoji/`, `/fools-journey/lexicon/` hardcoded the dark `--prose` (`#d8d3c6`) and dark surfaces → beige-on-beige and dark-on-dark in light mode. Now tokens.
- [x] Same three pages loaded `site.css` without `theme.js` → no toggle, stored theme ignored. Fixed.
- [x] `404.html` was a silent `meta refresh` to `/` — hid every broken sibling link. Now a real 404 in the shell, with a source link for `/<repo>/` paths.
- [x] `[hidden]` was overridden by `.row { display:block }`. Global guard in `site.css`.

## P1 — agent workflow (this PR)

- [x] `AGENTS.md` = single rule source (Claude Code, Copilot, OpenCode). `CLAUDE.md` imports it. `.github/copilot-instructions.md` points to it.
- [x] `.claude/settings.json` — agents may run the checker; may not push to `prod` or force-push.
- [x] `scripts/check-site.mjs` — zero-dep: lang/title/viewport, shell boot order, nav, hardcoded hex, every local href/src resolves, hub↔projects parity, shadowed folders.
- [x] `check.yml` on PRs; `pages.yml` = check → stage `_site` → deploy (on `prod`).
- [x] `audit.yml` weekly (Mon 10:17 Yerevan): lychee on every live page + `hub-sync.mjs` fleet audit → one upserted issue each, label `audit`.
- [x] `claude.yml` — `@claude` in issues/PRs. Write-access users only (action default).
- [x] Issue form "Add a demo to the hub" → `@claude` verifies the live path, then PRs both lists.
- [x] Dependabot for action versions, monthly, grouped.
- [ ] **Secret** `CLAUDE_CODE_OAUTH_TOKEN` — run `/install-github-app` in Claude Code CLI, or `claude setup-token` and add it. (Jan)
- [ ] Optional: branch protection on `prod` requiring `check / site`. Keeps agents honest; Jan can still bypass as admin.

## P2 — one source of truth for the hub

- [ ] `projects.json` → generate the hub list and `projects/` list at deploy (zero-dep Node step in `pages.yml`). Today both are hand-kept and drift: hub links live paths, projects links repos, `.meta` text differs.
- [ ] `hub-sync` opens a PR instead of an issue when a Pages repo is missing from `projects.json`.
- [ ] Add **speedy** — live at `/speedy/`, on neither list.
- [ ] Ship **flame** (`/flame/`): Earth vs µg flame shader with the hard wall between cited FLEX/ISS figures and stylized art. Island page. Optional next: toy heat-equation FBO (framebuffer object) solve, labeled as a toy.
- [ ] `sitemap.xml` + `robots.txt` generated from the same list.

## P3 — styles

- [ ] Collapse the duplicated light block in `site.css` with `light-dark()` (Baseline 2024). `theme.js` already sets `style.colorScheme`, so tokens become one declaration each:
  ```css
  :root { color-scheme: light dark; --bg: light-dark(#f4f0e6, #0b0c0e); --fg: light-dark(#1b1914, #e8e4d9); … }
  ```
  Removes ~25 lines and the `[data-theme]`/media-query double bookkeeping.
- [ ] Islands audit: `quiz/*` (paper + navy), `fools-journey/`. Keep as deliberate islands, but read `--bg/--fg` fallbacks so the theme toggle doesn't feel broken when hopping in.
- [ ] Open Graph + favicon: no `og:*`, no favicon, no `twitter:card` anywhere → bare previews on X/Telegram/LinkedIn (Speedy posts link here). One SVG favicon + per-page `og:title/description`, one shared `og:image`.
- [ ] `lang` audit: `blog/index.html` and `lezu/` say `hy` but body is mostly English.
- [ ] Cache-bust: only `index.html` versions `site.css`. Either version everywhere at deploy (hash in `pages.yml`) or nowhere (Pages `max-age=600`).
- [ ] Checker `--strict` in CI once warnings reach zero.

## P4 — performance budget

- [ ] Lighthouse CI on PRs touching shell files: budgets for LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift), total JS.
- [ ] Fleet template: one reusable `pages.yml` in a `.github` repo (`on: push: branches: [prod]`), referenced by every demo repo — kills the `main`/`prod` drift class of bug.
