// Browser smoke tests against the built site (npm run build first). Run: npm run test:e2e
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: { baseURL: "http://localhost:4329", trace: "off" },
  webServer: { command: "npx astro preview --port 4329 --ignore-lock", url: "http://localhost:4329/", reuseExistingServer: !process.env.CI, timeout: 60_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
