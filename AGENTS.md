This project's Baseline target is Baseline 2024.

User-site hub for artsrun.github.io. Static. No build step, no deps, no framework.

## Branches + deploy

- `prod` is the only live branch. `main` is stale (Sep 2026) — never target it.
- Agents work on `claude/<topic>` (or `copilot/…`, `opencode/…`) and open a PR into `prod`.
- Deploy = `.github/workflows/pages.yml` on push to `prod`, gated by `check.yml`.
- `/<repo>/` paths that are not folders here are sibling project sites (other repos with Pages). They are not in this repo.
- A folder here with the same name as a sibling repo is shadowed by that repo's Pages. Do not add one.

## Page shell (every page except islands)

```html
<meta name="color-scheme" content="light dark">
<script src="/js/theme.js"></script>          <!-- before CSS: no theme flash -->
<link rel="stylesheet" href="/css/site.css">
…
<nav><a href="/">Hub</a><a href="/projects/">Projects</a><a href="/blog/">Blog</a></nav>
```

- `aria-current="page"` on the nav link of the section you are in.
- Colors only through tokens in `css/site.css` (`--bg --fg --dim --line --acc --paper --teal --red --prose --sketch --wash`). Never hardcode hex in a shell page.
- Fonts: system stacks only (`ui-sans-serif`, `ui-monospace`). No web fonts.
- Layout classes: `.row` + `.name` + `.meta` for lists, `.sub` for lede, `.prose` for body, `pre.sketch` for ASCII.
- `lang` matches the page's main language (`en` or `hy`).

## Islands

Pages with their own palette, allowed to skip the shell: `quiz/*`, `fools-journey/index.html`, `latent-journey/*`, `**/probe.html`. Listed in `scripts/check-site.mjs`. New islands go on that list in the same PR.

## Adding a demo to the hub

1. Demo lives in its own repo with Pages on `prod`. Its deploy workflow must trigger on the branch that exists (`prod`), not `main`.
2. Add one `.row` to `index.html` (live path) and one to `projects/index.html` (repo link). Same `.meta` text in both.
3. `node scripts/check-site.mjs` passes.

## Rules

- JS: arrow functions, `const`, no globals beyond one IIFE. DOM writes with `textContent`, never `innerHTML` with data.
- Commits: short imperative, optional `area:` prefix (`paltonn: …`, `ci: …`).
- Data honesty: any figure on a page is either sourced (cite it on the page) or labeled stylized/illustrative. Never present invented numbers as measured.
- Before PR: `node scripts/check-site.mjs` must exit 0.
