#!/usr/bin/env node

import { runVerifier } from './release-verifier.mjs';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

async function runSelfTests() {
  console.log(`==================================================`);
  console.log(`SOVEREIGN.OS RELEASE VERIFIER BEHAVIORAL SELF-TESTS`);
  console.log(`==================================================\n`);

  let testCount = 0;
  let passedCount = 0;

  async function assertTest(name, fn) {
    testCount++;
    try {
      console.log(`[TEST ${testCount}/8] ${name}...`);
      await fn();
      passedCount++;
      console.log(`  ✓ PASS\n`);
    } catch (err) {
      console.error(`  ✗ FAIL: ${err.message}\n`);
    }
  }

  // 1. Clean repository → PASS
  await assertTest('Clean repository in verification-only mode returns PASS', async () => {
    const evidence = await runVerifier({ mode: 'verification-only', silent: true });
    if (evidence.releaseDisposition !== 'PASS') {
      throw new Error(`Expected disposition PASS, got ${evidence.releaseDisposition}`);
    }
  });

  // 2. HEAD/origin-main drift → FAIL
  await assertTest('Git drift (HEAD !== origin/main) forces disposition FAIL', async () => {
    const mockRunCmd = (cmd) => {
      if (cmd.includes('rev-parse HEAD')) return { success: true, output: 'sha-head-1111' };
      if (cmd.includes('rev-parse origin/main')) return { success: true, output: 'sha-main-9999' };
      if (cmd.includes('status --porcelain')) return { success: true, output: '' };
      if (cmd.includes('diff --name-only')) return { success: true, output: '' };
      return { success: true, output: '' };
    };

    const evidence = await runVerifier({ mode: 'verification-only', silent: true, skipDiskWrite: true }, { runCmd: mockRunCmd });
    if (evidence.git.shaParity !== false) throw new Error('Expected shaParity to be false on drift');
    if (evidence.releaseDisposition !== 'FAIL') throw new Error(`Expected disposition FAIL on git drift, got ${evidence.releaseDisposition}`);
  });

  // 3. Protected-path mutation → FAIL
  await assertTest('Diff Guard rejects protected-path modifications with FAIL', async () => {
    const mockRunCmd = (cmd) => {
      if (cmd.includes('rev-parse HEAD')) return { success: true, output: 'sha-same-1234' };
      if (cmd.includes('rev-parse origin/main')) return { success: true, output: 'sha-same-1234' };
      if (cmd.includes('diff --name-only')) return { success: true, output: 'apps/worker/src/index.ts' };
      return { success: true, output: '' };
    };

    const evidence = await runVerifier({ mode: 'verification-only', silent: true, skipDiskWrite: true }, { runCmd: mockRunCmd });
    if (evidence.diffGuard.passed !== false) throw new Error('Expected diffGuard.passed to be false');
    if (!evidence.diffGuard.protectedPathsViolated.includes('apps/worker/src/index.ts')) {
      throw new Error('Expected apps/worker/src/index.ts in protectedPathsViolated');
    }
    if (evidence.releaseDisposition !== 'FAIL') throw new Error(`Expected disposition FAIL on diff guard, got ${evidence.releaseDisposition}`);
  });

  // 4. Unrelated pre-existing changes are never staged
  await assertTest('Constrained staging model never uses git add -A or stages unrelated files', async () => {
    const stagedCommands = [];
    const mockRunCmd = (cmd) => {
      if (cmd.startsWith('git add')) stagedCommands.push(cmd);
      if (cmd.includes('rev-parse HEAD')) return { success: true, output: 'sha-same-1234' };
      if (cmd.includes('rev-parse origin/main')) return { success: true, output: 'sha-same-1234' };
      return { success: true, output: '' };
    };

    await runVerifier({ mode: 'release-preparation', silent: true, skipDiskWrite: true }, { runCmd: mockRunCmd });
    for (const cmd of stagedCommands) {
      if (cmd.includes('git add -A') || cmd.includes('git add .')) {
        throw new Error(`Unconstrained staging detected: ${cmd}`);
      }
    }
  });

  // 5. verification-only is non-mutating
  await assertTest('verification-only mode guarantees zero source and working tree mutations', async () => {
    const evidence = await runVerifier({ mode: 'verification-only', silent: true });
    if (evidence.mutationAudit.sourceTreeChanged) {
      throw new Error('verification-only mode mutated source tree!');
    }
    if (evidence.mutationAudit.workingTreeChanged) {
      throw new Error('verification-only mode mutated working tree!');
    }
  });

  // 6. Visual overflow → FAIL
  await assertTest('Visual QA horizontal overflow forces disposition FAIL', async () => {
    const mockRunCmd = (cmd) => {
      if (cmd.includes('rev-parse HEAD')) return { success: true, output: 'sha-same-1234' };
      if (cmd.includes('rev-parse origin/main')) return { success: true, output: 'sha-same-1234' };
      return { success: true, output: '' };
    };

    const mockAuditVisualQa = async () => ({
      desktopOverflow: 1,
      mobileOverflow: 0,
      consoleErrors: [],
      missingRoutes: [],
      routesAudited: 5,
    });

    const evidence = await runVerifier(
      { mode: 'verification-only', silent: true, skipDiskWrite: true },
      { runCmd: mockRunCmd, auditVisualQa: mockAuditVisualQa }
    );

    if (evidence.visualQa.passed !== false) throw new Error('Expected visualQa.passed to be false');
    if (evidence.releaseDisposition !== 'FAIL') throw new Error(`Expected disposition FAIL on visual overflow, got ${evidence.releaseDisposition}`);
  });

  // 7. Deployment externally blocked → PASS_WITH_BLOCKER
  await assertTest('Blocked production deployment returns PASS_WITH_BLOCKER when preflight passes', async () => {
    const mockRunCmd = (cmd) => {
      if (cmd.includes('rev-parse HEAD')) return { success: true, output: 'sha-same-1234' };
      if (cmd.includes('rev-parse origin/main')) return { success: true, output: 'sha-same-1234' };
      if (cmd.includes('production:release:oauth')) return { success: false, output: 'Auth failed: OAuth token expired' };
      return { success: true, output: '' };
    };

    const mockAuditVisualQa = async () => ({
      desktopOverflow: 0,
      mobileOverflow: 0,
      consoleErrors: [],
      missingRoutes: [],
      routesAudited: 5,
    });

    const evidence = await runVerifier(
      { mode: 'production-release', silent: true, skipDiskWrite: true },
      { runCmd: mockRunCmd, auditVisualQa: mockAuditVisualQa }
    );

    if (evidence.deployment.executed !== false) throw new Error('Expected deployment.executed to be false');
    if (evidence.releaseDisposition !== 'PASS_WITH_BLOCKER') {
      throw new Error(`Expected disposition PASS_WITH_BLOCKER, got ${evidence.releaseDisposition}`);
    }
  });

  // 8. Required verification gate failure → FAIL
  await assertTest('Failed verification gate (e.g. typecheck) forces disposition FAIL (never PASS_WITH_BLOCKER)', async () => {
    const mockRunCmd = (cmd) => {
      if (cmd.includes('typecheck')) return { success: false, output: 'TypeScript Error TS2322' };
      if (cmd.includes('rev-parse HEAD')) return { success: true, output: 'sha-same-1234' };
      if (cmd.includes('rev-parse origin/main')) return { success: true, output: 'sha-same-1234' };
      return { success: true, output: '' };
    };

    const mockAuditVisualQa = async () => ({
      desktopOverflow: 0,
      mobileOverflow: 0,
      consoleErrors: [],
      missingRoutes: [],
      routesAudited: 5,
    });

    const evidence = await runVerifier(
      { mode: 'production-release', silent: true, skipDiskWrite: true },
      { runCmd: mockRunCmd, auditVisualQa: mockAuditVisualQa }
    );

    if (evidence.verificationGates.typecheck !== false) throw new Error('Expected typecheck gate to be false');
    if (evidence.releaseDisposition !== 'FAIL') {
      throw new Error(`Expected disposition FAIL on gate failure, got ${evidence.releaseDisposition}`);
    }
  });

  console.log(`==================================================`);
  console.log(`VERIFIER BEHAVIORAL SELF-TEST RESULTS: ${passedCount}/${testCount} Passed`);
  console.log(`==================================================\n`);

  if (passedCount !== testCount) {
    process.exit(1);
  }
}

runSelfTests().catch((err) => {
  console.error('Self-test fatal error:', err);
  process.exit(1);
});
