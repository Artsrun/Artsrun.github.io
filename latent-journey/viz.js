import { tokens, ids } from "./pages.js";

const ink = "#e7eef8";
const dim = "#8ea0b8";
const amber = "#e8b15a";
const cyan = "#9fd0ff";
const violet = "#b7a6ff";

const stars = (ctx, w, h, t) => {
  for (let i = 0; i < 70; i++) {
    const x = ((i * 97) % 1000) / 1000 * w;
    const y = ((i * 57 + t * 4) % 1000) / 1000 * h;
    ctx.fillStyle = `rgba(210,225,255,${0.15 + (i % 5) * 0.08})`;
    ctx.fillRect(x, y, 1.4, 1.4);
  }
};

const label = (ctx, text, x, y, color = dim) => {
  ctx.fillStyle = color;
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(text, x, y);
};

const title = (ctx, w, h, t) => {
  const cx = w / 2;
  const cy = h * 0.46;
  const R = Math.min(w, h) * 0.3;
  const yaw = t * 0.35;
  for (let i = 0; i < 640; i++) {
    const phi = Math.acos(1 - 2 * ((i + 0.5) / 640));
    const th = Math.PI * (1 + Math.sqrt(5)) * i + yaw;
    const x = Math.sin(phi) * Math.cos(th);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(th);
    const px = cx + x * R;
    const py = cy + y * R * 0.9;
    ctx.fillStyle = `rgba(232,240,255,${0.2 + (z + 1) * 0.35})`;
    ctx.fillRect(px, py, z > 0 ? 2 : 1.2, z > 0 ? 2 : 1.2);
  }
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
  label(ctx, "LATENT JOURNEY", cx - 58, cy + R * 0.9 + 28, ink);
};

const lookup = (ctx, w, h, t) => {
  const cols = 16;
  const rows = 8;
  const cw = Math.min(28, (w - 48) / cols);
  const x0 = (w - cols * cw) / 2;
  const y0 = h * 0.28;
  const hot = Math.floor(t * 2) % cols;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = r === 3 && c === hot;
      ctx.fillStyle = on ? amber : `rgba(159,208,255,${0.12 + ((r * c) % 5) * 0.05})`;
      ctx.fillRect(x0 + c * cw, y0 + r * (cw + 4), cw - 3, cw - 3);
    }
  }
  label(ctx, `E[${ids[4]}] → row`, x0, y0 - 16, amber);
};

const bpe = (ctx, w, h, t) => {
  const pair = t % 2 < 1;
  const y = h * 0.46;
  const x = w / 2 - 90;
  ["s", "k"].forEach((ch, i) => {
    ctx.strokeStyle = pair ? amber : cyan;
    ctx.strokeRect(x + i * 52, y, 40, 40);
    label(ctx, ch, x + i * 52 + 14, y + 26, ink);
  });
  label(ctx, pair ? "pair" : "sk", x + 120, y + 26, amber);
  label(ctx, "rank 12", x, y + 64);
};

const embed = (ctx, w, h, t) => {
  const n = 48;
  const x0 = 28;
  const y = h * 0.42;
  const gap = (w - 56) / n;
  for (let i = 0; i < n; i++) {
    const a = 0.2 + 0.8 * Math.abs(Math.sin(i * 0.7 + t));
    ctx.fillStyle = i === Math.floor(12 + Math.sin(t) * 4) ? amber : `rgba(159,208,255,${a})`;
    ctx.fillRect(x0 + i * gap, y - a * 36, Math.max(2, gap - 2), 8 + a * 40);
  }
  label(ctx, "x4 = E[14744]", x0, y + 36, amber);
};

const residual = (ctx, w, h) => {
  const n = tokens.length;
  const gap = (w - 40) / n;
  tokens.forEach((tok, i) => {
    const x = 20 + i * gap;
    for (let k = 0; k < 18; k++) {
      ctx.fillStyle = `rgba(180,200,255,${0.15 + (k % 4) * 0.1})`;
      ctx.fillRect(x, h * 0.25 + k * 10, Math.max(6, gap - 10), 6);
    }
    label(ctx, String(i), x, h * 0.25 + 196);
  });
};

const add = (ctx, w, h, t) => {
  const y = h * 0.4;
  const pulse = 0.5 + 0.5 * Math.sin(t * 2);
  label(ctx, "x", w * 0.22, y, cyan);
  label(ctx, "+", w * 0.42, y, dim);
  label(ctx, "p", w * 0.52, y, violet);
  label(ctx, "=", w * 0.68, y, dim);
  label(ctx, "h", w * 0.78, y, amber);
  ctx.globalAlpha = pulse;
  ctx.fillStyle = amber;
  ctx.fillRect(w * 0.2, y + 20, w * 0.6, 8);
  ctx.globalAlpha = 1;
};

const matmul = (ctx, w, h, t) => {
  const cell = 16;
  const ax = w * 0.18;
  const ay = h * 0.32;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = r === 1 ? amber : "rgba(159,208,255,.35)";
      ctx.fillRect(ax + c * cell, ay + r * cell, cell - 2, cell - 2);
    }
  }
  const bx = ax + 70;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      ctx.fillStyle = c === 2 ? violet : "rgba(183,166,255,.3)";
      ctx.fillRect(bx + c * cell, ay + r * cell, cell - 2, cell - 2);
    }
  }
  label(ctx, "A 4×3", ax, ay - 12);
  label(ctx, "B 3×5", bx, ay - 12);
  label(ctx, "row · col → sum", ax, ay + 90, amber);
};

const rms = (ctx, w, h, t) => {
  const base = h * 0.62;
  for (let i = 0; i < 24; i++) {
    const raw = 20 + Math.abs(Math.sin(i)) * 80;
    const norm = 28 + (raw / 100) * 36;
    ctx.fillStyle = "rgba(159,208,255,.25)";
    ctx.fillRect(24 + i * ((w - 48) / 24), base - raw, 6, raw);
    ctx.fillStyle = amber;
    ctx.fillRect(24 + i * ((w - 48) / 24), base + 16 - norm * (0.6 + 0.4 * Math.sin(t)), 6, norm);
  }
  label(ctx, "raw", 24, base + 36);
  label(ctx, "RMSNorm", 70, base + 36, amber);
};

const qkv = (ctx, w, h) => {
  ["Q", "K", "V"].forEach((name, i) => {
    const x = w * (0.18 + i * 0.28);
    ctx.strokeStyle = [cyan, violet, amber][i];
    ctx.strokeRect(x, h * 0.3, 64, 120);
    label(ctx, name, x + 24, h * 0.3 + 64, ink);
  });
  label(ctx, "one matmul, three slices", 24, h * 0.3 - 16);
};

const rope = (ctx, w, h, t) => {
  const n = 8;
  for (let i = 0; i < n; i++) {
    const speed = Math.pow(0.45, i);
    const cx = (w / (n + 1)) * (i + 1);
    const cy = h * 0.46;
    ctx.strokeStyle = dim;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.stroke();
    const a = t * speed * 2;
    ctx.strokeStyle = i < 3 ? amber : cyan;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * 16, cy + Math.sin(a) * 16);
    ctx.stroke();
  }
  label(ctx, "fast", 20, h * 0.46 + 40, amber);
  label(ctx, "slow", w - 48, h * 0.46 + 40, cyan);
};

const heads = (ctx, w, h, t) => {
  const n = 8;
  const cw = (w - 40) / n;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c <= r; c++) {
      const hot = c === Math.floor((t * 2) % n) && r === n - 1;
      ctx.fillStyle = hot ? amber : `rgba(159,208,255,${0.15 + c / n})`;
      ctx.fillRect(20 + c * cw, h * 0.24 + r * 16, cw - 4, 12);
    }
  }
  label(ctx, "causal mask", 20, h * 0.24 - 12);
};

const concat = (ctx, w, h, t) => {
  const x = w * 0.2;
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i === Math.floor(t) % 8 ? amber : violet;
    ctx.fillRect(x + i * 22, h * 0.34 + Math.sin(t + i) * 8, 16, 48);
  }
  ctx.fillStyle = cyan;
  ctx.fillRect(x, h * 0.58, 176, 14);
  label(ctx, "concat → 4096", x, h * 0.58 + 36, cyan);
};

const swiglu = (ctx, w, h, t) => {
  const n = 20;
  for (let i = 0; i < n; i++) {
    const gate = 1 / (1 + Math.exp(-(Math.sin(i + t) * 2)));
    const x = 24 + i * ((w - 48) / n);
    ctx.fillStyle = "rgba(159,208,255,.3)";
    ctx.fillRect(x, h * 0.55 - 40, 8, 40);
    ctx.fillStyle = amber;
    ctx.globalAlpha = 0.35 + gate * 0.65;
    ctx.fillRect(x, h * 0.55 - 40 * gate, 8, 40 * gate);
    ctx.globalAlpha = 1;
  }
  label(ctx, "SiLU gate", 24, h * 0.55 + 24, amber);
};

const depth = (ctx, w, h, t) => {
  const layer = Math.floor(t * 4) % 32;
  for (let i = 0; i < 32; i++) {
    const y = h * 0.22 + i * ((h * 0.5) / 32);
    ctx.fillStyle = i === layer ? amber : "rgba(159,208,255,.25)";
    ctx.fillRect(w * 0.3, y, w * 0.4, 4);
  }
  label(ctx, `layer ${layer + 1} / 32`, w * 0.3, h * 0.22 - 12, amber);
};

const logits = (ctx, w, h, t) => {
  const n = 40;
  for (let i = 0; i < n; i++) {
    const v = Math.exp(-Math.pow((i - 18) / 6, 2)) * (0.7 + 0.3 * Math.sin(t + i));
    ctx.fillStyle = i === 18 ? amber : cyan;
    ctx.fillRect(16 + i * ((w - 32) / n), h * 0.62 - v * 120, 4, v * 120);
  }
  label(ctx, "32000 scores", 16, h * 0.62 + 20);
};

const topp = (ctx, w, h) => {
  let mass = 0;
  const n = 16;
  for (let i = 0; i < n; i++) {
    const p = Math.exp(-i * 0.35);
    mass += p;
    ctx.fillStyle = mass < 3.2 ? amber : "rgba(142,160,184,.35)";
    ctx.fillRect(24 + i * ((w - 48) / n), h * 0.58 - p * 80, (w - 48) / n - 4, p * 80);
  }
  label(ctx, "nucleus p = 0.90", 24, h * 0.58 + 24, amber);
};

const kv = (ctx, w, h, t) => {
  for (let layer = 0; layer < 6; layer++) {
    const y = h * 0.28 + layer * 22;
    ctx.fillStyle = "rgba(232,177,90,.75)";
    ctx.fillRect(w * 0.45, y, 140, 10);
    if (layer === Math.floor(t) % 6) {
      ctx.fillStyle = cyan;
      ctx.fillRect(w * 0.2, y, 40, 10);
    }
  }
  label(ctx, "new token", w * 0.16, h * 0.24, cyan);
  label(ctx, "KV cache", w * 0.45, h * 0.24, amber);
};

const growth = (ctx, w, h, t) => {
  const n = 4 + Math.floor((t * 2) % 8);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = i === n - 1 ? amber : cyan;
    ctx.fillRect(24 + i * 28, h * 0.5, 20, 16);
  }
  label(ctx, `${n} positions`, 24, h * 0.5 + 40, amber);
};

const end = (ctx, w, h) => {
  label(ctx, "v2", w / 2 - 10, h * 0.46, ink);
  label(ctx, "canvas timeline", w / 2 - 52, h * 0.46 + 22);
};

const stages = { title, lookup, bpe, embed, residual, add, matmul, rms, qkv, rope, heads, concat, swiglu, depth, logits, topp, kv, growth, end };

export const drawStage = (ctx, w, h, stage, t) => {
  ctx.clearRect(0, 0, w, h);
  stars(ctx, w, h, t);
  (stages[stage] || title)(ctx, w, h, t);
};
