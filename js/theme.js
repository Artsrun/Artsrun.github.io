(() => {
  const key = "artsrun-theme";
  const root = document.documentElement;
  const stored = localStorage.getItem(key);
  const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const current = () => (stored === "light" || stored === "dark" ? stored : system);

  const paint = (btn, theme) => {
    const next = theme === "dark" ? "light" : "dark";
    btn.textContent = next;
    btn.setAttribute("aria-label", `Switch to ${next}`);
    btn.setAttribute("aria-pressed", String(theme === "dark"));
  };

  const apply = (theme) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const btn = document.getElementById("theme-toggle");
    if (btn) paint(btn, theme);
  };

  apply(current());

  const mount = () => {
    const nav = document.querySelector("nav");
    if (!nav || document.getElementById("theme-toggle")) return;
    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.style.cssText = "margin-left:auto;background:none;border:0;padding:0;font:inherit;letter-spacing:.12em;text-transform:uppercase;color:inherit;cursor:pointer";
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
