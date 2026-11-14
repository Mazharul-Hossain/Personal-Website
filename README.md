# Mazharul Hossain — Personal Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/3b24fe33-de72-4b5d-8129-3b8005b34d4b/deploy-status)](https://app.netlify.com/sites/stoic-lamport-e2ed9d/deploys)

The Angular portfolio for [hmazharul.com](https://www.hmazharul.com/) presents research, publications, experience, writing, and contact information. It uses NgModules, server rendering, hydration, and a Netlify request handler. This is modern Angular, not AngularJS.

## Sources of truth

Keep facts in their authoritative location and link to them elsewhere.

| Information | Authority |
| --- | --- |
| Dependency ranges and executable commands | [package.json](package.json) |
| Exact dependency versions | [package-lock.json](package-lock.json) |
| Build entries, global style/script order, output, budgets | [angular.json](angular.json) |
| Netlify response-header overrides | [netlify.toml](netlify.toml) |
| Service-worker resource caching and navigation rules | [ngsw-config.json](ngsw-config.json); CACHE-01 below states required behavior |
| TypeScript and Angular compiler policy | [tsconfig.json](tsconfig.json) and its app/test/Cypress extensions |
| Whitespace and formatting | [.editorconfig](.editorconfig), Prettier settings in the manifest |
| Routes | [app-routing.module.ts](src/app/app-routing.module.ts), feature route declarations |
| Shared policy and behavioral contracts | This README |
| Plan status, bugs, content ownership | [docs/README.md](docs/README.md) and its linked active plan |
| Implementation plan structure and refactoring pre-test gate | [Plan template](docs/PLAN_TEMPLATE.md) |
| Agent-only instructions and skill routing | [AGENTS.md](AGENTS.md) |

Do not restate dependency versions in prose. Match Node to the installed Angular toolchain's supported engines. Chrome/Chromium is needed for Karma. Install locked dependencies with `npm ci`.

## Development and verification

The manifest's `scripts` section is authoritative. Use `npm run` to list commands.

The build's `prebuild` hook runs the guidance integrity check. Behavioral contracts also require the applicable runtime tests; a link check alone does not enforce navigation or accessibility.

Before each implementation batch, state the acceptance scenarios already covered, any missing scenarios requiring new tests, and the checks planned for that batch. Describe test results by scope rather than claiming all regressions are prevented. Run focused checks while iterating and the broader relevant suite at integration; repeat successful checks when changes, failures or unresolved concerns justify it. Distinguish fresh results from prior results against unchanged code.

Use the [plan template](docs/PLAN_TEMPLATE.md) for new implementation plans. Refactoring, migrations and behavior-preserving rewrites require its mandatory pre-test gate before changing the affected implementation: establish the baseline, fill coverage gaps and demonstrate regression sensitivity. Keep existing plans' scope/status authoritative; adopting the template does not restart completed work.

| Script | Purpose / prerequisite |
| --- | --- |
| `start` | Development server; use the URL printed by the CLI |
| `build` | Optimized browser/server output and configured prerendering; baseline release check |
| `watch` | Continuous development rebuild |
| `typecheck`, `typecheck:tests`, `typecheck:cypress` | No-output compiler checks for app, unit specs, and browser specs |
| `check:guidance` | Check local documentation/header targets, simple skill frontmatter, and strict-mode policy; does not prove runtime behavior |
| `test` | Jasmine/Karma; single run: `npm test -- --watch=false --progress=false` |
| `test:feed` | Node tests with simulated upstream RSS |
| `test:server` | Production-handler response regressions; run after `build`, or set `SERVER_TEST_BUILD_DIR` to a matching build directory |
| `test:deployment` | Local HTTP fixtures validating deployment-check failure detection |
| `test:browser-helper` | Targeted isolated-Chrome startup recovery, cancellation and cleanup regressions; no app build required |
| `verify:deployment` | Read-only HTTP comparison with exact local browser output; requires URL/build path; see Netlify notes |
| `check:service-worker` | Check generated worker/cache rules and every manifest content hash; accepts a browser-output directory |
| `test:service-worker` | Build production A/B and run maintained Chrome cache/update/recovery/offline/feed-fallback tests; owns its browser/server; see Netlify notes |
| `cypress:run`, `cypress:open` | Browser journeys; start the app first; base URL is in [cypress.config.ts](cypress.config.ts) |
| `serve:ssr:my-app` | Runs the existing server bundle; the local check exits without a listener, see Netlify notes |

Keep unit specs beside components/services and normal browser journeys in `cypress/e2e/`. Production worker/update tests live in [tests/service-worker](tests/service-worker/service-worker.test.mjs), outside the Cypress proxy, and run through the manifest command above. Run them for changes to worker rules, lazy boundaries or chunk recovery. Test meaningful behavior and failure cases. There is no lint script or numeric coverage gate. Do not commit generated output, dependencies, coverage, or browser recordings.

### Local and Netlify verification

Locally, run compiler checks and affected tests. For runtime changes, run the production build and relevant browser journeys. Compare desktop/mobile screenshots for visible changes. For performance work, retain comparable build/Lighthouse evidence and distinguish raw bundle size from transfer size. Never raise budgets to hide regressions.

A local pass does not prove Netlify deployment behavior. Against a Netlify Deploy Preview (preferred) or deployed site, record the URL and deploy/commit identity. Verify direct route requests and refreshes, returned server HTML, `/feed`, redirects, and cache behavior. For caching/PWA changes, check service-worker registration, control after reload, and updates using clean and warm browser state. A manifest or registration call is not proof of a working PWA.

Inspect deployment logs, generated handlers and account settings when relevant and accessible. Publishing or changing live settings requires task authorization. Report unavailable deployed checks as unverified. See [Netlify SSR notes](docs/NETLIFY_SSR_NOTES.md) for known uncertainties, including the standalone server command.

## Project and content map

| Location | Responsibility |
| --- | --- |
| `src/app/` | Components, services, templates, styles, adjacent specs |
| `src/app/index-page/` | Homepage composition and hero |
| `src/app/home/standalone-pages.component.ts` | Route wrappers reusing homepage sections |
| `src/app/shared/` | Browser abstraction, metadata, scroll animation |
| `tests/service-worker/` | Maintained Node/Chrome production A/B, cache, recovery, offline and feed-fallback tests |
| `src/app/publications/` | Selected records and lazy-loaded bibliography |
| `src/app/works/` | Lazy Works feature module, project gallery and accessible CDK popup |
| `src/assets/` | Theme CSS, vendor scripts, fonts, images, attribution-bearing assets |
| `src/main.ts`, `src/main.server.ts`, `src/server.ts` | Browser/server bootstrap and Netlify request handling |
| `src/writing-feed.ts` | Server-side RSS integration |

TypeScript records are authoritative for structured portfolio facts; templates render them. The [content map](docs/README.md#content-ownership-and-migration) identifies legacy locations and consolidation work. Do not introduce another independent publication record or invent personal facts.

## Behavioral contracts

These are mandatory acceptance criteria. Preserve them unless the user explicitly changes the requirement. Preserve regression coverage; never weaken a test to hide a regression. Update tests and the contract together for an authorized behavior change.

| ID | Required behavior | Evidence / acceptance checks |
| --- | --- | --- |
| NAV-01 | Homepage navigation scrolls to the section, changes the visible pathname, and retains homepage composition and metadata. | Navbar; Cypress section-navigation and metadata journeys |
| NAV-02 | Direct requests and refreshes open standalone pages with route metadata. Keep `/home` as a homepage alias, lazy `/publications` and `/work`, and `/blog`. | Router, page wrappers, metadata; direct-load/reload journeys and initial/lazy bundle checks |
| NAV-03 | Preserve seven nav items, mobile open/close, active indication, heading clearance, and back-to-top. The latest scroll/navigation action takes control. | Navbar/footer/shared animation; desktop/mobile and cancellation checks |
| NAV-04 | Current `javascript:void(0)` links are a compatibility exception. Adopt alternatives only after equivalent mobile, keyboard, URL and metadata behavior is demonstrated. | [Navigation investigation](docs/BUNDLE_OPTIMIZATION_HISTORY.md#1a-navigation-and-scroll-behavior); do not replace by assumption |
| UI-01 | Preserve moving hero shapes and existing animated interactions while improving quality. Share common CSS; keep feature styling with its component. | Rendered desktop/mobile comparison; parallax/navigation checks |
| MOTION-01 | Prefer CSS for presentation/motion. Use JS only where CSS cannot supply the required effect, recording why. Optional enhancements may be absent without JS. | CSS/JS inspection; browser session with JS disabled |
| MOTION-02 | Server-rendered content and ordinary links should remain usable without JS. CSS reduced-motion rules and JS motion are separate; current JS animations remain intentional. Audit reduced-motion and no-JS states independently. | Existing motion journey; no-JS navigation is a tracked gap, not a claimed pass |
| CONTENT-01 | Structured facts have one TypeScript authority. Preserve full citations, authors, categories, selected ordering, research links and lazy bibliography during consolidation. | Citation inventory, author specs, bibliography/bundle comparisons |
| CONTENT-02 | Preserve writing discovery/fallbacks, LinkedIn-first contact, disclosure boundaries and attribution. Do not add a public CV download or private contact details. | Content specs, feed tests, writing journeys, approved evidence |
| RENDER-01 | Support SSR/hydration. Guard browser APIs; release timers, listeners, subscriptions, overlays and animation frames at teardown. | Browser/server checks and lifecycle tests; known gaps in active bug register |
| CACHE-01 | Production service worker caches entry assets and on-demand chunks/images/fonts. Page navigation and `/feed` remain network-only; offline pages are not promised. Keep unused lazy Works/bibliography chunks out of installation prefetch. | Generated-output check; controlled browser, no-JS routes, offline assets, real asset-changing update and lazy-route checks; platform evidence remains separate |
| CACHE-02 | Future application versions recover recognized lazy-chunk navigation failures by hard-navigating to the failed same-origin route, preserving query/fragment. Permit one automatic attempt per document and at most one per tab in five minutes. Do not reload ordinary data errors or known-offline failures; blocked storage disables automatic recovery. Existing tabs without this code need manual reload. | Recovery unit/router tests, changed-build old-tab navigation and persistent-failure loop guard; retain CACHE-01 lazy boundaries |

Some checks still need implementation. The active plan records gaps; a contract states required behavior, not that all current code already complies.

## Engineering and design policy

Use full TypeScript `strict` mode and strict Angular templates/injection checks. Do not disable strictness to pass a delivery. Narrow external data and type injected abstractions. If a migration is too large for the delivery, explain the exception and track the work. Strict mode alone does not eliminate explicit `any` or validate runtime input.

Prefer current supported patterns within the installed toolchain. Existing NgModules do not justify an unrelated architecture rewrite. Use kebab-case filenames and PascalCase classes; keep templates/styles beside components.

Common visual rules belong in the loaded global theme; feature-specific layout/state rules belong in component styles. Inspect build entries: a similarly named minified asset may not be loaded. Reuse common patterns deliberately rather than moving all CSS globally. Establish shared tokens when changing the visual system; avoid a theme rewrite during a content edit.

Design changes must demonstrate hierarchy, readable typography, deliberate spacing, distinctive research-focused composition, keyboard usability and mobile layouts. Evaluate rendered screenshots and interactions. The design skill supplies the working method; the current palette is not permanent policy.

### Deferred work markers

Use `TODO<Category>[ID]: reason; next action; plan reference` at the owning code boundary. Categories: `Migration`, `Bug`, `Design`, `Verification`, `Content`. Use stable active-plan IDs; multiple markers may reference one item. Record the rationale and exit condition in the plan. Avoid vague "fix later" notes.

Example: `TODO<Migration>[MIG-02]: legacy guarded globals; use typed WindowRef/injected DOCUMENT while preserving navigation; see docs/BUNDLE_OPTIMIZATION_PLAN.md.`

Search with `rg 'TODO<' src docs`. Resolve markers and plan entries together. Legacy editorial `TODO:<ADD TRUE DETAILS>` means missing facts; keep it only when a fact remains unresolved, not as a permanent test fixture.

## Review and configuration

Keep changes scoped, commit subjects concise and imperative, and review descriptions clear about motivation, behavior, validation, screenshots and SSR/Netlify/dependency impacts. Never commit credentials. Review deployment/cache configuration and bundle budgets when those behaviors change.
