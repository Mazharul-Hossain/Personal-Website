# Mazharul Hossain — Personal Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/3b24fe33-de72-4b5d-8129-3b8005b34d4b/deploy-status)](https://app.netlify.com/sites/stoic-lamport-e2ed9d/deploys)

The Angular portfolio at [hmazharul.com](https://www.hmazharul.com/) presents research, publications, experience and writing. It uses NgModules, server rendering, hydration and Netlify hosting.

## Run locally

Use a Node release supported by the installed Angular toolchain, then:

```sh
npm ci
npm start
```

Use the address printed by the CLI. Available scripts and dependencies are defined in [package.json](package.json); run `npm run` to list commands.

## Configuration

[angular.json](angular.json) owns build inputs and budgets; [tsconfig.json](tsconfig.json) owns compiler settings. Deployment headers are in [netlify.toml](netlify.toml), worker caching rules in [ngsw-config.json](ngsw-config.json), and routes in [app-routing.module.ts](src/app/app-routing.module.ts). The lockfile pins dependency versions.

<a id="development-and-verification"></a>

## Documentation

- [Plans and issue ownership](docs/README.md)
- [Project/content map, ownership and synchronization rules](CONTENT_MAP.md)
- [Plan template and mandatory refactoring pre-test gate](docs/PLAN_TEMPLATE.md)
- [Agent instructions and repository skills](AGENTS.md)

Development steps, test selection, prerequisites, execution results and remaining work belong in the owning plan. Use its verification section for the changes being reviewed.

## Behavioral contracts

These are stable acceptance requirements. Intentional changes must update the contract and its regression coverage together; verification evidence belongs in the owning plan.

| ID | Required behavior |
| --- | --- |
| NAV-01 | Homepage section navigation scrolls and changes the visible path while retaining homepage composition and metadata. |
| NAV-02 | Direct requests/refreshes open standalone pages. Keep `/home` as the homepage alias, `/publications` lazy, and `/blog` available; retired `/work` and `/service` use `/404`. |
| NAV-03 | Preserve seven navigation items, mobile controls, active indication, heading clearance and back-to-top. The latest navigation/scroll action wins. |
| NAV-04 | Keep ordinary navbar destinations and native modifier/new-tab behavior. Enhance primary clicks with existing scrolling/routing; navigation remains usable without JS. |
| UI-01 | Preserve the moving hero and approved animated interactions. |
| UI-02 | Research images open attributed, accessible modals with keyboard controls, dismissal, focus trapping/return and teardown. Load popup code on demand; figures remain readable without JS. |
| MOTION-01 | Prefer CSS; explain necessary JS enhancements. Optional effects may be absent without JS. |
| MOTION-02 | Keep server-rendered content and ordinary links usable without JS. Verify reduced motion separately from disabled scripting. |
| CONTENT-01 | Structured facts have one TypeScript authority. Preserve citation details, authors, ordering, research links and lazy bibliography boundaries. |
| CONTENT-02 | Preserve writing fallbacks, LinkedIn-first contact, attribution and privacy. Do not publish a CV download or private contact details. |
| RENDER-01 | Support SSR/hydration, guard browser APIs and clean up owned listeners, timers, subscriptions, overlays and animations. |
| CACHE-01 | Cache entry assets and on-demand resources without prefetching unused popup/bibliography chunks. Pages and `/feed` remain network-only; full offline browsing is not promised. |
| CACHE-02 | Recognized lazy-chunk failures may reload the requested same-origin page, preserving query/fragment. Popup imports share the guard and offer the original image if recovery is unavailable. Limit recovery to once per document and once per tab in five minutes; disable it when offline or storage is blocked. Ordinary data errors must not reload. Existing tabs without recovery code need manual reload. |

## Engineering and design policy

Keep TypeScript’s full `strict` mode enabled and use patterns supported by the installed toolchain. **Reuse shared visual rules, keep feature-specific layout local, and explain necessary exceptions.** Follow [agent guidance](AGENTS.md) and the relevant [repository skills](.agents/skills/) for implementation conventions.

<a id="local-and-netlify-verification"></a>

## Deployment and verification

Netlify deployment must preserve the behavioral contracts above. The owning plan defines the applicable checks; a successful local build does not prove deployed behavior.

Verify the actual deployment URL and source identity, direct routes/refreshes, rendered content, `/feed`, assets and cache behavior. Cache/update changes require controlled old-tab checks across builds on the same origin. Record unverified conditions explicitly. See [Netlify verification notes](docs/NETLIFY_SSR_NOTES.md) for procedures and platform limits.

Publishing or changing live settings requires authorization. Prioritize a readable, accessible, reliable portfolio; Lighthouse is diagnostic evidence, not a release-score target.
