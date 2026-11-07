# Agent instructions

Read [README.md](README.md) first: it owns shared project guidance, source-of-truth links, behavioral contracts, and verification requirements. Read [docs/README.md](docs/README.md) to find the active plan before editing. Do not copy versions, commands, or product policies into this file.

## Load relevant skills

Repository skills live in `.agents/skills/`. Read the actual `SKILL.md` before applying it; file comments are routing hints, not substitutes.

| Task | Required skill |
| --- | --- |
| Angular, TypeScript, HTML behavior, JS integration, SSR | [portfolio-angular](.agents/skills/portfolio-angular/SKILL.md) |
| CSS, layout, GUI, responsive design, accessibility, motion | [portfolio-design](.agents/skills/portfolio-design/SKILL.md) |
| Publications, research, biography, experience, figures | [portfolio-content](.agents/skills/portfolio-content/SKILL.md) |
| Tests, performance, production checks, Netlify verification | [portfolio-verification](.agents/skills/portfolio-verification/SKILL.md) |

Load only relevant skills; a visual component change usually needs engineering, design, and verification.

## Execution rules

- Treat README behavioral contracts as mandatory acceptance criteria. Explain a requested contract change and update its regression coverage with the implementation. Do not silently normalize unusual behavior.
- Check Git status first and preserve unrelated user edits. Do not commit, push, publish, or change live Netlify settings unless requested.
- Trace templates to their component, content source, and loaded styles before editing. Maintain `@agent` comments when relationships change; paths are repository-root-relative.
- Register new bugs in the active plan with evidence and status. Add categorized TODOs at owning code boundaries for deferred work, following README. Do not turn discovery into an unrelated refactor.
- Run the manifest guidance check when changing skills, documentation, file ownership or reading pointers; runtime contract enforcement still needs the relevant behavior tests.
- Prefer patterns supported by the installed toolchain. Consult current official Angular/TypeScript documentation for unfamiliar or changed APIs; do not upgrade dependencies merely to satisfy the word "latest".
- Report changes, checks actually run, failures/limits, and tracked remaining work. Distinguish source inspection, local execution, and deployed evidence.
