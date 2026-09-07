import { DEFAULT_POST_DEPLOY_CHECKS, orchestrateRelease } from './release-orchestrator.mjs';

const TEXT_FIRST_POST_DEPLOY_CHECKS = DEFAULT_POST_DEPLOY_CHECKS.filter((check) => check.browserRun !== true);

if (TEXT_FIRST_POST_DEPLOY_CHECKS.some((check) => check.browserRun === true)) {
  throw new Error('Text-first release must not execute Browser Rendering checks');
}

const requiredChecks = ['verify-runtime-v3', 'verify-secondary-public'];
for (const label of requiredChecks) {
  if (!TEXT_FIRST_POST_DEPLOY_CHECKS.some((check) => check.label === label)) {
    throw new Error(`Text-first production release is missing required live check ${label}`);
  }
}

const defaultAccountId = '8b1954d216d65077c6480d62583fe2c2';
if (!process.env.CLOUDFLARE_ACCOUNT_ID && !process.env.CF_ACCOUNT_ID) {
  process.env.CLOUDFLARE_ACCOUNT_ID = defaultAccountId;
  process.env.CF_ACCOUNT_ID = defaultAccountId;
}
process.env.VITE_TURNSTILE_SITE_KEY = process.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAADhGIF8-iOLIg8MU';

let apiToken = String(process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN || '').trim();
if (!apiToken) {
  try {
    const { spawnSync } = await import('node:child_process');
    const authResult = spawnSync('pnpm', ['--filter', './apps/worker', 'exec', 'wrangler', 'auth', 'token', '--json'], { encoding: 'utf8' });
    if (authResult.status === 0 && authResult.stdout) {
      const parsed = JSON.parse(authResult.stdout);
      if (parsed?.token) {
        apiToken = parsed.token;
        process.env.CLOUDFLARE_API_TOKEN = apiToken;
      }
    }
  } catch {}
}
if (!apiToken) throw new Error('Text-first production release failed: CLOUDFLARE_API_TOKEN is required');

const result = await orchestrateRelease({
  postDeployChecks: TEXT_FIRST_POST_DEPLOY_CHECKS
});

console.log(JSON.stringify(result, null, 2));
if (result.status !== 'success') process.exitCode = 1;
