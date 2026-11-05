// The hand-written pages in src/legacy/*.html. Each starts with a settings comment:
//   <!--
//   path: /labdex/        where the page is served
//   title: Labdex         <title>, " · Bits & Bricks" is added (not on the home page)
//   description: ...      meta description
//   index: no             optional: keep the page out of search engines and the sitemap
//   -->
// The rest is the page's <main>, with {{placeholders}} filled from src/lib/site.ts.
import { fill } from "./site";

export interface LegacyPage { path: string; title: string; description: string; index: boolean; body: string; file: string }

const files = import.meta.glob("../legacy/*.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export const pages: LegacyPage[] = Object.entries(files).map(([file, text]) => {
  const m = text.match(/^\s*<!--([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file}: missing settings comment`);
  const meta: Record<string, string> = {};
  for (const line of m[1].trim().split("\n")) {
    const i = line.indexOf(":");
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const key of ["path", "title", "description"]) if (!meta[key]) throw new Error(`${file}: missing '${key}'`);
  return { path: meta.path, title: meta.title, description: meta.description, index: meta.index !== "no", body: fill(text.slice(m[0].length).trim()), file };
});
