import fs from 'fs';
import path from 'path';

const REQUIRED_DESIGN_ELEMENTS = [
  { name: 'backdrop-blur / glassmorphism', pattern: /(?:backdrop-blur|backdrop-filter:\s*blur)/ },
  { name: 'mesh / iridescent gradients', pattern: /(?:--iridescent-flow|--mesh-gradient|radial-gradient)/ },
  { name: '200-240ms fluid motion timing', pattern: /(?:200ms|220ms|240ms|0\.2s|0\.22s|0\.24s)/ },
  { name: '4-6px movement transforms', pattern: /(?:translateY\(-?[4-6]px\)|translate\(-?[4-6]px|--sov-motion-lift)/ }
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

  let allContent = '';
  function gatherContent(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        gatherContent(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.css')) {
        allContent += '\n' + fs.readFileSync(fullPath, 'utf8');
      }
    }
  }

  gatherContent(webSrcDir);

  const missingElements = [];
  for (const el of REQUIRED_DESIGN_ELEMENTS) {
    if (!el.pattern.test(allContent)) {
      missingElements.push(`Missing required design element: ${el.name}`);
    }
  }

  const missingCopy = [];
  for (const copy of REQUIRED_CANONICAL_COPY) {
    if (!allContent.includes(copy)) {
      missingCopy.push(`Missing canonical copy: "${copy}"`);
    }
  }

  if (missingElements.length > 0 || missingCopy.length > 0) {
    console.error('[UI Contract Validation Failure]:');
    missingElements.forEach(err => console.error(` - ${err}`));
    missingCopy.forEach(err => console.error(` - ${err}`));
    return false;
  }

  console.log('[UI Contract Validator] High-motion glassmorphic design system verified (backdrop-blur, mesh gradients, 200-240ms timing, 4-6px movement, canonical copy).');
  return true;
}

if (process.argv[1] === import.meta.url || process.argv[1]?.endsWith('ui-contract-validator.mjs')) {
  const isValid = validateUIContract();
  process.exit(isValid ? 0 : 1);
}
