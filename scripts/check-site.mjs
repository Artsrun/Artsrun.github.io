// Zero-dep site check. Node 20+. Exit 1 on errors, 0 otherwise (warnings print but pass).
// Usage: node scripts/check-site.mjs [--strict]   (--strict: warnings fail too)
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative, posix } from "node:path";

const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");
const STRICT = process.argv.includes("--strict");

// Pages with their own palette — skip shell rules (keep in sync with AGENTS.md → Islands).
const ISLANDS = [/^quiz\//, /^fools-journey\/index\.html$/, /^latent-journey\//];
const IGNORE = [/(^|\/)probe\.html$/, /^\.git\//, /^node_modules\//, /^_site\//];
const NAV = ["/", "/projects/", "/blog/"];
// Known dead links waiting on content (downgraded to warnings). Each must have a ROADMAP.md item.
const PENDING = new Map([
  ["/fools-journey/lexicon/catalog.json", "promised on the field page, not shipped yet — ROADMAP P0"],
]);

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const rel = (p) => relative(ROOT, p).split("\\").join("/");
const topDirs = new Set(
  readdirSync(ROOT, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
);

const errors = [];
const warns = [];
const siblings = new Set();
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warns.push(`${f}: ${m}`);

// Resolve a local URL to a file on disk. Returns true | false | "sibling".
const resolveLocal = (fromFile, url) => {
  const clean = url.split(/[?#]/)[0];
  if (!clean) return true;
  const isRoot = clean.startsWith("/");
  if (isRoot) {
    const seg = clean.split("/")[1];
    if (seg && !topDirs.has(seg) && !existsSync(join(ROOT, seg))) return "sibling";
  }
  const base = isRoot ? ROOT : dirname(join(ROOT, fromFile));
  const target = join(base, isRoot ? clean.slice(1) : clean);
  if (existsSync(target) && statSync(target).isFile()) return true;
  if (existsSync(join(target, "index.html"))) return true;
  return false;
};

const SKIP_URL = /^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)|\$\{/;

const html = walk(ROOT)
  .map(rel)
  .filter((f) => f.endsWith(".html") && !IGNORE.some((r) => r.test(f)));

for (const f of html) {
  const src = readFileSync(join(ROOT, f), "utf8");
  const island = ISLANDS.some((r) => r.test(f));

  // All pages
  if (f !== "404.html" || !/http-equiv="refresh"/.test(src)) {
    if (!/<html[^>]*\slang="(en|hy)"/i.test(src)) err(f, "missing <html lang=\"en|hy\">");
    if (!/<title>[^<]+<\/title>/i.test(src)) err(f, "missing <title>");
    if (!/<meta[^>]+name="viewport"/i.test(src)) err(f, "missing viewport meta");
  }

  // Shell pages
  if (!island) {
    const theme = src.indexOf("/js/theme.js");
    const css = src.indexOf("/css/site.css");
    if (css < 0) err(f, "shell page without /css/site.css (add it, or list the page in ISLANDS)");
    if (theme < 0) err(f, "shell page without /js/theme.js");
    else if (css >= 0 && theme > css) err(f, "/js/theme.js must load before /css/site.css (theme flash)");
    if (!/name="color-scheme"/.test(src)) warn(f, "no <meta name=\"color-scheme\">");

    // Section pages carry Hub/Projects/Blog; deeper pages may use a breadcrumb but must link Hub.
    const nav = src.match(/<nav>([\s\S]*?)<\/nav>/);
    if (!nav) err(f, "no top <nav>");
    else if (!nav[1].includes('href="/"')) err(f, "nav missing Hub link (/)");
    else if (NAV.some((h) => !nav[1].includes(`href="${h}"`)) && !nav[1].includes('aria-current="page"'))
      warn(f, "nav is neither the section nav nor a breadcrumb with aria-current");

    const styles = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
    const hex = [...new Set(styles.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [])];
    if (hex.length) warn(f, `hardcoded colors ${hex.join(" ")} — use tokens from css/site.css`);
  }

  // Links + assets
  for (const [, attr, url] of src.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (SKIP_URL.test(url)) continue;
    const r = resolveLocal(f, url);
    if (r === "sibling") siblings.add(url.split(/[?#]/)[0].split("/")[1]);
    else if (!r && PENDING.has(url)) warn(f, `pending ${attr} → ${url} (${PENDING.get(url)})`);
    else if (!r) err(f, `broken ${attr} → ${url}`);
  }
}

// Hub ↔ projects parity: every sibling demo on the hub should appear in projects/ (and vice versa).
const names = (f) =>
  new Set(
    [...readFileSync(join(ROOT, f), "utf8").matchAll(/class="name">([^<]+)</g)].map((m) => m[1].trim())
  );
const hub = names("index.html");
const proj = names("projects/index.html");
const onlyHub = [...siblings].filter((s) => hub.has(s) && !proj.has(s));
if (onlyHub.length) warn("projects/index.html", `on hub but not in projects: ${onlyHub.join(", ")}`);

// Shadowing: a top-level folder here with the same name as a sibling would be hidden by that repo's Pages.
// (Network check lives in hub-sync.mjs; here we only flag known shadowed folders.)
const SHADOWED = ["latent-journey"];
SHADOWED.filter((d) => topDirs.has(d)).forEach((d) =>
  warn(`${d}/`, "shadowed by the Artsrun/" + d + " repo's Pages — this folder is never served")
);

const out = (label, list) => list.length && console.log(`\n${label} (${list.length})\n  ${list.join("\n  ")}`);
console.log(`check-site: ${html.length} pages, ${siblings.size} sibling paths (${[...siblings].sort().join(" ")})`);
out("ERRORS", errors);
out("WARNINGS", warns);
const fail = errors.length || (STRICT && warns.length);
console.log(fail ? "\n✗ fail" : "\n✓ pass");
process.exit(fail ? 1 : 0);
