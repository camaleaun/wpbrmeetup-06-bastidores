// Screenshots every slide (slides.js ORDER) at its last step into build/preview/, for a quick visual check.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { build } from './lib.mjs';

const order = JSON.parse(readFileSync('slides/slides.js', 'utf8').match(/const ORDER = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
rmSync(`${build}/preview`, { recursive: true, force: true });  // no leftovers from an older slide order
mkdirSync(`${build}/preview`, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const file of order) {
  await page.goto(pathToFileURL(`slides/${file}`).href);
  await page.evaluate(() => window.setStep(99));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${build}/preview/${String(order.indexOf(file) + 1).padStart(2, '0')}-${file.replace('.html', '')}.png` });
}
await browser.close();
console.log(`${build}/preview/: ${order.length} slides`);
