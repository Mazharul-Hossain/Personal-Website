# Portfolio optimization closeout plan

**Status: Complete for the optimization closeout, research popup/retirement batches and stylesheet reuse follow-up.** The user reported a successful production deployment of `1e8de2f` as `6af887a4392d9b942ebb9cb1`. A fresh deployed interaction sweep was not performed. Earlier not-yet-deployed statements below describe their original local checkpoints; this paragraph owns current deployment status. The user observed successful old-tab Publications navigation across the actual Netlify A → B deployment. No application-chunk failure or automatic reload was captured; that deployed recovery path remains unverified. Deferred items below are not included in this completion claim.

## Start here

The current CSS/browser-interaction plan and register is [STYLESHEET_REFINEMENT_PLAN.md](STYLESHEET_REFINEMENT_PLAN.md). This completed optimization record no longer owns those current issues. The user closed the Lighthouse score concern on November 14: no regression was established from the supplied pair; no score target or repeated benchmark task remains.

Stylesheet follow-up completed from clean baseline `7a9f414`: README owns the approved standard, the design skill routes edits to it, and Selected Research reuses the loaded theme's palette, button and focus rules. Caption typography is grouped locally; modal geometry and the compact close-button padding remain local with reasons beside those rules. The deleted WebP was not restored in this stylesheet-only scope. Current STYLE-01 status belongs to the [UI register](STYLESHEET_REFINEMENT_PLAN.md#issue-and-migration-register); the following paragraphs retain its historical verification evidence.

Stylesheet verification: existing affected browser baseline 24/24, final full browser integration 79/79, production build (nine prerendered routes), generated worker/hash check (81 content hashes), guidance and whitespace checks passed. No new permanent tests or unrelated unit/cache-suite reruns were added. A diagnostic compared settled keyboard focus, button colors and caption typography against shared references at 360/1280px; all match and document containment passes. Its initial immediate-focus sample caught an in-progress existing CSS transition, so the final comparison waits for that transition to settle. Mobile/desktop screenshots were inspected. Independent source review found no actionable issue. The existing initial-size warning remains (about 721kB against the unchanged 500kB warning budget). Evidence is under ignored `tmp/style-alignment-*`; the computed-style record is `tmp/style-alignment-inspection/after.json`. No push or deployment.

Review the locally completed research-image popups and retirement of `/work` and `/service` in the November 14 section below. No deployment was performed for these changes. The [manual source/rollover record](NETLIFY_ROLLOVER_CHECK.md) covers the preceding deployed builds and the limits of that evidence.

The [performance report](PERFORMANCE_CLOSEOUT_REPORT.md) records all 18 samples, analytics/application work, failed comparability checks and the decision to keep website behavior unchanged. A repeatable speed improvement was not established. Completed implementation records remain in [history](BUNDLE_OPTIMIZATION_HISTORY.md).

## Contract

Optimization inputs: frozen build `1e792dc`, application baseline `77305f3`, controlled diagnostics and Netlify deployment evidence. Delivered: a bounded measurement report/code-change decision, manual source/rollover instructions and an observed same-origin old-tab journey with recorded source identities. The user accepted its limits and authorized the research-popup/retirement batches below. Their contract preserves research content and current navigation while explicitly retiring the two legacy routes. Preserve the public domain.

## Existing code trace

`AppComponent` → `GtagService` inserts the asynchronous Google script; generated application/lazy chunks supply first-party work. The router sends recognized chunk errors to guarded recovery. Netlify excludes existing files/SSG from the handler; `src/server.ts` serves the feed/handler boundary. After retirement, fresh builds prerender nine concrete routes and retain the wildcard redirect; no current known page requires per-request Angular rendering. Do not invent an SSR route to satisfy a test.

## Mandatory pre-test gate

The original bounded performance investigation was observational; its prior 82 website/87 unit baseline was not rerun for reports alone. The subsequent application changes followed the separate mandatory pre-test gate recorded in the November 14 section below and the [template](PLAN_TEMPLATE.md#mandatory-pre-test-gate-for-refactoring-and-migrations).

## Implementation plan

| Deliverable / owner | Result |
| --- | --- |
| Test-helper reliability — `tests/service-worker/chrome.mjs` and adjacent tests | VERIFY-09 fixed; 4 targeted cases and 10-case fresh A/B suite passed. |
| Measurement evidence — `PERFORMANCE_CLOSEOUT_REPORT.md`, ignored raw artifacts | 18 reports saved; CPU/cache differences prevent a causal speed claim. No runtime change recommended. |
| Manual platform handoff — `NETLIFY_ROLLOVER_CHECK.md` | Ready; branch naming/TOML and PowerShell snippets validated without executing remote actions. |
| Actual Netlify source/rollover observations | A/B source identities and successful retained-tab navigation recorded. Old chunk status/reload count remain unverified; no deployed forced-recovery claim. |

## Verification plan and results

The performance run wrote all 18 reports, then exited 1 on its final Chrome-cleanup deadline; the follow-up owned-profile process check found no remaining browser. This failure is retained in the report. Timing comparisons failed the declared comparability criteria. The user later created/pushed the test branch and performed the actual platform journey; see the runbook record. Fresh November 14 checks below cover the new application changes, separately from those historical results.

## Approved and pending decisions

Approved: complete the two closeout tracks; user requested manual rollout instructions instead of agent deployment access, completed the observed journey, then authorized branch cleanup, research popups and retired-page removal. Analytics remains unchanged because the data do not justify removal or delay. No production publication or Netlify settings change was performed by the agent. New website changes require a future user deployment to verify on Netlify.

## Implementation notes for agents

Use the [plan template](PLAN_TEMPLATE.md) and [README verification guidance](../README.md#development-and-verification). Preserve existing uncommitted work. Do not repeat benchmarks indefinitely, select favorable samples, print credentials, substitute a proxy for Netlify or silently turn this into a visual redesign. Keep long evidence in linked reports/history.

## Results and handoff

Prior preview [6af7ba092655a2dd68d746c7](https://6af7ba092655a2dd68d746c7--stoic-lamport-e2ed9d.netlify.app/) supplied sampled layout/feed/worker/header evidence. November 14's separate source-identified A/B deployments supplied a successful retained-tab Publications journey, with the mechanism unverified. Those deployed builds predate the research-popup/retirement changes. Their fresh local evidence follows; no new speed claim or production deployment is implied.

## Research popup and retirement implementation — November 14

### Contract and approved decisions

User approved accessible enlargement of every actual Selected Research image on Home and Research, followed by clean removal of the two orphaned legacy pages. Preserve existing image sources, dimensions, alternative text and attribution. Reuse CDK dismissal, focus trapping/return and owned teardown. Agent choice: load the popup controller on demand; keep native named opener buttons and visible enlargement guidance. Retired URLs use the existing wildcard `/404` behavior; no replacement content was requested. No redesign, dependency upgrade or production deployment is included.

### Existing code trace

Home and the Research wrapper render `SelectedResearchComponent` → typed figure arrays → sibling HTML/CSS. Four images currently have no opener. Legacy `WorksComponent` owns a TemplatePortal/CDK overlay, eight unit regressions and browser interaction checks. `AppRoutingModule` retains `/work` as a lazy module and `/service` as an eager component; metadata, tests and worker diagnostics still reference them. Map901's `w-1.png` is shared research content and must remain.

### Mandatory pre-test gate

Baseline: master `2ed1d0a`, with the prior TODO/runbook documentation changes only. Reuse existing Works popup and research content/attribution unit checks before moving behavior. Record the baseline result below. Add research opener/popup regressions and demonstrate their failure before implementation; migrate existing keyboard, focus, dismissal and SPA teardown journeys rather than claiming they already cover Research. Add retired-route browser assertions and observe them fail before removing routes. Keep image geometry, navigation and full production worker scenarios as the integration checks. Route removal is an intentional contract change; old gallery-specific expectations must be replaced, not silently skipped.

### Detailed implementation batches

1. BUG-13: add an on-demand popup controller under `src/app/shared/`, reusing the existing CDK interaction pattern. Research owns its template, styles, asynchronous opening guard and destruction cleanup. Add four-image/caption, focus, dismissal and lifecycle tests; retain Works until this batch is verified.
2. MIG-07: remove retired routes/components/module, metadata and exclusively used assets/styles. Update README and skill reading pointers. Replace Works-specific browser tests with Research popup tests and retired-URL checks. Move production A/B tests to warmed research popups and a cold bibliography; prove cooldown with a fresh document and the same persisted tab guard, without inventing another application route.
3. Review the combined changes, run focused compiler/unit/browser checks plus production A/B worker integration, and create focused commits. No push of application changes.

### Branch cleanup and evidence

The user requested branch/worktree cleanup. Clean rollover worktree removed; local branches `codex/rollover-verification` and `codex/homepage-redesign-review` deleted, and the remote rollover branch deleted. Both tips remain recoverable through local tags `archive/rollover-verification-2026-11-14` (`459a827`) and `archive/homepage-redesign-review` (`b88e696`). Master was preserved. No Netlify settings were changed.

### Verification and handoff

Gate passed: baseline 11/11 Works/research unit checks. Five new research-popup cases failed on absent opener controls, then all eight research unit cases passed. Both retired-route browser cases failed before route removal and passed afterward. Research browser checks passed 9/9 before retirement and again with open-modal document-width assertions, covering all four images on Home/Research at 360/390/1280px plus native Enter/Escape, backdrop/reopening and genuine SPA teardown. Mobile/desktop screenshots were inspected; diagrams and close controls fit the viewport, with tall desktop diagrams scrolling inside the modal.

Fresh final integration: 83/83 Angular unit cases; 79/79 Cypress cases (the retired gallery's cases were replaced by research popup and retired-route checks); all three TypeScript checks; 4/4 compiled-handler tests including both retired URLs; 4/4 feed tests; guidance and whitespace checks. Fresh A/B production builds prerendered nine routes and passed the 10-case worker/helper suite. Independent review found no defect and identified missing popup-download-failure coverage; the added real-404/original-image fallback checks pass in both worker states. A prebuilt-output rerun first passed 9/10 with an unchanged Chrome abort-helper cleanup timeout, then passed 10/10 without concurrent browser suites. VERIFY-10 retains this intermittent tooling limitation. Static entry-graph checks confirm CDK remains lazy. The existing 500kB warning remains (initial output about 720.35kB); budgets were not raised.

Evidence: ignored logs `tmp/research-popup-baseline.log`, `tmp/research-popup-red.log`, `tmp/retired-pages-red.log`, `tmp/research-units-final.log`, `tmp/research-browser-final.log`, `tmp/research-popup-width-check.log`, `tmp/research-cache-integration.log`, `tmp/research-cache-fallback.log`, `tmp/research-cache-final.log`; fresh builds at `tmp/service-worker-tests/run-uZjgDn`. Source changes are complete locally, with no application push/deploy. Independent final review, including the added failure tests, found no actionable issue.

Implementation commits: `16a1ed4` (research popups) and `bc30199` (retired pages and migrated checks), both on master. Documentation records the completed rollover, archived branch tips and current limits. No helper-owned Chrome processes remained after the failed-run follow-up inspection.

## Deferred work and constraints

Presentation/browser-interaction follow-ups and monitoring now belong to the stylesheet plan. MIG-03/06 and CONTENT-ARXIV/CONTENT-FIGURES remain here as data/content follow-ups; deployment/tooling limits retain their own entries. None automatically authorizes more work or reopens the closed Lighthouse investigation.

## Phase 1A — Navigation evidence

For guidance referring to the active plan's Phase 1A, read the [historical navigation investigation](BUNDLE_OPTIMIZATION_HISTORY.md#1a-navigation-and-scroll-behavior) and current README contracts. The register below owns current statuses.

## Bug and migration register

This register owns remaining content/data, deployment and tooling issues. All CSS/browser-interaction records now live in the [presentation and interaction register](STYLESHEET_REFINEMENT_PLAN.md#issue-and-migration-register), including completed UI fixes. Preserve historical evidence above, but update current UI status only in that owning register. New issues need evidence, status and an exit check; do not duplicate ownership.

| ID | Status / evidence | Required outcome / exit check |
| --- | --- | --- |
| MIG-01 | Resolved locally. Shared typed core, ordered selected IDs, lazy citation details and rendered category loops replace duplicated publication facts. All 14 citation/resource baselines, five selections, research attribution, local browser/prerender and eager/lazy checks passed. | Maintain the single authority and reference tests. Netlify deployment remains a separate unverified stage; CONTENT-ARXIV is not closed by consolidation. |
| CONTENT-ARXIV | Unverified association: research links to arXiv 2408.07114, but the bibliography does not explicitly establish its relationship to the published detector-comparison paper. | Retain the existing link as an external resource; associate a publication ID/version only after primary evidence or user confirmation. |
| MIG-03 | Source-confirmed exception: xml2js ambient declaration returns `any`; strict mode cannot validate upstream RSS structure. | Narrow external data and/or adopt suitable maintained types; retain feed response/error tests. |
| MIG-06 | Source-confirmed mixed content: recognition and skills remain HTML; identity/profile facts recur in metadata/templates. | Migrate reusable facts into TS records on related edits; retain narrative presentation and approved content/privacy. |
| BUG-01 | Resolved: unchanged baseline reproduced the obsolete About assertion as its only failure (24 passed, 1 failed). Current biography/skills and placeholder-absence checks now pass; corrected smoke/publication baseline is 25/25. | Retain meaningful current-content checks; do not restore obsolete placeholders to satisfy tests. |
| BUG-07 | Resolved locally in fix #11: Karma now serves src/assets rather than a nonexistent public directory. A real fetch of the hero URL returns 200, image/webp and nonempty bytes; the final unit log has no asset 404. | Retain the asset-serving regression; keep production and test asset ownership aligned. |
| VERIFY-01 | Observed platform journey complete with limits: source-identified A `671f4d6` and B `459a827` deployed on one stable origin; user retained a controlled A tab and opened Publications after B without visible failure. Agent confirmed stable B manifest and changed script URLs. No application-chunk 404 or reload count captured; full B sweep was not performed. | Preserve the [evidence record](NETLIFY_ROLLOVER_CHECK.md). Missing-chunk recovery mechanism remains unverified on Netlify, with local forced-failure evidence separate. The user subsequently reported production deploy `6af887a4392d9b942ebb9cb1` at `1e8de2f`; new deployed interaction checks are not claimed. |
| VERIFY-10 | Monitoring — an unchanged Chrome abort-helper case hit `Owned Chrome did not stop` during the popup-fallback rerun; both application worker scenarios passed. The preceding fresh-build run and subsequent isolated prebuilt run passed 10/10. Similar cleanup deadlines were recorded in the earlier measurement report; cause is unconfirmed. | Preserve failed-run evidence; investigate owned-process shutdown if it recurs. Do not weaken assertions, kill unrelated browsers or attribute the failure to application code without evidence. |
| VERIFY-07 | Resolved on deploy `6af7ba092655a2dd68d746c7`, November 13: `/manifest.webmanifest` returns HTTP 200, `application/manifest+json` and the expected bytes. | Preserve the exact-path Netlify header and wrong-MIME verifier regression; recheck after deployment/config changes. Cache TTLs were not changed by this fix. |
| VERIFY-08 | Resolved on deploy `6af7ba092655a2dd68d746c7`, November 13: missing `.js`, `.mjs?version=old` and uppercase `.JS` requests return direct HTTP 404, plain text and no redirects. Existing JS, pages and live feed pass comparison checks. | Retain compiled-handler and HTTP-verifier regressions; missing scripts must stay out of Angular's document redirect. The older immutable preview retains its original response. |
| VERIFY-09 | Resolved locally: startup-file EBUSY/ENOENT retry within the original deadline. Four real-Chrome tests cover recovery/connectivity, file creation, permanent errors and cancellation with owned-profile cleanup; full fresh-build production suite 10/10 passes. | Retain the targeted helper cases and cache integration; no website runtime change or timeout increase. |
| VERIFY-06 | Resolved locally for versions containing the recovery handler. A recognized lazy-chunk navigation failure reloads the failed same-origin route with query/fragment intact; persisted five-minute tab cooldown and one attempt per document prevent loops. Changed-build tests pass with new worker ready and with build A's manifest deliberately retained. A second unavailable chunk does not reload again. Legacy already-open versions without this handler still require manual reload. | Preserve recovery/browser/storage/SSR/latest-action regressions and lazy boundaries. Actual authenticated Netlify deployment/headers remain VERIFY-01; verify the handler is in the deployed build before expecting future tabs to recover. No claim that new client code can change already-running older code. |
| CONTENT-FIGURES | Partially verified: GMoE and GE primary PDFs explicitly state CC BY 4.0. Pixel-identical, full-resolution WebP alternatives now serve those two figures; PNG sources/fallbacks, captions and attribution remain. UPIGAN/Map901 assets unchanged; their specific reuse evidence remains unresolved. | Preserve figure quality/attribution and verify particular source/credit lines and SPIE reuse conditions before changing the remaining images. See [performance evidence](BUNDLE_OPTIMIZATION_HISTORY.md#performance-implementation--november-9-2026). |
| VERIFY-02 | Resolved locally: fresh strict checks/build/feed tests passed; Karma passed outside sandbox after sandbox Chrome capture timeouts. | Keep deployment evidence separate; future capture failures need environment diagnosis rather than weakening tests. |
| VERIFY-03 | Resolved for this environment: matching Cypress binary was already cached outside sandbox visibility; install command skipped downloading, verification passed, and Chrome ran the existing 25 browser tests. | Run browser verification with access to the cached binary and required local-server/browser permissions. Prior sandbox-only version output did not establish physical absence. |
| VERIFY-05 | Closed by user decision November 14; no Lighthouse score target or further score-driven work. Bounded investigation executed: 18 Lighthouse reports measure analytics/application work, but CPU and cache-state comparability checks fail. No causal timing improvement/regression or safe further production change was established. Final diagnostic cleanup timed out after saving reports; no owned browser remained on inspection. | [Report and decision](PERFORMANCE_CLOSEOUT_REPORT.md) complete the investigation deliverable. The supplied November 13/14 reports scored 90/84 but did not establish a code regression. Stable/comparable timing remains unverified; preserve that limit without requiring more benchmark runs. Reopen only for a reproducible user-facing regression or materially new evidence and authorization. |
