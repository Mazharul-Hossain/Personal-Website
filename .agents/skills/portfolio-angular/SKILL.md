---
name: portfolio-angular
description: Use when editing or reviewing this portfolio's Angular components, TypeScript, template behavior, JavaScript integrations, routing, SSR or browser abstractions.
---

# Portfolio Angular engineering

Read [README](../../../README.md) for toolchain authorities, contracts and verification, and the [documentation index](../../../docs/README.md) for active work/content ownership. Code paths here are repository-root-relative. The manifest and lockfile determine installed versions; this is modern Angular, not AngularJS.

## Trace before editing

Follow the component's `templateUrl`/`styleUrl(s)`, module declarations, route and adjacent spec. For inline page wrappers, inspect `src/app/home/standalone-pages.component.ts`. Global build style/script order is in `angular.json`. Keep `@agent` reading pointers accurate after moves.

Use full strict TypeScript, typed DI and strict Angular templates. Prefer APIs supported by the installed framework; consult current official Angular/TypeScript documentation for unfamiliar or changed APIs. Preserve the NgModule architecture unless architecture migration is requested. Do not introduce standalone conversion or dependency upgrades during unrelated work.

## Browser and lifecycle boundaries

Use injected `WindowRef` and return early when its `nativeWindow()` is unavailable. Use injected `DOCUMENT` for document access. New browser work belongs after browser availability and view readiness; do not initialize plugins during server rendering. Type abstractions rather than using `any`. Narrow external data at the boundary; type assertions and definite-assignment assertions require an actual lifecycle guarantee.

Example for browser work in a service or component (imports from Angular core/common and the repository's shared token):

```typescript
private readonly windowRef = inject(WindowRef);
private readonly document = inject(DOCUMENT);

focusResearchHeading(): void {
    if (!this.windowRef.nativeWindow()) return;
    this.document.querySelector<HTMLElement>("#research-heading")?.focus();
}
```

Retain unlisten callbacks, cancel timers/frames, dispose overlays and unsubscribe on teardown. Use lifecycle-bound RxJS cleanup where appropriate. Never fix a type error by disabling strictness; explain a deferred boundary with a categorized TODO and owning-plan ID.

## Fragile behavior

Before touching navigation, read README NAV contracts and the [presentation/interaction plan](../../../docs/STYLESHEET_REFINEMENT_PLAN.md), which links the historical navigation investigation. Homepage path replacement is intentionally different from router navigation; reload changes the page composition. Preserve homepage metadata during section scrolling. Browser/document ownership is covered by MIG-02 regressions; retain those boundaries without silently rewriting navigation behavior.

Prefer CSS motion under MOTION contracts. Existing parallax and cancellable scrolling are documented JS enhancements (MIG-05); optional effects may disappear without JS. Preserve them until an equivalent CSS implementation is demonstrated. Navbar anchors retain ordinary destinations and modifier-safe JS enhancement (MIG-04); preserve both enhanced and no-JS journeys.

Use typed TS records for structured content; see the content skill for migration. Do not import the full bibliography into the eager app to eliminate a duplicated field.

## Finish

Run relevant manifest typechecks; use production build and affected behavior tests for runtime changes. Report remaining exceptions by ID. Common mistakes: treating `strict` as runtime validation, changing router semantics during cleanup, assuming every asset file is loaded, or declaring SSR safe after checking only in a browser.
