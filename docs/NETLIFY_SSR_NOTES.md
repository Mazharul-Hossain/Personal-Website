# Netlify SSR and Express notes

- In commit `020c237` ("upgrade to SSR"), `src/server.ts` used Express to serve static files, render Angular with `CommonEngine`, and provide `/feed`. Express was needed by that implementation.
- Commit `46cedde` replaced that server with a Netlify `CommonEngine` handler. The current `src/server.ts` uses `AngularAppEngine` and `netlifyAppEngineHandler`; it handles `/feed` through `src/writing-feed.ts` and does not import Express.
- The installed `@netlify/angular-runtime` generates an Angular SSR Edge Function that imports `netlifyAppEngineHandler` from the built server. This generated function is separate from user-authored functions. Netlify's [Angular documentation](https://docs.netlify.com/build/frameworks/framework-setup-guides/angular/) describes automatic SSR configuration.
- Netlify's [functions documentation](https://docs.netlify.com/build/functions/configuration/) identifies `netlify/functions` under the site base directory as the default directory for user-authored functions. The directory can also be configured in the Netlify UI.
- This checkout has no `netlify/functions` directory. Its `netlify.toml` now supplies an explicit web-manifest MIME header; it does not define functions. No files under `netlify/functions` appear in the locally available Git history. This does not establish what is configured or deployed in Netlify, in another repository, or in an earlier deploy whose source is unavailable locally.
- Before deploying dependency removals, inspect the Netlify project's current deploy and Functions/Edge Functions lists, build base directory, and functions directory. If any separately maintained function imports Express, verify how it obtains dependencies before removing Express from its package.
- The manifest's standalone server command was executed locally on November 8, 2026: it exits successfully without starting a listener. The exported handler's localhost route probe encounters the allowed-host guard; that is not a deployed rendering failure. See the [historical Phase 1 investigation evidence](BUNDLE_OPTIMIZATION_HISTORY.md#remaining-phase-1-investigation-batch--november-8-2026) for the separate feed, prerender and caching results. A standalone listening adapter remains separate work if Node hosting is needed.

## Local checks and deployed evidence

Browser service-worker caching and Netlify edge/CDN caching are separate systems. The following is the verification method. Worker generation/control is now verified locally as recorded below; Netlify deployment checks remain pending.

| Check | Local method | Evidence still requiring Netlify |
| --- | --- | --- |
| Worker generation | Build the production configuration and inspect actual worker/manifest output; verify their HTTP status and content types. The existing registration call and ngsw-config.json do not themselves generate files. | Actual deployed worker paths, scope and headers. |
| Browser caching | Serve production output on localhost, use a clean browser profile, verify activation/control after reload, then inspect Cache Storage and offline behavior. Verify the configured cache rules rather than assuming /feed is cached. | Deployment-specific URLs, headers and navigation fallback behavior. |
| Version updates | Install build A, retain browser state, serve build B on the same origin, then verify update detection, reload and compatible assets/lazy routes. Clearing storage between versions would bypass the update test. | Atomic deploy behavior and actual cached versions/assets through the CDN. |
| Rendered routes | Inspect direct/refresh HTTP responses before JavaScript executes. Static prerendered HTML proves prerendering; test a real executing server handler/render path before claiming per-request SSR. | Generated Netlify handler invocation, deploy identity and platform routing. |
| Feed | Exercise the real local handler and mocked success/failure/timeout tests; do not use the static preview's mocked empty feed as server evidence. | Live upstream behavior, headers and platform runtime. |
| Netlify integration | Netlify Dev can simulate the local framework/function/edge routing, redirects and headers with appropriate configuration. The current CLI command alone is not a listening adapter. | CDN hit/miss, TTL, invalidation and account/edge configuration. Local edge caching is not emulated. |

References: [Angular local service-worker testing](https://angular.dev/ecosystem/service-workers/getting-started), [Angular version/update behavior](https://angular.dev/ecosystem/service-workers/devops), [Netlify local development](https://docs.netlify.com/api-and-cli-guides/cli-guides/local-development/), and [Netlify edge limitations](https://docs.netlify.com/build/edge-functions/limits/). Use a Deploy Preview for the final platform check; publishing is separate authorization.

## Preview response fixes — November 13, 2026

Verified on the later public preview: manifest MIME and direct missing-script 404 responses now pass. The active plan's [current summary](BUNDLE_OPTIMIZATION_PLAN.md#start-here) owns the latest deploy URL/status; [image-sizing history](BUNDLE_OPTIMIZATION_HISTORY.md#performance-follow-up--image-sizing-verified-on-preview-november-13-2026) retains the detailed evidence. The earlier immutable preview still has its original responses. Same-origin A/B rollout and per-request SSR remain unverified.

The first public preview exposed VERIFY-07/08. The local source now sets the exact `/manifest.webmanifest` response header to `application/manifest+json` in `netlify.toml`, using [Netlify's custom-header syntax](https://docs.netlify.com/manage/routing/headers/). This config applies to static files; it does not establish the deployed MIME until Netlify rebuilds the preview.

The installed adapter excludes existing browser-output files from its SSR handler. Unmatched `.js`/`.mjs` paths that do reach `src/server.ts` now return 404 before Angular's wildcard document redirect. Existing assets still use static serving; document routes and `/feed` retain their behavior. `npm run test:server` tests the actual compiled handler after `npm run build`; set `SERVER_TEST_BUILD_DIR` only when testing a different matching output directory. No server is published or started by this command.

The missing-script regression was observed red (302 versus expected 404), with three control tests passing. After the fix, all four compiled-handler tests and 14 HTTP-verifier fixtures pass, including both observed deployed failure patterns. Recheck the new preview's manifest MIME, a nonexistent script, an existing script and page/feed routes before closing these deployed issues. Local execution does not change the existing immutable preview.

## Maintained local production tests

Rollover/offline checks are now tracked under [tests/service-worker](../tests/service-worker/service-worker.test.mjs), rather than relying on the saved diagnostic harnesses. Run:

```powershell
npm run test:service-worker
```

This is a separate production-test command; `npm test` remains the fast Angular unit suite. Run the production tests for worker rules, lazy boundaries or reload-recovery changes. No manually started app, Netlify login, personal Chrome profile, Medium availability or deployment is required.

The suite includes startup-helper regressions, four HTTP-fixture tests and two real Chrome scenarios. Use the manifest's `test:browser-helper` command for startup-lock iteration without rebuilding the app. By default the production browser setup validates guidance, independently compiles optimized A/B builds (B uses named chunks to change actual module URLs), and checks generated manifests/content hashes. The browser process uses its own profile and an OS-assigned debugging port; each scenario gets an isolated context and loopback server on an assigned port. Storage stays intact within A→B. Tests reject actual old chunk 404s, prove full-document recovery/query/fragment preservation, and verify a second unavailable chunk cannot create a loop.

The ready-update scenario also checks rendered Medium 502/504 fallback text/link with no extra document navigation, lazy installation/caching, popup behavior, network-rendered no-JS HTML, cached font bytes/hash, and uncached pages/feed while the server destroys connections. Healthy cache checks precede the deliberate latest-version resource eviction/failure. The pending-update scenario explicitly confirms the worker sees no new manifest while B files are served; it does not depend on an idle-timer poll happening by chance.

| Optional environment variable | Purpose |
| --- | --- |
| `CHROME_BIN` | Chrome/Chromium executable if automatic Windows/macOS/Linux discovery is insufficient |
| `CACHE_TEST_OUTPUT_DIR` | Artifact parent directory; default is ignored `tmp/service-worker-tests`, with a unique `run-*` child per invocation |
| `CACHE_TEST_BUILD_A`, `CACHE_TEST_BUILD_B` | Set both to explicitly reuse application output directories containing `browser/` and `browser-stats.json`; otherwise both builds run |

Relative paths resolve from the repository root. Reuse builds only when they represent the current application code and have changed chunk URLs; this opt-in is for test-harness iteration, not proof of a fresh application build. `builds.json` records whether outputs were reused. Per-run logs, request/check reports and builds are retained; the owned Chrome profile is removed after its process stops. Failed assertions, setup, builds or cleanup produce a nonzero exit status. Interrupts/timeouts abort owned operations and cleanup closes only that run's contexts, browser process and fixture connections.

These tests exercise local static/prerendered output and fixture feed responses. They do not establish per-request SSR, real Medium availability, authenticated Netlify routes or CDN behavior. Saved earlier diagnostic artifacts remain historical evidence; the tracked command is the maintained local acceptance path.

November 11 validation: the final default build-and-test command passes **6/6** with no skipped/cancelled cases; explicit prebuilt-output iteration also passes **6/6**. Source review caught the missing rendered-visibility check and a held-manifest timing assumption; both were corrected before this final run. No website behavior changed in this promotion of diagnostic checks to maintained tests.

## Missing lazy-chunk recovery — November 11, 2026

The user authorized automatic recovery for unavailable lazy resources. **This applies to builds containing the handler.** New code cannot change a tab already running an older version without the handler; that tab needs manual reload to receive it.

The root router subscription sends only the latest navigation failure to a browser-guarded recovery service, also checking shared scroll ownership so a newer section/back-to-top action wins. Recognized native dynamic-import failures and ChunkLoadError trigger full navigation to the failed same-origin route, preserving query/fragment. For a same-path/query target, history state is preserved and `location.reload()` is used: native Chrome testing confirmed plain assignment can be fragment-only. API/data errors, ordinary fetch failures and unrelated application exceptions retain their normal handling.

The service writes a stable session-storage timestamp before leaving the page. It permits one attempt per document and no more than one per tab in five minutes. Known-offline/SSR calls do nothing; storage failure disables automatic recovery rather than permitting a loop. A persistently broken deployment can still require manual action after the bounded attempt. No worker `activateUpdate()` is called underneath running application code.

Local acceptance uses independently compiled recovery-aware A/B builds with different chunk URLs. Removing A's lazy bibliography chunk now causes a real new document to load B, preserving the requested query/fragment and rendering all 14 citations with Angular bootstrapped. It passes both after VERSION_READY and when the server deliberately continues serving A's worker manifest, so recovery does not require a ready worker update. Storage is preserved throughout each A→B rollout.

Following retirement of Works, the maintained suite warms the on-demand research popup and leaves the bibliography deferred. The negative case runs after healthy caching checks: open a fresh Research document with the same tab storage, evict only B's bibliography cache resource, then make that URL return 404. The persisted cooldown leaves Research intact without another automatic reload. This specifically tests a broken latest version; it is not a claim that worker caches remain available after Angular declares a version unrecoverable.

Final evidence: **87 unit tests**, **73 Chrome production browser regressions**, all compiler checks, **4 feed tests**, both production builds (11 routes each), cache-output checks and **37 HTTP comparisons** pass. The unchanged deployment verifier's 12 fixture tests passed in the preceding local-policy batch. Initial failures and review fixes are recorded in the active plan; isolated browser contexts avoid reusing/clearing active diagnostic cache storage. Artifacts are in the session's `chunk-recovery/` directory. No commit, push, deployment or private-preview access.

VERIFY-06 is locally resolved for future code containing this handler. Actual deployed recovery/headers/authenticated-browser verification remains VERIFY-01. The original no-handler failure and retention control below are historical evidence; old asset retention is optional mitigation for legacy tabs, not something this new handler requires for future lazy-route recovery.

## Local cache policy and real build rollover — November 11, 2026

The user requested implementing/verifying as much as possible locally. **Production builds now generate a worker; development builds do not.** `ngsw-config.json` adopts the tested policy: prefetch entry scripts/styles/manifest/CSR index, cache other JS chunks and `/assets/**` plus `/media/**` on demand, and leave all page navigations and `/feed` on the network. Unused Works/bibliography chunks remain absent from installation caches. Full offline pages are not supported or promised. This supersedes the November 9 candidate-only state below.

The manifest's `check:service-worker` command accepts a browser-output directory and checks actual files, navigation/data rules, script/font installation modes and every manifest content hash. It fails against the prior output missing `ngsw.json` and passes both new production builds: 8 application scripts, 2 generated fonts and 92 hashes. It does not prove browser update behavior by itself.

### Changed-asset A/B evidence and release limit

Built A with production defaults and B independently with `--named-chunks`, changing actual entry/chunk URLs and content hashes without changing the application's content. Both are optimized, prerender 11 routes and retain the unchanged budget warning (A 718.73 kB; test B 718.75 kB). This is stronger than the earlier manifest-only edit. Chrome 157 uses a fresh profile per scenario, with the same origin and preserved storage throughout each A→B rollout.

- Installation leaves Works and bibliography chunks deferred. Opening Works warms it and preserves modal focus/close behavior. Generated WOFF2 is cached on demand; feed is absent from Cache Storage.
- After switching to B, VERSION_READY occurs; full reload renders the new bibliography (14 records) and Works (2 projects). Controlled script-disabled Research receives its server HTML/title and 4 figures.
- **Original finding (before recovery was added):** an old A tab could use its warmed Works code, but previously unused bibliography navigation failed if B removed all old A chunks. The tab remained at Works. A full navigation/reload recovered. An otherwise identical control retaining the previous hashed JS/CSS files rendered all 14 citations without reloading. This is now handled for future versions as recorded above; no full prefetch was restored to hide it.
- The local server then destroys connections, and browser HTTP caching is disabled. Cached WOFF2 still returns 200/71,516 bytes; uncached feed returns the worker's transport-error 504, and page navigation is unavailable. These are the resource-only policy's expected offline outcomes, not an offline-site claim.

The original condition motivated the reload recovery now implemented above. Retaining old resources can still help legacy tabs without the handler; the retention control only preserves hashed JS/CSS, not changed unhashed assets. Do not assume the CDN retains earlier files or use `activateUpdate()` under running old code. Angular documents [old-version lazy-chunk failures and reload recovery](https://angular.dev/ecosystem/service-workers/communications). Local results do not establish Netlify's actual retention behavior.

At the earlier local-policy checkpoint, the HTTP verifier passed 37 requests including generated fonts/worker files, with a fixture feed. Application results were 73/73 Chrome, 71/71 unit, 12/12 deployment fixtures and 4/4 feed tests, plus compiler/build/output checks. Four deliberately broken policy variants were rejected. VERIFY-06 was then a failed rollout condition; the later recovery record above supersedes that status and unit count. No commit, push, live-site request or deployment occurred.

### Protected previews in your authenticated Chrome

The command-line HTTP verifier does not inherit Chrome's login and has no authentication support. For a private preview, log in and open its exact URL in your normal Chrome profile. No password/cookie transfer is needed for manual verification:

1. In DevTools Network, preserve the log and enable **Disable cache**. In Application → Service Workers, enable **Bypass for network** first. Refresh `/research`, `/publications` and `/work`; inspect document response HTML/title/content, worker/manifest status and MIME, scripts/fonts and `/feed` JSON. This isolates platform HTTP behavior from worker responses.
2. Turn **Bypass for network** off. Verify the worker scope/active version and control after reload. Inspect Cache Storage and Network requests to confirm unused lazy chunks are not installed, viewed resources are cached and `/feed` is not. The offline checkbox is useful interactively, but local acceptance used unavailable server transport so the worker could not accidentally reach it.
3. First verify the deployed source contains the new recovery handler. Keep that tab open across a later authorized A→B deploy and try both warmed and previously unopened lazy pages. Test reload recovery and inspect any missing old asset URL. Do not clear browser storage between versions. A legacy tab without the handler needs a manual reload; it cannot be repaired retroactively. This is the remaining VERIFY-01 platform check for recovery.
4. Record the immutable preview/deploy identity, statuses, response types, selected cache headers and observed behavior. Share those observations if needed; no cookies or unredacted authenticated network archive is required. Login/redirect HTML is not a passing app response.

At the earlier local-only checkpoint, the user reported disabled CI/CD. A public preview was subsequently built and inspected on November 13; see the active plan's public-preview checkpoint. A push alone does not establish a deployment's identity or passing platform checks. The authenticated-preview instructions above still apply when a future preview requires login.

## Service-worker investigation — November 9, 2026

**Historical November 9 state, superseded by the November 11 implementation above.** At investigation time the production configuration omitted `serviceWorker`; the installed application builder defaults it to false. `ServiceWorkerModule.register()` and `ngsw-config.json` cannot generate the missing files. An isolated build with `--service-worker ngsw-config.json` succeeded, emitting `ngsw-worker.js`/`ngsw.json` and prerendering 11 routes. Initial raw JS/CSS remained 718.73 kB, with the unchanged warning. No dependency upgrade was required.

The existing cache configuration needs review before enabling it:

- Its `/*.js` prefetch includes both Works/CDK and full bibliography chunks. The browser installation actually downloads them before visiting either route, defeating deferred download.
- The builder sets the worker's index to `/index.csr.html`, but the old config only caches `/index.html`. The CSR index has no manifest hash/cache entry. Online, controlled Research still gets its prerendered HTML; after physically stopping the local server, navigation fails. Do not claim that registration supplies an offline site.
- Generated fonts are under `/media/`, outside the old `/assets/**` and root-only image/font patterns. Neither generated font is covered.
- No `dataGroups` cache `/feed`. Keep that distinction explicit; asset caching and platform feed caching are separate policies.

Angular documents the [cache-group and navigation strategies](https://angular.dev/ecosystem/service-workers/config). Correctly caching the CSR shell with the default navigation strategy would allow the worker to substitute that shell for server-rendered route HTML; preserving the direct/refresh and no-JS contracts needs deliberate navigation rules.

### November 9 candidate (later adopted November 11)

The session artifact `sw-investigation/proposed-ngsw-config.json` is a concrete resource-cache proposal: prefetch entry scripts/CSS/manifest/CSR index, cache other chunks and `/assets/**` plus `/media/**` on demand, and set `navigationUrls: []`. Page navigations go to the network, preserving prerendered/SSR content and route metadata. `/feed` stays network-only. This does **not** provide offline pages; that would require a separate route-aware offline design.

Local Chrome evidence: Works/details absent from installation caches; an explicitly requested WOFF2 cached and later returned as 71,516 bytes with the server stopped; uncached `/feed`; script-disabled controlled Research retains its HTML/title; Works projects/modal/focus remain usable. With retained browser storage and the same origin, a manifest-only A→B update produces VERSION_READY, then reload selects the new version. This is worker protocol evidence, **not** two different application builds with changed chunks, CDN invalidation or a Netlify deployment test. Real asset-changing A/B rollout remains pending.

The first CDP offline simulation did not prevent the worker's own network access and was rejected as offline evidence. Final offline checks physically stopped the owned HTTP server and disabled browser HTTP caching. A font-cache assertion before a first controlled request was also corrected: on-demand assets enter the worker cache only after the worker handles a request, not merely because the first uncontrolled page displayed them.

### Local exported-handler evidence

A child-process probe supplied explicit localhost values for the adapter's allowed-host inputs, without wildcards or production settings changes. The built handler returns 200 with route titles for `/`, `/research`, `/publications` and `/work`; `/feed` returns a real upstream JSON array with HTTP 200. An unknown route returns 302 to `/404`. Route responses carry `ng-server-context="ssg"`: this exercises the executing handler serving prerendered output, **not** per-request Angular rendering. The old localhost rejection is explained by host configuration. The standalone command still has no HTTP listener because this entry exports a platform handler.

## Prepared deployment verification

For the remaining actual same-origin/source-identity check, follow [the manual branch-rollover procedure](NETLIFY_ROLLOVER_CHECK.md). The user chose that handoff instead of agent deployment access. Two immutable preview URLs remain insufficient evidence; the steps have not been executed by the agent.

This runbook was prepared during the earlier local-only batch. The November 13 public-preview evidence and response fixes are recorded above and in the active plan. Netlify account metadata and a same-origin A/B rollout remain unverified; use this procedure for the next preview without assuming the local fixes are already deployed.

1. When a preview is created separately, retain its immutable deploy URL, Netlify deploy ID, source commit, build log, build base/publish directories and generated Functions/Edge Functions list. Confirm the deployed artifact uses the intended commit and configuration. Local `.netlify/` state/generated configuration is not account evidence; root `netlify.toml` supplies the web-manifest MIME override.
2. Build that exact commit with the same lockfile/toolchain and build-time public environment, retaining its browser output. Run the manifest's `test:deployment` fixtures before the HTTP check.
3. Run the read-only comparison (replace placeholders; this command does not deploy):

   ```powershell
   npm run verify:deployment -- --url https://DEPLOY-ID--SITE.netlify.app --build-dir dist/my-app/browser --commit COMMIT-SHA --deploy-id DEPLOY-ID --out tmp/netlify-verification.json
   ```

   The probe compares all root-level prerendered pages' title/first rendered heading and script/style/preload references, exact JS/CSS/generated-font bodies, manifest bytes/icon availability, worker files if generated, `/feed`, missing-JS handling and redirects. It records two responses for one script plus selected cache/request headers. It refuses cross-origin redirects so it cannot silently test a different deploy. Identity arguments are **declared, not independently verified**; matching assets is additional evidence, not a replacement for Netlify deploy identity. It accepts a valid 502/504 feed error as the error contract and emits an upstream warning; successful live feed remains pending in that case.
4. With a fresh browser profile, verify section scrolling/path/metadata, standalone refreshes and no-JS HTML, mobile menu, lazy-route requests, popup keyboard/focus and real feed behavior. Compare worker-disabled and controlled sessions. If a worker is enabled, inspect its scope/active/controller, Cache Storage and requested chunks/fonts, then test a server-unavailable state. The candidate's offline pages are intentionally unavailable.
5. For updates, install application build A, keep the same origin/profile/storage, deploy asset-changing build B, detect/download the new version, then reload. Verify existing tabs, lazy `/publications`, the on-demand Research popup, font/image availability and feed. Confirm old tabs retain compatible assets or record failures; clearing storage would invalidate this test. The manifest-only local check does not close this item. The November 14 observed platform journey and its limits are in the [rollover record](NETLIFY_ROLLOVER_CHECK.md).
6. Record HTML, hashed-asset, `/ngsw-worker.js`, `/ngsw.json` and `/feed` headers/statuses on repeated requests and after build B. Check worker/manifest revalidation and HTML freshness, asset MIME/body identity, CDN hit/miss/age where reported, and actual invalidation. Don't infer TTL or SSR invocation from `Cache-Control` alone. For per-request SSR, identify a configured server-rendered route and correlate the request with Netlify runtime logs; existing SSG responses cannot establish that.

Local verifier evidence: 12 HTTP fixture tests cover valid builds, missing rendered content, stale JS/HTML references, omitted manifest settings, HTML worker/font/missing-asset fallbacks, cross-origin redirects, feed success/error semantics and absent/stale workers. All pass with localhost network access. The initial seven fixtures passed; a later sandbox-only run could not fetch localhost and was rerun successfully with network access. The scratch static preview's empty mock feed is **not** server/upstream evidence. The separate handler probe above supplies the local real-feed observation.

References: [Angular worker operations](https://angular.dev/ecosystem/service-workers/devops), [Netlify Angular integration](https://docs.netlify.com/build/frameworks/framework-setup-guides/angular/), [Netlify caching](https://docs.netlify.com/build/caching/caching-overview/). Production policy and guarded recovery are implemented locally. VERIFY-01 remains open for actual platform/browser rollout evidence and confirmation of deployed recovery.
