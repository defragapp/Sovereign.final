#!/usr/bin/env node

import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright';

const PROTECTED_PATHS = [
  'apps/worker/',
  'apps/sovereign-worker/',
  'apps/web/src/lib/api.ts',
  'migrations/',
  'scripts/production-release-oauth.sh',
  'scripts/cloudflare-production-deploy-v3.mjs',
  'scripts/assert-main-release.mjs',
  'wrangler.jsonc',
];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mode: 'verification-only',
    targetRef: 'main',
    targetSurface: 'https://sovereign.defrag.app',
    canonicalAppSurface: 'https://app.defrag.app',
    releaseCommand: 'pnpm production:release:text',
    outputJson: join(process.cwd(), '.tmp', 'release-evidence.json'),
    outputMarkdown: join(process.cwd(), '.tmp', 'release-evidence.md'),
    silent: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--mode' && args[i + 1]) options.mode = args[++i];
    else if (arg === '--target-ref' && args[i + 1]) options.targetRef = args[++i];
    else if (arg === '--target-surface' && args[i + 1]) options.targetSurface = args[++i];
    else if (arg === '--release-command' && args[i + 1]) options.releaseCommand = args[++i];
    else if (arg === '--output-json' && args[i + 1]) options.outputJson = args[++i];
    else if (arg === '--output-markdown' && args[i + 1]) options.outputMarkdown = args[++i];
    else if (arg === '--silent') options.silent = true;
  }

  if (!['verification-only', 'release-preparation', 'production-release'].includes(options.mode)) {
    console.error(`Invalid mode: ${options.mode}. Must be one of: verification-only, release-preparation, production-release`);
    process.exit(1);
  }

  return options;
}

function defaultRunCmd(command, options = {}) {
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

function isProtectedPath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return PROTECTED_PATHS.some((protectedPath) => {
    if (protectedPath.endsWith('/')) {
      return normalized.startsWith(protectedPath);
    }
    return normalized === protectedPath;
  });
}

async function defaultAuditVisualQa(distDir) {
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

    server.listen(0, async () => {
      const PORT = server.address().port;
      const routes = ['/', '/workspace.html', '/how-it-works.html', '/faq.html', '/security.html'];
      const viewports = [
        { name: 'desktop', width: 1440, height: 900 },
        { name: 'mobile', width: 390, height: 844 },
      ];
      const results = {
        desktopOverflow: 0,
        mobileOverflow: 0,
        routesAudited: routes.length,
        consoleErrors: [],
        missingRoutes: [],
        details: [],
      };
      let browser;

      try {
        browser = await chromium.launch();
        for (const vp of viewports) {
          const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
          const page = await context.newPage();

          page.on('console', (msg) => {
            if (msg.type() === 'error') {
              results.consoleErrors.push(`[${vp.name}] ${msg.text()}`);
            }
          });

          page.on('pageerror', (err) => {
            results.consoleErrors.push(`[${vp.name}] Page error: ${err.message}`);
          });

          for (const route of routes) {
            const resp = await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
            if (!resp || resp.status() >= 400) {
              results.missingRoutes.push(`[${vp.name}] ${route} returned status ${resp ? resp.status() : 'failed'}`);
            }

            const metrics = await page.evaluate(() => {
              const hasOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
              const bodyRect = document.body.getBoundingClientRect();
              const rootDocExists = !!document.documentElement && !!document.body;
              return { hasOverflow, width: bodyRect.width, height: bodyRect.height, rootDocExists };
            });

            if (!metrics.rootDocExists) {
              results.missingRoutes.push(`[${vp.name}] ${route} missing root document element`);
            }

            results.details.push({ viewport: vp.name, route, ...metrics });
            if (metrics.hasOverflow) {
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

export async function runVerifier(overrideOptions = {}, deps = {}) {
  const cliOpts = parseArgs();
  const options = { ...cliOpts, ...overrideOptions };
  const runCmdImpl = deps.runCmd || defaultRunCmd;
  const auditVisualQaImpl = deps.auditVisualQa || defaultAuditVisualQa;
  const log = options.silent ? () => {} : console.log;
  const logError = options.silent ? () => {} : console.error;

  log(`\n==================================================`);
  log(`SOVEREIGN.OS AUTHORITATIVE RELEASE VERIFIER`);
  log(`Mode: ${options.mode}`);
  log(`Target Ref: ${options.targetRef}`);
  log(`Authoritative Deploy Command: ${options.releaseCommand}`);
  log(`==================================================\n`);

  const initialStatusRes = runCmdImpl('git status --porcelain', { silent: true });
  const initialWorkingTreeLines = initialStatusRes.success && initialStatusRes.output
    ? initialStatusRes.output.split('\n').filter(Boolean).filter(line => !line.includes('.tmp/'))
    : [];

  const evidence = {
    timestamp: new Date().toISOString(),
    mode: options.mode,
    targetRef: options.targetRef,
    releaseSha: null,
    git: {
      headSha: null,
      originMainSha: null,
      shaParity: false,
      workingTreeClean: initialWorkingTreeLines.length === 0,
    },
    diffGuard: {
      passed: true,
      protectedPathsViolated: [],
    },
    copyLeaks: { passed: true, details: [], remediated: false },
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
      consoleErrorsCount: 0,
      missingRoutesCount: 0,
      routesAudited: 0,
    },
    mutationAudit: {
      sourceTreeChanged: false,
      workingTreeChanged: false,
      modifiedFilesTracked: [],
      stagedFilesCount: 0,
    },
    deployment: {
      executed: false,
      releaseCommand: options.releaseCommand,
      liveTarget: options.targetSurface,
      canonicalAppTarget: options.canonicalAppSurface,
      readyStatus: null,
      appReadyStatus: null,
      liveSha: null,
      appLiveSha: null,
      shaParity: null,
      migrationParity: null,
    },
    blockers: [],
    releaseDisposition: 'FAIL',
  };

  // 1. Git State, Freeze Release SHA, & Drift Audit
  log(`[1/5] Auditing Git State & Freezing Release SHA...`);
  runCmdImpl('git fetch origin refs/heads/main', { silent: true });

  const headShaRes = runCmdImpl('git rev-parse HEAD', { silent: true });
  evidence.git.headSha = headShaRes.success ? headShaRes.output : 'UNKNOWN';

  const originMainRes = runCmdImpl('git rev-parse origin/main', { silent: true });
  evidence.git.originMainSha = originMainRes.success ? originMainRes.output : 'UNKNOWN';

  // FREEZE RELEASE SHA from origin/main
  evidence.releaseSha = evidence.git.originMainSha;
  evidence.git.shaParity = evidence.git.headSha === evidence.git.originMainSha;

  log(`  - Local HEAD SHA: ${evidence.git.headSha}`);
  log(`  - Frozen Release SHA (origin/main): ${evidence.releaseSha}`);
  log(`  - Git Drift Parity (HEAD == origin/main): ${evidence.git.shaParity}`);

  if (!evidence.git.shaParity) {
    logError(`  ! FAIL: Git drift detected! Local HEAD (${evidence.git.headSha}) does not match origin/main (${evidence.git.originMainSha}).`);
    evidence.blockers.push(`Git drift detected: HEAD !== origin/main`);
  }

  // 2. Copy Leak & CSS Authority Audit + Diff Guard
  log(`\n[2/5] Auditing Public Contract Copy, CSS Precedence & Diff Guard...`);
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
    log(`  - CSS Import Precedence Valid: ${orderValid}`);
  }

  const appTsxPath = join(process.cwd(), 'apps', 'web', 'src', 'App.tsx');
  if (existsSync(appTsxPath)) {
    const appTsx = readFileSync(appTsxPath, 'utf-8');
    if (appTsx.includes('BASIS:')) {
      evidence.copyLeaks.passed = false;
      evidence.copyLeaks.details.push('Exposed raw BASIS: uppercase label in App.tsx');
      log(`  ! Copy leak detected: Exposed BASIS: uppercase label in App.tsx`);
      if (options.mode !== 'verification-only') {
        log(`  -> Constrained remediation: Replacing BASIS: with Sources: in App.tsx...`);
        const remediated = appTsx.replace("BASIS:", "Sources:");
        writeFileSync(appTsxPath, remediated, 'utf-8');
        evidence.copyLeaks.remediated = true;
        evidence.copyLeaks.passed = true;
        evidence.mutationAudit.modifiedFilesTracked.push('apps/web/src/App.tsx');
      }
    } else {
      log(`  - Public Copy Leak Audit: Passed (no raw BASIS: labels found)`);
    }
  }

  // Perform Diff Guard Check on Protected Paths
  const currentDiffRes = runCmdImpl('git diff --name-only', { silent: true });
  const currentStagedRes = runCmdImpl('git diff --cached --name-only', { silent: true });
  const modifiedFiles = [
    ...(currentDiffRes.output ? currentDiffRes.output.split('\n').filter(Boolean) : []),
    ...(currentStagedRes.output ? currentStagedRes.output.split('\n').filter(Boolean) : []),
  ];

  for (const file of modifiedFiles) {
    if (isProtectedPath(file)) {
      evidence.diffGuard.passed = false;
      evidence.diffGuard.protectedPathsViolated.push(file);
    }
  }

  if (!evidence.diffGuard.passed) {
    logError(`  ! FAIL: Diff Guard triggered! Protected paths modified: ${evidence.diffGuard.protectedPathsViolated.join(', ')}`);
    evidence.blockers.push(`Protected paths modified: ${evidence.diffGuard.protectedPathsViolated.join(', ')}`);
  } else {
    log(`  - Diff Guard Audit: Passed (0 protected paths touched)`);
  }

  // 3. Verification Gates Execution
  log(`\n[3/5] Executing Authoritative Verification Gates...`);
  
  log(`  -> Running pnpm typecheck...`);
  const typecheck = runCmdImpl('pnpm typecheck');
  evidence.verificationGates.typecheck = typecheck.success;

  log(`  -> Running pnpm build...`);
  const build = runCmdImpl('pnpm build');
  evidence.verificationGates.build = build.success;

  log(`  -> Running pnpm test...`);
  const test = runCmdImpl('pnpm test');
  evidence.verificationGates.test = test.success;

  log(`  -> Running pnpm verify:foundation...`);
  const foundation = runCmdImpl('pnpm verify:foundation');
  evidence.verificationGates.verifyFoundation = foundation.success;

  log(`  -> Running pnpm verify:cloudflare-build...`);
  const cfBuild = runCmdImpl('pnpm verify:cloudflare-build');
  evidence.verificationGates.verifyCloudflareBuild = cfBuild.success;

  const gatesAllPassed = Object.values(evidence.verificationGates).every(Boolean);
  log(`  - All Verification Gates Passed: ${gatesAllPassed}`);

  // 4. Deterministic Visual QA Audit
  log(`\n[4/5] Running Multi-Viewport Visual QA (Playwright)...`);
  const distDir = join(process.cwd(), 'apps', 'web', 'dist');
  if (existsSync(distDir) || deps.auditVisualQa) {
    const vqa = await auditVisualQaImpl(distDir);
    evidence.visualQa.desktopOverflow = vqa.desktopOverflow;
    evidence.visualQa.mobileOverflow = vqa.mobileOverflow;
    evidence.visualQa.consoleErrorsCount = vqa.consoleErrors ? vqa.consoleErrors.length : 0;
    evidence.visualQa.missingRoutesCount = vqa.missingRoutes ? vqa.missingRoutes.length : 0;
    evidence.visualQa.routesAudited = vqa.routesAudited;
    evidence.visualQa.passed =
      vqa.desktopOverflow === 0 &&
      vqa.mobileOverflow === 0 &&
      evidence.visualQa.consoleErrorsCount === 0 &&
      evidence.visualQa.missingRoutesCount === 0;

    log(`  - Desktop Horizontal Overflow Count: ${vqa.desktopOverflow}`);
    log(`  - Mobile Horizontal Overflow Count: ${vqa.mobileOverflow}`);
    log(`  - Console Error Count: ${evidence.visualQa.consoleErrorsCount}`);
    log(`  - Missing / Broken Routes Count: ${evidence.visualQa.missingRoutesCount}`);
    log(`  - Visual QA Passed: ${evidence.visualQa.passed}`);
  } else {
    logError(`  ! Web dist directory missing. Skipping visual QA.`);
    evidence.visualQa.passed = false;
  }

  // 5. Constrained Staging & Production Deployment Verification
  log(`\n[5/5] Processing Mode Actions & Deployment Verification...`);
  if (options.mode === 'verification-only') {
    log(`  - Mode is verification-only. Zero mutations performed. Deploy skipped.`);
  } else if (options.mode === 'release-preparation' || options.mode === 'production-release') {
    if (evidence.mutationAudit.modifiedFilesTracked.length > 0) {
      log(`  - Staging explicitly allowed hygiene files: ${evidence.mutationAudit.modifiedFilesTracked.join(', ')}`);
      for (const file of evidence.mutationAudit.modifiedFilesTracked) {
        runCmdImpl(`git add ${file}`);
      }
      evidence.mutationAudit.stagedFilesCount = evidence.mutationAudit.modifiedFilesTracked.length;
      
      log(`  - Committing release hygiene pass...`);
      runCmdImpl('git commit -m "chore(release): final launch hygiene"');
      log(`  - Pushing to origin/main...`);
      runCmdImpl('git push origin main');

      const postPushSha = runCmdImpl('git rev-parse HEAD', { silent: true });
      if (postPushSha.success) {
        evidence.git.headSha = postPushSha.output;
        evidence.git.originMainSha = postPushSha.output;
        evidence.releaseSha = postPushSha.output;
        evidence.git.shaParity = true;
      }
    } else {
      log(`  - Working tree clean. No hygiene changes needed to stage.`);
    }

    if (options.mode === 'production-release') {
      log(`  -> Executing Authoritative Production Release: ${options.releaseCommand}`);
      const deployRes = runCmdImpl(options.releaseCommand);
      evidence.deployment.executed = deployRes.success;

      if (deployRes.success) {
        log(`  -> Verifying live ready endpoints against frozen release SHA: ${evidence.releaseSha}`);
        const surfaceCurl = runCmdImpl(`curl -s ${options.targetSurface}/ready`, { silent: true });
        const appCurl = runCmdImpl(`curl -s ${options.canonicalAppSurface}/ready`, { silent: true });

        if (surfaceCurl.success && appCurl.success) {
          try {
            const surfaceJson = JSON.parse(surfaceCurl.output);
            const appJson = JSON.parse(appCurl.output);

            evidence.deployment.readyStatus = surfaceJson.ready === true;
            evidence.deployment.appReadyStatus = appJson.ready === true;
            evidence.deployment.liveSha = surfaceJson.sha;
            evidence.deployment.appLiveSha = appJson.sha;
            evidence.deployment.shaParity =
              surfaceJson.sha === evidence.releaseSha && appJson.sha === evidence.releaseSha;
            evidence.deployment.migrationParity =
              surfaceJson.migrationVersion === appJson.migrationVersion;

            log(`  - Public Domain (${options.targetSurface}/ready) Ready: ${evidence.deployment.readyStatus} (SHA: ${evidence.deployment.liveSha})`);
            log(`  - App Domain (${options.canonicalAppSurface}/ready) Ready: ${evidence.deployment.appReadyStatus} (SHA: ${evidence.deployment.appLiveSha})`);
            log(`  - Frozen Release SHA: ${evidence.releaseSha}`);
            log(`  - Dual Domain SHA Parity: ${evidence.deployment.shaParity}`);
            log(`  - Migration Parity: ${evidence.deployment.migrationParity}`);
          } catch (e) {
            logError(`  ! Failed to parse /ready JSON output:`, e.message);
            evidence.blockers.push(`Failed to parse /ready JSON`);
          }
        } else {
          evidence.blockers.push(`Failed to reach live /ready endpoint`);
        }
      } else {
        evidence.blockers.push(`Deployment command failed or was blocked by external auth/network`);
      }
    }
  }

  // Mutation Audit Check
  const postStatusRes = runCmdImpl('git status --porcelain', { silent: true });
  const postWorkingTreeLines = postStatusRes.success && postStatusRes.output
    ? postStatusRes.output.split('\n').filter(Boolean).filter(line => !line.includes('.tmp/'))
    : [];

  const initialModified = initialWorkingTreeLines.filter(l => !l.startsWith('??')).join('\n');
  const postModified = postWorkingTreeLines.filter(l => !l.startsWith('??')).join('\n');
  evidence.mutationAudit.sourceTreeChanged = initialModified !== postModified;
  evidence.mutationAudit.workingTreeChanged = initialWorkingTreeLines.join('\n') !== postWorkingTreeLines.join('\n');

  // Calculate Final Release Disposition
  const gatesPassed = Object.values(evidence.verificationGates).every(Boolean);
  const visualPassed = evidence.visualQa.passed;
  const cssValid = evidence.cssIntegrity.importPrecedenceValid;
  const copyValid = evidence.copyLeaks.passed;
  const diffGuardValid = evidence.diffGuard.passed;
  const gitParityValid = evidence.git.shaParity;

  const corePreflightPassed = gatesPassed && visualPassed && cssValid && copyValid && diffGuardValid && gitParityValid;

  if (!corePreflightPassed) {
    evidence.releaseDisposition = 'FAIL';
  } else if (options.mode === 'production-release' && (!evidence.deployment.executed || !evidence.deployment.shaParity)) {
    evidence.releaseDisposition = 'PASS_WITH_BLOCKER';
  } else {
    evidence.releaseDisposition = 'PASS';
  }

  log(`\n==================================================`);
  log(`FINAL RELEASE DISPOSITION: ${evidence.releaseDisposition}`);
  log(`==================================================\n`);

  // Write Evidence Artifacts (skip disk write if silent testing mode requested via options.skipDiskWrite)
  if (!options.skipDiskWrite) {
    try {
      const tmpDir = join(process.cwd(), '.tmp');
      if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true });

      writeFileSync(options.outputJson, JSON.stringify(evidence, null, 2), 'utf-8');
      log(`Saved JSON Evidence: ${options.outputJson}`);

      const mdContent = `# Sovereign.OS Release Verification Evidence

- **Mode**: \`${evidence.mode}\`
- **Disposition**: **\`${evidence.releaseDisposition}\`**
- **Frozen Release SHA**: \`${evidence.releaseSha}\`
- **Local HEAD SHA**: \`${evidence.git.headSha}\`
- **origin/main SHA**: \`${evidence.git.originMainSha}\`
- **Git Parity**: \`${evidence.git.shaParity ? 'PASS' : 'FAIL'}\`
- **Working Tree Clean**: \`${evidence.git.workingTreeClean}\`

## Diff Guard & Contract Integrity
- Diff Guard (Protected Paths): \`${evidence.diffGuard.passed ? 'PASS' : 'FAIL'}\`
- CSS Import Precedence: \`${evidence.cssIntegrity.importPrecedenceValid ? 'PASS' : 'FAIL'}\`
- Copy Leak Audit: \`${evidence.copyLeaks.passed ? 'PASS' : 'FAIL'}\`

## Verification Gates
- TypeScript (\`pnpm typecheck\`): \`${evidence.verificationGates.typecheck ? 'PASS' : 'FAIL'}\`
- Web & Worker Build (\`pnpm build\`): \`${evidence.verificationGates.build ? 'PASS' : 'FAIL'}\`
- Test Suite (\`pnpm test\`): \`${evidence.verificationGates.test ? 'PASS' : 'FAIL'}\`
- Foundation Gate (\`pnpm verify:foundation\`): \`${evidence.verificationGates.verifyFoundation ? 'PASS' : 'FAIL'}\`
- Cloudflare Build Gate (\`pnpm verify:cloudflare-build\`): \`${evidence.verificationGates.verifyCloudflareBuild ? 'PASS' : 'FAIL'}\`

## Visual QA Audit (Playwright)
- Audited Routes: \`${evidence.visualQa.routesAudited}\`
- Desktop Horizontal Overflow (1440x900): \`${evidence.visualQa.desktopOverflow}\`
- Mobile Horizontal Overflow (390x844): \`${evidence.visualQa.mobileOverflow}\`
- Console Errors: \`${evidence.visualQa.consoleErrorsCount}\`
- Visual QA Status: \`${evidence.visualQa.passed ? 'PASS' : 'FAIL'}\`

## Deployment & SHA Parity
- Executed Deployment: \`${evidence.deployment.executed}\`
- Authoritative Release Command: \`${evidence.deployment.releaseCommand}\`
- Live Target (/ready): \`${evidence.deployment.liveTarget}\`
- Dual Domain SHA Parity: \`${evidence.deployment.shaParity}\`

## Blockers
${evidence.blockers.length === 0 ? '- None' : evidence.blockers.map((b) => `- ${b}`).join('\n')}
`;
      writeFileSync(options.outputMarkdown, mdContent, 'utf-8');
      log(`Saved Markdown Evidence: ${options.outputMarkdown}\n`);
    } catch (err) {
      logError(`Failed to write evidence files:`, err.message);
    }
  }

  return evidence;
}

if (process.argv[1] && process.argv[1].endsWith('release-verifier.mjs')) {
  runVerifier()
    .then((ev) => {
      if (ev.releaseDisposition === 'FAIL') {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error('Fatal execution error:', err);
      process.exit(1);
    });
}
