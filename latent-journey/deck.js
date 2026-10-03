import { pages } from "./pages.js";

const deck = document.getElementById("deck");
const hud = document.getElementById("hud");
const toc = document.getElementById("toc");
const dialog = document.getElementById("index");
const field = document.getElementById("field");

const pad = (n) => String(n).padStart(2, "0");
const setHud = (i) => { hud.textContent = `${pad(i + 1)} / ${pad(pages.length)}`; };

deck.innerHTML = pages.map((page, i) => `
  <section class="page" id="p${i}" data-i="${i}">
    <p class="meta"><span>${page.id}</span><span>${page.chapter}</span></p>
    <figure><img src="${page.src}" alt="${page.title}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}></figure>
    <div>
      <h1>${page.title}</h1>
      <p class="formula">${page.formula}</p>
      <p class="note">${page.note}</p>
    </div>
  </section>
`).join("");

const nodes = [...deck.querySelectorAll(".page")];

toc.innerHTML = pages.map((page, i) => `
  <li><button type="button" data-go="${i}"><small>${page.id}</small><span>${page.title}</span></button></li>
`).join("");

const mark = (i) => {
  setHud(i);
  toc.querySelectorAll("button").forEach((btn, n) => {
    if (n === i) btn.setAttribute("aria-current", "location");
    else btn.removeAttribute("aria-current");
  });
};

const go = (i) => nodes[Math.min(pages.length - 1, Math.max(0, i))]?.scrollIntoView();

deck.addEventListener("scrollsnapchange", (event) => {
  const i = nodes.indexOf(event.snapTargetBlock);
  if (i >= 0) mark(i);
});

if (!("onscrollsnapchange" in window)) {
  const seen = new IntersectionObserver((entries) => {
    const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (hit) mark(Number(hit.target.dataset.i));
  }, { root: deck, threshold: 0.6 });
  nodes.forEach((node) => seen.observe(node));
}

document.getElementById("next").onclick = () => {
  const i = nodes.findIndex((n) => n.getBoundingClientRect().top >= -8);
  go(i + 1);
};
document.getElementById("prev").onclick = () => {
  const i = nodes.findIndex((n) => n.getBoundingClientRect().top >= -8);
  go(i - 1);
};
document.getElementById("open-index").onclick = () => dialog.showModal();
toc.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-go]");
  if (!btn) return;
  dialog.close();
  go(Number(btn.dataset.go));
});
addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === " ") { event.preventDefault(); document.getElementById("next").click(); }
  if (event.key === "ArrowUp") { event.preventDefault(); document.getElementById("prev").click(); }
  if (event.key === "i" && !dialog.open) dialog.showModal();
});

const ctx = field.getContext("2d");
const stars = Array.from({ length: 80 }, () => ({
  x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2, a: Math.random()
}));
const paint = () => {
  const w = field.width = innerWidth * devicePixelRatio;
  const h = field.height = innerHeight * devicePixelRatio;
  ctx.clearRect(0, 0, w, h);
  stars.forEach((s) => {
    ctx.fillStyle = `rgba(210,225,255,${0.15 + s.a * 0.45})`;
    ctx.fillRect(s.x * w, s.y * h, s.r * devicePixelRatio, s.r * devicePixelRatio);
  });
};
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  paint();
  addEventListener("resize", paint, { passive: true });
}
mark(0);
