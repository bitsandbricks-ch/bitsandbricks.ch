// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import { kbLineBreaks } from "./src/lib/kb-line-breaks.mjs";
import { stubPaths } from "./tools/lib/stubs.mjs";

// Kept out of the sitemap: utility pages and stub notes (almost no text yet, see tools/lib/stubs.mjs)
const NOINDEX = ["/404/", "/impressum/", "/privacy/", "/saved/", ...stubPaths()];

export default defineConfig({
  site: "https://bitsandbricks.ch",
  trailingSlash: "always",
  build: { format: "directory" },
  markdown: { syntaxHighlight: false, processor: satteri({ mdastPlugins: [kbLineBreaks], features: { math: { singleDollarTextMath: false } } }) },
  integrations: [sitemap({ filter: (page) => !NOINDEX.some((p) => page.endsWith(p)) })],
});
