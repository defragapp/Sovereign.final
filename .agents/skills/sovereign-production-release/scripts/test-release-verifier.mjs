#!/usr/bin/env node

import { runVerifier } from './release-verifier.mjs';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

async function runSelfTests() {
  console.log(`==================================================`);
  console.log(`SOVEREIGN.OS RELEASE VERIFIER SELF-TEST SUITE`);
  console.log(`==================================================\n`);

  let testCount = 0;
  let passedCount = 0;

  async function assertTest(name, fn) {
    testCount++;
    try {
      console.log(`[TEST ${testCount}] ${name}...`);
      await fn();
      passedCount++;
      console.log(`  ✓ PASS\n`);
    } catch (err) {
      console.error(`  ✗ FAIL: ${err.message}\n`);
    }
  }

  // 1. Clean repository verification passes
  await assertTest('Clean repository verification-only mode returns PASS', async () => {
    const evidence = await runVerifier({ mode: 'verification-only' });
    if (evidence.releaseDisposition !== 'PASS') {
      throw new Error(`Expected disposition PASS, got ${evidence.releaseDisposition}`);
    }
    if (evidence.mutationAudit.sourceTreeChanged) {
      throw new Error(`verification-only mutated source tree!`);
    }
  });

  // 2. Diff Guard policy definition exists
  await assertTest('Diff Guard policy covers critical protected paths', async () => {
    const scriptPath = join(process.cwd(), '.agents', 'skills', 'sovereign-production-release', 'scripts', 'release-verifier.mjs');
    if (!existsSync(scriptPath)) throw new Error('release-verifier.mjs missing');
    const content = readFileSync(scriptPath, 'utf-8');
    const requiredPaths = ['apps/worker/', 'apps/web/src/lib/api.ts', 'migrations/', 'scripts/production-release-oauth.sh'];
    for (const reqP of requiredPaths) {
      if (!content.includes(reqP)) throw new Error(`Missing protected path in verifier: ${reqP}`);
    }
  });

  // 3. Verification evidence files generated
  await assertTest('Evidence JSON and Markdown files created cleanly', async () => {
    const jsonPath = join(process.cwd(), '.tmp', 'release-evidence.json');
    const mdPath = join(process.cwd(), '.tmp', 'release-evidence.md');
    if (!existsSync(jsonPath)) throw new Error(`Missing JSON evidence at ${jsonPath}`);
    if (!existsSync(mdPath)) throw new Error(`Missing Markdown evidence at ${mdPath}`);
  });

  // 4. Staging model checks
  await assertTest('Verifier uses constrained staging model (no git add -A)', async () => {
    const scriptPath = join(process.cwd(), '.agents', 'skills', 'sovereign-production-release', 'scripts', 'release-verifier.mjs');
    const content = readFileSync(scriptPath, 'utf-8');
    if (content.includes('git add -A') || content.includes('git add .')) {
      throw new Error('Unconstrained git add -A or git add . detected in release verifier');
    }
  });

  console.log(`==================================================`);
  console.log(`VERIFIER SELF-TEST RESULTS: ${passedCount}/${testCount} Passed`);
  console.log(`==================================================\n`);

  if (passedCount !== testCount) {
    process.exit(1);
  }
}

runSelfTests().catch((err) => {
  console.error('Self-test fatal error:', err);
  process.exit(1);
});
