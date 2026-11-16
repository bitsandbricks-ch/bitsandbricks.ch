import { test } from "node:test";
import assert from "node:assert/strict";
import { pageProblems, cspProblems, cssProblems } from "../tools/lib/page-check.mjs";

const CSP = `default-src 'self'; script-src 'self' 'wasm-unsafe-eval' https://giscus.app; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src https://giscus.app; object-src 'none'`;
const page = (head = "", body = "<h1>Hi</h1>") =>
  `<!doctype html><html lang="en"><head><meta http-equiv="Content-Security-Policy" content="${CSP}"><title>T</title>${head}</head><body>${body}</body></html>`;

test("a clean page has no problems", () => {
  assert.deepEqual(pageProblems(page('<link rel="stylesheet" href="/assets/site.css"><script src="/assets/theme.js"></script>', '<h1>Hi</h1><a href="https://example.com">out</a><img src="/a.png" alt="">')), []);
});

test("stylesheets, fonts and icons from another site count as outside requests, plain links don't", () => {
  const p = pageProblems(page('<link rel="stylesheet" href="https://fonts.example.com/css"><link rel="preload" as="font" href="//cdn.example.com/f.woff2"><link rel="alternate" href="https://example.com/feed">'));
  assert.deepEqual(p, ["loads https://fonts.example.com/css from another site", "loads //cdn.example.com/f.woff2 from another site"]);
  assert.deepEqual(pageProblems(page("", '<h1>x</h1><img alt="x" src="https://example.com/a.png">')), ["loads https://example.com/a.png from another site"]);
});

test("inline scripts and handlers are caught, text inside scripts is not read as tags", () => {
  assert.deepEqual(pageProblems(page("<script>var a = '<img src=\"https://x\">'</script>")), ["inline <script> (blocked by the CSP: move it to public/assets)"]);
  assert.match(pageProblems(page("", '<h1 onclick="go()">x</h1>'))[0], /^inline handler/);
});

test("titles, headings, ids and alt text", () => {
  assert.deepEqual(pageProblems(page("", "<p>no heading</p>")), ["0 <h1> elements"]);
  assert.deepEqual(pageProblems(page("", "<p>none</p>"), { notFound: true }), []);
  assert.deepEqual(pageProblems(page("", '<h1 id="a">x</h1><p id="a"></p>')), ['duplicate id "a"']);
  assert.deepEqual(pageProblems(page("", '<h1>x</h1><img src="/a.png">')), ['image without alt: <img src="/a.png">']);
  assert.ok(pageProblems(page().replace(' lang="en"', "")).includes("no lang on <html>"));
  assert.ok(pageProblems(page().replace(/<meta http-equiv[^>]*>/, "")).includes("no Content-Security-Policy"));
});

test("redirect pages only need their link", () => {
  assert.deepEqual(pageProblems(`<html><head><meta http-equiv="refresh" content="0;url=/kb/x/"></head></html>`), []);
});

test("the CSP may name giscus and nothing else, and no inline or eval code", () => {
  assert.deepEqual(cspProblems(CSP), []);
  assert.deepEqual(cspProblems(CSP + "; connect-src https://api.example.com"), ["CSP allows https://api.example.com"]);
  assert.deepEqual(cspProblems("default-src *"), ["CSP allows any site (* or a bare scheme)"]);
  assert.deepEqual(cspProblems("script-src 'self' https:"), ["CSP allows any site (* or a bare scheme)"]);
  assert.deepEqual(cspProblems("script-src 'self' 'unsafe-inline' 'unsafe-eval'"), ["CSP allows eval", "CSP allows inline scripts"]);
});

test("stylesheets may not pull fonts or images from other sites", () => {
  assert.deepEqual(cssProblems('@font-face{src:url("/f.woff2")} a{background:url(data:image/png;base64,xx)}'), []);
  assert.deepEqual(cssProblems("@import url(https://fonts.example.com/x.css); b{background:url('//cdn.example.com/a.png')}"), ["loads https://fonts.example.com/x.css from another site", "loads //cdn.example.com/a.png from another site"]);
  assert.deepEqual(cssProblems('@import "https://fonts.example.com/y.css";'), ["loads https://fonts.example.com/y.css from another site"]);
});
