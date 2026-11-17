/* Applies the saved shelf-theme before paint, and keeps <meta name="color-scheme">
   in sync so native UI follows the same choice. The stored key stays "shelf-theme". */
(function () {
  var KEY = "shelf-theme";
  var LIGHT = "#f4efe6";
  var DARK = "#161310";

  function meta() {
    return document.querySelector('meta[name="color-scheme"]');
  }
  function stored() {
    try {
      var t = localStorage.getItem(KEY);
      return t === "light" || t === "dark" ? t : "";
    } catch (e) {
      return "";
    }
  }
  function systemDark() {
    return matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function explicit() {
    var m = meta();
    return m && (m.content === "light" || m.content === "dark") ? m.content : "";
  }
  function syncThemeColor(choice) {
    var tags = document.querySelectorAll('meta[name="theme-color"]');
    if (!tags.length) return;
    if (!choice) {
      if (tags[0]) {
        tags[0].setAttribute("content", LIGHT);
        tags[0].setAttribute("media", "(prefers-color-scheme: light)");
      }
      if (tags[1]) {
        tags[1].setAttribute("content", DARK);
        tags[1].setAttribute("media", "(prefers-color-scheme: dark)");
      }
      return;
    }
    var color = choice === "dark" ? DARK : LIGHT;
    for (var i = 0; i < tags.length; i++) {
      tags[i].setAttribute("content", color);
      tags[i].removeAttribute("media");
    }
  }
  function paint(choice) {
    var m = meta();
    if (m) m.setAttribute("content", choice || "light dark");
    syncThemeColor(choice);
  }
  function apply(next) {
    var choice = next === "light" || next === "dark" ? next : "";
    paint(choice);
    try {
      if (choice) localStorage.setItem(KEY, choice);
      else localStorage.removeItem(KEY);
    } catch (e) {}
    return choice;
  }
  function renderedDark() {
    var choice = explicit();
    if (choice === "dark") return true;
    if (choice === "light") return false;
    return systemDark();
  }
  function toggle() {
    var target = renderedDark() ? "light" : "dark";
    var matchesSystem = (target === "dark") === systemDark();
    return apply(matchesSystem ? "" : target);
  }

  paint(stored());

  window.shelfTheme = {
    apply: apply,
    toggle: toggle,
    renderedDark: renderedDark,
    explicit: explicit
  };

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (!explicit()) {
      paint("");
      document.dispatchEvent(new CustomEvent("shelf-theme"));
    }
  });
  addEventListener("storage", function (e) {
    if (e.key !== KEY && e.key !== null) return;
    var choice = e.newValue === "light" || e.newValue === "dark" ? e.newValue : "";
    paint(choice);
    document.dispatchEvent(new CustomEvent("shelf-theme"));
  });
})();
