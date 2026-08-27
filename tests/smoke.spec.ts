import { test, expect } from "playwright/test";

/**
 * Five smoke journeys: load, filter, CV popup, case study, theme toggle.
 * Kept intentionally selector-light — they assert user-visible behavior,
 * not implementation details, so redesigns don't break them spuriously.
 */

test.describe("home", () => {
  test("loads with hero name and no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    // Hero renders the name in server HTML (SSR-visible, LCP-critical)
    await expect(
      page.getByRole("heading", { level: 1 }).first(),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /projects/i }).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("project filters narrow the grid and announce state", async ({ page }) => {
    await page.goto("/#projects");
    const iotPill = page.getByRole("button", { name: "IoT", exact: true });
    await iotPill.scrollIntoViewIfNeeded();
    await iotPill.click();
    await expect(iotPill).toHaveAttribute("aria-pressed", "true");
    // Grid re-renders with only IoT projects; GreenWing is one of them
    await expect(
      page.getByRole("heading", { name: /GreenWing/i }),
    ).toBeVisible();
  });

  test("CV popup opens focus-trapped and closes on Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", {
      name: /open the full cv/i,
    });
    await trigger.scrollIntoViewIfNeeded();
    // Click near the top of the preview — the floating "Download CV" pill
    // legitimately overlays the center of the card. Retry until the button
    // reports expanded; entrance animations can swallow the first tap.
    await expect(async () => {
      await trigger.click({ position: { x: 60, y: 20 } });
      expect(await trigger.getAttribute("aria-expanded")).toBe("true");
    }).toPass({ timeout: 10_000 });
    const dialog = page.getByRole("dialog", { name: /curriculum vitae/i });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("theme toggle flips the color scheme", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const before = await html.getAttribute("class");
    await page.getByRole("button", { name: /theme|mode/i }).first().click();
    await expect
      .poll(async () => html.getAttribute("class"))
      .not.toBe(before);
  });
});

test.describe("case studies", () => {
  test("card links through to a full case study", async ({ page }) => {
    await page.goto("/work/logpup");
    await expect(
      page.getByRole("heading", { level: 1, name: /logpup/i }),
    ).toBeVisible();
    // Chapter content and stack section present
    await expect(page.getByRole("heading", { name: /context/i })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /stack & architecture/i }),
    ).toBeVisible();
    // Next-study footer navigates within /work
    await page.getByRole("link", { name: /next case study/i }).click();
    await expect(page).toHaveURL(/\/work\/(?!logpup)[a-z-]+/);
  });

  test("unknown slug 404s", async ({ page }) => {
    const response = await page.goto("/work/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
