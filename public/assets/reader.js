// Reader features that live in the browser only: saved pages, course progress, quizzes and
// click-to-load comments. Nothing here talks to a server. With accounts later, saved pages and
// progress move to the account.
(function () {
  "use strict";
  function load(k) { try { return JSON.parse(localStorage.getItem(k) || "{}") || {}; } catch (e) { return {}; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var saved = load("bb_saved"), done = load("bb_done");
  // Re-read before every change: another tab may have saved something since this page loaded,
  // and writing our old copy back would drop it.
  function refresh() { saved = load("bb_saved"); done = load("bb_done"); }
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
      b.textContent = on ? "done ✓ (undo)" : "mark lesson as done";
    });
  }
  function renderSaved() {
    var box = document.getElementById("saved-list"), empty = document.getElementById("saved-empty");
    if (!box) return;
    var keys = Object.keys(saved).filter(function (u) { return /^\/[^/]/.test(u); }); // site paths only
    box.innerHTML = keys.map(function (u) { var s = saved[u]; return '<div class="saved-row"><a href="' + esc(u) + '"><b>' + esc(s.title) + "</b><span>" + esc(s.kind) + " · " + esc(u) + '</span></a><button class="star" type="button" aria-pressed="true" data-save="' + esc(u) + '" data-title="' + esc(s.title) + '" data-kind="' + esc(s.kind) + '" aria-label="Remove ' + esc(s.title) + ' from saved"><span>remove</span></button></div>'; }).join("");
    box.hidden = !keys.length;
    if (empty) empty.hidden = !!keys.length;
  }

  function repaint() { renderSaved(); document.querySelectorAll("[data-save]").forEach(paintSave); paintProgress(); }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-done-next],[data-save],[data-done],[data-reset]")) refresh();
    var dn = e.target.closest("[data-done-next]");
    if (dn) { done[dn.dataset.doneNext] = 1; store("bb_done", done); return; } // the link then navigates
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
    score();
  });
  // "2/3 right" under the last question of a quiz page
  function score() {
    var qs = document.querySelectorAll("[data-quiz]");
    if (!qs.length) return;
    var box = document.getElementById("quiz-score");
    if (!box) {
      box = document.createElement("p"); box.id = "quiz-score"; box.className = "quiz-score"; box.setAttribute("aria-live", "polite");
      qs[qs.length - 1].after(box);
    }
    var right = 0, answered = 0;
    qs.forEach(function (q) { if (q.querySelector("label.right")) { right++; answered++; } else if (q.querySelector("label.wrong")) answered++; });
    box.textContent = "$ show quiz score: " + right + "/" + qs.length + " right" + (answered < qs.length ? ", " + (qs.length - answered) + " to go" : right === qs.length ? ". All green." : "");
  }

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
      // wide code scrolls sideways, so keyboard users must be able to focus it
      if (pre.scrollWidth > pre.clientWidth) { pre.tabIndex = 0; pre.setAttribute("aria-label", "code, scrolls sideways"); }
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

  // Page bits that used to be inline scripts (the Content-Security-Policy allows no inline code)
  function filter(input, items, key) {
    var box = document.getElementById(input);
    if (!box) return;
    box.addEventListener("input", function () {
      var q = box.value.trim().toLowerCase();
      document.querySelectorAll(items).forEach(function (r) { r.hidden = !!q && r.dataset[key].indexOf(q) < 0; });
    });
  }

  function graph() {
    var fg = document.getElementById("fullgraph"), stat = document.getElementById("gstat"), tags = document.getElementById("gtags"), cur = "";
    if (!fg || !stat || !tags) return;
    fg.scrollLeft = (fg.scrollWidth - fg.clientWidth) / 2;
    function pick(t) {
      cur = t;
      var n = 0;
      fg.querySelectorAll("a.nd").forEach(function (a) {
        if (a.classList.contains("dir")) { a.classList.toggle("dim", !!cur); return; }
        var hit = !!cur && (" " + a.dataset.tags + " ").indexOf(" " + cur + " ") >= 0;
        if (hit) n++;
        a.classList.toggle("hl", hit);
        a.classList.toggle("dim", !!cur && !hit);
      });
      tags.querySelectorAll("[data-hl]").forEach(function (x) { x.setAttribute("aria-pressed", x.dataset.hl === cur ? "true" : "false"); });
      stat.textContent = "";
      if (cur) {
        var a = document.createElement("a"); a.href = "/tags/" + encodeURIComponent(cur) + "/"; a.textContent = "List them";
        stat.append(n + " notes tagged #" + cur + ", lit up below. ", a, " or click the tag again to clear.");
      }
    }
    tags.addEventListener("click", function (e) {
      var b = e.target.closest("[data-hl]"); if (b) pick(cur === b.dataset.hl ? "" : b.dataset.hl);
    });
    // /kb/graph/?tag=ospf opens with that tag lit
    var t = new URLSearchParams(location.search).get("tag");
    if (t && tags.querySelector('[data-hl="' + CSS.escape(t) + '"]')) pick(t);
  }

  // Backup of saved pages and lesson progress as a JSON file, to move them to another browser
  function backup() {
    var dl = document.querySelector("[data-backup-save]"), up = document.querySelector("[data-backup-load]"), msg = document.getElementById("backup-msg");
    if (!dl || !up) return;
    document.querySelector("[data-backup-pick]").addEventListener("click", function () { up.click(); });
    dl.addEventListener("click", function () {
      var blob = new Blob([JSON.stringify({ app: "bitsandbricks.ch", version: 1, saved: saved, done: done }, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "bitsandbricks-saved.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    up.addEventListener("change", function () {
      var f = up.files && up.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var data; try { data = JSON.parse(r.result); } catch (e) { data = null; }
        if (!data || data.app !== "bitsandbricks.ch") { msg.textContent = "% That file is not a backup from this site."; return; }
        refresh();
        var n = 0, m = 0;
        Object.keys(data.saved || {}).forEach(function (u) {
          var s = data.saved[u];
          if (/^\/[^/]/.test(u) && s && typeof s.title === "string") { if (!saved[u]) n++; saved[u] = { title: s.title.slice(0, 200), kind: String(s.kind || "").slice(0, 20) }; }
        });
        Object.keys(data.done || {}).forEach(function (id) { if (/^[\w\/.-]+$/.test(id)) { if (!done[id]) m++; done[id] = 1; } });
        store("bb_saved", saved); store("bb_done", done);
        renderSaved(); paintProgress();
        msg.textContent = "Loaded: " + n + " new saved " + (n === 1 ? "page" : "pages") + ", " + m + " new finished " + (m === 1 ? "lesson" : "lessons") + ".";
        up.value = "";
      };
      r.readAsText(f);
    });
  }

  // Keep stars and progress current when another tab changes them, or when the back button
  // shows this page from the browser's cache.
  window.addEventListener("storage", function (e) { if (e.key === null || e.key === "bb_saved" || e.key === "bb_done") { refresh(); repaint(); } });
  window.addEventListener("pageshow", function (e) { if (e.persisted) { refresh(); repaint(); } });

  function init() {
    document.querySelectorAll("[data-save]").forEach(paintSave);
    paintProgress(); renderSaved(); anchors(); copyButtons(); quizzes();
    backup(); filter("q", "#loglist .row", "s"); filter("tq", "#taglist a", "t"); graph();
    document.querySelectorAll("[data-print]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
