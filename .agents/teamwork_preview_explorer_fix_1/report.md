# Sovereign.OS Milestone 3 Remediation: Language & Copy Compliance Report (Explorer Fix 1)

## 1. Executive Summary

Reviewer 2 identified four language and copy violations in `apps/web/src/App.tsx`:
1. **Line 1594**: Contains the prohibited internal implementation term `"Model context"` in authenticated chat footer microcopy (`"Private by default · Model context is restricted to consenting data"`).
2. **Line 1691**: Contains the expressly retired and prohibited Systems dimension `"how authority flows"` in the Systems view card.
3. **Line 1584**: Contains the prohibited user-facing placeholder phrase variant `"Ask Sovereign about your life..."` in the Today composer.
4. **Line 1453**: Contains the non-canonical Today heading `"What would you like to understand?"` (a prohibited generic variant of `"What do you want to understand?"`).

This investigation cross-referenced `docs/product-language-system.md`, `docs/inner-recognition-intelligence.md`, and `AGENTS.md` to formulate exact, canonical replacements and verify them against the codebase and test suite.

A machine-applicable patch has been prepared at:
`/.agents/teamwork_preview_explorer_fix_1/fix_1_language_copy.patch`

---

## 2. Documentation Authority & Precedence

Per `docs/product-language-system.md` (lines 17–28):
1. `docs/product-language-system.md` governs user-facing language, voice, terminology, and explanatory sequence.
2. `launch-product-contract.md` governs the included product and approval boundary.
3. `inner-recognition-intelligence.md` governs intelligence, answer, and Basis behavior.
4. `AGENTS.md` establishes core product boundaries:
   - *"User-facing language should be plain, direct, and centered on what the product helps a person do. Do not expose internal implementation terms such as Basis IDs, model/provider identifiers, sovereign-answer.v2, or model-safe context."*

---

## 3. Detailed Violation Analysis & Canonical Formulations

### Item 1: Authenticated Chat Microcopy (Line 1594)

- **Target File**: `apps/web/src/App.tsx`, lines 1593–1595
- **Current Text**:
  ```tsx
  <div className="mt-2 text-center font-utility text-[10px] text-[var(--subtle)]">
    Private by default · Model context is restricted to consenting data
  </div>
  ```
- **Violations Identified**:
  - `AGENTS.md` line 15: Prohibits exposing internal implementation terms including `"model-safe context"`.
  - `docs/product-language-system.md` line 585: Explicitly forbids `'model context'` as ordinary UI language (`"Never use these as active product/interface language: ... 'server-approved', 'authorized references', 'provenance', 'evidence levels', or 'model context' as ordinary UI language"`).
- **Canonical Replacement**:
  ```tsx
  <div className="mt-2 text-center font-utility text-[10px] text-[var(--subtle)]">
    Private by default · Sovereign uses only consented data
  </div>
  ```
- **Approved Plain-Language Variant** (Grounding: `docs/product-language-system.md` line 97: *"uses only what each person chose to share"*):
  ```tsx
  <div className="mt-2 text-center font-utility text-[10px] text-[var(--subtle)]">
    Private by default · Sovereign uses only what you choose to share
  </div>
  ```
- **Rationale**:
  - Eliminates the forbidden technical phrase `"Model context"`.
  - Centers user-facing language on what Sovereign does in plain terms.
  - Maintains the established `"Private by default · "` security posture.

---

### Item 2: Systems Relational Dynamics Dimension (Line 1691)

- **Target File**: `apps/web/src/App.tsx`, lines 1690–1692
- **Current Text**:
  ```tsx
  <p className="font-explanation text-xs max-w-md mx-auto">
    When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who holds tension, how authority flows, and where recurring loops repeat.
  </p>
  ```
- **Violations Identified**:
  - `docs/product-language-system.md` lines 71–72:
    *"`Authority` and `missing perspective` are not canonical product intelligence dimensions. Do not infer an absent person's perspective or turn non-participation into a hidden-state claim."*
  - `docs/product-language-system.md` line 603: Under **Retired and prohibited phrasing**:
    *"`authority` or `missing perspective` as canonical Systems intelligence dimensions;"*
- **Cross-Reference Authority**:
  - `docs/product-language-system.md` lines 353–356:
    *Representative public questions:*
    - `What role am I actually playing in this family?`
    - `What changes when I stop playing the role everyone expects?`
    - `How does pressure move through this team?` (identifies **how pressure moves**)
  - `docs/product-language-system.md` line 529:
    *Systems authenticated description:*
    `"See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently."`
- **Canonical Replacement (Recommended Surgical Replacement)**:
  Replace `"how authority flows"` with `"how pressure moves"`:
  ```tsx
  <p className="font-explanation text-xs max-w-md mx-auto">
    When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who holds tension, how pressure moves, and where recurring loops repeat.
  </p>
  ```
- **Canonical Replacement (Full Canonical Line 529 Description Variant)**:
  ```tsx
  <p className="font-explanation text-xs max-w-md mx-auto">
    When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. See who is involved, where pressure builds, and how people respond to one another.
  </p>
  ```
- **Rationale**:
  - Eliminates the prohibited term `"authority"`.
  - Replaces it with the canonical Systems intelligence dimension of pressure dynamics (`"how pressure moves"` per line 356 and `"where pressure builds"` per line 529).

---

### Item 3: Composer Placeholder (Line 1584)

- **Target File**: `apps/web/src/App.tsx`, line 1584
- **Current Text**:
  ```tsx
  placeholder="Ask Sovereign about your life..."
  ```
- **Violations Identified**:
  - `docs/product-language-system.md` line 595: Explicitly retired and prohibited:
    *"- `Ask about your life.`;"*
    *"- `Ask about your life. Get an answer built around you.`;"*
  - `docs/product-language-system.md` line 599: Forbids generic marketing variants.
- **Cross-Reference Authority**:
  - `apps/web/src/SovereignIntelligenceWorkspace.tsx` line 2292–2294 (proven runtime workspace):
    ```ts
    function composerPlaceholder(surface: Surface) {
      return 'Ask Sovereign…';
    }
    ```
  - `apps/web/src/LandingParity.test.ts` line 64: Enforces `'Ask Sovereign'`.
- **Canonical Replacement**:
  ```tsx
  placeholder="Ask Sovereign…"
  ```
  *(or with ASCII three dots: `placeholder="Ask Sovereign..."`)*
- **Rationale**:
  - Removes the prohibited `"about your life"` phrasing.
  - Achieves exact runtime parity with `SovereignIntelligenceWorkspace.tsx`.
  - Simple, direct, and unencumbered by prohibited lifestyle marketing idioms.

---

### Item 4: Today Surface Heading (Line 1453)

- **Target File**: `apps/web/src/App.tsx`, lines 1452–1454
- **Current Text**:
  ```tsx
  <h1 className="font-statement text-3xl md:text-5xl text-[var(--cream)] max-w-lg">
    What would you like to understand?
  </h1>
  ```
- **Violations Identified**:
  - `docs/product-language-system.md` lines 597–599: Explicitly retired and prohibited:
    *"- `What do you want to understand?`;"*
    *"- generic variants such as `What would you like to explore?`, `Ask anything.`, or `Tell me what's on my mind.`;"*
  - `"What would you like to understand?"` is a direct generic variant of the retired headline.
- **Cross-Reference Authority**:
  - `docs/product-language-system.md` lines 511–514 explicitly defines the authenticated Today surface canonical language:
    ```markdown
    Authenticated surfaces

    Today:

    - `What is active for you now?`
    - `Begin with what remains steady in your Baseline, then see what may be louder today.`
    ```
- **Canonical Replacement (Heading)**:
  ```tsx
  <h1 className="font-statement text-3xl md:text-5xl text-[var(--cream)] max-w-lg">
    What is active for you now?
  </h1>
  ```
- **Accompanying Subhead Alignment (Optional/Recommended for lines 1455–1457)**:
  Currently:
  ```tsx
  <p className="font-explanation text-sm max-w-lg">
    Ask in ordinary language. Sovereign answers from your private Baseline, surfaces active dynamics, and keeps unknowns explicit.
  </p>
  ```
  Aligning strictly with line 514:
  ```tsx
  <p className="font-explanation text-sm max-w-lg">
    Begin with what remains steady in your Baseline, then see what may be louder today.
  </p>
  ```

---

## 4. Unified Diff Patch Specification

The machine-applicable patch file is located at:
`/.agents/teamwork_preview_explorer_fix_1/fix_1_language_copy.patch`

Content:
```diff
diff --git a/apps/web/src/App.tsx b/apps/web/src/App.tsx
index d1b72e5..1234567 100644
--- a/apps/web/src/App.tsx
+++ b/apps/web/src/App.tsx
@@ -1450,7 +1450,7 @@ export function App() {
                   <div className="relative z-10 space-y-3">
                     <p className="font-utility text-[var(--sage)]">TODAY</p>
                     <h1 className="font-statement text-3xl md:text-5xl text-[var(--cream)] max-w-lg">
-                      What would you like to understand?
+                      What is active for you now?
                     </h1>
                     <p className="font-explanation text-sm max-w-lg">
                       Ask in ordinary language. Sovereign answers from your private Baseline, surfaces active dynamics, and keeps unknowns explicit.
@@ -1581,7 +1581,7 @@ export function App() {
                         send();
                       }
                     }}
-                    placeholder="Ask Sovereign about your life..."
+                    placeholder="Ask Sovereign…"
                     className="min-h-12 border-0 bg-transparent px-2 py-2 shadow-none focus:ring-0 text-sm text-[var(--cream)]"
                     disabled={sending}
                   />
@@ -1591,7 +1591,7 @@ export function App() {
                 </div>
               </div>
               <div className="mt-2 text-center font-utility text-[10px] text-[var(--subtle)]">
-                Private by default · Model context is restricted to consenting data
+                Private by default · Sovereign uses only consented data
               </div>
             </div>
           </div>
@@ -1688,7 +1688,7 @@ export function App() {
               <ReferenceField className="mx-auto w-80 h-48 opacity-30" />
               <div className="font-statement text-lg text-[var(--cream)]">Interconnected Relational Dynamics</div>
               <p className="font-explanation text-xs max-w-md mx-auto">
-                When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who holds tension, how authority flows, and where recurring loops repeat.
+                When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who holds tension, how pressure moves, and where recurring loops repeat.
               </p>
               <button
                 onClick={() => {
```

---

## 5. Verification & Safety Assessment

1. **Patch Syntax & Applicability**: Verified with `git apply --check /.agents/teamwork_preview_explorer_fix_1/fix_1_language_copy.patch` (exit code 0, cleanly applies).
2. **Prohibited Terms Audit**:
   - Eliminates `"Model context"` (AGENTS.md, docs/product-language-system.md:585).
   - Eliminates `"how authority flows"` (docs/product-language-system.md:71, 603).
   - Eliminates `"about your life"` (docs/product-language-system.md:595).
   - Eliminates `"What would you like to understand?"` (docs/product-language-system.md:597-599).
3. **Regression Safety**:
   - `apps/web/src/LandingParity.test.ts` prohibits terms like `'model-safe context'`, `'Ask about your life'`. The proposed replacements directly strengthen compliance with this suite.
   - `LandingParity.test.ts` verifies `'Ask Sovereign'` (line 64), which matches the updated placeholder.
   - No unit or contract tests depend on the four retired strings.
