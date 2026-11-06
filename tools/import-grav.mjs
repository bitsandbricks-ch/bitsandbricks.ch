// Turns the Grav pages from gitlab.com/bitsandbricks/blog into the site's Markdown.
//
//   node tools/import-grav.mjs <grav>/data/user/pages [--all-public]
//
// <pages>/NN.blog/<slug>/item.md      -> src/content/blog/<slug>.md
// <pages>/NN.kb/<path>/item.md        -> src/content/docs/kb/<path>.md, only with `public: true`
//                                        (<path>/index.md when the folder also has notes below it)
// Images and other files next to a page -> public/media/{blog,kb}/<path>/, links rewritten.
//
// The script owns src/content/blog/ and src/content/docs/kb/: it empties a folder before writing
// it (the kb only when at least one note is public), so anything not in Grav disappears. It prints a warning for everything it had to guess.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync, copyFileSync, existsSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { parse, stringify } from "yaml";

const args = process.argv.slice(2);
const ALL_PUBLIC = args.includes("--all-public"); // treat every kb note as public: true
const SRC = args.find((a) => !a.startsWith("--"));
if (!SRC || !existsSync(SRC)) {
  console.error("usage: node tools/import-grav.mjs <grav>/data/user/pages");
  process.exit(2);
}
const ROOT = new URL("..", import.meta.url).pathname;
const OUT_BLOG = join(ROOT, "src/content/blog");
const OUT_KB = join(ROOT, "src/content/docs/kb");
const OUT_MEDIA = join(ROOT, "public/media");
const warnings = [];
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

const isDir = (p) => statSync(p).isDirectory();
const strip = (seg) => seg.replace(/^\d+\./, ""); // Grav's "02.blog" ordering prefix
const mdIn = (dir) => readdirSync(dir).filter((f) => f.endsWith(".md") && !isDir(join(dir, f)));
const subdirs = (dir) => readdirSync(dir).filter((f) => !f.startsWith(".") && isDir(join(dir, f)));
const section = (name) => subdirs(SRC).find((d) => strip(d) === name);

function readPage(file) {
  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { fm: parse(m[1]) ?? {}, body: m[2] } : { fm: {}, body: raw };
}

const list = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]).map(String);
const slugTag = (t) => t.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");

/** Tags: Grav's taxonomy, tags and keywords. Hierarchical ones ("technology/routing/ospf") keep
 *  their last part; topics that only repeat the page's own folder are left out (the tree shows those). */
function tagsOf(fm, folder) {
  const out = new Set();
  const tax = fm.taxonomy ?? {};
  for (const t of [...list(tax.topic), ...list(tax.tag), ...list(tax.category), ...list(fm.tags), ...list(fm.keywords)]) {
    if (folder && (folder === t || folder.startsWith(t + "/"))) continue;
    const leaf = slugTag(t.split("/").filter(Boolean).pop() ?? "");
    if (leaf) out.add(leaf);
  }
  return [...out];
}

/** First paragraph of the post as plain text, for the list and the RSS feed. */
function firstParagraph(body) {
  for (const block of body.split(/\n\s*\n/)) {
    const b = block.trim();
    if (!b || /^(#|```|>|\||[-*]\s|\d+\.\s|!\[|<)/.test(b)) continue;
    const text = b.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    if (text.length <= 220) return text;
    return text.slice(0, 220).replace(/\s+\S*$/, "") + " …";
  }
  return "";
}

/** Date the file last changed in git, if the pages folder is a git checkout. */
function gitDate(file) {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cs", "--", basename(file)], { cwd: dirname(file), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() || null;
  } catch { return null; }
}

/** Copy files that sit next to a page and point the page's relative links at the copies. */
function media(pageDir, body, urlBase, file) {
  const files = readdirSync(pageDir).filter((f) => !isDir(join(pageDir, f)) && !f.endsWith(".md"));
  if (files.length) {
    const dest = join(OUT_MEDIA, urlBase);
    mkdirSync(dest, { recursive: true });
    for (const f of files) copyFileSync(join(pageDir, f), join(dest, f));
  }
  return body.replace(/(!?\[[^\]]*\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g, (all, pre, href, post) => {
    if (/^([a-z]+:|\/|#)/i.test(href)) return all;
    const name = decodeURIComponent(href.split(/[?#]/)[0]);
    if (files.includes(name)) return `${pre}/media/${urlBase}/${encodeURI(name)}${post}`;
    if (pre.startsWith("!")) warn(file, `image not found next to the page: ${href}`);
    return all;
  });
}

/** Grav-only syntax the site does not understand: report it, leave the text alone. */
function checkSyntax(body, file) {
  const prose = body.replace(/```[\s\S]*?```/g, "");
  if (/\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}/.test(prose)) warn(file, "Twig tags ({{ }} / {% %}) are shown as text");
  if (/\[(notice|ui-|g-|section|columns|div|center|toc)\b/i.test(prose)) warn(file, "Grav shortcodes are shown as text");
  if (/^\s*\[TOC\]\s*$/m.test(prose)) warn(file, "[TOC] is shown as text (the page has its own 'on this page')");
}

/** Grav links to other pages use the folder names with their "NN." prefixes. */
const fixLinks = (body) => body.replace(/\]\((\/[^)\s]*)/g, (_, href) => "](" + href.split("/").map(strip).join("/"));

function write(path, fm, body) {
  mkdirSync(dirname(path), { recursive: true });
  const clean = Object.fromEntries(Object.entries(fm).filter(([, v]) => v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)));
  writeFileSync(path, `---\n${stringify(clean, { lineWidth: 0 })}---\n\n${body.trim()}\n`);
}

const published = (fm) => fm.published !== false;

/** Things that must not end up on a public site. Private (RFC 1918) addresses are allowed when the
 *  note says `private_ips_ok: true`, for lab examples. */
function secrets(body, fm) {
  const found = [];
  if (/\b-u\s+['"]?(?!\$)[^\s'"]+:(?![$<])[^\s'"<]+['"]?/.test(body)) found.push("a user:password after -u");
  if (/[a-z]+:\/\/[^\s/:@]+:[^\s/@<]+@/i.test(body)) found.push("a user:password inside a URL");
  if (/\b(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*['"]?(?![<$`])[^\s'"]{6,}/i.test(body)) found.push("a password, secret or token value");
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(body)) found.push("a private key");
  if (fm.private_ips_ok !== true && /\b(10\.\d{1,3}|172\.(1[6-9]|2\d|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b/.test(body)) found.push("private IP addresses (set private_ips_ok: true if they are lab examples)");
  if (/^\s*\d+\s+\d{4}-\d\d-\d\d \d\d:\d\d:\d\d /m.test(body)) found.push("shell history with timestamps");
  return found;
}

/* ---------- blog ---------- */
let posts = 0;
const blogDir = section("blog");
if (!blogDir) warn(SRC, "no blog folder, src/content/blog/ left as it is");
else {
  rmSync(OUT_BLOG, { recursive: true, force: true });
  rmSync(join(OUT_MEDIA, "blog"), { recursive: true, force: true });
  mkdirSync(OUT_BLOG, { recursive: true });
}
if (blogDir) for (const d of subdirs(join(SRC, blogDir))) {
  const dir = join(SRC, blogDir, d);
  const [md] = mdIn(dir);
  if (!md) continue;
  const file = join(dir, md), rel = relative(SRC, file);
  const { fm, body } = readPage(file);
  const slug = strip(d);
  let date = fm.date ? String(fm.date).slice(0, 10) : null;
  if (!date) {
    date = gitDate(file);
    warn(rel, date ? `no date in Grav, used the last git change ${date}` : "no date in Grav and no git history: saved as a draft");
  }
  const summary = fm.summary ?? fm.description ?? fm.metadata?.description ?? firstParagraph(body);
  if (!fm.summary && !fm.description) warn(rel, "no summary in Grav, used the first paragraph");
  checkSyntax(body, rel);
  const found = secrets(body, fm);
  if (found.length) warn(rel, `check before merging, it seems to contain: ${found.join("; ")}`);
  write(join(OUT_BLOG, slug + ".md"), {
    title: String(fm.title ?? slug),
    summary: String(summary || fm.title || slug),
    date: date ?? "1970-01-01",
    tags: tagsOf(fm),
    draft: !published(fm) || !date ? true : undefined,
  }, media(dir, fixLinks(body), `blog/${slug}`, rel));
  posts++;
}

/* ---------- kb ---------- */
// Only notes with `public: true` in their Grav frontmatter are imported: the site repo is public,
// and in Grav the kb is visible to the Engineer group only. Notes that look like they hold
// credentials or private addresses are refused even when marked public (see secrets()).
const kbDir = section("kb");
const kbOut = [], kbPrivate = [];
const hasPagesBelow = (dir) => subdirs(dir).some((d) => mdIn(join(dir, d)).length || hasPagesBelow(join(dir, d)));
if (kbDir) (function walk(dir, path) {
  for (const d of subdirs(dir)) {
    const sub = join(dir, d), p = [...path, strip(d)];
    const [md, ...more] = mdIn(sub);
    if (md) {
      const file = join(sub, md), rel = relative(SRC, file);
      const { fm, body } = readPage(file);
      const folder = p.join("/");
      if (!published(fm)) warn(rel, "published: false, skipped");
      else if (fm.public !== true && !ALL_PUBLIC) kbPrivate.push(folder);
      else {
        const found = secrets(body, fm);
        if (found.length) warn(rel, `marked public but NOT imported, it seems to contain: ${found.join("; ")}`);
        else {
          if (more.length) warn(rel, `more than one .md in the folder, used ${md} and skipped ${more.join(", ")}`);
          checkSyntax(body, rel);
          if (!body.trim()) warn(rel, "empty page");
          kbOut.push(() => write(hasPagesBelow(sub) ? join(OUT_KB, folder, "index.md") : join(OUT_KB, folder + ".md"), {
            title: String(fm.title ?? p[p.length - 1]),
            description: fm.description ?? fm.metadata?.description,
            tags: tagsOf(fm, folder),
            status: fm.status ? String(fm.status).toLowerCase() : undefined,
            version: fm.version != null ? String(fm.version) : undefined,
          }, media(sub, fixLinks(body), `kb/${folder}`, rel)));
        }
      }
    }
    walk(sub, p);
  }
})(join(SRC, kbDir), []);
if (!kbDir) warn(SRC, "no kb folder, src/content/docs/kb/ left as it is");
else if (!kbOut.length) warn(SRC, "no kb note is marked public: true, src/content/docs/kb/ left as it is");
else {
  rmSync(OUT_KB, { recursive: true, force: true });
  rmSync(join(OUT_MEDIA, "kb"), { recursive: true, force: true });
  mkdirSync(OUT_KB, { recursive: true });
  kbOut.forEach((w) => w());
}
const notes = kbOut.length;
if (kbPrivate.length) console.log(`${kbPrivate.length} kb notes not marked public: true, left out`);

console.log(`imported ${posts} blog posts and ${notes} kb notes`);
if (warnings.length) console.log(`\n${warnings.length} warnings:\n` + warnings.map((w) => "  " + w).join("\n"));
