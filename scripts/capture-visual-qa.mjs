import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4173;
const DIST_DIR = join(process.cwd(), 'apps', 'web', 'dist');
const OUTPUT_DIR = join(process.cwd(), '.tmp', 'screenshots');

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
};

function serveFile(res, filePath) {
  try {
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    const indexPath = join(DIST_DIR, 'index.html');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
}

const server = createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let targetPath = join(DIST_DIR, urlPath);
  if (urlPath.endsWith('/')) targetPath = join(targetPath, 'index.html');
  if (!existsSync(targetPath) && !extname(targetPath)) {
    if (existsSync(`${targetPath}.html`)) {
      targetPath = `${targetPath}.html`;
    }
  }
  serveFile(res, targetPath);
});

server.listen(PORT, async () => {
  console.log(`Local preview server running at http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });

  const viewports = {
    desktop: { width: 1440, height: 900 },
    mobile: { width: 390, height: 844 }
  };

  const routes = [
    { name: 'landing', path: '/' },
    { name: 'how-it-works', path: '/how-it-works' },
    { name: 'pricing', path: '/pricing' },
    { name: 'faq', path: '/faq' },
    { name: 'login', path: '/login' },
    { name: 'signup', path: '/signup' },
    { name: 'app', path: '/app' },
    { name: 'static-pricing', path: '/pricing.html' },
    { name: 'static-faq', path: '/faq.html' },
    { name: 'static-how-it-works', path: '/how-it-works.html' }
  ];

  let totalOverflows = 0;

  for (const [device, vp] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport: vp });
    const page = await context.newPage();

    for (const route of routes) {
      const targetUrl = `http://localhost:${PORT}${route.path}`;
      await page.goto(targetUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const overflow = await page.evaluate(() => {
        return Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      });

      if (overflow > 0) {
        console.error(`❌ Overflow detected on ${route.name} (${device}): ${overflow}px`);
        totalOverflows++;
      }

      const screenshotPath = join(OUTPUT_DIR, `${route.name}_${device}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Saved screenshot: ${route.name}_${device}.png (Overflow: ${overflow}px)`);
    }

    await context.close();
  }

  await browser.close();
  server.close();

  if (totalOverflows === 0) {
    console.log('\n✅ All routes rendered perfectly across 1440x900 desktop and 390x844 mobile with 0 overflow!');
    process.exit(0);
  } else {
    console.error(`\n❌ Total overflow issues detected: ${totalOverflows}`);
    process.exit(1);
  }
});
