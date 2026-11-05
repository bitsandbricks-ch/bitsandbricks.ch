// Applies the saved colour scheme before first paint, and wires the toggle.
(function () {
  var root = document.documentElement, saved = null;
  try { saved = localStorage.getItem("bb_theme"); } catch (e) {}
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  document.addEventListener("DOMContentLoaded", function () {
    // Phone menu: the nav drops down under the header
    var menu = document.querySelector("[data-menu-toggle]"), head = document.querySelector(".site-head");
    if (menu && head) {
      var setOpen = function (open) { head.classList.toggle("open", open); menu.setAttribute("aria-expanded", open ? "true" : "false"); };
      menu.addEventListener("click", function () { setOpen(!head.classList.contains("open")); });
      head.querySelector(".nav").addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && head.classList.contains("open")) { setOpen(false); menu.focus(); } });
    }
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("bb_theme", root.dataset.theme); } catch (e) {}
    });
  });
})();
