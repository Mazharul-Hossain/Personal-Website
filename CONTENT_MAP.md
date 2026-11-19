# Project and content map

This map owns file responsibilities and content synchronization rules. Use the [documentation index](docs/README.md) for plan status and [README](README.md#behavioral-contracts) for product contracts.

## Project map

| Location | Responsibility |
| --- | --- |
| `src/app/` | Components, services, templates, styles, adjacent specs |
| `src/app/index-page/` | Homepage composition and hero |
| `src/app/home/standalone-pages.component.ts` | Route wrappers reusing homepage sections |
| `src/app/shared/` | Browser abstraction, metadata, scroll animation |
| `tests/service-worker/` | Maintained Node/Chrome production A/B, cache, recovery, offline and feed-fallback tests |
| `src/app/publications/` | Selected records and lazy-loaded bibliography |
| `src/app/shared/image-popup.ts` | On-demand CDK popup controller; Selected Research owns its template and lifecycle |
| `src/assets/` | Theme CSS, vendor scripts, fonts, images, attribution-bearing assets |
| `src/main.ts`, `src/main.server.ts`, `src/server.ts` | Browser/server bootstrap and Netlify request handling |
| `src/writing-feed.ts` | Server-side RSS integration |

For open content migrations such as MIG-06 and CONTENT-ARXIV, consult the [owning register](docs/BUNDLE_OPTIMIZATION_PLAN.md); this map describes sources, not task completion.

## Content ownership and migration

**Governing rule:** reusable structured facts are stored once in typed TypeScript records; HTML presents them. There is no application database. Publication templates now render a shared core and lazy citation details. Test fixtures freeze the pre-migration expectations; they are not application content sources.

| Content | Current source / consumer | Work |
| --- | --- | --- |
| Shared publication facts, resource URLs and ordered selected IDs | [publication-core.ts](src/app/publications/publication-core.ts) | One authority for all 14 records; selected component resolves IDs and derives its view |
| Full bibliography/thesis citation details and category labels | [publication-details.ts](src/app/publications/publication-details.ts) → full component → HTML | Runtime details are imported only by the lazy bibliography feature |
| Research studies and figures | `src/app/home/selected-research/selected-research.component.ts` → sibling HTML | Seven paper links and figure publication facts resolve shared records; SIMPLE software evidence and its conceptual SVG with an attributed reference-volume image remain distinct from publications/results; arXiv association remains CONTENT-ARXIV |
| Employment | `src/app/home/research-journey/research-journey.component.ts` → sibling HTML | Existing typed source; verify facts against evidence |
| Recognition, biography, skills, static introductions | Research-journey/About and section HTML | MIG-06: extract reusable structured facts when editing; narrative presentation may remain in HTML |
| Hero/footer social profiles | [social-profiles.ts](src/app/shared/social-profiles.ts) → hero/footer component properties → templates | One typed source for the six profile labels, URLs and icons; hero keeps its existing five, footer adds Medium. |
| Hero and section order | `src/app/index-page/index-page.component.html` | Composition is presentation, not a second structured store |
| Writing | `src/writing-feed.ts` → `blogs.component.ts` view records → HTML | External feed is the source; do not copy articles manually |
| Metadata | `src/app/shared/page-metadata.service.ts`, initial `src/index.html` | MIG-06: keep shared identity/profile facts consistent |

### Maintaining publications

Edit shared titles, ordered authors, years, venues and semantic resources in the core. `shortVenue` is an intentional abbreviated presentation label only when it differs from the full venue. The core's array order defines entry order within categories; `SELECTED_PUBLICATION_IDS` defines homepage order. Do not sort either implicitly.

Edit citation-specific text, author presentation, category labels and title-link choices in lazy details. Citation parts reference shared year/venue/resources and contain plain text, never stored HTML or a second title/author list. Core author names use initial-first form; the bibliography formatter preserves each original citation's name presentation. Preserve full citation details and alternate manuscript/publisher/DOI/slides/archive targets. A missing ID/resource fails explicitly rather than producing an undefined href.

Research paper links use `publicationLink(id, resource, label)`; figure citations derive shared publication facts while keeping their figure-specific explanation, attribution and rights text. Do not attach the existing arXiv link to a record until its relationship is verified. Never import citation details (directly or through a barrel/provider) into homepage/research code. Import model types with `import type`.

For a changed publication, update only its authoritative records and verify every consuming view. Update frozen test expectations only for intentional editorial changes, not merely to make a regression pass. For additions, include the core record, matching details, any intentional selected/research references, and coverage. Verify category/selection order, complete citations, author shortening, resources, research attribution and initial/lazy bundles.
