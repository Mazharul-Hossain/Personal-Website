# Portfolio optimization and regression plan

**Status: Active.** This is the implementation plan and shared bug register. Read [documentation authority](README.md) and the root [behavioral contracts](../README.md#behavioral-contracts) first. Historical redesign proposals do not override those contracts.

## Agent-readiness implementation — November 7, 2026

Approved scope: remove duplicated authority, make behavior explicit, prefer current typed patterns, track exceptions, and supply repository engineering/design/content/verification skills and file-level reading pointers. Preserve runtime behavior in this pass. Publication consolidation remains Phase 2 work below; marking the plan active does not claim it has shipped.

- [x] Establish README shared policy, agent-only AGENTS routing, and a documentation status/content index.
- [x] Enable full strict compilation if app, unit and browser sources permit it; otherwise record the exact blocker and bounded migration.
- [x] Add focused repository skills and authored-file pointers, excluding vendor/generated/native data formats.
- [x] Register known gaps with stable IDs and code-boundary TODOs; preserve existing investigation work.
- [x] Validate compiler/build/tests, skill structure and references; report local versus Netlify evidence separately.

### Agent-readiness validation record

- Full app, unit-spec and Cypress TypeScript checks passed with strict mode enabled. Existing WindowRef consumers now use the abstraction's type; guarded global DOM access remains MIG-02.
- Production build passed, prerendering 11 routes. Initial raw bundle remained approximately 1.04 MB (approximately 215 kB estimated transfer), exceeding the existing warning threshold; budgets were unchanged. Local builds warned about missing Netlify-specific environment variables; no account/deploy state was inferred.
- Jasmine/Karma: 37 tests passed. The sandboxed browser could not capture; rerunning outside the sandbox passed. Asset 404 warnings are tracked as BUG-07, not hidden by a successful test count.
- Feed tests: 4 passed. Existing Node module-type warning remains; do not change the package module format without checking CommonJS tooling.
- Guidance check and prebuild hook passed: 4 skills, 91 authored files, 499 local references; tracked TODO IDs also checked. The generic Python skill validator could not run because PyYAML is unavailable; the dependency-free repository check validates the skills' deliberately simple frontmatter schema and local references instead.
- Independent read-only scenario review confirmed discovery of content, navigation, style ownership, Netlify boundaries and bug registration; missing metadata/design/spec pointers found in review were corrected.
- `git diff --check` passed. Existing Cypress and plan edits were preserved. No deployment, visual redesign or publication consolidation was performed. Cypress runtime journeys and deployed Netlify checks were not run in this documentation/type-only pass; BUG-01 remains open.

## Bug and migration register

Add newly discovered issues here. Every entry needs evidence (source or reproduction), expected outcome, status, and an exit check. Source inspection is not a browser reproduction. Link categorized code TODOs to these IDs; close both together. Do not add a duplicate issue if an entry already covers it.

| ID | Status / evidence | Required outcome / exit check |
| --- | --- | --- |
| MIG-01 | Planned, Phase 1D/Phase 2. Selected TS records and full HTML bibliography are independently maintained. | One typed authority with stable IDs, ordered selections and shared research links; preserve all citation details/categories, lazy boundary and measured bundles. |
| MIG-02 | Source-confirmed legacy pattern: navbar/footer use guarded browser globals; several injected WindowRef consumers were typed `any`. | Use typed WindowRef and injected DOCUMENT consistently without altering navigation/scroll behavior; browser and server regression checks. |
| MIG-03 | Source-confirmed exception: xml2js ambient declaration returns `any`; strict mode cannot validate upstream RSS structure. | Narrow external data and/or adopt suitable maintained types; retain feed response/error tests. |
| MIG-04 | Source-confirmed compatibility exception: seven JS-only navbar hrefs; see Phase 1A. | Equivalent mobile/keyboard/history/metadata behavior plus usable ordinary navigation without JS before adopting replacements. |
| MIG-05 | Source-confirmed JS enhancement: pointer/device parallax and cancellable, latest-action-controlled scroll animations. | Preserve current behavior; evaluate CSS alternatives against actual pointer, offset and cancellation needs. Adopt CSS only when equivalent; absence without JS is acceptable for optional motion. |
| MIG-06 | Source-confirmed mixed content: recognition and skills remain HTML; identity/profile facts recur in metadata/templates. | Migrate reusable facts into TS records on related edits; retain narrative presentation and approved content/privacy. |
| BUG-01 | Source-confirmed stale Cypress assertion requires a removed About TODO. | Assert current supported biography/skills instead, then run the affected browser journey. |
| BUG-02 | Source-confirmed Works popup has click-only opener, no explicit close control/Escape/focus handling; overlay not disposed on component destruction. | Test keyboard opening/close, Escape/backdrop, focus return and teardown; implement accessible controls and disposal in Phase 2. |
| BUG-03 | Source-confirmed footer does not retain Renderer2 listener cleanup functions or clear its hide timer on destruction. | Teardown releases handlers/timer; back-to-top and fade-race specs still pass. |
| BUG-04 | Source-confirmed preloader and 404 delayed callbacks are not canceled on destruction. | Navigating away cannot trigger stale state changes or delayed redirect; retain intentional delay behavior. |
| BUG-05 | Investigation, Phase 1A: router scrolling and AppComponent's scroll-to-top may compete on fragment navigation. | Reproduce `/research#selected-research` and navigation during active animation; headings remain correctly positioned. |
| BUG-06 | Reported by earlier Lighthouse run, not reproduced in this pass: narrow viewport overflow. | Identify offending bounds at 360px/menu states and moving shapes; no document overflow; preserve gallery's internal scrolling. |
| BUG-07 | Karma run logged 404s for `/assets/images/next_gen/banner/hero.webp`; test build asset configuration points to `public`, whereas the application uses `src/assets`. | Align test asset serving with actual assets or intentionally isolate image loading; verify the warning cause and retain meaningful component checks. |
| DESIGN-01 | Source-confirmed fragmented template/component styling, repeated colors/spacing and empty component stylesheets. | Establish reusable common tokens/patterns and component ownership during visual work; rendered desktop/mobile evidence, no unrequested theme rewrite. |
| VERIFY-01 | Local build produced no `*ngsw*` files in `dist/my-app/browser`; registration exists without an explicit build service-worker option. Netlify deployment and standalone listening remain unverified. | Verify generated output and actual Netlify routes/feed/SSR/cache lifecycle; do not infer PWA success from registration source. |
| VERIFY-02 | Resolved locally: fresh strict checks/build/feed tests passed; Karma passed outside sandbox after sandbox Chrome capture timeouts. | Keep deployment evidence separate; future capture failures need environment diagnosis rather than weakening tests. |

## Goal and constraints

Improve reliability and loading performance while preserving the portfolio's appearance, server-side rendering, accessibility, and existing interactions. Keep the moving parallax hero, smooth navbar and Back-to-top animations, mobile menu behavior, existing section layout, and shared site CSS wherever practical. Do not raise the bundle budget to hide regressions.

On the homepage, clicking a navigation item scrolls to its section, changes the visible path, and retains the homepage and its metadata. Reloading that path opens the standalone page with its metadata. Preserve this intentional behavior. The seven `javascript:void(0)` links were intentionally retained for mobile behavior; test whether they are necessary before considering any change. Do not replace them solely to improve a Lighthouse score.

## Measured starting point

- Production build: approximately 1.04 MB initial raw bundle and 215 kB estimated initial transfer; the configured warning budget is 500 kB raw.
- November 2 mobile Lighthouse 9.6.8 report: performance 80, accessibility 100, largest contentful paint (LCP) 3.4 s, and total blocking time 230 ms. LCP was the hero research-title text.
- The report estimated 159 KiB of unused JavaScript: roughly 81 kB from Google Analytics, 48 kB from the global scripts bundle, and 34 kB from an application chunk. It estimated 43 KiB of unused CSS. These are estimates for one run, not proven removable bytes.
- The report estimated 318 KiB of image-format savings across three lazy-loaded research figures; the UPIGAN figure also appeared in a 67 KiB responsive-size estimate. These estimates overlap and should not be added together or assumed to improve hero LCP.
- The report recorded a 385px content width with a 360px viewport. Its audit did not identify the element responsible. It also recorded successful downloads of both EOT and TTF versions of LineIcons (about 85 kB each); the cause needs verification.

## Phase 1 — Tests and investigation

Write or update regression tests and establish measurements before changing application behavior. A test that exposes an existing defect may fail initially; record the result and expected behavior instead of weakening it. Run unrelated existing tests and distinguish pre-existing failures. The existing homepage smoke test still expects an About TODO that the CV update removed; update that expectation to verified current content when implementing test changes.

### 1A. Navigation and scroll behavior

- Verify all seven navigation items on desktop and mobile: menu open/close, active highlight, smooth scrolling, path changes, and direct page loads or reloads. Cover keyboard activation and browser back/forward.
- Keep the test for homepage metadata while section navigation changes the path, and verify the standalone page's metadata after reload.
- Reproduce and test fragment navigation, including `/research#selected-research`, with the heading visible below the navbar. Investigate the interaction between Angular router scrolling and the application-level scroll-to-top handler.
- Start navbar and Back-to-top animations, then navigate or use browser history before completion; check the new route retains its intended scroll position. Preserve the animations and the moving hero.
- Investigate the role of `javascript:void(0)` in the current mobile interaction. Compare alternatives only in an isolated test, including mobile and keyboard behavior; keep the current links unless an alternative is proven equivalent and adopted deliberately.
- Baseline the existing Start Bootstrap script: its current handlers target `#mainNav` and `#navbarResponsive`, which are absent from the current navbar. Test the navigation behavior before the agreed removal; distinguish this script from the local parallax library.

### 1B. Mobile overflow and visual behavior

- Reproduce at 360px and other representative widths on the homepage and standalone routes, with the menu closed and open and with the hero shapes moving. Inspect document scroll width and element bounding boxes to locate the actual overflowing element; do not assume the figures or moving shapes are the cause.
- Add a regression check for unwanted horizontal overflow and verify no clipping of the menu, content, or decorative shapes. Compare desktop and mobile visuals and preserve keyboard focus and contrast.
- Check document-level overflow separately from the Works gallery's intentional horizontal scrolling. Verify the gallery can still scroll within its container.

### 1C. Performance, images, and fonts

- Capture `npm run build -- --stats-json` and repeat Lighthouse measurements on comparable preview builds. Record raw and transferred sizes, LCP, and the LCP element. Distinguish network transfer from raw bundle size and do not sum overlapping estimates.
- Keep the build statistics and compare the median of at least three Lighthouse runs per variant using the same version, device profile, and throttling. Record cold and warm cache results separately.
- Inventory actual consumers and side effects of each global script and stylesheet before removing anything. Measure Google Analytics separately; don't assume it or all legacy scripts can be removed without a product decision.
- Trace the two LineIcons requests using browser network information and inspect the generated CSS and `@font-face` declarations. Check icon rendering across supported browsers before selecting a change.
- Inspect source dimensions, readability, and loading behavior of the three research figures. Compare candidate responsive WebP/AVIF files visually, including fine diagram text, and verify figure attribution and reuse permissions before replacing assets.
- On a production preview, check service-worker registration on a clean visit, page control after reload, and updates between two builds. Verify standalone URLs still render and `/feed` returns feed data. Inspect whether JavaScript prefetching downloads lazy route chunks before navigation.

### 1D. Publication data

- Establish tests for all bibliography entries, categories, ordering, complete authors and citation details, links, and the five selected entries. Cover the existing author-shortening cases and ensure research links remain correct. Preserve the copyright disclosure and Scholar link.
- Record initial and lazy-chunk sizes before consolidation so the effect on the homepage can be measured.

### 1E. Works popup and component cleanup

- Test keyboard opening, a reachable close control, Escape and backdrop dismissal, focus return, and navigation away while the popup is open. Record any existing failures as regressions to address in Phase 2.
- Check that navigating away from Works disposes of the overlay. Check that destroyed components release their timers, animation frames, and event listeners, including the footer's Back-to-top handlers.
- Use build statistics to establish whether Works and CDK Overlay are in the initial bundle. Compare the initial bundle and first `/work` visit in an isolated lazy-loading experiment before choosing whether to replace CDK Overlay.

## Phase 2 — Small, reviewable fixes

Implement only after the relevant Phase 1 tests and evidence exist. Each part can be reviewed and verified independently.

1. **Navigation:** Fix confirmed scroll conflicts using one clear owner per behavior. Preserve the seven existing links unless Phase 1 demonstrates and validates an equivalent alternative.
2. **Mobile layout:** Correct the identified overflow at its source while preserving the moving shapes and layout. Verify at the tested widths.
3. **Publications:** Use shared core records with stable IDs and categories, and an ordered selected-ID array. Keep full citation details in the lazy-loaded bibliography module, preserve existing information and links, and use the existing author-shortening logic. Shared core records may enter the homepage bundle; measure the impact. Reuse those records for research links where practical.
4. **Fonts, images, and assets:** Make only measured and visually verified changes. Preserve figure quality and attribution; resolve or explicitly track outstanding permissions. Do not remove the parallax asset.
5. **Component cleanup and caching:** Fix confirmed lifecycle issues and apply service-worker changes only where the production checks demonstrate a problem. Verify the affected routes and feed after each change.

### 2A. Grouped removals

Review the following removals together after the Phase 1 tests and evidence are in place. Remove only items whose consumers and effects have been verified; defer uncertain items for separate investigation.

- **Agreed:** Remove the `startbootstrap-scrolling-nav/dist/js/scripts.js` build entry and its direct dependency after navigation coverage confirms the current behavior.
- **Candidates:** Remove or defer individually verified unused global scripts, direct dependencies, CSS rules, font formats, and duplicate assets. Review Google Analytics separately before any change to it.
- **CDK Overlay:** Review the measured effect of lazy-loading `/work` before deciding whether to replace and remove CDK Overlay. Require the popup and cleanup tests to pass for any replacement.
- Keep the local parallax library and moving hero, existing mobile navigation and animations, and the site's reusable CSS. Preserve all required assets and attributions.

## Acceptance criteria

- Relevant Phase 1 tests and visual checks pass after each change; run production build, unit tests, and Cypress when applicable.
- Homepage section scrolling, visible URL and metadata behavior, mobile navigation, Back-to-top, and the moving hero remain intact.
- Existing prerendered routes, standalone pages, Netlify SSR, and `/feed` remain functional.
- Full publication details and links remain available, the bibliography stays lazy-loaded, and the five selected records remain correct.
- Record before/after bundle and Lighthouse results. Do not claim a performance improvement without comparable measurement or assume every individual change must reduce the initial bundle.
