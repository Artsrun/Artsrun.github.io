(() => {
  const key = "artsrun-theme";
  const root = document.documentElement;
  const stored = localStorage.getItem(key);
  const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const current = () => (stored === "light" || stored === "dark" ? stored : system);

  const apply = (theme) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const next = theme === "dark" ? "light" : "dark";
    btn.textContent = next;
    btn.setAttribute("aria-label", `Switch to ${next}`);
    btn.setAttribute("aria-pressed", String(theme === "dark"));
  };

  apply(current());

  const mount = () => {
    const nav = document.querySelector("nav");
    if (!nav || document.getElementById("theme-toggle")) return;
    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    nav.append(btn);
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem(key, next);
      apply(next);
    });
    apply(root.dataset.theme);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
