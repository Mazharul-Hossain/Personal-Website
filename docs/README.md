# Documentation authority and active work

Shared policy and contracts live in [README](../README.md); agent routing lives in [AGENTS](../AGENTS.md). Current explicit user decisions supersede historical proposals. Configuration facts come from manifests, not old plan prose.

## Document status

| Document | Status / scope |
| --- | --- |
| [PLAN_TEMPLATE.md](PLAN_TEMPLATE.md) | Reusable implementation-plan skeleton and mandatory refactoring/migration pre-test gate. A template, not an active project plan. |
| [PERFORMANCE_CLOSEOUT_REPORT.md](PERFORMANCE_CLOSEOUT_REPORT.md) | Bounded analytics/application investigation evidence. Records measurement limits and the decision to leave production behavior unchanged. |
| [NETLIFY_ROLLOVER_CHECK.md](NETLIFY_ROLLOVER_CHECK.md) | Requested manual source-identity and same-origin rollout procedure. Execution/results are still pending; it does not authorize production publication. |
| [BUNDLE_OPTIMIZATION_PLAN.md](BUNDLE_OPTIMIZATION_PLAN.md) | **Active closeout plan and bug register.** Read its short next-action list first; add defects here rather than creating competing plans. |
| [BUNDLE_OPTIMIZATION_HISTORY.md](BUNDLE_OPTIMIZATION_HISTORY.md) | Historical implementation/investigation evidence. Dated checkpoints do not override current statuses or authorize new work. Consult only the records relevant to the task. |
| [STYLESHEET_REFINEMENT_PLAN.md](STYLESHEET_REFINEMENT_PLAN.md) | Visual proposal and sample for DESIGN-01. Reuse the existing theme with scoped navy/white contrast and fewer boxed sections. Implementation awaits approval. |
| [PORTFOLIO_CV_CONTENT_REVIEW_PLAN.md](PORTFOLIO_CV_CONTENT_REVIEW_PLAN.md) | Editorial handoff/reference. Evidence/privacy rules remain relevant; its old inventory is not a current verified content snapshot or implementation authority. |
| [HOMEPAGE_REDESIGN_PLAN.md](HOMEPAGE_REDESIGN_PLAN.md) | Historical/superseded proposal. Do not restore its layout, six-paper selection, CV download or no-parallax proposals. |
| [NETLIFY_SSR_NOTES.md](NETLIFY_SSR_NOTES.md) | Deployment investigation notes; unverified server/account behavior remains unverified until observed. |

Agent-readiness implementation is recorded within the active plan. Historical proposals do not authorize a UI redesign. Future visual work follows README contracts and its actual task brief.

## Content ownership and migration

**Governing rule:** reusable structured facts are stored once in typed TypeScript records; HTML presents them. There is no application database. Publication templates now render a shared core and lazy citation details. Test fixtures freeze the pre-migration expectations; they are not application content sources.

| Content | Current source / consumer | Work |
| --- | --- | --- |
| Shared publication facts, resource URLs and ordered selected IDs | [publication-core.ts](../src/app/publications/publication-core.ts) | One authority for all 14 records; selected component resolves IDs and derives its view |
| Full bibliography/thesis citation details and category labels | [publication-details.ts](../src/app/publications/publication-details.ts) → full component → HTML | Runtime details are imported only by the lazy bibliography feature |
| Research studies and figures | `src/app/home/selected-research/selected-research.component.ts` → sibling HTML | Seven paper links and figure publication facts resolve shared records; arXiv association remains CONTENT-ARXIV |
| Employment | `src/app/home/research-journey/research-journey.component.ts` → sibling HTML | Existing typed source; verify facts against evidence |
| Recognition, biography, skills, static introductions | Research-journey/About and section HTML | MIG-06: extract reusable structured facts when editing; narrative presentation may remain in HTML |
| Hero and section order | `src/app/index-page/index-page.component.html` | Composition is presentation, not a second structured store |
| Writing | `src/writing-feed.ts` → `blogs.component.ts` view records → HTML | External feed is the source; do not copy articles manually |
| Metadata | `src/app/shared/page-metadata.service.ts`, initial `src/index.html` | MIG-06: keep shared identity/profile facts consistent |

### Maintaining publications

Edit shared titles, ordered authors, years, venues and semantic resources in the core. `shortVenue` is an intentional abbreviated presentation label only when it differs from the full venue. The core's array order defines entry order within categories; `SELECTED_PUBLICATION_IDS` defines homepage order. Do not sort either implicitly.

Edit citation-specific text, author presentation, category labels and title-link choices in lazy details. Citation parts reference shared year/venue/resources and contain plain text, never stored HTML or a second title/author list. Core author names use initial-first form; the bibliography formatter preserves each original citation's name presentation. Preserve full citation details and alternate manuscript/publisher/DOI/slides/archive targets. A missing ID/resource fails explicitly rather than producing an undefined href.

Research paper links use `publicationLink(id, resource, label)`; figure citations derive shared publication facts while keeping their figure-specific explanation, attribution and rights text. Do not attach the existing arXiv link to a record until its relationship is verified. Never import citation details (directly or through a barrel/provider) into homepage/research code. Import model types with `import type`.

For a changed publication, update only its authoritative records and verify every consuming view. Update frozen test expectations only for intentional editorial changes, not merely to make a regression pass. For additions, include the core record, matching details, any intentional selected/research references, and coverage. Verify category/selection order, complete citations, author shortening, resources, research attribution and initial/lazy bundles.

## File guidance conventions

Authored TS/JS, Angular HTML and CSS have a short `@agent` header naming skills, policy and related controller/template/style files. Paths are repository-root-relative. Update relationships when files move. Headers route reading rather than redefine policy.

The manifest guidance check validates local links/header targets, component ownership pointers, simple skill frontmatter, strict mode and TODO register IDs. It runs before the production build. Runtime contract compliance still requires behavior tests and rendered review.

Native JSON, XML, lockfiles, generated files, vendor assets and binary/media files are covered by README's source map and build entries. Do not insert invalid comments or agent instructions into third-party/minified assets or generated output.

Skills are repository-local in `.agents/skills/<name>/SKILL.md`, following [official Codex discovery guidance](https://learn.chatgpt.com/docs/build-skills). They are not installed globally. AGENTS links allow direct reading even before a session refreshes its skill catalog.
