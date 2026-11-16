// Build-time helpers for the kb and courses: links between notes, backlinks, tags, the graph
// layout, and course structure. Everything is worked out from the Markdown files at build time.
import { getCollection, type CollectionEntry } from "astro:content";

export type Doc = CollectionEntry<"docs">;
export const url = (id: string) => "/" + id.replace(/\/index$/, "") + "/";

let cache: Promise<Doc[]> | null = null;
export const allDocs = () => (cache ??= getCollection("docs"));

/* ---------- the tree beside kb notes and lessons ---------- */
export interface TreeLink { kind: "link"; id: string; label: string; href: string }
export interface TreeDir { kind: "dir"; id: string; name: string; label: string; items: TreeItem[] }
export type TreeItem = TreeLink | TreeDir;

const orderOf = (d: Doc) => d.data.sidebar.order ?? Infinity;

/** Folders and notes under `prefix`, mixed and sorted like a file listing (order first, then name). */
export function buildTree(docs: Doc[], prefix: string): TreeItem[] {
  const root: TreeDir = { kind: "dir", id: prefix, name: "", label: "", items: [] };
  const keys = new Map<TreeItem, [number, string]>();
  for (const d of docs.filter((x) => x.id.startsWith(prefix + "/"))) {
    const parts = d.id.slice(prefix.length + 1).split("/");
    let dir = root;
    for (const seg of parts.slice(0, -1)) {
      let next = dir.items.find((i): i is TreeDir => i.kind === "dir" && i.name === seg);
      if (!next) { next = { kind: "dir", id: dir.id + "/" + seg, name: seg, label: seg.replace(/^\d+-/, "") + "/", items: [] }; dir.items.push(next); keys.set(next, [Infinity, seg]); }
      dir = next;
    }
    const link: TreeLink = { kind: "link", id: d.id, label: d.data.title, href: url(d.id) };
    dir.items.push(link); keys.set(link, [orderOf(d), parts[parts.length - 1]]);
  }
  const sort = (items: TreeItem[]) => {
    items.sort((a, b) => keys.get(a)![0] - keys.get(b)![0] || keys.get(a)![1].localeCompare(keys.get(b)![1], "en", { numeric: true }));
    items.forEach((i) => i.kind === "dir" && sort(i.items));
    return items;
  };
  return sort(root.items);
}

export const flatTree = (items: TreeItem[]): TreeLink[] => items.flatMap((i) => (i.kind === "dir" ? flatTree(i.items) : [i]));

/** kb notes, without folder index pages */
export async function kbNotes(): Promise<Doc[]> {
  return (await allDocs()).filter((d) => d.id.startsWith("kb/"));
}

/** Markdown links from one doc to other docs, as doc ids. Handles /kb/x/ and relative ../x links. */
export function linksOf(doc: Doc, ids: Set<string>): string[] {
  const out = new Set<string>();
  const body = doc.body ?? "";
  const base = doc.id.split("/").slice(0, -1);
  for (const m of body.matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
    let href = m[1];
    if (/^[a-z]+:/i.test(href)) continue;
    let parts: string[];
    if (href.startsWith("/")) parts = href.split("/").filter(Boolean);
    else {
      parts = [...base];
      for (const seg of href.split("/")) {
        if (seg === "" || seg === ".") continue;
        if (seg === "..") parts.pop(); else parts.push(seg);
      }
    }
    const id = parts.join("/").replace(/\.mdx?$/, "").replace(/\/index$/, "");
    if (ids.has(id) && id !== doc.id) out.add(id);
  }
  return [...out];
}

export interface NoteGraph { notes: Doc[]; links: Map<string, string[]>; back: Map<string, string[]> }
export async function noteGraph(): Promise<NoteGraph> {
  const notes = await kbNotes();
  const ids = new Set(notes.map((n) => n.id));
  const links = new Map<string, string[]>(), back = new Map<string, string[]>();
  notes.forEach((n) => back.set(n.id, []));
  for (const n of notes) {
    const l = linksOf(n, ids);
    links.set(n.id, l);
    l.forEach((t) => back.get(t)!.push(n.id));
  }
  return { notes, links, back };
}

/** Short node name: the file name of the note */
export const short = (id: string) => id.split("/").pop()!;

/** The folder a doc sits in: kb/cisco/campus/routing/ospf/x -> kb/cisco/campus/routing/ospf */
export const parentOf = (id: string) => id.split("/").slice(0, -1).join("/");

/** Every kb folder that holds notes, directly or further down, with its parents. "kb" is the root. */
export function foldersOf(ids: string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    const parts = id.split("/");
    for (let i = 1; i < parts.length; i++) out.add(parts.slice(0, i).join("/"));
  }
  return [...out].sort();
}

export interface Folder { id: string; dirs: string[]; notes: Doc[]; total: number }
/** One folder's direct sub-folders and notes, and how many notes sit below it in total. */
export function folderInfo(notes: Doc[], id: string): Folder {
  const below = notes.filter((n) => n.id.startsWith(id + "/"));
  const dirs = new Set<string>();
  const direct: Doc[] = [];
  for (const n of below) {
    const rest = n.id.slice(id.length + 1).split("/");
    if (rest.length === 1) direct.push(n); else dirs.add(id + "/" + rest[0]);
  }
  return { id, dirs: [...dirs].sort(), notes: direct.sort((a, b) => a.data.title.localeCompare(b.data.title)), total: below.length };
}

/** Skips folders that only hold one other folder (kb -> cisco -> campus), so overviews start where it branches. */
export function branchPoint(notes: Doc[], id = "kb"): Folder {
  let f = folderInfo(notes, id);
  while (f.dirs.length === 1 && f.notes.length === 0) f = folderInfo(notes, f.dirs[0]);
  return f;
}

export interface GNode { id: string; label: string; href?: string; x: number; y: number; r: number; kind: "note" | "dir" | "me"; tags: string[] }
export interface GEdge { a: string; b: string; kind: "link" | "tree" }

/**
 * A small deterministic force layout (Fruchterman-Reingold with cooling), so the graph looks the
 * same on every build. Repulsion scales with the area per node, so big graphs spread out instead
 * of being pushed against the border.
 */
export function layout(nodes: { id: string }[], edges: { a: string; b: string }[], w: number, h: number, seed = 7, pad = 18) {
  const P: Record<string, { x: number; y: number; dx: number; dy: number }> = {};
  let s = seed % 233280;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280), s / 233280);
  nodes.forEach((n) => (P[n.id] = { x: pad + rnd() * (w - 2 * pad), y: pad + rnd() * (h - 2 * pad), dx: 0, dy: 0 }));
  if (nodes.length === 1) { P[nodes[0].id].x = w / 2; P[nodes[0].id].y = h / 2; return P; }
  const k = 0.85 * Math.sqrt(((w - 2 * pad) * (h - 2 * pad)) / Math.max(1, nodes.length));
  let t = w / 8;
  const iters = 400;
  const list = nodes.map((n) => P[n.id]);
  for (let it = 0; it < iters; it++) {
    for (const p of list) { p.dx = 0; p.dy = 0; }
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j];
      let dx = a.x - b.x, dy = a.y - b.y;
      let d = Math.sqrt(dx * dx + dy * dy);
      if (d < 0.01) { dx = rnd() - 0.5; dy = rnd() - 0.5; d = 0.5; }
      const f = (k * k) / d;
      a.dx += (dx / d) * f; a.dy += (dy / d) * f; b.dx -= (dx / d) * f; b.dy -= (dy / d) * f;
    }
    for (const e of edges) {
      const a = P[e.a], b = P[e.b];
      if (!a || !b) continue;
      const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy) || 0.01, f = (d * d) / k;
      a.dx -= (dx / d) * f; a.dy -= (dy / d) * f; b.dx += (dx / d) * f; b.dy += (dy / d) * f;
    }
    for (const p of list) {
      // a little gravity keeps loose notes from drifting to the border
      p.dx += (w / 2 - p.x) * 0.06 * k / 10; p.dy += (h / 2 - p.y) * 0.06 * k / 10;
      const d = Math.sqrt(p.dx * p.dx + p.dy * p.dy) || 1, m = Math.min(d, t);
      p.x = Math.max(pad, Math.min(w - pad, p.x + (p.dx / d) * m));
      p.y = Math.max(pad, Math.min(h - pad, p.y + (p.dy / d) * m));
    }
    t = Math.max(0.5, t * 0.985);
  }
  return P;
}

/**
 * A radial tree: `root` in the middle, every folder level one ring further out, and each subtree
 * gets a slice of the circle as wide as the number of notes in it. Stretched to fill a w x h box.
 */
export function radial(root: string, ids: string[], w: number, h: number, pad = 24) {
  const kids = new Map<string, string[]>();
  for (const id of ids) if (id !== root) { const p = parentOf(id); kids.set(p, [...(kids.get(p) ?? []), id]); }
  for (const v of kids.values()) v.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  const leaves = new Map<string, number>();
  const count = (id: string): number => { const k = kids.get(id) ?? []; const n = k.length ? Math.max(3, k.reduce((s, c) => s + count(c), 0)) : 1; leaves.set(id, n); return n; };
  count(root);
  const depth = (id: string) => (id === root ? 0 : id.slice(root.length + 1).split("/").length);
  const maxD = Math.max(1, ...ids.map(depth));
  const P: Record<string, { x: number; y: number }> = {};
  const rx = w / 2 - pad, ry = h / 2 - pad;
  const place = (id: string, a0: number, a1: number) => {
    const d = depth(id), a = (a0 + a1) / 2, r = Math.sqrt(d / maxD);
    P[id] = { x: w / 2 + Math.cos(a) * rx * r, y: h / 2 + Math.sin(a) * ry * r };
    let at = a0;
    for (const c of kids.get(id) ?? []) { const span = ((a1 - a0) * leaves.get(c)!) / leaves.get(id)!; place(c, at, at + span); at += span; }
  };
  place(root, -Math.PI / 2, Math.PI * 1.5);
  return P;
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
export interface Course { id: string; slug: string; title: string; summary: string; path: string; slot: number; href: string; lessons: Lesson[]; sections: { label: string; lessons: Lesson[] }[] }

export const sectionLabel = (dir: string) => dir.replace(/^\d+-/, "");

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
    out.push({ id: idx.id, slug: idx.id.split("/")[1], title: idx.data.title, summary: c.summary, path: c.path, slot: c.slot, href: url(idx.id), lessons, sections });
  }
  return out.sort((a, b) => a.slot - b.slot);
}

/** Learning paths. A path groups courses on the overview, like a chassis holds line cards. */
export const PATHS: Record<string, { title: string; summary: string }> = {
  "network-foundations": { title: "Sample path: network foundations", summary: "Two sample courses, from subnetting to switching. Free to read." },
};

/** How many leading folders two ids share */
const common = (a: string, b: string) => { const x = a.split("/"), y = b.split("/"); let i = 0; while (i < x.length - 1 && x[i] === y[i]) i++; return i; };

/** Notes that share the most tags with `doc`, for "related" when a note has no links yet. */
export function related(doc: Doc, notes: Doc[], max = 6): Doc[] {
  const mine = new Set(doc.data.tags);
  if (!mine.size) return [];
  return notes
    .filter((n) => n.id !== doc.id)
    .map((n) => ({ n, shared: n.data.tags.filter((t) => mine.has(t)).length, near: common(n.id, doc.id) }))
    .filter((x) => x.shared > 0)
    .map((x) => ({ n: x.n, score: x.shared * 10 + x.near }))
    .sort((a, b) => b.score - a.score || a.n.data.title.localeCompare(b.n.data.title))
    .slice(0, max)
    .map((x) => x.n);
}
