import { getCollection, type CollectionEntry } from "astro:content";
export type Post = CollectionEntry<"blog">;
export async function posts(): Promise<Post[]> {
  return (await getCollection("blog")).filter((p) => !p.data.draft).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export const day = (d: Date) => d.toISOString().slice(0, 10);
export const minutes = (p: Post) => Math.max(1, Math.round((p.body ?? "").split(/\s+/).length / 220));
export const facility = (p: Post) => `%${p.data.facility.toUpperCase()}-${p.data.severity}-${p.data.severity === 6 ? "NOTE" : "POST"}`;
