# Portfolio–CV/Resume Content Review Plan

Prepared: October 31, 2026

## Handoff to the CV/resume agent

You maintain Mazharul Hossain's latest CV and resume information. Review his portfolio against those records and produce corrected, publication-ready website copy. This is an editorial and factual review, not a software implementation plan. Edit the proposed content in a review document; do not modify application code, CSS, templates, dependencies, or the CV/resume itself as part of this task.

Use the latest local portfolio content, including uncommitted edits. The deployed website may be older. 

Deliver the result in `docs/PORTFOLIO_CV_CONTENT_REVIEW.md`. If you cannot access this repository, return the same document as Markdown for the website agent to save. Do not claim to have inspected files or sources you cannot access. Do not commit, push, or publish anything.

## Editorial direction already approved by Mazhar

Preserve the current design and moving-shape hero. Give each area a distinct purpose:

| Area | Purpose | Content boundary |
| --- | --- | --- |
| Hero | Attract visitors and invite them to continue | Name, concise professional identity, short highlight, and existing call to action. |
| My Research and Selected Research | Explain the research and demonstrate contributions | A brief introduction, research themes, then case studies with problem, method, evidence, figures, and links. Avoid repeating the same positioning slogan. |
| Publications | Support the research with a scholarly record | Keep Publications as its own navigation item. Preserve five homepage selections unless you explicitly recommend and justify a change; review the full bibliography too. |
| Experience | Explain employment | Organization, official job title, dates, responsibilities, and contributions within each role. A degree is not a job. |
| About Me | Provide the fuller personal and educational background | Biography, education, skills, interests, and personal context Mazhar wants public. Avoid repeating detailed project results or job descriptions. |

Writing remains a separate section after About; Contact follows Writing. Keep the current navigation order. Contact is LinkedIn-first: do not add email, phone numbers, or a home address from the CV. No Recognition section is requested, but report recognition if found. Do not add awards or personal interests to fill space.

The earlier `HOMEPAGE_REDESIGN_PLAN.md` and `codex/homepage-redesign-review` branch contain superseded proposals. They are historical context, not authority to restore an older layout or biography.

Mazhar explicitly chose Map901 as the third case study instead of UAV segmentation. Preserve that selection. He deliberately excludes a public CV/resume download for privacy; do not recommend or add one. This does not prevent automated extraction of information already public on the site.

## 1. Establish the source of truth

- [ ] Identify the exact CV/resume versions and dates used, plus any newer facts Mazhar explicitly supplied to you. Use the review date when interpreting “current.”
- [ ] Check for differences between the CV, targeted resumes, and your maintained records. A shortened resume is not evidence that an omitted role, degree, or paper no longer exists.
- [ ] Prefer Mazhar's latest explicit correction for a specific fact. Otherwise reconcile the most recent maintained records; do not silently resolve conflicting dates, titles, or publication status.
- [ ] Record evidence for every factual correction: document name/version and section or page, or the date/context of an explicit user confirmation. If needed, use public primary sources for citation details and links, not to invent personal responsibilities.
- [ ] Separate factual accuracy from public disclosure. CV access does not imply that private contact details, unpublished work, internal metrics, collaborators' information, or confidential employer projects may appear online.

When a fact is missing or conflicting, retain an explicit `TODO:<ADD TRUE DETAILS>` with a specific question. Never fill gaps with plausible duties, inflated titles, inferred dates, or invented metrics.

## 2. Read the current portfolio

These are reading locations, not an instruction to edit source code:

| Content | Repository location |
| --- | --- |
| Hero and section order | `src/app/index-page/index-page.component.html` |
| Research introduction and themes | `src/app/home/research-overview/research-overview.component.html` |
| Research case-study copy, figures, and links | `src/app/home/selected-research/selected-research.component.ts` |
| Homepage publication selection | `src/app/publications/selected-publications.component.ts` |
| Complete bibliography, dissertation, and thesis | `src/app/publications/publications.component.html` |
| Experience records | `src/app/home/research-journey/research-journey.component.ts` |
| Biography and skills | `src/app/about-me/about-me.component.html` |
| Writing introduction | `src/app/blogs/blogs.component.html` |
| Contact and footer | `src/app/contact-me/contact-me.component.html`, `src/app/nav-footer/nav-footer.component.html` |
| Page metadata | `src/index.html` |

The Experience component still has “research-journey” in its filename. Its public purpose is now employment history. Do not propose renaming or restructuring components.

## 3. Reconcile facts and prepare replacement copy

- [ ] **Hero:** verify the professional identity is current and supported. Keep it brief and readable; do not turn it into a condensed CV.
- [ ] **Research:** verify ownership, contribution, methods, datasets, quantitative results, limitations, and publication status for each case study. Distinguish individual work from team work. Keep supported detail already on the page; do not weaken it solely because a short resume omits it.
- [ ] **Figures:** resolve the explicit `TODO:<ADD TRUE DETAILS>` captions for the GMoE-AD and GE-AD graphical abstracts, UPIGAN block diagram, and Map901 banner. Supply a short explanatory caption and exact source/figure citation; confirm required attribution and reuse permission. Improve alt descriptions only from the actual figure or verified records. Do not assume authorship grants unrestricted figure reuse. Keep unknown permissions flagged.
- [ ] **Publications:** reconcile titles, author order, venues, years, status, DOI/public links, dissertation, and thesis. Distinguish published work from accepted, submitted, and preprint work. Keep selected and full records consistent. Recommend selection changes separately with a reason.
- [ ] **Experience:** prepare one entry per actual appointment, with official title, organization/unit, month/year dates, and a concise description of duties and supported contributions. Explain overlapping appointments rather than inventing a sequential timeline.
- [ ] **About:** verify degree names, institutions, dates if included, biography, and skills. Keep education here and employment duties in Experience. Include personal details only when Mazhar supplied them and wants them public.
- [ ] **Writing, contact, footer, and metadata:** flag stale identity, affiliation, profile links, or dates. Preserve existing blog content and LinkedIn-first contact preferences. Do not remove template attribution without verified licensing information.

### Known Experience gaps to prioritize

These reflect the website draft when this plan was written, not independently verified CV facts:

| Entry | Current draft | Needed from your records |
| --- | --- | --- |
| NCI/NIH | Visiting Fellow; computational cryo-electron microscopy | Confirm current status, official title/unit, start date, public-safe responsibilities, and contributions. |
| University of Memphis | Graduate Assistant | Confirm official appointment title(s), department, employment dates, and actual research/teaching/other duties. Do not substitute Ph.D. dates for employment dates. |
| Neuron23 | Intern, May 2022–August 2022 | Mazhar explicitly supplied the organization, internship, and dates. Add the confirmed official title, team, responsibilities, and public contributions; flag any conflict with your records. |

Review other roles present in the CV for relevance. Recommend additions with rationale rather than automatically transferring every CV line to the homepage.

## 4. Deliver a reviewable content document

The deliverable should contain:

1. **Sources used:** versions, dates, and any unavailable sources or unresolved conflicts.
2. **Discrepancy table:** portfolio section, existing claim, correction, evidence, and status (`verified`, `needs confirmation`, or `not approved for public use`).
3. **Ready-to-use replacement copy:** grouped by existing website section. Provide exact proposed wording for changed content, including complete Experience entries. Identify unchanged sections explicitly. This is the revised content for the website agent to apply later, not code or a patch.
4. **Questions for Mazhar:** only missing facts or disclosure choices that your existing records cannot resolve. Attach each question to its `TODO:<ADD TRUE DETAILS>` marker.
5. **Optional recommendations:** clearly separate editorial suggestions, additional roles, and publication selection changes from factual corrections.

## 5. Final editorial checks

- [ ] Each factual addition has a traceable source; no duties, metrics, awards, dates, interests, or job titles were inferred.
- [ ] Hero attracts attention; Research explains contributions; Publications supports them; Experience describes jobs; About supplies biography and education.
- [ ] Repeated slogans and repeated project summaries are removed without stripping useful facts.
- [ ] Dates, titles, affiliations, publication status, and naming are consistent across all proposed copy.
- [ ] Unknowns remain searchable as `TODO:<ADD TRUE DETAILS>`; private or unapproved information stays out of publishable text.
- [ ] The document preserves Mazhar's voice and the existing design, and gives the website agent concrete copy to apply without guessing.

Completion means delivering the reconciled content document and its unresolved questions. Website implementation, testing, commits, and deployment belong to a separate follow-up with the website agent.
