# Handoff Report: Language and Copy Remediation for apps/web/src/App.tsx (Explorer Fix 1)

## 1. Observation

Direct inspection of `apps/web/src/App.tsx`, `AGENTS.md`, and authoritative documentation in `docs/product-language-system.md`, `docs/inner-recognition-intelligence.md`, and `apps/web/src/SovereignIntelligenceWorkspace.tsx` reveals:

1. **Item 1 (Line 1594 in `apps/web/src/App.tsx`)**:
   - Verbatim code at lines 1593–1595:
     ```tsx
     <div className="mt-2 text-center font-utility text-[10px] text-[var(--subtle)]">
       Private by default · Model context is restricted to consenting data
     </div>
     ```
   - Violation: Contains `"Model context"`.
   - Contract citations:
     - `AGENTS.md` line 15: *"User-facing language should be plain, direct, and centered on what the product helps a person do. Do not expose internal implementation terms such as Basis IDs, model/provider identifiers, sovereign-answer.v2, or model-safe context."*
     - `docs/product-language-system.md` line 585: Retired/prohibited list: *"`server-approved`, `authorized references`, `provenance`, `evidence levels`, or `model context` as ordinary UI language;"*.

2. **Item 2 (Line 1691 in `apps/web/src/App.tsx`)**:
   - Verbatim code at lines 1690–1692:
     ```tsx
     <p className="font-explanation text-xs max-w-md mx-auto">
       When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who holds tension, how authority flows, and where recurring loops repeat.
     </p>
     ```
   - Violation: Contains prohibited Systems dimension `"how authority flows"`.
   - Contract citations:
     - `docs/product-language-system.md` line 71: *"`Authority` and `missing perspective` are not canonical product intelligence dimensions. Do not infer an absent person's perspective or turn non-participation into a hidden-state claim."*
     - `docs/product-language-system.md` line 603: Retired/prohibited list: *"`authority` or `missing perspective` as canonical Systems intelligence dimensions;"*.
     - `docs/product-language-system.md` line 356: Representative public question: *"`How does pressure move through this team?`"*.
     - `docs/product-language-system.md` line 529: Canonical Systems surface description: *"`See who is involved, what each person is responsible for, where pressure builds, how people respond to one another, and what may change when one person responds differently.`"*.

3. **Item 3 (Line 1584 in `apps/web/src/App.tsx`)**:
   - Verbatim code at line 1584:
     ```tsx
     placeholder="Ask Sovereign about your life..."
     ```
   - Violation: Contains prohibited phrase variant `"about your life"`.
   - Contract citations:
     - `docs/product-language-system.md` line 595: Retired/prohibited list: *"`Ask about your life.`; `Ask about your life. Get an answer built around you.`;"*.
     - `apps/web/src/SovereignIntelligenceWorkspace.tsx` line 2293 (proven runtime): `return 'Ask Sovereign…';`.
     - `apps/web/src/LandingParity.test.ts` line 64: verifies `expect(appTsx).toContain('Ask Sovereign');`.

4. **Item 4 (Line 1453 in `apps/web/src/App.tsx`)**:
   - Verbatim code at lines 1452–1454:
     ```tsx
     <h1 className="font-statement text-3xl md:text-5xl text-[var(--cream)] max-w-lg">
       What would you like to understand?
     </h1>
     ```
   - Violation: Contains non-canonical Today heading `"What would you like to understand?"`.
   - Contract citations:
     - `docs/product-language-system.md` lines 597–599: Retired/prohibited list: *"`What do you want to understand?`; generic variants such as `What would you like to explore?`, `Ask anything.`, or `Tell me what's on my mind.`;"*.
     - `docs/product-language-system.md` lines 511–514: Authenticated surfaces canonical copy:
       - Today heading: `What is active for you now?`
       - Today subhead: `Begin with what remains steady in your Baseline, then see what may be louder today.`

5. **Tool Results**:
   - `git apply --check /.agents/teamwork_preview_explorer_fix_1/fix_1_language_copy.patch` exited with status 0.
   - `pnpm test` and `pnpm --filter @sovereign/web test` pass with 100% success (10/10 web tests, 399/399 worker tests).
   - `pnpm verify:foundation` passed with 0 errors.

---

## 2. Logic Chain

1. **Item 1 (Line 1594)**:
   - Observation 1 demonstrates that `"Model context"` is explicitly prohibited in user-facing UI by `AGENTS.md` and `docs/product-language-system.md` line 585.
   - The phrase `"Private by default"` is a standard, canonical security anchor across repo documentation (`docs/privacy-data-flow-register.md:11`).
   - The user instruction suggests `"Private by default · Sovereign uses only consented data"`.
   - Therefore, replacing `"Private by default · Model context is restricted to consenting data"` with `"Private by default · Sovereign uses only consented data"` eliminates the prohibited internal term and aligns with product boundaries.

2. **Item 2 (Line 1691)**:
   - Observation 2 demonstrates that `"authority"` is expressly prohibited as a Systems intelligence dimension by `docs/product-language-system.md` lines 71 and 603.
   - Canonical Systems intelligence dynamics in `docs/product-language-system.md` focus on pressure movement and relational response (line 356: `"How does pressure move through this team?"`; line 529: `"where pressure builds, how people respond to one another"`).
   - Therefore, replacing `"how authority flows"` with `"how pressure moves"` directly eliminates the forbidden dimension while maintaining the rhythmic parallel structure (`"who holds tension, how pressure moves, and where recurring loops repeat"`).

3. **Item 3 (Line 1584)**:
   - Observation 3 demonstrates that `"Ask about your life."` and its variants are prohibited by `docs/product-language-system.md` line 595.
   - The proven runtime in `apps/web/src/SovereignIntelligenceWorkspace.tsx` line 2293 uses `composerPlaceholder()` which returns `'Ask Sovereign…'`.
   - Therefore, updating the placeholder in `apps/web/src/App.tsx` from `"Ask Sovereign about your life..."` to `"Ask Sovereign…"` removes the prohibited phrase and achieves complete consistency with the proven workspace.

4. **Item 4 (Line 1453)**:
   - Observation 4 demonstrates that `"What do you want to understand?"` and generic variations are prohibited by `docs/product-language-system.md` lines 597–599.
   - `docs/product-language-system.md` line 513 explicitly prescribes the canonical heading for the Today authenticated surface: `"What is active for you now?"`.
   - Therefore, replacing `"What would you like to understand?"` with `"What is active for you now?"` implements canonical documentation authority.

---

## 3. Caveats

1. **Read-Only Scope**: In accordance with the Explorer archetype rules, no source files outside `.agents/teamwork_preview_explorer_fix_1` were modified. The patch has been formatted and tested via dry-run (`git apply --check`).
2. **Subhead at Lines 1455–1457**: The user request specifically targets line 1453 (the Today heading). Lines 1455–1457 currently read: *"Ask in ordinary language. Sovereign answers from your private Baseline, surfaces active dynamics, and keeps unknowns explicit."* While valid, `docs/product-language-system.md` line 514 provides an alternative subhead (*"Begin with what remains steady in your Baseline, then see what may be louder today."*). The implementer may keep or update the subhead according to the broader page context.

---

## 4. Conclusion

The exact, canonical replacement text and syntax for the 4 violations are:

1. **Line 1594**:
   - **Before**:
     ```tsx
     Private by default · Model context is restricted to consenting data
     ```
   - **After**:
     ```tsx
     Private by default · Sovereign uses only consented data
     ```
   *(Alternative plain-language variant per line 97: `Private by default · Sovereign uses only what you choose to share`)*

2. **Line 1691**:
   - **Before**:
     ```tsx
     When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who holds tension, how authority flows, and where recurring loops repeat.
     ```
   - **After**:
     ```tsx
     When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. Sovereign maps who holds tension, how pressure moves, and where recurring loops repeat.
     ```
   *(Alternative full canonical variant per line 529: `When three or more people interact, the dynamic shifts from pairwise communication into systemic equilibrium. See who is involved, where pressure builds, and how people respond to one another.`)*

3. **Line 1584**:
   - **Before**:
     ```tsx
     placeholder="Ask Sovereign about your life..."
     ```
   - **After**:
     ```tsx
     placeholder="Ask Sovereign…"
     ```

4. **Line 1453**:
   - **Before**:
     ```tsx
     What would you like to understand?
     ```
   - **After**:
     ```tsx
     What is active for you now?
     ```

All replacements are pre-packaged in the verified patch file:
`/Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_fix_1/fix_1_language_copy.patch`

---

## 5. Verification Method

1. **Verify Dry-Run Application**:
   ```bash
   git apply --check /Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_fix_1/fix_1_language_copy.patch
   ```
   *Expected result*: Exit code 0 with no errors.

2. **Apply Patch**:
   ```bash
   git apply /Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_fix_1/fix_1_language_copy.patch
   ```

3. **Run Web and Workspace Test Suites**:
   ```bash
   pnpm --filter @sovereign/web test
   pnpm test
   pnpm verify:foundation
   ```
   *Expected result*: All suites pass with 0 failures.

4. **Prohibited Term Scan on `apps/web/src/App.tsx`**:
   ```bash
   rg -i "Model context|authority|about your life|What would you like to understand" apps/web/src/App.tsx
   ```
   *Expected result*: Zero matches found.
