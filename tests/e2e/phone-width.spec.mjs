// Every page of the built site at a small phone width (360 px): nothing may make the page scroll
// sideways. Long folder paths and links without spaces were the usual cause.
import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../../dist/", import.meta.url).pathname;
const pages = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (f !== "pagefind" && f !== "assets") walk(p); }
    else if (f === "index.html" && !readFileSync(p, "utf8").includes('http-equiv="refresh"')) pages.push("/" + p.slice(DIST.length).replace(/index\.html$/, ""));
  }
})(DIST);

test("no page scrolls sideways at 360 px", async ({ page, isMobile }) => {
  test.skip(isMobile, "runs once, with its own viewport");
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 360, height: 760 });
  const wide = [];
  for (const path of pages) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (extra > 0) wide.push(`${path} (+${extra}px)`);
  }
  expect(pages.length).toBeGreaterThan(100);
  expect(wide).toEqual([]);
});
