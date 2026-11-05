# bitsandbricks.ch

The Bits & Bricks website: Mike Keller's personal projects (Hubra, Labdex, Homelab).
Plain static files in `public/`, no external requests, light and dark mode.
Same setup as hubra.club. The brand guide is at `/brand/` (source: `src/pages/brand.html`), logo files in `public/brand/`.

| Path | What it is |
| --- | --- |
| `src/pages/*.html` | Page sources, one per page, settings comment at the top |
| `tools/build.py` | Wraps every page in the shared head, header and footer and writes `public/` |
| `public/` | The built site, committed and published as it is |
| `public/assets/site.css` | All styles, colour tokens at the top |
| `public/CNAME` | Custom domain for GitHub Pages |

## Editing

1. Change a page in `src/pages/`, or the header and footer in `tools/build.py`.
2. Run `python3 tools/build.py`, then `python3 tools/build.py --check`.
3. Commit `src/` and `public/` together. Pushing to `main` publishes.

Boxes marked TODO on the pages are content still to write.

## Going live on GitHub Pages

1. Repository settings > Pages > Source: **GitHub Actions**.
2. DNS for bitsandbricks.ch: `A` records to 185.199.108.153, 185.199.109.153,
   185.199.110.153, 185.199.111.153 (and `AAAA` 2606:50c0:8000::153 to ::8003::153),
   `www` as `CNAME` to `bitsandbricks-ch.github.io`.
3. Verify the domain under the bitsandbricks-ch organisation (Settings > Pages >
   Verified domains) so nobody else can claim it, then tick **Enforce HTTPS**.
