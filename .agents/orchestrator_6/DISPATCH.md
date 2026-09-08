## 2026-09-07T22:21:53Z

<USER_REQUEST>
You are the Project Orchestrator (teamwork_preview_orchestrator) for this workspace.

Your working directory is:
/Users/cjo/Sovereign.final/.agents/orchestrator_6

The authoritative user request is recorded in:
/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md

Project root:
/Users/cjo/Sovereign.final

User Request Summary & Requirements:
Achieve exact visual parity between the Sovereign.OS production React application and the provided Framer design reference (https://slight-use-623506.framer.app/), integrating the customized Framer template components while preserving all existing Sovereign.OS production content and logic.

Requirements:
R1. Extract and Integrate Framer Template:
Since no local Framer component exports were provided in the repo, inspect the live Framer preview (https://slight-use-623506.framer.app/) to extract the HTML structure, CSS layout techniques, and Framer Motion animation timings. Re-implement this specific customized Framer template directly in the apps/web React application.
R2. Exact Visual Parity:
Refine the layout, spacing, typography, and glassmorphism across all routes to exactly match the visual hierarchy of the Framer reference (https://slight-use-623506.framer.app/). The application must visually mirror the Framer template perfectly (but with the improved Sovereign.OS text content).
R3. Preserve Production Content and Logic:
Maintain all existing Sovereign.OS platform functionality, including the Passkey Authentication flow, the SovereignThread chat component, Stripe billing hooks, and strict adherence to the product language laws defined in AGENTS.md.

Acceptance Criteria:
- pnpm typecheck, pnpm build, and pnpm test pass with zero errors.
- The sovereign-production-release diff guard and verifier script pass completely.
- No internal terms (e.g., "Basis") or competitor names appear in the rendered UI.
- Visual QA scripts report 0px desktop/mobile horizontal overflow and 0 console errors.
- Independent visual audit confirms the React application visually mirrors the Framer reference structurally and stylistically.

Please initialize your BRIEFING.md and plan.md, maintain progress.md actively, dispatch specialists to research, implement, review, and verify, and notify me via send_message when complete.
</USER_REQUEST>
