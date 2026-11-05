// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";

const NOINDEX = ["/404/", "/impressum/", "/privacy/", "/saved/"];

export default defineConfig({
  site: "https://bitsandbricks.ch",
  trailingSlash: "always",
  build: { format: "directory" },
  markdown: { syntaxHighlight: false },
  integrations: [
    starlight({
      title: "Bits & Bricks",
      titleDelimiter: "·",
      favicon: "/assets/favicon.svg",
      disable404Route: true,
      credits: false,
      expressiveCode: false,
      pagefind: true,
      lastUpdated: false,
      head: [
        { tag: "link", attrs: { rel: "stylesheet", href: "/assets/site.css" } },
        { tag: "link", attrs: { rel: "stylesheet", href: "/assets/content.css" } },
        { tag: "link", attrs: { rel: "alternate", type: "application/rss+xml", title: "Bits & Bricks blog", href: "/blog/rss.xml" } },
        { tag: "script", attrs: { src: "/assets/reader.js", defer: true } },
      ],
      customCss: ["./src/styles/starlight.css"],
      sidebar: [
        { label: "kb", items: [{ autogenerate: { directory: "kb" } }] },
        { label: "courses", items: [{ autogenerate: { directory: "courses" } }] },
      ],
      routeMiddleware: "./src/lib/route-middleware.ts",
      components: {
        Header: "./src/components/starlight/Header.astro",
        PageTitle: "./src/components/starlight/PageTitle.astro",
        Footer: "./src/components/starlight/Footer.astro",
        ThemeProvider: "./src/components/starlight/ThemeProvider.astro",
        ThemeSelect: "./src/components/starlight/Empty.astro",
        SiteTitle: "./src/components/starlight/Empty.astro",
      },
    }),
    sitemap({ filter: (page) => !NOINDEX.some((p) => page.endsWith(p)) }),
  ],
});
