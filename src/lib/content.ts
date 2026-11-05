// Build-time helpers for the kb and courses: links between notes, backlinks, tags, the graph
// layout, and course structure. Everything is worked out from the Markdown files at build time.
import { getCollection, type CollectionEntry } from "astro:content";

export type Doc = CollectionEntry<"docs">;
export const url = (id: string) => "/" + id.replace(/\/index$/, "") + "/";

let cache: Promise<Doc[]> | null = null;
export const allDocs = () => (cache ??= getCollection("docs"));

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

export interface GNode { id: string; label: string; href?: string; x: number; y: number; r: number; kind: "note" | "tag" | "me"; tags: string[] }
export interface GEdge { a: string; b: string }

/** A small deterministic force layout, so the graph looks the same on every build. */
export function layout(nodes: { id: string }[], edges: GEdge[], w: number, h: number, seed = 7) {
  const P: Record<string, { x: number; y: number; vx: number; vy: number }> = {};
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280), s / 233280);
  nodes.forEach((n) => (P[n.id] = { x: w / 2 + (rnd() - 0.5) * w * 0.7, y: h / 2 + (rnd() - 0.5) * h * 0.7, vx: 0, vy: 0 }));
  const rest = w > 600 ? 100 : 70, rep = 1400 * Math.max(1, w / 420);
  for (let it = 0; it < 360; it++) {
    for (const a of nodes) for (const b of nodes) {
      if (a === b) continue;
      const dx = P[a.id].x - P[b.id].x, dy = P[a.id].y - P[b.id].y, d2 = dx * dx + dy * dy + 0.01, f = rep / d2;
      P[a.id].vx += dx * f * 0.02; P[a.id].vy += dy * f * 0.02;
    }
    for (const e of edges) {
      const a = P[e.a], b = P[e.b], dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - rest) * 0.02;
      a.vx += (dx / d) * f; a.vy += (dy / d) * f; b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
    }
    for (const n of nodes) {
      const p = P[n.id];
      p.vx += (w / 2 - p.x) * 0.004; p.vy += (h / 2 - p.y) * 0.004;
      p.x += p.vx; p.y += p.vy; p.vx *= 0.6; p.vy *= 0.6;
      p.x = Math.max(16, Math.min(w - 130, p.x)); p.y = Math.max(16, Math.min(h - 16, p.y));
    }
  }
  return P;
}

/** Graph around one note (its links and backlinks), or of the whole kb with tags. */
export async function buildGraph(opts: { center?: string; tags?: boolean; w: number; h: number }) {
  const g = await noteGraph();
  let ids: string[];
  if (opts.center) ids = [...new Set([opts.center, ...(g.links.get(opts.center) ?? []), ...(g.back.get(opts.center) ?? [])])];
  else ids = g.notes.map((n) => n.id);
  const byId = new Map(g.notes.map((n) => [n.id, n]));
  const edges: GEdge[] = [], seen = new Set<string>();
  for (const a of ids) for (const b of g.links.get(a) ?? []) {
    if (!ids.includes(b)) continue;
    const k = [a, b].sort().join("|");
    if (!seen.has(k)) { seen.add(k); edges.push({ a, b }); }
  }
  const tagIds = new Set<string>();
  if (opts.tags) for (const a of ids) for (const t of byId.get(a)!.data.tags) { tagIds.add("#" + t); edges.push({ a, b: "#" + t }); }
  const all = [...ids.map((id) => ({ id })), ...[...tagIds].map((id) => ({ id }))];
  const P = layout(all, edges, opts.w, opts.h, opts.center ? opts.center.length * 13 : 11);
  const nodes: GNode[] = all.map(({ id }) => {
    if (id.startsWith("#")) return { id, label: id, href: `/tags/${id.slice(1)}/`, x: P[id].x, y: P[id].y, r: 4, kind: "tag", tags: [] };
    const me = id === opts.center;
    return { id, label: short(id), href: url(id), x: P[id].x, y: P[id].y, r: me ? 8 : 4 + Math.min(4, g.back.get(id)!.length), kind: me ? "me" : "note", tags: byId.get(id)!.data.tags };
  });
  return { nodes, edges, P };
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
      .sort((a, b) => a.id.split("/")[2].localeCompare(b.id.split("/")[2]) || (a.data.sidebar.order ?? 99) - (b.data.sidebar.order ?? 99) || a.id.localeCompare(b.id))
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
