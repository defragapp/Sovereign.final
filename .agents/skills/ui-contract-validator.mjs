import fs from 'fs';
import path from 'path';

const FORBIDDEN_TOKENS = [
  'backdrop-blur',
  'bg-gradient-to-r',
  'bg-gradient-to-l',
  'bg-gradient-to-t',
  'bg-gradient-to-b',
  'animate-spin-slow',
  'neon-glow',
];

const REQUIRED_CANONICAL_COPY = [
  "Know yourself. Understand your people. See the whole system.",
  "Sovereign.OS",
  "Baseline"
];

export function validateUIContract() {
  const webSrcDir = path.resolve(process.cwd(), 'apps/web/src');
  if (!fs.existsSync(webSrcDir)) {
    console.log('[UI Validator] apps/web/src not found, skipping.');
    return true;
  }

  let violations = [];

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.css')) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // Check for forbidden styling tokens
        FORBIDDEN_TOKENS.forEach(token => {
          if (content.includes(token)) {
            violations.push(`${fullPath}: Contains forbidden token '${token}' per UI_UX_CONTRACT.md`);
          }
        });
      }
    }
  }

  scanDirectory(webSrcDir);

  if (violations.length > 0) {
    console.error('[UI Contract Violation Found]:');
    violations.forEach(v => console.error(` - ${v}`));
    return false;
  }

  console.log('[UI Contract Validator] All React/CSS files comply with the restrained design system.');
  return true;
}

if (process.argv[1] === import.meta.url || process.argv[1]?.endsWith('ui-contract-validator.mjs')) {
  const isValid = validateUIContract();
  process.exit(isValid ? 0 : 1);
}
