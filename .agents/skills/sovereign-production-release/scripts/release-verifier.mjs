#!/usr/bin/env node

import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mode: 'verification-only',
    targetRef: 'main',
    targetSurface: 'https://sovereign.defrag.app',
    releaseCommand: 'pnpm production:release:oauth',
    outputJson: join(process.cwd(), '.tmp', 'release-evidence.json'),
    outputMarkdown: join(process.cwd(), '.tmp', 'release-evidence.md'),
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--mode' && args[i + 1]) options.mode = args[++i];
    else if (arg === '--target-ref' && args[i + 1]) options.targetRef = args[++i];
    else if (arg === '--target-surface' && args[i + 1]) options.targetSurface = args[++i];
    else if (arg === '--release-command' && args[i + 1]) options.releaseCommand = args[++i];
    else if (arg === '--output-json' && args[i + 1]) options.outputJson = args[++i];
    else if (arg === '--output-markdown' && args[i + 1]) options.outputMarkdown = args[++i];
  }

  if (!['verification-only', 'release-preparation', 'production-release'].includes(options.mode)) {
    console.error(`Invalid mode: ${options.mode}. Must be one of: verification-only, release-preparation, production-release`);
    process.exit(1);
  }

  return options;
}

function runCmd(command, options = {}) {
  try {
    const output = execSync(command, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return { success: true, output: output ? output.trim() : '' };
  } catch (err) {
    return { success: false, output: err.stdout || err.stderr || err.message, exitCode: err.status || 1 };
  }
}

async function auditVisualQa(distDir) {
  const PORT = 4173;
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.woff2': 'font/woff2',
  };

  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const urlPath = req.url.split('?')[0];
      let targetPath = join(distDir, urlPath);
      if (urlPath.endsWith('/')) targetPath = join(targetPath, 'index.html');
      if (!existsSync(targetPath) && !extname(targetPath) && existsSync(`${targetPath}.html`)) {
        targetPath = `${targetPath}.html`;
      }
      if (!existsSync(targetPath)) targetPath = join(distDir, 'index.html');
      const ext = extname(targetPath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      try {
        const content = readFileSync(targetPath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch (e) {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(PORT, async () => {
      const routes = ['/', '/workspace.html', '/how-it-works.html', '/faq.html', '/security.html'];
      const viewports = [
        { name: 'desktop', width: 1440, height: 900 },
        { name: 'mobile', width: 390, height: 844 },
      ];
      const results = { desktopOverflow: 0, mobileOverflow: 0, routesAudited: routes.length, details: [] };
      let browser;

      try {
        browser = await chromium.launch();
        for (const vp of viewports) {
          const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
          const page = await context.newPage();
          for (const route of routes) {
            await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
            const hasOverflow = await page.evaluate(() => {
              return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });
            results.details.push({ viewport: vp.name, route, hasOverflow });
            if (hasOverflow) {
              if (vp.name === 'desktop') results.desktopOverflow++;
              if (vp.name === 'mobile') results.mobileOverflow++;
            }
          }
          await context.close();
        }
      } catch (err) {
        console.error('Visual QA error:', err.message);
        results.error = err.message;
      } finally {
        if (browser) await browser.close();
        server.close(() => resolve(results));
      }
    });
  });
}

async function main() {
  const options = parseArgs();
  console.log(`\n==================================================`);
  console.log(`SOVEREIGN.OS RELEASE VERIFIER`);
  console.log(`Mode: ${options.mode}`);
  console.log(`Target Ref: ${options.targetRef}`);
  console.log(`Target Surface: ${options.targetSurface}`);
  console.log(`==================================================\n`);

  const evidence = {
    timestamp: new Date().toISOString(),
    mode: options.mode,
    targetRef: options.targetRef,
    commitSha: null,
    originMainSha: null,
    workingTreeClean: null,
    copyLeaks: { passed: true, details: [] },
    cssIntegrity: { importPrecedenceValid: false },
    verificationGates: {
      typecheck: false,
      build: false,
      test: false,
      verifyFoundation: false,
      verifyCloudflareBuild: false,
    },
    visualQa: {
      passed: false,
      desktopOverflow: 0,
      mobileOverflow: 0,
      routesAudited: 0,
    },
    deployment: {
      executed: false,
      liveTarget: options.targetSurface,
      readyStatus: null,
      liveSha: null,
      shaParity: null,
    },
    blockers: [],
    releaseDisposition: 'FAIL',
  };

  // 1. Git State & Working Tree Audit
  console.log(`[1/5] Auditing Git State & Repository Hygiene...`);
  const headShaRes = runCmd('git rev-parse HEAD', { silent: true });
  evidence.commitSha = headShaRes.success ? headShaRes.output : 'UNKNOWN';

  const originMainRes = runCmd('git rev-parse origin/main', { silent: true });
  evidence.originMainSha = originMainRes.success ? originMainRes.output : 'UNKNOWN';

  const statusRes = runCmd('git status --porcelain', { silent: true });
  evidence.workingTreeClean = statusRes.success && statusRes.output.length === 0;
  console.log(`  - Commit SHA: ${evidence.commitSha}`);
  console.log(`  - origin/main SHA: ${evidence.originMainSha}`);
  console.log(`  - Working Tree Clean: ${evidence.workingTreeClean}`);

  if (options.mode === 'verification-only' && !evidence.workingTreeClean) {
    console.log(`  ! Note: Working tree is dirty in verification-only mode. No changes will be mutated.`);
  }

  // 2. Copy Leak & CSS Authority Audit
  console.log(`\n[2/5] Auditing Public Contract Copy & CSS Precedence...`);
  const mainTsxPath = join(process.cwd(), 'apps', 'web', 'src', 'main.tsx');
  if (existsSync(mainTsxPath)) {
    const mainTsx = readFileSync(mainTsxPath, 'utf-8');
    const imports = [
      "import './design-system.css';",
      "import './public.css';",
      "import './workspace.css';",
      "import './styles.css';",
    ];
    let lastIdx = -1;
    let orderValid = true;
    for (const imp of imports) {
      const idx = mainTsx.indexOf(imp);
      if (idx === -1 || idx < lastIdx) {
        orderValid = false;
        break;
      }
      lastIdx = idx;
    }
    evidence.cssIntegrity.importPrecedenceValid = orderValid;
    console.log(`  - CSS Precedence Valid: ${orderValid}`);
  }

  // Check for exposed BASIS: uppercase label in App.tsx
  const appTsxPath = join(process.cwd(), 'apps', 'web', 'src', 'App.tsx');
  if (existsSync(appTsxPath)) {
    const appTsx = readFileSync(appTsxPath, 'utf-8');
    if (appTsx.includes('BASIS:')) {
      evidence.copyLeaks.passed = false;
      evidence.copyLeaks.details.push('Exposed raw BASIS: uppercase label in App.tsx');
      console.log(`  ! Copy leak detected: Exposed BASIS: uppercase label in App.tsx`);
      if (options.mode !== 'verification-only') {
        console.log(`  -> Remediating BASIS: label to Sources: in App.tsx...`);
        const remediated = appTsx.replace("BASIS:", "Sources:");
        writeFileSync(appTsxPath, remediated, 'utf-8');
        evidence.copyLeaks.remediated = true;
        evidence.copyLeaks.passed = true;
      }
    } else {
      console.log(`  - Public Copy Leak Audit: Passed (no raw BASIS: labels found)`);
    }
  }

  // 3. Verification Gates Execution
  console.log(`\n[3/5] Executing Authoritative Verification Gates...`);
  
  console.log(`  -> Running pnpm typecheck...`);
  const typecheck = runCmd('pnpm typecheck');
  evidence.verificationGates.typecheck = typecheck.success;

  console.log(`  -> Running pnpm build...`);
  const build = runCmd('pnpm build');
  evidence.verificationGates.build = build.success;

  console.log(`  -> Running pnpm test...`);
  const test = runCmd('pnpm test');
  evidence.verificationGates.test = test.success;

  console.log(`  -> Running pnpm verify:foundation...`);
  const foundation = runCmd('pnpm verify:foundation');
  evidence.verificationGates.verifyFoundation = foundation.success;

  console.log(`  -> Running pnpm verify:cloudflare-build...`);
  const cfBuild = runCmd('pnpm verify:cloudflare-build');
  evidence.verificationGates.verifyCloudflareBuild = cfBuild.success;

  const gatesAllPassed = Object.values(evidence.verificationGates).every(Boolean);
  console.log(`  - All Verification Gates Passed: ${gatesAllPassed}`);

  // 4. Visual QA Audit
  console.log(`\n[4/5] Running Multi-Viewport Visual QA (Playwright)...`);
  const distDir = join(process.cwd(), 'apps', 'web', 'dist');
  if (existsSync(distDir)) {
    const vqa = await auditVisualQa(distDir);
    evidence.visualQa.desktopOverflow = vqa.desktopOverflow;
    evidence.visualQa.mobileOverflow = vqa.mobileOverflow;
    evidence.visualQa.routesAudited = vqa.routesAudited;
    evidence.visualQa.passed = vqa.desktopOverflow === 0 && vqa.mobileOverflow === 0;
    console.log(`  - Desktop Horizontal Overflow Count: ${vqa.desktopOverflow}`);
    console.log(`  - Mobile Horizontal Overflow Count: ${vqa.mobileOverflow}`);
    console.log(`  - Visual QA Passed: ${evidence.visualQa.passed}`);
  } else {
    console.error(`  ! Web dist directory missing. Skipping visual QA.`);
  }

  // 5. Mode Handling & Deployment Verification
  console.log(`\n[5/5] Processing Mode Actions & Deployment Verification...`);
  if (options.mode === 'verification-only') {
    console.log(`  - Mode is verification-only. Zero mutations performed. Deploy skipped.`);
  } else if (options.mode === 'release-preparation' || options.mode === 'production-release') {
    console.log(`  - Staging hygiene changes...`);
    runCmd('git add -A');
    const postStatus = runCmd('git status --porcelain', { silent: true });
    if (postStatus.success && postStatus.output.length > 0) {
      console.log(`  - Committing release hygiene pass...`);
      runCmd('git commit -m "chore(release): final launch hygiene"');
      console.log(`  - Pushing to origin/main...`);
      runCmd('git push origin main');
      const newHead = runCmd('git rev-parse HEAD', { silent: true });
      if (newHead.success) evidence.commitSha = newHead.output;
    } else {
      console.log(`  - Working tree already clean. No commit needed.`);
    }

    if (options.mode === 'production-release') {
      console.log(`  -> Executing Production Release: ${options.releaseCommand}`);
      const deployRes = runCmd(options.releaseCommand);
      evidence.deployment.executed = deployRes.success;

      if (deployRes.success) {
        console.log(`  -> Querying live ready endpoint: ${options.targetSurface}/ready`);
        const readyCurl = runCmd(`curl -s ${options.targetSurface}/ready`, { silent: true });
        if (readyCurl.success) {
          try {
            const readyJson = JSON.parse(readyCurl.output);
            evidence.deployment.readyStatus = readyJson.ready === true;
            evidence.deployment.liveSha = readyJson.sha;
            evidence.deployment.shaParity = readyJson.sha === evidence.commitSha;
            console.log(`  - Live Endpoint Ready: ${evidence.deployment.readyStatus}`);
            console.log(`  - Live SHA: ${evidence.deployment.liveSha}`);
            console.log(`  - Expected SHA: ${evidence.commitSha}`);
            console.log(`  - SHA Parity: ${evidence.deployment.shaParity}`);
          } catch (e) {
            console.error(`  ! Failed to parse /ready JSON output:`, e.message);
            evidence.blockers.push(`Failed to parse /ready JSON`);
          }
        } else {
          evidence.blockers.push(`Failed to reach /ready endpoint`);
        }
      } else {
        evidence.blockers.push(`Deployment command failed or was blocked by auth`);
      }
    }
  }

  // Calculate Final Release Disposition
  const gatesPassed = Object.values(evidence.verificationGates).every(Boolean);
  const visualPassed = evidence.visualQa.passed;
  const cssValid = evidence.cssIntegrity.importPrecedenceValid;
  const copyValid = evidence.copyLeaks.passed;

  if (!gatesPassed || !visualPassed || !cssValid || !copyValid) {
    evidence.releaseDisposition = 'FAIL';
  } else if (options.mode === 'production-release' && (!evidence.deployment.executed || !evidence.deployment.shaParity)) {
    evidence.releaseDisposition = 'PASS_WITH_BLOCKER';
  } else {
    evidence.releaseDisposition = 'PASS';
  }

  console.log(`\n==================================================`);
  console.log(`FINAL RELEASE DISPOSITION: ${evidence.releaseDisposition}`);
  console.log(`==================================================\n`);

  // Write Evidence Artifacts
  try {
    const tmpDir = join(process.cwd(), '.tmp');
    if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true });

    writeFileSync(options.outputJson, JSON.stringify(evidence, null, 2), 'utf-8');
    console.log(`Saved JSON Evidence: ${options.outputJson}`);

    const mdContent = `# Sovereign.OS Release Verification Evidence

- **Mode**: \`${evidence.mode}\`
- **Disposition**: **\`${evidence.releaseDisposition}\`**
- **Calculated Commit SHA**: \`${evidence.commitSha}\`
- **origin/main SHA**: \`${evidence.originMainSha}\`
- **Working Tree Clean**: \`${evidence.workingTreeClean}\`

## Verification Gates
- TypeScript: \`${evidence.verificationGates.typecheck ? 'PASS' : 'FAIL'}\`
- Web & Worker Build: \`${evidence.verificationGates.build ? 'PASS' : 'FAIL'}\`
- Test Suite: \`${evidence.verificationGates.test ? 'PASS' : 'FAIL'}\`
- Foundation Gate: \`${evidence.verificationGates.verifyFoundation ? 'PASS' : 'FAIL'}\`
- Cloudflare Build Gate: \`${evidence.verificationGates.verifyCloudflareBuild ? 'PASS' : 'FAIL'}\`

## Visual QA Audit (Playwright)
- Audited Routes: \`${evidence.visualQa.routesAudited}\`
- Desktop Horizontal Overflow (1440x900): \`${evidence.visualQa.desktopOverflow}\`
- Mobile Horizontal Overflow (390x844): \`${evidence.visualQa.mobileOverflow}\`
- Visual QA Status: \`${evidence.visualQa.passed ? 'PASS' : 'FAIL'}\`

## Deployment & SHA Parity
- Executed Deployment: \`${evidence.deployment.executed}\`
- Live Ready Status: \`${evidence.deployment.readyStatus}\`
- Live SHA: \`${evidence.deployment.liveSha}\`
- Expected SHA: \`${evidence.commitSha}\`
- SHA Parity: \`${evidence.deployment.shaParity}\`

## Blockers
${evidence.blockers.length === 0 ? '- None' : evidence.blockers.map(b => `- ${b}`).join('\n')}
`;
    writeFileSync(options.outputMarkdown, mdContent, 'utf-8');
    console.log(`Saved Markdown Evidence: ${options.outputMarkdown}\n`);
  } catch (err) {
    console.error(`Failed to write evidence files:`, err.message);
  }

  if (evidence.releaseDisposition === 'FAIL') {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
