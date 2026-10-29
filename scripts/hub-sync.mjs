// Weekly fleet audit: hub links ↔ Artsrun repos with Pages. Node 20+, zero deps.
// Prints a Markdown report to stdout. Writes `findings=<n>` to $GITHUB_OUTPUT when set.
// Env: GITHUB_TOKEN (recommended, raises API limit) · REPOS_JSON=path (offline fixture, skips network).
import { readFileSync, readdirSync, appendFileSync } from "node:fs";
import { join, dirname } from "node:path";

const OWNER = "Artsrun";
const SITE = `https://artsrun.github.io`;
const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");
const headers = {
  accept: "application/vnd.github+json",
  "user-agent": "artsrun-hub-sync",
  ...(process.env.GITHUB_TOKEN && { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
};

const api = async (path) => {
  const r = await fetch(`https://api.github.com${path}`, { headers });
  if (!r.ok) throw new Error(`${r.status} ${path}`);
  return r.json();
};

const allRepos = async () => {
  if (process.env.REPOS_JSON) return JSON.parse(readFileSync(process.env.REPOS_JSON, "utf8"));
  const out = [];
  for (let page = 1; ; page++) {
    const batch = await api(`/users/${OWNER}/repos?type=owner&per_page=100&page=${page}`);
    out.push(...batch);
    if (batch.length < 100) return out;
  }
};

const status = async (url) => {
  if (process.env.REPOS_JSON) return 0;
  try {
    return (await fetch(url, { method: "HEAD", redirect: "follow" })).status;
  } catch {
    return -1;
  }
};

// Pages workflows whose push trigger never fires on the repo's default branch.
const deadTriggers = async (repo) => {
  if (process.env.REPOS_JSON) return repo._workflows ?? [];
  let files;
  try {
    files = await api(`/repos/${OWNER}/${repo.name}/contents/.github/workflows?ref=${repo.default_branch}`);
  } catch {
    return [];
  }
  const dead = [];
  for (const f of files.filter((x) => /\.ya?ml$/.test(x.name))) {
    const yml = await (await fetch(f.download_url)).text();
    if (!yml.includes("deploy-pages")) continue;
    const m = yml.match(/push:\s*\n\s+branches:\s*\[([^\]]*)\]/);
    if (!m) continue;
    const branches = m[1].split(",").map((s) => s.trim().replace(/["']/g, ""));
    if (!branches.includes(repo.default_branch)) dead.push(`${f.name} → [${branches.join(", ")}]`);
  }
  return dead;
};

// Sibling paths the hub links to: root-relative first segments that are not folders here.
const localDirs = new Set(readdirSync(ROOT, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name));
const hubHtml = readFileSync(join(ROOT, "index.html"), "utf8");
const hubSegs = new Set([...hubHtml.matchAll(/href="\/([^/"?#]+)\/?"/g)].map((m) => m[1]));
const linked = new Set([...hubSegs].filter((s) => !localDirs.has(s)));

const repos = await allRepos();
const pages = repos.filter((r) => r.has_pages && r.name.toLowerCase() !== `${OWNER}.github.io`.toLowerCase());
const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));

const rows = { missing: [], dead: [], noPages: [], shadowed: [], triggers: [] };

for (const r of pages) {
  if (!hubSegs.has(r.name)) rows.missing.push(`\`${r.name}\` — ${r.description ?? "no description"} · ${SITE}/${r.name}/`);
  const t = await deadTriggers(r);
  t.forEach((w) => rows.triggers.push(`\`${r.name}\` default \`${r.default_branch}\` — ${w}`));
  if (localDirs.has(r.name)) rows.shadowed.push(`\`${r.name}/\` here is hidden by the \`${r.name}\` repo's Pages`);
}

for (const name of linked) {
  const repo = byName.get(name.toLowerCase());
  if (!repo) rows.dead.push(`\`/${name}/\` — no repo named \`${name}\``);
  else if (!repo.has_pages) rows.noPages.push(`\`/${name}/\` — repo exists, Pages off`);
  const code = await status(`${SITE}/${name}/`);
  if (code && code !== 200) rows.dead.push(`\`/${name}/\` — live returns ${code}`);
}

const section = (title, list) => (list.length ? `### ${title}\n${list.map((x) => `- ${x}`).join("\n")}\n` : "");
const findings = Object.values(rows).reduce((n, l) => n + l.length, 0);
const report = [
  `## Hub sync — ${new Date().toISOString().slice(0, 10)}`,
  `${pages.length} repos with Pages · ${linked.size} sibling links on the hub · ${findings} findings\n`,
  section("Dead links on the hub", rows.dead),
  section("Linked, but Pages is off", rows.noPages),
  section("Pages deploy never fires (push trigger ≠ default branch)", rows.triggers),
  section("Live on Pages, missing from the hub", rows.missing),
  section("Shadowed folders in this repo", rows.shadowed),
  findings ? "" : "All clean.",
].join("\n");

console.log(report);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `findings=${findings}\n`);
