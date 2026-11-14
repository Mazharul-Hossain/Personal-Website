/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/STYLESHEET_REFINEMENT_PLAN.md
Implementation: src/app/app-routing.module.ts; src/app/page-not-found/page-not-found.component.ts */
export {};

describe('Retired portfolio pages', () => {
    for (const path of ['/work', '/service']) {
        it(`sends ${path} to the existing not-found page`, () => {
            cy.intercept('GET', '/feed', []);
            cy.visit(path);
            cy.location('pathname').should('eq', '/404');
            cy.get('#page-not-found').should('be.visible');
            cy.get('app-works, app-services').should('not.exist');
        });
    }
});
