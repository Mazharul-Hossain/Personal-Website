/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/publications/publications.component.ts; baseline: src/app/publications/publication-inventory.fixture.ts */
import { PUBLICATION_BASELINE, SELECTED_PUBLICATION_BASELINE } from "../../src/app/publications/publication-inventory.fixture";

describe("Consolidated publication records", () => {
    for (const width of [1280, 390]) {
        it(`preserves the full bibliography on direct load and reload at ${width}px`, () => {
            cy.viewport(width, 900);
            cy.visit("/publications");
            cy.get("li[data-publication-id]").should("have.length", 14).each(($entry, index) => {
                const expected = PUBLICATION_BASELINE[index];
                expect($entry.attr("data-publication-id")).to.eq(expected.proposedId);
                expect($entry.text().replace(/\s+/g, " ").trim()).to.eq(expected.text);
                expect(Array.from($entry[0].querySelectorAll("a")).map(link => ({
                    label: link.textContent?.replace(/\s+/g, " ").trim(), url: link.getAttribute("href"), target: link.getAttribute("target")
                }))).to.deep.eq(expected.links);
            });
            cy.reload();
            cy.get("li[data-publication-id]").should("have.length", 14);
            cy.get("#home").should("not.exist");
        });
    }

    it("keeps homepage selection order and loads the lazy bibliography from its CTA", () => {
        cy.intercept("GET", "/feed", []);
        cy.visit("/");
        cy.get("#publications .publication-list h3 a").should("have.length", 5).each(($link, index) => {
            expect($link.attr("href")).to.eq(SELECTED_PUBLICATION_BASELINE[index].url);
            expect($link.text().trim()).to.eq(SELECTED_PUBLICATION_BASELINE[index].title);
        });
        cy.get(".research-study-links a[data-publication-id]").should("have.length", 7);
        cy.get(".publication-cta a").click();
        cy.location("pathname").should("eq", "/publications");
        cy.get("li[data-publication-id]").should("have.length", 14);
        cy.get("#home").should("not.exist");
    });

    it("includes the complete bibliography in the server response before client scripts run", () => {
        cy.request("/publications").then(response => {
            PUBLICATION_BASELINE.forEach(publication => {
                expect(response.body).to.include(`data-publication-id="${publication.proposedId}"`);
            });
        });
    });
});
