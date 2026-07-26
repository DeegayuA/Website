import { chromium } from "playwright";

const targets = [
  {
    url: "https://av-scada-demo.netlify.app/",
    out: "public/images/altavisionscada.png",
    wait: 6000,
  },
  {
    url: "https://amperearc.com/",
    out: "public/images/amperearc.png",
    wait: 5000,
  },
  {
    url: "https://solar.altavision.lk",
    out: "public/images/altavisionsolar.png",
    wait: 6000,
  },
  {
    url: "https://power.altavision.lk",
    out: "public/images/altavisionpower.png",
    wait: 5000,
  },
  {
    url: "http://attendance.altavision.lk/",
    out: "public/images/altavisionattendance.png",
    wait: 6000,
  },
  {
    url: "https://lifesight.vercel.app/",
    out: "public/images/lifesight.png",
    wait: 5000,
  },
];

async function run() {
  console.log("Launching Chromium to capture screenshots...");
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });

  for (const target of targets) {
    console.log(`Navigating to ${target.url}...`);
    const page = await context.newPage();
    try {
      await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 20000 });
      console.log(`Waiting ${target.wait}ms for UI and animations...`);
      await page.waitForTimeout(target.wait);
      await page.screenshot({ path: target.out });
      console.log(`Successfully saved screenshot to ${target.out}`);
    } catch (err) {
      console.error(`Failed to capture ${target.url}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("All screenshots captured and saved to public/images!");
}

run();
