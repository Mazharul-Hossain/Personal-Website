/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/publications/publication-core.ts; lazy details: src/app/publications/publication-details.ts */
import { getPublication, PUBLICATIONS, publicationResource, SELECTED_PUBLICATION_IDS } from "./publication-core";
import type { PublicationId } from "./publication-core";
import { PUBLICATION_CATEGORIES, PUBLICATION_DETAILS } from "./publication-details";
import { PUBLICATION_BASELINE } from "./publication-inventory.fixture";

describe("Publication reference integrity", () => {
    it("covers the complete original inventory once, in the existing category order", () => {
        const ids = PUBLICATIONS.map(publication => publication.id);
        expect(ids).toEqual(PUBLICATION_BASELINE.map(publication => publication.proposedId));
        expect(new Set(ids).size).toBe(14);
        expect(Object.keys(PUBLICATION_DETAILS)).toEqual(ids);
        expect(PUBLICATION_CATEGORIES.map(category => category.id)).toEqual(["journal", "conference", "thesis"]);
        expect(PUBLICATION_CATEGORIES.map(category => PUBLICATIONS.filter(record => record.category === category.id).length))
            .toEqual([3, 8, 3]);
    });

    it("resolves every selected, title and full-citation resource reference", () => {
        expect(new Set(SELECTED_PUBLICATION_IDS).size).toBe(5);
        SELECTED_PUBLICATION_IDS.forEach(id => expect(getPublication(id).id).toBe(id));
        PUBLICATIONS.forEach(record => {
            const detail = PUBLICATION_DETAILS[record.id];
            expect(publicationResource(record.id, record.primaryResource)).toMatch(/^https?:\/\//);
            if (detail.titleResource) expect(publicationResource(record.id, detail.titleResource)).toMatch(/^https?:\/\//);
            if (detail.authorFormats) expect(detail.authorFormats.length).toBe(record.authors.length);
            detail.afterTitle.forEach(part => {
                if (part.kind === "resource") expect(publicationResource(record.id, part.resource)).toMatch(/^https?:\/\//);
            });
        });
    });

    it("fails explicitly for invalid IDs or absent resources instead of rendering undefined links", () => {
        expect(() => getPublication("missing" as PublicationId)).toThrowError("Unknown publication: missing");
        expect(() => publicationResource("upigan-2023", "slides"))
            .toThrowError("Publication upigan-2023 has no slides resource");
    });
});
