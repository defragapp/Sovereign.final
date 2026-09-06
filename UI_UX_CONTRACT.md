# Sovereign.OS UI/UX Contract

## Purpose

The interface should feel like one quiet product before and after sign-in. The AI conversation is the center of gravity.

## Visual grammar

Reference the supplied Vercel page only for restraint: dark field, typography-first composition, minimal navigation, one dominant product moment. Do not clone its logo, layout, or copy.

Sovereign identity:

- near-black foundation;
- warm cream primary text;
- muted gray secondary text;
- restrained sage accent;
- 1px low-contrast dividers;
- rounded 20–28px surfaces where a surface is genuinely needed;
- no glassmorphism-heavy dashboard treatment;
- no animated gradients;
- no decorative 3D hero art.

## Component approach

Use shadcn/ui's source-owned component model for controls and primitives. Keep the component set intentionally small:

- Button
- Input
- Textarea
- Dialog/Sheet for progressive context
- Dropdown/Menu for account actions
- Tooltip only where an icon genuinely needs explanation
- Separator
- Skeleton

Build higher-level Sovereign components from those primitives rather than importing an entire UI system.

## Public landing

The landing page must communicate:

**Private personal AI for real life.**

**Understand yourself. Understand your people. See the whole system.**

A visitor should see a real representation of the product, not a marketing illustration of an AI product.

## Auth

Auth screen = one task. Do not expose full product navigation.

Required states:

- email entry;
- submitting;
- sent;
- invalid/expired link;
- Turnstile challenge where required;
- rate limited;
- unexpected failure.

## Workspace

Desktop:

- header with Sovereign wordmark and compact account control;
- conversation column centered within a generous max width;
- no permanent card grid;
- composer anchored to the bottom of the conversation region.

Mobile:

- safe-area aware composer;
- 44px minimum touch targets;
- no side rail by default;
- context/actions presented in sheet/dialog;
- conversation remains the full-screen focus.

## Answer

Answers should read like a carefully written response, not a data panel.

Visual hierarchy:

`headline → direct answer → supporting sections → useful action → source details`

Use whitespace rather than boxes to separate answer sections.

Source details should be a disclosure pattern. Do not show raw IDs.

## Empty state

The empty workspace should ask a human question, not explain the architecture.

Approved examples:

- “What is happening in your life right now?”
- “What are you trying to make sense of?”
- “What keeps coming up?”

Suggested prompts are examples only; they must not become a dashboard card grid.

## Loading

Use a subtle text/line treatment or skeleton close to the answer location. Avoid pulsing robot icons, typing simulations, and repeated spinners.

## Error/capacity

An infrastructure failure must never look like an AI answer.

Use plain messages such as:

> “Sovereign is temporarily unavailable. Nothing was saved as a completed interpretation.”

For rate limiting:

> “You’ve reached the current request limit. Please try again later.”

## Accessibility

- keyboard reachable controls;
- visible focus states;
- semantic headings;
- labels for all form fields;
- `aria-label` for icon-only actions;
- sufficient text contrast;
- reduced-motion support;
- no interaction dependent on hover;
- mobile controls remain reachable above the software keyboard.
