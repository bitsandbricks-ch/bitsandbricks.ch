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
    if (/^(https?:)?\/\//i.test(href)) {
      if (attr === "src") err(file, `loads ${href} from another site`);
      continue;
    }
    const u = new URL(href || page, "https://site" + page);
    const t = u.pathname === page && !href.split("#")[0] ? file : target(u.pathname);
    if (!t) { err(file, `broken link ${href}`); continue; }
    if (u.hash && t.endsWith(".html") && !ids(t).has(decodeURIComponent(u.hash.slice(1)))) err(file, `missing anchor ${href}`);
  }
  // redirect pages for moved notes (src/redirects.json) only need a working target
  if (/http-equiv="refresh"/.test(text)) continue;
  if (!/<html[^>]*\slang="/.test(text)) err(file, "no lang on <html>");
  if (!/<title>[^<]+<\/title>/.test(text)) err(file, "no <title>");
  const h1 = (body.match(/<h1[\s>]/g) ?? []).length;
  if (!file.endsWith("404.html") && h1 !== 1) err(file, `${h1} <h1> elements`);
  const seen = new Set();
  for (const [, id] of body.matchAll(/\sid="([^"]+)"/g)) { if (seen.has(id)) err(file, `duplicate id "${id}"`); seen.add(id); }
  if (!/<meta http-equiv="Content-Security-Policy"/.test(text)) err(file, "no Content-Security-Policy");
  for (const [tag] of text.matchAll(/<script\b[^>]*>/g)) if (!/\ssrc="/.test(tag)) err(file, "inline <script> (blocked by the CSP: move it to public/assets)");
  for (const [m] of text.matchAll(/<[a-z][^>]*\son[a-z]+="[^"]*"/g)) err(file, `inline handler (blocked by the CSP): ${m.slice(0, 80)}`);
  for (const [img] of body.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(img)) err(file, `image without alt: ${img.slice(0, 80)}`);
}
if (!existsSync(join(DIST, "pagefind/pagefind-ui.js"))) errors.push("no search index (dist/pagefind)");

console.log(errors.length ? errors.join("\n") : `site ok: ${files.length} pages (links, anchors, titles, headings, ids, alt text, no outside requests)`);
process.exit(errors.length ? 1 : 0);
