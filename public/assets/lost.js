// 404 page: show the address that was asked for, and pages whose words match it (from the
// Pagefind index that is already on this site; nothing leaves the site).
(function () {
  var path = location.pathname;
  try { path = decodeURIComponent(path); } catch (e) {} // a broken %-escape must not stop the page
  var out = document.getElementById("lost-path");
  if (out) out.textContent = path;
  var SKIP = { kb: 1, blog: 1, courses: 1, cisco: 1, campus: 1, index: 1, html: 1, www: 1, the: 1, and: 1 };
  var words = path.toLowerCase().split(/[^a-z0-9]+/).filter(function (w) { return w.length > 1 && !SKIP[w]; });
  if (!words.length) return;
  import("/pagefind/pagefind.js")
    .then(function (pf) { return pf.search(words.join(" ")); })
    .then(function (r) { return Promise.all(r.results.slice(0, 6).map(function (x) { return x.data(); })); })
    .then(function (pages) {
      if (!pages.length) return;
      var list = document.getElementById("lost-list");
      pages.forEach(function (p) {
        var li = list.appendChild(document.createElement("li"));
        var a = li.appendChild(document.createElement("a"));
        a.href = p.url;
        a.textContent = (p.meta && p.meta.title) || p.url;
        var u = li.appendChild(document.createElement("span"));
        u.className = "lost-url";
        u.textContent = p.url;
      });
      document.getElementById("lost").hidden = false;
    })
    .catch(function () {}); // no index (dev server): the links below still help
})();
