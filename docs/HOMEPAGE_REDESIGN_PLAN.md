# Homepage Research-First Redesign Plan

## Objective and positioning

Rebuild the homepage around one memorable message: **Mazhar develops reliable AI methods for computational imaging under physical and distribution shifts.** The primary audience is research-scientist, applied-scientist, scientific-ML, computational-imaging, biomedical-AI, and academic visitors. Engineering ability should support this identity rather than compete with it.

The target page order is:

1. Navigation
2. Hero
3. Research thesis and three pillars
4. Selected research (three case studies)
5. Current research at NCI/NIH
6. Selected publications
7. Research journey
8. Recognition
9. About
10. Selected writing
11. Optional compact methods/tools strip
12. Contact
13. Footer

Remove generic “My Expertise,” skill percentages, Map901/personal-site cards, empty address/phone fields, and the publication disclaimer from the homepage. Preserve complete publication/legal material on `/publications`.

## Current-state map

- `src/app/index-page/index-page.component.html` owns the hero and composes the homepage in the outdated order: publications → expertise → projects → blogs → about → contact.
- `src/app/nav-bar/` owns navigation and custom scroll behavior; its current IDs are `home`, `publications`, `service`, `work`, `blog`, `about`, and `contact`.
- `src/app/publications/` is a static full bibliography and also serves `/publications`.
- `src/app/services/` contains generic expertise; `src/app/works/` contains two legacy projects.
- `src/app/about-me/` contains stale doctoral/job-search copy and percentage animations.
- `src/app/contact-me/` and `src/app/nav-footer/` contain the old contact/footer treatment.
- Most visual rules come from `src/assets/css/style.css`; component CSS files are mostly empty. Do not have multiple contributors edit that global file concurrently.
- Routes are defined in both `app-routing.module.ts` and `app.module.ts`; consolidate them during integration.

## Content contract: resolve before visual implementation

Create `src/app/home/home-content.ts` and `src/app/home/home-content.types.ts` as the single source of homepage copy, links, dates, and image paths. Components should render typed data instead of embedding long biographies or citation lists in templates.

The owner must verify these facts with Mazhar before merge:

- Exact current title, NCI/NIH unit wording, and start date.
- Completed Ph.D. title, graduation date, dissertation title, and permanent URL.
- Final 2026 publication citations, author order, status, DOI/PDF/code links, and which six publications are selected.
- Approved quantitative results for each case study; never invent metrics.
- What unpublished NIH work may be described publicly.
- Current CV PDF, email presentation, award names/dates, and all social URLs.
- Rights/permission for paper figures and whether UIdeck attribution may be removed.

Use provisional copy from the evaluation only behind clearly marked `TODO(content-verification)` comments. Do not ship those markers.

## Section implementation specifications

### 1. Navigation and hero

Update `nav-bar` to show the text brand “Mazharul Hossain” and links `Research`, `Publications`, `Experience`, `About`, `CV`, and `Contact`. Use real fragment links and preserve keyboard/mobile behavior. Make CV an outlined button.

Build the hero in a new `src/app/home/hero/` component. Use a 60/40 responsive layout with:

- Eyebrow: “Hello, I’m Mazharul Hossain.”
- H1: “AI Researcher in Computational Imaging & Scientific Machine Learning.”
- Mission: robust, generalizable, physics-informed ML for scientific and biomedical imaging.
- Context: verified NCI/NIH position.
- CTAs: `Explore My Research` and `View CV`.
- Quiet links: Google Scholar, GitHub, LinkedIn.

Prefer a professional portrait or an original research montage (hyperspectral data → model → scientific reconstruction). Do not use generic AI imagery or decorative parallax. Supply descriptive alt text and explicit image dimensions.

### 2. Research thesis

Create `src/app/home/research-overview/` with `id="research"`. Lead with the reliability question from the evaluation, then a 2–3 sentence research-program summary and three cards:

- Robust & Generalizable ML
- Computational Imaging
- Biomedical & Scientific AI

Each card gets a one-sentence purpose and compact method labels. Avoid a word cloud.

### 3. Selected research

Create `src/app/home/selected-research/` with three data-driven case studies. Every story follows **problem → method → evidence → links**, with an authentic research figure:

1. **Robust Learning Across Sensors and Scenes** — GE-AD/GMoE-AD and domain-generalized hyperspectral anomaly detection.
2. **Physics-Informed Learning for Computational Imaging** — USR/UPIGAN and measurement-aware microscopy reconstruction.
3. **Adapting Vision Models to Changing Acquisition Conditions** — UAV hyperspectral segmentation under domain/task shift.

The first story may span the full width; the other two may form a two-column row. Each needs a result statement, accessible figure caption, and only verified Paper/Code/Project links.

### 4. Current research

Create `src/app/home/current-research/` as a visually distinct but restrained section. Identify the verified NCI/NIH unit, “Computational Imaging for Structural Biology,” a public-safe summary, and interest chips for Cryo-EM, inverse problems, reconstruction, and physics-informed ML. Present it as direction, not completed work.

### 5. Publications and experience

Create `src/app/home/selected-publications/` that renders five or six typed records ordered by narrative importance, not automatically by date. Include year, title, venue, author context, and available Paper/PDF/Code/Slides links plus `View all publications → /publications`.

#### Selecting and updating the short publication list

Treat the homepage list as an editorial selection, not a citation-count ranking or a copy of the six newest papers. The current selection is provisional: the repository does not contain enough verified information about 2026 publications, citation counts, current research priorities, or Mazhar's contribution to each work to finalize it confidently.

Before changing the list, collect one authoritative publication inventory with:

- Complete citation, publication status, DOI, year, venue, and public links.
- Current Google Scholar citation count and retrieval date.
- Mazhar's role and contribution, including first/co-first/corresponding authorship where applicable.
- Available code, datasets, figures, talks, awards, press, or demonstrated adoption.
- A short note explaining how the work supports the current computational-imaging research narrative.
- Any confidentiality, embargo, preprint, or figure-rights restrictions.

Score candidates using the following priorities, in order:

1. **Research alignment:** supports robust/generalizable ML, computational imaging, physics-informed inverse problems, or biomedical/scientific AI.
2. **Trajectory coverage:** helps visitors understand the progression from microscopy reconstruction through hyperspectral robustness to current biomedical imaging.
3. **Contribution strength:** clearly demonstrates Mazhar's intellectual or technical ownership.
4. **Evidence:** strong result, respected venue, citations relative to publication age, reuse, award, code, or other verifiable impact.
5. **Recency:** favors current work when bibliographically public, but does not displace a foundational paper solely because it is newer.
6. **Visitor clarity:** the problem and contribution can be understood in one concise title/venue entry.

Aim for a balanced six-paper set rather than six papers from one topic. A useful target is two robust/generalizable hyperspectral works, two physics-informed or computational-imaging works, one domain-adaptation/segmentation work, and one current or bridging scientific-AI work. This is a balance guideline, not a predetermined selection.

Mazhar must approve the final six and their order. Record the reason for each selection in a non-public content note. Review the list whenever a paper is accepted, a substantial citation/adoption milestone occurs, the target audience changes, or at least every six months. Update the typed homepage records and `/publications` inventory together, then verify every external link and rerun component and Cypress tests.

Refactor `src/app/publications/` into the complete bibliography page, update the dissertation record and 2026 works, and move its copyright notice below the list in a compact disclosure.

Create `src/app/home/research-journey/` as a short accessible timeline: NCI/NIH → Ph.D., University of Memphis → Neuron23 (plus earlier entries only when they clarify the research trajectory). Add a small Recognition subsection for verified, meaningful items only.

### 6. About and selected writing

Rewrite `about-me` to a 120–170 word research biography beside a photo. Remove `about-skills.ts`, percentage UI, CounterUp imports, PMP from the headline, stale doctoral language, and job-seeking copy. If retained, show methods/tools as factual labels near the bottom.

Keep Blogs as part of the website and redesign it as a compact **Selected writing** section after About. Preserve the existing blog content and `/blog` route; do not delete either during homepage cleanup. Show two or three recent or research-relevant posts with title, date, short summary, and a clear `View all writing → /blog` link. Load remote feed data progressively so a slow or unavailable feed does not block the homepage, and provide an accessible empty/error state. Blogs may move out of the primary navigation to keep the research focus, but they must remain discoverable from the homepage and footer.

### 7. Contact and footer

Rewrite `contact-me` as “Let’s Connect,” with one collaboration sentence and Email, LinkedIn, Scholar, and GitHub links. Simplify `nav-footer` to `© 2026 Mazharul Hossain` and the same core links. Remove template attribution only after license verification.

## Parallel work packages and ownership

Agents should claim one package and avoid files owned by another package.

| Package | Exclusive files | Deliverable | Depends on |
| --- | --- | --- | --- |
| A — Content/data | `src/app/home/home-content*` | Verified typed content, links, image manifest | User fact confirmation |
| B — Shell/hero | `nav-bar/*`, `home/hero/*` | Responsive nav, hero, fragments | A fields/schema |
| C — Research story | `home/research-overview/*`, `home/selected-research/*`, `home/current-research/*` | Research narrative and case studies | A and approved figures |
| D — Evidence | `home/selected-publications/*`, `home/research-journey/*`, `publications/*` | Selected/full publications, timeline, recognition | A and verified citations |
| E — Personal/writing/contact | `about-me/*`, `blogs/*`, `contact-me/*`, `nav-footer/*` | Short bio, selected writing, collaboration CTA, minimal footer | A, feed behavior, and license decision |
| F — Integration/design/QA | `index-page/*`, `app.module.ts`, routing files, `src/styles.css`, tests | Assemble sections, tokens, routing cleanup, regression checks | B–E complete |

Package F alone should change composition, route declarations, and global design tokens. Feature owners keep styles in their component CSS. New components must be declared in `app.module.ts` by the integrator to prevent merge conflicts.

## Integration sequence

1. Freeze the content schema and collect missing facts/assets.
2. Package A lands typed content with no fabricated metrics or citations.
3. Packages B–E build independently against that schema and include focused specs.
4. Package F declares components, replaces homepage composition, removes unused legacy sections, and consolidates routing into `app-routing.module.ts`.
5. Apply a restrained design system: high-contrast neutral background, one research-oriented accent color, consistent spacing/type scales, visible focus states, and reduced-motion support. Avoid template animations and inline styles.
6. Optimize figures to WebP/AVIF where useful, retain source/permission notes outside the public bundle, and prevent layout shift.
7. Update page title, one accurate meta description, canonical/social metadata, sitemap, and structured data only after content is final.

## Acceptance and verification

- First viewport clearly answers who Mazhar is, what he studies, and why it matters.
- Homepage order matches this plan and contains no stale doctoral/internship language, skill percentages, generic expertise, or legal wall.
- Existing blog content and the `/blog` route remain available; selected writing is discoverable from both the homepage and footer even if it is omitted from primary navigation.
- All fragments, CTAs, external links, `/publications`, CV, mobile menu, and back navigation work with SSR/hydration.
- Heading order is logical; images have useful alt text; controls are keyboard accessible; focus is visible; color contrast meets WCAG AA; reduced motion is respected.
- No claims, dates, affiliations, metrics, citations, or asset rights remain unverified.
- Run `npm run build`, `npm test -- --watch=false --browsers=ChromeHeadless`, and `npm run cypress:run` with the app available at `http://localhost:4200`.
- Add Cypress assertions for section order, primary CTAs, navigation fragments, mobile menu, and the publications route. Add component tests for typed rendering and missing optional links.
- Compare desktop and mobile screenshots and check the production bundle budgets before merge.

## Definition of done

The redesign is complete when a visitor can scan the page and infer the trajectory **physics-aware microscopy → robust/generalizable hyperspectral ML → biomedical computational imaging**, while every visible research claim is verifiable and the Angular production, unit, and E2E checks pass.
