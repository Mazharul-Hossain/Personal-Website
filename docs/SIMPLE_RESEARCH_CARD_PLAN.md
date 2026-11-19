# Add SIMPLE research software to Selected Research

Status: Complete — user reviewed the design and approved the final Method wording; final code/style review and local verification passed November 18, 2026. Focused commits authorized. No push or deployment performed.

Reviewed application and regression-test commit: `cfbc9c6` — Add SIMPLE cryo-EM research card. This plan, the documentation index and content map form the separate documentation closeout.

Show publicly attributable cryo-EM software contributions without implying a paper or experimental result. Preserve all existing studies.

## Contract

- Input: the shared Selected Research records, used by both `/home` and `/research`.
- Output: hyperspectral research remains full width; SIMPLE and microscopy share the next desktop row; Map901 spans the final row with image left and copy right. Below 768px everything stacks in reading order.
- SIMPLE uses an original, labelled conceptual SVG workflow, not a purported reconstruction. Its figure uses the existing accessible on-demand popup.
- Preserve existing citations, figures, shared theme, lazy bibliography/popup boundaries and [README contracts](../README.md#behavioral-contracts). No scientific improvement metrics or publication claims.
- Complete after focused content/popup/layout regressions, compilation, production build, no-JS checks and private desktop/mobile captures. User may request visual revisions afterward.
- Out of scope: navigation, other sections, dependencies, SSR/cache changes and publication inventory changes.

## Existing code trace

| Owner | Current responsibility / coverage |
| --- | --- |
| `src/app/home/selected-research/selected-research.component.ts` | Structured study/figure records and popup lifecycle; adjacent unit specs preserve resources and exercise every image |
| Sibling HTML and CSS | Shared study renderer, two-column grid with first study spanning both columns |
| `cypress/e2e/research-grid.cy.ts`, `research-popup.cy.ts` | Both routes, responsive study boundaries and accessible popup journeys |
| `tests/service-worker/presentation.test.mjs` | No-JS content and ordinary navigation on production output |

## Mandatory pre-test gate

Starting point: clean `8bf3c87`. This is an approved additive content/layout change, not a behavior-preserving refactor. Run existing focused unit and browser tests first. Then update intentional counts/order/layout expectations and demonstrate failure on the unchanged implementation before adding the record and styling. Frozen publication fixtures remain unchanged; existing research resources must still match them after excluding the new software study.

- [x] Existing baseline: 8 focused unit tests and 15 Chrome grid/popup tests passed.
- [x] New expectations: 2 content tests failed (7 passed) and all 6 grid cases failed on the absent fourth study. The horizontal-layout assertions were then exercised successfully after implementation.
- [x] After implementation: 9 unit tests and all 15 Chrome grid/popup cases passed, including every figure's loaded preview, attribution and focus return.

## Implementation plan

1. Add content/order assertions and update grid tests for four cards/five images. Reuse popup tests for the new figure; update no-JS count.
2. Add SIMPLE record and original `src/assets/images/work/simple-pose-refinement.svg`. Evidence links target verified public contributions, not a fabricated publication.
3. Add a typed optional horizontal layout to study records, bind its class in the existing template and implement feature-local grid rules using shared theme tokens. Map901 selects it.
4. Run focused regressions, compiler checks, build, maintained no-JS check and review desktop/mobile captures. Keep artifacts ignored under `docs/design-reviews/simple-research/`.

## Verification plan and results

All evidence below is local; no deployed result is claimed. This table records the initial implementation checkpoint; the final precommit checkpoint below supersedes its output sizes and review status. Logs live under ignored `tmp/simple-research-*`.

| Check | Invocation / result |
| --- | --- |
| Focused unit baseline, red, green | `npm test -- --watch=false --progress=false --include=src/app/home/selected-research/selected-research.component.spec.ts`: baseline 8 pass; new cases 2 fail/7 pass; implemented 9 pass |
| Grid and popup browser journeys | `npm run cypress:run -- --browser chrome --spec cypress/e2e/research-grid.cy.ts,cypress/e2e/research-popup.cy.ts --config video=false,screenshotOnRunFailure=false`: baseline 15 pass; updated grid alone 6 fail; implemented 15 pass. Grid covers 360/768/1280px on both routes; popup coverage includes 390px, every image, keyboard dismissal/focus and SPA teardown |
| Compiler checks | `typecheck`, `typecheck:tests`, `typecheck:cypress`: exit 0 |
| Guidance and whitespace | `check:guidance`, `git diff --check`: pass |
| Production build | `npm run build`: pass; 9 prerendered routes; final initial raw output 734.16 kB. Existing 500 kB warning remains (previous recorded output 732.23 kB); no budget change. Popup and bibliography remain separate lazy chunks |
| Final production no-JS | `npm run test:presentation`: 2/2 pass at 360/1280px, including five research figures and ordinary navigation |
| Final worker asset integrity | `npm run check:service-worker`: pass, 72 on-demand assets/83 content hashes; page/feed network policy unchanged |
| Visual review | Before/after captures at 360/768/1280px and SIMPLE popup at 360/1280px; no captured page overflow. Original schematic uses the existing popup and explicit conceptual caption. Final mobile polish removed a duplicated diagram disclaimer under the enlarge hint and shortened the implementation link; final build, no-JS, integrity and captures reran afterward |
| Independent final source review | No actionable findings; existing study resources preserved and no experimental/publication claim inferred |

Initial sandbox runs were not accepted as evidence: Cypress had a separate empty cache, and sandbox Chrome/localhost access prevented connection. Only the replacement runs using the installed browser and reachable dev server count above. Owned failed sandbox processes were stopped; no dependencies were installed or changed.

Private visual artifacts and comparison gallery: `docs/design-reviews/simple-research/index.html`. This directory remains ignored by Git. The final checkpoint below records subsequent user approval and verification; deployment remains separate.

## Approved and pending decisions

| Decision | Status |
| --- | --- |
| Insert SIMPLE before microscopy; retain Map901 on a full-width horizontal desktop row | User-approved |
| Conceptual figure because no meaningful results are available | User-approved |
| SVG workflow with explicit illustrative caption, shared navy/purple palette | Agent-selected within approved scope |
| Replace the abstract reference icon with a real molecular volume | User-requested visual revision; human 80S ribosome density image EMD-2938 selected, attributed as an illustrative example |
| Final Method voice and scientific scope | User-approved; solution-focused description of in-plane polishing, five-parameter Cartesian LM refinement, local workflow and shift/rotation priors |
| Final review and focused commits | User-authorized after review and passing verification; no push/deployment authorized |

## Implementation notes for agents

Use repository content, design, Angular and verification skills. Keep data authoritative in TypeScript and feature-specific layout local. Do not treat public source code or included test assertions as independent scientific validation. New baseline expectations describe this authorized addition, not a rollback of earlier grid preservation.

Sources inspected: [local refinement](https://github.com/hael/SIMPLE/commit/0c4801f6193c605e73c9c3bd82b4d78b91ad7b65), [optional priors](https://github.com/hael/SIMPLE/commit/f68dab7b0db3b62f2533cfb3f561292418b0c288), [numerical optimization](https://github.com/hael/SIMPLE/commit/d205b3189edd0505bc62675e4f39213328015572). Authorship was checked against `Mazharul-Hossain`; representative patches were inspected. No release-adoption or accuracy/resolution claims were verified.

### Figure revision — real reference volume

The user requested a real molecular volume in the reference panel. Embedded a resized and WebP-encoded image of the human 80S ribosome density surface from [EMDB EMD-2938](https://www.ebi.ac.uk/emdb/EMD-2938), Khatter et al. (2015), without changing its scientific content. [Image source](https://www.ebi.ac.uk/pdbe/emdb-entry/emdbva/va-2938/va/emd_2938.map_xsurface.jpeg); [EMBL-EBI archive reuse policy](https://www.ebi.ac.uk/pdbe/about/public-data-access-statement) makes primary and derived archive data available under CC0. Attribution is visible in the caption and retained in the self-contained SVG; no runtime external-image request is needed. The reference is illustrative, not a result or benchmark claim for these contributions.

Revision checks: focused unit/popup suite 9/9 pass; production build passes with 9 prerendered routes, initial raw output 734.30 kB and the same existing budget warning; worker asset-integrity check passes. Refreshed section captures at 360/768/1280px and popup captures at 360/1280px were visually inspected. Final SVG is 26,703 bytes, including the embedded volume. No layout/controller behavior changed, so the earlier 15 browser journeys and no-JS checks were not rerun for this figure/caption-only revision. Logs: ignored `tmp/simple-ribosome-*`; the prior abstract-volume popup screenshots remain local under `docs/design-reviews/simple-research/schematic-only/`. No commit/deployment.

### Final precommit review — November 18, 2026

The user approved solution-focused Method wording describing in-plane polishing, five-parameter Cartesian Levenberg–Marquardt refinement, the local 3D workflow and Gaussian shift/Matrix–Fisher rotation priors. [In-plane implementation](https://github.com/hael/SIMPLE/commit/6e8b0d521082e7d0c4b82af6359c09d59df96b74) and [Cartesian integration](https://github.com/hael/SIMPLE/commit/65624b924f5e24efe87e560169f1150407c93bd7) were inspected alongside the prior-model source above before drafting.

Fresh checks against this exact final source:

- Focused unit suite: 9/9 pass. All three typechecks pass.
- Production build: pass, 9 prerendered routes, initial raw output 734.61 kB; existing 500 kB warning retained. Both popup and bibliography remain lazy.
- Maintained Chrome grid/popup suites against that production output through the repository HTTP fixture: 15/15 pass. The fixture mocks the feed; this does not verify Medium or Netlify behavior.
- Maintained production no-JS suite: 2/2 pass. Worker asset integrity: pass, 72 on-demand assets and 83 valid content hashes.
- Refreshed captures inspected at 360/768/1280px, including the full approved Method text and the real-volume figure; popup captures at 360/1280px. SVG parses and embeds its image without external resource requests.
- Independent source/style/accessibility review: no actionable runtime findings. Corrected its documentation finding: stale pending-review/no-commit status. Guidance and whitespace checks pass.

Initial final-review commands could not start because Angular/TypeScript/Zone packages were absent. After the user confirmed no concurrent install/cleanup and authorized repair, `npm ci` restored locked dependencies successfully (0 reported vulnerabilities). No manifest/lockfile change. Only the task-owned dev server was stopped to release its files. All fresh results above followed that repair. Logs: ignored `tmp/simple-final-*`. Broader unchanged test suites were not rerun.
