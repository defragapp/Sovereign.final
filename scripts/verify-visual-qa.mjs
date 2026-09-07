import { chromium } from 'playwright';
import { spawn } from 'child_process';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

async function runVisualQA() {
  console.log('🚀 Launching Local Preview for Visual QA...');
  const server = spawn('pnpm', ['--filter', '@sovereign/web', 'preview', '--port', '4173'], { stdio: 'pipe' });
  await new Promise(res => setTimeout(res, 2500));

  const browser = await chromium.launch();
  const page = await browser.newPage();
  let failed = false;

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:4173');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth > clientWidth) {
      console.error(`❌ [${vp.name}] Horizontal overflow detected: scrollWidth (${scrollWidth}px) > clientWidth (${clientWidth}px)`);
      failed = true;
    } else {
      console.log(`✅ [${vp.name}] Zero horizontal overflow verified.`);
    }

    await page.screenshot({ path: `.tmp/snapshots/${vp.name}-latest.png`, fullPage: true });
  }

  await browser.close();
  server.kill();

  if (failed) {
    console.error('Visual verification failed.');
    process.exit(1);
  }
  console.log('✨ All Visual QA gates passed.');
}

runVisualQA().catch((err) => {
  console.error(err);
  process.exit(1);
});
