// Shared header, theme toggle, and card filtering for the End Times study.
const PAGES = [
  ["index.html", "Home"], ["glossary.html", "Glossary"], ["views.html", "Views"], ["timelines.html", "Timelines"],
  ["events.html", "Events"], ["characters.html", "Characters"], ["ai.html", "AI & Scripture"], ["sources.html", "Sources"],
];
function syncThemeButton() {
  const btn = document.querySelector(".theme-btn");
  if (!btn || !window.shelfTheme) return;
  const dark = window.shelfTheme.renderedDark();
  btn.setAttribute("aria-pressed", dark ? "true" : "false");
  btn.textContent = dark ? "Light" : "Dark";
  btn.setAttribute("aria-label", dark ? "Switch to light colors" : "Switch to dark colors");
}
function header() {
  const here = (location.pathname.split("/").pop() || "index.html");
  const cur = here.startsWith("view-") ? "views.html" : here;
  const h = document.createElement("header"); h.className = "site";
  const b = document.createElement("a"); b.className = "brand"; b.href = "index.html";
  const img = document.createElement("img");
  img.src = "assets/favicon.svg"; img.alt = ""; img.width = 28; img.height = 28;
  const brandName = document.createElement("span");
  brandName.textContent = "End Times";
  b.append(img, brandName);
  const nav = document.createElement("nav"); nav.setAttribute("aria-label", "End Times study pages");
  const list = document.createElement("ul");
  for (const [href, label] of PAGES) {
    const li = document.createElement("li");
    const a = document.createElement("a"); a.href = href; a.textContent = label;
    if (href === cur) a.setAttribute("aria-current", "page");
    li.append(a);
    list.append(li);
  }
  const bibleItem = document.createElement("li");
  const bible = document.createElement("a"); bible.href = "../bible/"; bible.className = "sep"; bible.textContent = "Bible hub";
  bibleItem.append(bible);
  list.append(bibleItem);
  nav.append(list);
  const t = document.createElement("button"); t.type = "button"; t.className = "theme-btn";
  t.addEventListener("click", () => {
    if (window.shelfTheme) window.shelfTheme.toggle();
    syncThemeButton();
  });
  h.append(b, nav, t);
  const skip = document.querySelector(".skip");
  skip ? skip.after(h) : document.body.prepend(h);
  syncThemeButton();
  document.addEventListener("shelf-theme", syncThemeButton);
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
function syncScrollers() {
  document.querySelectorAll(".scrollx").forEach((el) => {
    const overflows = el.scrollWidth > el.clientWidth + 1;
    if (overflows) {
      if (!el.dataset.scrollLabel) {
        const section = el.closest("section");
        const heading = section && section.querySelector("h2, h1");
        el.dataset.scrollLabel = heading ? heading.textContent.trim() : "Diagram";
      }
      el.tabIndex = 0;
      el.setAttribute("role", "region");
      el.setAttribute("aria-label", el.dataset.scrollLabel + ", scroll sideways");
    } else if (el.getAttribute("role") === "region") {
      el.removeAttribute("tabindex");
      el.removeAttribute("role");
      el.removeAttribute("aria-label");
    }
  });
}
header();
filters();
syncScrollers();
addEventListener("resize", syncScrollers);
