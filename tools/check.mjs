// After `astro build`: fail if any internal link or asset in dist/ points nowhere.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p); else if (p.endsWith(".html")) files.push(p);
  }
})(DIST);

const errors = [];
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    if (href.startsWith("//")) continue;
    const p = join(DIST, decodeURI(href));
    if (!(existsSync(p) && statSync(p).isFile()) && !existsSync(join(p, "index.html"))) errors.push(`${file.slice(DIST.length)}: broken link ${href}`);
  }
}
console.log(errors.length ? errors.join("\n") : `links ok in ${files.length} pages`);
process.exit(errors.length ? 1 : 0);
