# bitsandbricks.ch

[![Pages](https://github.com/bitsandbricks-ch/bitsandbricks.ch/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/bitsandbricks-ch/bitsandbricks.ch/actions/workflows/pages.yml?query=branch%3Amain) [![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-bitsandbricks-ffdd00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/bitsandbricks)

The Bits & Bricks website: Mike's projects (Hubra, Labdex, Homelab), plus the blog,
the knowledge base and courses. Built with [Astro](https://astro.build), with search by
[Pagefind](https://pagefind.app), published as static files on GitHub Pages.
No cookies, no tracking, no outside requests (comments load only when a reader clicks).
The brand guide is at `/brand/` (source: `src/legacy/brand.html`), logo files in `public/brand/`.

| Path | What it is |
| --- | --- |
| `src/legacy/*.html` | The hand-written pages (home, about, projects, brand, impressum, privacy), settings comment at the top |
| `src/content/blog/*.md` | Blog posts, one Markdown file each |
| `src/content/docs/kb/**.md` | Knowledge base notes, nested in folders as deep as needed |
| `src/content/docs/courses/<course>/` | A course: `index.md` plus one folder per section (`1-basics/`, `2-vlsm/`) with lessons |
| `src/lib/site.ts` | Logo, icons, nav, links, `{{placeholders}}`, comment settings |
| `src/lib/content.ts` | Backlinks, graph layout, tags, course structure, learning paths |
| `src/components/docs/` | The kb note / lesson page: tree, text, on-this-page, backlinks, prev/next |
| `public/assets/site.css` | All base styles, colour tokens at the top |
| `public/assets/content.css` | Styles for blog, kb and courses |
| `public/assets/reader.js` | Saved pages, course progress, quizzes, click-to-load comments (browser only) |
| `public/CNAME` | Custom domain for GitHub Pages |

## Editing

```
npm ci            # once
npm run dev       # local preview at http://localhost:4321
npm run build     # check content, build into dist/, build the search index, check the site
npm run preview   # serve dist/ (search only works here, not in npm run dev)
npm test          # unit tests (kb helpers, secrets check), plain node --test
npm run test:e2e  # browser smoke tests against dist/ (after npm run build)
npm run check:content   # list content warnings: stubs, duplicate titles, #todo-style tag lines
```

The build stops when a Markdown file looks like it holds a password, token, private key, shell
history or private IP addresses (`tools/lib/safety.mjs`; lab examples with RFC 1918 addresses
need `private_ips_ok: true` in the frontmatter), or has a `# ` heading (the title is the page's
h1, start at `## `). After the build, `tools/check.mjs` fails on broken links or anchors, pages
without a title or with more than one h1, duplicate ids, images without alt text, and anything
loaded from another site.

Pushing to `main` builds and publishes. Pull requests run the same build and tests, so a broken
link, a leaked secret or a broken reader feature fails the check.

### Writing

- **Blog post:** add `src/content/blog/<slug>.md` with `title`, `summary`, `date`, `facility`
  (shown as `%HOMELAB-5-POST`), `tags`. `severity: 6` makes it a short note, `draft: true` hides it.
- **KB note:** add a `.md` file anywhere under `src/content/docs/kb/`. Folders become the sidebar
  tree, and every folder gets its own overview page at build time (`/kb/a/b/` lists the notes and
  sub-folders in `a/b/`), so there is nothing to create by hand. Frontmatter: `title`,
  `description`, `tags`, `verified: "2026-11"`. Link other notes with normal Markdown links
  (`/kb/routing/bgp/bgp-basics/` or `../lsa-types/`); backlinks are built from those links. The graph
  at `/kb/graph/` shows every note under its folder plus those links; `/tags/` lists every tag.
- **Course:** a folder under `src/content/docs/courses/` with an `index.md` (`course: { path, slot,
  summary }`) and section folders with lessons (`sidebar.order` sets the order, `quiz: true` for
  quizzes). Learning paths are listed in `PATHS` in `src/lib/content.ts`. Every lesson has
  `access: free` for now; `account` and `paid` are reserved for when accounts exist.

- **Line breaks in kb notes** work like they did in Grav: a single line break inside a paragraph
  is kept (`src/lib/kb-line-breaks.mjs`). Blog posts and lessons use plain Markdown.
- **Tag lines:** a line of nothing but Obsidian tags (`#todo/cleanup`, `#certifications/...`) in a
  kb note is kept in the file but not shown on the site; `npm run check:content` lists them.
- **Stubs:** a kb note with under 40 words shows a "stub" note and stays out of search and the
  sitemap until it is written up (`tools/lib/stubs.mjs`).

- **Cheat sheets:** folders whose notes have code blocks get `/kb/<folder>/commands/` with every
  snippet on one page (made for printing).
- **Cisco IOS code:** kb code blocks that look like IOS (or are fenced as ```` ```cisco ````) get
  prompts, `!` comments, show/debug/no and `<placeholders>` marked at build time
  (`src/lib/kb-ios.mjs`). Fence other output as ```` ```text ```` to keep it plain.
- **Wiki links:** `[[ospf-packets]]` or `[[OSPF Packets]]` links to a kb note by its file name or
  title, from notes, lessons and blog posts. `[[ospf-packets#Hello packet]]` jumps to a heading,
  `[[ospf-packets|the packets]]` sets the text, `[[bgp/timers]]` picks one of two notes with the same
  name. They count as links in the graph and in "linked from". A wiki link to no note fails the
  build (`npm run check:content` says which).
- **Content-Security-Policy:** every page carries one (`src/layouts/Site.astro`): scripts only from
  `/assets/` (and giscus.app once a reader loads comments), no inline `<script>` or `onclick=`.
  Put page code in `public/assets/`; `npm run build` fails on inline scripts.
- **Moving a note:** move the file, then add `"old path": "new path"` to `src/redirects.json` so
  links from elsewhere keep working.
- **Callouts:** `> [!note]`, `> [!warning]`, `> [!info]` as the first line of a quote in a kb note.

### Importing from Grav

The first blog posts came from the old Grav site (gitlab.com/bitsandbricks/blog, private). With a
checkout of that repo, `node tools/import-grav.mjs <checkout>/data/user/pages` rewrites
`src/content/blog/` and, for kb notes that have `public: true` in their Grav frontmatter,
`src/content/docs/kb/`. Notes that look like they contain passwords, tokens, private IPs or shell
history are refused even when marked public. It prints a warning for everything it had to guess.

Pages marked `sample: true` are placeholders from the first version and show a note saying so.

### Comments

Giscus, stored in GitHub Discussions on this repo. To switch on: enable Discussions, install the
[giscus app](https://github.com/apps/giscus), pick the category on https://giscus.app and copy
`repoId` and `categoryId` into `GISCUS` in `src/lib/site.ts`. Until then the button says comments
are off.

## Going live on GitHub Pages

1. Repository settings > Pages > Source: **GitHub Actions**.
2. DNS for bitsandbricks.ch: `A` records to 185.199.108.153, 185.199.109.153,
   185.199.110.153, 185.199.111.153 (and `AAAA` 2606:50c0:8000::153 to ::8003::153),
   `www` as `CNAME` to `bitsandbricks-ch.github.io`.
3. Verify the domain under the bitsandbricks-ch organisation (Settings > Pages >
   Verified domains) so nobody else can claim it, then tick **Enforce HTTPS**.
