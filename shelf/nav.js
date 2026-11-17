/* Injects the shared site header. Pages set data-root to the relative path of this repo's root (for shelf/ assets). */
const SITE = "https://shea-nelson.github.io/";
/* Each app lives in its own repo now, so the links are absolute. */
const LINKS = [
  [SITE + "workout-app/", "Workout", "workout"],
  [SITE + "kitchen/recipes/", "Recipes", "recipes"],
  [SITE + "kitchen/planner/", "Planner", "planner"],
  [SITE + "bible-study/bible/", "Bible", "bible"],
  [SITE + "grok-lessons/", "Lessons", "lesson"],
  [SITE + "family-time/", "Family", "family"],
  [SITE + "game-library/", "Games", "games"],
  [SITE, "All pages", "hub"],
];

function currentKey() {
  const path = location.pathname.replace(/\/index\.html$/, "/");
  if (/^\/bible-study(\/|$)/.test(path)) return "bible";
  if (/^\/grok-lessons(\/|$)/.test(path)) return "lesson";
  if (/^\/family-time(\/|$)/.test(path)) return "family";
  if (/^\/game-library(\/|$)/.test(path)) return "games";
  if (/^\/kitchen\/recipes(\/|$)/.test(path)) return "recipes";
  if (/^\/kitchen\/planner(\/|$)/.test(path)) return "planner";
  if (/^\/workout-app(\/|$)/.test(path)) return "workout";
  return "hub";
}

function syncThemeButton() {
  const btn = document.querySelector(".theme-btn");
  if (!btn || !window.shelfTheme) return;
  const dark = window.shelfTheme.renderedDark();
  btn.setAttribute("aria-pressed", dark ? "true" : "false");
  btn.textContent = dark ? "Light" : "Dark";
  btn.setAttribute("aria-label", dark ? "Switch to light colors" : "Switch to dark colors");
}

function buildHeader() {
  const root = document.body.dataset.root || "./";
  const here = currentKey();
  const header = document.createElement("header");
  header.className = "site";
  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = SITE;
  const img = document.createElement("img");
  img.src = root + "shelf/favicon.svg";
  img.alt = "";
  img.width = 28;
  img.height = 28;
  const name = document.createElement("span");
  name.textContent = "Pages";
  brand.append(img, name);
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Pages on this site");
  const list = document.createElement("ul");
  for (const [href, label, key] of LINKS) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (key === here) a.setAttribute("aria-current", "page");
    li.append(a);
    list.append(li);
  }
  const extItem = document.createElement("li");
  const ext = document.createElement("a");
  ext.href = "https://shea-nelson.github.io/davenport-table/";
  ext.target = "_blank";
  ext.rel = "noopener noreferrer";
  ext.textContent = "Davenport";
  const sr = document.createElement("span");
  sr.className = "sr";
  sr.textContent = " (opens in a new tab)";
  ext.append(sr);
  extItem.append(ext);
  list.append(extItem);
  nav.append(list);
  const theme = document.createElement("button");
  theme.type = "button";
  theme.className = "theme-btn";
  theme.addEventListener("click", () => {
    if (window.shelfTheme) window.shelfTheme.toggle();
    syncThemeButton();
  });
  header.append(brand, nav, theme);
  return header;
}

const skip = document.querySelector(".skip");
const header = buildHeader();
if (skip) skip.after(header);
else document.body.prepend(header);
syncThemeButton();
document.addEventListener("shelf-theme", syncThemeButton);
