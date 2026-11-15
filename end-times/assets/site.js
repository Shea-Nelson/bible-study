// Shared header, theme toggle, and card filtering for the End Times study.
const PAGES = [
  ["index.html", "Home"], ["glossary.html", "Glossary"], ["views.html", "Views"], ["timelines.html", "Timelines"],
  ["events.html", "Events"], ["characters.html", "Characters"], ["ai.html", "AI & Scripture"], ["sources.html", "Sources"],
];
function applyTheme(next) {
  if (next) document.documentElement.setAttribute("data-theme", next);
  else document.documentElement.removeAttribute("data-theme");
  try { next ? localStorage.setItem("shelf-theme", next) : localStorage.removeItem("shelf-theme"); } catch (e) {}
  const btn = document.querySelector(".theme-btn");
  if (!btn) return;
  const ex = document.documentElement.getAttribute("data-theme");
  const dark = ex ? ex === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  btn.setAttribute("aria-pressed", dark ? "true" : "false");
  btn.textContent = dark ? "Light" : "Dark";
  btn.setAttribute("aria-label", dark ? "Switch to light colors" : "Switch to dark colors");
}
function header() {
  const here = (location.pathname.split("/").pop() || "index.html");
  const cur = here.startsWith("view-") ? "views.html" : here;
  const h = document.createElement("header"); h.className = "site";
  const b = document.createElement("a"); b.className = "brand"; b.href = "index.html";
  b.innerHTML = '<img src="assets/favicon.svg" alt="" width="28" height="28"><span>End Times</span>';
  const nav = document.createElement("nav"); nav.setAttribute("aria-label", "End Times study pages");
  for (const [href, label] of PAGES) {
    const a = document.createElement("a"); a.href = href; a.textContent = label;
    if (href === cur) a.setAttribute("aria-current", "page");
    nav.append(a);
  }
  const bible = document.createElement("a"); bible.href = "../bible/"; bible.className = "sep"; bible.textContent = "Bible hub";
  nav.append(bible);
  const t = document.createElement("button"); t.type = "button"; t.className = "theme-btn";
  t.addEventListener("click", () => {
    const ex = document.documentElement.getAttribute("data-theme");
    const dark = ex ? ex === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(dark ? "light" : "dark");
  });
  h.append(b, nav, t);
  const skip = document.querySelector(".skip");
  skip ? skip.after(h) : document.body.prepend(h);
  applyTheme(document.documentElement.getAttribute("data-theme"));
}
function filters() {
  document.querySelectorAll("[data-filter]").forEach((box) => {
    const scope = document.getElementById(box.dataset.filter);
    const input = box.querySelector(".search");
    const chips = [...box.querySelectorAll("button[data-chip]")];
    const count = box.querySelector(".count");
    const items = [...scope.querySelectorAll("[data-search]")];
    let chip = "all";
    const params = new URLSearchParams(location.search);
    if (params.get("q") && input) input.value = params.get("q");
    function run() {
      const q = (input?.value || "").trim().toLowerCase();
      let n = 0;
      for (const el of items) {
        const okChip = chip === "all" || (el.dataset.tags || "").split("|").includes(chip);
        const okQ = !q || el.dataset.search.includes(q);
        const show = okChip && okQ;
        el.classList.toggle("hidden", !show);
        if (show) n++;
      }
      if (count) count.textContent = n + " of " + items.length;
    }
    chips.forEach((c) => c.addEventListener("click", () => {
      chip = c.dataset.chip;
      chips.forEach((x) => x.setAttribute("aria-pressed", x === c ? "true" : "false"));
      run();
    }));
    input?.addEventListener("input", run);
    run();
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) { t.classList.remove("hidden"); const d = t.querySelector("details"); if (d) d.open = true; setTimeout(() => t.scrollIntoView(), 50); } }
  });
}
header();
filters();
