import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = '/Users/cjo/.gemini/antigravity-cli/brain/2bf045f5-3fb7-441c-bb27-ee6935ddea1a/screenshots';
mkdirSync(outDir, { recursive: true });

const pages = [
  { name: 'landing', url: 'https://sovereign.defrag.app/' },
  { name: 'how-it-works', url: 'https://sovereign.defrag.app/how-it-works' },
  { name: 'pricing', url: 'https://sovereign.defrag.app/pricing' },
  { name: 'faq', url: 'https://sovereign.defrag.app/faq' },
  { name: 'login', url: 'https://sovereign.defrag.app/login' }
];

async function run() {
  console.log('Launching Playwright Chromium...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  for (const p of pages) {
    console.log(`Navigating to ${p.url}...`);
    const page = await context.newPage();
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000);
      const file = join(outDir, `${p.name}.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log(`Saved screenshot to ${file}`);
    } catch (err) {
      console.error(`Error loading ${p.url}:`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('Visual QA finished successfully!');
}

run();
