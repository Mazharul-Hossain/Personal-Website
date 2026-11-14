# Manual Netlify source and rollover verification

Status: **Ready for manual execution; no platform rollover has been executed by the agent.** Supports VERIFY-01 in the [active plan](BUNDLE_OPTIMIZATION_PLAN.md). The user chose manual steps instead of providing deployment access. The goal is to keep an old tab working across two real deployments on one non-production origin, preserving `hmazharul.com`.

## Contract

Input: two builds of the same application content, a stable branch-deploy URL, recorded source commits/deploy IDs and one browser profile kept across A → B. Output: recorded source identities and observed old-tab lazy-navigation behavior. B must have different real chunk URLs; changing only a manifest timestamp is insufficient.

Success: known pages/feed/assets work, a previously unused lazy page opens from an old tab, and no repeated automatic page reload occurs. If old chunks are retained, record successful compatible loading. If an old chunk returns 404, record whether one reload recovers. Do not claim reload recovery was exercised when no missing chunk occurred. The existing local tests separately cover forced persistent failures and cooldown.

## Existing code trace

The navbar performs router navigation when its destination section is absent from the current page. On `/work`, choosing Publications therefore loads the lazy bibliography; on `/home`, the same item only scrolls to a section. Router chunk failures reach the recovery service, which may perform one guarded hard navigation. The resource worker keeps pages/feed network-based.

The current generated Angular manifest marks all 11 concrete routes as Prerender, plus a wildcard redirect to `/404`. No known page currently requires per-request Angular rendering. `/feed` remains a server handler. Do not add a new SSR route just to manufacture a verification case.

## Mandatory pre-test gate

Not applicable to an application refactor: this procedure changes only a temporary branch's build naming. Existing production cache tests already exercise independently built A/B chunks, cold lazy navigation and persistent-error protection. Their latest local run was 10/10; it does not prove this Netlify rollout. This document's steps are not executed test results.

## Detailed implementation plan

### 1. Prepare one non-production branch

Use the existing Git-connected Netlify project. Go to **Project configuration → Developer settings → Continuous deployment → Branches and deploy contexts → Configure**. Choose **Let me add individual branches**, enter **`codex/rollover-verification` only**, and save. Netlify allows entering a branch name before creating it. Keep the production branch, published deploy and public-domain settings unchanged. See [branch deploys](https://docs.netlify.com/deploy/deploy-types/branch-deploys/) and [context-specific configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

If the project cannot build a separate branch, pause and record the missing prerequisite rather than changing production publication settings. These commands assume the repository root and create a new worktree/branch. If either name already exists, stop rather than overwriting it.

```powershell
git worktree add -b codex/rollover-verification tmp/netlify-rollover 77305f3
if ($LASTEXITCODE -ne 0) { throw 'Worktree creation failed; do not continue' }
git push -u origin codex/rollover-verification
if ($LASTEXITCODE -ne 0) { throw 'Branch push failed; do not continue' }
```

This preserves the existing working directory and its uncommitted work. `77305f3` is the known application baseline containing the image and response fixes.

### 2. Verify build A's identity

Wait for the branch deploy to succeed. In Netlify's deploy details, record:

- Context: branch deploy; branch: `codex/rollover-verification`.
- Source commit: the full SHA corresponding to `77305f3`.
- Netlify deploy ID, successful build log and **stable branch URL**.

Copy the branch URL from Netlify; do not guess how its branch name is encoded. It must not be `hmazharul.com`, the production site URL or a deploy-ID permalink. Netlify distinguishes [stable branch URLs from immutable permalinks](https://docs.netlify.com/deploy/deploy-overview/).

Check the source commit against GitHub/Git as well as the Netlify build details. A matching page or a manually typed commit label alone is not independent source confirmation.

### 3. Prepare and retain the A tab

In Chrome, restore normal networking from earlier image tests: Network throttling off, Disable cache unchecked, and Application → Service Workers → Bypass for network unchecked. Open DevTools, enable Preserve log in Network, then open **the stable branch URL followed by `/work`**.

Confirm both project previews render and a popup opens/closes. In Application → Service Workers, confirm an active worker and control of this page; reload once now if needed. This is the last manual reload of the A tab before the rollover.

Keep this tab on `/work`. Do not visit Publications yet, clear storage, change origin, close the browser or enable worker bypass. Record the main/Works script URLs from Network and the current URL. Keep the tab open while B builds.

### 4. Create build B with different chunk names

Append this branch-specific override in the **temporary worktree only**, then commit/push that branch:

```powershell
$rolloverBranch = git -C tmp/netlify-rollover branch --show-current
if ($LASTEXITCODE -ne 0 -or $rolloverBranch -ne 'codex/rollover-verification') {
    throw 'The temporary worktree is not on the expected test branch'
}
if (Select-String -LiteralPath tmp/netlify-rollover/netlify.toml -SimpleMatch '[context."codex/rollover-verification"]' -Quiet) {
    throw 'The test override already exists; do not append it again'
}
$rolloverBuildConfig = @'

[context."codex/rollover-verification"]
  command = "npm run build -- --named-chunks"
'@
Add-Content -LiteralPath tmp/netlify-rollover/netlify.toml -Value $rolloverBuildConfig -ErrorAction Stop
git -C tmp/netlify-rollover add netlify.toml
if ($LASTEXITCODE -ne 0) { throw 'Staging the test configuration failed' }
git -C tmp/netlify-rollover commit -m "Change chunk names for rollover verification"
if ($LASTEXITCODE -ne 0) { throw 'The test commit failed; do not push' }
git -C tmp/netlify-rollover rev-parse HEAD
git -C tmp/netlify-rollover push
if ($LASTEXITCODE -ne 0) { throw 'Build B push failed; do not continue' }
```

Do not merge this test-only configuration into `master`. Wait for the new branch deploy to succeed. Record B's full commit SHA and deploy ID in Netlify; confirm they match the pushed test commit and the build log uses named chunks. The **stable branch URL must remain identical** to A's, while its main/chunk references change. A new immutable deploy permalink is expected but is not the browsing origin for this test.

### 5. Exercise the retained A tab

Open the stable branch URL in a second tab to confirm B is available and its script URLs differ. Keep the original A tab untouched until now.

In the original `/work` tab, choose **Publications from the navbar**. This must be router navigation from Works, not a homepage section scroll or a typed address-bar navigation. Check that the complete bibliography appears with 14 records.

Inspect the preserved Network log:

- If compatible old chunks still return 200, record that retention allowed the old tab to work. This passes that rollover path, not the missing-chunk recovery path.
- If an old chunk returns 404, check for one subsequent document navigation and a working B bibliography. Repeated reloads, a blank page or remaining on a failed route are failures to report.
- If URLs never changed, the A tab was manually reloaded, storage was cleared, or different origins were used, mark the run invalid rather than passed.

In the B tab, open `/work`, test the popup, then check `/research`, `/publications` and `/feed`. Check `/manifest.webmanifest` has a manifest MIME type and `/__rollover_missing__.js` returns HTTP 404 with no HTML redirect. DevTools Network shows statuses and response headers.

Keep the test branch/worktree and evidence until review. Cleanup is a separate action; production publication is not part of this procedure.

## Approved and pending decisions

Approved: the user requested manual rollout steps instead of agent account access. Selected procedure: Git-backed branch deployment so Netlify can display source commits and both builds use a stable non-production origin. Pending: enabling/running that branch test and reporting the observations. No remote command above has been executed by the agent.

## Implementation notes for agents

No tokens, cookies or authenticated HAR are needed in the handoff. Do not substitute two permalinks, a local proxy or a manifest-only edit for this test. Preserve unexpected results and compare the exact deployed commits. A successful build alone is not a passing rollover result.

## Results and handoff

Fill this in after execution:

| Evidence | Build A | Build B / observed result |
| --- | --- | --- |
| Stable origin | Pending | Must be identical |
| Git source commit confirmed in Netlify | Pending | Pending |
| Netlify deploy ID | Pending | Pending |
| Main/chunk URLs changed | Record A | Record B |
| Original A tab/profile/storage retained | Record preparation | Confirm no reset |
| Old-tab Publications navigation | Not opened during preparation | 14 records / failure |
| Old chunk HTTP status | Record old URL | 200 retained / 404 / other |
| Automatic document reload count | Baseline | Zero retained-path / one recovery / repeated |
| B routes/feed/popup/manifest/missing JS | Baseline checks | Pass / fail / unverified |

Final platform status stays pending until these observations are supplied. A retained-old-chunk success does not prove the forced missing-chunk branch; the local regression suite remains its existing evidence.
