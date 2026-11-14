# Portfolio presentation and interaction maintenance plan

Status: Draft for future implementation. Documentation consolidation is approved and complete; no new application batch is authorized by this plan alone. Updated November 14, 2026.

The portfolio should feel considered, readable and reliable to visitors. The user considers the current site an acceptable baseline. This plan owns CSS and browser-interaction JavaScript issues, preserves completed fixes, and proposes bounded maintenance when there is a concrete visitor benefit. A Lighthouse score is not its target.

## Contract

### Inputs and triggers

Start from the deployed application source `1e8de2f` and its current real content. Work is triggered by an approved improvement or reproducible usability, accessibility or rendering problem. A lower Lighthouse score alone does not authorize changes.

### Required outputs

For each approved batch: a traceable, scoped change; the relevant pre-test evidence; preserved or explicitly updated behavior; mobile/desktop review evidence; and a focused reviewed commit. This register is the single current authority for presentation and interaction issues. Historical plans supply evidence, not competing instructions.

### Constraints

Follow [README contracts and stylesheet policy](../README.md#engineering-and-design-policy). Keep the current theme, shared visual rules, research content/attribution, lazy popup/bibliography boundaries and intentional homepage navigation/motion. The source of palette values and style load order remains the loaded theme and `angular.json`. Retired `/work` and `/service` pages must stay retired.

### Completion criteria

A batch is complete when its stated visitor-facing outcome and relevant regression checks pass, screenshots/computed styles support its visual claims, and its register entry records results and limits. Completing one batch does not close every pending item or require implementing the optional concept below.

### Out of scope

Score chasing, speculative performance rewrites, dependency upgrades, content/publication restructuring, RSS typing and Netlify/cache tooling. Their remaining records stay in the [completed optimization register](BUNDLE_OPTIMIZATION_PLAN.md). Do not restart the closed Lighthouse investigation without a reproducible user-facing regression or materially new evidence and authorization.

## Existing code trace

| Stage | Owning files | Current behavior / evidence | Existing coverage |
| --- | --- | --- | --- |
| Style cascade | `angular.json`, `src/assets/css/style.css`, component CSS | Bootstrap/theme load before component styles. Theme tokens and global focus/button rules already serve Research. | Image/layout/popup journeys and prior computed-style checks |
| Homepage composition | `src/app/index-page/index-page.component.*` | Hero and seven current content sections; guarded preloader/parallax lifecycle. | Homepage smoke, motion and lifecycle checks |
| Navigation and footer | `src/app/nav-bar/nav-bar.component.*`, `src/app/nav-footer/nav-footer.component.*`, `src/app/shared/scroll-animation.service.ts` | Homepage section scrolling changes the visible path without replacing composition/metadata; direct routes render standalone sections. Guarded global DOM access and JS-only links remain. | `cypress/e2e/navigation.cy.ts`, `cypress/e2e/spec.cy.ts`, adjacent unit specs |
| Research previews | `src/app/home/selected-research/selected-research.component.*`, `src/app/shared/image-popup.ts` | Four image controls, on-demand CDK controller, attributed modal, owned async/lifecycle cleanup and guarded failure fallback. | Research unit specs, `cypress/e2e/research-popup.cy.ts`, production worker tests |
| Other sections | Research overview/journey, About, Blogs, selected/full Publications and Contact components | Existing feature styling and shared theme primitives remain; the broader card/contrast proposal has not been implemented. | Existing content, navigation, image and layout journeys |

Navigation investigation evidence is [historical Phase 1A](BUNDLE_OPTIMIZATION_HISTORY.md#1a-navigation-and-scroll-behavior). Current acceptance criteria remain in README.

## Mandatory pre-test gate for refactoring and migrations

### Baseline and coverage map

For this documentation-only consolidation, runtime refactoring is not applicable. Before any future application refactor, record its actual starting commit, dirty state and affected checks using the [template gate](PLAN_TEMPLATE.md#mandatory-pre-test-gate-for-refactoring-and-migrations). Prior results below are evidence, not a fresh baseline for future code.

| Behavior / contract | Existing tests to reuse | Missing scenario / new test needed | Required pre-change / post-change result |
| --- | --- | --- | --- |
| Navigation, path/metadata, offsets and cancellation | `navigation.cy.ts`, `spec.cy.ts`, navbar/footer/scroll unit specs | For MIG-04, add ordinary-link/no-JS navigation coverage before changing links; existing JS journeys do not prove it. | Existing behavior passes before and after; approved no-JS links work afterward. |
| Responsive and failed-image containment | `layout.cy.ts`, `image-sizing.cy.ts` | Only a newly reproduced gap requires another test. | No document overflow at narrow/desktop widths, including open menu and failed images. |
| Modal accessibility and lifecycle | Research unit specs, `research-popup.cy.ts` | Add coverage only for a newly identified interaction gap. | All images open; keyboard, close/Escape/backdrop, focus, attribution and teardown remain correct. |
| Motion and browser boundaries | Existing hero/reduced-motion journey and lifecycle specs | Evaluate any proposed CSS replacement against actual pointer/device input, offsets and cancellation; equivalence is not yet demonstrated. | Preserve current intentional behavior and SSR guards. |
| Shared style consistency | Existing rendered journeys plus scoped screenshot/computed-style inspection | No permanent test that merely mirrors CSS declarations. | Shared visual rules remain aligned; necessary local exceptions are explained. |

### Characterization and regression sensitivity

- Reuse applicable sensitivity evidence already recorded in history. Add only missing characterization tests, passing on unchanged behavior before a refactor.
- Demonstrate new coverage detects a controlled violation, restore the baseline, then implement. For a bug fix, keep the original failing reproduction and show it passes afterward.
- Record real outcomes and distinguish application failures from browser/tooling failures. Do not label an unavailable baseline as passing.

### Gate result

Not applicable to this documentation-only update. Pending for each future implementation batch; complete the template's baseline, coverage, characterization/sensitivity and failure-accounting checklist before editing the affected runtime code.

## Implementation plan

### Batch 0 — Consolidate authority (this update)

Move current UI records here without changing IDs or losing historical evidence. Update the documentation index, agent reading pointers and TODO validation to recognize both owning registers. Close the Lighthouse concern with its evidence limits. Application behavior remains unchanged.

### Batch 1 — Browser boundary cleanup, if selected

| File / symbol | Responsibility / proposed change | Existing pattern to reuse |
| --- | --- | --- |
| Navbar/footer TypeScript | MIG-02: replace remaining guarded globals with injected browser/document access, preserving behavior | Typed WindowRef, injected DOCUMENT and existing teardown |
| Adjacent specs and navigation journeys | Establish/preserve baseline before the migration | Current offset, history, metadata, cancellation and SSR checks |

1. Trace each remaining access and establish its focused baseline.
2. Migrate only those accesses; retain the existing navigation/motion contract.
3. Run focused checks and the relevant integration checkpoint; review and commit independently.

### Batch 2 — Ordinary navigation without JavaScript, if selected

MIG-04 belongs to navbar HTML/TypeScript and navigation tests. First prove ordinary links work without JS and characterize existing mobile/keyboard/history behavior. Retain the current JS-enhanced section-scroll/path/metadata contract while providing usable ordinary destinations. No routing semantics are changed by this planning update.

### Batch 3 — A justified visual refinement, if selected

For DESIGN-01, identify one inconsistent or confusing section and its visitor-facing benefit before changing it. Reuse the theme's palette, buttons/focus, Bootstrap grid and existing spacing where appropriate. Keep feature layout in its component. Capture the current state, make a bounded change, inspect actual content at mobile/desktop widths, then review one section group before expanding scope. Preserve current scientific figures and attribution.

MIG-05 is an accepted JS enhancement, not a demand to replace working motion. BUG-11 needs work only if reproducible again. Completed rows below are regression obligations, not a queue to reimplement.

## Verification plan

| Check | Invocation / owner | Evidence and status |
| --- | --- | --- |
| This consolidation | Manifest `check:guidance`, register-ID ownership comparison, whitespace check | Fresh results recorded in handoff; no application suites required for comments/docs/validator changes. |
| Future presentation batch | Relevant manifest browser/unit/compiler checks selected from the coverage map | Pending until a batch is selected; explain new coverage before adding it. |
| Visible change | Mobile/desktop screenshots, open-menu/long-caption/error states and computed styles where useful | Required for that batch; include 360px and current real content. |
| SSR/lazy boundary change | Production build and applicable maintained worker checks | Only when the affected batch touches those boundaries. |
| Deployed behavior | Actual source-identified Netlify deployment | User reported `1e8de2f` deployed as `6af887a4392d9b942ebb9cb1`; this planning update performs no deployed interaction sweep. |

Historical verification at `1e8de2f`: 24 affected browser baseline checks, 79 final browser checks, production build and generated worker/guidance checks passed. Earlier popup/retirement integration included 83 unit and 10 cache/helper cases. These are prior results, not new runs for this plan rewrite.

## Approved and pending decisions

| Decision | Status | Rationale / blocking effect |
| --- | --- | --- |
| One plan for CSS and browser-interaction issues | User-approved | This register owns current UI statuses; preserve IDs and link history. |
| Current portfolio is an acceptable baseline; stop score chasing | User-approved | Readability, polish and reliable interaction drive acceptance. Lighthouse concern is closed without claiming no conceivable regression exists. |
| Reuse shared visuals; keep feature layout local; explain exceptions | User-approved | Shared policy lives in README; STYLE-01 already implemented it for Research. |
| Broad navy/white restyling | Pending, optional | The old concept is not implementation approval. Select only with a concrete visitor benefit. |
| CSS replacement for current JS motion | Not approved or required | Preserve the working enhancement unless equivalence is demonstrated. |
| Restore the deleted Map901 WebP | Not decided | PNG remains authoritative in Research. The recoverable WebP is lossy; compare visual quality before any future format decision. This plan does not restore or replace assets. |

Optional earlier reference:

![Earlier navy/white contrast concept](design-references/theme-contrast-sample.png)

This is an illustrative AI-generated concept, not a rendered implementation, content source or acceptance target. The earlier darker hero, open overview columns and compact Experience rows are optional ideas. Do not copy its invented figures, branding, omitted sections or compressed spacing into the site.

## Implementation notes for agents

Read README, the applicable repository skills, this register and the owning template/controller/styles before editing. Follow the loaded cascade; do not edit an unloaded minified copy or create a parallel theme. Source comments route here for these IDs; content/data/deployment/tooling issues remain in the optimization register. Keep issue status in one register and historical evidence in history. Use targeted checks during work and one relevant integration/review checkpoint per batch; do not rerun unchanged suites merely to inflate the checklist.

## Issue and migration register

Open work: MIG-02 and MIG-04. Optional related-edit refinement: DESIGN-01. Accepted enhancement: MIG-05. Monitoring only: BUG-11. All other entries below preserve completed work and its regression requirements.

| ID | Status / evidence | Required outcome / exit check |
| --- | --- | --- |
| MIG-02 | Pending browser-abstraction cleanup. Navbar/footer already inject typed WindowRef but still use guarded global window/document access. | Use injected WindowRef/DOCUMENT consistently without changing navigation, scrolling or SSR behavior; reuse browser/server regressions. |
| MIG-04 | Source-confirmed compatibility exception: seven JS-only navbar hrefs; see Phase 1A. | Equivalent mobile/keyboard/history/metadata behavior plus usable ordinary navigation without JS before adopting replacements. |
| MIG-05 | Source-confirmed JS enhancement: pointer/device parallax and cancellable, latest-action-controlled scroll animations. | Preserve current behavior; evaluate CSS alternatives against actual pointer, offset and cancellation needs. Adopt CSS only when equivalent; absence without JS is acceptable for optional motion. |
| DESIGN-01 | Optional future refinement. Shared palette/focus/buttons and research captions were aligned in `1e8de2f`; other sections retain repeated colors, panels and card treatments. Empty stylesheets alone are not defects. | Consolidate only touched shared rules and feature ownership when a concrete usability/consistency benefit is approved. A navy/white redesign is not required for completion. |
| BUG-11 | Monitoring only. The reported Galaxy S23 whole-page overflow cleared after reload; cause is unknown and current sampled widths pass. | If it returns, capture URL/browser/state and reproduce document overflow before a targeted fix. Preserve the symptom history; do not hide body overflow or blame caching without evidence. |
| STYLE-01 | Resolved locally — shared theme tokens, global focus treatment and `.main-btn` now supply Selected Research visuals; captions share one local typography rule. README owns the user-approved standard and the design skill points to it. Baseline 24/24 and final 79/79 browser cases, build/worker/guidance checks and settled computed-style comparisons pass; reviewed mobile/desktop rendering. | Keep feature layout local, document necessary overrides and reuse shared classes/tokens on related edits. Included in the user-reported production deploy at `1e8de2f`; no fresh deployed interaction sweep claimed. |
| MIG-07 | Resolved locally November 14 after the rollover journey. Removed both retired routes, metadata, legacy components/module and ten exclusive gallery assets; retained the Map901 research image and shared Experience/Publications styles. Retired-route browser and compiled-handler regressions pass; production builds prerender nine routes. | Retain `/404` behavior for retired URLs and remaining route/image/layout/cache tests. Included in the user-reported production deploy at `1e8de2f`; no fresh deployed interaction sweep claimed. |
| BUG-13 | Resolved locally November 14. All four Selected Research images open accessible, attributed previews on Home and Research. CDK controller loads on demand, pending opening is guarded at destruction, and the shared reload guard/fallback handles import failure. Eight research unit cases and nine browser journeys pass. | Retain all-image/caption/geometry, keyboard, dismissal, focus trap/return, teardown and real unavailable-popup fallback coverage. Included in the user-reported production deploy at `1e8de2f`; no fresh deployed interaction sweep claimed. |
| BUG-02 | Resolved locally in fixes #5/#6 for the original Works gallery. Its accessible CDK behavior and regression scenarios are now carried by Research under BUG-13; the legacy page was retired under MIG-07. | Retain native keyboard, close/focus, repeated opening and genuine SPA teardown checks on Research; retain CDK unless a separate measured migration is approved. |
| BUG-03 | Resolved locally in fix #7: footer retains both unlisteners, clears its fade timer, and cancels shared animation at destruction. Teardown and the existing fade-race checks pass. | Retain disposal, detached-click, 200ms fade and back-to-top behavior tests. |
| BUG-04 | Resolved locally in fixes #8/#9: preloader and 404 timeout handles clear at destruction. Positive tests preserve 500ms preloader and 5000ms redirect; SSR starts neither callback. Existing parallax teardown is retained. | Retain late-callback regressions, intended delay and server-guard checks. |
| BUG-05 | Resolved locally including the November 9 P2 follow-up: pending initial anchor restoration now respects native viewport movement as well as shared-animation revisions. A temporary scroll listener remembers movement even when the user returns to the original position; final position comparison covers pending scroll events. Tracking ends on stability/destruction. Native PageDown under a held feed response and all fragment cases pass. | Retain the six fragment journeys, newer-section and native-scroll hydration cases, move-away/return unit test and listener cleanup coverage. Netlify verification remains separate. |
| BUG-06 | Resolved locally in fix #4: overflow-wrap:anywhere on research captions removes their oversized min-content width. Home/Research at 360/390px and desktop pass; the legacy Works gallery was later retired under MIG-07. | Retain document-width and open-popup containment checks and readable attribution at narrow widths. |
| BUG-08 | Resolved locally in fix #2: NavigationStart cancels shared animations; animation generations reject stale queued frames and protect pending initial-anchor restoration from newer intent. Non-fragment destinations open at top even during hydration. Both interruption regressions pass. | Retain latest-click, route/history interruption, stale-frame and delayed-initial-scroll tests; do not remove animations. |
| BUG-09 | Resolved locally November 8: measure the fixed navigation height directly; its absolute mobile menu contributes no layout height. Paired open/closed unit regression reproduced 639px instead of 409px before the fix and now passes. All seven mobile and seven desktop keyboard destinations pass, including clearance, active item, menu close, URL replacement and retained homepage metadata. | Retain geometry and browser regressions. Existing fragment/route-animation defects are BUG-05/08, not closed by this offset fix; deployed Netlify behavior remains separately unverified. |
| BUG-10 | Resolved locally in fix #10: one root main wraps routed content; five standalone wrappers use div rather than nested main. Production checks find exactly one main on ten routes, outside navbar/footer. Homepage Lighthouse accessibility is 100 in the sampled local run. | Retain shell/route landmark tests. Automated results do not replace manual accessibility checks or other-browser verification. |
| BUG-12 | Addressed during the image-sizing batch. Adding intrinsic dimensions exposed mobile research-grid overflow when image requests fail (696px document at a 345px content viewport). Saved pre-change production control remains contained, so this does not establish BUG-11's cause. Setting `min-width: 0` on research study and figure grid items removes the constraint; nine targeted browser cases pass. | Retain failed/unloaded-image containment, intrinsic-dimension and loaded-aspect-ratio regressions; see [image-sizing evidence](BUNDLE_OPTIMIZATION_HISTORY.md#performance-follow-up--image-sizing-verified-on-preview-november-13-2026). Do not mask whole-document overflow. |
| PERF-01 | Resolved locally in the November 9 performance pass: WOFF2 first, WOFF fallback; generated preload and Chrome request use the same 71,516-byte WOFF2. All 464 glyphs, outlines, metrics, mappings and license metadata match the original. Chrome and Firefox icon rendering checked. | Retain font source/fallback files and complete glyphs. Safari remains unverified. Vendor/native configuration files are indexed here rather than receiving authored-code TODO comments. |
| VERIFY-04 | Maintained test-tool exception. Installed Cypress omits part of native Enter activation; the scoped Chromium helper delivers the trusted sequence. Research native-keyboard checks pass. | Keep native keyboard coverage without an application key-handler workaround. Other-browser helper paths remain unverified. |

## Results and handoff

Documentation consolidation is complete; the runtime plan remains Draft until an implementation batch is chosen. Nineteen UI records moved here with their IDs preserved; the union of both registers retains all 35 original IDs without duplicate ownership. The old register links here, and TODO/skill reading pointers follow ownership.

Fresh checks: guidance baseline passed; moving IDs exposed the old checker's single-register assumption (expected failure), then the updated two-register checker passed. Controlled unknown-ID and duplicate-ID probes both failed as intended and were removed/restored before the final passing check. Guidance validates four skills and their local reading targets. JavaScript syntax and whitespace checks pass. Source/test comparison confirmed all 14 application/browser-test file edits change reading comments only; no runtime suites were rerun for this update. Evidence: ignored `tmp/plan-consolidation-red.log` and `tmp/plan-consolidation-validation.json`. Independent review found no actionable issue and independently confirmed guidance, whitespace and exact ID preservation. No CSS/JS behavior, asset, dependency, deployment or Netlify setting is changed by this update.

The Lighthouse score concern is closed by the user after reviewing the reports: no regression was established from that pair, and no score-based rewrite or mandatory benchmark rerun is requested. Preserve the [measurement evidence and closure](PERFORMANCE_CLOSEOUT_REPORT.md).
