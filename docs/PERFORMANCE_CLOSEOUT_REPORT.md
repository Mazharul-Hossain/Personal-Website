# Performance closeout investigation

November 13, 2026. Investigation executed; **no additional production JavaScript change is justified by these measurements**. Analytics and application work were measured, but a trustworthy causal timing comparison was not established. This report is evidence for VERIFY-05 in the [active plan](BUNDLE_OPTIMIZATION_PLAN.md), not a new implementation plan.

## Method and inputs

- Frozen pre-optimization browser output: commit `1e792dc8f211004606c4ae902fb25b2ad1d6d3ee`, retained under the session's `performance-pass/before/browser` artifacts.
- Current browser output: application tree at `77305f3`; documentation/test-helper edits pending at measurement time did not change its client application. HTML hashes are in the run manifest. No website source, analytics configuration or image file was modified for this investigation.
- Cached Lighthouse **13.6.0**, isolated Chrome **157**, simulated mobile 412×823/DPR 1.75, default simulated mobile throttling. This differs from the user's Lighthouse 9.6.8 report; scores are not directly comparable.
- One loopback static fixture served both outputs with the same MIME and `no-store` behavior, uncompressed local assets and an empty fixture feed. External fonts stayed enabled. These are local lab observations, not Netlify transfer or real Medium measurements.
- Three balanced-order rounds: before/current/analytics-blocked; current/analytics-blocked/before; analytics-blocked/before/current. Each variant used a fresh owned Chrome profile, a cold audit, then an immediate storage-preserved warm audit: **18 reports total**.
- Analytics blocking applied only to diagnostic browser requests for Google Tag Manager/Analytics. It is not a proposed production deletion. Warm means retained browser storage/cache; it does not mean identical cache hits or worker state across variants.

## Observations

Medians of three samples per row. LCP/TBT are Lighthouse's simulated metrics. App JS and analytics JS are observed scripting plus parse/compile CPU attributed to their URLs; they exclude other URL-attributed layout/rendering work and are not exhaustive attribution of every task. Do not add these CPU values to simulated TBT.

| Variant | Cache | Score | LCP, ms | TBT, ms | App JS, ms | Analytics JS, ms | CPU benchmark range |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Before | Cold | 72 | 1,618 | 1,166 | 1,213 | 607 | 794–1,108 |
| Before | Warm | 79 | 1,453 | 750 | 968 | 600 | 1,066–1,450 |
| Current | Cold | 80 | 1,900 | 710 | 1,042 | 617 | 934–1,063 |
| Current | Warm | 74 | 997 | 1,518 | 1,029 | 659 | 755–971 |
| Current, analytics blocked | Cold | 81 | 1,852 | 645 | 924 | 0 | 867–1,283 |
| Current, analytics blocked | Warm | 80 | 1,262 | 804 | 886 | 0 | 833–1,186 |

These scores/timings are **descriptive, not evidence of an improvement or regression**. The diagnostic comparability checks required within-group benchmark max/min ≤1.25 and variant benchmark medians within a factor of 1.15. Both cold and warm comparisons failed; some within-group benchmark ranges exceed 40%. These are investigation criteria, not universal Lighthouse thresholds. All samples are retained rather than selecting favorable runs.

Current cold analytics responses had median **198,427 transferred bytes** and **601,343 decoded resource bytes**. The same cached script still consumed CPU in warm samples even when transfer was zero. Application-attributed scripting/compilation also remained substantial; blocking analytics does not remove application work.

Warm state was another confound: current normal had median zero recorded transfer, while current analytics-blocked had about **1.24 MB**. Identical storage-preservation flags did not produce equivalent cache/worker state. Therefore the blocked-versus-normal TBT difference cannot be assigned entirely to analytics. Script-attributed CPU confirms that analytics does work; it does not quantify the benefit of a production removal or delay.

Unused-JavaScript coverage in one page state is not a safe-deletion inventory. Interactions, lazy routes and tracking requirements are not fully exercised by a Lighthouse load.

## Decision

Keep the existing analytics, Angular/lazy boundaries and caching behavior. The already measured payload reductions remain valid; this run adds no causal overall speed claim. No new runtime code or tests were needed for this observational batch.

Delaying/removing analytics would require an explicit tracking decision, followed by representative measurement of both performance and tracking behavior. A future causal timing claim needs a quieter or dedicated machine plus verified comparable cache/worker states. That is a measurement limitation, not a newly established website defect or justification for more refactoring in this closeout.

## Execution limits and evidence

All 18 Lighthouse reports and trace/devtools artifacts were written. The command then exited **1** because the last Chrome shutdown exceeded the helper's cleanup deadline. A follow-up process inspection filtered to the run's unique profile and found no remaining Chrome process. This is recorded in `analysis.json` and the run summary; the harness is not represented as a fully successful run. No other browser was stopped.

Raw evidence: `tmp/performance-closeout-fEABSI/manifest.json`, individual report/trace files, `analysis.json` and `summary.json`; command log `tmp/final-phase-review/performance-closeout.log`. `analysis.json` corrects the distinction between total URL-attributed CPU and scripting/compilation. Existing payload/byte evidence remains in [implementation history](BUNDLE_OPTIMIZATION_HISTORY.md#performance-implementation--november-9-2026).
