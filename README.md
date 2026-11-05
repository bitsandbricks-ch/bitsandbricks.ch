# bitsandbricks.ch

The Bits & Bricks website: Mike Keller's projects (Hubra, Labdex, Homelab), plus the blog,
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
npm run build     # build into dist/, build the search index, check every internal link
npm run preview   # serve dist/ (search only works here, not in npm run dev)
```

Pushing to `main` builds and publishes. Pull requests build too, so broken links fail the check.

### Writing

- **Blog post:** add `src/content/blog/<slug>.md` with `title`, `summary`, `date`, `facility`
  (shown as `%HOMELAB-5-POST`), `tags`. `severity: 6` makes it a short note, `draft: true` hides it.
- **KB note:** add a `.md` file anywhere under `src/content/docs/kb/`. Folders become the sidebar
  tree. Frontmatter: `title`, `description`, `tags`, `verified: "2026-11"`. Link other notes with
  normal Markdown links (`/kb/routing/bgp/bgp-basics/` or `../lsa-types/`); backlinks and the graph
  are built from those links.
- **Course:** a folder under `src/content/docs/courses/` with an `index.md` (`course: { path, slot,
  summary }`) and section folders with lessons (`sidebar.order` sets the order, `quiz: true` for
  quizzes). Learning paths are listed in `PATHS` in `src/lib/content.ts`. Every lesson has
  `access: free` for now; `account` and `paid` are reserved for when accounts exist.

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
