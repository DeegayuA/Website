import { defineConfig, devices } from "playwright/test";

/**
 * Smoke suite — five user journeys that would have caught every bug fixed
 * in the August 2026 overhaul. Run with `npm run test:e2e`.
 * Spawns its own dev server on :3100 unless one is already there.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  /* Next 16 allows one dev server per project dir, so reuse the local one
     (npm run dev binds :3001 here); CI spawns its own. */
  webServer: {
    command: "npm run dev -- -p 3001",
    url: "http://localhost:3001",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
