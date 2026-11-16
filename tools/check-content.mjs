// Before the build: check every Markdown file in src/content.
//   errors (fail the build): secrets, private addresses or shell history (see lib/safety.mjs),
//                            broken frontmatter, a missing title, a "# " heading (h1),
//                            a [[wiki link]] that names no kb note,
//                            an image without alt text
//   warnings (printed):      duplicate titles, stub notes, "#todo"-style tag lines, titles like "X - X"
// node tools/check-content.mjs [--quiet]   (--quiet: only the warning count)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "yaml";
import { secrets } from "./lib/safety.mjs";
import { words, STUB_WORDS } from "./lib/stubs.mjs";
import { wikiLinks, wikiIndex, resolveWiki, notesOnDisk } from "./lib/wikilinks.mjs";

const ROOT = new URL("../src/content/", import.meta.url).pathname;
const quiet = process.argv.includes("--quiet");
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p); else if (p.endsWith(".md")) files.push(p);
  }
})(ROOT);

const errors = [], warnings = [], titles = new Map();
const wiki = wikiIndex(notesOnDisk());
for (const file of files) {
  const rel = relative(ROOT, file);
  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) { errors.push(`${rel}: no frontmatter`); continue; }
  let fm;
  try { fm = parse(m[1]) ?? {}; } catch (e) { errors.push(`${rel}: frontmatter is not valid YAML (${e.message.split("\n")[0]})`); continue; }
  const body = m[2];
  if (!fm.title) errors.push(`${rel}: no title`);
  for (const s of secrets(m[1] + "\n" + body, fm)) errors.push(`${rel}: looks like ${s}`);
  if (/^# \S/m.test(body.replace(/```[\s\S]*?```/g, ""))) errors.push(`${rel}: has a "# " heading; the title is the page's only h1, start at "## "`);
  if (/!\[\s*\]\(/.test(body.replace(/```[\s\S]*?```/g, ""))) errors.push(`${rel}: an image without alt text (![what it shows](./file.png))`);
  for (const w of wikiLinks(body)) {
    if (!resolveWiki(wiki, w.target)) errors.push(`${rel}: ${w.raw} names no note${wiki.map.get(w.target.toLowerCase()) === null ? " (several notes match, use the folder path: [[folder/name]])" : ""}`);
  }
  if (fm.draft) continue;
  if (fm.title) {
    const key = String(fm.title).toLowerCase();
    titles.set(key, [...(titles.get(key) ?? []), rel]);
    const segs = String(fm.title).split(" - ").map((x) => x.trim().toLowerCase());
    if (segs.length > 1 && new Set(segs).size < segs.length) warnings.push(`${rel}: title repeats itself ("${fm.title}")`);
  }
  const tagLines = body.replace(/```[\s\S]*?```/g, "").match(/^[ \t]*(#[\p{L}\p{N}_/-]+[ \t]*)+$/gmu);
  if (tagLines) warnings.push(`${rel}: Obsidian tag line, not shown on the site: ${tagLines.map((t) => t.trim()).join(", ")}`);
  if (rel.startsWith("docs/kb/") && words(body) < STUB_WORDS) warnings.push(`${rel}: stub (${words(body)} words)`);
}
for (const [t, list] of titles) if (list.length > 1) warnings.push(`duplicate title "${t}": ${list.join(", ")}`);

if (warnings.length) console.log(quiet ? `content: ${warnings.length} warnings (run node tools/check-content.mjs to list them)` : warnings.map((w) => "warning: " + w).join("\n"));
if (errors.length) { console.error(errors.map((e) => "error: " + e).join("\n")); process.exit(1); }
console.log(`content ok: ${files.length} files`);
