import { pages } from "./pages.js";
import { drawStage } from "./viz.js";

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const hud = document.getElementById("hud");
const toc = document.getElementById("toc");
const dialog = document.getElementById("index");
const title = document.getElementById("title");
const formula = document.getElementById("formula");
const note = document.getElementById("note");
const meta = document.getElementById("meta");

let index = Math.max(0, pages.findIndex((p) => p.id === location.hash.slice(1)));
let started = performance.now();
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const pad = (n) => String(n).padStart(2, "0");

const paintChrome = () => {
  const page = pages[index];
  title.textContent = page.title;
  formula.textContent = page.formula;
  note.textContent = page.note;
  meta.textContent = `${page.id}  ${page.chapter}`;
  hud.textContent = `${pad(index + 1)} / ${pad(pages.length)}`;
  toc.querySelectorAll("button").forEach((btn, n) => {
    if (n === index) btn.setAttribute("aria-current", "location");
    else btn.removeAttribute("aria-current");
  });
  history.replaceState(null, "", `#${page.id}`);
};

const resize = () => {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, rect.width * devicePixelRatio);
  canvas.height = Math.max(1, rect.height * devicePixelRatio);
};
const frame = (now) => {
  const t = reduce ? 0.8 : (now - started) / 1000;
  drawStage(ctx, canvas.width, canvas.height, pages[index].stage, t);
  if (!reduce) requestAnimationFrame(frame);
};
const go = (next) => {
  index = (next + pages.length) % pages.length;
  started = performance.now();
  paintChrome();
  if (reduce) frame(started);
};

toc.innerHTML = pages.map((page, i) => `
  <li><button type="button" data-go="${i}"><small>${page.id}</small><span>${page.title}</span></button></li>
`).join("");

document.getElementById("next").onclick = () => go(index + 1);
document.getElementById("prev").onclick = () => go(index - 1);
document.getElementById("open-index").onclick = () => dialog.showModal();
toc.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-go]");
  if (!btn) return;
  dialog.close();
  go(Number(btn.dataset.go));
});
addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") { event.preventDefault(); go(index + 1); }
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); go(index - 1); }
  if (event.key === "i" && !dialog.open) dialog.showModal();
});

let swipeX = 0;
canvas.addEventListener("pointerdown", (event) => { swipeX = event.clientX; });
canvas.addEventListener("pointerup", (event) => {
  const dx = event.clientX - swipeX;
  if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
});

addEventListener("resize", () => { resize(); if (reduce) frame(performance.now()); }, { passive: true });
resize();
paintChrome();
requestAnimationFrame(frame);
