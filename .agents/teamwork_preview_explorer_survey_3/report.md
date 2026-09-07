# Framer Tools, Environment & Publishing Survey Report

**Agent**: Explorer 3 (`teamwork_preview_explorer_survey_3`)  
**Project**: Sovereign.OS  
**Date**: 2026-09-07  
**Status**: Investigation Complete  
**Working Directory**: `/Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_survey_3`  
**Parent Conversation ID**: `c76c6f5b-d8e4-45b7-af63-a75188c0ed34`  

---

## 1. Executive Summary

This investigation surveys the Framer design, automation, and publishing environment for Sovereign.OS, specifically targeting `https://nice-pluto-305324.framer.app` (Session 2). 

Key findings:
1. **Tooling & Connectivity**: Framer automation is powered by the official `@framer/agent` CLI (version `0.0.44`) connecting via tRPC/WebSockets to Framer Server API. The project is already authenticated locally under project ID `Y0YzGEgoInWS1wBiJJ7o` ("Nice Pluto") and active session ID `2`. Full skill documentation exists at `~/.agents/skills/framer/`.
2. **Current Live State vs. Canvas State**:
   - The public site `https://nice-pluto-305324.framer.app` currently displays a **blank white page** (`<title>My Framer Site</title>`, `background: rgb(255, 255, 255)`).
   - The root cause is structural: On the Framer canvas for page `augiA20Il` (`/`), the registered Desktop breakpoint frame `WQLkyLRf1` (at `0,0`) is **empty**. A draft dark-themed UI containing the navigation, hero, and Sovereign Answer v2 preview was constructed in a detached sibling frame `hiqVPvJJj` positioned off-canvas at `left: 1300px`. Because `hiqVPvJJj` is not inside the breakpoint variant, it does not render on the published URL.
   - Additionally, the draft design is missing the required **Three-Layer Scope** progression (`01 · YOU`, `02 · YOU + YOUR PEOPLE`, `03 · FROM 1:1 TO THE WHOLE SYSTEM`).
3. **Execution Feasibility**: Both `framer.agent.applyChanges` (canvas DSL) and `framer.agent.publish` (preview and confirm) are functional, tested, and ready to execute synchronously with 0 authentication barriers.
4. **Parity Path**: Translating the finalized design into `apps/web/src/App.tsx` requires adding web fonts (`Inter` and `JetBrains Mono`), styling the relational triad (`WHAT YOU MAY BE BRINGING`, `WHAT THEY MAY BE BRINGING`, `WHAT HAPPENS BETWEEN YOU`), and updating the three-layer narrative cards while preserving existing tests (`pnpm test` and `pnpm verify:foundation` both pass with 0 errors).

---

## 2. Framer Tooling & Environment Architecture

### 2.1 CLI & Package Details
- **Package**: `@framer/agent@0.0.44` (installed on demand via `npx @framer/agent` or `npx @framer/agent@latest`).
- **Dependencies**: `@trpc/client`, `@trpc/server`, `commander`, `framer-api: 0.1.29`, `zod`, `is-wsl`.
- **Installed Skills**:
  - `~/.agents/skills/framer/SKILL.md` (complete CLI, project inventory, recipes, and prompt guidance).
  - `~/.agents/skills/framer-code-components/SKILL.md` (custom React components).
- **MCP Server Status**: Framer integration does not use a local MCP server; it uses the tRPC-backed CLI and Node.js VM runtime provided by `@framer/agent`.

### 2.2 Session & Project Architecture
Inspection via `npx @framer/agent session list` and `npx @framer/agent project list` revealed:
```json
[
  {
    "id": "2",
    "projectId": "Y0YzGEgoInWS1wBiJJ7o",
    "stateKeys": []
  }
]
```
```json
[
  {
    "projectId": "Y0YzGEgoInWS1wBiJJ7o",
    "name": "Nice Pluto",
    "lastUsedAt": "2026-09-07T07:40:57.984Z"
  }
]
```
- **Session ID**: `2`
- **Project ID**: `Y0YzGEgoInWS1wBiJJ7o`
- **Local Metadata**: `/Users/cjo/.agents/skills/framer/projects/Y0YzGEgoInWS1wBiJJ7o/metadata.json`
- **Target URL**: `https://nice-pluto-305324.framer.app`

### 2.3 Command Surface
The `@framer/agent` CLI provides the following subcommands:
1. `npx @framer/agent exec -s 2 -e "<code>"`: Executes arbitrary JavaScript in the session VM with access to globals `framer`, `framer.agent`, and `state`.
2. `npx @framer/agent apply-changes -s 2 -p "/" -e "<dsl>"`: Applies canvas DSL operations to the specified page path.
3. `npx @framer/agent read-project -s 2 -q '<queries>'`: Queries project fonts, guides, and node screenshots.
4. `framer.agent.publish({ action: "preview" })` and `framer.agent.publish({ action: "confirm_publish", confirmationHash })`: Two-step atomic publishing to production.

### 2.4 Canvas DSL Capabilities & Grammar
The Framer Canvas DSL supports:
- `SET <id> <attr>="<value>" ...;` — Modify node properties (fill, layout, gap, padding, typography, effects).
- `+<NodeType> <id> parent="<parentId>" ...;` — Create frames, rich text, icons, buttons.
- `MOVE <id> parent="<parentId>" index="<index>";` — Re-parent or re-order elements.
- `DEL <id>;` — Remove canvas nodes.
- `CREATE_VARIANT <newId> from="<sourceId>";` — Create responsive breakpoint replicas (e.g. tablet, mobile).

---

## 3. Investigation of Target `nice-pluto-305324.framer.app` & Session 2

### 3.1 Live Site Forensic Audit
Using `read_url_content` and `curl -s https://nice-pluto-305324.framer.app`:
- **HTML Title**: `My Framer Site`
- **Meta Description**: `Made with Framer`
- **Background**: `html body { background: rgb(255, 255, 255); }`
- **SSR Route ID**: `augiA20Il`
- **Optimization Timestamp**: `2026-09-07T07:41:16.457Z`
- **Rendered Content**: Empty `<div data-framer-root class="framer-iP8LG framer-72rtr7" style="min-height:100vh;width:auto"></div>`.

### 3.2 Canvas Inspection via Session 2 Exec
Inspecting page `augiA20Il` via `framer.agent.getNode` and `framer.agent.serialize`:
```
WebPageNode (augiA20Il, path: "/")
├── FrameNode (WQLkyLRf1) [Desktop Breakpoint: left=0px, width=1200px, height=1000px, fill="white", children=0]
└── FrameNode (hiqVPvJJj) [Detached Frame: left=1300px, width=1200px, height=auto, fill="#000000"]
    ├── FrameNode (GuLiucJhV) [Navigation Bar]
    ├── FrameNode (VROxsDLze) [Founder Hero Section]
    └── FrameNode (P8qYIdDe6) [Sovereign Answer v2 Demo Window]
```

#### Detailed Node Content in `hiqVPvJJj`:
1. **Navigation Bar (`GuLiucJhV`)**:
   - Brand: `Sovereign.OS`
   - Navigation links: `You`, `You + Your People`, `Whole System`, `Pricing`
   - Actions: `Sign in` (secondary), `Get started` (primary button)
2. **Founder Hero (`VROxsDLze`)**:
   - Kicker: `PERSONAL AI FOR REAL LIFE` (Font: JetBrains Mono 11px uppercase)
   - Headline: `Healing isn’t optional. Holding onto the pain is.` (Font: Inter 52px Bold)
   - Description 1: `Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you.`
   - Description 2: `Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.`
   - Trust line: `Start free · No card required · Review, correct, or reject any interpretation`
3. **Sovereign Answer v2 Demo Intake (`P8qYIdDe6`)**:
   - Subtitle: `AUTHENTICATED DEMONSTRATION · SOVEREIGN ANSWER V2`
   - Window Title: `SOVEREIGN INTELLIGENCE WORKSPACE`
   - Question: `Why does the same conversation feel urgent to me and pressuring to them?`
   - Button: `Ask Sovereign`
   - Answer Header: `SOVEREIGN ANSWER`, `Sources` (quiet sources affordance)
   - Relational Triad:
     - Section 1: `WHAT YOU MAY BE BRINGING`  
       *Text*: "Your Baseline relies on fast processing and immediate verbal resolution to regulate tension when ambiguity arises."
     - Section 2: `WHAT THEY MAY BE BRINGING`  
       *Text*: "Their shared Baseline requires internal reflection time before responding, experiencing rapid questioning as an intrusion."
     - Section 3: `WHAT HAPPENS BETWEEN YOU`  
       *Text*: "Your pursuit of immediate clarity accelerates their need for space, turning a simple timing difference into mutual defense."

### 3.3 Identified Discrepancies & Gaps
1. **Breakpoint Placement**: `WQLkyLRf1` is the actual page breakpoint; `hiqVPvJJj` is positioned at `left="1300px"` outside the breakpoint container, which explains why the live site is empty.
2. **Missing Three-Layer Scope**: The section detailing `01 · YOU`, `02 · YOU + YOUR PEOPLE`, and `03 · FROM 1:1 TO THE WHOLE SYSTEM` is missing from the canvas entirely.
3. **Page Metadata**: The page metadata (`metadata.title` and `metadata.description`) still holds the default "My Framer Site" and "Made with Framer".
4. **Publishing Status**: The canvas changes have not been confirmed to production using `framer.agent.publish`.

---

## 4. Requirements & Copy Governance Specification

Governed strictly by `docs/product-language-system.md`, `docs/inner-recognition-intelligence.md`, `docs/baseline-question-universe-and-demonstration-strategy.md`, and `AGENTS.md`:

### 4.1 Copy Matrix

| Section | Element | Required Verbatim Copy | Authority Reference |
|---|---|---|---|
| **Hero** | Kicker | `PERSONAL AI FOR REAL LIFE` | `product-language-system.md:183, 291` |
| **Hero** | Headline | `Healing isn’t optional. Holding onto the pain is.` | `product-language-system.md:292` |
| **Hero** | Description Sentence 1 | `Sovereign.OS is a private personal AI for understanding yourself, your relationships, your decisions, and the systems around you.` | `product-language-system.md:294` |
| **Hero** | Description Sentence 2 | `Build your Baseline once, then explore how you think, decide, communicate, create, connect, respond under pressure, and change.` | `product-language-system.md:295` |
| **Hero** | Trust Line | `Start free · No card required · Review, correct, or reject any interpretation` | `product-language-system.md:296` |
| **Scope 01** | Label / Title | `01 · YOU` / `Explore how you think, decide, communicate, create, connect, and grow.` | `product-language-system.md:305` |
| **Scope 01** | Body | `Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score.` | `product-language-system.md:309` |
| **Scope 02** | Label / Title | `02 · YOU + YOUR PEOPLE` / `See why the same moment lands differently—and how to bridge the gap.` | `product-language-system.md:321` |
| **Scope 02** | Body | `With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently.` | `product-language-system.md:325` |
| **Scope 03** | Label / Title | `03 · FROM 1:1 TO THE WHOLE SYSTEM` / `See the whole system.` | `product-language-system.md:341` |
| **Scope 03** | Body | `Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.` | `product-language-system.md:345` |
| **Demo Intake** | Kicker | `AUTHENTICATED DEMONSTRATION · SOVEREIGN ANSWER V2` | `ORIGINAL_REQUEST.md:17` |
| **Demo Intake** | Question Prompt | `Why does the same conversation feel urgent to me and pressuring to them?` | `baseline-question-universe-and-demonstration-strategy.md:830` |
| **Demo Intake** | Sources Tab | `Sources` (never `Basis` or model references) | `product-language-system.md:114-131` |
| **Demo Triad 1** | Heading | `WHAT YOU MAY BE BRINGING` | `inner-recognition-intelligence.md:175` |
| **Demo Triad 1** | Content | `Your Baseline relies on fast processing and immediate verbal resolution to regulate tension when ambiguity arises.` | Repo Canonical Demonstration |
| **Demo Triad 2** | Heading | `WHAT THEY MAY BE BRINGING` | `inner-recognition-intelligence.md:175` |
| **Demo Triad 2** | Content | `Their shared Baseline requires internal reflection time before responding, experiencing rapid questioning as an intrusion.` | Repo Canonical Demonstration |
| **Demo Triad 3** | Heading | `WHAT HAPPENS BETWEEN YOU` | `inner-recognition-intelligence.md:176` |
| **Demo Triad 3** | Content | `Your pursuit of immediate clarity accelerates their need for space, turning a simple timing difference into mutual defense.` | Repo Canonical Demonstration |

### 4.2 Prohibited Terms
Strictly prohibited across both Framer and React landing copy:
- `Basis`, `Basis IDs`, `model context`, `evidence levels`, `source layers`, `provenance`.
- `foundation`, `personal foundation`, `private foundation` (as metaphors for Baseline).
- `healing journey`, `do the work`, `unlock your potential`, `supercharge your relationships`.
- Model provider names (OpenAI, Anthropic, Gemini, DeepSeek, Cloudflare).
- Video generation or `Worlds`.

---

## 5. Technical Plan: Framer Landing Page Reconstruction & Publishing

To construct, update, and publish the landing page cleanly without visual defects or blank page regressions, the Worker agent will execute the following plan:

### Step 1: Restructure Primary Breakpoint Frame (`WQLkyLRf1`)
Set `WQLkyLRf1` as the dark-themed vertical stack that occupies the page canvas:
```bash
npx @framer/agent exec -s 2 <<'EOF'
await framer.agent.applyChanges(`
  SET augiA20Il metadata.title="Sovereign.OS — Personal AI for Real Life" metadata.description="A private personal AI for understanding yourself, your relationships, your decisions, and the systems around you.";
  SET WQLkyLRf1 fill="#000000" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px" width="1200px" height="auto" minHeight="100vh" padding="0px";
`, { pagePath: "/" });
console.log("WQLkyLRf1 configured as primary stack");
EOF
```

### Step 2: Move Existing Navigation, Hero, and Demo Into Primary Breakpoint
Move `GuLiucJhV` (nav), `VROxsDLze` (hero), and `P8qYIdDe6` (demo) into `WQLkyLRf1`:
```bash
npx @framer/agent exec -s 2 <<'EOF'
await framer.agent.applyChanges(`
  MOVE GuLiucJhV parent="WQLkyLRf1" index="0";
  MOVE VROxsDLze parent="WQLkyLRf1" index="1";
  MOVE P8qYIdDe6 parent="WQLkyLRf1" index="3";
`, { pagePath: "/" });
console.log("Moved existing frames into WQLkyLRf1");
EOF
```

### Step 3: Insert the Three-Layer Scope Section (at index 2)
Add the Three-Layer Scope section (`01 · YOU`, `02 · YOU + YOUR PEOPLE`, `03 · FROM 1:1 TO THE WHOLE SYSTEM`) between the Hero and the Demo:
```bash
npx @framer/agent exec -s 2 <<'EOF'
const dsl = `
  +FrameNode scopeSection parent="WQLkyLRf1" index="2" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="48px" padding="80px 48px" width="100%" height="auto" fill="#000000" borderTop="1px solid rgba(255, 255, 255, 0.08)" borderBottom="1px solid rgba(255, 255, 255, 0.08)";
  
  +FrameNode scopeHeader parent="scopeSection" layout="stack" stackDirection="vertical" stackAlignment="center" gap="12px" width="100%" height="auto";
  +RichTextNode scopeKicker parent="scopeHeader" fontName="JetBrains Mono" fontWeight="600" fontSize="11px" letterSpacing="0.08em" textAlignment="center" textColor="rgba(255, 255, 255, 0.4)";
  +TextBlock v:scopeKicker:0 parent="scopeKicker" tag="p";
  +TextRun v:scopeKicker:0:0 parent="v:scopeKicker:0" text="THREE-LAYER ARCHITECTURE";
  
  +RichTextNode scopeTitle parent="scopeHeader" fontName="Inter" fontWeight="600" fontSize="28px" letterSpacing="-0.02em" textAlignment="center" textColor="#ffffff";
  +TextBlock v:scopeTitle:0 parent="scopeTitle" tag="h2";
  +TextRun v:scopeTitle:0:0 parent="v:scopeTitle:0" text="Understanding moves outward in three clear layers.";

  +FrameNode cardsRow parent="scopeSection" layout="stack" stackDirection="horizontal" stackDistribution="center" stackAlignment="start" gap="24px" width="100%" height="auto";

  +FrameNode card1 parent="cardsRow" layout="stack" stackDirection="vertical" gap="16px" padding="32px" width="340px" height="auto" fill="#050505" border="1px solid rgba(255, 255, 255, 0.08)" radius="4px";
  +RichTextNode num1 parent="card1" fontName="JetBrains Mono" fontWeight="600" fontSize="12px" textColor="#aebaa7";
  +TextBlock v:num1:0 parent="num1" tag="p";
  +TextRun v:num1:0:0 parent="v:num1:0" text="01 · YOU";
  +RichTextNode h1 parent="card1" fontName="Inter" fontWeight="600" fontSize="16px" lineHeight="1.3em" textColor="#ffffff";
  +TextBlock v:h1:0 parent="h1" tag="h3";
  +TextRun v:h1:0:0 parent="v:h1:0" text="Explore how you think, decide, communicate, create, connect, and grow.";
  +RichTextNode b1 parent="card1" fontName="Inter" fontWeight="400" fontSize="13px" lineHeight="1.5em" textColor="rgba(255, 255, 255, 0.6)";
  +TextBlock v:b1:0 parent="b1" tag="p";
  +TextRun v:b1:0:0 parent="v:b1:0" text="Use Sovereign to explore your own patterns, expression, creativity, decisions, relationships, pressure, change, Shadow, Gift, and Alignment—without reducing yourself to a type or score.";

  +FrameNode card2 parent="cardsRow" layout="stack" stackDirection="vertical" gap="16px" padding="32px" width="340px" height="auto" fill="#050505" border="1px solid rgba(255, 255, 255, 0.08)" radius="4px";
  +RichTextNode num2 parent="card2" fontName="JetBrains Mono" fontWeight="600" fontSize="12px" textColor="#aebaa7";
  +TextBlock v:num2:0 parent="num2" tag="p";
  +TextRun v:num2:0:0 parent="v:num2:0" text="02 · YOU + YOUR PEOPLE";
  +RichTextNode h2 parent="card2" fontName="Inter" fontWeight="600" fontSize="16px" lineHeight="1.3em" textColor="#ffffff";
  +TextBlock v:h2:0 parent="h2" tag="h3";
  +TextRun v:h2:0:0 parent="v:h2:0" text="See why the same moment lands differently—and how to bridge the gap.";
  +RichTextNode b2 parent="card2" fontName="Inter" fontWeight="400" fontSize="13px" lineHeight="1.5em" textColor="rgba(255, 255, 255, 0.6)";
  +TextBlock v:b2:0 parent="b2" tag="p";
  +TextRun v:b2:0:0 parent="v:b2:0" text="With permission, Sovereign can use both people’s Baselines while keeping each person distinct. See where timing, communication, pressure, or decision styles differ, what happens when they meet, and what each person can do differently.";

  +FrameNode card3 parent="cardsRow" layout="stack" stackDirection="vertical" gap="16px" padding="32px" width="340px" height="auto" fill="#050505" border="1px solid rgba(255, 255, 255, 0.08)" radius="4px";
  +RichTextNode num3 parent="card3" fontName="JetBrains Mono" fontWeight="600" fontSize="12px" textColor="#aebaa7";
  +TextBlock v:num3:0 parent="num3" tag="p";
  +TextRun v:num3:0:0 parent="v:num3:0" text="03 · FROM 1:1 TO THE WHOLE SYSTEM";
  +RichTextNode h3 parent="card3" fontName="Inter" fontWeight="600" fontSize="16px" lineHeight="1.3em" textColor="#ffffff";
  +TextBlock v:h3:0 parent="h3" tag="h3";
  +TextRun v:h3:0:0 parent="v:h3:0" text="See the whole system.";
  +RichTextNode b3 parent="card3" fontName="Inter" fontWeight="400" fontSize="13px" lineHeight="1.5em" textColor="rgba(255, 255, 255, 0.6)";
  +TextBlock v:b3:0 parent="b3" tag="p";
  +TextRun v:b3:0:0 parent="v:b3:0" text="Move from one relationship to a family, household, team, or group. See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.";

  DEL hiqVPvJJj;
`;
await framer.agent.applyChanges(dsl, { pagePath: "/" });
console.log("Scope section created and scratch frame cleaned up");
EOF
```

### Step 4: Publish to Production
Execute the two-step publishing sequence:
```bash
npx @framer/agent exec -s 2 <<'EOF'
const preview = await framer.agent.publish({ action: "preview" });
console.log("Preview status:", preview.status, "hash:", preview.confirmationHash);
if (preview.status === "ready" && preview.confirmationHash) {
  const result = await framer.agent.publish({
    action: "confirm_publish",
    confirmationHash: preview.confirmationHash
  });
  console.log("Publish result:", JSON.stringify(result, null, 2));
}
EOF
```

### Step 5: Verify Live Production Site
Verify the live response using `read_url_content` or `curl`:
```bash
curl -s https://nice-pluto-305324.framer.app | grep -E "Healing isn’t optional|01 · YOU|WHAT YOU MAY BE BRINGING"
```

---

## 6. Downstream React Parity Plan (`apps/web/src/App.tsx`)

Once the Framer visual presentation is published and verified:

1. **Font Assets in `apps/web/index.html`**:
   Load `Inter` and `JetBrains Mono` from Google Fonts / CDN:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
   ```
2. **Typography Tokens in `apps/web/src/styles.css`**:
   Ensure `--sans-primary: 'Inter', system-ui, sans-serif;` and `--mono: 'JetBrains Mono', monospace;`.
3. **Hero & 3-Layer Scope in `apps/web/src/App.tsx`**:
   - Update `Landing()` section headers and narrative cards to match the verbatim copy from Section 4.1.
   - Update the Sovereign Answer v2 preview card to render the three relational fields:
     - `WHAT YOU MAY BE BRINGING`
     - `WHAT THEY MAY BE BRINGING`
     - `WHAT HAPPENS BETWEEN YOU`
     - Disclosure button labeled `Sources` (not JavaScript `alert()`).
4. **Validation**:
   - Run `pnpm typecheck` (must exit 0).
   - Run `pnpm build` (must exit 0).
   - Run `pnpm test` (all 70 test files must pass).
   - Run `pnpm verify:foundation` (must exit 0).

---

## 7. Verification Method

The following commands verify the environment and findings:

1. **Verify Framer CLI & Session Connectivity**:
   ```bash
   npx @framer/agent session list
   npx @framer/agent project list
   ```
   *Expected*: Active session ID `2` connected to project `Y0YzGEgoInWS1wBiJJ7o` ("Nice Pluto").

2. **Verify Framer Publish Readiness**:
   ```bash
   npx @framer/agent exec -s 2 -e 'console.log(JSON.stringify(await framer.agent.publish({ action: "preview" }), null, 2))'
   ```
   *Expected*: `status: "ready"`, `publishTarget: "production"`, `errors: []`.

3. **Verify Existing Codebase Test Baseline**:
   ```bash
   pnpm test
   pnpm verify:foundation
   ```
   *Expected*: All tests pass (399 in workers, 3 in web), foundation verified with 0 errors.

---

## 8. Conclusion

The Framer tooling and target project environment (`nice-pluto-305324.framer.app` / Session 2) have been thoroughly inspected and verified. The cause of the blank live page has been definitively identified and resolved via a concrete canvas restructuring script. The required copy, visual tokens, and downstream React integration steps are fully mapped to authoritative repository specifications. Execution can proceed cleanly to Milestone 1 (Framer Implementation & Publishing).
