// Build-time helpers for the kb and courses: links between notes, backlinks, tags, the graph
// layout, and course structure. Everything is worked out from the Markdown files at build time.
import { getCollection, type CollectionEntry } from "astro:content";
import { url, buildTree, flatTree, linksOf, wikiOf, short, parentOf, foldersOf, folderInfo, branchPoint, layout, radial, sectionLabel, related, type GNode, type GEdge } from "./kb-core";
export * from "./kb-core";

export type Doc = CollectionEntry<"docs">;

let cache: Promise<Doc[]> | null = null;
export const allDocs = () => (cache ??= getCollection("docs"));

/** kb notes, without folder index pages */
export async function kbNotes(): Promise<Doc[]> {
  return (await allDocs()).filter((d) => d.id.startsWith("kb/"));
}

export interface NoteGraph { notes: Doc[]; links: Map<string, string[]>; back: Map<string, string[]> }
export async function noteGraph(): Promise<NoteGraph> {
  const notes = await kbNotes();
  const ids = new Set(notes.map((n) => n.id));
  const links = new Map<string, string[]>(), back = new Map<string, string[]>();
  notes.forEach((n) => back.set(n.id, []));
  const wiki = wikiOf(notes);
  for (const n of notes) {
    const l = linksOf(n, ids, wiki);
    links.set(n.id, l);
    l.forEach((t) => back.get(t)!.push(n.id));
  }
  return { notes, links, back };
}

/**
 * The graph of the kb. Notes hang off their folder, folders off their parent folder, and links
 * between notes are drawn on top. With `center` it is the neighbourhood of one note: its folder,
 * the other notes in that folder and everything it links to or is linked from.
 */
export async function buildGraph(opts: { center?: string; w: number; h: number; siblings?: number }) {
  const g = await noteGraph();
  const byId = new Map(g.notes.map((n) => [n.id, n]));
  let noteIds: string[];
  let dirIds: string[];
  if (opts.center) {
    const dir = parentOf(opts.center);
    const sibs = g.notes.filter((n) => parentOf(n.id) === dir && n.id !== opts.center).map((n) => n.id).sort();
    // the closest siblings by name, so long folders do not swamp the local graph
    const at = sibs.findIndex((x) => x > opts.center!);
    const max = opts.siblings ?? 8;
    const from = Math.max(0, Math.min(sibs.length - max, (at < 0 ? sibs.length : at) - Math.floor(max / 2)));
    noteIds = [...new Set([opts.center, ...sibs.slice(from, from + max), ...(g.links.get(opts.center) ?? []), ...(g.back.get(opts.center) ?? [])])];
    dirIds = [dir];
  } else {
    noteIds = g.notes.map((n) => n.id);
    // start at the folder where the tree branches; the single-folder chain above it is noise
    const top = branchPoint(g.notes).id;
    dirIds = foldersOf(noteIds).filter((d) => d === top || d.startsWith(top + "/"));
  }
  const dirSet = new Set(dirIds);
  const edges: GEdge[] = [], seen = new Set<string>();
  const add = (a: string, b: string, kind: GEdge["kind"]) => {
    const key = [a, b].sort().join("|");
    if (a !== b && !seen.has(key)) { seen.add(key); edges.push({ a, b, kind }); }
  };
  for (const d of dirIds) if (dirSet.has(parentOf(d))) add(d, parentOf(d), "tree");
  for (const n of noteIds) if (dirSet.has(parentOf(n))) add(n, parentOf(n), "tree");
  const noteSet = new Set(noteIds);
  for (const a of noteIds) for (const b of g.links.get(a) ?? []) if (noteSet.has(b)) add(a, b, "link");
  const all = [...dirIds, ...noteIds].map((id) => ({ id }));
  const P: Record<string, { x: number; y: number }> = opts.center
    ? layout(all, edges, opts.w, opts.h, opts.center.length * 13)
    : radial(dirIds[0], [...dirIds, ...noteIds], opts.w, opts.h);
  const nodes: GNode[] = [
    ...dirIds.map((id): GNode => ({ id, label: (id === "kb" ? "kb" : short(id)) + "/", href: url(id), x: P[id].x, y: P[id].y, r: id === dirIds[0] && !opts.center ? 7 : 5, kind: "dir", tags: [] })),
    ...noteIds.map((id): GNode => {
      const me = id === opts.center;
      return { id, label: short(id), href: url(id), x: P[id].x, y: P[id].y, r: me ? 7 : 3.5 + Math.min(3, g.back.get(id)!.length), kind: me ? "me" : "note", tags: byId.get(id)!.data.tags };
    }),
  ];
  return { nodes, edges };
}

/** Every tag with the docs and posts that carry it. */
export async function tagIndex() {
  const docs = await allDocs();
  const posts = (await getCollection("blog")).filter((p) => !p.data.draft);
  const tags = new Map<string, { docs: Doc[]; posts: CollectionEntry<"blog">[] }>();
  const get = (t: string) => tags.get(t) ?? (tags.set(t, { docs: [], posts: [] }), tags.get(t)!);
  docs.forEach((d) => d.data.tags.forEach((t) => get(t).docs.push(d)));
  posts.forEach((p) => p.data.tags.forEach((t) => get(t).posts.push(p)));
  return new Map([...tags.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

/* ---------- courses ---------- */
export interface Lesson { id: string; title: string; href: string; section: string; quiz: boolean; access: string }
export interface Course { id: string; slug: string; title: string; summary: string; path: string; slot: number; href: string; lessons: Lesson[]; sections: { label: string; lessons: Lesson[] }[]; sample: boolean }


export async function courses(): Promise<Course[]> {
  const docs = (await allDocs()).filter((d) => d.id.startsWith("courses/"));
  const out: Course[] = [];
  for (const idx of docs.filter((d) => d.data.course)) {
    const lessons = docs
      .filter((d) => d.id.startsWith(idx.id + "/"))
      .sort((a, b) => (a.id.split("/")[2] ?? "").localeCompare(b.id.split("/")[2] ?? "", "en", { numeric: true }) || (a.data.sidebar.order ?? 99) - (b.data.sidebar.order ?? 99) || a.id.localeCompare(b.id))
      .map((d) => ({ id: d.id, title: d.data.title, href: url(d.id), section: sectionLabel(d.id.split("/")[2] ?? ""), quiz: d.data.quiz, access: d.data.access }));
    const sections: Course["sections"] = [];
    lessons.forEach((l) => { const last = sections[sections.length - 1]; if (last && last.label === l.section) last.lessons.push(l); else sections.push({ label: l.section, lessons: [l] }); });
    const c = idx.data.course!;
    out.push({ id: idx.id, slug: idx.id.split("/")[1], title: idx.data.title, summary: c.summary, path: c.path, slot: c.slot, href: url(idx.id), lessons, sections, sample: idx.data.sample });
  }
  return out.sort((a, b) => a.slot - b.slot);
}

/** Learning paths. A path groups courses on the overview, like a chassis holds line cards. */
export const PATHS: Record<string, { title: string; summary: string }> = {
  "network-foundations": { title: "Sample path: network foundations", summary: "Two sample courses, from subnetting to switching. Free to read." },
};

