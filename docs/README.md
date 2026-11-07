# Documentation authority and active work

Shared policy and contracts live in [README](../README.md); agent routing lives in [AGENTS](../AGENTS.md). Current explicit user decisions supersede historical proposals. Configuration facts come from manifests, not old plan prose.

## Document status

| Document | Status / scope |
| --- | --- |
| [BUNDLE_OPTIMIZATION_PLAN.md](BUNDLE_OPTIMIZATION_PLAN.md) | **Active implementation plan and bug register.** Reliability, content consolidation, performance and agent-readiness work. Add defects here rather than creating competing plans. |
| [PORTFOLIO_CV_CONTENT_REVIEW_PLAN.md](PORTFOLIO_CV_CONTENT_REVIEW_PLAN.md) | Editorial handoff/reference. Evidence/privacy rules remain relevant; its old inventory is not a current verified content snapshot or implementation authority. |
| [HOMEPAGE_REDESIGN_PLAN.md](HOMEPAGE_REDESIGN_PLAN.md) | Historical/superseded proposal. Do not restore its layout, six-paper selection, CV download or no-parallax proposals. |
| [NETLIFY_SSR_NOTES.md](NETLIFY_SSR_NOTES.md) | Deployment investigation notes; unverified server/account behavior remains unverified until observed. |

Agent-readiness implementation is recorded within the active plan. Historical proposals do not authorize a UI redesign. Future visual work follows README contracts and its actual task brief.

## Content ownership and migration

**Governing rule:** reusable structured facts are stored once in typed TypeScript records; HTML presents them. There is no application database. TypeScript is authoritative for migrated records; legacy HTML remains the inventory to preserve until migration, not permission to discard details.

| Content | Current source / consumer | Work |
| --- | --- | --- |
| Selected publications | `src/app/publications/selected-publications.component.ts` → sibling HTML | MIG-01: selected IDs reference shared records |
| Full bibliography, theses, categories, complete citations | `src/app/publications/publications.component.html` | MIG-01: inventory and migrate; keep details in lazy feature |
| Research studies, figures, paper links | `src/app/home/selected-research/selected-research.component.ts` → sibling HTML | MIG-01: reuse stable publication IDs/links |
| Employment | `src/app/home/research-journey/research-journey.component.ts` → sibling HTML | Existing typed source; verify facts against evidence |
| Recognition, biography, skills, static introductions | Research-journey/About and section HTML | MIG-06: extract reusable structured facts when editing; narrative presentation may remain in HTML |
| Hero and section order | `src/app/index-page/index-page.component.html` | Composition is presentation, not a second structured store |
| Writing | `src/writing-feed.ts` → `blogs.component.ts` view records → HTML | External feed is the source; do not copy articles manually |
| Metadata | `src/app/shared/page-metadata.service.ts`, initial `src/index.html` | MIG-06: keep shared identity/profile facts consistent |

For MIG-01, inventory every citation, introduce stable IDs and an ordered selected-ID list, keep full details behind the lazy feature, and render templates from records. Check citation completeness, author formatting, categories/order, selections, research links and initial/lazy bundle sizes. Sharing a title must not load the entire bibliography on the homepage.

Until consolidation lands, check all affected current locations for a publication correction and register unresolved differences. Do not introduce a third record or declare the migration finished while citations remain independently maintained in HTML.

## File guidance conventions

Authored TS/JS, Angular HTML and CSS have a short `@agent` header naming skills, policy and related controller/template/style files. Paths are repository-root-relative. Update relationships when files move. Headers route reading rather than redefine policy.

The manifest guidance check validates local links/header targets, component ownership pointers, simple skill frontmatter, strict mode and TODO register IDs. It runs before the production build. Runtime contract compliance still requires behavior tests and rendered review.

Native JSON, XML, lockfiles, generated files, vendor assets and binary/media files are covered by README's source map and build entries. Do not insert invalid comments or agent instructions into third-party/minified assets or generated output.

Skills are repository-local in `.agents/skills/<name>/SKILL.md`, following [official Codex discovery guidance](https://learn.chatgpt.com/docs/build-skills). They are not installed globally. AGENTS links allow direct reading even before a session refreshes its skill catalog.
