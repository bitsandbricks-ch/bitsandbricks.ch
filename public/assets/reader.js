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
      // the start/continue button sits next to the card on a course page, not inside it
      var go = (card.closest(".lc-wrap") || card).querySelector("[data-continue]");
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
    box.innerHTML = keys.map(function (u) { var s = saved[u]; return '<div class="saved-row"><a href="' + esc(u) + '"><b>' + esc(s.title) + "</b><span>" + esc(s.kind) + " · " + esc(u) + '</span></a><button class="star" type="button" aria-pressed="true" data-save="' + esc(u) + '" data-title="' + esc(s.title) + '" data-kind="' + esc(s.kind) + '" aria-label="Remove ' + esc(s.title) + ' from saved"><span>remove</span></button></div>'; }).join("");
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
      var attrs = { repo: cfg.repo, "repo-id": cfg.repoId, category: cfg.category, "category-id": cfg.categoryId, mapping: "pathname", strict: "1", "reactions-enabled": "1", "emit-metadata": "0", "input-position": "top", theme: giscusTheme(), lang: "en", loading: "lazy" };
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

  // Giscus follows the site's colour scheme, also when the toggle changes it later
  function giscusTheme() {
    var t = document.documentElement.dataset.theme;
    return (t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  new MutationObserver(function () {
    var f = document.querySelector("iframe.giscus-frame");
    if (f && f.contentWindow) f.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme() } } }, "https://giscus.app");
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // "#" links on headings, so a section can be shared
  function anchors() {
    document.querySelectorAll(".prose-body h2[id], .prose-body h3[id]").forEach(function (h) {
      if (h.querySelector(".hanchor")) return;
      var a = document.createElement("a");
      a.className = "hanchor"; a.href = "#" + h.id; a.textContent = "#";
      a.setAttribute("aria-label", "Link to this section");
      h.appendChild(a);
    });
  }
  // A copy button on every code block: configs and show commands get pasted into a terminal
  function copyButtons() {
    document.querySelectorAll(".prose-body pre").forEach(function (pre) {
      if (pre.parentNode.classList.contains("pre-wrap") || !navigator.clipboard) return;
      var wrap = document.createElement("div"); wrap.className = "pre-wrap";
      pre.parentNode.insertBefore(wrap, pre); wrap.appendChild(pre);
      var b = document.createElement("button");
      b.type = "button"; b.className = "copy"; b.textContent = "copy";
      b.setAttribute("aria-label", "Copy code");
      b.addEventListener("click", function () {
        navigator.clipboard.writeText(pre.innerText.replace(/\n$/, "")).then(function () {
          b.textContent = "copied"; b.classList.add("ok");
          setTimeout(function () { b.textContent = "copy"; b.classList.remove("ok"); }, 1600);
        }, function () { b.textContent = "select + ctrl-c"; });
      });
      wrap.appendChild(b);
    });
  }
  // Quizzes: name the group by its question and announce the result to screen readers
  function quizzes() {
    document.querySelectorAll("[data-quiz]").forEach(function (q, i) {
      var b = q.querySelector("b");
      q.setAttribute("role", "radiogroup");
      if (b) { b.id = b.id || "quiz-q" + (i + 1); q.setAttribute("aria-labelledby", b.id); }
      q.querySelectorAll("[data-result]").forEach(function (r) { r.setAttribute("aria-live", "polite"); });
    });
  }

  function init() {
    document.querySelectorAll("[data-save]").forEach(paintSave);
    paintProgress(); renderSaved(); anchors(); copyButtons(); quizzes();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
