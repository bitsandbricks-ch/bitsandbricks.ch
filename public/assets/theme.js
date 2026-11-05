// Applies the saved colour scheme before first paint, and wires the toggle.
(function () {
  var root = document.documentElement, saved = null;
  try { saved = localStorage.getItem("bb_theme"); } catch (e) {}
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("bb_theme", root.dataset.theme); } catch (e) {}
    });
  });
})();
