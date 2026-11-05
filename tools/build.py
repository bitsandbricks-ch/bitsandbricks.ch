#!/usr/bin/env python3
"""Builds the bitsandbricks.ch pages from src/pages/ into public/.

Each page in src/pages/ starts with a comment block of settings:

    <!--
    path: /labdex/               where the page is served
    title: Labdex                <title>, " · Bits & Bricks" is added
    description: ...             meta description
    index: no                    optional: keep the page out of search engines
    -->

The rest of the file is the page's <main> content. The build wraps it in the
shared head, header and footer below.

    python3 tools/build.py           write public/**/index.html + sitemap.xml
    python3 tools/build.py --check   fail if public/ is out of date or an
                                     internal link points nowhere

Python 3.9+, standard library only. The output is committed, so GitHub Pages
publishes public/ as it is.
"""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "pages"
OUT = ROOT / "public"
SITE = "https://bitsandbricks.ch"
NAME = "Bits & Bricks"

NAV = [("/#rack", "projects"), ("/hubra/", "hubra"), ("/labdex/", "labdex"), ("/homelab/", "homelab"), ("/about/", "about")]

GITHUB = "https://github.com/reykimedev"
LINKEDIN = "https://www.linkedin.com/in/mike-keller-181827253/"
MAIL = "mike@cheller.dev"

# The logo: a brick wall (a firewall) with one green RJ45 port in it.
LOGO = (
    '<svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="12" width="17" height="10" rx="1.4" fill="var(--brick)"/><rect x="24.5" y="12" width="17.0" height="10" rx="1.4" fill="var(--brick)"/><rect x="44" y="12" width="17" height="10" rx="1.4" fill="var(--brick)"/><rect x="5" y="24.5" width="7.5" height="10" rx="1.4" fill="var(--brick)"/><rect x="15" y="24.5" width="17" height="10" rx="1.4" fill="var(--core)"/><path d="M19.0 26.7h9v4.4h-2.4v1.4h-4.2v-1.4h-2.4z" fill="#111111"/><rect x="34.5" y="24.5" width="17.0" height="10" rx="1.4" fill="var(--brick)"/><rect x="54" y="24.5" width="7" height="10" rx="1.4" fill="var(--brick)"/><rect x="5" y="37" width="17" height="10" rx="1.4" fill="var(--brick)"/><rect x="24.5" y="37" width="17.0" height="10" rx="1.4" fill="var(--brick)"/><rect x="44" y="37" width="17" height="10" rx="1.4" fill="var(--brick)"/></svg>'
)
# The project marks, as on hubra.club and in the labdex docs.
HUBRA = (
    '<svg class="logo" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="15" fill="#7441e0"/>'
    '<path d="M21 14V50M21 35a11 11 0 0 1 22 0V50" fill="none" stroke="#fff" stroke-width="8" '
    'stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="45" r="4" fill="#fece2b"/></svg>'
)
LABDEX = (
    '<svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="#7c3aed"/>'
    '<rect x="6" y="6" width="20" height="20" rx="4" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>'
    '<rect x="10.5" y="10.5" width="11" height="11" rx="2.5" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2"/>'
    '<rect x="14" y="14" width="4" height="4" rx="1" fill="#fff"/></svg>'
)
HOMELAB = (
    '<svg class="logo" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="15" fill="#b23b14"/>'
    '<g fill="none" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"><rect x="15" y="14" width="34" height="10" rx="3"/>'
    '<rect x="15" y="27" width="34" height="10" rx="3"/><rect x="15" y="40" width="34" height="10" rx="3"/></g>'
    '<g fill="#4ade80"><circle cx="22" cy="19" r="2.2"/><circle cx="22" cy="32" r="2.2"/><circle cx="22" cy="45" r="2.2"/></g></svg>'
)

def icon(body: str) -> str:
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
            f'stroke-linejoin="round" aria-hidden="true">{body}</svg>')

ICONS = {
    "github": icon('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'),
    "linkedin": icon('<rect x="2.5" y="2.5" width="19" height="19" rx="4"/><path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13a2.5 2.5 0 0 1 5 0v3.5"/>'),
    "mail": icon('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>'),
    "arrow": icon('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    "ext": icon('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    "moon": icon('<path class="moon" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/><g class="sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></g>'),
}

# Placeholders a page can use: {{logo}}, {{hubra}}, {{icon:github}}, {{linkedin}} ...
def fill(text: str) -> str:
    text = re.sub(r"\{\{icon:(\w+)\}\}", lambda m: ICONS[m.group(1)], text)
    for k, v in {"logo": LOGO, "hubra": HUBRA, "labdex": LABDEX, "homelab": HOMELAB,
                 "github": GITHUB, "linkedin": LINKEDIN, "mail": MAIL}.items():
        text = text.replace("{{" + k + "}}", v)
    return text

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
{robots}<link rel="canonical" href="{url}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#111111">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/archivo-latin-standard-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/ibm-plex-mono-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<script src="/assets/theme.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-head">
  <div class="wrap bar">
    <a class="brand" href="/" aria-label="Bits and Bricks, home">{{logo}}<span>Bits<b>&amp;</b>Bricks</span></a>
    <nav class="nav" aria-label="Main">{nav}</nav>
    <div class="head-tools">
      <a class="icon-btn" href="{{github}}" aria-label="GitHub">{{icon:github}}</a>
      <a class="icon-btn" href="{{linkedin}}" aria-label="LinkedIn">{{icon:linkedin}}</a>
      <button class="icon-btn theme" type="button" aria-label="Switch colour scheme" data-theme-toggle>{{icon:moon}}</button>
    </div>
  </div>
</header>
"""

FOOTER = """<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="/">{{logo}}<span>Bits<b>&amp;</b>Bricks</span></a>
        <p>Side projects by Mike Keller, network engineer in Switzerland.</p>
      </div>
      <ol class="trace" aria-label="Links">
        <li class="cmd">Links</li>
        <li><span>1</span><a href="https://hubra.club">hubra.club</a><span>Hubra</span></li>
        <li><span>2</span><a href="https://labdex-app.github.io/labdex/">labdex-app.github.io</a><span>Labdex docs</span></li>
        <li><span>3</span><a href="{{github}}">github.com/reykimedev</a><span>code</span></li>
        <li><span>4</span><a href="{{linkedin}}">linkedin.com/in/mike-keller</a><span>work</span></li>
        <li><span>5</span><a href="mailto:{{mail}}">{{mail}}</a><span>mail</span></li>
      </ol>
    </div>
    <div class="foot-base"><span>© 2026 Mike Keller · no cookies, no tracking</span><span><a href="/brand/">Brand</a> · <a href="/impressum/">Impressum</a> · <a href="/privacy/">Privacy</a></span></div>
  </div>
</footer>
</body>
</html>
"""


def parse(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(.*?)-->\s*", text, re.S)
    if not m:
        sys.exit(f"{path}: missing settings comment")
    meta = {}
    for line in m.group(1).strip().splitlines():
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    for key in ("path", "title", "description"):
        if key not in meta:
            sys.exit(f"{path}: missing '{key}'")
    return meta, text[m.end():]


def link(href: str, label: str, here: str) -> str:
    current = ' aria-current="page"' if href == here else ""
    return f'<a href="{href}"{current}>{html.escape(label)}</a>'


def render(meta: dict, body: str) -> str:
    here = meta["path"]
    title = meta["title"] if here == "/" else f'{meta["title"]} · {NAME}'
    head = fill(HEAD).format(
        title=html.escape(title),
        description=html.escape(meta["description"]),
        robots='<meta name="robots" content="noindex">\n' if meta.get("index") == "no" else "",
        url=SITE + here,
        nav="".join(link(h, l, here) for h, l in NAV),
    )
    return fill(head + body.strip() + "\n" + FOOTER)


def target(path: str) -> Path:
    if path == "/404/":
        return OUT / "404.html"
    return OUT / path.strip("/") / "index.html" if path != "/" else OUT / "index.html"


def build() -> dict[Path, str]:
    files: dict[Path, str] = {}
    urls = []
    for src in sorted(SRC.glob("*.html")):
        meta, body = parse(src)
        files[target(meta["path"])] = render(meta, body)
        if meta.get("index") != "no":
            urls.append(SITE + meta["path"])
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n"
    files[OUT / "sitemap.xml"] = sitemap
    return files


def check_links(files: dict[Path, str]) -> list[str]:
    errors = []
    for out, text in files.items():
        for href in re.findall(r'(?:href|src)="(/[^"#?]*)', text):
            p = OUT / href.lstrip("/")
            if not (p.is_file() or (p / "index.html").is_file() or (p / "index.html") in files):
                errors.append(f"{out.relative_to(ROOT)}: broken link {href}")
    return errors


def main() -> None:
    files = build()
    if "--check" in sys.argv:
        stale = [str(p.relative_to(ROOT)) for p, t in files.items() if not p.is_file() or p.read_text(encoding="utf-8") != t]
        errors = check_links(files) + [f"out of date: {s} (run tools/build.py)" for s in stale]
        print("\n".join(errors) or "ok")
        sys.exit(1 if errors else 0)
    for path, text in files.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    for e in check_links(files):
        print("warning:", e)
    print(f"wrote {len(files)} files")


if __name__ == "__main__":
    main()
