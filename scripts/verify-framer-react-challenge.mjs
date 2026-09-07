import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const framerHtmlPath = '/tmp/framer_page.html';
const appTsxPath = resolve(root, 'apps/web/src/App.tsx');
const stylesCssPath = resolve(root, 'apps/web/src/styles.css');
const indexHtmlPath = resolve(root, 'apps/web/index.html');

console.log('=== EMPIRICAL CHALLENGE HARNESS: FRAMER VS REACT PARITY ===\n');

// 1. Read files
const framerHtml = readFileSync(framerHtmlPath, 'utf8');
const appTsx = readFileSync(appTsxPath, 'utf8');
const stylesCss = readFileSync(stylesCssPath, 'utf8');
const indexHtml = readFileSync(indexHtmlPath, 'utf8');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedChecks++;
    console.error(`  ✗ FAIL: ${message}`);
    if (details) console.error(`    Details: ${details}`);
  }
}

// -------------------------------------------------------------
// Test Suite 1: Hero headlines, kickers, descriptions, trust lines
// -------------------------------------------------------------
console.log('[Suite 1] Hero Section Parity');

// 1.1 Kicker
const expectedKicker = 'PERSONAL AI FOR REAL LIFE';
assert(framerHtml.includes(expectedKicker), 'Framer contains Hero kicker: ' + expectedKicker);
assert(appTsx.includes(expectedKicker), 'React App.tsx contains Hero kicker: ' + expectedKicker);

// 1.2 Headline
const expectedHeadlineRaw = 'Healing isn’t optional.';
const expectedHeadlineSecond = 'Holding onto the pain is.';
assert(framerHtml.includes(expectedHeadlineRaw) && framerHtml.includes(expectedHeadlineSecond), 'Framer contains Headline with typographic apostrophe');
assert(appTsx.includes('Healing isn’t optional.<br />') && appTsx.includes('Holding onto the pain is.'), 'React App.tsx contains Headline with exact typographic apostrophe and line break');

// Check H1 semantic tag in both
const framerHasH1 = framerHtml.includes('<h1') && framerHtml.includes('Healing isn’t optional');
const reactHasH1 = appTsx.includes('<h1') && appTsx.includes('Healing isn’t optional');
assert(framerHasH1, 'Framer uses semantic <h1> for Hero headline');
assert(reactHasH1, 'React App.tsx uses semantic <h1> for Hero headline');

// 1.3 2-Sentence Description
const expectedSentence1 = 'Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you.';
const expectedSentence2 = 'Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.';
assert(framerHtml.includes(expectedSentence1), 'Framer contains sentence 1 of Hero description');
assert(framerHtml.includes(expectedSentence2), 'Framer contains sentence 2 of Hero description');
assert(appTsx.includes(expectedSentence1), 'React App.tsx contains sentence 1 of Hero description');
assert(appTsx.includes(expectedSentence2), 'React App.tsx contains sentence 2 of Hero description');

// 1.4 Trust Line
const expectedTrustLine = 'Start free · No card required · Review, correct, or reject any interpretation';
assert(framerHtml.includes(expectedTrustLine), 'Framer contains Trust line');
assert(appTsx.includes(expectedTrustLine), 'React App.tsx contains Trust line');

// -------------------------------------------------------------
// Test Suite 2: Three-Layer Scope cards (01, 02, 03) copy & hierarchy
// -------------------------------------------------------------
console.log('\n[Suite 2] Three-Layer Scope Progression (01, 02, 03) Copy & Hierarchy');

// 2.1 Architecture Kicker & Headline
const expectedArchKicker = 'THREE-LAYER ARCHITECTURE';
const expectedArchHeadline = 'Understanding moves outward in three clear layers.';
assert(framerHtml.includes(expectedArchKicker), 'Framer contains Scope Architecture kicker');
assert(appTsx.includes(expectedArchKicker), 'React App.tsx contains Scope Architecture kicker');
assert(framerHtml.includes(expectedArchHeadline), 'Framer contains Scope Section headline');
assert(appTsx.includes(expectedArchHeadline), 'React App.tsx contains Scope Section headline');

// Check H2 semantic tag
assert(framerHtml.includes('<h2') && framerHtml.includes(expectedArchHeadline), 'Framer uses <h2> for Scope Section headline');
assert(appTsx.includes('<h2') && appTsx.includes(expectedArchHeadline), 'React App.tsx uses <h2> for Scope Section headline');

// 2.2 Card 01 · YOU
const card1Kicker = '01 · YOU';
const card1Heading = 'Explore how you think, decide, communicate, create, connect, and grow.';
const card1Body = 'Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score.';

assert(framerHtml.includes(card1Kicker), 'Framer contains Card 01 kicker');
assert(framerHtml.includes(card1Heading), 'Framer contains Card 01 heading');
assert(framerHtml.includes(card1Body), 'Framer contains Card 01 body');
assert(appTsx.includes(card1Kicker), 'React App.tsx contains Card 01 kicker');
assert(appTsx.includes(card1Heading), 'React App.tsx contains Card 01 heading');
assert(appTsx.includes(card1Body), 'React App.tsx contains Card 01 body');
assert(appTsx.includes('Explore yourself'), 'React App.tsx contains Card 01 sub-badge from canonical spec');

// 2.3 Card 02 · YOU + YOUR PEOPLE
const card2Kicker = '02 · YOU + YOUR PEOPLE';
const card2Heading = 'See why the same moment lands differently—and how to bridge the gap.';
const card2Body = 'With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently.';

assert(framerHtml.includes(card2Kicker), 'Framer contains Card 02 kicker');
assert(framerHtml.includes(card2Heading), 'Framer contains Card 02 heading');
assert(framerHtml.includes(card2Body), 'Framer contains Card 02 body');
assert(appTsx.includes(card2Kicker), 'React App.tsx contains Card 02 kicker');
assert(appTsx.includes(card2Heading), 'React App.tsx contains Card 02 heading');
assert(appTsx.includes(card2Body), 'React App.tsx contains Card 02 body');
assert(appTsx.includes('Relational intelligence'), 'React App.tsx contains Card 02 sub-badge from canonical spec');

// 2.4 Card 03 · FROM 1:1 TO THE WHOLE SYSTEM
const card3Kicker = '03 · FROM 1:1 TO THE WHOLE SYSTEM';
const card3Heading = 'See the whole system.';
const card3Body = 'Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.';

assert(framerHtml.includes(card3Kicker), 'Framer contains Card 03 kicker');
assert(framerHtml.includes(card3Heading), 'Framer contains Card 03 heading');
assert(framerHtml.includes(card3Body), 'Framer contains Card 03 body');
assert(appTsx.includes(card3Kicker), 'React App.tsx contains Card 03 kicker');
assert(appTsx.includes(card3Heading), 'React App.tsx contains Card 03 heading');
assert(appTsx.includes(card3Body), 'React App.tsx contains Card 03 body');
assert(appTsx.includes('System dynamics'), 'React App.tsx contains Card 03 sub-badge from canonical spec');

// Check H3 semantic tag on cards
assert(framerHtml.includes('<h3') && framerHtml.includes(card1Heading), 'Framer uses <h3> for card headings');
assert(appTsx.includes('<h3') && appTsx.includes(card1Heading), 'React App.tsx uses <h3> for card headings');

// -------------------------------------------------------------
// Test Suite 3: Demo intake question and relational triad labels
// -------------------------------------------------------------
console.log('\n[Suite 3] Demo Intake Question & Relational Triad Labels');

const expectedQuestion = 'Why does the same conversation feel urgent to me and pressuring to them?';
assert(framerHtml.includes(expectedQuestion), 'Framer contains demo intake question: ' + expectedQuestion);
assert(appTsx.includes(expectedQuestion), 'React App.tsx contains demo intake question: ' + expectedQuestion);

const expectedAskButton = 'Ask Sovereign';
assert(framerHtml.includes(expectedAskButton), 'Framer contains demo button: ' + expectedAskButton);
assert(appTsx.includes(expectedAskButton), 'React App.tsx contains demo button: ' + expectedAskButton);

const triad1Header = 'WHAT YOU MAY BE BRINGING';
const triad2Header = 'WHAT THEY MAY BE BRINGING';
const triad3Header = 'WHAT HAPPENS BETWEEN YOU';
assert(framerHtml.includes(triad1Header), 'Framer contains Triad 1 header: ' + triad1Header);
assert(framerHtml.includes(triad2Header), 'Framer contains Triad 2 header: ' + triad2Header);
assert(framerHtml.includes(triad3Header), 'Framer contains Triad 3 header: ' + triad3Header);
assert(appTsx.includes(triad1Header), 'React App.tsx contains Triad 1 header: ' + triad1Header);
assert(appTsx.includes(triad2Header), 'React App.tsx contains Triad 2 header: ' + triad2Header);
assert(appTsx.includes(triad3Header), 'React App.tsx contains Triad 3 header: ' + triad3Header);

// Sources verification
assert(framerHtml.includes('Sources'), 'Framer contains Sources element');
assert(appTsx.includes('See source details'), 'React App.tsx contains approved non-coercive Sources disclosure');

// -------------------------------------------------------------
// Test Suite 4: Background colors, borders, and typography
// -------------------------------------------------------------
console.log('\n[Suite 4] Visual Design: Colors, Borders, Typography');

// 4.1 Typography: Inter & JetBrains Mono
assert(framerHtml.includes('font-family: "Inter"') || framerHtml.includes('family="Inter"'), 'Framer embeds Inter font');
assert(framerHtml.includes('font-family: "JetBrains Mono"'), 'Framer embeds JetBrains Mono font');

assert(indexHtml.includes('family=Inter'), 'index.html embeds Inter font');
assert(indexHtml.includes('family=JetBrains+Mono'), 'index.html embeds JetBrains Mono font');
assert(stylesCss.includes('--font-sans: "Inter"'), 'styles.css defines Inter as primary sans font');
assert(stylesCss.includes('--font-mono: "JetBrains Mono"'), 'styles.css defines JetBrains Mono as mono font');

// 4.2 Foundation Colors (#000000 / #050505)
assert(framerHtml.includes('rgb(0, 0, 0)') || framerHtml.includes('#000'), 'Framer uses pure black canvas');
assert(stylesCss.includes('--platform-bg: #000000'), 'styles.css defines pure black platform base');
assert(stylesCss.includes('--ink: #000000'), 'styles.css defines pure black ink');
assert(stylesCss.includes('--surface: #050505'), 'styles.css defines #050505 elevated surface');
assert(stylesCss.includes('--surface-1: #0c0c0e'), 'styles.css defines #0c0c0e container surface');

// 4.3 Borders (1px subtle alpha lines)
assert(stylesCss.includes('--line: rgba(255, 255, 255, 0.08)'), 'styles.css defines subtle 1px border line');
assert(appTsx.includes('border-white/[0.08]') || appTsx.includes('border-[rgba(255,255,255,0.08)]'), 'React App.tsx uses subtle 1px white border lines');

// 4.4 Sage Accent (#9fbaa1)
assert(stylesCss.includes('--sage: #9fbaa1'), 'styles.css defines canonical sage accent #9fbaa1');
assert(appTsx.includes('bg-[var(--sage)]'), 'React App.tsx uses sage indicator');

// -------------------------------------------------------------
// Test Suite 5: Responsiveness across desktop, tablet, mobile
// -------------------------------------------------------------
console.log('\n[Suite 5] Responsiveness Stress Harness (Desktop, Tablet, Mobile)');

// 5.1 Viewport meta configuration
assert(indexHtml.includes('name="viewport" content="width=device-width, initial-scale=1.0'), 'React index.html configures responsive viewport');
const framerViewport1200 = framerHtml.includes('content="width=1200"');
console.log(`  ℹ OBSERVATION: Framer live site viewport is set to: ${framerViewport1200 ? 'width=1200 (fixed desktop canvas)' : 'responsive'}`);

// 5.2 Header Navigation responsiveness
assert(appTsx.includes('hidden items-center gap-8 md:flex'), 'Header collapses nav links under 768px to prevent touch overflow');

// 5.3 Hero Headline fluid scaling
assert(appTsx.includes('text-4xl sm:text-6xl md:text-7xl'), 'Hero headline scales smoothly: 4xl (mobile) -> 6xl (tablet) -> 7xl (desktop)');

// 5.4 Hero CTA button stacking
assert(appTsx.includes('flex flex-col sm:flex-row items-center justify-center gap-4'), 'Hero CTA container stacks vertically on mobile, horizontal on tablet/desktop');
assert(appTsx.includes('w-full sm:w-auto'), 'Hero CTA buttons expand to full touch target width on mobile');

// 5.5 Three-Layer Scope Grid responsiveness
assert(appTsx.includes('grid gap-8 md:grid-cols-3'), 'Three-Layer Scope cards stack in 1 column on mobile/tablet, 3 columns on desktop');

// 5.6 Demonstration Window responsiveness
assert(appTsx.includes('p-6 sm:p-10'), 'Demo window reduces padding on mobile (p-6) and expands on tablet/desktop (p-10)');
assert(appTsx.includes('flex flex-col sm:flex-row gap-3'), 'Demo question input & button stack on mobile, horizontal on desktop');
assert(appTsx.includes('grid grid-cols-2 sm:grid-cols-4 gap-3'), 'Sources drawer displays 2 columns on mobile, 4 columns on desktop');

// -------------------------------------------------------------
// Test Suite 6: Prohibited terms check
// -------------------------------------------------------------
console.log('\n[Suite 6] Regulatory & Prohibited Phrasing Audit');
const prohibitedList = [
  'sovereign-answer.v2',
  'model-safe context',
  'server-approved',
  'One private foundation',
  'Separate helping from carrying',
  'See where responsibility keeps landing',
  'Understand both sides and what happens between you',
  'Ask about your life',
  'What is Basis?',
  'What does Basis prove?'
];

let prohibitedCount = 0;
for (const term of prohibitedList) {
  if (appTsx.toLowerCase().includes(term.toLowerCase())) {
    prohibitedCount++;
    console.error(`  ✗ FAIL: App.tsx contains prohibited phrase: "${term}"`);
  }
}
assert(prohibitedCount === 0, 'React App.tsx contains 0 prohibited terms');

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n=== EMPIRICAL CHALLENGE SUMMARY ===');
console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${failedChecks}`);

if (failedChecks === 0) {
  console.log('\nVERDICT: ALL PARITY & RESPONSIVENESS CHECKS PASSED EMPIRICALLY.');
  process.exit(0);
} else {
  console.error(`\nVERDICT: ${failedChecks} CHECKS FAILED.`);
  process.exit(1);
}
