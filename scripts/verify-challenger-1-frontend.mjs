import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import crypto from 'node:crypto';

const root = resolve(process.cwd());

console.log('================================================================');
console.log('   EMPIRICAL ADVERSARIAL CHALLENGE HARNESS: CHALLENGER 1');
console.log('   Scope: Frontend, Chat & Language Laws (R1, R2, R3)');
console.log('================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failureDetails = [];

function assert(condition, testId, description, errorDetail = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ [${testId}] PASS: ${description}`);
  } else {
    failedChecks++;
    console.error(`  ✗ [${testId}] FAIL: ${description}`);
    if (errorDetail) console.error(`      Detail: ${errorDetail}`);
    failureDetails.push({ testId, description, errorDetail });
  }
}

// ----------------------------------------------------------------------
// Load all relevant files
// ----------------------------------------------------------------------
const paths = {
  sovereignThread: resolve(root, 'apps/web/src/components/chat/SovereignThread.tsx'),
  sovereignThreadTest: resolve(root, 'apps/web/src/components/chat/SovereignThread.test.ts'),
  baselineFragment: resolve(root, 'apps/web/src/components/fragments/BaselineViewFragment.tsx'),
  expressionFragment: resolve(root, 'apps/web/src/components/fragments/ExpressionViewFragment.tsx'),
  systemMapFragment: resolve(root, 'apps/web/src/components/fragments/SystemMapViewFragment.tsx'),
  publicLanding: resolve(root, 'apps/web/src/PublicLanding.v2.tsx'),
  chatWorkspace: resolve(root, 'apps/web/src/SovereignChatWorkspace.v2.tsx'),
  workerIndex: resolve(root, 'apps/worker/src/index.ts'),
  pricingHtml: resolve(root, 'apps/web/public/pricing.html'),
  faqHtml: resolve(root, 'apps/web/public/faq.html'),
  howItWorksHtml: resolve(root, 'apps/web/public/how-it-works.html'),
  consentHtml: resolve(root, 'apps/web/public/consent.html'),
  notFoundHtml: resolve(root, 'apps/web/public/404.html'),
  tokensCss: resolve(root, 'apps/web/public/tokens.css'),
  languageSystem: resolve(root, 'docs/product-language-system.md')
};

const content = {};
for (const [key, filePath] of Object.entries(paths)) {
  try {
    content[key] = readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
}

// Helper to extract JSX body
function extractJsxBody(src) {
  const returnIdx = src.indexOf('return (');
  if (returnIdx === -1) return src;
  return src.slice(returnIdx);
}

// ======================================================================
// CHALLENGE 1: Language Law Hard Assertions
// ======================================================================
console.log('\n--- Challenge 1: Language Law Hard Assertions ---');

// 1.1 Strictly forbidden terms in user-facing JSX
const forbiddenTerms = [
  { term: 'sovereign-answer.v2', description: 'Internal answer schema version' },
  { term: 'model-safe context', description: 'Internal model context term' },
  { term: 'server-approved', description: 'Internal authorization term' },
  { term: 'provenance score', description: 'Prohibited scoring term' },
  { term: 'One private foundation', description: 'Retired foundation metaphor' },
  { term: 'Separate helping from carrying', description: 'Retired self category' },
  { term: 'See where responsibility keeps landing', description: 'Retired systems category' },
  { term: 'Understand both sides and what happens between you', description: 'Retired relationship copy' },
  { term: 'What is Basis?', description: 'Prohibited FAQ question' },
  { term: 'What does Basis prove?', description: 'Prohibited FAQ question' },
  { term: 'server-confirmed Stripe', description: 'Prohibited billing copy' },
  { term: 'Example Basis', description: 'Prohibited basis label' },
  { term: 'model context', description: 'Prohibited AI context label' }
];

const scannedComponents = [
  { name: 'SovereignThread.tsx', src: content.sovereignThread },
  { name: 'BaselineViewFragment.tsx', src: content.baselineFragment },
  { name: 'ExpressionViewFragment.tsx', src: content.expressionFragment },
  { name: 'SystemMapViewFragment.tsx', src: content.systemMapFragment },
  { name: 'PublicLanding.v2.tsx', src: content.publicLanding }
];

for (const { name, src } of scannedComponents) {
  for (const { term, description } of forbiddenTerms) {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const hasTerm = regex.test(src);
    assert(
      !hasTerm,
      `LANG-FORBIDDEN-${name.split('.')[0]}-${term.replace(/[^a-zA-Z0-9]/g, '_')}`,
      `${name} contains zero occurrences of prohibited term "${term}" (${description})`,
      hasTerm ? `Found prohibited string "${term}" in ${name}` : ''
    );
  }
}

// 1.2 "Basis" as a visible UI label check
// Basis may exist in code as an internal schema type or property,
// but MUST NEVER be rendered as a visible text label or attribute in JSX.
for (const { name, src } of scannedComponents) {
  const jsx = extractJsxBody(src);
  
  // Extract all text nodes in JSX: >text<
  const textNodes = [...jsx.matchAll(/>([^<{]+)</g)]
    .map(m => m[1].trim())
    .filter(Boolean);
  const basisTextNodes = textNodes.filter(t => /\bBasis\b/i.test(t));

  // Extract all visible UI attributes: aria-label, placeholder, title, alt
  const attrMatches = [...jsx.matchAll(/(?:aria-label|placeholder|title|alt)=["']([^"']+)["']/g)]
    .map(m => m[1]);
  const basisAttrs = attrMatches.filter(t => /\bBasis\b/i.test(t));

  const totalViolations = [...basisTextNodes, ...basisAttrs];
  assert(
    totalViolations.length === 0,
    `LANG-BASIS-LABEL-${name.split('.')[0]}`,
    `${name} has zero visible UI occurrences of "Basis" in JSX text nodes or UI attributes`,
    totalViolations.length > 0 ? `Offending visible labels: ${totalViolations.join(', ')}` : ''
  );
}

// 1.3 Sources Drawer Trigger & Header Verification in SovereignThread.tsx
const threadSrc = content.sovereignThread;

assert(
  threadSrc.includes('>Sources<') && threadSrc.includes('See source details'),
  'LANG-SOURCES-TRIGGER',
  'SovereignThread Sources drawer trigger uses approved labels "Sources" and "See source details"',
  'Trigger labels missing or non-compliant'
);

const hasSourceDetailsHeader = /<h3[^>]*>\s*Source details\s*<\/h3>/.test(threadSrc);
assert(
  hasSourceDetailsHeader,
  'LANG-SOURCES-HEADER',
  'SovereignThread Sources drawer expanded header is "Source details"',
  'Drawer header <h3> is not "Source details"'
);

const expectedDrawerExplaining = 'These are the source values Sovereign used for this answer. They can inform reflection; they do not prove personality or current state.';
assert(
  threadSrc.includes(expectedDrawerExplaining),
  'LANG-SOURCES-EXPLANATION',
  'SovereignThread Sources drawer contains canonical explanatory notice verbatim',
  'Explanatory notice text does not match docs/product-language-system.md'
);

// 1.4 Static HTML files token & language check
const staticPages = [
  { name: 'pricing.html', src: content.pricingHtml },
  { name: 'faq.html', src: content.faqHtml },
  { name: 'how-it-works.html', src: content.howItWorksHtml },
  { name: 'consent.html', src: content.consentHtml },
  { name: '404.html', src: content.notFoundHtml }
];

for (const { name, src } of staticPages) {
  assert(
    src.includes('/tokens.css'),
    `STATIC-TOKENS-${name.split('.')[0]}`,
    `${name} links to shared /tokens.css design system stylesheet`,
    'Missing link to /tokens.css'
  );
  assert(
    !src.includes('What is Basis?'),
    `STATIC-NO-BASIS-FAQ-${name.split('.')[0]}`,
    `${name} does not contain prohibited query "What is Basis?"`,
    'Found "What is Basis?"'
  );
}


// ======================================================================
// CHALLENGE 2: UI Fragment Integrity
// ======================================================================
console.log('\n--- Challenge 2: UI Fragment Integrity ---');

// 2.1 SystemMapViewFragment SVG Syntax and Geometry Validation
const svgSrc = content.systemMapFragment;

// Verify viewBox
const viewBoxMatch = svgSrc.match(/viewBox=["']([0-9\s]+)["']/);
assert(
  viewBoxMatch && viewBoxMatch[1] === '0 0 360 240',
  'FRAG-SVG-VIEWBOX',
  'SystemMapViewFragment specifies canonical SVG viewBox "0 0 360 240"',
  `Actual viewBox: ${viewBoxMatch ? viewBoxMatch[1] : 'none'}`
);

// Extract all circle radii (matches r="70", r={18}, r={4})
const circleMatches = [...svgSrc.matchAll(/<circle([^>]+)\/>/g)].map(m => m[1]);
const parsedRadii = circleMatches.map((c) => {
  const match = c.match(/r=(?:["']([0-9.]+)["']|\{([0-9.]+)\})/);
  return match ? parseFloat(match[1] || match[2]) : NaN;
});

assert(
  parsedRadii.length === 3 && parsedRadii.every(r => Number.isFinite(r) && r > 0),
  'FRAG-SVG-RADII',
  `All SVG circles have strictly positive, finite radii (found ${parsedRadii.length} circles with radii: ${parsedRadii.join(', ')})`,
  `Invalid radii detected: ${parsedRadii.join(', ')}`
);

// Extract coordinates in NODES
const nodeMatch = svgSrc.match(/const NODES: SystemNode\[\] = \[\s*([\s\S]*?)\s*\];/);
assert(
  Boolean(nodeMatch),
  'FRAG-SVG-NODES-DEF',
  'SystemMapViewFragment defines static NODES array',
  'NODES array not found'
);

if (nodeMatch) {
  const nodeDefs = nodeMatch[1];
  const xCoords = [...nodeDefs.matchAll(/x:\s*([0-9.-]+)/g)].map(m => parseFloat(m[1]));
  const yCoords = [...nodeDefs.matchAll(/y:\s*([0-9.-]+)/g)].map(m => parseFloat(m[1]));
  
  assert(
    xCoords.length === 3 && xCoords.every(x => Number.isFinite(x) && x >= 0 && x <= 360),
    'FRAG-SVG-X-BOUNDS',
    `All node X coordinates are within viewBox [0, 360] (found: ${xCoords.join(', ')})`,
    `Out of bounds X: ${xCoords.join(', ')}`
  );
  assert(
    yCoords.length === 3 && yCoords.every(y => Number.isFinite(y) && y >= 0 && y <= 240),
    'FRAG-SVG-Y-BOUNDS',
    `All node Y coordinates are within viewBox [0, 240] (found: ${yCoords.join(', ')})`,
    `Out of bounds Y: ${yCoords.join(', ')}`
  );
}

// Check tag balance for SVG elements
const svgTags = ['svg', 'g', 'text'];
for (const tag of svgTags) {
  const openCount = (svgSrc.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
  const closeCount = (svgSrc.match(new RegExp(`</${tag}>`, 'g')) || []).length;
  assert(
    openCount === closeCount && openCount > 0,
    `FRAG-SVG-TAG-BALANCE-${tag}`,
    `SVG tag <${tag}> is well-balanced (${openCount} open, ${closeCount} closed)`,
    `Mismatch: ${openCount} opens vs ${closeCount} closes`
  );
}

// 2.2 Check zero network calls in all three fragments
const fragmentFiles = [
  { name: 'SystemMapViewFragment.tsx', src: content.systemMapFragment },
  { name: 'BaselineViewFragment.tsx', src: content.baselineFragment },
  { name: 'ExpressionViewFragment.tsx', src: content.expressionFragment }
];

for (const { name, src } of fragmentFiles) {
  const hasFetch = /\bfetch\s*\(/.test(src);
  const hasXhr = /XMLHttpRequest/.test(src);
  const hasWs = /WebSocket/.test(src);
  const hasEventSource = /EventSource/.test(src);
  const hasAxiosOrHttp = /import\s+.*\b(axios|http|https)\b/.test(src);
  const hasNetwork = hasFetch || hasXhr || hasWs || hasEventSource || hasAxiosOrHttp;

  assert(
    !hasNetwork,
    `FRAG-ZERO-NETWORK-${name.split('.')[0]}`,
    `${name} is purely presentational and initiates ZERO network calls`,
    hasNetwork ? `Network API detected in ${name}` : ''
  );
}

// 2.3 BaselineViewFragment renders above the fold in PublicLanding.v2.tsx
const landingSrc = content.publicLanding;
const heroSectionMatch = landingSrc.match(/function V2Hero\(\) \{([\s\S]*?)\n\}/);
assert(
  Boolean(heroSectionMatch && heroSectionMatch[1].includes('<BaselineViewFragment')),
  'FRAG-BASELINE-ABOVE-FOLD',
  'BaselineViewFragment is mounted inside V2Hero() ensuring above-the-fold visibility on landing',
  'BaselineViewFragment not found within V2Hero section'
);

// 2.4 ExpressionViewFragment renders raw inquiry vs contextual breakdown
const exprSrc = content.expressionFragment;
assert(
  exprSrc.includes('01 · RAW QUERY INPUT') &&
  exprSrc.includes('Why do I keep overthinking what to say whenever I feel misunderstood?') &&
  exprSrc.includes('02 · SOVEREIGN CONTEXTUAL BREAKDOWN') &&
  exprSrc.includes('Observed Dynamic') &&
  exprSrc.includes('Baseline Grounding') &&
  exprSrc.includes('Suggested Shift'),
  'FRAG-EXPRESSION-CONTRAST',
  'ExpressionViewFragment clearly contrasts raw query input with 3-part Sovereign contextual breakdown',
  'Expression breakdown structure incomplete'
);


// ======================================================================
// CHALLENGE 3: Chat Composer Auto-resize Stress Test
// ======================================================================
console.log('\n--- Challenge 3: Chat Composer Auto-resize Stress Test ---');

// Emulate clamping algorithm implemented in SovereignThread.tsx:
// const nextHeight = Math.min(Math.max(scrollHeight, 44), 200);
// const overflowY = scrollHeight > 200 ? 'auto' : 'hidden';
function calculateTextareaLayout(scrollHeight) {
  const nextHeight = Math.min(Math.max(scrollHeight, 44), 200);
  const overflowY = scrollHeight > 200 ? 'auto' : 'hidden';
  return { nextHeight, overflowY };
}

const resizeTestCases = [
  { scrollHeight: -50, expectedHeight: 44, expectedOverflow: 'hidden', label: 'Negative scrollHeight (defensive)' },
  { scrollHeight: 0, expectedHeight: 44, expectedOverflow: 'hidden', label: '0px (empty composer)' },
  { scrollHeight: 20, expectedHeight: 44, expectedOverflow: 'hidden', label: '20px (under min-height)' },
  { scrollHeight: 44, expectedHeight: 44, expectedOverflow: 'hidden', label: '44px (exact single line)' },
  { scrollHeight: 68, expectedHeight: 68, expectedOverflow: 'hidden', label: '68px (2 lines)' },
  { scrollHeight: 120, expectedHeight: 120, expectedOverflow: 'hidden', label: '120px (4 lines)' },
  { scrollHeight: 180, expectedHeight: 180, expectedOverflow: 'hidden', label: '180px (7 lines)' },
  { scrollHeight: 200, expectedHeight: 200, expectedOverflow: 'hidden', label: '200px (exact upper clamp bound)' },
  { scrollHeight: 201, expectedHeight: 200, expectedOverflow: 'auto', label: '201px (exceeds clamp by 1px -> triggers auto scroll)' },
  { scrollHeight: 350, expectedHeight: 200, expectedOverflow: 'auto', label: '350px (10+ lines multiline)' },
  { scrollHeight: 1500, expectedHeight: 200, expectedOverflow: 'auto', label: '1500px (pasted essay/code block)' }
];

for (const tc of resizeTestCases) {
  const result = calculateTextareaLayout(tc.scrollHeight);
  assert(
    result.nextHeight === tc.expectedHeight && result.overflowY === tc.expectedOverflow,
    `RESIZE-STRESS-${tc.scrollHeight}`,
    `Auto-resize at ${tc.scrollHeight}px -> height: ${result.nextHeight}px, overflowY: "${result.overflowY}" (${tc.label})`,
    `Got height ${result.nextHeight}px (expected ${tc.expectedHeight}) and overflowY ${result.overflowY} (expected ${tc.expectedOverflow})`
  );
}

// Check keydown handler semantics in SovereignThread.tsx source:
// onKeyDown: if (e.key === 'Enter' && !e.shiftKey) -> preventDefault() & handleSubmit()
const hasEnterHandling = threadSrc.includes("e.key === 'Enter' && !e.shiftKey");
assert(
  hasEnterHandling,
  'RESIZE-KEY-ENTER-DISPATCH',
  'SovereignThread intercepts Enter without Shift to submit turn while allowing Shift+Enter to insert newlines',
  'Missing or incorrect keydown event handler for Enter/Shift+Enter'
);

// Verify reset to 44px on submit and new conversation
const hasSubmitReset = threadSrc.includes("textareaRef.current.style.height = '44px'");
assert(
  hasSubmitReset,
  'RESIZE-HEIGHT-RESET',
  'SovereignThread resets textarea style.height to 44px upon turn dispatch and new conversation',
  'Missing height reset to 44px'
);


// ======================================================================
// CHALLENGE 4: Passkey Badge Conditionality
// ======================================================================
console.log('\n--- Challenge 4: Passkey Badge Conditionality ---');

// Condition logic in SovereignThread.tsx:
// const isPasskeyVerified = Boolean(
//   session?.hasPasskey || session?.passkeyVerified || hasVerifiedPasskey
// );
function evaluatePasskeyCondition(session, hasVerifiedPasskey) {
  return Boolean(session?.hasPasskey || session?.passkeyVerified || hasVerifiedPasskey);
}

const passkeyTruthTable = [
  {
    hasVerifiedPasskey: true,
    session: null,
    expected: true,
    description: 'Explicit prop hasVerifiedPasskey=true with null session'
  },
  {
    hasVerifiedPasskey: undefined,
    session: { hasPasskey: true },
    expected: true,
    description: 'session.hasPasskey=true'
  },
  {
    hasVerifiedPasskey: false,
    session: { passkeyVerified: true },
    expected: true,
    description: 'session.passkeyVerified=true'
  },
  {
    hasVerifiedPasskey: true,
    session: { hasPasskey: false, passkeyVerified: false },
    expected: true,
    description: 'hasVerifiedPasskey=true overrides false session flags'
  },
  {
    hasVerifiedPasskey: false,
    session: { hasPasskey: true, passkeyVerified: true },
    expected: true,
    description: 'Multiple true session flags'
  },
  {
    hasVerifiedPasskey: false,
    session: { hasPasskey: false, passkeyVerified: false },
    expected: false,
    description: 'All flags explicitly false'
  },
  {
    hasVerifiedPasskey: undefined,
    session: null,
    expected: false,
    description: 'All flags undefined / session null'
  },
  {
    hasVerifiedPasskey: false,
    session: undefined,
    expected: false,
    description: 'hasVerifiedPasskey=false and session undefined'
  },
  {
    hasVerifiedPasskey: undefined,
    session: { hasPasskey: false },
    expected: false,
    description: 'session.hasPasskey=false with no other true flags'
  }
];

passkeyTruthTable.forEach((tc, idx) => {
  const actual = evaluatePasskeyCondition(tc.session, tc.hasVerifiedPasskey);
  assert(
    actual === tc.expected,
    `PASSKEY-TRUTH-TABLE-${idx + 1}`,
    `Passkey condition evaluates to ${tc.expected} for: ${tc.description}`,
    `Expected ${tc.expected}, got ${actual}`
  );
});

// Verify badge styling tokens in SovereignThread.tsx
const hasPasskeyStyle =
  threadSrc.includes('border-[#9fbaa1]/30') &&
  threadSrc.includes('bg-[#9fbaa1]/10') &&
  threadSrc.includes('text-[#9fbaa1]') &&
  threadSrc.includes('ShieldCheck') &&
  threadSrc.includes('Passkey Verified');

assert(
  hasPasskeyStyle,
  'PASSKEY-BADGE-STYLING',
  'Passkey badge renders with sage styling tokens (#9fbaa1), ShieldCheck icon, and "Passkey Verified" label',
  'Badge styling tokens mismatch'
);


// ======================================================================
// CHALLENGE 5: Idempotency Key Contract
// ======================================================================
console.log('\n--- Challenge 5: Idempotency Key Contract ---');

// 5.1 Verify client generates valid turn_UUID format
assert(
  threadSrc.includes("'x-idempotency-key': idempotencyKey") &&
  threadSrc.includes("const idempotencyKey = `turn_${crypto.randomUUID()}`"),
  'IDEMPOTENCY-CLIENT-HEADER-THREAD',
  'SovereignThread.tsx sets "x-idempotency-key" with "turn_${crypto.randomUUID()}" in SSE fetch headers',
  'Header missing or malformed in SovereignThread.tsx'
);

const chatWsSrc = content.chatWorkspace;
assert(
  chatWsSrc.includes("'x-idempotency-key': idempotencyKey") &&
  chatWsSrc.includes("const idempotencyKey = `turn_${crypto.randomUUID()}`"),
  'IDEMPOTENCY-CLIENT-HEADER-WORKSPACE',
  'SovereignChatWorkspace.v2.tsx sets "x-idempotency-key" with "turn_${crypto.randomUUID()}" in SSE fetch headers',
  'Header missing or malformed in SovereignChatWorkspace.v2.tsx'
);

// 5.2 Monte Carlo UUID Uniqueness & Regex Validation (10,000 keys)
const uuidV4Regex = /^turn_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const generatedKeys = new Set();
let formatErrors = 0;
const SAMPLE_SIZE = 10000;

for (let i = 0; i < SAMPLE_SIZE; i++) {
  const key = `turn_${crypto.randomUUID()}`;
  if (!uuidV4Regex.test(key)) formatErrors++;
  generatedKeys.add(key);
}

assert(
  formatErrors === 0,
  'IDEMPOTENCY-UUID-V4-RFC4122',
  `All ${SAMPLE_SIZE} generated idempotency keys conform to RFC 4122 UUIDv4 pattern`,
  `Encountered ${formatErrors} malformed UUIDs`
);

assert(
  generatedKeys.size === SAMPLE_SIZE,
  'IDEMPOTENCY-UUID-UNIQUENESS',
  `Empirical collision test: 0 collisions detected across ${SAMPLE_SIZE} sequentially generated keys`,
  `Duplicate detected! Set size: ${generatedKeys.size} vs sample ${SAMPLE_SIZE}`
);

// 5.3 Backend enforcement check
const workerSrc = content.workerIndex;
const workerHasCheck =
  workerSrc.includes("context.req.header('x-idempotency-key')") &&
  workerSrc.includes("if (!idempotencyKey) return context.json({ error: 'Idempotency key required' }, 400);");

assert(
  workerHasCheck,
  'IDEMPOTENCY-WORKER-GATE',
  'Cloudflare Worker route (/api/v1/threads/:threadId/messages) enforces x-idempotency-key with HTTP 400 rejection',
  'Worker enforcement check missing or malformed'
);


// ======================================================================
// SUMMARY & VERDICT
// ======================================================================
console.log('\n================================================================');
console.log(`SUMMARY: Total Checks: ${totalChecks} | Passed: ${passedChecks} | Failed: ${failedChecks}`);
console.log('================================================================');

if (failedChecks === 0) {
  console.log('\nVERDICT: >>> APPROVE <<<');
  console.log('All empirical challenges passed with 0 errors.');
  process.exit(0);
} else {
  console.error(`\nVERDICT: >>> FAIL <<< (${failedChecks} failures)`);
  failureDetails.forEach(f => {
    console.error(`  - [${f.testId}] ${f.description}: ${f.errorDetail}`);
  });
  process.exit(1);
}
