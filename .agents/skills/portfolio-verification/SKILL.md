---
name: portfolio-verification
description: Use when testing or reviewing portfolio changes, checking regressions or performance, or verifying local builds versus Netlify deployment behavior.
---

# Portfolio verification

Read [README authorities/contracts](../../../README.md), the [documentation index](../../../docs/README.md) and [active plan](../../../docs/BUNDLE_OPTIMIZATION_PLAN.md). Code paths are repository-root-relative. Preserve existing edits. Run actual checks before claiming success.

## Match evidence to changes

| Change | Evidence |
| --- | --- |
| TS/compiler settings | Manifest app, spec and Cypress typechecks |
| Template/component behavior | Relevant unit specs; production build for compilation/SSR impact |
| Navigation/motion | Homepage scroll/path/metadata, standalone reload, menu, heading clearance, cancellation, keyboard/history journeys |
| CSS/GUI | Desktop/mobile rendered comparison, overflow/focus, no-JS and reduced-motion states |
| Publication migration | Full citation inventory, selections/authors/categories, research links, eager/lazy bundle comparison |
| Feed | Mocked upstream success/single-item/failure/timeout and frontend loading/fallback tests |
| SSR/cache/deployment | Production output plus separate Netlify checks |

Test meaningful behavior rather than code structure. A stale assertion for a removed placeholder is BUG-01, not grounds to restore it. Do not weaken behavior tests to get green output. Start the app at Cypress's configured base URL before browser journeys.

## Separate verification stages

Local builds/tests prove only what ran locally. For SSR, inspect response HTML as well as hydrated content. For no-JS checks, disable JS in a browser and inspect essential content/ordinary navigation; optional effects may be absent. Do not equate reduced motion with disabled JS.

Netlify verification needs a real Deploy Preview/live URL and deploy identity: direct route requests/refreshes, SSR HTML, `/feed`, redirects and headers/caching. For PWA work, inspect built service-worker assets, registration, controlled reload and updates across builds. Inspect logs/settings only with available access. Registration code and a local build do not prove deployed PWA/SSR health. Verification does not authorize publishing or changing account settings.

Compare equivalent production builds and comparable Lighthouse runs for performance. Keep raw/transfer sizes, LCP element and cold/warm state separate; do not add overlapping estimates or raise budgets. Inventory consumers/side effects before removing scripts/fonts/styles.

## Report and record

Record commands, exit status, counts/failures, environment and evidence. Distinguish new from pre-existing failures. For stalls, record output and stopped/unverified status rather than asserting app failure. Add defects and missing acceptance coverage to the active plan with stable IDs, evidence and exit checks. Close TODOs and register entries together only after verification.
