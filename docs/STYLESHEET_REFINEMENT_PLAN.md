# Portfolio presentation and interaction maintenance plan

Status: Planned — required visual implementation remains incomplete. Previously implemented maintenance work is locally verified and uncommitted. On November 14, 2026, the user clarified that the navy/white reference is the final design goal and instructed plan changes only. Do not implement, commit, push or deploy under this planning request.

The portfolio should feel considered, readable and reliable to visitors, following the required navy/white visual reference below. The existing site is the functional baseline, not the final visual destination. This plan owns CSS and browser-interaction JavaScript issues, preserves completed fixes, and proposes bounded maintenance when there is a concrete visitor benefit. A Lighthouse score is not its target.

## Contract

### Inputs and triggers

Implementation started from clean `d8c815d` (the application behavior of deployed `1e8de2f`, followed by the documentation consolidation). Preserve the current real content. Work is triggered by an approved improvement or reproducible usability, accessibility or rendering problem. A lower Lighthouse score alone does not authorize changes.

### Required outputs

For each batch: a traceable, scoped change; relevant pre-test evidence; preserved or explicitly updated behavior; mobile/desktop review evidence; and an uncommitted patch for the user's review. No commit or push is authorized before that review. This register is the single current authority for presentation and interaction issues.

### Constraints

Follow [README contracts and stylesheet policy](../README.md#engineering-and-design-policy). Adopt the required reference’s navy/white contrast, purple accents and composition while reusing shared visual rules and preserving research content/attribution, lazy popup/bibliography boundaries and intentional homepage navigation/motion. The source of palette values and style load order remains the loaded theme and `angular.json`. Retired `/work` and `/service` pages must stay retired.

### Completion criteria

A batch is complete when its stated visitor-facing outcome and relevant regression checks pass, screenshots/computed styles support its visual claims, and its register entry records results and limits. Overall completion also requires the visual-reference acceptance checks in Batch 4. Passing functional tests or completing maintenance batches does not establish visual completion.

### Out of scope

Score chasing, speculative performance rewrites, dependency upgrades, content/publication restructuring, RSS typing and Netlify/cache tooling. Their remaining records stay in the [completed optimization register](BUNDLE_OPTIMIZATION_PLAN.md). Do not restart the closed Lighthouse investigation without a reproducible user-facing regression or materially new evidence and authorization.

## Existing code trace

| Stage | Owning files | Current behavior / evidence | Existing coverage |
| --- | --- | --- | --- |
| Style cascade | `angular.json`, `src/assets/css/style.css`, component CSS | Bootstrap/theme load before component styles. Shared palette, focus/button and section-label rules serve the touched sections; feature layout remains local. | Image/layout/popup journeys and prior computed-style checks |
| Homepage composition | `src/app/index-page/index-page.component.*` | Hero and seven current content sections; guarded preloader/parallax lifecycle. | Homepage smoke, motion and lifecycle checks |
| Navigation and footer | `src/app/nav-bar/nav-bar.component.*`, `src/app/nav-footer/nav-footer.component.*`, `src/app/shared/scroll-animation.service.ts` | Homepage section scrolling changes the visible path without replacing composition/metadata; direct routes render standalone sections. Typed browser/document ownership, ordinary destinations, modifier-safe enhancement and declarative active state now cover both JS and no-JS navigation. | `cypress/e2e/navigation.cy.ts`, `cypress/e2e/spec.cy.ts`, adjacent unit specs |
| Research previews | `src/app/home/selected-research/selected-research.component.*`, `src/app/shared/image-popup.ts` | Four image controls, on-demand CDK controller, attributed modal, owned async/lifecycle cleanup and guarded failure fallback. | Research unit specs, `cypress/e2e/research-popup.cy.ts`, production worker tests |
| Other sections | Research overview/journey, About, Blogs, selected/full Publications and Contact components | Existing feature styling and shared theme primitives remain; scoped open-layout refinement is implemented; the required navy/white target has not yet been implemented. | Existing content, navigation, image and layout journeys |

Navigation investigation evidence is [historical Phase 1A](BUNDLE_OPTIMIZATION_HISTORY.md#1a-navigation-and-scroll-behavior). Current acceptance criteria remain in README.

## Mandatory pre-test gate for refactoring and migrations

### Baseline and coverage map

Current implementation baseline: clean master at `d8c815d`. Fresh existing unit checks pass 83/83 and existing browser journeys pass 79/79 (`tmp/ui-plan-unit-baseline.log`, `tmp/ui-plan-browser-baseline.log`). Add only the missing injected-browser/document, ordinary-link/modifier and no-JS navigation scenarios before changing those behaviors. Record their actual red/green results below. Existing geometry, popup, lifecycle and motion coverage is reused.

| Behavior / contract | Existing tests to reuse | Missing scenario / new test needed | Required pre-change / post-change result |
| --- | --- | --- | --- |
| Navigation, path/metadata, offsets and cancellation | `navigation.cy.ts`, `spec.cy.ts`, navbar/footer/scroll unit specs | Added ordinary-link/modifier unit cases and real no-JS navigation checks before implementation; existing JS journeys were retained. | Existing behavior passes before and after; approved no-JS links work afterward. |
| Responsive and failed-image containment | `layout.cy.ts`, `image-sizing.cy.ts` | Only a newly reproduced gap requires another test. | No document overflow at narrow/desktop widths, including open menu and failed images. |
| Modal accessibility and lifecycle | Research unit specs, `research-popup.cy.ts` | Add coverage only for a newly identified interaction gap. | All images open; keyboard, close/Escape/backdrop, focus, attribution and teardown remain correct. |
| Motion and browser boundaries | Existing hero/reduced-motion journey and lifecycle specs | Evaluate any proposed CSS replacement against actual pointer/device input, offsets and cancellation; equivalence is not yet demonstrated. | Preserve current intentional behavior and SSR guards. |
| Shared style consistency | Existing rendered journeys plus scoped screenshot/computed-style inspection | No permanent test that merely mirrors CSS declarations. | Shared visual rules remain aligned; necessary local exceptions are explained. |

### Characterization and regression sensitivity

- Reuse applicable sensitivity evidence already recorded in history. Add only missing characterization tests, passing on unchanged behavior before a refactor.
- Demonstrate new coverage detects a controlled violation, restore the baseline, then implement. For a bug fix, keep the original failing reproduction and show it passes afterward.
- Record real outcomes and distinguish application failures from browser/tooling failures. Do not label an unavailable baseline as passing.

### Gate result

Gate passed: baseline 83 unit/79 browser checks passed before implementation. Nine new unit cases failed on the missing injected-browser, ordinary-destination and modifier behaviors. New real-Chrome no-JS cases failed on old void links. After ordinary links were implemented, those checks exposed missing prerendered active state; moving active state into template bindings fixed it. A fixture geometry omission and an escaped test-expression error were diagnosed/corrected separately, without treating them as app defects. Existing preservation tests were reused; no new characterization gap required duplicate tests. Map901 preview coverage also failed (two versus three picture sources) before restoration, then passed.

## Implementation plan

### Batch 0 — Consolidate authority (completed previously)

Move current UI records here without changing IDs or losing historical evidence. Update the documentation index, agent reading pointers and TODO validation to recognize both owning registers. Close the Lighthouse concern with its evidence limits. Application behavior remains unchanged.

### Batch 1 — Browser boundary cleanup (implemented)

| File / symbol | Responsibility / proposed change | Existing pattern to reuse |
| --- | --- | --- |
| Navbar/footer TypeScript | MIG-02: replace remaining guarded globals with injected browser/document access, preserving behavior | Typed WindowRef, injected DOCUMENT and existing teardown |
| Adjacent specs and navigation journeys | Establish/preserve baseline before the migration | Current offset, history, metadata, cancellation and SSR checks |

- [x] Traced the remaining accesses and established the baseline.
- [x] Migrated browser/document access and listener ownership, preserving navigation/motion contracts.
- [x] Ran focused/integration checks; changes are held uncommitted for user review.

### Batch 2 — Ordinary navigation without JavaScript (implemented)

MIG-04 now renders seven ordinary destinations from one typed navigation list. Only unmodified primary clicks use the existing enhanced section/router path; modifiers retain browser behavior. Active classes and aria-current are declarative, including prerendered pages. Navbar/footer browser work uses injected abstractions and owned listeners. CSS `scripting: none` makes mobile navigation visible in normal document flow, hides the inert toggle/preloader, and removes the misleading Writing loading state while retaining the ordinary Medium archive link. See [CSS scripting media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/scripting). No extra bootstrap script was added.

### Batch 3 — Shared visual consistency (partial groundwork implemented)

The prior implementation retained the moving hero, Poppins, purple/white theme and existing content. This is useful groundwork, but it does not satisfy DESIGN-01’s required navy/white visual target. Overview becomes open columns; Experience uses non-interactive rows rather than hoverable service cards; About separates skills with responsive dividers; Writing uses open entries. Research retains its grid/figures with fewer enclosing boxes. Shared palette values and the existing section-label treatment now live in the loaded theme; feature spacing remains local. Ordinary navigation/body links use the same palette, with stronger inactive-nav text contrast. The unused legacy service-card CSS was removed after its last component consumer was removed.

The original 720×360 Map901 WebP was visually compared with the PNG at normal display size. It is a lossy 20,300-byte preview (PNG 125,929 bytes; pixel RMSE about 3.58/255), not a lossless replacement. It is restored for thumbnail use only; the original PNG remains the fallback and enlarged popup source. All scientific attribution and publication text remain unchanged.

MIG-05 is an accepted JS enhancement, not a demand to replace working motion. BUG-11 needs work only if reproducible again. Completed rows below are regression obligations, not a queue to reimplement.

### Batch 4 — Deliver the required reference design (planned; not implemented)

The required image is linked in the decisions section below. Use it alongside this matrix during implementation and review; it is the visual destination, subject to the user-approved exceptions below: preserve the existing research grid; evaluate navy Publications and Contact only as final, reversible options.

| Reference area | Owning implementation files | Required result |
| --- | --- | --- |
| Shared visual system | `src/assets/css/style.css`, `src/assets/css/default.css`; load order in `angular.json` | Centralize navy surfaces, white surfaces, navy text, muted text, purple accents, separators, spacing and heading hierarchy in the existing loaded theme. Reuse tokens across components. Keep Poppins unless an approved change is needed; no extra font/dependency is required. |
| White navigation | `src/app/nav-bar/nav-bar.component.html`, sibling CSS | White navigation surface, dark identity/links and purple active/focus treatment with the reference’s balanced alignment. Preserve the real identity, seven items, active indication, offsets and no-JS/mobile fallback. |
| Dark hero and portrait | `src/app/index-page/index-page.component.html`, sibling CSS | Deep navy hero, prominent white name and role, purple research CTA, right-hand real portrait with purple framing on desktop. Preserve current copy, social links, moving shapes and parallax; ensure decorations remain visible on navy. Reflow content at narrow widths without clipping or hiding essential content. |
| Open research overview | `src/app/home/research-overview/research-overview.component.html`, sibling CSS | Centered navy heading and readable introduction above three open columns with restrained separators; stack naturally on phones. |
| Selected Research | `src/app/home/selected-research/selected-research.component.html`, sibling CSS | Explicitly preserve the existing research grid, study/figure placement, responsive breakpoints and reading order. Apply shared typography/palette refinements without restructuring the grid to match the image. Keep real studies, images, readable captions, every popup, original image, attribution and responsive image constraint. |
| Navy publication band — optional final work | `src/app/publications/selected-publications.component.html`, sibling CSS | After the required work is reviewed, optionally preview a contrasting navy band with readable citation rows and bibliography link. Retain the current light treatment as the rollback baseline. Keep the change isolated and show desktop/mobile before/after views for user visual review; retain navy only if approved. Preserve all selected records, authors, resources and ordering. |
| Experience and Recognition | `src/app/home/research-journey/research-journey.component.html`, sibling CSS | Balanced side-by-side desktop columns, compact open rows and subtle dividers; stacked reading order on phones. Keep full real entries and descriptions. |
| About, Writing and footer | `src/app/about-me/about-me.component.html`, sibling CSS; `src/app/blogs/blogs.component.html`, sibling CSS; `src/app/nav-footer/nav-footer.component.html`, sibling CSS | Apply the same typography, spacing and separators to sections omitted from the image. Preserve About/Writing content, feed states, privacy and existing footer links. Contact redesign is a separate conditional final step below. |
| Contact — conditional final work | `src/app/contact-me/contact-me.component.html`, sibling CSS | After required-work review, preview a navy closing area/LinkedIn CTA only as a separate proposal. Keep the existing Contact appearance until visual approval. Show desktop/mobile comparisons, preserve privacy and links, and retain an isolated rollback patch/checkpoint. Rejection restores the prior Contact treatment without reverting other work. |
| Standalone pages | `src/app/home/standalone-pages.component.ts` and the reused section components above | Apply the same visual system to direct routes without relying on homepage ancestor selectors. Full bibliography and Writing remain readable and consistent. |

Ordered work when implementation is authorized:

- [ ] Record the then-current Git state and dependency health; do not reuse old build/test results as a fresh baseline. The reported `npm ci` EPERM must be resolved before claiming executable checks pass.
- [ ] Complete the mandatory pre-test gate for affected structure/behavior. Reuse existing navigation, layout, image, popup, content and no-JS tests. Add tests only for uncovered observable failures; explain each addition and demonstrate sensitivity before the corresponding change.
- [ ] Capture the current homepage and direct-route desktop/mobile views with real content. Compare the desktop composition with the reference; mark each matrix row pending before styling.
- [ ] Implement shared tokens and navigation/hero first; inspect desktop and mobile renders against the reference before proceeding. Keep existing motion/listener ownership and CSS-first conventions.
- [ ] Implement overview and shared visual refinements while explicitly preserving the research grid; then Experience/Recognition, remaining required sections and standalone pages. Preserve the existing Publications/Contact treatments during this required work. Keep layout rules local and explain necessary exceptions.
- [ ] Run focused applicable browser checks after each affected area. Retain failing reproductions and rerun them after fixes. Use one relevant integration checkpoint after the final batch rather than repeating unchanged suites.
- [ ] Capture required-work desktop/mobile views and complete the visual acceptance matrix below. Record the preserved research grid and approved exceptions. Hold the patch uncommitted for user review.
- [ ] Only after required-work visual review, consider navy Publications and the conditional Contact redesign as separate final previews. Record approval, rejection or deferral for each; preserve an isolated pre-change patch/checkpoint and screenshots so either treatment can be rolled back independently without undoing required work. Do not commit unapproved treatments. After rollback, recheck their prior appearance, links, contrast and mobile containment.

#### Visual-reference acceptance matrix

| Review | Required evidence / pass condition |
| --- | --- |
| Desktop reference fidelity | At 1280px, compare homepage captures with the reference: white nav, navy hero, framed portrait, strong type hierarchy, open overview and compact Experience/Recognition are present, while the existing research grid is preserved. Navy Publications and Contact redesign are separately reviewed final options, not required pass conditions. A behavior-suite pass alone does not satisfy this row. |
| Real content and omitted sections | Every existing section, selected publication, study, caption and link remains available. The About/Writing adaptation follows the same visual system; no invented mockup facts or scientific figures enter the site. |
| Mobile and tablet adaptation | Check 320/360/390/412/768px plus desktop: no document overflow, readable long titles/captions, sensible stacking, usable open menu, visible focus and reachable popup controls. Do not use body overflow hiding as a fix. |
| Contrast and interaction | Check normal/hover/focus/active and loading/error states on light/dark surfaces, including keyboard and touch. Normal text meets 4.5:1 contrast and large text/UI indicators meet applicable 3:1 requirements. |
| Optional/conditional final previews | Show Publications and Contact separately before/after on desktop/mobile, record the user decision, and demonstrate each can be reverted independently. Recheck reverted appearance and behavior if rejected. |
| Existing contracts | Preserve section scroll/path/metadata, standalone refresh, native modified links, no-JS navigation, reduced-motion handling, popup keyboard/focus/lifecycle, SSR and lazy boundaries. Record the targeted tests and final relevant integration results separately from visual comparison. |
| Final handoff | Show the reference and implemented desktop/mobile captures, completed matrix, approved exceptions and actual test evidence. Record Publications/Contact separately as approved, rejected or deferred; rejecting or deferring them does not block required-work completion. DESIGN-01 remains open until required outcomes are delivered and user review accepts them. No commit before review. |

## Verification plan

Use the [development guide](README.md#development-and-verification) for command prerequisites and [deferred-work conventions](README.md#deferred-work-markers) for code markers. The coverage map, verification table and current issue register in this plan own the batch-specific checks, results and deferred exit conditions.

| Check | Invocation / owner | Evidence and status |
| --- | --- | --- |
| Guidance and ownership | Manifest `check:guidance`, issue-ID ownership and whitespace checks | Validate current reading pointers, unchanged issue ownership and review-only status. |
| Implemented UI batches | Relevant manifest unit/browser/compiler checks from the coverage map | Baseline 83/79; final unit 92, post-style browser 79 and final navigation recheck 28 passed. |
| Prior maintenance visual checks | Mobile/desktop captures and production viewport review | 77 prior samples passed containment; these do not verify the required reference. |
| Required final visual target | Batch 4 visual-reference acceptance matrix and reference comparison | Pending implementation and fresh desktop/mobile review. |
| SSR, lazy boundaries and no-JS behavior | Production A/B builds, maintained worker and presentation checks | Nine prerendered routes; worker/helper 10, no-JS 2 and server 4 passed; generated manifest/hash check passed. |
| Deployed behavior | Actual source-identified Netlify deployment | User reported `1e8de2f` deployed as `6af887a4392d9b942ebb9cb1`; the current uncommitted implementation is not deployed and makes no deployed interaction claim. |

Historical verification at `1e8de2f`: 24 affected browser baseline checks, 79 final browser checks, production build and generated worker/guidance checks passed. Earlier popup/retirement integration included 83 unit and 10 cache/helper cases. These are prior results, separate from the current implementation evidence in the handoff.

## Approved and pending decisions

| Decision | Status | Rationale / blocking effect |
| --- | --- | --- |
| One plan for CSS and browser-interaction issues | User-approved | This register owns current UI statuses; preserve IDs and link history. |
| Prior maintenance batches, no commit before review | Previously authorized | Preserve their uncommitted work and bounded verification evidence; they do not complete the required visual target. |
| Existing portfolio is the functional baseline; stop score chasing | User-approved | Preserve working behavior while implementing the required visual target. The closed Lighthouse concern does not imply visual-design completion. |
| Reuse shared visuals; keep feature layout local; explain exceptions | User-approved | Shared policy lives in README; STYLE-01 already implemented it for Research. |
| Navy/white reference is the final visual goal | User clarification November 14 | Required direction with explicit exceptions: preserve the research grid; navy Publications is optional final work and Contact is conditional final work, both reversible and subject to visual review. Current request is plan-only. |
| Existing research grid | User-approved preservation requirement | Keep its layout, placements, breakpoints and reading order; the mockup does not authorize restructuring it. |
| Navy Publications | Optional final work; visual review pending | Evaluate after required work. Keep an independently reversible patch and restore the light baseline if rejected. |
| Contact redesign | Conditional final work; visual approval required | Evaluate last as a separate proposal; keep existing Contact until approval and support independent rollback. |
| CSS replacement for current JS motion | Not approved or required | Preserve the working enhancement unless equivalence is demonstrated. |
| Restore the deleted Map901 WebP | Agent-selected within the approved full plan; implemented after visual/dimension comparison | Use the existing WebP for previews and keep PNG fallback/enlargement; no source-image recompression or attribution change. |

### Required final visual reference

![Required navy/white final design target](design-references/theme-contrast-sample.png)

This image is the required visual direction for white navigation, deep navy hero, purple accents, bold navy headings, open overview columns and compact Experience/Recognition rows. Explicit user-approved exceptions: preserve the existing research grid; navy Publications is optional final work, and Contact redesign is conditional on visual review and approval. Both final treatments must be independently reversible; neither is a prerequisite for the required work. Implement that visual direction using real portfolio content and assets. The image is not a factual source: keep actual names, publications, figures, attribution and all existing sections, including About and Writing. Adapt its desktop composition responsively rather than shrinking it into a phone screenshot. Any material departure from the visual direction must be explained and reviewed, not silently treated as optional.

## Implementation notes for agents

Read README, the applicable repository skills, this register and the owning template/controller/styles before editing. Follow the loaded cascade; do not edit an unloaded minified copy or create a parallel theme. Source comments route here for these IDs; content/data/deployment/tooling issues remain in the optimization register. Keep issue status in one register and historical evidence in history. Use targeted checks during work and one relevant integration/review checkpoint per batch; do not rerun unchanged suites merely to inflate the checklist.

## Issue and migration register

Implemented for review: MIG-02 and MIG-04. DESIGN-01 is reopened and incomplete pending the required visual-reference implementation. Accepted enhancement: MIG-05. Monitoring only: BUG-11; its historical cause remains unknown. Completed entries below are regression obligations, not work to repeat. No implementation remains blocked by the accepted motion exception or monitoring item.

| ID | Status / evidence | Required outcome / exit check |
| --- | --- | --- |
| MIG-02 | Implemented locally. Navbar uses injected DOCUMENT/WindowRef and a renderer listener released at destruction; footer listens to/reads its injected browser and uses a typed element reference. Distinct-document/window regressions pass. | Retain existing scrolling, lifecycle and SSR/browser tests. Changes are uncommitted for review. |
| MIG-04 | Implemented locally. Seven typed ordinary links preserve enhanced primary-click and native modifier behavior; active state is declarative for SSR. Real Chrome with scripting disabled follows all seven destinations at 360/1280px, checks current-page indication, viewport containment, Home preloader and Medium fallback. | Preserve normal navigation/metadata/motion tests and the maintained presentation command. No claim of additional deployed/cross-browser checks. |
| MIG-05 | Accepted JS enhancement, retained and documented at owning code boundaries. Pointer/device parallax and coordinated duration/offset/cancellation require input/state coordination beyond this stylesheet scope. Existing reduced-motion/motion regression passes. | Preserve behavior and lifecycle cleanup; no CSS replacement is required. Optional enhancement remains absent without JS. |
| DESIGN-01 | Reopened — incomplete. Earlier shared-rule and open-layout refinements are groundwork only; the required navy/white reference is not implemented. Current request is plan-only. | Implement Batch 4 when authorized, preserve contracts/content and pass the visual-reference acceptance matrix plus relevant behavior checks. User visual review is required before closure or commit. |
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

Previously implemented maintenance is ready for review and intentionally uncommitted; the overall visual plan is incomplete. DESIGN-01 still requires Batch 4. The user has requested planning only at this checkpoint. No push, deployment, dependency upgrade, Lighthouse audit or score-driven change was performed. Completed work includes browser abstraction/listener ownership, ordinary and no-JS navigation, declarative SSR active state, bounded shared-style/open-layout refinement and the verified Map901 preview restoration. Existing JS motion remains; the earlier phone-overflow report remains monitoring, with no invented cause or claimed fix.

Historical maintenance verification (not evidence for the unimplemented reference): baseline 83 unit/79 browser checks; final 92 unit checks and all three TypeScript checks pass. The post-style 79-case browser integration passed; after the final SSR active-state fix, the 28-case navigation suite and 16 focused navbar/footer cases passed again. The two maintained no-JS Chrome cases pass, each following all seven routes with scripts disabled. Fresh A/B production builds prerender nine routes; the 10-case worker/helper suite, four compiled-server cases and generated worker/hash checks pass. Review found no actionable implementation defect. The existing initial-size warning remains against the unchanged budget; it is not a score target. The final production viewport inspection passed 77 closed/open-menu samples across six widths (320/360/390/412/768/1280px). Its clean desktop/mobile viewport captures were inspected; no whole-document overflow reproduced. BUG-11 remains monitoring because its old cause was never established. Final guidance/whitespace and issue-ownership checks passed. All 35 IDs remain assigned once across the two registers. Nothing is staged or committed; the last commit remains the input baseline `d8c815d`.

Evidence (ignored local artifacts): `tmp/ui-plan-unit-baseline.log`, `tmp/ui-plan-browser-baseline.log`, `tmp/ui-plan-navigation-red.log`, `tmp/ui-plan-no-js-red.log`, `tmp/ui-plan-unit-final.log`, `tmp/ui-plan-navigation-browser-final.log`, `tmp/ui-plan-no-js-final.log`, `tmp/ui-plan-cache-final.log`, production output `dist/my-app` and named variant `tmp/ui-plan-build-b`. Visual captures are in `tmp/ui-plan-design-before`, `tmp/ui-plan-design-after`, and the final viewport review directory. Long element captures can repeat fixed navigation during stitching; final viewport captures show the actual visible composition. No temporary capture spec remains in the test suite.

The Lighthouse concern remains closed as recorded in the [performance closure](PERFORMANCE_CLOSEOUT_REPORT.md). Publication/data, remaining figure-rights evidence and deployment-tooling records outside this plan were not silently included. Review of this corrected plan is the next step. Do not start Batch 4 under the current plan-only instruction, and do not commit changes before user review.
