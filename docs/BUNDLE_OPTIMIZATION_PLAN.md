# Bundle Optimization Plan

## Goal

Reduce the initial raw bundle from approximately 1.01 MB while preserving SSR, accessibility, and the current visual behavior. Measure every phase with `npm run build -- --stats-json`; do not raise the warning budget to hide regressions.

## Baseline

- Global CSS: 394 kB raw
- Application JavaScript: 378 kB raw
- Legacy global scripts: 204 kB raw
- Polyfills: 35 kB raw
- Estimated initial transfer: 208 kB

Record these values and relevant Lighthouse/Web Vitals results before implementation.

## Phase 1 — Remove legacy global JavaScript

Audit every entry in `angular.json > build.options.scripts`. Replace jQuery navigation, scrolling, visibility, and counter behavior with Angular, CSS, and `IntersectionObserver`. Remove Bootstrap JavaScript/Popper if no interactive Bootstrap widgets remain. Remove Modernizr and parallax when feature checks and decorative animation are no longer required.

Expected result: eliminate most of the 204 kB `scripts` bundle. Verify mobile navigation, scrolling, counters, hydration, and reduced-motion behavior.

## Phase 2 — Reduce global CSS

Inventory selectors used from Bootstrap, `retainable.css`, `default.css`, `style.css`, and LineIcons. Prefer component-scoped styles. Either compile only required Bootstrap Sass modules or replace the grid/utilities with a small project-specific layout system. Replace the icon font with the small set of inline SVG icons actually used.

Expected result: remove 150–250 kB raw CSS without visual regressions. Compare desktop/mobile screenshots and run contrast/focus checks.

## Phase 3 — Remove CDK Overlay

Replace the Works image overlay with an accessible native `<dialog>` or a small Angular modal. Then remove `@angular/cdk` and `overlay-prebuilt.css` if no other feature uses them.

Expected result: remove roughly 36 kB of overlay code plus portal and CSS overhead. Verify Escape, backdrop close, focus management, and keyboard return.

## Phase 4 — Route and content splitting

Lazy-load secondary pages, starting with the full `/publications` bibliography. Keep only selected records on the homepage. Consider lazy-loading blog/feed functionality and other below-the-fold features after SSR and discoverability checks.

Expected result: keep large route-specific templates out of the initial application chunk.

## Phase 5 — Asset and delivery cleanup

Compress research imagery, generate responsive WebP/AVIF variants, set intrinsic dimensions, and remove unused duplicate assets. Self-host the required font subsets or use a system-font stack. Review service-worker caching after filenames and routes stabilize.

## Acceptance Criteria

- `npm run build`, unit tests, and Cypress pass after every phase.
- Nine prerendered routes and Netlify SSR behavior remain intact.
- No accessibility or responsive-layout regression.
- Initial raw bundle decreases after every merged phase.
- Target the existing 500 kB warning budget incrementally; do not change it until measurements justify a stricter threshold.
