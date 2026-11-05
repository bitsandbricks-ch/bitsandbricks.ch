// Reader features that live in the browser only: saved pages, course progress, quizzes and
// click-to-load comments. Nothing here talks to a server. With accounts later, saved pages and
// progress move to the account.
(function () {
  "use strict";
  function load(k) { try { return JSON.parse(localStorage.getItem(k) || "{}") || {}; } catch (e) { return {}; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var saved = load("bb_saved"), done = load("bb_done");
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  function paintSave(btn) {
    var on = !!saved[btn.dataset.save];
    btn.setAttribute("aria-pressed", on);
    var label = btn.querySelector("span");
    if (label) label.textContent = on ? "saved" : "save";
  }
  function paintProgress() {
    document.querySelectorAll("[data-lesson]").forEach(function (el) { el.classList.toggle("done", !!done[el.dataset.lesson]); });
    document.querySelectorAll("[data-course-card]").forEach(function (card) {
      var jacks = card.querySelectorAll(".jk"), up = 0, cur = null;
      jacks.forEach(function (j) { j.classList.remove("cur"); if (done[j.dataset.lesson]) up++; else if (!cur) cur = j; });
      if (cur) cur.classList.add("cur");
      var c = card.querySelector("[data-upcount]");
      if (c) c.textContent = up + "/" + jacks.length + " up";
      var go = card.querySelector("[data-continue]");
      if (go && cur) { go.href = cur.getAttribute("href"); go.textContent = (up ? "continue: " : "start: ") + cur.title; }
      else if (go) { go.textContent = "all lessons done"; }
    });
    document.querySelectorAll("[data-done]").forEach(function (b) {
      var on = !!done[b.dataset.done];
      b.setAttribute("aria-pressed", on);
      b.textContent = on ? "done, mark as not done" : "mark lesson as done";
    });
  }
  function renderSaved() {
    var box = document.getElementById("saved-list"), empty = document.getElementById("saved-empty");
    if (!box) return;
    var keys = Object.keys(saved);
    box.innerHTML = keys.map(function (u) { var s = saved[u]; return '<a href="' + esc(u) + '"><b>' + esc(s.title) + "</b><span>" + esc(s.kind) + " · " + esc(u) + "</span></a>"; }).join("");
    box.hidden = !keys.length;
    if (empty) empty.hidden = !!keys.length;
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-save],[data-done],[data-reset],[data-comments]");
    if (!t) return;
    if (t.dataset.save) {
      var u = t.dataset.save;
      if (saved[u]) delete saved[u]; else saved[u] = { title: t.dataset.title, kind: t.dataset.kind };
      store("bb_saved", saved); paintSave(t); renderSaved();
    } else if (t.dataset.done) {
      if (done[t.dataset.done]) delete done[t.dataset.done]; else done[t.dataset.done] = 1;
      store("bb_done", done); paintProgress();
    } else if (t.dataset.reset) {
      t.dataset.reset.split(" ").forEach(function (id) { delete done[id]; });
      store("bb_done", done); paintProgress();
    } else if (t.hasAttribute("data-comments")) {
      var box = t.closest(".comments"), cfg = box.dataset;
      if (!cfg.repoId || !cfg.categoryId) { box.innerHTML = "<p>Comments are not switched on yet.</p>"; return; }
      var s = document.createElement("script");
      s.src = "https://giscus.app/client.js"; s.async = true; s.crossOrigin = "anonymous";
      var attrs = { repo: cfg.repo, "repo-id": cfg.repoId, category: cfg.category, "category-id": cfg.categoryId, mapping: "pathname", strict: "1", "reactions-enabled": "1", "emit-metadata": "0", "input-position": "top", theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light", lang: "en", loading: "lazy" };
      Object.keys(attrs).forEach(function (k) { s.setAttribute("data-" + k, attrs[k]); });
      box.innerHTML = ""; box.appendChild(s);
    }
  });
  document.addEventListener("change", function (e) {
    var q = e.target.closest("[data-quiz]");
    if (!q || e.target.type !== "radio") return;
    var group = e.target.name, ok = e.target.value === "1";
    q.querySelectorAll('input[name="' + group + '"]').forEach(function (i) { i.parentNode.classList.remove("right", "wrong"); });
    e.target.parentNode.classList.add(ok ? "right" : "wrong");
    var res = q.querySelector('[data-result="' + group + '"]');
    if (res) res.textContent = ok ? (res.dataset.ok || "correct") : "not quite, try again";
  });

  function init() {
    document.querySelectorAll("[data-save]").forEach(paintSave);
    paintProgress(); renderSaved();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
