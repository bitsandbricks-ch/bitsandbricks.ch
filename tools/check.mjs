// After `astro build` and Pagefind: check the finished site in dist/. Fails on
//   - internal links and assets that point nowhere (absolute and relative)
//   - #anchors that do not exist on the target page
//   - pages without <title>, without exactly one <h1>, without lang, or with duplicate ids
//   - images without alt text, and requests to other sites (no outside requests: the only
//     allowed one is giscus, loaded on click by reader.js)
//   - inline scripts or on...= handlers, or a page without the Content-Security-Policy (it
//     forbids inline code, so these would silently stop working)
//   - a missing search index
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { pageProblems, cssProblems } from "./lib/page-check.mjs";

const DIST = new URL("../dist/", import.meta.url).pathname;
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p); else if (p.endsWith(".html")) files.push(p);
  }
})(DIST);

const errors = [];
const err = (file, msg) => errors.push(`${relative(DIST, file)}: ${msg}`);
const html = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));
const idsOf = new Map();
const ids = (file) => {
  if (!idsOf.has(file)) idsOf.set(file, new Set([...html.get(file).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return idsOf.get(file);
};
/** The html file a site path is served from, or null */
function target(path) {
  const p = join(DIST, decodeURI(path));
  if (existsSync(p) && statSync(p).isFile()) return p;
  if (existsSync(join(p, "index.html"))) return join(p, "index.html");
  return null;
}

for (const [file, text] of html) {
  const page = "/" + relative(DIST, dirname(file)) + "/";
  const body = text.replace(/<script[\s\S]*?<\/script>/g, "");
  for (const [, attr, raw] of body.matchAll(/\s(href|src)="([^"]*)"/g)) {
    const href = raw.replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|data:|javascript:)/i.test(href)) continue;
    if (/^(https?:)?\/\//i.test(href)) continue; // outside loads: pageProblems
    const u = new URL(href || page, "https://site" + page);
    const t = u.pathname === page && !href.split("#")[0] ? file : target(u.pathname);
    if (!t) { err(file, `broken link ${href}`); continue; }
    if (u.hash && t.endsWith(".html") && !ids(t).has(decodeURIComponent(u.hash.slice(1)))) err(file, `missing anchor ${href}`);
  }
  for (const p of pageProblems(text, { notFound: file.endsWith("404.html") })) err(file, p);
}
// stylesheets: fonts and images must come from this site too
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p); else if (p.endsWith(".css")) for (const m of cssProblems(readFileSync(p, "utf8"))) err(p, m);
  }
})(DIST);
if (!existsSync(join(DIST, "pagefind/pagefind-ui.js"))) errors.push("no search index (dist/pagefind)");

console.log(errors.length ? errors.join("\n") : `site ok: ${files.length} pages (links, anchors, titles, headings, ids, alt text, CSP, no outside requests)`);
process.exit(errors.length ? 1 : 0);
