import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

// kb/ and courses/ live in src/content/docs and are rendered by Starlight.
const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      // KB and lessons: tags shown on the page and collected on /tags/<tag>/
      tags: z.array(z.string()).default([]),
      // KB: when the note was last checked against real gear, e.g. 2026-10
      verified: z.string().optional(),
      // Courses: who may read a lesson. Everything is free for now; account/paid need a server later.
      access: z.enum(["free", "account", "paid"]).default("free"),
      // Course index pages (courses/<course>/index.md)
      course: z.object({ path: z.string(), slot: z.number(), summary: z.string() }).optional(),
      // Lessons that are a quiz get a dashed port on the course card
      quiz: z.boolean().default(false),
      // Placeholder pages written for the first version, to be replaced
      sample: z.boolean().default(false),
      // The "$ command" line shown above the title, like on the other pages
      prompt: z.string().optional(),
    }),
  }),
});

// Blog posts: src/content/blog/<slug>.md
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    // Shown like a syslog facility: %HOMELAB-5-POST
    facility: z.string().default("BLOG"),
    // 5 = post, 6 = short note (syslog notice / informational)
    severity: z.union([z.literal(5), z.literal(6)]).default(5),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    sample: z.boolean().default(false),
  }),
});

export const collections = { docs, blog };
