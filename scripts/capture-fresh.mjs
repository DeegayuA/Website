import { chromium } from "playwright";

const targets = [
  { url: "https://av-scada-demo.netlify.app/", out: "public/images/web_scada.png", wait: 5000 },
  { url: "https://production.amperearc.com/", out: "public/images/web_amperearc.png", wait: 5000 },
  { url: "https://solar.altavision.lk/", out: "public/images/web_solar.png", wait: 5000 },
  { url: "https://power.altavision.lk/", out: "public/images/web_power.png", wait: 5000 },
  { url: "http://attendance.altavision.lk/", out: "public/images/web_attendance.png", wait: 5000 },
  { url: "https://lifesight.vercel.app/web", out: "public/images/web_lifesight.png", wait: 5000 },
];

async function run() {
  console.log("Capturing fresh high-res real site screenshots with Playwright...");
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });

  for (const target of targets) {
    console.log(`Navigating to ${target.url}...`);
    const page = await context.newPage();
    try {
      await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForTimeout(target.wait);
      await page.screenshot({ path: target.out });
      console.log(`Saved screenshot to ${target.out}`);
    } catch (err) {
      console.error(`Error capturing ${target.url}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("Fresh real website screenshots captured!");
}

run();
