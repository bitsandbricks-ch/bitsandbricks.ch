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
