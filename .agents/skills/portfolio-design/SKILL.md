---
name: portfolio-design
description: Use when designing or changing this portfolio's CSS, HTML layout, GUI, responsive behavior, visual hierarchy, accessibility or motion.
---

# Portfolio design and UX

Read [README contracts](../../../README.md#behavioral-contracts) and the [documentation index](../../../docs/README.md). Work within the actual design task: historical plans do not authorize rebuilding the site. Code paths are repository-root-relative.

## Give design a reason

Identify the visitor's goal, primary action and content hierarchy. Visitors should quickly understand the researcher, contributions and evidence, then reach publications or contact. Translate a request for a better GUI into coherent typography, whitespace rhythm, figure treatment, emphasis and navigation. The agent supplies CSS expertise; the user need not specify selectors.

Build on the moving-shape hero and research imagery. Make content-specific decisions rather than applying generic cards, gradients or ornamental animation everywhere. Repetition helps repeated content; vary composition where information hierarchy differs. Do not invent claims or metrics to fill space.

## Style ownership

Inspect `angular.json` and loaded `src/assets/css/style.css`; trace Bootstrap, theme rules and component selectors to understand the cascade. Empty component stylesheets do not imply all new styles belong globally.

| Concern | Owner |
| --- | --- |
| Repeated palette, typography, spacing, focus treatment | Shared theme/tokens |
| Visual primitive actually reused across features | Shared scoped pattern |
| Research grid, About skills layout, local loading state | Owning component CSS |
| Semantics and content order | Owning HTML/component |

When changing the visual system, establish meaningful CSS custom properties in the loaded theme and migrate touched common values. Keep feature-specific layouts beside the component. Do not create an unreferenced `src/styles.css`, edit only an unloaded minified copy, or mask cascade problems with broad selectors/`!important`. Avoid unrelated formatting churn.

## Interaction and enhancement

Use semantic headings, useful alt text, named buttons and visible focus. Popups need keyboard opening, a close control, Escape/backdrop dismissal and focus return. Fix overflow at its source; research previews must fit narrow viewports and keep their close control reachable.

Prefer CSS for responsive states and achievable motion. JS requires a documented capability gap, not habit. Pointer/device parallax and cancellable scrolling remain JS exceptions (MIG-05); do not remove them unilaterally. CSS reduced motion and JS-disabled browsing are distinct tests. Essential content/ordinary links should survive without JS; optional enhancements may be absent. Navbar no-JS compatibility is tracked under MIG-04.

## Render and judge

Compare desktop and mobile screenshots, including 360px, open menu, long titles, captions and loading/error states. Check focus, heading clearance, contrast, readability, diagram detail, document overflow and motion preferences. Use real content; reserve image space to prevent shifts. Keep attribution readable.

Deliver the rationale, before/after evidence and checks actually performed. If no browser is available, report visual QA as unverified. Common mistakes: calling source-only work polished or treating CSS reuse as permission to globalize feature styling.
