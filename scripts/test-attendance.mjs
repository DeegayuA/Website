import { chromium } from "playwright";

async function testAttendance() {
  console.log("Launching browser to inspect attendance.altavision.lk...");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  
  try {
    await page.goto("http://attendance.altavision.lk/", { waitUntil: "networkidle", timeout: 30000 });
    console.log("Waiting 8000ms for Next.js PearlCluster UI components to mount...");
    await page.waitForTimeout(8000);
    
    await page.screenshot({ path: "public/images/altavisionattendance.png" });
    console.log("Saved attendance screenshot successfully!");
  } catch (err) {
    console.error("Error capturing attendance site:", err);
  } finally {
    await browser.close();
  }
}

testAttendance();
