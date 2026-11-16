// Accessibility: axe (WCAG 2 A/AA) on the main page types, light and dark.
// heading-order is left out: imported notes sometimes jump from ## to ####, which is content.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/about/", "/hubra/", "/labdex/", "/homelab/", "/brand/", "/impressum/", "/privacy/", "/404/", "/kb/", "/kb/cisco/campus/routing/", "/kb/cisco/campus/routing/ospf/ospf-authentication/", "/kb/graph/", "/tags/", "/tags/ospf/", "/courses/", "/courses/subnetting/", "/courses/subnetting/3-check/quiz/", "/blog/", "/blog/understanding-ospf-like-a-network-engineer/", "/saved/"];

for (const scheme of ["light", "dark"]) {
  for (const path of PAGES) {
    test(`a11y ${scheme} ${path}`, async ({ page, isMobile }) => {
      test.skip(isMobile, "desktop is enough for axe");
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).disableRules(["heading-order"]).analyze();
      expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
    });
  }
}
