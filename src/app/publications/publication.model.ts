/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Consumers: src/app/publications/publication-core.ts; src/app/publications/publication-details.ts */
export type PublicationCategory = "journal" | "conference" | "thesis";
export type PublicationResource = "manuscript" | "publisher" | "doi" | "slides" | "archive";

export interface PublicationCore {
    readonly id: string;
    readonly category: PublicationCategory;
    readonly title: string;
    readonly year: number;
    readonly authors: readonly string[];
    readonly venue: string;
    /** A distinct abbreviated view label, only when different from the full venue. */
    readonly shortVenue?: string;
    readonly resources: Readonly<Partial<Record<PublicationResource, string>>>;
    readonly primaryResource: PublicationResource;
}

export type AuthorFormat = "initial-first" | "surname-first" | "surname-first-no-period";

/** Plain text and typed references, never HTML or a second copy of core facts. */
export type CitationPart =
    | { readonly kind: "text"; readonly text: string }
    | { readonly kind: "venue"; readonly italic: boolean }
    | { readonly kind: "year" }
    | { readonly kind: "resource"; readonly resource: PublicationResource; readonly label: string; readonly newTab?: boolean };

export interface PublicationDetail {
    readonly authorFormats?: readonly AuthorFormat[];
    readonly lastAuthorSeparator?: string;
    readonly beforeTitle: string;
    readonly titleResource?: PublicationResource;
    readonly afterTitle: readonly CitationPart[];
}
