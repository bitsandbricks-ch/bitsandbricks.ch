// Stub notes: kb notes with almost no text yet (imported placeholders, "#todo"). They stay online
// with a banner but are left out of search and the sitemap. Shared by the build and the checks.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const STUB_WORDS = 40;

/** Words of real text in a Markdown body: code blocks count as one word, tag-only lines ("#todo/cleanup") as none. */
export const words = (body) => body.replace(/```[\s\S]*?```/g, " code ").replace(/^[ \t]*(#[\p{L}\p{N}_/-]+[ \t]*)+$/gmu, "").replace(/<!--[\s\S]*?-->/g, "").split(/\s+/).filter(Boolean).length;

/** Site paths (/kb/a/b/) of every stub note under src/content/docs/kb */
export function stubPaths(root = new URL("../../src/content/docs/", import.meta.url).pathname) {
  const out = [];
  (function walk(dir) {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith(".md")) {
        const body = readFileSync(p, "utf8").replace(/^---\n[\s\S]*?\n---\n?/, "");
        if (words(body) < STUB_WORDS) out.push("/" + relative(root, p).replace(/\.md$/, "").replace(/(^|\/)index$/, "") + "/");
      }
    }
  })(join(root, "kb"));
  return out;
}
