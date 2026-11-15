# Documentation authority and active work

Shared policy and contracts live in [README](../README.md); agent routing lives in [AGENTS](../AGENTS.md). Current explicit user decisions supersede historical proposals. Configuration facts come from manifests, not old plan prose.

## Sources of truth

Keep facts in their authoritative location and link to them elsewhere.

| Information | Authority |
| --- | --- |
| Dependency ranges and executable commands | [package.json](../package.json) |
| Exact dependency versions | [package-lock.json](../package-lock.json) |
| Build entries, global style/script order, output, budgets | [angular.json](../angular.json) |
| Netlify response-header overrides | [netlify.toml](../netlify.toml) |
| Service-worker resource caching and navigation rules | [ngsw-config.json](../ngsw-config.json); [CACHE-01 in README](../README.md#behavioral-contracts) states required behavior |
| TypeScript and Angular compiler policy | [tsconfig.json](../tsconfig.json) and its app/test/Cypress extensions |
| Whitespace and formatting | [.editorconfig](../.editorconfig), Prettier settings in the manifest |
| Routes | [app-routing.module.ts](../src/app/app-routing.module.ts), feature route declarations |
| Shared policy and behavioral contracts | [Project README](../README.md) |
| Plan status and bugs | This index and its linked owning plans/registers |
| Project files and content ownership | [CONTENT_MAP.md](../CONTENT_MAP.md) |
| Implementation plan structure and refactoring pre-test gate | [Plan template](PLAN_TEMPLATE.md) |
| Agent-only instructions and skill routing | [AGENTS.md](../AGENTS.md) |

Do not restate dependency versions in prose. Match Node to the installed Angular toolchain's supported engines. Chrome/Chromium is needed for Karma. Install locked dependencies with `npm ci`.

## Document status

| Document | Status / scope |
| --- | --- |
| [PLAN_TEMPLATE.md](PLAN_TEMPLATE.md) | Reusable implementation-plan skeleton and mandatory refactoring/migration pre-test gate. A template, not an active project plan. |
| [PERFORMANCE_CLOSEOUT_REPORT.md](PERFORMANCE_CLOSEOUT_REPORT.md) | Closed performance investigation and Lighthouse concern. Preserves measurement limits; no score target or further score-driven work. |
| [NETLIFY_ROLLOVER_CHECK.md](NETLIFY_ROLLOVER_CHECK.md) | Source-identified A/B journey record and historical procedure. Retained-tab navigation succeeded; deployed chunk-failure/reload mechanism remains unverified. Test branch/worktree were cleaned up. |
| [BUNDLE_OPTIMIZATION_PLAN.md](BUNDLE_OPTIMIZATION_PLAN.md) | **Completed optimization record; remaining content/data, deployment and tooling register.** User reported production deploy `1e8de2f`; CSS/browser-interaction ownership moved to the stylesheet plan. |
| [BUNDLE_OPTIMIZATION_HISTORY.md](BUNDLE_OPTIMIZATION_HISTORY.md) | Historical implementation/investigation evidence. Dated checkpoints do not override current statuses or authorize new work. Consult only the records relevant to the task. |
| [STYLESHEET_REFINEMENT_PLAN.md](STYLESHEET_REFINEMENT_PLAN.md) | **Completed local visual implementation; current UI maintenance register.** User reviewed and approved November 15; research-grid restoration is committed in `0b5208d` and design/social-link work in `6c60fba`. Selected navy `#2b4367`, portrait overlap, centered Experience/subordinate Recognition, dark Publications and light Contact are retained. No push/deployment. Visual review artifacts stay local under ignored `docs/design-reviews/`. |
| [PORTFOLIO_CV_CONTENT_REVIEW_PLAN.md](PORTFOLIO_CV_CONTENT_REVIEW_PLAN.md) | Editorial handoff/reference. Evidence/privacy rules remain relevant; its old inventory is not a current verified content snapshot or implementation authority. |
| [HOMEPAGE_REDESIGN_PLAN.md](HOMEPAGE_REDESIGN_PLAN.md) | Historical/superseded proposal. Do not restore its layout, six-paper selection, CV download or no-parallax proposals. |
| [NETLIFY_SSR_NOTES.md](NETLIFY_SSR_NOTES.md) | Deployment investigation notes; unverified server/account behavior remains unverified until observed. |

Choose the owning register above before editing: presentation/browser interaction belongs to the stylesheet plan; content/data, deployment and tooling remain in the completed optimization register. Historical proposals do not authorize a UI redesign. Future visual work follows README contracts and its actual task brief.

## Content ownership and migration

The [project and content map](../CONTENT_MAP.md) owns the source inventory, publication synchronization rules and lazy-boundary guidance. Keep those facts there rather than duplicating the map in plans.

## Development and verification

The manifest's `scripts` section is authoritative. Use `npm run` to list commands.

The build's `prebuild` hook runs the guidance integrity check. Behavioral contracts also require the applicable runtime tests; a link check alone does not enforce navigation or accessibility.

Before each implementation batch, state the acceptance scenarios already covered, any missing scenarios requiring new tests, and the checks planned for that batch. Describe test results by scope rather than claiming all regressions are prevented. Run focused checks while iterating and the broader relevant suite at integration; repeat successful checks when changes, failures or unresolved concerns justify it. Distinguish fresh results from prior results against unchanged code.

Use the [plan template](PLAN_TEMPLATE.md) for new implementation plans. Refactoring, migrations and behavior-preserving rewrites require its mandatory pre-test gate before changing the affected implementation: establish the baseline, fill coverage gaps and demonstrate regression sensitivity. Keep existing plans' scope/status authoritative; adopting the template does not restart completed work.

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
| `test:presentation` | Real Chrome no-JS navigation checks against production output; prerequisites and results belong in the presentation plan |
| `test:browser-helper` | Targeted isolated-Chrome startup recovery, cancellation and cleanup regressions; no app build required |
| `verify:deployment` | Read-only HTTP comparison with exact local browser output; requires URL/build path; see Netlify notes |
| `check:service-worker` | Check generated worker/cache rules and every manifest content hash; accepts a browser-output directory |
| `test:service-worker` | Build production A/B and run maintained Chrome cache/update/recovery/offline/feed-fallback tests; owns its browser/server; see Netlify notes |
| `cypress:run`, `cypress:open` | Browser journeys; start the app first; base URL is in [cypress.config.ts](../cypress.config.ts) |
| `serve:ssr:my-app` | Runs the existing server bundle; the local check exits without a listener, see Netlify notes |

Keep unit specs beside components/services and normal browser journeys in `cypress/e2e/`. Production worker/update tests live in [tests/service-worker](../tests/service-worker/service-worker.test.mjs), outside the Cypress proxy, and run through the manifest command above. Run them for changes to worker rules, lazy boundaries or chunk recovery. Test meaningful behavior and failure cases. Preserve regression coverage; never weaken a test to hide a regression. Update the contract and tests together for an authorized behavior change. There is no lint script or numeric coverage gate. Do not commit generated output, dependencies, coverage, or browser recordings.

For local versus deployed verification procedures, use [Netlify SSR notes](NETLIFY_SSR_NOTES.md#local-and-netlify-verification). Each owning plan records its selected commands, prerequisites, results and remaining checks; this index describes how to choose them, not a result for every edit.

### Deferred work markers

Use `TODO<Category>[ID]: reason; next action; plan reference` at the owning code boundary. Categories: `Migration`, `Bug`, `Design`, `Verification`, `Content`. Use stable active-plan IDs; multiple markers may reference one item. Record the rationale and exit condition in the plan. Avoid vague "fix later" notes.

Syntax example (replace placeholders with a real register entry): `TODO<Category>[ID]: reason; next action; see docs/OWNING_PLAN.md.` Do not add a marker for work already completed.

Search with `rg 'TODO<' src docs`. Resolve markers and plan entries together. Legacy editorial `TODO:<ADD TRUE DETAILS>` means missing facts; keep it only when a fact remains unresolved, not as a permanent test fixture.

## File guidance conventions

Authored TS/JS, Angular HTML and CSS have a short `@agent` header naming skills, policy and related controller/template/style files. Paths are repository-root-relative. Update relationships when files move. Headers route reading rather than redefine policy.

The manifest guidance check validates local links/header targets, component ownership pointers, simple skill frontmatter, strict mode and TODO register IDs. It runs before the production build. Runtime contract compliance still requires behavior tests and rendered review.

Native JSON, XML, lockfiles, generated files, vendor assets and binary/media files are covered by the [project map](../CONTENT_MAP.md#project-map) and build entries. Do not insert invalid comments or agent instructions into third-party/minified assets or generated output.

Skills are repository-local in `.agents/skills/<name>/SKILL.md`, following [official Codex discovery guidance](https://learn.chatgpt.com/docs/build-skills). They are not installed globally. AGENTS links allow direct reading even before a session refreshes its skill catalog.
