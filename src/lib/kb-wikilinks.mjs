// Turns [[wiki links]] to kb notes into normal links at build time (see tools/lib/wikilinks.mjs).
// A link that names no note is kept as text, marked, and reported by tools/check-content.mjs.
import { WIKI, wikiIndex, resolveWiki, headingSlug, notesOnDisk } from "../../tools/lib/wikilinks.mjs";

let index;
const titles = new Map();
function load() {
  const notes = notesOnDisk();
  for (const n of notes) titles.set(n.id, n.title);
  index = wikiIndex(notes);
}

export const kbWikiLinks = (ctx) =>
  // In kb notes, lessons and blog posts alike: all of them can point at a kb note
  ctx.fileURL && /\/src\/content\//.test(ctx.fileURL.pathname) && {
    name: "kb-wikilinks",
    text(node, v) {
      if (!node.value.includes("[[")) return;
      if (!index) load();
      const out = [];
      let at = 0;
      for (const m of node.value.matchAll(WIKI)) {
        if (m.index > at) out.push({ type: "text", value: node.value.slice(at, m.index) });
        const [raw, target, heading, label] = m;
        const id = resolveWiki(index, target);
        const text = (label ?? (id ? titles.get(id) ?? target : target)).trim() + (heading && !label ? ` § ${heading.trim()}` : "");
        if (id) out.push({ type: "link", url: "/" + id + "/" + (heading ? "#" + headingSlug(heading) : ""), children: [{ type: "text", value: text }] });
        else out.push({ type: "emphasis", data: { hProperties: { className: ["wiki-missing"], title: "no note called " + target.trim() } }, children: [{ type: "text", value: text }] });
        at = m.index + raw.length;
      }
      if (!at) return;
      if (at < node.value.length) out.push({ type: "text", value: node.value.slice(at) });
      v.replaceNode(node, out);
    },
  };
