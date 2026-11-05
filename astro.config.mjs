// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const NOINDEX = ["/404/", "/impressum/", "/privacy/", "/saved/"];

export default defineConfig({
  site: "https://bitsandbricks.ch",
  trailingSlash: "always",
  build: { format: "directory" },
  markdown: { syntaxHighlight: false },
  integrations: [sitemap({ filter: (page) => !NOINDEX.some((p) => page.endsWith(p)) })],
});
