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
| MIG-01 | Resolved locally. Shared typed core, ordered selected IDs, lazy citation details and rendered category loops replace duplicated publication facts. All 14 citation/resource baselines, five selections, research attribution, local browser/prerender and eager/lazy checks passed. | Maintain the single authority and reference tests. Netlify deployment remains a separate unverified stage; CONTENT-ARXIV is not closed by consolidation. |
| CONTENT-ARXIV | Unverified association: research links to arXiv 2408.07114, but the bibliography does not explicitly establish its relationship to the published detector-comparison paper. | Retain the existing link as an external resource; associate a publication ID/version only after primary evidence or user confirmation. |
| MIG-02 | Source-confirmed legacy pattern: navbar/footer use guarded browser globals; several injected WindowRef consumers were typed `any`. | Use typed WindowRef and injected DOCUMENT consistently without altering navigation/scroll behavior; browser and server regression checks. |
| MIG-03 | Source-confirmed exception: xml2js ambient declaration returns `any`; strict mode cannot validate upstream RSS structure. | Narrow external data and/or adopt suitable maintained types; retain feed response/error tests. |
| MIG-04 | Source-confirmed compatibility exception: seven JS-only navbar hrefs; see Phase 1A. | Equivalent mobile/keyboard/history/metadata behavior plus usable ordinary navigation without JS before adopting replacements. |
| MIG-05 | Source-confirmed JS enhancement: pointer/device parallax and cancellable, latest-action-controlled scroll animations. | Preserve current behavior; evaluate CSS alternatives against actual pointer, offset and cancellation needs. Adopt CSS only when equivalent; absence without JS is acceptable for optional motion. |
| MIG-06 | Source-confirmed mixed content: recognition and skills remain HTML; identity/profile facts recur in metadata/templates. | Migrate reusable facts into TS records on related edits; retain narrative presentation and approved content/privacy. |
| BUG-01 | Resolved: unchanged baseline reproduced the obsolete About assertion as its only failure (24 passed, 1 failed). Current biography/skills and placeholder-absence checks now pass; corrected smoke/publication baseline is 25/25. | Retain meaningful current-content checks; do not restore obsolete placeholders to satisfy tests. |
| BUG-02 | Resolved locally in fixes #5/#6: named native opener buttons, keyboard/focus-within reveal, modal semantics and close control, Escape/backdrop dismissal, trapped/returned focus and owned overlay disposal. Works unit/browser regressions pass. | Retain native keyboard, close/focus, repeated opening and genuine SPA teardown checks; retain CDK unless a separate measured migration is approved. |
| BUG-03 | Resolved locally in fix #7: footer retains both unlisteners, clears its fade timer, and cancels shared animation at destruction. Teardown and the existing fade-race checks pass. | Retain disposal, detached-click, 200ms fade and back-to-top behavior tests. |
| BUG-04 | Resolved locally in fixes #8/#9: preloader and 404 timeout handles clear at destruction. Positive tests preserve 500ms preloader and 5000ms redirect; SSR starts neither callback. Existing parallax teardown is retained. | Retain late-callback regressions, intended delay and server-guard checks. |
| BUG-05 | Resolved locally including the November 9 P2 follow-up: pending initial anchor restoration now respects native viewport movement as well as shared-animation revisions. A temporary scroll listener remembers movement even when the user returns to the original position; final position comparison covers pending scroll events. Tracking ends on stability/destruction. Native PageDown under a held feed response and all fragment cases pass. | Retain the six fragment journeys, newer-section and native-scroll hydration cases, move-away/return unit test and listener cleanup coverage. Netlify verification remains separate. |
| BUG-06 | Resolved locally in fix #4: overflow-wrap:anywhere on research captions removes their oversized min-content width. Home/Research at 360/390px and desktop pass; internal Works gallery scrolling remains. Production widths/screenshots were checked without clipping or hiding overflow. | Retain document/gallery checks and readable attribution at narrow widths. |
| BUG-07 | Resolved locally in fix #11: Karma now serves src/assets rather than a nonexistent public directory. A real fetch of the hero URL returns 200, image/webp and nonempty bytes; the final unit log has no asset 404. | Retain the asset-serving regression; keep production and test asset ownership aligned. |
| BUG-08 | Resolved locally in fix #2: NavigationStart cancels shared animations; animation generations reject stale queued frames and protect pending initial-anchor restoration from newer intent. Non-fragment destinations open at top even during hydration. Both interruption regressions pass. | Retain latest-click, route/history interruption, stale-frame and delayed-initial-scroll tests; do not remove animations. |
| BUG-09 | Resolved locally November 8: measure the fixed navigation height directly; its absolute mobile menu contributes no layout height. Paired open/closed unit regression reproduced 639px instead of 409px before the fix and now passes. All seven mobile and seven desktop keyboard destinations pass, including clearance, active item, menu close, URL replacement and retained homepage metadata. | Retain geometry and browser regressions. Existing fragment/route-animation defects are BUG-05/08, not closed by this offset fix; deployed Netlify behavior remains separately unverified. |
| BUG-10 | Resolved locally in fix #10: one root main wraps routed content; five standalone wrappers use div rather than nested main. Production checks find exactly one main on ten routes, outside navbar/footer. Homepage Lighthouse accessibility is 100 in the sampled local run. | Retain shell/route landmark tests. Automated results do not replace manual accessibility checks or other-browser verification. |
| DESIGN-01 | Source-confirmed fragmented template/component styling, repeated colors/spacing and empty component stylesheets. [Stylesheet refinement reference](STYLESHEET_REFINEMENT_PLAN.md) records the scoped contrast proposal and sample. | Establish reusable common tokens/patterns and component ownership during visual work; rendered desktop/mobile evidence, no unrequested theme rewrite. |
| VERIFY-01 | Production output again contains no ngsw worker/manifest; preview has no service-worker registrations or controller on clean visit/reload. Two-build SW update testing is blocked by that missing output. Documented standalone command exits 0 without listening. Direct exported-handler probe rejects localhost routes (host configuration), while /feed returns real upstream JSON 200. This is not evidence of deployed route failure. | Verify generated output and actual Netlify routes/feed/SSR/cache lifecycle with deploy identity. Separate host configuration from rendering failures and supply a deliberate local listening adapter if required. |
| PERF-01 | Resolved locally in the November 9 performance pass: WOFF2 first, WOFF fallback; generated preload and Chrome request use the same 71,516-byte WOFF2. All 464 glyphs, outlines, metrics, mappings and license metadata match the original. Chrome and Firefox icon rendering checked. | Retain font source/fallback files and complete glyphs. Safari remains unverified. Vendor/native configuration files are indexed here rather than receiving authored-code TODO comments. |
| CONTENT-FIGURES | Partially verified: GMoE and GE primary PDFs explicitly state CC BY 4.0. Pixel-identical, full-resolution WebP alternatives now serve those two figures; PNG sources/fallbacks, captions and attribution remain. UPIGAN/Map901 assets unchanged; their specific reuse evidence remains unresolved. | Preserve figure quality/attribution and verify particular source/credit lines and SPIE reuse conditions before changing the remaining images. See November 9 performance record. |
| VERIFY-02 | Resolved locally: fresh strict checks/build/feed tests passed; Karma passed outside sandbox after sandbox Chrome capture timeouts. | Keep deployment evidence separate; future capture failures need environment diagnosis rather than weakening tests. |
| VERIFY-03 | Resolved for this environment: matching Cypress binary was already cached outside sandbox visibility; install command skipped downloading, verification passed, and Chrome ran the existing 25 browser tests. | Run browser verification with access to the cached binary and required local-server/browser permissions. Prior sandbox-only version output did not establish physical absence. |
| VERIFY-04 | Diagnosed and Chromium coverage restored: installed Cypress sends Enter without text, producing keydown/up but no keypress/button activation. A scoped native CDP helper supplies the complete trusted sequence; a plain control and Works opener both pass. The application uses standard buttons with no key-handler workaround. | Retain native keyboard assertions and trusted-click control. Upstream cy.press behavior is not changed; other-browser helper paths remain unverified. See cypress/support/native-keyboard.ts. |
| VERIFY-05 | November 9 Lighthouse timing is inconclusive: sequential warm score 95→76/TBT 231→1,234ms; alternating warm controls score 79→76/TBT 953→1,188ms while CPU benchmark medians differ 1,014.5→829.5. The unchanged baseline also slowed substantially. Bundle/network byte savings are confirmed; no causal warm-load speed/regression claim is justified. | Repeat alternating production controls on a stable, otherwise idle machine with comparable CPU benchmark indices and external requests; inspect hydration/layout/analytics traces if blocking remains higher. Preserve every run rather than selecting favorable samples. No owning application defect has been established. |

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

### Overall status — November 9, 2026

The recorded Phase 1 defects and the November 9 native-scroll review finding are fixed and verified locally. The performance pass adopts the measured script removals and lazy Works feature, resolves PERF-01, and adds two lossless research figures. Latest validation is **73/73 Chrome browser and 71/71 unit tests**, plus four Firefox font-rendering samples, strict compiler/build checks and production inspection. See the performance record below for measurements. Historical red/pass results remain dated evidence. Netlify deployment, service-worker lifecycle, Safari and remaining image rights are unverified.

| Area | Investigation status | Remaining acceptance work |
| --- | --- | --- |
| 1A navigation | Existing/new journeys executed; href and Start Bootstrap isolated experiments completed. BUG-09 fixed and its previously blocked assertions now pass. | Recorded navigation defects are fixed locally. Prove any future link/script adoption against all contracts; keep the scoped native keyboard helper until upstream behavior is verified. |
| 1B overflow/visuals | Desktop/mobile, menu states, pointer extremes and gallery checks executed. | BUG-06 fixed and Chrome visual/focus checks repeated. Other-browser/manual verification remains separate. |
| 1C performance/assets/cache | Baseline collected; November 9 performance optimizations implemented and verified locally. | Netlify deploy identity/headers/SSR/cache, SW update lifecycle, Safari and remaining source-specific rights gaps. No deployment performed. |
| 1D publications | Completed and validated locally; prior consolidation commit unchanged. | Deployment verification remains separate; CONTENT-ARXIV unresolved. |
| 1E popup/lifecycle | Browser interaction/SPA teardown and timer/listener regressions pass; lazy Works adopted with CDK retained. | Retain popup/focus/disposal coverage; replacing CDK is unnecessary for this pass. |

### Remaining Phase 1 investigation batch — November 8, 2026

Scope: tests and evidence only. Prior uncommitted navigation/smoke/plan work was preserved. Added `cypress/e2e/layout-works.cy.ts` and `src/app/shared/lifecycle-regression.spec.ts`; updated the standalone-server finding in the existing Netlify notes and added a comment-only BUG-10 marker to the root template. Runtime behavior, styling, installed project dependencies and deployment settings are unchanged. Isolated variants, measurement tools, build output and image candidates live under ignored scratch/session artifacts. No commit, push or deployment.

#### Navigation investigations

- Tested native Enter activation of Research at 390px and 1280px with three DOM-only variants. Original links retain homepage/title/history entry. Pathname href alone performs a document navigation, changes metadata and loses homepage composition. Pathname href plus default-action prevention retains the sampled original behavior, including its existing mobile offset defect. This is a promising migration shape, not proof that all seven destinations/history/modifier-click cases are equivalent.
- With scripts disabled on the production preview, current Research href remains javascript:void(0). A temporary ordinary `/research/` href reaches the prerendered standalone Research page. This demonstrates the no-JS benefit without adopting a change or claiming current no-JS navbar compliance.
- Actual Start Bootstrap package source targets `#mainNav` and `#navbarResponsive .nav-link`; browser target counts are both zero. Execution against those observed empty sets creates no scrollspy/collapse handlers. Response interception then removed only its verified package block, preserving neighboring easing/parallax code: sampled desktop/mobile keyboard activation retained path replacement, homepage composition/title, active item and collapsed menu; Parallax remained available. Existing heading defects persist. No dependency/build entry was removed; run the full contracts again when adopting the agreed removal.

#### Overflow, popup and lifecycle evidence

- CDP observations cover eight routes (`/home`, `/research`, `/publications`, `/work`, `/about`, `/experience`, `/blog`, `/contact`) at 360/390/1280px: **40 route/menu samples**. Separate pointer-extreme samples confirm moving hero transforms at mobile/desktop widths. Home/Research overflow and the isolated sizing diagnosis are BUG-06. Works gallery can scroll horizontally inside its container while its document stays contained.
- Regression tests wait for a bootstrapped Angular root, fonts and animation frames; Home also waits for the Angular-set preloader class. Global whenStable was rejected as a layout prerequisite after it timed out on unrelated outstanding work; that harness timeout is not classified as overflow. Closed-state failures stop subsequent open-state assertions; open-menu evidence comes separately from the CDP samples.
- Works popup observations reproduce BUG-02. A tabIndex property alone was misleading: actual native Tab skips the href-less opener. The keyboard test fails at focus before Enter, so it does not establish a native Enter result or close VERIFY-04. Backdrop removes the image but leaves focus elsewhere. Genuine Angular navigation to About, with document identity retained, removes pane/backdrop. An earlier brand-link probe reloaded the document and was discarded as teardown evidence.
- New unit regressions isolate the public teardown boundaries: late preloader state change, late 404 redirect, and footer listeners/fade timer after destruction. **47 unit tests: 44 passed, 3 failed**, all three new failures recorded as BUG-03/04. The pre-existing hero.webp test-asset 404 remains BUG-07. Application fixes are deliberately deferred.
- Final new browser spec: **19 tests, 10 passed / 9 failed, none skipped/pending**. Failures are four Home/Research mobile overflow cases and five popup accessibility cases (name, Tab reach/open prerequisite, close control, Escape, focus return). Genuine SPA teardown passes. This run is separate from the prior 51-test navigation/smoke/publication run; do not combine counts into a claim of one fresh full-suite run.
- Separate local homepage Lighthouse accessibility audit: **98**, with a missing main landmark (BUG-10); sampled automated color contrast passes. Existing focus styling checks are in the earlier smoke baseline. This does not establish manual accessibility or contrast across every state. Firefox was found installed, but isolated headless screenshot attempts exited without producing an image (logs retained); other-browser glyph verification therefore remains unverified rather than being labeled unavailable by assumption.

#### Performance, global assets and local caching

- Production `npm run build -- --stats-json` passed and prerendered 11 routes. Initial JS/CSS graph is **1,047,332 raw bytes**; independently gzip-compressing its files totals **258,026 bytes**. This gzip calculation is not the CLI's estimated transfer figure or observed Netlify transfer. Existing 500kB warning remains; budgets are unchanged.
- Final baseline: Lighthouse **13.6.0**, Chrome **156**, local production static preview, mobile 412×823/DPR 1.75, simulated throttling (150ms RTT, 1638.4kbps throughput, CPU×4), analytics enabled. Six sequential samples ran after builds/browser tests completed. Cold performance scores **85/86/92** (median **86**), median LCP **1.510s**, TBT **499ms**, CLS **0.0558**. Warm/storage-preserved scores **78/96/87** (median **87**), median LCP **0.550s**, TBT **500ms**, CLS **0.0558**. Warm means reused browser state/HTTP cache, not service-worker control. Variance remains material; these are diagnostic local baselines, not a speed improvement or a comparison with the old Lighthouse 9.6.8 report. LCP is the hero research-title paragraph in all six samples.
- Cold sample 1 observed **2,087,663 transferred bytes** across page resources on this uncompressed local preview. Analytics loader alone transferred **197,525 bytes** for a **599,808-byte decoded script**; LineIcons EOT/TTF transferred **147,597 / 147,404 bytes** respectively. Those are actual sampled network values, separate from the JS/CSS graph and synthetic gzip calculation. No analytics CPU contribution or removal benefit is inferred from byte counts; external payloads can change.
- Isolated copied-source experiment lazy-loads Works through a feature NgModule, retaining CDK. Build passed: initial graph **998,009 raw / 244,622 gzip bytes**, a **49,323 raw / 13,404 gzip-byte** reduction. Works/CDK move from main to a lazy chunk; shared overlay CSS remains global. Local first `/work/` requests render both projects in each build. This is bundle/route evidence, not a Lighthouse speed claim or an adopted implementation.
- Browser network confirms both EOT preload and TTF font use (PERF-01); generated HTML contains the EOT font preload. Poppins is a separate Google Fonts import. External responses and local static-server cache headers differ from Netlify; cross-browser glyph fidelity and font-format removal remain pending.
- Three diagram PNGs total 399,230 bytes. Full-resolution quality-85 WebP candidates total 70,424 bytes; AVIF candidates were also generated, plus a 960px UPIGAN variant. Full-resolution side-by-side/crop inspection retains legible labels with small compression differences. GMoE/GE sources are only 550px wide: do not upscale or imply extra detail. UPIGAN is 1240×1065; its diagram text needs full-size access when displayed small. No candidate replaced a source asset, and rights gaps are CONTENT-FIGURES.
- Primary evidence: [GMoE paper](https://www.cs.memphis.edu/~lanwang/paper/sensors-26-05661-v2.pdf) states CC BY; [MDPI reuse policy](https://www.mdpi.com/about/openaccess) permits attributed reuse of its figures. Specific figure credit lines and UPIGAN permissions still need verification; generic policy is not treated as proof of every image's rights.
- Static production preview serves real prerendered route HTML and mocks `/feed` as `[]`; it does not exercise Netlify SSR or edge headers. A separate call to the actual exported handler returned real upstream `/feed` JSON (200), while localhost route requests returned the explicit allowed-host rejection (400). Running the documented server command exits without starting an HTTP listener. No live deploy, account settings, redirects or deploy identity were inspected.
- No generated ngsw-worker.js/ngsw.json exists. Clean/reloaded preview pages have zero service-worker registrations and no controller. An installed registration call cannot supply missing build output; control/update-between-builds checks remain blocked until this is addressed. Browser resource inventories show the baseline bibliography chunk is not requested before navigation; lazy Works experiment similarly defers its own route chunk. Do not confuse static preview HTTP revalidation with service-worker caching.

| Loaded global entry | Consumers / side effects observed by source inspection | Decision |
| --- | --- | --- |
| jQuery | Provides `$`/jQuery; appear, Waypoints and easing extend/use it. | Candidate only after dependent plugins are isolated. |
| Popper v1 | Global positioning API; Bootstrap package compatibility/consumers require separate verification. | No removal inferred from absent direct Angular calls. |
| Bootstrap JS | Installs plugin/data APIs; current navbar state is Angular-owned. | Inventory other components before removal. |
| jquery.appear | Registers appear event/plugin behavior. No active authored Angular caller found. | Removal candidate, not proven unused at runtime everywhere. |
| Waypoints | Registers waypoint APIs. No active authored Angular caller found. | Same verification boundary. |
| counterup2 | Counter utility; old counter use occurs in unloaded main.js.bak. | Same verification boundary. |
| Start Bootstrap | Zero matching current DOM targets; isolated removal described above. | Agreed removal is now evidence-backed; full regression gate still applies. |
| jquery.easing | Extends jQuery easing; old scrolling-nav.js references it but is not a configured build script. | Verify dependent removal together. |
| Modernizr | Feature detection/global classes; no direct Angular caller found. | Check CSS/feature side effects before removal. |
| Local parallax | Index component constructs/enables/disables it; live pointer transforms observed. | Preserve. |
| Bootstrap CSS | Grid, navbar, containers, utility classes across templates. | Shared required framework; do not remove wholesale. |
| LineIcons CSS | Icon glyphs across navbar/footer/Works/social links; all font source formats listed. | PERF-01; verify glyphs before changing. |
| default.css | Shared spacing utility classes used in templates. | Preserve used utilities; audit before pruning. |
| style.css | Shared theme, responsive navbar, hero, Works and CSS motion; imports Google Fonts and CDK overlay CSS. | Fragmented ownership is DESIGN-01; no broad rewrite here. |
| retainable.css | Scoped legacy feed styles; active writing view uses Angular-owned markup. | Candidate after selector/visual comparison, not filename-based removal. |
| Google Analytics | Gtag service inserts external script/config on browser initialization. | Measure requests separately; no removal or product-policy decision made. |

#### Evidence and remaining verification boundaries

Artifacts are in the session visualization directory under `phase1-investigation/`: Lighthouse JSON, browser/lazy statistics, structured layout/network/navigation/handler observations, screenshots, image comparisons and Cypress results. Diagnostic harnesses and the isolated source copy are ignored under `tmp/`; project dependency manifests were not changed. Earlier exploratory Lighthouse samples are separate from the final baseline; performance comparisons must use the final pinned version/settings and equivalent hosting.

Reproduction: start the app at the configured Cypress base URL, run `node node_modules/cypress/bin/cypress run --browser chrome --headless --spec "cypress/e2e/layout-works.cy.ts"`; run the full unit suite with `npm test -- --watch=false --progress=false`. Both intentionally report the registered failures above. Build with `npm run build -- --stats-json`. Production Lighthouse uses `npx --yes lighthouse@13.6.0 http://127.0.0.1:4201/home/ --port=9223 --only-categories=performance --output=json --output-path=<report.json> --quiet` against the correctly typed static preview; add `--disable-storage-reset` only for separately labeled warm runs. The session artifacts retain the local preview/CDP/variant harnesses; they do not substitute for a real Netlify request.

Remaining external/technical checks: actual Netlify deploy identity and routes/feed/SSR/redirect/cache headers; service-worker control and two-build updates after missing output is fixed; Firefox/Safari glyph/interaction verification (Firefox headless attempt produced no image; Safari not exercised); image-specific rights gaps; VERIFY-04's native Enter button runner limitation. These do not prevent implementing the locally reproduced Phase 2 defects. No claim that all Phase 1 acceptance tests pass.

### Current batch: browser baseline and navigation coverage

Scope: make the existing Cypress runner usable, correct stale test expectations, run the unchanged application baseline, then add Phase 1A checks. Preserve runtime behavior; record application defects exposed by these checks for Phase 2 rather than weakening assertions or silently changing navigation.

- [x] Verify the matching Cypress binary and run the existing smoke/publication browser suites.
- [x] Replace BUG-01's obsolete About placeholder expectation with current biography/skills assertions and rerun the baseline.
- [x] Cover native keyboard activation on desktop/mobile, browser back/forward, direct/client fragment navigation, and route/history changes during active scroll animations.
- [x] Record reproducible failures with IDs, commands, expected/actual outcomes and artifacts; run compiler/guidance checks and review the test changes.

#### Browser baseline and Phase 1A results — November 7, 2026

- Scope remained three files: the smoke spec, a new navigation spec and this plan. No application runtime, CSS, dependency, build or deployment configuration changed. No commit/push/deployment was performed in this batch.
- Matching cached Cypress verified outside the sandbox; no download or dependency upgrade was needed. The first unchanged browser baseline was **24 passing / 1 failing**. Its only failure was BUG-01. After replacing that stale assertion with current biography/skills checks and absence of obsolete placeholder text, the existing smoke/publication suites passed **25/25**.
- Final combined Chrome run: **51 tests, 39 passed, 12 failed, 0 pending/skipped**. Existing smoke **21/21** and publications **4/4** stayed green. New navigation coverage is **26 cases: 14 passed / 12 failed**. Exit status is intentionally nonzero; the failing regressions remain active for Phase 2, with no skipped tests or weakened geometry assertions.
- Passed checks include all seven desktop keyboard activations, desktop/mobile Tab reachability, desktop/mobile back/forward route composition and metadata, desktop fragment load/reload, and the final run's direct mobile fragment load. The initial mobile fragment result was intermittent in earlier runs; its final pass does not close BUG-05.
- Failed cases: **7 mobile heading-clearance cases (BUG-09)**, **2 hydrated client-fragment clearance cases and 1 mobile fragment-reload case (BUG-05)**, and **2 animation-interruption cases (BUG-08)**. Mobile activations changed the expected path and retained homepage composition before their heading failures; later active-state/menu-close/history-length/title assertions in those failed cases were not reached and are not claimed as passes.
- Tests use actual native Tab/Space/Enter events, current-URL replacement checks, Angular bootstrap/testability readiness for fragments, and stable scroll/heading/navbar geometry. Initial and reload fragment cases are separate; positive scrollY prevents a naturally visible heading from falsely establishing anchor movement.
- Isolated Enter diagnostics delivered uncanceled trusted keydown/up but no click for both the toggle and a plain control button without Angular handlers. This is tracked as VERIFY-04, not an application keyboard defect. The Tab-order case uses native Space to open the menu; native Enter button activation remains unverified separately. Temporary observer specs were archived outside the repository and removed.
- Cypress strict typecheck, guidance-integrity check and `git diff --check` passed. Independent read-only review checked the tests, readiness assumptions, failure classification and documentation. Unit/build suites were not repeated because runtime/build sources were unchanged.
- Artifacts are outside the repository in the session's `navigation-batch/final/`: structured `results.json` and failure screenshots. The baseline failure and isolated keyboard-control artifacts are under the sibling `baseline/` and `tab-control/` folders. Final results are reproducible with the app running at the configured Cypress base URL and all three `cypress/e2e/*.cy.ts` specs.

At this November 7 checkpoint, Phase 1A's href/Start Bootstrap investigations and Phases 1B/1C/1E were still outstanding. The November 8 batch above supersedes that investigation status; locally reproduced defects remain Phase 2 work with regression cases kept intact.

Write or update regression tests and establish measurements before changing application behavior. A test that exposes an existing defect may fail initially; record the result and expected behavior instead of weakening it. Run unrelated existing tests and distinguish pre-existing failures. The obsolete About-placeholder expectation has been corrected and verified in the browser baseline (BUG-01).

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

Implementation sequence for MIG-01 (approved dry run, November 7):

- [x] Freeze all 14 rendered citations and their resources; add a failing stable-ID rendering check.
- [x] Introduce typed shared core, resource references, ordered selected IDs and lazy citation details; preserve the five selections and existing author formatting.
- [x] Render full bibliography from records and resolve research links/figure citation facts from shared records; keep arXiv association unresolved unless established.
- [x] Verify citation fidelity, IDs/references, SSR/browser routes, eager/lazy output and compiler/tests; update content ownership and close only completed work.

#### MIG-01 implementation and validation — November 7, 2026

Core facts/resources and selected ordering now live in `publication-core.ts`; model/format helpers are separate. `publication-details.ts` holds plain-text citation parts and references to shared facts, imported at runtime only by the lazy bibliography component. No stored HTML or additional content database was introduced. Narrative and figure-specific attribution remain with their feature. The frozen fixture is test-only and excluded from production inputs.

- Red/green evidence: the original bibliography passed the new complete citation/resource baseline check but failed the stable-ID check (0 IDs versus 14). After migration, both passed.
- Final review found a current-tab publisher link changed to a new tab. The strengthened baseline reproduced that single failure; resource presentation now retains the original target, and unit/browser-spec checks cover targets alongside text and URLs.
- Full Jasmine/Karma suite: **44 passed**. App/spec/Cypress strict typechecks passed. The production build with stats passed and prerendered **11 routes**. Guidance and whitespace checks passed. Independent read-only review found no actionable issues.
- Preservation: **14 complete citations**, category/entry ordering, author names/order/highlighting and alternate links; **5 selected view records** and URLs; **8 research links** and **4 figure captions** matched frozen pre-migration expectations.
- Local Chrome/CDP checks: direct `/publications/` at desktop/mobile widths, selected/research content comparison, hydrated CTA navigation to the lazy page, reload, and all 14 citations/resources in prerendered HTML with JavaScript disabled. These prove local prerender/browser behavior, not live Netlify handler behavior or the separate no-JS navbar migration.
- Before/after desktop and mobile screenshots were captured outside the repository. Initial generic Windows preview served scripts as `text/plain`; a correct local MIME configuration resolved that harness problem. Existing service-worker 404/NG05604 diagnostics were retained and classified under VERIFY-01, not counted as a migration regression.
- Browser build stats: citation details appear only in `chunk-QONCJCH2.js` via a **dynamic import** from the main bundle. Server details appear only in `chunk-G53JXUMM.mjs`, also dynamically imported. The snapshot fixture and specs are absent from both production input graphs.
- Measured browser sizes: initial JavaScript grew **6,218 raw bytes** because shared core records are eager; the lazy bibliography changed **10,549 → 10,175 bytes** (−374). Initial total is approximately **1.05 MB raw / 216.92 kB estimated transfer**, versus **1.04 MB / 215.19 kB** before. This is a maintainability change, not a claimed performance improvement. Existing warning budgets were not changed.
- Added Cypress publication journeys; the runner was not executed during the migration because the sandbox reported the binary unavailable. Chrome/CDP provided separate evidence. The later browser-baseline batch verified the cached binary outside the sandbox and passed all four publication journeys plus the corrected smoke suite (see VERIFY-03/BUG-01). No publication URLs, external bibliographic facts, arXiv association or deployed Netlify state were independently verified; no deployment occurred.

- Establish tests for all bibliography entries, categories, ordering, complete authors and citation details, links, and the five selected entries. Cover the existing author-shortening cases and ensure research links remain correct. Preserve the copyright disclosure and Scholar link.
- Record initial and lazy-chunk sizes before consolidation so the effect on the homepage can be measured.

### 1E. Works popup and component cleanup

- Test keyboard opening, a reachable close control, Escape and backdrop dismissal, focus return, and navigation away while the popup is open. Record any existing failures as regressions to address in Phase 2.
- Check that navigating away from Works disposes of the overlay. Check that destroyed components release their timers, animation frames, and event listeners, including the footer's Back-to-top handlers.
- Use build statistics to establish whether Works and CDK Overlay are in the initial bundle. Compare the initial bundle and first `/work` visit in an isolated lazy-loading experiment before choosing whether to replace CDK Overlay.

## Phase 2 — Small, reviewable fixes

Implement only after the relevant Phase 1 tests and evidence exist. Each part can be reviewed and verified independently.

### Performance implementation — November 9, 2026

User-authorized scope: remove Start Bootstrap, evaluate/adopt lazy Works, and optimize fonts, images and proven-unused assets. Baseline is commit `1e792dc`; changes are on `codex/performance-optimization`. The stylesheet proposal remains separate. This record supersedes the earlier experiment-only statuses for these optimizations.

- Removed Start Bootstrap, jQuery, Popper v1, Bootstrap JS, jquery.appear, Waypoints, counterup2, jquery.easing and Modernizr from the global build. Removed the seven corresponding direct npm dependencies and their lock entries; Bootstrap remains for its used CSS. Source/DOM/CSS inventories found no live plugin/data-API/feature-class consumers. Old calls existed only in unloaded backup scripts. Navigation and pointer-driven parallax checks still pass; parallax is the sole retained global script. Analytics is unchanged.
- Removed 20 unused copied duplicate/vendor assets totaling **614,981 source bytes**, including `retainable.css`. Required Bootstrap CSS, theme/spacing/icon CSS, source map, logos, portraits, research originals, PDFs, parallax and license-bearing font sources remain. Deleted files with no prior requests reduce copied output, not page transfer; do not add this figure to bundle/network savings. The obsolete commented Retainable script reference was removed.
- Adopted a lazy NgModule for `/work`, retaining CDK Overlay/focus management. Browser/server graphs keep Works/CDK outside the initial graph and full citation details in a separate lazy chunk. A same-document production navigation requests Works only after leaving Home; direct prerendered Works still has both projects. Shared overlay CSS remains global. No CDK replacement was needed.
- Added a lossless **71,516-byte WOFF2** from the existing LineIcons font, with WOFF fallback. All 464 glyphs, 463 character mappings, 460 CSS mappings, outlines/hints/metrics and licensing metadata were preserved. The generated preload and Chrome request now agree on WOFF2, replacing the previous EOT-plus-TTF requests (**294,604 raw font bytes**). Original formats remain as source/fallback assets. Poppins remains unchanged.
- Added full-resolution, pixel-identical lossless WebP alternatives for GMoE (**105,197 → 57,556 bytes**, 550×184) and GE (**175,078 → 99,118 bytes**, 550×293): combined **123,601 bytes / 44%** smaller. `<picture>` retains original PNG fallbacks, alt text, lazy loading, image resolution, CSS geometry and complete captions. Four research figures retain their prior geometry/content. No lossy conversion, resizing or upscaling.
- Figure evidence: the primary [GMoE PDF](https://www.cs.memphis.edu/~lanwang/paper/sensors-26-05661-v2.pdf) and [GE PDF](https://www.cs.memphis.edu/~lanwang/paper/jimaging-10-00131.pdf) state CC BY 4.0. GE's first page was retrieved and parsed locally after the earlier web-reader size limit. Existing attribution remains. UPIGAN/Map901 assets were not converted because their particular reuse evidence remains unresolved; CONTENT-FIGURES stays partially open.

#### Bundle and execution evidence

| Initial JS/CSS graph | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Raw bytes | 1,059,219 | 718,728 | 340,491 (32.1%) |
| Independently gzipped bytes | 261,006 | 172,383 | 88,623 (34.0%) |

Gzip is a reproducible file-size calculation, not a Netlify transfer observation. Budgets are unchanged; the **500 kB initial warning still fires** at 718.73 kB. Research-image savings apply when those lazy images are viewed, not necessarily hero LCP. Optimizations overlap in the aggregate initial graph; individual estimates must not be added again.

Lighthouse **13.6.0 / Chrome 156**, default simulated mobile throttling (412×823), identical static preview implementation, analytics enabled, three sequential cold and three warm samples per build:

| Median | Before | After |
| --- | ---: | ---: |
| Cold performance score | 87 | 92 |
| Cold LCP | 1,514 ms | 1,577 ms |
| Cold blocking time | 312 ms | 308 ms |
| Cold layout shift | 0.038 | 0.056 |
| Cold observed transfer | 2,099,689 bytes | 1,412,864 bytes |
| Warm performance score | 95 | 76 |
| Warm blocking time | 231 ms | 1,234 ms |

These results do **not** establish an overall speed improvement. The warm-score drop triggered an investigation: no leftover content tabs were present; the unchanged baseline was also slower under current conditions. Added a priming sample per build, then three alternating-order warm pairs with unchanged Lighthouse settings. Their median scores are **79→76**, blocking **953→1,188ms**, LCP **557→221ms**, and CPU benchmark **1,014.5→829.5** (after samples experienced a slower host). The original baseline warm benchmark was approximately 1,686.5. Timing/CLS varied and external analytics remained enabled; no application cause can be isolated from this unstable environment. All initial/control reports are retained, with priming excluded from paired medians. Stable-environment warm performance remains **VERIFY-05**; no budget increase or unsupported LCP claim.

- Full Chrome Cypress regressions **73/73**, unit tests **71/71** (one added PNG-fallback/alt regression, observed red before implementation), all three strict compiler checks, guidance and production build passed; **11 routes** prerendered. No existing assertion was weakened, skipped or retried. Independent read-only review found no actionable issue.
- Production browser inspection covers desktop/mobile Home/Research, moving parallax, absent vendor globals, a single WOFF2 request, identical glyph mappings and figure geometry/captions, same-document lazy Works navigation, modal close/focus return, no runtime exceptions, and no-JS Works/publication prerendered content. Before/after screenshots were inspected.
- Firefox 153 production font/rendering samples pass on Home, Works, Service and Contact (**4/4**). Diagnostic harness initially assumed each visit produced a Resource Timing entry and every duplicate critical-CSS FontFace was loaded; Firefox cache reuse/unused duplicate declarations invalidate those assumptions. Final checks verify the used loaded face and every sampled icon's family/content, with screenshots. Temporary diagnostics were archived outside the repository. This is sampled font coverage, not a full Firefox interaction certification; Safari remains unverified.
- Evidence is retained in the session artifact directory `performance-pass/`: frozen before/after production builds/stats, Lighthouse reports, `summary.json`, `browser-verification.json`, screenshots, image/pixel audit, font diagnostic, full Chrome/unit logs and harnesses. Local preview serves prerendered static HTML and a mocked empty feed; it does not prove Netlify SSR/feed/cache behavior.
- At initial validation these changes were uncommitted. No push, deployment, live configuration change or service-worker change. Missing service-worker output and real Netlify checks remain VERIFY-01. Remaining scope: stable warm-load measurement (VERIFY-05), Safari, unresolved figure rights and further measured CSS/font opportunities; the separate visual proposal still awaits approval.

#### Local integration handoff — November 9, 2026

The user requested a label on the existing master before local integration. Annotated tag `pre-performance-optimization` preserves commit `1e792dc`, the pre-performance master. Performance changes are grouped into focused commits for unused dependency/assets removal, lazy Works, lossless media, and documentation, then fast-forwarded into master. Compiler/guidance/feed checks and the full unit suite are repeated for integration; prior Chrome/Firefox/production evidence above applies to the unchanged runtime tree. Nothing is pushed or deployed. VERIFY-01, VERIFY-05, Safari and remaining figure rights stay open.

### Pre-commit review — November 9, 2026

- Independent source review found one P2 issue: pending initial-anchor restoration checks shared-animation revision but does not observe native viewport scrolling. On `/home#research` with delayed `/feed`, manual scrolling before stability can be undone when the promise resolves. BUG-05 is reopened and marked at the owning callback.
- Added `preserves native scrolling before initial hydration settles` to the app spec. It changes the observed viewport position before the deferred callback. It has not yet run: fresh unit/build validation encountered missing Angular, RxJS, TypeScript and build packages during a concurrent install/cleanup. These toolchain failures are not evidence of an application regression or a newly passing test.
- User confirmed another install/cleanup is running. A restoration attempt was stopped; do not run competing installs. Resume the red/green fix and validation once that work is finished. No runtime fix for this edge case or commit was made in this review.
- The last completed application verification remains the November 8 **72/72 browser, 67/67 unit, 4/4 feed** baseline. It does not include the new native-scroll regression. Guidance and whitespace checks can still run without the dependency tree.
- Clarified the existing standalone-server result in README and added a local-versus-deployed verification matrix to the Netlify notes. No service-worker, deployment or live configuration changes were introduced.


### P2 native-scroll follow-up — November 9, 2026

The dependency cleanup finished; checks ran against the restored installed toolchain without starting a competing install. The review finding is now resolved locally, and BUG-05 is closed again with the additional coverage.

- Red evidence: app-spec run **10 tests, 8 passed / 2 failed**. Both native position changes and scrolling away/back were overwritten by the old deferred anchor callback.
- Fix: remember scroll events only while initial stability is pending, compare the current viewport position with the navigation snapshot, and preserve the existing animation-revision/destruction guards. Any observed movement suppresses the pending fallback, even when the final position returns to its start. No new animation, URL or metadata behavior was introduced.
- Lifecycle: release the owned passive scroll listener when stability resolves or the root is destroyed. Unit coverage exercises both paths and preserves the original initial-anchor restoration when no newer scroll occurred.
- Browser regression holds the real frontend feed response, sends trusted native PageDown, proves the viewport moved, then releases the feed and verifies hydration keeps the manual destination and fragment URL. Failure cleanup also releases the held response. This does not use a synthetic application click or a fixed network delay to infer native scrolling.
- Final full unit suite **70/70**; full Chrome browser suite **73/73**, **0 failed/pending/skipped** (layout/Works 20, navigation 28, publications 4, smoke 21). Strict app/spec/Cypress checks, production build/prerender (**11 routes**), guidance and whitespace checks passed. Existing initial budget warning remains about **1.06 MB raw**; no budget increase or performance claim.
- Scoped independent read-only review found no actionable issue in the correction. Evidence: session artifacts `p2-native-scroll/REPORT.md`, structured results and red/green/build logs. Earlier November 8 and initially blocked November 9 results above are historical records, not the latest validation.
- Unrelated pending edits were preserved. No commit, push or deployment; Netlify/service-worker verification remains separate work.

### Commit handoff — November 9, 2026

The user requested focused commits for all pending changes. The handoff groups test baseline/asset repairs, narrow-screen caption wrapping, Works accessibility, route scrolling/hydration, lifecycle cleanup, the stylesheet proposal, and validation/deployment documentation separately. Earlier statements that changes were uncommitted describe the state before this handoff.

Runtime code is unchanged from the latest **73/73 browser and 70/70 unit** verification, strict checks and production build with **11 prerendered routes**. Guidance and whitespace checks were repeated for the commit handoff. The stylesheet reference/sample remains a proposal awaiting implementation approval. No push, deployment or live Netlify configuration change was performed.

### Fix 1 — Mobile navigation offset (BUG-09), November 8, 2026

- Removed subtraction of the expanded absolute menu from the fixed navigation's measured height. Kept animations, 16px clearance, desktop calculation, URL replacement, metadata and existing menu behavior. No CSS or unrelated application behavior changed.
- Red/green unit evidence: expanded-menu geometry targeted 639px where 409px was expected; after the fix both expanded and collapsed menu cases target 409px. Full unit suite: **48 tests, 45 passed / 3 failed**; the three failures remain BUG-03/04 lifecycle regressions.
- Browser verification: **51 tests, 44 passed / 7 failed**. Smoke **21/21**, publications **4/4**. Navigation **19/26**, including all seven mobile and all seven desktop activation cases, Tab and history checks. Failed cases are five fragment cases (BUG-05) and two route-interruption cases (BUG-08); assertions remain unchanged and active. Fragment races also affected desktop reload and initial mobile load in this run; do not infer new offset failures from a varying total.
- Production build passed with **11 prerendered routes** and the existing initial-bundle warning. App/spec/Cypress typechecks passed. Scoped independent review found no actionable issue. Desktop/mobile Research success screenshots were inspected; the unrelated mobile document overflow remains BUG-06.
- Evidence is under session artifacts `mobile-offset-fix/` (structured browser results, success/failure screenshots and logs). No commit, push or Netlify deployment. Prior uncommitted tests/docs/design work was preserved. Next fix: BUG-08 interrupted scrolling.


### Fixes #2–11 — November 8, 2026

User-authorized scope: complete the ten remaining reliability/accessibility fixes; retain failing regressions and preserve unrelated pending design/documentation edits. No dependency upgrade, publication edit, stylesheet redesign, commit, push or deployment.

| Fix | Implementation | Evidence |
| --- | --- | --- |
| #2 — Interrupted scrolling | Cancel shared animation on NavigationStart; generation tokens prevent queued stale callbacks and deferred initial scroll from taking control after a newer action. Non-fragment destinations receive an instant top reset, including hydration transitions. | Two original browser interruptions; newest-action smoke case; new stale-frame and deferred-intent unit regressions. |
| #3 — Fragment scrolling | Measure fixed-header anchor offset through ViewportScroller; avoid fragment top resets; restore initial fragment after stability. Start perpetual decorative parallax outside Angular so hydration can settle while hero motion continues. | Direct/reload/client fragments at desktop/mobile; delayed-feed/newer-section browser case; initial/destroyed/deferred anchor unit checks. |
| #4 — Mobile overflow | Let long caption/license URLs wrap through scoped overflow-wrap:anywhere. No clipping or document overflow mask. | Home/Research at 360/390/1280px; open/closed menus; gallery remains independently scrollable; production screenshots. |
| #5 — Popup opener | Named native buttons with dialog indication; reveal hover content on keyboard focus without changing gallery content. | Native Tab/Enter opening, accessible name checks; plain trusted native-button control. |
| #6 — Popup dismissal/focus | Modal semantics, initial close-button focus, CDK focus trap, close/Escape/backdrop, return to actual opener; dispose overlay/subscriptions/trap without restoring departing-route focus. | Browser dismissal/focus/SPA teardown; unit close, sentinels, second opener, repeated opening, SSR and disposal. |
| #7 — Footer cleanup | Keep both listener cleanup callbacks and fade timeout; release them and shared animation on destruction. | Original red cleanup test plus fade-race, 200ms fade and detached-click tests. |
| #8 — Preloader cleanup | Retain and clear 500ms timeout; preserve parallax cleanup/orientation guard. | Original post-destroy regression, positive timing and SSR checks. |
| #9 — 404 cleanup | Retain and clear delayed redirect; correct misleading three-second comment while preserving five seconds. | Original post-destroy regression, 4999/5000ms positive checks and SSR. |
| #10 — Main landmark | Root main encloses router outlet; replace standalone inner main wrappers with equivalent block divs. | Shell unit assertions, ten production route DOM checks, local homepage accessibility audit. |
| #11 — Test assets | Replace nonexistent public test asset source with real src/assets. | Real asset fetch verifies 200, WebP MIME and nonempty body; final Karma log has no hero 404. |

Review caught a delayed-initial-anchor ownership race; added a failing unit test, then guarded it using scroll generations. A second failing unit check proves canceled queued RAF callbacks cannot write/reschedule. The delayed browser regression then exposed the existing never-stable parallax loop; keeping it outside Angular lets hydration finish while preserving pointer-driven motion. These fixes retain the original browser assertions.

The earlier Enter limitation was independently reproduced with raw versus complete trusted Chrome events. Installed Cypress key_press.js omits Enter text. The helper targets the Chromium browser family and sends keydown with carriage-return text plus keyup; a plain button's isTrusted click is asserted before testing Works. No element.click substitute, retries, skipped tests or application keydown workaround was introduced.

Local verification: **67/67 unit tests**, **4/4 feed tests**, strict app/spec/Cypress typechecks and production build (**11 prerendered routes**). Existing initial budget warning remains at approximately **1.06 MB raw**; budgets are unchanged and no performance gain is claimed. Production inspection covers ten route landmarks and modal/overflow states at 360/390/1280px; local homepage accessibility audit scores **100**. Final combined browser result and command logs are retained in session artifacts `phase2-fixes/`; see the final validation record below.

Review was independent and read-only. Source-specific figure rights, other-browser coverage, real Netlify deploy checks, missing service-worker output, font/asset optimizations, Start Bootstrap removal and lazy Works adoption remain separate work. Existing writing-feed module-type warning remains. Site runtime fixes are local; no live site was changed.

#### Final validation for fixes #2–11

- Full Chrome Cypress run: **72/72 passed**, **0 failed/pending/skipped**. Breakdown: layout/Works **20/20**, navigation **27/27**, publications **4/4**, smoke **21/21**. This includes the trusted native Enter control and delayed-hydration/newer-section regression; no original assertion was weakened.
- Full Jasmine/Karma run: **67/67 passed**, including the original three lifecycle failures and new positive timing, SSR, modal focus, stale-frame and deferred-scroll tests. Real hero WebP asset fetch passed; no hero-image 404 remains in the final log.
- Feed **4/4**, all three strict compiler checks, production build/prerender (**11 routes**), guidance and whitespace checks passed. The initial budget warning remains approximately **1.06 MB raw**, with unchanged budgets. This is not a performance-optimization claim.
- Final production DOM/render checks verified one main landmark on ten routes and caption/modal geometry/focus at **360/390/1280px**. Desktop/mobile screenshots were inspected. Local homepage Lighthouse accessibility: **100**. This is a sampled automated result, not deployed or universal manual accessibility certification.
- Session artifacts `phase2-fixes/REPORT.md`, `results.json`, `production-visual.json`, `accessibility-home.json`, screenshots and logs retain the evidence. Relevant commands are the manifest's unit/build/typecheck/feed scripts and headless Chrome Cypress across `cypress/e2e/*.cy.ts`; the artifact harness records exact spec paths/options.
- No outstanding blocker for fixes #2–11. Unrelated pending edits were preserved. Changes remain uncommitted; no push/deployment or live Netlify changes.

1. **Navigation:** Fix confirmed scroll conflicts using one clear owner per behavior. Preserve the seven existing links unless Phase 1 demonstrates and validates an equivalent alternative.
2. **Mobile layout:** Correct the identified overflow at its source while preserving the moving shapes and layout. Verify at the tested widths.
3. **Publications (completed locally, MIG-01):** Retain shared core records, stable IDs/categories and ordered selections, lazy citation details, full information/links and author formatting. Preserve measured bundle boundaries and reference tests; do not repeat consolidation.
4. **Fonts, images, and assets:** Make only measured and visually verified changes. Preserve figure quality and attribution; resolve or explicitly track outstanding permissions. Do not remove the parallax asset.
5. **Component cleanup and caching:** Fix confirmed lifecycle issues and apply service-worker changes only where the production checks demonstrate a problem. Verify the affected routes and feed after each change.

### 2A. Grouped removals

Review the following removals together after the Phase 1 tests and evidence are in place. Remove only items whose consumers and effects have been verified; defer uncertain items for separate investigation.

- **Implemented locally November 9:** Start Bootstrap build entry/direct dependency removed with the complete navigation regression gate passing.
- **Implemented subset:** Verified unused globals/dependencies, legacy feed CSS and duplicate assets removed as recorded above. Original font formats and uncertain assets remain. Review Google Analytics separately before any change to it.
- **CDK Overlay retained:** Lazy `/work` removes it from the initial graph while preserving the popup/focus/disposal implementation. Replacing it is not necessary for this pass.
- Keep the local parallax library and moving hero, existing mobile navigation and animations, and the site's reusable CSS. Preserve all required assets and attributions.

## Acceptance criteria

- Relevant Phase 1 tests and visual checks pass after each change; run production build, unit tests, and Cypress when applicable.
- Homepage section scrolling, visible URL and metadata behavior, mobile navigation, Back-to-top, and the moving hero remain intact.
- Existing prerendered routes, standalone pages, Netlify SSR, and `/feed` remain functional.
- Full publication details and links remain available, the bibliography stays lazy-loaded, and the five selected records remain correct.
- Record before/after bundle and Lighthouse results. Do not claim a performance improvement without comparable measurement or assume every individual change must reduce the initial bundle.
