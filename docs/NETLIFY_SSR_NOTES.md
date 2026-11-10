# Netlify SSR and Express notes

- In commit `020c237` ("upgrade to SSR"), `src/server.ts` used Express to serve static files, render Angular with `CommonEngine`, and provide `/feed`. Express was needed by that implementation.
- Commit `46cedde` replaced that server with a Netlify `CommonEngine` handler. The current `src/server.ts` uses `AngularAppEngine` and `netlifyAppEngineHandler`; it handles `/feed` through `src/writing-feed.ts` and does not import Express.
- The installed `@netlify/angular-runtime` generates an Angular SSR Edge Function that imports `netlifyAppEngineHandler` from the built server. This generated function is separate from user-authored functions. Netlify's [Angular documentation](https://docs.netlify.com/build/frameworks/framework-setup-guides/angular/) describes automatic SSR configuration.
- Netlify's [functions documentation](https://docs.netlify.com/build/functions/configuration/) identifies `netlify/functions` under the site base directory as the default directory for user-authored functions. The directory can also be configured in the Netlify UI.
- This checkout has no `netlify/functions` directory, and its `netlify.toml` is empty. No files under `netlify/functions` appear in the locally available Git history. This does not establish what is configured or deployed in Netlify, in another repository, or in an earlier deploy whose source is unavailable locally.
- Before deploying dependency removals, inspect the Netlify project's current deploy and Functions/Edge Functions lists, build base directory, and functions directory. If any separately maintained function imports Express, verify how it obtains dependencies before removing Express from its package.
- The manifest's standalone server command was executed locally on November 8, 2026: it exits successfully without starting a listener. The exported handler's localhost route probe encounters the allowed-host guard; that is not a deployed rendering failure. See the [active plan's Phase 1 investigation evidence](BUNDLE_OPTIMIZATION_PLAN.md#remaining-phase-1-investigation-batch--november-8-2026) for the separate feed, prerender and caching results. A standalone listening adapter remains separate work if Node hosting is needed.

## Local checks and deployed evidence

Browser service-worker caching and Netlify edge/CDN caching are separate systems. The following is the verification method, not a claim that the still-missing worker or Netlify deployment checks have passed.

| Check | Local method | Evidence still requiring Netlify |
| --- | --- | --- |
| Worker generation | Build the production configuration and inspect actual worker/manifest output; verify their HTTP status and content types. The existing registration call and ngsw-config.json do not themselves generate files. | Actual deployed worker paths, scope and headers. |
| Browser caching | Serve production output on localhost, use a clean browser profile, verify activation/control after reload, then inspect Cache Storage and offline behavior. Verify the configured cache rules rather than assuming /feed is cached. | Deployment-specific URLs, headers and navigation fallback behavior. |
| Version updates | Install build A, retain browser state, serve build B on the same origin, then verify update detection, reload and compatible assets/lazy routes. Clearing storage between versions would bypass the update test. | Atomic deploy behavior and actual cached versions/assets through the CDN. |
| Rendered routes | Inspect direct/refresh HTTP responses before JavaScript executes. Static prerendered HTML proves prerendering; test a real executing server handler/render path before claiming per-request SSR. | Generated Netlify handler invocation, deploy identity and platform routing. |
| Feed | Exercise the real local handler and mocked success/failure/timeout tests; do not use the static preview's mocked empty feed as server evidence. | Live upstream behavior, headers and platform runtime. |
| Netlify integration | Netlify Dev can simulate the local framework/function/edge routing, redirects and headers with appropriate configuration. The current CLI command alone is not a listening adapter. | CDN hit/miss, TTL, invalidation and account/edge configuration. Local edge caching is not emulated. |

References: [Angular local service-worker testing](https://angular.dev/ecosystem/service-workers/getting-started), [Angular version/update behavior](https://angular.dev/ecosystem/service-workers/devops), [Netlify local development](https://docs.netlify.com/api-and-cli-guides/cli-guides/local-development/), and [Netlify edge limitations](https://docs.netlify.com/build/edge-functions/limits/). Use a Deploy Preview for the final platform check; publishing is separate authorization.
