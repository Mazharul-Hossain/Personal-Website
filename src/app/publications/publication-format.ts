/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Consumers: src/app/publications/selected-publications.component.ts; src/app/publications/publications.component.ts */
import type { AuthorFormat } from "./publication.model";

export const OWNER_AUTHOR = "M. Hossain";

export function formatPublicationAuthor(name: string, format: AuthorFormat = "initial-first"): string {
    if (format === "initial-first") return name;
    const split = name.lastIndexOf(" ");
    if (split < 0) return name;
    const initials = name.slice(0, split);
    return `${name.slice(split + 1)}, ${format === "surname-first-no-period" ? initials.replace(/\.$/, "") : initials}`;
}

export function formatSelectedAuthors(authors: readonly string[]): string {
    const position = authors.indexOf(OWNER_AUTHOR);
    if (position < 0) return authors.join(", ");
    if (position === 0) return authors.length > 1 ? `${OWNER_AUTHOR} et al.` : OWNER_AUTHOR;
    const preceding = position > 1 ? `${authors[0]}, …` : authors[0];
    const following = position < authors.length - 1 ? " et al." : "";
    return `${preceding}, ${OWNER_AUTHOR}${following}`;
}
