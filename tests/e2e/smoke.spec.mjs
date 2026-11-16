// Smoke tests for the reader features: pages load cleanly, search, saving, course progress,
// quizzes, the graph filter, the phone menu and the colour scheme.
import { test, expect } from "@playwright/test";

const PAGES = ["/", "/blog/", "/blog/understanding-ospf-like-a-network-engineer/", "/kb/", "/kb/cisco/campus/routing/", "/kb/cisco/campus/routing/ospf/ospf-authentication/", "/kb/graph/", "/tags/", "/tags/ospf/", "/courses/", "/courses/subnetting/", "/courses/subnetting/3-check/quiz/", "/saved/", "/about/"];

for (const path of PAGES) {
  test(`loads ${path} without errors or sideways scrolling`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    const outside = [];
    page.on("request", (r) => { const u = new URL(r.url()); if (u.hostname !== "localhost") outside.push(r.url()); });
    const res = await page.goto(path);
    expect(res.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(errors).toEqual([]);
    expect(outside, "no outside requests").toEqual([]);
    const wide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(wide, "page scrolls sideways").toBe(false);
  });
}

test("search opens with / and finds notes", async ({ page, isMobile }) => {
  await page.goto("/kb/");
  if (isMobile) await page.getByRole("button", { name: "Search" }).click(); else await page.keyboard.press("/");
  const input = page.locator(".search-dlg input");
  await expect(input).toBeVisible();
  await input.fill("ospf");
  await expect(page.locator(".pagefind-ui__result").first()).toBeVisible({ timeout: 10_000 });
});

test("saving a note shows it on /saved/", async ({ page }) => {
  await page.goto("/kb/cisco/campus/routing/ospf/ospf-authentication/");
  const star = page.locator("[data-save]").first();
  await star.click();
  await expect(star).toHaveAttribute("aria-pressed", "true");
  await page.goto("/saved/");
  await expect(page.locator("#saved-list a")).toContainText("OSPF Authentication");
});

test("marking a lesson done lights its port and moves 'continue'", async ({ page }) => {
  await page.goto("/courses/subnetting/1-basics/prefix-length/");
  await page.locator("[data-done]").click();
  await expect(page.locator("[data-done]")).toHaveAttribute("aria-pressed", "true");
  await page.goto("/courses/subnetting/");
  await expect(page.locator("[data-upcount]")).toHaveText(/^1\/\d+ up$/);
  await expect(page.locator("[data-continue]")).toContainText("continue:");
});

test("quiz answers are checked", async ({ page }) => {
  await page.goto("/courses/subnetting/3-check/quiz/");
  await page.locator('input[name="q1"][value="1"]').check();
  await expect(page.locator('[data-result="q1"]')).toContainText("correct");
  await page.locator('input[name="q2"][value="0"]').first().check();
  await expect(page.locator('[data-result="q2"]')).toContainText("not quite");
});

test("graph tag filter lights matching notes", async ({ page }) => {
  await page.goto("/kb/graph/?tag=ospf");
  await expect(page.locator('#gtags [data-hl="ospf"]')).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator("#fullgraph a.nd.hl").count()).toBeGreaterThan(5);
});

test("folder pages list their contents and link back up", async ({ page }) => {
  await page.goto("/kb/cisco/campus/routing/ospf/");
  await expect(page.locator(".cats a.cat").first()).toBeVisible();
  await page.locator(".crumb a", { hasText: "routing" }).click();
  await expect(page).toHaveURL(/\/kb\/cisco\/campus\/routing\/$/);
});

test("phone menu opens and shows the kb tree", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  await page.goto("/kb/cisco/campus/routing/ospf/ospf-authentication/");
  await page.locator("[data-menu-toggle]").click();
  await expect(page.locator("[data-menu-toggle]")).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator('.menu-tree a[aria-current="page"]').first()).toBeVisible();
});

test("colour scheme toggle sticks across pages", async ({ page }) => {
  await page.goto("/kb/");
  const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.locator("[data-theme-toggle]").click();
  const after = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(after).not.toBe(before);
  await page.goto("/blog/");
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(after);
});

test("'done, next' marks the lesson and opens the next one", async ({ page }) => {
  await page.goto("/courses/subnetting/1-basics/prefix-length/");
  await page.locator("[data-done-next]").click();
  await expect(page).toHaveURL(/block-sizes\/$/);
  await page.goto("/courses/subnetting/");
  await expect(page.locator('.syllabus a.done')).toHaveCount(1);
});

test("quiz shows a score", async ({ page }) => {
  await page.goto("/courses/subnetting/3-check/quiz/");
  await page.locator('input[name="q1"][value="1"]').check();
  await expect(page.locator("#quiz-score")).toContainText("1/");
});

test("search can be narrowed to the blog", async ({ page }) => {
  await page.goto("/kb/");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.locator('[data-scope="kb"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator(".search-dlg input").fill("ospf");
  await page.locator('[data-scope="blog"]').click();
  await expect(page.locator(".pagefind-ui__result-link").first()).toContainText("OSPF");
  await expect(page.locator('.pagefind-ui__result-link:not([href^="/blog/"])')).toHaveCount(0);
});

test("moved notes redirect to their new address", async ({ page }) => {
  await page.goto("/kb/cisco/campus/routing/ospf/network-type/osfp-non-broadcast/");
  await expect(page).toHaveURL(/\/network-types\/ospf-non-broadcast\/$/);
  await expect(page.locator("h1")).toHaveText("OSPF Non-Broadcast");
});

test("kb tree folders open and close, and link to their page", async ({ page, isMobile }) => {
  test.skip(isMobile, "the tree is in the menu on phones");
  await page.goto("/kb/cisco/campus/routing/ospf/ospf-authentication/");
  const toggle = page.locator(".doctree [data-tw]").filter({ has: page.locator("xpath=following-sibling::a[normalize-space()='bgp/']") }).first();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".doctree a", { hasText: "BGP Messages" })).toBeVisible();
  await page.locator(".doctree a.dirlink", { hasText: /^bgp\/$/ }).click();
  await expect(page).toHaveURL(/\/routing\/bgp\/$/);
});

test("folder cheat sheet lists commands and links to notes", async ({ page }) => {
  await page.goto("/kb/cisco/campus/routing/");
  await page.locator("a.lk-cmd").click();
  await expect(page).toHaveURL(/\/routing\/commands\/$/);
  expect(await page.locator(".cheat pre").count()).toBeGreaterThan(5);
});

test("] opens the next note", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard");
  await page.goto("/kb/cisco/campus/routing/ospf/ospf-authentication/");
  const next = await page.locator('.pn a[rel="next"]').getAttribute("href");
  await page.keyboard.press("]");
  await expect(page).toHaveURL(new RegExp(next.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"));
});

test("home rack lists the live blog, kb and courses with counts", async ({ page }) => {
  await page.goto("/");
  for (const [href, unit] of [["/blog/", /\d+ posts?/], ["/kb/", /\d+ notes?/], ["/courses/", /\d+ courses?|samples only/]]) {
    const slot = page.locator(".slot-on", { has: page.locator(`h3 a[href="${href}"]`) });
    await expect(slot.locator(".mono")).toContainText(unit);
  }
  await page.locator('.slot-on h3 a[href="/kb/"]').click();
  await expect(page).toHaveURL(/\/kb\/$/);
});

test("404 suggests pages with words from the address", async ({ page }) => {
  await page.goto("/kb/ospf-authentification/");
  await expect(page.locator("#lost-path")).toHaveText("/kb/ospf-authentification/");
  await expect(page.locator('#lost-list a[href="/kb/cisco/campus/routing/ospf/ospf-authentication/"]')).toBeVisible();
});

test("nothing is blocked by the Content-Security-Policy", async ({ page, isMobile }) => {
  test.skip(isMobile, "same pages on phone");
  const blocked = [];
  page.on("console", (m) => { if (/Content Security Policy|Refused to/i.test(m.text())) blocked.push(m.text()); });
  for (const path of ["/", "/kb/graph/?tag=ospf", "/blog/", "/tags/", "/kb/cisco/campus/routing/commands/", "/courses/subnetting/3-check/quiz/", "/nope/"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
  }
  await page.keyboard.press("/");
  await page.locator(".search-dlg input").fill("bgp");
  await expect(page.locator(".pagefind-ui__result").first()).toBeVisible({ timeout: 10_000 });
  await page.goto("/blog/");
  await page.locator("#q").fill("ospf");
  await expect(page.locator("#loglist .row:not([hidden])")).not.toHaveCount(0);
  await page.goto("/kb/graph/?tag=ospf");
  await expect(page.locator("#gstat")).toContainText("#ospf");
  expect(blocked).toEqual([]);
});

test("search results work from the keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard");
  await page.goto("/kb/");
  await page.keyboard.press("/");
  await page.locator(".pagefind-ui__search-input").fill("ospf stub");
  const first = page.locator(".pagefind-ui__result-link").first();
  await expect(first).toBeVisible({ timeout: 10_000 });
  await page.keyboard.press("ArrowDown");
  await expect(first).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(page.locator(".pagefind-ui__search-input")).toBeFocused();
  const href = await first.getAttribute("href");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"));
});

test("saved pages and progress survive a backup round trip", async ({ page, isMobile }) => {
  test.skip(isMobile, "same code on phone");
  await page.goto("/kb/cisco/campus/routing/ospf/ospf-authentication/");
  await page.locator(".title-meta [data-save]").click();
  await page.goto("/saved/");
  const download = page.waitForEvent("download");
  await page.locator("[data-backup-save]").click();
  const file = await (await download).path();
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator("#saved-empty")).toBeVisible();
  await page.locator("[data-backup-load]").setInputFiles(file);
  await expect(page.locator("#backup-msg")).toContainText("1 new saved page");
  await expect(page.locator('#saved-list a[href="/kb/cisco/campus/routing/ospf/ospf-authentication/"]')).toBeVisible();
  await page.locator("[data-backup-load]").setInputFiles({ name: "x.json", mimeType: "application/json", buffer: Buffer.from('{"saved":{"javascript:alert(1)":{"title":"x"}}}') });
  await expect(page.locator("#backup-msg")).toContainText("not a backup");
});

test("saving in two tabs keeps both, and the other tab's star follows", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "same code on phone");
  const a = "/kb/cisco/campus/routing/ospf/ospf-authentication/";
  await page.goto(a);
  const other = await context.newPage();
  await other.goto("/blog/understanding-ospf-like-a-network-engineer/");
  await page.locator(".title-meta [data-save]").click();
  // the tab that loaded before the first save must not write its old list back
  await other.locator("[data-save]").first().click();
  await expect(page.locator(".title-meta [data-save]")).toHaveAttribute("aria-pressed", "true");
  await other.goto("/saved/");
  await expect(other.locator("#saved-list a")).toHaveCount(2);
  await other.locator(`#saved-list [data-save="${a}"]`).click();
  await expect(page.locator(".title-meta [data-save]")).toHaveAttribute("aria-pressed", "false");
});

test("404 page copes with a broken %-escape in the address", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  // the preview server itself fails on this address (GitHub Pages serves 404.html), so hand the page over directly
  await page.route("**/kb/ospf%E0%A4%A/", (r) => r.fulfill({ status: 404, path: "dist/404.html", contentType: "text/html" }));
  await page.goto("/kb/ospf%E0%A4%A/");
  await expect(page.locator("#lost-path")).toContainText("/kb/ospf");
  expect(errors).toEqual([]);
});

test("the phone's browser bar follows the colour scheme toggle", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/kb/");
  const bar = () => page.evaluate(() => [...document.querySelectorAll('meta[name="theme-color"]')].map((m) => m.content));
  await page.locator("[data-theme-toggle]").click();
  expect(new Set(await bar())).toEqual(new Set(["#111111"]));
  await page.goto("/blog/");
  expect(new Set(await bar())).toEqual(new Set(["#111111"]));
});

test("switching the theme in one tab switches the other open tabs", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "same code on phone");
  await page.goto("/");
  const other = await context.newPage();
  await other.goto("/kb/");
  const before = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--page").trim());
  await page.locator("[data-theme-toggle]").click();
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  await expect(other.locator("html")).toHaveAttribute("data-theme", after);
  const bar = await other.evaluate(() => [...document.querySelectorAll('meta[name="theme-color"]')].map((m) => m.content));
  expect(bar).not.toContain(before);
});

test("Ctrl+/ does not open the search, / does", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard only");
  await page.goto("/kb/");
  await page.keyboard.press("Control+/");
  await expect(page.locator(".search-dlg")).not.toHaveAttribute("open", "");
  await page.keyboard.press("/");
  await expect(page.locator(".search-dlg")).toHaveAttribute("open", "");
});

test("the gaming handle is not shown as text on the site", async ({ page }) => {
  for (const path of ["/", "/about/", "/kb/"]) {
    await page.goto(path);
    expect(await page.locator("body").innerText()).not.toMatch(/reykime/i);
  }
});
