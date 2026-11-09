import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { posts } from "../../lib/blog";
export async function GET(context: APIContext) {
  const all = await posts();
  return rss({
    title: "Bits & Bricks blog",
    description: "Write-ups by Mike from the lab and the network.",
    site: context.site!,
    items: all.map((p) => ({ title: p.data.title, description: p.data.summary, pubDate: p.data.date, link: `/blog/${p.id}/`, categories: p.data.tags })),
  });
}
