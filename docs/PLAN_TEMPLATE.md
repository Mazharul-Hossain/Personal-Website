# [Concrete outcome]

Status: Draft | Approved | Implementing | Verifying | Complete | Blocked

[Briefly explain the problem, who it affects, and the intended result.]

Template instructions: copy this structure for new plans, replace the prompts, and remove these instructions. Scale detail to the task; keep lengthy evidence in linked artifacts/history. Register the plan in [the documentation index](README.md) with an explicit scope/status. Preserve one authoritative active plan for a scope. Shared policies and behavioral contracts remain in [project README](../README.md).

## Contract

### Inputs and triggers

[What starts the behavior; relevant data, environment and initial state.]

### Required outputs

[Observable behavior, failure responses and concrete deliverables. Trace each important input to its required output.]

### Constraints

[Existing contracts, compatibility, performance/lazy boundaries and content to preserve. Link their authorities.]

### Completion criteria

[Specific observable conditions that must be demonstrated before declaring this plan complete.]

### Out of scope

[Related work deliberately excluded; link deferred items rather than silently expanding the batch.]

## Existing code trace

[Trace input → entry point → controller/service → data → template/styles → output. Include relevant teardown, SSR and integration paths.]

| Stage | Owning file / symbol | Current behavior / evidence | Existing coverage |
| --- | --- | --- | --- |
| [Stage] | [Repository path and symbol] | [Observed behavior; distinguish assumptions] | [Test or recorded gap] |

## Mandatory pre-test gate for refactoring and migrations

Complete this section **before changing the implementation being refactored or migrated**, including behavior-preserving rewrites. For other task types, explicitly mark applicability and explain why. Regression evidence covers the specified scenarios; it is not a guarantee against every possible regression.

### Baseline and coverage map

Record the starting commit and relevant uncommitted changes, build/environment, fixtures and reproduction steps. Run the existing checks relevant to the affected behavior on that starting implementation. Record failures as well as passes and separate pre-existing failures from proposed behavior changes.

| Behavior / contract | Existing test to reuse | Missing scenario / new test needed | Required pre-change result | Required post-change result |
| --- | --- | --- | --- | --- |
| [Observable behavior] | [Test or none] | [Gap and reason, or none] | [Expected behavior] | [Preserved or explicitly authorized change] |

### Characterization and regression sensitivity

- Add only the missing characterization coverage; it should pass against the unchanged implementation when preserving existing behavior.
- Demonstrate that new regression coverage detects a controlled violation of its observable contract: pass on the baseline, fail with the relevant behavior broken, then pass after restoration. Prefer an isolated fixture or safe local mutation; restore the implementation before continuing. Reuse applicable sensitivity evidence already recorded for existing tests.
- For a bug fix, the reproduction should fail on the original bug and pass after the fix. Keep this distinct from characterization tests that preserve working behavior.
- Record the invocation, actual result and evidence for each step. A failing build, browser launch or unrelated assertion does not prove the intended regression is detected.

### Gate result

- [ ] Relevant baseline checks executed; starting state and results recorded.
- [ ] Required behavior mapped to existing coverage or justified new cases.
- [ ] Missing characterization tests pass before implementation changes.
- [ ] New regression coverage demonstrated sensitive to the intended failure.
- [ ] Relevant baseline failures and intentional behavior changes accounted for.

Gate status: Pending | Passed | Blocked | Not applicable with reason

[Link evidence and unresolved conditions. An unavailable or unexecuted baseline cannot be marked passed. Resolve a blocked required gate before proceeding with the affected refactor; preserve unrelated work.]

## Implementation plan

### Batch [number] — [Outcome]

| File / symbol | Responsibility / proposed change | Existing pattern to reuse |
| --- | --- | --- |
| [Path and symbol] | [Why this file owns the change] | [Pattern or source of truth] |

1. [Ordered implementation step and dependencies.]
2. [Next step, preserving the contract and passing the applicable pre-test gate.]
3. [Acceptance checks and intended commit boundary.]

[Repeat only for additional bounded batches. Identify expected production, dependency, configuration and deployment impacts.]

## Verification plan

Use the [development and verification guide](README.md#development-and-verification) to select commands and prerequisites; record this plan’s exact checks and results below. Use [Netlify verification procedures](NETLIFY_SSR_NOTES.md#local-and-netlify-verification) when platform behavior is affected.

Reference the pre-test coverage map instead of repeating it. State focused iteration checks and the broader integration checkpoint. Add tests only for identified gaps or newly discovered failures; explain scope changes.

| Check | Script / invocation | What it proves | Environment / evidence | Status |
| --- | --- | --- | --- | --- |
| [Check] | [Manifest script or exact invocation] | [Bounded acceptance scenario] | [Local, browser, deployed, manual] | [Pending / pass / fail / blocked] |

[Distinguish local execution from deployed evidence and fresh results from earlier results against unchanged code. Define manual review only where it adds useful evidence.]

## Approved and pending decisions

| Decision | Status | Rationale / evidence | Owner / blocking effect |
| --- | --- | --- | --- |
| [Decision] | [User-approved / agent-selected within scope / pending] | [Evidence or existing authorization] | [Who resolves it; what waits] |

[Keep recommendations distinct from approvals. Record existing authorization rather than requesting it again.]

## Implementation notes for agents

[Task-specific reading order, ownership pointers, fragile behavior, exceptions and conditions requiring clarification. Link shared policy/skills instead of duplicating them. Identify the authoritative tracking location for deferred work.]

### Deferred work tracking

Use the [deferred-work marker convention](README.md#deferred-work-markers). Record each deferred item’s stable ID, owning file, rationale, next action, exit condition and status in this plan or its linked owning register. Add a categorized marker at the owning code boundary when useful. Close markers and register entries together; deferral does not mean completion.

## Results and handoff

- Implemented deliverables: [Contract outcomes actually achieved.]
- Verification: [Checks actually run, results and evidence; distinguish fresh/prior results.]
- Remaining work: [Failures, blockers, unverified conditions and deferred scope.]
- Integration: [Commits and independently verified or declared deployment identity, when applicable.]

Final status: [Complete only when the contract is satisfied. Unfinished required deliverables keep the plan open or blocked; a deferred item does not become completed.]
