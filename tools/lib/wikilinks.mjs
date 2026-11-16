// [[Wiki links]] between kb notes, like in Obsidian: [[ospf-authentication]], [[OSPF Authentication]],
// [[ospf-authentication#Type 3]], [[ospf-authentication|how auth works]]. A link names a note by its
// file name or its title (any case). Shared by the Markdown plugin, the graph and the content check.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "yaml";

export const WIKI = /\[\[([^\[\]|#\n]+?)\s*(?:#([^\[\]|\n]+?))?\s*(?:\|([^\[\]\n]+?))?\s*\]\]/g;

/** Every [[link]] in a Markdown body, code blocks and inline code left out */
export function wikiLinks(body) {
  const text = body.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  return [...text.matchAll(WIKI)].map((m) => ({ raw: m[0], target: m[1].trim(), heading: m[2]?.trim(), label: m[3]?.trim() }));
}

const key = (s) => s.trim().toLowerCase().replace(/\.md$/, "");

/** notes: [{ id: "kb/a/b/note", title }] -> lookup by file name, title or path end. Ambiguous names map to null. */
export function wikiIndex(notes) {
  const map = new Map();
  const put = (k, id) => map.set(k, map.has(k) && map.get(k) !== id ? null : id);
  for (const n of notes) {
    put(key(n.id.split("/").pop()), n.id);
    if (n.title) put(key(n.title), n.id);
  }
  return { map, ids: new Set(notes.map((n) => n.id)) };
}

/** The note id a [[target]] points to, or undefined */
export function resolveWiki(index, target) {
  const t = key(target).replace(/^\/+|\/+$/g, "");
  if (t.includes("/")) {
    for (const id of index.ids) if (id === t || id.endsWith("/" + t)) return id;
    return undefined;
  }
  return index.map.get(t) ?? undefined;
}

/** Heading text -> the id Astro gives it (github-slugger rules, enough for plain headings) */
export const headingSlug = (h) => h.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");

/** kb notes read straight from disk, for code that runs outside Astro's content layer */
export function notesOnDisk(root = new URL("../../src/content/docs/", import.meta.url).pathname) {
  const out = [];
  (function walk(dir) {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith(".md")) {
        const m = readFileSync(p, "utf8").replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
        let title;
        try { title = m && parse(m[1])?.title; } catch {} // broken frontmatter is reported by check-content
        out.push({ id: relative(root, p).replace(/\.md$/, "").replace(/\/index$/, ""), title: title == null ? undefined : String(title), file: p, body: m ? m[2] : "" });
      }
    }
  })(join(root, "kb"));
  return out;
}
